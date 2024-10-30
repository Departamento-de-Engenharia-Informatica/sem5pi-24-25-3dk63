// src/App.tsx
import "reflect-metadata";
import './App.css';
import Test from './pages/Test';
import LoginPage from './pages/Login';
import AdminPage from './pages/AdminMenu/AdminMenu';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "inversify-react";
import { container } from "./inversify";

function App() {
  return (
    <Provider container={container} standalone>
      <Router>
        <div className="flex flex-col min-h-screen">
          <header className="bg-blue-600 text-white p-4">
            {/* O cabeçalho foi removido, pois a página principal é o Login */}
          </header>
          <main className="flex-grow bg-gray-100">
            <Routes>
              <Route path="/test" element={<Test />} />
              <Route path="/" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <footer className="bg-blue-600 text-white text-center p-4">
            © 2024 Sua Empresa. Todos os direitos reservados.
          </footer>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
