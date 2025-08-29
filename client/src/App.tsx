import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import OnlineLobby from "./pages/OnlineLobby"
import { Toaster } from "react-hot-toast"
import Login from "./pages/Login"
import { useContext } from "react"
import { AppContext } from "./context/AppContext"
import OnlineGame from "./pages/OnlineGame"

function App() {

  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("App must be within AppContextProvider");
  const { authUser } = appContext;

  return (
    <div className="bg-[#16026e] min-h-screen flex flex-col text-stone-50">
      <Toaster />
      <Routes>
        <Route path="/" element={!authUser ? <Home /> : <Navigate to="/lobby" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/lobby" />} />
        <Route path="/lobby" element={authUser ? <OnlineLobby /> : <Navigate to="/" />} />
        <Route path="/online" element={<OnlineGame />} />
      </Routes>
    </div>
  )
}

export default App
