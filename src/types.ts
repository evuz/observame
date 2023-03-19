import type { Subscription, Unsubscribe } from './subscription'

export type Handler<T> = (value: T) => void
export type Subscribable<T> = {
  subscribe(handler: Handler<T>): Subscription
}

export type NextFn<K> = (v: K) => void
export type CompleteFn = () => void
export type OperatorHandler<T> = Handler<T> | [Handler<T> | undefined, CompleteFn] | void
export type OperatorFunction<T, K> = (next: NextFn<K>, unsubscribe: Unsubscribe) => OperatorHandler<T>
