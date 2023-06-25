export function updateCaretPosition(inputField, lastCaretPosition, caret) {
    let direction;
    if (inputField.selectionStart !== inputField.selectionEnd) {
        direction = (inputField.selectionStart < lastCaretPosition) ? 'ltr' : 'rtl';
    } else {
        direction = (inputField.selectionStart >= lastCaretPosition) ? 'ltr' : 'rtl';
    }
    let caretPos = direction === 'rtl' ? inputField.selectionEnd : inputField.selectionStart;
    let textBeforeCaret = inputField.value.substring(0, caretPos);

    const span = document.createElement('span');
    span.classList.add('input-mirror');
    const style = window.getComputedStyle(inputField);
    span.style.font = style.font;
    span.style.letterSpacing = style.letterSpacing;
    const padding = parseFloat(style.padding);

    span.textContent = textBeforeCaret;
    document.body.appendChild(span);
    const textWidth = span.getBoundingClientRect().width;
    document.body.removeChild(span);

    caret.style.top = `${inputField.getBoundingClientRect().top + padding}px`;
    caret.style.left = `${inputField.getBoundingClientRect().left + textWidth + padding - inputField.scrollLeft}px`;
    caret.style.height = `${parseFloat(style.fontSize) * 1.3}px`;
}

export function setupCaret(inputField, caret) {
    inputField.addEventListener("focus", () => caret.classList.add("focused"));
    inputField.addEventListener("blur", () => caret.classList.remove("focused"));
}
