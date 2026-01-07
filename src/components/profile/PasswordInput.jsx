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

  // Password validation regex
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{6,}$/;
    return regex.test(password);
  };

  // Validate whenever value changes and field has been touched
  useEffect(() => {
    if (touched) {
      setIsValid(validatePassword(value));
    }
  }, [value, touched]);

  // Determine if error should show
  const showRequiredError = touched && required && !value;
  const showValidationError = touched && value && !isValid;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>

      <div className="relative">
        {/* Lock Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>

        {/* Password Input */}
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => {
            if (!touched) setTouched(true);
            setValue(e.target.value);
          }}
          placeholder="Enter your password"
          autoComplete="new-password"
          className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 outline-none transition ${
            showRequiredError || showValidationError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-teal-500'
          }`}
        />

        {/* Show/Hide Button */}
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="h-5 w-5 cursor-pointer" /> : <Eye className="h-5 w-5 cursor-pointer" />}
        </button>
      </div>

      {/* Error messages below input */}
      {showRequiredError && (
        <p className="text-red-500 text-sm mt-1">Current password is required</p>
      )}
      {showValidationError && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
