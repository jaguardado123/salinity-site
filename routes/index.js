var express = require('express');
const fs = require("fs");
var router = express.Router();
var mysql = require('mysql');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home');
});


// REST API for rio grande river.
router.post('/api/riogranderiver', function(req, res, next) {

    // Verify key
    if ( req.header('key') != 'password') {
        res.send({
            "status": "error",
            "error": "Invalid key."
        })
    }
    else {
        //Connect to our database.
        var con = mysql.createConnection({
            host: "localhost",
            user: "salty",
            password: "Salty#2022!",
            database: "tceq"
        });

        con.connect(function(err) {
            if (err) {
                // Send DB connection error msg to user.
                res.send({
                    "status": "error",
                    "error": err
                });
            }
            else {
                // Get user parameters.
                var start = req.query.start;
                var end = req.query.end;

                // Table names from our database.
                stations = ["c767", "c796", "c791", "c792", "c736", "c793", "c789"];

                // Make our very long query.
                query = "select c767.datetime";
                for (const s of stations) {
                    query += ", " + s + "." + s + "_swt, " + s + "." + s + "_spc, " + s + "." + s + "_tds";
                }
                query += " from c767";
                for (var i = 1; i < stations.length; i++) {
                    query += " inner join " + stations[i] + " on " + stations[i] + ".datetime = c767.datetime";
                }

                // Query dates from database.
                con.query(query + " WHERE c767.datetime > '" + start + "' and c767.datetime <= '" + end + "'", function(err, result, fields) {
                    if (err) {
                        // Send DB query error msg to user.
                        res.send({
                            "status": "error",
                            "error": err
                        });
                    }
                    else {
                        // Generate unique file name.
                        let timestamp = Date.now();
                        var filename = timestamp.toString() + '.csv';

                        // Send file link to user.
                        res.send({
                            "status": "success",
                            "result": "http://129.113.4.143/riogranderiver/" + filename
                        });

                        // Set CSV column id/key.
                        const csvWriter = createCsvWriter({
                            path: './public/riogranderiver/' + filename,
                            header: [
                                {id: 'datetime', title: 'Date'},
                                {id: 'c767_swt', title: 'C767: Surface Water Temperature'},
                                {id: 'c767_spc', title: 'C767: Surface Specific Conductance'},
                                {id: 'c767_tds', title: 'C767: Total Dissolved Solids'},
                                {id: 'c796_swt', title: 'C796: Surface Water Temperature'},
                                {id: 'c796_spc', title: 'C796: Surface Specific Conductance'},
                                {id: 'c796_tds', title: 'C796: Total Dissolved Solids'},
                                {id: 'c791_swt', title: 'C791: Surface Water Temperature'},
                                {id: 'c791_spc', title: 'C791: Surface Specific Conductance'},
                                {id: 'c791_tds', title: 'C791: Total Dissolved Solids'},
                                {id: 'c792_swt', title: 'C792: Surface Water Temperature'},
                                {id: 'c792_spc', title: 'C792: Surface Specific Conductance'},
                                {id: 'c792_tds', title: 'C792: Total Dissolved Solids'},
                                {id: 'c736_swt', title: 'C736: Surface Water Temperature'},
                                {id: 'c736_spc', title: 'C736: Surface Specific Conductance'},
                                {id: 'c736_tds', title: 'C736: Total Dissolved Solids'},
                                {id: 'c793_swt', title: 'C793: Surface Water Temperature'},
                                {id: 'c793_spc', title: 'C793: Surface Specific Conductance'},
                                {id: 'c793_tds', title: 'C793: Total Dissolved Solids'},
                                {id: 'c789_swt', title: 'C789: Surface Water Temperature'},
                                {id: 'c789_spc', title: 'C789: Surface Specific Conductance'},
                                {id: 'c789_tds', title: 'C789: Total Dissolved Solids'},
                            ]
                        });
                        // Write data into CSV file
                        csvWriter.writeRecords(result)
                    }
                });
            }
        });
    }
});

router.get('/api/help', function(req, res, next) {

    // Get yesterday's date, since web scrapper is a day behind.
    let ts = Date.now();
    let date_time = new Date(ts);
    let date = ("0" + (date_time.getDate() - 1)).slice(-2);
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();

    // Send user info about REST API.
    res.send({
        "about": "Salinity API provides hourly water quality data for 7 TCEQ stations from 2019 to the present.",
        "available_dates": {
            "start": "2019-01-01",
            "end": year + "-" + month + "-" + date
        },
        "disclaimer": "Please wait AT LEAST 30 seconds before opening the downloaded csv file to ensure that all data appears as expected."
    });
});

module.exports = router;