# Trilha Mágica — leia-me

Jogo infantil de leitura e raciocínio, com entrada HTML simples e versão de desenvolvimento em React/Next.js.

## Início rápido

Para abrir direto no Chrome sem instalar nada, use `index.html`; os enunciados usam MP3s locais. Para desenvolver a versão Next.js, execute `npm install` e `npm run dev`. Para publicar, execute `npm run build` e hospede os arquivos estáticos de `out/`.

## Arquivos

- `index.html` carrega a aplicação e não contém ilustrações SVG embutidas.
- `styles.css` organiza a aparência e o layout responsivo inspirado nas telas do Figma.
- `app.js` monta as telas, usa as imagens locais, controla a voz, as interações, tentativas e pontuação.
- `questions.js` guarda as 30 perguntas, dez em cada nível.
- `app/` contém a página React e o layout do Next.js.
- `public/` contém os recursos locais usados pelo Next.js.
- `next.config.mjs` habilita a exportação estática.
- `imagens/` contém o fundo, as ilustrações e as cenas utilizadas no jogo.
- `audio/` reúne os MP3s da entrada HTML; `public/audio/` contém os arquivos equivalentes para Next.js.
- `ROTEIRO-AUDIOS.md` relaciona roteiro, voz e arquivos gerados para cada tela.
- `perguntas-jogo.pdf` é uma cópia do PDF enviado e a fonte das 30 atividades.

## Voz

Os enunciados, mensagens e interações de sílabas usam somente os arquivos MP3 locais gerados no ElevenLabs com a voz Raquel — Expressive and Energetic, em português brasileiro. Depois do download dos arquivos, o jogo não precisa de conexão com o ElevenLabs e não contém chave de API. O botão de som desativa fala e efeitos; não há fala sintetizada pelo navegador.

Nas atividades de montar palavras, há um clipe para cada sílaba disponível e outro para a palavra completa. O arquivo `ROTEIRO-AUDIOS.md` lista os nomes e o uso de cada gravação.

## Pontuação

As atividades seguem a ordem do PDF: dez perguntas por nível. Fácil e Médio oferecem até três tentativas por atividade; Difícil oferece duas. O placar mostra acertos, erros e pergunta atual. Ao terminar, o resultado mostra as tentativas extras e estrelas de desempenho.
