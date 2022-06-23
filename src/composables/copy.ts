export default function useCopy() {
    function copy(text) { navigator.clipboard.writeText(JSON.stringify(text, null, 4)) };

    return {
        copy
    }
}