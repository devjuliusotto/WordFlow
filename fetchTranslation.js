const MAX_REQUESTS_PER_MINUTE = 10; // defina o limite que desejar
const ONE_MINUTE = 60 * 1000;

async function fetchTranslation(text, targetLanguage) {
  const canRequest = await canMakeRequest();
  if (!canRequest) {
    console.warn("Limite de requisições atingido. Tente novamente mais tarde.");
    return "Limite de requisições atingido. Tente novamente mais tarde.";
  }

  // ... resto do código da API
}

async function canMakeRequest() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["requestsLog"], (data) => {
      let requestsLog = data.requestsLog || [];

      // Filtrar requisições que aconteceram no último minuto
      const now = Date.now();
      requestsLog = requestsLog.filter(
        (timestamp) => now - timestamp < ONE_MINUTE
      );

      if (requestsLog.length < MAX_REQUESTS_PER_MINUTE) {
        // Pode fazer a requisição
        requestsLog.push(now);
        chrome.storage.local.set({ requestsLog }, () => {
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  });
}
