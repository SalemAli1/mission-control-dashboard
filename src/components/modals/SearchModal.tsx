'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, Loader2, FileText, ChevronRight } from 'lucide-react';
import { SearchResult } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-zinc-950 border-zinc-800 text-zinc-100 p-0 overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <Search className="w-5 h-5 text-zinc-500" />
            <Input
              placeholder="Search knowledge base..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none focus-visible:ring-0 text-lg p-0 h-auto placeholder:text-zinc-600"
              autoFocus
            />
            {isLoading && <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />}
          </form>
        </div>

        <div className="max-h-[500px] overflow-y-auto custom-scrollbar p-2">
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className="group p-4 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 rounded-md bg-zinc-800 text-zinc-400 group-hover:text-blue-400 transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-zinc-500 truncate max-w-[200px]">
                          {result.metadata.path.split('/').pop()}
                        </span>
                        <span className="text-[10px] text-zinc-600 uppercase font-bold">
                          {Math.round((1 - result.distance) * 100)}% Match
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3">
                        {result.content}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-700 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          ) : query && !isLoading ? (
            <div className="p-8 text-center text-zinc-500">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-600">
              Enter a query to search through documentation and logs
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
