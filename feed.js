function showRandPicture(parentId) {
  var img = createImg();
  setRandPicture(img);
  img.onload = function() {
    if (!isImageExist(img)) setRandPicture(img);
  };
  img.onerror = function() { setRandPicture(img); }
  var parent = document.getElementById(parentId);
  insertFirst(parent, img.parentNode);
}

function Image() {
  this.img = document.createElement("img");
  this.img.setAttribute("class", "show");
  // for IE
  this.img.setAttribute("className", "show");
  this.img.onload = this.onload;
  
  this.div = document.createElement("a");
  this.div.setAttribute("target", "_blank");
  this.div.appendChild(this.img);
};

Image.prototype.getUrl = function() {
  return this.url;
}

Image.prototype.setUrl = function(url) {
  this.url = url;
  this.img.setAttribute("src", url);
  this.div.setAttribute("href", url);
}

Image.prototype.show = function(parentId) {
  var parent = document.getElementById(parentId);
  insertFirst(parent, this.div);
}

Image.prototype.setOnError = function(func) {
  this.img.onerror = func;
}

function createImg() {
  var img = document.createElement("img");
  img.setAttribute("class", "show");
  // for IE
  img.setAttribute("className", "show");
  var div = document.createElement("a");
  div.setAttribute("target", "_blank");
  div.appendChild(img);
  return img;
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
