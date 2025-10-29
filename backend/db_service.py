from typing import List, Dict, Optional
from datetime import datetime
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

class DBService:
    def __init__(self):
        mongo_uri = os.getenv("MONGO_URI")
        if mongo_uri:
            try:
                self.client = MongoClient(mongo_uri)
                self.db = self.client.get_database()
                self.conversations = self.db.conversations
                self.enabled = True
                print("MongoDB connected")
            except Exception as e:
                print(f"MongoDB connection failed: {e}")
                self.enabled = False
        else:
            print("MongoDB not configured, running without persistence")
            self.enabled = False
    
    def save_conversation(
        self, 
        session_id: str, 
        user_message: str, 
        bot_response: str,
        context_used: str = None
    ) -> Optional[str]:
        """Save a conversation turn"""
        if not self.enabled:
            return None
        
        try:
            conversation = {
                "session_id": session_id,
                "user_message": user_message,
                "bot_response": bot_response,
                "context_used": context_used,
                "timestamp": datetime.utcnow()
            }
            result = self.conversations.insert_one(conversation)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error saving conversation: {e}")
            return None
    
    def get_conversation_history(
        self, 
        session_id: str, 
        limit: int = 10
    ) -> List[Dict]:
        """Get conversation history for a session"""
        if not self.enabled:
            return []
        
        try:
            conversations = self.conversations.find(
                {"session_id": session_id}
            ).sort("timestamp", -1).limit(limit)
            
            history = []
            for conv in reversed(list(conversations)):
                history.append({
                    "role": "user",
                    "content": conv["user_message"]
                })
                history.append({
                    "role": "assistant",
                    "content": conv["bot_response"]
                })
            
            return history
        except Exception as e:
            print(f"Error getting history: {e}")
            return []
    
    def clear_session(self, session_id: str) -> bool:
        """Clear conversation history for a session"""
        if not self.enabled:
            return False
        
        try:
            self.conversations.delete_many({"session_id": session_id})
            return True
        except Exception as e:
            print(f"Error clearing session: {e}")
            return False
    
    def get_all_sessions(self) -> List[str]:
        """Get all unique session IDs"""
        if not self.enabled:
            return []
        
        try:
            return self.conversations.distinct("session_id")
        except Exception as e:
            print(f"Error getting sessions: {e}")
            return []