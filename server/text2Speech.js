const polly = require("./polly")

const text2Speech = async () => {

  const text = process.argv[2]
  const filename = process.argv[3] || Date.now().toString()
  const voiceId = process.argv[4] || "Justin"

  polly({ text, filename, voiceId })
}

text2Speech()