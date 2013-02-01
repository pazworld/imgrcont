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
  if (isRunning()) cmdShowNewImage();
}

/*
 * Commands
 *   modify system state.
 *   are imperative, don't return any value.
 */

// Top level commands called from evets.

function cmdToggleStartButton() {
  if (isRunning()) {
    setStartButtonNotRunning();
    return;
  }
  setStartButtonRunning();
  cmdShowNewImage();
}

function cmdShowNewImage() {
  var img = createImage();
  setImageCallback(img);
  cmdSetImageRandomUrl(img);
  var imageArea = getImageArea();
  insertFirst(imageArea, img.parentNode);
}

function cmdSetImageRandomUrl(img) {
  var url = randPictureUrl();
  img.setAttribute("src", url);
  img.parentNode.setAttribute("href", url);
}

// Lower level commands called from top level commands.

function setImageCallback(img) {
  img.onerror = imageOnError;
  img.onload = imageOnLoad;
}

function insertFirst(parent, newChild) {
  if (parent.childNodes.length == 0) {
    parent.appendChild(newChild);
    return;
  }
  parent.insertBefore(newChild, parent.firstChild);
}

function setStartButtonRunning() {
  getStartButton().value = BUTTON_IS_RUNNING;
}

function setStartButtonNotRunning() {
  getStartButton().value = BUTTON_NOT_RUNNING;
}

/*
 * Queries
 *   inspect system state or create some value, and return them.
 */

// for imageArea

function getImageArea() {
  return document.getElementById(IMAGE_AREA_ID);
}

// for image

function createImage() {
  var img = document.createElement("img");
  img.className = "show";
  
  var anchor = document.createElement("a");
  anchor.setAttribute("target", "_blank");
  anchor.appendChild(img);
  
  return img;
}

function isImageExist(img) {
  if (img.width == 161 && img.height == 81) return false;
  return true;
}

// for startButton

function getStartButton() {
  return document.getElementById(START_BUTTON_ID);
}

function isRunning() {
  var button = getStartButton();
  if (!button) return false;
  return (button.value == BUTTON_IS_RUNNING);
}

// for URL

function randPictureUrl() {
  return "http://i.imgur.com/" + makeKey() + ".jpg";
}

function makeKey() {
  var key = "";
  for (i = 0; i < 5; i++) key += randChar();
  return key;
}

function randChar() {
  var chars="0123456789"
    + "abcdefghijklmnopqrstuvwxyz"
    + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  index = parseInt(Math.random() * chars.length);
  return chars.charAt(index);
}
