const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require("fs")

const download = async () => {
  const bucketParams = {
    Bucket: "polly-speeches",
  }

  const contents = await getlist(bucketParams)
  console.log(contents.length);
  if(!contents) return

  const keys = contents.map(e => e.Key)
  console.log("files in bucket : ");
  // keys.forEach(k => console.log(`- ${k}`))
  console.log("\n");

  const downloadTasks = []
  for(let i = 0; i < keys.length; i++) {
    downloadTasks.push(getFile({...bucketParams, Key: keys[i]}))
  }
  const data = await Promise.all(downloadTasks)

  const writeTasks = []
  for(let i = 0; i < data.length; i++) {
    const regDir = new RegExp(/^.*\//)
    const result = keys[i].match(regDir)
    if(result != null) {
      let current = "public/static/speeches/"
      mkdir(result[0], current, true)
    }
    writeTasks.push(writeFile(data[i], `public/static/speeches/${keys[i]}`, true))
  }
  const filenames = await Promise.all(writeTasks)
  console.log("file created : ");
  // filenames.forEach(f => console.log(`- ${f}`))
}

/**
 * バケット内のリストをすべて取得
 * @param {Object} params
 * @returns
 */
const getlist = async (params) => {
  try {
    const result = await new Promise((res, rej) => {
      s3.listObjects(params, (err, data) => {
        if(err) rej(err);
        else res(data);
      })
    })
    return result.Contents
  } catch(err) {
    console.warn("Error", err);
    return null
  }
}

/**
 *
 */
const getFile = async(params) => {
  try {
    const result = await new Promise((res, rej) => {
      s3.getObject(params, (err, data) => {
        if(err) rej(err)
        else res(data)
      })
    })
    return result.Body
  } catch(err) {
    console.warn("Error", err);
    return null
  }
}

/**
 *
 * @param {*} data
 * @param {string} filename
 * @returns
 */
const writeFile = async (data, filename) => {
  return new Promise((res, rej) => {
    const writer = fs.createWriteStream(filename);
    writer.on("finish", () => {
      res(filename)
    })
    writer.write(data);
    writer.end();
  })
}

/**
 *
 * @param {string} dir
 */
const mkdir = (dir, current) => {
  const directries = dir.split("/")
  directries.forEach(d => {
    if(d == "") return
    const dir = `${current}/${d}`
    if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir, (err) => err && console.warn(err))
    }
    current += d
  })
}

download()