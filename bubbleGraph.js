(function(){
    var width = 600;
    var height = 600;
    var bubbleFloatTip = floatingTooltip('bubble_chart_tooltip', 200);
    var svg = d3.select("#bubbleChart")
        .append("svg")
        .attr("height", height)
        .attr("width",width)
        .append("g")
        .attr("transform", "translate(0,0)");
    d3.queue()
    .defer(d3.csv, "data.csv")
    .await(ready)

    var radiusScale = d3.scaleSqrt().domain([7.2,23.11]).range([25,125])

    var color = d3.scaleOrdinal(d3.schemeCategory20c);

    var simulation = d3.forceSimulation()
            .force("xtowardsthecenter", d3.forceX(width / 2).strength(0.05))
            .force("ytowardsthecenter", d3.forceY(height / 2).strength(0.05))
            .force("anticolliding", d3.forceCollide(function(d){
                return radiusScale(d.aggregatevalue);
            }))

    function showData(d){
        d3.select(this).attr('stroke','black');
        bubbleFloatTip.showTooltip(contentOnMouseOver(d),d3.event);
    }

    function hideData(d) {
        d3.select(this).attr('stroke', 'black');
        bubbleFloatTip.hideTooltip();
    }

    function contentOnMouseOver(d){
        var data = '';
        data += "percentage : ";
        data += d.aggregatevalue;
        return data;
    }
    function ready(error, datapoints){
        var circles = svg.selectAll(".circles")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "circles")
            .attr("r", function(d){
                return radiusScale(d.aggregatevalue)
            })
            .style("fill",function(d){
                return color(d.color)
            })
            .on('mouseover',showData)
            .on('mouseout', hideData)
            .on('click', dummy)

            
        var labels = svg.selectAll(".artist-label")
            .data(datapoints)
            .enter().append("text")
            .attr("class", "artist-label")
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-size", "12px")
            .text(function(d) {
                return d.feature;
        })
        simulation.nodes(datapoints)
            .on('tick', ticked)
        function ticked() {
            circles
                .attr("cx", function(d){
                    return d.x
                })
                .attr("cy", function(d){
                    return d.y
                })
            labels
            .attr("x", function(d) {
              return d.x;
            })
            .attr("y", function(d) {
              return d.y;
            })
        }
    }
    function dummy(data){
        test(data.feature);
    }
    function floatingTooltip(tooltipID, width) {
        var tt = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .attr('id', tooltipID)
            .style('pointer-events', 'none');
    
        if (width) {
            tt.style('width', width);
        }
    
        hideTooltip();
    
        function showTooltip(content, event) {
            tt.style('opacity', 1.0)
                .html(content);
            updatePosition(event);
        }
    
        function hideTooltip() {
            tt.style('opacity', 0.0);
        }
    
        function updatePosition(event) {
            var xOffset = 20;
            var yOffset = 10;
    
            var ttw = tt.style('width');
            var tth = tt.style('height');
    
            var wscrY = window.scrollY;
            var wscrX = window.scrollX;
    
            var curX = (document.all) ? event.clientX + wscrX : event.pageX;
            var curY = (document.all) ? event.clientY + wscrY : event.pageY;
            var ttleft = ((curX - wscrX + xOffset * 2 + ttw) > window.innerWidth) ?
                                     curX - ttw - xOffset * 2 : curX + xOffset;
    
            if (ttleft < wscrX + xOffset) {
                ttleft = wscrX + xOffset;
            }
    
            var tttop = ((curY - wscrY + yOffset * 2 + tth) > window.innerHeight) ?
                                    curY - tth - yOffset * 2 : curY + yOffset;
    
            if (tttop < wscrY + yOffset) {
                tttop = curY + yOffset;
            }
    
            tt.style('top', tttop + 'px');
            tt.style('left', ttleft + 'px');
        }
    
        return {
            showTooltip: showTooltip,
            hideTooltip: hideTooltip,
            updatePosition: updatePosition
        };
    }
})();