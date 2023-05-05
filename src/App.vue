<script setup>
import { ref, onMounted } from "vue";

/* fetching images */
const dogImage = ref(null);
const counter = ref(0);

const getDogImage = () => {
  fetch("https://dog.ceo/api/breeds/image/random")
    .then((response) => response.json())
    .then((data) => {
      dogImage.value = data.message;
    });
};

/* chart */
const config = {
  type: "line",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Sample Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        lineTension: 0.1,
      },
    ],
  },
};

/* Countdown worker */
// check that the browser supports Workers then we instantiate a new Worker class
const worker = window.Worker
  ? new Worker("/src/workers/countdown-worker.js")
  : null;
worker.postMessage("");

/* Chart worker */
const chartWorker = new Worker("/src/workers/chart-worker.js");

onMounted(() => {
  /* image fetching */
  // call the getDogImage method the first time
  getDogImage();

  // set up an onmessage listener on Countdown worker object to listen to updates from the worker thread
  worker.onmessage = (e) => {
    // check if the counter value sent by the worker is divisible by 10, and if it is, call the getDogImage method again
    counter.value = e.data;
    if (counter.value % 10 === 0) {
      getDogImage();
    }
  };

  /* chart render */
  //send message to Chart worker
  const canvas = document.getElementById("canvas");
  const offscreenCanvas = canvas.transferControlToOffscreen();
  chartWorker.postMessage({ canvas: offscreenCanvas, config }, [
    offscreenCanvas,
  ]);
});
</script>

<template>
  <div class="dog-image">
    <img v-if="dogImage" :src="dogImage" />
  </div>
  <p v-if="counter">{{ counter }}</p>
  <canvas id="canvas" width="500" height="300"></canvas>
</template>

<style scoped></style>
