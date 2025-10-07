
const MAX_MISSES = 6,
  MAX_SKIPS = 8,
  missSound = new Audio("./music/wrong.mp3");
missSound.volume = 0.2;
const notesCorrectElement = document.getElementById("notes-correct"),
  notesIncorrectElement = document.getElementById("notes-incorrect"),
  notesSkipElement = document.getElementById("notes-skip"),
  backgroundColorToggle = document.getElementById("background-color-toggle"),
  missSoundsToggle = document.getElementById("miss-sounds-toggle");
let changeBgColor = backgroundColorToggle.checked,
  playSounds = missSoundsToggle.checked,
  originalBackgroundColor = document.body.style.backgroundColor;
backgroundColorToggle.addEventListener("change", function () {
  (changeBgColor = this.checked),
    changeBgColor ||
    (document.body.style.backgroundColor = originalBackgroundColor);
}),
  missSoundsToggle.addEventListener("change", function () {
    playSounds = this.checked;
  });
let recursiveTimeout,
  promiseTimeout,
  timeoutID,
  playButton,
  index = 0,
  correct = 0,
  misses = 0,
  skips = 0,
  success = !1,
  keyPressed = !1,
  successImageUrl = "images/success.png",
  expectedKeys = [],
  imageText = document.querySelector(".image-text"),
  image = document.querySelector(".image-container img"),
  originalFontSize = parseInt(window.getComputedStyle(imageText).fontSize),
  currentLanguage = navigator.language || navigator.userLanguage,
  positions = [
    [10, 47],
    [25, 20],
    [25, 73],
    [62, 13],
    [62, 79],
    [88, 60],
    [88, 33],
  ],
  delay = [
    650, 650, 700, 1500, 1500, 600, 3e3, 1400, 1200, 1200, 3300, 1800, 1500,
    1e3, 2400, 1500, 1500, 1500, 3400, 600, 1200, 1200, 1e3, 1e3, 3400, 1100,
    1100, 1100, 1700, 400, 400, 3400, 1100, 1100, 1100, 1e3, 400, 1100, 3e3,
    1100, 1100, 1100, 1100, 400, 3400, 1100, 1100, 1100, 1100, 1100, 3e3, 1100,
    1100,
  ];

