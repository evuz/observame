import { Subscribable, Handler, PipeFunction } from './types'

function createHandler (fns: PipeFunction<any, any>[]) {
  return function (value: any) {
    const copy = fns.slice()
    function next (value: any) {
      const fn = copy.shift()
      if (fn) {
        fn(value, next)
      }
    }
    next(value)
  }
}

export class Observame<T> {
  constructor (private subscribable: Subscribable<T>, private pipes: PipeFunction<any, any>[] = []) {}

  subscribe (handler: Handler<T>) {
    return this.subscribable.subscribe(createHandler(this.pipes.concat(handler)))
  }

  pipe<A>(fn: PipeFunction<T, A>): Observame<A>
  pipe<A, B>(fn1: PipeFunction<T, A>, fn2: PipeFunction<A, B>): Observame<B>
  pipe<A, B, C>(fn1: PipeFunction<T, A>, fn2: PipeFunction<A, B>, fn3: PipeFunction<B, C>): Observame<C>
  pipe<A, B, C, D>(fn1: PipeFunction<T, A>, fn2: PipeFunction<A, B>, fn3: PipeFunction<B, C>, fn4: PipeFunction<C, D>): Observame<D>
  pipe<A, B, C, D, E>(fn1: PipeFunction<T, A>, fn2: PipeFunction<A, B>, fn3: PipeFunction<B, C>, fn4: PipeFunction<C, D>, fn5: PipeFunction<D, E>): Observame<E>
  pipe (...fns: PipeFunction<any, any>[]) {
    return new Observame(this, fns)
  }
}

export function observame<T> (emitter: Subscribable<T>) {
  return new Observame<T>(emitter)
}
