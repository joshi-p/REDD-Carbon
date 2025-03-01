import React, { useEffect, useState, createContext, ReactNode } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

// Define Type for Transaction Context
interface TransactionContextType {
    transactionCount: number;
    connectWallet: () => Promise<void>;
    transactions: any[];
    currentAccount: string | null;
    isLoading: boolean;
    sendTransaction: () => Promise<void>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
    formData: { addressTo: string; amount: string; keyword: string; message: string };
    setFormData: React.Dispatch<React.SetStateAction<{ addressTo: string; amount: string; keyword: string; message: string }>>;
}

// Create Context with Default Values
export const TransactionContext = createContext<TransactionContextType | null>(null);

// Define Props Type for Provider
interface TransactionsProviderProps {
    children: ReactNode;
}

// Fix `window.ethereum` type safety
declare global {
    interface Window {
        ethereum?: any;
    }
}

// Function to create Ethereum contract instance
const createEthereumContract = async (): Promise<ethers.Contract | null> => {
    if (!window.ethereum) {
        console.error("No Ethereum object found.");
        return null;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
};

export const TransactionProvider: React.FC<TransactionsProviderProps> = ({ children }) => {
    const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [currentAccount, setCurrentAccount] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [transactionCount, setTransactionCount] = useState<number>(Number(localStorage.getItem("transactionCount")) || 0);
    const [transactions, setTransactions] = useState<any[]>([]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const getAllTransactions = async () => {
        if (!window.ethereum) return console.log("Ethereum is not present");

        try {
            const transactionsContract = await createEthereumContract();
            if (!transactionsContract) return;

            const availableTransactions = await transactionsContract.getAllTransactions();

            console.log("Raw Transactions:", availableTransactions); // Debugging

            const structuredTransactions = availableTransactions.map((transaction: any) => {
                console.log("Transaction Data:", transaction);
                console.log("Receiver:", transaction.receiver);
                console.log("Sender:", transaction.sender); // Debugging

                return {
                    addressTo: transaction?.receiver || "Unknown",
                    addressFrom: transaction?.sender || "Unknown",
                    timestamp: transaction.timestamp
                        ? new Date(Number(transaction.timestamp) * 1000).toLocaleString()
                        : "Unknown Time", // Fallback to avoid errors
                    message: transaction.message || "",
                    keyword: transaction.keyword || "",
                    amount: transaction.amount
                        ? ethers.formatUnits(transaction.amount, "ether")
                        : "0", // Prevent undefined error
                };
            });

            console.log("Processed Transactions:", structuredTransactions); // Check final array
            setTransactions(structuredTransactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const checkIfWalletIsConnected = async () => {
        try {
            if (!window.ethereum) {
                console.warn("MetaMask not installed.");
                return;
            }
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                getAllTransactions();
            } else {
                setCurrentAccount(null);
                console.log("No accounts found");
            }
        } catch (error) {
            console.error("Error checking wallet connection:", error);
        }
    };


    const checkIfTransactionsExists = async () => {
        try {
            const transactionsContract = await createEthereumContract();
            if (!transactionsContract) return;
            const currentTransactionCount = await transactionsContract.getTransactionCount();
            localStorage.setItem("transactionCount", currentTransactionCount.toString());
        } catch (error) {
            console.error("Error checking transactions:", error);
        }
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert("Please install MetaMask.");
                return;
            }
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]); // ✅ Manually update state
                console.log("Wallet Connected:", accounts[0]);
            } else {
                console.log("No accounts found.");
            }

        } catch (error: any) {
            console.error("Error connecting wallet:", error);
            // if (error.code === 4001) {
            //     alert("You rejected the connection request.");
            // }
        }
    };

    const sendTransaction = async () => {
        try {
            if (!window.ethereum) {
                alert("MetaMask is not installed!");
                return;
            }

            if (!currentAccount) {
                alert("Please connect your wallet first.");
                return;
            }

            const { addressTo, amount, keyword, message } = formData;
            const transactionsContract = await createEthereumContract();
            if (!transactionsContract) return;

            const parsedAmount = ethers.parseEther(amount);

            await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208", // 21000 Gwei
                    value: parsedAmount.toString(),
                }],
            });

            const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true);
            console.log(`Loading -${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success -${transactionHash.hash}`);

            const transactionsCount = await transactionsContract.getTransactionCount();
            setTransactionCount(transactionsCount.toNumber());
            window.location.reload();

        } catch (error) {
            console.error("Error sending transaction:", error);
        }
    };

    useEffect(() => {
        (async () => {
            await checkIfWalletIsConnected();
            await checkIfTransactionsExists();
        })();
    }, [transactionCount]);

    return (
        <TransactionContext.Provider
            value={{
                transactionCount,
                connectWallet,
                transactions,
                currentAccount,
                isLoading,
                sendTransaction,
                handleChange,
                formData,
                setFormData,
            }}>
            {children}
        </TransactionContext.Provider>
    );
};
