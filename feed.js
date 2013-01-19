/*
 * Constants
 */

var START_BUTTON_ID = "startButton";
var IMAGE_AREA_ID = "picarea";
var BUTTON_NOT_RUNNING = "Start";
var BUTTON_IS_RUNNING = "Stop";

/*
 * Events
 *   are called from UI or system events.
 */

function startButtonClicked() {
  cmdToggleStartButton();
}

function imageOnError() {
  cmdSetImageRandomUrl(this);
}

function imageOnLoad() {
  if (!isImageExist(this)) {
    cmdSetImageRandomUrl(this);
    return;
  }
  var startButton = document.getElementById(START_BUTTON_ID);
  if (!startButton) return;
  if (startButton.value == BUTTON_IS_RUNNING) cmdShowNewImage();
}

/*
 * Commands
 *   are the only part which modify system state.
 *   are imperative, don't return any value.
 */

function cmdToggleStartButton() {
  var startButton = document.getElementById(START_BUTTON_ID);
  if (startButton.value == BUTTON_IS_RUNNING) {
    startButton.value = BUTTON_NOT_RUNNING;
    return;
  }
  startButton.value = BUTTON_IS_RUNNING;
  cmdShowNewImage();
}

function cmdShowNewImage() {
  var img = createImage();
  var imageArea = document.getElementById(IMAGE_AREA_ID);
  imageArea.insertFirst = insertFirst;
  imageArea.insertFirst(img.parentNode);
  img.onerror = imageOnError;
  img.onload = imageOnLoad;
  cmdSetImageRandomUrl(img);
}

function cmdSetImageRandomUrl(img) {
  var url = randPictureUrl();
  img.setAttribute("src", url);
  img.parentNode.setAttribute("href", url);
}

/*
 * Methods
 *   are attached to objects so that giving some ability.
 */

function insertFirst(child) {
  if (this.childNodes.length == 0) {
    this.appendChild(child);
    return;
  }
  this.insertBefore(child, this.firstChild);
}

/*
 * Queries
 *   inspect system state or create some value, and return them.
 *   are referential transparent.
 */

function createImage() {
  var img = document.createElement("img");
  img.setAttribute("class", "show");
  
  var anchor = document.createElement("a");
  anchor.setAttribute("target", "_blank");
  anchor.appendChild(img);
  
  return img;
}

function isImageExist(img) {
  if (img.width == 161 && img.height == 81) return false;
  return true;
}

function randPictureUrl() {
  return "http://i.imgur.com/" + makeKey() + ".jpg";
}

function makeKey() {
  return [1, 2, 3, 4, 5].map(randChar).join("");
}

function randChar() {
  var chars="0123456789"
    + "abcdefghijklmnopqrstuvwxyz"
    + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  index = parseInt(Math.random() * chars.length);
  return chars.charAt(index);
}
