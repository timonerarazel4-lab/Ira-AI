# Ira AI - Chat Assistant

A modern, responsive web application for chatting with an AI assistant called **Ira**, powered by OpenAI's GPT models.

## Features

✨ **Modern Chat Interface** - Clean, intuitive UI with real-time messaging
🤖 **AI-Powered** - Powered by OpenAI's GPT-3.5 and GPT-4 models
💾 **Persistent Storage** - Chat history and settings saved locally in your browser
⚙️ **Customizable Settings** - Choose your AI model, adjust temperature, and manage API keys
📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
🎨 **Beautiful Design** - Modern UI with smooth animations and transitions
🔒 **Secure** - API key stored locally in browser storage, never sent to external servers

## Getting Started

### Prerequisites

- A web browser (Chrome, Firefox, Safari, Edge)
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone or download this repository:
```bash
git clone <repository-url>
cd Ira-AI
```

2. Open the application:
```bash
# Option 1: Use a simple HTTP server
python -m http.server 8000
# Then open http://localhost:8000/public/index.html

# Option 2: Open the file directly in your browser
# Right-click on public/index.html → Open with → Your browser
```

3. Add your OpenAI API key:
   - Click the ⚙️ settings icon in the top right
   - Paste your OpenAI API key
   - Choose your preferred model (GPT-3.5 Turbo or GPT-4)
   - Adjust temperature for creativity (0-2)
   - Your settings are automatically saved

## Project Structure

```
Ira-AI/
├── public/
│   ├── index.html       # Main HTML file with chat UI
│   └── styles.css       # All styling for the chat interface
├── src/
│   └── chat.js          # Chat logic and API integration
└── README.md            # This file
```

## Usage

1. **Start Chatting**: Type your message in the input field and press Enter or click Send
2. **Adjust Settings**: Click ⚙️ to customize the AI model and temperature
3. **Clear History**: Use the Clear Chat History button to reset the conversation
4. **Copy Messages**: Click on any message to select and copy it

## Configuration

### API Models Available

- **GPT-3.5 Turbo** - Fast, cost-effective
- **GPT-4** - Most capable, better for complex tasks
- **GPT-4 Turbo** - Latest and fastest GPT-4 variant

### Temperature Setting

- **0-0.5**: More focused and deterministic responses
- **0.7**: Default, balanced between creativity and consistency
- **1.0-2.0**: More creative and varied responses

## Tips for Best Results

💡 Be specific in your prompts for better responses
💡 Use the temperature setting to fine-tune response style
💡 The AI remembers context within the conversation
💡 Clear chat history to start fresh conversations

## Security

- Your API key is stored **only in your browser's local storage**
- All API calls are made directly to OpenAI (HTTPS encrypted)
- No data is stored on any external servers
- Clear your browser data to remove stored API key and chat history

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### "Please add your OpenAI API key in settings"
- Make sure you've added your API key in the settings modal
- Check that the API key is valid and has access to the chat API

### "Failed to get response from OpenAI"
- Verify your internet connection
- Check your API key is valid
- Ensure you have available credits on your OpenAI account
- Check OpenAI's status page for any service issues

### Messages not appearing
- Try clearing browser cache
- Check browser console (F12) for any errors
- Ensure JavaScript is enabled

## API Costs

Each message sent to OpenAI will incur a cost based on:
- The model you're using (GPT-3.5 is cheaper than GPT-4)
- The number of tokens used (input + output)

Check [OpenAI's pricing page](https://openai.com/pricing) for current rates.

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox and animations
- **Vanilla JavaScript** - No frameworks, pure JS
- **OpenAI API** - AI-powered responses

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue on GitHub or contact the maintainers.

---

Enjoy chatting with Ira! 🚀
