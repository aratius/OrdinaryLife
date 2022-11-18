import { FC, useEffect, useState } from "react";
import styles from "src/styles/index.module.scss"

interface Props {
  onData: (word: string, age: number, sex: number) => void
}

/**
 *
 * @param props
 * @returns
 */
export const WsInput: FC<Props>  = (props: Props)=> {

  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const sock = new WebSocket("ws://127.0.0.1:8002")
    sock.addEventListener("open", (e) => {
      console.log("Socket connected");
    })
    sock.addEventListener("message", (e) => {
      const [word, age, sex] = e.data.split("/");
      console.log(e.data)
      props.onData(word, age, sex)
      setIsActive(true)
      setTimeout(() => {
        setIsActive(false)
      }, 1000)
    })
  }, [])

  return (
    <>
      <h2>WebSocket input</h2>
      <div className={`${styles.lamp} ${isActive ? styles.active : ""}`}></div>
    </>
  )

}