const chatBubble = document.getElementById("chat-bubble");
const chatText = document.getElementById("chat-text");

let hideTimeout = null;

export function showBubble(text, duration = 5000) {
  // Amankan bila elemen bubble belum/ tidak ada di DOM.
  if (!chatBubble || !chatText) return;
  if (hideTimeout) clearTimeout(hideTimeout);

  chatText.textContent = "";
  chatBubble.classList.remove("hidden");
  chatText.classList.add("typing");

  let i = 0;
  const typeSpeed = Math.max(20, Math.min(50, 2000 / text.length));

  function typeChar() {
    if (i < text.length) {
      chatText.textContent += text[i];
      i++;
      setTimeout(typeChar, typeSpeed);
    } else {
      chatText.classList.remove("typing");
      hideTimeout = setTimeout(() => {
        chatBubble.classList.add("hidden");
      }, duration);
    }
  }

  typeChar();
}

export function showBubbleInstant(text, duration = 5000) {
  if (!chatBubble || !chatText) return;
  if (hideTimeout) clearTimeout(hideTimeout);

  chatText.classList.remove("typing");
  chatText.textContent = text;
  chatBubble.classList.remove("hidden");

  hideTimeout = setTimeout(() => {
    chatBubble.classList.add("hidden");
  }, duration);
}

export function hideBubble() {
  if (!chatBubble || !chatText) return;
  if (hideTimeout) clearTimeout(hideTimeout);
  chatText.classList.remove("typing");
  chatBubble.classList.add("hidden");
}
