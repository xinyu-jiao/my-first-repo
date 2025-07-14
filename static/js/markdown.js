function loadMarkdown(mdPath, containerId) {
    fetch(mdPath)
        .then(response => response.text())
        .then(text => {
            const html = marked.parse(text);
            const container = document.getElementById(containerId);
            container.innerHTML = html;
            container.querySelectorAll('pre code.language-mermaid, pre code.lang-mermaid, pre code.mermaid').forEach(block => {
                const code = block.textContent.trim();
                const div = document.createElement('div');
                div.className = 'mermaid';
                div.textContent = code;
                block.parentElement.replaceWith(div);
            });
            if (window.mermaid) setTimeout(() => mermaid.init(), 0);
            container.querySelectorAll('table').forEach(tbl => {
                tbl.classList.add('md-table');
            });
        });
}