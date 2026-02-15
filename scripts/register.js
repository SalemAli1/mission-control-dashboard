async function register() {
  const agents = [
    { id: 'agent-pi', name: 'Pi', model: 'Gemini 3 Flash', status: 'online' },
    { id: 'agent-amir', name: 'MiniMe', model: 'Gemini 3 Flash', status: 'online' },
    { id: 'agent-claude-code', name: 'Claude Code', model: 'Claude 3.5 Sonnet', status: 'online' }
  ];

  console.log('📡 Sending signals to Mission Control...');

  for (const agent of agents) {
    try {
      const res = await fetch('http://localhost:3000/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent)
      });
      if (res.ok) {
        console.log(`✅ Registered ${agent.name} (${agent.model})`);
      } else {
        console.error(`❌ Failed to register ${agent.name}: ${res.statusText}`);
      }
    } catch (err) {
      console.error(`❌ Connection error for ${agent.name}: ${err.message}`);
    }
  }
}

register();
