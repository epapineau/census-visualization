// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

// Define dimensions of the chart area
var width = svgWidth - chartMargin.left - chartMargin.right;
var height = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup1 = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
var chartGroup2 = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top * 2})`);

// Load data from hours-of-tv-watched.csv
d3.csv("/assets/data/data.csv", function(error, data) {
    
    // Log an error if one exists
    if (error) return console.warn(error);
    console.log(data)
    // Cast as numbers
    data.forEach(function(d){
        d.poverty = +d.poverty;
        d.age = +d.age;
        d.income = +d.income;
        d.obesity = +d.obesity;
        d.smokes = +d.smokes;
        d.healthcare = +d.healthcare;
    });

    // Scales
    var xScale1 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.poverty)])
        .range([0, width]);
    var xScale2 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.age)])
        .range([0, width]);
    var xScale3 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.income)])
        .range([0, width]);
    var yScale1 =  d3.scaleLinear()
        .domain([0, d3.max(data, d => d.obesity)])
        .range([height, 0]);
    var yScale2 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.smokes)])
        .range([height * 2, 0]);
    var yScale3 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    // Axes
    var bottomAxis1 = d3.axisBottom(xScale1);
    var bottomAxis2 = d3.axisBottom(xScale2);
    var bottomAxis3 = d3.axisBottom(xScale3);
    var leftAxis1 = d3.axisLeft(yScale1);
    var leftAxis2 = d3.axisLeft(yScale2);
    var leftAxis3 = d3.axisLeft(yScale3);
    
    // Add to chart
    chartGroup1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis1);
    chartGroup1.append("g")
        .call(leftAxis3);
    chartGroup2.append("g")
        .attr("transform", `translate(0, ${height * 2})`)
        .call(bottomAxis2);
    chartGroup2.append("g")
        .call(leftAxis2);

    // Circles
    var circlesGroup1 = chartGroup1.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale1(d.poverty))
        .attr("cy", d => yScale3(d.healthcare))
        .attr("r", "10")
        .attr("fill", "#778899")
        .attr("opacity", ".75");
    var circlesGroup2 = chartGroup2.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale2(d.age))
        .attr("cy", d => yScale2(d.smokes))
        .attr("r", "10")
        .attr("fill", "#778899")
        .attr("opacity", ".75");

    // Circle Labels
    var circleLabels1 = chartGroup1.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("dx", d => xScale1(d.poverty) - 10)
        .attr("dy", d => yScale3(d.healthcare) + 10)
	    .text(d => d.abbr);


    
    // Tooltips

    // Axis Labels
    chartGroup1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("In Poverty (%)");
    chartGroup1.append("text")
        .attr("transform", `translate(${width / 2}, ${height + chartMargin.top + 30})`)
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

});