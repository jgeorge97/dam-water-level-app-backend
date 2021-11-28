const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = {
   
    getPDF: async function(){
        var link = [];
        await fetch(process.env.KERALA_DAM_WATER_LEVEL_PDF_URI).then(response => response.text()).then(body => {

            const $ = cheerio.load(body);

            $('div.entry-content ol li').each((i, elem) => {
                var anchorTag = $(elem).children();        
                link.push(`${anchorTag.attr('href')}`);
            });

        });   
         
        return link;    
    }
}
