const express = require('express');
const router = express.Router();
var pdf_table_extractor = require("pdf-table-extractor");
const https = require("https");
const fs = require('fs')
const cors = require('cors')

router.use(cors())

router.get('/getData', (req, res, next) => {
  
  const success = (result) => {
    const damData = []
    for (let index = 4; index <= 20; index++) {
      damData.push({
        slNo: result.pageTables[0].tables[index][0],
        name: result.pageTables[0].tables[index][1],
        currentWaterLevel: result.pageTables[0].tables[index][4],
        currentDayMaxWaterLevel: result.pageTables[0].tables[index][5],
        maxWaterLevel: result.pageTables[0].tables[index][3],
        remarks: result.pageTables[0].tables[index][13],
        percentStorage: result.pageTables[0].tables[index][11],
        spillAmount: result.pageTables[0].tables[index][12]
      })
    }

    var last_updated = "";
    const last_updated_string_array = result.pageTables[0].tables[0][0].split("")
    for (let index = 87; index <= 103; index++) {
      last_updated = last_updated + last_updated_string_array[index]
    }
    
    res.status(200).json({
      message: damData,
      error: false,
      last_updated: last_updated
    });
  }

  const error = (err) => {
    res.status(200).json({
      error: true,
      message: err
    })
  }


  download(process.env.DAM_WATER_LEVEL_FILE_LOCATION, "kseb_dam.pdf").then(
    function(value) {
      pdf_table_extractor("kseb_dam.pdf", success, error);
    },
    function(error) {
      console.error(error);
    }
  )
});

router.get('/getIrrigationData', (req, res, next) => {

  const success = (result) => {
    const damData = []
    for (let index = 4; index <= 23; index++) {
      damData.push({
        slNo: result.pageTables[0].tables[index][0],
        name: result.pageTables[0].tables[index][1],
        district: result.pageTables[0].tables[index][2],
        currentWaterLevel: result.pageTables[0].tables[index][4],
        maxWaterLevel: result.pageTables[0].tables[index][3],
        remarks: result.pageTables[0].tables[index][12],
        blueAlertLevel: result.pageTables[0].tables[index][5],
        orangeAlertLevel: result.pageTables[0].tables[index][6],
        redAlertLevel: result.pageTables[0].tables[index][7],
        percentStorage: result.pageTables[0].tables[index][10],
        spillAmount: result.pageTables[0].tables[index][11]
      })
    }

    var last_updated = "";
    const last_updated_string_array = result.pageTables[0].tables[0][0].split("")
    for (let index = 68; index <= 88; index++) {
      last_updated = last_updated + last_updated_string_array[index]
    }
    
    res.status(200).json({
      message: damData,
      error: false,
      last_updated: last_updated
    });
  }

  const error = (err) => {
    res.status(200).json({
      error: true,
      message: err
    })
  }


  download(process.env.IRRIGATION_DAM_WATER_LEVEL_FILE_LOCATION, "irrigation_dam.pdf").then(
    function(value) {
      pdf_table_extractor("irrigation_dam.pdf", success, error);
    },
    function(error) {
      console.error(error);
    }
  )
});

  // Function to download file
  const download = (url, dest) => new Promise((resolve, reject) => {
    https.get(url, response => {
        const statusCode = response.statusCode;
    
        if (statusCode !== 200) {
            return reject('Download error!');
        }
    
        const writeStream = fs.createWriteStream(dest);
        response.pipe(writeStream);
    
        writeStream.on('error', () => reject('Error writing to file!'));
        writeStream.on('finish', () => writeStream.close(resolve));
    });
  })
  .catch(err => console.error(err));

module.exports = router