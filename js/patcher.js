/* Matrix Old Games — patcher online.
   O jogo do visitante é lido e traduzido aqui no navegador. Nenhum arquivo é enviado para servidor algum.
   Configuração de cada disco: campo "patcher" do disco em js/dados.js. */
(function () {
  "use strict";
  var raiz = document.querySelector("[data-patcher]");
  if (!raiz || !window.MOG || !window.MOGVcdiff) return;
  var D = window.MOG, V = window.MOGVcdiff;
  var $ = function (s) { return raiz.querySelector(s); };
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var MB = 1024 * 1024;
  var pausa = function () { return new Promise(function (r) { setTimeout(r, 0); }); };
  var fmt = function (b) { return b >= 1024 * MB ? (b / 1024 / MB).toFixed(2).replace(".", ",") + " GB" : b >= MB ? Math.round(b / MB) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB"; };

  /* ---------- discos disponíveis ---------- */
  var opcoes = [];
  D.traducoes.forEach(function (j) {
    j.discos.forEach(function (d) { if (d.patcher) opcoes.push({ jogo: j, disco: d }); });
  });
  var sel = $("[data-p-disco]");
  if (!opcoes.length) { raiz.innerHTML = '<p class="muted">Nenhum disco disponível no patcher online ainda.</p>'; return; }
  sel.innerHTML = opcoes.map(function (o, i) {
    return '<option value="' + i + '">' + esc(o.jogo.titulo) + " · " + esc(o.disco.nome) + " · v" + esc(o.disco.versao) + " (" + esc(o.jogo.plataforma) + ")</option>";
  }).join("");
  var porUrl = new URLSearchParams(location.search).get("jogo");
  var discoUrl = new URLSearchParams(location.search).get("disco");
  if (porUrl) opcoes.forEach(function (o, i) {
    if (o.jogo.id !== porUrl) return;
    var bate = discoUrl == null || String(o.jogo.discos.indexOf(o.disco) + 1) === discoUrl;
    if (bate && !sel.dataset.ok) { sel.value = String(i); sel.dataset.ok = "1"; }
  });

  var estado = { arquivos: null, faixas: null, patches: null, ocupado: false };
  function atual() { return opcoes[+sel.value]; }

  /* ---------- etapas / mensagens ---------- */
  var etapas = $("[data-p-etapas]"), barra = $("[data-p-barra]"), barraTxt = $("[data-p-barra-txt]"), msg = $("[data-p-msg]");
  var btnGerar = $("[data-p-gerar]"), fim = document.querySelector("[data-p-fim]"), zona = $("[data-p-zona]");

  function mensagem(tipo, html) { msg.className = "p-msg p-msg--" + tipo; msg.innerHTML = html; msg.hidden = !html; }
  function progresso(frac, txt) {
    barra.closest(".p-progresso").hidden = frac == null;
    if (frac != null) { barra.style.width = Math.max(0, Math.min(100, frac * 100)).toFixed(1) + "%"; barraTxt.textContent = txt || ""; }
  }
  function listaFaixas(linhas) {
    etapas.innerHTML = linhas.map(function (l) {
      return '<li class="p-faixa p-faixa--' + l.estado + '"><span class="mono">' + esc(l.nome) + "</span><span>" + esc(l.txt) + "</span></li>";
    }).join("");
    etapas.hidden = !linhas.length;
  }
  function reiniciar() {
    estado.arquivos = estado.faixas = null; btnGerar.disabled = true; fim.hidden = true; fim.innerHTML = "";
    listaFaixas([]); progresso(null); mensagem("", "");
  }
  sel.addEventListener("change", reiniciar);

  /* ---------- versão compacta: faixas de dados 2352 → .iso 2048 (como o GDI Shrink) ----------
     Cada setor de dados do GD-ROM tem 2352 bytes: 16 de cabeçalho, 2048 de dados e 288 de
     correção de erro (EDC/ECC), que só o disco físico usa. O .iso guarda só os 2048 de dados.
     Nenhum setor é removido e os LBAs do disc.gdi continuam os mesmos. */
  var chkCompacto = $("[data-p-compacto]"), economia = $("[data-p-economia]");
  function planoCompacto(cfg) {
    var plano = {};
    cfg.gdi.trim().split(/\r?\n/).slice(1).forEach(function (l) {
      var c = l.trim().split(/\s+/);
      if (c.length >= 5 && c[2] === "4" && c[3] === "2352") plano[c[4]] = c[4].replace(/\.[^.]+$/, "") + ".iso";
    });
    return plano;
  }
  function gdiCompacto(cfg) {
    var plano = planoCompacto(cfg);
    return cfg.gdi.trim().split(/\r?\n/).map(function (l, i) {
      var c = l.trim().split(/\s+/);
      if (i === 0 || !plano[c[4]]) return l.trim();
      c[3] = "2048"; c[4] = plano[c[4]];
      return c.join(" ");
    }).join("\n") + "\n";
  }
  function atualizarEconomia() {
    var o = atual(); if (!o || !economia) return;
    var plano = planoCompacto(o.disco.patcher), corte = 0;
    o.disco.patcher.faixas.forEach(function (f) { if (plano[f.nome]) corte += (f.tamanhoFinal || f.tamanho) / 2352 * 304; });
    economia.textContent = corte ? "· cerca de " + fmt(corte) + " a menos" : "";
  }
  sel.addEventListener("change", atualizarEconomia);
  atualizarEconomia();

  // Recebe a faixa em pedaços de qualquer tamanho e entrega só os 2048 bytes de dados de cada setor.
  function ConversorIso(nome, destino) { this.nome = nome; this.destino = destino; this.resto = new Uint8Array(2352); this.n = 0; this.setor = 0; }
  ConversorIso.prototype.conferir = function (b, o) {
    var ok = b[o] === 0 && b[o + 11] === 0 && b[o + 15] === 1;
    for (var k = 1; ok && k < 11; k++) ok = b[o + k] === 255;
    if (!ok) { var e = new Error("O setor " + this.setor + " de " + this.nome + " não está no formato padrão, então a versão compacta não pode ser gerada. Desmarque a opção \"Versão compacta\" e gere de novo."); e.codigo = "compacto"; throw e; }
    this.setor++;
  };
  ConversorIso.prototype.write = function (u8) {
    var i = 0, n = u8.length, setores = Math.floor((this.n + n) / 2352), saida = new Uint8Array(setores * 2048), s = 0;
    if (this.n) {
      var falta = Math.min(2352 - this.n, n);
      this.resto.set(u8.subarray(0, falta), this.n); this.n += falta; i = falta;
      if (this.n === 2352) { this.conferir(this.resto, 0); saida.set(this.resto.subarray(16, 2064), 0); s = 2048; this.n = 0; }
    }
    for (; i + 2352 <= n; i += 2352, s += 2048) { this.conferir(u8, i); saida.set(u8.subarray(i + 16, i + 2064), s); }
    if (i < n) { this.resto.set(u8.subarray(i), 0); this.n = n - i; }
    return saida.length ? this.destino.write(saida) : Promise.resolve();
  };
  ConversorIso.prototype.fechar = function () {
    if (this.n) throw new Error("O tamanho de " + this.nome + " não fecha em setores completos. Desmarque a opção \"Versão compacta\" e gere de novo.");
  };
  async function copiarBlob(blob, destino) {
    for (var o = 0; o < blob.size; o += 16 * MB) await destino.write(new Uint8Array(await blob.slice(o, Math.min(blob.size, o + 16 * MB)).arrayBuffer()));
  }

  /* ---------- leitura do .zip (em partes, sem estourar a memória) ---------- */
  function Coletor() { this.blobs = []; this.partes = []; this.n = 0; }
  Coletor.prototype.add = function (u8) {
    this.partes.push(u8.slice()); this.n += u8.length;
    if (this.n >= 32 * MB) { this.blobs.push(new Blob(this.partes)); this.partes = []; this.n = 0; }
  };
  Coletor.prototype.blob = function () {
    if (this.partes.length) { this.blobs.push(new Blob(this.partes)); this.partes = []; this.n = 0; }
    return new Blob(this.blobs);
  };

  async function abrirZip(arquivo) {
    if (!window.fflate) throw new Error("Não foi possível carregar o leitor de .zip. Descompacte o arquivo no seu computador e escolha a pasta.");
    var saida = [], erro = null;
    var uz = new window.fflate.Unzip(function (f) {
      var nome = f.name.split("/").pop();
      if (!nome) return;
      var col = new Coletor();
      f.ondata = function (err, dado, final) {
        if (err) { erro = err; return; }
        if (dado && dado.length) col.add(dado);
        if (final) saida.push({ nome: nome, blob: col.blob() });
      };
      f.start();
    });
    uz.register(window.fflate.UnzipInflate);
    var leitor = arquivo.stream().getReader(), lidos = 0, ultimo = 0;
    for (;;) {
      var r = await leitor.read();
      if (r.done) { uz.push(new Uint8Array(0), true); break; }
      uz.push(r.value);
      if (erro) throw new Error("O .zip parece danificado. Baixe de novo ou descompacte e escolha a pasta.");
      lidos += r.value.length;
      if (lidos - ultimo > 24 * MB) { ultimo = lidos; progresso(lidos / arquivo.size, "Abrindo o .zip… " + fmt(lidos) + " de " + fmt(arquivo.size)); await pausa(); }
    }
    return saida;
  }

  /* ---------- identificação e conferência ---------- */
  async function receber(lista) {
    if (estado.ocupado) return;
    reiniciar();
    estado.ocupado = true; zona.classList.add("ocupado");
    try {
      var zip = lista.length === 1 && /\.zip$/i.test(lista[0].nome);
      if (lista.length === 1 && /\.(7z|rar)$/i.test(lista[0].nome))
        throw new Error("Arquivos .7z e .rar não são abertos pelo site. Descompacte no seu computador e escolha a pasta com os arquivos do jogo.");
      if (zip) { progresso(0, "Abrindo o .zip…"); lista = await abrirZip(lista[0].blob); }
      await identificar(lista);
    } catch (e) {
      progresso(null); mensagem("erro", esc(e.message || String(e)));
    } finally {
      estado.ocupado = false; zona.classList.remove("ocupado");
    }
  }

  async function identificar(lista) {
    var cfg = atual().disco.patcher, achadas = {}, linhas = [], faltam = [], erradas = [];
    cfg.faixas.forEach(function (f) {
      var ok = lista.filter(function (a) { return a.blob.size === f.tamanho; });
      var mesmoNome = ok.filter(function (a) { return a.nome.toLowerCase() === f.nome.toLowerCase(); })[0];
      var item = mesmoNome || ok[0];
      if (item) { achadas[f.nome] = item.blob; linhas.push({ nome: f.nome, estado: "ok", txt: "encontrado · " + fmt(f.tamanho) }); return; }
      var nomeIgual = lista.filter(function (a) { return a.nome.toLowerCase() === f.nome.toLowerCase(); })[0];
      if (nomeIgual) { erradas.push(f.nome); linhas.push({ nome: f.nome, estado: "erro", txt: "tamanho diferente do esperado" }); }
      else { faltam.push(f.nome); linhas.push({ nome: f.nome, estado: "erro", txt: "não encontrado" }); }
    });
    listaFaixas(linhas);
    var J = atual().jogo, base = J.base ? J.base.regiao + " " + J.base.versao : "";
    if (faltam.length || erradas.length) {
      // os arquivos podem ser de outro disco: troca sozinho para o disco certo
      var outro = -1;
      opcoes.forEach(function (o, i) {
        if (i === +sel.value || outro >= 0) return;
        var todos = o.disco.patcher.faixas.every(function (f) { return lista.some(function (a) { return a.blob.size === f.tamanho; }); });
        if (todos) outro = i;
      });
      if (outro >= 0) {
        sel.value = String(outro);
        mensagem("info", "Esses arquivos são do <strong>" + esc(opcoes[outro].jogo.titulo) + " · " + esc(opcoes[outro].disco.nome) + "</strong>. Troquei o disco no passo 1 para você.");
        return identificar(lista);
      }
    }
    if (erradas.length) throw new Error("Os arquivos são de outra versão do jogo. Este patch precisa do " + esc(J.titulo) + " " + esc(base) + " em formato GDI.");
    if (faltam.length) throw new Error("Faltam arquivos do jogo: " + faltam.join(", ") + ". Escolha a pasta inteira do " + esc(atual().disco.nome) + " ou o .zip completo. O patcher online aceita o formato GDI; para CUE/BIN use o Universal Dreamcast Patcher.");

    var ref = cfg.faixas.filter(function (f) { return f.md5; })[0];
    if (ref && window.SparkMD5) {
      progresso(1, "Conferindo a versão do jogo…");
      var h = window.SparkMD5.ArrayBuffer.hash(await achadas[ref.nome].arrayBuffer());
      if (h !== ref.md5) throw new Error("O arquivo " + ref.nome + " não é da versão certa (" + esc(base) + "). Confira se o jogo não foi modificado.");
    }

    progresso(1, "Baixando a tradução…");
    var patches = {};
    for (var i = 0; i < cfg.faixas.length; i++) {
      var f = cfg.faixas[i];
      if (!f.patch) continue;
      var partes = Array.isArray(f.patch) ? f.patch : [f.patch], blocos = [], soma = 0;
      for (var k = 0; k < partes.length; k++) {
        var r = await fetch(partes[k], { cache: "no-cache" });
        if (!r.ok) throw new Error("A tradução deste disco ainda está sendo preparada para o patcher online. Por enquanto, use o patch .dcp na página do jogo.");
        var b = new Uint8Array(await r.arrayBuffer()); blocos.push(b); soma += b.length;
      }
      var junto = new Uint8Array(soma), pos = 0;
      blocos.forEach(function (b) { junto.set(b, pos); pos += b.length; });
      patches[f.nome] = junto;
    }
    estado.faixas = achadas; estado.patches = patches;
    progresso(null);
    var trocou = msg.className.indexOf("p-msg--info") >= 0 && !msg.hidden ? msg.innerHTML + "<br>" : "";
    mensagem("ok", trocou + "<strong>Tudo certo:</strong> " + esc(J.titulo) + " · " + esc(atual().disco.nome) + ", versão " + esc(base) + ". Agora é só gerar a versão traduzida.");
    btnGerar.disabled = false;
    btnGerar.focus();
  }

  /* ---------- relógio: tempo decorrido e estimativa ---------- */
  var relogio = { inicio: 0 };
  function mmss(seg) { seg = Math.max(0, Math.round(seg)); return Math.floor(seg / 60) + ":" + String(seg % 60).padStart(2, "0"); }
  function tempo(frac) {
    var dec = (Date.now() - relogio.inicio) / 1000;
    var txt = " · " + mmss(dec);
    if (frac > 0.04 && frac < 1) txt += " · faltam ~" + mmss(dec / frac - dec);
    return txt;
  }

  /* Carrega a trilha original na memória (muito mais rápido); se faltar memória, lê do disco aos pedaços. */
  async function fonteDe(nome, origem, base0, total) {
    progresso(base0 / total, "Lendo " + nome + "…" + tempo(base0 / total));
    var f = await V.FonteMemoria(origem, function (n) {
      progresso(base0 / total, "Lendo " + nome + "… " + fmt(n) + " de " + fmt(origem.size) + tempo(base0 / total));
    });
    return f || V.FonteBlob(origem);
  }

  /* ---------- geração ---------- */
  async function gerar() {
    if (!estado.faixas || estado.ocupado) return;
    var cfg = atual().disco.patcher, pasta = null;
    if (window.showDirectoryPicker) {
      try { pasta = await window.showDirectoryPicker({ id: "mog-patcher", mode: "readwrite" }); }
      catch (e) { if (e && e.name === "AbortError") return; pasta = null; }
    }
    estado.ocupado = true; btnGerar.disabled = true; fim.hidden = true; relogio.inicio = Date.now();
    raiz.classList.add("p-trabalhando");
    progresso(0, "Preparando…");
    window.addEventListener("beforeunload", segurar);
    var total = cfg.faixas.reduce(function (s, f) { return s + (f.tamanhoFinal || f.tamanho); }, 0), feito = 0;
    var compacto = !!(chkCompacto && chkCompacto.checked), plano = compacto ? planoCompacto(cfg) : {};
    var saidaDe = function (f) { return plano[f.nome] || f.nome; };
    var linhas = cfg.faixas.map(function (f) { return { nome: saidaDe(f), estado: "fila", txt: f.patch ? "traduzir" : plano[f.nome] ? "converter" : "copiar" }; });
    linhas.push({ nome: "disc.gdi", estado: "fila", txt: "criar" });
    var marcar = function (i, e, t) { linhas[i].estado = e; linhas[i].txt = t; listaFaixas(linhas); };
    var resultados = [];
    try {
      var destinoPasta = pasta ? await pasta.getDirectoryHandle(cfg.pasta, { create: true }) : null;
      mensagem("info", '<span class="p-girando" aria-hidden="true"></span>Gerando a versão traduzida. Isso leva alguns minutos, não feche esta página. ' + (destinoPasta ? "Os arquivos vão para a pasta <strong>" + esc(cfg.pasta) + "</strong>." : ""));
      for (var i = 0; i < cfg.faixas.length; i++) {
        var f = cfg.faixas[i], origem = estado.faixas[f.nome], base0 = feito;
        marcar(i, "andamento", f.patch ? "traduzindo…" : plano[f.nome] ? "convertendo…" : "copiando…");
        var nomeSaida = saidaDe(f), w = null, col = null;
        if (destinoPasta) w = await (await destinoPasta.getFileHandle(nomeSaida, { create: true })).createWritable();
        else col = new Coletor();
        var destino = w ? { write: function (u) { return w.write(u); } } : { write: function (u) { col.add(u); return pausa(); } };
        var conv = plano[f.nome] ? new ConversorIso(f.nome, destino) : null;
        if (f.patch) {
          await V.aplicar(estado.patches[f.nome], await fonteDe(f.nome, origem, base0, total), conv || destino,
            { aoProgredir: function (n) { progresso((base0 + n) / total, "Traduzindo " + f.nome + "… " + fmt(base0 + n) + " de " + fmt(total) + tempo((base0 + n) / total)); } });
        } else if (conv) {
          progresso(feito / total, "Convertendo " + f.nome + "…" + tempo(feito / total));
          await copiarBlob(origem, conv);
        } else {
          progresso(feito / total, "Copiando " + f.nome + "…" + tempo(feito / total));
          if (w) await w.write(origem);
        }
        if (conv) conv.fechar();
        if (w) await w.close();
        else resultados.push({ nome: nomeSaida, blob: f.patch || conv ? col.blob() : origem });
        feito += f.tamanhoFinal || f.tamanho;
        marcar(i, "ok", f.patch ? "traduzido" : conv ? "convertido" : "copiado");
        progresso(feito / total, fmt(feito) + " de " + fmt(total));
      }
      var gdi = new Blob([(compacto ? gdiCompacto(cfg) : cfg.gdi).replace(/\n/g, "\r\n")], { type: "text/plain" });
      if (destinoPasta) { var gh = await destinoPasta.getFileHandle("disc.gdi", { create: true }), gw = await gh.createWritable(); await gw.write(gdi); await gw.close(); }
      else resultados.push({ nome: "disc.gdi", blob: gdi });
      marcar(linhas.length - 1, "ok", "criado");
      var pacote = null;
      if (!destinoPasta) {
        try {
          pacote = await montarZip(resultados, cfg.pasta, function (n, t) { progresso(n / t, "Montando o .zip… " + fmt(n) + " de " + fmt(t) + tempo(n / t)); });
        } catch (ez) { pacote = null; }
      }
      progresso(1, "Pronto em " + mmss((Date.now() - relogio.inicio) / 1000));
      mensagem("", "");
      concluir(cfg, destinoPasta ? null : resultados, pacote);
    } catch (e) {
      progresso(null);
      mensagem("erro", esc(e && e.message ? e.message : String(e)) + (e && (e.codigo === "checksum" || e.codigo === "compacto") ? "" : " Se o problema continuar, use o patch .dcp na página do jogo."));
      btnGerar.disabled = false;
    } finally {
      estado.ocupado = false; raiz.classList.remove("p-trabalhando");
      window.removeEventListener("beforeunload", segurar);
    }
  }
  function segurar(ev) { ev.preventDefault(); ev.returnValue = ""; }

  /* ---------- .zip de saída (sem compressão: rápido, e as trilhas quase não comprimem) ---------- */
  var TABELA_CRC = (function () {
    var t = new Int32Array(256);
    for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c; }
    return t;
  })();
  function crcParcial(crc, u8) {
    for (var i = 0, n = u8.length; i < n; i++) crc = TABELA_CRC[(crc ^ u8[i]) & 255] ^ (crc >>> 8);
    return crc;
  }
  async function montarZip(arquivos, pasta, aoProgredir) {
    var total = arquivos.reduce(function (s, a) { return s + a.blob.size; }, 0), lido = 0;
    if (total + arquivos.length * 200 >= 0xFFFFFFFF) throw new Error("grande demais para .zip simples");
    var agora = new Date();
    var hora = (agora.getHours() << 11) | (agora.getMinutes() << 5) | (agora.getSeconds() >> 1);
    var data = ((agora.getFullYear() - 1980) << 9) | ((agora.getMonth() + 1) << 5) | agora.getDate();
    var enc = new TextEncoder(), partes = [], central = [], pos = 0;
    for (var i = 0; i < arquivos.length; i++) {
      var a = arquivos[i], crc = -1, PARTE = 16 * MB;
      for (var o = 0; o < a.blob.size; o += PARTE) {
        crc = crcParcial(crc, new Uint8Array(await a.blob.slice(o, Math.min(a.blob.size, o + PARTE)).arrayBuffer()));
        lido += Math.min(PARTE, a.blob.size - o);
        aoProgredir(lido, total);
      }
      crc = (crc ^ -1) >>> 0;
      var nome = enc.encode(pasta + "/" + a.nome), tam = a.blob.size;
      var lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true);
      lh.setUint16(10, hora, true); lh.setUint16(12, data, true); lh.setUint32(14, crc, true);
      lh.setUint32(18, tam, true); lh.setUint32(22, tam, true); lh.setUint16(26, nome.length, true); lh.setUint16(28, 0, true);
      partes.push(lh.buffer, nome, a.blob);
      var ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true);
      ch.setUint16(10, 0, true); ch.setUint16(12, hora, true); ch.setUint16(14, data, true); ch.setUint32(16, crc, true);
      ch.setUint32(20, tam, true); ch.setUint32(24, tam, true); ch.setUint16(28, nome.length, true);
      ch.setUint32(42, pos, true);
      central.push(ch.buffer, nome);
      pos += 30 + nome.length + tam;
    }
    var tamCentral = central.reduce(function (s, b) { return s + b.byteLength; }, 0);
    var fimZip = new DataView(new ArrayBuffer(22));
    fimZip.setUint32(0, 0x06054b50, true); fimZip.setUint16(8, arquivos.length, true); fimZip.setUint16(10, arquivos.length, true);
    fimZip.setUint32(12, tamCentral, true); fimZip.setUint32(16, pos, true);
    return new Blob(partes.concat(central, [fimZip.buffer]), { type: "application/zip" });
  }

  function concluir(cfg, arquivos, pacote) {
    var A = D.apoio || {}, J = atual().jogo, itch = J.itch || A.itchio;
    var separados = arquivos ? '<div class="p-baixar">' + arquivos.map(function (a) {
      return '<a class="btn btn--ghost" href="' + URL.createObjectURL(a.blob) + '" download="' + esc(a.nome) + '">' + esc(a.nome) + " <small>" + fmt(a.blob.size) + "</small></a>";
    }).join("") + "</div>" : "";
    var onde = !arquivos
      ? "<p>Os arquivos estão na pasta <strong>" + esc(cfg.pasta) + "</strong>, dentro da pasta que você escolheu.</p>"
      : pacote
        ? '<p>Baixe o .zip e descompacte. Dentro dele está a pasta <strong>' + esc(cfg.pasta) + "</strong>, pronta para usar.</p>" +
          '<div class="btns"><a class="btn" href="' + URL.createObjectURL(pacote) + '" download="' + esc(cfg.pasta) + '.zip">Baixar .zip <small style="opacity:.75">' + fmt(pacote.size) + "</small></a></div>" +
          '<details class="p-separados"><summary class="mono muted">Prefere baixar os arquivos separados?</summary>' + separados + "</details>"
        : '<p>Baixe os arquivos abaixo e coloque <strong>todos na mesma pasta</strong>, com o nome <strong>' + esc(cfg.pasta) + "</strong>.</p>" + separados;
    fim.innerHTML = '<div class="wrap stack" style="gap:1.75rem">' +
      '<div class="stack" style="gap:.6rem"><span class="eyebrow">Pronto</span><h2>' + esc(J.titulo) + " em português está pronto!</h2>" + onde + "</div>" +
      '<div class="duas-col" style="gap:1.25rem">' +
      '<div class="stack" style="gap:.6rem"><h3>Como jogar</h3><ul class="lista-check">' +
      "<li><strong>GDEMU / MODE:</strong> copie a pasta para o cartão SD, como qualquer outro jogo.</li>" +
      "<li><strong>Emulador (Flycast, Redream):</strong> abra o arquivo <span class=\"mono\">disc.gdi</span>.</li>" +
      "<li>Na tela de título deve aparecer <strong>Ver. " + esc(atual().disco.versao) + "</strong> no rodapé.</li></ul></div>" +
      '<div class="painel"><strong style="font-family:var(--f-display);font-size:var(--s-3)">Curtiu? Apoie o projeto</strong>' +
      '<p class="muted" style="font-size:var(--s-1)">A tradução é gratuita. Se quiser ajudar nas próximas, qualquer valor ajuda.</p>' +
      (A.pixChave ? window.MOGPix.bloco(A, "fim") : "") +
      (itch ? '<a class="btn btn--ghost" href="' + esc(itch) + '" target="_blank" rel="noopener" style="justify-self:start">Doar pelo itch.io</a>' : "") +
      "</div></div></div>";
    fim.hidden = false;
    fim.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  /* ---------- janela de apoio antes de gerar (mesma do download; nunca bloqueia) ---------- */
  var dlg = null;
  function abrirApoio() {
    var A = D.apoio || {}, J = atual().jogo, d = atual().disco, itch = J.itch || A.itchio;
    if ((!A.pixChave && !itch) || typeof HTMLDialogElement !== "function") { gerar(); return; }
    if (!dlg) {
      dlg = document.createElement("dialog"); dlg.className = "doacao"; dlg.setAttribute("aria-labelledby", "apoio-p-titulo");
      document.body.appendChild(dlg);
      dlg.addEventListener("click", function (ev) {
        if (ev.target === dlg) { dlg.close(); return; }
        if (ev.target.closest("[data-p-continuar]")) { dlg.close(); gerar(); }
      });
    }
    dlg.innerHTML =
      '<form method="dialog" class="doacao-fechar"><button aria-label="Fechar">✕</button></form>' +
      '<div class="stack" style="gap:.4rem"><span class="eyebrow">' + esc(J.titulo) + " · " + esc(d.nome) + " · v" + esc(d.versao) + "</span>" +
      '<h2 id="apoio-p-titulo">Curtiu a tradução? Apoie o projeto</h2>' +
      '<p class="muted">A tradução é e continua gratuita. Se quiser ajudar, escolha a forma que preferir. Qualquer valor ajuda a manter as próximas traduções.</p></div>' +
      '<div class="doacao-opcoes">' +
      (A.pixChave ? '<div class="doacao-op doacao-op--pix"><strong>Pix</strong><span class="muted">Em reais, na hora, sem taxa.</span>' + window.MOGPix.bloco(A, "gerar") + "</div>" : "") +
      (itch ? '<div class="doacao-op"><strong>itch.io</strong><span class="muted">Cartão ou PayPal, em dólar. Bom para quem já usa o itch.io.</span>' +
        '<a class="btn btn--ghost" href="' + esc(itch) + '" target="_blank" rel="noopener">Doar pelo itch.io</a></div>' : "") +
      "</div>" +
      '<div class="doacao-baixar"><button type="button" class="btn" data-p-continuar autofocus>Continuar e gerar</button>' +
      '<span class="mono muted" style="font-size:var(--s-0)">' + (window.showDirectoryPicker ? "Em seguida, escolha a pasta onde salvar." : "Ao final, você baixa um .zip.") + "</span></div>";
    dlg.showModal();
  }
  btnGerar.addEventListener("click", abrirApoio);

  /* ---------- entradas: botões e arrastar ---------- */
  var inZip = $("#p-zip"), inPasta = $("#p-pasta");
  var dosInputs = function (files) { return Array.prototype.map.call(files, function (f) { return { nome: f.name, blob: f }; }); };
  inZip.addEventListener("change", function () { if (inZip.files.length) receber(dosInputs(inZip.files)); inZip.value = ""; });
  inPasta.addEventListener("change", function () { if (inPasta.files.length) receber(dosInputs(inPasta.files)); inPasta.value = ""; });
  if (!("webkitdirectory" in inPasta)) $("[data-p-btn-pasta]").hidden = true;

  ["dragenter", "dragover"].forEach(function (t) { zona.addEventListener(t, function (e) { e.preventDefault(); zona.classList.add("sobre"); }); });
  ["dragleave", "drop"].forEach(function (t) { zona.addEventListener(t, function () { zona.classList.remove("sobre"); }); });
  zona.addEventListener("drop", async function (e) {
    e.preventDefault();
    var itens = e.dataTransfer.items, entradas = [];
    if (itens && itens.length && itens[0].webkitGetAsEntry) {
      for (var i = 0; i < itens.length; i++) { var en = itens[i].webkitGetAsEntry(); if (en) entradas.push(en); }
      receber(await lerEntradas(entradas));
    } else receber(dosInputs(e.dataTransfer.files));
  });
  function lerEntradas(entradas) {
    var saida = [];
    function arquivo(en) { return new Promise(function (ok, falha) { en.file(function (f) { saida.push({ nome: f.name, blob: f }); ok(); }, falha); }); }
    function pasta(en) {
      return new Promise(function (ok, falha) {
        var leitor = en.createReader(), todos = [];
        (function ler() {
          leitor.readEntries(function (lote) {
            if (!lote.length) Promise.all(todos.map(visitar)).then(ok, falha);
            else { todos = todos.concat(Array.prototype.slice.call(lote)); ler(); }
          }, falha);
        })();
      });
    }
    function visitar(en) { return en.isDirectory ? pasta(en) : arquivo(en); }
    return Promise.all(entradas.map(visitar)).then(function () { return saida; });
  }
})();
