import { FocusEventHandler, useEffect, useRef, useState } from "react";
import VoicePlayer from "src/lib/voicePlayer";
import styles from "src/styles/index.module.scss"

import { VoiceForm } from "src/components/voiceForm";
import { ScannerInput } from "src/components/scannerInput";
import { WsInput } from "src/components/wsInput";


/**
 * Index
 * @returns
 */
export default function Index() {

  const [mode, setMode] = useState<string>("")
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

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Existence</h1>
        <span>{mode}</span>
      </div>
      <ScannerInput
        onData={onData}
        onFocus={onFocusInput}
        onBlur={onBlurInput}
      />
      <VoiceForm
        onData={onData}
      />
      <WsInput
        onData={onData}
      />
    </div>
  )
}
