"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const airports_json_1 = __importDefault(require("../utilities/airports.json"));
const baseURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com`;
class FlightController {
    constructor() {
        this.getFlightDetails = async (req, res, next) => {
            const { fromLocation, toLocation, date } = req.query;
            try {
                const response = await this.getData(fromLocation, toLocation, date);
                const json = response.data;
                res.send(json);
            }
            catch (error) {
                res.send(error);
            }
        };
        this.findAirportName = (pointA, pointB) => {
            let fromLocation = pointA.toLowerCase();
            let toLocation = pointB.toLowerCase();
            let fromLocationChar = null;
            let toLocationChar = null;
            airports_json_1.default.forEach((airportObject) => {
                if (airportObject.city.toLowerCase() === fromLocation) {
                    fromLocationChar = airportObject.code;
                }
                if (airportObject.city.toLowerCase() === toLocation) {
                    toLocationChar = airportObject.code;
                }
            });
            console.log("fromLocationChar", fromLocationChar);
            console.log("toLocationChar", toLocationChar);
            return [fromLocationChar, toLocationChar];
        };
        this.getData = async (fromLocation, toLocation, date) => {
            let dateToArray = date.split("T");
            let parsedDate = dateToArray[0];
            const airportCodes = this.findAirportName(fromLocation, toLocation);
            const fromLocationCode = airportCodes[0];
            const toLocationCode = airportCodes[1];
            let path = `${baseURL}/apiservices/browsequotes/v1.0/US/USD/en-US/${fromLocationCode}-sky/${toLocationCode}-sky/${parsedDate}?inboundpartialdate=${parsedDate}`;
            console.log(path);
            const options = {
                "method": "GET",
                "url": path,
                "headers": {
                    "content-type": "application/octet-stream",
                    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                    "x-rapidapi-key": "11ce42bd85mshfa6e4460c8d610ap1e58fdjsn33504d0d90db"
                }, "params": {
                    "inboundpartialdate": "2019-12-01"
                }
            };
            const response = await axios_1.default(options);
            try {
                return response;
            }
            catch (error) {
                console.log(error);
            }
        };
    }
}
exports.FlightController = FlightController;
//# sourceMappingURL=flight.controller.js.map