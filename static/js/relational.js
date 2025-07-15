function drawRelationalGraph() {
  const width = 1000, height = 600;

  // clear up the previous graph
  d3.select("#d3-relational-container").selectAll("*").remove();

  const svg = d3.select("#d3-relational-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(
      d3.zoom()
        .scaleExtent([0.2, 2])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        })
    );

  const g = svg.append("g");

  // define the arrows
  svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 30)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("xoverflow", "visible")
    .append("path")
    .attr("d", "M 0,-4 L 8,0 L 0,4")
    .attr("fill", "#666")
    .style("stroke", "none");

  // load csvs
  Promise.all([
    d3.csv("./relational_structure/nodes.csv"),
    d3.csv("./relational_structure/edges.csv")
  ]).then(([nodesRaw, linksRaw]) => {
    // preprocess nodes
    const nodes = nodesRaw.map(d => ({
      id: d.id,
      name: d.name,
      role: d.role,
      age: +d.age,
      department: d.department,
      friends: +d.friends,
      size: +d.size,
      color: d.color
    }));

    // preprocess links
    const links = linksRaw.map(d => ({
      source: d.source,
      target: d.target,
      relationship: d.relationship,
      course: d.course || "",
      since: d.since ? +d.since : null,
      strength: +d.strength,
      type: d.type,
      department: d.department || ""
    }));

    // object mapping
    const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));

    // force simulation 
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id)
        .distance(d => {
          switch (d.relationship) {
            case "friends": return 80;
            case "colleagues": return 100;
            case "student-teacher": return 120;
            default: return 100;
          }
        }))
      .force("charge", d3.forceManyBody().strength(d => nodeById[d.id]?.role === "professor" ? -400 : -200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.size + 8));

    // draw links
    const link = g.append("g")
      .attr("stroke", "#888")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke-width", d => d.strength * 5)
      .attr("marker-end", d => d.type === "directed" ? "url(#arrowhead)" : null);

    // draw nodes
    const node = g.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => {
        switch (d.department) {
          case "Computer Science": return "#ff6b6b";
          case "Mathematics": return "#4ecdc4";
          case "Physics": return "#45b7d1";
          default: return d.color || "#3264a8";
        }
      })
      .call(drag(simulation));

    // node lables
    const label = g.append("g")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", 13)
      .attr("pointer-events", "none")
      .attr("fill", "#fff")
      .text(d => d.id);

    // edge labels
    const edgeLabel = g.append("g")
      .selectAll("text")
      .data(links)
      .enter().append("text")
      .attr("font-size", 10)
      .attr("fill", "#666")
      .attr("pointer-events", "none")
      .text(d => d.relationship);

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.8)")
      .style("color", "#fff")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "13px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    node.on("mouseover", function(event, d) {
      // highlight
      link.style("stroke-opacity", l => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.1);
      d3.select(this).attr("stroke", "#222").attr("stroke-width", 4);
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`
        <strong>${d.name}</strong><br/>
        Role: ${d.role}<br/>
        Age: ${d.age}<br/>
        Department: ${d.department}<br/>
        Friends: ${d.friends}
      `)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 10) + "px");
    })
    .on("mouseout", function(event, d) {
      link.style("stroke-opacity", 0.6);
      d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2);
      tooltip.transition().duration(300).style("opacity", 0);
    })
    .on("click", function(event, d) {
      alert(`Name: ${d.name}\nRole: ${d.role}\nDepartment: ${d.department}\nAge: ${d.age}`);
    });

    svg.on("mousedown.zoom", () => tooltip.style("opacity", 0));

    // dragging
    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);

      edgeLabel
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);
    });
  });
}