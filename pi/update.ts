#! /usr/bin/node

import dotenv from "dotenv"
import { deploymentLogger } from "./src/log"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Git = require("git-wrapper")
const git = new Git()

async function fetchRemotes(): Promise<void> {
    return new Promise((resolve, reject) => {
        git.exec("fetch", (err, msg) => {
            if (err) {
                reject(err)
                errorHandler(err, msg)
            } else {
                resolve()
            }
        })
    })
}

function getBranchName(): string {
    dotenv.config()
    const defaultBranchName = "main"

    deploymentLogger.info("Env configured branch is: " + process.env.branch)

    const branchName = process.env.branch || defaultBranchName
    return branchName
}

function setCorrectBranch(branchName: string): void {
    git.exec(
        "rev-parse",
        ["--abbrev-ref HEAD"],
        (err: string, branch: string) => {
            if (err) {
                errorHandler(err, branch)
            }
            if (branch.trim() !== branchName.trim()) {
                deploymentLogger.info(
                    "Not on branch " + branchName + " switching to it"
                )
                git.exec("checkout", [branchName, "-f"], (err, msg) => {
                    if (err) {
                        errorHandler(err, msg)
                    }
                    deploymentLogger.info("Checked out Branch:", msg)
                })
            }
        }
    )
}
async function getCurrentCommitHash(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        git.exec("rev-parse", [path], (err, hash) => {
            if (err) {
                reject(err)
                errorHandler(err, hash)
            } else {
                resolve(hash.trim())
            }
        })
    })
}

function doUpdate(branchName: string): void {
    git.exec("pull", ["origin", branchName], (err, result) => {
        if (err) {
            errorHandler(err, result)
        } else {
            deploymentLogger.info("Updated Repo: " + result)
        }
    })
}

async function checkForUpdate() {
    const branchName = getBranchName()
    if (branchName == null) errorHandler("Couldn't determine Branch name", null)
    await fetchRemotes()
    setCorrectBranch(branchName)

    const upstreamPath: string = "origin/" + branchName
    const localPath = "@"

    const localHash: string = await getCurrentCommitHash(localPath)
    const remoteHash: string = await getCurrentCommitHash(upstreamPath)

    if (localHash.trim() === remoteHash.trim()) {
        deploymentLogger.info("No updates available")
    } else {
        deploymentLogger.info("Updates available")
        doUpdate(branchName)
    }
}

function errorHandler(err, msg) {
    deploymentLogger.error("Error: " + err)
    deploymentLogger.error("Message: " + msg)
    throw err
}

checkForUpdate()
