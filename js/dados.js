/* =============================================================
   MATRIX OLD GAMES — DADOS DO SITE
   Este é o único arquivo que você precisa editar no dia a dia.
   - Campo vazio ("") = o site esconde aquele item ou mostra "em breve".
   - Estados das etapas: "ok", "andamento" ou "pendente".
   ============================================================= */
window.MOG = {
  contato: {
    email: "matrixoldgames@gmail.com",
    instagram: "MatrixOldGames",
    facebook: "https://www.facebook.com/MatrixOldGames",
    youtube: "https://www.youtube.com/@MatrixOldGames",
    discord: ""    // link de convite, ex.: "https://discord.gg/xxxx"
  },

  apoio: {
    pixChave: "matrixoldgames@gmail.com",        // sua chave Pix (e-mail, aleatória ou CNPJ/MEI)
    pixNome: "Leandro de Almeida Alonso Garcia", // nome que aparece no app do banco, para conferência
    apoiase: "",         // ex.: "https://apoia.se/matrixoldgames"
    livepix: "",         // ex.: "https://livepix.gg/matrixoldgames"
    kofi: ""             // ex.: "https://ko-fi.com/matrixoldgames"
  },

  traducoes: [
    {
      id: "shenmue",
      pagina: "shenmue.html",
      titulo: "Shenmue",
      plataforma: "Dreamcast",
      ano: 1999,
      tradutor: "MatrixHK",
      capa: "assets/jogos/shenmue/shenmue-capa.jpg",
      resumo: "Tradução completa para português do Brasil: menus, itens, legendas e diálogos, mantendo fontes, cores e o visual originais.",
      base: { regiao: "USA (NTSC-U)", versao: "v1.003", formato: "GDI ou CUE/BIN (Redump), original e sem modificações", hash: "" }, // hash: MD5 do GDI/track original esperado
      ferramenta: { nome: "Universal Dreamcast Patcher", url: "https://github.com/DerekPascarella/UniversalDreamcastPatcher" },
      guia: { nome: "guia de patches do ConsoleMods", url: "https://consolemods.org/wiki/Dreamcast:Applying_ROM_Patches" },
      compativel: "Dreamcast com GDEMU, MODE ou USB-GDROM, e emuladores como Flycast e Redream.",
      // o que já está traduzido (lista atual, por disco)
      traduzido: {
        "Disco 1": [
          "Todas as legendas das cutscenes",
          "Legenda da profecia da Shenhua na abertura (no original ela não tem texto)",
          "Todas as conversas com moradores de Yamanose, Sakuragaoka e Dobuita",
          "Menus, opções, telas de carregamento, salvar/carregar e cartão de memória",
          "Telas do VMU (salvando, carregando, concluído e telas da batalha)",
          "Caderno do Ryo, itens, golpes, bússola, avisos e textos do jogo",
          "Acentuação completa (á, é, ç, ã, õ etc.)",
          "O jogo começa no Modo Jogo (voz + legendas) por padrão"
        ]
      },
      observacoes: [
        "Aplique sempre sobre a imagem ORIGINAL. Aplicar sobre uma imagem já modificada pode dar erro ou travar o jogo.",
        "Atualizando da 1.0: aplique o patch 1.1 sobre a imagem original, não sobre a imagem já traduzida. Os saves da 1.0 continuam funcionando.",
        "Saves de outras versões funcionam, mas mantêm o modo de legenda gravado. Para trocar, vá em Opções > Diálogo e Texto e escolha Modo Jogo.",
        "A tela \"Produced by or under license from SEGA\" é do console e fica em inglês em todas as versões oficiais."
      ],
      discos: [
        {
          nome: "Disco 1", versao: "1.1",
          etapas: { menus: "ok", dialogos: "ok", testes: "ok" },
          download: "",     // link do patch .dcp (GitHub Releases ou Google Drive)
          espelho: ""       // link alternativo (opcional)
        },
        {
          nome: "Disco 2", versao: "",
          etapas: { menus: "ok", dialogos: "andamento", testes: "pendente" },
          download: "", espelho: ""
        },
        {
          nome: "Disco 3", versao: "",
          etapas: { menus: "pendente", dialogos: "pendente", testes: "pendente" },
          download: "", espelho: ""
        }
      ],
      // prints: pares antes/depois do carrossel. "mini" é a miniatura (opcional); vmu: true deixa os pixels nítidos.
      prints: [
        { antes: "assets/jogos/shenmue/shenmue-01-en.jpg", depois: "assets/jogos/shenmue/shenmue-01-pt.jpg", mini: "assets/jogos/shenmue/shenmue-01-mini.jpg", legenda: "Tela de título" },
        { antes: "assets/jogos/shenmue/shenmue-02-en.jpg", depois: "assets/jogos/shenmue/shenmue-02-pt.jpg", mini: "assets/jogos/shenmue/shenmue-02-mini.jpg", legenda: "Menu inicial" },
        { antes: "assets/jogos/shenmue/shenmue-03-en.jpg", depois: "assets/jogos/shenmue/shenmue-03-pt.jpg", mini: "assets/jogos/shenmue/shenmue-03-mini.jpg", legenda: "Aviso do cartão de memória" },
        { antes: "assets/jogos/shenmue/shenmue-04-en.jpg", depois: "assets/jogos/shenmue/shenmue-04-pt.jpg", mini: "assets/jogos/shenmue/shenmue-04-mini.jpg", legenda: "Legendas das cutscenes" },
        { antes: "assets/jogos/shenmue/shenmue-05-en.jpg", depois: "assets/jogos/shenmue/shenmue-05-pt.jpg", mini: "assets/jogos/shenmue/shenmue-05-mini.jpg", legenda: "Passagem de tempo" },
        { antes: "assets/jogos/shenmue/shenmue-06-en.jpg", depois: "assets/jogos/shenmue/shenmue-06-pt.jpg", mini: "assets/jogos/shenmue/shenmue-06-mini.jpg", legenda: "Caderno do Ryo" },
        { antes: "assets/jogos/shenmue/shenmue-07-en.jpg", depois: "assets/jogos/shenmue/shenmue-07-pt.jpg", mini: "assets/jogos/shenmue/shenmue-07-mini.jpg", legenda: "Ajuda do caderno" },
        { antes: "assets/jogos/shenmue/shenmue-08-en.jpg", depois: "assets/jogos/shenmue/shenmue-08-pt.jpg", mini: "assets/jogos/shenmue/shenmue-08-mini.jpg", legenda: "Menu de opções" },
        { antes: "assets/jogos/shenmue/shenmue-09-en.jpg", depois: "assets/jogos/shenmue/shenmue-09-pt.jpg", mini: "assets/jogos/shenmue/shenmue-09-mini.jpg", legenda: "Textos de cena" },
        { antes: "assets/jogos/shenmue/shenmue-10-en.jpg", depois: "assets/jogos/shenmue/shenmue-10-pt.jpg", mini: "assets/jogos/shenmue/shenmue-10-mini.jpg", legenda: "Conversas com moradores" },
        { antes: "assets/jogos/shenmue/shenmue-11-en.jpg", depois: "assets/jogos/shenmue/shenmue-11-pt.jpg", mini: "assets/jogos/shenmue/shenmue-11-mini.jpg", legenda: "Perguntas da investigação" },
        { antes: "assets/jogos/shenmue/shenmue-12-en.png", depois: "assets/jogos/shenmue/shenmue-12-pt.png", mini: "assets/jogos/shenmue/shenmue-12-mini.jpg", legenda: "Logo no VMU com o selo PT-BR", vmu: true },
        { antes: "assets/jogos/shenmue/shenmue-13-en.png", depois: "assets/jogos/shenmue/shenmue-13-pt.png", mini: "assets/jogos/shenmue/shenmue-13-mini.jpg", legenda: "Tela de salvamento no VMU", vmu: true }
      ],
      changelog: [
        { versao: "1.1", data: "", notas: [
          "Telas do VMU traduzidas: \"Salvando / Não remova o VM\", \"Carregando\", \"Aguarde\", \"Concluído\", \"Falhou!\" e as telas da batalha",
          "Logo do Shenmue no VMU com o selo PT-BR",
          "Falas genéricas dos moradores agora são neutras em gênero (antes um homem podia dizer \"Ando cansada\")",
          "Respostas curtas fora de contexto corrigidas (a Noriko respondia \"Não, não dei.\" em vez de \"Não, não vi.\")",
          "Tela de título e opções mostram \"Versão 1.1\"",
          "Outros pequenos ajustes de texto"
        ] },
        { versao: "1.0", data: "", notas: ["Primeira versão pública do Disco 1."] }
      ]
    }
  ]
};
