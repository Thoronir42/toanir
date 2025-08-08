export async function loadEditable(page: string) {
    const data = await loadPageData(page)

    return {
        data,
        html: renderHtml(data.blocks),
    }
}

export async function loadPageData(page: string): Promise<EditorJS.OutputData> {
    return {
        blocks: [],
    }
}

export function renderHtml(blocks: EditorJS.OutputBlockData[]) {
    return blocks
        .map((block) => renderBlock(block))
        .join('\n')
}

export function renderBlock(block: EditorJS.OutputBlockData) {
    console.warn("Unknown block type", block.type, block.id);
}