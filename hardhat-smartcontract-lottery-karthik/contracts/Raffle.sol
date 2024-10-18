// // Raffle

// // Enter the Lottery (paying some amount)
// // Pick a random Winner (verifiably random)
// // Winner to be selected every X minutes -> completely Automated

// //Chainlink Oracle -> Randomness, Automated execution(Chainlink Keepers)

// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.24;

// //Imports

// import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

// //Errors

// error Raffle__NotEnoughETHEntered();
// error Raffle__TransferFailed();
// error Raffle__NotOpen();
// error Raffle__UpKeepNotNeeded(
//     uint256 currentBalance,
//     uint256 numPlayers,
//     uint256 raffleState
// );

// /**
//  * @title A Sample Raffle Contract
//  * @author Karthi Keyan/ Carti
//  * @notice This Contract is for craeting an untamperable decentralized smart contract
//  * @dev This implements chainlink VRF V2 and Chainlink Keepers
//  */

// contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
//     //Type Declarations
//     enum RaffleState {
//         OPEN,
//         CALCULATING
//     } // uint256 0 = OPEN , 1 = CALCULATING

//     // State Variables

//     uint256 private immutable i_entranceFee;
//     address payable[] private s_players;
//     VRFCoordinatorV2Interface i_vrfCoordinator;
//     bytes32 private immutable i_gasLane;
//     uint64 private immutable i_subscriptionId;
//     uint16 private constant REQUEST_CONFIRMATIONS = 3;
//     uint32 private immutable i_callbackGasLimit;
//     uint32 private constant NUM_WORDS = 1;

//     //Lottery Variables

//     address private s_recentWinner;
//     // uint256 private s_isOpen; // pending, open, closed ,calculating-> 1,2,3,4
//     // This up can be performed by ENUM
//     RaffleState private s_raffleState;
//     uint256 private s_lastTimeStamp;
//     uint256 private immutable i_interval;

//     //Events

//     event RaffleEnter(address indexed player);
//     event WinnerPicked(address indexed winner);
//     event RequestedRaffleWinner(uint256 indexed requestId);

//     //Functions

//     constructor(
//         address vrfCoordinatorV2, // Contract Address
//         uint256 entranceFee,
//         bytes32 gasLane,
//         uint64 subscriptionId,
//         uint32 callbackGasLimit,
//         uint256 interval
//     ) VRFConsumerBaseV2(vrfCoordinatorV2) {
//         i_entranceFee = entranceFee;
//         i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
//         i_gasLane = gasLane;
//         i_subscriptionId = subscriptionId;
//         i_callbackGasLimit = callbackGasLimit;
//         s_raffleState = RaffleState.OPEN;
//         s_lastTimeStamp = block.timestamp;
//         i_interval = interval;
//     }

//     function enterRaffle() public payable {
//         if (msg.value < i_entranceFee) {
//             revert Raffle__NotEnoughETHEntered();
//         }
//         if (s_raffleState != RaffleState.OPEN) {
//             revert Raffle__NotOpen();
//         }
//         s_players.push(payable(msg.sender));
//         //Events???
//         emit RaffleEnter(msg.sender);
//     }

//     /**`
//      * @dev This is the function that the chainlink keeper nodes call
//      * they look for the `upKeepNeeded` to return True
//      * The following should be true in order to return true
//      * 1. Our time interval should have passed
//      * 2. The lottery should have atleast one player ,and have some eth
//      * 3. Our subscription is founded with LINK.
//      * 4. The lottery should be in "open" State
//      * 5. While we waiting for the random number to generate for the winner, we will be in a closed state
//      *
//      */
//     function checkUpkeep(
//         bytes memory /*checkData*/
//     )
//         public
//         override
//         returns (bool upkeepNeeded, bytes memory /* performData*/)
//     {
//         bool isOpen = (RaffleState.OPEN == s_raffleState);
//         // then namaku venum ngrthu time ku so TIMESTAMP
//         //(block.timestamp - last block timestamp) > interval
//         bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
//         bool hasPlayers = (s_players.length > 0);
//         bool hasBalance = address(this).balance > 0;
//         // If this upkeepNeeded is true; all the bool is passed and its time to end the lottery
//         //if its false, Its not time yet
//         upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
//         return (upkeepNeeded, "0x");
//     }

//     function performUpkeep(bytes calldata /* performData*/) external override {
//         (bool upkeepNeeded, ) = checkUpkeep("");
//         if (!upkeepNeeded) {
//             revert Raffle__UpKeepNotNeeded(
//                 address(this).balance,
//                 s_players.length,
//                 uint256(s_raffleState)
//             );
//         }
//         //Request the Random Number
//         // Once we get it,do something with it
//         //  ChainLink VRF is a 2 Transaction Process
//         s_raffleState = RaffleState.CALCULATING;
//         uint256 requestId = i_vrfCoordinator.requestRandomWords(
//             i_gasLane,
//             i_subscriptionId,
//             REQUEST_CONFIRMATIONS,
//             i_callbackGasLimit,
//             NUM_WORDS
//         );
//         emit RequestedRaffleWinner(requestId);
//     }

