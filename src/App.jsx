import {
  useAppKit,
  useAppKitProvider,
  useAppKitAccount,
} from "@reown/appkit/react";
import { BrowserProvider, Contract } from "ethers";
import { sepolia } from "@reown/appkit/networks";
import "./config/appKit";
import abi from "./connections/testABI";

const contractAddress = import.meta.env.VITE__TEST_CONTRACT_ADDRESS;

if (!contractAddress) {
  throw new Error("contract address is not defined");
}

export default function App() {
  const { open } = useAppKit();
  const {
    // address,
    isConnected,
  } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  console.log(sepolia.rpcUrls);

  async function getBalance() {
    try {
      if (!isConnected) throw Error("User disconnected");

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      // The Contract object
      const contract = new Contract(contractAddress, abi, signer);
      const balance = await contract.unlockTime();

      // console.log(formatUnits(balance, 18));
      console.log(balance, typeof balance);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <button onClick={() => open({ view: "connect" })}>connect</button>
      <button onClick={() => open({ view: "Account" })}>Account</button>
      <button onClick={getBalance}>get Balance</button>
    </div>
  );
}
