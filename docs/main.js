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
            images: []
        }
    },
    created() {
        this.fetchPerks();
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
        getPerksInPage() {
            const page = this.selectedPage - 1;
            const startIndex = page * 15;
            const perks = this.getPerksSelected.slice(startIndex, startIndex + 15);

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
                console.log(image.src)
                this.images.push(image);
            }
        }
    },
}
Vue.createApp(v).mount('#v');