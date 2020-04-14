const pasta = document.getElementById("pasta");
const pizza = document.getElementById("pizza");
const other = document.getElementById("other");

function listHandler(event){
    localStorage.setItem("listType", event.target.id);
}

pasta.addEventListener("click", listHandler);
pizza.addEventListener("click", listHandler);
other.addEventListener("click", listHandler);