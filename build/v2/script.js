document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calculate();
});

function calculate() {
    const input = document.getElementById('input').value;
    try {
        const result = math.evaluate(input);
        document.getElementById('result').textContent = result;
    } catch (e) {
        document.getElementById('result').textContent = "Invalid expression";
    }
}
