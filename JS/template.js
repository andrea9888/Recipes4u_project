const balMeal = document.getElementById("bal-meal");
const vegMeal = document.getElementById("veg-meal");
const lfMeal = document.getElementById("lf-meal");

function listHandler(event){
    localStorage.setItem("listType", event.target.id);
}

balMeal.addEventListener("click", listHandler);
vegMeal.addEventListener("click", listHandler);
lfMeal.addEventListener("click", listHandler);