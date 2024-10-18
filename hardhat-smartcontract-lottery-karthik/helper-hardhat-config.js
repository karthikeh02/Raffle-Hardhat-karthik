// const { ethers } = require("hardhat")

// const networkConfig = {
//     11155111: {
//         name: "sepolia",
//         vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
//         entranceFee: ethers.utils.parseEther("0.01"),
//         gasLane:
//             "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
//         subscriptionId:
//             // "61754240320595073368010214793657987726548017930427378940601067572707587311059",
//             "12151",
//         callbackGasLimit: "500000", // 500,000
//         interval: "30",
//     },
//     31337: {
//         //for hardhat mocks doesnt care what is vrfaddress, gasLane is.
//         name: "hardhat",
//         entranceFee: ethers.utils.parseEther("0.01"),
//         gasLane:
//             "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
//         callbackGasLimit: "500000", // 500,000
//         interval: "30",
//     },
// }

// const developmentChains = ["hardhat", "localhost"]

// module.exports = {
//     networkConfig,
//     developmentChains,
// }
const { ethers } = require("hardhat")

const netwokConfig = {
    sepolia: {
        name: "Sepolia",
        vrfCoordinatorV2: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
        ticketAmt: ethers.utils.parseEther("0.01"),
        keyHash:
            "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
        subscriptionId:
            "61754240320595073368010214793657987726548017930427378940601067572707587311059",
        callbackGasLimit: "500000",
        interval: "30",
    },
    hardhat: {
        name: "hardhat",
        ticketAmt: ethers.utils.parseEther("0.25"),
        keyHash:
            "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        subscriptionId: "",
        callbackGasLimit: "500000",
        interval: "30",
    },
}

const developmentChains = ["localhost", "hardhat"]

module.exports = { netwokConfig, developmentChains }
