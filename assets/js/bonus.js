var svgWidth = 850;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  
// Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// d3.csv("../assets/data/data.csv").then(function(GivenData) {
//     console.log(GivenData)
// });

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
        d3.max(censusData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }


  // function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

  
  
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "hair_length") {
      label = "Hair Length:";
    }
    else if (chosenXAxis ==="obesity"){
        label = "obesity:";
    }
    else {
        label = "Household Income (median):";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(sampledata) {
      toolTip.show(sampledata);
    })
      // onmouseout event
      .on("mouseout", function(sampledata, index) {
        toolTip.hide(sampledata);
      });
  
    return circlesGroup;
  }
  
// Retrieve data from the CSV file and execute everything below
  d3.csv("../assets/data/data.csv").then(function(censusData) {
    // console.log(GivenData)
    if (err) throw err;
     // parse data
  censusData.forEach(function(sampledata) {
    sampledata.poverty = +data.poverty;
    sampledata.healthcare = +sampledata.healthcare;
    sampledata.age = +sampledata.age;
    sampledata.income = +sampledata.income;

  });
   // xLinearScale function above csv import
   var xLinearScale = xScale(censusData, chosenXAxis);

    // Create y scale function
  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(censusData, d => d.healthcare)])
  .range([height, 0]);

   // Create initial axis functions
   var bottomAxis = d3.axisBottom(xLinearScale);
   var leftAxis = d3.axisLeft(yLinearScale);

   // append x axis
  var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// append y axis
chartGroup.append("g")
  .call(leftAxis);

   // append initial circles
   var circlesGroup = chartGroup.selectAll("circle")
   .data(censusData)
   .enter()
   .append("circle")
   .attr("cx", d => xLinearScale(d[chosenXAxis]))
   .attr("cy", d => yLinearScale(d.healthcare))
   .attr("r", 10)
   .attr("fill", "LightBlur")
   .attr("opacity", "1");


   // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

var hairLengthLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("In Poverty (%)");


  var albumsLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("# of Albums Released");



    // append y axis
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .classed("axis-text", true)
  .text("Lacks Healthcare (%) ");


   // updateToolTip function above csv import
   var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

     // x axis labels event listener
  labelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(censusData, chosenXAxis);

      // updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "poverty") {
        albumsLabel
          .classed("active", true)
          .classed("inactive", false);
        hairLengthLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        albumsLabel
          .classed("active", false)
          .classed("inactive", true);
        hairLengthLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });
}).catch(function(error) {
console.log(error);
});









  




