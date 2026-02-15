import { createServer, classTools } from "staruml-controller-mcp-core"

export function createClassServer() {
    return createServer("staruml-controller-class", "1.0.0", classTools)
}
