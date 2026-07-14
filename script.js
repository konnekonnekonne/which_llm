const form = document.getElementById('query-form');
const input = document.getElementById('query-input');
const submitBtn = document.getElementById('submit-btn');
const statusEl = document.getElementById('status');
const taskLabel = document.getElementById('task-label');
const summaryEl = document.getElementById('summary');
const examples = document.getElementById('examples');
const cards = document.querySelectorAll('.card');

const DEFAULT_PLACEHOLDER = input.placeholder;
const DEFAULT_BUTTON_LABEL = submitBtn.textContent;

// When set, we're mid-conversation: the model asked a clarifying question
// and `pending.query` holds the full context to carry into the next request.
let pending = null;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSubmit(input.value.trim());
});

examples.addEventListener('click', (e) => {
  if (!e.target.classList.contains('example-chip')) return;
  resetConversation();
  const query = e.target.textContent;
  input.value = query;
  handleSubmit(query);
});

function handleSubmit(value) {
  if (!value) return;

  const query = pending
    ? `Original request: ${pending.query}\n\nClarifying question asked: ${pending.question}\nUser's answer: ${value}`
    : value;

  submitQuery(query);
}

async function submitQuery(query) {
  setStatus('Thinking...', 'info');
  setSkeleton(true);
  submitBtn.disabled = true;

  try {
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();

    if (!res.ok || data.error) {
      setStatus(data.error || 'Something went wrong. Please try again.', 'error');
      resetConversation();
      return;
    }

    if (data.question) {
      pending = { query, question: data.question };
      setStatus(data.question, 'question');
      input.value = '';
      input.placeholder = 'Type your answer...';
      submitBtn.textContent = 'Answer';
      return;
    }

    renderResults(data);
    setStatus('', 'none');
    resetConversation();
  } catch (err) {
    setStatus('Network error. Please try again.', 'error');
    resetConversation();
  } finally {
    submitBtn.disabled = false;
  }
}

function resetConversation() {
  pending = null;
  input.placeholder = DEFAULT_PLACEHOLDER;
  submitBtn.textContent = DEFAULT_BUTTON_LABEL;
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', type === 'error');
  statusEl.classList.toggle('question', type === 'question');
}

function setSkeleton(isSkeleton) {
  cards.forEach((card) => card.classList.toggle('skeleton', isSkeleton));
  taskLabel.classList.toggle('skeleton', isSkeleton);
  summaryEl.classList.toggle('skeleton', isSkeleton);
}

function renderResults(data) {
  taskLabel.textContent = data.task || '';

  fillCard('budget', data.budget);
  fillCard('balanced', data.balanced);
  fillCard('premium', data.premium);

  summaryEl.textContent = data.summary || '';
  setSkeleton(false);
}

function fillCard(tier, tierData) {
  if (!tierData) return;
  document.getElementById(`${tier}-model`).textContent = tierData.model || '';
  document.getElementById(`${tier}-price`).textContent = tierData.price || '';
  document.getElementById(`${tier}-why`).textContent = tierData.why || '';
}
