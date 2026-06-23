import { useState, useEffect, useRef } from 'react';
import { useChat, useConversations, useConversation, useDeleteConversation } from '../../hooks/useAI';
import { Send, MessageSquare, Trash2, Plus, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const AIChatPage = () => {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const { data: conversations, isLoading: convsLoading } = useConversations();
  const { data: conversation, isLoading: chatLoading } = useConversation(activeConversationId);
  const { mutate: chatMutation, isPending: isChatting } = useChat();
  const { mutate: deleteMutation } = useDeleteConversation();

  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages);
    }
  }, [conversation]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatting]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentPrompt.trim() || isChatting) return;

    const userMessage = { role: 'user', content: currentPrompt };
    setMessages((prev) => [...prev, userMessage]);
    setCurrentPrompt('');

    try {
      const res = await chatMutation.mutateAsync({
        prompt: userMessage.content,
        conversationId: activeConversationId,
      });
      
      if (!activeConversationId && res.data.conversationId) {
        setActiveConversationId(res.data.conversationId);
      }
      
      setMessages((prev) => [...prev, { role: 'model', content: res.data.answer }]);
    } catch (error) {
      console.error('Chat failed:', error);
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  const startNewChat = () => {
    setActiveConversationId(null);
    setCurrentPrompt('');
  };

  const deleteChat = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          if (activeConversationId === id) setActiveConversationId(null);
        }
      });
    }
  };

  const suggestedPrompts = [
    "Which product needs restocking?",
    "What was my revenue last month?",
    "Which expense category is highest?",
    "What is my profit margin?",
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
      {/* Left Panel: Conversations */}
      <div className="hidden w-64 flex-col border-r border-gray-800 md:flex">
        <div className="p-4">
          <Button onClick={startNewChat} className="w-full" icon={<Plus className="h-4 w-4" />}>
            New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {convsLoading ? (
            <div className="p-4 text-sm text-gray-400 text-center">Loading...</div>
          ) : (
            conversations?.map((conv) => (
              <div
                key={conv._id}
                onClick={() => setActiveConversationId(conv._id)}
                className={cn(
                  "group flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer transition-colors",
                  activeConversationId === conv._id ? "bg-indigo-500/10 text-indigo-400" : "text-gray-400 hover:bg-gray-800"
                )}
              >
                <div className="flex items-center truncate">
                  <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{conv.title}</span>
                </div>
                <button 
                  onClick={(e) => deleteChat(conv._id, e)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Chat Interface */}
      <div className="flex flex-1 flex-col bg-gray-950">
        {!activeConversationId && !chatLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-indigo-500/10 p-4 text-indigo-400">
              <Bot className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-white">AI Business Analyst</h2>
            <p className="mt-2 text-gray-400 max-w-xs">
              Ask me anything about your business data. I'm here to help you analyze and grow.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPrompt(p)}
                  className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:border-indigo-500 hover:text-indigo-400 transition-all"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatLoading ? (
                 <div className="flex justify-center p-4"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex w-full",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "flex max-w-[80%] items-start space-x-3 rounded-2xl px-4 py-3",
                      msg.role === 'user' 
                        ? "bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-none shadow-sm"
                    )}>
                      {msg.role === 'model' && <Bot className="h-5 w-5 mt-0.5 flex-shrink-0 text-indigo-400" />}
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                      {msg.role === 'user' && <User className="h-5 w-5 mt-0.5 flex-shrink-0 text-indigo-200" />}
                    </div>
                  </div>
                ))
              )}
              {isChatting && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-gray-800 bg-gray-900 p-4">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <Input
                  placeholder="Ask about your business..."
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  className="flex-1"
                  disabled={isChatting}
                />
                <Button 
                  type="submit" 
                  loading={isChatting} 
                  disabled={!currentPrompt.trim()}
                  className="shrink-0"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIChatPage;
