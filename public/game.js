/**
 * Motor do jogo Trilha Mágica, compartilhado pela entrada HTML independente
 * e pela inicialização React/Next.js. O banco de conteúdo vive em questions.js.
 */
(() => {
  const app = document.querySelector("#app");
  const bank = window.questionBank;
  const levels = Object.keys(bank);
  const totalQuestions = 10;
  const maxAttempts = { Fácil: 3, Médio: 3, Difícil: 2 };
  let level = "Fácil", game = null, memoryTimer = null, mazeFeedbackTimer = null, treasureTimer = null, soundOn = true, audioContext = null, currentVoiceAudio = null;
  let playerName = "";
  let audioPlaybackId = 0;
  let musicGain = null, musicTimer = null, musicStep = 0, musicNextTime = 0, lastHover = null, lastHoverAt = 0;
  const musicBase = 0.05;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const art = { "🐱":"cat","🐈":"cat","🐝":"bee","🍎":"apple","🐻":"bear","🐰":"rabbit","🐟":"fish","🐠":"fish","🐔":"hen","🐶":"dog","🐸":"frog","🐢":"turtle","🦋":"butterfly","🐞":"ladybug","🌼":"flower","☀️":"sun","🍌":"banana","🍐":"pear","🌳":"tree","🪨":"rock","⭐":"star","🌟":"star","💎":"gem","🌉":"bridge","🕳️":"hole","☂️":"umbrella","🕶️":"glasses","🧤":"gloves","🍃":"leaf","🌷":"tulip","🪷":"lotus","🌙":"moon","🔴":"red-circle","🔵":"blue-circle","🟡":"yellow-circle","🟢":"green-circle","🔺":"triangle","🟩":"green-square","🐘":"elephant","🐄":"cow","🐮":"cow","👦":"boy","🐒":"monkey","🐦":"bird","🦜":"bird","🦆":"duck","🚗":"car","🏠":"house","🏡":"house-landscape","⚽":"ball","🥞":"pancake","🍦":"icecream","💖":"heart","❤️":"heart","❤":"heart","⬆️":"up","⬇️":"down","⬅️":"left","➡️":"right","🌊":"ocean","🌲":"forest" };
  const artNames = { cat:"gato",bee:"abelha",apple:"maçã",bear:"urso",rabbit:"coelho",fish:"peixe",hen:"galinha",dog:"cachorro",frog:"sapinho",turtle:"tartaruga",butterfly:"borboleta",ladybug:"joaninha",flower:"flor",sun:"sol",banana:"banana",pear:"pera",tree:"árvore",rock:"pedra",star:"estrela",gem:"tesouro",bridge:"ponte",hole:"toca",umbrella:"guarda-chuva",glasses:"óculos de sol",gloves:"luvas",leaf:"folha",tulip:"tulipa",lotus:"flor do lago",moon:"lua", "red-circle":"círculo vermelho", "blue-circle":"círculo azul", "yellow-circle":"círculo amarelo", "green-circle":"círculo verde",triangle:"triângulo", "green-square":"quadrado verde",elephant:"elefante",cow:"vaca",boy:"menino",monkey:"macaco",bird:"pássaro",duck:"pato",car:"carro",house:"casa","house-landscape":"paisagem da casa",ball:"bola",pancake:"panqueca",icecream:"sorvete",heart:"coração",up:"para cima",down:"para baixo",left:"para a esquerda",right:"para a direita",ocean:"oceano",forest:"floresta" };
  const syllableAudio = { ga:"audio/silaba-ga.mp3", to:"audio/silaba-to.mp3", bor:"audio/silaba-bor.mp3", bo:"audio/silaba-bo.mp3", le:"audio/silaba-le.mp3", ta:"audio/silaba-ta.mp3", e:"audio/silaba-e.mp3", te:"audio/silaba-te.mp3", fan:"audio/silaba-fan.mp3", an:"audio/silaba-an.mp3", ve:"audio/silaba-ve.mp3" };
  const completedWordAudio = { GATO:"audio/palavra-gato.mp3", BORBOLETA:"audio/palavra-borboleta.mp3", ELEFANTE:"audio/palavra-elefante.mp3", SORVETE:"audio/palavra-sorvete.mp3" };
  const artFiles = { cat:"gato.png",bee:"abelha.png",apple:"maca.png",bear:"urso.png",rabbit:"coelho.png",fish:"peixe.png",hen:"",dog:"cao.png",frog:"sapo.png",turtle:"",butterfly:"borboleta.png",sun:"",banana:"",pear:"",tree:"arvore.png",rock:"pedra.png",star:"estrela.png",gem:"",bridge:"",hole:"",umbrella:"",glasses:"",gloves:"",leaf:"",tulip:"",lotus:"",moon:"", "red-circle":"vermelho.png", "blue-circle":"azul.png", "yellow-circle":"amarelo.png", "green-circle":"verde.png",triangle:"", "green-square":"",elephant:"elefante.png",cow:"vaca.png",boy:"menino.png",monkey:"macaco.png",bird:"passaro.png",duck:"pato.png",car:"carro.png",house:"casa.png","house-landscape":"paisagemCasa.png",ball:"bola.png",pancake:"panqueca.png",icecream:"sorvete.png",heart:"coracao.png",up:"cima.png",down:"baixo.png",left:"esquerda.png",right:"direita.png",ocean:"paisagemOceano.png",forest:"paisagemFloresta.png" };
  // Usa as ilustrações entregues na pasta imagens e preserva o emoji quando não há arquivo correspondente.
  const illustrated = (value, className = "illustration") => {
    let content = escapeHtml(value);
    for (const [emoji, id] of Object.entries(art).sort((a, b) => b[0].length - a[0].length)) {
      const file = artFiles[id];
      const label = artNames[id] || id;
      const image = file
        ? `<img src="imagens/${file}" alt="" draggable="false">`
        : `<span role="img" aria-label="${escapeHtml(label)}">${emoji}</span>`;
      content = content.replaceAll(escapeHtml(emoji), image);
    }
    return `<span class="${escapeHtml(className)}">${content}</span>`;
  };
  const optionArt = (value) => {
    const source = String(value);
    const match = Object.entries(art).sort((a, b) => b[0].length - a[0].length).find(([emoji]) => source.startsWith(emoji));
    if (!match) return null;
    const [emoji, id] = match;
    const caption = source.slice(emoji.length).trim();
    const hasAnotherImage = Object.keys(art).some((other) => caption.includes(other));
    if (hasAnotherImage) return null;
    return { emoji, id, caption: caption || artNames[id] || id };
  };
  const questions = () => bank[level];
  const currentQuestion = () => questions()[game.question];

  function renderHome() {
    clearTimeout(memoryTimer);clearTimeout(treasureTimer);
    app.innerHTML = `<section class="screen home"><div class="home-panel"><img class="brand-logo" src="imagens/logo.jpg" alt="Trilha Mágica"><h1>Aprender é uma <span>trilha</span> de descobertas!</h1><label class="name-label" for="player-name">Como você se chama?</label><input id="player-name" class="name-input" type="text" maxlength="24" autocomplete="given-name" placeholder="Digite seu nome" required aria-describedby="name-error"><p class="name-error" id="name-error" role="alert" hidden>Digite seu nome para começar!</p><div class="home-actions"><button class="comic-button" type="button" data-action="levels">COMEÇAR</button></div></div></section>`;
    const nameInput=app.querySelector("#player-name");
    nameInput.value=playerName;
    const nameError=app.querySelector("#name-error");
    nameInput.addEventListener("input",()=>{playerName=nameInput.value.trim().slice(0,24);if(playerName){nameError.hidden=true;nameInput.removeAttribute("aria-invalid");}});
    addSoundToggle();
    /** O nome é obrigatório: sem ele o jogo não avança. */
    const begin=()=>{
      playerName=nameInput.value.trim().slice(0,24);
      if(!playerName){nameError.hidden=false;nameInput.setAttribute("aria-invalid","true");nameInput.focus();playSound("bad");return;}
      renderLevels();
    };
    app.querySelector('[data-action="levels"]').addEventListener("click",begin);
    nameInput.addEventListener("keydown",(event)=>{if(event.key==="Enter")begin();});
  }
  function renderLevels() {
    if(!playerName){renderHome();return;}
    clearTimeout(memoryTimer);clearTimeout(treasureTimer);
    const records = readLevelRecords();
    app.innerHTML = `<section class="screen difficulty"><h1 class="screen-title">ESCOLHA UM NÍVEL DE DIFICULDADE</h1><div class="level-list" role="group" aria-label="Níveis de dificuldade">
      ${[["Fácil","green"],["Médio","yellow"],["Difícil","red"]].map(([name,color])=>{const stars=Number(records[name]?.stars)||0;return `<button class="level-card" type="button" data-level="${name}" aria-label="${name}, 10 atividades, melhor resultado: ${stars} de 3 estrelas"><span class="level-dot ${color}" aria-hidden="true"></span><strong>${name}</strong><small>10 atividades</small><span class="star-row" aria-hidden="true">${Array.from({length:3},(_,i)=>`<span class="${i<stars?"earned":""}">${i<stars?"★":"☆"}</span>`).join("")}</span></button>`;}).join("")}
      </div><p class="selection-hint">Escolha um nível para começar a aventura.</p></section>`;
    addSoundToggle(); app.querySelectorAll(".level-card").forEach((b)=>b.addEventListener("click",()=>startGame(b.dataset.level)));
    playVoiceFile("audio/escolher-nivel.mp3");
  }
  function addSoundToggle() {
    const screen=app.querySelector(".screen"); if(!screen)return;
    screen.querySelectorAll(".sound-toggle").forEach((old)=>old.remove());
    const button=document.createElement("button"); button.type="button"; button.className="sound-toggle"; button.setAttribute("aria-pressed",String(soundOn)); button.innerHTML=soundOn?'<img src="imagens/som.png" alt="">':'<span aria-hidden="true">🔇</span>'; button.setAttribute("aria-label",soundOn?"Desligar som":"Ligar som");
    button.addEventListener("click",()=>{soundOn=!soundOn;if(!soundOn){stopSpeech();stopMusic();}addSoundToggle();if(soundOn){startMusic();playSound("tap");}}); screen.append(button);
  }
  function playSound(kind) {
    if(!soundOn)return; const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
    try { audioContext ||= new Audio(); if(audioContext.state==="suspended")audioContext.resume(); const notes=kind==="good"?[523,659,784]:kind==="bad"?[310,260]:kind==="hover"?[740]:kind==="pop"?[587,880]:[440];
      notes.forEach((frequency,index)=>{const start=audioContext.currentTime+index*.12,osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type=kind==="bad"?"sine":"triangle";osc.frequency.value=frequency;gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(kind==="bad"?.045:kind==="hover"?.02:kind==="pop"?.04:.055,start+.025);gain.gain.exponentialRampToValueAtTime(.0001,start+(kind==="hover"?.09:.2));osc.connect(gain);gain.connect(audioContext.destination);osc.start(start);osc.stop(start+(kind==="hover"?.1:.21));});
    } catch (_) { /* O jogo continua mesmo sem áudio. */ }
  }
  function playMazeBlockedSound() {
    if (!soundOn) return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    try {
      audioContext ||= new Audio();
      if (audioContext.state === "suspended") audioContext.resume();
      const start = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(220, start);
      oscillator.frequency.linearRampToValueAtTime(165, start + .72);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.linearRampToValueAtTime(.075, start + .05);
      gain.gain.setValueAtTime(.075, start + .55);
      gain.gain.exponentialRampToValueAtTime(.0001, start + .78);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + .8);
    } catch (_) { /* O aviso visual funciona mesmo se o navegador bloquear o áudio. */ }
  }
  /** Contexto de áudio compartilhado entre efeitos e música. */
  function getAudioContext() {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    try { audioContext ||= new Ctor(); } catch (_) { return null; }
    return audioContext;
  }
  /** Música de fundo gerada por código: acordes C – Am – F – G em arpejo suave, sem arquivos externos. */
  const musicChords = [[261.63, 329.63, 392], [220, 261.63, 329.63], [174.61, 220, 261.63], [196, 246.94, 293.66]];
  const musicMelody = [[659.25, 783.99, 659.25], [880, 783.99, 659.25], [659.25, 587.33, 523.25], [587.33, 783.99, 587.33]];
  const musicLevel = () => currentVoiceAudio ? musicBase * 0.3 : musicBase;
  /** Abaixa a música enquanto uma fala está tocando, para a criança ouvir o enunciado. */
  function updateMusicLevel() {
    if (musicGain && audioContext && musicTimer) musicGain.gain.setTargetAtTime(musicLevel(), audioContext.currentTime, 0.25);
  }
  function musicNote(frequency, time, duration, volume, type) {
    const osc = audioContext.createOscillator(), gain = audioContext.createGain();
    osc.type = type; osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(gain); gain.connect(musicGain);
    osc.start(time); osc.stop(time + duration + 0.02);
  }
  function scheduleMusic() {
    if (!audioContext || !musicGain) return;
    const stepLength = 0.32;
    while (musicNextTime < audioContext.currentTime + 0.5) {
      const bar = Math.floor(musicStep / 8) % musicChords.length, beat = musicStep % 8, chord = musicChords[bar];
      musicNote(chord[[0, 1, 2, 1, 0, 1, 2, 1][beat]] * 2, musicNextTime, 0.5, 0.35, "sine");
      if (beat === 0) musicNote(chord[0] / 2, musicNextTime, stepLength * 7, 0.55, "triangle");
      const melodyIndex = [0, 3, 6].indexOf(beat);
      if (melodyIndex >= 0) musicNote(musicMelody[bar][melodyIndex], musicNextTime, 0.7, 0.28, "triangle");
      musicNextTime += stepLength; musicStep++;
    }
  }
  function startMusic() {
    if (!soundOn || musicTimer) return;
    const ctx = getAudioContext(); if (!ctx) return;
    try {
      if (ctx.state === "suspended") ctx.resume();
      if (!musicGain) { musicGain = ctx.createGain(); musicGain.gain.value = 0.0001; musicGain.connect(ctx.destination); }
      musicGain.gain.cancelScheduledValues(ctx.currentTime);
      musicGain.gain.setTargetAtTime(musicLevel(), ctx.currentTime, 0.4);
      musicNextTime = ctx.currentTime + 0.1;
      musicTimer = setInterval(scheduleMusic, 100);
      scheduleMusic();
    } catch (_) { /* O jogo continua sem música se o navegador bloquear o áudio. */ }
  }
  function stopMusic() {
    clearInterval(musicTimer); musicTimer = null;
    if (musicGain && audioContext) musicGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.15);
  }
  function stopSpeech() {
    audioPlaybackId++;
    if (currentVoiceAudio) { currentVoiceAudio.pause(); currentVoiceAudio.currentTime = 0; currentVoiceAudio = null; }
    updateMusicLevel();
  }
  /** Toca somente os clipes locais fornecidos, em sequência. */
  function playVoiceFiles(paths) {
    const files = paths.filter(Boolean);
    if (!soundOn || !files.length) return;
    const playbackId = ++audioPlaybackId;
    if (currentVoiceAudio) { currentVoiceAudio.pause(); currentVoiceAudio = null; }
    const playAt = (index) => {
      if (playbackId !== audioPlaybackId || !soundOn || index >= files.length) { updateMusicLevel(); return; }
      const audio = new Audio(files[index]);
      currentVoiceAudio = audio;
      updateMusicLevel();
      const next = () => {
        if (playbackId !== audioPlaybackId || currentVoiceAudio !== audio) return;
        currentVoiceAudio = null;
        playAt(index + 1);
      };
      audio.addEventListener("ended", next, { once: true });
      audio.addEventListener("error", next, { once: true });
      audio.play().catch(next);
    };
    playAt(0);
  }
  function playVoiceFile(path) {
    playVoiceFiles([path]);
  }
  function readLevelRecords() {
    try { return JSON.parse(localStorage.getItem("trilhaMagica.levelRecords") || "{}"); }
    catch (_) { return {}; }
  }
  function speakQuestion(q) {
    const audioFile = game.followupActive && q.followup ? q.followup.audio : q.audio;
    playVoiceFile(audioFile);
  }
  function speakPraise() {
    playVoiceFile("audio/feedback-acerto.mp3");
  }
  /** Dá retorno falado enquanto a criança monta palavras com sílabas. */
  function speakSyllableSelection(selectedParts, completedWord) {
    const spokenParts = selectedParts.map((part) => String(part).toLocaleLowerCase("pt-BR"));
    const lastPart = spokenParts[spokenParts.length - 1];
    const fullWord = completedWord ? completedWord.replaceAll("-", "").toLocaleUpperCase("pt-BR") : "";
    playVoiceFiles([syllableAudio[lastPart], completedWordAudio[fullWord]]);
  }
  /** Inicializa uma sessão nova para o nível selecionado. */
  function startGame(chosen) { level=chosen;game={question:0,correct:0,errors:0,extras:0,attemptsLeft:maxAttempts[level],locked:false,feedback:"",feedbackKind:"",selectedParts:[],selectedWordParts:[],missingSelection:"",missingAnimating:false,followupActive:false,selectedLeft:null,linked:[],countSelected:[],mazeMoves:0,mazePosition:currentQuestionFor(chosen,0)?.start?.slice()||null};renderGame(); }
  function currentQuestionFor(chosen,index) { return bank[chosen]?.[index]; }
  function optionButtons(options,cls="",imageOnly=false) { const hasArt=options.some((x)=>optionArt(x));return `<div class="option-grid ${hasArt?"option-grid--visual":""} ${imageOnly?"option-grid--images-only":""} ${cls}">${options.map(x=>{const artOption=optionArt(x),card=!imageOnly&&(artOption||hasArt);return `<button type="button" class="option ${card?"option-card":""} ${imageOnly?"option-illustration-only":""} ${!artOption&&hasArt?"option-card--text":""}" data-value="${escapeHtml(x)}" aria-label="${escapeHtml(artOption?.caption||x)}" ${game.locked||game.missingAnimating?"disabled":""}>${artOption?imageOnly?`<span class="option-art">${illustrated(artOption.emoji)}</span>`:`<span class="option-art ${artFiles[artOption.id]?"":"option-art--emoji"}">${illustrated(artOption.emoji)}</span><span class="option-caption">${escapeHtml(artOption.caption)}</span>`:hasArt?`<span class="option-caption">${illustrated(x)}</span>`:illustrated(x)}</button>`;}).join("")}</div>`; }
  /** Desenha o tipo de interação definido para a pergunta atual. */
  function renderMode(q) {
    switch(q.mode) {
      case "syllables": { const shown=game.selectedParts.map(i=>q.options[i]).join(" · ");return `<div class="visual">${illustrated(q.icon)}</div><div class="syllable-answer">${shown||"Toque nas sílabas abaixo"}</div><div class="option-grid">${q.options.map((x,i)=>{const selected=game.selectedParts.includes(i);return `<button type="button" class="option ${selected?"active":""}" data-token="${i}" aria-pressed="${selected}" ${game.locked||(!selected&&game.selectedParts.length>=q.parts)?"disabled":""}>${x}</button>`;}).join("")}</div><button class="check-button" data-action="check-syllables" ${game.locked||game.selectedParts.length!==q.parts?"disabled":""}>Conferir</button>`; }
      case "word-parts": { const shown=game.selectedWordParts.join(" · ");return `<div class="visual">${illustrated(q.icon)}</div><div class="word-display">SOR <span>${game.selectedWordParts[0]||"＿"}</span> <span>${game.selectedWordParts[1]||"＿"}</span></div><p class="count-progress">${shown||"Escolha as sílabas na ordem"}</p><div class="option-grid word-parts-options">${q.options.map(x=>{const selected=game.selectedWordParts.includes(x);return `<button type="button" class="option ${selected?"active":""}" data-word-part="${escapeHtml(x)}" aria-pressed="${selected}" ${game.locked||(!selected&&game.selectedWordParts.length>=q.slots)?"disabled":""}>${escapeHtml(x)}</button>`;}).join("")}</div><button class="check-button" data-action="check-word-parts" ${game.locked||game.selectedWordParts.length!==q.slots?"disabled":""}>Conferir</button>`; }
      case "identify": { const repeatedText=typeof q.target==="string"&&q.target.trim().toLocaleUpperCase("pt-BR")===String(q.prompt).trim().toLocaleUpperCase("pt-BR");return `${repeatedText?"":`<div class="visual identify-target">${illustrated(q.target)}</div>`}${optionButtons(q.options,"identify-options",Boolean(q.imageOnly))}`; }
      case "count": return `<div class="count-request"><div class="guide-portrait">${illustrated(q.guide)}</div><strong>“${escapeHtml(q.prompt)}”</strong></div><p class="count-progress">Selecionadas: ${game.countSelected.length} / ${q.target} · Você pode marcar e desmarcar.</p><div class="count-items">${Array.from({length:q.pool},(_,i)=>{const selected=game.countSelected.includes(i);return `<button type="button" class="count-item ${selected?"selected":""}" data-count-item="${i}" aria-label="Maçã ${i+1}${selected?", selecionada. Toque para desmarcar":""}" aria-pressed="${selected}" ${game.locked?"disabled":""}>${illustrated(q.icon)}</button>`;}).join("")}</div><button class="check-button" data-action="check-count" ${game.countSelected.length===0||game.locked?"disabled":""}>Conferir quantidade</button>`;
      case "choice": return optionButtons(q.options);
      case "add": return `<div class="add-equation"><span class="add-fish-group">${illustrated(q.icon.repeat(q.initial))}</span><strong>+ ? = ${q.target}</strong></div><p class="count-progress">Quantos precisam ser adicionados?</p>${optionButtons(q.options)}`;
      case "missing": return `<div class="missing-word" aria-label="${escapeHtml(q.before)} ${escapeHtml(game.missingSelection||"espaço para a sílaba")} ${escapeHtml(q.after)}"><span>${escapeHtml(q.before)}</span><button type="button" class="missing-slot ${game.missingSelection?"has-syllable":""} ${game.missingAnimating?"is-moving":""}" data-action="clear-missing" aria-label="${game.missingSelection?`Remover sílaba ${escapeHtml(game.missingSelection)}`:"Espaço para a sílaba"}" ${!game.missingSelection||game.missingAnimating||game.locked?"disabled":""}>${escapeHtml(game.missingSelection||"")}</button><span>${escapeHtml(q.after)}</span></div><div class="option-grid missing-options">${q.options.map(value=>`<button type="button" class="option ${game.missingSelection===value?"active":""}" data-value="${escapeHtml(value)}" aria-pressed="${game.missingSelection===value}" ${game.missingAnimating||game.locked?"disabled":""}>${escapeHtml(value)}</button>`).join("")}</div><button type="button" class="check-button" data-action="check-missing" ${!game.missingSelection||game.missingAnimating||game.locked?"disabled":""}>Verificar</button>`;
      case "letter": return `<div class="visual letter-target">${illustrated(q.icon)}</div>${optionButtons(q.options)}`;
      case "sum": return `<div class="sum-equation" aria-label="${q.a} mais ${q.b}"><span>${illustrated("🍎".repeat(q.a))}</span><b>+</b><span>${illustrated("🍎".repeat(q.b))}</span><b>= ?</b></div>${optionButtons(q.options)}`;
      case "math": return `<div class="sum-equation"><span>${illustrated(q.icon.repeat(q.current))}</span><b>+ ? = ${q.target}</b></div>${optionButtons(q.options)}`;
      case "compare": {
        const animals=[["left",q.left,q.leftName],["right",q.right,q.rightName]];
        const tag=game.followupActive?"div":"button";
        return `<div class="compare ${game.followupActive?"compare-followup":""}">${animals.map(([side,n,name])=>`<${tag} class="compare-card ${game.followupActive?"compare-card--static":""}" ${game.followupActive?"":`data-value="${side}" ${game.locked?"disabled":""}`}><span class="visual">${illustrated(name.split(" ")[0])}</span><span class="fruit-row">${illustrated("🍎".repeat(n))}</span><strong>${escapeHtml(name.split(" ").slice(1).join(" ")||"Tem frutas")}</strong></${tag}>`).join("")}</div>${game.followupActive?`<p class="count-progress">O urso tem ${q.right} maçãs e o coelho tem ${q.left}.</p>${optionButtons(q.followup.options)}`:""}`;
      }
      case "general": case "sequence": return `<div class="visual sequence-display">${illustrated(q.series||"").replace("?", '<span class="sequence-missing">?</span>')}</div>${optionButtons(q.options)}`;
      case "pattern": return `<div class="visual sequence-display pattern-sequence-display">${illustrated(q.series||"").replace("?", '<span class="sequence-missing">?</span>')}</div>${optionButtons(q.options,"pattern-options",true)}`;
      case "direction": return `<div class="visual direction-route">${illustrated(`${q.character} → ${q.destination}`)}</div>${optionButtons(q.options)}`;
      case "maze": { const path=mazePath(q);return `<div class="maze-board" role="grid" aria-label="Labirinto: siga os quadrados marrons até a casa">${Array.from({length:q.rows*q.columns},(_,index)=>{const r=Math.floor(index/q.columns),c=index%q.columns,isStart=r===q.start[0]&&c===q.start[1],isGoal=r===q.goal[0]&&c===q.goal[1],isPath=path.some(([pr,pc])=>pr===r&&pc===c),isPlayer=game.mazePosition?.[0]===r&&game.mazePosition?.[1]===c;return `<div class="maze-cell ${isPath?"is-path":"is-grass"} ${isGoal?"is-goal":""}" role="gridcell" aria-label="${isPlayer?"Personagem":isGoal?"Casa":isStart?"Início":isPath?"Caminho":"Gramado: não é possível passar"}">${isPlayer?illustrated("👦"):isGoal?illustrated("🏠"):""}</div>`;}).join("")}</div><div class="maze-controls" role="group" aria-label="Setas para mover o personagem"><span aria-hidden="true"></span><button type="button" data-maze-direction="⬆️" aria-label="Mover para cima">${illustrated("⬆️")}</button><span aria-hidden="true"></span><button type="button" data-maze-direction="⬅️" aria-label="Mover para a esquerda">${illustrated("⬅️")}</button><span aria-hidden="true"></span><button type="button" data-maze-direction="➡️" aria-label="Mover para a direita">${illustrated("➡️")}</button><span aria-hidden="true"></span><button type="button" data-maze-direction="⬇️" aria-label="Mover para baixo">${illustrated("⬇️")}</button><span aria-hidden="true"></span></div>`; }
      case "drag": return `<div class="drag-board"><div class="route-display">${illustrated(q.route)}</div><button type="button" class="drag-character" aria-label="Arraste o personagem">${illustrated(q.character)}</button><p class="drag-help">Arraste o personagem ou toque no destino:</p><div class="drop-zones">${q.options.map(x=>`<button type="button" class="drop-zone" data-drop="${escapeHtml(x)}" ${game.locked?"disabled":""}>${escapeHtml(x)}</button>`).join("")}</div></div>`;
      case "treasure": { const revealed=Boolean(game.treasureRevealed); return `<div class="treasure-scene" role="group" aria-label="Cena do tesouro"><img src="imagens/quizTesouro.png" alt="Desenho de uma casa, um caminho e uma árvore"><span class="treasure-star" aria-hidden="true">${illustrated("⭐")}</span>${revealed?"":`<button type="button" class="treasure-stone" data-position="pedra" aria-label="Pedra que esconde o tesouro" ${game.locked?"disabled":""}><img src="imagens/pedra.png" alt=""></button>`}</div>`; }
      case "link": { const right=q.pairs.map(p=>p[1]).slice().reverse();return `<div class="link-board" data-link-board><svg class="link-lines" aria-hidden="true"></svg><div class="link-column"><strong>${escapeHtml(q.leftLabel||"Letras")}</strong>${q.pairs.map(([word])=>`<button type="button" class="link-item link-letter ${game.linked.includes(word)?"matched":""} ${game.selectedLeft===word?"active":""}" data-link="left" data-key="${escapeHtml(word)}" ${game.locked||game.linked.includes(word)?"disabled":""}>${escapeHtml(word)}</button>`).join("")}</div><div class="link-column link-images"><strong>${escapeHtml(q.rightLabel||"Imagens")}</strong>${right.map(icon=>`<button type="button" class="link-item link-image ${game.linked.includes(q.pairs.find(p=>p[1]===icon)?.[0])?"matched":""}" data-link="right" data-key="${escapeHtml(icon)}" aria-label="${escapeHtml(artNames[art[icon]]||icon)}" ${game.locked||game.linked.includes(q.pairs.find(p=>p[1]===icon)?.[0])?"disabled":""}>${illustrated(icon)}</button>`).join("")}</div></div><p class="link-help">${game.linked.length} de ${q.pairs.length} pares encontrados</p>`; }
      case "memory": { const answered=Boolean(game.feedback); return `<div class="visual memory-symbol ${answered?"memory-hidden":""}" id="memory-symbol">${illustrated(q.memory)}</div><p class="memory-hint" id="memory-hint">${answered?"O que você viu?":"Memorize!"}</p><div class="memory-options" id="memory-options" ${answered?"":"hidden"}>${optionButtons(q.options)}</div>`; }
      case "scene-find": return `<div class="find-scene" role="group" aria-label="Cena com uma mesa e objetos para encontrar"><div class="find-sky" aria-hidden="true">☀️　☁️</div><div class="find-table" aria-hidden="true"><span></span><i></i><i></i></div><button class="scene-object scene-apple" data-value="apple" aria-label="Maçã vermelha em cima da mesa">${illustrated("🍎")}<small>em cima da mesa</small></button><button class="scene-object scene-ball" data-value="ball" aria-label="Bola azul embaixo da mesa">${illustrated("🔵")}<small>embaixo da mesa</small></button><button class="scene-object scene-car" data-value="car" aria-label="Carrinho amarelo ao lado da mesa">${illustrated("🚗")}<small>ao lado da mesa</small></button></div>`;
      default:return optionButtons(q.options||[]);
    }
  }
  function renderGame() {
    clearTimeout(memoryTimer);const q=currentQuestion();
    const prompt=game.followupActive&&q.followup?q.followup.prompt:q.prompt;
    const promptIsRepeatedTarget=q.mode==="identify"&&typeof q.target==="string"&&q.target.trim().toLocaleUpperCase("pt-BR")===String(prompt).trim().toLocaleUpperCase("pt-BR");
    app.innerHTML=`<section class="screen exercise"><header class="game-toolbar"><button class="back-button" data-action="back" ${game.missingAnimating?"disabled":""}>← Voltar</button><div class="game-status"><span class="hud-pill">Acertos ${game.correct} / 10</span><span class="hud-pill">Erros ${game.errors} / 10</span><span class="hud-pill">Pergunta ${game.question+1} / 10</span></div></header><article ${game.feedback?"inert":""} class="play-area ${q.imageOnly?"play-area--image-choice":""} ${q.target==="A"?"play-area--letter-image":""} ${q.target==="Muuuu!"?"play-area--sound-animal":""} ${q.target==="⭐"?"play-area--star-match":""}"><div class="activity-heading"><h1 class="screen-title">${escapeHtml(q.title)}</h1><span class="level-badge" data-level="${escapeHtml(level)}">${escapeHtml(level)}</span></div><div class="instruction-row"><button class="speak-button" data-action="speak" aria-label="Ouvir a instrução"><img src="imagens/som.png" alt=""></button><p class="subtitle">${escapeHtml(q.instruction)}</p></div>${q.mode==="count"||q.mode==="missing"||promptIsRepeatedTarget?"":`<p class="prompt ${q.mode==="compare"?"prompt--compare":""}">${escapeHtml(prompt)}</p>`}<div class="activity-content">${renderMode(q)}</div></article>${game.feedback?feedbackDialog(q):""}</section>`;
    addSoundToggle();app.querySelector('[data-action="back"]').addEventListener("click",renderLevels);app.querySelector('[data-action="speak"]').addEventListener("click",()=>{speakQuestion(q);playSound("tap");});
    app.querySelectorAll("[data-value]").forEach(b=>b.addEventListener("click",()=>q.mode==="missing"?chooseMissingSyllable(b.dataset.value,b):submitAnswer(b.dataset.value)));
    app.querySelectorAll("[data-maze-direction]").forEach(b=>b.addEventListener("click",()=>moveInMaze(b.dataset.mazeDirection)));
    app.querySelectorAll("[data-position]").forEach(b=>b.addEventListener("click",()=>q.mode==="treasure"?revealTreasure(b):submitAnswer(b.dataset.position)));
    app.querySelectorAll("[data-token]").forEach(b=>b.addEventListener("click",()=>{const index=Number(b.dataset.token),selected=game.selectedParts.includes(index);if(selected){game.selectedParts=game.selectedParts.filter((part)=>part!==index);stopSpeech();}else if(game.selectedParts.length<q.parts)game.selectedParts.push(index);if(!selected){const parts=game.selectedParts.map(i=>q.options[i]);const formed=parts.length===q.parts?parts.join(""):"";speakSyllableSelection(parts,formed);}renderGame();}));
    app.querySelectorAll("[data-word-part]").forEach(b=>b.addEventListener("click",()=>{const syllable=b.dataset.wordPart,selected=game.selectedWordParts.includes(syllable);if(selected){game.selectedWordParts=game.selectedWordParts.filter((part)=>part!==syllable);stopSpeech();}else if(game.selectedWordParts.length<q.slots)game.selectedWordParts.push(syllable);if(!selected){const formed=game.selectedWordParts.length===q.slots?`SOR${game.selectedWordParts.join("")}`:"";speakSyllableSelection(game.selectedWordParts,formed);}renderGame();}));
    app.querySelectorAll("[data-count-item]").forEach(b=>b.addEventListener("click",()=>{const i=Number(b.dataset.countItem);game.countSelected=game.countSelected.includes(i)?game.countSelected.filter(x=>x!==i):[...game.countSelected,i];renderGame();}));
    app.querySelector('[data-action="check-syllables"]')?.addEventListener("click",()=>submitAnswer(game.selectedParts.map(i=>q.options[i]).join("-")));
    app.querySelector('[data-action="check-word-parts"]')?.addEventListener("click",()=>submitAnswer(game.selectedWordParts.join("-")));
    app.querySelector('[data-action="check-count"]')?.addEventListener("click",()=>submitAnswer(String(game.countSelected.length)));
    app.querySelector('[data-action="check-missing"]')?.addEventListener("click",()=>{if(game.missingSelection)submitAnswer(game.missingSelection);});
    app.querySelector('[data-action="clear-missing"]')?.addEventListener("click",()=>{if(game.missingAnimating||game.locked)return;game.missingSelection="";stopSpeech();renderGame();});
    app.querySelector('[data-action="next"]')?.addEventListener("click",nextQuestion);
    app.querySelector('[data-action="retry"]')?.addEventListener("click",()=>{game.feedback="";game.feedbackKind="";game.locked=false;if(currentQuestion().mode==="missing")game.missingSelection="";renderGame();});
    app.querySelector('[data-action="skip"]')?.addEventListener("click",nextQuestion);
    app.querySelectorAll("[data-drop]").forEach(b=>b.addEventListener("click",()=>submitAnswer(b.dataset.drop)));
    app.querySelectorAll("[data-link]").forEach(b=>{
      b.addEventListener("click",()=>handleLink(b.dataset.link,b.dataset.key));
      b.addEventListener("pointerdown",event=>startLinkDrag(event,b));
    });
    if(q.mode==="link") { drawLinkedLines(); requestAnimationFrame(drawLinkedLines); }
    if(game.feedback)app.querySelector(".feedback-dialog button")?.focus();
    if(q.mode==="drag")attachDrag();
    if(q.mode==="memory"&&!game.feedback) memoryTimer=setTimeout(()=>{const s=app.querySelector("#memory-symbol"),h=app.querySelector("#memory-hint"),o=app.querySelector("#memory-options");if(s)s.classList.add("memory-hidden");if(h)h.textContent="O que você viu?";if(o)o.hidden=false;playVoiceFile(q.responseAudio);},3500);
  }
  function attachDrag() {
    const character=app.querySelector(".drag-character");if(!character)return;let dragging=false,startX=0,startY=0;
    character.addEventListener("pointerdown",e=>{if(game.locked)return;dragging=true;startX=e.clientX;startY=e.clientY;character.setPointerCapture(e.pointerId);character.classList.add("dragging");});
    character.addEventListener("pointermove",e=>{if(!dragging)return;character.style.transform=`translate(${e.clientX-startX}px,${e.clientY-startY}px) scale(1.12)`;});
    character.addEventListener("pointerup",e=>{if(!dragging)return;dragging=false;character.classList.remove("dragging");character.style.transform="";const target=document.elementFromPoint(e.clientX,e.clientY)?.closest("[data-drop]");if(target)submitAnswer(target.dataset.drop);});
    character.addEventListener("pointercancel",()=>{dragging=false;character.classList.remove("dragging");character.style.transform="";});
  }
  /** Anima a sílaba escolhida até o espaço da palavra antes de validar a resposta. */
  function chooseMissingSyllable(value, button) {
    if(game.locked||game.feedback||game.missingAnimating)return;
    const sourceRect=button.getBoundingClientRect(),oldSlot=app.querySelector(".missing-slot"),targetRect=oldSlot?.getBoundingClientRect();
    game.missingSelection=value;game.missingAnimating=true;renderGame();
    const slot=app.querySelector(".missing-slot");
    if(!slot||!targetRect){game.missingAnimating=false;renderGame();return;}
    slot.classList.add("is-moving");
    const flight=document.createElement("span");flight.className="missing-syllable-flight";flight.textContent=value;
    flight.style.left=`${sourceRect.left}px`;flight.style.top=`${sourceRect.top}px`;flight.style.width=`${sourceRect.width}px`;flight.style.height=`${sourceRect.height}px`;flight.style.fontSize=getComputedStyle(slot).fontSize;
    document.body.append(flight);
    const dx=targetRect.left-sourceRect.left,dy=targetRect.top-sourceRect.top,sx=targetRect.width/sourceRect.width,sy=targetRect.height/sourceRect.height;
    const duration=matchMedia("(prefers-reduced-motion: reduce)").matches?1:520;
    const movement=flight.animate([{transform:"translate(0,0) scale(1)",opacity:1},{transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`,opacity:.96}],{duration,easing:"cubic-bezier(.2,.78,.25,1)",fill:"forwards"});
    movement.finished.catch(()=>{}).finally(()=>{flight.remove();if(!app.contains(slot))return;slot.classList.remove("is-moving");game.missingAnimating=false;playSound("tap");renderGame();});
  }
  function handleLink(side,key) {
    if(game.locked||game.feedback)return;const q=currentQuestion();
    if(side==="left"){game.selectedLeft=key;renderGame();return;}
    if(!game.selectedLeft)return;
    const pair=q.pairs.find(p=>p[0]===game.selectedLeft);
    if(pair&&pair[1]===key){game.linked.push(pair[0]);game.selectedLeft=null;playSound("good");if(game.linked.length===q.pairs.length){game.correct++;game.locked=true;game.feedback="Muito bem! Todos os pares encontrados!";game.feedbackKind="good";playVoiceFile("audio/pares-certos.mp3");}renderGame();}
    else wrongAnswer();
  }
  let activeLinkDrag=null;
  function linkPoint(button,side,boardRect) {
    const buttonRect=button.getBoundingClientRect();
    // Use the visible letter/image bounds instead of the full, wide button.
    // This keeps the connector attached to what the child actually sees.
    let contentRect=button.querySelector(".illustration")?.getBoundingClientRect();
    if(!contentRect||!contentRect.width||!contentRect.height){
      const range=document.createRange();
      range.selectNodeContents(button);
      contentRect=range.getBoundingClientRect();
    }
    const bounds=contentRect&&contentRect.width?contentRect:buttonRect;
    const edgeGap=4;
    return {
      x:(side==="left"?bounds.right+edgeGap:bounds.left-edgeGap)-boardRect.left,
      y:bounds.top+bounds.height/2-boardRect.top
    };
  }
  function drawLinkedLines(preview=null) {
    const board=app.querySelector("[data-link-board]"),svg=board?.querySelector(".link-lines");
    if(!board||!svg)return;
    const rect=board.getBoundingClientRect();svg.setAttribute("viewBox",`0 0 ${rect.width} ${rect.height}`);svg.setAttribute("width",rect.width);svg.setAttribute("height",rect.height);
    const q=currentQuestion();
    const lines=game.linked.map(word=>{
      const pair=q.pairs.find(item=>item[0]===word);if(!pair)return "";
      const left=board.querySelector(`[data-link="left"][data-key="${CSS.escape(pair[0])}"]`),right=board.querySelector(`[data-link="right"][data-key="${CSS.escape(pair[1])}"]`);if(!left||!right)return "";
      const a=linkPoint(left,"left",rect),b=linkPoint(right,"right",rect);
      return `<line class="link-line" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
    }).join("");
    const temporary=preview?`<line class="link-line link-line-preview" x1="${preview.start.x}" y1="${preview.start.y}" x2="${preview.end.x}" y2="${preview.end.y}"/>`:"";
    svg.innerHTML=lines+temporary;
  }
  function startLinkDrag(event,button) {
    if(game.locked||game.feedback||button.disabled||event.button!==0)return;
    event.preventDefault();
    const board=app.querySelector("[data-link-board]"),rect=board.getBoundingClientRect(),start=linkPoint(button,button.dataset.link,rect);
    activeLinkDrag={side:button.dataset.link,key:button.dataset.key,start,board,rect};
    drawLinkedLines({start,end:start});
    const move=moveEvent=>{
      if(!activeLinkDrag)return;
      const r=activeLinkDrag.rect;drawLinkedLines({start:activeLinkDrag.start,end:{x:moveEvent.clientX-r.left,y:moveEvent.clientY-r.top}});
    };
    const finish=(upEvent,cancelled)=>{
      window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",up);window.removeEventListener("pointercancel",cancel);
      if(!activeLinkDrag)return;
      const from=activeLinkDrag;activeLinkDrag=null;
      const end=cancelled?null:document.elementFromPoint(upEvent.clientX,upEvent.clientY)?.closest("[data-link]");
      if(end&&!end.disabled&&end.dataset.link!==from.side){
        const leftKey=from.side==="left"?from.key:end.dataset.key;
        const rightKey=from.side==="right"?from.key:end.dataset.key;
        game.selectedLeft=leftKey;handleLink("right",rightKey);
      } else drawLinkedLines();
    };
    const up=upEvent=>finish(upEvent,false);
    const cancel=cancelEvent=>finish(cancelEvent,true);
    window.addEventListener("pointermove",move);window.addEventListener("pointerup",up);window.addEventListener("pointercancel",cancel);
  }
  function mazePath(q) {
    const cells=[q.start.slice()];let [row,col]=q.start;
    for(const move of q.route){if(move==="⬆️")row--;else if(move==="⬇️")row++;else if(move==="⬅️")col--;else if(move==="➡️")col++;cells.push([row,col]);}
    return cells;
  }
  function moveInMaze(direction) {
    if(game.locked||game.feedback)return;
    const q=currentQuestion(),[row,col]=game.mazePosition;
    const next=[row+(direction==="⬇️")-(direction==="⬆️"),col+(direction==="➡️")-(direction==="⬅️")];
    if(next[0]<0||next[0]>=q.rows||next[1]<0||next[1]>=q.columns||!mazePath(q).some(([r,c])=>r===next[0]&&c===next[1])){showMazeBlockedFeedback();return;}
    game.mazePosition=next;game.mazeMoves++;
    if(next[0]===q.goal[0]&&next[1]===q.goal[1]){submitAnswer("chegou");return;}
    playSound("tap");renderGame();
    [...app.querySelectorAll("[data-maze-direction]")].find((b)=>b.dataset.mazeDirection===direction)?.focus();
  }
  function showMazeBlockedFeedback() {
    const screen=app.querySelector(".screen");
    if(!screen)return;
    clearTimeout(mazeFeedbackTimer);
    screen.classList.remove("maze-blocked");
    void screen.offsetWidth;
    screen.classList.add("maze-blocked");
    mazeFeedbackTimer=setTimeout(()=>screen.classList.remove("maze-blocked"),1000);
    playMazeBlockedSound();
  }
  function revealTreasure(button) {
    if(game.locked||button.disabled)return;
    button.disabled=true;
    button.classList.add("treasure-stone--vanishing");
    playSound("tap");
    treasureTimer=setTimeout(()=>{
      game.treasureRevealed=true;
      renderGame();
      treasureTimer=setTimeout(()=>{if(app.querySelector(".treasure-scene"))submitAnswer("pedra");},1800);
    },650);
  }
  function answerLabel(q) { if(game.followupActive&&q.followup)return q.followup.answer;if(q.mode==="syllables")return q.answer.replaceAll("-"," · ");if(q.mode==="word-parts")return q.answer.replaceAll("-"," + ");if(q.mode==="missing")return `${q.before}${q.answer}${q.after}`;if(q.mode==="compare")return q.answer==="left"?q.leftName:q.rightName;if(q.mode==="treasure")return q.answer;if(q.mode==="link")return "todos os pares corretos";if(q.mode==="maze")return "chegar à casa seguindo os quadrados marrons";return q.answer; }
  function feedbackDialog(q) {
    const success = game.feedbackKind === "good";
    const title = success ? "MUITO BEM!" : "NÃO FOI DESSA VEZ!";
    const message = success ? "Vamos para o próximo desafio!" : game.attemptsLeft > 0 ? `Você ainda tem ${game.attemptsLeft} ${game.attemptsLeft === 1 ? "tentativa" : "tentativas"}.` : `A resposta era ${answerLabel(q)}.`;
    return `<div class="feedback-backdrop"><section class="feedback-dialog ${success ? "good" : "bad"}" role="dialog" aria-modal="true" aria-labelledby="feedback-title"><div class="feedback-icon" aria-hidden="true">${success ? "✓" : "×"}</div><h2 id="feedback-title">${title}</h2><p>${message}</p>${success ? `<button class="feedback-continue" data-action="next">CONTINUAR</button>` : `<div class="feedback-actions">${game.attemptsLeft > 0 ? `<button class="feedback-retry" data-action="retry">TENTAR DE NOVO</button>` : ""}<button class="feedback-continue" data-action="skip">CONTINUAR</button></div>`}</section></div>`;
  }
  /** Centraliza a validação e garante que toda resposta atualize o placar. */
  function submitAnswer(value) { if(game.locked||game.feedback)return;const q=currentQuestion();const expected=game.followupActive&&q.followup?q.followup.answer:q.answer;if(String(value)===String(expected)){if(q.mode==="compare"&&q.followup&&!game.followupActive){game.followupActive=true;game.attemptsLeft=maxAttempts[level];playSound("good");renderGame();return;}if(q.mode==="treasure")game.treasureRevealed=true;game.correct++;game.locked=true;game.feedback="Muito bem! Você acertou!";game.feedbackKind="good";playSound("good");speakPraise();renderGame();}else wrongAnswer(); }
  function wrongAnswer() { if(game.locked||game.feedback)return;game.attemptsLeft--;if(game.attemptsLeft<=0)game.errors++;playSound("bad");if(game.attemptsLeft>0){game.extras++;playVoiceFile("audio/feedback-tentar.mp3");}else{playVoiceFile("audio/feedback-erro.mp3");}game.feedbackKind="bad";game.feedback="resposta-incorreta";if(game.attemptsLeft<=0)game.locked=true;if(currentQuestion().mode==="syllables")game.selectedParts=[];if(currentQuestion().mode==="word-parts")game.selectedWordParts=[];if(currentQuestion().mode==="link")game.selectedLeft=null;if(currentQuestion().mode==="count")game.countSelected=[];renderGame(); }
  function nextQuestion() { if(game.question<9)game.question++;else{renderFinish();return;}game.attemptsLeft=maxAttempts[level];game.locked=false;game.feedback="";game.feedbackKind="";game.missingSelection="";game.missingAnimating=false;game.followupActive=false;game.treasureRevealed=false;game.selectedParts=[];game.selectedWordParts=[];game.selectedLeft=null;game.linked=[];game.countSelected=[];const next=currentQuestion();game.mazeMoves=0;game.mazePosition=next.mode==="maze"?next.start.slice():null;renderGame(); }
  function renderFinish() { clearTimeout(memoryTimer);clearTimeout(treasureTimer);const percentage=Math.round(game.correct/totalQuestions*100),stars=percentage>=80?3:percentage>=50?2:percentage>0?1:0,records=readLevelRecords(),best=Math.max(Number(records[level]?.stars)||0,stars);records[level]={stars:best,score:Math.max(Number(records[level]?.score)||0,game.correct)};try{localStorage.setItem("trilhaMagica.levelRecords",JSON.stringify(records));}catch(_){/* Resultado continua visível nesta sessão. */}app.innerHTML=`<section class="screen finish"><article class="finish-card" data-level="${escapeHtml(level)}"><h1>PARABÉNS!</h1><h2>ATIVIDADES CONCLUÍDAS</h2><div class="finish-stars" aria-label="${stars} de 3 estrelas">${Array.from({length:3},(_,i)=>`<span class="${i<stars?"earned":""}">${i<stars?"★":"☆"}</span>`).join("")}</div><div class="finish-stats"><p><strong>PONTOS</strong><span>${game.correct} / 10</span></p><p><strong>ERROS</strong><span>${game.errors}</span></p><p><strong>TENTATIVAS EXTRAS</strong><span>${game.extras}</span></p></div><div class="finish-actions"><button class="feedback-retry" data-action="replay">TENTAR DE NOVO</button><button class="finish-menu" data-action="menu">VOLTAR AO MENU</button></div></article></section>`;playVoiceFile("audio/fim-jogo.mp3");addSoundToggle();app.querySelector('[data-action="menu"]').addEventListener("click",renderHome);app.querySelector('[data-action="replay"]').addEventListener("click",()=>startGame(level)); }
  // A música começa no primeiro toque ou tecla (os navegadores bloqueiam som antes disso).
  const unlockMusic = () => { startMusic(); if (musicTimer) { window.removeEventListener("pointerdown", unlockMusic); window.removeEventListener("keydown", unlockMusic); } };
  window.addEventListener("pointerdown", unlockMusic);
  window.addEventListener("keydown", unlockMusic);
  document.addEventListener("visibilitychange", () => { if (audioContext) { if (document.hidden) audioContext.suspend(); else audioContext.resume(); } });
  // Som suave ao passar o mouse sobre botões e itens clicáveis.
  app.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "mouse") return;
    const target = event.target.closest?.("button:not(:disabled), [data-link]") || null;
    if (target === lastHover) return;
    lastHover = target;
    const now = performance.now();
    if (target && now - lastHoverAt > 70) { lastHoverAt = now; playSound("hover"); }
  });
  // Toque em qualquer área livre da tela (cantos, fundo) faz um "pop".
  app.addEventListener("pointerdown", (event) => { if (!event.target.closest?.("button, input, [data-link]")) playSound("pop"); });
  window.addEventListener("resize",()=>{ if(game&&app.querySelector("[data-link-board]")) drawLinkedLines(); });
  renderHome();
})();
