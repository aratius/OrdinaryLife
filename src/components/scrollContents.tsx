import { FC } from "react";
import styles from "src/styles/index.module.scss"

interface Props {

}

export const ScrollContents: FC<Props> = (props: Props) => {

  return (
    <ul className={styles.messages}>
      <li>hello</li>
      <li>hello</li>
      <li>hello</li>
      <li>hello</li>
    </ul>
  )

}