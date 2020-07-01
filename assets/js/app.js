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




// Retrieve data from the CSV file and execute everything below
d3.csv("../assets/data/data.csv").then(function(GivenData) {

 

    
  
    // Parse Data/Cast as numbers
    GivenData.forEach(function(sampledata) {
      sampledata.healthcare = +sampledata.healthcare;
     
      sampledata.poverty = +sampledata.poverty;
      
    });




 //  Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(GivenData, d => d.poverty)])
      .range([0, width]);

 // Create y scale function
 var yLinearScale = d3.scaleLinear()
   .domain([4, d3.max(GivenData, d => d.healthcare)])
   .range([height, 0]);

 // Create  axis functions
 var bottomAxis = d3.axisBottom(xLinearScale);
 var leftAxis = d3.axisLeft(yLinearScale);


// Append Axes to the chart
 
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

 // append y axis
 chartGroup.append("g")
   .call(leftAxis);

 // append initial circles
  // Step 5: Create Circles
 var circlesGroup = chartGroup.selectAll("circle")
   .data(GivenData)
   .enter()
   .append("circle")
   .attr("cx", d => xLinearScale(d.poverty))
   .attr("cy", d => yLinearScale(d.healthcare))
   .attr("r", 8)
   .attr("fill", "LightBlue")
   .attr("opacity", "1");

    // // Add state labels to the points
    // var circleLabels = circlesGroup.selectAll("text").data(GivenData).enter().append("text");
    var circleLabels = chartGroup.selectAll(null).data(GivenData).enter().append("text");

    circleLabels
      .attr("x", function(d) 
      { return xLinearScale (d.poverty);
      })
      .attr("y", function(d) 
      { return yLinearScale(d.healthcare);
       })
      .text(function(d) 
      { return d.abbr; 
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "7px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");



    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");


    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      
      .text("In Poverty (%)");


// Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}<br>`);
      });


      // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);


 // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(sampledata) {
      toolTip.show(sampledata, this);
    })
      // onmouseout event
      .on("mouseout", function(sampledata, index) {
        toolTip.hide(sampledata);
      });

// append y axis

    });



  
