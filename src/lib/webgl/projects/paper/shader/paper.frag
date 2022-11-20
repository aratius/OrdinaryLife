#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#include <common>

varying vec3 vNormal;
varying vec3 vNormalRaw;
varying vec2 vUv;

uniform sampler2D uBarCode;
uniform float uTime;

const vec3 lightVec = - vec3(1., 1., 1.);

void main() {
	vec2 coord = vUv;
	const float interval = 1.3;
	vec2 fracted = fract(coord * vec2(1., 90.) / interval + vec2(0., uTime * -2.3)) * interval;
	vec2 floored = floor(coord * vec2(1., 90.) / interval + vec2(0., uTime * -2.3)) * interval;
	// vec4 color = texture2D(uBarCode, fracted);
	vec4 color = vec4(1.);
	color.rgb = vec3(step(snoise2(vec2(fracted.x * (sin(uTime)+1.)*50., floored.y)), 0.));
	if(fracted.y > .9 || fracted.y < .1 || coord.x > .95 || coord.x < .05) color.rgb = vec3(1.);
	if(vNormalRaw.z == -1.) color.rgb = vec3(1.);  // 裏面
	if(vNormalRaw.x == 1. || vNormalRaw.x == -1.) color.rgb = vec3(1.);  // 側面

	float amount = dot(vNormal, normalize(lightVec));
	amount += 1.;
	amount *= .5;
	color.rgb *= amount;

	// 紙の質感
	color.rgb += vec3(snoise2(fracted * vec2(100., 100.)) * .1);

	gl_FragColor = color;
}