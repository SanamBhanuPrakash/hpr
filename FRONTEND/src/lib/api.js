const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Single place every API call goes through. Mirrors the existing fetch
// pattern in LandingPage.jsx exactly (same base URL, same JSON contract)
// so nothing about the real backend's request/response shape changes.
export async function postJSON(path, payload) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error(error);
    return { ok: false, data: { success: false, message: "Server error. Please try again." } };
  }
}
