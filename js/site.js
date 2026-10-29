/* Matrix Old Games — monta as partes dinâmicas a partir de js/dados.js.
   Não precisa editar este arquivo para atualizar status, links ou jogos. */
(function () {
  "use strict";
  var D = window.MOG || { traducoes: [], apoio: {}, contato: {} };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  /* ---------- Pix: QR Code e "copia e cola" (padrão BR Code do Banco Central) ---------- */
  var Pix = (function () {
    function campo(id, v) { return id + String(v.length).padStart(2, "0") + v; }
    function limpar(t, max) {
      return String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9 ]/g, "").replace(/\s+/g, " ").toUpperCase().trim().slice(0, max).trim();
    }
    function crc16(s) {
      var c = 0xFFFF;
      for (var i = 0; i < s.length; i++) {
        c ^= s.charCodeAt(i) << 8;
        for (var k = 0; k < 8; k++) c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF;
      }
      return c.toString(16).toUpperCase().padStart(4, "0");
    }
    function payload(A) {
      if (!A || !A.pixChave) return "";
      var p = campo("00", "01") +
        campo("26", campo("00", "br.gov.bcb.pix") + campo("01", A.pixChave)) +
        campo("52", "0000") + campo("53", "986") + campo("58", "BR") +
        campo("59", limpar(A.pixNome, 25) || "MATRIX OLD GAMES") +
        campo("60", limpar(A.pixCidade, 15) || "BRASIL") +
        campo("62", campo("05", "***")) + "6304";
      return p + crc16(p);
    }
    function svg(texto) {
      if (!window.qrcode || !texto) return "";
      var q = window.qrcode(0, "M"); q.addData(texto); q.make();
      return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true, alt: "QR Code do Pix" });
    }
    /* bloco completo: QR + chave + copia e cola. "id" deixa os campos únicos na página */
    function bloco(A, id) {
      var cod = payload(A), qr = svg(cod);
      return '<div class="pix-bloco">' +
        (qr ? '<div class="pix-qr" title="Aponte a câmera do app do banco">' + qr + "</div>" : "") +
        '<div class="pix-dados">' +
        (qr ? '<span class="pix-dica">Aponte a câmera do app do seu banco para o QR Code, ou copie:</span>' : "") +
        '<div class="chave"><code id="pix-chave-' + id + '">' + esc(A.pixChave) + '</code><button type="button" class="btn btn--ghost" data-copiar="pix-chave-' + id + '" data-aviso="Chave copiada">Copiar chave</button></div>' +
        (cod ? '<div class="chave"><input class="pix-cc" id="pix-cc-' + id + '" value="' + esc(cod) + '" readonly aria-label="Pix copia e cola"><button type="button" class="btn btn--ghost" data-copiar="pix-cc-' + id + '" data-aviso="Código Pix copiado">Copia e cola</button></div>' : "") +
        (A.pixNome ? '<small class="muted">Nome no banco: ' + esc(A.pixNome) + "</small>" : "") +
        "</div></div>";
    }
    return { payload: payload, svg: svg, bloco: bloco };
  })();
  window.MOGPix = Pix;

  var ETAPAS = [["menus", "Menus e imagens"], ["dialogos", "Diálogos e legendas"], ["testes", "Testes no console"]];
  var NOME_ESTADO = { ok: "concluído", andamento: "em andamento", pendente: "na fila" };

  function estadoDisco(d) {
    var v = ETAPAS.map(function (e) { return d.etapas[e[0]] || "pendente"; });
    if (v.every(function (x) { return x === "ok"; })) return "ok";
    if (v.some(function (x) { return x !== "pendente"; })) return "andamento";
    return "pendente";
  }
  function estadoJogo(j) {
    var e = j.discos.map(estadoDisco);
    if (e.every(function (x) { return x === "ok"; })) return "ok";
    if (e.some(function (x) { return x !== "pendente"; })) return "andamento";
    return "pendente";
  }
  function rotuloDisco(d) {
    var e = estadoDisco(d);
    if (e === "ok") return '<span class="estado estado--ok">lançado' + (d.versao ? " · v" + esc(d.versao) : "") + "</span>";
    if (e === "andamento") return '<span class="estado estado--andamento">em andamento</span>';
    return '<span class="estado estado--pendente">na fila</span>';
  }
  function blocos(d) {
    var h = "";
    ETAPAS.forEach(function (e) {
      var s = d.etapas[e[0]] || "pendente";
      for (var i = 0; i < 4; i++) {
        var c = s === "ok" ? "cheio" : (s === "andamento" && i < 2 ? "meio" : "");
        h += "<i" + (c ? ' class="' + c + '"' : "") + "></i>";
      }
    });
    var feitos = ETAPAS.filter(function (e) { return d.etapas[e[0]] === "ok"; }).length;
    return '<div class="blocos" role="img" aria-label="' + feitos + ' de 3 etapas concluídas">' + h + "</div>";
  }
  function slot(d) {
    var e = estadoDisco(d);
    return '<article class="slot' + (e === "ok" ? " slot--ok" : "") + '">' +
      '<div class="slot-topo"><h3>' + esc(d.nome) + "</h3>" + rotuloDisco(d) + "</div>" +
      blocos(d) +
      '<ul class="etapas">' + ETAPAS.map(function (et) {
        var s = d.etapas[et[0]] || "pendente";
        return "<li><span>" + et[1] + '</span><span class="estado estado--' + s + '">' + NOME_ESTADO[s] + "</span></li>";
      }).join("") + "</ul></article>";
  }
  function capa(j) {
    return '<div class="capa">' + (j.capa ? '<img src="' + esc(j.capa) + '" alt="" loading="lazy">' : '<span class="titulo-capa">' + esc(j.titulo) + "</span>") + "</div>";
  }
  function resumoJogo(j) {
    var feitos = j.discos.filter(function (d) { return estadoDisco(d) === "ok"; }).length, n = j.discos.length;
    if (feitos === n) return n > 1 ? "completa · " + n + " discos" : "completa";
    return feitos + " de " + n + (n > 1 ? " discos lançados" : " disco lançado");
  }
  function ultimoLancado(j) {
    var l = null;
    j.discos.forEach(function (d) { if (estadoDisco(d) === "ok") l = d; });
    return l;
  }

  /* ---------- carrossel antes/depois ----------
     Cada cena mostra o original e depois a tradução; em seguida passa para a próxima.
     Qualquer clique do visitante pausa a troca automática. */
  function galeria(el, prints) {
    var n = prints.length, i = 0, pt = false, auto = true, timer = null, visivel = false;
    var calmo = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var dois = function (x) { return (x < 10 ? "0" : "") + x; };
    el.innerHTML =
      '<div class="galeria">' +
      '<div class="tv"><div class="tela tela--foto">' +
      '<img class="g-img g-en" alt=""><img class="g-img g-pt" alt="">' +
      '<span class="g-selo" aria-hidden="true"></span></div>' +
      '<div class="tv-base"><span class="mono g-cont"></span><span class="led"></span></div></div>' +
      '<div class="g-controles">' +
      '<button type="button" class="g-seta" data-g="ant" aria-label="Cena anterior">◀</button>' +
      '<div class="g-idioma" role="group" aria-label="Idioma da tela">' +
      '<button type="button" data-g="en">Original</button><button type="button" data-g="pt">PT-BR</button></div>' +
      '<button type="button" class="g-seta" data-g="prox" aria-label="Próxima cena">▶</button>' +
      '<button type="button" class="g-play" data-g="play"></button></div>' +
      '<p class="g-legenda" aria-live="polite"></p>' +
      '<div class="g-minis">' + prints.map(function (p, k) {
        return '<button type="button" data-g="ir" data-k="' + k + '" aria-label="Cena ' + (k + 1) + ": " + esc(p.legenda || "") + '">' +
          (p.mini ? '<img src="' + esc(p.mini) + '" alt="" loading="lazy">' : "<span>" + dois(k + 1) + "</span>") + "</button>";
      }).join("") + "</div></div>";
    var en = $(".g-en", el), ptb = $(".g-pt", el), selo = $(".g-selo", el), cont = $(".g-cont", el), leg = $(".g-legenda", el), tela = $(".tela", el);
    function preload(k) { var p = prints[(k + n) % n]; [p.antes, p.depois].forEach(function (s) { var im = new Image(); im.src = s; }); }
    function mostrar() {
      var p = prints[i];
      if (en.getAttribute("src") !== p.antes) { en.src = p.antes; ptb.src = p.depois; }
      en.alt = "Tela original em inglês: " + (p.legenda || ""); ptb.alt = "Mesma tela traduzida: " + (p.legenda || "");
      tela.classList.toggle("tela--vmu", !!p.vmu);
      ptb.classList.toggle("ativa", pt);
      selo.textContent = pt ? "PT-BR" : "ORIGINAL"; selo.classList.toggle("pt", pt);
      cont.textContent = "CENA " + dois(i + 1) + "/" + dois(n);
      leg.textContent = p.legenda || "";
      $$(".g-idioma button", el).forEach(function (b) { b.setAttribute("aria-pressed", String((b.getAttribute("data-g") === "pt") === pt)); });
      $$(".g-minis button", el).forEach(function (b, k) { b.classList.toggle("atual", k === i); if (k === i) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
      var play = $(".g-play", el); play.textContent = auto ? "❚❚ Pausar" : "▶ Automático"; play.setAttribute("aria-pressed", String(auto));
      preload(i + 1);
    }
    function passo() {
      if (!pt) { pt = true; } else { pt = false; i = (i + 1) % n; }
      mostrar(); agendar();
    }
    function agendar() {
      clearTimeout(timer);
      if (auto && visivel && !calmo) timer = setTimeout(passo, pt ? 3200 : 1800);
    }
    function parar() { auto = false; clearTimeout(timer); }
    el.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-g]"); if (!b) return;
      var a = b.getAttribute("data-g");
      if (a === "play") { auto = !auto; mostrar(); agendar(); return; }
      parar();
      if (a === "ant") { i = (i - 1 + n) % n; pt = true; }
      if (a === "prox") { i = (i + 1) % n; pt = true; }
      if (a === "en") pt = false;
      if (a === "pt") pt = true;
      if (a === "ir") { i = +b.getAttribute("data-k"); pt = true; }
      mostrar();
    });
    tela.addEventListener("click", function () { parar(); pt = !pt; mostrar(); });
    el.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowLeft") { parar(); i = (i - 1 + n) % n; pt = true; mostrar(); }
      if (ev.key === "ArrowRight") { parar(); i = (i + 1) % n; pt = true; mostrar(); }
    });
    if (calmo) { auto = false; pt = true; }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; agendar(); }, { threshold: .35 }).observe(el);
    } else { visivel = true; }
    mostrar(); agendar();
  }

  /* ---------- janela de doação antes do download ----------
     O download nunca é bloqueado: a janela só sugere Pix ou itch.io e oferece "Baixar sem doar". */
  function janelaDoacao(J) {
    var A = D.apoio || {}, itch = J.itch || A.itchio;
    if (!A.pixChave && !itch) return;
    var dlg = document.createElement("dialog");
    dlg.className = "doacao";
    dlg.setAttribute("aria-labelledby", "doacao-titulo");
    document.body.appendChild(dlg);
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest("a[data-baixar]"); if (!a || typeof dlg.showModal !== "function") return;
      ev.preventDefault();
      var d = J.discos[+a.getAttribute("data-baixar")];
      dlg.innerHTML =
        '<form method="dialog" class="doacao-fechar"><button aria-label="Fechar">✕</button></form>' +
        '<div class="stack" style="gap:.4rem"><span class="eyebrow">' + esc(J.titulo) + " · " + esc(d.nome) + " · v" + esc(d.versao) + "</span>" +
        '<h2 id="doacao-titulo">Curtiu a tradução? Apoie o projeto</h2>' +
        '<p class="muted">O patch é e continua gratuito. Se quiser ajudar, escolha a forma que preferir. Qualquer valor ajuda a manter as próximas traduções.</p></div>' +
        '<div class="doacao-opcoes">' +
        (A.pixChave ? '<div class="doacao-op doacao-op--pix"><strong>Pix</strong><span class="muted">Em reais, na hora, sem taxa.</span>' + Pix.bloco(A, "dlg") + "</div>" : "") +
        (itch ? '<div class="doacao-op"><strong>itch.io</strong><span class="muted">Cartão ou PayPal, em dólar. Bom para quem já usa o itch.io.</span>' +
          '<a class="btn btn--ghost" href="' + esc(itch) + '" target="_blank" rel="noopener">Doar pelo itch.io</a></div>' : "") +
        "</div>" +
        '<div class="doacao-baixar"><a class="btn" href="' + esc(d.download) + '" target="_blank" rel="noopener">Baixar o patch</a>' +
        (d.espelho ? '<a class="mono muted" href="' + esc(d.espelho) + '" target="_blank" rel="noopener">ou baixar pelo espelho</a>' : "") + "</div>";
      dlg.showModal();
    });
    dlg.addEventListener("click", function (ev) { if (ev.target === dlg) dlg.close(); });
  }

  /* ---------- destaque da home ---------- */
  $$("[data-destaque]").forEach(function (el) {
    var j = D.traducoes.filter(function (t) { return t.destaque; })[0] ||
      D.traducoes.filter(function (t) { return estadoJogo(t) === "andamento"; })[0] || D.traducoes[0];
    if (!j) return;
    var completa = estadoJogo(j) === "ok";
    var proximos = D.traducoes.filter(function (t) { return t !== j && estadoJogo(t) !== "ok"; });
    el.innerHTML =
      '<div class="section-head"><div class="stack" style="gap:.6rem"><span class="eyebrow">' + (completa ? "Tradução completa" : "Tradução em destaque") + "</span>" +
      "<h2>" + esc(j.titulo) + (completa ? ' <span class="selo-completo">100% em português</span>' : "") + '</h2><div class="jogo-meta"><span class="tag tag--plat">' + esc(j.plataforma) + '</span><span class="tag">' + esc(j.ano) + '</span><span class="tag">' + resumoJogo(j) + "</span></div></div>" +
      '<a class="btn' + (completa ? "" : " btn--ghost") + '" href="' + esc(j.pagina) + '">' + (completa ? "Jogar em português" : "Página da tradução") + "</a></div>" +
      '<div class="slots">' + j.discos.map(slot).join("") + "</div>" +
      proximos.map(function (t) {
        var d = t.discos.filter(function (x) { return estadoDisco(x) === "andamento"; })[0] || t.discos[0];
        return '<a class="proximo" href="' + esc(t.pagina) + '">' + (t.capa ? '<img src="' + esc(t.capa) + '" alt="" loading="lazy">' : "") +
          '<div class="stack" style="gap:.35rem;min-width:0"><span class="eyebrow">' + (ultimoLancado(t) ? "Lançamento parcial" : "Em produção") + '</span><strong>' + esc(t.titulo) + "</strong>" +
          '<span class="muted" style="font-size:var(--s-1)">' + esc(t.plataforma) + " · " + (ultimoLancado(t) ? resumoJogo(t) : esc(d.nome) + ": " + (estadoDisco(d) === "andamento" ? "em andamento" : "na fila")) + "</span></div>" +
          '<span class="mono proximo-seta" aria-hidden="true">→</span></a>';
      }).join("");
  });

  /* ---------- botão "baixar" do hero ---------- */
  $$("[data-baixar-ultimo]").forEach(function (el) {
    var j = D.traducoes[0]; if (!j) return;
    var d = ultimoLancado(j);
    el.href = j.pagina + "#downloads";
    el.textContent = d ? "Baixar " + j.titulo + " · " + d.nome : "Ver " + j.titulo;
  });

  /* ---------- catálogo ---------- */
  $$("[data-catalogo]").forEach(function (el) {
    var plats = [];
    D.traducoes.forEach(function (t) { if (plats.indexOf(t.plataforma) < 0) plats.push(t.plataforma); });
    var filtros = $("[data-filtros]", el), grade = $("[data-grade]", el), atual = "todas";
    function desenhar() {
      var lista = D.traducoes.filter(function (t) { return atual === "todas" || t.plataforma === atual; });
      grade.innerHTML = lista.map(function (j) {
        var e = estadoJogo(j);
        return '<a class="jogo" href="' + esc(j.pagina) + '">' + capa(j) +
          '<div class="jogo-corpo"><div class="jogo-meta"><span class="tag tag--plat">' + esc(j.plataforma) + '</span><span class="estado estado--' + e + '">' + (e === "ok" ? "completa" : NOME_ESTADO[e]) + "</span></div>" +
          "<h3>" + esc(j.titulo) + '</h3><p class="muted">' + esc(j.resumo) + '</p><p class="mono muted" style="font-size:var(--s-0)">' + resumoJogo(j) + " · por " + esc(j.tradutor) + "</p></div></a>";
      }).join("") +
        '<a class="jogo vaga" href="sobre.html#participe"><div class="stack" style="gap:.5rem;justify-items:center"><span class="botoes-cor" aria-hidden="true"><i style="background:var(--yellow)"></i><i style="background:var(--blue)"></i><i style="background:var(--green)"></i><i style="background:var(--red)"></i></span><strong style="color:var(--fg)">Próximo projeto</strong><span>Qualquer console. Quer sugerir um jogo ou traduzir com a gente?</span></div></a>';
    }
    if (filtros) {
      filtros.innerHTML = ["todas"].concat(plats).map(function (p) {
        return '<button type="button" class="filtro" data-p="' + esc(p) + '" aria-pressed="' + (p === atual) + '">' + (p === "todas" ? "Todas" : esc(p)) + "</button>";
      }).join("");
      filtros.addEventListener("click", function (ev) {
        var b = ev.target.closest("button"); if (!b) return;
        atual = b.getAttribute("data-p");
        $$("button", filtros).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        desenhar();
      });
    }
    desenhar();
  });

  /* ---------- página de um jogo ---------- */
  var idJogo = document.body.getAttribute("data-jogo");
  var J = idJogo && D.traducoes.filter(function (t) { return t.id === idJogo; })[0];
  if (J) {
    var s = $("[data-slots]"); if (s) s.innerHTML = J.discos.map(slot).join("");
    var r = $("[data-resumo]"); if (r) r.textContent = resumoJogo(J);

    var f = $("[data-ficha]");
    if (f && J.capa) {
      var painelFicha = f.closest(".painel");
      if (painelFicha && !painelFicha.querySelector(".capa-jogo")) {
        var img = document.createElement("img");
        img.className = "capa-jogo"; img.src = J.capa; img.alt = "Capa da tradução de " + J.titulo; img.width = 1200; img.height = 750;
        painelFicha.insertBefore(img, painelFicha.firstChild);
      }
    }
    if (f) f.innerHTML =
      "<dt>Plataforma</dt><dd>" + esc(J.plataforma) + "</dd>" +
      "<dt>Lançamento</dt><dd>" + esc(J.ano) + "</dd>" +
      "<dt>Versão base</dt><dd>" + esc(J.base.regiao) + (J.base.versao ? " · " + esc(J.base.versao) : "") + "</dd>" +
      "<dt>Formato</dt><dd>" + esc(J.base.formato) + "</dd>" +
      (J.base.hash ? '<dt>MD5 esperado</dt><dd class="mono">' + esc(J.base.hash) + "</dd>" : "") +
      "<dt>Tradução</dt><dd>" + esc(J.tradutor) + "</dd>";

    var dl = $("[data-downloads]");
    if (dl) dl.innerHTML = J.discos.map(function (d) {
      var ok = estadoDisco(d) === "ok";
      var aplicar = ok && d.patcher
        ? '<a class="btn" href="patcher.html?jogo=' + encodeURIComponent(J.id) + '&amp;disco=' + (J.discos.indexOf(d) + 1) + '">Aplicar o patch</a>' : "";
      var botao = ok && d.download
        ? '<div class="dl-botoes">' + aplicar + '<a class="btn' + (aplicar ? " btn--ghost" : "") + '" href="' + esc(d.download) + '" target="_blank" rel="noopener" data-baixar="' + J.discos.indexOf(d) + '">Baixar .dcp</a></div>'
        : '<span class="btn" aria-disabled="true">' + (ok ? "Em breve" : "Aguarde") + "</span>";
      var sub = ok
        ? "patch .dcp · v" + esc(d.versao) + (d.espelho ? ' · <a href="' + esc(d.espelho) + '" target="_blank" rel="noopener">espelho</a>' : "")
        : NOME_ESTADO[estadoDisco(d)];
      return '<div class="download"><div><strong>' + esc(d.nome) + "</strong><br><small>" + sub + "</small></div>" + botao + "</div>";
    }).join("");

    janelaDoacao(J);

    if (J.ferramenta) $$("[data-ferramenta]").forEach(function (fe) { fe.textContent = J.ferramenta.nome; fe.href = J.ferramenta.url; });
    $$("[data-versao-base]").forEach(function (x) { x.textContent = (J.base.regiao + " " + (J.base.versao || "")).trim(); });
    if (J.guia) $$("[data-guia]").forEach(function (g) { g.textContent = J.guia.nome; g.href = J.guia.url; });
    $$("[data-compativel]").forEach(function (x) { x.textContent = J.compativel || ""; });
    var lista = function (itens, cls) { return '<ul class="lista-check' + (cls ? " " + cls : "") + '">' + itens.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>"; };
    var tr = $("[data-traduzido]");
    if (tr && J.traduzido) tr.innerHTML = Object.keys(J.traduzido).map(function (k) {
      return '<div class="stack" style="gap:.75rem"><h3>' + esc(k) + "</h3>" + lista(J.traduzido[k]) + "</div>";
    }).join("");
    var ob = $("[data-observacoes]");
    if (ob && J.observacoes) ob.innerHTML = lista(J.observacoes, "lista-obs");

    var pr = $("[data-prints]");
    if (pr) {
      if (!J.prints.length) {
        pr.innerHTML = '<div class="sem-prints">Comparações de antes e depois chegam em breve.</div>';
      } else {
        galeria(pr, J.prints);
      }
    }

    $$("[data-esconder-vazio]").forEach(function (sec) {
      var campo = sec.getAttribute("data-esconder-vazio"), v = J[campo];
      if (!v || (Array.isArray(v) ? !v.length : !Object.keys(v).length)) sec.hidden = true;
    });
    var ch = $("[data-changelog]");
    if (ch) ch.innerHTML = J.changelog.map(function (c) {
      return '<li><span class="v">v' + esc(c.versao) + "</span><div>" + (c.data ? '<span class="mono muted" style="font-size:var(--s-0)">' + esc(c.data) + "</span>" : "") +
        "<ul>" + c.notas.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul></div></li>";
    }).join("");
  }

  /* ---------- apoiadores ---------- */
  $$("[data-apoiadores]").forEach(function (el) {
    var lista = D.apoiadores || [];
    if (!lista.length) { el.innerHTML = '<p class="muted">Seja a primeira pessoa a apoiar o projeto.</p>'; return; }
    var cores = ["var(--yellow)", "var(--blue)", "var(--green)", "var(--red)"];
    el.innerHTML = lista.map(function (a, i) {
      return '<li class="apoiador" style="--cor:' + cores[i % 4] + '"><span class="apoiador-nome">' + esc(a.nome) + "</span>" +
        (a.nota ? '<span class="apoiador-nota">' + esc(a.nota) + "</span>" : "") + "</li>";
    }).join("");
  });
  $$("[data-total-apoiadores]").forEach(function (el) { var n = (D.apoiadores || []).length; el.textContent = n + (n === 1 ? " apoiador" : " apoiadores"); });

  /* ---------- apoio ---------- */
  var A = D.apoio || {};
  $$("[data-pix]").forEach(function (el) {
    if (A.pixChave) {
      el.innerHTML = Pix.bloco(A, "apoie");
    } else {
      el.innerHTML = '<p class="muted">A chave Pix será publicada aqui em breve.</p>';
    }
  });
  $$("[data-plataformas-apoio]").forEach(function (el) {
    var p = [["itchio", "itch.io", "doe em dólar, por cartão ou PayPal"], ["apoiase", "Apoia.se", "apoio mensal"], ["livepix", "LivePix", "doação avulsa com mensagem"], ["kofi", "Ko-fi", "para quem está fora do Brasil"]]
      .filter(function (x) { return A[x[0]]; });
    if (!p.length) { el.hidden = true; return; }
    el.innerHTML = p.map(function (x) {
      return '<div class="download"><div><strong>' + x[1] + "</strong><br><small>" + x[2] + '</small></div><a class="btn btn--ghost" href="' + esc(A[x[0]]) + '" target="_blank" rel="noopener">Abrir</a></div>';
    }).join("");
  });

  /* ---------- contato ---------- */
  var C = D.contato || {};
  $$("[data-email]").forEach(function (el) { el.textContent = C.email; if (el.tagName === "A") el.href = "mailto:" + C.email; });
  $$("[data-instagram]").forEach(function (el) { el.href = "https://instagram.com/" + C.instagram; if (!el.textContent.trim()) el.textContent = "@" + C.instagram; });
  $$("[data-discord]").forEach(function (el) { if (C.discord) el.href = C.discord; else el.hidden = true; });
  $$("[data-facebook]").forEach(function (el) { if (C.facebook) el.href = C.facebook; else el.hidden = true; });
  $$("[data-youtube]").forEach(function (el) { if (C.youtube) el.href = C.youtube; else el.hidden = true; });

  /* ---------- copiar ---------- */
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-copiar]"); if (!b) return;
    var alvo = document.getElementById(b.getAttribute("data-copiar")); if (!alvo) return;
    var txt = (alvo.value != null ? alvo.value : alvo.textContent).trim(), msgOk = b.getAttribute("data-aviso") || "Copiado";
    var aviso = function (m) { var t = document.createElement("div"); t.className = "toast"; t.textContent = m; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 1800); };
    var selecionar = function () {
      if (alvo.select) { alvo.focus(); alvo.select(); }
      else { var r = document.createRange(); r.selectNodeContents(alvo); var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); }
      aviso("Selecionado: copie com Ctrl+C (Cmd+C no Mac)");
    };
    try {
      navigator.clipboard.writeText(txt).then(function () { aviso(msgOk); }, selecionar);
    } catch (e) { selecionar(); }
  });

  /* ---------- TV da home: a fala "traduz" sozinha ---------- */
  $$("[data-tv]").forEach(function (tv) {
    var fala = $(".fala-texto", tv), quem = $(".quem", tv), en = $("[data-en]", tv), pt = $("[data-pt]", tv);
    var cenas = [
      { q: "Tela de título", en: "PRESS START BUTTON", pt: "APERTE O BOTÃO START" },
      { q: "Menu", en: "Save your progress?", pt: "Deseja salvar o progresso?" },
      { q: "Item obtido", en: "You got a cassette tape.", pt: "Você conseguiu uma fita cassete." },
      { q: "Opções", en: "Subtitles: ON", pt: "Legendas: LIGADAS" }
    ];
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var i = 0;
    var GLIFOS = "▓▒░#@%&$*+=?";
    function idioma(ptAtivo) { en.classList.toggle("ativo", !ptAtivo); pt.classList.toggle("ativo", ptAtivo); }
    function digitar(t, cb) {
      var k = 0; fala.textContent = "";
      (function passo() { fala.textContent = t.slice(0, ++k); if (k < t.length) setTimeout(passo, 38); else setTimeout(cb, 1300); })();
    }
    function embaralhar(de, para, cb) {
      var n = 0, max = 14, L = Math.max(de.length, para.length);
      (function passo() {
        n++;
        var corte = Math.floor(L * n / max), s = "";
        for (var x = 0; x < L; x++) s += x < corte ? (para[x] || "") : (de[x] && de[x] !== " " ? GLIFOS[(x + n) % GLIFOS.length] : " ");
        fala.textContent = s;
        if (n < max) setTimeout(passo, 55); else { fala.textContent = para; setTimeout(cb, 2400); }
      })();
    }
    function cena() {
      var c = cenas[i++ % cenas.length];
      quem.textContent = c.q; idioma(false);
      digitar(c.en, function () { idioma(true); embaralhar(c.en, c.pt, cena); });
    }
    setTimeout(cena, 1800);
  });
})();
