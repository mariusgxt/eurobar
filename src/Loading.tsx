import { useCallback, useEffect, useState } from '@lynx-js/react'

import './App.css'
import europeLogo from './assets/europeLogo.png'

export function App() {
  const [alterLogo, setAlterLogo] = useState(false)

  useEffect(() => {
    console.info('Hello, ReactLynx')
  }, [])

  const onTap = useCallback(() => {
    'background only'
    setAlterLogo(!alterLogo)
  }, [alterLogo])

  return (
  
      
      <view className='App'>
        <view className='Banner'>
          <view className='Logo' bindtap={onTap}>
            <image src={europeLogo} className='Logo--main' />
          </view>
          <text className='Title'>EuroBar</text>
          <text className='Subtitle'>*Not official*</text>
          </view>
      </view>
  )
}
