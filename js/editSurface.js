// Changes elevation of a point either by -intensity or +intensity, "iterations" number of times
function randomRoughness(vertices, intensity, iterations){
  if (iterations <= 0){
    return vertices;
  }
  var newVertices = [];
  for(var i = 0; i < vertices.length; i++){
    if (Math.random() > 0.5){
      newVertices.push(vertices[i].multiply(1-intensity));
    }
    else {
      newVertices.push(vertices[i].multiply(1+intensity));
    }
  }
  return randomRoughness(newVertices, intensity, iterations-1);
}

// Changes the elevation of a point by a value within a range from [-intensity, +intensity]
function randomRoughness2(vertices, intensity){
  var newVertices = [];
  for(var i = 0; i < vertices.length; i++){
    newVertices.push(vertices[i].multiply(1 + ((Math.random() * 2 - 1) * intensity)));
  }
  return newVertices;
}

// Deforms mesh, splits it, deforms it more... intensity decaying
// Good for applying a fractal-style roughness to an entire planet
function layeredNoise(vertices, intensity, decay){
  var randIco = getIcosahedron();
  var unitIco = getIcosahedron();
  var scale = intensity;
  while(randIco.vertices.length < vertices.length){
    var rVertices = randomRoughness2(randIco.vertices, scale);
    randIco = splitSides(1, rVertices, randIco.faces);
    unitIco = splitSides(1, unitIco.vertices, unitIco.faces);
    scale /= decay;
  }
  var newVertices = [];
  for(i = 0; i < randIco.vertices.length; i++){
    newVertices.push(randIco.vertices[i].multiply(
      Math.sqrt(vertices[i].dot(vertices[i])) / Math.sqrt(unitIco.vertices[i].dot(unitIco.vertices[i])))
    );
  }
  return newVertices;
}

// Finds distance to nearest random point
// Good for mountain structures
// Numpoints should be in the 100's - 500's
function worleyNoise(vertices, intensity, numPoints){
  var newVertices = [];
  var randPoints = [];
  for(var i = 0; i < numPoints; i++){
    var x = 1;
    var y = 1;
    var z = 1;
    while(x*x + y*y + z*z > 1){
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
    }
    randPoints.push((new Vector(x, y, z)).unit());
  }
  for(var i = 0; i < vertices.length; i++){
    var shortestDist = 2;
    for(var j = 0; j < numPoints; j++){
      var pointDist = (vertices[i].unit().subtract(randPoints[j])).length();
      shortestDist = Math.min(shortestDist, pointDist);
    }
    var arcLength = 2*Math.asin(shortestDist/2)/(Math.PI/2); // Arc length in range [0,1] (but probably pretty small)
    newVertices.push(vertices[i].multiply(2+Math.log(1/Math.E + intensity * arcLength)-.03));
  }
  return newVertices;
}

// Compares closest point to second-closest point
// Makes a kind of cracked desert texture
function worleyNoise2(vertices, intensity, numPoints){
  var newVertices = [];
  var randPoints = [];
  for(var i = 0; i < numPoints; i++){
    var x = 1;
    var y = 1;
    var z = 1;
    while(x*x + y*y + z*z > 1){
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
    }
    randPoints.push((new Vector(x, y, z)).unit());
  }
  for(var i = 0; i < vertices.length; i++){
    var f1 = 2;
    var f2 = 2;
    for(var j = 0; j < numPoints; j++){
      var pointDist = (vertices[i].unit().subtract(randPoints[j])).length();
      if(pointDist < f2){
        if(pointDist < f1){
          f2 = f1;
          f1 = pointDist;
        }
        else{
          f2 = pointDist;
        }
      }
    }
    var arcLength1 = 2*Math.asin((f1)/2)/(Math.PI/2); // Arc length in range [0,1] (but probably pretty small)
    var arcLength2 = 2*Math.asin((f2)/2)/(Math.PI/2);
    var arcLength = arcLength2 - arcLength1;
    newVertices.push(vertices[i].multiply(1 + Math.min(intensity * arcLength, intensity*.05)));
  }
  return newVertices;
}
