import { FC } from "react";
import styles from "src/styles/index.module.scss"

interface Props {

}

export const ScrollContents: FC<Props> = (props: Props) => {

  return (
    <ul className={styles.messages}>
      <li>厚生労働省が発表している</li>
      <li>
        <a
          href="https://www.mhlw.go.jp/toukei/saikin/hw/life/life21/dl/life18-15.pdf"
          target="_blank"
          rel="noreferrer"
        >
          平均寿命データ
        </a>
        を実装したモデル
      </li>
      <li>がランダムな寿命を生成する.</li>
      <li>寿命の年数分の平凡なライフイベントを,</li>
      <li>動詞,性別,年齢をエンコードしたバーコードとしてプリントする.</li>
      <li>スキャナでバーコードを読み取ることで,</li>
      <li>動詞,性別,年齢がデコードされ,</li>
      <li>AIによって生成された自動音声で再生される.</li>

    </ul>
  )

}