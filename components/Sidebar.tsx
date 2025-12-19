import React from 'react';
import { Plus, MessageSquare, Crown, Zap, LogOut, Layout, Sparkles, Lock } from 'lucide-react';
import { ChatSession, UserProfile } from '../types';

interface SidebarProps {
  user: UserProfile;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onLogout: () => void;
  onUpgrade: () => void;
  onOpenCreate: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewChat, 
  onLogout,
  onUpgrade,
  onOpenCreate,
  isOpen
}) => {
  const isFree = user.plan === 'free';
  const progress = isFree ? (user.tokens / 100000) * 100 : 100; // Adjusted for 100k limit
  
  return (
    <div className={`fixed md:relative z-40 w-72 h-full bg-[#020617]/95 border-r border-white/5 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} backdrop-blur-xl`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 space-y-3">
        <button 
          onClick={onNewChat}
          className="w-full h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center gap-2 transition-all font-medium text-sm border border-white/5"
        >
          <Plus size={18} />
          New Research
        </button>
        <button 
          onClick={onOpenCreate}
          className="w-full h-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center gap-2 transition-all font-medium text-sm shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:scale-[1.02] relative overflow-hidden group"
        >
          <Sparkles size={18} />
          Neural Create
          {isFree && (
            <div className="absolute right-3 bg-black/40 p-1 rounded-full border border-white/10">
                <Lock size={10} className="text-amber-400" />
            </div>
          )}
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
        <div className="text-xs font-medium text-slate-500 px-3 py-2 uppercase tracking-wider">History</div>
        {sessions.length === 0 ? (
          <div className="text-center py-10 text-slate-600 text-sm italic">
            No archives found.
          </div>
        ) : (
          sessions.map(session => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-left px-3 py-3 rounded-lg flex items-start gap-3 transition-colors text-sm group ${
                currentSessionId === session.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <MessageSquare size={16} className={`mt-0.5 ${currentSessionId === session.id ? 'text-purple-400' : 'text-slate-600 group-hover:text-purple-400'}`} />
              <span className="truncate flex-1">{session.title || 'Untitled Research'}</span>
            </button>
          ))
        )}
      </div>

      {/* User & Plan Stats */}
      <div className="p-4 bg-slate-900/50 border-t border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm text-white font-medium truncate">{user.name}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isFree ? 'bg-slate-500' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'}`} />
              {isFree ? 'Free Plan' : 'Neural +'}
            </div>
          </div>
          <button onClick={onLogout} className="text-slate-500 hover:text-white transition-colors" title="Logout">
            <LogOut size={16} />
          </button>
        </div>

        {/* Token Counter */}
        <div className="bg-black/40 rounded-xl p-3 border border-white/5 mb-3">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slate-400 flex items-center gap-1"><Zap size={12} className={isFree ? "text-purple-400" : "text-amber-400"} /> Neural Tokens</span>
            <span className={isFree ? "text-white font-mono" : "text-amber-400 font-mono"}>
              {isFree ? `${(user.tokens / 1000).toFixed(1)}k` : '∞'}
            </span>
          </div>
          {isFree && (
             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
               <div 
                 className={`h-full rounded-full transition-all duration-500 ${progress < 20 ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'}`}
                 style={{ width: `${progress}%` }}
               />
             </div>
          )}
          {isFree && <div className="text-[10px] text-slate-600 mt-1.5 text-right">Resets daily</div>}
        </div>

        {isFree && (
          <button 
            onClick={onUpgrade}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-amber-500/30 transition-all group"
          >
            <Crown size={14} className="group-hover:scale-110 transition-transform" />
            Upgrade to Neural +
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
