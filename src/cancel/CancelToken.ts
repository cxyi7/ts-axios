import { CancelExecutor, CancelTokenSource, Canceler } from '../type'

import Cancel from "./Cancel";

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
    promise: Promise<Cancel | undefined>
    reason?: Cancel

    constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel | undefined>(resolve => {
        resolvePromise = resolve
    })

    executor(message => {
        if (this.reason) {
        return
        }
        this.reason = new Cancel(message)
        resolvePromise(this.reason)
    })
    }

    throwIfRequested() {
        if (this.reason) {
            throw this.reason
        }
    }

    static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => (cancel = c))
    return {
        cancel,
        token
    }
    }
}
