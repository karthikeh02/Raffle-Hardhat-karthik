// const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
// const { developmentChains } = require("../../helper-hardhat-config")
// const { expect, assert } = require("chai")

// developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("Raffle Unit Tests", function () {
//           let raffle, raffleEntranceFee, deployer

//           this.beforeEach(async function () {
//               deployer = await getNamedAccounts().deployer
//               raffle = await ethers.getContract("Raffle", deployer)

//               raffleEntranceFee = await raffle.getEntranceFee()
//           })

//           describe("fulfillRandomWords", function () {
//               it("works with live Chainlink Keepers and Chainlink VRF, we get aramdom winner", async function () {
//                   // enter the raffle
//                   const startingTimeStamp = await raffle.getLatestTimeStamp()
//                   const accounts = await ethers.getSigners()

//                   await new Promise(async (resolve, reject) => {
//                       raffle.once("Winner Picked", async () => {
//                           console.log("Winner Picked Event Fired!")
//                           try {
//                               // add our asserts here
//                               const recentWinner =
//                                   await raffle.getRecentWinner()
//                               const raffleState = await raffle.getRaffleState()
//                               const winnerEndingBalance =
//                                   await accounts[0].getBalance()
//                               const endingTimeStamp =
//                                   await raffle.getLatestTimeStamp()

//                               await expect(raffle.getPlayer(0)).to.be.reverted

//                               assert.equal(
//                                   recentWinner.toString(),
//                                   accounts[0].address
//                               )
//                               assert.equal(raffleState, 0)
//                               assert.equal(
//                                   winnerEndingBalance.toString(),
//                                   winnerStartingBalance
//                                       .add(raffleEntranceFee)
//                                       .toString()
//                               )
//                               assert.equal(endingTimeStamp > startingTimeStamp)
//                               resolve()
//                           } catch (error) {
//                               console.log(error)
//                               reject(e)
//                           }
//                       })
//                       // Then entering the Raffle
//                       await raffle.enterRaffle({ value: raffleEntranceFee })
//                       const winnerStartingBalance =
//                           await accounts[0].getBalance()
//                       // and this code WONT complete until our listener finished listening!
//                   })
//               })
//           })
//       })
const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const {
    developmentChains,
    netwokConfig,
} = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Lottery", async () => {
          let deployer
          let Lottery
          let accounts
          let LotteryFee
          let deployerAddress
          let winnerStartingBalance

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              deployerAddress = deployer
              Lottery = await ethers.getContract("Lottery", deployer)
              LotteryFee = await Lottery.getTicketPrice()
          })
          describe("fullfillrandomwords", async () => {
              it("works automatically with ChainlinkVRF and Chainlink Keepers", async () => {
                  const startingTimeStamp = await Lottery.getLatestTimestamp()

                  await new Promise(async (resolve, reject) => {
                      console.log("Setting up Listener...")
                      Lottery.once("WinnerPicked", async () => {
                          console.log("Winner picked event is fired !! ")
                          // resolve();
                          try {
                              const LotteryState =
                                  await Lottery.getLotteryState()
                              const winner = await Lottery.getRecentWinner()
                              const winner_endBal =
                                  await ethers.provider.getBalance(winner)
                              const endingTimeStamp =
                                  await Lottery.getLatestTimestamp()

                              assert.equal(
                                  (await Lottery.getNumPlayers()).toString(),
                                  "0"
                              )
                              assert.equal(
                                  winner_endBal.toString(),
                                  (await deployer.getBalance()).toString()
                              )
                              assert.equal(LotteryState, 0)
                              assert.equal(
                                  winner_endBal.toString(),
                                  winnerStartingBalance
                                      .add(LotteryFee)
                                      .toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (e) {
                              console.log(e)
                              reject(e)
                          }
                      })
                      try {
                          console.log("Entering the lottery")
                          const tx = await Lottery.EnterLottery({
                              value: LotteryFee,
                          })
                          await tx.wait(1)
                          console.log("Player entered")
                          // winnerStartingBalance = await deployeradd.getbalance();
                          winnerStartingBalance = await accounts[0].getBalance()
                      } catch (e) {
                          console.log(e)
                          reject(e)
                      }
                  })
              })
          })
      })
