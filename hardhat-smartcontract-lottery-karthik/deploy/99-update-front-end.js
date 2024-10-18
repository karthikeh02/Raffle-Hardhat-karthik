// const { ethers, network } = require("hardhat")
// const fs = require("fs")

// const FRONT_END_ADDRESSES_FILE =
//     "./../../testingg/nextjs-smartcontract-lottery/constants/contractAddresses.json"

// const FRONT_END_ABI_FILE =
//     "./../../testingg/nextjs-smartcontract-lottery/constants/abi.json"
// module.exports = async function () {
//     if (process.env.UPDATE_FRONT_END) {
//         console.log("Updating the front end...")
//         updateContractAddresses()
//         updateAbi()
//     }
// }

// async function updateAbi() {
//     const raffle = await ethers.getContract("Raffle")
//     fs.writeFileSync(
//         FRONT_END_ABI_FILE,
//         JSON.stringify(raffle.interface.fragments)
//     )
// }

// async function updateContractAddresses() {
//     const raffle = await ethers.getContract("Raffle")
//     const chainId = network.config.chainId.toString()
//     const currentAddresses = JSON.parse(
//         fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf-8")
//     )
//     if (chainId in currentAddresses) {
//         if (!currentAddresses[chainId].includes(raffle.address)) {
//             currentAddresses[chainId].push(raffle.address)
//         }
//     } else {
//         currentAddresses[chainId] = [raffle.address]
//     }
//     fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
// }

// module.exports.tags = ["all", "frontend"]
const { ethers } = require("hardhat")
const fs = require("fs")
const { network } = require("hardhat")
const { netwokConfig } = require("../helper-hardhat-config")
require("dotenv").config()

const FRONTEND_ABI = "./../nextjs-smartcontract-lottery/constants/abi.json"
const FRONTEND_CONTRACT_ADD =
    "./../nextjs-smartcontract-lottery/constants/contractAddresses.json"

module.exports = async () => {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating the frontend files .. ")
        updateAbi()
        updateContractAddresses()
    }
}
async function updateAbi() {
    const lottery = await ethers.getContract("Lottery")
    fs.writeFileSync(
        FRONTEND_ABI,
        lottery.interface.format(ethers.utils.FormatTypes.json)
    )
}
async function updateContractAddresses() {
    const lottery = await ethers.getContract("Lottery")
    const currentaddress = JSON.parse(
        fs.readFileSync(FRONTEND_CONTRACT_ADD, "utf-8")
    )
    const chainid = network.config.chainId.toString()
    if (chainid in currentaddress) {
        if (!currentaddress[chainid].includes(lottery.address)) {
            currentaddress[chainid].push(lottery.address)
        }
    } else {
        currentaddress[chainid] = [lottery.address]
    }
    fs.writeFileSync(FRONTEND_CONTRACT_ADD, JSON.stringify(currentaddress))
}
module.exports.tags = ["all", "frontend"]
