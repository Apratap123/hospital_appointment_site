
import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Navbar = () => {

    const navigate = useNavigate();
    const { token, setToken, userData } = useContext(AppContext);

    const [showMenu, setShowMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false); // State for profile dropdown

    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
    };

   
    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 '>
            <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="logo image" />

            {/* Main Navbar - Only for Desktop */}
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/'><li className='py-1'>HOME</li></NavLink>
                <NavLink to='/doctors'><li className='py-1'>ALL DOCTORS</li></NavLink>
                <NavLink to='/about'><li className='py-1'>ABOUT</li></NavLink>
                <NavLink to='/contact'><li className='py-1'>CONTACT</li></NavLink>
                <a 
  href='https://hospital-appointment-site-admin.onrender.com' 
  target='_blank' 
  className='inline-block bg-white text-black-500 px-4 py-0.5 rounded-full hover:bg-blue-500 hover:text-white transition duration-200 border border-black-500'
>
  Admin
</a>


            </ul>

            {/* Account/Login */}
            <div className='flex items-center gap-4'>
                {token && userData ? (
                    <div 
                        className='flex items-center gap-2 cursor-pointer group relative' 
                        onMouseEnter={() => setShowProfileMenu(true)} 
                        onMouseLeave={() => setShowProfileMenu(false)}
                    >
                        {/* Profile Image */}
                        <img className='w-8 rounded-full' src={userData.image} alt="profile pic" />
                        <img className='w-2.5' src={assets.dropdown_icon} alt="" />

                        {/* Profile Dropdown Menu */}
                        {showProfileMenu && (
                            <div className='absolute top-10 right-0 min-w-48 bg-stone-100 rounded-sm flex flex-col gap-4 p-4 text-gray-600 z-20 shadow-lg'>
                                <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light block'>
                        Create account
                    </button>
                )}

                {/* Mobile Menu Button */}
                <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="menu icon" />
            </div>

            {/* Mobile Menu - Only Renders When showMenu is True */}
            {showMenu && (
                <div className='fixed w-full md:hidden right-0 top-0 bottom-0 z-20 bg-white transition-all'>
                    <div className='flex items-center justify-between px-5 py-6'>
                        <img className='w-36' src={assets.logo} alt="logo image" />
                        <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="close icon" />
                    </div>

                    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                        <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded-sm inline-block'>HOME</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded-sm inline-block'>ALL DOCTORS</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded-sm inline-block'>ABOUT</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded-sm inline-block'>CONTACT</p></NavLink>
                    </ul>

                    {/* Profile Section for Mobile */}
                    {token && userData && (
                        <div className='flex flex-col items-center gap-4 mt-5 p-5 border-t'>
                            <div className='flex items-center gap-2 cursor-pointer' onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                <img className='w-12 h-12 rounded-full border' src={userData.image} alt="profile pic" />
                                <p className='font-medium text-lg'>{userData.name}</p>
                            </div>

                            {/* Mobile Profile Menu */}
                            {showProfileMenu && (
                                <div className='flex flex-col text-center gap-4 w-full'>
                                    <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                    <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                    <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
export default Navbar;
