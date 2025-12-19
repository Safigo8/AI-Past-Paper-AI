import React, { useState } from 'react';
import { Sparkles, Search, ArrowRight, BrainCircuit, Globe, Lock, Crown, ChevronLeft } from 'lucide-react';
import { generateQuestionsFromTopic } from '../services/geminiService';
import { PlanType } from '../types';

interface NeuralCreateProps {
  onQuestionSelect: (question: string) => void;
  userTokens: number;
  onDeductTokens: (amount: number) => void;
  userPlan: PlanType;
  onUpgrade: () => void;
  onBack: () => void;
}

const NeuralCreate: React.FC<NeuralCreateProps> = ({ 
  onQuestionSelect, 
  userTokens, 
  onDeductTokens, 
  userPlan,
  onUpgrade,
  onBack
}) => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const COST = 50000; // Fixed cost for a search generation

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    if (userTokens < COST) {
      setError('Insufficient neural tokens.');
      return;
    }

    setIsLoading(true);
    setError('');
    setQuestions([]);
    onDeductTokens(COST);

    try {
      const results = await generateQuestionsFromTopic(topic);
      setQuestions(results);
    } catch (err) {
      setError('Failed to retrieve data from the knowledge lattice.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Locked View for Free Plan ---
  if (userPlan === 'free') {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full animate-fade-in px-6 text-center">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Chat
        </button>
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full"></div>
           <div className="relative w-24 h-24 bg-slate-900 border border-amber-500/30 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.2)]">
              <Lock size={40} className="text-amber-500" />
           </div>
           <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-2 border-slate-900">
              <Crown size={14} className="text-white fill-white" />
           </div>
        </div>
        
        <h2 className="text-4xl font-display font-bold text-white mb-4">Neural Create is Locked</h2>
        <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
          The ability to generate custom academic questions from the global knowledge lattice is an exclusive feature for <span className="text-amber-400 font-semibold">Neural +</span> members.
        </p>

        <button 
          onClick={onUpgrade}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-900/40 flex items-center gap-3"
        >
          <Crown size={20} className="fill-white/20" />
          Unlock Neural +
        </button>
      </div>
    );
  }

  // --- Unlocked View ---
  return (
    <div className="flex flex-col items-center justify-center min-h-full max-w-4xl mx-auto px-6 w-full animate-float py-12 relative">
      <button 
        onClick={onBack}
        className="absolute top-0 left-0 flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
      >
        <ChevronLeft size={20} />
        Back to Chat
      </button>

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          <Sparkles size={32} className="text-purple-400" />
        </div>
        <h2 className="text-4xl font-display font-bold text-white mb-3">Neural Create</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Enter a topic. The system will scan the global web lattice to generate academic past-paper questions for you.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="w-full max-w-2xl relative mb-12 z-20">
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-50 group-hover:opacity-100 transition duration-500 blur"></div>
            <div className="relative flex items-center bg-slate-900 rounded-2xl border border-white/10">
                <Search className="ml-4 text-slate-500" size={20} />
                <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="E.g., Quantum Entanglement, French Revolution, Organic Chemistry..." 
                    className="w-full bg-transparent border-none outline-none text-white px-4 py-4 text-lg placeholder-slate-600"
                    autoFocus
                />
                <button 
                    type="submit"
                    disabled={isLoading || !topic.trim()}
                    className="mr-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? 'Scanning...' : 'Generate'}
                    {!isLoading && <ArrowRight size={16} />}
                </button>
            </div>
        </div>
        {error && <div className="absolute top-full mt-2 text-red-400 text-sm">{error}</div>}
        <div className="absolute top-full right-0 mt-2 text-xs text-slate-500">
            Cost: {(COST/1000).toFixed(0)}k tokens
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center gap-4 text-slate-400 animate-pulse">
             <Globe size={48} className="animate-spin duration-[3000ms]" />
             <span className="font-mono text-sm tracking-widest uppercase">Synthesizing Web Data...</span>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && questions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-fade-in pb-12">
          {questions.map((q, idx) => (
            <div key={idx} className="group relative bg-slate-800/40 border border-white/10 p-6 rounded-2xl hover:bg-slate-800/60 transition-all hover:-translate-y-1 hover:border-purple-500/30 flex flex-col justify-between">
               <div>
                 <div className="flex items-center gap-2 mb-3 text-purple-400 text-xs font-mono uppercase tracking-wider">
                    <BrainCircuit size={14} /> Question {idx + 1}
                 </div>
                 <p className="text-slate-200 text-sm leading-relaxed mb-6 font-medium">
                    {q}
                 </p>
               </div>
               <button 
                 onClick={() => onQuestionSelect(q)}
                 className="w-full py-2.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-200 text-sm font-semibold hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2"
               >
                 Solve in Chat
               </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NeuralCreate;