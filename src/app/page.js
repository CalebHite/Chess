'use client';
import { getContract, connectWallet, deployChessContract } from './web3';
import { useEffect } from 'react';

let player1 = null;
let player2 = null;

async function connectPlayer1(){
  const wallet = await connectWallet();
  player1 = wallet;
}

async function connectPlayer2(){
  const wallet = await connectWallet();
  player2 = wallet;
}

async function startGame(){
  const contract = await getContract();
  await deployChessContract(player1, player2);
}

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Web3 Chess</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={connectPlayer1}>Connect Player 1</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={connectPlayer2}>Connect Player 2</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={startGame}>Start Game</button>
      </main>
    </div>
  );
}
