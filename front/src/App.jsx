import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { getUser } from "./utils/auth";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Bookings from "./pages/Bookings";
import EditBooking from "./pages/EditBooking";
import CriarAgendamento from "./pages/CriarAgendamento";
import EditUsuario from "./pages/EditUsuario";
import UserManagement from "./pages/UserManagement";

import RoomManagement from "./pages/RoomManagement";
import PricingRuleManagement from "./pages/PricingRuleManagement";
import AuditLogPage from "./pages/AuditLogPage";
import Layout from "./components/Layout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import EsqueciSenha from "./pages/EsqueciSenha";
import ResetarSenha from "./pages/ResetarSenha";

const AdminRoute = ({ children }) => {
    const user = getUser();
    const isAdmin = user && (user.usuario?.tipoUsuario === "ADMIN" || user.tipoUsuario === "ADMIN");
    
    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

export default function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                
                <Route path="/dashboard" element={<Layout><Dashboard/></Layout>}/>
                <Route path="/bookings" element={<Layout><Bookings/></Layout>}/>
                <Route path="/bookings/new" element={<Layout><CriarAgendamento/></Layout>}/>
                <Route path="/bookings/edit/:id" element={<Layout><EditBooking/></Layout>}/>
                
                {/* Rotas Protegidas para ADMIN */}
                <Route path="/admin" element={<Layout><AdminRoute><Admin/></AdminRoute></Layout>}/>
                <Route path="/admin/users" element={<Layout><AdminRoute><UserManagement/></AdminRoute></Layout>}/>
                <Route path="/admin/rooms" element={<Layout><AdminRoute><RoomManagement/></AdminRoute></Layout>}/>
                <Route path="/admin/pricing-rules" element={<Layout><AdminRoute><PricingRuleManagement/></AdminRoute></Layout>}/>
                <Route path="/admin/audit-log" element={<Layout><AdminRoute><AuditLogPage/></AdminRoute></Layout>}/>
                <Route path="/admin/edit/:id" element={<Layout><AdminRoute><EditUsuario/></AdminRoute></Layout>}/>

                <Route path="/esqueci-senha" element={<EsqueciSenha/>}/>
                <Route path="/resetar-senha/:token" element={<ResetarSenha/>}/>
            </Routes>
            <ToastContainer position="top-right" autoClose={1500} />
        </BrowserRouter>
    )
}