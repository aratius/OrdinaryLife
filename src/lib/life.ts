enum Relationship {
  single,  // 単身
  inRelationship,  // 交際中
  married  // 結婚済み
}

enum Sex {
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
}

const VERBS = [
  "stand",
  "walk",
  "jump",
  "talk",
  "eat",
  "drink",
  "trip",
  "love",
  "like",
  "sleep",
  "awake",
  "believe",
  "buy",
  "care",
  "collect",
  "cook",
  "cough",
  "cry",
  "dance",
  "draw",
  "drive",
  "enjoy",
  "explain",
  "fall",
  "feel",
  "find",
  "follow",
  "help",
  "invite",
  "introduce",
  "kick",
  "kiss",
  "knock",
  "laugh",
  "lead",
  "learn",
  "leave",
  "lie",
  "live",
  "meet",
  "paint",
  "pass",
  "pick",
  "play",
  "prepare",
  "promise",
  "read",
  "remember",
  "report",
  "run",
  "save",
  "say",
  "sell",
  "send",
  "shake",
  "share",
  "show",
  "smile",
  "study",
  "swim",
  "teach",
  "tell",
  "thank",
  "think",
  "throw",
  "touch",
  "try",
  "understand",
  "use",
  "wait",
  "wash",
  "watch",
  "win",
  "work",
  "write",
];

/**
 *
 */
export default class Life {

  private _status: Status = {
    age: 0,
    sex: Sex.undefined,
    relationship: Relationship.single,
    children: [],
  };

  /**
   * get
   */
  public get(): string[] {

    const events = ["born"];

    const percent = (p: number) => Math.random() < p;
    let limit = 80;
    if (percent(.02)) {
      // 100人に2人死産
      limit = 0;
    } else if (this._status.sex == Sex.male) {
      // 男性
      const getLimit = () => {
        const seed = Math.random();
      };
    } else if (this._status.sex == Sex.female) {
      // 女性
    }

    events.push("die");
    return [];
  }

  /**
   * born
   */
  private _born(): void {

  }

}