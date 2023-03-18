let containerDiv = document.querySelector(".container");
let contentDiv = document.querySelector(".container .content");
let aside = document.querySelector("aside");
let asideBtn = document.querySelector("aside .control .asideBtn");
let asideLinks = Array.from(document.querySelectorAll("aside ul li"));
let loading = document.querySelector(".loadingWrapper");

asideBtn.addEventListener("click", (e) => {
  aside.classList.toggle("active");
  if (e.target.classList.contains("fa-bars")) {
    e.target.classList.replace("fa-bars", "fa-xmark");
    asideLinks.map((link) => {
      link.style.top = "0";
    });
  } else {
    e.target.classList.replace("fa-xmark", "fa-bars");
    asideLinks.map((link) => {
      link.style.top = "300px";
    });
  }
});



asideLinks.map((link) => {
  link.addEventListener("click", (e) => {
    aside.classList.remove("active");
    asideBtn.classList.replace("fa-xmark", "fa-bars");
    asideLinks.map((link) => {
      link.style.top = "300px";
    });
  });
});

function searchHandle() {
  contentDiv.innerHTML = "";
  containerDiv.innerHTML = `
      <div class="form">
        <div class="inp">
            <input type="text" placeholder="Search By Name" class ="searchNameInp"/>
            <span>no meals for this name</span>
        </div>
        <div class="inp">
            <input type="text" placeholder="Search By First Letter" class="searchLetterInp" maxlength="1"/>
            <span>no meals for this letter</span>
        </div>
    </div>
      `;
  let nameSearchInp = document.querySelector(".form .searchNameInp");
  let letterSearchInp = document.querySelector(".form .searchLetterInp");
  nameSearchInp.addEventListener("input", (e) => {
    getMealsBySearch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${nameSearchInp.value}`,
      "name",
      nameSearchInp.value
    );
  });
  letterSearchInp.addEventListener("input", (e) => {
    getMealsBySearch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letterSearchInp.value}`,
      "letter",
      letterSearchInp.value
    );
  });
  containerDiv.appendChild(contentDiv);
}


async function getDefaultMeals() {
  let api = await fetch(
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood"
  );
  let res = await api.json();

  let newRes = [];
  if (res.meals.length > 20) {
    newRes = res.meals.slice(0, 20);
  } else {
    newRes = res.meals;
  }

  displayDefaultMeals(newRes);
}
getDefaultMeals();

async function getMealsBySearch(url, inp, searchValue) {
  let nameSearchInp = document.querySelector(".form .searchNameInp");
  let letterSearchInp = document.querySelector(".form .searchLetterInp");
  try {
    let api = await fetch(url);
    let res = await api.json();
    displayDefaultMeals(res.meals);

    nameSearchInp.nextElementSibling.classList.remove("active");
    letterSearchInp.nextElementSibling.classList.remove("active");
  } catch (error) {

    loading.classList.remove("active");

    if (inp == "name") {
      nameSearchInp.nextElementSibling.classList.add("active");
      nameSearchInp.nextElementSibling.innerHTML = `no meals for ${searchValue}`;
    } else if (inp == "letter") {
      letterSearchInp.nextElementSibling.classList.add("active");
      letterSearchInp.nextElementSibling.innerHTML = `no meals for ${searchValue}`;
    }
  }
}


async function getCategories() {
  let api = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let res = await api.json();
  displayCategories(res.categories);
}


async function getAreas() {
  let api = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  let res = await api.json();
  displayAreas(res.meals);
}


async function getIngredients() {
  let api = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  let res = await api.json();
  let ingreds = res.meals.slice(0, 20);
  displayIngredients(ingreds);
}


async function getSingleMeal(id) {
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let res = await api.json();
  displaySingleMeal(res.meals[0]);
}


async function getMealsCategory(cat) {
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
  );
  let res = await api.json();
  let newarr = res.meals.slice(0, 20);
  displayDefaultMeals(newarr);
}


async function getMealsArea(area) {
  console.log("area");
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let res = await api.json();
  let newarr = res.meals.slice(0, 20);
  displayDefaultMeals(newarr);
}


