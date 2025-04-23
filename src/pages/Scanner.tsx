import { useNavigate } from 'react-router';
import './../css/Scanner.css'


export function Scanner(){

    const nav = useNavigate(); // Function to navigate to different pages
    return (
        <view className='App'>
            <view className='theme-dark'>
                <view className='Banner'>
                    <view className='Logo'>
                        <text className='Description' bindtap={() => nav('/home')}>Homepage!</text>
                    </view>
                    <text className='Title'>Scanner</text>
                    <view className='inputView'>
                        <input className='inputBox' placeholder="Type Barcode Here"/>
                    </view>
                </view>
            </view>
        </view>
    )
}