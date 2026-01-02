function useDefaultConfig() {
    const getDefaultConfig = () => {
        return {

            webSocket: "ws://127.0.0.1:9001",
            development : {
                showInspector : false,
                sendPings : true, 
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
            messages : {
                maxStored : 500
            },
            inputBindings: {
                clickthrough: { 
                    key : "CapsLock",
                    type : "keydown",
                }
            }

        }
    }
    return { getDefaultConfig }
}
export { useDefaultConfig }