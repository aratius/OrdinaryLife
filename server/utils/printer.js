const http = require("http")

const WAIT_TIME = 1000

module.exports = class Printer {

  _host = ""
  _port = ""
  _waitList = []

  constructor(host, port) {
    this._host = host
    this._port = port
  }

  add(text) {
    this._waitList.push(text)
    if(this._waitList.length == 1) {
      this._processPrintTasks()
    }
  }

  /**
   * process print tasks
   */
  async _processPrintTasks() {
    while(this._waitList.length > 0) {
      const arr = [...this._waitList]
      const text = arr.shift()
      this._print(text)
      await new Promise(r => setTimeout(r, WAIT_TIME))
      this._waitList = arr
    }
  }

  /**
   * print
   */
  _print(text) {
    const req = http.request(
      {
        host: this._host,
        port: this._port,
        path: "/tm_series1",
        method: "POST",
        headers: {
          "Content-Type": "text/plain; charset=utf-8"
        }
      }
    )
    req.write(text)
    req.end()
  }

}
