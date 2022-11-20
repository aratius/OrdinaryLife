export const percenet = (p: number) => Math.random() <= p;

/**
 *
 */
export class Queue {

  private _fns: (() => Promise<void>)[] = [];

  public add(fn: (() => Promise<void>)) {
    this._fns.push(fn);
    if (this._fns.length == 1) this._queue();
  }

  private async _queue() {
    while (this._fns.length > 0) {
      await this._fns[0]();
      this._fns.splice(0, 1);
    }
  }

}