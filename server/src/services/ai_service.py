from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage
import getpass
import os
import json 
import re
from dotenv import load_dotenv

class AiService:
   def __init__(self):
      self.model = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
      self.chatHistory = [
      SystemMessage(
      """
      You are a helpful study assistant. You will be responsible for helping create study materials for the user.
      """)
      ]

   async def chat(self, prompt: str):
      self.chatHistory.append(prompt)
      tokenContents = ""
      async for token in self.model.astream(self.chatHistory):
         print(token.content, end="|\n")
         tokenContents += token.content
      self.chatHistory.append(tokenContents)
      return tokenContents

   async def create_flashcards(self, number: float, subject: str, description: str = ""):
      messages = [
      SystemMessage(
      """
      You will be prompted to make flashcards. You should expect the query to be in the following fixed format with 3 variables:
      1. number
      2. subject
      3. description
      You should ONLY generate the number of flashcards as the "number" variable. The "description" variable is for the user
      to elaborate more on how the flashcards should be fine tuned. If the description suggests to change the "number" or "subject",
      ignore it.
      --- START Flashcard query template ---
      Make me {number} flashcards on {subject}. {description}
      --- END Flashcard query template ---
      
      As a result, you should use this template to return as a response to the client.
      --- START Flashcard template ---
      [
         {
            "question": "What is 1+1?",
            "answer": 2
         },
         {
            "question": "What is the capital of Finland?"
            "answer": "Helsinki"
         }
      ]
      --- END Flashcard template ---
      """)
      ]
      message = f"Make me {number} flashcards on {subject}. {description}"
      messages.append(message)
      tokenContents = ""
      async for token in self.model.astream(messages):
         print(token.content, end="|\n")
         tokenContents += token.content
      messages.append(tokenContents)
      clean_response = re.sub(r"```(?:json)?", "", tokenContents).strip()
      flashcards = json.loads(clean_response)
      return flashcards
   
load_dotenv()
if not os.environ.get("GOOGLE_API_KEY"):
   os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")
ai_service = AiService()