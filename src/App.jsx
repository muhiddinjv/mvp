import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Surahs from './components/Surahs';
import Surah from './components/Surah';
import NotFound from './components/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Outlet />}>
          <Route index element={<Surahs />} />
          <Route path="/:id" element={<Surah />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
