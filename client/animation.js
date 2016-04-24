if (Meteor.isClient) {

  Template.warning.rendered = function () {
    //Animate object
    var main = this.firstNode;
    if (main.parentNode != null) {
      if (main.parentNode._uihooks == undefined) {
        main.parentNode._uihooks = hooks;
        //force animation on first time render
        insertAnimation(main, main.nextSibling)
      }
    }
  };
  
}

//Animation states
var aniInitial = {
 'opacity': '0',
 'overflow': 'hidden',
 'height' : '0px'
};
var aniFinish = {
  'opacity': '1',
  'height': '36px'
};
var aniExit = {
  'opacity': '0',
  'height': '0px'
}
var OFFSCREEN_CLASS = 'off-screen';

//Configure UI hooks
hooks = {
  insertElement: function(node, next) {
    insertAnimation(node,next);
    Deps.afterFlush(function() {
      $(node).width();
      $(node).removeClass(OFFSCREEN_CLASS);
    });
  },
  moveElement: function(node, next) {
    hooks.removeElement(node);
    hooks.insertElement(node, next);
  },
  removeElement: function(node) {
    $(node)
      .velocity(aniExit, {
        duration: ANIMATION_DURATION,
        queue: false,
        complete: function() {
          $(node).remove();
        }
      });
  }
};

function insertAnimation(node, next) {
  $(node).addClass(OFFSCREEN_CLASS);
  $(node).css(aniInitial);
  $(node).insertBefore(next);
  $(node).velocity(aniFinish, {
    duration: ANIMATION_DURATION,
    queue: false
  });
}