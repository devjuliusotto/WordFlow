function showTranslationCard(x, y, translation) {
    removeTranslationCard();
  
    // Container do card
    translationCard = document.createElement("div");
    translationCard.style.position = "absolute";
    translationCard.style.left = `${x + 10}px`;
    translationCard.style.top = `${y + 10}px`;
    translationCard.style.backgroundColor = "#f9f9f9";
    translationCard.style.border = "1px solid #ccc";
    translationCard.style.borderRadius = "5px";
    translationCard.style.padding = "8px";
    translationCard.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    translationCard.style.zIndex = "1000";
    translationCard.style.fontSize = "14px";
    translationCard.style.color = "#333";
    
    // Texto da tradução
    const translationText = document.createElement("p");
    translationText.textContent = translation;
    translationText.style.margin = "0 0 8px 0";
    
    // Botão de áudio
    const audioButton = document.createElement("button");
    audioButton.textContent = "🔊 Ouvir";
    audioButton.style.cursor = "pointer";
    audioButton.addEventListener("click", () => {
      speakText(translation);
    });
    
    translationCard.appendChild(translationText);
    translationCard.appendChild(audioButton);
  
    document.body.appendChild(translationCard);
  
    translationCard.addEventListener("mouseleave", removeTranslationCard);
  }
  
  // Função que usa a Speech Synthesis API
  function speakText(text) {
    // Cria um objeto de fala
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Ajuste de voz/idioma
    // Se quiser, você pode detectar o idioma do usuário, ou deixar fixo
    // utterance.lang = "pt-BR"; // ou "en-US", etc.
  
    // Reproduz
    window.speechSynthesis.speak(utterance);
  }
  