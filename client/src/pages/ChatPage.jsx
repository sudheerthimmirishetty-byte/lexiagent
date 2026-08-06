import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';
import { documentService } from '../services/documentService';
import { useNotification } from '../context/NotificationContext';
import { MessageBubble } from '../components/MessageBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { SearchBar } from '../components/SearchBar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  MessageSquare,
  Plus,
  Trash2,
  Send,
  Paperclip,
  Sparkles,
  FileText,
  Bot,
  Search,
} from 'lucide-react';

export const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [convToDelete, setConvToDelete] = useState(null);

  const messagesEndRef = useRef(null);
  const { success, error } = useNotification();

  useEffect(() => {
    loadConversations();
    loadDocuments();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
    }
  }, [activeConvId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const res = await chatService.getConversations();
      setConversations(res.conversations || []);
      if (res.conversations && res.conversations.length > 0 && !activeConvId) {
        setActiveConvId(res.conversations[0]._id);
      }
    } catch (err) {}
  };

  const loadDocuments = async () => {
    try {
      const res = await documentService.getDocuments();
      setDocuments(res.documents || []);
    } catch (err) {}
  };

  const loadMessages = async (convId) => {
    try {
      const res = await chatService.getMessages(convId);
      setMessages(res.messages || []);
    } catch (err) {}
  };

  const handleStartNewChat = async () => {
    try {
      const res = await chatService.startConversation({ title: 'New Legal Consultation' });
      const newConv = res.conversation;
      setConversations([newConv, ...conversations]);
      setActiveConvId(newConv._id);
      setMessages([]);
      success('Started new legal consultation session.');
    } catch (err) {
      error('Failed to create new conversation.');
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    // Append optimistic user message
    const tempUserMsg = {
      _id: 'temp_' + Date.now(),
      sender: 'user',
      message: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setSending(true);

    try {
      const res = await chatService.sendMessage({
        conversationId: activeConvId || undefined,
        message: userText,
        documentId: selectedDocId || undefined,
      });

      const newConvId = res.conversationId;
      if (!activeConvId && newConvId) {
        setActiveConvId(newConvId);
      }

      // Fetch fresh list of messages from conversation to guarantee full history
      const freshMsgs = await chatService.getMessages(newConvId);
      if (freshMsgs.messages && freshMsgs.messages.length > 0) {
        setMessages(freshMsgs.messages);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            _id: res.messageRecord?._id || 'msg_' + Date.now(),
            sender: 'agent',
            message: res.aiResponse,
            aiResponse: res.fullResult,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      loadConversations();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to receive AI agent response.');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!convToDelete) return;
    try {
      await chatService.deleteConversation(convToDelete);
      setConversations((prev) => prev.filter((c) => c._id !== convToDelete));
      if (activeConvId === convToDelete) {
        setActiveConvId(null);
        setMessages([]);
      }
      success('Conversation deleted.');
    } catch (err) {
      error('Failed to delete conversation.');
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6rem)] grid grid-cols-1 md:grid-cols-4 gap-6 pb-4">
      {/* Conversation Sidebar */}
      <div className="md:col-span-1 bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-4 flex flex-col shadow-xl overflow-hidden">
        <div className="space-y-3 mb-4">
          <button
            onClick={handleStartNewChat}
            className="w-full py-3 px-4 rounded-2xl gradient-bg font-extrabold text-xs text-white shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4" /> New Consultation
          </button>
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search chats..." />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-xs text-gray-400 py-8">No conversation sessions.</div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv._id === activeConvId;
              return (
                <div
                  key={conv._id}
                  onClick={() => setActiveConvId(conv._id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between group ${
                    isActive
                      ? 'bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 text-brand-600 dark:text-brand-400 font-bold'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <MessageSquare className="w-4 h-4 text-brand-500 shrink-0" />
                    <span className="text-xs truncate">{conv.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConvToDelete(conv._id);
                      setDeleteModalOpen(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="md:col-span-3 bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-3xl p-6 flex flex-col shadow-xl overflow-hidden">
        {/* Header toolbar */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl gradient-bg text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                LexiAgent Autonomous Legal Assistant
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] uppercase tracking-wider font-extrabold">
                  Gemini Active
                </span>
              </h3>
              <p className="text-xs text-gray-400">Context-aware multi-agent legal execution</p>
            </div>
          </div>

          {/* Document Attachment Selector */}
          {documents.length > 0 && (
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-gray-400" />
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none"
              >
                <option value="">No Document Context</option>
                {documents.map((d) => (
                  <option key={d._id} value={d._id}>
                    📄 {d.documentName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {messages.length === 0 && !sending ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
              <div className="p-4 rounded-3xl bg-brand-500/10 text-brand-500 mb-4">
                <Sparkles className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">How can LexiAgent AI assist you?</h4>
              <p className="text-xs max-w-md text-gray-500 leading-relaxed mb-6">
                Ask any legal question, request clause explanations, or ask for contract modifications.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl text-left">
                <button
                  onClick={() => setInputMessage('Explain the termination notice clause in my lease agreement.')}
                  className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 hover:border-brand-500 transition-colors"
                >
                  "Explain the termination notice clause in my lease agreement."
                </button>
                <button
                  onClick={() => setInputMessage('What are the risks of an uncapped indemnity clause?')}
                  className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 hover:border-brand-500 transition-colors"
                >
                  "What are the risks of an uncapped indemnity clause?"
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg) => <MessageBubble key={msg._id} message={msg} />)
          )}

          {sending && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your legal question or request..."
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || sending}
            className="p-3 rounded-2xl gradient-bg text-white shadow-lg disabled:opacity-50 hover:opacity-95 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConversation}
        title="Delete Conversation"
        message="Are you sure you want to permanently delete this legal consultation session?"
      />
    </div>
  );
};
