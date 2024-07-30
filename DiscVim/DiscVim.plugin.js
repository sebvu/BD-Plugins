/**
 * @name DiscVim
 * @author sebvu
 * @description Allows the integration of vimium-like motions for keyboard navigation.
 * @version 0.0.1
 */

function collectClickableElements() {
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
  const clickableElements = collectClickableElements();
  for (const element of clickableElements) {
    element.style.backgroundColor = "transparent";
  }
}

module.exports = class DiscVim {
  constructor(meta) {
    // bind class instance to this (DiscVim)
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    // @intent: Apply a unique combination of letters near the homerows to all 'clickable' elements in the current viewport.
    // Disabled basic functionality unless event key is pressed or a unique combination has been completed.
    if (event.key.toLowerCase() === "f") {
      const clickableElements = collectClickableElements();
      // console.log(clickableElements);
      for (const element of clickableElements) {
        element.style.backgroundColor = "blue";
      }
    }
  }

  start() {
    // Startup with enabled
    BdApi.UI.alert(
      "DiscVim v0.0.1",
      "Thank you so much for trying out **DiscVim!** It is greatly meaningful to I as a *extremely* junior solo developer. 💜\n\nIf you find any pressing issues or suggestions, please submit through [the official github.](https://github.com/sebvu/BD-Plugins)",
    );
    document.addEventListener("keydown", this.handleKeyDown);
  }

  stop() {
    // Cleanup when disabled
    document.removeEventListener("keydown", this.handleKeyDown);
    clearUI();
  }
};
