const Osc = require("node-osc")
const oscClient = new Osc.Client("192.168.0.255", 8003)

/**
 * main
 */
const app = async () => {
  console.log("### an app launched");

  setInterval(() => {
    oscClient.send("/input", 1);
  }, 1000)
}

app()