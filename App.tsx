import React, { useState, useEffect, useRef } from 'react';
import NeuralBackground from './components/NeuralBackground';
import ChatMessage from './components/ChatMessage';
import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import NeuralCreate from './components/NeuralCreate';
import { Message, Role, Attachment, UserProfile, ChatSession, ViewMode } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { loadUser, saveUser, loadSessions, saveSession, createNewSession, deleteSession } from './services/storageService';
import { Send, Paperclip, Sparkles, BrainCircuit, Trash2, FileText, Menu, X, ArrowRight, Image as ImageIcon, GraduationCap, Wrench, BookOpen, Search, AlertCircle } from 'lucide-react';

// --- Intro Screen Component ---
interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onComplete, 1000);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-neural-900 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute bottom-[-10%] left-0 w-[200%] h-[50vh] animate-wave-slow opacity-30 text-blue-600/20">
             <svg viewBox="0 0 2880 320" className="w-full h-full fill-current">
                <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1440,176L1440,320L1344,320C1248,320,1152,320,1056,320C960,320,864,320,768,320C672,320,576,320,480,320C384,320,288,320,192,320C96,320,48,320,0,320Z"></path>
             </svg>
        </div>
        <div className="absolute bottom-[-5%] left-0 w-[200%] h-[50vh] animate-wave opacity-30 text-purple-600/20">
             <svg viewBox="0 0 2880 320" className="w-full h-full fill-current">
                <path d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1440,160L1440,320L1344,320C1248,320,1152,320,1056,320C960,320,864,320,768,320C672,320,576,320,480,320C384,320,288,320,192,320C96,320,48,320,0,320Z"></path>
             </svg>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 animate-float">
        <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
            <BrainCircuit size={72} className="text-white relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
        </div>
        
        <div className="text-center space-y-2">
            <h1 className="text-5xl md:text-6xl font-display font-light tracking-[0.2em] text-white">
                NEURAL<span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">MARK</span>
            </h1>
            <p className="text-slate-500 font-sans text-sm tracking-[0.4em] uppercase opacity-80">
                Next Gen Academic Intelligence
            </p>
        </div>
      </div>

      <div className="absolute bottom-12 text-slate-600 text-xs font-mono tracking-widest opacity-40">
        INITIALIZING NEURAL NETWORKS...
      </div>
    </div>
  );
};

