const axios = require('axios');
const fs = require('fs');

const PERKS_API_URL = "https://dbd.tricky.lol/api/perks";
const PERKS_IMAGES_URL = "https://dbd.tricky.lol/dbdassets/perks/";

const PERKS_FILE_LOCATION = "../public/data/perks.json";
const PERKS_IMAGES_LOCATION = "../public/assets/img/perks/";



async function updatePerks() {
    let result = await axios.get(PERKS_API_URL);
    const perks = { survivor: [], killer: [] };
    const perksSorted = Object.values(result.data).sort((a, b) => (a.name > b.name) ? 1 : -1);

    let survivorIndex = 1, killerIndex = 1;
    for (const element of perksSorted) {
        const imageUrl = element.image.split("/").pop();

        if (element.role == "survivor") {
            perks.survivor.push({ name: element.name, image: imageUrl });
        } else if (element.role == "killer") {
            perks.killer.push({ name: element.name, image: imageUrl });
        }
    }
    let parsed = JSON.stringify(perks, null, 4).replace(/&nbsp;/, " ");

    //console.log(result.data);
    fs.writeFileSync(PERKS_FILE_LOCATION, parsed);
    //downloadPerkImages();
}

// const headersDownloadImages = {
//     'authority': 'dbd.tricky.lol',
//     'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
//     'accept-language': 'en-GB,en;q=0.9,pt-PT;q=0.8,pt;q=0.7,en-US;q=0.6',
//     'cache-control': 'no-cache',
//     'pragma': 'no-cache',
//     'referer': 'https://dbd.tricky.lol/perks',
//     'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
//     'sec-ch-ua-mobile': '?0',
//     'sec-ch-ua-platform': '"Windows"',
//     'sec-fetch-dest': 'document',
//     'sec-fetch-mode': 'navigate',
//     'sec-fetch-site': 'same-origin',
//     'sec-fetch-user': '?1',
//     'upgrade-insecure-requests': '1',
//     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
// }

// async function downloadPerkImages() {
//     const perks = JSON.parse(fs.readFileSync(PERKS_FILE_LOCATION));
//     for (const perkName in perks) {
//         const perk = perks[perkName];

//         const imageUrl = perk.image;

//         //Check if file exists
//         let exits = fs.existsSync(PERKS_IMAGES_LOCATION + imageUrl, (err) => {
//             if (err) {
//                 console.log(err);
//                 return;
//             }
//         });
//         if (exits) {
//             continue;
//         }

//         //
//         //Download image
//         const res = await axios.get(`${PERKS_IMAGES_URL}${imageUrl}`, { responseType: 'arraybuffer', headers: headersDownloadImages });
//         //console.log(res);



//         fs.writeFileSync(PERKS_IMAGES_LOCATION + imageUrl, res.data);

//         //console.log(imageUrl);
//     }
}

updatePerks();



