var WORK_AREA_ID = "workarea";

test("Image should have image element wrapped by anchor", function() {
  var img = new Image();
  equal(img.innerImg.tagName, "IMG", "have image element");
  equal(img.innerWrapper.tagName, "A", "wrapped by anchor element");
});

test("Image should get and set url of image", function() {
  var img = new Image();
  var url = randPictureUrl();
  img.setUrl(url);
  equal(img.getUrl(), url, "get same url that set");
});

test("Image should show as a child of specified element", function() {
  withWorkArea(function(wrkArea) {
    var img = new Image();
    img.setUrl("ok.png");
    img.show(wrkArea.id);
    
    insertedImg = wrkArea.firstChild.firstChild;
    equal(insertedImg.tagName, "IMG", "show as a child");
  });
});

test("Image should be reloaded when on error", function() {
  withWorkArea(function(wrkArea) {
    var img = new Image();
    Mock.make("randPictureUrl", function() { return "ok.png"; });
    img.setUrl("error.png");
    img.show(wrkArea.id);
    doLater(function() {
      equal(img.getUrl(), "ok.png", "reloaded");
      Mock.revert_all();
    });
  });
});

test("Image should be reloaded when not exist", function() {
  withWorkArea(function(wrkArea) {
    var img = new Image();
    Mock.make("randPictureUrl", function() { return "ok.png"; });
    img.setUrl("not_exist.png");
    img.show(wrkArea.id);
    doLater(function() {
      equal(img.getUrl(), "ok.png", "reloaded");
      Mock.revert_all();
    });
  });
});

test("makeKey should return random string which length is 5", function() {
  notEqual(makeKey(), makeKey(), "string is random");
  equal(makeKey().length, 5, "string length is 5");
});

test("randChar should return random string which length is 1", function() {
  notEqual(randChar(), randChar(), "string is random");
  equal(randChar().length, 1, "string length is 1");
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
    wrkArea.appendChild(e1);
    equal(wrkArea.childNodes.length, 1, "when child node exists");
    
    var e2 = document.createElement("div");
    e2.setAttribute("class", "to be first");
    insertFirst(wrkArea, e2);
    equal(wrkArea.childNodes[0].getAttribute("class"),
      "to be first", "inserted first");
  });
});

test("isImageExist should return true if image isn't not_exist.png",
    function() {
  isImageExistTest("check image exist", "ok.png", true);
  isImageExistTest("check image not exist", "not_exist.png", false);
});

test("image should be reloaded when not exist", function() {
  reloadTest("not_exist.png");
});

test("image should be reloaded on error", function() {
  reloadTest("something.png");
});

function doLater(func) {
  stop();
  setTimeout(function() {
    func();
    start();
  }, 100);
}

function isImageExistTest(msg, filename, expected) {
  withWorkArea(function(wrkArea) {
    var img = createImg();
    wrkArea.appendChild(img);
    img.setAttribute("src", filename);
    stop();
    setTimeout(function() {
      equal(isImageExist(img), expected, msg);
      start();
    }, 100);
  });
}

function reloadTest(filename) {
  withWorkArea(function(wrkArea) {
    showRandPicture(wrkArea.id);
    var img = wrkArea.firstChild.firstChild;
    img.setAttribute("src", filename);
    Mock.make("randPictureUrl", function() { return "ok.png"; });
    stop();
    setTimeout(function() {
      ok(img.src.match("ok.png"), "image is reloaded");
      Mock.revert_all();
      start();
    }, 100);
  });
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
