const polly = require("./polly")
const verbs = require("./verbs.json")
const voiceIds = require("./voiceIds.json")

/**
 * 音源の作成
 * 音源とファイルパスを紐付けたjsonをつくる
 */
const createPolly = async () => {
  const tasks = []

  const createPerPeron = (voiceId) => {
    const t = []
    verbs.verbs.forEach(v => {
      t.push(polly({ text: v, filename: `${voiceId}/${v}`, voiceId }))
    })
    return t
  }

  for(const key in voiceIds.male) {
    tasks.push(...createPerPeron(voiceIds.male[key]))
  }
  for(const key in voiceIds.female) {
    tasks.push(...createPerPeron(voiceIds.female[key]))
  }

  const res = await Promise.all(tasks)
  console.log(`${res.length} files has created.`);
  console.log("\ndone.");
}

createPolly()