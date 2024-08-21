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
    this.vimModeEnabled = false;
    this.searchModeEnabled = false;
    this.currentScrollIndex = 0;
  }

  async handleKeyDown(event) {
    try {
      let key = event.key.toLowerCase();

      if (key === "c" && event.ctrlKey && event.shiftKey) {
        /*
            Enable Vim Mode
            */
        let result = "";

        if (!this.vimModeEnabled) {
          this.vimModeEnabled = true;
          result = "ON";
        } else {
          this.vimModeEnabled = false;
          cleanDiscord();
          result = "OFF";
        }

        BdApi.UI.showToast(`Vim Mode ${result}`, {
          type: "success",
          timeout: 1000,
        });
      }

      if (!this.vimModeEnabled) return;

      event.preventDefault();
      event.stopPropagation();

      const scrollContainers = document.querySelectorAll("[class^='scroll']");

      console.log(scrollContainers);

      if (scrollContainers.length - 1 < this.currentScrollIndex) {
        this.currentScrollIndex = scrollContainers.length - 1;
      }

      switch (key) {
        case "f":
          /*
           Search mode
        */
          this.vimModeEnabled = false;
          this.searchModeEnabled = true;
          const interactiveElements = getInteractiveElements();
          const generatedCombos = getUniquePair(interactiveElements.length);

          if (interactiveElements.length === generatedCombos.length) {
            displayPairIndicators(interactiveElements, generatedCombos);
            await judgeUserInput(
              interactiveElements,
              generatedCombos,
              this.vimModeEnabled,
            );
            cleanDiscord();
            console.log("finished f mode");
          } else {
            console.log("DID NOT MATCH LENGTHS.");
            console.log(
              interactiveElements.length + " LENGTH OF interactiveElements",
            );
            console.log(generatedCombos.length + " LENGTH OF generatedCombo");
            consoleErrorMessage("DID NOT MATCH LENGTHS.");
          }
          this.vimModeEnabled = true;
          this.searchModeEnabled = false;
          break;
        case "h":
          this.currentScrollIndex = changeContainer(
            "left",
            this.currentScrollIndex,
            scrollContainers,
          );
          break;
        case "l":
          this.currentScrollIndex = changeContainer(
            "right",
            this.currentScrollIndex,
            scrollContainers,
          );
          break;
        case "k":
          scrollChat(-1, this.currentScrollIndex, scrollContainers);
          BdApi.UI.showToast("k (up) is not binded yet!", {
            type: "warning",
            timeout: 1000,
          });
          break;
        case "j":
          scrollChat(1, this.currentScrollIndex, scrollContainers);
          BdApi.UI.showToast("j (down) is not binded yet!", {
            type: "warning",
            timeout: 1000,
          });
          break;
        case "u":
          scrollChat(-10, this.currentScrollIndex, scrollContainers);
          BdApi.UI.showToast("u (half page up) is not binded yet!", {
            type: "warning",
            timeout: 1000,
          });
          break;
        case "d":
          scrollChat(10, this.currentScrollIndex, scrollContainers);
          BdApi.UI.showToast("d (half page down) is not binded yet!", {
            type: "warning",
            timeout: 1000,
          });
          break;
        case "g":
          if (event.shiftKey) {
            scrollChat(5000, this.currentScrollIndex, scrollContainers);
            BdApi.UI.showToast("shift+g (atw down) is not binded yet!", {
              type: "warning",
              timeout: 1000,
            });
            this.previousKey = null;
            this.gBuffer = true;
          } else if (this.previousKey == "g" && this.gBuffer === false) {
            scrollChat(-5000, this.currentScrollIndex, scrollContainers);
            BdApi.UI.showToast("g+g (atw up) is not binded yet!", {
              type: "warning",
              timeout: 1000,
            });
            this.previousKey = null;
            this.gBuffer = true;
          }
          break;
        case "r":
          if (event.ctrlKey) {
            location.reload(true); // Keep option for reload
          }
        default:
      }

      console.log(this.previousKey);
      console.log(this.currentScrollIndex);

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

function changeContainer(direction, currentIndex, scrollContainers) {
  console.log(scrollContainers.length + "rizzler");
  console.log(currentIndex + "fanum tax");
  if (scrollContainers.length > currentIndex) {
    console.log("ffffff");
    switch (direction) {
      case "left":
        return currentIndex - 1;
      case "right":
        return currentIndex + 1;
    }
  }
}

function scrollChat(direction, index, scrollContainers) {
  if (scrollContainers[index]) {
    scrollContainers[index].scrollBy({
      top: direction * 50,
      left: 0,
      // behavior: "smooth",
    });
  } else {
    consoleErrorMessage("Scrollable chat container not found.");
  }
}

function getInteractiveElements() {
  const elements = document.querySelectorAll(`
    button,
    a[class^="link"],
    div[class^="labelContainer"],
    div[class^="listItemContents"],
    div[class^="interactive"],
    div[class^="memberItem"],
    div[class^="memberInner"],
    span[class^="clickable"],
    [class^="scroll"],
    [role="button"],
    [role="treeitem"],
    [role="tab"]
  `);

  return Array.from(elements).filter((element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  });
}

function getUniquePair(maxSize) {
  const possibleCharacters = "ASDGHJKLWERUIO";
  let pairs = [];

  while (pairs.length < maxSize) {
    let pair = "";
    const randomIndex1 = Math.floor(Math.random() * possibleCharacters.length);
    const randomIndex2 = Math.floor(Math.random() * possibleCharacters.length);

    if (pairs.length > 196) {
      const randomIndex3 = Math.floor(
        Math.random() * possibleCharacters.length,
      );
      pair += possibleCharacters[randomIndex3];
    }

    pair =
      pair +
      possibleCharacters[randomIndex1] +
      possibleCharacters[randomIndex2];

    if (!pairs.includes(pair)) {
      pairs.push(pair);
    }
  }
  return pairs;
}

function applyCommonStyles(indicator) {
  indicator.style.fontSize = "15px";
  indicator.style.fontFamily = "system-ui";
  indicator.style.fontWeight = "bold";
  indicator.style.borderRadius = "4px";
  indicator.style.margin = "2px";
  indicator.style.padding = "2px";
  indicator.style.color = "#11111b";
  // indicator.style.backgroundColor = "#f9e2af";
  indicator.style.position = "absolute";
  indicator.style.zIndex = "10000";
}

function displayPairIndicators(interactiveElements, comboPairs) {
  // both interactiveElements and comboPairs are equal sized
  maxSize = interactiveElements.length;
  const placedIndicators = [];

  for (let i = 0; i < maxSize; i++) {
    const uniquePair = comboPairs[i];
    const element = interactiveElements[i];
    console.log(uniquePair + "=>" + element);

    // element.style.backgroundColor = "blue";
    // element.style.position = "relative";

    const indicator = document.createElement("div");
    indicator.classList.add("overlay-box");
    indicator.textContent = uniquePair;

    element.appendChild(indicator);

    if (
      element.classList.contains("scroll") ||
      element.className.includes("scroll")
    ) {
      indicator.style.backgroundColor = "red";
      console.log("scroll is found");
    } else {
      indicator.style.backgroundColor = "#f9e2af";
    }

    applyCommonStyles(indicator);
  }
}

function hasPotentialMatch(userCombination, combinations) {
  for (const combination of combinations) {
    if (combination.startsWith(userCombination)) {
      console.log("true");
      return true;
    }
  }
  console.log("false");
  return false;
}

async function judgeUserInput(elements, combinations) {
  let userCombination = "";
  let maxTries = 500;
  console.log(combinations);

  for (let i = 0; i < maxTries; i++) {
    const keyPressed = await getInput();

    if (keyPressed === "F") return;

    userCombination += keyPressed.toUpperCase();

    console.log(userCombination);

    if (combinations.includes(userCombination)) {
      console.log("combination found");
      const index = combinations.indexOf(userCombination);
      elements[index].click();
      return;
    } else if (!hasPotentialMatch(userCombination, combinations)) {
      console.log("combination broken");
      BdApi.UI.showToast("Not a combination!", {
        type: "warning",
        timeout: 1000,
      });
      return;
    }
  }
}

function getInput() {
  return new Promise((resolve, reject) => {
    const keydownListener = (event) => {
      const keyPressed = event.key.toUpperCase();

      event.preventDefault();
      event.stopPropagation();

      document.removeEventListener("keydown", keydownListener);

      if (keyPressed != null) {
        resolve(keyPressed);
      } else {
        reject("Null");
      }
    };

    document.addEventListener("keydown", keydownListener);
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

  // for (const element of temporary)
  //   element.style.backgroundColor = "transparent";

  // console.log(tooltips);

  tooltips.forEach((element) => {
    // console.log(element);
    // console.log("removing");
    element.remove();
  });
}
