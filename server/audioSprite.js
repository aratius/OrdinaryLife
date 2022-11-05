const fs = require("fs")
const audiosprite = require('audiosprite')
const glob = require("glob")
const crrDir = process.cwd();

const EXCLUES = /.DS_Store|sprite/

const createSprite = async (...voiceIds) => {
  console.log(crrDir);
  const detectFileTasks = []
  detectFileTasks.push(
    ...(voiceIds.map(async (voiceId) => {
      if(!fs.existsSync(`${crrDir}/public/static/speeches/${voiceId}/sprite`)) fs.mkdirSync(`${crrDir}/public/static/speeches/${voiceId}/sprite`)
      return new Promise((res, rej) => {
        glob(`${crrDir}/public/static/speeches/${voiceId}/*.mp3`, (err, files) => {
          // フルパスをファイル名に
          // files = files.map(f => f.match(/[^/]+$/)[0])
          res({
            voiceId: [voiceId],
            files
          })
        });
      })
    }))
  )

  const results = await Promise.all(detectFileTasks)

  console.log(results);
  results.forEach(async result => {
    const { voiceId, files } = result
    const option = {
      output: `${crrDir}/public/static/speeches/${voiceId}/sprite/data`,
      format: "howler"
    }

    try {
      const data = await new Promise((res, rej) => {
        audiosprite(files, option, (err, data) => {
          if(err) rej(err)
          else res(data)
        })
      })

      fs.writeFile(
        `${crrDir}/public/static/speeches/${voiceId}/sprite/data.json`,
        JSON.stringify(data),
        (e) => e && console.warn(e)
      )
    } catch(err) {
      console.warn(err);
    }

  })

}

const voiceIds = process.argv.filter((a => a.match(/Justin|Kevin|Matthew|Joey|Ivy|Salli|Joanna|Kimberly/) != null))
createSprite(...voiceIds)

module.exports = createSprite