//     function fulfillRandomWords(
//         uint256 requestId,
//         uint256[] memory randomWords
//     ) internal virtual override {
//         uint256 indexOfWinner = randomWords[0] % s_players.length;
//         address payable recentWinner = s_players[indexOfWinner];
//         s_recentWinner = recentWinner;
//         s_raffleState = RaffleState.OPEN;
//         s_players = new address payable[](0);
//         (bool success, ) = recentWinner.call{value: address(this).balance}("");
//         if (!success) {
//             revert Raffle__TransferFailed();
//         }
//         emit WinnerPicked(recentWinner);
//     }

//     // View / Pure Functions

//     function getEntranceFee() public view returns (uint256) {
//         return i_entranceFee;
//     }

//     function getPlayer(uint256 index) public view returns (address) {
//         return s_players[index];
//     }

//     function getRecentWinner() public view returns (address) {
//         return s_recentWinner;
//     }

//     function getRaffleState() public view returns (RaffleState) {
//         return s_raffleState;
//     }

//     function getNumWords() public pure returns (uint256) {
//         return NUM_WORDS;
//     }

//     function getNumberOfPlayers() public view returns (uint256) {
//         return s_players.length;
//     }

//     function getLatestTimeStamp() public view returns (uint256) {
//         return s_lastTimeStamp;
//     }

//     function getRequestConfirmations() public pure returns (uint256) {
//         return REQUEST_CONFIRMATIONS;
//     }

//     function getInterval() public view returns (uint256) {
//         return i_interval;
//     }
// }

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

error Lottery__NotEnoughETHforTicket();
error Lottery__TransactionFailed();
error Lottery__Closed();
error Lottery__upKeepNotNeeded(uint256 currentBal, uint256 numberOfPlayers, uint256 lotteryState);

/**
 * @title A Ethereum Lottery Smart Contract
 * @author Harigovind M G
 * @notice This is a smart contract for creating a Fair and Random Lottery
 * @dev This implements Chainlink VRF for ensuring the randomness and Chainlink Keepers for the automation of the Lottery
 */
contract Lottery is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
    /* enums */
    enum LotteryState {
        OPEN,
        CALCULATING
    }

    /* State variables */
    uint256 private immutable i_ticketPrice;
    address payable[] private s_players;
    bytes32 private immutable i_keyHash;
    uint256 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATION = 3;
    uint32 private constant NUM_WORDS = 1;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    /*  Lottery Variables */
    address private s_recentWinner;
    LotteryState private s_LotteryState;

    /* Events */
    event LotteryEnter(address indexed player);
    event RequestedLotteryWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    /* Functions */

    constructor(
        address vrfCoordinatorV2,
        uint256 ticketPrice,
        bytes32 keyHash,
        uint256 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2Plus(vrfCoordinatorV2) {
        i_ticketPrice = ticketPrice;
        // i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_keyHash = keyHash;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_LotteryState = LotteryState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    function checkUpkeep(bytes memory /* checkData */ )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */ )
    {
        bool isOpen = (s_LotteryState == LotteryState.OPEN);
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
        return (upkeepNeeded, "0x0");
    }

    function performUpkeep(bytes calldata /* performData */ ) external override {
        // (bool upkeepNeeded,) = checkUpkeep("");
        // if (!upkeepNeeded) {
        //     revert Lottery__upKeepNotNeeded(
        //         address(this).balance,
        //         s_players.length,
        //         uint256(s_LotteryState)
        //     );
        // }
        s_LotteryState = LotteryState.CALCULATING;
        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: i_keyHash,
                subId: i_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATION,
                callbackGasLimit: i_callbackGasLimit,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: true}))
            })
        );
        emit RequestedLotteryWinner(requestId);
    }

    function EnterLottery() public payable {
        if (msg.value < i_ticketPrice) {
            revert Lottery__NotEnoughETHforTicket();
        }
        if (s_LotteryState != LotteryState.OPEN) {
            revert Lottery__Closed();
        }
        s_players.push(payable(msg.sender));
        emit LotteryEnter(msg.sender);
    }

    function fulfillRandomWords(uint256, /*requestId*/ uint256[] calldata randomWords) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        (bool callSuc,) = recentWinner.call{value: address(this).balance}("");
        s_LotteryState = LotteryState.OPEN;
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;
        if (!callSuc) {
            revert Lottery__TransactionFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    receive() external payable {}

    // function getvrfCoordinatorV2Mock() public view returns(address){
    //     return address(i_vrfCoordinator);
    // }

    function getTicketPrice() public view returns (uint256) {
        return i_ticketPrice;
    }

    function getPlayers(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getLotteryState() public view returns (LotteryState) {
        return s_LotteryState;
    }

    function getNumPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getLatestTimestamp() public view returns (uint256) {
        return uint256(s_lastTimeStamp);
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getkeyHash() public view returns (bytes32) {
        return i_keyHash;
    }

    function getsubscriptionId() public view returns (uint256) {
        return i_subscriptionId;
    }

    function getcallbackGasLimit() public view returns (uint32) {
        return i_callbackGasLimit;
    }

    function getNumWords() public pure returns (uint32) {
        return NUM_WORDS;
    }

    function getRequestConfirmations() public pure returns (uint16) {
        return REQUEST_CONFIRMATION;
    }
}