function playMissSound() {
  missSound.pause(),
    (missSound.currentTime = 0),
    missSound.play();
}
function generateNotes() {
  for (
    var e = ["A", "B", "C", "D", "E", "F", "G", "A#", "C#", "D#", "F#", "G#"],
    t = [1, 1, 1, 1, 1, 1, 1, 0.1, 0.1, 0.1, 0.1, 0.1],
    o = ["3", "2", "1"],
    s = 0;
    s < 50;
    s++
  ) {
    var n = weightedRandomSelection(e, t);
    o.push(n);
  }
  return o;
}
function weightedRandomSelection(e, t) {
  for (
    var o = t.reduce((e, t) => e + t, 0), s = Math.random() * o, n = 0, i = 0;
    i < e.length;
    i++
  )
    if (s < (n += t[i])) return e[i];
  return e[e.length - 1];
}
function updateKeyframes(e) {
  Array.from(document.styleSheets).filter(
    (e) => !e.href || e.href.startsWith(window.location.origin)
  );
  for (let e = 0; e < document.styleSheets.length; e++)
    if (
      document.styleSheets[e].href &&
      document.styleSheets[e].href.endsWith("styles.css")
    ) {
      var t = document.styleSheets[e];
      break;
    }
  if (!t) return void console.error("Could not find styles.css stylesheet");
  if (null === t.cssRules)
    return void (t.onload = function () {
      updateKeyframes(e);
    });
  let o;
  for (let e = t.cssRules.length - 1; e >= 0; e--)
    if (
      t.cssRules[e] instanceof CSSKeyframesRule &&
      "blink-and-move-up" === t.cssRules[e].name
    ) {
      o = t.cssRules[e];
      break;
    }
  if (o) {
    o.deleteRule("0%"), o.deleteRule("24%"), o.deleteRule("100%");
    let t = parseInt(e.style.top),
      s = t - 10;
    o.appendRule(`0% { opacity: .8; top: ${t}%; }`),
      o.appendRule(`24% { opacity: 0; top: ${s}%; }`),
      o.appendRule(`100% { opacity: 0; top: ${s}%; }`);
  }
}
function updateScores() {
  (notesCorrectElement.textContent = correct.toString()),
    (notesIncorrectElement.textContent = misses.toString()),
    (notesSkipElement.textContent = skips.toString());
}
function updateImageText() {
  if ((100 == index || skips > 8 || misses > 6)) {
    document.querySelector("#audio-element").pause();
    let e = document.querySelector(".flute-results");
    return (
      (e.innerHTML =
        "pt-br" == currentLanguage || "pt_br" == currentLanguage
          ? `Falha!<br>Skips: ${skips}<br>Erros: ${misses}`
          : `Fail!<br>Skips: ${skips}<br>Misses: ${misses}`),
      (e.style.display = "block"),
      changeBgColor && (document.body.style.backgroundColor = "#3b1f22ff"),
      (imageText.style.top = "-200%"),
      (imageText.style.left = "-200%"),
      (imageText.innerHTML = ""),
      image.classList.add("blur"),
      (playButton.textContent = "Bora dnv burrão"),
      (playButton.style.display = "inline-block"),
      void (playButton.onclick = function () {
        window.location.href = urlPath;

      })
    );
  }
  if (index < window.notes.length) {
    let e = delay[index];
    if (index > 2) {
      let t = positions[Math.floor(Math.random() * positions.length)];
      (imageText.style.top = t[0] + "%"),
        (imageText.style.left = t[1] + "%"),
        (imageText.style.fontSize = originalFontSize + "px"),
        updateKeyframes(imageText),
        imageText.classList.remove("image-text"),
        imageText.offsetWidth,
        imageText.classList.add("image-text"),
        (imageText.innerHTML = window.notes[index]),
        (keyPressed = !1),
        (expectedKeys = teclasPadrao[window.notes[index]]);
      new Promise((t, o) => {


        const s = (e) => {
          (keyPressed = !0),
            validarTecla(e, teclasPadrao[window.notes[index - 1]])
              ? (changeBgColor &&
                (document.body.style.backgroundColor = "#13382cff"),
                correct++,
                updateScores())
              : (playSounds && playMissSound(),
                changeBgColor &&
                (document.body.style.backgroundColor = "#3b1f22ff"),
                misses++,
                updateScores()),
            document.removeEventListener("keypress", s),
            t();
        };
        document.addEventListener("keypress", s),
          (promiseTimeout = setTimeout(() => {
            document.removeEventListener("keypress", s),
              o(new Error("Timeout"));
          }, Math.min(800, e)));
      })
        .then(() => {
          // console.log("Key pressed"),
          (timeoutID = setTimeout(() => {
            index < window.notes.length &&
              skips <= 8 &&
              misses <= 6 &&
              (document.body.style.backgroundColor = originalBackgroundColor);
          }, 400));
        })
        .catch((e) => {
          // console.log(e.message), 
          skips++, updateScores();
        })
        .finally(() => {
          if (skips > 8 || misses > 6)
            return (
              (index = 100),
              clearTimeout(recursiveTimeout),
              clearTimeout(promiseTimeout),
              clearTimeout(timeoutID),
              void setTimeout(updateImageText(), 1)
            );
        });
    } else
      (pillar = [35, 43]),
        (imageText.style.top = pillar[0] + "%"),
        (imageText.style.left = pillar[1] + "%"),
        (imageText.style.fontSize = 3 * originalFontSize + "px"),
        updateKeyframes(imageText),
        imageText.classList.remove("image-text"),
        imageText.offsetWidth,
        imageText.classList.add("image-text"),
        (imageText.innerHTML = window.notes[index]);
    // console.log("OK!", skips, misses),
    index++,
      (recursiveTimeout = setTimeout(updateImageText, e));
  } else {
    // console.log("SUCCESS!"), (success = !0);
    let e = document.querySelector(".flute-results");
    (e.innerHTML =
      "pt-br" == currentLanguage || "pt_br" == currentLanguage
        ? `Sucesso!<br>Skips: ${skips}<br>Erros: ${misses}`
        : `Success!<br>Skips: ${skips}<br>Misses: ${misses}`),
      (e.style.display = "block"),
      changeBgColor && (document.body.style.backgroundColor = "#13382cff"),
      (image.src = successImageUrl),
      image.classList.add("blur"),
      (imageText.style.top = "-200%"),
      (imageText.style.left = "-200%"),
      (imageText.innerHTML = ""),
      (playButton.textContent = "Bora dnv"),
      (playButton.style.display = "inline-block"),
      (playButton.onclick = function () {
        window.location.href = urlPath;

      });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  playButton = document.querySelector("#play-button");
  const e = document.querySelector("#audio-element");
  let t = !1;
  e.addEventListener("canplaythrough", () => {
    (t = !0),
      (playButton.textContent = "Bora flautear!"),
      (playButton.style.backgroundColor = "#23072b"),
      (playButton.disabled = !1);
  }),
    playButton.addEventListener("click", () => {
      t &&
        (e.play(),
          (window.notes = generateNotes()),
          (playButton.style.display = "none"),
          updateImageText());
    }),
    (playButton.textContent = "Loading..."),
    (playButton.style.backgroundColor = "gray"),
    (playButton.disabled = !0);
});


function toggleFullScreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||
    (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}



const logDiv = document.getElementById('log');
const comandos = [];
let teclasAtivas = new Set();
let capturando = false;
let teclaSendoCapturada = null;


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const AParamKey = urlParams.get('A') || "1";
const BParamKey = urlParams.get('B') || "2";
const CParamKey = urlParams.get('C') || "3";
const DParamKey = urlParams.get('D') || "4";
const EParamKey = urlParams.get('E') || "5";
const FParamKey = urlParams.get('F') || "6";
const GParamKey = urlParams.get('G') || "7";
const AcerqParamKey = urlParams.get('Acerq') || "8";
const CcerqParamKey = urlParams.get('Ccerq') || "9";
const DcerqParamKey = urlParams.get('Dcerq') || "0";
const FcerqParamKey = urlParams.get('Fcerq') || "-";
const GcerqParamKey = urlParams.get('Gcerq') || "+";


let teclasPadrao = {
  A: AParamKey,
  B: BParamKey,
  C: CParamKey,
  D: DParamKey,
  E: EParamKey,
  F: FParamKey,
  G: GParamKey,
  "A#": AcerqParamKey,
  "C#": CcerqParamKey,
  "D#": DcerqParamKey,
  "F#": FcerqParamKey,
  "G#": GcerqParamKey,
};

// console.log('Teclas padrão carregadas:', teclasPadrao);
const idBotoes = ['A_start', 'B_start', 'C_start', 'D_start', 'E_start', 'F_start', 'G_start', 'Acerq_start', 'Ccerq_start', 'Dcerq_start', 'Fcerq_start', 'Gcerq_start'];
for (let i = 0; i < idBotoes.length; i++) {
  const nota = idBotoes[i].replace('_start', '').replace('cerq', '#');
  document.getElementById(idBotoes[i]).textContent = `${gerarComandoAPartirDoCodigo(teclasPadrao[nota])}`;
}


