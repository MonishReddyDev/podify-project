const { env } = process as { env: { [key: string]: string } };

export const {
  MONGO_URI,
  PORT,
  MAILTRAP_PASS,
  MAILTRAP_USER,
  VERIFICATION_EMAIL,
  PASSWORD_RESET_LINK,
  SIGN_IN_URL,
  JWt_SECRET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET,
} = env;
