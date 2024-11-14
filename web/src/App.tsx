// src/App.tsx
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
import React, { useState } from "react";
import Floor3D from "./Floor"
import Floor3D2 from './pages/3DModel';

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
                {<Route path="/patient/medical-record" element={<PatientMedicalRecord setAlertMessage={setAlertMessage} />} />}

              </Routes>
            </div>
          </main>
          <footer className="bg-[#284b62] text-white text-center p-4 flex-shrink-0 shadow-md">
            <p className="text-sm">© 2024 CliniTech. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
