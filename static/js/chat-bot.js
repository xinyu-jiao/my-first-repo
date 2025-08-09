let chatInitialized = false;
let cachedOpenAIKeyPromise = null;

function writeDebug(...args) {}

function maskKey(key) {
  if (!key) return '(empty)';
  const trimmed = String(key).trim();
  if (trimmed.length <= 8) return '*'.repeat(trimmed.length);
  return trimmed.slice(0, 3) + '...' + trimmed.slice(-4) + ` (len=${trimmed.length})`;
}

async function loadOpenAIKey() {
  if (!cachedOpenAIKeyPromise) {
    writeDebug('Loading API key from ./config/openai_api_key.txt ...');
    cachedOpenAIKeyPromise = fetch('./config/openai_api_key.txt')
      .then(r => {
        writeDebug('fetch status:', r.status);
        return r.ok ? r.text() : '';
      })
      .then(t => (t || '').trim())
      .catch(err => {
        writeDebug('fetch error:', err.message);
        return '';
      });
  }
  const key = await cachedOpenAIKeyPromise;
  writeDebug('Key loaded:', maskKey(key));
  return key;
}

function appendMessage(role, text) {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const msg = document.createElement('div');
  msg.className = `message ${role}`;
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function setError(message) {
  if (!message) return;
}

async function getChatGPTResponse(userMessage, apiKey) {
  writeDebug('Sending request to OpenAI...', { model: 'gpt-4o-mini', userMsgLen: userMessage?.length || 0 });
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant for an architecture and data visualization student. Keep replies concise.' },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7
    })
  });
  writeDebug('OpenAI response status:', res.status);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    writeDebug('OpenAI error body:', text);
    throw new Error(`OpenAI API error (${res.status}): ${res.statusText}`);
  }
  const data = await res.json();
  writeDebug('OpenAI response ok');
  return data.choices?.[0]?.message?.content?.trim() || '';
}

function bindChatHandlers(apiKey) {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  if (!input || !sendBtn) return;

  const send = async () => {
    setError('');
    const text = (input.value || '').trim();
    if (!text) return;
    input.value = '';
    appendMessage('user', text);

    const typingEl = document.createElement('div');
    typingEl.className = 'message bot';
    typingEl.textContent = '…';
    const container = document.getElementById('chat-messages');
    container.appendChild(typingEl);
    container.scrollTop = container.scrollHeight;

    try {
      const answer = await getChatGPTResponse(text, apiKey);
      typingEl.remove();
      appendMessage('bot', answer || '(no response)');
    } catch (err) {
      typingEl.remove();
      appendMessage('bot', 'Sorry, I could not fetch a response.');
    }
  };

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') send();
  });
}

async function initializeChatBot() {
  if (chatInitialized) return;
  const container = document.getElementById('a4163-chatbot');
  if (!container) return;

  chatInitialized = true;
  try {
    const key = await loadOpenAIKey();
    if (!key || /REPLACE_WITH_YOUR_OPENAI_API_KEY/i.test(key)) {
      setError('Missing OpenAI API key. Add your key to config/openai_api_key.txt');
      bindChatHandlers('');
      return;
    }
    bindChatHandlers(key);
  } catch (err) {
    setError('Could not load API key from config/openai_api_key.txt');
  }
}

// Quick manual test without UI
window.testOpenAI = async function testOpenAI(prompt = 'Hello, who are you?') {
  try {
    const key = await loadOpenAIKey();
    const reply = await getChatGPTResponse(prompt, key);
    return reply;
  } catch (e) {
    throw e;
  }
}; 