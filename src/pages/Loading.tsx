import { useCallback, useEffect, useState } from '@lynx-js/react'
import { useNavigate } from 'react-router';

import './../css/Loading.css'
import europeLogo from './../assets/europeLogo.png'

export function Loading() {
  const Loading = () => {
    return <div>Loading Page</div>;
  };
  const nav = useNavigate(); // Function to navigate to different pages
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
      <view className='theme-dark'>
      <view className='Banner'>
        <view className='Logo' bindtap={() => nav('/home')}>
          {alterLogo
          ? <text className='Description'>Test</text>
          : <image src={europeLogo} className='Logo--main' />}
        </view>
        <text className='Title'>EuroBar</text>
        <text className='Hint'>*Not official</text>
        </view>
    </view>
    </view>
  )
}
export default Loading;
