import { Chart, CategoryScale, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title} from 'chart.js'
import Link from 'next/link';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import Life, { Sex } from '../lib/life';
import styles from '../styles/test.module.scss'
Chart.register(CategoryScale, LineController, LineElement, PointElement, LinearScale, Title);

/**
 * Test
 * @returns
 */
export default function Test() {

  const [isCounting, setIsCounting] = useState<boolean>(true)
  const [isSlow, setIsSlow] = useState<boolean>(false)

  const [events, setEvents] = useState<string[]>([])
  const [sex, setSex] = useState<Sex>(Sex.undefined)

  const [average, setAverage] = useState<number>(0)
  const [prog, setProg] = useState<number>(0)

  const isMounted = useRef<boolean>(false)
  const life = useRef<Life>(new Life())
  const lifeLimits = useRef<number[]>([])
  const chart = useRef<Chart|null>(null)

  useEffect(() => {
    if(isMounted.current) return
    count()
    isMounted.current = true
  }, [])

  useEffect(() => {
    setIsCounting(true)
    setProg(0)
  }, [isSlow])

  useEffect(() => {
    if(isCounting) count()
  }, [isCounting])

  const count = async () => {
    let cnt = 0
    lifeLimits.current = []
    const max = isSlow ? 30 : 1000
    while(cnt < max) {
      const wait = isSlow ? 1000 : 1
      await new Promise(r => setTimeout(r, wait))
      life.current = new Life()
      const hasBorn = life.current.born()
      if (hasBorn) life.current.execute()

      setEvents(life.current.events)
      setSex(life.current.sex)
      setProg(cnt / max)

      lifeLimits.current.push(life.current.age)
      cnt ++
    }
    setIsCounting(false)
  }

  const onClickSpeed: MouseEventHandler = (e) => {
    if(e && e.cancelable) e.preventDefault()
    setIsSlow(!isSlow)
  }

  /**
   *
   * @param node
   */
  const onRefChart = (node: HTMLCanvasElement) => {
    if(!node) return
    if(chart.current) chart.current.destroy()
    const limits = [...lifeLimits.current]
    const max = limits.reduce((a, b) => Math.max(a, b))
    const ave = limits.reduce((a, b) => a + b) / limits.length
    const ageData = new Array(max).fill(0)
    for(let i = 0; i < limits.length; i++) {
      ageData[limits[i]] ++
    }

    setAverage(ave)

    chart.current = new Chart(
      node,
      {
        type: "line",
        data: {
          labels: new Array(max).fill(0).map((_, i) => i),
          datasets: [{
            label: "",
            fill: true,
            data: ageData,
            borderColor: "#fff",
            tension: .01
          }]
        }
      }
    )
  }

  return (
    <div className={styles.container}>
        {
          isCounting ?
          <>
            <span
              className={styles.bar}
              style={{width: `${prog * 100}%`}}
            ></span>
            <p>age : {events.length}</p>
            <p>sex : {sex == Sex.male ? "male" : sex == Sex.female ? "female" : "undefined"}</p>
            <div>
                  {events.map((e, i) => {
                    return <p key={i}>{e}</p>
                  })}
            </div>
          </>:
          <>
            <p>average: {average}</p>
            <canvas ref={onRefChart}></canvas>
            <br/>
            <a
              className={styles.link}
              onClick={onClickSpeed}
            >
              {`> ${isSlow ? "はやく" : "ゆっくり"}`}
            </a>
            <br/>
            <br/>
            <Link href="/system" className={styles.link}>{"> 戻る"}</Link>
          </>
        }
    </div>
  )
}
