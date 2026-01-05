'use client';

import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PasswordInput({
  label,
  value,
  setValue,
  show,
  setShow,
  validate = true,
  required = false,
  errorMessage = '',
}) {
  const [isValid, setIsValid] = useState(true);
  const [touched, setTouched] = useState(false);

  const validatePassword = (password) => {
    if (!validate) return true;
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{6,}$/;
    return regex.test(password);
  };

  useEffect(() => {
    if (validate && touched) {
      setIsValid(validatePassword(value));
    }
  }, [value, validate, touched]);

  const showError =
    touched && (required && !value ? true : !isValid);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
          className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 outline-none transition ${
            showError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-teal-500'
          }`}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
        >
          {show ? (
            <EyeOff className="h-5 w-5 cursor-pointer" />
          ) : (
            <Eye className="h-5 w-5 cursor-pointer" />
          )}
        </button>
      </div>

      {showError && (
        <p className="text-red-500 text-sm mt-1">
          {required && !value
            ? 'Current password is required'
            : errorMessage}
        </p>
      )}
    </div>
  );
}
