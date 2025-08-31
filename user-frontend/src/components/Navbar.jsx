import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { token, setToken, userData, loadUserProfileData } = useContext(AppContext);
    const [showMenu, setShowMenu] = useState(false);

    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className='bg-white shadow-md border-b border-gray-200 sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo */}
                    <div 
                        onClick={() => { navigate('/'); window.scrollTo(0,0); }} 
                        className='flex items-center cursor-pointer hover:opacity-80 transition-opacity'
                    >
                        <span className='text-2xl mr-2'>🎬</span>
                        <span className='text-2xl font-bold text-blue-600'>MovieReview</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex space-x-8'>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive 
                                        ? 'text-blue-600 bg-blue-50' 
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink 
                            to="/movies" 
                            className={({ isActive }) => 
                                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive 
                                        ? 'text-blue-600 bg-blue-50' 
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            Movies
                        </NavLink>
                        {token && (
                            <NavLink 
                                to="/watchlist" 
                                className={({ isActive }) => 
                                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive 
                                            ? 'text-blue-600 bg-blue-50' 
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                    }`
                                }
                            >
                                Watchlist
                            </NavLink>
                        )}
                    </div>

                    {/* User Actions */}
                    <div className='flex items-center space-x-4'>
                        {token && userData ? (
                            <div
                                className='border border-black cursor-pointer'
                                onClick={() => {
                                    setToken(false);
                                    localStorage.removeItem('token');
                                    navigate('/');
                                }}
                            >
                                {userData ? userData.name : 'Loading...'}
                            </div>
                        ) : (
                            <div className='flex items-center space-x-3'>
                                <button 
                                    onClick={() => navigate('/login')} 
                                    className='text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors'
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={() => navigate('/login')} 
                                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors'
                                >
                                    Get Started
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setShowMenu(true)} 
                            className='md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors'
                        >
                            <svg className='w-6 h-6' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {showMenu && (
                <div className='md:hidden'>
                    <div className='fixed inset-0 z-50'>
                        {/* Backdrop */}
                        <div 
                            className='fixed inset-0 bg-black bg-opacity-50'
                            onClick={() => setShowMenu(false)}
                        ></div>
                        
                        {/* Menu Panel */}
                        <div className='fixed right-0 top-0 h-full w-64 bg-white shadow-xl'>
                            {/* Header */}
                            <div className='flex items-center justify-between p-4 border-b border-gray-200'>
                                <div className='flex items-center'>
                                    <span className='text-xl mr-2'>🎬</span>
                                    <span className='text-lg font-bold text-blue-600'>MovieReview</span>
                                </div>
                                <button 
                                    onClick={() => setShowMenu(false)}
                                    className='p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                >
                                    <svg className='w-6 h-6' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className='p-4'>
                                <nav className='space-y-2'>
                                    <NavLink 
                                        onClick={() => setShowMenu(false)} 
                                        to='/' 
                                        className={({ isActive }) => 
                                            `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                                isActive 
                                                    ? 'text-blue-600 bg-blue-50' 
                                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`
                                        }
                                    >
                                        Home
                                    </NavLink>
                                    <NavLink 
                                        onClick={() => setShowMenu(false)} 
                                        to='/movies' 
                                        className={({ isActive }) => 
                                            `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                                isActive 
                                                    ? 'text-blue-600 bg-blue-50' 
                                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`
                                        }
                                    >
                                        Movies
                                    </NavLink>
                                    {token && (
                                        <NavLink 
                                            onClick={() => setShowMenu(false)} 
                                            to='/watchlist' 
                                            className={({ isActive }) => 
                                                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                                    isActive 
                                                        ? 'text-blue-600 bg-blue-50' 
                                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                                }`
                                                }
                                        >
                                            Watchlist
                                        </NavLink>
                                    )}
                                </nav>

                                {/* User Section */}
                                <div className='mt-6 pt-6 border-t border-gray-200'>
                                    {token && userData ? (
                                        <div className='space-y-3'>
                                            <div className='flex items-center p-3 bg-gray-50 rounded-lg'>
                                                <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3'>
                                                    {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className='text-sm font-medium text-gray-900'>{userData.name}</p>
                                                    <p className='text-xs text-gray-500'>Member</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => { navigate('/profile'); setShowMenu(false); }}
                                                className='w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors'
                                            >
                                                Profile Settings
                                            </button>
                                            <button 
                                                onClick={() => { logout(); setShowMenu(false); }} 
                                                className='w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors'
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='space-y-3'>
                                            <button
                                                onClick={() => { navigate('/login'); setShowMenu(false); }}
                                                className='w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors border border-gray-200'
                                            >
                                                Login
                                            </button>
                                            <button
                                                onClick={() => { navigate('/login'); setShowMenu(false); }}
                                                className='w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors'
                                            >
                                                Get Started
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
