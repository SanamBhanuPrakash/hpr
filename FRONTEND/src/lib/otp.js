import { postJSON } from "./api";

export function sendOtp(email) {
  return postJSON("/api/shadesofgreen-form/send-otp", { email });
}

export function verifyOtp(email, code) {
  return postJSON("/api/shadesofgreen-form/verify-otp", { email, code });
}
