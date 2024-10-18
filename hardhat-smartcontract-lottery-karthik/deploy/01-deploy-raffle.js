const { network, ethers } = require("hardhat")
const { developmentChains, netwokConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer, player } = await getNamedAccounts()

    let MockvrfCoordinatorAddress, subscriptionId, MockvrfCoordinator

    const VRF_SUBSCRIPTION_AMT = ethers.utils.parseEther("5")

    if (developmentChains.includes(network.name)) {
        MockvrfCoordinator = await ethers.getContract("VRFCoordinatorV2_5Mock")
        MockvrfCoordinatorAddress = MockvrfCoordinator.address
        // console.log(MockvrfCoordinatorAddress)
        const transactionResponse =
            await MockvrfCoordinator.createSubscription()
        const transactionReciept = await transactionResponse.wait(1)
        subscriptionId = transactionReciept.events[0].args.subId
        // await MockvrfCoordinator.addConsumer(subscriptionId,MockvrfCoordinatorAddress)
        await MockvrfCoordinator.fundSubscription(
            subscriptionId,
            VRF_SUBSCRIPTION_AMT
        )
    } else {
        MockvrfCoordinatorAddress =
            netwokConfig[network.name]["vrfCoordinatorV2"]
        subscriptionId = netwokConfig[network.name]["subscriptionId"]
    }

    try {
        const ticketAmt = netwokConfig[network.name]["ticketAmt"]
        const keyHash = netwokConfig[network.name]["keyHash"]
        const callbackGasLimit = netwokConfig[network.name]["callbackGasLimit"]
        const interval = netwokConfig[network.name]["interval"]
        const args = [
            MockvrfCoordinatorAddress,
            ticketAmt,
            keyHash,
            subscriptionId,
            callbackGasLimit,
            interval,
        ]
        const Lottery = await deploy("Lottery", {
            from: deployer,
            args: args,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })
        console.log("Contract Deployed")
        console.log(`Lottery Contract Address: ${Lottery.address}`)
        if (developmentChains.includes(network.name)) {
            // The contract must be added as a consumer
            await MockvrfCoordinator.addConsumer(
                subscriptionId,
                Lottery.address
            )
        }
        if (!developmentChains.includes(network.name)) {
            console.log("Verifying.........")
            await verify(Lottery.address, args)
        }
    } catch (error) {
        console.error("Failed to deploy Lottery Contract:", error)
    }
}
module.exports.tags = ["all", "Lottery"]
