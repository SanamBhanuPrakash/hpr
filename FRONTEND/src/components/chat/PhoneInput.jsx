import { useEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import { validatePhone } from "../../lib/validators";

// A dedicated phone entry widget for the contact_phone step — same idea as
// OtpInput for verify_otp: a real purpose-built input instead of typing a
// number into the generic free-text message box. A fixed "+91" prefix
// (this project is India-only — see validators.js's INDIAN_MOBILE_REGEX)
// and digit-only filtering means something like "grssrg" can't be typed in
// at all, rather than being accepted and then rejected after the fact.
export default function PhoneInput({ onSubmit }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValue(digits);
    if (error) setError("");
  };

  const handleSubmit = () => {
    const validationError = validatePhone(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSubmit(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isValid = value.length === 10 && !validatePhone(value);

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 h-11 rounded-lg bg-white border border-gray-300 text-sm font-semibold text-gray-600 flex-shrink-0">
          <Phone className="w-3.5 h-3.5 text-gray-400" />
          +91
        </div>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          maxLength={10}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="10-digit mobile number"
          aria-label="Phone number"
          className={`flex-1 h-11 px-3.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
            error ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-emerald-500"
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid}
        className="mt-3 w-full py-2.5 rounded-xl bg-[#1A4744] text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
