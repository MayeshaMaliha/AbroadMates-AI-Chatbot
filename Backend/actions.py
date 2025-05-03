from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from typing import Dict, Text, Any, List
import os
import random
import logging
import google.generativeai as genai

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Joke triggers and responses
FUNNY_TRIGGERS = ["joke", "funny", "make me laugh", "tell me a joke", "meaning of life"]
FUNNY_RESPONSES = [
    "Why don't skeletons fight each other? They don't have the guts!",
    "I'm reading a book on anti-gravity. It's impossible to put down!",
    "What do you call a fake noodle? An impasta!",
    "Why did the math book look sad? Because it had too many problems."
]

# Gemini prompt
RESPONSE_TEMPLATE = (
    "You're a helpful AI advisor for study abroad students. Answer this question clearly:\n\n"
    "{query}\n\n"
    "Respond with useful, practical info. Use bullet points if helpful."
)

FALLBACK_MESSAGE = "❌ Sorry, I couldn't get the answer right now. Please try again later."

class ActionAskGemini(Action):
    def name(self) -> Text:
        return "action_ask_gemini"

    def get_model(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.error("❌ GEMINI_API_KEY missing from environment.")
            return None
        try:
            genai.configure(api_key=api_key)
            return genai.GenerativeModel("gemini-1.5-flash")
        except Exception as e:
            logger.error(f"❌ Error configuring Gemini: {e}")
            return None

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:

        user_message = tracker.latest_message.get("text", "").strip().lower()
        logger.info(f"📩 Received message: {user_message}")

        # Handle jokes
        if any(trigger in user_message for trigger in FUNNY_TRIGGERS):
            joke = random.choice(FUNNY_RESPONSES)
            dispatcher.utter_message(joke)
            return []

        # Reject too-short queries
        if len(user_message.split()) < 3:
            dispatcher.utter_message("❓ Could you please ask a more specific question?")
            return []

        # Prepare Gemini
        model = self.get_model()
        if not model:
            dispatcher.utter_message("⚠️ AI service not available.")
            return []

        prompt = RESPONSE_TEMPLATE.format(query=user_message)

        # Call Gemini
        try:
            response = model.generate_content(prompt)
            logger.info(f"✅ Gemini response object: {response}")

            # Try getting text
            if hasattr(response, "text") and response.text:
                reply = response.text.strip()
                dispatcher.utter_message(reply)
            elif hasattr(response, "candidates"):
                raw = response.candidates[0].content.parts[0].text
                dispatcher.utter_message(raw.strip())
            else:
                logger.warning("⚠️ Unexpected Gemini response format.")
                dispatcher.utter_message(FALLBACK_MESSAGE)

        except Exception as e:
            logger.error(f"❌ Gemini exception: {e}")
            dispatcher.utter_message(FALLBACK_MESSAGE)

        return []
