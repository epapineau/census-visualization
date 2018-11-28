// Define SVG area dimensions
var svgWidth = 660;
var svgHeight = 460;

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
var chartGroup = svg1.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create linear scale
    var xLinearScale = d3.scaleLinear()
      .domain([
          d3.min(data, d => d[chosenXAxis]) * 0.8,
          d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderBottomAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create linear scale
    var yLinearScale = d3.scaleLinear()
      .domain([
          d3.min(data, d => d[chosenYAxis]) * 0.8,
          d3.max(data, d => d[chosenYAxis]) * 1.2
      ])
      .range([0, width]);
  
    return yLinearScale;
}

// function used for updating yAxis var upon click on axis label
function renderLeftAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    // X axis variable labels
    if (chosenXAxis === "poverty") {
      var xLabel = "Poverty:";
      var xUnit = "%";
    }
    else if (chosenXAxis === "age"){
      var xLabel = "Median Age:";
      var xUnit = "";
    }
    else {
        var xLabel = "Median Income:";
        var xUnit = ""; 
    }

    // Y axis variable labels
    if (chosenYAxis === "obesity") {
      var yLabel = "Obese:";
      var yUnit = "%";
    }
    else if (chosenYAxis === "smokes"){
      var yLabel = "Smokes:";
      var yUnit = "%";
    }
    else {
        var yLabel = "Lacks Healthcare:";
        var yUnit = "%"; 
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}${xUnit}<br>${yLabel} ${d[chosenYAxis]}${yUnit}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

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
        .domain([7, d3.max(data, d => d.poverty) + 1])
        .range([0, width]);
    var xScale2 = d3.scaleLinear()
        .domain([28, d3.max(data, d => d.age) + 1])
        .range([0, width]);
    var xScale3 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.income)])
        .range([0, width]);
    var yScale1 =  d3.scaleLinear()
        .domain([0, d3.max(data, d => d.obesity)])
        .range([height, 0]);
    var yScale2 = d3.scaleLinear()
        .domain([8, d3.max(data, d => d.smokes) + 1])
        .range([height, 0]);
    var yScale3 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare) + 1])
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
        .attr("transform", `translate(0, ${height})`)
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
    var circleLabels2 = chartGroup2.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("dx", d => xScale2(d.age) - 10)
        .attr("dy", d => yScale2(d.smokes) + 10)
        .text(d => d.abbr);
            
    // Tooltips

    // Axis Labels
    chartGroup1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("Lacks Healthcare (%)");
    chartGroup1.append("text")
        .attr("transform", `translate(${width / 2}, ${height + chartMargin.top - 7})`)
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("In Poverty (%)");
    chartGroup2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("Smokes(%)");
    chartGroup2.append("text")
        .attr("transform", `translate(${width / 2}, ${height + chartMargin.top - 7})`)
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("Age (Median)");
});