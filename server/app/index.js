const Life = require("./life");
const Printer = require("../utils/printer")
const { Client } = require("node-osc");
const { Server } = require("ws")
const fs = require("fs");
const open = require("open")
const { execSync } = require('child_process');

const printer = new Printer("127.0.0.1", 8080)
const oscClient = new Client("192.168.2.101", 8000)
const wsServer = new Server({port: 8002})

let cnt = 0
const crr = process.cwd()

/**
 * main
 */
const app = async () => {
  // Next.jsのローカルサーバーを立ち上げ
  execSync("npm run dev")

  // ブラウザを開く
  open("http://localhost:3000/")

  // WebSocket接続待ち
  await new Promise((res, rej) => {
    wsServer.on("connection", async (msg) => {
      console.log("ws connected");
      res()
    })
  })

  await new Promise(r => setTimeout(() => setTimeout(r, 3000)))

  // 人数カウント
  cnt = await readCnt()

  // アプリのループ
  while(true) {
    await doLife()
    await new Promise(r => setTimeout(() => setTimeout(r, 10000)))
    await writeCnt()
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
    let text = `${event}/${age}/${sexId}/*`
    while(text.length < 17) text += "*"  // barCodeの長さを統一するためにパディング
    printer.add(`
{code:${text}; option:code128,1,240,nohri}
    `)
    oscClient.send("/scanner/switch", 0, () => {})
    oscClient.send("/scanner/switch", 1, () => {})
    wsServer.clients.forEach((client) => {
      client.send(text)
    })
    await new Promise(r => setTimeout(() => setTimeout(r, 5000)))
  }

  await new Promise(r => setTimeout(() => setTimeout(r, 1000)))
  printer.add("\n\n\n\n\n")
}

/**
 * アイキャッチ的なかんじでメッセージ化作品名出す
 */
const doMessage = async () => {
  printer.add(`{code:Existence - arata matsumoto; option:qrcode,8,L}`)
  await new Promise(r => setTimeout(() => setTimeout(r, 1000)))
  printer.add("\n\n\n\n\n")
}

/**
 * cnt.txtを更新
 */
const writeCnt = () => {
  return new Promise((res, rej) => {
    fs.writeFile(`${crr}/server/json/cnt.txt`, cnt.toString(), (err) => {
      if(err) rej(err)
      res()
    })
  })
}

/**
 * cnt.txtを読み込み
 * @returns
 */
const readCnt = () => {
  return new Promise((res, rej) => {
    fs.readFile(`${crr}/server/json/cnt.txt`, "utf-8", (err, data) => {
      if(err) rej(err)
      else res(parseInt(data))
    })
  })
}

app()