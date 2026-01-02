function useDefaultConfig() {
    const getDefaultConfig = () => {
        return {

            webSocket: "ws://127.0.0.1:9001",
            development : {
                showInspector : false,
                sendPings : false, 
            },
            extensions: [
                {
                    directory: "likgccmbimhjbgkjambclfkhldnlhbnn/25.11.11.0_0",
                    openSettings: true,
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