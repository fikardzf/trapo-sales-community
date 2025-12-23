// app/auth/components/register/register_form.tsx

'use client';

import React, { ChangeEvent } from 'react';

const RegisterForm = ({
  fullName,
  setFullName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  password,
  setPassword,
  passwordError,
  emailError,
  phoneNumberError,
  handleSubmit,
}: any) => {
  return (
    <div className="w-full flex-shrink-0 flex items-center justify-center p-4 sm:p-6 md:p-12">
      <div className="w-full md:max-w-sm">
        <h2 className="text-lg sm:text-xl md:text-3xl font-semibold mb-6 text-gray-800">Create a New Account</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
              className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {phoneNumberError && <p className="text-red-500 text-xs mt-1">{phoneNumberError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>

          <button type="submit" className="w-full p-2 sm:p-2 md:p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
