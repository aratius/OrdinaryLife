import { SyntheticEvent, useEffect, useRef, useState } from "react";
import VoicePlayer from "src/lib/voicePlayer";
import { Sex } from "src/lib/life";
import styles from "src/styles/index.module.scss"

import Verbs from "server/verbs.json"
import { VoiceForm } from "src/components/voiceForm";
import { ScannerInput } from "src/components/scannerInput";


/**
 * Index
 * @returns
 */
export default function Index() {


  const player = useRef<VoicePlayer|null>(null)

  useEffect(() => {
    player.current = new VoicePlayer()
    player.current.init()
    console.log(Sex.male);

  }, [])

  /**
   * on data
   * @param word
   * @param age
   * @param sex
   */
  const onData = (word: string, age: number, sex: number) => {
    player.current?.play(word, age, sex)
    console.log("onData", word, age, sex);
  }


  return (
    <div className={styles.container}>
      <h1>Existence</h1>
      <ScannerInput
        onData={onData}
      />
      <VoiceForm
        onData={onData}
      />
    </div>
  )
}
