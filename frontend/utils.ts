import { v4 as uuid } from "uuid"


function getOrCreateUserId() {
    const existing = localStorage.getItem("userId")
    if (existing) return existing
    const newId = uuid()
    localStorage.setItem("userId", newId)
    return newId
}

export function headers() {
    return {
        Authorization: "User " + getOrCreateUserId(),
        "Content-Type": "application/json",
    }
}

export async function startRiddle<T>(riddleId: string): Promise<T> {
    const c = useRuntimeConfig()
    const result = await fetch(`${c.serverUrl}/${riddleId}/start`, {
        headers: headers(),
        method: "POST",
    })

    return await result.json()
}

export async function getRiddleState<T>(riddleId: string): Promise<T> {
    const c = useRuntimeConfig()
    const result = await fetch(`${c.serverUrl}/${riddleId}`, {
        headers: headers(),
    })

    return await result.json()
}

export async function doRiddleAction<T, V>(
    riddleId: string,
    action: string,
    values: V
): Promise<T> {
    const c = useRuntimeConfig()
    const result = await fetch(`${c.serverUrl}/${riddleId}/${action}`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(values),
    })

    return await result.json()
}

export function getUrlParams(): URLSearchParams {
    if (typeof window === "undefined") return new URLSearchParams()
    return new URLSearchParams(window?.location?.search ?? "")
}

export async function getLeaderboard<LEADERBOARD>(
    riddleId: string
): Promise<LEADERBOARD> {
    const c = useRuntimeConfig()
    const result = await fetch(`${c.serverUrl}/${riddleId}/leaderboard`, {
        headers: headers(),
    })

    return await result.json()
}
