interface conf {
    log: logConfig
    userScriptPath: string
    statePollService: statePollerServiceConfig
    actionDispatch: actionDispatchConfig
}
interface logConfig {
    level: string
    path: string
}
interface statePollerServiceConfig {
    baseURL: string
    pollDelay: number
}

interface actionDispatchConfig {
    baseURL: string
}

export const config: conf = {
    log: {
        level: "info",
        path: "./log/",
    },
    userScriptPath: "./scripts/",
    statePollService: {
        baseURL: "https://backend.burg.games",
        //Delay in MS
        pollDelay: 250,
    },
    actionDispatch: {
        baseURL: "https://backend.burg.games",
    },
}
