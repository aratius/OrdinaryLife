import { useEffect, useRef, useState } from 'react';
import Life from '../lib/life';
import styles from '../styles/Home.module.css'

export default function Home() {

  const [events, setEvents] = useState<string[]>([])
  const [sex, setSex] = useState()

  const life = useRef<Life>(new Life())

  useEffect(() => {
    const hasBorn = life.current.born()
    if (hasBorn) life.current.execute()

    setEvents(life.current.events)
  }, [])

  return (
    <div className={styles.container}>
      <span>age : {events.length}</span>
      {events.map((e, i) => {
        return <p key={i}>{e}</p>
      })}
    </div>
  )
}
