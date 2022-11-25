import gsap from "gsap";
import { FC, FocusEventHandler, SyntheticEvent, useEffect, useRef, useState } from "react";
import styles from "src/styles/index.module.scss"

interface Props {
  onLoad: () => void
}

/**
 *
 * @param props
 * @returns
 */
export const Loading: FC<Props>  = (props: Props)=> {

  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    setTimeout(load, 1000)
  }, [])

  const load = () => {
    const v = {v: 0}
    gsap.to(v, {
      v: 1,
      duration: 2,
      ease: "expo.out",
      onUpdate: () => setProgress(v.v),
      onComplete: props.onLoad
    })
  }

  const hideClass = progress == 1 ? styles.hide : ""

  return (
    <section
      className={`${styles.loading} ${hideClass}`}
    >
      <p>
        Existence
      </p>
      <div className={styles.bar} style={{width: `${progress * 100}%`}}></div>
    </section>
  )

}
