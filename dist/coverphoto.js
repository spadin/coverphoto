/*! Cover Photo - v0.1.0 - 2012-10-05
* https://github.com/sandropadin/coverphoto
* Copyright (c) 2012 Sandro Padin; Licensed MIT */

this["coverphotoTemplates"] = this["coverphotoTemplates"] || {};

this["coverphotoTemplates"]["src/templates/actions.jst"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="actions">\n  <ul class="chooser">\n    <li class="open-menu item"><a href="#change_cover_photo">Change cover photo</a></li>\n    <ul class="menu">\n      <li class="upload item"><a href="#upload_cover_photo">Upload new photo</a></li>\n      <!-- <li class="reposition item"><a href="#reposition_cover_photo">Reposition current photo</a></li> -->\n    </ul>\n  </ul>\n  <ul class="edit">\n    <li class="cancel item"><a href="#cancel">Cancel</a></li>\n    <li class="save item"><a href="#save">Save</a></li>\n  </ul>\n</div>';
}
return __p;
};

this["coverphotoTemplates"]["src/templates/container.jst"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="coverphoto-container">\n  <canvas class=\'output\'>\n</div>';
}
return __p;
};

this["coverphotoTemplates"]["src/templates/form.jst"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<form action="'+
( postUrl )+
'" class="coverphoto-form" method="post" enctype="multipart/form-data">\n  <input type="file" name="coverphoto[original]" accept="image/*">\n  <input type="hidden" name="coverphoto[cropped]">\n</form>';
}
return __p;
};

