const functionTokens = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'log', 'exp', 'abs', 'mod', 'sinh', 'cosh', 'tanh'];

export function tokenize(mathExpression) {
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

export function renderTokenized(tokens, highlighted) {
    highlighted.innerHTML = '';
    tokens.forEach(token => {
        const span = document.createElement('span');
        span.textContent = token.value;
        span.classList.add('token');
        span.classList.add(token.type);
        highlighted.appendChild(span);
    });
}
