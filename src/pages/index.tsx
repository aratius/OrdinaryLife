import { Chart, CategoryScale, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title} from 'chart.js'
import { useEffect, useRef, useState } from 'react';
import Life, { Sex } from '../lib/life';
import styles from '../styles/Home.module.css'
Chart.register(CategoryScale, LineController, LineElement, PointElement, LinearScale, Title);

export default function Home() {

  const [isCounting, setIsCounting] = useState<boolean>(true)

  const [events, setEvents] = useState<string[]>([])
  const [sex, setSex] = useState<Sex>(Sex.undefined)

  const [average, setAverage] = useState<number>(0)

  const isMounted = useRef<boolean>(false)
  const life = useRef<Life>(new Life())
  const lifeLimits = useRef<number[]>([])
  const chart = useRef<Chart|null>(null)

  useEffect(() => {
    if(isMounted.current) return
    count()
    isMounted.current = true
  }, [])

  const count = async () => {
    let cnt = 0
    while(cnt < 1000) {
      await new Promise(r => setTimeout(r, 1))
      life.current = new Life()
      const hasBorn = life.current.born()
      if (hasBorn) life.current.execute()

      setEvents(life.current.events)
      setSex(life.current.sex)

      lifeLimits.current.push(life.current.age)
      cnt ++
    }
    setIsCounting(false)
  }

  /**
   *
   * @param node
   */
  const onRefChart = (node: HTMLCanvasElement) => {
    if(!node || chart.current != null) return
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
          </>
        }
    </div>
  )
}
