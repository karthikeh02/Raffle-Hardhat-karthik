import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled, Moralis } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [ticketPrice, setTicketPrice] = useState("0")
    const [numPlayer, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    // const [gasEstimate, setGasEstimate] = useState("0")
    //make entrancefee from normal variable to a hook
    //entrancefee: the variable we call to get the entrance fee
    //entrancefee: the function we call to update or set that entrance fee
    //here useState tell us where the entrancefee is going to start which is 0

    const dispatch = useNotification()

    const {
        runContractFunction: EnterLottery,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specific network Id
        functionName: "EnterLottery",
        params: {},
        msgValue: ticketPrice,
    })

    /**View Functions */

    const { runContractFunction: getTicketPrice } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specific network Id
        functionName: "getTicketPrice",
        params: {},
    })

    const { runContractFunction: getNumPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specific network Id
        functionName: "getNumPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    console.log("Chain ID:", chainId) // Log the chain ID
    console.log("Contract Addresses:", contractAddresses)

    async function updateUI() {
        // Another way we could make a contract call:
        // const options = { abi, contractAddress: raffleAddress }
        // const fee = await Moralis.executeFunction({
        //     functionName: "getEntranceFee",
        //     ...options,
        // })
        if (!raffleAddress) {
            console.error("Raffle address is not defined")
            return
        }
        // const entrancefeeFromCall = (await getTicketPrice()).toString()
        // const numPlayerFromCall = (await getNumPlayers()).toString()
        // const recentWinnerFromCall = await getRecentWinner()
        // setTicketPrice(entrancefeeFromCall)
        // setNumPlayers(numPlayerFromCall)
        // setRecentWinner(recentWinnerFromCall)
        try {
            const entrancefeeFromCall = await getTicketPrice()
            const numPlayerFromCall = await getNumPlayers()
            const recentWinnerFromCall = await getRecentWinner()

            // Check if any of these values are undefined
            if (entrancefeeFromCall !== undefined) {
                setTicketPrice(entrancefeeFromCall.toString())
            } else {
                console.error("Entrance fee is undefined")
            }

            if (numPlayerFromCall !== undefined) {
                setNumPlayers(numPlayerFromCall.toString())
            } else {
                console.error("Number of players is undefined")
            }

            if (recentWinnerFromCall !== undefined) {
                setRecentWinner(recentWinnerFromCall)
            } else {
                console.error("Recent winner is undefined")
            }
            // const estimatedGas = await Moralis.Web3API.native.runContractFunction({
            //     abi: abi,
            //     contractAddress: raffleAddress,
            //     functionName: "EnterLottery",
            //     params: {},
            // })
            // setGasEstimate(estimatedGas.toString())
        } catch (error) {
            console.error("Error updating UI: ", error)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled && raffleAddress) {
            //try to read the raffle entrance fee

            updateUI()
        }
    }, [isWeb3Enabled, raffleAddress])

    // no list means it'll update everytime anything changes or happens
    // empty list means it'll run once after the initial rendering
    // and dependencies mean it'll run whenever those things in the list change

    // An example filter for listening for events, we will learn more on this next Front end lesson
    // const filter = {
    //     address: raffleAddress,
    //     topics: [
    //         // the name of the event, parnetheses containing the data type of each event, no spaces
    //         utils.id("RaffleEnter(address)"),
    //     ],
    // }

    /**-------------------------------------------------------- */

    /** Notification: to let the user know you have submitted the transactiion
     * for the notification => upon clicking the button if tx is succesful
     *                         it calls handleSucces fn.
     *
     * Created handleSucces fn :
     * 1. called when the enter raffle tx is successfull
     * 2. the function waits for that rx to complete
     *     and then calls handleNewNotification fn
     *
     * HandleNewNotification fn:
     * 1. dispatches the notification on the screen
     *
     */
    const handleSuccess = async function (tx) {
        try {
            await tx.wait(1)
            updateUI()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction complete!",
            title: "Tx Notifiction",
            position: "topR",
            icon: "bell",
        })
    }

    /**-------------------------------------------------------- */

    /**In return:
     * 1. first we will check if there is any entry or not
     *    meaning we will check the raffle address
     * 2. Then we created a button to enter the Raffle
     *     Here we are connecting the backend through the button
     * 3. We are displaying the Entrance Fee of the lottery in eth
     */

    return (
        <div className="p-5">
            <h1 className="py-4 px-4 font-bold text-3xl">Lottery</h1>
            {raffleAddress ? (
                <>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () =>
                            await EnterLottery({
                                // onComplete:
                                // onError:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                                gasLimit: 1000000,
                            })
                        }
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Enter Raffle"
                        )}
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(ticketPrice, "ether")} ETH</div>
                    <div>The current number of players is: {numPlayer}</div>
                    {/* <div>Estimated Gas Fee: {gasEstimate} units</div> */}
                    <div>The most previous winner was: {recentWinner}</div>
                </>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    )
}
