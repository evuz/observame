import type { Subscription, Unsubscribe } from './subscription'

export type Handler<T> = (value: T) => void
export type Subscribable<T> = {
  subscribe(handler: Handler<T>): Subscription
}

export type NextFn<K> = (v: K) => void
export type OperatorFunction<T, K> = (next: NextFn<K>, unsubscribe: Unsubscribe) => Handler<T> | void
