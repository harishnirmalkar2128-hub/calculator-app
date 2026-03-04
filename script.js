// Get elements
const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');
const themeToggle = document.getElementById('themeToggle');

// Variables
let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        themeToggle.textContent = '🌙 Dark Mode';
    }
});

// Append number
function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (num === '.' && currentInput.includes('.')) return;
    
    currentInput += num;
    updateDisplay();
}

// Append operator
function appendOperator(op) {
    if (currentInput === '' && previousInput === '') return;
    
    if (currentInput !== '') {
        if (previousInput !== '') {
            calculate();
        }
        previousInput = currentInput;
        currentInput = '';
    }
    
    operator = op;
    updateHistory();
}

// Clear display
function clearDisplay() {
    currentInput = '';
    previousInput = '';
    operator = null;
    updateDisplay();
    historyDisplay.textContent = '';
}

// Delete last character
function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

// Calculate result
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === null) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(curr)) return;
    
    switch (operator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '*':
            result = prev * curr;
            break;
        case '/':
            if (curr === 0) {
                alert('Cannot divide by zero!');
                clearDisplay();
                return;
            }
            result = prev / curr;
            break;
        case '%':
            result = prev % curr;
            break;
        default:
            return;
    }
    
    // Round to avoid floating point issues
    result = Math.round(result * 1000000) / 1000000;
    
    currentInput = result.toString();
    previousInput = '';
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
    historyDisplay.textContent = '';
}

// Update display
function updateDisplay() {
    display.value = currentInput || '0';
}

// Update history
function updateHistory() {
    if (previousInput && operator) {
        let opSymbol = operator;
        switch (operator) {
            case '*': opSymbol = '×'; break;
            case '/': opSymbol = '÷'; break;
        }
        historyDisplay.textContent = `${previousInput} ${opSymbol}`;
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    // Numbers
    if (/[0-9]/.test(key)) {
        appendNumber(key);
    }
    
    // Operators
    if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    }
    
    // Enter / Equals
    if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    }
    
    // Backspace
    if (key === 'Backspace') {
        deleteLast();
    }
    
    // Escape (clear)
    if (key === 'Escape') {
        clearDisplay();
    }
    
    // Decimal point
    if (key === '.') {
        appendNumber('.');
    }
    
    // Percentage
    if (key === '%') {
        appendOperator('%');
    }
});