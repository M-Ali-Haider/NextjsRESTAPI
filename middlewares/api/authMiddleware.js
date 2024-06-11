const validate = (token) => {
  if (token != process.env.BEARER_TOKEN) {
    return false;
  }
  return true;
};

export function authMiddleware(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  return { isValid: validate(token) };
}
