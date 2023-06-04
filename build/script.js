document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calculate();
});

function calculate() {
    let num = document.getElementById('number').value;

    if(num.includes('/')) {
        let fractionParts = num.split('/');
        num = parseFloat(fractionParts[0]) / parseFloat(fractionParts[1]);
    } else {
        num = parseFloat(num);
    }

    if(isNaN(num)) {
        document.getElementById('result').innerHTML = "Invalid input. Please input a number or a fraction.";
        return;
    }

    let sinVal = Math.sin(num);
    let cosVal = Math.cos(num);
    let tanVal = Math.tan(num);
    let asinVal = Math.asin(num);
    let acosVal = Math.acos(num);
    let atanVal = Math.atan(num);

    document.getElementById('result').innerHTML = `
                <p onclick="copyToClipboard('${sinVal}', this)">Sine: ${sinVal}</p>
                <p onclick="copyToClipboard('${cosVal}', this)">Cosine: ${cosVal}</p>
                <p onclick="copyToClipboard('${tanVal}', this)">Tangent: ${tanVal}</p>
                <p onclick="copyToClipboard('${asinVal}', this)">Arc Sine: ${asinVal}</p>
                <p onclick="copyToClipboard('${acosVal}', this)">Arc Cosine: ${acosVal}</p>
                <p onclick="copyToClipboard('${atanVal}', this)">Arc Tangent: ${atanVal}</p>
            `;
}

// Function to copy text to clipboard, show copied message and animate result block
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(function() {
        let copiedMessage = document.getElementById('copied-message');
        copiedMessage.style.display = 'block';
        setTimeout(function() {
            copiedMessage.style.display = 'none';
        }, 2000);
        // Start the flash animation on the result block
        element.style.animation = 'flash 1s';
        setTimeout(function() {
            element.style.animation = '';
        }, 1000);
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}
