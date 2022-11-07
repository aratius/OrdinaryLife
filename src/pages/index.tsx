import { SyntheticEvent, useEffect, useRef, useState } from "react";
import VoicePlayer from "src/lib/voicePlayer";
import { Sex } from "src/lib/life";
import styles from "src/styles/index.module.scss"

import Verbs from "server/verbs.json"

const DEFAULTS = {
  word: Verbs.verbs[0],
  age: 20,
  sex: Sex.male
}

/**
 * Index
 * @returns
 */
export default function Index() {

  const [word, setWord] = useState<string>(DEFAULTS.word)
  const [age, setAge] = useState<number>(DEFAULTS.age)
  const [sex, setSex] = useState<Sex>(DEFAULTS.sex)

  const player = useRef<VoicePlayer|null>(null)

  useEffect(() => {
    player.current = new VoicePlayer()
    player.current.init()
  }, [])

  /**
   *
   */
  const onSubmit = (e: SyntheticEvent) => {
    if(e && e.cancelable) e.preventDefault()
    player.current?.play(word, age, sex)
  }

  return (
    <div className={styles.container}>
      {/* word */}
      <form action="">
        <label htmlFor="">word</label>
        <select
          defaultValue={DEFAULTS.word}
          onChange={e => setWord(e.target.value)}
        >
          {Verbs.verbs.map((v, i) => {
            return <option key={i} value={v}>{v}</option>
          })}
        </select>
      </form>

      {/* age */}
      <form action="">
        <label htmlFor="">age</label>
        <input
          type="number"
          defaultValue={DEFAULTS.age}
          onChange={e => setAge(parseInt(e.target.value))}
        />
      </form>

      {/* sex */}
      <form action="">
        <label htmlFor="">sex</label>
        <select
          defaultValue={DEFAULTS.sex}
          onChange={e => setSex(parseInt(e.target.value))}
        >
          <option value={Sex.male}>male</option>
          <option value={Sex.female}>female</option>
        </select>
      </form>

      {/* play */}
      <form action="">
        <input
          type="submit"
          value="play"
          onClick={onSubmit}
        />
      </form>
    </div>
  )
}
