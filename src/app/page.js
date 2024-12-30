'use client';
import { useState } from 'react';
import { getContract, connectWallet, deployChessContract, getBoard } from './web3';

export default function Home() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState(null);
  async function connectPlayer1(){
    const wallet = await connectWallet();
    setPlayer1(wallet);
  }

  async function connectPlayer2(){
    const wallet = await connectWallet();
    setPlayer2(wallet);
  }

  async function startGame(){
    const contract = await getContract();
    await deployChessContract(player1, player2);
    setGameStarted(true);
    const board = await getBoard();
    setBoard(board);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Web3 Chess</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={connectPlayer1}>Connect Player 1</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={connectPlayer2}>Connect Player 2</button>
        {!gameStarted && player1 !== null && player2 !== null && <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={startGame}>Start Game</button>}
        {gameStarted && <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Board</h2>
          <div className="grid grid-cols-8 grid-rows-8">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-col">
                {row.map((cell, colIndex) => (
                  <div key={colIndex} className="w-10 h-10 bg-gray-200"></div>
                ))}
              </div>
            ))}
          </div>
        </div>}
      </main>
    </div>
  );
}
