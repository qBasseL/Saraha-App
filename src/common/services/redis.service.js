import { redisClient } from "../../DB/index.js";

export const set = async ({ key, value, ttl } = {}) => {
  try {
    let data = typeof value === "string" ? value : JSON.stringify(value);
    return ttl
      ? await redisClient.set(key, data, { expiration: ttl })
      : await redisClient.set(key, data);
  } catch (error) {
    console.log(`Failed in redis set operation ${error}`);
  }
};

export const update = async ({ key, value, ttl } = {}) => {
  try {
    if (!(await redisClient.exists(key))) {
      return 0;
    }
    return await set({ key, value, ttl });
  } catch (error) {
    console.log(`Failed in redis update operation ${error}`);
  }
};


export const get = async({key} = {}) => {
    try {
        if(!await redisClient.exists(key)) {
            return 0
        }
        return await redisClient.get(key)
    } catch (error) {
        console.log(`Failed in redis get operation ${error}`);
    }
}