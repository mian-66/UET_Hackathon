import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Terminal,
  Bot,
  Copy,
  Check,
  Cpu,
  ShieldCheck,
  CornerDownLeft,
  Loader2
} from 'lucide-react';

export function AIAssistantPanel({ isOpen, onClose, onApplyCommand }) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Initial mock conversation history
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I am Pls-CLI's agentic translation engine powered by local Gemma inference. Describe any workflow, broken build, or multi-step pipeline in plain English.",
      suggestedCommand: null
    }
  ]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!aiPrompt.trim() || isThinking) return;

    const userText = aiPrompt.trim();
    setAiPrompt('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsThinking(true);

    // Simulated local streaming inference
    setTimeout(() => {
      let generatedReply = {
        role: 'assistant',
        text: `Understood. Analyzing syntax tree and environment flags for: "${userText}". Here is the recommended command pipeline:`,
        suggestedCommand: userText.toLowerCase().includes('port')
          ? 'lsof -ti:8080 | xargs kill -9'
          : userText.toLowerCase().includes('git')
          ? 'git reset --soft HEAD~1 && git status'
          : 'find . -name "*.log" -type f -delete'
      };

      setMessages((prev) => [...prev, generatedReply]);
      setIsThinking(false);
    }, 1400);
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg h-full bg-[#0B0F19] border-l border-[#1E293B] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1E293B] bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 shadow-lime-subtle">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-bold text-sm text-white">Agentic Gemma Mode</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-lime-400/15 border border-lime-400/30 text-lime-300">
                  Preview / Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Local Neural Intent Translation • 0 Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Integration Status Banner */}
        <div className="px-5 py-3 bg-[#182234]/70 border-b border-[#1E293B] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-lime-400" />
            <span>Inference Hook: WebLLM / Gemma 2B</span>
          </div>
          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Client-Isolated</span>
          </span>
        </div>

        {/* Chat / Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs font-sans leading-relaxed shadow-md ${
                  msg.role === 'user'
                    ? 'bg-lime-400 text-slate-950 font-medium'
                    : 'bg-[#0F172A] border border-[#1E293B] text-slate-200'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-2 font-mono text-[10px] font-bold text-lime-400 uppercase tracking-wider">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Gemma Translator</span>
                  </div>
                )}
                <p>{msg.text}</p>

                {/* Suggested Command Box */}
                {msg.suggestedCommand && (
                  <div className="mt-3 p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] font-mono text-xs">
                    <div className="flex items-center justify-between gap-2 text-lime-300 mb-2">
                      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                        <span className="text-lime-400 font-bold">$</span>
                        <code>{msg.suggestedCommand}</code>
                      </div>
                      <button
                        onClick={() => handleCopy(msg.suggestedCommand, idx)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Copy command"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (onApplyCommand) onApplyCommand(msg.suggestedCommand);
                        onClose();
                      }}
                      className="w-full py-1.5 rounded-lg bg-lime-400/10 hover:bg-lime-400/20 border border-lime-400/30 text-lime-400 text-[11px] font-bold transition-all"
                    >
                      Apply To Search &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking / Streaming Indicator */}
          {isThinking && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] max-w-xs text-xs font-mono text-slate-400">
              <Loader2 className="w-4 h-4 text-lime-400 animate-spin" />
              <span>Gemma is generating pipeline...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#1E293B] bg-[#0F172A]">
          <div className="flex items-center gap-2 bg-[#0B0F19] border border-[#1E293B] focus-within:border-lime-400/50 rounded-xl px-3 py-2 transition-colors">
            <Terminal className="w-4 h-4 text-lime-400 shrink-0" />
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Gemma: e.g. 'kill port 8080 and restart npm'..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
            />
            <button
              onClick={handleSend}
              disabled={!aiPrompt.trim() || isThinking}
              className="p-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 disabled:opacity-40 text-slate-950 transition-all font-bold"
              aria-label="Send prompt"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-2 text-center">
            Integration ready for WebLLM Gemma weights. Zero host execution.
          </p>
        </div>
      </div>
    </div>
  );
}

