// const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
// const {
//     developmentChains,
//     networkConfig,
// } = require("../../helper-hardhat-config")
// const { assert, expect } = require("chai")

// !developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("Raffle", async function () {
//           let raffle,
//               vrfCoordinatorV2Mock,
//               raffleEntranceFee,
//               deployer,
//               interval
//           const chainId = network.config.chainId

//           this.beforeEach(async function () {
//               deployer = await getNamedAccounts().deployer
//               await deployments.fixture(["all"])
//               raffle = await ethers.getContract("Raffle", deployer)
//               vrfCoordinatorV2Mock = await ethers.getContract(
//                   "VRFCoordinatorV2Mock",
//                   deployer
//               )
//               raffleEntranceFee = await raffle.getEntranceFee()
//               interval = await raffle.getInterval()
//           })

//           describe("constructor", async function () {
//               it("initializes the raffle correctly", async function () {
//                   // Ideally we make our tests have just 1 assert per "it"
//                   const raffleState = await raffle.getRaffleState()
//                   assert.equal(raffleState.toString(), "0")
//                   assert.equal(
//                       interval.toString(),
//                       networkConfig[chainId]["interval"]
//                   )
//               })
//           })
//           describe("enterRaffle", async function () {
//               it("reverts when you dont pay enough", async function () {
//                   await expect(raffle.enterRaffle()).to.be.revertedWith(
//                       "Raffle__NotEnoughETHEntered"
//                   )
//               })
//               it("records player when they enter", async function () {
//                   // First, we need the raffle entrance fee
//                   await raffle.enterRaffle({ value: raffleEntranceFee })
//                   const { playerFromContract } = await raffle.getPlayer(0)
//                   assert.equal(playerFromContract, deployer)
//               })
//               it("emits event on enter", async function () {
//                   await expect(
//                       raffle.enterRaffle({ value: raffleEntranceFee })
//                   ).to.emit(raffle, "RaffleEnter")
//               })
//               it("doesnt allow entrance when raffle is calculating", async function () {
//                   await raffle.enterRaffle({ value: raffleEntranceFee })
//                   await network.provider.send("evm_increaseTime", [
//                       interval.toNumber() + 1,
//                   ])
//                   await network.provider.send("evm_mine", [])
//                   //   await network.provider.request({
//                   //       method: "evm_mine",
//                   //       params: [],
//                   //   })
//                   // Same as before line (LINE - 63)

