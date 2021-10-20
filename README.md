# DAM WATER LEVEL APP BACKEND
Backend to fetch water level data from [KSDMA Site](https://sdma.kerala.gov.in/dam-water-level/) of Dams in Kerala.
Since the data is uploaded as a pdf without a uniform naming convention of the file, currently the the URL of the pdf file is passed directly to the enviroment file. If anyone has better idea please raise an issue & we can discuss it.

## Enviroment Variables
Variable | Description
---------|------------
DAM_WATER_LEVEL_FILE_LOCATION | URL of the KSEB dam data pdf file obtained from KSDMA site (https only)
IRRIGATION_DAM_WATER_LEVEL_FILE_LOCATION | URL of the irrigation dams data pdf file obtained from KSDMA site (https only)
## API Routes
Route | Description
------|------------
/dam/getData| Returns a JSON containing the status of the KSEB dams
/dam/getIrrigationData| Returns a JSON containing the status of the Irrigation dams

## To-do
- [ ] A HTML crawler to fetch the URL's of the PDF files automatically
- [ ] A efficient way to extract entire date & time from the PDF
- [ ] Convert the number strings to numbers
- [ ] Logic to calculate alert level of the dam
- [ ] Find a better way to get the data preferrably a spreadsheet🥲