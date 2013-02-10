/*
 * Constants
 */

var START_BUTTON_ID = "startButton";
var START_BUTTON_IMAGE_ID = "startButtonImage";
var IMAGE_AREA_ID = "picarea";
var AJAX_LOADER_ID = "ajaxLoader";
var BUTTON_NOT_RUNNING = "Start";
var BUTTON_IS_RUNNING = "Stop";
var BUTTON_IMAGE_NOT_RUNNING = "start.png";
var BUTTON_IMAGE_IS_RUNNING = "stop.png";

/*
 * Events
 *   are called from UI or system events.
 */

function startButtonClicked() {
  cmdToggleStartButton();
}

function resetButtonClicked() {
  cmdClearImages();
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
    setAjaxLoaderStop();
    return;
  }
  setStartButtonRunning();
  setAjaxLoaderStart();
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

function cmdClearImages() {
  var numImagesKept = 0;
  if (isRunning()) numImagesKept = 1;
  
  var imageArea = getImageArea();
  while (imageArea.childNodes.length > numImagesKept) {
    imageArea.removeChild(imageArea.lastChild);
  }
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
  getStartButtonImage().setAttribute("src", BUTTON_IMAGE_IS_RUNNING);
}

function setStartButtonNotRunning() {
  getStartButton().value = BUTTON_NOT_RUNNING;
  getStartButtonImage().setAttribute("src", BUTTON_IMAGE_NOT_RUNNING);
}

function setAjaxLoaderStart() {
  var loader = getAjaxLoader();
  loader.style.visibility = "visible";
}

function setAjaxLoaderStop() {
  var loader = getAjaxLoader();
  loader.style.visibility = "hidden";
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

function getStartButtonImage() {
  return document.getElementById(START_BUTTON_IMAGE_ID);
}

function isRunning() {
  var button = getStartButton();
  if (!button) return false;
  return (button.value == BUTTON_IS_RUNNING);
}

// for ajaxLoader

function getAjaxLoader() {
  return document.getElementById(AJAX_LOADER_ID);
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
