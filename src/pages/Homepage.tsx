import { useNavigate } from 'react-router';
import './../css/main.css'


export function Homepage(){
    const Homepage = () => {
        return <div>Homepage Page</div>;
    };
    const nav = useNavigate(); // Function to navigate to different pages
    return (
        <view className='App'>
            <view className='Background'></view>
            <view className='theme-dark'>
                <view className='Banner'>
                    <view className='Logo'>
                        <text className='Description' bindtap={() => nav('/login')}>Login!</text>
                    </view>
                    <text className='Title'>Homepage</text>
                    <text className='Hint'>*TODO</text>
                </view>
            </view>
        </view>
    )
}
export default Homepage;