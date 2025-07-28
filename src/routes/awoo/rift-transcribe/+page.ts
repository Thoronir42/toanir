import type { PageLoad } from "./$types"

export const load: PageLoad = ({url}) => {
    return {
        modes: [
            {name: "decode", label: "Decoder"},
            {name: "encode", label: "Encoder"},
        ],
        buttons,
        mode: url.searchParams.get('mode') === 'decode' ? 'decode' as const : 'encode' as const,
    }
}

const buttons = [
    {natural: 'q'},
    {natural: 'w'},
    {natural: 'e'},
    {natural: 'r'},
    {natural: 't'},
    {natural: 'y'},
    {natural: 'u'},
    {natural: 'i'},
    {natural: 'o'},
    {natural: 'p'},
    
    {natural: null},

    {natural: 'a'},
    {natural: 's'},
    {natural: 'd'},
    {natural: 'f'},
    {natural: 'g'},
    {natural: 'h'},
    {natural: 'j', file: 'j.jpg'},
    {natural: 'k'},
    {natural: 'l'},
    
    {natural: null},

    {natural: 'z'},
    {natural: 'x'},
    {natural: 'c'},
    {natural: 'v'},
    {natural: 'b'},
    {natural: 'n'},
    {natural: 'm'},
    {natural: null},
    {natural: 'exclamation', label: '!'},
    {natural: ' ', label: ''},
    {natural: 'question', label: '?'},
]