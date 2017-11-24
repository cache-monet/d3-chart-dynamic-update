var margin = {top: 20, right: 20, bottom: 30, left: 35},
w= 800 - margin.left - margin.right,
h = 300 - margin.top - margin.bottom,
padding = 20,
datasetOG =[{x:400, y:15, tag: 'datapoint2'}, {x:600, y:4, tag: 'datapoint'}, {x:800, y:10, tag: 'datapoint1'},
            {x:1000, y:5, tag: 'datapoint'}, {x:1200, y:5, tag: 'datapoint'}, {x:1400, y:12, tag: 'datapoint'}, 
            {x:1600, y:7, tag: 'datapoint1'}, {x:1800, y:4, tag: 'datapoint1'}, {x:2000, y:6, tag: 'datapoint1'}, {x:2200, y:8, tag: 'datapoint2'}, {x:2400, y:11, tag: 'datapoint1'}, {x:2600, y:4, tag: 'datapoint'}, 
],
dataset = [{x:0, y:10, tag: 'datapoint'}, {x:200, y:2, tag: 'datapoint2'}],
 x = 10;

/*create svg element*/
var mainChart = d3.select('body').select("#container").append('svg')
    .classed('mainChart', true)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', w)
    .attr('height', h);

var nodeGroup = mainChart.append('g').classed('nodeGroup', true);
var labelGroup = mainChart.append('g').classed('labelGroup', true);

/* setting x and y scales*/
var xMax = d3.max(dataset, d => d.x),
    yMax = d3.max(dataset, d => d.y),
    xMin = d3.min(dataset, d => d.x),
    yMin= d3.min(dataset, d => d.y);

var xScale = d3.scaleLinear()
    .domain([xMin, xMax ])
    .range([margin.left, w - padding]);

var yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([h - margin.bottom, margin.bottom]);

var XAxis = d3.axisBottom(xScale);
mainChart.append('g')
    .classed('xaxis', true)
    .attr('transform', `translate(0, ${h - yMax})`)
    .call(XAxis)
    .selectAll("text")
        .style("text-achor", "end").attr("x", "-.8em").attr("y", ".15em")

/*define line*/
var lines = d3.line()
.x(d => xScale(d.x))
.y(d => yScale(d.y));

/*append line*/
var path = mainChart.append('path')
.datum(dataset)
.classed('lineChart', true)
.attr('d', lines)


/* ToolTip (the floating textbox)*/
var tool_tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-30, 0])
    .html(d => {
        return ("Tag: <b>" + d.tag + "</b> <br/>"  +
        "Time: " + d.x + "</br>" +
        "Kakfa-Offset: <b>" + d.y + "</b> <br/>")
    });

  mainChart.call(tool_tip)
function redrawNodes() {
   mainChart.select('.xaxis')
    .call(XAxis)
    .selectAll("text")
        .attr("x", "-.8em").attr("y", ".15em").style("text-achor", "end")
    var Nodes = nodeGroup
//  reposition existing nodes
        .selectAll('.nodes').data(dataset)
            .attr('cx', d => xScale(d.x)).attr('cy', d => yScale(d.y))
            .style('r', 6).style('stroke-width', 2).style('fill', 'orange');
    // add new nodes
    Nodes
        .enter().append('circle')
            .classed('nodes', true)
            .attr('cx', d => xScale(d.x)).attr('cy', d => yScale(d.y))
            .style('r', 6).style('stroke-width', 2).style('fill', 'red')
            .on('click', handleClick)
            .on('mouseover', tool_tip.show)
            .on('mouseout', tool_tip.hide);
}

function redrawLabels() {
    // reposition existing labels
    var labels = labelGroup
        .selectAll('.labels').data(dataset)
            .attr('x', d => xScale(d.x)).attr('y', d => yScale(d.y) + 15)
    // add new labels
    labels
        .enter().append('text')
            .classed("labels", true)
            .attr('x', d => xScale(d.x)).attr('y', d => yScale(d.y) + 15)
            .attr('font-family', "sans-serif").attr('font-size', 10).attr('fill', "white")
            .text(d => d.y);
    
    // redraw lines
    path.attr('d', lines)
}

// var i = 0;    
// function update() {
//     var cur = datasetOG[i];
//     dataset.push(cur);
//     if (cur.x > xMax) xMax = cur.x;            
//     if (cur.y > yMax) yMax = cur.y;            
//     if (cur.x > xMin) xMin = cur.x;            
//     if (cur.y > yMin) xMin= cur.y;            
//     xScale.domain([xMin, xMax ]);
//     yScale.domain([yMin, yMax]);  
//     redrawLabels();    
//     redrawNodes();
//     updateNav();
//     i++;
//     if (i < datasetOG.length) {
//         setTimeout(update, 2000);
//     }
// }

function handleClick() {
        d3.selectAll('circle').style('stroke', 'black')
        d3.select(this).style('stroke', 'white')    
}
// update();