import "reflect-metadata";
import LoginPage from './pages/Login';
import AdminPage from './pages/AdminMenu';
import AdminPatient from './pages/AdminPatient';
import PatientPage from './pages/PatientMenu';
import AdminStaff from './pages/AdminStaff';
import SelfRegisterMenu from './pages/PatientSelfRegister';
import AdminOperationType from './pages/AdminOperationType';
import PatientAppointments from './pages/PatientAppointments';
import PatientMedicalRecord from './pages/PatientMedicalRecord';
import StaffPage from './pages/StaffMenu';
import StaffOperationRequest from './pages/StaffOperationRequest';
import ConfirmAccountDeletion from "./pages/ConfirmAccountDeletion";
import SurgeryRoom from "./pages/SurgeryRoom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "inversify-react";
import { container } from "./inversify";
import React, { useEffect, useState } from "react";
import Floor3D from "./Floor";
import Floor3D2 from './pages/3DModel';
import ThemeToggleButton from "./components/TheToggleButton"; // Importe o botão de alternância de tema

function App() {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return "light";
  });

  // Função para alternar o tema
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Alterar a classe do body com base no tema
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <Provider container={container} standalone>
      <Router>
        <div className="flex flex-col h-screen">
          <header className="p-4 text-center flex-shrink-0 shadow-md bg-header text-header-text">
            <h1 className="text-lg font-semibold tracking-wide">CliniTech Portal</h1>
          </header>
          <main className="flex flex-1 overflow-hidden bg-main-background text-main-text">
            <div className="flex-1 p-8 overflow-hidden">
              {/* Botão de alternância de tema no canto superior direito */}
              <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />

              {/* Conteúdo principal */}
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/staff" element={<StaffPage />} />
                <Route path="/staff/operation-requests" element={<StaffOperationRequest setAlertMessage={setAlertMessage} />} />
                <Route path="/admin/patient" element={<AdminPatient setAlertMessage={setAlertMessage} />} />
                <Route path="/admin/staff" element={<AdminStaff setAlertMessage={setAlertMessage} />} />
                <Route path="/staff/floor" element={<Floor3D />} />
                <Route path="/staff/floor2" element={<Floor3D2 />} />
                <Route path="/patient" element={<PatientPage />} />
                <Route path="/self-register" element={<SelfRegisterMenu />} />
                <Route path="/confirm-account-deletion/:token" element={<ConfirmAccountDeletion />} />
                <Route path="/admin/operation-type" element={<AdminOperationType setAlertMessage={setAlertMessage} />} />
                <Route path="/patient/appointments" element={<PatientAppointments setAlertMessage={setAlertMessage} />} />
                <Route path="/staff/surgery-rooms" element={<SurgeryRoom setAlertMessage={setAlertMessage} />} />
                <Route path="/patient/medical-record" element={<PatientMedicalRecord setAlertMessage={setAlertMessage} />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
