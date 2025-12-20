// app/page.tsx

'use client';

import React, { useState, useMemo, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { saveUser, findUser, User } from '@/lib/dummyDb';
// --- SWEETALERT ---
// Import library SweetAlert2
import Swal from 'sweetalert2';

const Page = () => {
  const router = useRouter();
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
  
  // Form validation states
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  
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
  };
  
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setIdCardImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    
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
        if (!phoneNumber.trim()) {
          setPhoneNumberError('Phone Number is required');
          isValid = false;
        } else {
          setPhoneNumberError('');
        }
        setEmailError('');
      }
    } else {
      if (!email.trim()) {
        setEmailError('Email Address is required');
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        setEmailError('Please enter a valid email address');
        isValid = false;
      } else {
        setEmailError('');
      }
      if (!phoneNumber.trim()) {
        setPhoneNumberError('Phone Number is required');
        isValid = false;
      } else {
        setPhoneNumberError('');
      }
    }
    
    if (activeForm !== 'forgotPassword' && (!hasUppercase || !hasLowercase || !hasNumber)) {
      isValid = false;
    }
    
    return isValid;
  };
  
  // --- SWEETALERT ---
  // Tambahkan 'async' di sini karena kita akan menggunakan 'await' di dalamnya
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // --- SWEETALERT ---
      // Tampilkan notifikasi error jika validasi gagal
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
        // --- SWEETALERT ---
        // Cek status user
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
        // --- SWEETALERT ---
        // Tampilkan notifikasi sukses
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome back, ${user.fullName}!`,
          timer: 2000, // Auto close after 2 seconds
          showConfirmButton: false,
        });
        router.replace('/dashboard');
      } else {
        // --- SWEETALERT ---
        // Ganti confirm() dengan SweetAlert2
        const result = await Swal.fire({
          title: 'User Not Found',
          text: "Incorrect credentials or user not found. Do you want to create a new account?",
          icon: 'question',
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
        // --- SWEETALERT ---
        await Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Your account has been created and is pending approval. Please login after it\'s approved.',
        });
        setActiveForm('login');
        // Reset form fields
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setIdCardImage(null);
        setInstagram('');
        setTiktok('');
        setFacebook('');
      } catch (error: any) {
        // --- SWEETALERT ---
        await Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.message,
        });
      }
    }

    if (activeForm === 'forgotPassword') {
      const forgotIdentifier = email || `${countryCode}${phoneNumber}`;
      // --- SWEETALERT ---
      await Swal.fire({
        icon: 'info',
        title: 'Password Reset',
        text: `If an account exists for ${forgotIdentifier}, a password reset link has been "sent".`,
      });
      setActiveForm('login');
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
      case 'login': return { src: '/images/login_form.png', alt: 'Login Illustration' };
      case 'register': return { src: '/images/register_form.png', alt: 'Register Illustration' };
      case 'forgotPassword': return { src: '/images/forgot_password.png', alt: 'Forgot Password Illustration' };
      default: return { src: '/images/login_form.png', alt: 'Login Illustration' };
    }
  }, [activeForm]);

  return (
    <div className="flex w-screen h-screen bg-gray-50">
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        
        {/* Logo untuk mobile dipindahkan ke paling atas */}
        <div className="flex justify-center md:hidden p-4 bg-white shadow-sm">
          <Image src="/images/logo_trapo.png" alt="TRAPO Logo" width={60} height={60} className="object-contain" />
        </div>

        {/* Container untuk Form dan Gambar */}
        <div className="flex flex-1 overflow-hidden">
          {/* DIV 1: Area Form - 40% di desktop, 100% di mobile */}
          <div className="w-full md:w-2/5 flex-shrink-0 relative overflow-hidden bg-white px-4 sm:px-6 md:px-0">
            <div className="flex h-full transition-transform duration-500 ease-in-out" style={{ transform: slidePosition }}>
              {/* Form Login - Index 0 */}
              <div className="w-full flex-shrink-0 flex items-center justify-center p-4 sm:p-6 md:p-12">
                <div className="w-full md:max-w-sm">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 leading-snug">
                  Sign in to<br />
                  <span className="block">TRAPO Sales Community</span>
                  </h2>

                  
                  <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                    <button type="button" onClick={() => handleLoginMethodChange('email')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${loginMethod === 'email' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>Email</button>
                    <button type="button" onClick={() => handleLoginMethodChange('phone')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${loginMethod === 'phone' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>Phone Number</button>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="relative h-24">
                      <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${isFieldVisible ? 'opacity-100' : 'opacity-0'}`}>
                        {loginMethod === 'email' ? (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="flex">
                              <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="flex-shrink-0 px-3 py-2 sm:py-2 md:py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                {countryCodes.map((c) => (<option key={c.code} value={c.code}>{c.abbr} {c.code}</option>))}
                              </select>
                              <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="812-3456-7890" className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            {phoneNumberError && <p className="text-red-500 text-xs mt-1">{phoneNumberError}</p>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input type="password" value={password} onChange={handlePasswordChange} className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      <div className="mt-2 text-xs">
                        <div className={`flex items-center ${hasUppercase ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasUppercase ? '✓' : '○'}</span><span>Must contain uppercase letter</span></div>
                        <div className={`flex items-center ${hasLowercase ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasLowercase ? '✓' : '○'}</span><span>Must contain lowercase letter</span></div>
                        <div className={`flex items-center ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasNumber ? '✓' : '○'}</span><span>Must contain a number</span></div>
                      </div>
                    </div>
                    <div className="flex items-center"><input id="remember" type="checkbox" className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded" /><label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label></div>
                    <button type="submit" className="w-full p-2 sm:p-2 md:p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">Sign in</button>
                    <div className="text-center space-y-2 text-sm">
                      <button type="button" onClick={() => handleFormSwitch('register')} className="text-blue-500 hover:text-blue-600 transition-colors block">Don't have an account? Register</button>
                      <button type="button" onClick={() => handleFormSwitch('forgotPassword')} className="text-blue-500 hover:text-blue-600 transition-colors block">Forgot Password?</button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Form Register - Index 1 */}
              <div className="w-full flex-shrink-0 flex items-center justify-center p-4 sm:p-6 md:p-12">
                <div className="w-full md:max-w-sm">
                  <h2 className="text-lg sm:text-xl md:text-3xl font-semibold mb-6 text-gray-800">Create a New Account</h2>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />{fullNameError && <p className="text-red-500 text-xs mt-1">{fullNameError}</p>}</div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />{emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}</div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <div className="flex">
                        <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="flex-shrink-0 px-3 py-2 sm:py-2 md:py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                          {countryCodes.map((c) => (<option key={c.code} value={c.code}>{c.abbr} {c.code}</option>))}
                        </select>
                        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="812-3456-7890" className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                      {phoneNumberError && <p className="text-red-500 text-xs mt-1">{phoneNumberError}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                      <input type="password" value={password} onChange={handlePasswordChange} className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      <div className="mt-2 text-xs">
                        <div className={`flex items-center ${hasUppercase ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasUppercase ? '✓' : '○'}</span><span>Must contain uppercase letter</span></div>
                        <div className={`flex items-center ${hasLowercase ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasLowercase ? '✓' : '○'}</span><span>Must contain lowercase letter</span></div>
                        <div className={`flex items-center ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasNumber ? '✓' : '○'}</span><span>Must contain a number</span></div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID Card Image *</label>
                      <div className="flex items-center space-x-3">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 sm:py-2 md:py-3 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">Choose File</button>
                        <span className="text-sm text-gray-600">{idCardImage ? 'Image selected' : 'No file chosen'}</span>
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      {idCardImage && <div className="mt-3 relative w-32 h-32"><Image src={idCardImage} alt="ID Card Preview" fill className="object-cover rounded-md" /></div>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instagram (Optional)</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2 sm:px-2 md:px-3 py-2 sm:py-2 md:py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">@</span>
                        <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="username" className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">TikTok (Optional)</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2 sm:px-2 md:px-3 py-2 sm:py-2 md:py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">@</span>
                        <input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="username" className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facebook (Optional)</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2 sm:px-2 md:px-3 py-2 sm:py-2 md:py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">@</span>
                        <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="username" className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                    </div>
                    <button type="submit" className="w-full p-2 sm:p-2 md:p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">Register</button>
                    <div className="text-center text-sm"><button type="button" onClick={() => handleFormSwitch('login')} className="text-blue-500 hover:text-blue-600 transition-colors">Already have an account? Login</button></div>
                  </form>
                </div>
              </div>

              {/* Form Forgot Password - Index 2 */}
              <div className="w-full flex-shrink-0 flex items-center justify-center p-4 sm:p-6 md:p-12">
                <div className="w-full md:max-w-sm">
                  <h2 className="text-lg sm:text-xl md:text-3xl font-semibold mb-6 text-gray-800">Reset Your Password</h2>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />{emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}</div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <div className="flex">
                        <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="flex-shrink-0 px-3 py-2 sm:py-2 md:py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                          {countryCodes.map((c) => (<option key={c.code} value={c.code}>{c.abbr} {c.code}</option>))}
                        </select>
                        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="812-3456-7890" className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                      </div>
                      {phoneNumberError && <p className="text-red-500 text-xs mt-1">{phoneNumberError}</p>}
                    </div>
                    <button type="submit" className="w-full p-2 sm:p-2 md:p-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors font-medium">Reset Password</button>
                    <div className="text-center text-sm"><button type="button" onClick={() => handleFormSwitch('login')} className="text-blue-500 hover:text-blue-600 transition-colors">Back to Login</button></div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* DIV 2: Area Gambar - 60% di desktop, 100% di mobile */}
          <div className="w-full md:w-3/5 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="relative w-full h-40 sm:h-48 md:h-64 lg:h-80 xl:h-full max-w-xs sm:max-w-sm md:max-w-lg">
              <Image src={imageConfig.src} alt={imageConfig.alt} fill className="object-contain" priority />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;