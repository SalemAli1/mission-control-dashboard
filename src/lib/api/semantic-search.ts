import { execSync } from 'child_process';

const SEMANTIC_SEARCH_PATH = process.env.SEMANTIC_SEARCH_PATH || '/home/salem/hq/apps/semantic-engine';

export interface SearchResult {
  id: string;
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

export async function searchKnowledge(query: string): Promise<SearchResult[]> {
  try {
    // Escape the query to prevent shell injection
    const escapedQuery = query.replace(/"/g, '\\"');

    // Execute the Python script
    const command = `cd ${SEMANTIC_SEARCH_PATH} && python query_knowledge.py "${escapedQuery}"`;
    const output = execSync(command, {
      encoding: 'utf-8',
      timeout: 10000, // 10 second timeout
    });

    // Parse the output (assuming JSON array)
    const results = JSON.parse(output);
    
    return results.map((result: { id?: string; content?: string; text?: string; score?: number; metadata?: Record<string, unknown> }, index: number) => ({
      id: result.id || `result-${index}`,
      content: result.content || result.text || '',
      score: result.score || 0,
      metadata: result.metadata || {},
    }));
  } catch (error) {
    console.error('Failed to search knowledge base:', error);
    
    // Return empty results on error
    return [];
  }
}

// Alternative implementation for browser environment (using API route)
export async function searchKnowledgeAPI(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to search knowledge base via API:', error);
    return [];
  }
}
