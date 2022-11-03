import { useEffect, useRef, useState } from 'react';
import Life, { Sex } from '../lib/life';
import styles from '../styles/Home.module.css'

export default function Home() {

  const [events, setEvents] = useState<string[]>([])
  const [sex, setSex] = useState<Sex>(Sex.undefined)

  const life = useRef<Life>(new Life())

  useEffect(() => {
    setInterval(() => {
      life.current = new Life()
      const hasBorn = life.current.born()
      if (hasBorn) life.current.execute()

      setEvents(life.current.events)
      setSex(life.current.sex)
      if(life.current.age < 50) console.log(life.current.age);
    }, 100)
  }, [])

  return (
    <div className={styles.container}>
      <p>age : {events.length}</p>
      <p>sex : {sex == Sex.male ? "male" : sex == Sex.female ? "female" : "undefined"}</p>
      <div>
        {events.map((e, i) => {
          return <p key={i}>{e}</p>
        })}
      </div>
    </div>
  )
}
