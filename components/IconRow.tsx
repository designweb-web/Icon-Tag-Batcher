import React, { useState } from 'react';
import { IconItem } from '../types';

interface IconRowProps {
  item: IconItem;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
}

const IconRow: React.FC<IconRowProps> = ({ item, onRetry, onRemove }) => {
  const [copied, setCopied] = useState(false);

  const copyTags = () => {
    if (item.tags.length > 0) {
      navigator.clipboard.writeText(item.tags.join(', '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative bg-slate-800/40 border border-slate-700 rounded-xl p-4 flex gap-4 items-start transition-all hover:bg-slate-800/80 hover:border-slate-600">
      
      {/* Thumbnail */}
      <div className="shrink-0 w-20 h-20 bg-slate-900/50 rounded-lg p-2 border border-slate-700 flex items-center justify-center">
        <img 
          src={item.previewUrl} 
          alt="Icon" 
          className={`max-w-full max-h-full object-contain ${item.status === 'PENDING' ? 'opacity-50 grayscale' : ''}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[5rem]">
        
        {/* Header / Filename */}
        <div className="flex items-center justify-between mb-2">
           <span className="text-xs font-medium text-slate-400 truncate max-w-[200px]" title={item.file.name}>
             {item.file.name}
           </span>
           
           {item.status === 'ERROR' && (
             <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded">Analysis Failed</span>
           )}
        </div>

        {/* State Handling */}
        {item.status === 'PENDING' && (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Waiting in queue...
          </div>
        )}

        {item.status === 'ANALYZING' && (
          <div className="flex items-center gap-2 text-indigo-400 text-sm animate-pulse">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating tags...
          </div>
        )}

        {item.status === 'ERROR' && (
          <div className="flex gap-2">
             <button onClick={() => onRetry(item.id)} className="text-sm text-indigo-400 hover:text-indigo-300 underline">
               Retry
             </button>
          </div>
        )}

        {item.status === 'SUCCESS' && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag, idx) => (
              <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-200 border border-slate-600">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 shrink-0">
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
          title="Remove"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {item.status === 'SUCCESS' && (
          <button
            onClick={copyTags}
            className={`p-2 rounded-lg transition-colors border ${copied ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700 border-transparent'}`}
            title="Copy tags"
          >
            {copied ? (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
               </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default IconRow;