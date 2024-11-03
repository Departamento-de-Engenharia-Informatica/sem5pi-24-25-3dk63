// src/App.tsx
import "reflect-metadata";
import LoginPage from './pages/Login';
import AdminPage from './pages/AdminMenu';
import AdminPatient from './pages/AdminPatient';
import PatientPage from './pages/PatientMenu/PatientMenu';
import AdminStaff from './pages/AdminStaff';
import AdminOperationType from './pages/AdminOperationType';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "inversify-react";
import { container } from "./inversify";
import React, { useState } from "react";
import NewPatient from "./pages/AdminPatient/NewPatient";

function App() {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  return (
    <Provider container={container} standalone>
      <Router>
        <div className="flex flex-col h-screen bg-gray-100 text-gray-900">
          <header className="bg-[#284b62] text-white p-4 text-center flex-shrink-0 shadow-md">
            <h1 className="text-lg font-semibold tracking-wide">CliniTech Portal</h1>
          </header>
          <main className="flex-grow flex justify-center items-center overflow-y-auto bg-white">
            <div className="w-full p-8">
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/patient" element={<AdminPatient setAlertMessage={setAlertMessage} />} />
                <Route path="/admin/staff" element={<AdminStaff setAlertMessage={setAlertMessage} />} />
                <Route path="/patient" element={<PatientPage />} />
                <Route path="/patient/register" element={<NewPatient />} />
                <Route path="/admin/operation-type" element={<AdminOperationType setAlertMessage={setAlertMessage} />} />
              </Routes>
            </div>
          </main>
          <footer className="bg-[#284b62] text-white text-center p-4 flex-shrink-0 shadow-md">
            <p className="text-sm">© 2024 CliniTech. Todos os direitos reservados.</p>
          </footer>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
