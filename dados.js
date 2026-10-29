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
    pixCidade: "",       // cidade do recebedor para o QR Code do Pix (opcional; vazio = "BRASIL")
    itchio: "https://matrixoldgames.itch.io",          // seu perfil no itch.io, ex.: "https://matrixoldgames.itch.io"
    apoiase: "",         // ex.: "https://apoia.se/matrixoldgames"
    livepix: "",         // ex.: "https://livepix.gg/matrixoldgames"
    kofi: ""             // ex.: "https://ko-fi.com/matrixoldgames"
  },

  // apoiadores: aparecem na página "Apoiadores". "nota" é opcional (canal, grupo, apelido)
  apoiadores: [
    { nome: "Adriano Andrade dos Santos" },
    { nome: "André Oliveira da Cruz" },
    { nome: "Dan Carvalho" },
    { nome: "Davi Damasceno Vieira Rosa" },
    { nome: "Pablo Rodrigues Machado" },
    { nome: "Ricardo Ravi", nota: "Dreamcast Nostalgia" },
    { nome: "Thiago Usley Silva de Oliveira" },
    { nome: "Wellinton Martins Correia" },
    { nome: "Wesley G Holanda" },
    { nome: "William da Silva Sampaio" }
  ],

  traducoes: [
    {
      id: "shenmue",
      pagina: "shenmue.html",
      titulo: "Shenmue",
      plataforma: "Dreamcast",
      ano: 1999,
      tradutor: "MatrixHK",
      capa: "assets/jogos/shenmue/shenmue-capa.jpg",
      resumo: "Tradução completa dos 3 discos para português do Brasil: menus, itens, legendas e diálogos, mantendo fontes, cores e o visual originais.",
      destaque: true,    // aparece em destaque na página inicial
      base: { regiao: "USA (NTSC-U)", versao: "v1.003", formato: "GDI ou CUE/BIN (Redump), original e sem modificações", hash: "" }, // hash: MD5 do GDI/track original esperado
      itch: "",          // página deste jogo no itch.io (com preço mínimo US$ 0), ex.: "https://matrixoldgames.itch.io/shenmue-ptbr"
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
          "Menu de \"ir rápido\" no portão de casa (\"Para onde você quer ir?\")",
          "Telas do VMU (salvando, carregando, concluído e telas da batalha) e logo com selo PT-BR",
          "Caderno do Ryo, itens, golpes, bússola, avisos e textos do jogo",
          "Acentuação completa (á, é, ç, ã, õ etc.)",
          "O jogo começa no Modo Jogo (voz + legendas) por padrão",
          "Capa própria do GDEMU"
        ],
        "Disco 2": [
          "Todas as legendas das cutscenes: armazéns do porto, Mestre Chen, porão do dojo e o Espelho da Fênix, viagem para Hong Kong, Jimmy, Chai, Goro e mais",
          "Todas as conversas com moradores, incluindo o porto (Novo e Antigo Distrito dos Armazéns)",
          "Menus, telas do VMU, caderno, itens e textos do jogo, como no Disco 1",
          "Capa própria do GDEMU"
        ],
        "Disco 3": [
          "Todas as legendas das cutscenes: emprego no porto e a empilhadeira, Goro, Mark, Mad Angels, Terry, o Long Zha, golpes ensinados pelo Mestre Chen, Gui Zhang, Tom e o velho do porto, despedidas do Tom e da Nozomi",
          "Todas as conversas com moradores, colegas da Alpha Trading, seguranças e trabalhadores do porto",
          "Menus, telas do VMU, caderno, itens e textos do jogo, como nos outros discos",
          "Capa própria do GDEMU"
        ]
      },
      observacoes: [
        "Aplique sempre sobre a imagem ORIGINAL. Aplicar sobre uma imagem já modificada pode dar erro ou travar o jogo.",
        "Não troque os discos: cada patch só funciona na imagem original do mesmo disco.",
        "Atualizando de uma versão anterior (1.0 a 1.3): aplique a 1.4 sobre a imagem original, não sobre a já traduzida. Os saves das versões anteriores continuam funcionando.",
        "Atualize os três discos para a 1.4, para manter o mesmo texto e a mesma versão nos menus do começo ao fim.",
        "Quando o jogo pedir o próximo disco, troque para a imagem traduzida desse disco e continue com o mesmo save.",
        "Saves de outras versões mantêm o modo de legenda gravado. Para trocar, vá em Opções > Diálogo e Texto e escolha Modo Jogo.",
        "Os nomes dos golpes ficaram em inglês, como no resto do jogo (ex.: Swallow Flip, Tornado Kick, Shadow Step).",
        "O Shenmue Passport (4º disco, extras online) não faz parte desta tradução.",
        "A tela \"Produced by or under license from SEGA\" é do console e fica em inglês em todas as versões oficiais."
      ],
      discos: [
        // patcher online: só a versão mais recente de cada disco (blocos gerados a partir do resumo.json do mog_gerar_patch.py)
        {
          nome: "Disco 1", versao: "1.4",
          etapas: { menus: "ok", dialogos: "ok", testes: "ok" },
          download: "https://github.com/MatrixOldGames/traducoes/releases/download/shenmue1_v1.4/Shenmue_Disc_1_PTBR_1.4.dcp",
          espelho: "https://drive.google.com/drive/folders/1-Y__UB633BdCS-kHjTKGcJVeg59hwwpZ?usp=drive_link",
          patcher: {
            pasta: "Shenmue PT-BR - Disco 1",
            gdi: "6\n1 0 4 2352 track01.bin 0\n2 450 0 2352 track02.raw 0\n3 45000 4 2352 track03.bin 0\n4 195298 0 2352 track04.raw 0\n5 195898 0 2352 track05.raw 0\n6 196739 4 2352 track06.bin 0\n",
            faixas: [
              { nome: "track01.bin", tamanho: 705600, md5: "91f5df82824ebd3ad7e9cf563be0d52d", patch: "patches/shenmue/disco1-v1.4/track01.xdelta", tamanhoFinal: 705600 },
              { nome: "track02.raw", tamanho: 1733424 },
              { nome: "track03.bin", tamanho: 355079088, patch: "patches/shenmue/disco1-v1.4/track03.xdelta", tamanhoFinal: 353148096 },
              { nome: "track04.raw", tamanho: 1411200 },
              { nome: "track05.raw", tamanho: 1625232 },
              { nome: "track06.bin", tamanho: 826939680, patch: ["patches/shenmue/disco1-v1.4/track06.xdelta.parte1", "patches/shenmue/disco1-v1.4/track06.xdelta.parte2"], tamanhoFinal: 828870672 }
            ]
          }
        },
        {
          nome: "Disco 2", versao: "1.4",
          etapas: { menus: "ok", dialogos: "ok", testes: "ok" },
          download: "https://github.com/MatrixOldGames/traducoes/releases/download/shenmue1_v1.4/Shenmue_Disc_2_PTBR_1.4.dcp",
          espelho: "https://drive.google.com/drive/folders/1-Y__UB633BdCS-kHjTKGcJVeg59hwwpZ?usp=drive_link",
          patcher: {
            pasta: "Shenmue PT-BR - Disco 2",
            gdi: "6\n1 0 4 2352 track01.bin 0\n2 450 0 2352 track02.raw 0\n3 45000 4 2352 track03.bin 0\n4 225164 0 2352 track04.raw 0\n5 225764 0 2352 track05.raw 0\n6 226605 4 2352 track06.bin 0\n",
            faixas: [
              { nome: "track01.bin", tamanho: 705600, md5: "347ae87c7f1cf09020ccb81025790159", patch: "patches/shenmue/disco2-v1.4/track01.xdelta", tamanhoFinal: 705600 },
              { nome: "track02.raw", tamanho: 1851024 },
              { nome: "track03.bin", tamanho: 425328624, patch: "patches/shenmue/disco2-v1.4/track03.xdelta", tamanhoFinal: 423392928 },
              { nome: "track04.raw", tamanho: 1411200 },
              { nome: "track05.raw", tamanho: 1625232 },
              { nome: "track06.bin", tamanho: 756690144, patch: ["patches/shenmue/disco2-v1.4/track06.xdelta.parte1", "patches/shenmue/disco2-v1.4/track06.xdelta.parte2"], tamanhoFinal: 758625840 }
            ]
          }
        },
        {
          nome: "Disco 3", versao: "1.4",
          etapas: { menus: "ok", dialogos: "ok", testes: "ok" },
          download: "https://github.com/MatrixOldGames/traducoes/releases/download/shenmue1_v1.4/Shenmue_Disc_3_PTBR_1.4.dcp",
          espelho: "https://drive.google.com/drive/folders/1-Y__UB633BdCS-kHjTKGcJVeg59hwwpZ?usp=drive_link",
          patcher: {
            pasta: "Shenmue PT-BR - Disco 3",
            gdi: "6\n1 0 4 2352 track01.bin 0\n2 450 0 2352 track02.raw 0\n3 45000 4 2352 track03.bin 0\n4 179485 0 2352 track04.raw 0\n5 180085 0 2352 track05.raw 0\n6 189669 4 2352 track06.bin 0\n",
            faixas: [
              { nome: "track01.bin", tamanho: 705600, md5: "f37953d817c75581dd167d52423139e7", patch: "patches/shenmue/disco3-v1.4/track01.xdelta", tamanhoFinal: 705600 },
              { nome: "track02.raw", tamanho: 2483712 },
              { nome: "track03.bin", tamanho: 317886912, patch: "patches/shenmue/disco3-v1.4/track03.xdelta", tamanhoFinal: 315955920 },
              { nome: "track04.raw", tamanho: 1411200 },
              { nome: "track05.raw", tamanho: 22188768 },
              { nome: "track06.bin", tamanho: 843568320, patch: ["patches/shenmue/disco3-v1.4/track06.xdelta.parte1", "patches/shenmue/disco3-v1.4/track06.xdelta.parte2"], tamanhoFinal: 845499312 }
            ]
          }
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
        { versao: "1.4", data: "21/10/2026", notas: [
          "Menu de \"ir rápido\" no portão de casa (\"Para onde você quer ir?\") traduzido nos três discos (antes aparecia em inglês)",
          "Telas do VMU agora dizem \"Não remova o VMU\", o termo usado no Brasil",
          "Novo rodapé nas telas de título e menu: \"Ver. 1.4 - Tradução - MatrixHK\", com fonte mais legível, inclusive em TV de tubo"
        ] },
        { versao: "1.3", data: "18/10/2026", notas: [
          "Disco 3 traduzido: cutscenes (emprego no porto e a empilhadeira, Goro, Mark, Mad Angels, Terry, o Long Zha, golpes ensinados pelo Mestre Chen, Gui Zhang, Tom e o velho do porto, despedidas do Tom e da Nozomi…) e todas as conversas com moradores, colegas da Alpha Trading, seguranças e trabalhadores do porto",
          "Capa própria do GDEMU para o Disco 3",
          "Tela de título e opções mostram \"Versão 1.3\"",
          "Com o Disco 3, a tradução do Shenmue está completa"
        ] },
        { versao: "1.2", data: "18/10/2026", notas: [
          "Disco 2 traduzido: cutscenes (armazéns do porto, Mestre Chen, porão do dojo e o Espelho da Fênix, viagem para Hong Kong, Jimmy, Chai, Goro…) e todas as conversas com os moradores",
          "Disco 1: perguntas do Ryo agora neutras no tratamento (antes ele podia perguntar \"A senhora conhece…?\" para um senhor)",
          "Capa própria do GDEMU para cada disco",
          "Tela de título e opções mostram \"Versão 1.2\""
        ] },
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
    },
    {
      id: "shenmue2",
      pagina: "shenmue2.html",
      titulo: "Shenmue II",
      plataforma: "Dreamcast",
      ano: 2001,
      tradutor: "MatrixHK",
      capa: "assets/jogos/shenmue2/shenmue2-capa.jpg",
      resumo: "A continuação da jornada de Ryo em Hong Kong. Os Discos 1 e 2 já estão em português, com o mesmo cuidado de fontes, cores e visual do primeiro jogo.",
      //destaque: true,    // aparece em destaque na página inicial
      base: { regiao: "Europa (PAL)", versao: "v1.001", formato: "GDI ou CUE/BIN (Redump), original e sem modificações", hash: "" }, // hash: MD5 do GDI/track original esperado
      itch: "",
      ferramenta: { nome: "Universal Dreamcast Patcher", url: "https://github.com/DerekPascarella/UniversalDreamcastPatcher" },
      guia: { nome: "guia de patches do ConsoleMods", url: "https://consolemods.org/wiki/Dreamcast:Applying_ROM_Patches" },
      compativel: "Dreamcast com GDEMU, MODE ou USB-GDROM, e emuladores como Flycast e Redream.",
      // o que já está traduzido (lista atual, por disco)
      traduzido: {
        "Disco 1": [
          "Todas as legendas das cutscenes",
          "Todas as conversas com moradores, comerciantes e NPCs",
          "Tela de título (\"APERTE O BOTÃO START\"), menus, opções, telas de carregamento, salvar/carregar e cartão de memória",
          "Telas do VMU (salvando, carregando, concluído etc.)",
          "Nomes de lugares nas telas de carregamento e no mapa: tipo do lugar traduzido + nome próprio (ex.: Casa de Penhores Mercado Verde, Café dos Pombos)",
          "Caderno do Ryo, itens, coleção, lista de golpes, ajudas e instruções dos minigames e trabalhos, avisos e textos do jogo",
          "Acentuação completa (á, é, ç, ã, õ etc.)",
          "Capa própria do GDEMU"
        ],
        "Disco 2": [
          "Wan Chai e Aberdeen, até a partida para Kowloon: todas as legendas das cutscenes",
          "Todas as conversas com moradores, comerciantes e NPCs",
          "Menus, telas do VMU, caderno, itens e textos do jogo, como no Disco 1",
          "Capa própria do GDEMU"
        ]
      },
      observacoes: [
        "Aplique sempre sobre a imagem ORIGINAL. Aplicar sobre uma imagem já modificada pode dar erro ou travar o jogo.",
        "Não troque os discos: cada patch só funciona na imagem original do mesmo disco.",
        "Quem já tem a 1.0: aplique o patch 1.1 do Disco 1 sobre a imagem original, não sobre a já traduzida. Os saves da 1.0 continuam funcionando.",
        "A versão europeia tem vários idiomas e a tradução ocupa o lugar do inglês. Se o jogo aparecer em outro idioma, ajuste o idioma do Dreamcast (ou do emulador) para English.",
        "O Shenmue II traduzido aceita o save de final de jogo do Shenmue 1, tanto da versão europeia quanto da americana, incluindo o save da tradução PT-BR do Shenmue 1. Não é preciso converter o save.",
        "Os Discos 3 e 4 virão nas próximas versões. Ao trocar para um disco ainda não traduzido, o jogo continua normalmente, mas em inglês.",
        "Os nomes dos golpes ficaram em inglês, como no Shenmue 1 (ex.: Swallow Flip, Tornado Kick, Iron Palm).",
        "Nomes de gangues e de alguns estabelecimentos ficaram como no original (ex.: Heavens, Lucky Hit, Swing).",
        "As vozes continuam em inglês; a tradução está nas legendas e textos.",
        "A tela \"Produced by or under license from SEGA\" é do console e fica em inglês em todas as versões oficiais."
      ],
      discos: [
        // patcher online: só a versão mais recente de cada disco (blocos gerados a partir do resumo.json do mog_gerar_patch.py)
        {
          nome: "Disco 1", versao: "1.1",
          etapas: { menus: "ok", dialogos: "ok", testes: "ok" },
          download: "https://github.com/MatrixOldGames/traducoes/releases/download/shenmue2_v1.1/Shenmue2_Disc_1_PTBR_1.1.dcp",
          espelho: "https://drive.google.com/drive/folders/1cNDF2RjwknRwlbvE7M6GSZu3wusQVDIY?usp=share_link",
          patcher: {
            pasta: "Shenmue II PT-BR - Disco 1",
            gdi: "6\n1 0 4 2352 track01.bin 0\n2 480 0 2352 track02.raw 0\n3 45000 4 2352 track03.bin 0\n4 101909 0 2352 track04.raw 0\n5 102509 0 2352 track05.raw 0\n6 103350 4 2352 track06.bin 0\n",
            faixas: [
              { nome: "track01.bin", tamanho: 776160, md5: "2da6c577d816aead233010104c98b165", patch: "patches/shenmue2/disco1-v1.1/track01.xdelta", tamanhoFinal: 776160 },
              { nome: "track02.raw", tamanho: 13994400 },
              { nome: "track03.bin", tamanho: 133407792, patch: "patches/shenmue2/disco1-v1.1/track03.xdelta", tamanhoFinal: 133497168 },
              { nome: "track04.raw", tamanho: 1411200 },
              { nome: "track05.raw", tamanho: 1625232 },
              { nome: "track06.bin", tamanho: 1048610976, patch: ["patches/shenmue2/disco1-v1.1/track06.xdelta.parte1", "patches/shenmue2/disco1-v1.1/track06.xdelta.parte2", "patches/shenmue2/disco1-v1.1/track06.xdelta.parte3"], tamanhoFinal: 1048521600 }
            ]
          }
        },
        {
          nome: "Disco 2", versao: "1.1",
          etapas: { menus: "ok", dialogos: "ok", testes: "ok" },
          download: "https://github.com/MatrixOldGames/traducoes/releases/download/shenmue2_v1.1/Shenmue2_Disc_2_PTBR_1.1.dcp",
          espelho: "https://drive.google.com/drive/folders/1cNDF2RjwknRwlbvE7M6GSZu3wusQVDIY?usp=share_link",
          patcher: {
            pasta: "Shenmue II PT-BR - Disco 2",
            gdi: "3\n1 0 4 2352 track01.bin 0\n2 973 0 2352 track02.raw 0\n3 45000 4 2352 track03.bin 0\n",
            faixas: [
              { nome: "track01.bin", tamanho: 1935696, md5: "0bdb3e13031566c10c70ca80a145803f", patch: "patches/shenmue2/disco2-v1.1/track01.xdelta", tamanhoFinal: 1935696 },
              { nome: "track02.raw", tamanho: 13994400 },
              { nome: "track03.bin", tamanho: 1185760800, patch: ["patches/shenmue2/disco2-v1.1/track03.xdelta.parte1", "patches/shenmue2/disco2-v1.1/track03.xdelta.parte2", "patches/shenmue2/disco2-v1.1/track03.xdelta.parte3"], tamanhoFinal: 1185760800 }
            ]
          }
        },
        { nome: "Disco 3", versao: "", etapas: { menus: "ok", dialogos: "andamento", testes: "pendente" }, download: "", espelho: "" },
        { nome: "Disco 4", versao: "", etapas: { menus: "pendente", dialogos: "pendente", testes: "pendente" }, download: "", espelho: "" }
      ],
      prints: [],
      changelog: [
        { versao: "1.1", data: "29/10/2026", notas: [
          "Disco 2 traduzido por completo (Wan Chai e Aberdeen, até a partida para Kowloon): todas as legendas das cutscenes e todas as conversas com moradores, comerciantes e NPCs",
          "Disco 1: corrigido o travamento na tela de mapas (lista de bairros de Wan Chai), com os nomes ajustados ao limite do jogo",
          "Nomes de lugares padronizados: tipo do lugar traduzido + nome próprio (ex.: Casa de Penhores Mercado Verde, Café Moon, Shopping Dourado, Bairro Carmain do Sul). O bar Swing ficou com o nome original",
          "Menu rápido: \"Local de Ontem\" e \"Carmain do Sul\"",
          "Lishao Tao passa a ser tratada como \"a Mestra\" depois que o Ryo descobre quem ela é",
          "Nomes dos golpes sempre em inglês (ex.: Iron Palm)",
          "Caderno do Ryo: anotações sobre artes marciais corrigidas",
          "Opções de diálogo com a Fangmei corrigidas (\"Você Consegue\", \"Esforce-se\")",
          "Telas de carregamento e placas de nomes de bairros revisadas",
          "Número da versão atualizado nas telas de título e de opções"
        ] },
        { versao: "1.0", data: "", notas: ["Primeira versão pública do Disco 1."] }
      ]
    }
  ]
};
