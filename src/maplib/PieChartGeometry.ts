import { Buffer } from "@luma.gl/webgl";
import { createGLContext, setParameters } from "@luma.gl/gltools";

//experimental!!!

interface PieChartData {
  value: number;
  color: [number, number, number, number];
}

const gl = createGLContext();
setParameters(gl, {
  depthTest: true,
  depthFunc: gl.LEQUAL,
});

function calculatePieChartVertices(data: PieChartData[]): Float32Array {
  const vertices: number[] = [];
  const center: [number, number] = [0, 0]; // Center of the pie chart

  // Start with the center point
  vertices.push(center[0], center[1]);

  // Calculate the vertices for each data point
  let startAngle = 0;
  for (const slice of data) {
    const endAngle = startAngle + (slice.value / 100) * (2 * Math.PI);
    const startX = center[0] + Math.cos(startAngle);
    const startY = center[1] + Math.sin(startAngle);
    const endX = center[0] + Math.cos(endAngle);
    const endY = center[1] + Math.sin(endAngle);

    // Add the triangle vertices for the pie slice
    vertices.push(center[0], center[1], startX, startY, endX, endY);

    // Move to the next starting point for the next slice
    startAngle = endAngle;
  }

  return new Float32Array(vertices);
}

function calculatePieChartColors(data: PieChartData[]): Float32Array {
  const colors: number[] = [];

  for (const slice of data) {
    // Repeat the color for each vertex of the slice
    for (let i = 0; i < 3; i++) {
      colors.push(
        slice.color[0],
        slice.color[1],
        slice.color[2],
        slice.color[3]
      );
    }
  }

  return new Float32Array(colors);
}

const pieChartData: PieChartData[] = [
  { value: 30, color: [1, 0, 0, 1] }, // Red
  { value: 40, color: [0, 1, 0, 1] }, // Green
  { value: 20, color: [0, 0, 1, 1] }, // Blue
  // Add more data points as needed
];

const vertices = calculatePieChartVertices(pieChartData);
const colors = calculatePieChartColors(pieChartData);

const positionBuffer = new Buffer(gl, { data: vertices });
const colorBuffer = new Buffer(gl, { data: colors });

positionBuffer.setParameters({ positions: 2 });
colorBuffer.setParameters({ colors: 4 });

const pieChartGeometry = {
  attributes: {
    positions: positionBuffer,
    colors: colorBuffer,
  },
};
