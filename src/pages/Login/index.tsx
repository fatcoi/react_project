import request from '../../utils/request';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice.ts';
import { useNavigate, Link } from 'react-router-dom';
import type { authForm } from '../../types/authForm';


const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (value: authForm) => {
        try {
            const response = await request.post('/api/login',
                {
                    username: value.username,
                    password: value.password
                }
            )
            dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
            message.success('登录成功！即将跳转到首页...');
            navigate('/');
            return;
        }
        catch (error) {
            message.error('登录失败，请检查用户名和密码！');
            return;
        }
    }

    return (
        <div style={{ width: '300px', margin: '100px auto' }}>
            <Form name='login' onFinish={onFinish} >
                <Form.Item name='username' rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input prefix={<UserOutlined />} type='string' placeholder='用户名' />
                </Form.Item>
                <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
                    <Input prefix={<LockOutlined />} type='password' placeholder='密码' />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' style={{ width: '100%' }}>登录</Button>
                </Form.Item>
                <Form.Item>
                    <Link to='/register'>没有账号？去注册</Link>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LoginPage;