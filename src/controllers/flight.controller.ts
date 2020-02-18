import express from 'express';
import axios from "axios";
import airportList from '../utilities/airports.json';

const baseURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com`;

export class FlightController {

    public getFlightDetails = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { fromLocation, toLocation, date } = req.query;
        try {
            const response: any = await this.getData(fromLocation,toLocation, date)
            const json = response.data;
            res.send(json);
        } catch (error) {
            res.send (error);
        }


    }

    public findAirportName = (pointA: string, pointB: string) => {
        let fromLocation: string = pointA.toLowerCase();
        let toLocation: string = pointB.toLowerCase();
        let fromLocationChar: string | null = null;
        let toLocationChar: string | null = null;

        airportList.forEach((airportObject) => {
            if(airportObject.city.toLowerCase() === fromLocation) {
                fromLocationChar = airportObject.code;
            }
            if(airportObject.city.toLowerCase() === toLocation) {
                toLocationChar = airportObject.code;
            }
        });

        console.log("fromLocationChar", fromLocationChar)
        console.log("toLocationChar", toLocationChar)

        return [fromLocationChar, toLocationChar]
    }
    public getData = async(fromLocation, toLocation, date) => { 
        let dateToArray = date.split("T");
        let parsedDate = dateToArray[0];

        const airportCodes: any = this.findAirportName(fromLocation, toLocation);

        const fromLocationCode = airportCodes[0];
        const toLocationCode = airportCodes[1];

        let path = `${baseURL}/apiservices/browsequotes/v1.0/US/USD/en-US/${fromLocationCode}-sky/${toLocationCode}-sky/${parsedDate}?inboundpartialdate=${parsedDate}`

        console.log(path)
        const options: any = {
            "method":"GET",
            "url": path,
            "headers":{
                "content-type":"application/octet-stream",
                "x-rapidapi-host":"skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                "x-rapidapi-key":"YOUR_API_KEY"
            },"params":{
                "inboundpartialdate":"2019-12-01"
            }
        }
        const response = await axios(options);
        
        try {
            return response;
        } catch(error) {
            console.log(error);
        }
    };
}
