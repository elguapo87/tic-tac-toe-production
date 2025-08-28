import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import OnlineLobby from "./pages/OnlineLobby"
import { Toaster } from "react-hot-toast"
import Login from "./pages/Login"

function App() {
  return (
    <div className="bg-[#16026e] min-h-screen flex flex-col text-stone-50">
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<OnlineLobby />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
