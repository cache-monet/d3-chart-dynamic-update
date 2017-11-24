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
		console.log(xMax)
		
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

/* Define and Append Line */
var navLine = d3.line()
	.x(d => navXScale(d.x))
	.y(d => navYScale(d.y));
	
var navPath = navGraph.append('path')
	.classed('lineChart', true)
	.attr('d', navLine(dataset));

/* Define and Shade Graph */
var navData = d3.area()
	.x(d => navXScale(d.x))
	.y0(navHeight)
	.y1(d => navYScale(d.y));

var navArea = navGraph.append('path')
	.classed('data', true)
	.attr('d', navData(dataset));

/* View Port */

/* set up brush tool */
var navViewPort = d3.brushX()
    .extent([[0, 0], [navWidth, navHeight]])
    .on("start brush end", brushed);

function brushed() {
    var selection = d3.event.selection;
    xScale.domain(selection.map(navXScale.invert, navXScale));
    mainChart.select(".xaxis").call(XAxis).call(XAxis) // rescale X-axis
        .selectAll("text")
        .style("text-achor", "end")
        .attr("x", "-.8em")
        .attr("y", ".15em");
    mainChart.selectAll(".points").attr("cx", d => xScale(d.x)); // replot points
    mainChart.selectAll(".labels").attr("x", d => xScale(d.x)); // replot label
    mainChart.select('.lineChart').attr('d', lines);  
}

/* append viewport to navGraph */
navGraph.append("g")
.attr("class", "nav-viewPort")
.call(navViewPort)
.call(navViewPort.move, xScale.range());
