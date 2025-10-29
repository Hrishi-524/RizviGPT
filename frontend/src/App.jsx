// import { useState, useRef, useEffect } from 'react';
// import { Send, Menu, X, Plus } from 'lucide-react';

// // Add your Gemini API key here
// const GEMINI_API_KEY = 'AIzaSyB0-ytuvhfyLmSUgzrIHre0sm9RQyYfkVo';

// // Mock responses for Rizvi College questions
// const RIZVI_RESPONSES = [
//   "Rizvi College of Engineering is a prestigious institution located in Bandra West, Mumbai, Maharashtra. Established in 1998, it is affiliated with the University of Mumbai and approved by AICTE. The college offers undergraduate and postgraduate programs in various engineering disciplines including Computer Engineering, Information Technology, Electronics & Telecommunication, and more. Known for its quality education, modern infrastructure, and industry-oriented curriculum, Rizvi College has consistently maintained high academic standards and produces skilled engineering graduates.",
  
//   "Rizvi College of Engineering, situated in the heart of Mumbai at Bandra West, is a premier engineering institution that has been shaping young minds since 1998. The college is part of the Rizvi Education Society and offers B.E. programs in multiple streams. With state-of-the-art laboratories, experienced faculty, and strong industry connections, Rizvi provides students with excellent placement opportunities. The campus features modern amenities, well-equipped workshops, a comprehensive library, and hosts various technical festivals and cultural events throughout the year.",
  
//   "Founded under the Rizvi Education Society, Rizvi College of Engineering has established itself as one of Mumbai's leading engineering colleges. Located in Bandra West, the institution is recognized by AICTE and affiliated with Mumbai University. The college emphasizes holistic development through technical education, extracurricular activities, and industry exposure. With dedicated faculty, research facilities, and a focus on innovation, Rizvi College prepares students for successful careers in engineering and technology sectors."
// ];

// function RizviGPT() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [conversations, setConversations] = useState([
//     { id: 1, title: 'New Chat', messages: [] }
//   ]);
//   const [activeConvId, setActiveConvId] = useState(1);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const isRizviQuestion = (text) => {
//     const lowerText = text.toLowerCase();
//     return lowerText.includes('rizvi');
//   };

//   const getRizviResponse = () => {
//     const randomIndex = Math.floor(Math.random() * RIZVI_RESPONSES.length);
//     return RIZVI_RESPONSES[randomIndex];
//   };

//   const callGeminiAPI = async (userMessage) => {
//     const response = await fetch(
//       'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-goog-api-key': GEMINI_API_KEY,
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: userMessage,
//                 },
//               ],
//             },
//           ],
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error('Failed to fetch from Gemini API');
//     }

