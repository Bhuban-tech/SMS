import React from "react";
import { X } from "lucide-react";

 function IndividualSMS({ currentPhone, setCurrentPhone, contacts, phoneNumbers, setPhoneNumbers, showAlert }) {
  const removePhoneNumber = (phone) => setPhoneNumbers(phoneNumbers.filter((p) => p !== phone));

  return (
    <div className="mb-6 relative">
      <input
        type="text"
        value={currentPhone}
        onChange={(e) => setCurrentPhone(e.target.value)}
        placeholder="Search by name or phone number"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
      />
      {currentPhone && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {contacts
            .filter((c) =>
              c.name.toLowerCase().includes(currentPhone.toLowerCase()) || c.phoneNo.includes(currentPhone)
            )
            .map((c) => (
              <li
                key={c.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (!phoneNumbers.includes(c.phoneNo)) {
                    setPhoneNumbers([...phoneNumbers, c.phoneNo]);
                    setCurrentPhone("");
                    
                  }
                }}
              >
                {c.name} <span className="text-gray-500">({c.phoneNo})</span>
              </li>
            ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {phoneNumbers.map((p) => (
          <span key={p} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {p}
            <X size={16} onClick={() => removePhoneNumber(p)} className="cursor-pointer hover:text-red-600" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default IndividualSMS;