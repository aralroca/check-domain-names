/**
 * @author Aral Roca Gomez
 */
const request = require('request');
const async = require("async");
const fs = require('fs');

/**
 * List of names (names.json FILE)
 */
const names = JSON.parse(fs.readFileSync('./names.json', 'utf8'));

const domain = process.argv[2] || 'com'; // Default is .com

const checkDomain = (name, cb) => {
    request.get(`https://uk.godaddy.com/domainsapi/v1/search/exact?q=${name}.${domain}&key=dlp_offer_com&pc=5012015&ptl=1`,
        function (err, res) {
            if(err) return cb(err);
            const body = JSON.parse(res.body);

            if(body.ExactMatchDomain.IsAvailable) {
                console.log('\x1b[32m', body.ExactMatchDomain.Fqdn, 'YES :D !', '\x1b[0m');
            } else {
                console.log('\x1b[31m', body.ExactMatchDomain.Fqdn, 'NOT :(', '\x1b[0m');
            }
            cb();
        });
};

async.mapLimit(names, 10, checkDomain);
