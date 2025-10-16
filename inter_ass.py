import eel
import speech_recognition as sr
from google import genai
from google.genai import types
import threading
import json
import os
import time
import re

eel.init('web')

class AudioAssistant:
    def __init__(self):
        self.setup_audio()
        self.is_listening = False
        self.client = None
        self.api_key = None
        self.load_api_key()

    def setup_audio(self):
        self.recognizer = sr.Recognizer()
        self.mic = sr.Microphone()
        with self.mic as source:
            self.recognizer.adjust_for_ambient_noise(source)

    def load_api_key(self):
        if os.path.exists('config.json'):
            with open('config.json', 'r') as f:
                config = json.load(f)
                self.set_api_key(config.get('api_key'))

    def set_api_key(self, api_key):
        self.api_key = api_key
        os.environ['GOOGLE_API_KEY'] = self.api_key
        self.client = genai.Client()
        with open('config.json', 'w') as f:
            json.dump({'api_key': api_key}, f)

    def delete_api_key(self):
        self.api_key = None
        self.client = None
        self.is_listening = False  # Stop listening if active
        if os.path.exists('config.json'):
            os.remove('config.json')

    def has_api_key(self):
        return self.api_key is not None

    def toggle_listening(self):
        if not self.client:
            return False
        self.is_listening = not self.is_listening
        if self.is_listening:
            threading.Thread(target=self.listen_and_process, daemon=True).start()
        return self.is_listening

    def listen_and_process(self):
        cooldown_time = 1  # Cooldown period in seconds
        last_speak_time = 0
        
        while self.is_listening:
            current_time = time.time()
            if (current_time - last_speak_time) > cooldown_time:
                try:
                    with self.mic as source:
                        audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=5)
                    text = self.recognizer.recognize_google(audio)
                    if self.is_question(text):
                        capitalized_text = text[0].upper() + text[1:]
                        if not capitalized_text.endswith('?'):
                            capitalized_text += '?'
                        eel.update_ui(f"Q: {capitalized_text}", "")
                        response = self.get_ai_response(capitalized_text)
                        eel.update_ui("", f"{response}")
                        last_speak_time = time.time()  # Update the last speak time
                except sr.WaitTimeoutError:
                    pass
                except sr.UnknownValueError:
                    pass
                except Exception as e:
                    eel.update_ui(f"An error occurred: {str(e)}", "")
            else:
                time.sleep(0.1)  # Short sleep to prevent busy waiting

    def is_question(self, text):
        # Convert to lowercase for easier matching
        text = text.lower().strip()
        
        # List of question words and phrases
        question_starters = [
            "what", "why", "how", "when", "where", "who", "which",
            "can", "could", "would", "should", "is", "are", "do", "does",
            "am", "was", "were", "have", "has", "had", "will", "shall"
        ]
        
        # Check if the text starts with a question word
        if any(text.startswith(starter) for starter in question_starters):
            return True
        
        # Check for question mark at the end
        if text.endswith('?'):
            return True
        
        # Check for inverted word order (e.g., "Are you...?", "Can we...?")
        if re.match(r'^(are|can|could|do|does|have|has|will|shall|should|would|am|is)\s', text):
            return True
        
        # Check for specific phrases that indicate a question
        question_phrases = [
            "tell me about", "i'd like to know", "can you explain",
            "i was wondering", "do you know", "what about", "how about"
        ]
        if any(phrase in text for phrase in question_phrases):
            return True
        
        # If none of the above conditions are met, it's probably not a question
        return False

    def get_ai_response(self, question):
        try:
            prompt = f"Provide a brief, concise, professional, and humanized answer to this interview question, as if you're speaking naturally in an interview. Keep it short and to the point: {question}"
            response = self.client.models.generate_content(
                model="gemini-2.0-flash-exp",
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.0,
                    max_output_tokens=200,
                ),
            )
            text_response = response.text
            return json.dumps({"text": text_response, "audio": None})
        except Exception as e:
            print(f"Error in get_ai_response: {str(e)}")  # Add this line for debugging
            return json.dumps({"text": f"Error getting AI response: {str(e)}", "audio": None})

assistant = AudioAssistant()

@eel.expose
def toggle_listening():
    return assistant.toggle_listening()

@eel.expose
def save_api_key(api_key):
    try:
        assistant.set_api_key(api_key)
        return True
    except Exception as e:
        print(f"Error saving API key: {str(e)}")
        return False

@eel.expose
def delete_api_key():
    try:
        assistant.delete_api_key()
        return True
    except Exception as e:
        print(f"Error deleting API key: {str(e)}")
        return False

@eel.expose
def has_api_key():
    return assistant.has_api_key()

eel.start('index.html', size=(960, 840), port=8080)
