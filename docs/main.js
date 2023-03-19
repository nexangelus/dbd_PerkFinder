const v = {
    data() {
        return {
            options: ['Survivor', 'Killer'],
            optionSelected: 'Survivor',
            perkLines: [
                [""], [], []
            ],
            perks: [],
            survivorPerks: [],
            killerPerks: [],
            search: '',
            selectedPage: 1,
            currentFocus: -1,
        }
    },
    created() {
        this.fetchPerks();
    },
    computed: {
        pageLimit() {
            const perksCount = this.getPerksSelected.length;
            return Math.ceil(perksCount / 15);
        },
        getPerksSelected() {
            if (this.optionSelected === "Killer") {
                return this.killerPerks;
            } else {
                return this.survivorPerks;
            }
        },
    },
    watch: {
        search: function (val) {
            const index = this.getPerksSelected.findIndex(e => e.name === val)
            if (index >= 0) {
                let page = Math.ceil(index / 15);
                if (index % 15 === 0) {
                    page++;
                }
                this.selectedPage = page;
            }
        }
    },
    methods: {
        fetchPerks() {
            axios.get('data/perks.json').then(res => {
                this.perks = res.data;

                /*let survivorPerks = [], killerPerks = [];

                for (const key in res.data) {
                    const element = res.data[key];
                    if (element.role == "survivor") {
                        survivorPerks.push(element)
                    } else if (element.role == "killer") {
                        killerPerks.push(element)
                    }
                }
                console.log(survivorPerks);
                //order by perk name
                survivorPerks.sort((a, b) => (a.name > b.name) ? 1 : -1)
                killerPerks.sort((a, b) => (a.name > b.name) ? 1 : -1)*/

                this.survivorPerks = this.perks.survivor;
                this.killerPerks = this.perks.killer;
            }).catch(err => console.log(err));
        },
        setOptionSelected(optionSelected) {
            this.optionSelected = optionSelected;
        },
        getPerksInPage() {
            const page = this.selectedPage - 1;
            const startIndex = page * 15;
            const perks = this.getPerksSelected.slice(startIndex, startIndex + 15);

            return this.chunkArray(perks, 5);
        },
        selectPerk(name) {
            this.search = name;
            search.value = name;
            perksOptions.style.display = 'none';
            search.style.borderRadius = "5px";

            const text = name.toUpperCase();

            for (let option of perksOptions.options) {
                if (option.value.toUpperCase() === text) {
                    option.style.display = "block";
                } else {
                    option.style.display = "none";
                }
            };
        },
        chunkArray(inputArray, perChunk) {
            const result = inputArray.reduce((resultArray, item, index) => {
                const chunkIndex = Math.floor(index / perChunk)

                if (!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = [] // start a new chunk
                }

                resultArray[chunkIndex].push(item)

                return resultArray
            }, [])

            return result;
        },
        searchInput() {
            var text = search.value.toUpperCase();
            for (let option of perksOptions.options) {
                if (option.value.toUpperCase().indexOf(text) > -1) {
                    option.style.display = "block";
                } else {
                    option.style.display = "none";
                }
            }
        }
    },
}
Vue.createApp(v).mount('#v');

search.onfocus = function () {
    perksOptions.style.display = 'block';
    search.style.borderRadius = "5px 5px 0 0";
};


search.onblur = function (e) {
    perksOptions.style.display = "none";
    search.style.borderRadius = "5px";
};


var currentFocus = -1;
search.onkeydown = function (e) {
    if (e.keyCode == 40) {
        currentFocus++
        addActive(perksOptions.options);
    }
    else if (e.keyCode == 38) {
        currentFocus--
        addActive(perksOptions.options);
    }
    else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
            if (perksOptions.options)
                perksOptions.options[currentFocus].click();
        }
    }
}

function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0)
        currentFocus = (x.length - 1);
    x[currentFocus].classList.add("active");
}
function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }
}

