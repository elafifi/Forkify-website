import {elements} from './base';

// Get text input from search text field
export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {

    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })

    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            let len = acc + cur.length
            if (len <= limit) {
                newTitle.push(cur);
            }
            return len;
        }, 0);
        // return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
                <li>
                    <a class="results__link" href=#${recipe.recipe_id}>
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${limitRecipeTitle(recipe.title)}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title, 20)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
    `;

    elements.searchResList.insertAdjacentHTML("beforeend", markup);
};


// type: 'prev' or 'next'
const createButton = (page, type) => `

            <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev'? page - 1: page + 1}>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-${type === 'prev'? 'left': 'right'}"></use>
                </svg>
                <span>Page ${type === 'prev'? page - 1: page + 1}</span>
            </button>
`;
const renderButtons = (page, numResults, resPerPage) => {
    const pagesCount = Math.ceil(numResults / resPerPage);
    let buttonHTML;
    if (page === 1 && pagesCount > 1) {
        // Only button go to the next
        buttonHTML = createButton(page, 'next');
    } else if (page < pagesCount) {
        // Both Buttons
        buttonHTML = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
        `
    } else if (page === pagesCount && pagesCount > 1) {
        //Only button to go to prev page
        buttonHTML = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', buttonHTML);
}
export const renderResult = (recipes, page = 1, resPerPage = 10) => {
    
    // render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    
    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons 
    renderButtons(page, recipes.length, resPerPage);
};

 
