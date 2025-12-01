// src/config/env.ts
import crypto from 'crypto';

export function loadEnv() {
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // ----------------------------
  // JWT Secrets
  // ----------------------------
  const maybeSecret = process.env.JWT_SECRET;
  let JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || maybeSecret;
  let JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || maybeSecret;

  if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    if (NODE_ENV === 'production') {
      throw new Error(
        'JWT secrets must be configured (JWT_ACCESS_SECRET / JWT_REFRESH_SECRET)'
      );
    }

    // Auto-generate ONLY in development
    JWT_ACCESS_SECRET = crypto.randomBytes(48).toString('hex');
    JWT_REFRESH_SECRET = crypto.randomBytes(48).toString('hex');
  }

  // ----------------------------
  // EMAIL CONFIG (Azure SMTP)
  // ----------------------------
  const EMAIL_HOST = process.env.MAIL_HOST || '';
  const EMAIL_PORT = Number(process.env.MAIL_PORT || 587);

  // Azure STARTTLS on port 587 → secure must be false
  const EMAIL_SECURE = false;

  const EMAIL_USER = process.env.MAIL_USERNAME || '';
  const EMAIL_PASSWORD = process.env.MAIL_PASSWORD || '';

  const EMAIL_FROM =
    process.env.MAIL_FROM_ADDRESS ||
    EMAIL_USER ||
    'no-reply@acado.ai';

  const EMAIL_PREVIEW = process.env.MAIL_PREVIEW === 'true';

  return {
    NODE_ENV,
    PORT: Number(process.env.PORT || 5000),

    // Database
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/acadodb',

    // JWT
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

    // CORS
    CORS_ORIGIN:
      process.env.CORS_ORIGIN ||
      'http://localhost:8080,http://localhost:3000,http://localhost:5173',

    // ----------------------------
    // EMAIL (Azure SMTP)
    // ----------------------------
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_FROM,
    EMAIL_PREVIEW,
  };
}









// // src/config/env.ts
// import crypto from 'crypto';

// export function loadEnv() {
//   const NODE_ENV = process.env.NODE_ENV || 'development';
//   const maybeSecret = process.env.JWT_SECRET;
//   let JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || maybeSecret;
//   let JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || maybeSecret;

//   if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
//     if (NODE_ENV === 'production') {
//       throw new Error('JWT secrets must be configured (JWT_ACCESS_SECRET / JWT_REFRESH_SECRET)');
//     }

//     JWT_ACCESS_SECRET = JWT_ACCESS_SECRET || crypto.randomBytes(48).toString('hex');
//     JWT_REFRESH_SECRET = JWT_REFRESH_SECRET || crypto.randomBytes(48).toString('hex');
//   }

//   const EMAIL_HOST = process.env.EMAIL_HOST || '';
//   const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
//   const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true';
//   const EMAIL_USER = process.env.EMAIL_USER || '';
//   const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
//   const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER || 'no-reply@acado.ai';
//   const EMAIL_PREVIEW = process.env.EMAIL_PREVIEW === 'true';

//   return {
//     NODE_ENV,
//     PORT: Number(process.env.PORT || 5000),
//     MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/acadodb',
//     JWT_ACCESS_SECRET,
//     JWT_REFRESH_SECRET,
//     ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
//     REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
//     CORS_ORIGIN:
//       process.env.CORS_ORIGIN || 'http://localhost:8080,http://localhost:3000,http://localhost:5173',
//     EMAIL_HOST,
//     EMAIL_PORT,
//     EMAIL_SECURE,
//     EMAIL_USER,
//     EMAIL_PASSWORD,
//     EMAIL_FROM,
//     EMAIL_PREVIEW,
//   };
// }
