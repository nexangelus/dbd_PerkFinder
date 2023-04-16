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
            choicesElement: null,
            images: [],
            perksOwned: [],
            showModal: false,
            survivorPerksNotOwned: [],
            killerPerksNotOwned: [],
        }
    },
    created() {
        this.fetchPerks();
        this.showLocalStorageContent();
    },
    mount() {
    },    
    computed: {
        pageLimit() {
            const perksCount = this.getPerksSelected.length;
            return Math.ceil(perksCount / 15);
        },
        getPerksSelected() {
            if (this.optionSelected === "Killer") {
                return this.killerPerks.filter(e => !this.killerPerksNotOwned.includes(e.name));
            } else {
                return this.survivorPerks.filter(e => !this.survivorPerksNotOwned.includes(e.name));
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
        },
        getPerksSelected: function (val) {
            if (!this.choicesElement) {
                this.choicesElement = new Choices("#choices-perks", { searchPlaceholderValue: 'Search for a perk', itemSelectText: '' })
            }
            this.choicesElement.clearStore();

            this.choicesElement.setChoices(val.map(e => { return { label: e.name, value: e.name } }));

        },
    },
    methods: {
        fetchPerks() {
            axios.get('data/perks.json').then(res => {
                this.perks = res.data;

                this.survivorPerks = res.data.survivor;
                this.killerPerks = res.data.killer;

                this.preloadImage([...res.data.survivor, ...res.data.killer]);
            }).catch(err => console.log(err));
            
        },
        setOptionSelected(optionSelected) {
            this.optionSelected = optionSelected;
            this.selectedPage = 1;
        },
        getPerks() {
            if (this.optionSelected === "Killer") {
                return this.killerPerks;
            }
            return this.survivorPerks
        },
        getPerksInPage() {
            const page = this.selectedPage - 1;
            const startIndex = page * 15;
            const perks = this.getPerksSelected.slice(startIndex, startIndex + 15);
            if (perks.length < 15) {
                for (; perks.length < 15;) {
                    perks.push({ "name": "__", "image": "base_empty.png" })
                }
            }
            return this.chunkArray(perks, 5);
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
        preloadImage(perks) {
            for (const perk of perks) {
                const image = new Image();
                image.src = 'assets/img/perks/' + perk.image;
            }
        },
        showLocalStorageContent() {
            
            const localSurvivorPerksNotOwned = localStorage.getItem('survivorPerksNotOwned');
            if (localSurvivorPerksNotOwned) {
                this.survivorPerksNotOwned = localSurvivorPerksNotOwned.split(',');
            }
            else {
                localStorage.setItem('survivorPerksNotOwned', this.survivorPerksNotOwned);
            }
            const localKillerPerks = localStorage.getItem('killerPerksNotOwned');
            if (localKillerPerks) {
                this.killerPerksNotOwned = localKillerPerks.split(',');
            }
            else {
                localStorage.setItem('killerPerksNotOwned', this.killerPerksNotOwned);
            }

        },
        storePerk(perkName) {
            if(this.optionSelected === "Survivor") {
                if(this.survivorPerksNotOwned.includes(perkName)) {
                    const index = this.survivorPerksNotOwned.indexOf(perkName);
                    this.survivorPerksNotOwned.splice(index, 1)
                }
                else {
                    this.survivorPerksNotOwned.push(perkName);
                }
            }
            else {
                if(this.killerPerksNotOwned.includes(perkName)) {
                    const index = this.killerPerksNotOwned.indexOf(perkName);
                    this.killerPerksNotOwned.splice(index, 1)
                }
                else {
                    this.killerPerksNotOwned.push(perkName);
                }
            }
            localStorage.setItem('survivorPerksNotOwned', this.survivorPerksNotOwned);
            localStorage.setItem('killerPerksNotOwned', this.killerPerksNotOwned);
        },
        openModalExample() {
            this.$vfm.show('example')
        },
        selectAllPerks() {
            if(this.optionSelected === "Survivor") {
                this.survivorPerksNotOwned = [];
                localStorage.setItem('survivorPerksNotOwned', this.survivorPerksNotOwned);
            }else {
                this.killerPerksNotOwned = [];
                localStorage.setItem('killerPerksNotOwned', this.killerPerksNotOwned);
            }    
        }
    },
}

// register modal component
/*Vue.component("modal", {
    template: "#modal-template"
  });*/

const app = Vue.createApp(v)
    .mount('#v');

