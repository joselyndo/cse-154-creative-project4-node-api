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
      inputArr[input].addEventListener("change", updatePathView);
    }

    let pathOptionBtns = document.querySelectorAll("#paths button");
    for (let button = 0; button < pathOptionBtns.length; button++) {
      pathOptionBtns[button].addEventListener("click", function() {
        nextView(PATH_VIEW, FLOWER_VIEW);
        initializeFlowersView(); // todo
      });
    }
  }

  // update path flowers according to num flowers chosen
  async function updatePathView() {
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
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card are
   * either all the same or all different, then the cards make a set. If not, they do not make a set
   * @param {Promise<Response>} res - the response to evaluate the status code of
   * @return {Promise<Response>} a valid response
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  // MUST ALSO FILL OUT API DOC

})();

// API: get list of random flowers of length 5 -> change
// API: get info for a specific flower -> dblclick l/r buttons
// API: send if recommend or not -> click

/* <img src="../img/zinnia.jpeg" alt="aster">
<section>
  <h3>Aster</h3>
  <p>
    Sunflowers are originally from North America and have been cultivated
    for over 4,500 years. This is partly because the entirety of the
    sunflower plant is edible, so the leaves, stalks, and roots could all
    be used as food. In fact, sunflowers were grown as food in North America
    before other crops such as corn became commonplace.
  </p>
  <p><a href="">Image link</a> | <a href="">Fun fact link</a></p>
</section> */