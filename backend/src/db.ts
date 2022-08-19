import { Db, MongoClient } from "mongodb"
import { v4 as uuid } from "uuid"
import { StateWrapper } from "./riddle"

export let db: Db

export async function initDb() {
    const client = await MongoClient.connect(
        process.env.MONGODB_URI ?? "mongodb://localhost:27017"
    )
    db = await client.db("hsaka2022")
}

/**
 * Fetches all riddle state for the riddle from the db
 * @param riddleId
 */
export async function getRiddleState<State>(
    riddleId: string
): Promise<Array<StateWrapper<State>>> {
    return db
        .collection<StateWrapper<State>>(riddleId)
        .find({ isActive: true })
        .toArray()
}

export function now() {
    return new Date()
}

/**
 * Updates the last seen of a state
 * @param riddleId
 * @param userId
 */
export async function updateLastSeen(riddleId: string, userId: string) {
    await db
        .collection<StateWrapper<unknown>>(riddleId)
        .updateOne(
            { user: userId, isActive: true },
            { $set: { lastSeen: now() } }
        )
}

/**
 * Updates a riddle state on the db
 * @param riddleId
 * @param state
 * @param options - Options for the update, `noUpdateLastSeen`: true does not update last seen
 */
export async function saveRiddleState<State>(
    riddleId: string,
    state: StateWrapper<State>,
    options?: { noUpdateLastSeen?: boolean }
): Promise<void> {
    const collection = db.collection<StateWrapper<State>>(riddleId)
    // @ts-ignore $set's type seem off
    await collection.updateOne({ _id: state._id }, { $set: { ...state } })

    if (!options?.noUpdateLastSeen) {
        await collection.updateOne(
            { _id: state._id },
            // @ts-ignore $set's type seem off
            { $set: { lastSeen: now(), lastUpdated: now() } }
        )
    }
}

/**
 * finishes up a riddle by setting isActive to false
 * @param riddleId
 * @param dbId The db id of the state to finish
 */
export async function finishRiddleOnDb(
    riddleId: string,
    dbId: string
): Promise<void> {
    await db
        .collection<StateWrapper<unknown>>(riddleId)
        .updateOne({ _id: dbId }, { $set: { isActive: false } })
}

/**
 * Starts a riddle on the DB
 * @param riddleId
 * @param state the Wrapped state to save
 */
export async function startRiddleOnDb<State>(
    riddleId: string,
    state: StateWrapper<State>
): Promise<void> {
    await db
        .collection<StateWrapper<State>>(riddleId)
        .insertOne({ ...state, _id: uuid() })
}
