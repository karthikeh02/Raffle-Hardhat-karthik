🏆 Lottery DApp - Ethereum Smart Contract
This is a decentralized lottery application built on Ethereum. Users can enter the lottery by paying a ticket price in ETH, and after a specified number of participants, the contract randomly selects a winner using Chainlink VRF (Verifiable Random Function) for randomness and Chainlink Keepers for automation. The winner receives all the collected funds.

Features
Enter Lottery: Users can enter the lottery by sending the ticket price.
Random Winner Selection: Uses Chainlink VRF for secure randomness in picking a winner.
Automation: Chainlink Keepers automate the process of selecting the winner after a certain condition (like number of players) is met.
Real-time UI Updates: The frontend displays the current ticket price, number of players, and most recent winner.
Prerequisites
Before running this project, ensure you have the following installed:

Node.js (v14.x or higher)
Yarn or npm
Hardhat (for smart contract development)
MetaMask (for interacting with the DApp)
Chainlink Account (for VRF and Keepers setup)
Smart Contract Details
The Lottery contract allows users to enter by paying an entry fee, and after certain criteria are met, it picks a winner and transfers the collected ETH.

Contract Functions
EnterLottery: Allows users to participate in the lottery.
getTicketPrice: Returns the price to enter the lottery.
getNumPlayers: Returns the number of current participants.
getRecentWinner: Returns the address of the most recent winner.
Deployment
The contract is deployed on the Sepolia Ethereum testnet and utilizes Chainlink VRF and Keepers for automation and randomness.

Setup and Installation

1. Clone the Repository
   bash
   Copy code
   git clone https://github.com/karthikeh02/Raffle-Hardhat-karthik.git
   cd lottery
2. Install Dependencies
   Run the following command to install the required dependencies for both the frontend and smart contract.

bash
Copy code
yarn install 3. Smart Contract Deployment
You'll need to deploy the smart contract on an Ethereum testnet like Sepolia. Follow these steps:

Open hardhat.config.js and update the network configuration with your private key and RPC URL.

Deploy the contract using Hardhat:

bash
Copy code
yarn hardhat deploy --network sepolia
This will deploy the contract and output the address where the contract is deployed.

4. Chainlink Setup
   Make sure you set up Chainlink VRF and Keepers for randomness and automation. You'll need to update your contract with the appropriate subscription ID and key hash from Chainlink.

5. Frontend Configuration
   Update the frontend to reflect your deployed contract’s address.

Go to constants/contractAddresses.json and constants/abi.json, and update them with the contract address and ABI generated during deployment. 6. Running the Frontend
You can run the frontend locally by using the following command:

bash
Copy code
yarn start
Open the application in your browser at http://localhost:3000/.

7. Testing the Contract
   Run your tests using Hardhat to ensure everything is working correctly:

bash
Copy code
yarn hardhat test
Usage
Once everything is set up, you can start using the Lottery DApp. Here's a brief overview of the steps:

Connect your Wallet: Use MetaMask to connect your wallet to the DApp.
Enter the Lottery: Click on the "Enter Raffle" button to participate by sending the required ETH.
Wait for Winner Selection: Once the criteria are met (e.g., enough participants), Chainlink VRF will select a random winner.
View the Winner: The frontend will display the most recent winner and the number of players.
Screenshots

1. Lottery Page
   Displays current entrance fee, number of players, and most recent winner.

2. Transaction Notification
   Displays transaction completion using Web3UIKit notifications.

Technologies Used
Solidity: Smart contract development.
Hardhat: Ethereum development environment.
React: Frontend framework for building UI.
Ethers.js: Blockchain interaction in the frontend.
Moralis: Web3 utilities and state management.
Chainlink VRF: Secure randomness for selecting lottery winners.
Chainlink Keepers: Automation for winner selection.

License
This project is licensed under the MIT License. See the LICENSE file for details.
