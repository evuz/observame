
export type Unsubscribe = () => void

export class Subscription {
  constructor (public unsubscribe: Unsubscribe) {}
}
