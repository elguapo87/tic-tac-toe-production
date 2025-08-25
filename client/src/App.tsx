import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"

function App() {
  return (
    <div className="bg-[#1b0383] min-h-screen flex flex-col text-stone-50">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
