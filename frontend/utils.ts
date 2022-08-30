import { v4 as uuid } from "uuid"

export const SERVER_URL = "http://localhost:5000"
// export const SERVER_URL = "https://backend.burg.games"

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
    const result = await fetch(`${SERVER_URL}/${riddleId}/start`, {
        headers: headers(),
        method: "POST",
    })

    return await result.json()
}

export async function getRiddleState<T>(riddleId: string): Promise<T> {
    const result = await fetch(`${SERVER_URL}/${riddleId}`, {
        headers: headers(),
    })

    return await result.json()
}

export async function doRiddleAction<T, V>(
    riddleId: string,
    action: string,
    values: V
): Promise<T> {
    const result = await fetch(`${SERVER_URL}/${riddleId}/${action}`, {
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
