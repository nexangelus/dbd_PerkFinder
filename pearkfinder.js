//using axios load json from file

var data = null
var perksSuvivors = []
var perksKiller = []

await axios.get('pearks.json')
    .then(res => {
        data = res.data
    })
    .catch(err => console.log(err));

for (const key in data) {
    const element = data[key];
        if(element.role == "survivor"){
            perksSuvivors.push(element)
        }else if(element.role == "killer"){
            perksKiller.push(element)
        }
}

//order by perk name
perksSuvivors.sort((a, b) => (a.name > b.name) ? 1 : -1)
perksKiller.sort((a, b) => (a.name > b.name) ? 1 : -1)

let numberOfPerksSuvivor = perksSuvivors.length
let numberOfPerksKiller = perksKiller.length
//



//find peark by name
function findPerkByName(name){
    let perk = null
    let page = 0
    let posicao = 0
    for (const key in data) {
        const element = data[key];
        if(element.name.toLowerCase().includes(name.toLowerCase())){
            perk = element
            //get perk number
            if(element.role == "survivor"){
                perk.number = perksSuvivors.indexOf(element) + 1
            }else if(element.role == "killer"){
                perk.number = perksKiller.indexOf(element) + 1
            }
            page = perk.number/15
            posicao = perk.number%15
            page = Math.ceil(page)
            perk.page = page
            perk.posicao = posicao
            console.log(perk)
            return perk
        }
    }
    
}
console.log(findPerkByName("Vigil"))
//listenner on change

const input = document.querySelector("input");
const page = document.getElementById("page");
const name = document.getElementById("name");
const position = document.getElementById("position");
input.addEventListener("input", updateValue);
function updateValue(e) {
    let response = findPerkByName(e.target.value)
    name.textContent = "Name: " + response.name.toString()
    page.textContent = "Page: " + response.page.toString()
    position.textContent = "Position: " + response.posicao.toString()
}