function loadMarkdown(mdPath, containerId) {
    fetch(mdPath)
        .then(response => response.text())
        .then(text => {
            const html = marked.parse(text);
            document.getElementById(containerId).innerHTML = html;
            document.getElementById(containerId).querySelectorAll('table').forEach(tbl => {
                tbl.classList.add('md-table');
            });
        });
}