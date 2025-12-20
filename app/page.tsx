// app/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToggle } from '@/hooks/useToggle';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User } from '@/types/user';

const Page = () => {
  const router = useRouter();
  const { login, register, loading } = useAuth();
  const [activeForm, setActiveForm] = useState<'login' | 'register'>('login');
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
  
  const handleFormSwitch = (formType: 'login' | 'register') => {
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
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setHasUppercase(/[A-Z]/.test(value));
    setHasLowercase(/[a-z]/.test(value));
    setHasNumber(/[0-9]/.test(value));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (activeForm === 'login') {
      const loginIdentifier = loginMethod === 'email' ? email : `${countryCode}${phoneNumber}`;
      const success = await login(loginIdentifier, password);

      if (success) {
        router.push('/dashboard');
      } else {
        const goToRegister = window.confirm('User not found. Do you want to create a new account?');
        if (goToRegister) {
          setActiveForm('register');
        }
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
        alert('Registration Successful! Please login.');
        setActiveForm('login');
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
      } catch (error: any) {
        alert(`Registration Failed: ${error.message}`);
      }
    }
  };
  
  return (
    <div className="flex w-screen h-screen bg-gray-50">
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Container untuk Form dan Gambar */}
        <div className="flex flex-1 overflow-hidden">
          {/* DIV 1: Area Form - 40% di desktop, 100% di mobile */}
          <div className="w-full md:w-2/5 flex-shrink-0 relative overflow-hidden bg-white px-4 sm:px-6 md:px-0">
            <div className="flex h-full">
              {activeForm === 'login' ? (
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
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                              <div className="flex">
                                <select 
                                  value={countryCode} 
                                  onChange={(e) => setCountryCode(e.target.value)} 
                                  className="flex-shrink-0 px-3 py-2 sm:py-2 md:py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  {countryCodes.map((c) => (
                                    <option key={c.code} value={c.code}>{c.abbr} {c.code}</option>
                                  ))}
                                </select>
                                <Input
                                  type="tel"
                                  value={phoneNumber}
                                  onChange={(e) => setPhoneNumber(e.target.value)}
                                  placeholder="812-3456-7890"
                                  error={phoneNumberError}
                                  className="rounded-l-none"
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
                        <div className="mt-2 text-xs">
                          <div className={`flex items-center ${hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
                            <span className="mr-1">{hasUppercase ? '✓' : '○'}</span>
                            <span>Must contain uppercase letter</span>
                          </div>
                          <div className={`flex items-center ${hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
                            <span className="mr-1">{hasLowercase ? '✓' : '○'}</span>
                            <span>Must contain lowercase letter</span>
                          </div>
                          <div className={`flex items-center ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                            <span className="mr-1">{hasNumber ? '✓' : '○'}</span>
                            <span>Must contain a number</span>
                          </div>
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
              ) : (
                <div className="w-full flex-shrink-0 flex items-center justify-center p-4 sm:p-6 md:p-12">
                  <div className="w-full md:max-w-sm">
                    <h2 className="text-lg sm:text-xl md:text-3xl font-semibold mb-6 text-gray-800">Create a New Account</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <Input
                        label="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        error={fullNameError}
                      />
                      <Input
                        type="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="flex">
                          <select 
                            value={countryCode} 
                            onChange={(e) => setCountryCode(e.target.value)} 
                            className="flex-shrink-0 px-3 py-2 sm:py-2 md:py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            {countryCodes.map((c) => (
                              <option key={c.code} value={c.code}>{c.abbr} {c.code}</option>
                            ))}
                          </select>
                          <Input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="812-3456-7890"
                            error={phoneNumberError}
                            className="rounded-l-none"
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
                        <div className="mt-2 text-xs">
                          <div className={`flex items-center ${hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
                            <span className="mr-1">{hasUppercase ? '✓' : '○'}</span>
                            <span>Must contain uppercase letter</span>
                          </div>
                          <div className={`flex items-center ${hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
                            <span className="mr-1">{hasLowercase ? '✓' : '○'}</span>
                            <span>Must contain lowercase letter</span>
                          </div>
                          <div className={`flex items-center ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                            <span className="mr-1">{hasNumber ? '✓' : '○'}</span>
                            <span>Must contain a number</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Card Image</label>
                        <div className="flex items-center space-x-3">
                          <button 
                            type="button" 
                            onClick={() => document.getElementById('idCardImage')?.click()} 
                            className="px-3 py-2 sm:py-2 md:py-3 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                          >
                            Choose File
                          </button>
                          <span className="text-sm text-gray-600">{idCardImage ? 'Image selected' : 'No file chosen'}</span>
                        </div>
                        <input 
                          id="idCardImage"
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                        {idCardImage && (
                          <div className="mt-3 relative w-32 h-32">
                            <img 
                              src={idCardImage} 
                              alt="ID Card Preview" 
                              className="w-full h-full object-cover rounded-md" 
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram (Optional)</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-2 sm:px-2 md:px-3 py-2 sm:py-2 md:py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">@</span>
                          <Input
                            type="text"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                            placeholder="username"
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">TikTok (Optional)</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-2 sm:px-2 md:px-3 py-2 sm:py-2 md:py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">@</span>
                          <Input
                            type="text"
                            value={tiktok}
                            onChange={(e) => setTiktok(e.target.value)}
                            placeholder="username"
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook (Optional)</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-2 sm:px-2 md:px-3 py-2 sm:py-2 md:py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">@</span>
                          <Input
                            type="text"
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                            placeholder="username"
                            className="rounded-l-none"
                          />
                        </div>
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
              )}
            </div>
          </div>

          {/* DIV 2: Area Gambar - 60% di desktop, 100% di mobile */}
          <div className="w-full md:w-3/5 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="relative w-full h-40 sm:h-48 md:h-64 lg:h-80 xl:h-full max-w-xs sm:max-w-sm md:max-w-lg">
              <img 
                src={activeForm === 'login' ? '/images/login_form.png' : '/images/register_form.png'} 
                alt={activeForm === 'login' ? 'Login Illustration' : 'Register Illustration'} 
                className="w-full h-full object-contain" 
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