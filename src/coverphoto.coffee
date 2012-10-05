do ($) ->
  class CoverPhoto
    @cache: []; @cacheCount: 0
    @defaults:
      postUrl:  '/update_cover_photo'
      editable: false

    constructor: ({@el, @options}) ->
      @templates = coverphotoTemplates
      @setup()
      @cache()
      @render()
      @elements()
      @bindEvents()

    render: ->
      @addForm()
      @addActions() if @options.editable
      @addImage(@options.currentImage) if @options.currentImage

      $("canvas", @$el).attr "width",  @$el.width()
      $("canvas", @$el).attr "height", @$el.height()

    bindEvents: ->
      $(@$el).bind "mouseleave", @hideActions
      $(@$el).bind "mouseenter", @showActions
      
      $(@$el).delegate @actionsContainer.selector, "mouseleave", @hideActionsMenu
      $(@$el).delegate @fileInput.selector,        "change",     @handleFileSelected
      $(@$el).delegate @openMenuButton.selector,   "click",      @showActionsMenu
      $(@$el).delegate @uploadButton.selector,     "click",      @startUpload
      $(@$el).delegate @repositionButton.selector, "click",      @startReposition
      $(@$el).delegate @saveEditButton.selector,   "click",      @saveEdit
      $(@$el).delegate @cancelEditButton.selector, "click",      @cancelEdit
      

    setup: ->
      @options = $.extend(CoverPhoto.defaults, @options)
      html = @templates["src/templates/container.jst"]()
      @$el =  $(html).appendTo $(@el)

    cache: ->
      @$el.attr 'data-coverphoto-id', CoverPhoto.cacheCount
      CoverPhoto.cache[CoverPhoto.cacheCount] = @
      CoverPhoto.cacheCount++

    elements: ->
      @actionsContainer = $(".actions", @$el)
      @actions          = $(".chooser", @$el)
      @actionsMenu      = $(".chooser .menu", @$el)
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
      @originalImage = $(".coverphoto-photo-container img", @$el).attr("src")
      $(".coverphoto-photo-container", @$el).remove()
      @$el.append @templates["src/templates/image.jst"]({imageData})

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

    saveEdit: =>
      console.log "Saving to #{@options.postUrl}"

      @gatherImageData()
      @form.submit()
      @hideEditMenu()
      @endReposition()
      false

    cancelEdit: =>
      @addImage @originalImage if @originalImage
      @hideEditMenu()
      @endReposition()
      false

    startReposition: (evt = null) =>
      image = $(".coverphoto-photo-container img", @$el)
      makeImageDraggable = () =>
        yMax = -(image.height() - image.parent().height() - 10)
        image.draggable
          axis: "y"
          containment: [0,yMax,0,0]

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

  $.fn.CoverPhoto = (data) ->
    if data is 'get' and @.length is 1
      CoverPhoto.cache[$(@).data('coverphoto-id')]

    else
      @each ->
        new CoverPhoto
          el: @
          options: data