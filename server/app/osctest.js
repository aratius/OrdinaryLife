const Osc = require("node-osc")
const oscClient = new Osc.Client("192.168.11.100", 8003)

/**
 * main
 */
const app = async () => {
  console.log("### an app launched");

  setInterval(() => {
    oscClient.send("/input", 1);
    console.log("out");
  }, 1000)
}

app()