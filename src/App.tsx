import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./modules/Routes";
import { WelcomePage } from "./components/WelcomePage";
import { MainPage } from "./components/MainPage";
import { CardPage } from "./components/CardPage";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Выполнять вызов Tauri API только в режиме разработки
    if (import.meta.env.MOD !== "production" && (window as any).__TAURI__) {
      const { invoke } = (window as any).__TAURI__.tauri;
      invoke("create")
        .then((response: any) => console.log(response))
        .catch((error: any) => console.error("Ошибка Tauri:", error));
    }
  }, []);

  return (
    <BrowserRouter basename="/Evolution_Frontend">
      <Routes>
        <Route path={ROUTES.START} index element={<WelcomePage />} />
        <Route path={ROUTES.HOME} index element={<MainPage />} />
        <Route path={`${ROUTES.HOME}/:id`} element={<CardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
