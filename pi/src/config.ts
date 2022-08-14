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
    userScriptPath: "./UserScripts/",
    statePollService: {
        baseURL: "https://api.kucoin.com/api/v1/market/stats",
        //Delay in MS
        pollDelay: 10000,
    },
    actionDispatch: {
        baseURL: "https://ptsv2.com/t/kruv3-1655553613/post",
    },
}
