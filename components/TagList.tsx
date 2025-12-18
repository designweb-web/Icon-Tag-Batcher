import React, { useState } from 'react';

interface TagListProps {
  tags: string[];
}

const TagList: React.FC<TagListProps> = ({ tags }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = () => {
    const csv = tags.join(', ');
    navigator.clipboard.writeText(csv);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  if (tags.length === 0) return null;

  return (
    <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Suggested Tags ({tags.length})</h3>
        <button
          onClick={copyAll}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors flex items-center gap-2"
        >
          {allCopied ? (
             <>
               <span className="text-green-400">✓</span> Copied
             </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
              </svg>
              Copy All
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <button
            key={index}
            onClick={() => copyToClipboard(tag, index)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
              ${copiedIndex === index 
                ? 'bg-green-500/20 border-green-500/50 text-green-300 scale-105' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-500 hover:text-white'}
            `}
          >
            {tag}
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-sm text-slate-400 font-mono break-all">
         <span className="select-none text-slate-500 mr-2">$</span>
         {tags.join(', ')}
      </div>
    </div>
  );
};

export default TagList;
