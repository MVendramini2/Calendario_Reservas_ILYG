
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminCalendarPage from "./pages/Admin";
import Landing from "./pages/Landing";

export default function App() {
  return (
    
    <div className="min-h-screen w-full bg-slate-50">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminCalendarPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
}


