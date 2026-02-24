import express from 'express'

const bootstrap = async () => {
    const app = express()
    app.use(express.json())
}