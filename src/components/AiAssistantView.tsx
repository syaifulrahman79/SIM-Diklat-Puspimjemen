import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Code, 
  Shield, 
  CheckCircle2, 
  Terminal,
  User,
  Copy,
  Check
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isJson?: boolean;
}

export const AiAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Siap! Saya adalah Mesin Logika Backend dan Asisten Cerdas "SIM-DIKLAT PUSPIMJEMENHAN", Pusat Kepemimpinan dan Manajemen Pertahanan, BPSDM Pertahanan Kemhan RI.

Saya siap melayani:
1. **Informasi Publik & Kurikulum**: Pengecekan silabus dari 43 program pelatihan Puspimjemenhan TA 2027.
2. **Eligibility & Validasi Kualifikasi**: Pengecekan kepangkatan TNI, PNS, PPPK, dan kualifikasi jabatan.
3. **Matching Engine Widyaiswara**: Pencocokan 28 Widyaiswara Salemba berdasarkan kepakaran mata diklat & pencegahan benturan jadwal.
4. **Integrasi Sistem JSON**: Pengeluaran data terstruktur API resmi.

Silakan masukkan pertanyaan Anda atau pilih salah satu simulasi di bawah.`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [returnJson, setReturnJson] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      // Build history
      const history = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          returnJson
        })
      });

      if (!res.ok) {
        throw new Error('Gagal menghubungi server backend.');
      }

      const data = await res.json();
      const aiReply = data.reply || "Maaf, respon tidak dapat dihasilkan.";

      // Check if reply is valid JSON
      let isJsonReply = false;
      try {
        JSON.parse(aiReply);
        isJsonReply = true;
      } catch (e) {
        isJsonReply = false;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isJson: isJsonReply
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `Terjadi kendala dalam memproses permintaan. Silakan pastikan server aktif dan periksa koneksi jaringan.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const PROMPT_SUGGESTIONS = [
    "Bagaimana pembagian beban mengajar berimbang bagi 28 Widyaiswara Salemba?",
    "Cek Kelayakan: Letkol TNI, Usia 44, S2, Diklapa II untuk Susjemen Rengar Han",
    "Siapa saja Widyaiswara pengampu materi Bela Negara & Sishanneg?",
    "Jadwal dan alokasi peserta Diklat Cyber Defence & SOC Analyst",
    "Daftar Widyaiswara Pertama yang mengampu Reformasi Birokrasi",
    "Kapan pelaksanaan Suskatjemen Hanneg untuk Eksekutif Gelombang I, II, dan III?",
    "Generate skema JSON silabus Pelatihan Big Data Analysis"
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-300">
              <Bot className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Asisten Cerdas & Mesin Logika SIM-DIKLAT Puspimjemenhan
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grounded pada Katalog Resmi 43 Diklat TA 2027 & Register 28 Widyaiswara Salemba 2026.
          </p>
        </div>

        {/* JSON Mode Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={returnJson}
              onChange={(e) => setReturnJson(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <Code className="w-3.5 h-3.5 text-amber-600" />
            <span>Mode JSON API Data Engine</span>
          </label>

          <button
            onClick={() => setMessages(messages.slice(0, 1))}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Bersihkan Percakapan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col h-[560px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';

            return (
              <div 
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isAi 
                    ? 'bg-slate-900 text-amber-400 border border-slate-700' 
                    : 'bg-amber-500 text-slate-950 font-bold'
                }`}>
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Content Bubble */}
                <div className={`max-w-[85%] rounded-2xl p-4 shadow-2xs ${
                  isAi 
                    ? 'bg-slate-50 border border-slate-200 text-slate-800' 
                    : 'bg-amber-500 text-slate-950 font-medium'
                }`}>
                  <div className="flex items-center justify-between gap-2 mb-1 text-[10px] opacity-75">
                    <span className="font-bold">
                      {isAi ? 'ASISTEN SIM-DIKLAT PUSPIMJEMEN' : 'USER KEMHAN / SATKER'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {msg.isJson ? (
                    <div className="relative mt-2">
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="absolute right-2 top-2 px-2 py-1 rounded bg-slate-800 text-slate-200 text-[10px] font-mono flex items-center gap-1 hover:bg-slate-700 cursor-pointer"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Tersalin' : 'Salin JSON'}</span>
                      </button>
                      <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                        {msg.text}
                      </pre>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                      {msg.text}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-100">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                <span className="text-slate-600 font-medium ml-1">Menganalisis matriks diklat...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 overflow-x-auto scrollbar-none">
          {PROMPT_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sug)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-[11px] font-medium transition cursor-pointer border border-slate-200 shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder={returnJson ? "Ketik instruksi data (akan menghasilkan format JSON)..." : "Ketik pertanyaan, nama widyaiswara, atau kualifikasi personel..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Kirim</span>
          </button>
        </div>
      </div>
    </div>
  );
};
