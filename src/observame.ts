import { Subscribable, Handler, OperatorFunction, Unsubscribe } from './types'

function createHandler (creators: OperatorFunction<any, any>[], unsubscribeFn: Unsubscribe) {
  let next: Handler<any> = () => {}
  let creator = creators.pop()

  while (creator) {
    next = creator(next, unsubscribeFn)
    creator = creators.pop()
  }

  return function (value: any) {
    if (next) next(value)
  }
}

export class Observame<T> {
  constructor (private subscribable: Subscribable<T>, private pipes: OperatorFunction<any, any>[] = []) {}

  subscribe (handler: Handler<T>) {
    let hasUnsubscribe = false
    let unsubscribeFn = () => { hasUnsubscribe = true }

    const subscription = this.subscribable.subscribe(createHandler(this.pipes.concat(() => handler), () => unsubscribeFn()))
    unsubscribeFn = subscription.unsubscribe.bind(subscription)

    if (hasUnsubscribe) unsubscribeFn()

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
