let recognition = null;
let isListening = false;
let onResultCallback = null;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export function initSpeech(onResult) {
  onResultCallback = onResult;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResultCallback) onResultCallback(transcript);
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      stopListening();
    };

    recognition.onend = () => {
      isListening = false;
      updateMicUI(false);
    };
  }
}

export function startListening() {
  if (!recognition) {
    alert("Browser tidak mendukung Speech Recognition. Gunakan Chrome.");
    return;
  }
  try {
    recognition.start();
    isListening = true;
    updateMicUI(true);
  } catch (e) {
    console.warn("Recognition already started");
  }
}

export function stopListening() {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
    updateMicUI(false);
  }
}

export function toggleListening() {
  if (isListening) {
    stopListening();
  } else {
    startListening();
  }
}

export function speak(text, onEnd) {
  if (!window.speechSynthesis) {
    console.warn("Speech synthesis not supported");
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 1.0;
  utterance.pitch = 1.1;

  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(
    (v) => v.lang.startsWith("id") && v.name.toLowerCase().includes("female")
  ) || voices.find((v) => v.lang.startsWith("id"));

  if (femaleVoice) utterance.voice = femaleVoice;

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

function updateMicUI(listening) {
  const btn = document.getElementById("btn-mic");
  if (btn) {
    if (listening) {
      btn.classList.add("listening");
      btn.textContent = "Stop";
    } else {
      btn.classList.remove("listening");
      btn.textContent = "Mic";
    }
  }
}
