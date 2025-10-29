import os
from typing import List
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()

class RAGService:
    def __init__(self):
        self.persist_dir = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        self.vector_store = None
        self._load_or_create_vector_store()
    
    def _load_or_create_vector_store(self):
        """Load existing vector store or create empty one"""
        try:
            if os.path.exists(self.persist_dir):
                self.vector_store = Chroma(
                    persist_directory=self.persist_dir,
                    embedding_function=self.embeddings
                )
                print(f"Loaded existing vector store from {self.persist_dir}")
            else:
                self.vector_store = Chroma(
                    persist_directory=self.persist_dir,
                    embedding_function=self.embeddings
                )
                print("Created new vector store")
        except Exception as e:
            print(f"Error loading vector store: {e}")
            self.vector_store = Chroma(
                persist_directory=self.persist_dir,
                embedding_function=self.embeddings
            )
    
    def ingest_documents(self, data_path: str = "./data"):
        """Ingest PDFs from data directory"""
        if not os.path.exists(data_path):
            print(f"Data path {data_path} does not exist. Creating it...")
            os.makedirs(data_path)
            return
        
        # Load PDFs
        loader = DirectoryLoader(
            data_path,
            glob="**/*.pdf",
            loader_cls=PyPDFLoader
        )
        documents = loader.load()
        
        if not documents:
            print("No documents found to ingest")
            return
        
        # Split documents
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_documents(documents)
        
        # Add to vector store
        self.vector_store = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=self.persist_dir
        )
        self.vector_store.persist()
        
        print(f"Ingested {len(documents)} documents, created {len(chunks)} chunks")
    
    def search(self, query: str, k: int = 3) -> List[str]:
        """Search for relevant documents"""
        if not self.vector_store:
            return []
        
        try:
            results = self.vector_store.similarity_search(query, k=k)
            return [doc.page_content for doc in results]
        except Exception as e:
            print(f"Search error: {e}")
            return []
    
    def get_context(self, query: str, k: int = 3) -> str:
        """Get formatted context for LLM"""
        results = self.search(query, k)
        if not results:
            return ""
        
        context = "\n\n---\n\n".join(results)
        return context
    
    def clear_vector_store(self):
        """Clear all documents from vector store"""
        if os.path.exists(self.persist_dir):
            import shutil
            shutil.rmtree(self.persist_dir)
            self._load_or_create_vector_store()
            print("Vector store cleared")