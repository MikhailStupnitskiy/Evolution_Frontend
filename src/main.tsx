import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import App from './App.tsx'
import { store } from "../src/modules/store.ts"; // Путь к store

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <Provider store={store}>
        <App />
  </Provider>
  </StrictMode>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/FRONT/serviceWorker.js")
      .then(res => console.log("service worker registered", res))
      .catch(err => console.log("service worker not registered", err))
  })
}