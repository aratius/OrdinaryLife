const Life = require("./life");
const Printer = require("../utils/printer")
const { Client } = require("node-osc")

const printer = new Printer("127.0.0.1", 8080)
const client = new Client("192.168.1.1", 8000)

let cnt = 0

/**
 *
 */
const app = async () => {
  cnt = 0
  while(true) {
    await doLife()
    await new Promise(r => setTimeout(() => setTimeout(r, 10000)))
    await doMessage()
    await new Promise(r => setTimeout(() => setTimeout(r, 10000)))
  }
}

/**
 * 人生
 */
const doLife = async () => {

  printer.add(`Ordinary life : ${cnt++}`)
  await new Promise(r => setTimeout(() => setTimeout(r, 3000)))

  const life = new Life()
  if(life.born()) {
    life.execute()
  } else {
    // 死産
  }
  const {events, sex, age} = life
  const sexId = sex == "male" ? 0 : 1

  for(let i = 0; i < events.length; i++) {
    const event = events[i]
    let text = `${event}:${age}:${sexId}:*`
    while(text.length < 30) text += "*"  // barCodeの長さを統一するためにパディング
    printer.add(`
{code:${text}; option:code128,4,240,nohri}
    `)
    client.send("/scanner", 1, () => {})
    await new Promise(r => setTimeout(() => setTimeout(r, 1000)))
  }

  await new Promise(r => setTimeout(() => setTimeout(r, 1000)))
  printer.add("\n\n\n\n\n")
}

/**
 * アイキャッチ的なかんじでメッセージ化作品名出す
 */
const doMessage = async () => {
  printer.add(`Existence - arata matsumoto`)
  await new Promise(r => setTimeout(() => setTimeout(r, 1000)))
  printer.add("\n\n\n\n\n")
}

app()