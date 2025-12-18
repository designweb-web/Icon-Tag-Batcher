import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import IconRow from './components/IconRow';
import { generateIconTags } from './services/geminiService';
import { IconItem, ImageFile } from './types';

// Limit concurrent API requests to avoid 429 errors
const MAX_CONCURRENT_REQUESTS = 2;

const App: React.FC = () => {
  const [items, setItems] = useState<IconItem[]>([]);
  
  // Queue Processing Effect
  useEffect(() => {
    const activeCount = items.filter(i => i.status === 'ANALYZING').length;
    
    // If we have capacity and items waiting
    if (activeCount < MAX_CONCURRENT_REQUESTS) {
      const pendingItem = items.find(i => i.status === 'PENDING');
      
      if (pendingItem) {
        analyzeItem(pendingItem);
      }
    }
  }, [items]); 

  // Function to process a single item
  const analyzeItem = async (item: IconItem) => {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'ANALYZING', error: undefined } : i));

    try {
      const generatedTags = await generateIconTags(item.base64, item.mimeType);
      
      setItems(prev => prev.map(i => i.id === item.id ? { 
        ...i, 
        status: 'SUCCESS', 
        tags: generatedTags 
      } : i));
    } catch (err: any) {
      setItems(prev => prev.map(i => i.id === item.id ? { 
        ...i, 
        status: 'ERROR', 
        error: err.message 
      } : i));
    }
  };

  const handleImagesSelected = async (newImages: ImageFile[]) => {
    const newItems: IconItem[] = newImages.map(img => ({
      ...img,
      id: Math.random().toString(36).substring(7),
      status: 'PENDING',
      tags: []
    }));

    setItems(prev => [...newItems, ...prev]);
  };

  const handleRetry = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'PENDING', error: undefined } : i));
  };

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const copyAllToJSON = () => {
    const data = items
      .filter(i => i.status === 'SUCCESS')
      .map(i => ({ filename: i.file.name, tags: i.tags }));
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert('Copied all results as JSON!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-500/10 rounded-2xl ring-1 ring-indigo-500/50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.077-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Icon Tag Batcher
              </h1>
              <p className="text-sm text-slate-400">
                Bulk upload icons to generate semantic tags instantly.
              </p>
            </div>
          </div>
          
          {items.some(i => i.status === 'SUCCESS') && (
            <button
              onClick={copyAllToJSON}
              className="text-sm font-medium px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-lg transition-colors"
            >
              Export All JSON
            </button>
          )}
        </div>

        {/* Upload Area */}
        <div className="bg-slate-800/20 rounded-xl p-1 relative">
          <FileUpload onImagesSelected={handleImagesSelected} isCompact={items.length > 0} />
        </div>

        {/* List Area */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 opacity-30">
              <p>No icons uploaded yet.</p>
            </div>
          ) : (
            items.map(item => (
              <IconRow 
                key={item.id} 
                item={item} 
                onRetry={handleRetry} 
                onRemove={handleRemove} 
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default App;