import express from 'express';
import { FlightController } from '../controllers/flight.controller';

const controller = new FlightController();
export const FlightRouter: express.Router = express.Router();

// Users HTTP Requests
FlightRouter.get('/', controller.getFlightDetails);