import { REDIS_URI } from "../../config/config.service.js";
import { createClient } from 'redis'

export const redisClient = createClient({
    url: REDIS_URI
})

export const connectRedis = async() => {
    try {
        console.log(`Connecting to Redis...`);
        await redisClient.connect()
        console.log(`Connected`);
    } catch (error) {
        console.error(`Couldn't connect to Redis`, error)
    }
}