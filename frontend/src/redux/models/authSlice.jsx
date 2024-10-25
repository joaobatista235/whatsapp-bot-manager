import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "../../services/user";
import { setStorage, clearStorage } from "../../utils/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      setStorage("user", action.payload);
    },
    clearUser: (state) => {
      state.user = null;
      clearStorage("user");
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export const login = (email, password) => async (dispatch) => {
  try {
    const user = await loginUser(email, password);
    dispatch(setUser(user));
    toast.success("Login efetuado com sucesso!");
  } catch (error) {
    toast.error("Erro ao efetuar login");
  }
};

export const logout = () => async (dispatch) => {
  try {
    await logoutUser();
    dispatch(clearUser());
    toast.success("Logout efetuado com sucesso!");
  } catch (error) {
    toast.error("Erro ao efetuar logout");
  }
};

export default authSlice.reducer;
