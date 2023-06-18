const parser = math.parser();

function updateCaretPosition(event) {
    const input = document.getElementById('input');
    const caret = document.getElementById('caret');

    // Calculate caret position
    let direction;
    if (inputField.selectionStart !== inputField.selectionEnd) {
        direction = (inputField.selectionStart < lastCaretPosition) ? 'ltr' : 'rtl';
    } else {
        direction = (inputField.selectionStart >= lastCaretPosition) ? 'ltr' : 'rtl';
    }

    let caretPos = direction === 'rtl' ? inputField.selectionEnd : inputField.selectionStart;
    console.log(direction, inputField.selectionEnd, inputField.selectionStart, lastCaretPosition, event?.type);
    let textBeforeCaret = input.value.substring(0, caretPos);

    // Create a temporary span to measure the width of the text before the caret
    const span = document.createElement('span');
    span.classList.add('input-mirror');

    // Get the computed style of the input
    const style = window.getComputedStyle(input);
    //
    // // Use the font properties of the input for the span
    span.style.font = style.font;
    span.style.letterSpacing = style.letterSpacing;
    const padding = parseFloat(style.padding);

    // Set the text of the span to the text before the caret
    span.textContent = textBeforeCaret;

    // Add the span to the body (it won't be visible because we don't specify a position)
    document.body.appendChild(span);

    // Measure the width of the span
    const textWidth = span.getBoundingClientRect().width;

    // Remove the temporary span
    document.body.removeChild(span);

    // Position the caret, adjusted for the input's scroll position
    caret.style.top = `${input.getBoundingClientRect().top + padding}px`;
    caret.style.left = `${input.getBoundingClientRect().left + textWidth + padding - input.scrollLeft}px`;
    caret.style.height = `${parseFloat(style.fontSize) * 1.3}px`;
}


let inputTokens = [];

const functionTokens = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'log', 'exp', 'abs', 'mod', 'sinh', 'cosh', 'tanh'];

function tokenize(mathExpression) {
    const tokens = [];
    const re = /([A-Za-z_][A-Za-z0-9_]*)|(\d*\.\d+|\d+)|(\S)|(\s+)/g;
    let match;

    while (match = re.exec(mathExpression)) {
        let token = {value: match[0]};
        if (match[1]) {
            if (functionTokens.includes(match[1])) {
                token.type = 'function';
            } else {
                token.type = 'variable';
            }
        } else if (match[2]) {
            token.type = 'number';
        } else if (match[3]) {
            switch (match[3]) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '^':
                    token.type = 'operator';
                    break;
                case '(':
                case ')':
                    token.type = 'parentheses';
                    break;
                default:
                    token.type = 'unknown';
            }
        } else if (match[4]) {
            token.type = 'space';
            token.value = '\u00A0'.repeat(match[4].length);
        }
        tokens.push(token);
    }

    return tokens;
}

function renderTokenized(tokens) {
    const output = document.getElementById('highlighted');
    output.innerHTML = '';
    tokens.forEach(token => {
        const span = document.createElement('span');
        span.textContent = token.value;
        span.classList.add('token');
        span.classList.add(token.type);
        output.appendChild(span);
    });
}

document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calculate();
});

// select your input field and div
const inputField = document.querySelector('#input');
const input = document.getElementById('input');

let caret = document.getElementById('caret');

let lastCaretPosition = 0;

inputField.addEventListener('input', updateLastCaretPosition);
// inputField.addEventListener('click', updateLastCaretPosition);
// inputField.addEventListener('select', updateLastCaretPosition);

function updateLastCaretPosition(e) {
    lastCaretPosition = inputField.selectionStart;
    updateCaretPosition(e);
}


inputField.addEventListener("focus", function() {
    caret.classList.add("focused");
});

inputField.addEventListener("blur", function() {
    caret.classList.remove("focused");
});

const div = document.querySelector('#highlighted');
// add an event listener to your input field

inputField.addEventListener('scroll', function() {
    // synchronize the scroll position of the div with the input field
    div.scrollLeft = inputField.scrollLeft;
});

