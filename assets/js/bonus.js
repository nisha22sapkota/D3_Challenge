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

//append a div classed chart to the scatter element
var chart = d3.select("#scatter").append("div").classed("chart", true);


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = chart
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  
// Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// choose initial parameter 
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


//function used for updating x-scale var upon clicking on axis label
function xScale(GivenData, chosenXAxis) {
  //create scales
  var xLinearScale = d3.scaleLinear()
      .domain([d3.min(GivenData, d => d[chosenXAxis]) * 0.8,
          d3.max(GivenData, d => d[chosenXAxis]) * 1.2])
      .range([0, width]);

  return xLinearScale;
}


//function used for updating y-scale var upon clicking on axis label
function yScale(GivenData, chosenYAxis) {
  //create scales
  var yLinearScale = d3.scaleLinear()
      .domain([d3.min(GivenData, d => d[chosenYAxis]) * 0.8,
          d3.max(GivenData, d => d[chosenYAxis]) * 1.2])
      .range([height, 0]);

  return yLinearScale;
}


//function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

  return xAxis;
}



//function used for updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
      .duration(1000)
      .call(leftAxis);

  return yAxis;
}

//function used for updating circles group with a transition to new circles
//for change in x axis or y axis
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
      .duration(1000)
      .attr("cx", sampledata => newXScale(sampledata[chosenXAxis]))
      .attr("cy", sampledata => newYScale(sampledata[chosenYAxis]));

  return circlesGroup;
}


//function used for updating state labels with a transition to new 
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));

  return textGroup;
}

//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

  //stylize based on variable chosen
  //poverty percentage
  if (chosenXAxis === 'poverty') {
      return `${value}%`;
  }
  //household income in dollars
  else if (chosenXAxis === 'income') {
      return `$${value}`;
  }
  //age (number)
  else {
      return `${value}`;
  }
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  //select x label
  //poverty percentage
  if (chosenXAxis === 'poverty') {
      var xLabel = "Poverty:";
  }
  //household income in dollars
  else if (chosenXAxis === 'income') {
      var xLabel = "Median Income:";
  }
  //age (number)
  else {
      var xLabel = "Age:";
  }

    //select y label
    //percentage lacking healthcare
    if (chosenYAxis === 'healthcare') {
      var yLabel = "No Healthcare:"
  }
  //percentage obese
  else if (chosenYAxis === 'obesity') {
      var yLabel = "Obesity:"
  }
  //smoking percentage
  else {
      var yLabel = "Smokers:"
  }




    //create tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
             return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
        });

      

    circlesGroup.call(toolTip);

    //add events
    circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);

    return circlesGroup;
}


