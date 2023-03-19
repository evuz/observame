import type { Unsubscribe } from '../subscription'
import type { CompleteFn, Handler, OperatorFunction } from '../types'

type PrepareOperatorHandler = {
  args: ReturnType<OperatorFunction<any, any>>
  return: [Handler<any> | undefined, Unsubscribe | undefined]
}
export function prepareOperatorHandler (handler: PrepareOperatorHandler['args']): PrepareOperatorHandler['return'] {
  if (typeof handler === 'function') {
    return [handler, undefined]
  }

  if (Array.isArray(handler)) {
    return handler
  }
  return [undefined, undefined]
}

export function createHandler (creators: OperatorFunction<any, any>[], unsubscribeFn: Unsubscribe) {
  let next: Handler<any> = () => {}
  let creator = creators.pop()
  const completeFns: CompleteFn[] = []

  while (creator) {
    const [_next, completeFn] = prepareOperatorHandler(creator(next, unsubscribeFn))
    if (_next) next = _next
    if (completeFn) completeFns.unshift(completeFn)
    creator = creators.pop()
  }

  return {
    handler: (value: any) => {
      if (next) next(value)
    },
    complete: () => {
      completeFns.forEach(fn => fn())
    }
  }
}
