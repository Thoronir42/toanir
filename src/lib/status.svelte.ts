
export class StatusCycler<T extends string> {
    next = $derived.by(() => {
        const i = this.statuses.indexOf(this.current())
        return this.statuses[(i + 1) % this.statuses.length]
    })

    constructor(private current: () => T, private statuses: T[]) {
        
    }
}
