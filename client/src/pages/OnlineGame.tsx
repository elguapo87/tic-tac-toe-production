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

  console.log(game);


  return (
    <div className='relative flex flex-col text-white'>
      <Profile type='game' />
      <OnlineBoard board={game?.board} />
    </div>
  )
}

export default OnlineGame
