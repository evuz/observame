import { createHandler } from './helpers.ts/handler'
import { Subscribable, Handler, OperatorFunction } from './types'

export class Observame<T> {
  constructor (private subscribable: Subscribable<T>, private pipes: OperatorFunction<any, any>[] = []) {}

  subscribe (handler: Handler<T>) {
    let isUnsubscribe = false
    let unsubscribeFn = () => { isUnsubscribe = true }

    const pipes = this.pipes.concat(() => handler)
    const { handler: _handler, complete } = createHandler(pipes, () => unsubscribeFn())
    const subscription = this.subscribable.subscribe(_handler)

    const originalUnsubscribe = subscription.unsubscribe.bind(subscription)
    subscription.unsubscribe = () => {
      complete()
      originalUnsubscribe()
    }

    unsubscribeFn = subscription.unsubscribe.bind(subscription)

    if (isUnsubscribe) subscription.unsubscribe()
    return subscription
  }

  pipe<A>(fn: OperatorFunction<T, A>): Observame<A>
  pipe<A, B>(fn1: OperatorFunction<T, A>, fn2: OperatorFunction<A, B>): Observame<B>
  pipe<A, B, C>(fn1: OperatorFunction<T, A>, fn2: OperatorFunction<A, B>, fn3: OperatorFunction<B, C>): Observame<C>
  pipe<A, B, C, D>(fn1: OperatorFunction<T, A>, fn2: OperatorFunction<A, B>, fn3: OperatorFunction<B, C>, fn4: OperatorFunction<C, D>): Observame<D>
  pipe<A, B, C, D, E>(fn1: OperatorFunction<T, A>, fn2: OperatorFunction<A, B>, fn3: OperatorFunction<B, C>, fn4: OperatorFunction<C, D>, fn5: OperatorFunction<D, E>): Observame<E>
  pipe (...fns: OperatorFunction<any, any>[]) {
    return new Observame(this, fns)
  }
}

export function observame<T> (emitter: Subscribable<T>) {
  return new Observame<T>(emitter)
}
