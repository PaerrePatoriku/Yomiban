
import { spawn } from "child_process";
import path from "path";

const childProcesses = {
    "backend": {
        root: ".backend",
        executable: "YomiBanBackend"
    }
}
const attachBackend = (app, window, webSocket) => {

    const backendPath = path.join(app.getAppPath(),
        childProcesses.backend.root,
        childProcesses.backend.executable)

    const backend = spawn(backendPath, [], {

        stdio: ["pipe", "pipe", "pipe"]
    })
    backend.stdin.write(JSON.stringify({ "type" : "Connect", "value" : webSocket }))
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
    return backend.pid
}
export { attachBackend }
