const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors')

connectToMongo();

//ExpressJS Components
const app = express()
const port = 5000

//fixing cors error
app.use(cors())
app.use(express.json())


//with this we can send json as request body of endpoints
app.use(express.json());

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`myNotes backend listening on port ${port}`)
})