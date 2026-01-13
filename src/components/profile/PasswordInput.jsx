// PasswordInput.jsx
'use client';

import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PasswordInput({
  label = 'Current Password',
  value,
  setValue,
  show,
  setShow,
  required = false,
  errorMessage = 'Password must be at least 6 characters, include a number and a special character',
}) {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{6,}$/;
    return regex.test(password);
  };

  useEffect(() => {
    if (touched) {
      setIsValid(validatePassword(value));
    }
  }, [value, touched]);

  const showRequiredError = touched && required && !value;
  const showValidationError = touched && value && !isValid;

  return (
    <div className="space-y-1.5 sm:space-y-2">
      <label className="block text-sm font-medium text-gray-700 sm:font-semibold">
        {label}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>

        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => {
            if (!touched) setTouched(true);
            setValue(e.target.value);
          }}
          placeholder="Enter your password"
          autoComplete="new-password"
          className={`
            w-full pl-11 sm:pl-12 pr-12 py-3 sm:py-3.5
            border rounded-lg text-base sm:text-[15px]
            focus:ring-2 outline-none transition-all
            ${
              showRequiredError || showValidationError
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
            }
          `}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-3.5 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 active:text-gray-800"
        >
          {show ? (
            <EyeOff className="h-5 w-5 cursor-pointer" />
          ) : (
            <Eye className="h-5 w-5 cursor-pointer" />
          )}
        </button>
      </div>

      {(showRequiredError || showValidationError) && (
        <p className="text-red-600 text-xs sm:text-sm mt-1.5">
          {showRequiredError ? `${label} is required` : errorMessage}
        </p>
      )}
    </div>
  );
}