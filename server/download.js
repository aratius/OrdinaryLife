const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require("fs")

const download = async () => {
  const bucketParams = {
    Bucket: "life-speech",
  }

  const contents = await getlist(bucketParams)
  if(!contents) return

  const keys = contents.map(e => e.Key)
  console.log(`file list in bucket : \n${keys.join(",\n")}`);

  const downloadTasks = []
  for(let i = 0; i < keys.length; i++) {
    downloadTasks.push(getFile({...bucketParams, Key: keys[i]}))
  }
  const data = await Promise.all(downloadTasks)

  const writeTasks = []
  for(let i = 0; i < data.length; i++) {
    const regDir = new RegExp(/^.*\//)
    const result = keys[i].match(regDir)
    if(result != null) fs.mkdir(`public/static/speeches/${result[0]}`, (err) => err && console.warn(err))
    writeTasks.push(writeFile(data[i], `public/static/speeches/${keys[i]}`))
  }
  await Promise.all(writeTasks)


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

const writeFile = async (data, filename) => {
  return new Promise((res, rej) => {
    const writer = fs.createWriteStream(filename);
    writer.on("finish", () => {
      console.log("success");
      res()
    })
    writer.write(data);
    writer.end();
  })
}

download()