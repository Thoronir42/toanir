export async function copyToClipboard(message: string) {
    navigator.clipboard.writeText(message)
}
