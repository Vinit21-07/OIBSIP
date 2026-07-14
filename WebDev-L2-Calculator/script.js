(function () {
  const prevLineEl = document.getElementById('prevLine');
  const mainLineEl = document.getElementById('mainLine');
 
  // Calculator state
  let currentInput = '0';      // string currently shown on the main line
  let previousValue = null;    // number stored from the last operand
  let pendingOperator = null;  // '+', '−', '×', '÷'
  let awaitingNewInput = false; // true right after an operator or equals is pressed
  let isError = false;
 
  function formatNumber(num) {
    if (!isFinite(num)) return 'Error';
    // Avoid absurdly long floating point tails
    const rounded = Math.round(num * 1e10) / 1e10;
    return rounded.toString();
  }
 
  function updateDisplay() {
    mainLineEl.textContent = currentInput;
    mainLineEl.classList.toggle('error', isError);
 
    if (previousValue !== null && pendingOperator) {
      const opSymbol = awaitingNewInput ? '' : pendingOperator;
      prevLineEl.textContent = `${formatNumber(previousValue)} ${pendingOperator}${opSymbol === '' ? ' ' : ''}`;
    } else {
      prevLineEl.innerHTML = '&nbsp;';
    }
  }
 
  function resetAll() {
    currentInput = '0';
    previousValue = null;
    pendingOperator = null;
    awaitingNewInput = false;
    isError = false;
    updateDisplay();
  }
 
  function inputDigit(digit) {
    if (isError) resetAll();
 
    if (awaitingNewInput) {
      currentInput = digit;
      awaitingNewInput = false;
    } else {
      currentInput = currentInput === '0' ? digit : currentInput + digit;
    }
    updateDisplay();
  }
 
  function inputDecimal() {
    if (isError) resetAll();
 
    if (awaitingNewInput) {
      currentInput = '0.';
      awaitingNewInput = false;
    } else if (!currentInput.includes('.')) {
      currentInput += '.';
    }
    updateDisplay();
  }
 
  function backspace() {
    if (isError) {
      resetAll();
      return;
    }
    if (awaitingNewInput) return; // nothing to delete from a fresh operand
 
    if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
      currentInput = '0';
    } else {
      currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
  }
 
  function compute(a, b, operator) {
    switch (operator) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷':
        if (b === 0) return null; // signal division-by-zero
        return a / b;
      default: return b;
    }
  }
 
  function handleOperator(nextOperator) {
    if (isError) return;
 
    const inputValue = parseFloat(currentInput);
 
    if (previousValue === null) {
      previousValue = inputValue;
    } else if (!awaitingNewInput) {
      const result = compute(previousValue, inputValue, pendingOperator);
      if (result === null) {
        triggerError();
        return;
      }
      previousValue = result;
      currentInput = formatNumber(result);
    }
 
    pendingOperator = nextOperator;
    awaitingNewInput = true;
    updateDisplay();
  }
 
  function handleEquals() {
    if (isError) return;
    if (pendingOperator === null || previousValue === null) return;
 
    const inputValue = parseFloat(currentInput);
    const result = compute(previousValue, inputValue, pendingOperator);
 
    if (result === null) {
      triggerError();
      return;
    }
 
    currentInput = formatNumber(result);
    previousValue = null;
    pendingOperator = null;
    awaitingNewInput = true;
    updateDisplay();
  }
 
  function triggerError() {
    isError = true;
    currentInput = 'Cannot divide by zero';
    previousValue = null;
    pendingOperator = null;
    awaitingNewInput = true;
    updateDisplay();
  }
 
  function handleAction(action, value) {
    switch (action) {
      case 'digit': inputDigit(value); break;
      case 'decimal': inputDecimal(); break;
      case 'operator': handleOperator(value); break;
      case 'equals': handleEquals(); break;
      case 'clear': resetAll(); break;
      case 'backspace': backspace(); break;
    }
  }
 
  document.querySelectorAll('button[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleAction(btn.dataset.action, btn.dataset.value);
    });
  });
 
  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') { inputDigit(e.key); return; }
    if (e.key === '.') { inputDecimal(); return; }
    if (e.key === '+') { handleOperator('+'); return; }
    if (e.key === '-') { handleOperator('−'); return; }
    if (e.key === '*') { handleOperator('×'); return; }
    if (e.key === '/') { e.preventDefault(); handleOperator('÷'); return; }
    if (e.key === 'Enter' || e.key === '=') { handleEquals(); return; }
    if (e.key === 'Backspace') { backspace(); return; }
    if (e.key === 'Escape') { resetAll(); return; }
  });
 
  updateDisplay();
})();