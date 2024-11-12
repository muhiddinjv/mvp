import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chapters from './pages/Chapters';
import Chapter from './pages/Chapter';
import NoPage from "./pages/NoPage";
import HowTo from "./pages/HowTo";
import Stories from "./pages/Stories";
import SpeechRecognition from "./pages/anki/SpeechRecognition";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Chapters />} />
        <Route path="/:chapterid" element={<Chapter />} />
        <Route path="/howto" element={<HowTo />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
