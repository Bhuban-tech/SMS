export function saveAuthData({ token, id, username, email }) {
  localStorage.setItem("token", token);
  localStorage.setItem("adminId", id.toString());
  localStorage.setItem("username", username);
  localStorage.setItem("email", email || "");
}