//                   // We pretend to be ChainLink Keepers
//                   await raffle.performUpkeep([])
//                   await expect(
//                       raffle.enterRaffle({ value: raffleEntranceFee })
//                   ).to.be.revertedWith("Raffle__NotOpen")
//               })
//           })
//           describe("checkUpkeep", async function () {
//               it("returns false if people havent sent any ETH", async function () {
//                   await network.provider.send("evm_increaseTime", [
//                       interval.toNumber() + 1,
//                   ])
//                   await network.provider.send("evm_mine", [])
//                   const { upkeepNeeded } = await raffle.callStatic.checkUpkeep(
//                       []
//                   )
//                   assert(!upkeepNeeded)
//               })
//               it("returns false if raffle isnt open", async function () {
//                   await raffle.enterRaffle({ value: raffleEntranceFee })
//                   await network.provider.send("evm_increaseTime", [
//                       interval.toNumber() + 1,
//                   ])
//                   await network.provider.send("evm_mine", [])
//                   await raffle.performUpkeep([])
//                   const raffleState = await raffle.getRaffleState()
//                   const { upkeepNeeded } = await raffle.callStatic.checkUpkeep(
//                       []
//                   )
//                   assert.equal(raffleState.toString(), "1")
//                   assert.equal(upkeepNeeded, false)
//               })
//               it("returns false if enough time haasnt passed", async function () {
//                   await raffle.enterRaffle({ value: raffleEntranceFee })
//                   await network.provider.send("evm_increaseTime", [
//                       interval.toNumber() - 1,
//                   ])
//                   await network.provider.send("evm_mine", [])
//                   //   await network.provider.request({
//                   //       method: "evm_mine",
//                   //       params: [],
//                   //   })
//                   const { upkeepNeeded } = await raffle.callStatic.checkUpkeep(
//                       "0x"
//                   )
//                   assert(upkeepNeeded)
//               })
//               it("returns true if enough time has passed,has players,eth, and is open", async function () {
//                   await raffle.enterRaffle({ value: raffleEntranceFee })
//                   await network.provider.send("evm_increaseTime", [
//                       interval.toNumber() + 1,
//                   ])
//                   await network.provider.send("evm_mine", [])
//                   const { upkeepNeeded } = await raffle.callStatic.checkUpkeep(
//                       "0x"
//                   )
//                   assert(upkeepNeeded)
//               })
//           })
//           describe("performUpkeep", function () {
//               it("it can only run if checkUpkeep is true", async function () {
//                   await raffle.enterRaffle({ value: raffleEntranceFee })
//                   await network.provider.send("evm_increaseTime", [
//                       interval.toNumber() + 1,
//                   ])
//                   await network.provider.send("evm_mine", [])
//                   const tx = await raffle.performUpkeep([])
//                   assert(tx)
//               })
//               it("reverts when checkUpkeep is false", async function () {
//                   await expect(raffle.performUpkeep([])).to.be.revertedWith(
//                       "Raffle__UpKeepNotNeeded"
//                   )
//               })
//               it("updates the raffle state, emits and event, and calls the vrf coordinator", async function () {
//                   await raffle.enterRaffle({ value: raffleEntranceFee })
//                   await network.provider.send("evm_increaseTime", [
//                       interval.toNumber() + 1,
//                   ])
//                   await network.provider.send("evm_mine", [])
//                   const txResponse = await raffle.performUpkeep([])
//                   const txReceipt = await txResponse.wait(1)
//                   const requestId = txReceipt.events[1].args.requestId
//                   const raffleState = await raffle.getRaffleState()
//                   assert(requestId.toNumber() > 0)
//                   assert(raffleState == "1")
//               })
//           })
//           describe("fulfillRandomWords", function () {
//               this.beforeEach(async function () {
//                   await raffle.enterRaffle({ value: raffleEntranceFee })
//                   await network.provider.send("evm_increaseTime", [
//                       interval.toNumber() + 1,
//                   ])
//                   await network.provider.send("evm_mine", [])
//               })
//               it("can only be called after performUpkeep", async function () {
//                   await expect(
//                       vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)
//                   ).to.be.revertedWith("nonexistent request")
//                   await expect(
//                       vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)
//                   ).to.be.revertedWith("nonexistent request")
//               })
//               it("picks a winner,resets the lottery, and sends money", async function () {
//                   const additionalEntrants = 3
//                   const startingAccountIndex = 1 // deployer = 0
//                   const accounts = await ethers.getSigners()
//                   for (
//                       i = startingAccountIndex;
//                       i < startingAccountIndex + additionalEntrants;
//                       i++
//                   ) {
//                       const accountConnectedRaffle = raffle.connect(accounts[i])
//                       await accountConnectedRaffle.enterRaffle({
//                           value: raffleEntranceFee,
//                       })
//                   }
//                   const startingTimeStamp = await raffle.getLatestTimeStamp()

