function initializeToggles() {
    const toggles = document.querySelectorAll('.toggle');
    toggles.forEach(heading => {
        heading.addEventListener('click', () => {
            const targetId = heading.dataset.target;
            const target = document.getElementById(targetId);
            if (!target) return;
            const isOpen = target.style.display === 'block';
            target.style.display = isOpen ? 'none' : 'block';
            heading.classList.toggle('expanded', !isOpen);
        });
    });
}

