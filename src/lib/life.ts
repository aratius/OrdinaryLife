import { DEAD_PROBABILITIES } from "../config/deadProbability";
import { VERBS } from "../config/verbs";
import { percenet } from "../utils";

enum Relationship {
  single,  // 単身
  inRelationship,  // 交際中
  married  // 結婚済み
}

export enum Sex {
  male,
  female,
  undefined
}

interface Child {
  isDead: boolean;
  age: number;
  sex: Sex;
}

interface Status {
  age: number;
  sex: Sex;
  relationship: Relationship;
  children: Child[];
  events: string[];
}

/**
 * Life
 */
export default class Life {

  private _status: Status = {
    age: 0,
    sex: Sex.undefined,
    relationship: Relationship.single,
    children: [],
    events: []
  };

  public get age(): number {
    return this._status.age;
  }

  public get sex(): Sex {
    return this._status.sex;
  }

  public get events(): string[] {
    return this._status.events;
  }

  /**
   * born
   */
  public born(): boolean {
    this._status.sex = percenet(.5) ? Sex.male : Sex.female;
    if (percenet(DEAD_PROBABILITIES[this._status.sex == Sex.male ? "male" : "female"][0])) {
      this._status.events.push("die");
      return false;
    }
    this._status.events.push("born");
    return true;
  }

  /**
   *
   */
  execute() {
    if (this._status.sex == Sex.undefined) throw new Error();
    if (this._status.events.length > 1) throw new Error();

    const deadProbabilities = DEAD_PROBABILITIES[this._status.sex == Sex.male ? "male" : "female"];

    let lastVerb = "";
    for (let age in deadProbabilities) {
      if (percenet(deadProbabilities[age])) break;
      let verb = VERBS[Math.floor(Math.random() * VERBS.length)];
      while (verb == lastVerb || verb == "born" || verb == "die") verb = VERBS[Math.floor(Math.random() * VERBS.length)];
      this._status.events.push(verb);
      lastVerb = verb;
    }

    this._status.age = this._status.events.length;
    this._status.events.push("die");
  }

}
