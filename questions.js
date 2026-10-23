/**
 * Banco de atividades da Trilha Mágica.
 * Conteúdo transcrito do PDF fornecido pelo grupo; cada nível possui dez questões.
 * `mode` identifica o componente interativo que o app.js deve apresentar.
 */
(() => {
  const q = (title, instruction, mode, prompt, data) => ({ title, instruction, mode, prompt, ...data });

  window.questionBank = {
    "Fácil": [
      q("Monte a palavra", "Toque nas sílabas na ordem certa.", "syllables", "Ouça e forme a palavra GATO.", { audio: "audio/facil-01-gato.mp3", icon: "🐱", parts: 2, options: ["TO", "GA"], answer: "GA-TO" }),
      q("Ligue a letra à imagem", "Toque na imagem que começa com a letra A.", "identify", "Qual imagem começa com a letra A?", { audio: "audio/facil-02-letra-a.mp3", target: "A", imageOnly: true, options: ["🐝 Abelha", "🐱 Gato", "🐶 Cachorro"], answer: "🐝 Abelha" }),
      q("Alimente o personagem", "Toque nas maçãs até escolher a quantidade pedida.", "count", "Quero 3 maçãs!", { audio: "audio/facil-03-contar-macas.mp3", guide: "👦", icon: "🍎", pool: 5, target: 3, answer: "3" }),
      q("Complete a quantidade", "Adicione peixes até completar a quantidade.", "add", "Coloque peixes suficientes para termos 5.", { audio: "audio/facil-04-adicionar-peixes.mp3", icon: "🐟", initial: 2, target: 5, options: ["1", "2", "3", "4"], answer: "3" }),
      q("Quem tem mais?", "Conte as maçãs de cada personagem.", "compare", "Quem tem mais maçãs?", { audio: "audio/facil-05-comparar-macas.mp3", left: 2, right: 4, leftName: "🐰 Coelho", rightName: "🐻 Urso", answer: "right" }),
      q("Continue a sequência", "Observe o padrão e escolha a próxima figura.", "pattern", "Qual figura deve aparecer?", { audio: "audio/facil-06-padrao-cores.mp3", series: "🔴 🔵 🔴 🔵 ?", options: ["🟢", "🔴", "🟡", "🔵"], answer: "🔴" }),
      q("Onde esse animal mora?", "Toque no lugar onde o peixe vive.", "identify", "Onde o peixe mora?", { audio: "audio/facil-07-casa-peixe.mp3", target: "🐟", options: ["🌲 Floresta", "🏡 Casa", "🌊 Água", "Nenhum"], answer: "🌊 Água" }),
      q("Quem faz esse som?", "Ouça com atenção: Muuuu!", "identify", "Qual animal faz esse som?", { audio: "audio/facil-08-som-vaca.mp3", target: "Muuuu!", options: ["🐶 Cachorro", "🐱 Gato", "🐮 Vaca", "Nenhum"], answer: "🐮 Vaca" }),
      q("Ajude o personagem", "Siga os quadrados marrons até a casa.", "maze", "Leve o personagem até a casa usando as setas.", { audio: "audio/medio-08-caminho-casa.mp3", rows: 4, columns: 8, start: [1, 0], goal: [1, 7], route: ["➡️", "➡️", "➡️", "➡️", "➡️", "➡️", "➡️"], answer: "chegou" }),
      q("Encontre a figura igual", "Observe a estrela e escolha a figura igual.", "identify", "Qual figura é igual ao modelo?", { audio: "audio/facil-10-figura-igual.mp3", target: "⭐", options: ["❤️", "⭐", "🔵", "🟢"], answer: "⭐" })
    ],
    "Médio": [
      q("Monte a palavra", "Toque nas sílabas na ordem certa.", "syllables", "Ouça e forme a palavra BORBOLETA.", { audio: "audio/medio-01-borboleta.mp3", icon: "🦋", parts: 4, options: ["LE", "TA", "BOR", "BO"], answer: "BOR-BO-LE-TA" }),
      q("Ligue a letra à imagem", "Ligue cada letra à imagem correspondente.", "link", "Encontre os três pares.", { audio: "audio/medio-02-ligar-letras.mp3", leftLabel: "Letras", rightLabel: "Imagens", pairs: [["B", "🦋"], ["M", "🐒"], ["P", "🥞"]] }),
      q("Qual pedaço está faltando?", "Escolha a sílaba que completa a palavra.", "missing", "Complete CA + ___ + RRO.", { audio: "audio/medio-03-cachorro.mp3", before: "CA", after: "RRO", options: ["CHO", "BO", "RO", "CO"], answer: "CHO" }),
      q("Ouça e encontre", "Ouça a palavra SAPO e toque na figura correspondente.", "identify", "SAPO", { audio: "audio/medio-04-sapo.mp3", target: "SAPO", imageOnly: true, options: ["🐶 Cachorro", "🐱 Gato", "🐸 Sapo", "🐟 Peixe"], answer: "🐸 Sapo" }),
      q("Alimente o personagem", "Toque em exatamente sete maçãs.", "count", "Quero 7 maçãs!", { audio: "audio/medio-05-contar-macas.mp3", guide: "👦", icon: "🍎", pool: 10, target: 7, answer: "7" }),
      q("Complete a quantidade", "Adicione peixes até completar a quantidade.", "add", "Coloque peixes suficientes para termos 8.", { audio: "audio/medio-06-adicionar-peixes.mp3", icon: "🐟", initial: 4, target: 8, options: ["2", "3", "4", "5"], answer: "4" }),
      q("Quem tem mais?", "Conte as maçãs e descubra quem tem mais.", "compare", "Quem tem mais maçãs?", { audio: "audio/medio-07-comparar-macas.mp3", left: 3, right: 5, leftName: "🐰 Coelho", rightName: "🐻 Urso", answer: "right", followup: { prompt: "Quantas maçãs a mais o urso tem?", audio: "audio/medio-07-pergunta-extra.mp3", options: ["2", "3", "1"], answer: "2" } }),
      q("Ajude o personagem a chegar", "Siga os quadrados marrons até a casa.", "maze", "Leve o personagem até a casa usando as setas.", { audio: "audio/medio-08-caminho-casa.mp3", rows: 4, columns: 8, start: [0, 0], goal: [1, 7], route: ["➡️", "➡️", "➡️", "⬇️", "⬇️", "⬇️", "➡️", "➡️", "➡️", "➡️", "⬆️", "⬆️"], answer: "chegou" }),
      q("Continue a sequência", "Observe o padrão e escolha a próxima figura.", "pattern", "Qual figura vem agora?", { audio: "audio/medio-09-padrao-figuras.mp3", series: "⭐ ❤️ ⭐ ❤️ ?", options: ["🔵", "⭐", "❤️", "🟢"], answer: "⭐" }),
      q("Encontre o habitat", "Pense no lugar onde o pássaro faz o ninho.", "identify", "Onde o pássaro deve colocar seu ninho?", { audio: "audio/medio-10-ninho-passaro.mp3", target: "🐦", options: ["🌊 Oceano", "🌳 Árvore", "🏠 Casa"], answer: "🌳 Árvore" })
    ],
    "Difícil": [
      q("Monte a palavra", "Organize as sílabas para formar a palavra ELEFANTE.", "syllables", "Que palavra forma o nome deste animal?", { audio: "audio/dificil-01-elefante.mp3", icon: "🐘", parts: 4, options: ["E", "TE", "FAN", "LE", "AN"], answer: "E-LE-FAN-TE" }),
      q("Complete a palavra", "Escolha as duas sílabas que completam a palavra.", "word-parts", "Complete SOR + ___ + ___.", { audio: "audio/dificil-02-sorvete.mp3", icon: "🍦", slots: 2, options: ["VE", "TO", "TE", "LE"], answer: "VE-TE" }),
      q("Inverta o desafio", "Observe a figura e escolha seu nome.", "identify", "Qual palavra corresponde à figura?", { audio: "audio/dificil-03-sapo.mp3", target: "🐸", options: ["CACHORRO", "GATO", "SAPO", "PEIXE"], answer: "SAPO" }),
      q("Alimente o personagem", "Descubra quantas maçãs ainda faltam.", "math", "O personagem quer 8 maçãs. Ele já tem 5. Quantas faltam?", { audio: "audio/dificil-04-macas-faltando.mp3", icon: "🍎", current: 5, target: 8, options: ["2", "3", "4", "5"], answer: "3" }),
      q("Descubra o padrão", "Observe os números e escolha o que está faltando.", "sequence", "Qual número completa a sequência?", { audio: "audio/dificil-05-sequencia-numerica.mp3", series: "2 → 4 → ? → 8", options: ["5", "6", "7", "9"], answer: "6" }),
      q("Onde está o tesouro?", "Ouça a dica e toque no lugar onde está o tesouro.", "treasure", "O tesouro está ao lado da árvore e embaixo da pedra.", { audio: "audio/dificil-06-tesouro.mp3", cells: [{ pos: "casa", icon: "🏠" }, { pos: "arvore", icon: "🌳" }, { pos: "pedra", icon: "🪨" }, { pos: "tesouro", icon: "⭐" }], answer: "pedra" }),
      q("Continue a sequência", "Observe o padrão e escolha a próxima figura.", "pattern", "Qual figura vem depois?", { audio: "audio/dificil-07-padrao-cores.mp3", series: "🔴 🔵 🔵 🔴 🔵 🔵 ?", options: ["🔵", "🔴", "🟢", "🟡"], answer: "🔴" }),
      q("Observe e memorize", "Memorize as figuras. Elas vão sumir.", "memory", "Qual figura apareceu antes?", { audio: "audio/dificil-08-memoria-observar.mp3", responseAudio: "audio/dificil-08-memoria-responder.mp3", memory: "🍎　🐶　⭐　🚗", options: ["🐱", "🏠", "🍎", "⚽"], answer: "🍎" }),
      q("Ajude o personagem a chegar", "Escolha as setas na ordem certa.", "maze", "Leve o personagem até a casa seguindo o caminho marrom.", { audio: "audio/medio-08-caminho-casa.mp3", rows: 4, columns: 8, start: [3, 0], goal: [0, 7], route: ["➡️", "⬆️", "➡️", "⬆️", "➡️", "➡️", "⬇️", "➡️", "➡️", "⬆️", "➡️", "⬆️"], answer: "chegou" }),
      q("Letras e escrita", "Ouça a pergunta e escolha a forma correta de escrever o nome.", "choice", "João precisa escrever seu próprio nome. Qual forma está correta?", { audio: "audio/dificil-10-escrever-nome.mp3", options: ["joão", "joAO", "JOÃO", "João"], answer: "João" })
    ]
  };
})();
