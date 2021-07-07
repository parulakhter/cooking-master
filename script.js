const search = document.getElementById('search');
submit = document.getElementById('submit');
mealsEl = document.getElementById('meals');
single_mealEl = document.getElementById('single-meal');

// Search Meal & Fetch from API
function searchMeal(e) {
    e.preventDefault();
    // Clear single meal
    single_mealEl.innerHTML = '';

    // Get search term
    const term = search.value;

    // Check for empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {


                if (data.meals === null) {
                    mealResult.innerHTML = `<p>Sorry we didn't find any meal. Try again!</p>`;

                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
                </div>
                </div>
                `
                    )
                        .join('');
                }
            });
        // Clear Search Text
        search.value = '';
    }
    else {
        alert('Please enter a meal name')
    }
}

// Fetch Meal by ID
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const meal = data.meals[0];

            displayMealDetails(meal);
        });
}

// Display meal details
function displayMealDetails(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
        else {
            break;
        }
    }
    single_mealEl.innerHTML = `
    <div class="single-meal">
    <div><img src="${meal.strMealThumb}" alt="${meal.strMeal}" /></div>
    <div class="text-align">
    <h2>${meal.strMeal}</h2>
    <h4>Ingredients</h4>
    <ul>    
    ${ingredients.map(ing => `<li><i class="fas fa-check-square dark-purple"></i> ${ing}</li>`).join('')}
    </ul>
    </div>
    </div>  
    `
}


// Event Listener
submit.addEventListener('submit', searchMeal);

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        }
        else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealById(mealID)
    }
})