var WORK_AREA_ID = "workarea";

test("image shold be reload when error", function() {
  imageEventTest("error.png",
    function(img) { img.onerror = imageOnError; });
});

test("image should be reload when not_exist", function() {
  imageEventTest("not_exist.png",
    function(img) { img.onload = imageOnLoad; });
});

test("new image should be inserted when load successfully", function() {
  makeWorkArea();
  var wrkArea = workArea();
  var imageArea = createImageArea(wrkArea);
  var img = createImage();
  imageArea.appendChild(img);
  var button = createStartButton(wrkArea, BUTTON_IS_RUNNING);
  var cmdShowNewImageCounter = 0;
  Mock.make("cmdShowNewImage", function() { cmdShowNewImageCounter++; });
  img.onload = imageOnLoad;
  img.setAttribute("src", "ok.png");
  doLater(function() {
    notEqual(cmdShowNewImageCounter, 0, "new image is loaded");
    Mock.revert_all();
    removeWorkArea();
  });
});

test("cmdToggleStartButton should toggle button value "
    + "and call cmdShowNewImage.", function() {
  buttonToggleTest(BUTTON_IS_RUNNING, BUTTON_NOT_RUNNING, false);
  buttonToggleTest(BUTTON_NOT_RUNNING, BUTTON_IS_RUNNING, true);
});

test("cmdShowNewImage should insert image first when other image exist",
    function() {
  withWorkArea(function(wrkArea) {
    var imageArea = createImageArea(wrkArea);
    var firstUrlInserted = function() {
      cmdShowNewImage();
      return imageArea.firstChild.getAttribute("href");
    }
    var url1 = firstUrlInserted();
    var url2 = firstUrlInserted();
    notEqual(url1, url2, "inserted first");
  });
});

test("cmdSetImageRandomUrl should set random url to image", function() {
  var img = createImage();
  var assignedUrl = function() {
    cmdSetImageRandomUrl(img);
    return img.getAttribute("src");
  }
  var url1 = assignedUrl();
  var url2 = assignedUrl();
  notEqual(url1, url2, "URL is random");
});

test("insertFirst should insert element when no child node", function() {
  withWorkArea(function(wrkArea) {
    var e = document.createElement("div");
    wrkArea.insertFirst = insertFirst;
    wrkArea.insertFirst(e);
    equal(wrkArea.childNodes.length, 1, "appended");
  });
});

test("insertFirst should insert element first when child node exists",
    function() {
  withWorkArea(function(wrkArea) {
    var e1 = document.createElement("div");
    var e2 = document.createElement("div");
    wrkArea.insertFirst = insertFirst;
    wrkArea.insertFirst(e1);
    wrkArea.insertFirst(e2);
    equal(wrkArea.firstChild, e2, "inserted first");
  });
});

test("createImage should return image element wrapped by anchor.", function() {
  var img = createImage();
  equal(img.tagName, "IMG", "have image element");
  equal(img.parentNode.tagName, "A", "wrapped by anchor element");
});

test("isImageExist should return true if image isn't not_exist.png",
    function() {
  isImageExistTest("check image exist", "ok.png", true);
  isImageExistTest("check image not exist", "not_exist.png", false);
});

test("randPictureUrl should return URL of random picture of imgur", function() {
  notEqual(randPictureUrl(), randPictureUrl(), "URL is random");
  ok(randPictureUrl().match(/imgur/i), "URL is imgur");
});

test("makeKey should return random string which length is 5", function() {
  notEqual(makeKey(), makeKey(), "string is random");
  equal(makeKey().length, 5, "string length is 5");
});

test("randChar should return random string which length is 1", function() {
  notEqual(randChar(), randChar(), "string is random");
  equal(randChar().length, 1, "string length is 1");
});

function imageEventTest(filename, funcForImage) {
  withWorkArea(function(wrkArea) {
    var imageArea = createImageArea(wrkArea);
    var img = createImage();
    imageArea.appendChild(img);
    var button = createStartButton(wrkArea, BUTTON_IS_RUNNING);
    Mock.make("cmdShowNewImage", function() {});
    funcForImage(img);
    img.setAttribute("src", filename);
    doLater(function() {
      notEqual(img.getAttribute("src"), filename, "reloaded");
      Mock.revert_all();
    });
  });
}

function buttonToggleTest(before, after, called) {
  withWorkArea(function(wrkArea) {
    var flgCallCmdShowNewImage = false;
    Mock.make("cmdShowNewImage", function() {
      flgCallCmdShowNewImage = true;
    });
    
    var button = createStartButton(wrkArea, before);
    cmdToggleStartButton();
    equal(button.value, after, "when button value " + before + " -> " + after);
    
    var msg = "not called";
    if (called) msg = "called";
    equal(flgCallCmdShowNewImage, called, "cmdShowNewImage is " + msg);
    
    Mock.revert_all();
  });
}

function isImageExistTest(msg, filename, expected) {
  var img = createImage();
  img.setAttribute("src", filename);
  doLater(function() {
    equal(isImageExist(img), expected, msg);
  });
}

function createStartButton(parent, value) {
  var button = document.createElement("button");
  button.id = START_BUTTON_ID;
  button.value = value;
  parent.appendChild(button);
  return button;
}

function doLater(func) {
  stop();
  setTimeout(function() {
    func();
    start();
  }, 300);
}

function withWorkArea(func) {
  makeWorkArea();
  func(workArea());
  removeWorkArea();
}

function makeWorkArea() {
  var w = document.createElement("div");
  w.id = WORK_AREA_ID;
  baseDiv().appendChild(w);
}

function removeWorkArea() {
  baseDiv().removeChild(workArea());
}

function workArea() {
  return document.getElementById(WORK_AREA_ID);
}

function baseDiv() {
  return document.getElementById("qunit");
}

function createImageArea(parent) {
  var div = document.createElement("div");
  div.id = IMAGE_AREA_ID;
  parent.appendChild(div);
  return div;
}
