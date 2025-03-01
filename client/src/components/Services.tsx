import React from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { AiOutlineEye } from "react-icons/ai";
import { FaBolt } from "react-icons/fa";

// Define types for ServiceCard props
interface ServiceCardProps {
    color: string;
    title: string;
    icon: React.ReactNode;
    subtitle: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ color, title, icon, subtitle }) => (
    <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl">
        <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
            {icon}
        </div>
        <div className="ml-5 flex flex-col flex-1">
            <h3 className="mt-2 text-white text-lg">{title}</h3>
            <p className="mt-1 text-white text-sm md:w-9/12">
                {subtitle}
            </p>
        </div>
    </div>
);

const Services: React.FC = () => (
    <div className="flex flex-col md: flex-row  w-full justify-center items-center gradient-bg-services">
        <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
            <div className="flex-1 flex flex-col justify-start items-start">
                <h1 className="text-white text-3xl sm:text-5xl py-2">
                    What we Believe and Emphasize on
                </h1>
                <p className="text-left my-2 text-white font-light text-base">
                    The best choice for trading your Carbon Credits is through a Decentralized Marketplace
                </p>
            </div>

            <div className="flex-1 flex flex-col justify-start items-center">
                <ServiceCard
                    color="bg-[#96c34e]"
                    title="Secured by the Blockchain"
                    icon={<span className="text-white" style={{ fontSize: 21 }}>
                        <BsShieldFillCheck />
                    </span>}
                    subtitle="Security is guaranteed. We always maintain privacy and uphold the quality of our products."
                />
                <ServiceCard
                    color="bg-[#96c34e]"
                    title="Transparency through Public Ledgers"
                    icon={<span className="text-white" style={{ fontSize: 21 }}>
                        <AiOutlineEye />
                    </span>}
                    subtitle="Ensuring clarity. We leverage technology through maintaining integrity in each transactions."
                />
                <ServiceCard
                    color="bg-[#96c34e]"
                    title="Near-Instant Transactions"
                    icon={<span className="text-white" style={{ fontSize: 21 }}>
                        <FaBolt />
                    </span>}
                    subtitle="Speed meets reliability— experience seamless, near-minute transactions compromise free."
                />
            </div>
        </div>
    </div>
);

export default Services;
