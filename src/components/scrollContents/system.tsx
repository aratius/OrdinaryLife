import { FC, useEffect, useRef } from "react";
import styles from "src/styles/index.module.scss"
import { Queue } from "src/utils";
import { ScrollElement } from "./element";

interface Props {

}

/**
 *
 * @param props
 * @returns
 */
export const ScrollContents: FC<Props> = (props: Props) => {

  const queue = useRef(new Queue())
  const observer = useRef<IntersectionObserver|null>(null)
  const callbacks = useRef<({element: HTMLLIElement, onIntersect: () => void}[])>([])

  useEffect(() => {
    if(!observer.current) initObserver()
  }, [])

  const initObserver = () => {
    observer.current = new IntersectionObserver(onIntersect, {})
  }

  const onIntersect = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting) {
        callbacks.current.forEach((callback, i) => {
          if(callback.element == entry.target) {
            queue.current.add(callback.onIntersect)
            callbacks.current.splice(i, 1)
            observer.current?.unobserve(entry.target)
          }
        })
      }
    })
  }

  const onRefElement = (element: HTMLLIElement, onIntersect: () => void) => {
    if(!observer.current) initObserver()
    if(callbacks.current.filter(c => c.element == element).length == 0) {
      observer.current?.observe(element)
      callbacks.current.push({element, onIntersect})
    }
  }

  return (
    <ul className={styles.messages}>
      <ScrollElement
        text="厚生労働省が発表している"
        onRef={onRefElement}
      />
      <ScrollElement
        text="平均寿命データを実装したモデル"
        elementOnComplete={
          <>
            <a
              href="https://www.mhlw.go.jp/toukei/saikin/hw/life/life21/dl/life18-15.pdf"
              target="_blank"
              rel="noreferrer"
            >
              平均寿命データ
            </a>
            を実装したモデル
          </>
        }
        onRef={onRefElement}
      />
      <ScrollElement
        text="がランダムな寿命を生成する."
        onRef={onRefElement}
      />
      <ScrollElement
        text="寿命の年数分の平凡なライフイベントを,"
        onRef={onRefElement}
      />
      <ScrollElement
        text="動詞,性別,年齢をエンコードしたバーコードとしてプリントする."
        onRef={onRefElement}
      />
      <ScrollElement
        text="スキャナでバーコードを読み取ることで,"
        onRef={onRefElement}
      />
      <ScrollElement
        text="動詞,性別,年齢がデコードされ,"
        onRef={onRefElement}
      />
      <ScrollElement
        text="AIによって生成された自動音声で再生される."
        onRef={onRefElement}
      />

    </ul>
  )

}