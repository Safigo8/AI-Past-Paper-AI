import React from 'react';
import { Message, Role } from '../types';
import { Bot, User, FileText, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${
          isUser 
            ? 'bg-blue-500/20 border-blue-400/30 text-blue-300' 
            : 'bg-purple-600/20 border-purple-400/30 text-purple-300'
        }`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-lg ${
            isUser 
              ? 'glass-bubble-user text-blue-50 rounded-tr-none' 
              : 'glass-bubble-ai text-slate-200 rounded-tl-none'
          }`}>
            {/* Attachments Preview */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {message.attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg border border-white/10 text-xs">
                    <FileText size={14} className="text-purple-400" />
                    <span className="truncate max-w-[150px]">{att.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Content */}
            {message.isThinking ? (
              <div className="flex items-center gap-2 text-purple-300 animate-pulse">
                <Loader2 size={16} className="animate-spin" />
                <span>Analyzing synapse patterns...</span>
              </div>
            ) : (
              <div className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-purple-300 font-semibold" {...props} />,
                    img: ({node, ...props}) => (
                        <div className="relative group my-4 inline-block w-full">
                             <img 
                                className="relative rounded-xl shadow-lg border border-white/10 max-w-full h-auto bg-slate-900" 
                                {...props} 
                                alt={props.alt || "Attached Image"} 
                            />
                        </div>
                    ),
                    code: ({node, ...props}) => {
                         const { inline, className, children } = props as any;
                         if (inline) {
                           return <code className="bg-black/30 px-1 py-0.5 rounded text-purple-200 font-mono text-xs" {...props} />;
                         }
                         return <div className="bg-black/40 p-3 rounded-lg border border-white/10 my-2 overflow-x-auto"><code className="text-purple-200 font-mono text-sm" {...props} /></div>;
                    },
                    blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-purple-500 bg-purple-500/10 pl-4 py-2 my-3 rounded-r-lg text-slate-300 italic" {...props} />
                    ),
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-3 mt-4 flex items-center gap-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white mb-2 mt-4" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold text-purple-200 mb-1 mt-3" {...props} />,
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <span className="text-xs text-slate-500 px-1">
             {isUser ? 'You' : 'Neuro'} • {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;