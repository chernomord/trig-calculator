const parser = math.parser();

document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calculate();
});

document.getElementById('reset').addEventListener('click', function() {
    parser.clear();
});

function calculate() {
    const input = document.getElementById('input').value;
    try {
        const result = parser.evaluate(input);
        document.getElementById('result').textContent = result;
    } catch (e) {
        document.getElementById('result').textContent = "Invalid expression";
    }
}
