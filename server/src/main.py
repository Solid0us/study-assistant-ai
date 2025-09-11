from fastapi import FastAPI
import getpass
import os
from pydantic import BaseModel, Field
import json
import re
from dotenv import load_dotenv
load_dotenv()

if not os.environ.get("GOOGLE_API_KEY"):
   os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage
from langchain_core.tools import tool
model = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
app = FastAPI()

chatHistory = [
      SystemMessage(
      """
      You are a helpful study assistant. You will be responsible for helping create study materials for the user.
      """)
   ]

class BasicQuery(BaseModel):
   prompt: str

class FlashCardQuery(BaseModel):
   number: int = Field(gt=0, le=25)
   subject: str = Field(min_length=1, max_length=50)
   description: str = Field(default="", max_length=255)

@app.get("/")
async def root():
   message = "Hello from the server!"
   return {"message": message}

@app.post("/chat")
async def generate(prompt: BasicQuery):
   chatHistory.append(prompt.prompt)
   tokenContents = ""
   for token in model.stream(chatHistory):
      print(token.content, end="|\n")
      tokenContents += token.content
   chatHistory.append(tokenContents)
   return {"prompt": prompt.prompt, "response": tokenContents}

@app.post("/flashcards/generate")
async def generate_flashcards(query: FlashCardQuery):
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
   message = f"Make me {query.number} flashcards on {query.subject}. {query.description}"
   messages.append(message)
   tokenContents = ""
   for token in model.stream(messages):
      print(token.content, end="|\n")
      tokenContents += token.content
   messages.append(tokenContents)
   clean_response = re.sub(r"```(?:json)?", "", tokenContents).strip()
   flashcards = json.loads(clean_response)
   return {"flashcards": flashcards}