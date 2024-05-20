const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello Flux! This is a demo.'))
app.listen(3000, () => console.log('Server ready'))
