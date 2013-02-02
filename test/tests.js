var WORK_AREA_ID = "workarea";
var QUNIT_FRAME_ID = "qunit";

// tests with workArea, imageArea, startButton and ajaxLoader.

module("", {
  setup: function() {
    var qunitFrame = getQUnitFrame();
    var wrkArea = createWorkArea(qunitFrame);
    var imageArea = createImageArea(wrkArea);
    var startButton = createStartButton(wrkArea, BUTTON_IS_RUNNING);
    var loader = createAjaxLoader(wrkArea);
  },
  teardown: function() {
    removeWorkArea();
  }
});

test("new image should be inserted when load successfully", function() {
  var counter = new Counter();
  Mock.make("cmdShowNewImage", function() { counter.countUp(); });
  
  var imageArea = getImageArea();
  var img = createImage();
  imageArea.appendChild(img);
  img.onload = imageOnLoad;
  img.setAttribute("src", "ok.png");
  
  doLater(function() {
    notEqual(counter.count, 0, "new image is loaded");
    Mock.revert_all();
  });
});

test("image should be done when load successfully", function() {
  Mock.make("cmdShowNewImage", function() {});
  
  var imageArea = getImageArea();
  var img = createImage();
  imageArea.appendChild(img);
  img.onload = imageOnLoad;
  img.setAttribute("src", "ok.png");
  
  doLater(function() {
    equal(img.getAttribute("done"), "true", "set done");
    Mock.revert_all();
  });
});

test("image shold be reload when error", function() {
  reloadTest({
    setEvent: function(img) { img.onerror = imageOnError; },
    whenImageIs: "error.png"
  });
});

test("image should be reload when not_exist", function() {
  reloadTest({
    setEvent: function(img) { img.onload = imageOnLoad; },
    whenImageIs: "not_exist.png"
  });
});

test("cmdToggleStartButton should toggle button value "
    + "and call cmdShowNewImage when start.", function() {
  var counter = new Counter();
  Mock.make("cmdShowNewImage", function() { counter.countUp(); });
  
  setStartButtonRunning();
  cmdToggleStartButton();
  equal(isRunning(), false, "toggle to stop when running");
  equal(counter.count, 0, "without call cmdShowNewImage");
  
  cmdToggleStartButton();
  equal(isRunning(), true, "toggle to start when not running");
  notEqual(counter.count, 0, "with call cmdShowNewImage");
  
  Mock.revert_all();
});

test("cmdShowNewImage should insert image first when other image exist",
    function() {
  var imageArea = getImageArea();
  var firstUrlInserted = function() {
    cmdShowNewImage();
    return imageArea.firstChild.getAttribute("href");
  }
  var url1 = firstUrlInserted();
  var url2 = firstUrlInserted();
  notEqual(url1, url2, "inserted first");
});

test("cmdClearImages should remove except one images when running",
    function() {
  setStartButtonRunning();
  var imageArea = getImageArea();
  var img;
  for (i = 0; i < 3; i++) {
    img = createImage();
    imageArea.appendChild(img.parentNode);
  }
  cmdClearImages();
  equal(imageArea.childNodes.length, 1, "done removed");
});

test("cmdClearImages should remove all images when not running", function() {
  setStartButtonNotRunning();
  var imageArea = getImageArea();
  var img;
  for (i = 0; i < 3; i++) {
    img = createImage();
    imageArea.appendChild(img.parentNode);
  }
  cmdClearImages();
  equal(imageArea.childNodes.length, 0, "done removed");
});

test("insertFirst should insert element when no child node", function() {
  var imageArea = getImageArea();
  var img = createImage();
  insertFirst(imageArea, img);
  equal(imageArea.childNodes.length, 1, "appended");
});

test("insertFirst should insert element first when child node exists",
    function() {
  var imageArea = getImageArea();
  var createAndInsertImage = function() {
    img = createImage();
    cmdSetImageRandomUrl(img);
    insertFirst(imageArea, img);
    return img;
  };
  var img1 = createAndInsertImage();
  var img2 = createAndInsertImage();
  equal(imageArea.firstChild, img2, "inserted first");
});

test("isRunning should return true "
    + "when startButton value is BUTTON_IS_RUNNING", function() {
  var button = getStartButton();
  setStartButtonRunning();
  equal(isRunning(), true, "true when BUTTON_IS_RUNNING");
  
  setStartButtonNotRunning();
  equal(isRunning(), false, "false when BUTTON_IS_RUNNING");
});

test("isImageExist should return true if image isn't not_exist.png",
    function() {
  isImageExistTest("check image exist", "ok.png", true);
  isImageExistTest("check image not exist", "not_exist.png", false);
});

test("setAjaxLoaderStart should make ajaxLoader visible", function() {
  setAjaxLoaderStart();
  equal(getAjaxLoader().style.visibility, "visible", "visible");
});

test("setAjaxLoaderStop should make ajaxLoader invisible", function() {
  setAjaxLoaderStop();
  equal(getAjaxLoader().style.visibility, "hidden", "invisible");
});

// tests without workArea, imageArea and startButton.

module("");

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

test("setImageCallback shoud set callbacks", function() {
  var img = createImage();
  setImageCallback(img);
  equal(img.onload, imageOnLoad, "set callbacks");
});

test("createImage should return image element wrapped by anchor.", function() {
  var img = createImage();
  equal(img.tagName, "IMG", "have image element");
  equal(img.parentNode.tagName, "A", "wrapped by anchor element");
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

function reloadTest(setting) {
  var imageArea = getImageArea();
  var img = createImage();
  imageArea.appendChild(img);
  setting.setEvent(img);
  img.setAttribute("src", setting.whenImageIs);
  
  doLater(function() {
    notEqual(img.getAttribute("src"), setting.whenImageIs, "reload");
  });
}

function isImageExistTest(msg, filename, expected) {
  var imageArea = getImageArea();
  var img = createImage();
  imageArea.appendChild(img);
  img.setAttribute("src", filename);
  doLater(function() {
    equal(isImageExist(img), expected, msg);
  });
}

function doLater(func) {
  stop();
  setTimeout(function() {
    func();
    start();
  }, 300);
}

// for QUnitFrame

function getQUnitFrame() {
  return document.getElementById(QUNIT_FRAME_ID);
}

// for workArea

function getWorkArea() {
  return document.getElementById(WORK_AREA_ID);
}

function createWorkArea(parent) {
  var w = createElementWithId({
    type: "div", parent: parent, id: WORK_AREA_ID });
  return w;
}

function removeWorkArea() {
  var qunitFrame = getQUnitFrame();
  var workArea = getWorkArea();
  qunitFrame.removeChild(workArea);
}

// for imageArea

function createImageArea(parent) {
  var div = createElementWithId({
    type: "div", parent: parent, id: IMAGE_AREA_ID });
  return div;
}

// for startButton

function createStartButton(parent, value) {
  var button = createElementWithId({
    type: "button", parent: parent, id: START_BUTTON_ID });
  button.value = value;
  return button;
}

// for ajaxLoader

function createAjaxLoader(parent) {
  var loader = createElementWithId({
    type: "img", parent: parent, id: AJAX_LOADER_ID });
  return loader;
}

function createElementWithId(args) {
  var elem = document.createElement(args.type);
  elem.id = args.id;
  args.parent.appendChild(elem);
  return elem;
}

function Counter() {
  this.count = 0;
  this.countUp = function() { this.count++; };
}
