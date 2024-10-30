// src/App.tsx
import "reflect-metadata";
import './App.css';
import Test from './pages/Test';
import LoginPage from './pages/Login';
import AdminPage from './pages/AdminMenu/AdminMenu';
import PatientList from './pages/AdminPatient/PatientList'; // Importe o PatientList
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "inversify-react";
import { container } from "./inversify";
import React, { useState } from "react";

function App() {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  return (
    <Provider container={container} standalone>
      <Router>
        <div className="flex flex-col min-h-screen">
          <header className="bg-blue-600 text-white p-4">
          </header>
          <main className="flex-grow bg-gray-100">
            <Routes>
              <Route path="/test" element={<Test />} />
              <Route path="/" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/patients" element={<PatientList setAlertMessage={setAlertMessage} />} />
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
