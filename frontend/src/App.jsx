import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import AgentSignUp from "./pages/AgentSignUp";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import { useAuth } from "./_Hooks/useAuth";
import WithSideBar from "./components/layouts/withSideBar";
import { ToastContainer } from "react-toastify";
import Agenda from "./pages/Agenda";
import Flow from "./pages/Flow";
import Concat from "./pages/Concat";
import Chat from "./pages/Chat";

const App = () => {
  useAuth();
  return (
    <Router>
      <ToastContainer position="bottom-right" />
      <Routes>
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
            <PrivateRoute>
              <WithSideBar>
                <AgentSignUp />
              </WithSideBar>
            </PrivateRoute>
          }
        />

        <Route
          path="/agenda"
          element={
            <PrivateRoute>
              <WithSideBar>
                <Agenda />
              </WithSideBar>
            </PrivateRoute>
          }
        />

        <Route
          path="/flow"
          element={
            <PrivateRoute>
              <WithSideBar>
                <Flow />
              </WithSideBar>
            </PrivateRoute>
          }
        />

        <Route
          path="/contacts"
          element={
            <PrivateRoute>
              <WithSideBar>
                <Concat />
              </WithSideBar>
            </PrivateRoute>
          }
        />

        <Route
          path="/chats"
          element={
            <PrivateRoute>
              <WithSideBar>
                <Chat />
              </WithSideBar>
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={
            <WithSideBar>
              <PrivateRoute>
                <p>page not found</p>
              </PrivateRoute>
            </WithSideBar>
          }
        />
      </Routes>
    </Router>
  );
};
export default App;
