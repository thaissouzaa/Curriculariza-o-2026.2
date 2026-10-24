# Trilha Mágica

Jogo educativo infantil em português, com Next.js/React e uma entrada HTML independente.

## Como abrir

Para desenvolver, execute `npm install` uma vez e depois `npm run dev`. Para publicar, execute `npm run build` e hospede os arquivos estáticos de `out/`. `index.html` também pode ser aberto diretamente no Chrome. Os MP3s locais são usados nas duas versões e não há fala sintetizada pelo navegador.

## Estrutura

- `index.html`: entrada da aplicação, sem sprites SVG embutidos.
- `styles.css`: layout responsivo para Chromebook, computador, tablet e celular.
- `app.js`: telas, voz, efeitos, imagens, regras de interação, tentativas, pontuação e feedback.
- `questions.js`: banco de 30 atividades separado por nível.
- `app/`: layout e inicialização da interface React/Next.js.
- `public/`: motor do jogo e arquivos estáticos empacotados para o Next.js.
- `next.config.mjs`: configuração de exportação estática.
- `package.json`: scripts e dependências de desenvolvimento.
- `imagens/`: ilustrações locais, fundo e cenas do jogo.
- `audio/`: clipes MP3 para a entrada HTML independente.
- `public/audio/`: cópia dos mesmos clipes para a versão Next.js.
- `ROTEIRO-AUDIOS.md`: roteiro, inventário e correspondência das falas com as atividades.
- `perguntas-jogo.pdf`: cópia local do PDF enviado, fonte das atividades.

As ilustrações disponíveis são carregadas diretamente da pasta `imagens/`. Quando o documento pede uma figura sem arquivo correspondente, o jogo mantém o emoji original como alternativa.

## Atividades e pontuação

O banco acompanha as 30 atividades do PDF, na mesma ordem: dez fáceis, dez médias e dez difíceis. Inclui montar e completar palavras, associar letras, contagem, comparação com pergunta adicional, padrões, habitats, sons, direções, memória, localização visual e uso de letra maiúscula em nomes próprios. A atividade de encontrar objeto usa uma cena interativa montada com as ilustrações locais. Acertos, erros e tentativas extras são registrados durante a sessão. Fácil e Médio oferecem três tentativas por pergunta; Difícil oferece duas.

## Voz e acessibilidade

A voz dos enunciados, retornos, sílabas e palavras completas foi gerada no ElevenLabs com Raquel — Expressive and Energetic (pt-BR) e está incluída como arquivos locais. A partida não consulta ElevenLabs nem precisa de rede para reproduzir esses clipes. Não há chave de API nem fala sintetizada pelo navegador no projeto. O botão de som silencia fala e efeitos. Tab, Enter e Espaço podem ser usados para navegar.

## Música e efeitos

A música de fundo e os sons de passar o mouse e tocar na tela são gerados pelo navegador (Web Audio), sem arquivos extras. A música começa no primeiro toque, abaixa sozinha enquanto uma fala toca e é desligada pelo botão de som, junto com os efeitos. Para mudar o volume, ajuste `musicBase` no início de `app.js`.
