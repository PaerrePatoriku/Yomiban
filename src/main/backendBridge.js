
import { spawn } from "child_process";
import path from "path";

const childProcesses = {
    "backend": {
        root: ".backend",
        executable: "YomiBanBackend"
    }
}
let backend;
let socket;

function useBackend() {
    function attachBackend(app, window, webSocket) {

        const backendPath = path.join(app.getAppPath(),
            childProcesses.backend.root,
            childProcesses.backend.executable)
        socket = webSocket;
        backend = spawn(backendPath, [])
        backend.on("spawn", () => {
            const res = backend.stdin.write(JSON.stringify({ "type" : "Connect", "value" : "ws://127.0.0.1:9001" }) + "\n", 'utf-8', (e) => console.log(e));
        })
        backend.stdout.on( "data", data => {
            const msg = data.toString();
            console.log("Backend message", msg);
            window.webContents.send("backend-event", msg);
        })
        backend.stderr.on("data", data => {
            const msg = data.toString();
            console.log("Backend error message", msg);
        })
        backend.on("exit", code => {
            console.log("Backend process exited, code:", code);
        })
        backend.on("message", (e) => console.log(e));
        console.log(backend.pid);
        return backend.pid
    }
    function connectBackend() {

    }
    return { attachBackend, connectBackend }
}
export { useBackend }
