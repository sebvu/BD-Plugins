/**
 * @name DiscVim
 * @author sebvu
 * @description Allows the integration of vimium-like motions for keyboard navigation.
 * @version 0.0.1
 */

function collectClickableElements() {
  /*
    Collect all clickable elements within viewport

    @return NodeList of all elements queried
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

function clearUI() {
  // Clear currently applied UI

  const clickableElements = collectClickableElements();
  for (const element of clickableElements) {
    element.style.backgroundColor = "transparent";
  }
}

module.exports = class DiscVim {
  constructor(meta) {
    // bind class instance to DiscVIm
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.applied = false.bind;
  }

  handleKeyDown(event) {
    switch (event.key.toLowerCase()) {
      case "f":
        /*
          Pull all clickable elements within viewport, add unique letter combination to each one.
          All other controls are disabled until case key is pressed again, or combination is satisfactory.
        */
        if (!this.applied) {
          const clickableElements = collectClickableElements();
          for (const element of clickableElements) {
            element.style.backgroundColor = "blue";
          }
          this.applied = true;
        } else {
          clearUI();
          this.applied = false;
        }
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
      default:
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
      BdApi.UI.showToast("DiscVim error, check console!", {
        type: "error",
        timeout: 5000,
      });
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
      BdApi.UI.showToast("DiscVim failed to cleanup, check console!", {
        type: "error",
        timeout: 5000,
      });
      console.error("DiscVim Cleanup Failure:", error.message);
    } finally {
      window.stop();
    }
  }
};
