class RowCard {
    constructor(year, category, firstname, lastname, fullname, parentSelector) {
        this.year = year;
        this.category = category;
        this.firstname = firstname;
        this.lastname = lastname;
        this.fullname = fullname;
        this.parent = document.querySelector(parentSelector);
    }

    render() {
        const element = document.createElement("div");
        element.classList.add("table__row");
        element.innerHTML = `
        <span class="table__header_year">${this.year}</span>
        <span class="table__row_category">${this.category}</span>
        <span class="table__row_firstname">${this.firstname}</span>
        <span class="table__row_lastname">${this.lastname}</span>
        <span class="table__row_fullname">${this.fullname}</span>
        <hr>
        `;
        this.parent.append(element);
    }
}

//
//Adapt data
//

let dataArray = [];

const adaptData = (data) => {
    const {prizes} = data;
    const result = [];

    prizes.forEach((prize) => {
        const {year, category, laureates} = prize;
        if (laureates) {
            laureates.forEach((laureat) => {
                const {firstname, surname} = laureat;
                const fullname = [firstname, surname].filter(Boolean).join(' ');
                result.push({year, category, firstname, surname, fullname});
            })
        }
    })

    return result
}

//
//Fetch Data
//

const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status ${res.status}`);
    }
    return await res.json();
};

getResource("http://api.nobelprize.org/v1/prize.json").then((data) => {
    dataArray = adaptData(data);
    renderData(dataArray);
});


//
//Render data
//


function renderData(dataset) {
    dataset.forEach(({year, category, firstname, surname}) => {
        new RowCard(
            year,
            category,
            firstname || '',
            surname || '',
            `${firstname}  ${surname}`,
            ".table__row_wrapper"
        ).render();
    })
}



//
//Sort
//

const yearBtn = document.querySelector(".table__header_year");
const categoryBtn = document.querySelector('.table__header_category');
const rowWrapper = document.querySelector(".table__row_wrapper");
let isAsc = false;


function quickSort(dataset, property, orderIsAsc) {
    if (dataset.length <= 1) {
        return dataset;
    }

    let middleIndex = Math.floor(dataset.length / 2);
    let middleElement = dataset[middleIndex][property];
    let left = [];
    let right = [];

    for (let i = 0; i < dataset.length; i++) {
        if (i === middleIndex) {
            continue;
        }

        if (orderIsAsc) {
            if (dataset[i][property] < middleElement) {
                left.push(dataset[i]);
            } else {
                right.push(dataset[i]);
            }
        }
        if (!orderIsAsc) {
            if (dataset[i][property] > middleElement) {
                left.push(dataset[i]);
            } else {
                right.push(dataset[i]);
            }
        }
    }
    return [
        ...quickSort(left, property, orderIsAsc),
        dataset[middleIndex],
        ...quickSort(right, property, orderIsAsc)
    ];
}


function sortFunc(param) {
    rowWrapper.innerHTML = "";
    isAsc = !isAsc;
    const sortedData = quickSort(dataArray, param, isAsc);
    renderData(sortedData);
}

yearBtn.addEventListener("click", () => {
    sortFunc('year');
});

categoryBtn.addEventListener('click', () => {
    sortFunc('category');
})

//
//Search
//




function linearSearch(dataset, property, query) {

    // const regex = document.querySelector('.table__header_search').value;
    // const reg = new RegExp(regex, 'g');
    // console.log(reg);


    const searchResult = [];
    for (let i = 0; i < dataset.length; i++) {
        if (dataset[i][property].toLowerCase().includes(query.toLocaleLowerCase())) {
            searchResult.push(dataset[i]);
        }

        // if (dataset[i][property].match(reg)) {
        //     searchResult.push(dataset[i]);
        // }
    }
    return searchResult;
}

function filterData(searchInput) {
    rowWrapper.innerHTML = "";
    const filteredData = linearSearch(dataArray, 'firstname', searchInput);
    renderData(filteredData);
}

const searchBar = document.querySelector('.table__header_search');
searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value;
    filterData(searchString);
});
