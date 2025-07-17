function initializeToggles() {
    const toggles = document.querySelectorAll('.toggle');
    toggles.forEach(heading => {
        heading.addEventListener('click', () => {
            const targetId = heading.dataset.target;
            const target = document.getElementById(targetId);
            if (!target) return;
            if (targetId === 'a4163-mapbox') {
                setTimeout(() => {
                    if (typeof resizeMapbox === 'function') {
                    resizeMapbox();
                    }
                }, 350);
            }
            const isOpen = target.style.display === 'block';
            target.style.display = isOpen ? 'none' : 'block';
            heading.classList.toggle('expanded', !isOpen);
        });
    });
}

