const express = require('express');
const router = express.Router();
var pdf_table_extractor = require("pdf-table-extractor");
const https = require("https");
const fs = require('fs')

const url = process.env.DAM_WATER_LEVEL_FILE_LOCATION

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
        remarks: result.pageTables[0].tables[index][13]
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

  // Function to download file
  const download = () => new Promise((resolve, reject) => {
    https.get(process.env.DAM_WATER_LEVEL_FILE_LOCATION, response => {
        const statusCode = response.statusCode;
    
        if (statusCode !== 200) {
            return reject('Download error!');
        }
    
        const writeStream = fs.createWriteStream("file.pdf");
        response.pipe(writeStream);
    
        writeStream.on('error', () => reject('Error writing to file!'));
        writeStream.on('finish', () => writeStream.close(resolve));
    });
  })
  .catch(err => console.error(err));

  download().then(
    function(value) {
      pdf_table_extractor("file.pdf", success, error);
    },
    function(error) {
      console.error(error);
    }
  )
});

module.exports = router