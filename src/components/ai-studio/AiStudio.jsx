import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Cpu,
  Sliders,
  FileText,
  Upload,
  Check,
  Plus,
  Trash2,
  Send,
  Zap,
  RefreshCw,
  Eye,
  MessageSquare,
  ShieldCheck,
  Mic,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiStudio = () => {
  const { aiConfig, setAiConfig, knowledgeBase, setKnowledgeBase, showToast } = useApp();

  const [testMessages, setTestMessages] = useState([
    {
      id: 't1',
      sender: 'user',
      text: 'Do you ship to Mumbai and what are the delivery charges?',
      time: '11:00 AM',
    },
    {
      id: 't2',
      sender: 'ai',
      text: 'Yes! We provide complimentary express delivery to Mumbai & all major cities within 24-48 hours with Cash on Delivery supported. 🎉',
      time: '11:00 AM',
    },
  ]);

  const [testInput, setTestInput] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState('Catalog');
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  const handleTestSend = (e) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: testInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTestMessages((prev) => [...prev, userMsg]);
    const curr = testInput;
    setTestInput('');

    setTimeout(() => {
      let reply = `Sendiee AI evaluated "${curr}" with high intent (92%). Recommendation: Our bestselling 100% Linen King Set in beige is available for ₹2,499.`;
      if (curr.toLowerCase().includes('price') || curr.toLowerCase().includes('cost')) {
        reply = `Price is ₹2,499 with complimentary shipping and Cash on Delivery. Would you like me to book your order?`;
      }
      setTestMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 700);
  };

  const handleAddDoc = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const doc = {
      id: `kb-${Date.now()}`,
      title: newTitle,
      category: newCat,
      tokens: '3,100 tokens',
      lastSync: 'Just now',
    };

    setKnowledgeBase((prev) => [doc, ...prev]);
    setNewTitle('');
    setIsAddingDoc(false);
    showToast(`Indexed "${newTitle}" into vector knowledge base!`, 'success');
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-[1300px] mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101828]">AI Assistants & Prompt Studio</h1>
          <p className="text-xs text-[#667085]">
            Configure model intelligence, tune system prompts, and ground responses with RAG knowledge documents.
          </p>
        </div>

        <button
          onClick={() => showToast('AI Assistant synced to WhatsApp Cloud API webhook!', 'success')}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Deploy to WhatsApp</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Foundation Model Selector */}
          <div className="sendiee-card p-6 space-y-4">
            <div className="text-xs font-bold uppercase text-[#667085] flex items-center gap-2 font-mono">
              <Cpu className="w-4 h-4 text-[#7C3AED]" />
              <span>Foundation Model</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Gemini 2.5 Flash', latency: '<0.6s latency', note: 'Fast & Best Value' },
                { name: 'Claude 3.5 Sonnet', latency: '<1.1s latency', note: 'Nuanced Tone' },
                { name: 'GPT-4o Omnichannel', latency: '<0.9s latency', note: 'Vision & Speech' },
              ].map((m) => (
                <button
                  key={m.name}
                  onClick={() => setAiConfig({ ...aiConfig, model: m.name })}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    aiConfig.model === m.name
                      ? 'border-[#7C3AED] bg-[#F4F0FD] text-[#101828] shadow-2xs'
                      : 'border-[#EAECF0] bg-white text-[#475467] hover:border-[#D0D5DD]'
                  }`}
                >
                  <div className="font-bold text-xs text-[#101828]">{m.name}</div>
                  <div className="text-[10px] text-[#16A34A] font-mono mt-0.5">{m.latency}</div>
                  <div className="text-[9px] text-[#98A2B3] mt-1">{m.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* System Prompt */}
          <div className="sendiee-card p-6 space-y-3">
            <div className="text-xs font-bold uppercase text-[#667085] flex items-center gap-2 font-mono">
              <Sliders className="w-4 h-4 text-[#7C3AED]" />
              <span>System Instructions</span>
            </div>

            <textarea
              rows={5}
              value={aiConfig.systemPrompt}
              onChange={(e) => setAiConfig({ ...aiConfig, systemPrompt: e.target.value })}
              className="w-full bg-[#F9FAFB] border border-[#EAECF0] p-3.5 rounded-xl text-xs text-[#101828] font-mono leading-relaxed focus:outline-none focus:border-[#7C3AED] resize-none"
            />
          </div>

          {/* Knowledge Base */}
          <div className="sendiee-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase text-[#667085] flex items-center gap-2 font-mono">
                <Database className="w-4 h-4 text-[#7C3AED]" />
                <span>RAG Knowledge Base ({knowledgeBase.length} sources)</span>
              </div>
              <button
                onClick={() => setIsAddingDoc(!isAddingDoc)}
                className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Source</span>
              </button>
            </div>

            {isAddingDoc && (
              <form onSubmit={handleAddDoc} className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E9D8FD] space-y-3 animate-in fade-in">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Document Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-white border border-[#EAECF0] px-3.5 py-1.5 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                  />
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="bg-white border border-[#EAECF0] px-3.5 py-1.5 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                  >
                    <option value="Catalog">Product Catalog</option>
                    <option value="Policy FAQ">Policy FAQ</option>
                    <option value="Pricing">Pricing Sheet</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold"
                >
                  Index Document
                </button>
              </form>
            )}

            <div className="space-y-2">
              {knowledgeBase.map((kb) => (
                <div
                  key={kb.id}
                  className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#EAECF0] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#7C3AED]" />
                    <span className="font-bold text-[#101828]">{kb.title}</span>
                    <span className="text-[10px] font-mono bg-white border border-[#EAECF0] text-[#667085] px-2 py-0.5 rounded-full">
                      {kb.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#16A34A] font-semibold">{kb.lastSync}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sandbox Simulator (5 cols) */}
        <div className="lg:col-span-5 sendiee-card p-6 flex flex-col h-[600px] justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAECF0]">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#7C3AED]" />
              <h3 className="text-xs font-bold uppercase text-[#101828] font-mono">
                Interactive AI Sandbox
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#16A34A] font-bold">● Active</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 py-3">
            {testMessages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#F9FAFB] border border-[#EAECF0] text-[#101828]'
                      : 'bg-[#F4F0FD] border border-[#E9D8FD] text-[#101828]'
                  }`}
                >
                  {m.sender === 'ai' && (
                    <div className="text-[10px] font-mono text-[#7C3AED] font-bold mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#7C3AED]" />
                      <span>{aiConfig.model}</span>
                    </div>
                  )}
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleTestSend} className="pt-3 border-t border-[#EAECF0] flex gap-2">
            <input
              type="text"
              placeholder="Test customer query..."
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="flex-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
