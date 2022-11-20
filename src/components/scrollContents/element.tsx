import { FC, ReactElement, useRef, useState } from "react";

interface Props {
  text: string;
  elementOnComplete?: ReactElement;
  onRef: (element: HTMLLIElement, onIntersect: () => void) => void
}

export const ScrollElement: FC<Props> = (props: Props) => {

  const [isAnimated, setIsAnimated] = useState<boolean>(false)
  const [text, setText] = useState<string>("_")

  const mounted = useRef(false)

  const animate = () => {
    return new Promise(res => {
      for(let i = 0; i < props.text.length; i++) {
        setTimeout(() => {
          setText(props.text.split("").slice(0, i+1).join("") + "_")

          if(i == props.text.length-5) res(null)
          if(i == props.text.length - 1) setIsAnimated(true)
        }, i * 50 + 500)
      }
    })

  }

  const onRef = (node: HTMLLIElement) => {
    if(node != null) {
      if(mounted.current) return
      props.onRef(node, animate)
      mounted.current = true
    }
  }

  return (
    <li ref={onRef}>
      {
        isAnimated ?
        <>
          {props.elementOnComplete || props.text}
        </> :
        <>
          {text}
        </>
      }
    </li>
  )

}