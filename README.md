# AI Interview Assistant

An intelligent interview preparation tool that uses voice recognition and AI to help users practice interview questions. Built with Google's Gemini AI model, this application provides real-time, professional responses to spoken interview questions.

## Project Overview

This application combines speech recognition, artificial intelligence, and a modern web interface to create an interactive interview preparation experience. It captures voice input, processes questions using Google's Gemini API, and provides professional responses both in text and speech format.

## Features

- Real-time speech recognition to capture interview questions
- AI-powered responses using Google's Gemini model for natural, humanized answers
- Browser-based text-to-speech for spoken responses with per-answer mute controls
- Simple web interface built with Eel for easy interaction
- API key management directly in the UI (saved securely for future use)
- Question detection to ignore non-questions and reduce false positives
- Responsive design that works on different screen sizes
- Quick cooldown for faster response times during practice sessions

## Prerequisites

Before running the app, make sure you have:

- Python 3.7 or higher
- A Google Gemini API key (get one from [Google AI Studio](https://aistudio.google.com/))
- Microphone access for speech recognition

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Chaitanya0705/ai-interview-assistant.git
   cd ai-interview-assistant
   ```

2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. (Optional) If you're using a virtual environment (recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install eel SpeechRecognition google-generativeai
   ```

## Usage

1. Run the main script:
   ```
   python inter_ass.py
   ```

2. The app will automatically open in your default web browser at http://localhost:8080.

3. Enter your Google Gemini API key in the input field and click "Save API Key". It will be saved locally for future runs.

4. Click "Start Listening" to begin capturing audio from your microphone.

5. Speak your interview question clearly. The app will detect it, display the question, generate an AI response, and read it aloud (if not muted).

6. Use the "Mute" button in the answers section to toggle audio on/off. Muting stops current speech, and unmuting will read the latest answer.

7. Click "Stop Listening" when you're done. Use "Clear Text" to reset the display.

8. To change or remove your API key, click "Change/Remove API Key".

## Configuration

- **API Key**: Entered via the UI and stored in `config.json` (ignored by Git).
- **Speech Settings**: Audio is handled by your browser's speech synthesis. No additional config needed.
- **Response Style**: Answers are kept short and professional by default. You can tweak the prompt in `inter_ass.py` if needed.
- **Port**: The app runs on port 8080 to avoid conflicts.

## Troubleshooting

- **Microphone Issues**: Ensure your browser and OS allow microphone access. Test in Chrome or Firefox for best results.
- **API Errors**: Check your Gemini API key is valid and has quota. Common errors like 404/503 are handled by model selection.
- **No Responses**: Make sure you're speaking clearly and the question ends with "?" or starts with question words (what, how, why, etc.).
- **Port Conflict**: If port 8080 is busy, edit `inter_ass.py` to change the port in `eel.start()`.
- **Slow Responses**: Ensure a stable internet connection, as API calls require online access.
- **Speech Not Working**: Browser speech synthesis may vary by language/OS. Test with English voices.

If you run into issues, check the browser console (F12) or Python terminal for logs.

## Contributing

If you'd like to contribute to my project, feel free to fork it and submit pull requests. I appreciate any improvements!

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Make your changes and commit: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-branch`.
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. (Note: I chose MIT for simplicity.)

## Author

**Chaitanya A. Patil** - Creator and maintainer

Feel free to reach out if you have questions or suggestions for improvement.

## Acknowledgements

- Google for the Gemini API and generative AI tools.
- Eel library for seamless Python-JS integration.
- SpeechRecognition for microphone handling.
- Browser Speech Synthesis API for text-to-speech.

Thanks for checking out my project! I built this to make interview prep easier—hope it helps you too.
