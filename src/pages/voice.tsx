import { FocusEventHandler, SyntheticEvent, useEffect, useRef, useState } from "react";
import VoicePlayer from "src/lib/voicePlayer";
import styles from "src/styles/app.module.scss"

import { FormInput } from "src/components/formInput";
import Link from "next/link";

/**
 * Index
 * @returns
 */
export default function Index() {

  const [mode, setMode] = useState<string>("idle")
  const [hasInitialized, setHasInitialized] = useState<boolean>(false)
  const player = useRef<VoicePlayer|null>(null)

  useEffect(() => {
    player.current = new VoicePlayer()
    player.current.init()
  }, [])

  /**
   * on data
   * @param word
   * @param age
   * @param sex
   */
  const onData = (word: string, age: number, sex: number) => {
    player.current?.play(word, age, sex)
  }

  const onInit = (e: SyntheticEvent) => {
    if(e && e.cancelable) e.preventDefault()
    setHasInitialized(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Existence</h1>
        <span>{mode}</span>
      </div>
      {
        hasInitialized ?
        <>
          <FormInput
            onData={onData}
          />
        </> :
        <form action="">
          <input
            type="submit"
            value="init"
            onClick={onInit}
          />
        </form>
      }
      <br/>
      <Link href="/system" className={styles.link}>{"戻る"}</Link>
    </div>
  )
}
