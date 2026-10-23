# Roteiro de voz — Trilha Mágica

Roteiro e inventário dos áudios gravados no ElevenLabs com a voz **Raquel — Expressive and Energetic**, em português do Brasil. A interpretação é calorosa, brincalhona e clara; ritmo moderado, com pausas curtas. Evitar gritar, acelerar ou infantilizar a pronúncia. Nenhum áudio inclui o nome da criança.

## Arquivos de áudio

Os MP3s estão em `audio/` para a versão `index.html` e em `public/audio/` para a versão Next.js. O jogo usa os arquivos locais; eles podem ser tocados sem acessar um serviço de voz ou baixar dados durante a partida. Os caminhos relativos e nomes de arquivo são mantidos iguais nas duas pastas.

- As 30 perguntas têm um MP3 próprio, de `facil-01-gato.mp3` até `dificil-10-escrever-nome.mp3`.
- A comparação do nível médio tem o áudio adicional `medio-07-pergunta-extra.mp3`.
- A memória usa duas falas: `dificil-08-memoria-observar.mp3` e `dificil-08-memoria-responder.mp3`.
- As falas compartilhadas incluem `boas-vindas.mp3`, `escolher-nivel.mp3`, `feedback-acerto.mp3`, `feedback-tentar.mp3`, `feedback-erro.mp3`, `fim-jogo.mp3` e `pares-certos.mp3`.
- As sílabas tocadas nas atividades de leitura têm clipes próprios: `silaba-ga.mp3`, `silaba-to.mp3`, `silaba-bor.mp3`, `silaba-bo.mp3`, `silaba-le.mp3`, `silaba-ta.mp3`, `silaba-e.mp3`, `silaba-te.mp3`, `silaba-fan.mp3`, `silaba-an.mp3` e `silaba-ve.mp3`.
- Ao completar uma das palavras apoiadas, o jogo também toca sua gravação completa: `palavra-gato.mp3`, `palavra-borboleta.mp3`, `palavra-elefante.mp3` ou `palavra-sorvete.mp3`.
- A aplicação toca exclusivamente os MP3s locais. Se um arquivo estiver ausente ou não puder ser reproduzido, não será substituído por fala sintetizada do navegador.

### Mapeamento das 30 questões

- **Fácil:** `facil-01-gato.mp3`, `facil-02-letra-a.mp3`, `facil-03-contar-macas.mp3`, `facil-04-adicionar-peixes.mp3`, `facil-05-comparar-macas.mp3`, `facil-06-padrao-cores.mp3`, `facil-07-casa-peixe.mp3`, `facil-08-som-vaca.mp3`, `facil-09-direcao-casa.mp3`, `facil-10-figura-igual.mp3`.
- **Médio:** `medio-01-borboleta.mp3`, `medio-02-ligar-letras.mp3`, `medio-03-cachorro.mp3`, `medio-04-sapo.mp3`, `medio-05-contar-macas.mp3`, `medio-06-adicionar-peixes.mp3`, `medio-07-comparar-macas.mp3`, `medio-08-caminho-casa.mp3`, `medio-09-padrao-figuras.mp3`, `medio-10-ninho-passaro.mp3`.
- **Difícil:** `dificil-01-elefante.mp3`, `dificil-02-sorvete.mp3`, `dificil-03-sapo.mp3`, `dificil-04-macas-faltando.mp3`, `dificil-05-sequencia-numerica.mp3`, `dificil-06-tesouro.mp3`, `dificil-07-padrao-cores.mp3`, `dificil-08-memoria-observar.mp3`, `dificil-09-objeto-cena.mp3`, `dificil-10-escrever-nome.mp3`.

O desafio de memória usa também `dificil-08-memoria-responder.mp3` após as figuras sumirem. O segundo passo da comparação média usa `medio-07-pergunta-extra.mp3`. Outros clipes compartilhados: `boas-vindas.mp3`, `escolher-nivel.mp3`, `feedback-acerto.mp3`, `feedback-tentar.mp3`, `feedback-erro.mp3`, `fim-jogo.mp3` e `pares-certos.mp3`. `extra-letra-b-borboleta.mp3` é uma variação adicional do desafio da letra B.

Ao tocar uma sílaba, o jogo reproduz o clipe correspondente. Ao completar GATO, BORBOLETA, ELEFANTE ou SORVETE, reproduz em seguida o clipe da palavra inteira. A cobertura inclui as sílabas usadas nas três atividades de montagem e as partes VE/TE de SORVETE.

## Abertura e navegação

- **Boas-vindas:** “Olá, explorador! Que bom ter você na Trilha Mágica. Aqui a gente aprende brincando. Escolha um caminho e vamos começar!”
- **Escolher nível:** “Qual desafio combina com você hoje? Escolha fácil, médio ou difícil. Você consegue!”
- **Voltar:** “Tudo bem! Vamos escolher outro caminho.”
- **Começo da atividade:** “Preparado? Olhe com atenção e toque no botão de som sempre que quiser ouvir de novo.”

## Falas compartilhadas

- **Acerto:** “Isso! Muito bem! Você conseguiu! Vamos para o próximo desafio!”
- **Erro com tentativas:** “Quase! Pense mais um pouquinho e tente outra vez. Você está aprendendo!”
- **Última tentativa encerrada:** “Tudo bem, errar faz parte de aprender. Vamos descobrir a resposta e seguir em frente!”
- **Atividade concluída:** “Parabéns! Você terminou este caminho! Cada desafio foi uma descoberta. Que tal tentar de novo ou escolher outro nível?”
- **Parabéns por todos os pares:** “Isso! Todos os pares estão certinhos. Mandou muito bem!”
- **Contagem:** “Toque nos itens que você quer contar. Quando terminar, confira sua escolha.”
- **Memória:** “Olhe bem e guarde estas figuras na memória. Pronto? Elas vão sumir! Agora, escolha as que apareceram.”

