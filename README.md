# SUMI - Text Summarizer Chrome Extension

This Chrome extension allows you to select any text on a webpage and either summarize it or fix its grammar using OpenAI's API (supports GPT-4.1 if your API key has access). It provides a simple and modern UI for entering your OpenAI API key and viewing the generated results.

# Demo
https://github.com/user-attachments/assets/e0dfd8ec-920d-421f-83cd-63f9216250b0

## Features

- **Text Selection**: Select any text on a webpage and click the extension icon to view it in the popup.
- **Summarize**: Summarize the selected text using OpenAI's API.
- **Fix Grammar**: Instantly correct the grammar of the selected text using OpenAI's API.
- **API Key Management**: Securely store your OpenAI API key in the extension's settings.
- **Modern UI**: Clean and responsive design with a top bar and Font Awesome icons.

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

2. **Summarize or Fix Grammar**:
   - Select any text on a webpage.
   - Click the extension icon to open the popup.
   - You will see the selected text and two buttons: "Summarize" and "Fix Grammar".
   - Click "Summarize" to generate a summary, or "Fix Grammar" to get a grammatically correct version of the text.
   - The result will appear in an easy-to-read box below the buttons.

## Files

- `manifest.json`: Configuration file for the extension.
- `popup.html`: UI for the extension popup.
- `popup.js`: Handles UI interactions and communication with the background script.
- `content.js`: Manages text selection on web pages.
- `background.js`: Handles API calls to OpenAI (supports both summarization and grammar correction).
- `styles.css`: Styling for the extension UI.

## Icons & Libraries

- Uses [Font Awesome](https://fontawesome.com/) for the settings icon (loaded via CDN).
- The extension uses placeholder icons (`icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`). You can replace these with your own icons if desired.

## Model Support

- By default, the extension uses `gpt-4.1` (if your API key has access). You can change the model in `background.js` if needed.

## License

This project is open source and available under the MIT License. 
