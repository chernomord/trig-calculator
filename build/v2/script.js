const parser = math.parser();

document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calculate();
});

document.getElementById('reset').addEventListener('click', function() {
    parser.clear();
    document.getElementById('history').textContent = '';
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
    var input = document.getElementById('input').value;
    try {
        var result = parser.evaluate(input);
        var history = document.getElementById('history');
        var inputNode = document.createElement("span");
        inputNode.textContent = input + ' = ';
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
}

function notify() {
    var notification = document.getElementById('notification');
    notification.style.display = 'block';
    notification.textContent = 'Copied to clipboard!';
    setTimeout(function(){
        notification.style.display = 'none';
    }, 2000);
}
