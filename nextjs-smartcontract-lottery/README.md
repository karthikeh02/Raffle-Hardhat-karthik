# Decentralized Lottery DApp on Ethereum

## Overview
This decentralized lottery application is built on the Ethereum blockchain, allowing users to participate by purchasing tickets with ETH. After a predetermined number of participants, the contract uses Chainlink VRF (Verifiable Random Function) to securely select a random winner, and Chainlink Keepers to automate the process.

## Features
- **Enter Lottery**: Users can enter the lottery by sending the ticket price in ETH.
- **Random Winner Selection**: Chainlink VRF ensures secure randomness in selecting the winner.
- **Automation**: Chainlink Keepers automate winner selection once conditions (like participant count) are met.
- **Real-time UI Updates**: The frontend displays current ticket prices, participant counts, and recent winners.

## Prerequisites
Before running this project, ensure you have the following installed:
- Node.js (v14.x or higher)
- Yarn or npm
- Hardhat (for smart contract development)
- MetaMask (for interacting with the DApp)
- Chainlink Account (for VRF and Keepers setup)

## Smart Contract Details
The Lottery contract allows users to enter by paying an entry fee, and once certain criteria are met, it picks a winner and transfers the collected ETH.

### Contract Functions
- **EnterLottery**: Allows users to participate in the lottery.
- **getTicketPrice**: Returns the current price to enter the lottery.
- **getNumPlayers**: Returns the number of current participants.
- **getRecentWinner**: Returns the address of the most recent winner.

## Deployment
The contract is deployed on the Sepolia Ethereum testnet and utilizes Chainlink VRF and Keepers for randomness and automation.

## Setup and Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/karthikeh02/Raffle-Hardhat-karthik.git
   cd lottery
   ```

2. **Install Dependencies**
   Run the following command to install the required dependencies:
   ```bash
   yarn install
   ```

3. **Smart Contract Deployment**
   Open `hardhat.config.js` and update the network configuration with your private key and RPC URL.

   Deploy the contract using Hardhat:
   ```bash
   yarn hardhat deploy --network sepolia
   ```
   This command will deploy the contract and output the address where it is deployed.

4. **Chainlink Setup**
   Set up Chainlink VRF and Keepers for randomness and automation. Update your contract with the appropriate subscription ID and key hash from Chainlink.

5. **Frontend Configuration**
   Update the frontend with your deployed contract’s address. Modify `constants/contractAddresses.json` and `constants/abi.json` with the contract address and ABI generated during deployment.

6. **Running the Frontend**
   You can run the frontend locally:
   ```bash
   yarn start
   ```
   Open the application in your browser at `http://localhost:3000/`.

7. **Testing the Contract**
   Run your tests using Hardhat:
   ```bash
   yarn hardhat test
   ```

## Usage
Once everything is set up, follow these steps to use the Lottery DApp:
1. **Connect your Wallet**: Use MetaMask to connect your wallet to the DApp.
2. **Enter the Lottery**: Click the "Enter Raffle" button to participate by sending the required ETH.
3. **Wait for Winner Selection**: Once the criteria are met (e.g., enough participants), Chainlink VRF will select a random winner.
4. **View the Winner**: The frontend will display the most recent winner and the number of players.

## Screenshots
1. **Lottery Page**: Displays the current entrance fee, number of players, and the most recent winner.
2. **Transaction Notification**: Shows transaction completion using Web3UIKit notifications.

## Technologies Used
- **Solidity**: Smart contract development.
- **Hardhat**: Ethereum development environment.
- **React**: Frontend framework for building UI.
- **Ethers.js**: Blockchain interaction in the frontend.
- **Moralis**: Web3 utilities and state management.
- **Chainlink VRF**: Secure randomness for selecting lottery winners.
- **Chainlink Keepers**: Automation for winner selection.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
