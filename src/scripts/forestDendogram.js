var radius = 900 / 2;

var cluster = d3.layout.cluster()
	.size([360, radius - 240]);

var diagonal = d3.svg.diagonal.radial()
	.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select("body").append("svg")
	.attr("width", radius * 2)
	.attr("height", radius * 2)
    .append("g")
	.attr("transform", "translate(" + radius + "," + radius + ")");

d3.json("data/forestSpecies.json", function(error,root) {
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

  node.append("circle")
	  .attr("r", function(d){
	  	if (d.depth == 0) {
            //todo, if we want to show the root, we need to increase the size of the root circle
            return 10;
        }
        else if (d.depth === 1) {
            return 6;
        }
        else if (d.depth === 2) {
            return 7;
        }
        return 4;
	  })
	  .style("stroke",function(d){
	  	return "white";
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
	  .attr("dy", ".31em")
	  .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
	  .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
	  .text(function(d) { return d.name; });
});

d3.select(self.frameElement).style("height", radius * 2 + "px");