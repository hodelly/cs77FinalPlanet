
// Returns coordinates of an icosahedron projected onto a sphere
// div = number of loop divisions on each icosahedron side
function getSphere(div, radius){
  console.log("getSphere called");
  var ico = getIcosahedron();
  console.log("Icosahedron made");
  var splitIco = splitSides(div, ico.vertices, ico.faces);
  console.log("Icosahedron split");
  return{'vertices': spherize(splitIco.vertices, radius), 'faces': splitIco.faces};
}

// Function taken from geometry.js from assignment 3
function getIcosahedron(){
  var t = (1.0 + Math.sqrt(5.0))*0.5;

	var vertices = [
		new Vector(-1,  t,  0), new Vector(1, t, 0), new Vector(-1, -t,  0), new Vector( 1, -t,  0),
		new Vector( 0, -1,  t), new Vector(0, 1, t), new Vector( 0, -1, -t), new Vector( 0,  1, -t),
		new Vector( t,  0, -1), new Vector(t, 0, 1), new Vector(-t,  0, -1), new Vector(-t,  0,  1)
	];
	var faces = [
		[0, 11,  5], [0,  5,  1], [ 0,  1,  7], [ 0,  7, 10], [0, 10, 11],
		[1,  5,  9], [5, 11,  4], [11, 10,  2], [10,  7,  6], [7,  1,  8],
		[3,  9,  4], [3,  4,  2], [ 3,  2,  6], [ 3,  6,  8], [3,  8,  9],
		[4,  9,  5], [2,  4, 11], [ 6,  2, 10], [ 8,  6,  7], [9,  8,  1]
	];

  return{'vertices': vertices, 'faces': faces};
}

// Loop subdivision without the position adjustment
function splitSides(div, vertices, faces){

  var newVertices = [];
  var newFaces = [];

  // Function taken from task2.js from assignment 3
  var edgeMap = {};
  function getOrInsertEdge(a, b, centroid) {
        var edgeKey = a < b ? a + ":" + b : b + ":" + a;
        if (edgeKey in edgeMap) {
            return edgeMap[edgeKey];
        } else {
            var idx = newVertices.length;
            newVertices.push(centroid);
            edgeMap[edgeKey] = idx;
            return idx;
        }
    }

  // Limit of divisions
  if(div <= 0){
    return{'vertices': vertices, 'faces': faces};
  }

  // Otherwise...
  for(var i = 0; i < vertices.length; i++){
    newVertices.push(vertices[i].clone());
  }
  for (var i = 0; i < faces.length; i++){
    var v0 = faces[i][0];
    var v1 = faces[i][1];
    var v2 = faces[i][2];
    var c01 = getOrInsertEdge(v0, v1, Vector.lerp(vertices[v0], vertices[v1], .5));
    var c12 = getOrInsertEdge(v1, v2, Vector.lerp(vertices[v1], vertices[v2], .5));
    var c20 = getOrInsertEdge(v2, v0, Vector.lerp(vertices[v2], vertices[v0], .5));

    newFaces.push([v0, c01, c20]);
    newFaces.push([v1, c12, c01]);
    newFaces.push([v2, c20, c12]);
    newFaces.push([c01, c12, c20]);
  }

  var nextDiv = splitSides(div - 1, newVertices, newFaces);
  return{'vertices' : nextDiv.vertices, 'faces' : nextDiv.faces};

}

// Projects icosahedron onto a unit sphere
function spherize(vertices, radius){
  var sVertices = [];
  for (var i = 0; i < vertices.length; i++){
    sVertices.push(vertices[i].unit().multiply(radius));
  }
  return sVertices;
}
