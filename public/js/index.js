const nav = document.querySelector(".navigation__list");
const burger = document.querySelector(".burger");
const links = nav.querySelectorAll("a");

burger?.addEventListener("click", () => {
    nav.classList.toggle("nav-open");
    burger.classList.toggle("toggle");
});

links?.forEach((link) => {
    link.addEventListener("click", () => {
        nav.classList.toggle("nav-open");
        burger.classList.toggle("toggle");
    });
});

const randomKopce = document.getElementById("randomKopce");
const vtoroKopce = document.getElementById("vtoroKopce");
const tretoKopce = document.getElementById("tretoKopce");

const addNewPointTeam = document.getElementById("addNewPointTeam");
const addNewPointFirstTeamPlayers = document.getElementById(
    "addNewPointFirstTeamPlayers"
);
const addNewPointSecondTeamPlayers = document.getElementById(
    "addNewPointSecondTeamPlayers"
);

const giveCardTeam = document.getElementById("giveCardTeam");
const giveCardFirstTeamPlayers = document.getElementById(
    "giveCardFirstTeamPlayers"
);
const giveCardSecondTeamPlayers = document.getElementById(
    "giveCardSecondTeamPlayers"
);

const replacePlayerTeam = document.getElementById("replacePlayerTeam");
const firstTeamPlayerIn = document.getElementById("firstTeamPlayerIn");
const secondTeamPlayerIn = document.getElementById("secondTeamPlayerIn");
const firstTeamPlayerOut = document.getElementById("firstTeamPlayerOut");
const secondTeamPlayerOut = document.getElementById("secondTeamPlayerOut");

randomKopce?.addEventListener("click", () => {
    vtoroKopce.classList.toggle("hide");
    tretoKopce.classList.toggle("hide");
    document.body.style.backgroundColor = "red";
    console.log("Kopceto e kliknato!!!");
});

addNewPointTeam?.addEventListener("change", (event) => {
    addNewPointFirstTeamPlayers.classList.toggle("hide");
    addNewPointSecondTeamPlayers.classList.toggle("hide");
    console.log("Kopceto e kliknato!!!");
});

giveCardTeam?.addEventListener("change", (event) => {
    giveCardFirstTeamPlayers.classList.toggle("hide");
    giveCardSecondTeamPlayers.classList.toggle("hide");
    console.log("Kopceto e kliknato!!!");
});

replacePlayerTeam?.addEventListener("change", (event) => {
    firstTeamPlayerIn.classList.toggle("hide");
    secondTeamPlayerIn.classList.toggle("hide");
    firstTeamPlayerOut.classList.toggle("hide");
    secondTeamPlayerOut.classList.toggle("hide");
    console.log("Kopceto e kliknato!!!");
});
