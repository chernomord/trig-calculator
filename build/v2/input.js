import { tokenize, renderTokenized } from './tokenizer.js';

let lastCaretPosition = 0;

export function setupInput(inputField, caret, outputDiv) {
    inputField.addEventListener('input', event => {
        event.target.value = event.target.value.toLowerCase();
        updateInput(inputField, outputDiv, caret);
        setTimeout(updateLastCaretPosition, 0, inputField, event, caret);
    });

    inputField.addEventListener('change', event => {
        setTimeout(updateLastCaretPosition, 0, inputField, event, caret);
    });

    inputField.addEventListener('keydown', function(event) {
        if (['(', '[', '{'].includes(event.key) && inputField.selectionStart !== inputField.selectionEnd) {
            const start = inputField.selectionStart;
            const end = inputField.selectionEnd;
            const selectedText = inputField.value.slice(start, end);
            const wrappedText = event.key + selectedText + {
                '(': ')',
                '[': ']',
                '{': '}',
            }[event.key];
            inputField.setRangeText(wrappedText, start, end, 'select');
            updateInput(inputField, outputDiv, caret);
            event.preventDefault();
        }
    });

    inputField.addEventListener('keydown', event => {
        setTimeout(updateCaretPosition, 0, inputField, caret, event);
        if (!event.shiftKey) {
            setTimeout(updateLastCaretPosition, 0, inputField, event, caret);
        }
    });

    const updateCaretPositionOnMouseMove = (e)=> {
        console.log(e.type, e.buttons);
        updateCaretPosition(inputField, caret);
    }

    inputField.addEventListener('mousedown', event => {
        setTimeout(updateLastCaretPosition, 0, inputField, event, caret);
        inputField.addEventListener('mousemove', updateCaretPositionOnMouseMove);
    });

    document.body.addEventListener('mouseup', () => {
        updateCaretPosition(inputField, caret)
        inputField.removeEventListener('mousemove', updateCaretPositionOnMouseMove);
    });

    inputField.addEventListener('mouseup', () => {
        setTimeout(updateLastCaretPosition, 0, inputField, null, caret);
    });

    inputField.addEventListener('scroll', () => {
        outputDiv.scrollLeft = inputField.scrollLeft;
    });

    inputField.addEventListener("focus", () => caret.classList.add("focused"));
    inputField.addEventListener("blur", () => caret.classList.remove("focused"));

    window.addEventListener('resize', () => {
        window.requestAnimationFrame(() => {
            updateLastCaretPosition(inputField, outputDiv, caret);
        });
    });

    updateLastCaretPosition(inputField, null, caret);
    inputField.dispatchEvent(new Event('focus', { cancelable: true, bubbles: true }))
}

function updateInput(inputField, outputDiv, caret) {
    const tokens = tokenize(inputField.value);
    renderTokenized(tokens, outputDiv);
    updateCaretPosition(inputField, caret);
}

function updateLastCaretPosition(inputField, event, caret) {
    lastCaretPosition = inputField.selectionStart;
    updateCaretPosition(inputField, caret, event);
}

function updateCaretPosition(inputField, caret, event) {
    let direction;
    if (inputField.selectionStart !== inputField.selectionEnd) {
        direction = (inputField.selectionStart < lastCaretPosition) ? 'ltr' : 'rtl';
        caret.classList.remove('focused');
    } else {
        direction = (inputField.selectionStart >= lastCaretPosition) ? 'ltr' : 'rtl';
        caret.classList.add('focused');
    }
    let caretPos = direction === 'rtl' ? inputField.selectionEnd : inputField.selectionStart;
    let textBeforeCaret = inputField.value.substring(0, caretPos);

    // Create a temporary span to measure the width of the text before the caret
    const span = document.createElement('span');
    span.classList.add('input-mirror');

    // Get the computed style of the input
    const style = window.getComputedStyle(inputField);

    // Use the font properties of the input for the span
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
    caret.style.top = `${inputField.getBoundingClientRect().top + padding}px`;
    caret.style.left = `${inputField.getBoundingClientRect().left + textWidth + padding - inputField.scrollLeft}px`;
    caret.style.height = `${parseFloat(style.fontSize) * 1.3}px`;
}
