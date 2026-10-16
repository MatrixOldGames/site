/* Matrix Old Games — monta as partes dinâmicas a partir de js/dados.js.
   Não precisa editar este arquivo para atualizar status, links ou jogos. */
(function () {
  "use strict";
  var D = window.MOG || { traducoes: [], apoio: {}, contato: {} };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

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
    var feitos = j.discos.filter(function (d) { return estadoDisco(d) === "ok"; }).length;
    return feitos + " de " + j.discos.length + (j.discos.length > 1 ? " discos lançados" : " disco lançado");
  }
  function ultimoLancado(j) {
    var l = null;
    j.discos.forEach(function (d) { if (estadoDisco(d) === "ok") l = d; });
    return l;
  }

  /* ---------- destaque da home ---------- */
  $$("[data-destaque]").forEach(function (el) {
    var j = D.traducoes.filter(function (t) { return estadoJogo(t) === "andamento"; })[0] || D.traducoes[0];
    if (!j) return;
    el.innerHTML =
      '<div class="section-head"><div class="stack" style="gap:.6rem"><span class="eyebrow">Tradução em destaque</span>' +
      "<h2>" + esc(j.titulo) + '</h2><div class="jogo-meta"><span class="tag tag--plat">' + esc(j.plataforma) + '</span><span class="tag">' + esc(j.ano) + '</span><span class="tag">' + resumoJogo(j) + "</span></div></div>" +
      '<a class="btn btn--ghost" href="' + esc(j.pagina) + '">Página da tradução</a></div>' +
      '<div class="slots">' + j.discos.map(slot).join("") + "</div>";
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
    if (f) f.innerHTML =
      "<dt>Plataforma</dt><dd>" + esc(J.plataforma) + "</dd>" +
      "<dt>Lançamento</dt><dd>" + esc(J.ano) + "</dd>" +
      "<dt>Versão base</dt><dd>" + esc(J.base.regiao) + " · " + esc(J.base.versao) + "</dd>" +
      "<dt>Formato</dt><dd>" + esc(J.base.formato) + "</dd>" +
      (J.base.hash ? '<dt>MD5 esperado</dt><dd class="mono">' + esc(J.base.hash) + "</dd>" : "") +
      "<dt>Tradução</dt><dd>" + esc(J.tradutor) + "</dd>";

    var dl = $("[data-downloads]");
    if (dl) dl.innerHTML = J.discos.map(function (d) {
      var ok = estadoDisco(d) === "ok";
      var botao = ok && d.download
        ? '<a class="btn" href="' + esc(d.download) + '" target="_blank" rel="noopener">Baixar</a>'
        : '<span class="btn" aria-disabled="true">' + (ok ? "Em breve" : "Aguarde") + "</span>";
      var sub = ok
        ? "patch .dcp · v" + esc(d.versao) + (d.espelho ? ' · <a href="' + esc(d.espelho) + '" target="_blank" rel="noopener">espelho</a>' : "")
        : NOME_ESTADO[estadoDisco(d)];
      return '<div class="download"><div><strong>' + esc(d.nome) + "</strong><br><small>" + sub + "</small></div>" + botao + "</div>";
    }).join("");

    if (J.ferramenta) $$("[data-ferramenta]").forEach(function (fe) { fe.textContent = J.ferramenta.nome; fe.href = J.ferramenta.url; });
    $$("[data-versao-base]").forEach(function (x) { x.textContent = J.base.regiao + " " + J.base.versao; });
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
        pr.innerHTML = J.prints.map(function (p, i) {
          return '<figure class="stack" style="gap:.5rem;margin:0"><div class="compara" style="--corte:50%">' +
            '<img src="' + esc(p.antes) + '" alt="Tela original em inglês" loading="lazy">' +
            '<img class="depois" src="' + esc(p.depois) + '" alt="Mesma tela traduzida" loading="lazy">' +
            '<span class="linha"></span><span class="rot rot--a">ORIGINAL</span><span class="rot rot--d">PT-BR</span>' +
            '<input type="range" min="0" max="100" value="50" id="compara-' + i + '" aria-label="Arraste para comparar">' +
            '</div>' + (p.legenda ? '<figcaption class="muted mono" style="font-size:var(--s-0)">' + esc(p.legenda) + "</figcaption>" : "") + "</figure>";
        }).join("");
        $$(".compara input", pr).forEach(function (inp) {
          inp.addEventListener("input", function () { inp.parentNode.style.setProperty("--corte", inp.value + "%"); });
        });
      }
    }

    var ch = $("[data-changelog]");
    if (ch) ch.innerHTML = J.changelog.map(function (c) {
      return '<li><span class="v">v' + esc(c.versao) + "</span><div>" + (c.data ? '<span class="mono muted" style="font-size:var(--s-0)">' + esc(c.data) + "</span>" : "") +
        "<ul>" + c.notas.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul></div></li>";
    }).join("");
  }

  /* ---------- apoio ---------- */
  var A = D.apoio || {};
  $$("[data-pix]").forEach(function (el) {
    if (A.pixChave) {
      el.innerHTML = '<div class="chave"><code id="chave-pix">' + esc(A.pixChave) + '</code><button type="button" class="btn" data-copiar="chave-pix">Copiar chave</button></div>' +
        (A.pixNome ? '<p class="muted" style="font-size:var(--s-1)">Confira no app do banco: <strong style="color:var(--fg)">' + esc(A.pixNome) + "</strong></p>" : "");
    } else {
      el.innerHTML = '<p class="muted">A chave Pix será publicada aqui em breve.</p>';
    }
  });
  $$("[data-plataformas-apoio]").forEach(function (el) {
    var p = [["apoiase", "Apoia.se", "apoio mensal"], ["livepix", "LivePix", "doação avulsa com mensagem"], ["kofi", "Ko-fi", "para quem está fora do Brasil"]]
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
  $$("[data-youtube]").forEach(function (el) { if (C.youtube) el.href = C.youtube; else el.hidden = true; });

  /* ---------- copiar ---------- */
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-copiar]"); if (!b) return;
    var alvo = document.getElementById(b.getAttribute("data-copiar")); if (!alvo) return;
    var txt = alvo.textContent.trim();
    var aviso = function (m) { var t = document.createElement("div"); t.className = "toast"; t.textContent = m; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 1800); };
    var selecionar = function () { var r = document.createRange(); r.selectNodeContents(alvo); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); aviso("Chave selecionada, copie com Ctrl+C"); };
    try {
      navigator.clipboard.writeText(txt).then(function () { aviso("Chave copiada"); }, selecionar);
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
