import {
  useAppKit,
  useAppKitProvider,
  useAppKitAccount,
} from "@reown/appkit/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import "./config/appKit";

const contractAddress = "0x617f3112bf5397D0467D315cC709EF968D9ba546";
const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

export default function App() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  async function getBalance() {
    try {
      if (!isConnected) throw Error("User disconnected");

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      // The Contract object
      const contract = new Contract(contractAddress, abi, signer);
      const balance = await contract.balanceOf(address);

      console.log(formatUnits(balance, 18));
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
