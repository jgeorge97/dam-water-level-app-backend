# DAM WATER LEVEL APP BACKEND

[Telegram Group](https://t.me/dam_level_app_community)

[Matrix Room](https://matrix.to/#/#dam-water-level-app-discussions:matrix.org)

Backend to fetch water level data of Dams in Kerala & Tamil Nadu from [KSDMA](https://sdma.kerala.gov.in/dam-water-level/) & [AGRISNET](https://www.tnagrisnet.tn.gov.in/).

Since the data in KSDMA is uploaded as a pdf without a uniform naming convention of the file, currently the the URL of the pdf file is passed directly to the enviroment file. If anyone has better idea please raise an issue & we can discuss it.

## Enviroment Variables
Variable | Description
---------|------------
KERALA_DAM_WATER_LEVEL_PDF_URI | Webpage where URLs of the KSEB dam data PDFs are hyperlinked. (file obtained from KSDMA site (https only)
TN_DATA_URL | URL of TN dams data, from AGRISNET

## API Routes
Route | Description
------|------------
/dam/getData| Returns a JSON containing the status of the KSEB dams
/dam/getIrrigationData | Returns a JSON containing the status of the Irrigation dams
/dam/getTNDamData | Returns a JSON containing the status of dams in Tamil Nadu

## To-do
- [x] A HTML crawler to fetch the URL's of the PDF files automatically
- [x] A efficient way to extract entire date & time from the PDF
- [ ] Logic to calculate alert level of the dam
- [ ] Find a better way to get the data preferrably a spreadsheet
- [ ] Fix Malayalam typo
- [ ] Reduce processing time.
