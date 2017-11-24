/* Nav Graph */

var navWidth = w - margin.left - margin.right,
	navHeight = 80 - margin.top - margin.bottom;

/* Setting up navGraph */
var navGraph = d3.select('body').select("#container").classed('#container', true).append('svg')
	.classed('navigator', true)
	.attr('width', navWidth + margin.left + margin.right)
	.attr('height', navHeight + margin.top + margin.bottom)
	.attr('x', 0)
	.attr('y', h)
    .append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

/* Nav Scale Factor */
var navXScale = d3.scaleLinear()
		.domain([xMin, xMax])
		.range([0, navWidth]),
	navYScale = d3.scaleLinear()
		.domain([yMin,yMax])
		.range([navHeight, 0]);

/* X-Axis */
var navXAxis = d3.axisBottom(navXScale);

navGraph.append('g')
	.classed('xaxis', true)
	.attr('transform', 'translate(0,' + navHeight + ')')
	.call(navXAxis)
	.selectAll("text")
		.style("text-achor", "end")
		.attr("x", "-.8em")
        .attr("y", ".15em")

/* Define  Graph Area */
var navData = d3.area()
	.x(d => navXScale(d.x))
	.y0(navHeight)
	.y1(d => navYScale(d.y));

var navArea = navGraph.append('path')
	.datum(dataset)
	.classed('nav-graph', true)
	// .attr('d', navData);

/* View Port */

/* set up brush tool */
var navViewPort = d3.brushX()
    .extent([[0, 0], [navWidth, navHeight]])
    .on("start brush end", brushed);

function brushed() {
	if (!d3.event.sourceEvent) return;
	let selection = d3.event.selection;
	//  show full graph if nothing is selected; else show selected region
	selection === null ? xScale.domain([xMin, xMax]) : xScale.domain(selection.map(navXScale.invert, navXScale));
	
	mainChart.select(".xaxis").call(XAxis).call(XAxis) // rescale X-axis
        .selectAll("text")
        .style("text-achor", "end")
        .attr("x", "-.8em")
        .attr("y", ".15em");
    mainChart.selectAll(".nodes").attr("cx", d => xScale(d.x)); // replot points
    mainChart.selectAll(".labels").attr("x", d => xScale(d.x)); // replot label
    mainChart.select('.lineChart').attr('d', lines);  // update lines
}
// append viewport to navGraph
navGraph.append("g")
.attr("class", "nav-viewPort")
.call(navViewPort)


/* Update Navigator */

function updateNav() {
	// update xAxis
	navGraph.select('.xaxis')
	// .attr('transform', 'translate(0,' + navHeight + ')')
		.call(navXAxis)
			.selectAll("text")
				.style("text-achor", "end")
				.attr("x", "-.8em")
				.attr("y", ".15em")
	// update navGraph
	navArea.attr('d', navData);
}

function rescale() {
	xScale.domain([xMin, xMax]); 
	yScale.domain([yMin, yMax]);  
	navXScale .domain([xMin, xMax]);
	navYScale .domain([yMin, yMax]);
}

function updateGraph() {
	updateNodes();	// updates existing / draws new nodes
	updateLabels();    // updates existing / draws new labels and lines
	updateLines();    // updates existing / draws axis and lines
	updateNav(); 	// redraw the navigator
}

// Update function over time
var i = 0;
function update() {
	var cur = datasetOG[i];
    dataset.push(cur); // new element is pushed onto dataset
    if (cur.x > xMax) xMax = cur.x;             
    if (cur.y > yMax) yMax = cur.y;            
    if (cur.x > xMin) xMin = cur.x;            
    if (cur.y > yMin) xMin= cur.y;            
	rescale();
	updateGraph();
    i++; // this is function specific; probably irrelevant to future 
    if (i < datasetOG.length) {
        setTimeout(update, 2000); // recursion
	}
}

document.getElementById("start").addEventListener("click", update); // start update on click

