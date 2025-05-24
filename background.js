chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    chrome.storage.local.get(['apiKey'], async (result) => {
      if (!result.apiKey) {
        sendResponse({ error: "API key not found. Please set your OpenAI API key in the extension settings." });
        return;
      }

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${result.apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4.1",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant that summarizes text. Provide concise and clear summaries."
              },
              {
                role: "user",
                content: `Please summarize the following text:\n\n${request.text}`
              }
            ],
            max_tokens: 150
          })
        });

        const data = await response.json();
        
        if (data.error) {
          sendResponse({ error: data.error.message });
        } else {
          sendResponse({ summary: data.choices[0].message.content });
        }
      } catch (error) {
        sendResponse({ error: "Failed to connect to OpenAI API. Please check your internet connection." });
      }
    });
    return true; // Required for async sendResponse
  }

  if (request.action === "fixGrammar") {
    chrome.storage.local.get(['apiKey'], async (result) => {
      if (!result.apiKey) {
        sendResponse({ error: "API key not found. Please set your OpenAI API key in the extension settings." });
        return;
      }

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${result.apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4.1",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant that corrects grammar. Return only the corrected text."
              },
              {
                role: "user",
                content: `Please correct the grammar of the following text and return only the corrected version:\n\n${request.text}`
              }
            ],
            max_tokens: 300
          })
        });

        const data = await response.json();
        
        if (data.error) {
          sendResponse({ error: data.error.message });
        } else {
          sendResponse({ grammar: data.choices[0].message.content });
        }
      } catch (error) {
        sendResponse({ error: "Failed to connect to OpenAI API. Please check your internet connection." });
      }
    });
    return true; // Required for async sendResponse
  }

  if (request.action === "rephrase") {
    chrome.storage.local.get(['apiKey'], async (result) => {
      if (!result.apiKey) {
        sendResponse({ error: "API key not found. Please set your OpenAI API key in the extension settings." });
        return;
      }

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${result.apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4.1",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant that rephrases text. Return only the rephrased text."
              },
              {
                role: "user",
                content: `Please rephrase the following text and return only the rephrased version:\n\n${request.text}`
              }
            ],
            max_tokens: 300
          })
        });

        const data = await response.json();
        
        if (data.error) {
          sendResponse({ error: data.error.message });
        } else {
          sendResponse({ rephrased: data.choices[0].message.content });
        }
      } catch (error) {
        sendResponse({ error: "Failed to connect to OpenAI API. Please check your internet connection." });
      }
    });
    return true; // Required for async sendResponse
  }
}); 