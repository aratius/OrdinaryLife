import { FC, useEffect, useRef, useState } from "react";
import styles from "src/styles/index.module.scss"

interface Props {
  onData: (word: string, age: number, sex: number) => void,
  sendData?: string
}

/**
 *
 * @param props
 * @returns
 */
export const Ws: FC<Props>  = (props: Props)=> {

  const [isActive, setIsActive] = useState(false)
  const sock = useRef<WebSocket>()

  useEffect(() => {
    sock.current = new WebSocket("ws://127.0.0.1:8002")
    sock.current.addEventListener("open", (e) => {
      console.log("Socket connected");
    })
    sock.current.addEventListener("message", onMessage)
  }, [])

  useEffect(() => {
    if(props.sendData) {
      console.log("send ws", props.sendData)
      sock.current?.send(props.sendData);
    }
  }, [props.sendData])

  const onMessage = (e: any) => {
    const [word, age, sex] = e.data.split("/");
      console.log(e.data)
      props.onData(word, age, sex)
      setIsActive(true)
      setTimeout(() => {
        setIsActive(false)
      }, 1000)
  }

  return (
    <>
      <h2>WebSocket input</h2>
      <div className={`${styles.lamp} ${isActive ? styles.active : ""}`}></div>
    </>
  )

}