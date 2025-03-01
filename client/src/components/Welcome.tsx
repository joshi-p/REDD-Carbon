import React, { useContext } from "react";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { isAddress, parseEther } from "ethers";

import { TransactionContext } from "../context/TransactionContext";
import { Loader } from "./";

const commonStyles =
    "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

// Define props interface for Input component
interface InputProps {
    placeholder: string;
    name: string;
    type: string;
    value?: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
}

const Input: React.FC<InputProps> = ({ placeholder, name, type, value, handleChange }) => (
    <input
        placeholder={placeholder}
        type={type}
        step="0.0001"
        value={value}
        onChange={(e) => handleChange(e, name)}
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
);

const Welcome: React.FC = () => {
    const transactionContext = useContext(TransactionContext);

    if (!transactionContext) {
        return <p className="text-white">Loading...</p>; // Handle case when context is not available
    }

    const { connectWallet, currentAccount, formData, sendTransaction, handleChange, isLoading } = transactionContext;

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        let { addressTo, amount, keyword, message } = formData;

        addressTo = addressTo?.trim() || "";
        amount = amount?.toString().trim() || "";
        keyword = keyword?.trim() || "";
        message = message?.trim() || "";

        // ✅ Validate Ethereum address
        if (!isAddress(addressTo)) {
            alert("Invalid recipient address. Please enter a valid Ethereum address.");
            return;
        }

        // ✅ Validate amount (should be a positive number)
        try {
            parseEther(amount); // Converts to BigNumber to ensure validity
        } catch (error) {
            alert("Invalid amount. Please enter a valid number in ETH.");
            return;
        }

        // ✅ Ensure all fields are filled
        if (!addressTo || !amount || !keyword || !message) {
            alert("Please fill in all fields before proceeding.");
            return;
        }

        sendTransaction();
    };

    return (
        <div className="flex w-full justify-center items-center">
            <div className="flex md:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                <div className="flex flex-1 justify-start flex-col md:mr-10">
                    <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                        Trade Credits <br /> across the Globe
                    </h1>
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        Explore the marketplace. Trade carbon credits transparently with REDD Carbon.
                    </p>

                    {!currentAccount && (
                        <button
                            type="button"
                            onClick={connectWallet}
                            className="flex flex-row justify-center items-center my-5 bg-[#96c34e] p-3 rounded-full cursor-pointer hover:bg-[#9cca52]"
                        >
                            <p className="text-white text-base font-semibold">Connect Wallet</p>
                        </button>
                    )}

                    <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
                        <div className={`rounded-tl-2xl ${commonStyles}`}>Transparency</div>
                        <div className={commonStyles}>Security</div>
                        <div className={`rounded-tr-2xl ${commonStyles}`}>Reliability</div>
                        <div className={`rounded-bl-2xl ${commonStyles}`}>Decentralized</div>
                        <div className={commonStyles}>Web 3.0</div>
                        <div className={`rounded-br-2xl ${commonStyles}`}>Low Gas</div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
                    <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
                        <div className="flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                                    <span className="text-white text-lg">
                                        <SiEthereum />
                                    </span>
                                </div>
                                <span className="text-white text-lg">
                                    <BsInfoCircle />
                                </span>
                            </div>
                            <div>
                                <p className="text-white font-light text-sm">
                                    {currentAccount ? `Connected: ${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : "Not Connected"}
                                </p>
                                <p className="text-white font-semibold text-lg mt-1">Ethereum</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center white-glassmorphism">
                        <Input placeholder="Address To" name="addressTo" type="text" value={formData.addressTo} handleChange={handleChange} />
                        <Input placeholder="Amount (ETH)" name="amount" type="number" value={formData.amount} handleChange={handleChange} />
                        <Input placeholder="Keyword (Picture)" name="keyword" type="text" value={formData.keyword} handleChange={handleChange} />
                        <Input placeholder="Enter Message" name="message" type="text" value={formData.message} handleChange={handleChange} />

                        <div className="h-[1px] w-full bg-gray-400 my-2" />

                        {isLoading ? (
                            <Loader />
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="text-white w-full mt-2 border-[1px] p-2 border-[#96c34e] rounded-full cursor-pointer">
                                Trade Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
