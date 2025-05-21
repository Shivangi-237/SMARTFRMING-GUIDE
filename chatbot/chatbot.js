document.addEventListener("DOMContentLoaded", () => {
  const el = {
    launcher   : document.getElementById("chatbot-launcher"),
    robotBtn   : document.getElementById("robot-button"),
    box        : document.getElementById("chatbot-container"),
    closeBtn   : document.getElementById("close-chat"),
    langToggle : document.getElementById("language-toggle"),
    quickOpt   : document.getElementById("chat-quick-options"),
    messages   : document.getElementById("chat-messages"),
    userInput  : document.getElementById("user-input"),
    sendBtn    : document.getElementById("send-btn"),
    speakBtn   : document.getElementById("tts-btn"),
    voiceBtn   : document.getElementById("voice-toggle-btn"),
    speakNow   : document.getElementById("speak-now"),
    listenNow : document.getElementById("listen-now")
  };

  const state = {
    voiceActive     : false,
    recognition     : null,
    speechSynth     : window.speechSynthesis || window.webkitSpeechSynthesis,
    currentLanguage : "en",
    firstOpen       : true,
     hasSentFirstMessage: false
  };

  // 👉 Scroll to bottom of chat
  const scrollBottom = () =>
    (el.messages.scrollTop = el.messages.scrollHeight);

  // 👉 Add message bubble
  const addMessage = (sender, text) => {
    if (!text) return;
    const wrap = document.createElement("div");
    wrap.className = `message ${sender}`;
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;
    wrap.appendChild(bubble);
    el.messages.appendChild(wrap);
    scrollBottom();
  };

  // 👉 Typing indicator
  const showTyping = () => {
    const ind = document.createElement("div");
    ind.className = "typing-indicator";
    ind.innerHTML = "<span></span><span></span><span></span>";
    el.messages.appendChild(ind);
    scrollBottom();
    return ind;
  };

  // 👉 Speech output
 const speak = (text) => {
  if (!state.voiceActive) return;

  const u = new SpeechSynthesisUtterance(text);
  u.lang = state.currentLanguage === "en" ? "en-US" : "hi-IN";

  u.onstart = () => el.speakNow.classList.add("show");
  u.onend   = () => el.speakNow.classList.remove("show");

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
};

  // 👉 Greeting
  const getGreeting = () => {
    const h = new Date().getHours();
    const greetingMap = {
      en: { m: "Good morning!", a: "Good afternoon!", e: "Good evening!" },
      hi: { m: "सुप्रभात!", a: "नमस्ते!", e: "शुभ संध्या!" }
    };
    const t = h < 12 ? "m" : h < 18 ? "a" : "e";
    return greetingMap[state.currentLanguage][t] + 
      (state.currentLanguage === "en"
        ? " How can I assist your farming today?"
        : " मैं आपकी खेती में कैसे मदद कर सकता हूँ?");
  };

  // 👉 Quick options (mapped to real prompts)
  const quickOptions = {
    en: {
      "Disease Detection": "Let's start with disease detection. Describe the symptoms you see.",
      "Seed Identification": "Sure! Send a seed image or describe it.",
      "Weather Forecast": "Tell me your location and I’ll fetch the forecast.",
      "General Help": "Ask anything about farming — I'm here to help!"
    },
    hi: {
      "Disease Detection": "आइए रोग पहचान से शुरू करें। लक्षण बताइए।",
      "Seed Identification": "ज़रूर! बीज की तस्वीर भेजें या वर्णन करें।",
      "Weather Forecast": "अपना स्थान बताइए, मैं मौसम पूर्वानुमान दिखाऊंगा।",
      "General Help": "कृषि से जुड़ा कोई भी प्रश्न पूछें।"
    }
  };

const loadQuickOptions = () => {
  el.quickOpt.innerHTML = "";

  const opts = quickOptions[state.currentLanguage];
  Object.keys(opts).forEach(label => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = label;

    div.addEventListener("click", async () => {
      const message = opts[label];
        if (!state.hasSentFirstMessage) {
    el.quickOpt.classList.add("hidden");
    state.hasSentFirstMessage = true;

    // Remove greeting message
    el.messages.querySelectorAll(".message.system").forEach(msg => {
      if (msg.textContent.includes("How can I assist") || msg.textContent.includes("मैं आपकी खेती")) {
        msg.remove();
      }
    });
  }


      // 🧼 Hide options and mark as used
      el.quickOpt.classList.add("hidden");
      state.firstOpen = false;

      // ✅ Send to backend, but do NOT show user message
      const typing = showTyping();

      try {
        const response = await fetch("http://localhost:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            language: state.currentLanguage
          })
        });

        const data = await response.json();
        typing.remove();

        if (data.response) {
          addMessage("system", data.response);
          speak(data.response);
        } else {
          addMessage("system", state.currentLanguage === "en"
            ? "No response from assistant."
            : "सहायक से कोई उत्तर नहीं मिला।");
        }
      } catch (error) {
        typing.remove();
        addMessage("system", state.currentLanguage === "en"
          ? "Connection error. Please try again."
          : "कनेक्शन त्रुटि। कृपया पुनः प्रयास करें।");
      }
    });

    el.quickOpt.appendChild(div);
  });
};

  // 👉 Send message handler
  async function handleSend(message) {
      if (!state.hasSentFirstMessage) {
    el.quickOpt.classList.add("hidden");
    state.hasSentFirstMessage = true;

    // Remove greeting message
    el.messages.querySelectorAll(".message.system").forEach(msg => {
      if (msg.textContent.includes("How can I assist") || msg.textContent.includes("मैं आपकी खेती")) {
        msg.remove();
      }
    });
  }

    addMessage("user", message);
    el.userInput.value = "";
    const typing = showTyping();

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          language: state.currentLanguage
        })
      });

      const data = await response.json();
      typing.remove();

      if (data.response) {
        addMessage("system", data.response);
        speak(data.response);
      } else {
        addMessage("system", state.currentLanguage === "en"
          ? "No response from assistant."
          : "सहायक से कोई उत्तर नहीं मिला।");
      }
    } catch (error) {
      typing.remove();
      addMessage("system", state.currentLanguage === "en"
        ? "Connection error. Please try again."
        : "कनेक्शन त्रुटि। कृपया पुनः प्रयास करें।");
    }
  }

  // 👉 Voice input (speech-to-text)
  const initRecognition = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      el.speakBtn.disabled = true;
      return;
    }
    const rec = new SR();
    rec.lang = state.currentLanguage === "en" ? "en-US" : "hi-IN";
    rec.interimResults = false;
    rec.onstart = () => {
  el.listenNow.classList.add("show");
};
rec.onerror = () => {
  el.listenNow.classList.remove("show");
};
rec.onend = () => {
  el.listenNow.classList.remove("show");
};
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript.trim();
      el.userInput.value = text;
      handleSend(text);
    };
    state.recognition = rec;
  };

  // 👉 Event bindings
  el.robotBtn.addEventListener("click", () => {
    el.box.classList.add("show");
    if (state.firstOpen) {
      loadQuickOptions();
      el.quickOpt.classList.remove("hidden");
      addMessage("system", getGreeting());
      state.firstOpen = false;
    }
  });

  el.closeBtn.addEventListener("click", () => {
    el.box.classList.remove("show");
  });

  el.sendBtn.addEventListener("click", () => {
    const msg = el.userInput.value.trim();
    if (msg) handleSend(msg);
  });

  el.userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") el.sendBtn.click();
  });

  el.voiceBtn.addEventListener("click", () => {
    state.voiceActive = !state.voiceActive;
    el.voiceBtn.textContent = state.voiceActive ? "Voice: On" : "Voice: Off";
    if (!state.voiceActive) {
      window.speechSynthesis.cancel();
      el.speakNow.style.display = "none";
    }
  });

  el.speakBtn.addEventListener("click", () => {
    if (state.recognition) {
      state.recognition.lang = state.currentLanguage === "en" ? "en-US" : "hi-IN";
      state.recognition.start();
    }
  });

el.langToggle.addEventListener("change", () => {
  state.currentLanguage = el.langToggle.value;

  // 🔁 Reset messages
  el.messages.innerHTML = "";

  // 🧹 Clear and reload options
  el.quickOpt.innerHTML = "";
  state.firstOpen = true;
  state.hasSentFirstMessage = false; // NEW: reset "has responded" flag

  loadQuickOptions();
  el.quickOpt.classList.remove("hidden");

  // 👋 Show greeting in selected language
  addMessage("system", getGreeting());
});


  initRecognition();
});
