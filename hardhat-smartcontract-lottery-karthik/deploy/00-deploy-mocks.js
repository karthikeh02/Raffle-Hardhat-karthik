const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.1")
const GAS_PRICE_LINK = 1e8
const WEI_PER_UNIT_LINK = ethers.utils.parseEther("0.001")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer, player } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.chainId
    const chainName = network.name

    if (developmentChains.includes(chainName)) {
        console.log("Deploying mocks ..... ")
        try {
            await deploy("VRFCoordinatorV2_5Mock", {
                from: deployer,
                args: [BASE_FEE, GAS_PRICE_LINK, WEI_PER_UNIT_LINK],
                log: true,
            })
            console.log("Mocks deployed")
            console.log("----------------------------------")
        } catch (error) {
            console.error("Failed to deploy MockvrfCoordinator", error)
        }

        // deploying mocks
    }
}
module.exports.tags = ["Lottery", "all", "mock"]
