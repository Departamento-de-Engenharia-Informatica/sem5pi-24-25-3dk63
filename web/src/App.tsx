// src/App.tsx
import "reflect-metadata";
import Test from './pages/Test';
import LoginPage from './pages/Login';
import AdminPage from './pages/AdminMenu/AdminMenu';
import AdminPatient from './pages/AdminPatient';
import PatientPage from './pages/PatientMenu/PatientMenu';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "inversify-react";
import { container } from "./inversify";
import React, { useState } from "react";
import { Patient } from './model/Patient';
import NewPatient from "./pages/AdminPatient/NewPatient";

function App() {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  return (
    <Provider container={container} standalone>
      <Router>
        <div className="flex flex-col h-screen bg-background text-text">
          <header className="bg-primary text-white p-4 text-center flex-shrink-0">
            {/* Conteúdo do cabeçalho */}
          </header>
          <main className="flex-grow flex justify-center items-center overflow-hidden">
            <div className="w-full p-8">
              <Routes>
                <Route path="/test" element={<Test />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/patients" element={<AdminPatient setAlertMessage={setAlertMessage} />} />
                <Route path="/patient" element={<PatientPage />} />
                <Route path="/patient/register" element={<NewPatient />} />

              </Routes>
            </div>
          </main>
          <footer className="bg-primary text-white text-center p-4 flex-shrink-0">
            © 2024 Sua Empresa. Todos os direitos reservados.
          </footer>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
