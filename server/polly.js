const axios = require("axios")

/**
 * polly
 * @param {Object} params
 */
const polly = async (params) => {

  const ENDPOINT = "https://9ecyfp9xol.execute-api.ap-northeast-1.amazonaws.com/Prd/"
  const {text, filename, voiceId} = params

  return new Promise((res, rej) => {
    axios.post(ENDPOINT, {
      "text": text,
      "filename": filename,
      "sex": "male",
      "age": 20,
      "origin": "https://polly-speeches.s3.amazonaws.com",
      "voiceId": voiceId,
      "bucketName": "polly-speeches"
    })
    .then(data => {
      console.log(`Speech has created : https://polly-speeches.s3.amazonaws.com/${filename}.mp3`)
      res(data)
    })
  })
}

module.exports = polly