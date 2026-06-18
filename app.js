var input = document.getElementById('input');
var output = document.getElementById('output');

document.getElementById('processBtn').addEventListener('click', function () {
    var raw = input.value.trim();
    if (!raw) { output.value = ''; return; }
    try {
        var arr = JSON.parse(raw);
        if (!Array.isArray(arr)) throw new Error('Input must be a JSON array');
        output.value = arr.join(';');
    } catch (e) {
        output.value = 'Error: ' + e.message;
    }
});

document.getElementById('copyBtn').addEventListener('click', function () {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).catch(function () {
        output.select();
        document.execCommand('copy');
    });
});
