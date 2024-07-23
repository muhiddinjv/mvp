import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chapters from './pages/Chapters';
import Chapter from './pages/Chapter';
import NoPage from "./pages/NoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Chapters />} />
        <Route path="/:chapterId" element={<Chapter />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
