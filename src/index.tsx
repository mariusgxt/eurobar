import { root } from '@lynx-js/react'
import { MemoryRouter, Routes, Route } from 'react-router';

// Importing routes -> explained here: 
// https://lynxjs.org/react/routing.html

import { Loading} from './pages/Loading.jsx'

//Specify routing with the paths
root.render(
  <MemoryRouter>
    <Routes>
      <Route path="/" element={<Loading />} />
    </Routes>
  </MemoryRouter>,
)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
