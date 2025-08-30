import React, { useContext } from 'react'
import Profile from '../components/Profile'
import { AppContext } from '../context/AppContext'
import OnlineBoard from '../components/OnlineBoard';

const OnlineGame = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("OnlineGame must be within AppContextProvider");
  const { authUser, selectedUser, game, makeMove, users } = context;

  if (!game) {
    return (
      <div className="flex justify-center items-center h-full text-white">
        Waiting for game to start...
      </div>
    )
  }

  const handleBoxClick = async (index: number) => {
    try {
      // prevent move if game is over or cell already filled
      if (game.isOver || game.board[index] !== null) return;
  
      // check if it's this player's turn
      const isX = game.players[0] === authUser?._id;
      const mySymbol = isX ? "X" : "O";
      const currentTurn = game.xPlaying ? "X" : "O";
  
      if (mySymbol !== currentTurn) return;
  
      await makeMove(game._id, index);
      
    } catch (error) {
      console.error("Failed to make a move", error);
    }
  };


  return (
    <div className='relative flex flex-col text-white'>
      <Profile type='game' />
      <OnlineBoard board={game?.board} onClickBox={handleBoxClick} />
    </div>
  )
}

export default OnlineGame
