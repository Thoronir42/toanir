import type { PageLoad } from "./$types"

export const load: PageLoad = ({url}) => {
    return {
        modes: [
            {name: "decode", label: "Decoder"},
            {name: "encode", label: "Encoder"},
        ],
        buttons,
        mode: url.searchParams.get('mode') === 'encode' ? 'encode' as const : 'decode' as const,
    }
}

const buttons = [
    {natural: 'q', style: {x: -45, y: -98, w: 300, h: 200}},
    {natural: 'w', style: {x: -225, y: -98, w: 300, h: 200}},
    {natural: 'e', style: {x: -150, y: -13, w: 300, h: 200}},
    {natural: 'r', style: {x: -75, y: -98, w: 300, h: 200}},
    {natural: 't', style: {x: -135, y: -98, w: 300, h: 200}},
    {natural: 'y', style: {x: -134, y: -143, w: 298, h: 202}},
    {natural: 'u', style: {x: -165, y: -98, w: 300, h: 200}},
    {natural: 'i', style: {x: -29, y: -56, w: 300, h: 200}},
    {natural: 'o', style: {x: -210, y: -56, w: 300, h: 200}},
    {natural: 'p', style: {x: -240, y: -56, w: 300, h: 200}},
    
    {natural: null},

    {natural: 'a', style: {x: -30, y: -13, w: 297, h: 202}},
    {natural: 's', style: {x: -105, y: -98, w: 300, h: 200}},
    {natural: 'd', style: {x: -123, y: -13, w: 305, h: 200}},
    {natural: 'f', style: {x: -180, y: -13, w: 300, h: 200}},
    {natural: 'g', style: {x: -212, y: -13, w: 300, h: 200}},
    {natural: 'h', style: {x: -241, y: -13, w: 300, h: 200}},
    {natural: 'j', file: 'j.jpg', style: {x: -60, y: -56, w: 300, h: 200}},
    {natural: 'k', style: {x: -90, y: -56, w: 300, h: 200}},
    {natural: 'l', style: {x: -120, y: -56, w: 300, h: 200}},
    
    {natural: null},

    {natural: 'z', file: null, style: {x: -164, y: -143, w: 298, h: 202}},
    {natural: 'x', style: {x: -104, y: -143, w: 298, h: 202}},
    {natural: 'c', style: {x: -90, y: -13, w: 300, h: 200}},
    {natural: 'v', style: {x: -195, y: -98, w: 300, h: 200}},
    {natural: 'b', style: {x: -60, y: -13, w: 297, h: 202}},
    {natural: 'n', style: {x: -180, y: -56, w: 300, h: 200}},
    {natural: 'm', style: {x: -150, y: -56, w: 300, h: 202}},
    {natural: null},
    {natural: 'exclamation', label: '!', style: {x: -18, y: -185, w: 535, h: 360}},
    {natural: ' ', file: null, label: ''},
    {natural: 'question', label: '?', style: {x: -23, y: -257, w: 600, h: 395}},
    {natural: 'back', file: null, label: 'back'},
]