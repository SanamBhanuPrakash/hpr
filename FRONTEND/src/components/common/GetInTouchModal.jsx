import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useLeadSubmit } from "../../hooks/useLeadSubmit";
import { validateEmail, validatePhone } from "../../lib/validators";
import { useRequestPriceModal } from "../../context/RequestPriceModalContext";

const EMPTY_FORM = { name: "", email: "", phone: "", interest: "", message: "" };

// The one "Get in Touch" popup, mounted once in App.jsx and triggered from
// any route via useRequestPriceModal() — see that context for why this
// replaced a copy of this same modal that used to live only inside
// LandingPage.jsx (it couldn't be opened from any other page).
export default function GetInTouchModal() {
  const { isOpen, close } = useRequestPriceModal();
  const navigate = useNavigate();
  const { submit: submitLead } = useLeadSubmit();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
    if (submitError) setSubmitError("");
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full Name is required.";

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;

    if (!formData.interest) errors.interest = "Please select an area of interest.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const closeAndReset = () => {
    close();
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const ok = await submitLead({ ...formData, source: "form" });
    setSubmitting(false);

    if (ok) {
      closeAndReset();
      navigate("/thank-you");
    } else {
      setSubmitError("Failed to submit inquiry. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100 flex flex-col justify-center w-full max-w-lg">
        <button
          type="button"
          onClick={closeAndReset}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Get in Touch</h2>
          <p className="text-gray-600 max-w-md text-sm">
            Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        {submitError && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4" noValidate>
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name *"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all ${
                formErrors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-emerald-500"
              }`}
            />
            {formErrors.name && <p className="text-red-500 text-[11px] mt-1 font-medium">{formErrors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address *"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all ${
                formErrors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-emerald-500"
              }`}
            />
            {formErrors.email && <p className="text-red-500 text-[11px] mt-1 font-medium">{formErrors.email}</p>}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              maxLength="10"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-Digit Mobile Number *"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all ${
                formErrors.phone ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-emerald-500"
              }`}
            />
            {formErrors.phone && <p className="text-red-500 text-[11px] mt-1 font-medium">{formErrors.phone}</p>}
          </div>

          <div>
            <select
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm text-gray-600 transition-all ${
                formErrors.interest ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-emerald-500"
              }`}
            >
              <option value="">I'm interested in... *</option>
              <option value="Villa Details">Villa Details</option>
              <option value="Site Visit">Site Visit</option>
              <option value="Pricing Information">Pricing Information</option>
              <option value="Floor Plans">Floor Plans</option>
            </select>
            {formErrors.interest && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">{formErrors.interest}</p>
            )}
          </div>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
            rows="3"
            className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none transition-all"
          />

          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 w-full bg-[#1A4744] text-white px-6 py-3.5 rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