## Nível fácil

1. **Monte a palavra — gato:** “Vamos formar uma palavra! Toque nas sílabas na ordem certa para escrever GATO. Qual vem primeiro: GA ou TO?”
2. **Letra A — abelha:** “Qual figura começa com a letra A? Escute o som inicial: A de abelha. Toque na imagem certa!”
3. **Contar maçãs:** “O personagem quer três maçãs. Conte com calma e toque em três maçãs. Depois, confira!”
4. **Adicionar peixes:** “Já temos dois peixes. Quantos precisamos acrescentar para ficar com cinco? Escolha a quantidade!”
5. **Comparar maçãs:** “Conte as maçãs do coelho e do urso. Quem tem mais? Toque no personagem com mais maçãs!”
6. **Padrão de cores:** “Olhe a sequência: vermelho, azul, vermelho, azul. Qual cor aparece agora? Toque na resposta!”
7. **Casa do peixe:** “Onde o peixe mora? Pense no lugar onde ele pode nadar e escolha a imagem!”
8. **Som da vaca:** “Muuuu! Que animal faz esse som? Ouça e escolha a figura correspondente!”
9. **Direção para a casa:** “Ajude o personagem a chegar à casa. Para onde ele deve ir? Toque na seta que aponta para cima!”
10. **Figura igual:** “Observe a estrela com atenção. Agora encontre outra figura igual e toque nela!”

## Nível médio

1. **Monte a palavra — borboleta:** “Vamos montar BORBOLETA! Organize as sílabas na ordem certa: BOR, BO, LE, TA. Toque uma por vez!”
2. **Ligue letras e imagens:** “Encontre os três pares! Ligue cada letra à imagem cujo nome começa com aquele som: B de borboleta, M de macaco e P de panqueca.”
3. **Sílaba que falta — cachorro:** “Complete a palavra CA, espaço, RRO. Que sílaba entra no meio para formar CACHORRO? Escolha uma!”
4. **Ouça e encontre — sapo:** “A palavra é SAPO. Escute com atenção e toque na figura do sapo!”
5. **Contar maçãs:** “O personagem quer sete maçãs. Conte uma de cada vez e toque em exatamente sete!”
6. **Adicionar peixes:** “Já temos quatro peixes. Quantos precisamos acrescentar para ficar com oito? Faça a conta e escolha!”
7. **Quem tem mais:** “Compare as maçãs do coelho e do urso. Quem tem mais? Depois, descubra quantas maçãs a mais ele tem!”
8. **Caminho até a casa:** “Ajude o personagem a chegar à casa. Siga com as setas o caminho marrom, uma casa de cada vez. Você pode voltar pelo caminho se precisar.”
9. **Padrão de figuras:** “Observe: estrela, coração, estrela, coração. Qual figura vem agora? Toque na resposta!”
10. **Ninho do pássaro:** “Pense onde um pássaro pode fazer seu ninho. Escolha o lugar mais adequado!”

## Nível difícil

1. **Monte a palavra — elefante:** “Vamos montar ELEFANTE! Organize as sílabas na ordem certa. Escute os pedacinhos da palavra e toque neles um por vez!”
2. **Complete a palavra — sorvete:** “Complete a palavra: SOR, espaço, espaço. Escolha as duas sílabas que formam SORVETE!”
3. **Nome do animal — sapo:** “Observe a figura. Qual palavra é o nome deste animal? Leia as opções e escolha SAPO!”
4. **Maçãs que faltam:** “O personagem quer oito maçãs e já tem cinco. Quantas maçãs ainda faltam? Conte ou faça a subtração!”
5. **Sequência numérica:** “Observe: dois, quatro, espaço, oito. Os números aumentam de dois em dois. Qual está faltando?”
6. **Tesouro escondido:** “Uma dica: o tesouro está ao lado da árvore e embaixo da pedra. Observe bem a cena e toque no lugar certo!”
7. **Padrão de cores:** “Olhe o padrão: vermelho, azul, azul; vermelho, azul, azul. Qual cor vem agora? Toque na resposta!”
8. **Memória:** “Memorize estas figuras: maçã, cachorro, estrela e carro. Olhe bem, porque elas vão sumir! Qual figura apareceu antes?”
9. **Objeto na cena:** “Observe a cena com atenção. Encontre o objeto vermelho que está em cima da mesa e toque nele!”
10. **Escrever o nome:** “João vai escrever o próprio nome. Qual opção mostra o nome escrito corretamente? Leia com atenção e escolha!”

## Notas de gravação

- Gerar cada fala em um clipe separado para facilitar a integração e a repetição dentro do jogo.
- Para as instruções de atividades, manter a mesma voz e entonação; usar um tom curioso no enunciado e uma pausa antes do convite para responder.
- Os textos precisam ser gerados em português do Brasil. Conferir especialmente as palavras “borboleta”, “CACHORRO”, “ELEFANTE” e “SORVETE”.
- A pergunta fácil “Qual figura começa com A?” usa “abelha”, que começa com A. No nível médio, “B” combina com “borboleta”.
