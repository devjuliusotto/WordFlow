// chrome.storage.local.js

/**
 * Lê do cache local se já existe a tradução salva.
 */
async function getCachedTranslation(text, targetLanguage) {
  return new Promise((resolve) => {
    chrome.storage.local.get([`${text}_${targetLanguage}`], (result) => {
      resolve(result[`${text}_${targetLanguage}`]);
    });
  });
}

/**
 * Salva a tradução no cache local.
 */
async function saveCachedTranslation(text, targetLanguage, translation) {
  const key = `${text}_${targetLanguage}`;
  const data = {};
  data[key] = translation;
  chrome.storage.local.set(data, () => {
    console.log(
      `Tradução para '${text}' em '${targetLanguage}' salva no cache.`
    );
  });
}

/**
 * Faz a tradução usando Google Translate API,
 * detecta o idioma de origem e retorna { translation, detectedSourceLanguage }.
 */
async function fetchTranslation(text, targetLanguage) {
  // 1. Verifica se já está em cache
  const cached = await getCachedTranslation(text, targetLanguage);
  if (cached) {
    console.log(`Usando tradução em cache para '${text}'.`);
    // Se você quiser retornar também um "detectedSourceLanguage", não temos no cache,
    // então você pode decidir retornar algo genérico (ex: "auto") ou armazenar junto no cache
    // Por simplicidade, retorno aqui "auto":
    return {
      translation: cached,
      detectedSourceLanguage: "auto",
    };
  }

  // 2. Se não está em cache, chama a API
  const apiKey = "YOUR_API_KEY"; // substitua pela sua chave
  // Adicione `&source=auto` se quiser que a API detecte o idioma automaticamente.
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(
    text
  )}&target=${targetLanguage}&source=auto`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Erro na requisição:", response.status, response.statusText);
      return { translation: null, detectedSourceLanguage: null };
    }

    const result = await response.json();
    // Exemplo de result.data.translations[0] = {
    //   "translatedText": "...",
    //   "detectedSourceLanguage": "en"
    // }

    if (!result.data || !result.data.translations) {
      console.error("Resposta inválida da API:", result);
      return { translation: null, detectedSourceLanguage: null };
    }

    const translationObj = result.data.translations[0];
    const translation = translationObj.translatedText;
    const detectedSourceLanguage =
      translationObj.detectedSourceLanguage || "en";

    // 3. Salva no cache apenas o texto traduzido
    // (Se quiser salvar também o 'detectedSourceLanguage', teria que estruturar differently)
    await saveCachedTranslation(text, targetLanguage, translation);

    // 4. Retorna objeto com { translation, detectedSourceLanguage }
    return { translation, detectedSourceLanguage };
  } catch (error) {
    console.error("Erro durante a tradução:", error);
    return { translation: null, detectedSourceLanguage: null };
  }
}
