const v3 = require("node-hue-api").v3
const LightState = v3.lightStates.LightState

const USERNAME = "your username to authenticating with the bridge",
    // The name of the light we wish to retrieve by name
    LIGHT_ID = 1

async function sleep(number) {
    return new Promise((resolve) => setTimeout(resolve, number))
}

async function main() {
    const api = await v3.api
        .createLocal("192.168.5.116")
        .connect("AT0cUBe8aB9zedDIkfkVi3l9jOkRwIrVhfzqTZlm")
    // Using a LightState object to build the desired state
    const state = new LightState().rgb(255, 0, 0).alertShort()

    for (let i = 0; i < 20; i++) {
        try {
            console.log("Setting light " + i)
            await api.lights.setLightState(i, new LightState().off())
            await sleep(100)
            await api.lights.setLightState(i, state)
        } catch (e) {}
        await sleep(1000)
    }
}

main()
