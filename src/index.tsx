import { root } from '@lynx-js/react'
import { MemoryRouter, Routes, Route } from 'react-router';
import { lazy } from '@lynx-js/react'

// Importing routes -> explained here: 
// https://lynxjs.org/react/routing.html
const Loading_Component = lazy(() => import('./pages/Loading.jsx'))
const Homepage_Component = lazy(() => import('./pages/Homepage.jsx'))
const Login_Component = lazy(() => import('./pages/Login.jsx'))
const Register_Component = lazy(() => import('./pages/Register.jsx'))
const Profile_Component = lazy(() => import('./pages/Profile.jsx'))
const Settings_Component = lazy(() => import('./pages/Settings.jsx'))
const Scanner_Component = lazy(() => import('./pages/Scanner.jsx'))

//Specify routing with paths
root.render(
  <MemoryRouter>
    <Routes>
      <Route path="/" element={<Loading_Component />} />
      <Route path="/home" element={<Homepage_Component />} />
      <Route path="/login" element={<Login_Component />}/>
      <Route path="/register" element={<Register_Component />}/>
      <Route path="/profile" element={<Profile_Component />}/>
      <Route path="/settings" element={<Settings_Component />}/>
      <Route path="/scanner" element={<Scanner_Component />}/>
    </Routes>
  </MemoryRouter>,
)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
