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
 *   are the only part which modify system state.
 *   are imperative, don't return any value.
 */

function cmdToggleStartButton() {
  if (isRunning()) {
    setStartButtonNotRunning();
    return;
  }
  setStartButtonRunning();
  cmdShowNewImage();
}

function cmdShowNewImage() {
  var img = box(createImage()).do(setImageCallback).value;
  cmdSetImageRandomUrl(img);
  var imageArea = getImageArea();
  insertFirst(imageArea, img.parentNode);
}

function cmdSetImageRandomUrl(img) {
  var url = randPictureUrl();
  img.setAttribute("src", url);
  img.parentNode.setAttribute("href", url);
  return box(img);
}

/*
 * Logic composer
 *   make boxing value.
 *   compose functions.
 */

function MBox(a) {
  this.value = a;
  this.do = function(f) { return f(this.value); };
}

function box(a) {
  return new MBox(a);
}

/*
 * Logics
 *   are the place for logics.
 */

function setImageCallback(img) {
  img.onerror = imageOnError;
  img.onload = imageOnLoad;
  return box(img);
}

function insertFirst(parent, newChild) {
  if (parent.childNodes.length == 0) {
    parent.appendChild(newChild);
    return;
  }
  parent.insertBefore(newChild, parent.firstChild);
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

// for startButton

function getStartButton() {
  return document.getElementById(START_BUTTON_ID);
}

function isRunning() {
  var button = getStartButton();
  if (!button) return false;
  return (button.value == BUTTON_IS_RUNNING);
}

function setStartButtonRunning() {
  getStartButton().value = BUTTON_IS_RUNNING;
}

function setStartButtonNotRunning() {
  getStartButton().value = BUTTON_NOT_RUNNING;
}

// for URL

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
