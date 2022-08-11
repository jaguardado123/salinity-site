var express = require('express');
const fs = require("fs");
var router = express.Router();
var mysql = require( 'mysql' );
const csvWriter = require( 'csv-writer' ).createObjectCsvWriter;

let timestamp = Date.now();
var filename = timestamp.toString() + '.csv';

const csv = csvWriter({
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
        {id: 'c789_tds', title: 'C789: Total Dissolved Solids'}
    ]
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home');
});

router.post('/api/riogranderiver', function(req, res, next) {
    if ( req.header('key') != 'password' ) {
        res.send({
            'status': 'error',
            'error': 'Invalid key.'
        });
    }
    else {
        // Connect to our database
        var con = mysql.createConnection({
            host: "localhost",
            user: "salty",
            password: "Salty#2022!",
            database: "tceq"
        })
        con.connect(function(err) {
            if (err) {
                res.send({
                    "status": "error",
                    "error": err
                })
            }
            else {
                // Get user params
                var start = req.query.start;
                var end = req.query.end;

                console.log(start)
                // Query from database
                con.query(
                    "SELECT c736.datetime, c736_swt, c736_spc, c736_tds, " + 
                    "c767_swt, c767_spc, c767_tds, " +
                    "c789_swt, c789_spc, c789_tds, " + 
                    "c791_swt, c791_spc, c791_tds, " +
                    "c792_swt, c792_spc, c792_tds, " +
                    "c793_swt, c793_spc, c793_tds, " +
                    "c796_swt, c796_spc, c796_tds " +
                    "FROM c736, c767, c789, c791, c792, c793, c796 WHERE " +
                    "c736.datetime = c767.datetime AND " +
                    "c736.datetime = c789.datetime AND " +
                    "c736.datetime = c791.datetime AND " + 
                    "c736.datetime = c792.datetime AND " +
                    "c736.datetime = c793.datetime AND " +
                    "c736.datetime = c796.datetime AND " +
                    "c736.DATETIME BETWEEN '" + start + "' AND '" + end + "'", function(err, result, fields) {
                    if(err) {
                        res.send({
                            'status': "error",
                            "error": err
                        })
                    }
                    else {
                        res.send({
                            'status': 'success',
                            'result': 'http:129.113.4.143/riogranderiver/' + filename
                        })
                        csv
                        .writeRecords(result)
                        .then(() => console.log('CSV file successfully created.'));
                    }
                })
            }
        })
    }
});

router.get('/api/help', function(req, res, next) {

    // Get yesterday's date since webscraper is a day behind
    let ts = Date.now();
    let date_time = new Date(ts);
    let day = ("0" + (date_time.getDate() - 1)).slice(-2);
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();

    // Send user info about REST API
    res.send({
        "about": "Salinity API provides hourly water quality data for 7 TCEQ stations from 2019 - present.",
        "available_dates": {
            "start": "2019-01-01",
            "end": year + "-" + month + "-" + day
        } 
    })
});

module.exports = router;
