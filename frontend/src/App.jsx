import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import AgentSignUp from "./pages/AgentSignUp";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import { useAuth } from "./_Hooks/useAuth";
import WithSideBar from "./components/layouts/withSideBar";
import { ToastContainer } from "react-toastify";

const App = () => {
  useAuth();
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="*" element={<p>page not found</p>} />
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <WithSideBar>
                <Dashboard />
              </WithSideBar>
            </PrivateRoute>
          }
        />

        <Route
          path="/agentSignUp"
          element={
            <WithSideBar>
              <PrivateRoute>
                <AgentSignUp />
              </PrivateRoute>
            </WithSideBar>
          }
        />
      </Routes>
    </Router>
  );
};
export default App;
