// Define SVG area dimensions
var svgWidth = 800;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 40,
    bottom: 100,
    left: 100
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
var chartGroup = svg.append("g")
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
        .range([0, height]);
  
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

// function used for updating the x-axis of circles group with a transition
function xRenderCircles(circlesGroup, newXScale, chosenXaxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}

// function used for updating the y-axis of circles group with a transition
function yRenderCircles(circlesGroup, newYScale, chosenYaxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));
  
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
            return (`<b>${d.state}</b><br>${xLabel} ${d[chosenXAxis]}${xUnit}<br>${yLabel} ${d[chosenYAxis]}${yUnit}`);
        });
  
    circlesGroup.call(toolTip);
  
    circlesGroup
        // on mouseover event 
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        // on mouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data, this);
        });
  
    return circlesGroup;
}

// Load data from hours-of-tv-watched.csv
d3.csv("/assets/data/data.csv", function(error, data) {
    // Log an error if one exists
    if (error) return console.warn(error);

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
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    // X Axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // X Axis Labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 40})`);
    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");
    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

    // Y Axis
    var leftAxis = d3.axisLeft(yLinearScale);
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // Y Axis Labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");
    var healthcareLabel = yLabelsGroup.append("text")
        .attr("y", 0 - chartMargin.left + 55)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");
    var smokesLabel = yLabelsGroup.append("text")
        .attr("y", 0 - chartMargin.left + 35)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em") 
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");
    var obesityLabel = yLabelsGroup.append("text")
        .attr("y", 0 - chartMargin.left + 15)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obese(%)");
    
    // Circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 8)
        .attr("fill", "#778899")
        .attr("opacity", ".5");

    // // Circle Labels
    // var circleLabels1 = chartGroup1.selectAll("text")
    //     .data(data)
    //     .enter()
    //     .append("text")
    //     .attr("dx", d => xScale1(d.poverty) - 10)
    //     .attr("dy", d => yScale3(d.healthcare) + 10)
    //     .text(d => d.abbr);
    // var circleLabels2 = chartGroup2.selectAll("text")
    //     .data(data)
    //     .enter()
    //     .append("text")
    //     .attr("dx", d => xScale2(d.age) - 10)
    //     .attr("dy", d => yScale2(d.smokes) + 10)
    //     .text(d => d.abbr);
            
    // Update Tooltips
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // Update graph based on x-Axis label click
    xLabelsGroup.selectAll("text").on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        
        if (value !== chosenXAxis) {
            // replaces chosenXaxis with value
            chosenXAxis = value;
            // updates x scale for new data
            xLinearScale = xScale(data, chosenXAxis);
            // updates x axis with transition
            xAxis = renderBottomAxes(xLinearScale, xAxis);
            // updates circles with new x values
            circlesGroup = xRenderCircles(circlesGroup, xLinearScale, chosenXAxis);
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
            
            // changes classes to change bold text
            if (chosenXAxis === "poverty") {  
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenXAxis === "age"){
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    });

    // Update graph based on y-Axis label click
    yLabelsGroup.selectAll("text").on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        
        if (value !== chosenYAxis) {
            // replaces chosenYaxis with value
            chosenYAxis = value;
            // updates y scale for new data
            yLinearScale = yScale(data, chosenYAxis);
            // updates x axis with transition
            yAxis = renderLeftAxes(yLinearScale, yAxis);
            // updates circles with new x values
            circlesGroup = yRenderCircles(circlesGroup, yLinearScale, chosenYAxis);
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
            
            // changes classes to change bold text
            if (chosenYAxis === "healthcare") {  
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis === "smokes"){
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    });
});