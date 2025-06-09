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
  const twitterThreadBtn = document.getElementById('twitterThreadBtn');
  const twitterThreadResultDiv = document.getElementById('twitterThreadResult');
  const twitterThreadText = document.getElementById('twitterThreadText');
  const copyTwitterThreadBtn = document.getElementById('copyTwitterThreadBtn');
  const grammarBtn = document.getElementById('grammarBtn');
  const threadBtn = document.getElementById('threadBtn');
  const customPromptBtn = document.getElementById('customPromptBtn');
  const customPromptInput = document.getElementById('customPromptInput');
  const resultDiv = document.getElementById('result');

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

  // Function to process text with a given action
  function processText(action, customPrompt = null) {
    const text = selectedTextBox.textContent;
    if (!text) {
      showStatus('Please select some text first', 'error');
      return;
    }

    // Show loading state
    showStatus('Processing...', 'info');
    
    // Hide all result divs
    summaryResultDiv.style.display = 'none';
    grammarResultDiv.style.display = 'none';
    rephraseResultDiv.style.display = 'none';
    twitterThreadResultDiv.style.display = 'none';
    resultDiv.style.display = 'none';

    chrome.runtime.sendMessage({
      action: "processText",
      text: text,
      actionType: action,
      customPrompt: customPrompt
    }, function(response) {
      if (response.error) {
        showStatus(response.error, 'error');
      } else {
        showStatus('Done!', 'success');
        
        // Show result in the appropriate div
        if (action === 'summarize') {
          summaryText.innerHTML = marked.parse(response.summary);
          summaryResultDiv.style.display = 'block';
        } else if (action === 'grammar') {
          grammarText.innerHTML = marked.parse(response.summary);
          grammarResultDiv.style.display = 'block';
        } else if (action === 'rephrase') {
          rephraseText.innerHTML = marked.parse(response.summary);
          rephraseResultDiv.style.display = 'block';
        } else if (action === 'thread') {
          twitterThreadText.innerHTML = marked.parse(response.summary);
          twitterThreadResultDiv.style.display = 'block';
        } else {
          // For custom prompts and other actions
          document.getElementById('resultText').innerHTML = marked.parse(response.summary);
          resultDiv.style.display = 'block';
        }
      }
    });
  }

  // Event listeners for buttons
  summarizeBtn.addEventListener('click', () => processText('summarize'));
  grammarBtn.addEventListener('click', () => processText('grammar'));
  rephraseBtn.addEventListener('click', () => processText('rephrase'));
  threadBtn.addEventListener('click', () => processText('thread'));
  
  customPromptBtn.addEventListener('click', () => {
    const prompt = customPromptInput.value.trim();
    if (prompt) {
      processText('custom', prompt);
    } else {
      showStatus('Please enter a custom prompt', 'error');
    }
  });

  // Allow Enter key to trigger custom prompt
  customPromptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      customPromptBtn.click();
    }
  });

  // Add copy button functionality for the result div
  document.getElementById('copyResultBtn').addEventListener('click', () => {
    copyToClipboard(document.getElementById('resultText').textContent);
    showStatus('Copied!', 'success');
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

  twitterThreadBtn.addEventListener('click', () => {
    const text = selectedTextBox.textContent;
    if (!text) {
      showStatus('Please select some text first', 'error');
      return;
    }
    showStatus('Generating Twitter thread...', 'info');
    summaryResultDiv.style.display = 'none';
    grammarResultDiv.style.display = 'none';
    rephraseResultDiv.style.display = 'none';
    twitterThreadResultDiv.style.display = 'none';
    chrome.runtime.sendMessage(
      { action: "twitterThread", text },
      (response) => {
        if (response.error) {
          showStatus(response.error, 'error');
          twitterThreadResultDiv.style.display = 'none';
        } else {
          showStatus('Thread generated!', 'success');
          twitterThreadText.innerHTML = marked.parse(response.thread);
          twitterThreadResultDiv.style.display = 'block';
        }
      }
    );
  });

  copyTwitterThreadBtn.addEventListener('click', () => {
    copyToClipboard(twitterThreadText.textContent);
    showStatus('Copied!', 'success');
  });
}); 