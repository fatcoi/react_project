import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import request from '../../utils/request';
import type { authForm } from '../../types/authForm';


const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (value: authForm) => {
        try {
            await request.post('/api/register',
                {
                    username: value.username,
                    password: value.password
                }
            );
            message.success('注册成功！即将跳转到登录页...');
            navigate('/login');
            return;
        }
        catch (error) {
            message.error('注册失败，请重试！');
            return;
        }
    }
    return (
        <div style={{ width: 300, margin: '100px auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20 }}>注册</h2>
            <Form name='register' onFinish={onFinish}>
                <Form.Item name='username' rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input prefix={<UserOutlined />} type='string' placeholder='用户名' />
                </Form.Item>
                <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password prefix={<LockOutlined />} type='password' placeholder='密码' />
                </Form.Item>
                <Form.Item
                    name='confirmPassword'
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: '请确认密码' },
                        ({ getFieldValue }) => ({
                            validator: (_, value) => {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不一致!'));
                            }
                        })
                    ]}>
                    <Input.Password prefix={<LockOutlined />} type='password' placeholder='请输入密码' />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' style={{ width: '100%' }}>注册</Button>
                </Form.Item>
                <Form.Item>
                    <Link to='/login'>已有账号？去登录</Link>
                </Form.Item>
            </Form>
        </div>
    )
}

export default RegisterPage;