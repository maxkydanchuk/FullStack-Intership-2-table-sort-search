"use strict";
let dataCopy = [];
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
         <span class="table__row_checkbox">
            <input type="checkbox">
        </span>
        <span class="table__header_year">${this.year}</span>
        <span class="table__row_category">${this.category}</span>
        <span class="table__row_firstname">${this.firstname}</span>
        <span class="table__row_lastname">${this.lastname}</span>
        <span class="table__row_fullname">${this.fullname}</span>
        `;
        this.parent.append(element);
    }
}

const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status ${res.status}`);
    }
    return await res.json();
};

getResource("http://api.nobelprize.org/v1/prize.json").then((data) => {
    dataCopy = data.prizes;
    renderData(dataCopy);
});

const yearBtn = document.querySelector(".table__header_year");

yearBtn.addEventListener("click", () => {
    const rowWrapper = document.querySelector(".table__row_wrapper");
    rowWrapper.innerHTML = "";
    console.log(1);
    isAsc = !isAsc;
    const sortedData = quickSort(dataCopy, "year", isAsc);
    renderData(sortedData);
});

function renderData(dataset) {
    dataset.forEach(({ year, category, laureates }) => {
        if (laureates) {
            laureates.forEach(({ firstname, surname }) => {
                if (surname === undefined) {
                    surname = "";
                }
                if (firstname === undefined) {
                    firstname = "";
                }
                new RowCard(
                    year,
                    category,
                    firstname,
                    surname,
                    `${firstname}  ${surname}`,
                    ".table__row_wrapper"
                ).render();
            });
        }
    });
}