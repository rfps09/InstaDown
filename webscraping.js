const puppeteer = require('puppeteer');

async function scrap(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // await page.goto(url, { waitUntil: 'networkidle0' });
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const data = await page.evaluate(() =>  document.documentElement.outerHTML);

        const regImg = /\"url\"\:\"https\:\\\/\\\/scontent([^\"]|[.])*\"?/g;
        const regVideo = /\"contentUrl\"\:\"([^\"]|[.])*\"?/g;
    
        let matImg = data.match(regImg);
        let matVideo = data.match(regVideo);
        let mat;

        if(matImg != null && matVideo != null) {
            mat = matImg.concat(matVideo);
        }
        else if(matImg != null) {
            mat = matImg;
        }
        else {
            mat = matVideo;
        }

        mat.forEach((_,idx) => {
            let tipo = 'imagem';
            let startSubstring = 7;
            const regType = /video/g;
            if(mat[idx].match(regType) != null) {
                tipo = 'video';
                startSubstring = 14;
            }
            
            mat[idx] = mat[idx].substring(startSubstring,mat[idx].length-1);
            mat[idx] = mat[idx].replace(/\\\//g, '/');
            mat[idx] = mat[idx].replace(/\\u0025/g, '%');

            mat[idx] = new Array(mat[idx], tipo);
        })

        await browser.close();

        return mat;
    } catch (err) {
        return err;
    }
}

module.exports.scrap = scrap;