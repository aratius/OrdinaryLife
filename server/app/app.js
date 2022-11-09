const Life = require("./life");

/**
 *
 */
const app = () => {
  const life = new Life()
  life.born()
  life.execute()
  console.log(life.events);
}

app()