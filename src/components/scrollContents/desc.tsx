import { FC } from "react";
import styles from "src/styles/index.module.scss"

interface Props {

}

export const ScrollContents: FC<Props> = (props: Props) => {

  return (
    <ul className={styles.messages}>
      <li>流れ行く<i>Receipt</i>と</li>
      <li>それに印刷される<i>Barcode</i>は,</li>
      <li>過去を生きた名もない人生の</li>
      <li>アーカイヴとしての役割を持つ.</li>
      <li>彼らは皆,至って普通の人生を全うした.</li>
      <li>しかし今となっては,誰も彼らの名前を知らない.</li>
      <li>彼らがかつて,この地球上のどこかに</li>
      <li>存在したことにすらも気づかない.</li>
      <li>彼らひとりひとりの存在が,</li>
      <li>今の私達の存在に繋がっていることは言うまでもない.</li>
      <li>打って変わって,時には歴史に名を残すような人生もある.</li>
      <li>彼らの存在は,あらゆる文献によって後世まで広く認知されることとなる.</li>
      <li>しかしそれも,それを認知する人間という種族が存続する限りである.</li>
      <li>つまり本質的には,個人の存在はその功績には依存しない.</li>
      <li>全てはいずれ忘れ去られるからである.</li>
      <li>つまり存在とは,他からの認知・承認を必要としないものだと考える.</li>
    </ul>
  )

}