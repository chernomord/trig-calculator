const parser = math.parser();

document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calculate();
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
        event.preventDefault();
    }
});

input.addEventListener('input', function(e) {
    e.target.value = e.target.value.toLowerCase();
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
    } catch (e) {
        document.getElementById('result').textContent = "Invalid expression";
    }
    document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight;
    document.getElementById('input').value = '';
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
}
