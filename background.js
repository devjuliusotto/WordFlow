chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateWord",
    title: "Traduzir palavra",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "translateWord") {
    const selectedText = info.selectionText;
    const targetLanguage = await getUserLanguage();

    const translation = await fetchTranslation(selectedText, targetLanguage);
    if (translation) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: displayTranslation,
        args: [translation],
      });
    }
  }
});

async function getUserLanguage() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("language", (data) => {
      resolve(data.language || "pt");
    });
  });
}

async function fetchTranslation(text, targetLanguage) {
  const apiKey = "SuaCredencialDaAPI"; // Substitua pela sua chave da API
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(
    text
  )}&target=${targetLanguage}`;

  const response = await fetch(url);
  const result = await response.json();
  return result.data.translations[0].translatedText;
}

function displayTranslation(translation) {
  alert(`Tradução: ${translation}`);
}
