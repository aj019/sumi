document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveApiKeyBtn = document.getElementById('saveApiKey');
  const summarizeBtn = document.getElementById('summarizeBtn');
  const selectedTextDiv = document.getElementById('selectedText');
  const summaryResultDiv = document.getElementById('summaryResult');
  const statusDiv = document.getElementById('status');

  // Load saved API key
  chrome.storage.local.get(['apiKey'], (result) => {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
  });

  // Save API key
  saveApiKeyBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.local.set({ apiKey }, () => {
        showStatus('API key saved successfully!', 'success');
      });
    } else {
      showStatus('Please enter a valid API key', 'error');
    }
  });

  // Get selected text when popup opens
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, (response) => {
      if (response && response.text) {
        selectedTextDiv.textContent = response.text;
      }
    });
  });

  // Summarize button click handler
  summarizeBtn.addEventListener('click', () => {
    const text = selectedTextDiv.textContent;
    if (!text || text === 'Select text on any webpage and click the extension icon to summarize it.') {
      showStatus('Please select some text first', 'error');
      return;
    }

    showStatus('Summarizing...', 'info');
    chrome.runtime.sendMessage(
      { action: "summarize", text },
      (response) => {
        if (response.error) {
          showStatus(response.error, 'error');
          summaryResultDiv.textContent = '';
        } else {
          showStatus('Summary generated successfully!', 'success');
          summaryResultDiv.textContent = response.summary;
        }
      }
    );
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'status';
    }, 3000);
  }
}); 