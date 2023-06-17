const parser = math.parser();

let currentInput = '';
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
const div = document.querySelector('#highlighted');

// add an event listener to your input field
inputField.addEventListener('scroll', function() {
    // synchronize the scroll position of the div with the input field
    div.scrollLeft = inputField.scrollLeft;
});

const input = document.getElementById('input');
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
    sin()   { insertFunction(input, 'sin') },
    cos(x) { insertFunction(input, 'cos') },
    tan(x) { insertFunction(input, 'tan') },
    asin(x) { insertFunction(input, 'asin') },
    acos(x) { insertFunction(input, 'acos') },
    atan(x) { insertFunction(input, 'atan') },
    sqrt(x) { insertFunction(input, 'sqrt') },
    log(x) { insertFunction(input, 'log') },
    ln(x) { insertFunction(input, 'ln') },
    abs(x) { insertFunction(input, 'abs') },
    exp(x) { insertFunction(input, 'exp') },
    sinh(x) { insertFunction(input, 'sinh') },
    cosh(x) { insertFunction(input, 'cosh') },
    tanh(x) { insertFunction(input, 'tanh') },
}
document.getElementById('buttons').addEventListener('click', function(event) {
    const command = event.target.dataset.func;
    if (buttonsCommandsEnum.hasOwnProperty(command)) {
        buttonsCommandsEnum[command]();
    }
});

function insertFunction(inputEl, funcName) {
    const start = inputEl.selectionStart;
    const end = inputEl.selectionEnd;
    const selectedText = inputEl.value.slice(start, end);
    const wrappedText = funcName + '(' + selectedText + ')';
    inputEl.setRangeText(wrappedText, start, end, 'select');
    updateInput(inputEl.value);
}
