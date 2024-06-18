import { BrowserRouter, Routes, Route } from "react-router-dom";
import Surahs from './pages/Surahs';
import Surah from './pages/Surah';
import NoPage from "./pages/NoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Surahs />} />
        <Route path="/:id" element={<Surah />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
