// app/page.tsx
'use client';

import React, { useState, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useToggle } from '@/hooks/useToggle';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Swal from 'sweetalert2';

// Tipe untuk form yang aktif
type ActiveForm = 'login' | 'register';

const Page = () => {
  const router = useRouter();
  const { login, register, loading } = useAuth();
  
  // State untuk form
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
          text: 'Your account has been created and is pending approval.',
        });
        setActiveForm('login');
        // Reset form
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
      } catch (error: any) {
        await Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.message,
        });
      }
    }
  };
  
  // ... (Sisanya dari kode asli dapat dipertahankan, hanya bagian handleSubmit dan state yang diubah)
  
  return (
    <div className="flex w-screen h-screen bg-gray-50">
      {/* ... (Sisanya dari kode asli dapat dipertahankan, hanya ganti button dan input dengan komponen baru) */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Contoh penggunaan komponen baru */}
        <Input
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
        <Button type="submit" isLoading={loading} className="w-full">
          Sign in
        </Button>
      </form>
      {/* ... */}
    </div>
  );
};

export default Page;