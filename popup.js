document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const settingsBtn = document.getElementById('settingsBtn');
  const chatBtn = document.getElementById('chatBtn');
  const homePage = document.getElementById('homePage');
  const settingsPage = document.getElementById('settingsPage');
  const chatPage = document.getElementById('chatPage');
  const backBtn = document.getElementById('backBtn');
  const chatBackBtn = document.getElementById('chatBackBtn');
  const apiKeyInput = document.getElementById('apiKey');
  const saveApiKeyBtn = document.getElementById('saveApiKey');
  const infoBox = document.getElementById('infoBox');
  const selectedTextBox = document.getElementById('selectedTextBox');
  const summarizeBtn = document.getElementById('summarizeBtn');
  const fixGrammarBtn = document.getElementById('fixGrammarBtn');
  const rephraseBtn = document.getElementById('rephraseBtn');
  const buttonColumn = document.getElementById('buttonColumn');
  const summaryResultDiv = document.getElementById('summaryResult');
  const grammarResultDiv = document.getElementById('grammarResult');
  const rephraseResultDiv = document.getElementById('rephraseResult');
  const summaryText = document.getElementById('summaryText');
  const grammarText = document.getElementById('grammarText');
  const rephraseText = document.getElementById('rephraseText');
  const copySummaryBtn = document.getElementById('copySummaryBtn');
  const copyGrammarBtn = document.getElementById('copyGrammarBtn');
  const copyRephraseBtn = document.getElementById('copyRephraseBtn');
  const statusDiv = document.getElementById('status');
  // Chat elements
  const chatHistoryDiv = document.getElementById('chatHistory');
  const chatInput = document.getElementById('chatInput');
  const sendChatBtn = document.getElementById('sendChatBtn');
  const clearChatBtn = document.getElementById('clearChatBtn');

  // Navigation
  settingsBtn.addEventListener('click', () => {
    homePage.style.display = 'none';
    chatPage.style.display = 'none';
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
  chatBtn.addEventListener('click', () => {
    homePage.style.display = 'none';
    settingsPage.style.display = 'none';
    chatPage.style.display = 'flex';
    statusDiv.textContent = '';
    renderChatHistory();
    chatInput.focus();
  });
  chatBackBtn.addEventListener('click', () => {
    chatPage.style.display = 'none';
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
        buttonColumn.style.display = 'block';
        selectedTextBox.textContent = response.text;
      }
    });
  });

  function showInfoBox() {
    infoBox.style.display = 'block';
    selectedTextBox.style.display = 'none';
    buttonColumn.style.display = 'none';
    summaryResultDiv.style.display = 'none';
    grammarResultDiv.style.display = 'none';
    rephraseResultDiv.style.display = 'none';
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
    grammarResultDiv.style.display = 'none';
    rephraseResultDiv.style.display = 'none';
    chrome.runtime.sendMessage(
      { action: "summarize", text },
      (response) => {
        if (response.error) {
          showStatus(response.error, 'error');
          summaryResultDiv.style.display = 'none';
        } else {
          showStatus('Summary generated!', 'success');
          summaryText.innerHTML = marked.parse(response.summary);
          summaryResultDiv.style.display = 'block';
        }
      }
    );
  });

  // Fix Grammar button click handler
  fixGrammarBtn.addEventListener('click', () => {
    const text = selectedTextBox.textContent;
    if (!text) {
      showStatus('Please select some text first', 'error');
      return;
    }
    showStatus('Fixing grammar...', 'info');
    summaryResultDiv.style.display = 'none';
    grammarResultDiv.style.display = 'none';
    rephraseResultDiv.style.display = 'none';
    chrome.runtime.sendMessage(
      { action: "fixGrammar", text },
      (response) => {
        if (response.error) {
          showStatus(response.error, 'error');
          grammarResultDiv.style.display = 'none';
        } else {
          showStatus('Grammar fixed!', 'success');
          grammarText.innerHTML = marked.parse(response.grammar);
          grammarResultDiv.style.display = 'block';
        }
      }
    );
  });

  // Rephrase button click handler
  rephraseBtn.addEventListener('click', () => {
    const text = selectedTextBox.textContent;
    if (!text) {
      showStatus('Please select some text first', 'error');
      return;
    }
    showStatus('Rephrasing...', 'info');
    summaryResultDiv.style.display = 'none';
    grammarResultDiv.style.display = 'none';
    rephraseResultDiv.style.display = 'none';
    chrome.runtime.sendMessage(
      { action: "rephrase", text },
      (response) => {
        if (response.error) {
          showStatus(response.error, 'error');
          rephraseResultDiv.style.display = 'none';
        } else {
          showStatus('Text rephrased!', 'success');
          rephraseText.innerHTML = marked.parse(response.rephrased);
          rephraseResultDiv.style.display = 'block';
        }
      }
    );
  });

  // Chat logic
  let chatHistory = [];

  sendChatBtn.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  });

  function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    chatInput.value = '';
    chatHistory.push({ role: 'user', content: message });
    renderChatHistory();
    chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
    showStatus('Waiting for AI...', 'info');
    chrome.runtime.sendMessage(
      { action: 'chat', messages: chatHistory },
      (response) => {
        if (response && response.reply) {
          chatHistory.push({ role: 'assistant', content: response.reply });
          renderChatHistory();
          chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
        } else if (response && response.error) {
          showStatus(response.error, 'error');
        } else {
          showStatus('No response from AI.', 'error');
        }
      }
    );
  }

  function renderChatHistory() {
    chatHistoryDiv.innerHTML = '';
    chatHistory.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble ' + (msg.role === 'user' ? 'user' : 'ai');
      if (msg.role === 'assistant') {
        bubble.innerHTML = marked.parse(msg.content);
      } else {
        bubble.textContent = msg.content;
      }
      chatHistoryDiv.appendChild(bubble);
    });
  }

  // Copy functionality
  copySummaryBtn.addEventListener('click', () => {
    copyToClipboard(summaryText.textContent);
    showStatus('Copied!', 'success');
  });
  copyGrammarBtn.addEventListener('click', () => {
    copyToClipboard(grammarText.textContent);
    showStatus('Copied!', 'success');
  });
  copyRephraseBtn.addEventListener('click', () => {
    copyToClipboard(rephraseText.textContent);
    showStatus('Copied!', 'success');
  });

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

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

  clearChatBtn.addEventListener('click', () => {
    chatHistory = [];
    renderChatHistory();
    showStatus('Chat cleared!', 'success');
  });
}); 