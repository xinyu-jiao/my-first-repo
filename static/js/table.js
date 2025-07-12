async function loadJsonToTableWithPagination(jsonPath, tableId) {
    try {
        const res = await fetch(jsonPath);
        if (!res.ok) throw new Error(`Network response was not ok for ${jsonPath}`);
        const data = await res.json();
        window[`_${tableId}_data`] = data;
        renderTableWithPagination(tableId, data, 1);
    } catch (e) {
        console.error(`Failed to load or render table ${tableId}:`, e);
        renderTableWithPagination(tableId, [], 1);
    }
}

function renderTableWithPagination(tableId, data, page = 1, pageSize = 5) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;

    let colCount = 5;
    if (tableId === 'table-authors') colCount = 4;

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${colCount}" style="text-align:center;">(No data)</td></tr>`;
        return;
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageData = data.slice(start, end);

    let html = '';
    if (tableId === 'table-original') {
        html = pageData.map(item => `
      <tr>
        <td>${item.Title || ''}</td>
        <td>${item.Authors || ''}</td>
        <td>${item.Year || ''}</td>
        <td>${item["Source Title"] || ''}</td>
        <td>${item.Audience || ''}</td>
      </tr>`).join('');
    } else if (tableId === 'table-authors') {
        html = pageData.map(item => `
      <tr>
        <td>${item.Title || ''}</td>
        <td>${item.Authors || ''}</td>
        <td>${item.Year || ''}</td>
        <td>${item["Source Title"] || ''}</td>
      </tr>`).join('');
    } else if (tableId === 'table-others') {
        html = pageData.map(item => `
      <tr>
        <td>${item.Title || ''}</td>
        <td>${item.Authors || ''}</td>
        <td>${item.Year || ''}</td>
        <td>${item["Source Title"] || ''}</td>
        <td>${item["Ref Summary"] || ''}</td>
      </tr>`).join('');
    }
    tbody.innerHTML = html;

    const totalPages = Math.ceil(data.length / pageSize);
    if (totalPages > 1) {
        let pager = `<tr class="pager-row"><td colspan="${colCount}" style="text-align:left;">`;
        for (let i = 1; i <= totalPages; i++) {
            pager += `<button class="pager-btn black-btn" data-table="${tableId}" data-page="${i}" style="margin:0 2px;">${i}</button>`;
        }
        pager += `</td></tr>`;
        tbody.innerHTML += pager;
    }
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('pager-btn')) {
        const tableId = e.target.getAttribute('data-table');
        const page = parseInt(e.target.getAttribute('data-page'));
        const data = window[`_${tableId}_data`];
        renderTableWithPagination(tableId, data, page);
    }
});