async function getMealsIngredients(ing) {
  console.log(ing);
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`
  );
  let res = await api.json();
 
  displayDefaultMeals(res.meals);

}

function displayDefaultMeals(meals) {
  loading.classList.add("active");
  let box = "";
  meals.map((meal) => {
    box += `
          <div class="box" data-id="${meal.idMeal}" onclick=(getSingleMeal(${meal.idMeal}))>
            <img src="${meal.strMealThumb}"/>
            <div class="overlay">
              <h2 class="title">${meal.strMeal}</h2>
            </div>
          </div>
      `;
  });
  setTimeout(() => {
    loading.classList.remove("active");
  }, 200);
  contentDiv.innerHTML = box;
}

function displaySingleMeal(meal) {
  loading.classList.add("active");
  containerDiv.innerHTML = "";
  containerDiv.appendChild(contentDiv);
  let tags = meal.strTags ? meal.strTags.split(",") : null;
  let recipe = [];

  for (const [key, value] of Object.entries(meal)) {

    if (key.startsWith("strMeasure")) {
      if (value) {
        recipe.push(value);
      }
    }
  }
  console.log(recipe);

  setTimeout(() => {
    loading.classList.remove("active");
  }, 200);
  contentDiv.innerHTML = `
    <div class="single">
    <div class="left">
      <img
        src="${meal.strMealThumb}"
      />
      <h1 class="title">${meal.strMeal}</h1>
    </div>
    <div class="right">
      <h2>Instructions</h2>
      <p>
      ${meal.strInstructions}
      </p>
      <h3>Area: <span>${meal.strArea}</span></h3>
      <h3>Category: <span>${meal.strCategory}</span></h3>
      <div class="recipes">
        <h3>Recipes:</h3>
        <ul>
        ${
          recipe
            ? recipe
                .map((rec) => {
                  return `<li>${rec}</li>`;
                })
                .join("")
            : "no recipe :("
        }
        </ul>
      </div>
  
      <div class="tags">
        <h3>Tags:</h3>
        <ul>
        ${
          tags
            ? tags
                .map((tag) => {
                  return `<li>${tag}</li>`;
                })
                .join("")
            : "no tags :("
        }
        </ul>
      </div>
      <div class="media">
        <a href="${meal.strSource}" class="src">Source</a>
        <a href="${meal.strYoutube}" class="yt">Youtube</a>
      </div>
    </div>
  </div>
      
      `;
}

function dispalyContact() {

  loading.classList.remove("active");
  containerDiv.innerHTML = "";
  containerDiv.appendChild(contentDiv);

  contentDiv.innerHTML = `
      <div class="contact">
          <div class="form">
              <div class="inp">
                  <input type="text" placeholder="Enter Your Name" data-input="name"/>
              </div>
              <div class="inp">
                  <input type="email" placeholder="Enter Your Email" data-input="email" />
                  <span>Email not valid *exemple@yyy.zzz</span>
              </div>
              <div class="inp">
                  <input type="text" placeholder="Enter Your Phone"  data-input="phone"/>
                  <span>Enter valid Phone Number</span>
              </div>
              <div class="inp">
                  <input type="number" placeholder="Enter Your Age"  data-input="age"/>
                  <span>Minumum Age 16</span>
              </div>
              <div class="inp">
                  <input type="password" placeholder="Enter Your Password"  data-input="pass"/>
                  <span>Enter valid password *Minimum eight characters, at least one letter and one number:*</span>
              </div>
              <div class="inp">
                  <input type="password" placeholder="Repassword" data-input="repass"/>
                  <span>Two passwords don't match</span>
              </div>
              <button>Sumbit</button>
          </div>
      </div>
      `;

      let inps = Array.from(document.querySelectorAll(".contact .form .inp input"));
  let btn = document.querySelector(".contact .form button");
  let totalRegex = {
    name: true,
    email: false,
    phone: false,
    age: false,
    pass: false,
    repass: false,
  };
  console.log(totalRegex);

  function showError(input, res) {
    if (res) {
      input.nextElementSibling.classList.remove("active");
    } else {
      input.nextElementSibling.classList.add("active");
    }
  }

  
  inps.map((inp) => {
    inp.addEventListener("input", (e) => {
      
      if (inp.dataset.input == "name") {
        console.log("name");
      }
      
      else if (inp.dataset.input == "email") {
        let email = inp.value;
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let result = email.match(regex);
        if (result) {
          totalRegex.email = true;
        } else {
          totalRegex.email = false;
        }
        showError(inp, result);
      }
      
      else if (inp.dataset.input == "phone") {
        let phone = inp.value;
        let regex = /^\d{10,11}$/;
        let result = phone.match(regex);
        if (result) {
          totalRegex.phone = true;
        } else {
          totalRegex.phone = false;
        }
        showError(inp, result);
      }
      
      else if (inp.dataset.input == "age") {
        let age = inp.value;
        let result = age >= 16;
        if (result) {
          totalRegex.age = true;
        } else {
          totalRegex.age = false;
        }
        showError(inp, result);
      }
      
      else if (inp.dataset.input == "pass") {
        let pass = inp.value;
        let regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,}$/;
        let result = pass.match(regex);
        if (result) {
          totalRegex.pass = true;
        } else {
          totalRegex.pass = false;
        }
        showError(inp, result);
      }
      
      else if (inp.dataset.input == "repass") {
        let result = false;
        inps.map((inpt) => {
          if (inpt.dataset.input == "pass") {
            result = true ? inpt.value == inp.value : false;
          }
        });
        if (result) {
          totalRegex.repass = true;
        } else {
          totalRegex.repass = false;
        }
        showError(inp, result);
      }

      if (
        totalRegex.name &&
        totalRegex.email ** totalRegex.phone &&
        totalRegex.age &&
        totalRegex.pass &&
        totalRegex.repass
      ) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  });
}

function displayIngredients(ingreds) {
  loading.classList.add("active");
  containerDiv.innerHTML = "";
  containerDiv.appendChild(contentDiv);
  let box = "";
  ingreds.map((ingred) => {
    let desc =
      ingred.strDescription.length >= 100
        ? ingred.strDescription.slice(0, 100)
        : ingred.strDescription;

    let ingredName = ingred.strIngredient.replace(/\s+/g, "_");
    box += `
        <div class="box ingredient" data-id="${ingred.ingredidIngredient}" onclick=(getMealsIngredients("${ingredName}"))>
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
        <h3 class="title">${ingred.strIngredient}</h3>
        <p>${desc}</p>
      </div>
        `;
  });
  setTimeout(() => {
    loading.classList.remove("active");
  }, 200);
  contentDiv.innerHTML = box;
}

function displayAreas(areas) {
  containerDiv.innerHTML = "";
  containerDiv.appendChild(contentDiv);
  loading.classList.add("active");
  let box = "";
  areas.map((area) => {
    box += `
      <div class="box area" onclick=(getMealsArea("${area.strArea}"))>
      <i class="fa-solid fa-house-laptop fa-4x"></i>
      <h3 class="title">${area.strArea}</h3>
    </div>
      `;
  });
  setTimeout(() => {
    loading.classList.remove("active");
  }, 200);
  contentDiv.innerHTML = box;
}

function displayCategories(cats) {
  containerDiv.innerHTML = "";
  containerDiv.appendChild(contentDiv);
  loading.classList.add("active");
  let box = "";
  cats.map((cat) => {
    console.log(cat);
    let desc =
      cat.strCategoryDescription.length >= 135
        ? cat.strCategoryDescription.slice(0, 135)
        : cat.strCategoryDescription;
    box += `
          <div class="box" data-id="${cat.idCategory}" onclick=(getMealsCategory('${cat.strCategory}'))>
          <img src="${cat.strCategoryThumb}"/>
          <div class="overlay category">
            <h2 class="title">${cat.strCategory}</h2>
            <p>${desc}</p>
          </div>
        </div>
          `;
  });
  setTimeout(() => {
    loading.classList.remove("active");
  }, 200);
  contentDiv.innerHTML = box;
}
