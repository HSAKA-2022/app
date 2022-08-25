const SERVER_URL = "https://backend.burg.games"

function uuidv4() {
    return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g,
        (c: any) =>
            (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16)
    )
}

function getOrCreateUserId() {
    const existing = localStorage.getItem("userId")
    if (existing) return existing
    const newId = uuidv4()
    localStorage.setItem("userId", newId)
    return newId
}

function headers() {
    return {
        Authorization: "User " + getOrCreateUserId(),
        "Content-Type": "application/json",
    }
}

export async function getRiddle<T>(riddleId: string): Promise<T> {
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
