/**
 * @name DiscVim
 * @author sebvu
 * @description Vim motions navigation on discord.
 * @version 0.1.3
 */

module.exports = class DiscVim {
  constructor(meta) {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.previousKey = null;
    this.gBuffer = false;
    this.shiftGBuffer = false;
    this.currentElementPairs = new Map();
  }

  async handleKeyDown(event) {
    try {
      let key = event.key.toLowerCase();
      switch (key) {
        case "f":
          /*
           Search mode
        */
          const newInteractiveElements = getInteractiveElements();
          displayPairIndicators(
            newInteractiveElements,
            this.currentElementPairs,
          );
          document.removeEventListener("keydown", this.handleKeyDown);
          let temp = await judgeUserInput(this.currentElementPairs);
          console.log("Script finished with " + temp);
          document.addEventListener("keydown", this.handleKeyDown);
          cleanDiscord();
          console.log("FINISHEDHDHAHDH");
          break;
        case "k":
          /*
          Scroll Up
        */
          window.scrollTo(0, 0);
          BdApi.UI.showToast("k (up) is not binded yet!", {
            type: "warning",
            timeout: 1000,
          });
          break;
        case "j":
          /*
          Scroll Down
        */
          BdApi.UI.showToast("j (down) is not binded yet!", {
            type: "warning",
            timeout: 1000,
          });
          break;
        case "u":
          /*
          Scroll Half Page Up
        */
          window.scrollBy(0, -100);
          BdApi.UI.showToast("u (half page up) is not binded yet!", {
            type: "warning",
            timeout: 1000,
          });
          break;
        case "d":
          /*
          Scroll Half Page Down
        */
          BdApi.UI.showToast("d (half page down) is not binded yet!", {
            type: "warning",
            timeout: 1000,
          });
          break;
        case "g":
          if (event.shiftKey) {
            BdApi.UI.showToast("shift+g (atw down) is not binded yet!", {
              type: "warning",
              timeout: 1000,
            });
            this.previousKey = null;
            this.gBuffer = true;
          } else if (this.previousKey == "g" && this.gBuffer === false) {
            BdApi.UI.showToast("g+g (atw up) is not binded yet!", {
              type: "warning",
              timeout: 1000,
            });
            this.previousKey = null;
            this.gBuffer = true;
          }
          break;
        default:
      }

      console.log(this.previousKey);

      if (this.gBuffer === true) this.gBuffer = false;
      else this.previousKey = key;
    } catch (err) {
      consoleErrorMessage("DiscVim failed to handle keydown, check console!");
      console.error("DiscVim Keydown Error:", err.message);
    }
  }

  start() {
    try {
      console.log("DiscVim Initializing");

      document.addEventListener("keydown", this.handleKeyDown);

      BdApi.UI.alert(
        "DiscVim v0.0.1",
        "Thank you so much for trying out **DiscVim!** It is greatly meaningful to I as a *extremely* junior solo developer. 💜\n\nIf you find any pressing issues or suggestions, please submit through [the official github.](https://github.com/sebvu/BD-Plugins)",
      );
      console.log("DiscVim Successfully Initialized");
    } catch (err) {
      consoleErrorMessage("DiscVim failed to start, check console!");
      console.error("DiscVim Failed:", err.message);
    }
  }

  stop() {
    try {
      console.log("DiscVim Cleaning");

      document.removeEventListener("keydown", this.handleKeyDown);

      cleanDiscord();

      console.log("DiscVim Successfully Cleaned");
    } catch (error) {
      consoleErrorMessage("DiscVim failed to cleanup, check console!");
      console.error("DiscVim Cleanup Failure:", error.message);
    }
  }
};

function getInteractiveElements() {
  return document.querySelectorAll(`
    button,
    a.link_d8bfb3,
    [role="button"],
    [role="treeitem"],
    [role="listitem"],
    [role="tab"]
  `);
}

function getUniquePair(elementMap) {
  const possibleCharacters = "ASDGHJKLWERUIO";
  const randomIndex1 = Math.floor(Math.random() * possibleCharacters.length);
  const randomIndex2 = Math.floor(Math.random() * possibleCharacters.length);

  while (true) {
    let pair =
      possibleCharacters[randomIndex1] + possibleCharacters[randomIndex2];

    if (elementMap.get(pair) === undefined) {
      return pair;
    }
  }
}

function applyCommonStyles(indicator) {
  indicator.style.fontSize = "15px";
  indicator.style.fontWeight = "bold";
  indicator.style.borderRadius = "4px";
  indicator.style.margin = "2px";
  indicator.style.padding = "2px";
  indicator.style.color = "#11111b";
  indicator.style.zIndex = "1000";
  // indicator.style.backgroundColor = "#f9e2af";
}

function displayPairIndicators(elements, map) {
  for (const element of elements) {
    map.set(element, getUniquePair(map, element));
    element.style.backgroundColor = "blue";

    const indicator = document.createElement("div");
    indicator.classList.add("overlay-box");
    indicator.textContent = map.get(element);

    element.appendChild(indicator);
    indicator.style.position = "absolute";

    // subjective parameter, does not apply to all discord layouts.
    if (
      !element.matches('[role="button"]') &&
      !element.matches('[role="listitem"]')
    ) {
      indicator.style.top = "50%";
      indicator.style.left = "50%";
      indicator.style.transform = "translate(-50%, -50%)";
      indicator.style.backgroundColor = "red";
    } else {
      indicator.style.backgroundColor = "#f9e2af";
    }

    applyCommonStyles(indicator);
  }
}

async function judgeUserInput(map) {
  let combination = "";
  // let combinationBroken = false;

  const reversedMap = new Map(Array.from(map, ([key, value]) => [value, key]));

  console.log(reversedMap);
  while (combination.length < 2) {
    const keyPressed = await getInput();
    // return keyPressed;
    combination += keyPressed.toUpperCase();
  }

  if (reversedMap.get(combination)) {
    console.log(combination);
    console.log(reversedMap.get(combination));
    reversedMap.get(combination).click();
  } else {
    BdApi.UI.showToast("Not a combination!", {
      type: "warning",
      timeout: 1000,
    });
  }

  return combination;
}

function getInput() {
  return new Promise((resolve, reject) => {
    document.addEventListener("keydown", function (event) {
      const keyPressed = event.key.toLowerCase();

      if (keyPressed != null) resolve(keyPressed);
      else reject("Null");
    });
  });
}

function consoleErrorMessage(message) {
  BdApi.UI.showToast(message, {
    type: "error",
    timeout: 5000,
  });
}

function cleanDiscord() {
  const tooltips = document.querySelectorAll(".overlay-box");

  const temporary = getInteractiveElements();

  for (const element of temporary)
    element.style.backgroundColor = "transparent";

  // console.log(tooltips);

  tooltips.forEach((element) => {
    // console.log(element);
    // console.log("removing");
    element.remove();
  });
}
