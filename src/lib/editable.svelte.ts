import EditableDialog from "./EditableDialog.client.svelte";

export function useEditable(opts: EditableOpts) {
    
    let editor: import("@editorjs/editorjs").default

    const save = createSaveFn(opts.save)

    return {
        editorId: 'editor-' + Math.floor(Math.random() * 10_000),
        dialog: null as (ReturnType<typeof EditableDialog> | null),
        async open(data: EditorJS.OutputData) {
            if (!editor) {
                editor = await initEditor(this.editorId)
            } else {
                await editor.blocks.clear()
            }
            editor.blocks.insertMany(data.blocks)

            this.dialog.open()
        },

        async save() {
            const data = await editor.saver.save()
            const response = await save(data)
            console.log(response)
            if (response === 'ok') {
                this.dialog.close()
            }
        }
    }
}

async function initEditor(holder: string) {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const editor = new EditorJS({
        holder,
        tools: {
            header: {
                class: Header,
                config: {
                    levels: [2, 3, 4],
                    defaultLevel: 2,
                }
            },
        }
    })
    await editor.isReady
    
    return editor
}

function createSaveFn(save: EditableOpts["save"]): SaveFunction {
    if (typeof save === "function") return save
    if (typeof save === "object" && save.page) {
        const page = save.page
        return async (data) => {
            console.log(data)
            const save = await fetch("/api/page", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({
                    page,
                    data,
                }),
            });

            if (save.ok) return 'ok'
            return 'err-' + save.status
        };
    }

    throw new Error("Unknown save parameter")
}

type SaveFunction = (data: EditorJS.OutputData) => unknown

type EditableOpts = {
    save: {page: string} | SaveFunction,
}