
varying vec2 vUv;
uniform float time;
void main() {
vUv = uv;

// Create an offset of the points from their original position.
vec3 newPosition = position;
newPosition.x += 0.5;
vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0 );

// Creates sin curves
// newPosition.z += sin(time + position.x*10.)*0.5;
// mvPosition = modelViewMatrix * vec4(newPosition, 1.0);

/*
* gl_PointSize controls Three.Points() size
*/ 
gl_PointSize = ( 10.0 / -mvPosition.z );
gl_Position = projectionMatrix * mvPosition;
}