//                   // performUpkeep (mock being Chainlink Keepers)
//                   // fulfillRandomWords (mock being Chainlink VRF)
//                   // We will have to wait for the fulfillRandomWords to be called
//                   await new Promise(async (resolve, reject) => {
//                       raffle.once("WinnerPicked", async () => {
//                           console.log("Found the Event!")
//                           try {
//                               const recentWinner =
//                                   await raffle.getRecentWinner()
//                               console.log(`RECENT WINNER : ${recentWinner}`)
//                               console.log("-------------------------")
//                               console.log(
//                                   `PLAYERS ADDRESS : ${accounts[0].address}`
//                               )
//                               console.log(
//                                   `PLAYERS ADDRESS : ${accounts[1].address}`
//                               )
//                               console.log(
//                                   `PLAYERS ADDRESS : ${accounts[2].address}`
//                               )
//                               console.log(
//                                   `PLAYERS ADDRESS : ${accounts[3].address}`
//                               )
//                               console.log("-----------------------")
//                               const raffleState = await raffle.getRaffleState()
//                               const endingTimeStamp =
//                                   await raffle.getLatestTimeStamp()
//                               const numPlayers =
//                                   await raffle.getNumberOfPlayers()
//                               const winnerEndingBalance =
//                                   await accounts[1].getBalance()
//                               assert.equal(numPlayers.toString(), "0")
//                               assert.equal(raffleState.toString(), "0")
//                               expect(endingTimeStamp > startingTimeStamp)

//                               assert.equal(
//                                   winnerEndingBalance.toString(),
//                                   winnerStartingBalance.add(
//                                       raffleEntranceFee
//                                           .mul(additionalEntrants)
//                                           .add(raffleEntranceFee)
//                                           .toString()
//                                   )
//                               )
//                           } catch (e) {
//                               reject(e)
//                           }
//                           resolve()
//                       })
//                       // setting up the listener

