export function weightedDistribution<T extends {w: number}>(items: T[]) {
    let total = 0
    for (let item of items) {
        total += item.w
    }

    return {
        items,
        fromNormalized(n: number): T {
            const N = n * total;
            let passed = 0
            for (let item of items) {
                if (passed + item.w > N) return item
                passed += item.w
            }

            return items[items.length - 1]
        }
    }
}