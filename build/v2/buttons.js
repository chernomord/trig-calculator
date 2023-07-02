import {clear} from './history.js';

let inputElement;
export function setupButtons(inputEl) {
    inputElement = inputEl;

    document.getElementById('buttons').addEventListener('click', function(event) {
        const command = event.target.dataset.func;
        if (buttonsCommandsEnum.hasOwnProperty(command)) {
            buttonsCommandsEnum[command]();
        }
    });
}

const buttonsCommandsEnum ={
    clear() {
        clear();
        inputElement.focus();
    },
    sin()   { insertFunctionAroundSelection(inputElement, 'sin') },
    cos(x) { insertFunctionAroundSelection(inputElement, 'cos') },
    tan(x) { insertFunctionAroundSelection(inputElement, 'tan') },
    asin(x) { insertFunctionAroundSelection(inputElement, 'asin') },
    acos(x) { insertFunctionAroundSelection(inputElement, 'acos') },
    atan(x) { insertFunctionAroundSelection(inputElement, 'atan') },
    sqrt(x) { insertFunctionAroundSelection(inputElement, 'sqrt') },
    log(x) { insertFunctionAroundSelection(inputElement, 'log') },
    ln(x) { insertFunctionAroundSelection(inputElement, 'ln') },
    abs(x) { insertFunctionAroundSelection(inputElement, 'abs') },
    exp(x) { insertFunctionAroundSelection(inputElement, 'exp') },
    sinh(x) { insertFunctionAroundSelection(inputElement, 'sinh') },
    cosh(x) { insertFunctionAroundSelection(inputElement, 'cosh') },
    tanh(x) { insertFunctionAroundSelection(inputElement, 'tanh') },
}


function insertFunctionAroundSelection(inputEl, funcName) {
    const start = inputEl.selectionStart;
    const end = inputEl.selectionEnd;
    const selectedText = inputEl.value.slice(start, end);
    const wrappedText = funcName + '(' + selectedText + ')';
    inputEl.setRangeText(wrappedText, start, end, 'select');
    inputEl.dispatchEvent(new Event('input', { cancelable: true, bubbles: true }))
    inputEl.focus();
}
