import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const Login = () => {
    const navigate = useNavigate();
    const {  setToken, setUserData, backendUrl } = useContext(AppContext);
    
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint = isLogin ? '/api/user/login' : '/api/user/register';
            const payload = isLogin 
                ? { email: formData.email, password: formData.password }
                : { name: formData.name, email: formData.email, password: formData.password };

            const { data } = await axios.post(backendUrl + endpoint, payload);

            if (data.success) {
                localStorage.setItem('token', data.token);
                console.log(data.token);
                setToken(data.token);
                // setUserData(data.user);
                toast.success(isLogin ? 'Login successful!' : 'Account created successfully!');
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Auth error:', error);
            toast.error(error.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed`);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <div className="text-4xl mb-4">🎬</div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        {isLogin ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isLogin 
                            ? 'Sign in to your account to continue' 
                            : 'Join thousands of movie enthusiasts'
                        }
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required={!isLogin}
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                                />
                            </div>
                            {!isLogin && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Use 6+ characters with uppercase, lowercase, numbers, and symbols
                                </p>
                            )}
                        </div>

                        {isLogin && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a
                                        href="#"
                                        className="font-medium text-primary-600 hover:text-primary-500"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        {isLogin ? 'Signing in...' : 'Creating account...'}
                                    </div>
                                ) : (
                                    isLogin ? <p className='text-black'>Sign in</p> : <p className='text-black'>Create account</p>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="font-medium text-primary-600 hover:text-primary-500"
                                >
                                    {isLogin ? 'Create one now' : 'Sign in instead'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Demo Accounts - Only show for login */}
                {isLogin && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Accounts</h3>
                        <div className="text-xs text-blue-700 space-y-1">
                            <p><strong>User:</strong> user@demo.com / password123</p>
                            <p><strong>Admin:</strong> admin@demo.com / password123</p>
                        </div>
                    </div>
                )}

                {/* Benefits - Only show for registration */}
                {!isLogin && (
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-green-900 mb-2">What you'll get:</h3>
                        <ul className="text-xs text-green-700 space-y-1">
                            <li>✓ Personal watchlist to save movies</li>
                            <li>✓ Write and share movie reviews</li>
                            <li>✓ Rate movies and see recommendations</li>
                            <li>✓ Connect with other movie lovers</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;