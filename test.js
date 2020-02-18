'use strict';
 
var https = require ('https');
var http = require('http');

const functions = require('firebase-functions');
const DialogFlowApp = require('actions-on-google').DialogFlowApp;
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    console.log('Request Headers: ' + JSON.stringify(request.headers));
    console.log('Request Body: ' + JSON.stringify(request.body));
    
    let action = request.body.queryResult.action;
    
    console.log(action);
    response.setHeader('Content-Type','application/json');
    
    if (action != 'input.getFlightDetails'){
            console.log('Inside input function');
            response.send(buildChatResponse("I'm sorry, I don't know this"));
            return;
    }

    const parameters = request.body.queryResult.parameters;

    var fromLocation = parameters.destination;
    var toLocation = parameters.destination1;
    var date = parameters.date;

    console.log('fromLocation: ', fromLocation);
    console.log('toLocation: ', toLocation);
    console.log('date: ', date);

    getFlightDetails(fromLocation, toLocation, date);

});


function getFlightDetails(fromLocation, toLocation, date) {
    console.log('From Location: ', fromLocation);
    console.log('To Location: ', toLocation);
    console.log('Date: ', date);

    var res = date.split("T");
    var parsedDate = res[0];

    // var path = `/apiservices/browsequotes/v1.0/US/USD/en-US/${fromLocation}/${toLocation}/${parsedDate}?inboundpartialdate=${parsedDate}`

    // console.log('path', path);

    const options = {
        "method": "GET",
        "hostname": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        "port": null,
        "path": "/apiservices/browsequotes/v1.0/US/USD/en-US/SFO-sky/JFK-sky/2019-12-01?inboundpartialdate=2019-12-01",
        "headers": {
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "x-rapidapi-key": "11ce42bd85mshfa6e4460c8d610ap1e58fdjsn33504d0d90db"
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });
    
    req.end();
}

















function getStockPrice (companyName, priceType, date, CloudFnResponse) {

	console.log('In Function Get Stock Price');

	console.log("company name: " + companyName);
	console.log("price type: " + priceType);
	console.log("Date: " + date);


	var tickerMap = {
		"apple" : "AAPL",
		"microsoft" : "MSFT",
		"ibm" : "IBM",
		"google" : "GOOG",
		"facebook" : "FB",
		"snapchat" : "SNAP"
	};
	var priceMap = {
		"opening" : "open_price",
		"closing" : "close_price",
		"maximum" : "high_price",
		"high" : "high_price",
		"low" : "low_price",
		"minimum" : "low_price"
	};

	var stockTicker = tickerMap[companyName.toLowerCase()];
	var priceTypeCode = priceMap[priceType.toLowerCase()];
	console.log ('pricetypecode' + priceTypeCode);

	var pathString = "/historical_data?ticker=" + stockTicker + "&item=" + priceTypeCode +
	"&start_date=" + date +
	"&end_date=" + date;

	console.log ('path string:' + pathString);

	var username = "05b85e91bd9a4404f8922e3c1a2e32f0";
	var password = "60809e581fc0ac3d31316c8fc37a0368";

	var auth = "Basic " + new Buffer(username +":" + password).toString('base64');

	var request = https.get({
		host: "api.intrinio.com",
		path: pathString,
		headers: {
			"Authorization": auth
		}
	}, function (response) {
		var json = "";
		response.on('data', function(chunk) {
			console.log("received JSON response: " + chunk);
			json += chunk;

			
		});

		response.on('end', function(){
			var jsonData = JSON.parse(json);
			var stockPrice = jsonData.data[0].value;

			console.log ("the stock price received is:" + stockPrice);

			var chat = "The" + priceType + " price for " + companyName + 
			" on "  + date + " was " + stockPrice;

			CloudFnResponse.send(buildChatResponse(chat));

		});

});

}

function buildChatResponse(chat) {
	return JSON.stringify({"fulfillmentText": chat});
}