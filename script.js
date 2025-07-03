/* =========================================================
   Collapsible headings
   ---------------------------------------------------------
   1. Select every element with the class .toggle
   2. On click, find the target container (data-target="...")
   3. Switch display between none and block
   4. Add / remove the .expanded class so the arrow rotates
========================================================= */

/* 1. Get all toggle headings */
const toggles = document.querySelectorAll('.toggle');

/* 2. Attach listener to each heading */
toggles.forEach(heading => {
  heading.addEventListener('click', () => {
    /* 3. Find the collapsible element by ID */
    const targetId = heading.dataset.target;
    const target = document.getElementById(targetId);
    if (!target) return;               // safety guard

    /* 4. Toggle visibility */
    const isOpen = target.style.display === 'block';
    target.style.display = isOpen ? 'none' : 'block';

    /* 5. Update arrow direction via .expanded class */
    heading.classList.toggle('expanded', !isOpen);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('clickMeBtn');
  const msg = document.getElementById('clickMsg');
  if (btn) {
    btn.addEventListener('click', function() {
      msg.textContent = 'you clicked the button!';
    });
  }
  loadJsonToTableWithPagination('./precedent_studies/bib_original/bib_original.json', 'table-original');
  loadJsonToTableWithPagination('./precedent_studies/bib_authors/bib_authors.json', 'table-authors');
  loadJsonToTableWithPagination('./precedent_studies/bib_others/bib_others.json', 'table-others');
});

function renderTable(tableId, data) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">(No data)</td></tr>`;
    return;
  }
  if (tableId === 'table-original') {
    tbody.innerHTML = data.map(item => `
      <tr>
        <td>${item.Title || ''}</td>
        <td>${item.Authors || ''}</td>
        <td>${item.Year || ''}</td>
        <td>${item["Source Title"] || ''}</td>
        <td>${item.Audience || ''}</td>
      </tr>
    `).join('');
  } else if (tableId === 'table-authors') {
    tbody.innerHTML = data.map(item => `
      <tr>
        <td>${item.Title || ''}</td>
        <td>${item.Authors || ''}</td>
        <td>${item.Year || ''}</td>
        <td>${item["Source Title"] || ''}</td>
      </tr>
    `).join('');
  } else if (tableId === 'table-others') {
    tbody.innerHTML = data.map(item => `
      <tr>
        <td>${item.Title || ''}</td>
        <td>${item.Authors || ''}</td>
        <td>${item.Year || ''}</td>
        <td>${item["Source Title"] || ''}</td>
        <td>${item["Ref Summary"] || ''}</td>
      </tr>
    `).join('');
  }
}

async function loadJsonToTable(jsonPath, tableId) {
  try {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    renderTable(tableId, data);
  } catch (e) {
    renderTable(tableId, []);
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
      </tr>
    `).join('');
  } else if (tableId === 'table-authors') {
    html = pageData.map(item => `
      <tr>
        <td>${item.Title || ''}</td>
        <td>${item.Authors || ''}</td>
        <td>${item.Year || ''}</td>
        <td>${item["Source Title"] || ''}</td>
      </tr>
    `).join('');
  } else if (tableId === 'table-others') {
    html = pageData.map(item => `
      <tr>
        <td>${item.Title || ''}</td>
        <td>${item.Authors || ''}</td>
        <td>${item.Year || ''}</td>
        <td>${item["Source Title"] || ''}</td>
        <td>${item["Ref Summary"] || ''}</td>
      </tr>
    `).join('');
  }
  tbody.innerHTML = html;

  const totalPages = Math.ceil(data.length / pageSize);
  let pager = '';
  if (totalPages > 1) {
    pager += `<tr class="pager-row"><td colspan="${colCount}" style="text-align:left;">`;
    for (let i = 1; i <= totalPages; i++) {
        pager += `<button class="pager-btn black-btn" data-table="${tableId}" data-page="${i}" style="margin:0 2px;">${i}</button>`;
    }
    pager += `</td></tr>`;
    tbody.innerHTML += pager;
  }
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('pager-btn')) {
    const tableId = e.target.getAttribute('data-table');
    const page = parseInt(e.target.getAttribute('data-page'));
    const data = window[`_${tableId}_data`];
    renderTableWithPagination(tableId, data, page);
  }
});

async function loadJsonToTableWithPagination(jsonPath, tableId) {
  try {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    window[`_${tableId}_data`] = data;
    renderTableWithPagination(tableId, data, 1);
  } catch (e) {
    renderTableWithPagination(tableId, [], 1);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadJsonToTableWithPagination('./precedent_studies/bib_original/bib_original.json', 'table-original');
  loadJsonToTableWithPagination('./precedent_studies/bib_authors/bib_authors.json', 'table-authors');
  loadJsonToTableWithPagination('./precedent_studies/bib_others/bib_others.json', 'table-others');
});