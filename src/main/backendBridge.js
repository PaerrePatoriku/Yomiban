import { spawn } from "child_process";
import path from "path";
import { useResourceHelper  } from "./resourcehelper";

const childProcesses = {
    "backend": {
        root: "lib",
        executable: "YomiBanBackend"
    }
}
const resourceHelper = useResourceHelper();

function useBackend() {
    function attachBackend(window, webSocket) {

        const backendPath = path.join(resourceHelper.getResourcePath(),
            childProcesses.backend.root,
            childProcesses.backend.executable);
        console.log("backend path", backendPath);

        const backend = spawn(backendPath, { stdio : ["pipe", "pipe", "pipe"], shell : true})
        backend.on("spawn", () => {
            const res = backend.stdin.write(JSON.stringify({ "type": "Connect", "value": webSocket }) + "\n", 'utf-8', (e) => console.log(e));
        })
        backend.stdout.on("data", data => {
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
