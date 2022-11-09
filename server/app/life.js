const DEAD_PROBABILITIES = require("../json/deadProbabiryty.json")
const VERBS = require("../json/verbs.json").verbs

const percent = (x) => Math.random() < x

/**
 * Life
 */
module.exports = class Life {

  _status = {
    age: 0,
    sex: undefined,
    relationship: "single",
    children: [],
    events: []
  };

  get age() {
    return this._status.age;
  }

  get sex() {
    return this._status.sex;
  }

  get events() {
    return this._status.events;
  }

  /**
   * born
   */
  born() {
    this._status.sex = percent(.5) ? "male" : "female";
    if (percent(DEAD_PROBABILITIES[this._status.sex][0])) {
      this._status.events.push("die");
      return false;
    }
    this._status.events.push("born");
    return true;
  }

  /**
   * execute
   */
  execute() {
    if (this._status.sex == undefined) throw new Error();
    if (this._status.events.length > 1) throw new Error();

    const deadProbabilities = DEAD_PROBABILITIES[this._status.sex];

    let lastVerb = "";
    for (let age in deadProbabilities) {
      if (percent(deadProbabilities[age])) break;
      let verb = VERBS[Math.floor(Math.random() * VERBS.length)];
      while (verb == lastVerb) verb = VERBS[Math.floor(Math.random() * VERBS.length)];
      this._status.events.push(verb);
      lastVerb = verb;
    }

    this._status.age = this._status.events.length;
    this._status.events.push("die");
  }

}