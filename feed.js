/*
 * Constants
 */

var START_BUTTON_ID = "startButton";
var IMAGE_AREA_ID = "picarea";
var BUTTON_NOT_RUNNING = "Start";
var BUTTON_IS_RUNNING = "Stop";

function startButtonOnClick() {
  if (startButton().value == BUTTON_IS_RUNNING) {
    startButton().value = BUTTON_NOT_RUNNING;
    return;
  }
  startButton().value = BUTTON_IS_RUNNING;
  showRandPicture(IMAGE_AREA_ID);
}

function startButtonIsRunning() {
  if (!startButton()) return false;
  return (startButton().value == BUTTON_IS_RUNNING);
}

function startButton() {
  return document.getElementById(START_BUTTON_ID);
}

function showRandPicture(parentId) {
  var parent = document.getElementById(parentId);
  if (!parent) return;
  var img = new Image();
  img.setUrl(randPictureUrl());
  img.show(parentId);
}

function Image() {
  this.innerImg = document.createElement("img");
  this.innerImg.setAttribute("class", "show");
  // for IE
  this.innerImg.setAttribute("className", "show");
  this.innerImg.onerror = this.innerImgOnError;
  this.innerImg.onload = this.innerImgOnLoad;

  this.innerWrapper = document.createElement("a");
  this.innerWrapper.setAttribute("target", "_blank");
  this.innerWrapper.appendChild(this.innerImg);
};

Image.prototype.getUrl = function() {
  return this.innerImg.getAttribute("src");
}

Image.prototype.setUrl = function(url) {
  this.innerImg.setAttribute("src", url);
  this.innerWrapper.setAttribute("href", url);
  return this;
}

Image.prototype.show = function(parentId) {
  var parent = document.getElementById(parentId);
  insertFirst(parent, this.innerWrapper);
  this.innerImg.parentId = parentId;
  return this;
}

Image.prototype.innerImgOnError = function() {
  reloadImage(this);
}

Image.prototype.innerImgOnLoad = function() {
  if (!isImageExist(this)) reloadImage(this);
  nextImage(this);
}

function reloadImage(img) {
  setRandPicture(img);
}

function nextImage(img) {
  showRandPicture(img.parentId);
}

function setRandPicture(img) {
  var url = randPictureUrl();
  img.setAttribute("src", url);
  img.parentNode.setAttribute("href", url);
}

function insertFirst(parent, child) {
  if (parent.childNodes.length == 0) {
    parent.appendChild(child);
  } else {
    parent.insertBefore(child, parent.firstChild);
  }
}

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
  imageArea.insertFirst = insertFirst2;
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

function insertFirst2(child) {
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
