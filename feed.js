function showRandPicture(parentId) {
  var img = createImg();
  setRandPicture(img);
  img.onload = function() {
    if (!isImageExist(img)) setRandPicture(img);
  };
  img.onerror = function() { setRandPicture(img); }
  var parent = document.getElementById(parentId);
  insertFirst(parent, img);
}

function createImg() {
  var img = document.createElement("img");
  img.setAttribute("class", "show");
  // for IE
  img.setAttribute("className", "show");
  return img;
}

function setRandPicture(img) {
  img.setAttribute("src", randPictureUrl());
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
