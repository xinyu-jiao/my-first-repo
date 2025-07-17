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
    if (document.getElementById('relational-diagrams-md')) {
        loadMarkdown('./precedent_studies/relational_diagrams/relational_diagrams.md', 'relational-diagrams-md');
    }
    if (document.getElementById('methodology-implementation-md')) {
        loadMarkdown('./precedent_studies/methodology_implementation/methodology_implementation.md', 'methodology-implementation-md');
    }
    if (document.getElementById('critical-rhetorical-analysis-md')) {
        loadMarkdown('./precedent_studies/critical_rhetorical_analysis/critical_rhetorical_analysis.md', 'critical-rhetorical-analysis-md');
    }
    if (document.getElementById('position-in-authors-practice-md')) {
        loadMarkdown('./precedent_studies/position_in_authors_practice/position_in_authors_practice.md', 'position-in-authors-practice-md');
    }
    if (document.getElementById('personal-assessment-md')) {
        loadMarkdown('./precedent_studies/personal_assessment/personal_assessment.md', 'personal-assessment-md');
    }
    if (document.getElementById('d3-relational-container')) {
        drawRelationalGraph();
    }
    if (document.getElementById('mapbox-spatial-container')) {
        loadMapbox();
    }
});