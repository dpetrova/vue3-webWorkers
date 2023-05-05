/*
Parallel rendering of chart with web workers 
*/

const window = self;
importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.0.0-beta/chart.min.js"
);

onmessage = (event) => {
  const { canvas, config } = event.data;
  const chart = new Chart(canvas, config);

  // Resizing the chart must be done manually, since OffscreenCanvas does not include event listeners
  canvas.width = 500;
  canvas.height = 500;
  chart.resize();
};
