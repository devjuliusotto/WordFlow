// content.js

// Variável global para armazenar o card de tradução
let translationCard = null;

// Escuta um único evento de mouseup para capturar o texto selecionado
document.addEventListener("mouseup", async (event) => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    const targetLanguage = await getUserLanguage();
    // Obtemos apenas a tradução, pois seu fetchTranslation atual
    // não retorna idioma de origem
    const translation = await fetchTranslation(selectedText, targetLanguage);

    if (translation) {
      // Exibe o card estilizado, passando texto original e tradução
      showTranslationCard(event.pageX, event.pageY, selectedText, translation);
    }
  }
});

/**
 * Obtém o idioma definido nas opções (padrão "pt" se não definido).
 */
async function getUserLanguage() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("language", (data) => {
      resolve(data.language || "pt");
    });
  });
}

/**
 * Faz a requisição à API do Google Translate (SEM detecção de idioma de origem).
 * Retorna somente o texto traduzido (string).
 */
async function fetchTranslation(text, targetLanguage) {
  const apiKey = "AIzaSyBTPZkZMuihI4TJKpPFEeLHPRHKnKVbHNA"; // Substitua pela sua chave
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(
    text
  )}&target=${targetLanguage}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        "Erro na requisição:",
        response.status,
        response.statusText
      );
      return null;
    }
    const result = await response.json();
    if (!result.data || !result.data.translations) {
      console.error("Resposta inválida da API:", result);
      return null;
    }
    return result.data.translations[0].translatedText;
  } catch (error) {
    console.error("Erro ao traduzir:", error);
    return null;
  }
}

/**
 * Cria e exibe o card de tradução com design estilizado,
 * incluindo botão de pronúncia do texto original e assinatura "By Julius Otto".
 */
function showTranslationCard(x, y, originalText, translation) {
  removeTranslationCard(); // Remove o card anterior, se existir

  // Cria o container principal do card
  translationCard = document.createElement("div");

  // ESTILOS "AQUA"
  translationCard.style.position = "absolute";
  translationCard.style.left = `${x + 10}px`;
  translationCard.style.top = `${y + 10}px`;
  translationCard.style.width = "270px";
  translationCard.style.background =
    "linear-gradient(135deg, #00ffff 0%, #e0ffff 100%)"; // degrade "aqua"
  translationCard.style.border = "2px solid #00ced1";
  translationCard.style.borderRadius = "16px";
  translationCard.style.padding = "16px";
  translationCard.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
  translationCard.style.zIndex = "9999";
  translationCard.style.fontFamily = "'Trebuchet MS', sans-serif";
  translationCard.style.fontSize = "14px";
  translationCard.style.color = "#004e4e";

  // Título da palavra original
  const originalTitle = document.createElement("h3");
  originalTitle.textContent = originalText;
  originalTitle.style.margin = "0 0 6px 0";
  originalTitle.style.fontSize = "18px";
  originalTitle.style.fontWeight = "bold";
  originalTitle.style.color = "#004242";
  translationCard.appendChild(originalTitle);

  // Texto com a tradução
  const translatedParagraph = document.createElement("p");
  translatedParagraph.textContent = translation;
  translatedParagraph.style.margin = "0 0 12px 0";
  translatedParagraph.style.fontSize = "15px";
  translatedParagraph.style.lineHeight = "1.4";
  translatedParagraph.style.fontWeight = "500";
  translationCard.appendChild(translatedParagraph);

  // Container de botões
  const buttonsContainer = document.createElement("div");
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.gap = "8px";
  translationCard.appendChild(buttonsContainer);

  // Botão de áudio (pronuncia o texto original em "en-US")
  const speakButton = document.createElement("button");
  speakButton.textContent = "🔊 Pronunciar";
  speakButton.style.cursor = "pointer";
  speakButton.style.padding = "8px 12px";
  speakButton.style.fontSize = "14px";
  speakButton.style.border = "none";
  speakButton.style.borderRadius = "4px";
  speakButton.style.backgroundColor = "#008080";
  speakButton.style.color = "#ffffff";

  speakButton.addEventListener("click", () => {
    // Como você não detecta automaticamente o idioma,
    // vamos supor que é inglês. Ajuste se preferir outro idioma:
    speakText(originalText, "en-US");
  });
  buttonsContainer.appendChild(speakButton);

  // Botão de fechar o card
  const closeButton = document.createElement("button");
  closeButton.textContent = "Fechar";
  closeButton.style.cursor = "pointer";
  closeButton.style.padding = "8px 12px";
  closeButton.style.fontSize = "14px";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "4px";
  closeButton.style.backgroundColor = "#ff6961";
  closeButton.style.color = "#ffffff";

  closeButton.addEventListener("click", removeTranslationCard);
  buttonsContainer.appendChild(closeButton);

  // Assinatura "By Julius Otto"
  const signature = document.createElement("p");
  signature.textContent = "By Julius Otto";
  signature.style.fontStyle = "italic";
  signature.style.fontSize = "13px";
  signature.style.textAlign = "right";
  signature.style.marginTop = "16px";
  signature.style.color = "#003333";
  translationCard.appendChild(signature);

  // Adiciona o card ao body
  document.body.appendChild(translationCard);

  // Se quiser remover o card quando o mouse sair, pode usar:
  // translationCard.addEventListener("mouseleave", removeTranslationCard);
}

/**
 * Remove o card de tradução, se existir
 */
function removeTranslationCard() {
  if (translationCard) {
    translationCard.remove();
    translationCard = null;
  }
}

/**
 * Função para falar o texto, aqui forçamos "en-US" como idioma de pronúncia.
 * Se quiser outro idioma fixo ou uma lógica mais avançada, é só alterar.
 */
function speakText(text, lang = "en-US") {
  if (!window.speechSynthesis) {
    console.warn("Speech Synthesis não é suportada neste navegador.");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}
