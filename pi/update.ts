#! /usr/bin/node

var nodegit = require("nodegit")
import {} from "nodegit"
import dotenv from "dotenv"

dotenv.config()

var branchName = "main"

nodegit.Repository.open("../")
    .then(function (repo) {
        console.log("Using " + repo.path())
        repo.getBranch("refs/remotes/origin/" + branchName).then(function (
            reference
        ) {
            //checkout branch
            return repo.checkoutRef(reference)
        })
        repo.getStatus().then(function (arrayStatusFile) {
            for (const element of arrayStatusFile) {
                console.log(element.path())
            }
        })
    })
    .catch(function (err) {
        console.log(err)
    })
