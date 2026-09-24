export function getJwtKey(): string {
  const key = process.env.JWT_PRIVATE_KEY;
  if (!key) {
    throw new Error('FATAL ERROR: JWT_PRIVATE_KEY is not defined.');
  }
  return key;
}
