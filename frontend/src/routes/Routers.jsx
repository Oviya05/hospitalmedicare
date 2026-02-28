import Home from "../pages/Home";
import Services from "../pages/Services";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Contact from "../pages/Contact";
import Doctors from "../pages/Doctors/Doctors";
import DoctorsDeatils from "../pages/Doctors/DoctorDetails";
import CheckoutSuccess from "../pages/Doctors/checkoutSuccess";
import MyAccount from "../Dashboard/user-account/MyAccount";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Dashboard/doctor-account/Dashboard.jsx";


const Routers = () => {
  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/:id" element={<DoctorsDeatils />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/checkout-success" element={<CheckoutSuccess />} />


      <Route path="/users/me"
       element={
         <ProtectedRoute allowedRoles={['patient']} >
          <MyAccount />
           </ProtectedRoute>} 
           />
      <Route path="/doctors/me"
       element={
       <ProtectedRoute allowedRoles={['doctor']}>
        <Dashboard /> 
        </ProtectedRoute>} />
</Routes>
  );
};

export default Routers;