this["coverphotoTemplates"]["src/templates/image.jst"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="coverphoto-photo-container">\n  <img src="'+
( imageData )+
'" width="1024">\n</div>';
}
return __p;
};
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($) {
    var CoverPhoto;
    CoverPhoto = (function() {

      CoverPhoto.cache = [];

      CoverPhoto.cacheCount = 0;

      CoverPhoto.defaults = {
        postUrl: '/update_cover_photo',
        editable: false
      };

      function CoverPhoto(_arg) {
        this.el = _arg.el, this.options = _arg.options;
        this.handleFileSelected = __bind(this.handleFileSelected, this);

        this.endReposition = __bind(this.endReposition, this);

        this.startReposition = __bind(this.startReposition, this);

        this.cancelEdit = __bind(this.cancelEdit, this);

        this.saveEdit = __bind(this.saveEdit, this);

        this.startUpload = __bind(this.startUpload, this);

        this.hideEditMenu = __bind(this.hideEditMenu, this);

        this.showEditMenu = __bind(this.showEditMenu, this);

        this.hideActionsMenu = __bind(this.hideActionsMenu, this);

        this.showActionsMenu = __bind(this.showActionsMenu, this);

        this.showActions = __bind(this.showActions, this);

        this.hideActions = __bind(this.hideActions, this);

        this.templates = coverphotoTemplates;
        this.setup();
        this.cache();
        this.render();
        this.elements();
        this.bindEvents();
      }

      CoverPhoto.prototype.render = function() {
        this.addForm();
        if (this.options.editable) {
          this.addActions();
        }
        if (this.options.currentImage) {
          this.addImage(this.options.currentImage);
        }
        $("canvas", this.$el).attr("width", this.$el.width());
        return $("canvas", this.$el).attr("height", this.$el.height());
      };

      CoverPhoto.prototype.bindEvents = function() {
        $(this.$el).bind("mouseleave", this.hideActions);
        $(this.$el).bind("mouseenter", this.showActions);
        $(this.$el).delegate(this.actionsContainer.selector, "mouseleave", this.hideActionsMenu);
        $(this.$el).delegate(this.fileInput.selector, "change", this.handleFileSelected);
        $(this.$el).delegate(this.openMenuButton.selector, "click", this.showActionsMenu);
        $(this.$el).delegate(this.uploadButton.selector, "click", this.startUpload);
        $(this.$el).delegate(this.repositionButton.selector, "click", this.startReposition);
        $(this.$el).delegate(this.saveEditButton.selector, "click", this.saveEdit);
        return $(this.$el).delegate(this.cancelEditButton.selector, "click", this.cancelEdit);
      };

      CoverPhoto.prototype.setup = function() {
        var html;
        this.options = $.extend(CoverPhoto.defaults, this.options);
        html = this.templates["src/templates/container.jst"]();
        return this.$el = $(html).appendTo($(this.el));
      };

      CoverPhoto.prototype.cache = function() {
        this.$el.attr('data-coverphoto-id', CoverPhoto.cacheCount);
        CoverPhoto.cache[CoverPhoto.cacheCount] = this;
        return CoverPhoto.cacheCount++;
      };

      CoverPhoto.prototype.elements = function() {
        this.actionsContainer = $(".actions", this.$el);
        this.actions = $(".chooser", this.$el);
        this.actionsMenu = $(".chooser .menu", this.$el);
        this.editMenu = $(".edit", this.$el);
        this.cancelEditButton = $(".edit .cancel a", this.$el);
        this.saveEditButton = $(".edit .save a", this.$el);
        this.openMenuButton = $(".chooser .open-menu a", this.$el);
        this.uploadButton = $(".chooser .upload a", this.$el);
        this.repositionButton = $(".chooser .reposition a", this.$el);
        this.form = $("form", this.$el);
        this.fileInput = $("input[name='coverphoto[original]']", this.$el);
        this.hiddenImageInput = $("input[name='coverphoto[cropped]']", this.$el);
        return this.canvas = $("canvas", this.$el);
      };

      CoverPhoto.prototype.addForm = function() {
        return this.$el.append(this.templates["src/templates/form.jst"](this.options));
      };

      CoverPhoto.prototype.addActions = function() {
        return this.$el.append(this.templates["src/templates/actions.jst"](this.options));
      };

      CoverPhoto.prototype.addImage = function(imageData) {
        this.originalImage = $(".coverphoto-photo-container img", this.$el).attr("src");
        $(".coverphoto-photo-container", this.$el).remove();
        return this.$el.append(this.templates["src/templates/image.jst"]({
          imageData: imageData
        }));
      };

      CoverPhoto.prototype.hideActions = function() {
        return this.actions.fadeOut();
      };

      CoverPhoto.prototype.showActions = function() {
        if (!this.editMenu.is(":visible")) {
          return this.actions.fadeIn();
        }
      };

      CoverPhoto.prototype.showActionsMenu = function() {
        this.actionsMenu.show();
        return false;
      };

      CoverPhoto.prototype.hideActionsMenu = function(evt) {
        return this.actionsMenu.hide();
      };

      CoverPhoto.prototype.showEditMenu = function() {
        this.editMenu.show();
        return this.actions.hide();
      };

      CoverPhoto.prototype.hideEditMenu = function() {
        this.editMenu.hide();
        return this.actions.show();
      };

      CoverPhoto.prototype.startUpload = function() {
        this.fileInput.click();
        return false;
      };

      CoverPhoto.prototype.saveEdit = function() {
        console.log("Saving to " + this.options.postUrl);
        this.gatherImageData();
        this.form.submit();
        this.hideEditMenu();
        this.endReposition();
        return false;
      };

      CoverPhoto.prototype.cancelEdit = function() {
        if (this.originalImage) {
          this.addImage(this.originalImage);
        }
        this.hideEditMenu();
        this.endReposition();
        return false;
      };

      CoverPhoto.prototype.startReposition = function(evt) {
        var image, makeImageDraggable,
          _this = this;
        if (evt == null) {
          evt = null;
        }
        image = $(".coverphoto-photo-container img", this.$el);
        makeImageDraggable = function() {
          var yMax;
          yMax = -(image.height() - image.parent().height() - 10);
          return image.draggable({
            axis: "y",
            containment: [0, yMax, 0, 0]
          });
        };
        if (image.height() > 0) {
          makeImageDraggable();
        } else {
          image.load(makeImageDraggable);
        }
        this.showEditMenu();
        if (evt != null) {
          this.hideActionsMenu();
        }
        return false;
      };

      CoverPhoto.prototype.endReposition = function() {
        var image;
        image = $(".coverphoto-photo-container img", this.$el);
        return image.draggable("destroy");
      };

      CoverPhoto.prototype.handleFileSelected = function(evt) {
        var file, reader,
          _this = this;
        file = evt.target.files[0];
        reader = new FileReader();
        reader.onload = function(evt) {
          _this.addImage(evt.target.result);
          return _this.startReposition();
        };
        return reader.readAsDataURL(file);
      };

      CoverPhoto.prototype.gatherImageData = function() {
        var context, dataUrl, height, image, width;
        image = $(".coverphoto-photo-container img", this.$el);
        context = this.canvas[0].getContext("2d");
        width = image.width();
        height = image.height();
        context.drawImage(image[0], 0, image.position().top, width, height);
        dataUrl = this.canvas[0].toDataURL("image/png");
        return this.hiddenImageInput.val(dataUrl);
      };

      return CoverPhoto;

    })();
    return $.fn.CoverPhoto = function(data) {
      if (data === 'get' && this.length === 1) {
        return CoverPhoto.cache[$(this).data('coverphoto-id')];
      } else {
        return this.each(function() {
          return new CoverPhoto({
            el: this,
            options: data
          });
        });
      }
    };
  })($);

}).call(this);