d3.csv("../assets/data/data.csv").then(function(GivenData) {
    // var chosenXAxis = "poverty";
    // console.log(" = chosenXAxis" + chosenXAxis )
    // Parse Data/Cast as numbers
    GivenData.forEach(function(sampledata) {
      sampledata.healthcare = +sampledata.healthcare;
      sampledata.poverty = +sampledata.poverty;
      sampledata.age = +sampledata.age;
      sampledata.income = +sampledata.income;
      sampledata.obesity = +sampledata.obesity;
      sampledata.smokes = +sampledata.smokes;
    }); 

  

  
   // xLinearScale function above csv import
  //  console.log("chosenXAxis = " + chosenXAxis);
   var xLinearScale = xScale(GivenData, chosenXAxis);
   var yLinearScale = yScale(GivenData, chosenYAxis);

   

   // Create initial axis functions
   var bottomAxis = d3.axisBottom(xLinearScale);
   var leftAxis = d3.axisLeft(yLinearScale);

   // append x axis
  var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// append y axis
 var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .call(leftAxis);

   // append initial circles
   var circlesGroup = chartGroup.selectAll("circle")
   .data(GivenData)
   .enter()
   .append("circle")
   .attr("cx", d => xLinearScale(d[chosenXAxis]))
   .attr("cy", d => yLinearScale(d[chosenYAxis]))
   .attr("r", 10)
   .attr("fill", "LightBlue")
   .attr("opacity", "0.5");

   //append initial text
   var textGroup = chartGroup.selectAll(".stateText")
   .data(GivenData)
   .enter()
   .append("text")
   .classed("stateText", true)
   .attr("x", d => xLinearScale(d[chosenXAxis]))
   .attr("y", d => yLinearScale(d[chosenYAxis]))
   .attr("dy", 3)
   .attr("font-size", "10px")
   .text(function(d){return d.abbr});


   // Create group for three x-axis labels
  var xlabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

var povertyLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("In Poverty (%)");


  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median");

    var incomeLabel = xlabelsGroup.append("text")
    
    .classed("inactive", true)
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .text("Household Income (Median)")  

     //create group for 3 y-axis labels
     var yLabelsGroup = chartGroup.append("g")
     .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);


     var healthcareLabel = yLabelsGroup.append("text")
     
     .classed("active", true)
     .attr("x", 0)
     .attr("y", 0 - 20)
     .attr("dy", "1em")
     .attr("transform", "rotate(-90)")
     .attr("value", "healthcare")
     .text("Lacks Healthcare (%)");


     var smokesLabel = yLabelsGroup.append("text")
       .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 40)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "smokes")
        .text("Smokes (%)");



        var obesityLabel = yLabelsGroup.append("text")
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 60)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "obesity")
        .text("Obese (%)");   






    // append y axis
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .classed("axis-text", true)
  // .text("Lacks Healthcare (%) ");

    //updateToolTip function with data
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


// console.log(labelsGroup)
     // x axis labels event listener
  xlabelsGroup.selectAll("text")
  
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

    

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(GivenData, chosenXAxis);

      // updates x axis with transition
      xAxis = renderAxesX(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

       //update text with new x values
       textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);


      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

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
      else if  (chosenXAxis === "age"){
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);
          ageLabel
          .classed("active", false)
          .classed("inactive", true);
          incomeLabel
          .classed("active", false)
          .classed("inactive", true);

      }
      else{
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);
          ageLabel
          .classed("active", false)
          .classed("inactive", true);
          incomeLabel
          .classed("active", false)
          .classed("inactive", true);

      }
    }
  });

      //y axis labels event listener
      yLabelsGroup.selectAll("text")
      .on("click", function() {
          //get value of selection
          var value = d3.select(this).attr("value");
  
          //check if value is same as current axis
          if (value != chosenYAxis) {
  
              //replace chosenYAxis with value
              chosenYAxis = value;
  
              //update y scale for new data
              yLinearScale = yScale(GivenData, chosenYAxis);
  
              //update x axis with transition
              yAxis = renderAxesY(yLinearScale, yAxis);
  
              //update circles with new y values
              circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
  
              //update text with new y values
              textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
  
              //update tooltips with new info
              circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
              //change classes to change bold text
              if (chosenYAxis === "obesity") {
                  obesityLabel
                  .classed("active", true)
                  .classed("inactive", false);
                  smokesLabel
                  .classed("active", false)
                  .classed("inactive", true);
                  healthcareLabel
                  .classed("active", false)
                  .classed("inactive", true);
              }
              else if (chosenYAxis === "smokes") {
                  obesityLabel
                  .classed("active", false)
                  .classed("inactive", true);
                  smokesLabel
                  .classed("active", true)
                  .classed("inactive", false);
                  healthcareLabel
                  .classed("active", false)
                  .classed("inactive", true);
              }
              else {
                  obesityLabel
                  .classed("active", false)
                  .classed("inactive", true);
                  smokesLabel
                  .classed("active", false)
                  .classed("inactive", true);
                  healthcareLabel
                  .classed("active", true)
                  .classed("inactive", false);
              }
          }
      });



    });







  




