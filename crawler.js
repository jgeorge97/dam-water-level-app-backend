const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = (providerName) => new Promise((resolve) => {
    fetch('https://sdma.kerala.gov.in/dam-water-level/').then(response => response.text()).then(body => {
        const $ = cheerio.load(body);
        var link = null;
        $('div.entry-content ol li').each((i, elem) => {
            var liTitle = $(elem).text();
            if (liTitle.toLowerCase().includes(providerName.toLowerCase())) {
                var anchorTag = $(elem).children();
                link = `https://sdma.kerala.gov.in${anchorTag.attr('href')}`;
            }
        });
        resolve(link);
    });
});