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
      base: { regiao: "USA (NTSC-U)", versao: "v1.003", formato: "GDI", hash: "" }, // hash: MD5 do GDI/track original esperado
      ferramenta: { nome: "Universal Dreamcast Patcher", url: "https://github.com/DerekPascarella/UniversalDreamcastPatcher" },
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
        { versao: "1.1", data: "", notas: ["Revisão do Disco 1."] },
        { versao: "1.0", data: "", notas: ["Primeira versão pública do Disco 1."] }
      ]
    }
  ]
};
