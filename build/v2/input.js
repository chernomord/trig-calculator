import { tokenize, renderTokenized } from './tokenizer.js';
import { updateCaretPosition, setupCaret } from './caret.js';

export function setupInput(inputField, caret, highlighted) {
    let lastCaretPosition = 0;

    inputField.addEventListener("keyup", event => {
        const tokens = tokenize(inputField.value);
        renderTokenized(tokens, highlighted);
        updateCaretPosition(inputField, lastCaretPosition, caret, event);
        lastCaretPosition = inputField.selectionStart;
    });

    setupCaret(inputField, caret);
}
