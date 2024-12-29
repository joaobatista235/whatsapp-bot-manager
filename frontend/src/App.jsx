import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import AgentSignUp from "./pages/AgentSignUp";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import { useAuth } from "./_Hooks/useAuth";
import WithSideBar from "./components/layouts/withSideBar";
import { ToastContainer } from "react-toastify";
import Chats from "./pages/Chats/Chats";
import ChatHistory from "./pages/ChatHistory/ChatHistory";

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
          path="/chats"
          element={
            <PrivateRoute>
              <WithSideBar>
                <Chats />
              </WithSideBar>
            </PrivateRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <WithSideBar>
                <ChatHistory />
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
