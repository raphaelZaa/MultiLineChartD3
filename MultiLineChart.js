/* ----------------------------------------------------------------------------
File: MultiLine-Chart.js
Contructs the animated MultiLine Chart using D3
-----------------------------------------------------------------------------*/
/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */


var map = d3.map()

var time = d3.timeParse("%Y")

var margin = {top: 10, right: 50, bottom: 30, left: 50},
    graphWidth = parseInt(d3.select("#graph").style("width")),
    width = graphWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

d3.csv("EPCSmallMillionBTU.csv").then(function(data){
    var i = 0
    //reads the csv file in a map of {country : [values for each year]}
    for(i = 0; i<data.length;i++){
        map.set(data[i].Country_Name, [data[i].y1971,data[i].y1972,data[i].y1973,data[i].y1974,data[i].y1975,data[i].y1976,data[i].y1977,data[i].y1978,data[i].y1979,data[i].y1980,data[i].y1981,data[i].y1982,data[i].y1983,data[i].y1984,data[i].y1985,data[i].y1986,data[i].y1987,data[i].y1988,data[i].y1989,data[i].y1990,data[i].y1991,data[i].y1992,data[i].y1993,data[i].y1994,data[i].y1995,data[i].y1996,data[i].y1997,data[i].y1998,data[i].y1999,data[i].y2000,data[i].y2001,data[i].y2002,data[i].y2003,data[i].y2004,data[i].y2005,data[i].y2006,data[i].y2007,data[i].y2008,data[i].y2009,data[i].y2010,data[i].y2011,data[i].y2012,data[i].y2013,data[i].y2014,data[i].y2015,data[i].y2016,data[i].y2017,data[i].y2018,data[i].y2019])
        
    }
    
    //populates "from" selector with all the years and sets 2000 to be the default value selected.
    var ySelect1 = document.getElementById("Years1")
    for(i = 0; i<(2019 - 1971); i++){
        var opt = document.createElement("option")
        opt.value = (1971+i)
        opt.text = (1971+i)
        if(1971+i === 2000){
            opt.selected = true
        }
        ySelect1.appendChild(opt)
    }
    //same as above for the "to" selector
    var ySelect2 = document.getElementById("Years2")
    for(i = 0; i<(2020 - 1971); i++){
        opt = document.createElement("option")
        opt.value = (1971+i)
        opt.text = (1971+i)
        if(1971+i === 2014){
            opt.selected = true
        }
        ySelect2.appendChild(opt)
    }    
    
    var svg = d3.select("div").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id","grph")
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");
    
    x.domain([time(document.getElementById("Years1").value),time(document.getElementById("Years2").value)]);
    
    y.domain([d3.min(map.get("India")),d3.max(map.get("United States"))]).nice();
    
    drawLines()
    
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    
    svg.append("g")
      .call(d3.axisLeft(y));

    
    //y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Million BTUs Per Person"); 

    
    //x axis
    svg.append("text")
        .attr("x", width/2)
        .attr("y", height + 30)
        .style("text-anchor", "middle")
        .text("Years");
    
    d3.select("#checkboxes").on("change",update);
    d3.select("#reset").on("click",defaultData);
    d3.select("#sel").on("click",selectAll);
    window.addEventListener("resize", update);
})

function selectAll(){
    document.querySelectorAll('input[type=checkbox]').forEach(function(E){
            E.checked = true
    })
    update()
}

function defaultData(){
    var defCountries = ["Brazil", "Russia", "India", "China", "South Africa", "United States"]
    document.querySelectorAll('input[type=checkbox]').forEach(function(E){
        if(defCountries.includes(E.id))
            E.checked = true
        else
            E.checked = false
    })
    document.getElementById("Years1").value = 2000
    document.getElementById("Years2").value = 2014
    update()
}

function update(){
    //update the width value with resize of the window to resize the x-axis
    graphWidth = parseInt(d3.select("#graph").style("width"));
    width = graphWidth - margin.left - margin.right;
    
    //prevents the user to set year2 less than year1
    if(document.getElementById("Years1").value>=document.getElementById("Years2").value)
        document.getElementById("Years2").value = parseInt(document.getElementById("Years1").value)+1
    d3.select("svg").remove()
    
    var svg = d3.select("div").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id","grph")
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");
    
    //gets the input from the first year selector and the second one to create a scale for the x-axis
    x.domain([time(document.getElementById("Years1").value),time(document.getElementById("Years2").value)]).range([0, width]);
    
    //gets the range from the lowest data to the highest to make a scale for the y-axis
    y.domain([d3.min(map.get("India")),d3.max(map.get("United States"))]).nice();
    
    
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));
    
    svg.append("g")
      .call(d3.axisLeft(y));
    
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Million BTUs Per Person"); 
    
    svg.append("text")
        .attr("x", width/2)
        .attr("y", height + 30)
        .style("text-anchor", "middle")
        .text("Years");
    
    drawLines()
    
}

// Credit: Joe Freeman & Martin Tournoij, stackoverflow.com/a/16348977
var stringToColour = function(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}


//credit for the background grid, Malcolm Maclean, found in the sample code for his book "D3 Tips and Tricks v4.x"
// gridlines in x axis function
function make_x_gridlines(tks) {		
    return d3.axisBottom(x)
        .ticks(tks)
}

// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(8)
}


function drawLines(){
    //selects all the checked boxes to get the data of the selected countries
     document.querySelectorAll('input[type=checkbox]').forEach(function(country){
        if(country.checked){
            var countryData = map.get(country.id),
                data = [],
                ndx = 0,
                startDate = parseInt(document.getElementById("Years1").value),
                startNdx = startDate - 1971,
                endDate = parseInt(document.getElementById("Years2").value),
                endNdx = endDate - 1971;
            for(ndx = startNdx; ndx < endNdx; ndx++){
                data.push({"x": time(1971+ndx), "y": countryData[ndx]})
            }

            d3.select("svg").append("path")
                .style("stroke",stringToColour(country.id))
                .attr("transform", "translate(" + margin.left + ")")
                .attr("class", "line")
                .attr("d", line(data))
                .attr('stroke-dasharray', '1000 1000')
                .attr('stroke-dashoffset', 1000)
                .transition()
                .duration(4000)
                .attr('stroke-dashoffset', 0)
            
            
            // add the X gridlines
            d3.select("svg").append("g")			
                .attr("class", "grid")
                .attr("transform", "translate("+margin.left+", " + height + ")")
                .call(make_x_gridlines(endDate-startDate)
                .tickSize(-height)
                .tickFormat("")
                )
            // add the Y gridlines
            d3.select("svg").append("g")			
                .attr("class", "grid")
                .attr("transform", "translate(" + margin.left + ",10)")
                .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
                )
            // adds the country names at the end of the curves.
            d3.select("svg").append("text")
                .attr("transform", "translate(" + (width+5) + "," + y(data.slice(-1)[0].y) + ")")
                .attr("dy", ".35em")
                .attr("text-anchor", "start")
                .style("fill", stringToColour(country.id))
                .style("fontSize", "1%")
                .text(country.id);

        }
    })
}