import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Terminal,
  Bot,
  Cpu,
  ShieldCheck,
  Loader2,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Check,
  Copy,
  Info,
  ShieldAlert,
  Server,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { UnverifiedCommandBadge } from './UnverifiedCommandBadge.jsx';

const PROXY_URL = 'http://localhost:3001';

export function AIAssistantPanel({
  isOpen,
  onClose,
  onApplyCommand,
  shellContext = 'powershell',
  activeOS = 'windows'
}) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'checking' | 'ready' | 'model_missing' | 'offline'
  const [healthInfo, setHealthInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const inputRef = useRef(null);

  // Real-time Health Check to local proxy
  const checkHealth = useCallback(async () => {
    setConnectionStatus('checking');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${PROXY_URL}/api/health`, {
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setHealthInfo(data);
      setConnectionStatus(data.status); // 'ready', 'model_missing', or 'offline'
    } catch {
      setConnectionStatus('offline');
      setHealthInfo({
        status: 'offline',
        ollamaOnline: false,
        message: 'Proxy microservice is unreachable at http://localhost:3001.'
      });
    }
  }, []);

  // Ping health on drawer open
  useEffect(() => {
    if (isOpen) {
      checkHealth();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen, checkHealth]);

  if (!isOpen) return null;

  const handleCopyCmd = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSend = async () => {
    if (!aiPrompt.trim() || isThinking || connectionStatus !== 'ready') return;

    const userText = aiPrompt.trim();
    setAiPrompt('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsThinking(true);

    try {
      const res = await fetch(`${PROXY_URL}/api/assist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          shellContext,
          activeOS
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Proxy returned ${res.status}`);
      }

      const structuredResult = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          structured: structuredResult,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          isError: true,
          errorMessage: err.message || 'Inference pipeline failure.'
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-[#0B0F19] border-l border-[#1E293B] flex flex-col shadow-2xl focus:outline-none"
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
                <h3 className="font-mono font-bold text-sm text-white">Agentic Gemma Assistant</h3>
                {connectionStatus === 'ready' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Ollama Active</span>
                  </span>
                ) : connectionStatus === 'checking' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span>Probing...</span>
                  </span>
                ) : connectionStatus === 'model_missing' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    Model Missing
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-400">
                    Offline
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Local Neural Intent Translation • Zero External Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={checkHealth}
              disabled={connectionStatus === 'checking'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Refresh connection status"
              aria-label="Ping backend"
            >
              <RefreshCw className={`w-4 h-4 ${connectionStatus === 'checking' ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Integration Status Bar */}
        <div className="px-5 py-2.5 bg-[#182234]/70 border-b border-[#1E293B] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-lime-400" />
            <span>Target: Gemma 2 (2B)</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-slate-400 capitalize">{shellContext}</span>
          </div>

          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Client-Isolated</span>
          </span>
        </div>

        {/* Chat / Message Stream Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Honest Connection Banner (when offline or model missing) */}
          {connectionStatus !== 'ready' && connectionStatus !== 'checking' && (
            <div className="p-4 rounded-xl border border-[#1E293B] bg-[#0F172A] space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2.5 text-amber-300 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4>Local Gemma 2 Assistant Is Currently Offline</h4>
                  <p className="text-[11px] text-slate-400 font-sans font-normal mt-0.5 leading-relaxed">
                    Pls-CLI's core search, deterministic synonym translation, and 52+ curated commands remain{' '}
                    <strong className="text-slate-200">100% operational</strong> without the AI backend.
                  </p>
                </div>
              </div>

              {/* Step-by-Step Setup Instructions */}
              <div className="p-3 rounded-lg bg-[#0B0F19] border border-slate-800 space-y-2 text-[11px] text-slate-300">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Server className="w-3 h-3 text-lime-400" />
                  <span>To activate local neural assistance:</span>
                </div>

                <div className="space-y-1.5 pl-1">
                  <div>
                    <span className="text-slate-400 block mb-0.5">1. Pull &amp; start target model:</span>
                    <div className="flex items-center justify-between p-1.5 rounded bg-[#182234] border border-slate-700 text-lime-300 font-mono">
                      <code>ollama run gemma2:2b</code>
                      <button
                        onClick={() => handleCopyCmd('ollama run gemma2:2b', 'step1')}
                        className="text-slate-400 hover:text-white p-1"
                        title="Copy command"
                      >
                        {copiedCode === 'step1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">2. Run local proxy microservice:</span>
                    <div className="flex items-center justify-between p-1.5 rounded bg-[#182234] border border-slate-700 text-lime-300 font-mono">
                      <code>npm run server</code>
                      <button
                        onClick={() => handleCopyCmd('npm run server', 'step2')}
                        className="text-slate-400 hover:text-white p-1"
                        title="Copy command"
                      >
                        {copiedCode === 'step2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">Port: localhost:3001</span>
                <button
                  onClick={checkHealth}
                  className="px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry Connection</span>
                </button>
              </div>
            </div>
          )}

          {/* Intro Message when Ready */}
          {connectionStatus === 'ready' && messages.length === 0 && (
            <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-2">
              <div className="flex items-center gap-2 text-lime-400 font-mono font-bold text-xs">
                <Bot className="w-4 h-4" />
                <span>Gemma 2 Neural Assistant Connected</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Describe complex build errors, multi-step pipeline requirements, or obscure platform tasks. Responses are strictly validated as structured JSON before display.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono">
                <span className="text-slate-500">Try:</span>
                {['find large node_modules directories', 'kill port 8080 force', 'clean git untracked safely'].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setAiPrompt(ex)}
                    className="px-2 py-0.5 rounded bg-[#182234] hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation History */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-[85%] rounded-2xl p-3.5 bg-lime-400 text-slate-950 text-xs font-mono font-medium shadow-md">
                  {msg.text}
                </div>
              ) : msg.isError ? (
                <div className="max-w-[90%] rounded-xl p-3.5 bg-rose-950/30 border border-rose-500/40 text-xs font-mono text-rose-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Inference Error</span>
                  </div>
                  <p className="font-sans text-[11px] text-slate-300">{msg.errorMessage}</p>
                </div>
              ) : (
                <div className="w-full rounded-2xl p-4 bg-[#0F172A] border border-[#1E293B] text-xs font-sans space-y-3.5 shadow-lg">
                  {/* Assistant Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-lime-400 uppercase tracking-wider">
                      <Bot className="w-4 h-4" />
                      <span>{msg.structured?.title || 'Gemma 2 Recommendation'}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                  </div>

                  {/* Explanation */}
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {msg.structured?.explanation}
                  </p>

                  {/* Compatibility & Assumptions Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 uppercase">
                      OS: {msg.structured?.targetOS}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-lime-300 font-bold uppercase">
                      Shell: {msg.structured?.targetShell}
                    </span>
                  </div>

                  {/* Assumptions List */}
                  {msg.structured?.assumptions && msg.structured.assumptions.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                      <span className="text-slate-400 block font-bold text-[10px] uppercase">
                        Preconditions &amp; Assumptions:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
                        {msg.structured.assumptions.map((assump, i) => (
                          <li key={i}>{assump}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Potential Risks Callout */}
                  {msg.structured?.potentialRisks && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-200">
                      <strong className="block font-bold mb-0.5 uppercase text-[10px]">Potential Impact / Risk:</strong>
                      <span>{msg.structured.potentialRisks}</span>
                    </div>
                  )}

                  {/* Unverified / Safety-Gated Command Badge */}
                  <UnverifiedCommandBadge
                    command={msg.structured?.command}
                    source="Local Gemma 2 (2B)"
                  />

                  {/* Action Button: Apply to Main Search Filter */}
                  {onApplyCommand && msg.structured?.command && (
                    <button
                      onClick={() => {
                        onApplyCommand(msg.structured.command);
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-lime-400/10 hover:bg-lime-400/20 border border-lime-400/30 text-lime-300 text-xs font-mono font-bold transition-all shadow-sm"
                    >
                      <span>Apply Command to Search Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Streaming / Inference Indicator */}
          {isThinking && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] max-w-sm text-xs font-mono text-slate-300 animate-pulse">
              <Loader2 className="w-4 h-4 text-lime-400 animate-spin shrink-0" />
              <span>Gemma 2 is validating syntax tree locally...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#1E293B] bg-[#0F172A]">
          <div className="flex items-center gap-2 bg-[#0B0F19] border border-[#1E293B] focus-within:border-lime-400/50 rounded-xl px-3 py-2 transition-colors">
            <Terminal className="w-4 h-4 text-lime-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={aiPrompt}
              disabled={connectionStatus !== 'ready' || isThinking}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                connectionStatus === 'ready'
                  ? `Ask Gemma: e.g. "recursively find .log files older than 30 days"...`
                  : 'Gemma proxy is offline. Follow setup guide above.'
              }
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!aiPrompt.trim() || isThinking || connectionStatus !== 'ready'}
              className="p-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 disabled:opacity-30 text-slate-950 transition-all font-bold shrink-0"
              aria-label="Send prompt to Gemma"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-2 text-center">
            {connectionStatus === 'ready'
              ? `Connected to Ollama on http://localhost:3001 • Strictly non-executing`
              : 'Zero-degradation mode: Core Pls-CLI search functions offline.'}
          </p>
        </div>
      </div>
    </div>
  );
}
