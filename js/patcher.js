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
    barra.parentNode.hidden = frac == null;
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
    mensagem("ok", "<strong>Tudo certo:</strong> " + esc(J.titulo) + " · " + esc(atual().disco.nome) + ", versão " + esc(base) + ". Agora é só gerar a versão traduzida.");
    btnGerar.disabled = false;
    btnGerar.focus();
  }

  /* ---------- geração ---------- */
  async function gerar() {
    if (!estado.faixas || estado.ocupado) return;
    var cfg = atual().disco.patcher, pasta = null;
    if (window.showDirectoryPicker) {
      try { pasta = await window.showDirectoryPicker({ id: "mog-patcher", mode: "readwrite" }); }
      catch (e) { if (e && e.name === "AbortError") return; pasta = null; }
    }
    estado.ocupado = true; btnGerar.disabled = true; fim.hidden = true;
    window.addEventListener("beforeunload", segurar);
    var total = cfg.faixas.reduce(function (s, f) { return s + (f.tamanhoFinal || f.tamanho); }, 0), feito = 0;
    var linhas = cfg.faixas.map(function (f) { return { nome: f.nome, estado: "fila", txt: f.patch ? "traduzir" : "copiar" }; });
    linhas.push({ nome: "disc.gdi", estado: "fila", txt: "criar" });
    var marcar = function (i, e, t) { linhas[i].estado = e; linhas[i].txt = t; listaFaixas(linhas); };
    var resultados = [];
    try {
      var destinoPasta = pasta ? await pasta.getDirectoryHandle(cfg.pasta, { create: true }) : null;
      mensagem("info", "Gerando… Não feche esta página. " + (destinoPasta ? "Os arquivos vão para a pasta <strong>" + esc(cfg.pasta) + "</strong>." : ""));
      for (var i = 0; i < cfg.faixas.length; i++) {
        var f = cfg.faixas[i], origem = estado.faixas[f.nome], base0 = feito;
        marcar(i, "andamento", f.patch ? "traduzindo…" : "copiando…");
        if (destinoPasta) {
          var fh = await destinoPasta.getFileHandle(f.nome, { create: true }), w = await fh.createWritable();
          if (f.patch) {
            await V.aplicar(estado.patches[f.nome], V.FonteBlob(origem), { write: function (u) { return w.write(u); } },
              { aoProgredir: function (n) { progresso((base0 + n) / total, "Traduzindo " + f.nome + "… " + fmt(base0 + n) + " de " + fmt(total)); } });
          } else {
            progresso(feito / total, "Copiando " + f.nome + "…");
            await w.write(origem);
          }
          await w.close();
        } else {
          if (f.patch) {
            var col = new Coletor();
            await V.aplicar(estado.patches[f.nome], V.FonteBlob(origem), { write: function (u) { col.add(u); return pausa(); } },
              { aoProgredir: function (n) { progresso((base0 + n) / total, "Traduzindo " + f.nome + "… " + fmt(base0 + n) + " de " + fmt(total)); } });
            resultados.push({ nome: f.nome, blob: col.blob() });
          } else resultados.push({ nome: f.nome, blob: origem });
        }
        feito += f.tamanhoFinal || f.tamanho;
        marcar(i, "ok", f.patch ? "traduzido" : "copiado");
        progresso(feito / total, fmt(feito) + " de " + fmt(total));
      }
      var gdi = new Blob([cfg.gdi.replace(/\n/g, "\r\n")], { type: "text/plain" });
      if (destinoPasta) { var gh = await destinoPasta.getFileHandle("disc.gdi", { create: true }), gw = await gh.createWritable(); await gw.write(gdi); await gw.close(); }
      else resultados.push({ nome: "disc.gdi", blob: gdi });
      marcar(linhas.length - 1, "ok", "criado");
      progresso(1, "Pronto");
      mensagem("", "");
      concluir(cfg, destinoPasta ? null : resultados);
    } catch (e) {
      progresso(null);
      mensagem("erro", esc(e && e.message ? e.message : String(e)) + (e && e.codigo === "checksum" ? "" : " Se o problema continuar, use o patch .dcp na página do jogo."));
      btnGerar.disabled = false;
    } finally {
      estado.ocupado = false;
      window.removeEventListener("beforeunload", segurar);
    }
  }
  function segurar(ev) { ev.preventDefault(); ev.returnValue = ""; }

  function concluir(cfg, arquivos) {
    var A = D.apoio || {}, J = atual().jogo, itch = J.itch || A.itchio;
    var onde = arquivos
      ? '<p>Seu navegador não grava pastas direto. Baixe os arquivos abaixo e coloque <strong>todos na mesma pasta</strong>, com o nome <strong>' + esc(cfg.pasta) + "</strong>.</p>" +
        '<div class="p-baixar">' + arquivos.map(function (a) {
          return '<a class="btn btn--ghost" href="' + URL.createObjectURL(a.blob) + '" download="' + esc(a.nome) + '">' + esc(a.nome) + " <small>" + fmt(a.blob.size) + "</small></a>";
        }).join("") + "</div>"
      : "<p>Os arquivos estão na pasta <strong>" + esc(cfg.pasta) + "</strong>, dentro da pasta que você escolheu.</p>";
    fim.innerHTML = '<div class="wrap stack" style="gap:1.75rem">' +
      '<div class="stack" style="gap:.6rem"><span class="eyebrow">Pronto</span><h2>' + esc(J.titulo) + " em português está pronto!</h2>" + onde + "</div>" +
      '<div class="duas-col" style="gap:1.25rem">' +
      '<div class="stack" style="gap:.6rem"><h3>Como jogar</h3><ul class="lista-check">' +
      "<li><strong>GDEMU / MODE:</strong> copie a pasta para o cartão SD, como qualquer outro jogo.</li>" +
      "<li><strong>Emulador (Flycast, Redream):</strong> abra o arquivo <span class=\"mono\">disc.gdi</span>.</li>" +
      "<li>Na tela de título deve aparecer <strong>Versão " + esc(atual().disco.versao) + "</strong> no canto.</li></ul></div>" +
      '<div class="painel"><strong style="font-family:var(--f-display);font-size:var(--s-3)">Curtiu? Apoie o projeto</strong>' +
      '<p class="muted" style="font-size:var(--s-1)">A tradução é gratuita. Se quiser ajudar nas próximas, qualquer valor ajuda.</p>' +
      (A.pixChave ? '<div class="chave"><code id="chave-pix-p">' + esc(A.pixChave) + '</code><button type="button" class="btn" data-copiar="chave-pix-p">Copiar Pix</button></div>' : "") +
      (itch ? '<a class="btn btn--ghost" href="' + esc(itch) + '" target="_blank" rel="noopener" style="justify-self:start">Doar pelo itch.io</a>' : "") +
      "</div></div></div>";
    fim.hidden = false;
    fim.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  btnGerar.addEventListener("click", gerar);

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
