import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import HomePage from "./scences/homePage/index.jsx";
import LoginPage from "./scences/loginPage/index.jsx";
import ProfilePage from "./scences/profilePage/index.jsx";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import allowOrigins from "./allowOrigins.js"

function App() {

  const mode =useSelector((state)=> state.mode);
  const theme =useMemo(()=> createTheme(themeSettings(mode)),[mode]);  
  const isAuth =Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Routes>
            <Route path={`${allowOrigins.render}/`} element={<LoginPage/>} />
            <Route path={`${allowOrigins.render}/home`} element={isAuth? <HomePage/>: <Navigate to={`${allowOrigins.render}/`}/> } />
            <Route path={`${allowOrigins.render}/profile/:userId`} element={isAuth ? <ProfilePage/> : <Navigate to={`${allowOrigins.render}/`}/>} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
