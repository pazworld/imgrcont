var WORK_AREA_ID = "workarea";

test("image shold be reload when error", function() {
  withWorkArea(function(wrkArea) {
    var imageArea = createImageArea(wrkArea);
    var numCalled = 0;
    Mock.make("randPictureUrl", function() {
      ++numCalled;
      if (numCalled == 1) return "error.png";
      if (numCalled == 2) return "ok.png";
    });
    //Mock.make("imageOnLoad", function() {});
    
    cmdShowNewImage();
    doLater(function() {
      var url = imageArea.firstChild.firstChild.getAttribute("src");
      equal(url, "ok.png", "is reloaded");
      Mock.revert_all();
    });
  });
});

test("cmdToggleStartButton should toggle button value "
    + "and call cmdShowNewImage.", function() {
  withWorkArea(function(wrkArea) {
    var button = document.createElement("button");
    button.id = START_BUTTON_ID;
    wrkArea.appendChild(button);
    
    buttonToggleTest(BUTTON_IS_RUNNING, BUTTON_NOT_RUNNING, false);
    buttonToggleTest(BUTTON_NOT_RUNNING, BUTTON_IS_RUNNING, true);
  });
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

test("insertFirst2 should insert element when no child node", function() {
  withWorkArea(function(wrkArea) {
    var e = document.createElement("div");
    wrkArea.insertFirst = insertFirst2;
    wrkArea.insertFirst(e);
    equal(wrkArea.childNodes.length, 1, "appended");
  });
});

test("insertFirst2 should insert element first when child node exists",
    function() {
  withWorkArea(function(wrkArea) {
    var e1 = document.createElement("div");
    var e2 = document.createElement("div");
    wrkArea.insertFirst = insertFirst2;
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

test("Image.setUrl should return that Image object itself", function() {
  var img = new Image();
  deepEqual(img.setUrl("ok.png"), img, "same Image object");
});

test("Image.getUrl should return same url which is set by setUrl",
    function() {
  var url = randPictureUrl();
  var img = (new Image()).setUrl(url);
  equal(img.getUrl(), url, "get same url that set");
});

test("Image should show as a child of specified element", function() {
  withWorkArea(function(wrkArea) {
    var img = (new Image()).setUrl("ok.png").show(wrkArea.id);
    insertedImg = wrkArea.firstChild.firstChild;
    equal(insertedImg.tagName, "IMG", "show as a child");
  });
});

test("Image.show should return that Image object itself", function() {
  withWorkArea(function(wrkArea) {
    var img = (new Image()).setUrl("ok.png");
    deepEqual(img.show(wrkArea.id), img, "same Image object");
  });
});

test("Image should be reloaded on error", function() {
  reloadTest("reloaded", "error.png", "ok.png");
});

test("Image should be reloaded when not exist", function() {
  reloadTest("reloaded", "not_exist.png", "ok.png");
});

test("showRandPicture should show random picture of imgur", function() {
  withWorkArea(function(wrkArea) {
    showRandPicture(wrkArea.id);
    var img = wrkArea.firstChild.firstChild;
    ok(img.nodeName.match(/img/i), "image element is inserted");
    ok(img.src.match(/imgur/i), "image source is imgur");
  });
});

test("insertFirst should append element when no child node", function() {
  withWorkArea(function(wrkArea) {
    equal(wrkArea.childNodes.length, 0, "when no child node");
    var e = document.createElement("div");
    insertFirst(wrkArea, e);
    equal(wrkArea.childNodes.length, 1, "appended");
  });
});

test("insertFirst should insert element first when child node exists",
    function() {
  withWorkArea(function(wrkArea) {
    var e1 = document.createElement("div");
    e1.setAttribute("class", "to be second");
    insertFirst(wrkArea, e1);
    equal(wrkArea.childNodes.length, 1, "when child node exists");

    var e2 = document.createElement("div");
    e2.setAttribute("class", "to be first");
    insertFirst(wrkArea, e2);
    equal(wrkArea.childNodes[0].getAttribute("class"),
      "to be first", "inserted first");
  });
});

test("call nextImage when load complete", function() {
  withWorkArea(function(wrkArea) {
    Mock.make("nextImage", function(img) { img.loaded = true; });
    var img = (new Image()).setUrl("ok.png");
    img.innerImg.loaded = false;
    img.show(wrkArea.id);
    doLater(function() {
      ok(img.innerImg.loaded, "nextImage is called");
      Mock.revert_all();
      start();
    });
  });
});

test("startButtonOnClick toggles startButton value Start and Stop",
    function() {
  withWorkArea(function(wrkArea) {
    var btn = createStartButton(wrkArea, "Start");
    equal(startButton().value, "Start", "when value is Start");

    startButtonOnClick();
    equal(startButton().value, "Stop", "toggle value to Stop");

    startButtonOnClick();
    equal(startButton().value, "Start", "toggle value to Start");
  });
});

test("startButtonIsRunning returns true if startButton value is 'Stop'",
    function() {
  withWorkArea(function(wrkArea) {
    var btn = createStartButton(wrkArea, "Stop");
    ok(startButtonIsRunning(), "returns true");
  });
});

test("startButtonIsRunning returns false if startButton value is 'Start'",
    function() {
  withWorkArea(function(wrkArea) {
    var btn = createStartButton(wrkArea, "Start");
    ok(!startButtonIsRunning(), "returns false");
  });
});

test("startButtonIsRunning returns false if startButton is not exist",
    function() {
  withWorkArea(function(wrkArea) {
    ok(!startButtonIsRunning(), "returns false");
  });
});

function buttonToggleTest(before, after, called) {
  var flgCallCmdShowNewImage = false;
  Mock.make("cmdShowNewImage", function() {
    flgCallCmdShowNewImage = true;
  });
  
  var button = document.getElementById(START_BUTTON_ID);
  button.value = before;
  cmdToggleStartButton();
  equal(button.value, after, "when button value " + before + " -> " + after);
  
  var msg = "not called";
  if (called) msg = "called";
  equal(flgCallCmdShowNewImage, called, "cmdShowNewImage is " + msg);
  
  Mock.revert_all();
}

function reloadTest(msg, filename, expected) {
  withWorkArea(function(wrkArea) {
    Mock.make("randPictureUrl", function() { return "ok.png"; });
    var img = (new Image()).setUrl(filename).show(wrkArea.id);
    doLater(function() {
      equal(img.getUrl(), expected, msg);
      Mock.revert_all();
    });
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
  var btn = document.createElement("button");
  btn.id = "startButton";
  btn.value = value;
  parent.appendChild(btn);
  return btn;
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
