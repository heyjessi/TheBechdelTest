/*
 * IconChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the
 */

IconChart = function(_parentElement, _data, _allData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.allData = _allData;
    this.displayData = []; // see data wrangling

    this.initVis();
}

IconChart.prototype.initVis = function() {
    var vis = this;

    vis.width = 500;
    vis.height = 300;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .append("g");

    vis.dataCategories = ["Male", "Female"];

    vis.legend = vis.svg.selectAll("rect.legend")
        .data(vis.dataCategories);

    vis.legend.enter().append("rect")
        .attr("class", "legend")
        .attr("width", 15)
        .attr("height", 15)
        .merge(vis.legend)
        .attr("x", function(d, i) {return i * 100})
        .attr("y", 0)
        .attr("fill", function(d){
            if (d === "Male") {
                return "red";
            }
            if (d === "Female") {
                return "blue";
            }
            return "black";
        });

    vis.legend.exit().remove();

    document.getElementById("top-10-movie-title").innerHTML = "#" + vis.allData['rank'] + " " + vis.allData['title'];
    document.getElementById("top-10-movie-revenue").innerHTML = "Box Office Revenue: $" + vis.allData['boxOffice'] + "000000";
    document.getElementById("top-10-movie-bechdel").innerHTML = vis.allData['bechdel'] ? "Passes Bechdel Test" : "Fails Bechdel Test";

    vis.wrangleData();
};

IconChart.prototype.wrangleData = function(){
    var vis = this;

    // In the first step no data wrangling/filtering needed
    // vis.displayData = vis.stackedData;
    console.log(vis.data);
    vis.displayData = vis.data.filter(function (d) {
        return d['gender'].toLowerCase() === "male" || d['gender'].toLowerCase() === "female";
    });
    let value = d3.select("#sort-type").property("value");
    if (value === "billing") {
        vis.displayData.sort(function (a, b) {
            return a[value] - b[value];
        });
    }
    if (value === "gender") {
        vis.displayData.sort(function (a, b) {
            let a_val = 0;
            let b_val = 0;
            if (a["gender"].toLowerCase() === "female") {
                a_val = 1;
            }
            if (b["gender"].toLowerCase() === "female") {
                b_val = 1;
            }
            return b_val - a_val;
        });
    }
    console.log(vis.displayData);

    // Update the visualization
    vis.updateVis();
}

IconChart.prototype.updateVis = function(){
    var vis = this;

    let rowLength = Math.ceil(Math.sqrt(2 * vis.displayData.length));
    let radius = 250 / rowLength;

    var circle = vis.svg.selectAll("circle")
        .data(vis.displayData);

    circle.enter().append("circle")
        .merge(circle)
        .transition()
        .attr("fill", function (d) {
            if (d['gender'].toLowerCase() === "male") {
                return "red";
            }
            if (d['gender'].toLowerCase() === "female") {
                return "blue";
            }
            return "black";
        })
        .attr("r", 0.8 * radius)
        .attr("cx", function (d, i) { return radius + (i % rowLength) * (2 * radius); })
        .attr("cy", function (d, i) { return radius + 25 + Math.floor(i / rowLength) * (2 * radius); });

    var tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            var html = d['name'];
            if (d['character']) {
                html += "</br>" + d['character']
            }
            if (d['characterType']) {
                html += "</br>" + d['characterType']
            }
            if (d['department']) {
                html += "</br>" + d['department']
            }
            return html;
        });

    vis.svg.call(tool_tip);

    circle.on("mouseover", tool_tip.show)
        .on("mouseout", tool_tip.hide);

    circle.exit().remove();

    var getGenderPercentage = function(d) {
        var count = 0;
        vis.displayData.forEach(function (e) {
            if (e['gender'].toLowerCase() === d.toLowerCase()) {
                count++;
            }
        });
        return Math.round(100 * count / vis.displayData.length);
    };

    var labels = vis.svg.selectAll("text.legend")
        .data(vis.dataCategories);

    labels.enter().append("text")
        .attr("class", "legend")
        .merge(labels)
        .attr("x", function(d, i) {return i * 100 + 20})
        .attr("y", 12)
        .text(function(d) { return d + " (" + getGenderPercentage(d) + "%)" });

    labels.exit().remove();
}
