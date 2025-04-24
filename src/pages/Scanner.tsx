import { useNavigate } from 'react-router';
import { useState } from '@lynx-js/react/legacy-react-runtime';
import BarcodeScanner from "react-qr-barcode-scanner";

import './../css/Scanner.css';

export function Scanner() {
    const Scanner = () => {
        return <div>Scanner Page</div>;
      };
    const [data, setData] = useState("Not Found");
    const [search, setBarcode] = useState(''); // Initialize state for search
    const nav = useNavigate(); // Function to navigate to different pages

    const handleInput = (event: any) => {
        const value = event.target.value; // Get the input value
        setBarcode(value); // Update the state
        console.log(value); // Log the input value
    };

    console.log(search); // Log the current value of search

    return (
        <view className='App'>
            <view className='theme-dark'>
                <view className='Banner'>
                    <view className='Logo'>
                        <text className='Description' bindtap={() => nav('/home')}>Homepage!</text>
                    </view>
                    <text className='Title'>Scanner</text>
                    <view className='inputView'>
                        <input
                            onInput={handleInput} // Update state on input change
                            className='inputBox'
                            placeholder="Type Barcode Here"
                            value={search} // Bind input value to state
                        />
                    </view>
                </view>
            </view>
        </view>
    );
}
export default Scanner;