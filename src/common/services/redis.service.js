import { redisClient } from "../../DB/index.js";

export const baseRevokeTokenKey = ({ userId }) => {
  return `RevokeToken::${userId}`;
};

export const revokeTokenKey = ({ userId, jti }) => {
  return `${baseRevokeTokenKey({ userId })}::${jti}`;
};

export const otpTemplateKey = ({ email, subject = "ConfirmEmail" } = {}) => {
  return `OTP::User::${email}::${subject}`;
};

export const otpBlockTemplateKey = ({ email, subject = "ConfirmEmail" } = {}) => {
  return `OTP::User::${email}::${subject}::Block`;
};

export const otpMaxTrial = ({ email, subject = "ConfirmEmail" } = {}) => {
  return `OTP::User::${email}::${subject}::MaxTrial`;
};

export const set = async ({ key, value, ttl } = {}) => {
  try {
    let data = typeof value === "string" ? value : JSON.stringify(value);
    return ttl
      ? await redisClient.set(key, data, { EX: ttl })
      : await redisClient.set(key, data);
  } catch (error) {
    console.log(`Failed in redis set operation ${error}`);
  }
};

export const update = async ({ key, value, ttl } = {}) => {
  try {
    if (!(await exists({ key }))) {
      return 0;
    }
    return await set({ key, value, ttl });
  } catch (error) {
    console.log(`Failed in redis update operation ${error}`);
  }
};

export const get = async ({ key } = {}) => {
  try {
    if (!(await exists({ key }))) {
      return 0;
    }
    return await redisClient.get(key);
  } catch (error) {
    console.log(`Failed in redis get operation ${error}`);
  }
};

export const ttl = async ({ key } = {}) => {
  try {
    if (!(await exists({ key }))) {
      return 0;
    }
    return await redisClient.ttl(key);
  } catch (error) {
    console.log(`Failed in redis ttl operation ${error}`);
  }
};

export const exists = async ({ key } = {}) => {
  try {
    return await redisClient.exists(key);
  } catch (error) {
    console.log(`Failed in redis exists operation ${error}`);
  }
};

export const expire = async ({ key, ttl } = {}) => {
  try {
    return await redisClient.expire(key, ttl);
  } catch (error) {
    console.log(`Failed in redis expire operation ${error}`);
  }
};

export const mGet = async ({ keys = [] } = {}) => {
  try {
    if (!keys.length) {
      return 0;
    }
    return await redisClient.mGet(keys);
  } catch (error) {
    console.log(`Failed in redis mGet operation ${error}`);
  }
};

export const keys = async ({ prefix } = {}) => {
  try {
    return await redisClient.keys(`${prefix}*`);
  } catch (error) {
    console.log(`Failed in redis keys operation ${error}`);
  }
};

export const deletekey = async ({ key } = {}) => {
  try {
    if (Array.isArray(key)) {
      if (!key.length) return 0;
      return await redisClient.del(...key);
    }
    return await redisClient.del(key);
  } catch (error) {
    console.log(`Failed in redis delete operation ${error}`);
  }
};

export const incr = async ({ key }) => {
  try {
    await redisClient.incr(key);
  } catch (error) {
    console.log(`Failed in redis incr operation ${error}`);
  }
};
