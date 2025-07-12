document.addEventListener('DOMContentLoaded', function () {
    initializeToggles();
    loadJsonToTableWithPagination('./precedent_studies/bib_original/bib_original.json', 'table-original');
    loadJsonToTableWithPagination('./precedent_studies/bib_authors/bib_authors.json', 'table-authors');
    loadJsonToTableWithPagination('./precedent_studies/bib_others/bib_others.json', 'table-others');
    initializeSketches();
    if (document.getElementById('temporal-container-1')) drawSyntheticLineChart();
    if (document.getElementById('temporal-container-2')) drawEventsTimeline();
    if (document.getElementById('synthetic-histogram')) drawSyntheticHistogram();
    if (document.getElementById('synthetic-extrema')) drawSyntheticExtrema();
    if (document.getElementById('event-duration-hist')) drawEventDurationHist();
    if (document.getElementById('ontological-md')) {
        loadMarkdown('./precedent_studies/3_layer/ontological/ontological_analysis.md', 'ontological-md');
    }
    if (document.getElementById('historical-md')) {
        loadMarkdown('./precedent_studies/3_layer/historical_contextual/historical_contextual_analysis.md', 'historical-md');
    }
    if (document.getElementById('visual-md')) {
        loadMarkdown('./precedent_studies/3_layer/visual_aesthetic/visual_aesthetic_analysis.md', 'visual-md');
    }
});