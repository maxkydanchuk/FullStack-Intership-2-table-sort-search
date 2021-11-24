let dataCopy = [];


const getResource = async function (url) {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status ${res.status}`);
    }
    return await res.json();
};

const template = document.createElement('template');
template.innerHTML = `
    <div class="table__row">
        <slot class="table__row_year" name="item__year">Year</slot>
        <slot class="table__row_category" name="item__category">category</slot>
        <slot class="table__row_firstname" name="item__firstname">firstname</slot>
        <slot class="table__row_lastname" name="item__surname">lastname</slot>
        <slot class="table__row_fullname" name="item__fullname">fullname</slot>
    </div>
`


class NobelPrize extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(template.content.cloneNode(true));
        getResource('http://api.nobelprize.org/v1/prize.json')
            .then((data) => {
                dataCopy = data.prizes;
                dataCopy.forEach(({ year, category, laureates }) => {
                    if (laureates) {
                        laureates.forEach(({ firstname, surname }) => {
                            if (surname === undefined) {
                                surname = '';
                            }
                            if (firstname === undefined) {
                                firstname = '';
                            }

                            const content = template.content.cloneNode(true);
                            content.querySelector('slot[name="item__year"]').innerHTML = year;
                            content.querySelector('slot[name="item__category"]').innerHTML = category;
                            content.querySelector('slot[name="item__firstname"]').innerHTML = firstname;
                            content.querySelector('slot[name="item__surname"]').innerHTML = surname;
                            content.querySelector('slot[name="item__fullname"]').innerHTML = firstname + ' ' + surname;
                            shadowRoot.appendChild(content);
                        })
                    }
                })
            });
    }
}

customElements.define('nobel-prize', NobelPrize)


