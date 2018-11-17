function initValueNoise(resolution){
  var arrayX = [];
  for (var i = 0; i < resolution + 2; i++){
    var arrayY = [];
    for(var j = 0; j < resolution + 2; j++){
      var arrayZ = [];
      for(var k = 0; k < resolution + 2; k++){
        arrayZ.push(Math.random() * 2 - 1);
      }
      arrayY.push(arrayZ);
    }
    arrayX.push(arrayY);
  }
  return arrayX;
}

// noise = 3D array of random values
// x,y,z = coordinates all in range [-1,1]
function getValueNoise(noise, x, y, z){
  // Get relative positions
  var xp = (x+1)*.5*(noise.length-2);
  var yp = (y+1)*.5*(noise.length-2);
  var zp = (z+1)*.5*(noise.length-2);
  // Get indicies
  var xi = Math.floor(xp);
  var yi = Math.floor(yp);
  var zi = Math.floor(zp);
  // Get interpolation ratios
  var xl = xp - xi;
  var yl = yp - yi;
  var zl = zp - zi;

  // Get array values
  var x0y0z0 = noise[xi][yi][zi];
  var x0y0z1 = noise[xi][yi][zi+1];
  var x0y1z0 = noise[xi][yi+1][zi];
  var x0y1z1 = noise[xi][yi+1][zi+1];
  var x1y0z0 = noise[xi+1][yi][zi];
  var x1y0z1 = noise[xi+1][yi][zi+1];
  var x1y1z0 = noise[xi+1][yi+1][zi];
  var x1y1z1 = noise[xi+1][yi+1][zi+1];

  // Lerp the eight values
  var x0y0 = x0y0z0 * (1-zl) + x0y0z1 * zl;
  var x0y1 = x0y1z0 * (1-zl) + x0y1z1 * zl;
  var x1y0 = x1y0z0 * (1-zl) + x1y0z1 * zl;
  var x1y1 = x1y1z0 * (1-zl) + x1y1z1 * zl;

  var x0 = x0y0 * (1-yl) + x0y1 * yl;
  var x1 = x1y0 * (1-yl) + x1y1 * yl;

  var val = x0 * (1-xl) + x1 * xl;

  return val;
}

function applyValueNoise(vertices, intensity, resolution){
  var newVertices = [];
  var noise = initValueNoise(resolution);
  for(var i = 0; i < vertices.length; i++){
    var unit = vertices[i].unit();
    newVertices.push(vertices[i].multiply(1 + intensity * getValueNoise(noise, unit.x, unit.y, unit.z)));
  }
  return newVertices;
}

function layeredValueNoise(vertices, intensity, decay){

}

function initPerlinNoise(resolution){
  var arrayX = [];
  for (var i = 0; i < resolution + 2; i++){
    var arrayY = [];
    for(var j = 0; j < resolution + 2; j++){
      var arrayZ = [];
      for(var k = 0; k < resolution + 2; k++){
        var x, y, z;
        do{
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          z = Math.random() * 2 - 1;
        }
        while(x*x + y*y + z*z > 1);
        var v = new Vector(x,y,z);
        arrayZ.push(v);
      }
      arrayY.push(arrayZ);
    }
    arrayX.push(arrayY);
  }
  return arrayX;
}

function getPerlinNoise(noise, x, y, z){
  // Get relative positions
  var xp = (x+1)*.5*(noise.length-2);
  var yp = (y+1)*.5*(noise.length-2);
  var zp = (z+1)*.5*(noise.length-2);
  // Get indicies
  var xi = Math.floor(xp);
  var yi = Math.floor(yp);
  var zi = Math.floor(zp);
  // Get interpolation ratios
  var xl = xp - xi;
  var yl = yp - yi;
  var zl = zp - zi;

  // Get array direction values
  var v000= noise[xi][yi][zi];
  var v001 = noise[xi][yi][zi+1];
  var v010 = noise[xi][yi+1][zi];
  var v011 = noise[xi][yi+1][zi+1];
  var v100 = noise[xi+1][yi][zi];
  var v101 = noise[xi+1][yi][zi+1];
  var v110 = noise[xi+1][yi+1][zi];
  var v111 = noise[xi+1][yi+1][zi+1];

  // Set position values
  var p000 = new Vector(0,0,0);
  var p001 = new Vector(0,0,1);
  var p010 = new Vector(0,1,0);
  var p011 = new Vector(0,1,1);
  var p100 = new Vector(1,0,0);
  var p101 = new Vector(1,0,1);
  var p110 = new Vector(1,1,0);
  var p111 = new Vector(1,1,1);

  // Hermite interoplate positions
  var p00 = vectorHermite(p000, p001, v000, v000, xl);
  var p01 = vectorHermite(p010, p011, v010, v010, xl);
  var p10 = vectorHermite(p100, p101, v100, v100, xl);
  var p11 = vectorHermite(p110, p111, v110, v110, xl);

  var v00 = Vector.lerp(v000, v001, xl);
  var v01 = Vector.lerp(v010, v011, xl);
  var v10 = Vector.lerp(v100, v101, xl);
  var v11 = Vector.lerp(v110, v111, xl);

  var p0 = vectorHermite(p00, p01, v00, v01, yl);
  var p1 = vectorHermite(p10, p11, v10, v11, yl);

  var v0 = Vector.lerp(v00, v01, yl);
  var v1 = Vector.lerp(v10, v11, yl);

  var p = vectorHermite(p00, p01, v00, v01, zl);

  return Math.sqrt(p.dot(p));
}

function hermite(p0, p1, v0, v1, t){
  var a = 2*Math.pow(t,3) - 3*Math.pow(t,2) + 1;
  var b = -2*Math.pow(t,3) + 3*Math.pow(t,2);
  var c = Math.pow(t,3) - 2*Math.pow(t,2) + t;
  var d = Math.pow(t,3) - Math.pow(t,2);
  return a*p0 + b*p1 + c*v0 + c*v1;
}

function vectorHermite(p0, p1, v0, v1, t){
  return new Vector(
    hermite(p0.x, p1.x, v0.x, v1.x, t),
    hermite(p0.y, p1.y, v0.y, v1.y, t),
    hermite(p0.z, p1.z, v0.z, v1.z, t)
  );
}
