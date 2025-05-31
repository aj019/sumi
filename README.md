# SUMI - Text Summarizer Chrome Extension

This Chrome extension allows you to select any text on a webpage and:
- Summarize it
- Fix its grammar
- Rephrase it
- Generate an engaging Twitter thread
- Chat with AI (GPT-4.1, if your API key has access)

It provides a modern UI for entering your OpenAI API key, viewing results, and chatting with AI.

# Demo
https://github.com/user-attachments/assets/e0dfd8ec-920d-421f-83cd-63f9216250b0

## Features

- **Text Selection**: Select any text on a webpage and click the extension icon to view it in the popup.
- **Summarize**: Summarize the selected text using OpenAI's API.
- **Fix Grammar**: Instantly correct the grammar of the selected text.
- **Rephrase**: Get a rephrased version of the selected text.
- **Generate Twitter Thread**: Convert selected text into a professional, engaging Twitter thread with emojis, hashtags, and a call to action. Each tweet is between 270-280 characters.
- **Chat with AI**: Use the chat page to ask questions or have a conversation with the AI.
- **Copy Results**: Easily copy any generated result (summary, grammar, rephrase, thread) with a single click.
- **API Key Management**: Securely store your OpenAI API key in the extension's settings.
- **Modern UI**: Clean, responsive design with a top bar, Font Awesome icons, and improved chat bubbles.

## Installation

1. Clone this repository or download the files.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. **Set Your API Key**:
   - Click on the extension icon to open the popup.
   - Click the settings (gear) icon in the top bar.
   - Enter your OpenAI API key in the settings section and click "Save".

2. **Summarize, Fix Grammar, Rephrase, or Generate Twitter Thread**:
   - Select any text on a webpage.
   - Click the extension icon to open the popup.
   - You will see the selected text and action buttons.
   - Click the desired button to generate a summary, grammar fix, rephrased text, or Twitter thread.
   - The result will appear in an easy-to-read box below the buttons, with a copy button for each result.

3. **Chat with AI**:
   - Click the chat (speech bubble) icon in the top bar.
   - Type your message and press Enter or click the send button.
   - The chat supports Markdown formatting and improved chat bubbles.
   - Use the "Clear Chat" button to clear the chat history.

## Files

- `manifest.json`: Configuration file for the extension.
- `popup.html`: UI for the extension popup.
- `popup.js`: Handles UI interactions, chat, and communication with the background script.
- `content.js`: Manages text selection on web pages.
- `background.js`: Handles API calls to OpenAI (summarization, grammar, rephrase, Twitter thread, chat).
- `styles.css`: Styling for the extension UI and chat.
- `marked.min.js`: Local Markdown parser for rendering AI responses.

## Twitter Thread Prompt
- The extension uses a professional copywriter prompt for Twitter threads:
  > "You are a professional copywriter and would like to convert your text into an engaging Twitter thread. Do not self reference. Do not explain what you are doing. Add emojis to the thread when appropriate. The character count for each thread should be between 270 to 280 characters. Please add relevant hashtags to the post and encourage the Twitter users to join the conversation."

## Icons & Libraries
- Uses [Font Awesome](https://fontawesome.com/) for icons (loaded locally or via CDN if allowed).
- Uses [marked.js](https://marked.js.org/) for Markdown rendering (included locally for CSP compliance).
- The extension uses placeholder icons (`icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`). You can replace these with your own icons if desired.

## Model Support
- By default, the extension uses `gpt-4.1` (if your API key has access). You can change the model in `background.js` if needed.

## License

This project is open source and available under the MIT License. 
