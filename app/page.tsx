// app/page.tsx

'use client';

import React, { useState, useMemo, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { saveUser, findUser, findUserByIdentifier, updateUserPasswordByIdentifier, seedAdminUser } from '@/lib/dummyDb';
import { useNavigation } from '@/lib/useNavigation';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Page = () => {
  const nav = useNavigation();
  const [activeForm, setActiveForm] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  
  const [isFieldVisible, setIsFieldVisible] = useState(true);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+62');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [facebook, setFacebook] = useState('');
  
  // Password validation states
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  
  // Form validation states
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [idCardError, setIdCardError] = useState('');
  const [socialMediaError, setSocialMediaError] = useState('');
  const [showPassword, setShowPassword] = useState<{ login: Boolean; register: boolean }>({
    login: false,
    register: false,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const countryCodes = [
    { code: '+62', country: 'Indonesia', abbr: 'ID' },
    { code: '+60', country: 'Malaysia', abbr: 'MY' },
    { code: '+66', country: 'Thailand', abbr: 'TH' },
    { code: '+65', country: 'Singapore', abbr: 'SG' },
    { code: '+1', country: 'United States', abbr: 'US' },
    { code: '+44', country: 'United Kingdom', abbr: 'UK' },
    { code: '+81', country: 'Japan', abbr: 'JP' },
    { code: '+91', country: 'India', abbr: 'IN' },
    { code: '+61', country: 'Australia', abbr: 'AU' },
  ];
  
  const handleFormSwitch = (formType: 'login' | 'register' | 'forgotPassword') => {
    setActiveForm(formType);
  };

  const goToLogin = () => {
    setActiveForm('login');
    setEmailError('');
    setPhoneNumberError('');
    setPasswordError('');
  };

  useEffect(() => {
    seedAdminUser();
  }, []);

  const handleLoginMethodChange = (method: 'email' | 'phone') => {
    if (method === loginMethod) return;
    setIsFieldVisible(false);
    setTimeout(() => {
      setLoginMethod(method);
      setIsFieldVisible(true);
    }, 150);
  };
  
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setHasUppercase(/[A-Z]/.test(value));
    setHasLowercase(/[a-z]/.test(value));
    setHasNumber(/[0-9]/.test(value));
    setHasSpecialChar(/[^A-Za-z0-9]/.test(value));

    if (activeForm !== 'forgotPassword') {
      if (!value) setPasswordError('Password is required');
      else if (value.length < 8) setPasswordError('Password must be at least 8 characters');
      else setPasswordError('');
    }
  };
  
      const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setIdCardError('Format harus JPEG atau PNG');
        setIdCardImage(null);
        return;
      }
      const maxSize = 2 * 1024 * 1024; 
      if (file.size > maxSize) {
        setIdCardError('Ukuran file maksimal 2 MB');
        setIdCardImage(null);
        return;
      }
      if (typeof window !== 'undefined') { 
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setIdCardImage(event.target.result as string);
            setIdCardError('');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const togglePasswordVisibility = (form: 'login' | 'register') => {
    setShowPassword(prev => ({ ...prev, [form]: !prev[form] }));
  };

  const validateForm = () => {
    let isValid = true;
    const phoneTrimmed = phoneNumber.trim();
    const hasAnySocial = Boolean(instagram.trim() || tiktok.trim() || facebook.trim());
    
    if (activeForm === 'register' && !fullName.trim()) {
      setFullNameError('Full Name is required');
      isValid = false;
    } else {
      setFullNameError('');
    }

    if (activeForm === 'login') {
      if (loginMethod === 'email') {
        if (!email.trim()) {
          setEmailError('Email Address is required');
          isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
          setEmailError('Please enter a valid email address');
          isValid = false;
        } else {
          setEmailError('');
        }
        setPhoneNumberError('');
      } else {
        if (!phoneTrimmed) {
          setPhoneNumberError('Phone Number is required');
          isValid = false;
        } else if (phoneTrimmed.length < 8) {
          setPhoneNumberError('Please enter a valid phone number');
          isValid = false;
        } else {
          setPhoneNumberError('');
        }
        setEmailError('');
      }
    }

    if (activeForm === 'forgotPassword') {
      const hasEmail = Boolean(email.trim());
      const hasPhone = Boolean(phoneTrimmed);

      if (!hasEmail && !hasPhone) {
        setEmailError('Email or Phone Number is required');
        setPhoneNumberError('Email or Phone Number is required');
        isValid = false;
      } else {
        if (hasEmail) {
          if (!/^\S+@\S+\.\S+$/.test(email)) {
            setEmailError('Please enter a valid email address');
            isValid = false;
          } else {
            setEmailError('');
          }
        } else {
          setEmailError('');
        }

        if (hasPhone) {
          if (phoneTrimmed.length < 8) {
            setPhoneNumberError('Please enter a valid phone number');
            isValid = false;
          } else {
            setPhoneNumberError('');
          }
        } else {
          setPhoneNumberError('');
        }
      }
    } else if (activeForm === 'register') {
      if (!email.trim()) {
        setEmailError('Email Address is required');
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        setEmailError('Please enter a valid email address');
        isValid = false;
      } else {
        setEmailError('');
      }
      if (!phoneTrimmed) {
        setPhoneNumberError('Phone Number is required');
        isValid = false;
      } else if (phoneTrimmed.length < 8) {
        setPhoneNumberError('Please enter a valid phone number');
        isValid = false;
      } else {
        setPhoneNumberError('');
      }
    }
    
    if (activeForm !== 'forgotPassword') {
      if (!password) {
        setPasswordError('Password is required');
        isValid = false;
      } else if (password.length < 8) {
        setPasswordError('Password must be at least 8 characters');
        isValid = false;
      } else if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        setPasswordError('Password must contain uppercase, lowercase, number, and special character');
        isValid = false;
      } else {
        setPasswordError('');
      }
    }

    if (activeForm === 'register') {
      if (!idCardImage) {
        setIdCardError('ID Card Image is required');
        isValid = false;
      } else {
        setIdCardError('');
      }

      if (!hasAnySocial) {
        setSocialMediaError('Please fill at least one social media');
        isValid = false;
      } else {
        setSocialMediaError('');
      }
    } else {
      setIdCardError('');
      setSocialMediaError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Validation Failed',
        text: 'Please fill in all required fields correctly.',
      });
      return;
    }

    if (activeForm === 'login') {
      const loginIdentifier = loginMethod === 'email' ? email : `${countryCode}${phoneNumber}`;
      const user = findUser(loginIdentifier, password);

      if (user) {
        if (user.status === 'pending') {
          await Swal.fire({
            icon: 'info',
            title: 'Account Pending Approval',
            text: 'Your account is still being reviewed. Please wait for admin approval.',
          });
          return;
        }
        if (user.status === 'rejected') {
          await Swal.fire({
            icon: 'error',
            title: 'Registration Rejected',
            text: 'Your registration has been rejected. Please contact support for more information.',
          });
          return;
        }

        localStorage.setItem('loggedInUser', JSON.stringify(user));
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome back, ${user.fullName}!`,
          timer: 2000,
          showConfirmButton: false,
        });
        nav.replace('/dashboard');
      } else {
        const result = await Swal.fire({
          title: 'Login Failed',
          text: 'Incorrect credentials or user not found. Do you want to create a new account?',
          icon: 'error',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Register!',
          cancelButtonText: 'No, Try Again',
        });

        if (result.isConfirmed) {
          setActiveForm('register');
        }
      }
    }

    if (activeForm === 'register') {
      const newUser = {
        fullName,
        email,
        countryCode,
        phoneNumber,
        password,
        instagram,
        tiktok,
        facebook,
        idCardImage: idCardImage || undefined,
      };

      try {
        saveUser(newUser);
        await Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Your account has been created and is pending approval. Please login after it\'s approved.',
        });
      
      setTimeout(() => {
        goToLogin();
        setFullName('');
        setIdCardImage(null);
        setInstagram('');
        setTiktok('');
        setFacebook('');
      }, 0); // Delay 0ms, tapi dieksekusi setelah event loop selesai

      } catch (error: any) {
        await Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.message,
        });
      }
    }

    if (activeForm === 'forgotPassword') {
      const forgotIdentifier = (email || `${countryCode}${phoneNumber}`).trim();
      const targetUser = findUserByIdentifier(forgotIdentifier);
      if (!targetUser) {
        await Swal.fire({
          icon: 'error',
          title: 'User Not Found',
          text: 'No user found for that email/phone. Please register first.',
        });
        return;
      }

      const result = await Swal.fire({
        title: 'Set New Password',
        html: `
          <input id="swal-new-password" class="swal2-input" type="password" placeholder="New password" autocomplete="new-password" />
          <input id="swal-confirm-password" class="swal2-input" type="password" placeholder="Confirm password" autocomplete="new-password" />
          <p style="margin: 8px 0 0; font-size: 12px; color: #6b7280; text-align: left;">
            Password rules: min 8 chars, 1 uppercase, 1 lowercase, 1 special character.
          </p>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Update Password',
        preConfirm: () => {
          const newPassword = (document.getElementById('swal-new-password') as HTMLInputElement)?.value || '';
          const confirmPassword = (document.getElementById('swal-confirm-password') as HTMLInputElement)?.value || '';

          const hasUpper = /[A-Z]/.test(newPassword);
          const hasLower = /[a-z]/.test(newPassword);
          const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

          if (newPassword.length < 8 || !hasUpper || !hasLower || !hasSpecial) {
            Swal.showValidationMessage('Password does not meet the requirements.');
            return null;
          }
          if (newPassword !== confirmPassword) {
            Swal.showValidationMessage('Password confirmation does not match.');
            return null;
          }
          return newPassword;
        },
      });

      if (!result.isConfirmed || !result.value) return;

      try {
        updateUserPasswordByIdentifier(forgotIdentifier, result.value as string);

        await Swal.fire({
          icon: 'success',
          title: 'Password Updated',
          text: 'Your password has been updated. Please login with your new password.',
          timer: 2200,
          showConfirmButton: false,
        });

        goToLogin();
      } catch (err: any) {
        await Swal.fire({
          icon: 'error',
          title: 'Reset Failed',
          text: err?.message || 'Failed to reset password.',
        });
      }
    }
  };
  
  const slidePosition = useMemo(() => {
    switch (activeForm) {
      case 'login': return 'translateX(0%)';
      case 'register': return 'translateX(-100%)';
      case 'forgotPassword': return 'translateX(-200%)';
      default: return 'translateX(0%)';
    }
  }, [activeForm]);
  
  const imageConfig = useMemo(() => {
    switch (activeForm) {
      case 'login': return { src: '/images/login_form_baru.png', alt: 'Login Illustration' };
      case 'register': return { src: '/images/register_form.png', alt: 'Register Illustration' };
      case 'forgotPassword': return { src: '/images/forgot_password.png', alt: 'Forgot Password Illustration' };
      default: return { src: '/images/login_form_baru.png', alt: 'Login Illustration' };
    }
  }, [activeForm]);

  return (
    // Container Utama: Fixed full screen, overflow hidden
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-white">
      
      {/* DIV 1: Area Form - 40% di desktop, 100% di mobile */}
      <div className="w-full md:w-2/5 h-full bg-white relative overflow-hidden flex flex-col">
        
        {/* Mobile Logo Header (Hanya muncul di mobile) */}
        <div className="flex md:hidden justify-center items-center 
        p-4 border-b border-gray-100 shrink-0">
          <Image src="/images/logo_trapo.png"
           alt="TRAPO Logo" width={80} height={80} 
           className="object-contain" />
        </div>

        {/* Container Sliding untuk Forms */}
        <div className="flex h-full transition-transform duration-500 ease-in-out" style={{ transform: slidePosition }}>
          
          {/* Form Login - Index 0 */}
          <div className="w-full flex-shrink-0 h-full overflow-y-auto custom-scrollbar flex items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-md">
              <h2 className="text-lg sm:text-xl md:text-3xl 
              font-semibold mb-6 text-gray-800">
              Sign in to<br />
              <span className="block text-blue-600">TRAPO Sales Community</span>
              </h2>
              
              <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                <button type="button" onClick={() => handleLoginMethodChange('email')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${loginMethod === 'email' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>Email</button>
                <button type="button" onClick={() => handleLoginMethodChange('phone')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${loginMethod === 'phone' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>Phone Number</button>
              </div>

              {/* --- BAGIAN EMAIL ADDRESS --- */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="relative h-15 mb-8">
                  <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${isFieldVisible ? 'opacity-100' : 'opacity-0'}`}>
                    {loginMethod === 'email' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="flex">
                          <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="flex-shrink-0 px-3 py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            {countryCodes.map((c) => (<option key={c.code} value={c.code}>{c.abbr} {c.code}</option>))}
                          </select>
                          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="812-3456-7890" className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        {phoneNumberError && <p className="text-red-500 text-xs mt-1">{phoneNumberError}</p>}
                      </div>
                    )}
                  </div>
                </div>

                    {/* --- BAGIAN PASSWORD --- */}
                    <div className="mb-4 relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword.login ? 'text' : 'password'} 
                          value={password} 
                          onChange={handlePasswordChange} 
                          className="w-full p-3 pr-10 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('login')}
                          tabIndex={-1}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                          aria-label={showPassword.login ? 'Hide password' : 'Show password'}
                        >
                          {showPassword.login ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                      {/* Indikator detail dihapus di sini */}
                    </div>
                
                {/* --- BAGIAN REMEMBER ME & SUBMIT BUTTON --- */}
                <div className="flex items-center mb-4">
                <input id="remember" type="checkbox" className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded" /><label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label></div>
                <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">Sign in</button>
                <div className="text-center space-y-2 text-sm">
                  <button type="button" onClick={() => handleFormSwitch('register')} className="text-blue-500 hover:text-blue-600 transition-colors block">Don't have an account? Register</button>
                  <button type="button" onClick={() => handleFormSwitch('forgotPassword')} className="text-blue-500 hover:text-blue-600 transition-colors block">Forgot Password?</button>
                </div>
              </form>
            </div>
          </div>

          {/* Form Register - Index 1 */}
          <div className="w-full flex-shrink-0 h-full overflow-y-auto custom-scrollbar flex items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-md">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">
               Let's start the journey</h2>
              
              <p className="text-1xl text-green-600 mb-6">
                Sign up below
              </p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />{fullNameError && <p className="text-red-500 text-xs mt-1">{fullNameError}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />{emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}</div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <div className="flex">
                    <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="flex-shrink-0 px-3 py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      {countryCodes.map((c) => (<option key={c.code} value={c.code}>{c.abbr} {c.code}</option>))}
                    </select>
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="812-3456-7890" className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  {phoneNumberError && <p className="text-red-500 text-xs mt-1">{phoneNumberError}</p>}
                </div>
                <div>

                  {/* --- BAGIAN PASSWORD DENGAN VALIDASI --- */}
                    <div className="mb-4 relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                      <div className="relative">
                        <input 
                          type={showPassword.register ? 'text' : 'password'} 
                          value={password} 
                          onChange={handlePasswordChange} 
                          className="w-full p-3 pr-10 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('register')}
                          tabIndex={-1}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                          aria-label={showPassword.register ? 'Hide password' : 'Show password'}
                        >
                          {showPassword.register ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                      
                      {/* Teks Indikator Single Line yang Berubah Warna */}
                      {password && (
                        <p className={`mt-2 text-xs transition-colors duration-300 ${
                          hasUppercase && hasLowercase && hasNumber && hasSpecialChar 
                            ? 'text-green-600' 
                            : 'text-gray-400'
                        }`}>
                          Create a strong password using a mix of uppercase and lowercase letters, numbers, and special characters.
                        </p>
                      )}
                    </div>


                  {/* --- BAGIAN UPLOAD ID CARD IMAGE --- */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Card Image *</label>
                  <div className="flex items-center space-x-3">
                    <button type="button" onClick={() => fileInputRef.current?.click()} 
                    className="px-3 py-3 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">Choose File</button>
                    <span className="text-sm text-gray-600">{idCardImage ? 'Image selected' : 'No file chosen'}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Upload ID Card Image (JPEG/PNG, max 2 MB).
                  </p>

                  <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleImageUpload} className="hidden" />
                  {idCardImage && <div className="mt-3 relative w-32 h-32"><Image src={idCardImage} alt="ID Card Preview" fill className="object-cover rounded-md" /></div>}
                  {idCardError && <p className="text-red-500 text-xs mt-1">{idCardError}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram (Optional)</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">@</span>
                    <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="username" className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TikTok (Optional)</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">@</span>
                    <input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="username" className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook (Optional)</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">@</span>
                    <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="username" className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  {socialMediaError && <p className="text-red-500 text-xs mt-1">{socialMediaError}</p>}
                </div>
                <button type="submit" className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">Register</button>
                <div className="text-center text-sm"><button type="button" onClick={() => handleFormSwitch('login')} className="text-blue-500 hover:text-blue-600 transition-colors">Already have an account? Login</button></div>
              </form>
            </div>
          </div>

          {/* Form Forgot Password - Index 2 */}
          <div className="w-full flex-shrink-0 h-full overflow-y-auto custom-scrollbar flex items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-md">
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">Reset Your Password</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />{emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}</div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                  <div className="flex">
                    <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="flex-shrink-0 px-3 py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                      {countryCodes.map((c) => (<option key={c.code} value={c.code}>{c.abbr} {c.code}</option>))}
                    </select>
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="812-3456-7890" className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                  </div>
                  {phoneNumberError && <p className="text-red-500 text-xs mt-1">{phoneNumberError}</p>}
                </div>
                <button type="submit" className="w-full p-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors font-medium">Reset Password</button>
                <div className="text-center text-sm"><button type="button" onClick={() => handleFormSwitch('login')} className="text-blue-500 hover:text-blue-600 transition-colors">Back to Login</button></div>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* DIV 2: Area Gambar - 60% di desktop, Hidden di mobile */}
      <div className="hidden md:flex md:w-3/5 h-full bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-8 relative">
        {/* Background pattern or decorative elements could go here */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-3/4 h-3/4 max-w-2xl">
            <Image 
              src={imageConfig.src} 
              alt={imageConfig.alt} 
              fill 
              className="object-contain drop-shadow-2xl" 
              priority 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;