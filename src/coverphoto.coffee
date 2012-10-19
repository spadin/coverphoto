do ($) ->
  class CoverPhoto
    @defaults:
      editable: false
      post:
        url: null
        field: 'coverphoto[cropped]'

    constructor: ({@el, @options}) ->
      @options = $.extend(true, CoverPhoto.defaults, @options)
      @templates = CoverPhotoTemplates
      @setEl()
      @render()
      @elements()
      @bindEvents()

    render: ->
      @addForm()
      @addActions() if @options.editable
      @addImage @options.currentImage if @options.currentImage

      $(".actions", @$el).css "top", @$el.height() - 35
      $("canvas", @$el).attr "width",  @$el.width()
      $("canvas", @$el).attr "height", @$el.height()

    on: (args...)->
      if args.length is 3
        [evt, selector, handler] = args
        $(@$el).delegate selector, evt, handler

      else if args.length is 2
        [evt, handler] = args
        $(@$el).bind evt, handler

    bindEvents: ->
      @on "coverPhotoUpdated", @handleCoverPhotoUpdated
      @on "mouseleave", @hideActions
      @on "mouseenter", @showActions
      @on "mouseleave", @actionsContainer.selector, @hideActionsMenu
      @on "change",     @fileInput.selector,        @handleFileSelected
      @on "click",      @openMenuButton.selector,   @showActionsMenu
      @on "click",      @uploadButton.selector,     @startUpload
      @on "click",      @repositionButton.selector, @startReposition
      @on "click",      @saveEditButton.selector,   @saveEdit
      @on "click",      @cancelEditButton.selector, @cancelEdit

    setEl: ->
      html = @templates["src/templates/container.jst"]()
      @$el =  $(html).appendTo $(@el)

    elements: ->
      @actionsContainer = $(".actions", @$el)
      @actions          = $(".chooser", @$el)
      @actionsMenu      = $(".chooser .sub-menu", @$el)
      @editMenu         = $(".edit", @$el)
      @cancelEditButton = $(".edit .cancel a", @$el)
      @saveEditButton   = $(".edit .save a", @$el)
      @openMenuButton   = $(".chooser .open-menu a", @$el)
      @uploadButton     = $(".chooser .upload a", @$el)
      @repositionButton = $(".chooser .reposition a", @$el)
      @form             = $("form", @$el)
      @fileInput        = $("input[name='coverphoto[original]']", @$el)
      @hiddenImageInput = $("input[name='coverphoto[cropped]']", @$el)
      @canvas           = $("canvas", @$el)

    addForm: ->
      @$el.append @templates["src/templates/form.jst"] @options

    addActions: ->
      @$el.append @templates["src/templates/actions.jst"] @options

    addImage: (imageData) ->
      imageWidth = @$el.width()
      @originalImage = $(".coverphoto-photo-container img", @$el).attr("src")
      $(".coverphoto-photo-container", @$el).remove()
      @$el.append @templates["src/templates/image.jst"]({imageData, imageWidth})

    hideActions: =>
      @actions.fadeOut()

    showActions: =>
      @actions.fadeIn() unless @editMenu.is(":visible")

    showActionsMenu: =>
      @actionsMenu.show()
      false

    hideActionsMenu: (evt) =>
      @actionsMenu.hide()

    showEditMenu: =>
      @editMenu.show()
      @actions.hide()

    hideEditMenu: =>
      @editMenu.hide()
      @actions.show()

    startUpload: =>
      @fileInput.click()
      false

    resetFileInputField: ->
      form = @fileInput.parent()
      @fileInput.remove()
      $('<input type="file" name="coverphoto[original]" accept="image/*">')
        .appendTo form
      @fileInput = $("input[name='coverphoto[original]']", @$el)

    handleCoverPhotoUpdated: (evt, dataUrl) =>
      @form.submit() if @options.post.url?

    saveEdit: =>
      dataUrl = @gatherImageData()
      @resetFileInputField()
      @hideEditMenu()
      @endReposition()
      @$el.trigger("coverPhotoUpdated", dataUrl)
      false

    cancelEdit: =>
      @addImage @originalImage if @originalImage
      @hideEditMenu()
      @endReposition()
      false

    startReposition: (evt = null) =>
      image = $(".coverphoto-photo-container img", @$el)
      makeImageDraggable = () =>
        pPos = image.parents(".coverphoto-container").offset()
        yMax = -(image.height() - image.parent().height() - pPos.top)
        
        image.draggable
          axis: "y"
          containment: [0,yMax,0,pPos.top]

      if image.height() > 0
        makeImageDraggable()
      else
        image.load makeImageDraggable
      
      @showEditMenu()
      @hideActionsMenu() if evt?
      false

    endReposition: =>
      image = $(".coverphoto-photo-container img", @$el)
      image.draggable("destroy")

    handleFileSelected: (evt) =>
      file = evt.target.files[0]
      reader = new FileReader()
      reader.onload = (evt) =>
        @addImage(evt.target.result)
        @startReposition()
      reader.readAsDataURL(file)

    gatherImageData: ->
      image   = $(".coverphoto-photo-container img", @$el)
      context = @canvas[0].getContext("2d")
      width   = image.width()
      height  = image.height()

      context.drawImage(image[0], 0, image.position().top, width, height)
      
      dataUrl = @canvas[0].toDataURL("image/png")
      @hiddenImageInput.val(dataUrl)

      dataUrl

  $.fn.CoverPhoto = (data) ->
    @each ->
      new CoverPhoto
        el: @
        options: data