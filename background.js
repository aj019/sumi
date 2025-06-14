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

  if (request.action === "chat") {
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
            messages: request.messages,
            max_tokens: 500
          })
        });
        const data = await response.json();
        if (data.error) {
          sendResponse({ error: data.error.message });
        } else {
          sendResponse({ reply: data.choices[0].message.content });
        }
      } catch (error) {
        sendResponse({ error: "Failed to connect to OpenAI API. Please check your internet connection." });
      }
    });
    return true; // Required for async sendResponse
  }

  if (request.action === "twitterThread") {
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
                content: "You are a professional copywriter and would like to convert your text into an engaging Twitter thread.   Do not self reference. Do not explain what you are doing. Add emojis to the thread when appropriate. The character count for each thread should be between 270 to 280 characters. Please add relevant hashtags to the post and encourage the Twitter users to join the conversation. "
              },
              {
                role: "user",
                content: `Convert the following text into a summarized, engaging Twitter thread. Each tweet should be concise, engaging, and formatted as a bullet or number.\n\n${request.text}`
              }
            ],
            max_tokens: 5000
          })
        });
        const data = await response.json();
        if (data.error) {
          sendResponse({ error: data.error.message });
        } else {
          sendResponse({ thread: data.choices[0].message.content });
        }
      } catch (error) {
        sendResponse({ error: "Failed to connect to OpenAI API. Please check your internet connection." });
      }
    });
    return true; // Required for async sendResponse
  }

  if (request.action === "processText") {
    const apiKey = request.apiKey;
    const selectedText = request.text;
    const action = request.actionType;

    let prompt = "";
    switch (action) {
      case "summarize":
        prompt = `Summarize the following text in a clear and concise way:\n\n${selectedText}`;
        break;
      case "grammar":
        prompt = `Fix any grammar, spelling, or punctuation errors in the following text. Only return the corrected text without any explanations:\n\n${selectedText}`;
        break;
      case "rephrase":
        prompt = `Rephrase the following text to make it more clear and engaging while maintaining its original meaning:\n\n${selectedText}`;
        break;
      case "thread":
        prompt = `You are a professional copywriter and would like to convert your text into an engaging Twitter thread. Do not self reference. Do not explain what you are doing. Add emojis to the thread when appropriate. The character count for each thread should be between 270 to 280 characters. Please add relevant hashtags to the post and encourage the Twitter users to join the conversation.\n\nText to convert:\n${selectedText}`;
        break;
      case "custom":
        prompt = `${request.customPrompt}\n\nText to process:\n${selectedText}`;
        break;
      default:
        sendResponse({ error: "Invalid action type" });
        return;
    }

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
                content: "You are a helpful writing assistant with years of experience in writing."
              },
              {
                role: "user",
                content: prompt
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
}); 