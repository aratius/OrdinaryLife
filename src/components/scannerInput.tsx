import { FC, SyntheticEvent, useRef, useState } from "react";

interface Props {
  onData: (word: string, age: number, sex: number) => void
}

/**
 *
 * @param props
 * @returns
 */
export const ScannerInput: FC<Props>  = (props: Props)=> {

  const inputTimer = useRef<NodeJS.Timer|null>(null)

  /**
   * on change
   * @param e
   */
  const onChange = (e: SyntheticEvent) => {
    if(inputTimer.current) clearTimeout(inputTimer.current)
    inputTimer.current = setTimeout(() => {
      const [word, age, sex] = (e.target as HTMLInputElement).value.split(",");
      (e.target as HTMLInputElement).value = "";
      onEndInput(word, parseInt(age), parseInt(sex))
    }, 100);
  }

  /**
   *
   */
  const onEndInput = (word: string, age: number, sex: number) => {
    props.onData(word, age, sex)
  }

  return (
    <>
      <h2>Scanner input</h2>
      <input type="text" onChange={onChange}/>
    </>
  )

}
