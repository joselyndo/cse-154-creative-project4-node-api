/**
 * Joselyn Do
 * May 17th, 2024
 * Section AB: Elias & Quinton
 *
 * This index.js file adds the functionality to the CP4 Flower Garden Walk, enabling
 * users to select how many flowers they want to see on their "walk",
 * which path to see, see information about the flowers they encounter,
 * sending recommendation feedback, and starting the Garden Walk over again.
 */

"use strict";

(function() {
  const START_VIEW = "start-view";
  const PATH_VIEW = "path-selection-view";
  const FLOWER_VIEW = "flower-view";
  const END_VIEW = "end-view";
  const GET_FLOWERS_LISTS = "/random-flowers/";
  const GET_FLOWER_INFO = "/flower/";
  const RECOMMENDATION_ENDPOINT = "/recommendation/";
  const ADD_REC = "add";
  const GET_REC = "get";
  const ERROR_MESSAGE = "An issue has occurred. Please try again.";
  let optionOneFlowers = null;
  let optionTwoFlowers = null;
  let optionThreeFlowers = null;
  let chosenPathFlowers = null;
  let flowerNum = 0;

  window.addEventListener("load", init);

  /** Intializes the interactble features of the page */
  function init() {
    document.getElementById("start-btn").addEventListener("click", function() {
      nextView(START_VIEW, PATH_VIEW);
    });

    initializePathView();
    document.getElementById("next-flower-btn").addEventListener("dblclick", updateFlowersView);
    initializeEndView();
  }

  /**
   * Switches views from the current view to the next view
   * @param {String} currView - String representing which of the four views the user is currently on
   * @param {String} upcomingView - String representing the next view the user will move onto
   */
  function nextView(currView, upcomingView) {
    document.getElementById(currView).classList.toggle("hidden");
    document.getElementById(currView).classList.toggle("visible");

    document.getElementById(upcomingView).classList.toggle("hidden");
    document.getElementById(upcomingView).classList.toggle("visible");
  }

  /** Initializes the interactable features of the path selection screen */
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

  /** Updates the flowers shown for each path option */
  async function updatePathOptions() {
    try {
      let numChosen = parseInt(this.value);
      let res = await fetch(GET_FLOWERS_LISTS + numChosen);
      await statusCheck(res);
      res = await res.text();
      let listOfFlowerLists = processFlowerLists(res);
      addFlowerLists(listOfFlowerLists);
      setOptionButtons(false);
    } catch (error) {
      addErrorMessage();
    }
  }

  /**
   * Processes the given text response about the flowers in each path
   * @param {object} res - response containing the flower list text to process
   * @return {(String[])[]} - An array of String arrays representing the flowers
   *                          for each of the paths
   */
  function processFlowerLists(res) {
    let flowerListArr = res.split("\n");
    let flowerArrsArr = [];
    for (let pathNum = 0; pathNum < flowerListArr.length; pathNum++) {
      let pathFlowersList = flowerListArr[pathNum].split(":");
      flowerArrsArr.push(pathFlowersList);
    }

    return flowerArrsArr;
  }

  /**
   * Updates the path selection screen with the flowers for each path
   * @param {(String[])[]} listOfFlowerLists - A 2D array containing the flowers for each path
   */
  function addFlowerLists(listOfFlowerLists) {
    let options = document.querySelectorAll(".path-option");
    optionOneFlowers = listOfFlowerLists[0];
    optionTwoFlowers = listOfFlowerLists[1];
    optionThreeFlowers = listOfFlowerLists[2];

    for (let optionNum = 0; optionNum < options.length; optionNum++) {
      let contentList = options[optionNum].firstElementChild.nextElementSibling;
      contentList.innerHTML = "";
      for (let flower = 0; flower < listOfFlowerLists[optionNum].length; flower++) {
        let listItem = document.createElement("li");
        listItem.textContent = listOfFlowerLists[optionNum][flower];
        contentList.appendChild(listItem);
      }
    }
  }

  /** Intializes the view for the very first flower seen */
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
    nextView(PATH_VIEW, FLOWER_VIEW);
  }

  /** Requests and handles information for a specific flower */
  async function addFlowerInfo() {
    let flowerToDisplay = chosenPathFlowers[flowerNum];
    try {
      let flowerInfo = await fetch(GET_FLOWER_INFO + flowerToDisplay);
      await statusCheck(flowerInfo);
      flowerInfo = await flowerInfo.json();
      handleFlowerInfo(flowerInfo);
    } catch (error) {
      addErrorMessage();
    }
  }

  /**
   * Displays the information from the given JSON object on the screen
   * @param {JSON} flowerInfo - JSON object containing information for a specific flower
   */
  function handleFlowerInfo(flowerInfo) {
    let img = document.createElement("img");
    img.src = flowerInfo["image"];
    img.alt = flowerInfo["name"];

    let infoContainer = createFlowerInfoSection(flowerInfo);

    let parent = document.getElementById("flower-info");
    parent.innerHTML = "";
    parent.appendChild(img);
    parent.appendChild(infoContainer);
  }

  /**
   * Creates an element to hold information for the displayed flower
   * @param {JSON} flowerInfo - JSON object containing information for a specific flower
   * @return {HTMLElement} - HTML element containing information for the displayed flower
   */
  function createFlowerInfoSection(flowerInfo) {
    let header = document.createElement("h3");
    header.textContent = flowerInfo["name"];

    let flowerFact = document.createElement("p");
    flowerFact.textContent = flowerInfo["fun-fact"];

    let imgCredit = document.createElement("a");
    imgCredit.href = flowerInfo["image-credit"];
    imgCredit.textContent = "Image link";
    imgCredit.target = "_blank";
    let span = document.createElement("span");
    span.textContent = " | ";
    let factCredit = document.createElement("a");
    factCredit.href = flowerInfo["fun-fact-credit"];
    factCredit.textContent = "Fun fact link";
    factCredit.target = "_blank";

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

  /** Updates the flower screen depending on which flower the user is viewing */
  function updateFlowersView() {
    flowerNum++;
    if (flowerNum < chosenPathFlowers.length) {
      addFlowerInfo();
    } else {
      flowerNum = 0;
      chosenPathFlowers = null;
      nextView(FLOWER_VIEW, END_VIEW);
    }
  }

  /** Initializes the interactable features of the end screen */
  function initializeEndView() {
    document.getElementById("recommend-btn").addEventListener("click", function() {
      addRecommendation("yes");
    });

    document.getElementById("do-not-recommend-btn").addEventListener("click", function() {
      addRecommendation("no");
    });

    document.getElementById("main-screen-btn").addEventListener("click", resetState);
    updateRecommendation();
  }

  /**
   * Records the user's recommendation feedback
   * @param {String} feedback - String representing whether the user would recommend
   *                            Garden Walk or not
   */
  async function addRecommendation(feedback) {
    try {
      setRecommendationButtons(true);
      let params = new FormData();
      params.append("recommendation", feedback);
      let res = await fetch(RECOMMENDATION_ENDPOINT + ADD_REC, {
        method: "POST",
        body: params
      });
      await statusCheck(res);
      res = await res.text();
      addMessage("Update", res);
      updateRecommendation();
    } catch (error) {
      addErrorMessage();
    }
  }

  /**
   * Update the percentage representing how many visitors would
   * recommend the Garden Walk experience
   */
  async function updateRecommendation() {
    let recRate = document.getElementById("recommendation-rate");
    try {
      let res = await fetch(RECOMMENDATION_ENDPOINT + GET_REC);
      await statusCheck(res);
      res = await res.text();
      recRate.textContent = res + "%";
    } catch (error) {
      addErrorMessage();
    }
  }

  /** Resets the interactable features of the various views */
  function resetState() {
    let radioInputs = document.querySelectorAll("input");
    for (let input = 0; input < radioInputs.length; input++) {
      radioInputs[input].checked = false;
    }

    document.getElementById("status-message").classList.add("hidden");

    setOptionButtons(true);
    setRecommendationButtons(false);
    nextView(END_VIEW, START_VIEW);
  }

  /**
   * Disables or enables the path option buttons depending on the input
   * @param {Boolean} doNotEnable - Boolean representing whether or not the buttons should
   *                                be disabled or not. True means that the buttons will be
   *                                disabled and false for enabling the buttons
   */
  function setOptionButtons(doNotEnable) {
    let pathOptionBtns = document.querySelectorAll("#paths button");
    for (let button = 0; button < pathOptionBtns.length; button++) {
      pathOptionBtns[button].disabled = doNotEnable;
    }
  }

  /**
   * Disables or enables the recommendation buttons depending on the input
   * @param {Boolean} doNotEnable - Boolean representing whether or not the buttons should
   *                                be disabled or not. True means that the buttons will be
   *                                disabled and false for enabling the buttons
   */
  function setRecommendationButtons(doNotEnable) {
    let recBtns = document.querySelectorAll("#end-view div button");
    for (let button = 0; button < recBtns.length; button++) {
      recBtns[button].disabled = doNotEnable;
    }
  }

  /**
   * Adds a message to the screen
   * @param {String} headerMessage - The text to be added as the message header
   * @param {String} bodyMessage - The text to be added to the message body
   */
  function addMessage(headerMessage, bodyMessage) {
    let header = document.createElement("h2");
    header.textContent = headerMessage;

    let body = document.createElement("p");
    body.textContent = bodyMessage;

    let parent = document.getElementById("status-message");
    parent.appendChild(header);
    parent.appendChild(body);
    parent.classList.remove("hidden");
    setTimeout(function() {
      parent.classList.add("hidden");
      parent.innerHTML = "";
    }, 20000);
  }

  /** Adds an error message to the screen */
  function addErrorMessage() {
    addMessage("Error", ERROR_MESSAGE);
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
})();