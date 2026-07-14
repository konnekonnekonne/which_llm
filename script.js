const form = document.getElementById('query-form');
const input = document.getElementById('query-input');
const submitBtn = document.getElementById('submit-btn');
const statusEl = document.getElementById('status');
const results = document.getElementById('results');
const examples = document.getElementById('examples');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitQuery(input.value.trim());
});

examples.addEventListener('click', (e) => {
  if (!e.target.classList.contains('example-chip')) return;
  const query = e.target.textContent;
  input.value = query;
  submitQuery(query);
});

async function submitQuery(query) {
  if (!query) return;

  setStatus('Thinking...', false);
  results.hidden = true;
  submitBtn.disabled = true;

  try {
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();

    if (!res.ok || data.error) {
      setStatus(data.error || 'Something went wrong. Please try again.', true);
      return;
    }

    renderResults(data);
    setStatus('', false, true);
  } catch (err) {
    setStatus('Network error. Please try again.', true);
  } finally {
    submitBtn.disabled = false;
  }
}

function setStatus(message, isError, hide = false) {
  statusEl.hidden = hide || !message;
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

function renderResults(data) {
  document.getElementById('task-label').textContent = data.task || '';

  fillCard('budget', data.budget);
  fillCard('balanced', data.balanced);
  fillCard('premium', data.premium);

  document.getElementById('summary').textContent = data.summary || '';
  results.hidden = false;
}

function fillCard(tier, tierData) {
  if (!tierData) return;
  document.getElementById(`${tier}-model`).textContent = tierData.model || '';
  document.getElementById(`${tier}-price`).textContent = tierData.price || '';
  document.getElementById(`${tier}-why`).textContent = tierData.why || '';
}
