import express from "express";
import { FlightRouter } from './router/flight.router';

const app = express()
const port = 3000


app.use('/flights', FlightRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

