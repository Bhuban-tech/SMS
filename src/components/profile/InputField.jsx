// InputField.jsx
'use client';

export default function InputField({ label, value, setValue, Icon, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 sm:font-semibold">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full 
            ${Icon ? 'pl-11 sm:pl-12' : 'px-4'} 
            pr-4 py-3 sm:py-3.5 
            border border-gray-300 rounded-lg 
            text-base sm:text-[15px]
            focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
            outline-none transition-all
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          `}
        />
      </div>
    </div>
  );
}