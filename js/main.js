const CHARACTER_CONTAINER = document.querySelector(".character-list-container")
const CHARACTER_LIST = document.querySelector(".character-list")
const PLANET_CONTAINER = document.querySelector(".planet-info-container")
const PLANET_INFO = document.querySelector(".planet-info")
const characterCache = {}
const planetCache = {}
let currentPage = 1

function showCharacterPreloader(){
    CHARACTER_CONTAINER.querySelector('.lds-ring').classList.remove("hidden")
}
function hideCharacterPreloader(){
    CHARACTER_CONTAINER.querySelector('.lds-ring').classList.add("hidden")
}
function showPlanetPreloader(){
    PLANET_CONTAINER.querySelector('.lds-ring').classList.remove("hidden")
}
function hidePlanetPreloader(){
    PLANET_CONTAINER.querySelector('.lds-ring').classList.add("hidden")
}

async function fetchCharacters(page){
    if(characterCache[page]){ return characterCache[page] }
    
    const response = await fetch('http://swapi.dev/api/people?page='+page)
    const data = await response.json()
    characterCache[page]= data.results
    return data.results
}

async function fetchPlanet(url){
    if(planetCache[url]){ return planetCache[url]}
    const response = await fetch(url)
    const data = await response.json()
    planetCache[url] = data
    return data
}

async function clickCharacter(character){
    clearPlanetInfo(PLANET_INFO)
    showPlanetPreloader()
    const planet = await fetchPlanet(character.homeworld)
    hidePlanetPreloader()
    renderPlanetInfo(PLANET_INFO, planet)
}


function clearCharacters(container){
    container.querySelectorAll("li").forEach(node => node.remove())
}
function clearPlanetInfo(container){
    container.innerHTML = ""
}
function renderCharacters(container, characters){
    for(let char of characters){
        let li = document.createElement("li")
        li.innerText = char.name
        li.classList.add("character-item")
        li.addEventListener("click", () => clickCharacter(char))
        container.append(li)
    }
}

function renderPlanetInfo(container, planet){
    container.innerHTML = `
        <p>Name: ${planet.name}</p>
        <p>Diameter: ${planet.diameter}</p>
        <p>Climate: ${planet.climate}</p>
        <p>Terrain: ${planet.terrain}</p>
        <p>Population: ${planet.population}</p>
    `

}

async function listCharacters(){
    clearCharacters(CHARACTER_LIST)
    showCharacterPreloader()
    const people = await fetchCharacters(currentPage)
    hideCharacterPreloader()
    renderCharacters(CHARACTER_LIST, people)
}

function next(){
    currentPage++
    listCharacters()
}
function previous(){
    if(currentPage > 0){
        currentPage--
        listCharacters()
    }
}

function initEvents(){
    CHARACTER_CONTAINER.querySelector(".previous")
        .addEventListener("click", previous)
    CHARACTER_CONTAINER.querySelector(".next")
        .addEventListener("click", next)
}

async function run(){
    initEvents()
    listCharacters()
}
run()