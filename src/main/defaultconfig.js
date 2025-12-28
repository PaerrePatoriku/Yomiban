function useDefaultConfig() {
    const getDefaultConfig = () => {
        return {

            webSocket: "ws://127.0.0.1:9001",
            debug: true,
            extensions: [
                {
                    directory: "likgccmbimhjbgkjambclfkhldnlhbnn/25.11.11.0_0",
                    openSettings: false,
                    active: true
                }
            ],
            style: {
                text: {
                    location: "top"
                },
                menubar: {
                    hideOnClickthrough: true
                }
            },
            inputBindings: {
                clickthrough: "Tab"
            }

        }
    }
    return { getDefaultConfig }
}
export { useDefaultConfig }