import { useNavigate } from 'react-router';
import './../css/main.css'


export function Login(){
    const Login = () => {
        return <div>Login Page</div>;
    };
    const nav = useNavigate(); // Function to navigate to different pages
    return (
        <view className='App'>
            
            <view className='theme-dark'>
                <view className='Banner'>
                    <view className='Logo'>
                        <text className='Description' bindtap={() => nav('/home')}>Homepage!</text>
                        <text className='Description' bindtap={() => nav('/scanner')}>Scanner!</text>
                    </view>
                    <text className='Title'>Login</text>
                    
                </view>
            </view>
        </view>
    )
}
export default Login;