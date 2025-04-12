import { weightedDistribution } from "$lib/rand";
import type { PageLoad } from "./$types"

const moodTable = weightedDistribution([
    {name: 'relaxed', w: 4},
    {name: 'excited', w: 1}
] as const)

export const load: PageLoad = ({url}) => {
    const preferedMood = url.searchParams.get('mood')

    const mood = preferedMood && moodTable.items.find((mood) => mood.name === preferedMood) || moodTable.fromNormalized(Math.random());

    return {
        mood: mood.name,
        name: "Toanir"
    }
}