// --- Upgrade Modal ---
const UpgradeModal = ({ onClose, onUpgrade }: { onClose: () => void, onUpgrade: () => void }) => {
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-float">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <X size={20}/>
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 mx-auto mb-4 flex items-center justify-center text-white shadow-lg">
            <BrainCircuit size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Upgrade to Neural +</h2>
          <p className="text-slate-400 text-sm mb-6">Unlock unlimited potential and remove all token restrictions.</p>
          
          <div className="space-y-3 mb-6 text-left bg-slate-800/50 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-xs">✓</div>
              Unlimited Tokens (No daily limits)
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-xs">✓</div>
              Unlimited Smart Notes Generation
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-xs">✓</div>
              Upload Unlimited PDFs & Images
            </div>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl mb-6 relative border border-white/10">
               <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-800 rounded-lg border border-white/10 shadow-sm transition-all duration-300 ${cycle === 'monthly' ? 'left-1' : 'left-[calc(50%+2px)]'}`} />
               <button onClick={() => setCycle('monthly')} className={`flex-1 relative z-10 text-sm font-medium py-2 text-center transition-colors ${cycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>
                  Monthly
               </button>
               <button onClick={() => setCycle('yearly')} className={`flex-1 relative z-10 text-sm font-medium py-2 text-center transition-colors ${cycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                  Yearly <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded ml-1">-37%</span>
               </button>
          </div>

          <div className="mb-6">
              <div className="flex justify-center items-end gap-1">
                  <span className="text-4xl font-bold text-white font-display tracking-tight">
                      {cycle === 'monthly' ? '$12' : '$90'}
                  </span>
                  <span className="text-slate-500 font-medium mb-1.5">
                      /{cycle === 'monthly' ? 'month' : 'year'}
                  </span>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                  {cycle === 'monthly' ? 'Billed monthly. Cancel anytime.' : 'Billed annually (equals $7.50/mo).'}
              </div>
          </div>

          <button 
            onClick={onUpgrade}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-900/40 flex items-center justify-center gap-2"
          >
            {cycle === 'monthly' ? 'Subscribe Monthly' : 'Subscribe Yearly'} <ArrowRight size={18} />
          </button>
          <button onClick={onClose} className="mt-4 text-xs text-slate-500 hover:text-white transition-colors">Maybe Later</button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const [viewMode, setViewMode] = useState<ViewMode>('chat');

  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const COST_PER_WORD = 5000;
  const COST_PDF = 50000;
  const COST_IMAGE = 20000;
  const NOTES_DAILY_LIMIT = 1;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];

  useEffect(() => {
    const loadedUser = loadUser();
    if (loadedUser) setUser(loadedUser);
    
    const loadedSessions = loadSessions();
    setSessions(loadedSessions);
    
    if (loadedSessions.length > 0) {
      setCurrentSessionId(loadedSessions[0].id);
    }
  }, []);

  const getActiveMessages = (): Message[] => {
    if (!currentSessionId) return [];
    const session = sessions.find(s => s.id === currentSessionId);
    return session ? session.messages : [];
  };

  const scrollToBottom = () => {
    if (viewMode === 'chat') {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSessionId, sessions, isLoading, viewMode]);

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    saveUser(newUser);
    if (sessions.length === 0) {
      handleNewChat();
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('neuralmark_user');
    window.location.reload();
  };

  const handleNewChat = () => {
    const newSession = createNewSession();
    newSession.messages.push({
      id: 'welcome-' + Date.now(),
      role: Role.MODEL,
      text: "System online. **NeuralMark** active. How can I assist with your research today?",
      timestamp: Date.now()
    });
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    saveSession(newSession);
    setViewMode('chat');
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    
    setIsGuidedMode(false);
    setIsNotesMode(false);
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setViewMode('chat');
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleDeleteSession = (id: string) => {
    deleteSession(id);
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (currentSessionId === id) {
      if (newSessions.length > 0) setCurrentSessionId(newSessions[0].id);
      else handleNewChat();
    }
  };

  const handleUpgrade = () => {
    if (user) {
      const updatedUser = { ...user, plan: 'pro' as const, tokens: Infinity };
      setUser(updatedUser);
      saveUser(updatedUser);
      setShowUpgradeModal(false);
    }
  };

  const handleOpenCreate = () => {
    setViewMode('create');
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleDeductTokens = (amount: number) => {
      if (!user) return;
      if (user.plan === 'free') {
        const newTokens = user.tokens - amount;
        const updatedUser = { ...user, tokens: newTokens };
        setUser(updatedUser);
        saveUser(updatedUser);
      }
  };

  const handleCreateSolve = (question: string) => {
    const newSession = createNewSession();
    const userMsg: Message = {
        id: Date.now().toString(),
        role: Role.USER,
        text: `Please solve this question: ${question}`,
        timestamp: Date.now()
    };
    newSession.messages.push(userMsg);
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    saveSession(newSession);
    setViewMode('chat');
    triggerAiResponseForSession(newSession.id, [userMsg], userMsg.text, false, false);
  };

  const triggerAiResponseForSession = async (sessionId: string, history: Message[], text: string, guided: boolean, notes: boolean) => {
      setIsLoading(true);
      try {
        const thinkingId = 'thinking-' + Date.now();
        setSessions(prev => prev.map(s => {
            if (s.id === sessionId) {
            return { ...s, messages: [...s.messages, {
                id: thinkingId,
                role: Role.MODEL,
                text: '',
                timestamp: Date.now(),
                isThinking: true
            }] };
            }
            return s;
        }));

        const actualResponse = await sendMessageToGemini([], text, [], guided, notes);

        setSessions(prev => prev.map(s => {
            if (s.id === sessionId) {
            const cleanMessages = s.messages.filter(m => m.id !== thinkingId);
            const updatedSession = { 
                ...s, 
                title: text.slice(0, 30),
                messages: [...cleanMessages, {
                id: Date.now().toString(),
                role: Role.MODEL,
                text: actualResponse,
                timestamp: Date.now()
                }],
                updatedAt: Date.now()
            };
            saveSession(updatedSession);
            return updatedSession;
            }
            return s;
        }));
      } catch (error) {
          console.error(error);
      } finally {
          setIsLoading(false);
      }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments: Attachment[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];

        // Type Check
        if (!ALLOWED_TYPES.includes(file.type)) {
          setFileError(`Unsupported format: ${file.name}. Only PDF and images allowed.`);
          continue;
        }

        // Size Check
        if (file.size > MAX_FILE_SIZE) {
          setFileError(`File too large: ${file.name}. Max 10MB.`);
          continue;
        }

        const reader = new FileReader();
        try {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          const base64Data = dataUrl.split(',')[1];
          newAttachments.push({
            name: file.name,
            mimeType: file.type,
            data: base64Data
          });
        } catch (err) {
          console.error("Error reading file", err);
        }
      }
      if (newAttachments.length > 0) {
        setAttachments(prev => [...prev, ...newAttachments]);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    let hasImage = false;
    const pendingAttachments: Promise<Attachment>[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        hasImage = true;
        const file = items[i].getAsFile();
        if (file) {
           if (file.size > MAX_FILE_SIZE) {
             setFileError("Pasted image exceeds 10MB limit.");
             continue;
           }
           const promise = new Promise<Attachment>((resolve, reject) => {
               const reader = new FileReader();
               reader.onload = () => {
                   const result = reader.result as string;
                   resolve({
                       name: `Pasted_Image_${Date.now()}_${i}.png`, 
                       mimeType: file.type,
                       data: result.split(',')[1]
                   });
               };
               reader.onerror = reject;
               reader.readAsDataURL(file);
           });
           pendingAttachments.push(promise);
        }
      }
    }
    if (hasImage) {
      e.preventDefault();
      try {
          const newAttachments = await Promise.all(pendingAttachments);
          setAttachments(prev => [...prev, ...newAttachments]);
      } catch (err) {
          console.error("Paste error", err);
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const calculateCost = () => {
    const wordCount = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;
    let attachmentCost = 0;
    attachments.forEach(att => {
        if (att.mimeType === 'application/pdf') attachmentCost += COST_PDF;
        else if (att.mimeType.startsWith('image/')) attachmentCost += COST_IMAGE;
    });
    return (wordCount * COST_PER_WORD) + attachmentCost;
  };

  const handleSend = async () => {
    if ((!inputText.trim() && attachments.length === 0) || isLoading || !user || !currentSessionId) return;
    const cost = calculateCost();
    if (user.plan === 'free' && user.tokens < cost) {
      setShowUpgradeModal(true);
      return;
    }
    if (isNotesMode && user.plan === 'free' && user.dailyNoteGenerations >= NOTES_DAILY_LIMIT) {
      setShowUpgradeModal(true);
      return;
    }
    if (user.plan === 'free') {
      const updatedUser = { 
        ...user, 
        tokens: user.tokens - cost,
        dailyNoteGenerations: isNotesMode ? user.dailyNoteGenerations + 1 : user.dailyNoteGenerations 
      };
      setUser(updatedUser);
      saveUser(updatedUser);
    }
    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: inputText,
      attachments: [...attachments],
      timestamp: Date.now()
    };
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return { 
          ...s, 
          messages: [...s.messages, userMessage], 
          updatedAt: Date.now(),
          title: s.messages.length <= 1 ? (userMessage.text.slice(0, 30) || 'New Chat') : s.title 
        };
      }
      return s;
    }));
    setInputText('');
    setAttachments([]);
    setFileError(null);
    setIsLoading(true);
    try {
      const thinkingId = 'thinking-' + Date.now();
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, {
            id: thinkingId,
            role: Role.MODEL,
            text: '',
            timestamp: Date.now(),
            isThinking: true
          }] };
        }
        return s;
      }));
      const session = sessions.find(s => s.id === currentSessionId);
      const historyForApi = session ? session.messages.filter(m => m.id !== userMessage.id) : [];
      const actualResponse = await sendMessageToGemini(historyForApi, userMessage.text, userMessage.attachments, isGuidedMode, isNotesMode);
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          const cleanMessages = s.messages.filter(m => m.id !== thinkingId);
          const updatedSession = { 
            ...s, 
            messages: [...cleanMessages, {
              id: Date.now().toString(),
              role: Role.MODEL,
              text: actualResponse,
              timestamp: Date.now()
            }],
            updatedAt: Date.now()
          };
          saveSession(updatedSession);
          return updatedSession;
        }
        return s;
      }));
    } catch (error) {
       setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          const cleanMessages = s.messages.filter(m => !m.isThinking);
          return { 
            ...s, 
            messages: [...cleanMessages, {
              id: Date.now().toString(),
              role: Role.MODEL,
              text: "Error: Neural connection severed. Please retry.",
              timestamp: Date.now()
            }] 
          };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  let chatBarClass = 'border-white/10 shadow-[0_4px_25px_rgba(139,92,246,0.1)]';
  let placeholderText = "Ask a question...";
  if (isNotesMode) {
    chatBarClass = 'border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.3)] bg-slate-900/50';
    placeholderText = "Enter a topic to generate structured notes...";
  } else if (isGuidedMode) {
    chatBarClass = 'border-teal-500/30 shadow-[0_4px_25px_rgba(20,184,166,0.1)]';
    placeholderText = "Ask for a hint or guidance...";
  }

  return (
    <div className="relative w-full h-screen flex flex-col font-sans text-white overflow-hidden selection:bg-purple-500/30">
      <NeuralBackground />
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} onUpgrade={handleUpgrade} />}
      {!user ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <div className="flex h-full pt-16">
           <Sidebar 
             user={user}
             sessions={sessions}
             currentSessionId={currentSessionId}
             onSelectSession={handleSelectSession}
             onNewChat={handleNewChat}
             onDeleteSession={handleDeleteSession}
             onLogout={handleLogout}
             onUpgrade={() => setShowUpgradeModal(true)}
             onOpenCreate={handleOpenCreate}
             isOpen={isSidebarOpen}
           />
           {isSidebarOpen && (
             <div className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
           )}
           <div className="flex-1 flex flex-col h-full relative">
              <header className="absolute top-[-64px] left-0 right-0 h-16 glass-panel z-20 flex items-center justify-between px-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white">
                    {isSidebarOpen ? <X /> : <Menu />}
                  </button>
                  <div className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 rounded-xl bg-slate-900/50 border border-white/10 flex items-center justify-center">
                      <BrainCircuit size={22} className="text-purple-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-display font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                        NEURAL<span className="text-purple-500">MARK</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-4 text-sm">
                   <button 
                     onClick={handleOpenCreate}
                     className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all group"
                   >
                     <Sparkles size={14} className="text-purple-400 group-hover:scale-125 transition-transform" />
                     <span>Neural Create</span>
                   </button>
                   {user.plan === 'free' && (
                     <span className="text-xs text-slate-500 font-mono bg-black/20 px-2 py-1 rounded-md border border-white/5">
                       Tokens: {(user.tokens / 1000).toFixed(1)}k
                     </span>
                   )}
                </div>
              </header>

              {viewMode === 'create' ? (
                <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
                   <NeuralCreate 
                     onQuestionSelect={handleCreateSolve} 
                     userTokens={user.tokens}
                     onDeductTokens={handleDeductTokens}
                     userPlan={user.plan}
                     onUpgrade={() => setShowUpgradeModal(true)}
                     onBack={() => setViewMode('chat')}
                   />
                </main>
              ) : (
                <main className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full px-4 md:px-6">
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex flex-col justify-end min-h-full pb-4 pt-4">
                        {getActiveMessages().length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="relative mb-8 group">
                                <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full group-hover:bg-purple-500/30 transition-all duration-700"></div>
                                <BrainCircuit size={80} className="text-slate-600 relative z-10 animate-float opacity-40" />
                            </div>
                            <p className="text-sm tracking-[0.3em] uppercase opacity-30 mb-8 font-display">Awaiting Neural Input</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full">
                                <button 
                                    onClick={handleOpenCreate}
                                    className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-slate-900/40 border border-purple-500/20 hover:bg-slate-900/60 hover:border-purple-500/50 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Sparkles size={24} className="text-purple-400" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-white font-semibold mb-1">Discover Topics</h3>
                                        <p className="text-xs text-slate-500">Generate past papers from the web</p>
                                    </div>
                                </button>
                                
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-slate-900/40 border border-blue-500/20 hover:bg-slate-900/60 hover:border-blue-500/50 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FileText size={24} className="text-blue-400" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-white font-semibold mb-1">Upload Material</h3>
                                        <p className="text-xs text-slate-500">Solve from your PDFs or images</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                        ) : (
                        getActiveMessages().map(msg => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    </div>

                    <div className="mt-2 mb-4 flex flex-col gap-3">
                    {fileError && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs animate-fade-in">
                            <AlertCircle size={14} />
                            {fileError}
                            <button onClick={() => setFileError(null)} className="ml-auto p-1 hover:text-white"><X size={12} /></button>
                        </div>
                    )}

                    {attachments.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                        {attachments.map((att, idx) => (
                            <div key={idx} className="relative group flex items-center gap-2 bg-slate-800/80 backdrop-blur border border-purple-500/30 rounded-xl px-3 py-2 text-sm min-w-[120px] animate-float">
                            {att.mimeType.includes('image') ? <ImageIcon size={16} className="text-purple-400" /> : <FileText size={16} className="text-purple-400" />}
                            <span className="truncate max-w-[150px]">{att.name}</span>
                            <button onClick={() => removeAttachment(idx)} className="ml-auto hover:text-red-400 transition-colors p-1"><Trash2 size={14} /></button>
                            </div>
                        ))}
                        </div>
                    )}

                    <div className={`relative glass-panel rounded-2xl p-2 flex items-end gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border transition-all duration-300 ${chatBarClass}`}>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,application/pdf" multiple />
                        <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-slate-400 hover:text-purple-300 hover:bg-white/5 rounded-xl transition-all relative group"
                        title="Upload Image (20k) or PDF (50k)"
                        >
                        <Paperclip size={20} />
                        {user.plan === 'free' && (
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-[10px] rounded text-slate-300 opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                            PDF: 50k | IMG: 20k
                            </div>
                        )}
                        </button>

                        <div className="relative">
                          <button 
                            onClick={() => setShowToolsMenu(!showToolsMenu)}
                            className={`p-3 rounded-xl transition-all relative group ${
                              showToolsMenu || isGuidedMode || isNotesMode ? 'text-white bg-white/10' : 'text-slate-400 hover:text-purple-300 hover:bg-white/5'
                            }`}
                            title="Learning Tools"
                          >
                            <Wrench size={20} />
                          </button>
                          
                          {showToolsMenu && (
                            <div className="absolute bottom-full left-0 mb-3 w-52 bg-slate-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-50 p-2 backdrop-blur-xl">
                              <div className="space-y-1">
                                <button 
                                  onClick={() => {
                                    handleOpenCreate();
                                    setShowToolsMenu(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-slate-400 hover:bg-purple-500/10 hover:text-purple-300 group"
                                >
                                  <Sparkles size={16} className="text-purple-400 group-hover:scale-110" />
                                  <span>Generate Practice</span>
                                </button>
                                <div className="h-px bg-white/5 mx-2 my-1" />
                                <button 
                                  onClick={() => {
                                    setIsGuidedMode(!isGuidedMode);
                                    setIsNotesMode(false);
                                    setShowToolsMenu(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                                    isGuidedMode ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                  }`}
                                >
                                  <GraduationCap size={16} />
                                  <span>Guided Mode</span>
                                  {isGuidedMode && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />}
                                </button>
                                <button 
                                  onClick={() => {
                                    setIsNotesMode(!isNotesMode);
                                    setIsGuidedMode(false);
                                    setShowToolsMenu(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                                    isNotesMode ? 'bg-red-500/20 text-red-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                  }`}
                                >
                                  <BookOpen size={16} />
                                  <span>Make Notes</span>
                                  {isNotesMode && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {showToolsMenu && (
                          <div className="fixed inset-0 z-40" onClick={() => setShowToolsMenu(false)} />
                        )}
                        
                        <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        placeholder={
                            user.plan === 'free' && user.tokens < calculateCost() && calculateCost() > 0 
                            ? "Not enough tokens..." 
                            : placeholderText
                        }
                        disabled={user.plan === 'free' && user.tokens < calculateCost() && calculateCost() > 0}
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 resize-none py-3 max-h-[120px] min-h-[44px]"
                        rows={1}
                        />

                        <button 
                        onClick={handleSend}
                        disabled={isLoading || (!inputText.trim() && attachments.length === 0)}
                        className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isLoading || (!inputText.trim() && attachments.length === 0)
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            : isNotesMode
                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-900/40 hover:scale-105 active:scale-95'
                            : isGuidedMode 
                                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-900/40 hover:scale-105 active:scale-95'
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95'
                        }`}
                        >
                        {isLoading ? <Sparkles size={20} className="animate-spin" /> : <Send size={20} className={inputText.trim() || attachments.length > 0 ? 'ml-1' : ''} />}
                        </button>
                    </div>
                    
                    <div className="flex justify-between items-center px-2">
                        <div className="text-[10px] text-slate-600 font-display tracking-widest uppercase opacity-50 flex gap-2">
                           <span>NeuralMark v2.5</span>
                           {isNotesMode && <span className="text-red-500 font-bold">• NOTES GENERATOR</span>}
                           {isGuidedMode && <span className="text-teal-500 font-bold">• GUIDED TUTOR</span>}
                           {!isNotesMode && !isGuidedMode && <span>• SYSTEM READY</span>}
                        </div>
                        {user.plan === 'free' && (inputText.length > 0 || attachments.length > 0) && (
                        <div className="text-[10px] text-purple-400 font-mono">
                            Est. cost: {(calculateCost() / 1000).toFixed(1)}k tokens
                        </div>
                        )}
                    </div>
                    </div>
                </main>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default App;