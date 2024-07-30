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

function charPair(elementMap, element) {
  /**
   * Assign value pair
   *
   * @return Unique Letter Combination
   * @param elements is a NodeList of all clickable elements
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

function sidePosition(element) {
  /**
   * Determine tooltip side position based on element
   *
   * @param element is a node
   * @return side for tooltip to lean on
   */

  if (element.getBoundingClientRect().x < window.innerWidth / 2) {
    return "right";
  } else {
    return "left";
  }
}

function uniqueCombinator(elements) {
  /**
   * Assign unique letter combinations on tooltips of all elements
   *
   * @param elements is a NodeList of all clickable elements
   */

  let uniquePairs = new Map();

  for (const element of elements) {
    uniquePairs.set(element, charPair(uniquePairs, element));

    element.style.backgroundColor = "blue";
    BdApi.UI.createTooltip(element, uniquePairs.get(element), {
      style: "info",
      side: sidePosition(element),
    });
  }
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

  // const currentNodes = collectClickableElements();

  const currentNodes = collectClickableElements();

  for (const element of currentNodes) {
    element.style.backgroundColor = "transparent";
  }
}

module.exports = class DiscVim {
  constructor(meta) {
    // bind class instance to DiscVIm
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.applied = false;
  }

  handleKeyDown(event) {
    try {
      switch (event.key.toLowerCase()) {
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
            uniqueCombinator(currentNodes);
            this.applied = true;
          }
          console.log(this.applied);
          break;
        case "k":
          /*
          Scroll Up
        */
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
          var objDiv = document.getElementById("divExample");
          objDiv.scrollTop = objDiv.scrollHeight;

          BdApi.UI.showToast("Scrolling to bottom of page", {
            type: "info",
            timeout: 1000,
          });
          break;
        default:
      }
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
    } catch (error) {
      errorMessage("DiscVim failed to start, check console!");
      console.error("DiscVim Failed:", error.message);
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