function gerarComando(teclas) {
  const modificadores = ["Control", "Alt", "Shift", "Meta"];
  const ordenadas = [...teclas].sort((a, b) => {
    const ia = modificadores.indexOf(a);
    const ib = modificadores.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
  return ordenadas.join(" + ");
}

function gerarCodigo(teclas) {
  return [...teclas]
    .map(t => t.toUpperCase().replace(" ", "|_|").replace("#", "cerq").replace("^", "circumflexo"))
    .join("|_|");
}

function gerarComandoAPartirDoCodigo(codigo) {
  console.log("Gerando comando a partir do código:", codigo);
  if (codigo == null || codigo == "") return "";

  if (codigo.includes("cerq")) {
    codigo = codigo.replace("cerq", "#");
  }
  if (codigo.includes("circumflexo")) {
    codigo = codigo.replace("circumflexo", "^");
  }

  return codigo.split("|_|").join(" + ");
}

function desabilitarOsOutrosBotoesDeHotkey(idBotao) {
  if (idBotao == null || idBotao == "") {
    for (let i = 0; i < idBotoes.length; i++) {
      document.getElementById(idBotoes[i]).disabled = false;
      document.getElementById(idBotoes[i]).classList.add('button-rgb');
    }
    return;
  }
  for (let i = 0; i < idBotoes.length; i++) {
    if (idBotoes[i] != idBotao) {
      document.getElementById(idBotoes[i]).disabled = true;
      document.getElementById(idBotoes[i]).classList.remove('button-rgb');
    } else {
      document.getElementById(idBotoes[i]).disabled = false;
      document.getElementById(idBotoes[i]).classList.add('button-rgb');
    }
  }
}
document.getElementById('A_start').addEventListener('click', () => {
  desabilitarOsOutrosBotoesDeHotkey('A_start');
  logDiv.innerText = "bota a tecla ou combinação pra A ae...\n";
  teclasAtivas.clear();
  capturando = true;
  teclaSendoCapturada = 'A_start';
});
document.getElementById('B_start').addEventListener('click', () => {
  desabilitarOsOutrosBotoesDeHotkey('B_start');
  logDiv.innerText = "bota a tecla ou combinação pra B ae...\n";
  teclasAtivas.clear();
  capturando = true;
  teclaSendoCapturada = 'B_start';
});
document.getElementById('C_start').addEventListener('click', () => {
  desabilitarOsOutrosBotoesDeHotkey('C_start');
  logDiv.innerText = "bota a tecla ou combinação pra C ae...\n";
  teclasAtivas.clear();
  capturando = true;
  teclaSendoCapturada = 'C_start';
});
document.getElementById('D_start').addEventListener('click', () => {
  desabilitarOsOutrosBotoesDeHotkey('D_start');
  logDiv.innerText = "bota a tecla ou combinação pra D ae...\n";
  teclasAtivas.clear();
  capturando = true;
  teclaSendoCapturada = 'D_start';
});
document.getElementById('E_start').addEventListener('click', () => {
  desabilitarOsOutrosBotoesDeHotkey('E_start');
  logDiv.innerText = "bota a tecla ou combinação pra E ae...\n";
  teclasAtivas.clear();
  capturando = true;
  teclaSendoCapturada = 'E_start';
});
document.getElementById('F_start').addEventListener('click', () => {
  desabilitarOsOutrosBotoesDeHotkey('F_start');
  logDiv.innerText = "bota a tecla ou combinação pra F ae...\n";
  teclasAtivas.clear();
  capturando = true;
  teclaSendoCapturada = 'F_start';
});
document.getElementById('G_start').addEventListener('click', () => {
  desabilitarOsOutrosBotoesDeHotkey('G_start');
  logDiv.innerText = "bota a tecla ou combinação pra G ae...\n";
  teclasAtivas.clear();
  capturando = true;
  teclaSendoCapturada = 'G_start';
});
document.getElementById('Acerq_start').addEventListener('click', () => {
  desabilitarOsOutrosBotoesDeHotkey('Acerq_start');
  logDiv.innerText = "bota a tecla ou combinação pra A# ae...\n";
  teclasAtivas.clear();
  capturando = true;
  teclaSendoCapturada = 'Acerq_start';
});
document.getElementById('Ccerq_start').addEventListener('click', () => {
  desabilitarOsOutrosBotoesDeHotkey('Ccerq_start');
  logDiv.innerText = "bota a tecla ou combinação pra C# ae...\n";
  teclasAtivas.clear();
  capturando = true;
  teclaSendoCapturada = 'Ccerq_start';
});
document.getElementById('Dcerq_start').addEventListener('click', () => {
  desabilitarOsOutrosBotoesDeHotkey('Dcerq_start');
  logDiv.innerText = "bota a tecla ou combinação pra D# ae...\n";
  teclasAtivas.clear();
  capturando = true;
  teclaSendoCapturada = 'Dcerq_start';
});
document.getElementById('Fcerq_start').addEventListener('click', () => {
  desabilitarOsOutrosBotoesDeHotkey('Fcerq_start');
  logDiv.innerText = "bota a tecla ou combinação pra F# ae...\n";
  teclasAtivas.clear();
  capturando = true;
  teclaSendoCapturada = 'Fcerq_start';
});
document.getElementById('Gcerq_start').addEventListener('click', () => {
  desabilitarOsOutrosBotoesDeHotkey('Gcerq_start');
  logDiv.innerText = "bota a tecla ou combinação pra G# ae...\n";
  teclasAtivas.clear();
  capturando = true;
  teclaSendoCapturada = 'Gcerq_start';
});


document.addEventListener('keydown', (event) => {
  if (!capturando) return;
  teclasAtivas.add(event.key);
});

document.addEventListener('keyup', (event) => {
  if (!capturando || !teclaSendoCapturada) return;

  if (teclasAtivas.has("Dead")) {
    teclasAtivas.delete("Dead");
    teclasAtivas.add("^");
  }
  const comando = gerarComando(teclasAtivas);
  const codigo = gerarCodigo(teclasAtivas);


  document.getElementById(teclaSendoCapturada).textContent = `${comando}`;
  teclasPadrao[teclaSendoCapturada.replace('_start', '').replace('cerq', '#')] = codigo;
  logDiv.innerText = "";

  teclasAtivas.clear();
  capturando = false;
  teclaSendoCapturada = null;
  desabilitarOsOutrosBotoesDeHotkey("");
  urlPath = '?A=' + teclasPadrao['A'] + '&B=' + teclasPadrao['B'] + '&C=' + teclasPadrao['C'] + '&D=' + teclasPadrao['D'] + '&E=' + teclasPadrao['E'] + '&F=' + teclasPadrao['F'] + '&G=' + teclasPadrao['G'] + '&Acerq=' + teclasPadrao['A#'] + '&Ccerq=' + teclasPadrao['C#'] + '&Dcerq=' + teclasPadrao['D#'] + '&Fcerq=' + teclasPadrao['F#'] + '&Gcerq=' + teclasPadrao['G#'];
});

function validarTecla(event, codigoEsperado) {
  const teclas = new Set();
  if (event.ctrlKey) teclas.add("Control");
  if (event.altKey) teclas.add("Alt");
  if (event.shiftKey) teclas.add("Shift");
  if (event.metaKey) teclas.add("Meta");
  teclas.add(event.key);

  const codigo = gerarCodigo(teclas);
  // console.log("Tecla pressionada:", codigo);
  // console.log("Tecla esperada:", codigoEsperado);
  return codigo === codigoEsperado;
}

let urlPath = '?A=' + teclasPadrao['A'] + '&B=' + teclasPadrao['B'] + '&C=' + teclasPadrao['C'] + '&D=' + teclasPadrao['D'] + '&E=' + teclasPadrao['E'] + '&F=' + teclasPadrao['F'] + '&G=' + teclasPadrao['G'] + '&Acerq=' + teclasPadrao['A#'] + '&Ccerq=' + teclasPadrao['C#'] + '&Dcerq=' + teclasPadrao['D#'] + '&Fcerq=' + teclasPadrao['F#'] + '&Gcerq=' + teclasPadrao['G#'];
function copiarUrlComAsHotkeysProClipboard() {

  try {
    navigator.clipboard.writeText(window.location.origin + urlPath);
    alert('URL com as hotkeys tão no seu seu CNTRL + V meu chapa');
  } catch (err) {
    alert('Deu pau pra colocar a URL no seu CNTRL + V, se vira');
  }
}
