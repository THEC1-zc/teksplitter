import React, { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x798763FF2cb11523344Fca274A19C393B3D921eF";

const App = () => {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } else {
      alert("Install MetaMask!");
    }
  };

  const distributeTokens = async () => {
    if (!account) return alert("Connect wallet first");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, [
      "function distribute(address tokenAddress) external"
    ], signer);

    const tokenAddress = prompt("Enter ERC20 token address to distribute:");
    try {
      const tx = await contract.distribute(tokenAddress);
      setStatus("Transaction sent: " + tx.hash);
      await tx.wait();
      setStatus("Distribution complete!");
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Teksplitter</h1>
      <p><strong>Contract Address:</strong> {CONTRACT_ADDRESS}</p>
      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <>
          <p>Connected: {account}</p>
          <button onClick={distributeTokens}>Distribute</button>
          <p>{status}</p>
        </>
      )}
    </div>
  );
};

export default App;