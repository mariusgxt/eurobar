import { root } from '@lynx-js/react'
import { MemoryRouter, Routes, Route } from 'react-router';
import { lazy } from '@lynx-js/react'

// Importing routes -> explained here: 
// https://lynxjs.org/react/routing.html
import {Loading} from './pages/Loading.jsx';
import {Homepage} from './pages/Homepage.jsx';
import {Login} from './pages/Login.jsx';
import {Register} from './pages/Register.jsx';
import {Profile} from './pages/Profile.jsx';
import {Settings} from './pages/Settings.jsx';
import {Scanner} from './pages/Scanner.jsx';

//Specify routing with paths
root.render(
  <MemoryRouter>
    <Routes>
      <Route path="/" element={<Loading />} />
      <Route path="/home" element={<Homepage />} />
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/profile" element={<Profile />}/>
      <Route path="/settings" element={<Settings />}/>
      <Route path="/scanner" element={<Scanner />}/>
    </Routes>
  </MemoryRouter>,
)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
