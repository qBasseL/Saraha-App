import {
  badRequestException,
  conflictException,
  createLoginCredentials,
  createNumberOtp,
  emailEvent,
  forbiddenException,
  generateDecryption,
  generateEncryption,
  notFoundException,
  sendEmail,
} from "../../common/utils/index.js";
import { UserModel, findOne, insertOne } from "../../DB/index.js";
import { generateHash, compareHash } from "../../common/utils/index.js";
import {
  TOKEN_ACCESS_SECRET_KEY,
  TOKEN_REFRESH_SECRET_KEY,
  WEB_CLIENT_ID,
} from "../../../config/config.service.js";
import { OAuth2Client } from "google-auth-library";
import { ProviderEnum } from "../../common/enums/user.enum.js";
import { emailTemplate } from "../../common/utils/email/template.email.js";
import {
  get,
  otpTemplateKey,
  set,
  deletekey,
  keys,
  ttl,
  otpMaxTrial,
  otpBlockTemplateKey,
  incr,
} from "../../common/services/redis.service.js";
import { EmailEnum } from "../../common/enums/email.enum.js";

const resendOTP = async ({ email, subject, title } = {}) => {
  const isBlocked = await ttl({ key: otpBlockTemplateKey({ email, subject }) });

  if (isBlocked > 0) {
    return badRequestException({
      Message:
        "Sorry we can't request another otp rn please try again after 10 minutes",
    });
  }

  const hashOtp = await ttl({ key: otpTemplateKey({ email, subject }) });

  if (hashOtp > 0) {
    return badRequestException({
      Message: "Sorry we can't request another otp rn please try again later",
    });
  }

  const maxTrial = await get({ key: otpMaxTrial({ email, subject }) });

  if (maxTrial >= 3) {
    await set({
      key: otpBlockTemplateKey({ email, subject }),
      value: 1,
      ttl: 600,
    });
    return badRequestException({
      Message: "Can't generate more OTP's right not please try again later",
    });
  }

  const code = await createNumberOtp();
  await set({
    key: otpTemplateKey({ email, subject }),
    value: await generateHash({ plaintext: `${code}` }),
    ttl: 300,
  });

  emailEvent.emit("sendEmail", async () => {
    await sendEmail({
      to: email,
      subject,
      html: emailTemplate({ title, code }),
    });

    await incr({ key: otpMaxTrial({ email, subject }) });
  });
};

const verifyGoogleAccount = async (idToken) => {
  const client = new OAuth2Client(WEB_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: WEB_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email_verified) {
    return badRequestException({ Message: "Can't use this email" });
  }

  return payload;
};

export const signup = async (data) => {
  const { username, email, password, phone } = data;
  const checkUser = await findOne({
    filter: { email },
    model: UserModel,
    options: {
      lean: true,
    },
  });
  if (checkUser) {
    return conflictException({ Message: "This Email Is Already Signed Up" });
  }
  const user = await insertOne({
    model: UserModel,
    data: {
      username,
      email,
      password: await generateHash({ plaintext: password }),
      phone: await generateEncryption(phone),
    },
  });

  const code = await createNumberOtp();
  await set({
    key: otpTemplateKey({ email, subject: EmailEnum.ConfirmEmail }),
    value: await generateHash({ plaintext: `${code}` }),
    ttl: 300,
  });

  emailEvent.emit("sendEmail", async () => {
    await sendEmail({
      to: email,
      subject: "Confirm Email",
      html: emailTemplate({ title: "Confirm Email", code }),
    });

    await set({
      key: otpMaxTrial({ email, subject: EmailEnum.ConfirmEmail }),
      value: 1,
      ttl: 1500,
    });
  });

  await set({ key: otpMaxTrial({ email }), value: 1, ttl: 1500 });

  return user;
};

export const confirmSignup = async (data) => {
  const { email, otp } = data;
  const checkUser = await findOne({
    filter: {
      email,
      confirmedEmail: { $exists: false },
      provider: ProviderEnum.System,
    },
    model: UserModel,
  });
  if (!checkUser) {
    return notFoundException({ Message: "User is not found to be verfied" });
  }

  const hashOtp = await get({
    key: otpTemplateKey({ email, subject: EmailEnum.ConfirmEmail }),
  });

  if (!hashOtp) {
    return notFoundException({ Message: "Didn't find your one time password" });
  }

  if (!(await compareHash({ plaintext: otp, cipherText: hashOtp }))) {
    return conflictException({ Message: "Invalid OTP" });
  }

  checkUser.confirmedEmail = new Date();
  await checkUser.save();

  return;
};

