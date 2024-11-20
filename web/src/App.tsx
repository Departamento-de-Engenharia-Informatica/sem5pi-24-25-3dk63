import "reflect-metadata";
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
import SurgeryRoom from "./pages/SurgeryRoom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "inversify-react";
import { container } from "./inversify";
import React, { useEffect, useState } from "react";
import Floor3D2 from './pages/3DModel';
import ThemeToggleButton from "./components/TheToggleButton";
import ConfirmUpdate from "./pages/ConfirmUpdateStaff";
import ConfirmUpdatePage from "./pages/ConfirmAccountUpdatePatient";
import ConfirmDeletionPage from "./pages/ConfirmAccountDeletionPatient";
import ConfirmRegistrationPage from "./pages/ConfirmEmailRegistration";
import ProtectedRoute from './components/ProtectedRoute';
import NotAuthorizedPage from "./pages/NotAuthorized";
import LoginPage from "./pages/LoginPage";

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
          <header className="relative p-7 text-center flex-shrink-0 shadow-md bg-gradient-to-b from-primary/80 to-secondary/70 text-white">
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
          </header>
          <main className="flex flex-1 overflow-hidden bg-main-background text-main-text">
            <div className="flex-1 overflow-hidden bg-main-background text-main-text">
              {/* Main Content */}
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/self-register" element={<SelfRegisterMenu />} />
                <Route path="/admin/operation-type" element={<AdminOperationType setAlertMessage={setAlertMessage} />} />
                <Route path="/patient/appointments" element={<PatientAppointments setAlertMessage={setAlertMessage} />} />
                <Route path="/staff/surgery-rooms" element={<SurgeryRoom setAlertMessage={setAlertMessage} />} />
                <Route path="/patient/medical-record" element={<PatientMedicalRecord setAlertMessage={setAlertMessage} />} />
                <Route path="/confirm-update/:token" element={<ConfirmUpdate />} />
                <Route path="/patient/confirm-account-deletion" element={<ConfirmDeletionPage />} />
                <Route path="/patient/confirm-update" element={<ConfirmUpdatePage />} />
                <Route path="/patient/confirm-email" element={<ConfirmRegistrationPage />} />

                {/* Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRoles={["Admin"]}>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute requiredRoles={["Doctor", "Nurse", "Technician"]}>
                      <StaffPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient"
                  element={
                    <ProtectedRoute requiredRoles={["Patient"]}>
                      <PatientPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/patient"
                  element={
                    <ProtectedRoute requiredRoles={["Admin"]}>
                      <AdminPatient setAlertMessage={setAlertMessage} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/staff"
                  element={
                    <ProtectedRoute requiredRoles={["Admin"]}>
                      <AdminStaff setAlertMessage={setAlertMessage} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff/operation-requests"
                  element={
                    <ProtectedRoute requiredRoles={["Doctor", "Nurse", "Technician"]}>
                      <StaffOperationRequest setAlertMessage={setAlertMessage} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/operation-type"
                  element={
                    <ProtectedRoute requiredRoles={["Admin"]}>
                      <AdminOperationType setAlertMessage={setAlertMessage} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/appointments"
                  element={
                    <ProtectedRoute requiredRoles={["Patient"]}>
                      <PatientAppointments setAlertMessage={setAlertMessage} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff/surgery-rooms"
                  element={
                    <ProtectedRoute requiredRoles={["Doctor", "Nurse", "Technician"]}>
                      <SurgeryRoom setAlertMessage={setAlertMessage} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/medical-record"
                  element={
                    <ProtectedRoute requiredRoles={["Patient"]}>
                      <PatientMedicalRecord setAlertMessage={setAlertMessage} />
                    </ProtectedRoute>
                  }
                />
                <Route path="/staff/floor" element={<Floor3D2 />} />

                {/* Not Authorized Page */}
                <Route path="/not-authorized" element={<NotAuthorizedPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
