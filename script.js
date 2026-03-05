// ==================== ULTIMATE CALCULATOR 3000 ====================
// Features: Scientific, Memory, Converter, History, Sound, Voice, etc.

// ========== GLOBAL VARIABLES ==========
let display = document.getElementById('display');
let historyDisplay = document.getElementById('history');
let expressionDisplay = document.getElementById('expression');
let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;
let memory = 0;
let history = [];
let isScientificMode = false;
let isSoundOn = true;
let soundEnabled = true;

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') 
        ? '☀️ Light Mode' : '🌙 Dark Mode';
    playSound();
});

// ========== SOUND EFFECTS ==========
function playSound() {
    if (!soundEnabled) return;
    // Simple beep sound using Web Audio API
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.1;
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    alert(`Sound ${soundEnabled ? 'ON' : 'OFF'}`);
}

// ========== SCIENTIFIC MODE ==========
function toggleScientific() {
    const panel = document.getElementById('scientificPanel');
    const modeText = document.getElementById('currentMode');
    isScientificMode = !isScientificMode;
    panel.style.display = isScientificMode ? 'grid' : 'none';
    modeText.textContent = isScientificMode ? 'Scientific' : 'Standard';
    playSound();
}

// ========== MEMORY FUNCTIONS ==========
function memoryAdd() {
    if (display.value) {
        memory += parseFloat(display.value);
        updateMemoryIndicator();
        playSound();
    }
}

function memorySubtract() {
    if (display.value) {
        memory -= parseFloat(display.value);
        updateMemoryIndicator();
        playSound();
    }
}

function memoryRecall() {
    currentInput = memory.toString();
    updateDisplay();
    playSound();
}

function memoryClear() {
    memory = 0;
    updateMemoryIndicator();
    playSound();
}

function updateMemoryIndicator() {
    document.getElementById('memoryIndicator').textContent = `Memory: ${memory}`;
}

// ========== SCIENTIFIC FUNCTIONS ==========
function appendFunction(func) {
    currentInput += func;
    updateDisplay();
    playSound();
}

function appendConstant(constant) {
    const values = { 'π': Math.PI, 'e': Math.E };
    currentInput += values[constant];
    updateDisplay();
    playSound();
}

function reciprocal() {
    if (currentInput) {
        currentInput = (1 / parseFloat(currentInput)).toString();
        updateDisplay();
        playSound();
    }
}

function square() {
    if (currentInput) {
        currentInput = (parseFloat(currentInput) ** 2).toString();
        updateDisplay();
        playSound();
    }
}

function cube() {
    if (currentInput) {
        currentInput = (parseFloat(currentInput) ** 3).toString();
        updateDisplay();
        playSound();
    }
}

function tenPower() {
    if (currentInput) {
        currentInput = (10 ** parseFloat(currentInput)).toString();
        updateDisplay();
        playSound();
    }
}

function expFunction() {
    if (currentInput) {
        currentInput = Math.exp(parseFloat(currentInput)).toString();
        updateDisplay();
        playSound();
    }
}

function randomNumber() {
    currentInput = Math.random().toString();
    updateDisplay();
    playSound();
}

// ========== BASIC FUNCTIONS ==========
function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    if (num === '.' && currentInput.includes('.')) return;
    currentInput += num;
    updateDisplay();
    playSound();
}

function appendOperator(op) {
    if (currentInput === '' && previousInput === '') return;
    if (currentInput !== '') {
        if (previousInput !== '') calculate();
        previousInput = currentInput;
        currentInput = '';
    }
    operator = op;
    updateHistory();
    playSound();
}

function clearAll() {
    currentInput = '';
    previousInput = '';
    operator = null;
    updateDisplay();
    historyDisplay.textContent = '';
    expressionDisplay.textContent = '';
    playSound();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
    playSound();
}

function toggleSign() {
    if (currentInput && currentInput !== '0') {
        currentInput = currentInput.startsWith('-') 
            ? currentInput.slice(1) 
            : '-' + currentInput;
        updateDisplay();
        playSound();
    }
}

// ========== CALCULATE ==========
function calculate() {
    if (!previousInput || !currentInput || !operator) return;

    let result;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);

    try {
        switch (operator) {
            case '+': result = prev + curr; break;
            case '-': result = prev - curr; break;
            case '*': result = prev * curr; break;
            case '/': 
                if (curr === 0) throw new Error('Division by zero');
                result = prev / curr; 
                break;
            case '%': result = prev % curr; break;
            case '^': result = Math.pow(prev, curr); break;
            default: return;
        }

        // Add to history
        const historyItem = `${prev} ${operator} ${curr} = ${result}`;
        history.unshift(historyItem);
        if (history.length > 10) history.pop();
        updateHistoryList();

        // Round to avoid floating point issues
        result = Math.round(result * 1000000) / 1000000;
        
        currentInput = result.toString();
        previousInput = '';
        operator = null;
        shouldResetDisplay = true;
        updateDisplay();
        historyDisplay.textContent = historyItem;
        playSound();

    } catch (error) {
        alert(error.message);
        clearAll();
    }
}

// ========== HISTORY FUNCTIONS ==========
function updateHistoryList() {
    const list = document.getElementById('historyList');
    list.innerHTML = history.map(item => `<li>${item}</li>`).join('');
}

function clearHistory() {
    history = [];
    updateHistoryList();
    playSound();
}

// ========== COPY/PASTE ==========
function copyResult() {
    navigator.clipboard.writeText(display.value);
    alert('Copied to clipboard!');
    playSound();
}

