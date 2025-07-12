function drawSyntheticLineChart() {
    d3.csv("./temporal_structure/synthetic-data.csv").then(data => {
        data.forEach(d => {
            d.Date = d3.timeParse("%m/%d/%Y")(d.Date);
            d.Close = +d.Close;
        });

        const margin = {top: 20, right: 30, bottom: 30, left: 40},
            width = 1500 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        const svg = d3.select("#temporal-container-1")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.Date))
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        const y = d3.scaleLinear()
            .domain(d3.extent(data, d => d.Close))
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#0074D9")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.Date))
                .y(d => y(d.Close))
            );

        const focus = svg.append("g").style("display", "none");
        focus.append("circle").attr("r", 4.5).attr("fill", "#0074D9");
        focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 80)
            .attr("height", 30)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("fill", "white")
            .attr("stroke", "#0074D9");
        focus.append("text").attr("x", 18).attr("y", -2);

        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => focus.style("display", null))
            .on("mouseout", () => focus.style("display", "none"))
            .on("mousemove", function(event) {
                const bisect = d3.bisector(d => d.Date).left;
                const x0 = x.invert(d3.pointer(event, this)[0]);
                const i = bisect(data, x0, 1);
                const d0 = data[i - 1], d1 = data[i] || d0;
                const d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
                focus.attr("transform", `translate(${x(d.Date)},${y(d.Close)})`);
                focus.select("text").text(`${d3.timeFormat("%Y-%m-%d")(d.Date)}: ${d.Close}`);
            });
    });
}

function drawSyntheticHistogram() {
    d3.csv("./temporal_structure/synthetic-data.csv").then(data => {
        const values = data.map(d => +d.Close);
        const margin = {top: 20, right: 30, bottom: 30, left: 40},
            width = 1500 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        const svg = d3.select("#synthetic-histogram")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain(d3.extent(values))
            .nice()
            .range([0, width]);

        const bins = d3.bin().domain(x.domain()).thresholds(30)(values);

        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .nice()
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll("rect")
            .data(bins)
            .enter().append("rect")
            .attr("x", d => x(d.x0))
            .attr("y", d => y(d.length))
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("height", d => height - y(d.length))
            .attr("fill", "#69b3a2");
    });
}

function drawSyntheticExtrema() {
    d3.csv("./temporal_structure/synthetic-data.csv").then(data => {
        data.forEach(d => {
            d.Date = d3.timeParse("%m/%d/%Y")(d.Date);
            d.Close = +d.Close;
        });

        const margin = {top: 20, right: 30, bottom: 30, left: 40},
            width = 1500 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        const svg = d3.select("#synthetic-extrema")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.Date))
            .range([0, width]);
        const y = d3.scaleLinear()
            .domain(d3.extent(data, d => d.Close))
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#888")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.Date))
                .y(d => y(d.Close))
            );

        const max = d3.max(data, d => d.Close);
        const min = d3.min(data, d => d.Close);
        const mean = d3.mean(data, d => d.Close);

        const maxPoint = data.find(d => d.Close === max);
        const minPoint = data.find(d => d.Close === min);

        svg.append("circle")
            .attr("cx", x(maxPoint.Date))
            .attr("cy", y(maxPoint.Close))
            .attr("r", 6)
            .attr("fill", "red");
        svg.append("text")
            .attr("x", x(maxPoint.Date) + 8)
            .attr("y", y(maxPoint.Close) - 8)
            .text(`Max: ${max}`)
            .attr("fill", "red")
            .attr("font-size", 12);

        svg.append("circle")
            .attr("cx", x(minPoint.Date))
            .attr("cy", y(minPoint.Close))
            .attr("r", 6)
            .attr("fill", "blue");
        svg.append("text")
            .attr("x", x(minPoint.Date) + 8)
            .attr("y", y(minPoint.Close) + 16)
            .text(`Min: ${min}`)
            .attr("fill", "blue")
            .attr("font-size", 12);

        svg.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", y(mean))
            .attr("y2", y(mean))
            .attr("stroke", "green")
            .attr("stroke-dasharray", "4 2");
        svg.append("text")
            .attr("x", 10)
            .attr("y", y(mean) - 8)
            .text(`Mean: ${mean.toFixed(2)}`)
            .attr("fill", "green")
            .attr("font-size", 12);
    });
}

function drawEventsTimeline() {
    d3.csv("./temporal_structure/events.csv").then(data => {
        data.forEach(d => {
            d.start = +d.start;
            d.end = +d.end;
        });

        const categories = Array.from(new Set(data.map(d => d.category)));
        const color = d3.scaleOrdinal()
            .domain(categories)
            .range(d3.schemeSet2);

        const margin = {top: 30, right: 30, bottom: 30, left: 120},
            width = 1500 - margin.left - margin.right,
            height = data.length * 22;

        const svg = d3.select("#temporal-container-2")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([d3.min(data, d => d.start), d3.max(data, d => d.end)])
            .range([0, width]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        svg.append("g")
            .call(d3.axisLeft(d3.scaleBand()
                .domain(data.map(d => d.name))
                .range([0, height])
                .padding(0.1))
                .tickSize(0)
            )
            .selectAll("text")
            .attr("font-size", 12);

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("y", (d, i) => i * 22)
            .attr("x", d => x(d.start))
            .attr("width", d => x(d.end) - x(d.start))
            .attr("height", 16)
            .attr("fill", d => color(d.category))
            .append("title")
            .text(d => `${d.name} (${d.start}–${d.end}) [${d.category}]`);

        svg.selectAll("text.label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", d => x(d.start) + 4)
            .attr("y", (d, i) => i * 22 + 12)
            .text(d => d.name)
            .attr("fill", "#222")
            .attr("font-size", 11);

        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - 150}, 0)`);

        categories.forEach((cat, i) => {
            legend.append("rect")
                .attr("x", 0)
                .attr("y", i * 22)
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", color(cat));
            legend.append("text")
                .attr("x", 24)
                .attr("y", i * 22 + 13)
                .text(cat)
                .attr("font-size", 14)
                .attr("fill", "#222");
        });
    });
}

function drawEventDurationHist() {
    d3.csv("./temporal_structure/events.csv").then(data => {
        const durations = data.map(d => +d.end - +d.start);
        const margin = {top: 20, right: 30, bottom: 30, left: 40},
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        const svg = d3.select("#event-duration-hist")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([0, d3.max(durations)])
            .nice()
            .range([0, width]);

        const bins = d3.bin().domain(x.domain()).thresholds(10)(durations);

        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .nice()
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll("rect")
            .data(bins)
            .enter().append("rect")
            .attr("x", d => x(d.x0))
            .attr("y", d => y(d.length))
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("height", d => height - y(d.length))
            .attr("fill", "#ffb347");
    });
}
