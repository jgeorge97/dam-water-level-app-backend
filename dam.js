const express = require('express');
const router = express.Router();
var pdf_table_extractor = require("pdf-table-extractor");
const https = require("https");
const fs = require('fs')
const cors = require('cors')

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
}).catch(err => console.error(err));

// Remove unwanted characters from the text
function clean_text(text) {
  return text
    .replace("\n", " ") // replace new lines with spaces
    .replace(/\(/g, " (") // Add space before (
    .replace(/\s+/g, ' ') // replace multiple spaces with single space
    .trim(); // trim spaces
}

// Split string into malayalam and english parts
function split_ml_en(text) {
  const ml_regex = /\({0,1}[^\x00-\x7F]+\){0,1}/g;
  var ml = [], en = [];
  for (const word of text.split(" ")) {
    if (ml_regex.test(word)) {
      ml.push(word);
    } else {
      en.push(word);
    }
  }
  return {
    ml: ml.join(' '),
    en: en.join(' '),
    raw: text
  }
}

// Extract last updated time from the pdf
function extract_lastupdated(table) {
  const table_title = table[0][0];
  const last_updated_matches = table_title.match(/\d{1,2}\/\d{1,2}\/\d{2,4},\s?\d{2}(?:[\.|:]\d{2})?\s?[A|P]M/);
  if (last_updated_matches.length == 1) {
    return last_updated_matches[0];
  }
  return '';
}

// Calculate storage usage if not present
function calculate_storage_percentage(dam) {
  if (dam[10] === '' || dam[10] === '_') {
    if(dam[8] !== 'N/A' && dam[9] !== '-' && dam[9] !== '_')
      return ((dam[9] / dam[8]) * 100).toFixed(2);
    else
      return null
  }
  return dam[10];
}

// Handle errors
function on_error(res, err) {
  res.status(200).json({
    error: true,
    message: err
  });
}

router.use(cors())

router.get('/getData', (req, res, next) => {

  const success = (result) => {
    const damData = []

    try {
      for (const page of result.pageTables) {
        for (const dam of page.tables) {
          // If first column is a number, then it is a dam
          if (dam[0] != '' && !isNaN(dam[0])) {
            damData.push({
              slNo: clean_text(dam[0]),
              name: split_ml_en(clean_text(dam[1])),
              district: split_ml_en(clean_text(dam[2])),
              maxWaterLevel: clean_text(dam[3]),
              currentWaterLevel: clean_text(dam[4]),
              currentDayMaxWaterLevel: clean_text(dam[5]),
              percentStorage: clean_text(dam[11]),
              spillAmount: clean_text(dam[12]),
              remarks: clean_text(dam[13])
            })
          }
        }
      }

      res.status(200).json({
        message: damData,
        error: false,
        last_updated: extract_lastupdated(result.pageTables[0].tables)
      });
    } catch (error) {
      on_error(res, error);
    }
  }

  download(process.env.DAM_WATER_LEVEL_FILE_LOCATION, "kseb_dam.pdf").then((value) => {
    pdf_table_extractor("kseb_dam.pdf", success, (error) => on_error(res, error));
  }, (error) => on_error(res, error));
});

router.get('/getIrrigationData', (req, res, next) => {

  const success = (result) => {
    const damData = []

    try {
      for (const page of result.pageTables) {
        for (const dam of page.tables) {
          // If first column is a number, then it is a dam
          if (dam[0] != '' && !isNaN(dam[0])) {
            let storagePercentage = calculate_storage_percentage(dam);
            damData.push({
              slNo: clean_text(dam[0]),
              name: split_ml_en(clean_text(dam[1])),
              district: split_ml_en(clean_text(dam[2])),
              maxWaterLevel: clean_text(dam[3]),
              currentWaterLevel: clean_text(dam[4]),
              blueAlertLevel: clean_text(dam[5]),
              orangeAlertLevel: clean_text(dam[6]),
              redAlertLevel: clean_text(dam[7]),
              spillAmount: clean_text(dam[11]),
              remarks: clean_text(dam[12]),
              percentStorage: storagePercentage
            })
          }
        }
      }

      res.status(200).json({
        message: damData,
        error: false,
        last_updated: extract_lastupdated(result.pageTables[0].tables)
      });
    } catch (error) {
      on_error(res, error);
    }
  }

  download(process.env.IRRIGATION_DAM_WATER_LEVEL_FILE_LOCATION, "irrigation_dam.pdf").then((value) => {
    pdf_table_extractor("irrigation_dam.pdf", success, (error) => on_error(res, error));
  }, (error) => on_error(res, error));
});

module.exports = router