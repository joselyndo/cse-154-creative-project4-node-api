/**
 *
 */

"use strict";

(function() {
  const START_VIEW = "start-view";
  const PATH_VIEW = "path-selection-view";
  const FLOWER_VIEW = "flower-view";
  const END_VIEW = "end-view";
  const GET_FLOWERS_LISTS = "/random-flowers/";
  const GET_FLOWER_INFO = "/flower/";
  let optionOneFlowers = null;
  let optionTwoFlowers = null;
  let optionThreeFlowers = null;
  let chosenPathFlowers = null;
  let flowerNum = 0;

  window.addEventListener("load", init);

  function init() {
    document.getElementById("start-btn").addEventListener("click", function() {
      nextView(START_VIEW, PATH_VIEW);
    });
    initializePathView();
  }

  function nextView(currView, nextView) {
    document.getElementById(currView).classList.toggle("hidden");
    document.getElementById(currView).classList.toggle("visible");

    document.getElementById(nextView).classList.toggle("hidden");
    document.getElementById(nextView).classList.toggle("visible");
  }

  function initializePathView() {
    let inputArr = document.querySelectorAll("input");
    for (let input = 0; input < inputArr.length; input++) {
      inputArr[input].addEventListener("change", updatePathOptions);
    }

    let pathOptionBtns = document.querySelectorAll("#paths button");
    for (let button = 0; button < pathOptionBtns.length; button++) {
      pathOptionBtns[button].addEventListener("click", initializeFlowersView);
    }
  }

  // update path flowers according to num flowers chosen
  async function updatePathOptions() {
    try {
      let numChosen = parseInt(this.value);
      let res = await fetch(GET_FLOWERS_LISTS + numChosen);
      await statusCheck(res);
      res = await res.text();
      let listOfFlowerLists = processFlowerLists(res);
      addFlowerLists(listOfFlowerLists);
    } catch (error) {

    }
  }

  function processFlowerLists(res) {
    let flowerListArr = res.split("\n");
    let flowerArrsArr = [];
    for (let pathNum = 0; pathNum < flowerListArr.length; pathNum++) {
      let pathFlowersList = flowerListArr[pathNum].split(":");
      flowerArrsArr.push(pathFlowersList);
    }

    return flowerArrsArr;
  }

  function addFlowerLists(listOfFlowerLists) {
    let options = document.querySelectorAll(".path-option");
    optionOneFlowers = listOfFlowerLists[0];
    optionTwoFlowers = listOfFlowerLists[1];
    optionThreeFlowers = listOfFlowerLists[2];

    for (let optionNum = 0; optionNum < options.length; optionNum++) {
      let contentList = options[optionNum].firstElementChild.nextElementSibling;
      contentList.innerHTML = "";
      for (let flowerNum = 0; flowerNum < listOfFlowerLists[optionNum].length; flowerNum++) {
        let listItem = document.createElement("li");
        listItem.textContent = listOfFlowerLists[optionNum][flowerNum];
        contentList.appendChild(listItem);
      }
    }
  }

  // adds the first flower to screen
  function initializeFlowersView() {
    let chosenOption = this.parentElement.id;
    if (chosenOption === "option-one") {
      chosenPathFlowers = optionOneFlowers;
    } else if (chosenOption === "option-two") {
      chosenPathFlowers = optionTwoFlowers;
    } else {
      chosenPathFlowers = optionThreeFlowers;
    }

    optionOneFlowers = null;
    optionTwoFlowers = null;
    optionThreeFlowers = null;

    addFlowerInfo();
    // add event listener to button
    nextView(PATH_VIEW, FLOWER_VIEW);
  }

  async function addFlowerInfo() {
    let flowerToDisplay = chosenPathFlowers[flowerNum];
    try {
      let flowerInfo = await fetch(GET_FLOWER_INFO + flowerToDisplay);
      await statusCheck(flowerInfo);
      flowerInfo = await flowerInfo.json();
      handleFlowerInfo(flowerInfo);
    } catch (error) {

    }
  }

  function handleFlowerInfo(flowerInfo) {
    let img = document.createElement("img");
    img.src = flowerInfo["image"];
    img.alt = flowerInfo["name"];

    let infoContainer = createFlowerInfoSection(flowerInfo);

    let parent = document.getElementById("flower-info");
    parent.appendChild(img);
    parent.appendChild(infoContainer);
  }

  function createFlowerInfoSection(flowerInfo) {
    let header = document.createElement("h3");
    header.textContent = flowerInfo["name"];

    let flowerFact = document.createElement("p");
    flowerFact.textContent = flowerInfo["fun-fact"];

    let imgCredit = document.createElement("a");
    imgCredit.href = flowerInfo["image-credit"];
    imgCredit.textContent = "Image link";
    let span = document.createElement("span");
    span.textContent = " | ";
    let factCredit = document.createElement("a");
    factCredit.href = flowerInfo["fun-fact-credit"];
    factCredit.textContent = "Fun fact link";

    let linkContainer = document.createElement("div");
    linkContainer.appendChild(imgCredit);
    linkContainer.appendChild(span);
    linkContainer.appendChild(factCredit);

    let infoContainer = document.createElement("section");
    infoContainer.appendChild(header);
    infoContainer.appendChild(flowerFact);
    infoContainer.appendChild(linkContainer);

    return infoContainer;
  }

  // adds the second and future flowers to screen
  // enables a screen change
  function updateFlowersView() {

  }

  // Goes to either the next flower or to the end screen
  function nextScreenFromFlowerView() {

  }

  function initializeEndView() {

  }

  function addRecommendation() {

  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  // MUST ALSO FILL OUT API DOC

})();

// API: get info for a specific flower -> dblclick l/r buttons
// API: send if recommend or not -> click

// disable buttons ; path options, rec