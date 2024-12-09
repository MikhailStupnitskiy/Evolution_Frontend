import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./modules/Routes";
import { WelcomePage } from "./components/WelcomePage";
import { MainPage } from "./components/MainPage"
import { CardPage } from "./components/CardPage";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path={ROUTES.START} index element={<WelcomePage />} />
      <Route path={ROUTES.HOME} index element={<MainPage />} />
      <Route path={`${ROUTES.HOME}/:id`} element={<CardPage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App