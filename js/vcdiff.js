/* Matrix Old Games — decodificador VCDIFF (RFC 3284), o formato gerado pelo xdelta3.
   Aplica um patch .xdelta lendo o arquivo original em blocos, sem carregar o jogo inteiro na memória.
   Suporta: janelas VCD_SOURCE, checksum adler32 do xdelta3 e cabeçalho de aplicação.
   Não suporta: compressão secundária (gere o patch com "xdelta3 -S none") e janelas VCD_TARGET.

   Uso:
     MOGVcdiff.aplicar(patchU8, fonte, destino, { aoProgredir: fn(bytesGerados) })
       fonte:   { size, read(offset, len) -> Promise<Uint8Array> }
       destino: { write(u8) -> Promise }                                   */
(function (raiz) {
  "use strict";

  var NOOP = 0, ADD = 1, RUN = 2, COPY = 3;

  function tabelaPadrao() {
    var t = [], s, m, a;
    t.push([RUN, 0, 0, NOOP, 0, 0]);
    t.push([ADD, 0, 0, NOOP, 0, 0]);
    for (s = 1; s <= 17; s++) t.push([ADD, s, 0, NOOP, 0, 0]);
    for (m = 0; m < 9; m++) {
      t.push([COPY, 0, m, NOOP, 0, 0]);
      for (s = 4; s <= 18; s++) t.push([COPY, s, m, NOOP, 0, 0]);
    }
    for (m = 0; m < 6; m++) for (a = 1; a <= 4; a++) for (s = 4; s <= 6; s++) t.push([ADD, a, 0, COPY, s, m]);
    for (m = 6; m < 9; m++) for (a = 1; a <= 4; a++) t.push([ADD, a, 0, COPY, 4, m]);
    for (m = 0; m < 9; m++) t.push([COPY, 4, m, ADD, 1, 0]);
    if (t.length !== 256) throw new Error("tabela de códigos inválida");
    return t;
  }
  var TABELA = tabelaPadrao();

  function ErroPatch(msg, codigo) { var e = new Error(msg); e.codigo = codigo; return e; }

  function adler32(u8) {
    var a = 1, b = 0, i = 0, n = u8.length;
    while (n > 0) {
      var t = n < 5552 ? n : 5552;
      n -= t;
      while (t--) { a += u8[i++]; b += a; }
      a %= 65521; b %= 65521;
    }
    return ((b * 65536) + a) >>> 0;
  }

  function lerCabecalho(d) {
    if (d.length < 5 || d[0] !== 0xD6 || d[1] !== 0xC3 || d[2] !== 0xC4 || d[3] !== 0)
      throw ErroPatch("O arquivo de patch não é um xdelta válido.", "formato");
    var st = { p: 5 }, ind = d[4];
    if (ind & 1) throw ErroPatch("Patch com compressão secundária. Gere de novo com: xdelta3 -S none", "secundaria");
    if (ind & 2) throw ErroPatch("Patch com tabela de códigos própria, não suportado.", "tabela");
    if (ind & 4) { var n = lerInt(d, st); st.p += n; }
    return st.p;
  }

  function lerInt(d, st) {
    var v = 0, b;
    do {
      if (st.p >= d.length) throw ErroPatch("Patch incompleto ou corrompido.", "corrompido");
      b = d[st.p++];
      v = v * 128 + (b & 127);
    } while (b & 128);
    return v;
  }

  async function aplicar(d, fonte, destino, opcoes) {
    opcoes = opcoes || {};
    var conferir = opcoes.conferir !== false;
    var aoProgredir = opcoes.aoProgredir || function () {};
    var st = { p: lerCabecalho(d) };
    var gerados = 0, janela = 0;

    while (st.p < d.length) {
      var wi = d[st.p++];
      var srcLen = 0, srcPos = 0;
      if (wi & 1) { srcLen = lerInt(d, st); srcPos = lerInt(d, st); }
      else if (wi & 2) throw ErroPatch("Patch com janela VCD_TARGET, não suportado.", "target");
      if (srcPos + srcLen > fonte.size) throw ErroPatch("O arquivo original é menor do que o patch espera. A versão do jogo não confere.", "versao");

      lerInt(d, st);                       // tamanho da codificação (não precisamos)
      var tgtLen = lerInt(d, st);
      var di = d[st.p++];
      if (di) throw ErroPatch("Patch com compressão secundária. Gere de novo com: xdelta3 -S none", "secundaria");
      var dataLen = lerInt(d, st), instLen = lerInt(d, st), addrLen = lerInt(d, st);
      var esperado = null;
      if (wi & 4) { esperado = ((d[st.p] * 16777216) + (d[st.p + 1] << 16) + (d[st.p + 2] << 8) + d[st.p + 3]) >>> 0; st.p += 4; }

      var dp = st.p, ip = dp + dataLen, ap = ip + instLen, fim = ap + addrLen;
      var fimInst = ap;
      st.p = fim;
      if (fim > d.length) throw ErroPatch("Patch incompleto ou corrompido.", "corrompido");

      var out = new Uint8Array(tgtLen), tpos = 0;
      var near = [0, 0, 0, 0], prox = 0, same = new Float64Array(768);
      var si = { p: ip }, sa = { p: ap };

      while (si.p < fimInst) {
        var e = TABELA[d[si.p++]];
        for (var h = 0; h < 2; h++) {
          var tipo = e[h * 3], tam = e[h * 3 + 1], modo = e[h * 3 + 2];
          if (tipo === NOOP) continue;
          if (tam === 0) tam = lerInt(d, si);
          if (tpos + tam > tgtLen) throw ErroPatch("Patch corrompido (janela maior que o esperado).", "corrompido");

          if (tipo === ADD) {
            out.set(d.subarray(dp, dp + tam), tpos); dp += tam; tpos += tam;
          } else if (tipo === RUN) {
            out.fill(d[dp++], tpos, tpos + tam); tpos += tam;
          } else { // COPY
            var aqui = srcLen + tpos, end;
            if (modo === 0) end = lerInt(d, sa);
            else if (modo === 1) end = aqui - lerInt(d, sa);
            else if (modo < 6) end = near[modo - 2] + lerInt(d, sa);
            else end = same[(modo - 6) * 256 + d[sa.p++]];
            near[prox] = end; prox = (prox + 1) & 3; same[end % 768] = end;

            var resto = tam;
            if (end < srcLen) {
              var n = Math.min(resto, srcLen - end);
              out.set(await fonte.read(srcPos + end, n), tpos);
              tpos += n; resto -= n; end = srcLen;
            }
            if (resto > 0) {
              var t0 = end - srcLen;
              if (t0 + resto <= tpos) { out.copyWithin(tpos, t0, t0 + resto); tpos += resto; }
              else { for (var k = 0; k < resto; k++) out[tpos++] = out[t0 + k]; }
            }
          }
        }
      }
      if (tpos !== tgtLen) throw ErroPatch("Patch corrompido (janela incompleta).", "corrompido");
      if (conferir && esperado !== null && adler32(out) !== esperado)
        throw ErroPatch("A conferência falhou na parte " + (janela + 1) + ". O arquivo original não é a versão certa ou está danificado.", "checksum");

      await destino.write(out);
      gerados += tgtLen; janela++;
      aoProgredir(gerados);
    }
    return gerados;
  }

  /* Fonte que lê um File/Blob do navegador em blocos de 4 MB, com cache pequeno. */
  function FonteBlob(blob) {
    var BS = 4 * 1024 * 1024, cache = new Map(), ordem = [];
    async function bloco(i) {
      if (cache.has(i)) return cache.get(i);
      var b = new Uint8Array(await blob.slice(i * BS, Math.min(blob.size, (i + 1) * BS)).arrayBuffer());
      cache.set(i, b); ordem.push(i);
      if (ordem.length > 6) cache.delete(ordem.shift());
      return b;
    }
    return {
      size: blob.size,
      read: async function (off, len) {
        if (len > BS) return new Uint8Array(await blob.slice(off, off + len).arrayBuffer());
        var out = new Uint8Array(len), p = 0;
        while (p < len) {
          var o = off + p, i = Math.floor(o / BS), b = await bloco(i), s = o - i * BS, n = Math.min(len - p, b.length - s);
          if (n <= 0) throw ErroPatch("Leitura fora do arquivo original.", "versao");
          if (n === len) return b.subarray(s, s + n);
          out.set(b.subarray(s, s + n), p); p += n;
        }
        return out;
      }
    };
  }

  var api = { aplicar: aplicar, adler32: adler32, FonteBlob: FonteBlob };
  if (typeof module === "object" && module.exports) module.exports = api;
  else raiz.MOGVcdiff = api;
})(typeof self !== "undefined" ? self : this);