//     const data = await response.json();
//     return data.candidates[0].content.parts[0].text;
//   };

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = {
//       role: 'user',
//       content: input,
//       timestamp: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       let assistantResponse;

//       if (isRizviQuestion(input)) {
//         // Use mock response for Rizvi questions
//         assistantResponse = getRizviResponse();
//       } else {
//         // Call Gemini API for other questions
//         assistantResponse = await callGeminiAPI(input);
//       }

//       const assistantMessage = {
//         role: 'assistant',
//         content: assistantResponse,
//         timestamp: new Date().toISOString(),
//       };

//       setMessages((prev) => [...prev, assistantMessage]);

//       // Update conversation title if it's the first message
//       setConversations((prev) =>
//         prev.map((conv) =>
//           conv.id === activeConvId && conv.title === 'New Chat'
//             ? { ...conv, title: input.slice(0, 30) + '...' }
//             : conv
//         )
//       );
//     } catch (error) {
//       const errorMessage = {
//         role: 'assistant',
//         content: 'Sorry, I encountered an error. Please check your API key and try again.',
//         timestamp: new Date().toISOString(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNewChat = () => {
//     const newConv = {
//       id: Date.now(),
//       title: 'New Chat',
//       messages: [],
//     };
//     setConversations((prev) => [newConv, ...prev]);
//     setActiveConvId(newConv.id);
//     setMessages([]);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
//       {/* Sidebar */}
//       <div
//         className={`${
//           sidebarOpen ? 'w-64' : 'w-0'
//         } bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 overflow-hidden flex flex-col`}
//       >
//         <div className="p-4 border-b border-gray-800">
//           <button
//             onClick={handleNewChat}
//             className="w-full flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors"
//           >
//             <Plus size={18} />
//             <span>New Chat</span>
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-3 space-y-2">
//           {conversations.map((conv) => (
//             <button
//               key={conv.id}
//               onClick={() => {
//                 setActiveConvId(conv.id);
//                 setMessages(conv.messages);
//               }}
//               className={`w-full text-left px-3 py-2 rounded-lg transition-colors truncate ${
//                 activeConvId === conv.id
//                   ? 'bg-[#2a2a2a] text-white'
//                   : 'text-gray-400 hover:bg-[#1f1f1f]'
//               }`}
//             >
//               {conv.title}
//             </button>
//           ))}
//         </div>

//         <div className="p-4 border-t border-gray-800">
//           <div className="text-xs text-gray-500">RizviGPT v1.0</div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <div className="h-14 border-b border-gray-800 flex items-center px-4 gap-3">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
//           >
//             {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
//           </button>
//           <h1 className="text-lg font-semibold">RizviGPT</h1>
//           <span className="text-xs text-gray-500 ml-2">College AI Assistant</span>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto px-4 py-6">
//           {messages.length === 0 ? (
//             <div className="h-full flex flex-col items-center justify-center text-center px-4">
//               <h2 className="text-3xl font-semibold mb-4">Welcome to RizviGPT</h2>
//               <p className="text-gray-400 max-w-md">
//                 Your AI assistant for Rizvi College of Engineering. Ask me anything about the college or get help with your queries!
//               </p>
//             </div>
//           ) : (
//             <div className="max-w-3xl mx-auto space-y-6">
//               {messages.map((msg, idx) => (
//                 <div
//                   key={idx}
//                   className={`flex gap-4 ${
//                     msg.role === 'user' ? 'justify-end' : 'justify-start'
//                   }`}
//                 >
//                   {msg.role === 'assistant' && (
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
//                       <span className="text-sm font-bold">R</span>
//                     </div>
//                   )}
//                   <div
//                     className={`max-w-[80%] rounded-2xl px-4 py-3 ${
//                       msg.role === 'user'
//                         ? 'bg-[#2a2a2a] ml-auto'
//                         : 'bg-[#1f1f1f]'
//                     }`}
//                   >
//                     <p className="whitespace-pre-wrap">{msg.content}</p>
//                   </div>
//                   {msg.role === 'user' && (
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
//                       <span className="text-sm font-bold">U</span>
//                     </div>
//                   )}
//                 </div>
//               ))}
//               {loading && (
//                 <div className="flex gap-4">
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
//                     <span className="text-sm font-bold">R</span>
//                   </div>
//                   <div className="bg-[#1f1f1f] rounded-2xl px-4 py-3">
//                     <div className="flex gap-1">
//                       <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
//                       <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
//                       <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>
//           )}
//         </div>

//         {/* Input */}
//         <div className="border-t border-gray-800 p-4">
//           <div className="max-w-3xl mx-auto">
//             <div className="flex gap-3 items-end bg-[#2a2a2a] rounded-2xl p-2">
//               <textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Ask me anything..."
//                 rows="1"
//                 className="flex-1 bg-transparent px-3 py-2 outline-none resize-none max-h-32"
//                 disabled={loading}
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={loading || !input.trim()}
//                 className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-colors flex-shrink-0"
//               >
//                 <Send size={20} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RizviGPT;

import { useState, useRef, useEffect } from 'react';
import { Send, Menu, X, Plus, Settings, Database, Trash2 } from 'lucide-react';

// Backend API URL - change this to your deployed backend URL
const API_URL = 'http://localhost:8000';

function RizviGPT() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [useRAG, setUseRAG] = useState(true);
  const [useStreaming, setUseStreaming] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [backendHealth, setBackendHealth] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      setBackendHealth(data);
    } catch (error) {
      console.error('Backend health check failed:', error);
      setBackendHealth({ status: 'offline' });
    }
  };

  const handleSendStreaming = async (userMessage) => {
    try {
      const response = await fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage,
          session_id: sessionId,
          use_rag: useRAG,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from backend');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Add empty assistant message
      const assistantMsgIndex = messages.length + 1;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
        },
      ]);

      let fullResponse = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;

        // Update the assistant message with accumulated response
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[assistantMsgIndex] = {
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date().toISOString(),
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Streaming error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error connecting to the backend. Please make sure the server is running.',
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleSendNormal = async (userMessage) => {
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage,
          session_id: sessionId,
          use_rag: useRAG,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from backend');
      }

      const data = await response.json();

      // Update session ID if this is first message
      if (!sessionId) {
        setSessionId(data.session_id);
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        context: data.context_used,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('API error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error connecting to the backend. Please make sure the server is running at ' + API_URL,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    if (useStreaming) {
      await handleSendStreaming(currentInput);
    } else {
      await handleSendNormal(currentInput);
    }

    setLoading(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(null);
  };

  const handleClearSession = async () => {
    if (!sessionId) return;

    try {
      await fetch(`${API_URL}/session/${sessionId}`, {
        method: 'DELETE',
      });
      handleNewChat();
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-gray-800 space-y-2">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>

          {sessionId && (
            <button
              onClick={handleClearSession}
              className="w-full flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            <div className="text-xs text-gray-500 font-semibold px-2">Status</div>
            
            {backendHealth && (
              <div className="px-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      backendHealth.status === 'healthy'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <span className="text-xs text-gray-400">
                    Backend: {backendHealth.status}
                  </span>
                </div>

                {backendHealth.services && (
                  <>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          backendHealth.services.rag ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                      />
                      <span className="text-xs text-gray-400">
                        RAG: {backendHealth.services.rag ? 'Ready' : 'Not configured'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          backendHealth.services.database ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                      />
                      <span className="text-xs text-gray-400">
                        DB: {backendHealth.services.database ? 'Connected' : 'Disabled'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {sessionId && (
              <div className="px-2 mt-4">
                <div className="text-xs text-gray-500">Session ID:</div>
                <div className="text-xs text-gray-400 font-mono truncate">
                  {sessionId.slice(0, 12)}...
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors"
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <div className="text-xs text-gray-500 mt-3">RizviGPT v2.0</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b border-gray-800 flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-lg font-semibold">RizviGPT</h1>
          <span className="text-xs text-gray-500 ml-2">
            {useRAG ? 'RAG Enabled' : 'Direct Mode'}
          </span>
          {useStreaming && (
            <span className="text-xs text-purple-400 ml-2">Streaming</span>
          )}
        </div>

        {/* Settings Panel */}
        {settingsOpen && (
          <div className="border-b border-gray-800 bg-[#0f0f0f] p-4 space-y-3">
            <h3 className="font-semibold text-sm">Chat Settings</h3>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useRAG}
                onChange={(e) => setUseRAG(e.target.checked)}
                className="w-4 h-4"
              />
              <div>
                <div className="text-sm">Use RAG (Document Search)</div>
                <div className="text-xs text-gray-500">
                  Search college documents for relevant context
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useStreaming}
                onChange={(e) => setUseStreaming(e.target.checked)}
                className="w-4 h-4"
              />
              <div>
                <div className="text-sm">Streaming Responses</div>
                <div className="text-xs text-gray-500">
                  See responses word-by-word as they generate
                </div>
              </div>
            </label>

            <div className="pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-500">Backend URL:</div>
              <div className="text-xs text-gray-400 font-mono">{API_URL}</div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Database size={32} />
              </div>
              <h2 className="text-3xl font-semibold mb-4">Welcome to RizviGPT</h2>
              <p className="text-gray-400 max-w-md mb-6">
                Your AI assistant powered by RAG and Groq. Ask me anything about Rizvi College of Engineering!
              </p>
              {backendHealth?.status !== 'healthy' && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 max-w-md">
                  <p className="text-red-400 text-sm">
                    ⚠️ Backend is not connected. Please start your FastAPI server.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Run: uvicorn app:app --reload
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold">R</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-[#2a2a2a] ml-auto'
                        : 'bg-[#1f1f1f]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.context && (
                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Database size={12} />
                          <span>Used RAG context</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold">U</span>
                    </div>
                  )}
                </div>
              ))}
              {loading && !useStreaming && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">R</span>
                  </div>
                  <div className="bg-[#1f1f1f] rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-800 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end bg-[#2a2a2a] rounded-2xl p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Rizvi College..."
                rows="1"
                className="flex-1 bg-transparent px-3 py-2 outline-none resize-none max-h-32"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-colors flex-shrink-0"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RizviGPT;