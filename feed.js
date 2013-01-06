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

function startButtonOnClick(obj) {
  if (obj.value == "Stop") {
    obj.value = "Start";
    return;
  }
  obj.value = "Stop";
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

function randPictureUrl() {
  return "http://i.imgur.com/" + makeKey() + ".jpg";
}

function makeKey() {
  var key = "";
  for (var i = 0; i < 5; i++) {
    key += randChar();
  }
  return key;
}

function randChar() {
  var chars="0123456789"
    + "abcdefghijklmnopqrstuvwxyz"
    + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  index = parseInt(Math.random() * chars.length);
  return chars.charAt(index);
}

function insertFirst(parent, child) {
  if (parent.childNodes.length == 0) {
    parent.appendChild(child);
  } else {
    parent.insertBefore(child, parent.firstChild);
  }
}

function isImageExist(img) {
  if (img.width == 161 && img.height == 81) return false;
  return true;
}