function pasteValue() {
    navigator.clipboard.readText().then(text => {
        if (!isNaN(text) || text === '.' || text === '-') {
            currentInput = text;
            updateDisplay();
        }
    });
    playSound();
}

// ========== ROUNDING FUNCTIONS ==========
function roundResult() {
    if (currentInput) {
        currentInput = Math.round(parseFloat(currentInput)).toString();
        updateDisplay();
        playSound();
    }
}

function floorResult() {
    if (currentInput) {
        currentInput = Math.floor(parseFloat(currentInput)).toString();
        updateDisplay();
        playSound();
    }
}

function ceilResult() {
    if (currentInput) {
        currentInput = Math.ceil(parseFloat(currentInput)).toString();
        updateDisplay();
        playSound();
    }
}

// ========== UNIT CONVERTER ==========
let converterData = {
    length: {
        units: ['Meter', 'Kilometer', 'Centimeter', 'Millimeter', 'Mile', 'Yard', 'Foot', 'Inch'],
        rates: [1, 0.001, 100, 1000, 0.000621371, 1.09361, 3.28084, 39.3701]
    },
    weight: {
        units: ['Kilogram', 'Gram', 'Milligram', 'Pound', 'Ounce'],
        rates: [1, 1000, 1e6, 2.20462, 35.274]
    },
    temperature: {
        units: ['Celsius', 'Fahrenheit', 'Kelvin'],
        convert: (val, from, to) => {
            if (from === to) return val;
            if (from === 'Celsius') {
                if (to === 'Fahrenheit') return val * 9/5 + 32;
                if (to === 'Kelvin') return val + 273.15;
            }
            if (from === 'Fahrenheit') {
                if (to === 'Celsius') return (val - 32) * 5/9;
                if (to === 'Kelvin') return (val - 32) * 5/9 + 273.15;
            }
            if (from === 'Kelvin') {
                if (to === 'Celsius') return val - 273.15;
                if (to === 'Fahrenheit') return (val - 273.15) * 9/5 + 32;
            }
        }
    }
};

function toggleConverter() {
    const panel = document.getElementById('converterPanel');
    panel.style.display = panel.style.display === 'none' ? 'grid' : 'none';
    if (panel.style.display === 'grid') updateConverterUnits();
    playSound();
}

function updateConverterUnits() {
    const type = document.getElementById('converterType').value;
    const fromSelect = document.getElementById('converterFrom');
    const toSelect = document.getElementById('converterTo');
    
    if (type === 'temperature') {
        fromSelect.innerHTML = '<option>Celsius</option><option>Fahrenheit</option><option>Kelvin</option>';
        toSelect.innerHTML = '<option>Celsius</option><option>Fahrenheit</option><option>Kelvin</option>';
    } else {
        const data = converterData[type];
        fromSelect.innerHTML = data.units.map(u => `<option>${u}</option>`).join('');
        toSelect.innerHTML = data.units.map(u => `<option>${u}</option>`).join('');
    }
}

function convert() {
    const type = document.getElementById('converterType').value;
    const value = parseFloat(document.getElementById('converterInput').value);
    const from = document.getElementById('converterFrom').value;
    const to = document.getElementById('converterTo').value;
    let result;

    if (type === 'temperature') {
        result = converterData.temperature.convert(value, from, to);
    } else {
        const data = converterData[type];
        const fromIndex = data.units.indexOf(from);
        const toIndex = data.units.indexOf(to);
        result = value * (data.rates[toIndex] / data.rates[fromIndex]);
    }

    document.getElementById('converterResult').textContent = 
        `${value} ${from} = ${result.toFixed(4)} ${to}`;
    playSound();
}

// ========== VOICE INPUT ==========
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Voice input not supported in this browser. Use Chrome!');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;
        processVoiceCommand(text);
    };
    recognition.start();
}

function processVoiceCommand(text) {
    text = text.toLowerCase();
    if (text.includes('plus') || text.includes('add')) {
        const nums = text.match(/\d+/g);
        if (nums && nums.length >= 2) {
            currentInput = (parseInt(nums[0]) + parseInt(nums[1])).toString();
            updateDisplay();
        }
    }
    playSound();
}

// ========== UPDATE DISPLAY ==========
function updateDisplay() {
    display.value = currentInput || '0';
}

function updateHistory() {
    if (previousInput && operator) {
        expressionDisplay.textContent = `${previousInput} ${operator}`;
    }
}

// ========== KEYBOARD SUPPORT ==========
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (/[0-9]/.test(key)) appendNumber(key);
    if (key === '+') appendOperator('+');
    if (key === '-') appendOperator('-');
    if (key === '*') appendOperator('*');
    if (key === '/') appendOperator('/');
    if (key === '%') appendOperator('%');
    if (key === '^') appendOperator('^');
    if (key === '(') appendOperator('(');
    if (key === ')') appendOperator(')');
    if (key === 'Enter' || key === '=') { e.preventDefault(); calculate(); }
    if (key === 'Backspace') deleteLast();
    if (key === 'Escape') clearAll();
    if (key === '.') appendNumber('.');
    if (key === 'm') memoryAdd();
    if (key === 'r' && e.ctrlKey) memoryRecall();
    if (key === 'c' && e.ctrlKey) copyResult();
    if (key === 'v' && e.ctrlKey) pasteValue();
});

// Initialize
document.getElementById('currentMode').textContent = 'Standard';
document.getElementById('converterType').addEventListener('change', updateConverterUnits);
updateMemoryIndicator();
console.log('ULTIMATE CALCULATOR 3000 loaded! 🚀');
