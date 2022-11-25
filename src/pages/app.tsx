import { FocusEventHandler, SyntheticEvent, useEffect, useRef, useState } from "react";
import VoicePlayer from "src/lib/voicePlayer";
import styles from "src/styles/app.module.scss"

import { VoiceForm } from "src/components/voiceForm";
import { ScannerInput } from "src/components/scannerInput";
import { WsInput } from "src/components/wsInput";


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

  /**
   *
   */
  const onFocusInput: FocusEventHandler = (e) => {
    setMode("scanner")
  }

  /**
   *
   */
  const onBlurInput: FocusEventHandler = (e) => {
    setMode("form")
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
          <ScannerInput
            onData={onData}
            onFocus={onFocusInput}
            onBlur={onBlurInput}
          />
          <br/><br/>
          <VoiceForm
            onData={onData}
          />
          <br/>
          <WsInput
            onData={onData}
          />
        </> :
        <form action="">
          <input
            type="submit"
            value="play"
            onClick={onInit}
          />
        </form>
      }
    </div>
  )
}
