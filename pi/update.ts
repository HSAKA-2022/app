#! /usr/bin/node

import dotenv from "dotenv"
import { deploymentLogger } from "./src/log"

var Git = require("git-wrapper")
var git = new Git()

function fetchRemotes(): void {
    git.exec("fetch", (err, msg) => {
        if (err) errorHandler(err, msg)
    })
}

function getBranchName(): string {
    dotenv.config()
    var defaultBranchName = "main"

    console.log(process.env.branch)

    var branchName = process.env.branch || defaultBranchName
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
                console.log("Not on branch " + branchName + " switching to it")
                git.exec("checkout", [branchName], (err, msg) => {
                    if (err) {
                        errorHandler(err, msg)
                    }
                    console.log("Checked out Branch:", msg)
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
    fetchRemotes()
    setCorrectBranch(branchName)

    const upstreamPath: string = "origin/" + branchName
    const localPath: string = "@"

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
