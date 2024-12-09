import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./modules/Routes";
import { WelcomePage } from "./components/WelcomePage";
import { MainPage } from "./components/MainPage"
import { CardPage } from "./components/CardPage";
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    if ((window as any).__Tauri__?.tauri) {
      const { invoke } = (window as any).__Tauri__.tauri;
      invoke('create')
        .then((response: any) => console.log(response))
        .catch((error: any) => console.log(error));
    } else {
      console.error("Tauri не инициализирован.");
    }
  }, []);

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