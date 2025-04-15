import { root } from '@lynx-js/react'

import { App } from './Loading.jsx'

root.render(<App />)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
