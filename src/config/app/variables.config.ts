export default () => ({
  auth: {
    path: '/auth',
    login: {
      maxAttempts: 10,
      maxErrorMessage: 'reset your password',
    },
    reset: {
      maxAttempts: 10,
      maxErrorMessage: 'try again later',
    },
  },

  verification: {
    maxAttempts: 10,
    coolDown: 1000 * 60 * 15, // 15m
    maxCoolDown: 1000 * 60 * 60 * 24, // 24h
  },

  otp: {
    min: 100_000,
    max: 999_999,
    expiresInMS: 1000 * 60 * 5, // 5 minutes
    maxAttempts: 10,
    coolDown: 1000 * 60 * 15, // 15m
    maxCoolDown: 1000 * 60 * 60 * 24, // 24h
  },

  client: { baseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:8000' },
  api: {
    baseUrl:
      process.env.NODE_ENV === 'production'
        ? process.env.API_BASE_URL
        : 'http://localhost:3000',
  },

  company: { name: 'Arabity' },

  bcrypt: {
    rounds: 10,
  },

  jwt: {
    access: {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '24h',
    },
    verification: {
      secret: process.env.VERIFICATION_TOKEN_SECRET,
      expiresIn: process.env.VERIFICATION_TOKEN_EXPIRES_IN || '15m',
    },
    reset: {
      secret: process.env.RESET_TOKEN_SECRET,
      expiresIn: process.env.RESET_TOKEN_EXPIRES_IN || '5m',
    },
  },

  email: {
    brevoApiKey: process.env.BREVO_API_KEY,
    senderEmail: process.env.SENDER_MAIL || process.env.SERVER_MAIL,
    supportEmail: process.env.SUPPORT_MAIL || process.env.SERVER_MAIL,
  },

  pagination: {
    defaultPage: +process.env.DEFAULT_PAGE! || 1,
    defaultLimit: +process.env.DEFAULT_LIMIT! || 10,
    maxLimit: +process.env.MAX_LIMIT! || 100,
  },

  booking: {
    pendingTimeMS: 1000 * 60 * 60, // 1 hour
  },

  kashierPayment: {
    merchantId: process.env.KASHIER_MERCHANT_ID,
    apiKey: process.env.KASHIER_API_KEY,
    mode: process.env.KASHIER_MODE || 'test',
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },

  googleOAuth: {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  },
});
