/**
 * @name DiscVim
 * @author sebvu
 * @description Vim motions navigation on discord.
 * @version 0.0.1
 */

function collectClickableElements() {
  /**
   * Collects all clickable elements within viewport
   *
   * @return NodeList of all elements queried
   */

  return document.querySelectorAll(`
    a[href], 
    button, 
    input[type="button"], 
    input[type="submit"], 
    input[type="reset"], 
    [role="button"], 
    [role="treeitem"], 
    [role="listitem"], 
    [role="menuitem"], 
    [role="textbox"], 
    [role="tab"], 
    [onclick]
  `);
}

function charPair(elementMap) {
  /**
   * Assign value pair
   *
   * @return Unique Letter Combination
   * @param elementMap is a Map of all elements and their corresponding letter combinations
   */

  const chars = [
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "W",
    "E",
    "R",
    "U",
    "I",
    "O",
  ];

  while (true) {
    let pair =
      chars[Math.floor(Math.random() * chars.length)] +
      chars[Math.floor(Math.random() * chars.length)];

    if (elementMap.get(pair) == undefined) {
      return pair;
    }
  }
}

function uniqueCombinator(elements, map) {
  /**
   * Assign unique letter combinations on tooltips of all elements
   *
   * @param elements is a NodeList of all clickable elements
   * @return an array of tooltips
   */

  for (const element of elements) {
    map.set(element, charPair(map, element));

    const box = document.createElement("h1");
    box.classList.add("overlay-box");
    box.textContent = map.get(element);

    // // Append the box to the target element
    element.appendChild(box);
    // // Position the box
    box.style.position = "absolute";
    box.style.fontSize - "10px";
    box.style.margin = "2px";
    box.style.padding = "2px";
    box.style.color = "#11111b";
    box.style.backgroundColor = "#f9e2af";

    // BdApi.UI.createTooltip(element, map.get(element), {
    //   style: "info",
    //   side: sidePosition(element),
    // });
  }
}

function comboJudge(map) {
  /**
   * Reads user input after tooltips are placed
   *
   * @return an exit code corresponding to what event happened
   * There are three possible exits: False Combination, case-press, and true combination.
   * False Combination: Combination that strays from any existing patterns.
   * case-press: Aborting combination
   * True Combination: Correct combination, will return an element.
   */
  // console.log("comboJudge");
  // console.log(map);
}

function errorMessage(message) {
  // Helper errorMessage function

  BdApi.UI.showToast(message, {
    type: "error",
    timeout: 5000,
  });
}

function clearUI() {
  // Clear currently applied UI

  const tooltips = document.querySelectorAll(".overlay-box");

  console.log(tooltips);

  tooltips.forEach((element) => {
    console.log(element); // Do something with each element
    console.log("removing");
    element.remove();
  });
}

module.exports = class DiscVim {
  constructor(meta) {
    // bind class instance to DiscVIm
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.applied = false;
    this.previousKey = null;
    this.buffer = false;
    this.shiftgBuffer = false;
    this.currentMap = new Map();
  }

  handleKeyDown(event) {
    try {
      let key = event.key.toLowerCase();
      switch (key) {
        case "f":
          /*
          Pull all clickable elements within viewport, add unique letter combination to each one.
          All other controls are disabled until case key is pressed again, or combination is satisfactory.
        */
          if (this.applied) {
            clearUI();
            this.applied = false;
          } else {
            const currentNodes = collectClickableElements();
            this.currentTooltipsArray = uniqueCombinator(
              currentNodes,
              this.currentMap,
            );
            console.log(this.currentTooltipsArray, this.currentMap);
            comboJudge(this.currentMap);
            this.applied = true;
          }
          console.log(this.applied);
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
            this.buffer = true;
          } else if (this.previousKey == "g" && this.buffer == false) {
            BdApi.UI.showToast("g+g (atw up) is not binded yet!", {
              type: "warning",
              timeout: 1000,
            });
            this.previousKey = null;
            this.buffer = true;
          }
          break;
        default:
      }

      console.log(this.previousKey);

      if (this.buffer == true) this.buffer = false;
      else this.previousKey = key;
    } catch (err) {
      errorMessage("DiscVim failed to handle keydown, check console!");
      console.error("DiscVim Keydown Error:", err.message);
    } finally {
      stop();
    }
  }

  start() {
    try {
      // Startup with enabled
      console.log("DiscVim Initializing");

      document.addEventListener("keydown", this.handleKeyDown);

      // Successful startup
      BdApi.UI.alert(
        "DiscVim v0.0.1",
        "Thank you so much for trying out **DiscVim!** It is greatly meaningful to I as a *extremely* junior solo developer. 💜\n\nIf you find any pressing issues or suggestions, please submit through [the official github.](https://github.com/sebvu/BD-Plugins)",
      );
      console.log("DiscVim Successfully Initialized");
    } catch (err) {
      errorMessage("DiscVim failed to start, check console!");
      console.error("DiscVim Failed:", err.message);
    } finally {
      stop();
    }
  }

  stop() {
    try {
      // Cleanup when disabled
      console.log("DiscVim Cleaning");

      document.removeEventListener("keydown", this.handleKeyDown);

      clearUI();

      // Successful cleanup
      console.log("DiscVim Successfully Cleaned");
    } catch (error) {
      errorMessage("DiscVim failed to cleanup, check console!");
      console.error("DiscVim Cleanup Failure:", error.message);
    } finally {
      window.stop();
    }
  }
};
