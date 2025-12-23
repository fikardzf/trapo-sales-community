// app/auth/components/login/login_form.tsx

'use client';

import React, { useState, ChangeEvent } from 'react';

const LoginForm = ({ email, setEmail, password, setPassword, emailError, phoneNumberError, passwordError, handleSubmit }: any) => {
  return (
    <div className="w-full flex-shrink-0 flex items-center justify-center p-4 sm:p-6 md:p-12">
      <div className="w-full md:max-w-sm">
        <h2 className="text-lg sm:text-xl md:text-3xl font-semibold mb-6 text-gray-800">
          Sign in to <span className="block">TRAPO Sales Community</span>
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative h-24">
            <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>

          <button type="submit" className="w-full p-2 sm:p-2 md:p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
