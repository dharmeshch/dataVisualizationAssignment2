function test(param1, param2, param3) {
    if(param3==undefined || param3=="select")
        param3 = "dataforBarChart";
    console.log(param1);
    var barChart = d3.select("#barChart")
    barChart.selectAll("*").remove();
    var width =600, height=550;
    var svg = d3.select("#barChart")
    .append("svg")
    .attr("height", 600)
    .attr("width",width)
    //.attr("style","padding:25px")
    .append("g")
    .attr("transform", "translate(0,0)");
var x0 = d3.scaleBand()
    .rangeRound([0, width-100])
    .paddingInner(0.1)
    .paddingOuter(0.6);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#7b6888",param2]);
    // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

d3.csv("data/data.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function(error, data) {
  if (error) throw error;
    console.log(param3);
    data = dataObj[param3][param1];
  //data = dataforBarChart[param1]
  var keys = ['Winner', 'Loser'];

  x0.domain(data.map(function(d) { return d.Year; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max([d.Winner, d.Loser]); })]).nice();

  svg.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.Year)+",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return z(d.key); });

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .attr("transform", "translate(25,0)")
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 7)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Number of Matches");

  var legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  
  legend.append("rect")
      .attr("x", width - 50)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 50)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});
}

//test()