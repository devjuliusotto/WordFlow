document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".i18n");
    elements.forEach(el => {
      const messageName = el.getAttribute("data-message");
      el.textContent = chrome.i18n.getMessage(messageName);
    });
  });
  