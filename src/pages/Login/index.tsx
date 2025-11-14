import { Form, Input, Button, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../../store/slices/authSlice.ts';
import { useNavigate, Link } from 'react-router-dom';
import type { authForm } from '../../types/authForm';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { useState } from 'react';



const LoginPage = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const onFinish = async (value: authForm) => {
        setIsLoading(true);
        try {
            await dispatch(login({ username: value.username, password: value.password })).unwrap();
            message.success('登录成功！即将跳转到首页...');
            navigate('/products');
            return;
        }
        catch (error) {
            message.error('登录失败，请检查用户名和密码！');
            return;
        }
        finally {
            setIsLoading(false);
        }
    }



    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#e6edd0ff' }}>
            <div style={{ width: '300px', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: 'white' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#10e7eaff' }}>用户登录</h2>
                <Form name='login' onFinish={onFinish} >
                    <Form.Item name='username' rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input prefix={<UserOutlined />} type='string' placeholder='用户名' />
                    </Form.Item>
                    <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
                        <Input prefix={<LockOutlined />} type='password' placeholder='密码' />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' style={{ width: '100%' }} loading={isLoading}>登录</Button>
                    </Form.Item>
                    <Form.Item>
                        <Link to='/register'>没有账号？去注册</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default LoginPage;