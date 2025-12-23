// app/auth/components/forgotPassword/forgot_password_form.tsx

'use client';

import React, { ChangeEvent } from 'react';

const ForgotPasswordForm = ({ email, setEmail, phoneNumber, setPhoneNumber, emailError, phoneNumberError, handleSubmit }: any) => {
  return (
    <div className="w-full flex-shrink-0 flex items-center justify-center p-4 sm:p-6 md:p-12">
      <div className="w-full md:max-w-sm">
        <h2 className="text-lg sm:text-xl md:text-3xl font-semibold mb-6 text-gray-800">Reset Your Password</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
              className="w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            {phoneNumberError && <p className="text-red-500 text-xs mt-1">{phoneNumberError}</p>}
          </div>

          <button type="submit" className="w-full p-2 sm:p-2 md:p-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors font-medium">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
