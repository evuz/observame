export type Subscription = {
  unsubscribe: () => void
}

export type Handler<T> = (value: T) => void
export type Subscribable<T> = {
  subscribe(handler: Handler<T>): Subscription
}

export type PipeFunction<T, K> = (value: T, next: (v: K) => void) => void
