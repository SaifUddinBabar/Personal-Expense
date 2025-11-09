import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/Notfound";
import AddTransaction from "./components/AddTransaction";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Mytransaction from "./components/Mytransaction";
import Reports from "./pages/Reports";

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
      <Route path="/reports" element={<PrivateRoute><Reports></Reports></PrivateRoute>}></Route>
      <Route path="/my-transactions" element={<PrivateRoute><Mytransaction></Mytransaction></PrivateRoute>}></Route>
      <Route path="*" element={<NotFound />} />
      <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
    </Routes>
  );
};

export default AppRouter;
