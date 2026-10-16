/* =============================================================
   MATRIX OLD GAMES — DADOS DO SITE
   Este é o único arquivo que você precisa editar no dia a dia.
   - Campo vazio ("") = o site esconde aquele item ou mostra "em breve".
   - Estados das etapas: "ok", "andamento" ou "pendente".
   ============================================================= */
window.MOG = {
  contato: {
    email: "matrixoldgames@gmail.com",
    instagram: "matrixoldgames",
    discord: "",   // link de convite, ex.: "https://discord.gg/xxxx"
    youtube: ""    // link do canal
  },

  apoio: {
    pixChave: "matrixoldgames@gmail.com",        // sua chave Pix (e-mail, aleatória ou CNPJ/MEI)
    pixNome: "Leandro de Almeida Alonso Garcia",         // nome que aparece no app do banco, para conferência
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
      capa: "",          // ex.: "assets/jogos/shenmue-capa.jpg" (arte sua, sem logo oficial)
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
          etapas: { menus: "andamento", dialogos: "pendente", testes: "pendente" },
          download: "", espelho: ""
        },
        {
          nome: "Disco 3", versao: "",
          etapas: { menus: "pendente", dialogos: "pendente", testes: "pendente" },
          download: "", espelho: ""
        }
      ],
      // prints: pares antes/depois. Ex.: { antes: "assets/jogos/shenmue-01-en.png", depois: "assets/jogos/shenmue-01-pt.png", legenda: "Menu de itens" }
      prints: [],
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
