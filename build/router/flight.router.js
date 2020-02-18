"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const flight_controller_1 = require("../controllers/flight.controller");
const controller = new flight_controller_1.FlightController();
exports.FlightRouter = express_1.default.Router();
// Users HTTP Requests
exports.FlightRouter.get('/', controller.getFlightDetails);
//# sourceMappingURL=flight.router.js.map