export const resendConfirmSignup = async (data) => {
  const { email } = data;
  const checkUser = await findOne({
    filter: {
      email,
      confirmedEmail: { $exists: false },
      provider: ProviderEnum.System,
    },
    model: UserModel,
  });
  if (!checkUser) {
    return notFoundException({ Message: "User is not found to be verfied" });
  }

  const isBlocked = await ttl({ key: otpBlockTemplateKey({ email }) });

  if (isBlocked > 0) {
    return badRequestException({
      Message:
        "Sorry we can't request another otp rn please try again after 10 minutes",
    });
  }

  const hashOtp = await ttl({ key: otpTemplateKey({ email }) });

  if (hashOtp > 0) {
    return badRequestException({
      Message: "Sorry we can't request another otp rn please try again later",
    });
  }

  const maxTrial = await get({ key: otpMaxTrial({ email }) });

  if (maxTrial >= 3) {
    await set({
      key: otpBlockTemplateKey({ email }),
      value: 1,
      ttl: 600,
    });
    return badRequestException({
      Message: "Can't generate more OTP's right not please try again later",
    });
  }

  const code = await createNumberOtp();
  await set({
    key: otpTemplateKey({ email }),
    value: await generateHash({ plaintext: `${code}` }),
    ttl: 300,
  });

  emailEvent.emit("sendEmail", async () => {
    await sendEmail({
      to: email,
      subject: "Confirm Email",
      html: emailTemplate({ title: "Confirm Email", code }),
    });

    await incr({ key: otpMaxTrial({ email }) });
  });
  return;
};

export const login = async (data) => {
  const { email, password } = data;
  const checkUser = await findOne({
    model: UserModel,
    filter: { email, provider: ProviderEnum.System },
    // select:'firstName lastName email',
    options: {
      lean: true,
    },
  });
  if (!checkUser) {
    return notFoundException({ Message: "Couldn't Find This User" });
  }
  if (!checkUser.confirmedEmail) {
    return conflictException({
      Message: "Verify your account before you can signin",
    });
  }
  checkUser.phone = await generateDecryption(checkUser.phone);
  const match = await compareHash({
    plaintext: password,
    cipherText: checkUser.password,
    // approach: HashApproachEnums.argon2
  });

  if (!match) {
    return notFoundException({ Message: "Email or password is wrong" });
  }

  return createLoginCredentials(checkUser);
};

export const signupWithGmail = async (idToken) => {
  const payload = await verifyGoogleAccount(idToken);

  const checkUser = await findOne({
    model: UserModel,
    filter: {
      email: payload.email,
    },
  });

  if (checkUser) {
    if (checkUser.provider !== ProviderEnum.Google) {
      return conflictException({ Message: "Try to login with Google" });
    }
    return await loginWithGmail(idToken);
  }

  const user = await insertOne({
    model: UserModel,
    data: {
      firstName: payload.given_name,
      lastName: payload.family_name || "empty",
      email: payload.email,
      profilePicture: payload.picture,
      confirmedEmail: new Date(),
      provider: ProviderEnum.Google,
    },
  });

  return { status: 201, credentials: await createLoginCredentials(user) };
};

export const loginWithGmail = async (idToken) => {
  const payload = await verifyGoogleAccount(idToken);

  const checkUser = await findOne({
    model: UserModel,
    filter: {
      email: payload.email,
      provider: ProviderEnum.Google,
    },
    options: {
      lean: true,
    },
  });

  if (!checkUser) {
    return notFoundException({
      Message: "This Account is not found",
    });
  }

  if (checkUser.provider !== ProviderEnum.Google) {
    return conflictException({
      Message: "Try logging in with your normal credentials.",
    });
  }

  return {
    status: 200,
    credentials: await createLoginCredentials(checkUser),
  };
};
