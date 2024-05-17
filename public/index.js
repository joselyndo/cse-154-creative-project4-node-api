/**
 *
 */

"use strict";

(function() {
  const START_VIEW = "start-view";
  const PATH_VIEW = "path-selection-view";
  const FLOWER_VIEW = "flower-view";
  const END_VIEW = "end-view";

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
        console.log("u");
        initializeFlowersView();
      });
    }
  }

  // update path flowers according to num flowers chosen
  function updatePathView() {
  }

  // adds the first flower to screen
  function initializeFlowersView() {

  }

  // Goes to either the next flower or to the end screen
  function nextScreenFromFlowerView() {

  }

  function initializeEndView() {

  }

  function addRecommendation() {

  }

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