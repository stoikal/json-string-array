var input = document.getElementById('input');
var output = document.getElementById('output');

document.getElementById('fileInput').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
        input.value = reader.result;
        process();
    };
    reader.readAsText(file);
});

function process() {
    var raw = input.value.trim();
    if (!raw) { output.value = ''; renderKeyValue([]); return; }
    try {
        var arr = JSON.parse(raw);
        if (!Array.isArray(arr)) throw new Error('Input must be a JSON array');
        output.value = arr.join(';');
        renderKeyValue(arr);
    } catch (e) {
        output.value = 'Error: ' + e.message;
        renderKeyValue([]);
    }
}

function getSeparator() {
    var sep = document.getElementById('separatorInput').value;
    return sep === '' ? '=' : sep;
}

function renderKeyValue(arr) {
    var container = document.getElementById('keyValueContainer');
    if (!arr.length) { container.innerHTML = ''; return; }
    var sep = getSeparator();
    var rows = arr.map(function (item) {
        var idx = String(item).indexOf(sep);
        var key = idx === -1 ? item : item.slice(0, idx);
        var val = idx === -1 ? '' : item.slice(idx + sep.length);
        return '<tr><td>' + escapeHtml(key) + ' <button class="copy-btn" data-copy="' + escapeAttr(key) + '">copy</button></td>'
            + '<td>' + escapeHtml(val) + ' <button class="copy-btn" data-copy="' + escapeAttr(val) + '">copy</button></td></tr>';
    }).join('');
    container.innerHTML = '<table><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody>' + rows + '</tbody></table>';
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

function escapeAttr(s) {
    return String(s).replace(/"/g, '&quot;');
}

document.getElementById('processBtn').addEventListener('click', process);

document.getElementById('separatorInput').addEventListener('input', function () {
    if (input.value.trim()) process();
});

document.getElementById('keyValueContainer').addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;
    navigator.clipboard.writeText(btn.getAttribute('data-copy')).catch(function () {});
});

document.getElementById('copyBtn').addEventListener('click', function () {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).catch(function () {
        output.select();
        document.execCommand('copy');
    });
});
