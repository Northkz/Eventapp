// Adil Toktarov 1155147818
// Kambar Nursulatan (1155147668)
// Mincheol Kim (1155131310)
// Byeong Hyun Park (1155149086)
// Wong Po Wa (1155161947)

const express = require('express');
const cors = require('cors');
const {connectDB} = require('./utils/db');
const dotenv = require('dotenv')

const { get_logger } = require('./utils/logger.js')
const { errorHandler } = require('./middleware/error_middleware')

// Get Logger
const logger = get_logger()

// ENV Variables
dotenv.config({ path: './config.env' })

// Connect MongoDB
connectDB();

// Run server
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/chat', require('./routes/ChatRoute'))
app.use('/api/user', require('./routes/user_routes.js'))
app.use('/api/message', require('./routes/MessageRoute'))
app.use('/api/event', require('./routes/event_routes'))
app.use('/api/venue', require('./routes/venue_routes'))
app.use('/api/admin', require('./routes/admin_routes'))

app.use(errorHandler)

app.use('/*', require('./routes/unused_routes'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`)
})