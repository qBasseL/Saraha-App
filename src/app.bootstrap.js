import express from 'express'
import { globalErrorHandler } from './common/utils/response/error.response.js'
import {PORT} from '../config/config.service.js'

const bootstrap = async () => {
    const app = express()
    app.use(express.json())

    app.use(globalErrorHandler)

    app.listen(PORT, ()=> {
        console.log(`Server is running on port ${PORT}`);
    })
}