inputField.addEventListener('keydown', () => setTimeout(updateCaretPosition, 0));
inputField.addEventListener('keyup', updateCaretPosition);
inputField.addEventListener('mousedown', (e) => {
    setTimeout(() => {
        updateLastCaretPosition(e);
        inputField.addEventListener('mousemove', updateCaretPosition);
    }, 0)
});
inputField.addEventListener('mouseup', () => {
    inputField.removeEventListener('mousemove', updateCaretPosition);
});

input.addEventListener('keydown', function(event) {
    if (['(', '[', '{'].includes(event.key) && input.selectionStart !== input.selectionEnd) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const selectedText = input.value.slice(start, end);
        const wrappedText = event.key + selectedText + {
            '(': ')',
            '[': ']',
            '{': '}',
        }[event.key];
        input.setRangeText(wrappedText, start, end, 'select');
        updateInput(input.value);
        event.preventDefault();
    }
});

function updateInput(inputValue = '') {
    inputTokens = tokenize(inputValue);
    renderTokenized(inputTokens);
    updateCaretPosition();
}

input.addEventListener('input', function(e) {
    e.target.value = e.target.value.toLowerCase();
    updateInput(e.target.value);
});

function calculate() {
    var inputValue = document.getElementById('input').value;
    try {
        var result = parser.evaluate(inputValue);
        var history = document.getElementById('history');
        var inputNode = document.createElement("span");
        inputNode.textContent = inputValue + ' = ';
        inputNode.className = 'input';
        var resultNode = document.createElement("span");
        resultNode.textContent = result;
        resultNode.className = 'result';
        resultNode.addEventListener('click', function() {
            navigator.clipboard.writeText(resultNode.textContent);
            resultNode.className += ' flash';
            setTimeout(function(){
                resultNode.className = 'result';
            }, 1000);
            notify();
        });
        history.appendChild(inputNode);
        history.appendChild(resultNode);
        history.appendChild(document.createElement("br"));
        document.getElementById('result').textContent = result;

        document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight;
        document.getElementById('input').value = '';
        updateInput()
    } catch (e) {
        document.getElementById('result').textContent = "Invalid expression";
    }
}

function notify() {
    var notification = document.getElementById('notification');
    notification.style.display = 'block';
    notification.textContent = 'Copied to clipboard!';
    setTimeout(function(){
        notification.style.display = 'none';
    }, 2000);
}

const buttonsCommandsEnum ={
    clear() {
        parser.clear();
        document.getElementById('input').value = '';
        updateInput();
        document.getElementById('history').textContent = '';
    },
    sin()   { insertAroundSelection(input, 'sin') },
    cos(x) { insertAroundSelection(input, 'cos') },
    tan(x) { insertAroundSelection(input, 'tan') },
    asin(x) { insertAroundSelection(input, 'asin') },
    acos(x) { insertAroundSelection(input, 'acos') },
    atan(x) { insertAroundSelection(input, 'atan') },
    sqrt(x) { insertAroundSelection(input, 'sqrt') },
    log(x) { insertAroundSelection(input, 'log') },
    ln(x) { insertAroundSelection(input, 'ln') },
    abs(x) { insertAroundSelection(input, 'abs') },
    exp(x) { insertAroundSelection(input, 'exp') },
    sinh(x) { insertAroundSelection(input, 'sinh') },
    cosh(x) { insertAroundSelection(input, 'cosh') },
    tanh(x) { insertAroundSelection(input, 'tanh') },
}
document.getElementById('buttons').addEventListener('click', function(event) {
    const command = event.target.dataset.func;
    if (buttonsCommandsEnum.hasOwnProperty(command)) {
        buttonsCommandsEnum[command]();
    }
});

function insertAroundSelection(inputEl, funcName) {
    const start = inputEl.selectionStart;
    const end = inputEl.selectionEnd;
    const selectedText = inputEl.value.slice(start, end);
    const wrappedText = funcName + '(' + selectedText + ')';
    inputEl.setRangeText(wrappedText, start, end, 'select');
    updateInput(inputEl.value);
}
