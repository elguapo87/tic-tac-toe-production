import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import OnlineLobby from "./pages/OnlineLobby"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <div className="bg-[#16026e] min-h-screen flex flex-col text-stone-50">
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<OnlineLobby />} />
      </Routes>
    </div>
  )
}

export default App
