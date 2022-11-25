import { Howl, SoundSpriteDefinitions } from "howler";
import { Sex } from "./life";

import IvySpriteJson from "public/static/speeches/Ivy/sprite/data.json";
import JoannaSpriteJson from "public/static/speeches/Joanna/sprite/data.json";
import JoeySpriteJson from "public/static/speeches/Joey/sprite/data.json";
import JustinSpriteJson from "public/static/speeches/Justin/sprite/data.json";
import KevinSpriteJson from "public/static/speeches/Kevin/sprite/data.json";
import KimberlySpriteJson from "public/static/speeches/Kimberly/sprite/data.json";
import MatthewSpriteJson from "public/static/speeches/Matthew/sprite/data.json";
import SalliSpriteJson from "public/static/speeches/Salli/sprite/data.json";

import VoiceIds from "server/json/voiceIds.json";

/**
 * Voice player
 */
export default class VoicePlayer {

  private _players: { [key: string]: Howl | null; } = {
    ivy: null,
    joanna: null,
    joey: null,
    justin: null,
    kevin: null,
    kimberly: null,
    matthew: null,
    salli: null
  };

  /**
   * constructor
   */
  constructor() { }

  /**
   * init
   */
  public init(): void {
    // 絶対パスをこのプロジェクトの相対パスに変換
    const pickPath = (path: string) => {
      const res = path.match(/\/static.*/);
      if (res) return res[0];
      return "";
    };

    this._players.ivy = new Howl({
      src: IvySpriteJson.urls.map(u => pickPath(u)),
      sprite: (IvySpriteJson.sprite as any as SoundSpriteDefinitions),
      html5: true
    });

    this._players.joanna = new Howl({
      src: JoannaSpriteJson.urls.map(u => pickPath(u)),
      sprite: (JoannaSpriteJson.sprite as any as SoundSpriteDefinitions),
      html5: true
    });

    this._players.joey = new Howl({
      src: JoeySpriteJson.urls.map(u => pickPath(u)),
      sprite: (JoeySpriteJson.sprite as any as SoundSpriteDefinitions),
      html5: true
    });

    this._players.justin = new Howl({
      src: JustinSpriteJson.urls.map(u => pickPath(u)),
      sprite: (JustinSpriteJson.sprite as any as SoundSpriteDefinitions),
      html5: true
    });

    this._players.kevin = new Howl({
      src: KevinSpriteJson.urls.map(u => pickPath(u)),
      sprite: (KevinSpriteJson.sprite as any as SoundSpriteDefinitions),
      html5: true
    });

    this._players.kimberly = new Howl({
      src: KimberlySpriteJson.urls.map(u => pickPath(u)),
      sprite: (KimberlySpriteJson.sprite as any as SoundSpriteDefinitions),
      html5: true
    });

    this._players.matthew = new Howl({
      src: MatthewSpriteJson.urls.map(u => pickPath(u)),
      sprite: (MatthewSpriteJson.sprite as any as SoundSpriteDefinitions),
      html5: true
    });

    this._players.salli = new Howl({
      src: SalliSpriteJson.urls.map(u => pickPath(u)),
      sprite: (SalliSpriteJson.sprite as any as SoundSpriteDefinitions),
      html5: true
    });

  }

  /**
   * play
   * @param word
   * @param age
   */
  public play(word: string, age: number, sex: Sex): void {
    const sexStr = sex == Sex.male ? "male" : "female";
    const ageStr = age < 10 ? "child" : age < 18 ? "puberty" : age < 50 ? "adult" : "senior";
    const voiceId = VoiceIds[sexStr][ageStr];

    this._players[voiceId.toLowerCase()]?.play(word);
  }

}