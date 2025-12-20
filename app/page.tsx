// app/page.tsx
'use client';

import React, { useState, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useToggle } from '@/hooks/useToggle';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Swal from 'sweetalert2';

type ActiveForm = 'login' | 'register';

const Page = () => {
  const router = useRouter();
  const { login, register, loading } = useAuth();
  
  const [activeForm, setActiveForm] = useState<ActiveForm>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [isFieldVisible, setIsFieldVisible] = useToggle(true);
  
  // State untuk input form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+62');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [facebook, setFacebook] = useState('');
  
  // State untuk validasi password
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  
  // State untuk pesan error
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
  
  const handleFormSwitch = (formType: ActiveForm) => {
    setActiveForm(formType);
    // Reset error saat berganti form
    setFullNameError('');
    setEmailError('');
    setPhoneNumberError('');
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
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(value));
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
    
    // Validasi password yang lebih kuat
    if (activeForm !== 'forgotPassword' && password.length < 8) {
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Validation Failed',
        text: 'Please fill in all required fields correctly. Password must be at least 8 characters long.',
      });
      return;
    }

    if (activeForm === 'login') {
      const loginIdentifier = loginMethod === 'email' ? email : `${countryCode}${phoneNumber}`;
      const success = await login(loginIdentifier, password);

      if (success) {
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back!',
          timer: 2000,
          showConfirmButton: false,
        });
        router.replace('/dashboard');
      } else {
        await Swal.fire({
          title: 'Login Failed',
          text: 'Incorrect credentials or user not found.',
          icon: 'error',
        });
      }
    }

    if (activeForm === 'register') {
      const userData = {
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
        await register(userData);
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
        await Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.message,
        });
      }
    }
  };
  
  return (
    <div className="flex w-screen h-screen bg-gray-50">
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <div className="w-full md:w-2/5 flex-shrink-0 relative overflow-hidden bg-white px-4 sm:px-6 md:px-0">
            <div className="flex h-full transition-transform duration-500 ease-in-out" style={{ transform: activeForm === 'login' ? 'translateX(0%)' : activeForm === 'register' ? 'translateX(-100%)' : 'translateX(-200%)' }}>
              {/* Form Login */}
              <div className="w-full flex-shrink-0 flex items-center justify-center p-4 sm:p-6 md:p-12">
                <div className="w-full md:max-w-sm">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 leading-snug">
                    Sign in to<br />
                    <span className="block">TRAPO Sales Community</span>
                  </h2>

                  <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                    <button
                      type="button"
                      onClick={() => handleLoginMethodChange('email')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                        loginMethod === 'email' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoginMethodChange('phone')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                        loginMethod === 'phone' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Phone Number
                    </button>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="relative h-24">
                      <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${isFieldVisible ? 'opacity-100' : 'opacity-0'}`}>
                        {loginMethod === 'email' ? (
                          <Input
                            type="email"
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={emailError}
                          />
                        ) : (
                          <div>
                            <Input label="Phone Number" error={phoneNumberError} />
                            <div className="flex mt-1">
                              <select
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="flex-shrink-0 px-3 py-2 sm:py-2 md:py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                {countryCodes.map((c) => (<option key={c.code} value={c.code}>{c.abbr} {c.code}</option>))}
                              </select>
                              <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="812-3456-7890"
                                className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Input
                        type="password"
                        label="Password"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <div className="mt-2 text-xs space-y-1">
                        <div className={`flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{password.length >= 8 ? '✓' : '○'}</span><span>At least 8 characters</span></div>
                        <div className={`flex items-center ${hasUppercase ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasUppercase ? '✓' : '○'}</span><span>One uppercase letter</span></div>
                        <div className={`flex items-center ${hasLowercase ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasLowercase ? '✓' : '○'}</span><span>One lowercase letter</span></div>
                        <div className={`flex items-center ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasNumber ? '✓' : '○'}</span><span>One number</span></div>
                        <div className={`flex items-center ${hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasSpecialChar ? '✓' : '○'}</span><span>One special character</span></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input id="remember" type="checkbox" className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded" />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
                    </div>
                    <Button type="submit" isLoading={loading} className="w-full">
                      Sign in
                    </Button>
                    <div className="text-center space-y-2 text-sm">
                      <button
                        type="button"
                        onClick={() => handleFormSwitch('register')}
                        className="text-blue-500 hover:text-blue-600 transition-colors block"
                      >
                        Don't have an account? Register
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Form Register */}
              <div className="w-full flex-shrink-0 flex items-center justify-center p-4 sm:p-6 md:p-12">
                <div className="w-full md:max-w-sm">
                  <h2 className="text-lg sm:text-xl md:text-3xl font-semibold mb-6 text-gray-800">Create a New Account</h2>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={fullNameError} />
                    <Input type="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} />
                    <div>
                      <Input label="Phone Number" error={phoneNumberError} />
                      <div className="flex mt-1">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="flex-shrink-0 px-3 py-2 sm:py-2 md:py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          {countryCodes.map((c) => (<option key={c.code} value={c.code}>{c.abbr} {c.code}</option>))}
                        </select>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="812-3456-7890"
                          className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <Input
                        type="password"
                        label="Password"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <div className="mt-2 text-xs space-y-1">
                        <div className={`flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{password.length >= 8 ? '✓' : '○'}</span><span>At least 8 characters</span></div>
                        <div className={`flex items-center ${hasUppercase ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasUppercase ? '✓' : '○'}</span><span>One uppercase letter</span></div>
                        <div className={`flex items-center ${hasLowercase ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasLowercase ? '✓' : '○'}</span><span>One lowercase letter</span></div>
                        <div className={`flex items-center ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasNumber ? '✓' : '○'}</span><span>One number</span></div>
                        <div className={`flex items-center ${hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasSpecialChar ? '✓' : '○'}</span><span>One special character</span></div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID Card Image</label>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-2 sm:py-2 md:py-3 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        >
                          Choose File
                        </button>
                        <span className="text-sm text-gray-600">{idCardImage ? 'Image selected' : 'No file chosen'}</span>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {idCardImage && (
                        <div className="mt-3 relative w-32 h-32">
                          <Image src={idCardImage} alt="ID Card Preview" fill className="object-cover rounded-md" />
                        </div>
                      )}
                    </div>
                    <div>
                      <Input label="Instagram (Optional)" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="username" />
                      <Input label="TikTok (Optional)" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="username" />
                      <Input label="Facebook (Optional)" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="username" />
                    </div>
                    <Button type="submit" isLoading={loading} className="w-full">
                      Register
                    </Button>
                    <div className="text-center text-sm">
                      <button
                        type="button"
                        onClick={() => handleFormSwitch('login')}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        Already have an account? Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Area Gambar */}
          <div className="w-full md:w-3/5 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="relative w-full h-40 sm:h-48 md:h-64 lg:h-80 xl:h-full max-w-xs sm:max-w-sm md:max-w-lg">
              <Image
                src={activeForm === 'login' ? '/images/login_form.png' : '/images/register_form.png'}
                alt={activeForm === 'login' ? 'Login Illustration' : 'Register Illustration'}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;