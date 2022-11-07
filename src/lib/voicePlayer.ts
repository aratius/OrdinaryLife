import { Howl, SoundSpriteDefinitions } from "howler";
import { Sex } from "./life";

import IvySpriteJson from "public/static/speeches/Ivy/sprite/data.json";
import JoannaSpriteJson from "public/static/speeches/Ivy/sprite/data.json";
import JoeySpriteJson from "public/static/speeches/Ivy/sprite/data.json";
import JustinSpriteJson from "public/static/speeches/Ivy/sprite/data.json";
import KevinSpriteJson from "public/static/speeches/Ivy/sprite/data.json";
import KimberlySpriteJson from "public/static/speeches/Ivy/sprite/data.json";
import MatthewSpriteJson from "public/static/speeches/Ivy/sprite/data.json";
import SalliSpriteJson from "public/static/speeches/Ivy/sprite/data.json";

/**
 * Voice player
 */
export default class VoicePlayer {

  private _ivy: Howl | null = null;
  private _joanna: Howl | null = null;
  private _joey: Howl | null = null;
  private _justin: Howl | null = null;
  private _kevin: Howl | null = null;
  private _kimberly: Howl | null = null;
  private _matthew: Howl | null = null;
  private _salli: Howl | null = null;

  /**
   * constructor
   */
  constructor() {

  }

  /**
   * init
   */
  public init(): void {
    const pickPath = (path: string) => {
      const res = path.match(/\/static.*/);
      if (res) return res[0];
      return "";
    };

    this._ivy = new Howl({
      src: IvySpriteJson.urls.map(u => pickPath(u)),
      sprite: (IvySpriteJson.sprite as any as SoundSpriteDefinitions)
    });

    this._joanna = new Howl({
      src: JoannaSpriteJson.urls.map(u => pickPath(u)),
      sprite: (JoannaSpriteJson.sprite as any as SoundSpriteDefinitions)
    });

    this._joey = new Howl({
      src: JoeySpriteJson.urls.map(u => pickPath(u)),
      sprite: (JoeySpriteJson.sprite as any as SoundSpriteDefinitions)
    });

    this._justin = new Howl({
      src: JustinSpriteJson.urls.map(u => pickPath(u)),
      sprite: (JustinSpriteJson.sprite as any as SoundSpriteDefinitions)
    });

    this._kevin = new Howl({
      src: KevinSpriteJson.urls.map(u => pickPath(u)),
      sprite: (KevinSpriteJson.sprite as any as SoundSpriteDefinitions)
    });

    this._kimberly = new Howl({
      src: KimberlySpriteJson.urls.map(u => pickPath(u)),
      sprite: (KimberlySpriteJson.sprite as any as SoundSpriteDefinitions)
    });

    this._matthew = new Howl({
      src: MatthewSpriteJson.urls.map(u => pickPath(u)),
      sprite: (MatthewSpriteJson.sprite as any as SoundSpriteDefinitions)
    });

    this._salli = new Howl({
      src: SalliSpriteJson.urls.map(u => pickPath(u)),
      sprite: (SalliSpriteJson.sprite as any as SoundSpriteDefinitions)
    });

  }

  /**
   * play
   * @param word
   * @param age
   */
  public play(word: string, age: number, sex: Sex): void {
    this._ivy?.play(word);
    this._joanna?.play(word);
    this._joey?.play(word);
    this._justin?.play(word);
    this._kevin?.play(word);
    this._kimberly?.play(word);
    this._matthew?.play(word);
    this._salli?.play(word);
  }

}