//                       //below , we will fire the event, and the listener will pick it up, and resolve
//                       const tx = await raffle.performUpkeep([])
//                       const txReceipt = await tx.wait(1)
//                       const winnerStartingBalance =
//                           await accounts[1].getBalance()
//                       await vrfCoordinatorV2Mock.fulfillRandomWords(
//                           txReceipt.events[1].args.requestId,
//                           raffle.address
//                       )
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

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Lottery", async () => {
          let deployer
          let Lottery
          let vrfCoordinatorV2Mock
          let interval
          let player
          let winnerStartingBalance
          const etherAmt = ethers.utils.parseEther("0.25")

          beforeEach(async () => {
              // deployer = (await getNamedAccounts()).deployer
              // player = (await getNamedAccounts()).player
              accounts = await ethers.getSigners()
              player = accounts[1]
              await deployments.fixture(["all"])
              Lottery = await ethers.getContract("Lottery")
              LotteryPlayer = Lottery.connect(player)
              vrfCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2_5Mock"
              )
              interval = await Lottery.getInterval()
          })

          describe("constructor", async () => {
              // it("Sets the vrfCoodrdinatorV2 address", async () => {
              //   const response = await Lottery.getvrfCoordinatorV2Mock()
              //   assert.equal(response, vrfCoordinatorV2Mock.address)
              // })
              it("Sets the ticket Price ", async () => {
                  const response = await Lottery.getTicketPrice()
                  assert.equal(
                      response.toString(),
                      netwokConfig[network.name]["ticketAmt"]
                  )
              })
              it("Sets the keyHash", async () => {
                  const response = await Lottery.getkeyHash()
                  assert.equal(
                      response.toString(),
                      netwokConfig[network.name]["keyHash"]
                  )
              })
              it("Sets the callbackGasLimit ", async () => {
                  const response = await Lottery.getcallbackGasLimit()
                  assert.equal(
                      response.toString(),
                      netwokConfig[network.name]["callbackGasLimit"]
                  )
              })
              it("Sets the interval", async () => {
                  assert.equal(
                      interval.toString(),
                      netwokConfig[network.name]["interval"]
                  )
              })
              it("Sets the Lottery Open", async () => {
                  const response = await Lottery.getLotteryState()
                  assert.equal(response.toString(), "0")
              })
          })
          describe("EnterLottery", async () => {
              it("Reverts if entrance fee is not paid", async () => {
                  await expect(
                      Lottery.EnterLottery({
                          value: ethers.utils.parseEther("0.20"),
                      })
                  ).to.be.revertedWith("Lottery__NotEnoughETHforTicket")
              })
              it("Reverts if the Lottery is closed", async () => {
                  await Lottery.EnterLottery({
                      value: ethers.utils.parseEther("0.25"),
                  })
                  await network.provider.send("evm_increaseTime", [
                      interval.toNumber() + 1,
                  ])
                  await network.provider.request({
                      method: "evm_mine",
                      params: [],
                  })
                  await Lottery.performUpkeep("0x")
                  await expect(
                      Lottery.EnterLottery({
                          value: ethers.utils.parseEther("0.25"),
                      })
                  ).to.be.revertedWith("Lottery__Closed")
              })
              it("Adds the sender to the funder array ", async () => {
                  await LotteryPlayer.EnterLottery({
                      value: etherAmt,
                  })
                  const contractPlayer = await LotteryPlayer.getPlayers(0)
                  assert.equal(player.address, contractPlayer)
              })
              it("Emits an event when player enters the lottery", async () => {
                  expect(
                      await LotteryPlayer.EnterLottery({ value: etherAmt })
                  ).to.emit(LotteryPlayer, "LotteryEnter")
              })
          })
          describe("CheckupKeep", async () => {
              it("return false if people havent send any eth", async () => {
                  await network.provider.send("evm_increaseTime", [
                      interval.toNumber() + 1,
                  ])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } =
                      await LotteryPlayer.callStatic.checkUpkeep([])
                  assert(!upkeepNeeded)
              })
              it("returns false if lottery is closed", async () => {
                  await LotteryPlayer.EnterLottery({ value: etherAmt })
                  await network.provider.send("evm_increaseTime", [
                      interval.toNumber() + 1,
                  ])
                  await network.provider.send("evm_mine", [])
                  await LotteryPlayer.performUpkeep([])
                  const lotteryState = await LotteryPlayer.getLotteryState()
                  const upkeepNeeded =
                      await LotteryPlayer.callStatic.checkUpkeep([])
                  assert.equal(lotteryState.toString(), "1")
                  assert.equal(upkeepNeeded[0], false)
              })
              it("returns false if enough time has not passed", async () => {
                  await LotteryPlayer.EnterLottery({ value: etherAmt })
                  await network.provider.send("evm_increaseTime", [
                      interval.toNumber() - 5,
                  ])
                  await network.provider.send("evm_mine", [])
                  const upkeepNeeded =
                      await LotteryPlayer.callStatic.checkUpkeep([])
                  assert.equal(upkeepNeeded[0], false)
              })
              it("returns true if all the upkeepconditions are satisfied", async () => {
                  await LotteryPlayer.EnterLottery({ value: etherAmt })
                  await network.provider.send("evm_increaseTime", [
                      interval.toNumber() + 1,
                  ])
                  await network.provider.send("evm_mine", [])
                  const upkeepNeeded =
                      await LotteryPlayer.callStatic.checkUpkeep([])
                  assert.equal(upkeepNeeded[0], true)
              })
          })
          describe("performUpkeep", async () => {
              it("is only performed when checkupkeep is true", async () => {
                  await LotteryPlayer.EnterLottery({ value: etherAmt })
                  await network.provider.send("evm_increaseTime", [
                      interval + 1,
                  ])
                  await network.provider.send("evm_mine", [])
                  response = await LotteryPlayer.performUpkeep([])
                  assert(response)
              })
              it("is not perfomed when the checkupkeep is false", async () => {
                  // Increase time by less than the interval
                  await network.provider.send("evm_increaseTime", [
                      interval - 1,
                  ])
                  await network.provider.send("evm_mine", [])

                  // Check upkeep conditions before calling performUpkeep
                  const { upKeepNeeded } = await LotteryPlayer.checkUpkeep([])
                  console.log("UpKeep Needed:", upKeepNeeded) // Should be false
                  assert(!upKeepNeeded, "UpKeep should not be needed")

                  // Assert no players entered the lottery
                  const playerCount = await LotteryPlayer.getNumPlayers()
                  assert.equal(
                      playerCount.toString(),
                      "0",
                      "No players should be present"
                  )

                  // Try performing upkeep when checkUpkeep is false
                  await expect(
                      LotteryPlayer.performUpkeep([])
                  ).to.be.revertedWith("Lottery__upKeepNotNeeded")
              })
              it("sets the lottery state and emits an event with requestId", async () => {
                  await LotteryPlayer.EnterLottery({ value: etherAmt })
                  await network.provider.send("evm_increaseTime", [
                      interval + 1,
                  ])
                  await network.provider.send("evm_mine", [])
                  const response = await LotteryPlayer.performUpkeep([])
                  const reciept = await response.wait(1)
                  const requestId = reciept.events[1].args.requestId
                  const lotteryState = await LotteryPlayer.getLotteryState()
                  assert(requestId.toNumber() > 0)
                  assert.equal(lotteryState.toString(), "1")
              })
          })
          describe("fulfillRandomWords", async () => {
              beforeEach(async () => {
                  await LotteryPlayer.EnterLottery({ value: etherAmt })
                  await network.provider.send("evm_increaseTime", [
                      interval + 1,
                  ])
                  await network.provider.send("evm_mine", [])
              })
              it("can only be called after performupkeep", async () => {
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(
                          0,
                          LotteryPlayer.address
                      )
                  ).to.be.reverted
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(
                          1,
                          LotteryPlayer.address
                      )
                  ).to.be.reverted
              })
              it("picks the winner, resets the lottery and sends the money", async () => {
                  // await player.sendTransaction({
                  //   to: LotteryPlayer.address,
                  //   value: ethers.utils.parseEther("5.0"), // Sending 1 ETH to the contract
                  // })
                  const contractBalanceBefore =
                      await ethers.provider.getBalance(LotteryPlayer.address)
                  console.log(
                      "Contract balance before upkeep:",
                      ethers.utils.formatEther(contractBalanceBefore)
                  )
                  const signers = await ethers.getSigners()
                  const numberofPlayers = 3
                  const startingindex = 2 // 0 is the owner , 1 is already a player
                  for (
                      i = startingindex;
                      i <= startingindex + numberofPlayers;
                      i++
                  ) {
                      const connectedAccount = await Lottery.connect(signers[i])
                      await connectedAccount.EnterLottery({ value: etherAmt })
                  }
                  const startingTimeStamp =
                      await LotteryPlayer.getLatestTimestamp()
                  const entranceFee = await LotteryPlayer.getTicketPrice()
                  await new Promise(async (resolve, reject) => {
                      LotteryPlayer.once("WinnerPicked", async () => {
                          console.log("Listner heard")
                          try {
                              const recentWinner =
                                  await LotteryPlayer.getRecentWinner()
                              console.log("recentWinner")
                              console.log(await recentWinner)
                              console.log("players")
                              for (i = 1; i <= 1 + numberofPlayers; i++) {
                                  console.log(signers[i].address)
                              }
                              const lotteryState =
                                  await LotteryPlayer.getLotteryState()
                              const endingTimeStamp =
                                  await LotteryPlayer.getLatestTimestamp()
                              const numPlayers =
                                  await LotteryPlayer.getNumPlayers()
                              const winner_endBal =
                                  await accounts[2].getBalance()
                              assert.equal(numPlayers.toString(), 0)
                              assert.equal(lotteryState.toString(), 0)
                              assert.equal(
                                  winner_endBal.toString(),
                                  winnerStartingBalance // startingBalance + ( (raffleEntranceFee * additionalEntrances) + raffleEntranceFee )
                                      .add(
                                          entranceFee
                                              .mul(numberofPlayers + 1)
                                              .add(entranceFee)
                                      )
                                      .toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (error) {
                              reject(error)
                          }
                      })
                      try {
                          const response = await LotteryPlayer.performUpkeep([])
                          const reciept = await response.wait(1)
                          winnerStartingBalance = await accounts[2].getBalance()
                          // we are acting like the vrfCoordinator
                          requestid = reciept.events[1].args.requestId
                          console.log(requestid)
                          await vrfCoordinatorV2Mock.fulfillRandomWords(
                              requestid,
                              LotteryPlayer.address
                          )
                      } catch (e) {
                          reject(e)
                      }
                  })
              })
          })
      })
