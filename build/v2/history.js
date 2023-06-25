const parser = math.parser();

export function setupHistory(calcForm, inputField, historyDiv, resultDiv) {
    calcForm.addEventListener('submit', event => {
        event.preventDefault();
        calculate(inputField, historyDiv, resultDiv);
    });
}

function calculate(inputField, historyDiv, resultDiv) {
    const inputValue = inputField.value;
    try {
        const result = parser.evaluate(inputValue);
        addHistoryEntry(inputValue, result, historyDiv);
        resultDiv.textContent = result;
        clearInput(inputField);
    } catch (e) {
        resultDiv.textContent = "Invalid expression";
    }
}

function addHistoryEntry(inputValue, result, historyDiv) {
    const inputNode = document.createElement("span");
    inputNode.textContent = inputValue + ' = ';
    inputNode.className = 'input';

    const resultNode = document.createElement("span");
    resultNode.textContent = result;
    resultNode.className = 'result';
    resultNode.addEventListener('click', () => {
        navigator.clipboard.writeText(resultNode.textContent);
        resultNode.className += ' flash';
        setTimeout(() => resultNode.className = 'result', 1000);
        notify();
    });

    historyDiv.appendChild(inputNode);
    historyDiv.appendChild(resultNode);
    historyDiv.appendChild(document.createElement("br"));
    historyDiv.scrollTop = historyDiv.scrollHeight;
}

function clearInput(inputField) {
    inputField.value = '';
}

function notify() {
    const notification = document.getElementById('notification');
    notification.style.display = 'block';
    notification.textContent = 'Copied to clipboard!';
    setTimeout(() => notification.style.display = 'none', 2000);
}
