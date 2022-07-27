import { Db, MongoClient } from "mongodb"
import { StateWrapper } from "./riddle"
import { v4 as uuid } from "uuid"

export let db: Db

export async function initDb() {
    const client = await MongoClient.connect(
        process.env.MONGODB_URI ?? "mongodb://localhost:27017"
    )
    db = await client.db("hsaka2022")
}

export async function getRiddleState<State>(
    riddleId: string
): Promise<Array<StateWrapper<State>>> {
    return db
        .collection<StateWrapper<State>>(riddleId)
        .find({ isActive: true })
        .toArray()
}

function now() {
    return new Date()
}

export async function updateLastSeen(riddleId: string, userId: string) {
    await db
        .collection<StateWrapper<unknown>>(riddleId)
        // @ts-ignore
        .updateOne(
            { user: userId, isActive: true },
            { $set: { lastSeen: now() } }
        )
}

export async function saveRiddleState<State>(
    riddleId: string,
    state: StateWrapper<State>,
    options?: { noUpdateLastSeen?: boolean }
): Promise<void> {
    const collection = db.collection<StateWrapper<State>>(riddleId)
    //@ts-ignore
    await collection.updateOne({ _id: state._id }, { $set: { ...state } })

    if (!options?.noUpdateLastSeen) {
        //@ts-ignore
        await collection.updateOne(
            { _id: state._id },
            { $set: { lastSeen: now(), lastUpdated: now() } }
        )
    }
}

export async function finishRiddle(
    riddleId: string,
    _id: string
): Promise<void> {
    await db
        .collection<StateWrapper<any>>(riddleId)
        .updateOne({ _id }, { $set: { isActive: false } })
}

export async function startRiddle<State>(
    riddleId: string,
    state: StateWrapper<State>
): Promise<void> {
    await db
        .collection<StateWrapper<State>>(riddleId)
        .insertOne({ ...state, _id: uuid() })
}
