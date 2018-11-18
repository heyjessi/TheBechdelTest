
/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the
 */

boxOffice = [1153, 1029, 1024, 966, 875, 872, 783, 812, 746, 1056];


BarChart2016 = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}

BarChart2016.prototype.initVis = function() {
    var vis = this;

    for (var i = 0; i < vis.data.length; i++) {
        this.data[i].boxOffice = boxOffice[i];
    }

    this.data.sort(function(a, b) {
       return a.boxOffice - b.boxOffice;
    });

    vis.margin = {top: 25, right: 25, bottom: 50, left: 90},
        vis.width = 500 - vis.margin.left - vis.margin.right,
        vis.height = 500 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Make The Legend
    var dataCategories = ["Pass", "Fail"];

    vis.legend = vis.svg.selectAll("rect.legend")
        .data(dataCategories);

    vis.legend.enter().append("rect")
        .attr("class", "legend")
        .attr("width", 15)
        .attr("height", 15)
        .merge(vis.legend)
        .attr("x", function(d, i) {return i * 100})
        .attr("y", -21)
        .attr("fill", function(d){
            if (d === "Pass") {
                return "red";
            }
            if (d === "Fail") {
                return "blue";
            }
        });

    vis.legend.exit().remove();

    vis.labels = vis.svg.selectAll("text.legend")
        .data(dataCategories);

    vis.labels.enter().append("text")
        .attr("class", "legend")
        .merge(vis.labels)
        .attr("x", function(d, i) {return i * 100 + 20})
        .attr("y", -9)
        .text(function(d) { return d });

    vis.labels.exit().remove();

    // Init the scales
    var y = d3.scaleBand()
        .range([vis.height, 0])
        .padding(0.1);

    var x = d3.scaleLinear()
        .range([0, vis.width]);

    x.domain([0, d3.max(boxOffice)]);
    y.domain(vis.data.map(function(d) { return d.title.substring(0, 15); }));

    vis.svg.selectAll(".bar")
        .data(vis.data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("width", function(d, i) {return x(d.boxOffice); } )
        .attr("y", function(d) { return y(d.title.substring(0, 15)); })
        .attr("height", y.bandwidth())
        .attr("fill", function (d) {
            return d.bechdel ? "blue" : "red";
        });

    // add the x Axis
    vis.svg.append("g")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(d3.axisBottom(x));

    vis.svg.append("text")
        .attr("class", "x-axis")
        .attr("transform",  "translate(0," + vis.height + ")")
        .attr("y", 35)
        .attr("x", vis.width / 2)
        .text("Box Office Revenue in Millions");


    // add the y Axis
    vis.svg.append("g")
        .call(d3.axisLeft(y));


};





