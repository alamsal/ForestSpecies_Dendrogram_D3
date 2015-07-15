(function(){

    //Global variables
    var groupTextFontSize = 9;
    var specieTextFontSize = 10;
    var typeTextFontSize = 15;

    //circle size
    var rootCirleSize = 11;
    var depthOneCircleSize = 7;
    var specieCircleSize = 3;
    var groupCircleSize = 6;

    var svg;

    function createDendogram(dendogramRadius,dendogramContainer,dendogramDataSource){

        var radius = dendogramRadius / 2;
        var cluster = d3.layout.cluster().size([360, radius - 240]);

        var diagonal = d3.svg.diagonal.radial()
        	.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

        svg = d3.select(document.getElementById(dendogramContainer)).append("svg:svg")
        	.attr("width", radius * 2)
        	.attr("height", radius * 2)
            .append("g")
            .call(d3.behavior.zoom().on("zoom", zoom))
        	.attr("transform", "translate(" + radius + "," + radius + ")");

        d3.json(dendogramDataSource, function(error,root) {
            if (error) throw error;

            var nodes = cluster.nodes(root);

            var link = svg.selectAll("path.link")
        	   .data(cluster.links(nodes))
        	   .enter().append("path")
        	   .attr("class", "link")
        	   .attr("d", diagonal);

            var node = svg.selectAll("g.node")
        	   .data(nodes)
        	   .enter().append("g")
        	   .attr("class", "node")
        	   .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

        	   .on("mouseenter", overCircle)
               .on("mouseleave", outCircle)
               .on('click', click);



            node.append("circle")
        	   .attr("r", function(d){
            	    if (d.depth == 0) {
                            return rootCirleSize;
                    }
                    else if (d.depth === 1) {
                        return depthOneCircleSize;
                    }
                    else if (d.depth === 2) {
                        return groupCircleSize;
                    }
                        return specieCircleSize;
        	    })
                .attr("id",function(d){
                    var order = 0;
                    if(d.order)order = d.order;
                    return 'C-' + d.depth + "-" + order;
                })
        	   .style("stroke",function(d){
                    if(d.depth>1){
                        return d.color;
                    }
                    else{
                        return "lightgray";
                    }
        	    })
        	   .style("fill",function(d){
            	    if(d.color) {
                        return d.color;
                    }else {
                        if(d.depth == 1) {
                            return "lightgray";
                        }
                        else{
                            return "lightgray";
                        }
                    }
        	  });

            node.append("text")
        	    .attr("dy", function(d){
                    if (d.depth === 1) {
                        return d.x < 180 ? "1.4em" : "-0.2em";
                    }
                    return ".31em";
                })

                .attr("dx", function (d) {
                    if (d.depth === 1) {
                        return 0; //return d.x > 180 ? 2 : -2;
                    } else if (d.depth === 2) {
                        return 0;
                    }
                    return d.x < 180 ? 8 : -8;
                })

                .attr('id', function(d){
                    var order = 0;
                    if(d.order)order = d.order;
                    return 'T-' + d.depth + "-" + order;
                })

                .attr("font-size", function(d){
                    if (d.depth === 1) {
                        return typeTextFontSize;
                    } else if (d.depth === 2) {
                        return groupTextFontSize;
                    }
                    return specieTextFontSize;
                })

                .attr("text-anchor", function (d) {
                    if (d.depth === 1) {
                        return d.x < 180 ? "end" : "start";
                    } else if (d.depth === 2) {
                        return "middle";
                    }
                    return d.x < 180 ? "start" : "end";
                })

                .attr("transform", function (d) {
                    if (d.depth <= 2) {
                        return "rotate(" + (90 - d.x) + ")";
                    }else {
                        return d.x < 180 ? null : "rotate(180)";
                    }
                })

        	   .text(function(d) { return d.name; });

        });

        // Helper functions
        function overCircle(d){
            if(d.depth <= 1)return;
            highlightNode(d, true);

        }

        function outCircle(d){
            if(d.depth <= 1)return;
            highlightNode(d,false);
        }

        function highlightNode(d,on) {

            var order = 0;
            if(d.order)order = d.order;
            var id_text = "T-" + d.depth + "-" + order;
            var text = d3.select(document.getElementById(id_text));

            var fontSize1 = 15, fontSize2 = 10;
            var color1 = "black", color2 = "black";
            var radius1, radius2;
            if (d.depth === 2) {
                fontSize2 = groupTextFontSize;
                fontSize1 = groupTextFontSize + 5;
                color1 = "black";
                color2 = "black";
                radius1 = groupCircleSize;
                radius2 = radius1 + 5;
            }
            if(d.depth === 3) {
                fontSize2 = specieTextFontSize;
                fontSize1 = specieTextFontSize + 7;
                color1 = "black";
                color2 = "black";
                radius1 = specieCircleSize;
                radius2 = radius1 + 2;
            }

            text.transition((on==true) ? 0:550)

                .style("fill",(on==true) ? color1 : color2)
                .style("font-size",(on==true) ? fontSize1 + "px" : fontSize2 + "px")
                .style("stroke-width",((on==true) ? 2 : 0));


            id_text = "C-" + d.depth + "-" + order;
            var circ = d3.select(document.getElementById(id_text));
            circ.transition((on==true) ? 15:550)
                .attr("r", ((on==true) ? radius2 : radius1))
                .style("stroke",(on==true) ? "darkslategray" : d.color);
        }

        function click(d) {
            currentSelectedNode = d;
            highlightSelections(d);
        }

        function highlightSelections(d) {

            var highlightLinkColor = "darkslategray";//"#f03b20";
            var defaultLinkColor = "lightgray";

            var depth =  d.depth;
            var nodeColor = d.color;
            if (depth === 1) {
                nodeColor = highlightLinkColor;
            }

            var links = svg.selectAll("path.link");

            links.style("stroke",function(dd) {
                if (dd.source.depth === 0) {
                    if (d.name === '') {
                        return highlightLinkColor;
                    }
                    return defaultLinkColor;
                }

                if (dd.source.name === d.name) {
                    return nodeColor;
                }else {
                    return defaultLinkColor;
                }
            });
        }


        function zoom() {
            svg.attr("transform"," scale(" + d3.event.scale + ")");
        }


    }



    //Start application
    var dendogramRadius = 960;
    var dendogramContainer = "speciesDendogram";
    var dendogramDataSource = "data/forestSpecies.json";

    createDendogram(dendogramRadius,dendogramContainer,dendogramDataSource);

})();















