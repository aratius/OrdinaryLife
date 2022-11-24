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
  const callbacks = useRef<({element: HTMLLIElement, onIntersect: () => Promise<void>}[])>([])

  useEffect(() => {
    if(!observer.current) initObserver()
  }, [])

  const initObserver = () => {
    observer.current = new IntersectionObserver(onIntersect, {
      rootMargin: "-100px"
    })
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

  const onRefElement = (element: HTMLLIElement, onIntersect: () => Promise<void>) => {
    if(!observer.current) initObserver()
    if(callbacks.current.filter(c => c.element == element).length == 0) {
      observer.current?.observe(element)
      callbacks.current.push({element, onIntersect})
    }
  }

  return (
    <ul className={styles.messages}>
      <ScrollElement
        text="流れ行くレシートと"
        onRef={onRefElement}
      />
      <ScrollElement
        text="それに印刷されるバーコードは,"
        onRef={onRefElement}
      />
      <ScrollElement
        text="過去を生きた名もなき人生のアーカイヴである."
        onRef={onRefElement}
      />
      <ScrollElement
        text="鑑賞者はスキャナでバーコードを読み取ることで,"
        onRef={onRefElement}
      />
      <ScrollElement
        text="アーカイヴされた名もなき人生の存在に気づく."
        onRef={onRefElement}
      />
      <ScrollElement
        text="彼らは皆,至って普通の人生を全うした."
        onRef={onRefElement}
      />
      <ScrollElement
        text="しかし今となっては,誰も彼らの名前を知らない."
        onRef={onRefElement}
      />
      <ScrollElement
        text="彼らがかつて,この地球上のどこかに"
        onRef={onRefElement}
      />
      <ScrollElement
        text="存在したことにすらも気づかない."
        onRef={onRefElement}
      />
      <ScrollElement
        text="彼らひとりひとりの存在が,"
        onRef={onRefElement}
      />
      <ScrollElement
        text="今の私達の存在に繋がっていることは言うまでもない."
        onRef={onRefElement}
      />
      <ScrollElement
        text="打って変わって,時には歴史に名を残すような人生もある."
        onRef={onRefElement}
      />
      <ScrollElement
        text="彼らの存在は,あらゆる文献によって後世まで広く認知されることとなる."
        onRef={onRefElement}
      />
      <ScrollElement
        text="しかしそれも,それを認知する人間という種族が存続する限りである."
        onRef={onRefElement}
      />
      <ScrollElement
        text="つまり本質的には,個人の存在はその功績には依存しない."
        onRef={onRefElement}
      />
      <ScrollElement
        text="全てはいずれ忘れ去られるからである."
        onRef={onRefElement}
      />
      <ScrollElement
        text="つまり存在とは,他からの認知・承認を必要としないものだと考える."
        onRef={onRefElement}
      />
    </ul>
  )

}