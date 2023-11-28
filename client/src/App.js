import {BrowserRouter,Navigate,Routes,Route} from "react-router-dom"
import HomePage from "./scences/homePage/index.jsx";
import LoginPage from "./scences/loginPage/index.jsx";
import ProfilePage from "./scences/profilePage/index.jsx";
import { useMemo } from "react"
import { UseSelector, useSelector } from "react-redux"
import {CssBaseline, Cssbaseline,ThemeProvider, createTheme} from "@mui/material"
import { createMuiTheme } from "@mui/material/styles"
import { themeSettings } from "./theme"

function App() {

  const mode =useSelector((state)=> state.mode);
  const theme =useMemo(()=> createTheme(themeSettings(mode)),[mode]);  

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/home" element={<HomePage/>} />
            <Route path="/profile/:userId" element={<ProfilePage/>} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
