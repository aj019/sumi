document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const settingsBtn = document.getElementById('settingsBtn');
  const homePage = document.getElementById('homePage');
  const settingsPage = document.getElementById('settingsPage');
  const backBtn = document.getElementById('backBtn');
  const apiKeyInput = document.getElementById('apiKey');
  const saveApiKeyBtn = document.getElementById('saveApiKey');
  const infoBox = document.getElementById('infoBox');
  const selectedTextBox = document.getElementById('selectedTextBox');
  const summarizeBtn = document.getElementById('summarizeBtn');
  const summaryResultDiv = document.getElementById('summaryResult');
  const statusDiv = document.getElementById('status');

  // Navigation
  settingsBtn.addEventListener('click', () => {
    homePage.style.display = 'none';
    settingsPage.style.display = 'block';
    statusDiv.textContent = '';
    chrome.storage.local.get(['apiKey'], (result) => {
      apiKeyInput.value = result.apiKey || '';
    });
  });
  backBtn.addEventListener('click', () => {
    settingsPage.style.display = 'none';
    homePage.style.display = 'block';
    statusDiv.textContent = '';
  });

  // Save API key
  saveApiKeyBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.local.set({ apiKey }, () => {
        showStatus('API key saved!', 'success');
      });
    } else {
      showStatus('Please enter a valid API key', 'error');
    }
  });

  // Get selected text when popup opens, handle missing content script gracefully
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0] || !tabs[0].id) {
      showInfoBox();
      return;
    }
    chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, (response) => {
      if (chrome.runtime.lastError || !response || !response.text || response.text.trim().length === 0) {
        showInfoBox();
      } else {
        infoBox.style.display = 'none';
        selectedTextBox.style.display = 'block';
        summarizeBtn.style.display = 'block';
        selectedTextBox.textContent = response.text;
      }
    });
  });

  function showInfoBox() {
    infoBox.style.display = 'block';
    selectedTextBox.style.display = 'none';
    summarizeBtn.style.display = 'none';
    summaryResultDiv.style.display = 'none';
  }

  // Summarize button click handler
  summarizeBtn.addEventListener('click', () => {
    const text = selectedTextBox.textContent;
    if (!text) {
      showStatus('Please select some text first', 'error');
      return;
    }
    showStatus('Summarizing...', 'info');
    summaryResultDiv.style.display = 'none';
    chrome.runtime.sendMessage(
      { action: "summarize", text },
      (response) => {
        if (response.error) {
          showStatus(response.error, 'error');
          summaryResultDiv.style.display = 'none';
        } else {
          showStatus('Summary generated!', 'success');
          summaryResultDiv.textContent = response.summary;
          summaryResultDiv.style.display = 'block';
        }
      }
    );
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'status';
      }, 2000);
    }
  }
}); 