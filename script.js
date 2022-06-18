const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal');

// Search meal and fetch from API
function searchMeal(e){
    // since this is a 'submit' we need to prevent the default behaviour (not trying to submitting to a file)
    e.preventDefault();
    // fetch('www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata')

    // Clear Single meal when we search again
    single_mealEl.innerHTML = '';

    // Get what the user searched
    const term = search.value;

    // Check for empty
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            resultHeading.innerHTML = `<h2>Search results for "${term}": </h2>`;

            if(data.meals == null) {
                resultHeading.innerHTML = "<p>Meal not found. Please try again!</p>"
                mealsEl.innerHTML = '';
            }
            else{
                mealsEl.innerHTML = data.meals.map(meal => `
                <div class="meal">
                    <img src="${meal.strMealThumb}">
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
                `)
                .join('') // Convert to string
            }
        });

        // Clear search Text
        search.value = "";
    }
    else{
        alert("Please enter a search term");
    }
}

// Fetch meal by ID
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        addMealToDOM(meal);
    });
}

// Random Meal
function getRandomMeal(){
    // Clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        const meal = data.meals[0];
        addMealToDOM(meal);
    });
}

function addMealToDOM(meal){
    const ingredients = [];

    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
        else{
            break;
        }

    }
    single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}">
            <div class="single-meal-info">
                ${meal.strCategory ? `<h3>Category: ${meal.strCategory}</h3>` : ''}
                ${meal.strArea ? `<h3>Region/Area: ${meal.strArea}</h3>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if(item.classList){
            return item.classList.contains('meal-info');
        }
        else{
            return false;
        }
    });

    if(mealInfo){
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
})