import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddTransaction from "./components/AddTransaction";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Mytransaction from "./components/Mytransaction"; 
import Reports from "./pages/Reports";
import MyProfile from "./components/MyProfile";
import NotFound from "./pages/Notfound";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/add-transaction" 
        element={
          <PrivateRoute>
            <AddTransaction />
          </PrivateRoute>
        } 
      />
      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      <Route path="/my-transactions" element={<PrivateRoute><Mytransaction /></PrivateRoute>} />
      <Route path="/my-profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;