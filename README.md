# SUMI - Text Summarizer Chrome Extension

This Chrome extension allows you to select any text on a webpage and summarize it using OpenAI's API. It provides a simple and modern UI for entering your OpenAI API key and viewing the generated summary.

## Features

- **Text Selection**: Select any text on a webpage and click the extension icon to view it in the popup.
- **OpenAI Integration**: Summarize the selected text using OpenAI's API.
- **API Key Management**: Securely store your OpenAI API key in the extension's settings.
- **Modern UI**: Clean and responsive design for a great user experience.

## Installation

1. Clone this repository or download the files.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. **Set Your API Key**:
   - Click on the extension icon to open the popup.
   - Enter your OpenAI API key in the settings section and click "Save".

2. **Summarize Text**:
   - Select any text on a webpage.
   - Click the extension icon to open the popup.
   - Click the "Summarize" button to generate a summary of the selected text.

## Files

- `manifest.json`: Configuration file for the extension.
- `popup.html`: UI for the extension popup.
- `popup.js`: Handles UI interactions and communication with the background script.
- `content.js`: Manages text selection on web pages.
- `background.js`: Handles API calls to OpenAI.
- `styles.css`: Styling for the extension UI.


## License

This project is open source and available under the MIT License. 
