Tango.include ( "TSystem" ) ;
Tango.include ( "TComponents" ) ;
Tango.include ( "animator" ) ;

/**
 *  @constructor
 */
TTimer = function ( timeoutMillis, callback )
{
  if ( typeof ( callback.timedout ) == 'function' )
  {
    this.callback = callback.timedout.bind ( callback ) ;
  }
  else
  if ( typeof ( callback ) == 'function' )
  {
    this.callback = callback;
  }
  else
  {
    throw "TTimer: Neither callback.timedout nor callback is a function." ;
  }
  this.timeoutMillis = timeoutMillis ;
  if ( this.timeoutMillis < 1 )
  {
    this.timeoutMillis = 1000 ;
  }
  this.currentlyExecuting = false;
  this.intervallId = null ;
  this.initialDelayMillis = this.timeoutMillis ;
  this.boundFunction = this.onTimerEvent.bind(this) ;
  this.first = true ;
  this.repeats = true ;
} ;
TTimer.prototype =
{
  flush: function()
  {
    this.stop() ;
    this.boundFunction = null ;
  },
  toString: function()
  {
    return "(TTimer)"
         + "[initial-delay=" + this.initialDelayMillis
         + ",timeout=" + this.timeoutMillis 
         + ",repeats=" + this.repeats 
         + "]"
         ;
  },
  setRepeats: function ( state )
  {
    this.repeats = state ;
  },
  setInitialDelay: function ( delayMillis )
  {
    this.initialDelayMillis = delayMillis ;
    if ( this.initialDelayMillis < 1 )
    {
      this.initialDelayMillis = 1 ;
    } 
  },
  isRunning: function() { return !this.intervallId ; },
  start: function()
  {
    this.first = true ;
    this.intervallId = window.setInterval(this.boundFunction, this.initialDelayMillis ) ;
  },
  stop: function()
  {
    if ( this.intervallId ) window.clearInterval ( this.intervallId ) ;
    this.intervallId = null ;
  },
  restart: function()
  {
    this.stop() ;
    this.start() ;
  },
  onTimerEvent: function()
  {
    if ( ! this.intervallId ) return ;
    if ( !this.currentlyExecuting )
    {
      try
      {
        this.currentlyExecuting = true;
        this.callback(this);
        if ( ! this.repeats )
        {
          this.stop() ;
          return ;
        }
        if ( ! this.intervallId ) return ;
        if ( this.first )
        {
          this.first = false ;
          if ( this.timeoutMillis != this.initialDelayMillis )
          {
            window.clearInterval ( this.intervallId ) ;
            this.intervallId = window.setInterval(this.boundFunction, this.timeoutMillis ) ;
          }
        }
      }
      catch ( exc )
      {
        TSys.log ( "TTimer:\n" + String ( exc ) ) ;
        this.stop() ;
      }
      finally
      {
        this.currentlyExecuting = false;
      }
    }
  }
};
//--------------------- TWorkingPanel ---------
/**
 *  @constructor
 */
var TWorkingPanel = function ( delay, text )
{
  this.jClassName = "TWorkingPanel" ;
  this.delay = 2000 ;
  this.progressBarSeconds = 10 ;
  this.progressBarShowPercent = false ;
  this.progressBarShowSeconds = false ;
  this.showProgressBar = true ;
  this.cancel = false ;
  this.opacity = 0.3 ;
  this.showIndicator = false ;
  this.indicatorName = "img/Spinning_wheel_throbber.gif" ;
  this.indicatorName = "img/progress_meter.gif" ;
  this.backgroundColor = '#000000' ;
  this.showThumbOnly = false ;

  this.text = text ;

  var txml = Tango.getThemeXml ( "Globals/WorkingPanel" ) ;
  if ( txml )
  {
    var op = txml.getFloatAttribute ( "opacity", -1 ) ;
    if ( op >= 0 ) this.opacity = op ;
    var bg = txml.getAttribute ( "background-color" ) ;
    if ( bg ) this.backgroundColor = bg ;
  }
  if ( typeof ( delay ) == 'undefined' )
  {
    this.delay = 2000 ;
  }
  else
  if ( ! delay && typeof ( delay ) == 'object' )
  {
    this.delay = 2000 ;
  }
  else
  if ( typeof ( delay ) == 'number' )
  {
    this.delay = delay ;
    if ( this.delay < 0 ) this.delay = 2000 ;
  }
  else
  if ( delay && typeof ( delay ) == 'object' )
  {
    if ( typeof ( delay.delay ) == 'number' ) this.delay = delay.delay ;
    if ( typeof ( delay.progressBarSeconds ) == 'number' ) this.delay = delay.progressBarSeconds ;
    if ( typeof ( delay.text ) == 'string' ) this.text = delay.text ;
    this.progressBarShowPercent = delay.progressBarShowPercent ;
    this.progressBarShowSeconds = delay.progressBarShowSeconds ;
    if ( typeof ( delay.cancel ) == 'function' ) this.cancel = delay.cancel ;
    if ( typeof ( delay.showProgressBar ) == 'boolean' )
      this.showProgressBar = delay.showProgressBar ;
    if ( typeof ( delay.opacity ) == 'number' )
      this.opacity = delay.opacity ;
    if ( ! this.showProgressBar ) this.showIndicator = true ;
    if ( typeof ( delay.showIndicator ) == 'boolean' )
      this.showIndicator = delay.showIndicator ;
    if ( delay.backgroundColor && typeof ( delay.backgroundColor ) == 'string' )
      this.backgroundColor = delay.backgroundColor ;
    if ( typeof ( delay.showThumbOnly ) == 'boolean' )
      this.showThumbOnly = delay.showThumbOnly ;
  }
  if ( ! this.progressBarShowPercent ) this.progressBarShowPercent = false ;
  else                                 this.progressBarShowPercent = true ;

  if ( ! this.text ) this.text = TSys.translate ( "AMomentPlease" ) ;
  else               this.text = TSys.translate ( this.text ) ;

  if ( this.delay > 0 )
  {
    this.timer = new TTimer ( this.delay, this ) ;
    this.timer.setRepeats ( false ) ;
    this.timer.start() ;
  }
  else
  {
    this.timedout() ;
  }
  this._type = 1 ;
};
TWorkingPanel.prototype._cancel = function ( event )
{
  this.close ( event ) ;
  if ( typeof ( this.cancel ) == 'function' )
  {
    this.cancel ( event ) ;
    this.cancel = undefined ;
  }
};
TWorkingPanel.prototype.close = function ( event )
{
  this.closing = true ;
  if ( this.timer )
  {
    this.timer.flush() ;
  }
  if ( this.progessbar )
  {
    this.progessbar.stop() ;
  }
  if ( TSys.isIE6() )
  {
    TGui.setAllInputVisible ( null, TGui.getBoundsOnPageOf ( this.mdiv ), true ) ;
  }
  if ( this.dPanel )
  {
    TGui.flushAttributes ( this.dPanel ) ;
    this.dPanel.parentNode.removeChild ( this.dPanel ) ;
  }
  if ( this.eThrobber ) //&& this.eThrobber.parentNode )
  {
    this.eThrobber.parentNode.removeChild ( this.eThrobber ) ;
  }
  if ( this.mdiv )
  {
    TGui.flushAttributes ( this.mdiv ) ;
    this.mdiv.parentNode.removeChild ( this.mdiv ) ;
  }
  this.dPanel = null ;
  this.mdiv = null ;
  document.body.style.cursor = "default" ;
};
TWorkingPanel.prototype.timedout = function ( timer )
{
  if ( this.closing )
  {
    return ;
  }
  var wSize = TGui.getBrowserWindowSize() ;
  // ------------ background panel -------------------

  this.mdiv = document.createElement ( "div" ) ;
  this.mdiv.style.position = "absolute" ;
  this.mdiv.className = "ModalDiv" ;
  this.mdiv.style.zIndex = TGui.zIndexMDivWorkingPanel ;
  this.mdiv.style.visibility = "hidden" ;
  document.body.appendChild ( this.mdiv ) ;
  document.body.style.cursor = "wait" ;
  this.mdiv.id = TSys.getTempId() ;

  var backgroundColor = this.backgroundColor ;
  var opacity = this.opacity ;
  var throbberStyle = "" ;
  var aResult ;
  var txml ;
  var x ;
  var y ;
  if ( this.showIndicator )
  {
    txml = Tango.getThemeXml ( "Misc", "throbber" ) ;
    if ( txml )
    {
      throbberStyle = txml.getAttribute ( "style" ) ;
      if ( throbberStyle )
      {
        if ( throbberStyle.indexOf ( "background-color" ) >= 0 )
        {
          aResult = TGui.parseStyle ( throbberStyle, "background-color" ) ;
          if ( aResult )
	  {
	    throbberStyle = aResult[0] ;
	    backgroundColor = aResult[1] ;
	  }
        }
        if ( throbberStyle.indexOf ( "opacity" ) >= 0 )
        {
          aResult = TGui.parseStyle ( throbberStyle, "opacity" ) ;
          if ( aResult )
	  {
	    throbberStyle = aResult[0] ;
	    opacity = parseFloat ( aResult[1] ) ;
	  }
        }
      }
    }
  }

  if ( backgroundColor ) this.mdiv.style.backgroundColor = backgroundColor ;
  if ( ! isNaN ( opacity ) ) TGui.setOpacity ( this.mdiv, opacity ) ;

  if ( TSys.isIE6() )
  {
    TGui.setAllInputEnabled ( null, new TRectangle ( 0, 0, wSize.width, wSize.height ), false ) ;
  }
  this.mdiv.style.top = "0px" ;
  this.mdiv.style.left = "0px" ;
  this.mdiv.style.width = wSize.width + "px" ;
  this.mdiv.style.height = wSize.height + "px" ;
  this.mdiv.style.visibility = "visible" ;

  // ------------ working panel ----------------------

  var axl = new TXml() ;
  var xCont = axl.add ( "Container" ) ;
  xCont = xCont.add ( "Container" ) ;
  if ( this.showIndicator )
  {
    var xImg = xCont.add ( "img" ) ;
    txml = Tango.getThemeXml ( "Misc", "throbber" ) ;
    if ( ! txml )
    {
      xImg.addAttribute ( "src", this.indicatorName ) ;
      xImg.addAttribute ( "style", 'width:32px;height:32px;' ) ;
    }
    else
    {
      xImg.addAttribute ( "src", TGui.buildThemeImageUrl ( "Misc", "throbber", NaN, NaN ) ) ;
      if ( throbberStyle ) xImg.addAttribute ( "style", throbberStyle ) ;
    }
    this.eThrobber = TGui.createElement ( axl ) ;
    document.body.appendChild ( this.eThrobber ) ;

    x = Math.floor ( ( wSize.width - this.eThrobber.offsetWidth ) / 2 ) ;
    y = Math.floor ( ( wSize.height - this.eThrobber.offsetHeight ) / 2 ) ;
    this.eThrobber.style.left = x + "px" ;
    this.eThrobber.style.top = y + "px" ;
    this.eThrobber.style.zIndex = TGui.zIndexMDivWorkingPanel ;
  }
  else
  if ( this.showProgressBar )
  {
    txml = Tango.getThemeXml ( "ContainerDecoration", "working.panel" ) ;
    if ( txml )
    {
      xCont.addAttribute ( "decoration", 'working.panel' ) ;
    }
    var xLabel = xCont.add ( "Label", this.text ) ;
    xLabel.addAttribute ( "style", 'right:-0;text-align:center;' ) ;
    xCont.add ( "br" ) ;
    var xProgressbar = xCont.add ( "Progressbar" ) ;
    xProgressbar.addAttribute ( "style", 'width:200px;height:16px;right:4px;' ) ;
    xProgressbar.addAttribute ( "name", 'PBar' ) ;

    if ( this.cancel )
    {
      xCont.add ( "br" ) ;
      var xPB = xCont.add ( "PushButton" ) ;
      xPB.addAttribute ( "text", TSys.translate ( "Cancel" ) ) ;
      xPB.addAttribute ( "style", "align-center:x;" ) ;
      xPB.addAttribute ( "name", "PB.Cancel" ) ;
    }
    this.dPanel = TGui.createElement ( axl ) ;
    this.dPanel.style.zIndex = TGui.zIndexMDivWorkingPanel ;
    document.body.appendChild ( this.dPanel ) ;
    var c = new TContainer ( this.dPanel ) ;
    this.progessbar = c.getPeer ( 'PBar' ) ;
    this.progessbar.showPercent ( this.progressBarShowPercent ) ;
    this.progessbar.showSeconds ( this.progressBarShowSeconds ) ;
    if ( this.showThumbOnly )
    {
      this.progessbar.start() ;
    }
    else
    {
      this.progessbar.startAuto ( this.progressBarSeconds ) ;
    }

    this.pbCancel = c.getComponent ( 'PB.Cancel' ) ;
    if ( this.pbCancel )
    {
      this.pbCancel.addEventListener ( "click", this, this._cancel ) ;
    }

    x = Math.floor ( ( wSize.width - this.dPanel.offsetWidth ) / 2 ) ;
    y = Math.floor ( ( wSize.height - this.dPanel.offsetHeight ) / 2 ) ;
    this.dPanel.style.left = x + "px" ;
    this.dPanel.style.top = y + "px" ;
    this.dPanel.modalDivId = this.mdiv.id ;
  }
};
/**
 *  @constructor
 */
TMultiform = function ( xml )
{
  TMultiform.prototype.counter++ ;
  this._counter = TMultiform.prototype.counter ;
  this.jsClassName = "TMultiform" ;
  this.name = "TMultiform$" + this._counter ;
  this.selectedIndex = 0 ;
  this.isNotebook = false ;
  if ( xml.nodeName.toUpperCase() == 'NOTEBOOK' ) this.isNotebook = true ;
  this.div = null ;
  this.tabformId = xml.getAttribute ( "id" ) ;
  this.notebookTop = null ;
  this.notebookBody = null ;
  this.selectionHandler = null ;
  this.selectionListener = [] ;
  this.closeListener = [] ;
  var onchange = xml.getAttribute ( "onchange" ) ;
  if ( onchange )
  {
    this.addSelectionListener ( new TFunctionExecutor ( onchange ) ) ;
  }
  var onclose = xml.getAttribute ( "onclose" ) ;
  if ( onclose )
  {
    this.addCloseListener ( new TFunctionExecutor ( onclose ) ) ;
  }

  this.formList = [] ;
  this.buttonList = [] ;
  this.closerIdList = [] ;
  this.closerButtonList = [] ;
  this.buttonExtensionLeft = 2 ;
  this.buttonExtensionRight = 2 ;
  this.buttonExtensionShiftY = 2 ;
  this.buttonExtensionHeight = 3 ;
  var txml = Tango.getThemeXml ( "NotebookButton", "selected" ) ;
  if ( txml )
  {
    this.buttonExtensionLeft = txml.getIntAttribute ( "extend-left", this.buttonExtensionLeft ) ;
    this.buttonExtensionRight = txml.getIntAttribute ( "extend-right", this.buttonExtensionRight ) ;
    this.buttonExtensionShiftY = txml.getIntAttribute ( "shift-y", this.buttonExtensionShiftY ) ;
    this.buttonExtensionHeight = txml.getIntAttribute ( "extend-height", this.buttonExtensionHeight ) ;
  }
  var x = new TXml ( xml ) ;
  this._autoDeselect = x.getBoolAttribute ( "auto-deselect", false ) ;
};
TMultiform.prototype =
{
  counter: 0,
  reset: function (  )
  {
    for ( var i = 0 ; i < this.formList.length ; i++ )
    {
      var form = this.formList[i] ;
      if ( form.jsPeer && form.jsPeer.reset )
      {
        if ( ! form.jsPeer.reset() ) continue ;
      }
      new TXml ( form ).reset() ;
    }
  },
  setClassImages: function ( pp, ppp  )
  {
    if ( ! this.isNotebook ) return ;
    var txml = Tango.getThemeXml ( "NotebookButtonCloser", "normal" ) ;
    var w = txml.getIntAttribute ( "width", 14 ) ;
    var h = txml.getIntAttribute ( "height", w ) ;
    var url = TGui.buildThemeImageUrl ( "NotebookButtonCloser", "normal", w, h ) ;
    for ( var i = 0 ; i < this.buttonList.length ; i++ )
    {
//      this.buttonList[i].xLayouted = false ;
      TGui.layoutNotebookButton ( this.buttonList[i] ) ;
      if ( ! this.buttonList[i].eCloser ) continue ;
      this.buttonList[i].eCloser.style.width = w + "px" ;
      this.buttonList[i].eCloser.style.height = h + "px" ;
      this.buttonList[i].eCloser.src = url ;
    }
    this.buttonExtensionLeft = 2 ;
    this.buttonExtensionRight = 2 ;
    this.buttonExtensionShiftY = 2 ;
    this.buttonExtensionHeight = 3 ;
    txml = Tango.getThemeXml ( "NotebookButton", "selected" ) ;
    if ( txml )
    {
      this.buttonExtensionLeft = txml.getIntAttribute ( "extend-left", this.buttonExtensionLeft ) ;
      this.buttonExtensionRight = txml.getIntAttribute ( "extend-right", this.buttonExtensionRight ) ;
      this.buttonExtensionShiftY = txml.getIntAttribute ( "shift-y", this.buttonExtensionShiftY ) ;
      this.buttonExtensionHeight = txml.getIntAttribute ( "extend-height", this.buttonExtensionHeight ) ;
    }
    txml = Tango.getThemeXml ( "Notebook", "background" ) ;
    if ( txml ) this.notebookBody.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "Notebook", "background" ) ;
//    else        this.notebookBody.style.backgroundImage = "none" ;
    txml = Tango.getThemeXml ( "NotebookTop", "normal" ) ;
    if ( txml )
    {
      w = this.notebookTop.offsetWidth ;
      h = this.notebookTop.offsetHeight ;
      this.notebookTop.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "NotebookTop", "normal", "-1", h ) ;
    }
    else
    {
      this.notebookTop.style.backgroundImage = "NONE" ;
    }
  },
  getNumberOfItems: function()
  {
    return this.formList.length ;
  },
  setVisible: function ( state )
  {
    if ( state ) this.div.style.visibility = "inherit" ;
    else this.div.style.visibility = "hidden" ;
  },
  isVisible: function()
  {
    return TGui.getComputedStyle ( this.div ) != "hidden" ;
  },
  addSelectionListener: function ( functionExecutor )
  {
    this.selectionListener.push ( functionExecutor ) ;
  },
  addCloseListener: function ( functionExecutor )
  {
    this.closeListener.push ( functionExecutor ) ;
  },
  toString: function()
  {
    return "(" + this.jsClassName + ")"
         + "\n type=" + ( this.isNotebook ? "Notebook" : "Multiform" )
         ;
  },
  setTabformId: function ( tabformId )
  {
    this.tabformId = tabformId ;
  },
  add: function ( xml, attributes, callback )
  {
    var extId = null ;
    var xCont = null ;
    if ( typeof ( xml ) == 'string' )
    {
      if ( xml.indexOf ( ">" ) > 0 && xml.indexOf ( "<" ) >= 0 )
      {
        var xDocument = TSys.parseDom ( xml ) ;
        xCont = new TXml ( xDocument ).getDom() ;
        this.__add ( xml, xCont, extId ) ;
      }
      else
      {
        var id = xml ;
        extId = xml ;
        if ( extId.endsWith ( ".axl" ) )
        {
          extId = extId.substring ( 0, extId.lastIndexOf ( ".axl" ) ) ;
        }
        if ( typeof ( callback ) != 'function' )
        {
          xCont = TSys.getAxl ( xml, attributes ) ;
          this.__add ( xml, xCont, extId ) ;
          return ;
        }
        else
        {
          var thiz = this ;
          xCont = TSys.getAxl ( xml, attributes, function ( HTTP )
            {
              var x = new TXml ( HTTP.responseXML.documentElement ) ;
              var xx = x.getDom() ;
              thiz.__add ( xml, xx, extId ) ;
              thiz.select ( id ) ;
              callback ( thiz.getSelectedForm() ) ;
            }
          ) ;
          return ;
        }
      }
    }
    else
    if ( typeof ( xml ) == 'object' )
    {
      if ( xml.jsClassName == 'TXml' )
      {
        xCont = xml.domRoot ;
      }
      else
      {
        xCont = xml ;
      }
      this.__add ( xml, xCont, extId ) ;
    }
  },
  _extractPopupMenu: function ( xCont )
  {
    if ( xCont.firstChild )
    {
      for ( var ch = xCont.firstChild ; ch ; ch = ch.nextSibling )
      {
        if ( ch.nodeName == "PopupMenu" )
        {
          return new PopupMenuWrapper ( new TXml ( xCont ) ) ;
        }
        if ( ch.nodeType == DOM_ELEMENT_NODE )
        {
          break ;
        }
      }
    }
  },
  __add: function ( xml, xCont, extId )
  {
    var tempId ;
    var id ;
    var width ;
    var w ;
    var h ;
    var style ;
    var path ;
    var name ;
    var reset ;
    var clazz ;
    var a ;
    var jsPeer ;
    var pagelet ;
    var newDiv ;
    var styleList ;
    var i ;
    var str ;
    var pos ;
    var value ;
    var ctx ;
    var externalAttributes ;
    var onload ;
    var height ;
    var onchange ;
    var layoutContext ;
    var focusElement ;
    if ( ! this.isNotebook )
    {
      id = xCont.getAttribute ( "id" ) ;
      style = xCont.getAttribute ( "style" ) ;
      path = xCont.getAttribute ( "path" ) ;
      name = xCont.getAttribute ( "name" ) ;
      reset = xCont.getAttribute ( "reset" ) ;
      clazz = xCont.getAttribute ( "class" ) ;
      if ( ! clazz ) clazz = "ThemeMultiformBody" ;
  this._extractPopupMenu ( xCont ) ;

      tempId = TSys.getTempId() ;
      a = [] ;
      if ( ! id ) id = tempId ;
      TGui._addPeer ( a, xCont ) ;
      jsPeer = a["jsPeer"] ;
      pagelet = null ;

      newDiv = document.createElement ( "div" ) ;
      newDiv.className = clazz ;
      newDiv.id = id ;
      if ( path ) newDiv.path = path ;
      if ( name ) newDiv.name = name ;
      if ( reset ) newDiv.reset = reset ;
      newDiv.xClassName = "MultiformBody" ;

      newDiv.style.position = "absolute" ;
      newDiv.style.top = 0 + "px" ;
      newDiv.style.left = 0 + "px" ;
      newDiv.style.margin = 0 + "px" ;
      newDiv.style.padding = 0 + "px" ;
      newDiv.style.visibility = "hidden" ;

      var onclick = xCont.getAttribute ( "onclick" ) ;
      var ondblclick = xCont.getAttribute ( "ondblclick" ) ;
      if ( onclick || ondblclick )
      {
        if ( onclick )
        {
          newDiv.fExecutor = new TFunctionExecutor ( onclick ) ;
          this.addEventListener ( newDiv, "click", TGui.mouseClicked.bindAsEventListener ( TGui ) ) ;
          if ( ! ondblclick )
          {
            this.addEventListener ( newDiv, "dblclick", TGui.consumeEvent.bindAsEventListener ( TGui ) ) ;
          }
        }
        if ( ondblclick )
        {
          newDiv.fExecutor = new TFunctionExecutor ( ondblclick ) ;
          TGui.addEventListener ( newDiv, "dblclick", TGui.mouseClicked.bindAsEventListener ( TGui ) ) ;
        }
      }
      newDiv.xProperties = TGui.collectExtendedProperties ( xCont ) ;
      if ( jsPeer )
      {
        newDiv.jsPeer = jsPeer ;
        if ( typeof ( jsPeer.isPagelet ) == 'function' && jsPeer.isPagelet() ) pagelet = jsPeer ;
      }
      if ( style )
      {
        styleList = style.split ( ';' ) ;
        for ( i = 0 ; i < styleList.length ; i++ )
        {
          str = styleList[i].trim() ;
          if ( ! str ) continue ;
          pos = str.indexOf ( ':' ) ;
          if ( pos < 2 ) continue ;
          var n = str.substring ( 0, pos ).trim().toUpperCase() ;
          value = str.substring ( pos + 1 ).trim() ;
          if ( ! n || ! value ) continue ;
          if ( n == "OVERFLOW" ) newDiv.style.overflow = value ;
          if ( n == "BACKGROUND-COLOR" ) newDiv.style.backgroundColor = value ;
          if ( n == "COLOR" ) newDiv.style.color = value ;
          if ( n == "PADDING" ) newDiv.style.padding = value ;
          if ( n == "PADDING-TOP" ) newDiv.style.paddingTop = value ;
          if ( n == "PADDING-LEFT" ) newDiv.style.paddingLeft = value ;
          if ( n == "PADDING-BOTTOM" ) newDiv.style.paddingBottom = value ;
          if ( n == "PADDING-RIGHT" ) newDiv.style.paddingRight = value ;
        }
      }
      ctx = new TCreateHtmlContext() ;
      externalAttributes = new Array() ;
      onload = xCont.getAttribute ( "onload" ) ;
      if ( pagelet ) ctx.pushPagelet ( pagelet ) ;
      if ( onload ) ctx.addOnLoad ( onload, id, ctx ) ;
      newDiv.innerHTML = TGui.createHtmlContainer ( new TXEnum ( xCont ), externalAttributes, ctx ) ;
      if ( pagelet ) ctx.popPagelet ( pagelet ) ;

      newDiv.xConstraints = new TConstraints() ;
      newDiv.xConstraints.parseBottom ( "-1" ) ;
      newDiv.xConstraints.parseRight ( "-1" ) ;

      onchange = xCont.getAttribute ( "onchange" ) ;
      layoutContext = new LayoutContext() ;
      if ( pagelet ) layoutContext.pushPagelet ( pagelet ) ;
      if ( onchange )
      {
        newDiv.listenerContext = new ListenerContext ( onchange, newDiv, layoutContext ) ;
        layoutContext.setListenerContext ( newDiv.listenerContext ) ;
      }

      width = TGui.getComputedStyleInt ( this.div, "width" ) ;
      height = TGui.getComputedStyleInt ( this.div, "height" ) ;
      this.div.appendChild ( newDiv ) ;
      newDiv.style.width = width + "px" ;
      newDiv.style.height = height + "px" ;
      if ( jsPeer && jsPeer.layout )
      {
        jsPeer.layout ( newDiv, externalAttributes, "", layoutContext ) ;
      }
      TGui.layout ( newDiv, externalAttributes, null, layoutContext ) ;
      if ( pagelet ) layoutContext.popPagelet ( pagelet ) ;
      externalAttributes.length = 0 ;

      if ( jsPeer && jsPeer.resized )
      {
        jsPeer.resized ( new TDimension ( newDiv.offsetWidth, newDiv.offsetHeight ) ) ;
      }
      TGui.layoutConstraints ( newDiv, true ) ;
      TGui.setClassImages ( newDiv, true ) ;
      this.formList.push ( newDiv ) ;
      ctx.executeOnLoad() ;

      focusElement = layoutContext.focusElement ;
      if ( ! focusElement ) focusElement = layoutContext.firstTextField ;
      if ( ! focusElement ) focusElement = layoutContext.firstINPUT ;
      newDiv._pendingFocusElement = focusElement ;
    }
    else
    {
      var label = xCont.getAttribute ( "label" ) ;
      if ( ! label ) label = "Tab " + this.buttonList.length ;
      var img   = xCont.getAttribute ( "img" ) ;
      if ( img )
      {
        if ( img.indexOf ( "/" ) < 0 ) img = "img/" + img ;
        if ( img.startsWith ( "Tango/" ) )
        {
          var aa = img.split ( "/" ) ;
          if ( aa.length == 3 )
          {
            img = TGui.buildThemeImageUrl ( aa[1], aa[2], NaN, NaN ) ;
          }
        }
      }
      var tooltip = xCont.getAttribute ( "tooltip" ) ;
      var disabled = xCont.getAttribute ( "disabled" ) ;
      if ( String ( disabled ) == 'true' ) disabled = true ;
      else                                 disabled = false ;
      var closable = xCont.getAttribute ( "closable" ) ;
      if ( String ( closable ) == 'true' ) closable = true ;
      else                                 closable = false ;

      if ( xCont.firstChild )
      {
        var ch = xCont.firstChild ;
        while ( ch )
        {
          if ( ch.nodeName == "Tooltip" )
          {
            tooltip = ch.firstChild.nodeValue ;
            break ;
          }
          if ( ch.nodeType == DOM_ELEMENT_NODE )
          {
            break ;
          }
          ch = ch.nextSibling ;
        }
      }
      tempId = TSys.getTempId() ;
      id = tempId ;
      var buttonDiv = document.createElement ( "div" ) ;
      buttonDiv.id = TSys.getTempId() ;
      buttonDiv.style.position = "absolute" ;
      buttonDiv.style.whiteSpace = "nowrap" ;
      buttonDiv.xClassName = "NotebookButton" ;

      var sHtml = null ;
      var p = TGui.renderShortcutText ( label ) ;
      label = p.text ;

      if ( img )
      {
        sHtml = "<img src='" + img + "' class='ButtonImage' /><span class='ButtonText' >" + label + "</span>" ;
      }
      else
      {
        sHtml = "<span class='ButtonText' >" + label + "</span>" ;
      }

      var closerId = null ;
      if ( closable )
      {
        closerId = TSys.getTempId() ;
        var txml = Tango.getThemeXml ( "NotebookButtonCloser", "normal" ) ;
        w = txml.getIntAttribute ( "width", 14 ) ;
        h = txml.getIntAttribute ( "height", w ) ;
        var url = TGui.buildThemeImageUrl ( "NotebookButtonCloser", "normal", w, h ) ;
        sHtml += "&nbsp;<img style='padding:0px;margin:0px;width:" + w + "px;height:" + h + "px;' class='ThemeNotebookButtonCloser' id='" + closerId + "' src='" + url + "' />" ;
      }

      buttonDiv.innerHTML = sHtml ;

      var topButton = this.buttonList[this.buttonList.length-1] ;
      var left = topButton.offsetLeft ;
      width = topButton.offsetWidth ;

      if ( this.selectedIndex == this.buttonList.length-1 )
      {
        left += this.buttonExtensionLeft ;
        width -= this.buttonExtensionLeft + this.buttonExtensionRight ;
      }

      this.notebookTop.appendChild ( buttonDiv ) ;
      buttonDiv.className = "ThemeNotebookButton" ;
      buttonDiv.style.left = ( left + width ) + "px" ;

      if ( Tango.ua.opera && Tango.ua.operaVersion < 10.5 )
      {
        buttonDiv.style.top = ( this.buttonExtensionHeight ) + "px" ;
      }
      else buttonDiv.style.top = 0 + "px" ;

      TGui.layoutNotebookButton ( buttonDiv ) ;

      if ( p.shortcutCharacter )
      {
        var fe = new TFunctionExecutor ( this, this._shortcutCallback, [ this.buttonList.length ] ) ;
        TGlobalEventHandler.addToShortCutList ( p.shortcutCharacter, this.div, fe ) ;
      }
      this.buttonList.push ( buttonDiv ) ;

      TGui.addEventListener ( buttonDiv, "mousedown", this.buttonMouseDown.bindAsEventListener ( this, buttonDiv ) ) ;
      TGui.addEventListener ( buttonDiv, "mouseover", this.buttonStateHandler.bindAsEventListener ( this, buttonDiv, "inside" ) ) ;
      TGui.addEventListener ( buttonDiv, "mouseout", this.buttonStateHandler.bindAsEventListener ( this, buttonDiv, "normal" ) ) ;
      TGui.addEventListener ( buttonDiv, "mouseup", this.buttonStateHandler.bindAsEventListener ( this, buttonDiv, "inside" ) ) ;

      if ( closerId )
      {
        var cl = document.getElementById ( closerId ) ;
        this.closerButtonList.push ( cl ) ;
        w = cl.offsetWidth ;
        h = cl.offsetHeight ;
        cl.xClassName = "NotebookButtonCloser" ;
        cl.src = TGui.buildThemeImageUrl ( "NotebookButtonCloser", "normal", w, h ) ;
        TGui.addEventListener ( cl, "mousedown", this.closerStateHandler.bindAsEventListener ( this, cl, "pressed" ) ) ;
        TGui.addEventListener ( cl, "mouseover", this.closerStateHandler.bindAsEventListener ( this, cl, "inside" ) ) ;
        TGui.addEventListener ( cl, "mouseout", this.closerStateHandler.bindAsEventListener ( this, cl, "normal" ) ) ;
        TGui.addEventListener ( cl, "mouseup", this.closerMouseUp.bindAsEventListener ( this, cl ) ) ;
      }
      else
      {
        this.closerButtonList.push ( null ) ;
      }
      tempId = TSys.getTempId() ;

      id = xCont.getAttribute ( "id" ) ;
      style = xCont.getAttribute ( "style" ) ;
      path = xCont.getAttribute ( "path" ) ;
      name = xCont.getAttribute ( "name" ) ;
      reset = xCont.getAttribute ( "reset" ) ;
      clazz = xCont.getAttribute ( "class" ) ;
      if ( ! clazz ) clazz = "Container" ;

      a = [] ;
      if ( ! id ) id = tempId ;
      TGui._addPeer ( a, xCont ) ;
      jsPeer = a["jsPeer"] ;
      pagelet = null ;

      newDiv = document.createElement ( "div" ) ;
      newDiv.className = clazz ;
      newDiv.id = id ;
      if ( path ) newDiv.path = path ;
      if ( name ) newDiv.name = name ;
      if ( reset ) newDiv.reset = reset ;

      newDiv.xClassName = "Container" ;

      newDiv.style.position = "absolute" ;
      newDiv.style.top = 0 + "px" ;
      newDiv.style.left = 0 + "px" ;
      newDiv.style.visibility = "hidden" ;

      newDiv.xProperties = TGui.collectExtendedProperties ( xCont ) ;
      if ( jsPeer )
      {
        newDiv.jsPeer = jsPeer ;
        if ( typeof ( jsPeer.isPagelet ) == 'function' && jsPeer.isPagelet() ) pagelet = jsPeer ;
      }
      if ( style )
      {
        styleList = style.split ( ';' ) ;
        for ( i = 0 ; i < styleList.length ; i++ )
        {
          str = styleList[i].trim() ;
          if ( ! str ) continue ;
          pos = str.indexOf ( ':' ) ;
          if ( pos < 2 ) continue ;
          name = str.substring ( 0, pos ).trim().toUpperCase() ;
          value = str.substring ( pos + 1 ).trim() ;
          if ( ! name || ! value ) continue ;
          if ( name == "OVERFLOW" ) newDiv.style.overflow = value ;
          if ( name == "BACKGROUND-COLOR" ) newDiv.style.backgroundColor = value ;
          if ( name == "COLOR" ) newDiv.style.color = value ;
          if ( name == "PADDING" ) newDiv.style.padding = value ;
          if ( name == "PADDING-TOP" ) newDiv.style.paddingTop = value ;
          if ( name == "PADDING-LEFT" ) newDiv.style.paddingLeft = value ;
          if ( name == "PADDING-BOTTOM" ) newDiv.style.paddingBottom = value ;
          if ( name == "PADDING-RIGHT" ) newDiv.style.paddingRight = value ;
        }
      }
      ctx = new TCreateHtmlContext() ;
      externalAttributes = [] ;
      var extImgArray = new Array() ;

      onload = xCont.getAttribute ( "onload" ) ;
      if ( pagelet ) ctx.pushPagelet ( pagelet ) ;
      if ( onload ) ctx.addOnLoad ( onload, id, ctx ) ;
      newDiv.innerHTML = TGui.createHtmlContainer ( new TXEnum ( xCont ), externalAttributes, ctx, extImgArray ) ; // executeOnLoad DONE
      if ( pagelet ) ctx.popPagelet ( pagelet ) ;

      newDiv.xConstraints = new TConstraints() ;
      newDiv.xConstraints.parseBottom ( "-1" ) ;
      newDiv.xConstraints.parseRight ( "-1" ) ;

      width = TGui.getComputedStyleInt ( this.notebookBody, "width" ) ;
      height = TGui.getComputedStyleInt ( this.notebookBody, "height" ) ;
      this.notebookBody.appendChild ( newDiv ) ;
      newDiv.style.width = width + "px" ;
      newDiv.style.height = height + "px" ;

      onchange = xCont.getAttribute ( "onchange" ) ;
      layoutContext = new LayoutContext() ;
      if ( pagelet ) layoutContext.pushPagelet ( pagelet ) ;
      if ( onchange )
      {
        newDiv.listenerContext = new ListenerContext ( onchange, newDiv, layoutContext ) ;
        layoutContext.setListenerContext ( newDiv.listenerContext ) ;
      }

      if ( jsPeer && jsPeer.layout )
      {
        jsPeer.layout ( newDiv, externalAttributes, "", layoutContext ) ;
      }
      TGui.layout ( newDiv, externalAttributes, null, layoutContext ) ;
      if ( pagelet ) layoutContext.popPagelet ( pagelet ) ;
      externalAttributes.length = 0 ;

      if ( jsPeer && jsPeer.resized )
      {
        jsPeer.resized ( new TDimension ( newDiv.offsetWidth, newDiv.offsetHeight ) ) ;
      }
      TGui.layoutConstraints ( newDiv, true ) ;
      this.formList.push ( newDiv ) ;

      this.setButtonDecoration ( "normal" ) ;
      TGui.setClassImages ( newDiv, true ) ;
      ctx.executeOnLoad() ;

      focusElement = layoutContext.focusElement ;
      if ( ! focusElement ) focusElement = layoutContext.firstTextField ;
      if ( ! focusElement ) focusElement = layoutContext.firstINPUT ;
      newDiv._pendingFocusElement = focusElement ;
    }
  },
  createHtmlContainer: function ( xElem, externalAttributes, ctx, extImgArray, sHtmlArray  )
  {
    var containerEnum ;
    var imgArray ;
    var xCont ;
    var a ;
    var tempId ;
    var name ;
    var n ;
    var desktop ;
    var id ;
    var path ;
    var text ;
    var img ;
    var tooltip ;
    var closable ;
    var txml ;
    var visibility ;
    var style ;
    var aResult ;
    var clazz ;
    var onchange ;
    var onload ;
    var onclick ;
    var ondblclick ;
    var jsPeer ;
    var pagelet ;
    var droptarget ;
    var xProperties ;
    var popup ;
    var en ;
    var i ;
    if ( ! this.isNotebook )
    {
      containerEnum = new TXEnum ( xElem, "Container" ) ;
      i = 0 ;
      while  ( containerEnum.hasNext() )
      {
        xCont = containerEnum.next() ;
        if ( xCont.getAttribute ( "selected" ) === 'true' )
        {
          this.selectedIndex = i ;
        }
        i++ ;
      }
      containerEnum.reset() ;
      i = 0 ;
      while  ( containerEnum.hasNext() )
      {
        xCont = containerEnum.next() ;
        if ( xCont.getAttribute ( "ignore" ) )
        {
          continue  ;
        }
        id = xCont.getAttribute ( "id" ) ;
        style = xCont.getAttribute ( "style" ) ;
        if ( style && style.indexOf ( "right" ) >= 0 )
        {
          aResult = TGui.parseStyle ( style, "right" ) ;
          if ( aResult )
          {
            style = aResult[0] ;
          }
        }
        path = xCont.getAttribute ( "path" ) ;
        name = xCont.getAttribute ( "name" ) ;
        clazz = xCont.getAttribute ( "class" ) ;
        if ( ! clazz ) clazz = "ThemeMultiformBody" ;
        onchange = xCont.getAttribute ( "onchange" ) ;
        onload = xCont.getAttribute ( "onload" ) ;
        onclick = xCont.getAttribute ( "onclick" ) ;
        ondblclick = xCont.getAttribute ( "ondblclick" ) ;

        tempId = "O" + TSys.getCounter() ;
        a = new Array() ;
        externalAttributes[tempId] = a ;
        desktop = xCont.getAttribute ( "desktop" ) ;
        if ( desktop == "true" ) a["desktop"] = desktop ;

        TGui._addPeer ( a, xCont ) ;
        jsPeer = a["jsPeer"] ;
        pagelet = null ;
        if ( jsPeer )
        {
          if ( typeof ( jsPeer.isPagelet ) == 'function' && jsPeer.isPagelet() ) pagelet = jsPeer ;
        }

        if ( pagelet ) ctx.pushPagelet ( pagelet ) ;
        if ( id )
        {
          a["orgId"] = id ;
          if ( onload ) ctx.addOnLoad ( onload, id, ctx ) ;
        }
        else
        {
          if ( onload ) ctx.addOnLoad ( onload, tempId, ctx ) ;
        }
        if ( path ) a["path"] = path ;
        if ( name ) a["name"] = name ;
        if ( onchange ) a["onchange"] = onchange ;
        droptarget = xCont.getAttribute ( "droptarget" ) ;
        if ( droptarget ) a["droptarget"] = droptarget ;

        a["xClassName"] = "MultiformBody" ;
        xProperties = TGui.collectExtendedProperties ( xCont ) ;
        if ( xProperties ) a["xProperties"] = xProperties ;
        if ( onclick ) a["onclick"] = onclick ;
        if ( ondblclick ) a["ondblclick"] = ondblclick ;

        popup = this._extractPopupMenu ( xCont ) ;

        visibility = "visibility:hidden;" ;
        if ( i === this.selectedIndex )
        {
          visibility = "" ;
        }

        if ( popup )
        {
          a["popup"] = popup ;
        }
        var s = "<div class='" + clazz + "' id='" + tempId + "'"
          + " style='position:absolute;top:0px;left:0px;padding:0px;margin:0px;" + visibility
          ;
          if ( style ) s += style ;
          s += "' >"
          ;

        sHtmlArray.push ( s ) ;
        TGui.createHtmlContainer ( new TXEnum ( xCont ), externalAttributes, ctx, extImgArray, sHtmlArray ) ;
        sHtmlArray.push ( "</div>" ) ;
        if ( pagelet ) ctx.popPagelet ( pagelet ) ;
        visibility = "visibility:hidden;" ;
        i++ ;
      }
    }
    else
    {
      containerEnum = new TXEnum ( xElem, "Container" ) ;
      var labelArray = new Array() ;
      imgArray   = new Array() ;
      var tooltipArray = new Array() ;
      var disabledArray = [] ;
      var closableArray = [] ;

      n = 0 ;
      imgArray = new Array() ;
      this._shortcutCharacterArray = new Array() ;
      while  ( containerEnum.hasNext() )
      {
        xCont = containerEnum.next() ;
        if ( xCont.getAttribute ( "ignore" ) )
        {
          continue  ;
        }
        var label = xCont.getAttribute ( "label" ) ;
        img   = xCont.getAttribute ( "img" ) ;
        if ( img )
        {
          if ( img.indexOf ( "/" ) < 0 ) img = "img/" + img ;
          if ( img.startsWith ( "Tango/" ) )
          {
            var aa = img.split ( "/" ) ;
            if ( aa.length == 3 )
            {
              img = TGui.buildThemeImageUrl ( aa[1], aa[2], NaN, NaN ) ;
            }
          }
          var II = new Image() ;
          II.src = img ;
          extImgArray.push ( II ) ;
        }
        tooltip = xCont.getAttribute ( "tooltip" ) ;
        if ( xCont.firstChild )
        {
          var ch = xCont.firstChild ;
          while ( ch )
          {
            if ( ch.nodeName == "Tooltip" )
            {
              tooltip = ch.firstChild.nodeValue ;
              break ;
            }
            if ( ch.nodeType == DOM_ELEMENT_NODE )
            {
              break ;
            }
            ch = ch.nextSibling ;
          }
        }
        var p = TGui.renderShortcutText ( label ) ;
        label = p.text ;
        this._shortcutCharacterArray.push ( p.shortcutCharacter ) ;

        if ( xCont.getAttribute ( "selected" ) === 'true' ) this.selectedIndex = n ;

        var disabled = xCont.getAttribute ( "disabled" ) ;
        if ( String ( disabled ) == 'true' ) disabledArray.push ( true ) ;
        else                                 disabledArray.push ( false ) ;
        closable = xCont.getAttribute ( "closable" ) ;
        if ( String ( closable ) == 'true' ) closableArray.push ( true ) ;
        else                                 closableArray.push ( false ) ;
        if ( ! label ) label = "Tab " + n ;
        labelArray.push ( label ) ;
        if ( ! img ) img = "no-img" ;
        imgArray.push ( img ) ;
        if ( ! tooltip ) tooltip = "no-tooltip" ;
        tooltipArray.push ( tooltip ) ;
        n++ ;
      }
      containerEnum.reset() ;

      a = new Array() ;
      tempId = "O" + TSys.getCounter() ;
      if ( name ) a["name"] = name ;
      externalAttributes[tempId] = a ;
      var xConstraints = new TConstraints() ;
      a["Constraints"] = xConstraints ;
      a["xClassName"] = "NotebookTop" ;
      xConstraints.parseRight ( "-0" ) ;

      sHtmlArray.push ( "<div class='ThemeNotebookTop' style='top:0px;left:0px;padding:0px;margin-bottom:0px;"
          + "' id='" + tempId + "'"
          + " >"
          ) ;

      for ( n = 0 ; n < labelArray.length ; n++ )
      {
        a = new Array() ;
        tempId = TSys.getTempId() ;
        externalAttributes[tempId] = a ;
        desktop = xCont.getAttribute ( "desktop" ) ;
        if ( desktop == "true" ) a["desktop"] = desktop ;
        if ( id ) a["orgId"] = id ;
        if ( path ) a["path"] = path ;
        if ( name ) a["name"] = name ;
        if ( n === this.selectedIndex ) a["selected"] = true ;
        else                            a["selected"] = false ;
        if ( disabledArray[n] ) a["disabled"] = true ;
        a["xClassName"] = "NotebookButton" ;

        text = labelArray[n] ;
        img = imgArray[n] ;
        tooltip = tooltipArray[n] ;
        closable = closableArray[n] ;
        if ( tooltip != "no-tooltip" ) a["tooltip"] = tooltip ;

        var x0 = this.buttonExtensionLeft ;
        sHtmlArray.push ( "<div"
                        + " id='" + tempId + "'"
                        + " class='ThemeNotebookButton'"
                        + " style='white-space:nowrap;position:absolute;"
                        + ( n === 0 ? "left:" + x0 + "px;" : "" )
                        + "' >"
                        ) ;

        var sHtml = null ;
        if ( img != "no-img" )
        {
          sHtml = "<img src='" + img + "' class='ButtonImage' /><span class='ButtonText' >" + text + "</span>" ;
        }
        else
        {
          sHtml = "<span class='ButtonText' >" + text + "</span>" ;
        }
        if ( closable )
        {
          var tid = TSys.getTempId() ;
          this.closerIdList.push ( tid ) ;
          txml = Tango.getThemeXml ( "NotebookButtonCloser", "normal" ) ;
          var w = txml.getIntAttribute ( "width", 16 ) ;
          var h = txml.getIntAttribute ( "height", w ) ;
          var url = TGui.buildThemeImageUrl ( "NotebookButtonCloser", "normal", w, h ) ;
          sHtml += "&nbsp;<img style='padding:0px;margin:0px;width:" + w + "px;height:" + h + "px;' class='ThemeNotebookButtonCloser' id='" + tid + "' src='" + url + "' />" ;
        }
        else
        {
          this.closerIdList.push ( "" ) ;
        }
        sHtmlArray.push ( sHtml ) ;
        sHtmlArray.push ( "</div>" ) ;
      }
      sHtmlArray.push ( "</div><br/>" ) ;
      a = new Array() ;
      tempId = TSys.getTempId() ;
      externalAttributes[tempId] = a ;
      a["xClassName"] = "NotebookBody" ;
      var str = "<div class='ThemeNotebookBody' style='position:absolute;left:0px;padding-bottom:0px;width:100%;" ;
      txml = Tango.getThemeXml ( "Notebook", "background" ) ;
      if ( txml ) str += "background-image:" + TGui.buildThemeBackgroundImageUrl ( "Notebook", "background" ) ;
      str += "' id='" + tempId + "' >\n" ;
      sHtmlArray.push ( str ) ;
      containerEnum.reset() ;
      var index2 = 0 ;
      while  ( containerEnum.hasNext() )
      {
        xCont = containerEnum.next() ;
        if ( xCont.getAttribute ( "ignore" ) )
        {
          continue  ;
        }
        id = xCont.getAttribute ( "id" ) ;
        style = xCont.getAttribute ( "style" ) ;
        if ( style && style.indexOf ( "right" ) >= 0 )
        {
          aResult = TGui.parseStyle ( style, "right" ) ;
          if ( aResult )
          {
            style = aResult[0] ;
          }
        }
        path = xCont.getAttribute ( "path" ) ;
        name = xCont.getAttribute ( "name" ) ;
        clazz = xCont.getAttribute ( "class" ) ;
        if ( ! clazz ) clazz = "Container" ;
        onchange = xCont.getAttribute ( "onchange" ) ;
        onload = xCont.getAttribute ( "onload" ) ;
        onclick = xCont.getAttribute ( "onclick" ) ;
        ondblclick = xCont.getAttribute ( "ondblclick" ) ;

        a = new Array() ;
        tempId = "O" + TSys.getCounter() ;
        externalAttributes[tempId] = a ;
        TGui._addPeer ( a, xCont ) ;
        jsPeer = a["jsPeer"] ;
        pagelet = null ;
        if ( jsPeer )
        {
          if ( typeof ( jsPeer.isPagelet ) == 'function' && jsPeer.isPagelet() ) pagelet = jsPeer ;
        }

        if ( pagelet ) ctx.pushPagelet ( pagelet ) ;
        if ( id )
        {
          a["orgId"] = id ;
          if ( onload ) ctx.addOnLoad ( onload, id, ctx ) ;
        }
        else
        {
          if ( onload ) ctx.addOnLoad ( onload, tempId, ctx ) ;
        }

        if ( path ) a["path"] = path ;
        if ( name ) a["name"] = name ;
        if ( onchange ) a["onchange"] = onchange ;
        droptarget = xCont.getAttribute ( "droptarget" ) ;
        if ( droptarget ) a["droptarget"] = droptarget ;
        a["xClassName"] = "Container" ;
        xProperties = TGui.collectExtendedProperties ( xCont ) ;
        if ( xProperties ) a["xProperties"] = xProperties ;
        if ( onclick ) a["onclick"] = onclick ;
        if ( ondblclick ) a["ondblclick"] = ondblclick ;

        xConstraints = new TConstraints() ;
        a["Constraints"] = xConstraints ;
        xConstraints.parseBottom ( "-1" ) ;
        xConstraints.parseRight ( "-1" ) ;
        
        popup = this._extractPopupMenu ( xCont ) ;
        if ( popup )
        {
          a["popup"] = popup ;
        }
        visibility = "visibility:hidden;" ;
        if ( index2 === this.selectedIndex ) visibility = "" ;
        sHtmlArray.push ( "<div class='" + clazz + "' id='" + tempId + "' style='position:absolute;left:0px;top:0px;" + visibility ) ;
        if ( style ) sHtmlArray.push ( style ) ;
        sHtmlArray.push ( "' >" ) ;
        TGui.createHtmlContainer ( new TXEnum ( xCont ), externalAttributes, ctx, extImgArray, sHtmlArray ) ;
        if ( pagelet ) ctx.popPagelet ( pagelet ) ;
        sHtmlArray.push ( "</div>" ) ;
        index2++ ;
      }
      sHtmlArray.push ( "</div>\n" ) ;
    }
  },
  _shortcutCallback: function ( index )
  {
    this.select ( index ) ;
  },
  layout: function ( dom, externalAttributes, radioGroups, layoutContext )
  {
    this.div = dom ;
    this.div.isLayedout = true ;
    var i ;
    var w ;
    var h ;
    var en ;
    var form ;

    if ( this.div.listenerContext )
    {
      var oldListenerContext = layoutContext.getListenerContext() ;
      layoutContext.setListenerContext ( this.div.listenerContext ) ;
      TGui.layout ( this.div, externalAttributes, radioGroups, layoutContext ) ;
      layoutContext.setListenerContext ( oldListenerContext ) ;
    }
    else
    {
      TGui.layout ( this.div, externalAttributes, radioGroups, layoutContext ) ;
    }

    if ( this.isNotebook && ! this.notebookTop )
    {
      if ( this._shortcutCharacterArray )
      {
        for ( i = 0 ; i < this._shortcutCharacterArray.length ; i++ )
	      {
          if ( ! this._shortcutCharacterArray[i] ) continue ;
	        var fe = new TFunctionExecutor ( this, this._shortcutCallback, [ i ] ) ;
          TGlobalEventHandler.addToShortCutList ( this._shortcutCharacterArray[i], this.div, fe ) ;
	      }
        this._shortcutCharacterArray.length = 0 ;
        delete this._shortcutCharacterArray ;
      }
      this.notebookTop = new TXml ( this.div ).getDomByClassName ( "NotebookTop" ) ;
      this.notebookBody = new TXml ( this.div ).getDomByClassName ( "NotebookBody" ) ;
      en = new TXEnum ( this.notebookTop, "div" ) ;
      while ( en.hasNext() )
      {
        var b = en.next() ;
        this.buttonList.push ( b ) ;
        if ( Tango.ua.realMobile )
        {
          TGui.addEventListener ( b, "touchstart", this.buttonMouseDown.bindAsEventListener ( this, b ) ) ;
          TGui.addEventListener ( b, "touchend", this.buttonStateHandler.bindAsEventListener ( this, b, "normal" ) ) ;
        }
        else
        {
          TGui.addEventListener ( b, "mousedown", this.buttonMouseDown.bindAsEventListener ( this, b ) ) ;
          TGui.addEventListener ( b, "mouseover", this.buttonStateHandler.bindAsEventListener ( this, b, "inside" ) ) ;
          TGui.addEventListener ( b, "mouseout", this.buttonStateHandler.bindAsEventListener ( this, b, "normal" ) ) ;
          TGui.addEventListener ( b, "mouseup", this.buttonStateHandler.bindAsEventListener ( this, b, "inside" ) ) ;
        }
      }
      en = new TXEnum ( this.notebookBody, "div" ) ;
      var maxW = 0 ;
      var maxH = 0 ;
      while ( en.hasNext() )
      {
        form = en.next() ;
        maxW = Math.max ( maxW, form.offsetWidth ) ;
        maxH = Math.max ( maxH, form.offsetHeight ) ;
        this.formList.push ( form ) ;
      }
      for ( i = 0 ; i < this.closerIdList.length ; i++ )
      {
        if ( ! this.closerIdList[i] )
        {
          this.closerButtonList.push ( null ) ;
          continue ;
        }
        var cl = document.getElementById ( this.closerIdList[i] ) ;
        this.closerButtonList.push ( cl ) ;
        w = cl.offsetWidth ;
        h = cl.offsetHeight ;
        cl.xClassName = "NotebookButtonCloser" ;
        cl.src = TGui.buildThemeImageUrl ( "NotebookButtonCloser", "normal", w, h ) ;
        TGui.addEventListener ( cl, "mousedown", this.closerStateHandler.bindAsEventListener ( this, cl, "pressed" ) ) ;
        TGui.addEventListener ( cl, "mouseover", this.closerStateHandler.bindAsEventListener ( this, cl, "inside" ) ) ;
        TGui.addEventListener ( cl, "mouseout", this.closerStateHandler.bindAsEventListener ( this, cl, "normal" ) ) ;
        TGui.addEventListener ( cl, "mouseup", this.closerMouseUp.bindAsEventListener ( this, cl ) ) ;
      }
      w = TGui.getComputedStyleInt ( this.div, "width", -1 ) ;
      h = TGui.getComputedStyleInt ( this.div, "height", -1 ) ;
//log ( "w: " + w ) ;
//log ( "h: " + h ) ;
//log ( "maxW: " + maxW ) ;
//log ( "maxH: " + maxH ) ;
//log ( "this.div.offsetWidth: " + this.div.offsetWidth ) ;
//log ( "this.div.offsetHeight: " + this.div.offsetHeight ) ;
      if ( w < maxW )
      {
//this.dom.style.backgroundColor = "yellow" ;
        var d = TGui.getComputedStyleInt ( this.div, "border-left-width", 0 )
              + TGui.getComputedStyleInt ( this.div, "border-right-width", 0 )
              + TGui.getComputedStyleInt ( this.div, "padding-left", 0 )
              + TGui.getComputedStyleInt ( this.div, "padding-right", 0 )
              + TGui.getComputedStyleInt ( this.div, "margin-left", 0 )
              + TGui.getComputedStyleInt ( this.div, "margin-right", 0 )
              ;
        this.div.style.width = ( maxW + d ) + "px" ;
      }
    }
    else
    {
      if ( this.formList.length === 0 )
      {
        en = new TXEnum ( this.div, "div" ) ;
        while ( en.hasNext() )
        {
          form = en.next() ;
          this.formList.push ( form ) ;
        }
      }
    }
  },
  isEnabled: function ( id )
  {
    var index = parseInt ( id ) ;
    if ( isNaN ( index ) )
    {
      index = this.indexOf ( id ) ;
    }
    if ( index < 0 || index >= this.formList.length ) return false ;
    if ( this.buttonList[index].disabled ) return false ;
    return true ;
  },
  setEnabled: function ( id, state )
  {
    var index = parseInt ( id ) ;
    if ( isNaN ( index ) )
    {
      index = this.indexOf ( id ) ;
    }
    if ( index < 0 || index >= this.formList.length ) return ;
    var st = state ? true : false ;
    var disabled = ! st ;
    var b = this.buttonList[index] ;
    if ( b.disabled == disabled ) return ;
    b.disabled = disabled ;
    this.buttonStateHandler ( null, b, null ) ;
  },
  indexOf: function ( id )
  {
    if ( typeof ( id ) == 'number' )
    {
      if ( id < 0 ) return -1 ;
      if ( id >= this.formList.length ) return -1 ;
      return id ;
    }
    if ( ! isNaN ( id ) ) return id ;
    for ( var i = 0 ; i < this.formList.length ; i++ )
    {
      var form = this.formList[i] ;
      if ( form.id == id ) return i ;
      if ( form.name == id ) return i ;
    }
    return -1 ;
  },
  idOf: function ( index )
  {
    if ( isNaN ( index ) ) return null ;
    if ( index < 0 || index >= this.formList.length ) return null ;
    return this.formList[index].id ;
  },
  nameOf: function ( index )
  {
    if ( isNaN ( index ) ) return null ;
    if ( index < 0 || index >= this.formList.length ) return null ;
    return this.formList[index].name ;
  },
  getSelectedIndex: function()
  {
    return this.selectedIndex ;
  },
  getSelectedId: function()
  {
    return this.formList[this.selectedIndex].id ;
  },
  getSelectedForm: function()
  {
    return this.formList[this.selectedIndex] ;
  },
  getSelectedContainer: function()
  {
    return new TContainer ( this.formList[this.selectedIndex] ) ;
  },
  getForm: function ( indexOrId )
  {
    var index = this.indexOf ( indexOrId );
    if ( index < 0 ) return null ;
    return this.formList[index] ;
  },
  getContainer: function ( indexOrId )
  {
    var f = this.getForm ( indexOrId ) ;
    if ( ! f ) return null ;
    return new TContainer ( f ) ;
  },
  setButtonDecoration: function ( state )
  {
    if ( ! this.isNotebook ) return ;

    for ( var i = 0 ; i < this.buttonList.length ; i++ )
    {
      var b = this.buttonList[i] ;
      this.buttonStateHandler ( null, b, state ) ;
    }
  },
  buttonStateHandler: function ( event, button, state )
  {
    var x ;
    var y ;
    var w ;
    var h ;
    if ( event )
    {
      var ev = new TEvent ( event ) ;
      if ( ev.getSource() !== button )
      {
        return ;
      }
      if ( event.type == 'mouseout' ) //state == 'normal' )
      {
        if ( new TComponent ( button ).inside ( event ) )
        {
          return ;
        }
      }
      if ( event.type == 'mouseover' && button.xInside )
      {
        return ;
      }
    }
    if ( button.disabled )
    {
      state = "disabled" ;
      w = button.offsetWidth ;
      h = button.offsetHeight ;
      button.className = "ThemeNotebookButtonDisabled" ;
      button.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "NotebookButton", state, w, h ) ;
      return ;
    }
    var index = 0 ;
    for ( var i = 0 ; i < this.buttonList.length ; i++ )
    {
      if ( button == this.buttonList[i] )
      {
        index = i ; break ;
      }
    }
    var zIndexForm = TGui.getComputedStyleInt ( this.formList[index], "z-index" ) ;
    if ( isNaN ( zIndexForm ) ) zIndexForm = 1 ;
    if ( ! state ) state = "normal" ;
    if ( button.xselected )
    {
      state = "selected" ;
      if ( ! button.xSelectionDecorated )
      {
        button.xSelectionDecorated = true ;
        x = TGui.getComputedStyleInt ( button, "left", 0 ) ;
        y = TGui.getComputedStyleInt ( button, "top", 0 ) ;
        w = TGui.getComputedStyleInt ( button, "width", 0 ) ;
        h = TGui.getComputedStyleInt ( button, "height", 0 ) ;
        button.style.top = ( y - this.buttonExtensionShiftY ) + "px" ;
        button.style.left = ( x - this.buttonExtensionLeft ) + "px" ;
        button.style.width = ( w + ( this.buttonExtensionLeft + this.buttonExtensionRight ) ) + "px" ;
        button.style.height = ( h + this.buttonExtensionHeight ) + "px" ;
        button.style.zIndex = zIndexForm + 1 ;
        button.className = "ThemeNotebookButtonSelected" ;
        TGui.layoutNotebookButton ( button, null, state ) ;
        button.buttonExtensionShiftY = this.buttonExtensionShiftY ;
        button.buttonExtensionLeft = this.buttonExtensionLeft ;
        button.buttonExtensionRight = this.buttonExtensionRight ;
        button.buttonExtensionHeight = this.buttonExtensionHeight ;
      }
    }
    else
    if ( button.xSelectionDecorated )
    {
      button.xSelectionDecorated = false ;
      x = TGui.getComputedStyleInt ( button, "left", 0 ) ;
      y = TGui.getComputedStyleInt ( button, "top", 0 ) ;
      w = TGui.getComputedStyleInt ( button, "width", 0 ) ;
      h = TGui.getComputedStyleInt ( button, "height", 0 ) ;
      button.style.top = ( y + button.buttonExtensionShiftY ) + "px" ;
      button.style.left = ( x + button.buttonExtensionLeft ) + "px" ;
      button.style.width = ( w - ( button.buttonExtensionLeft + button.buttonExtensionRight ) ) + "px" ;
      button.style.height = ( h - button.buttonExtensionHeight ) + "px" ;
      button.style.zIndex = "auto" ;
      y = TGui.getComputedStyleInt ( button, "top", 0 ) ;
      if ( state == 'inside' ) button.className = "ThemeNotebookButtonInside" ;
      else                     button.className = "ThemeNotebookButton" ;
      TGui.layoutNotebookButton ( button ) ;
    }
    else
    {
      if ( state == 'inside' ) button.className = "ThemeNotebookButtonInside" ;
      else                     button.className = "ThemeNotebookButton" ;
      TGui.layoutNotebookButton ( button ) ;
    }
    w = button.offsetWidth ;
    h = button.offsetHeight ;

    button.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "NotebookButton", state, w, h ) ;
    button.xInside = false ;
    if ( event && event.type == 'mouseover' )
    {
      button.xInside = true ;
    }
  },
  buttonMouseDown: function ( event, button )
  {
    var i ;
    if ( button.disabled  ) return ;
    var ev = new TEvent ( event ) ;
    if ( ev.hasModifiers() ) return ;
    var whichButton = ev.getButton() ;
    if ( ev.isButtonLeft() )
    {
    }
    else
    if ( ev.isButtonMiddle() )
    {
      for ( i = 0 ; i < this.buttonList.length ; i++ )
      {
        if ( button == this.buttonList[i] )
        {
          if ( this.closerButtonList[i] ) this.close ( i, event ) ;
          break ;
        }
      }
      return ;
    }
    else
    if ( ev.isButtonRight() )
    {
      return ;
    }
    for ( i = 0 ; i < this.buttonList.length ; i++ )
    {
      if ( button == this.buttonList[i] )
      {
        if ( this._autoDeselect )
        {
          if ( i == this.selectedIndex )
          {
            this.deselectAll() ;
            break ;
          }
        }
        this.select ( i, event ) ;
        break ;
      }
    }
  },
  selectOrAdd: function ( id, fileName, attributes, callback )
  {
    var index = this.indexOf ( id ) ;
    if ( index < 0 )
    {
      if ( typeof ( fileName ) == 'string' ) this.add ( fileName, attributes, callback ) ;
      else
      if ( TSys.isArray ( fileName ) )      this.add ( id, fileName, callback ) ;
      else                                   this.add ( id, attributes, callback ) ;
      if ( typeof ( callback ) == 'function' ) return ;
    }
    if ( typeof ( callback ) == 'function' )
    {
      callback ( this.getSelectedForm() ) ;
    }
    if ( this.select ( id ) )
    {
      return this.getSelectedForm() ;
    }
    return this.getSelectedForm() ;
  },
  deselectAll: function()
  {
    if ( ! this.isNotebook ) return ;
    if ( this.selectedIndex < 0 ) return ;
    var mfBody = this.notebookBody ;

    var zIndex = TGui.getComputedStyleInt ( mfBody, "z-index" ) ;
    if ( isNaN ( zIndex ) ) zIndex = 1 ;
    var zIndexLow = zIndex ;
    var zIndexHigh = zIndex + 1 ;
    for ( var i = 0 ; i < this.formList.length ; i++ )
    {
      var form = this.formList[i] ;
      form.style.visibility = "hidden" ;
      form.style.zIndex = zIndexLow ;
      if ( this.isNotebook )
      {
        var b = this.buttonList[i] ;
        if ( b.xselected )
        {
            b.xselected = false ;
            this.buttonStateHandler ( null, b, "normal" ) ;
        }
      }
    }
    this.selectedIndex = -1 ;
    mfBody.style.visibility = "hidden" ;
  },
  select: function ( formId, event )
  {
    var i ;
    var form ;
    var mfBody = this.div ;
    if ( this.isNotebook ) mfBody = this.notebookBody ;
    mfBody.style.visibility = "inherit" ;

    var zIndex = TGui.getComputedStyleInt ( mfBody, "z-index" ) ;
    if ( isNaN ( zIndex ) ) zIndex = 1 ;
    var zIndexLow = zIndex ;
    var zIndexHigh = zIndex + 1 ;
    var index = parseInt ( formId ) ;
    if ( isNaN ( index ) )
    {
      index = -1 ;
      for ( i = 0 ; i < this.formList.length ; i++ )
      {
        form = this.formList[i] ;
        if ( form.id == formId || form.name == formId )
        {
          index = i ;
          break ;
        }
      }
    }
    if ( index < 0 || index >= this.formList.length )
    {
      return null ;
    }
    if ( this.isNotebook )
    {
      if ( this.selectedIndex == index )
      {
        return null ;
      }
    }

    var focusElement = this.formList[index]._pendingFocusElement ;
    this.formList[index]._pendingFocusElement = undefined ;
    if ( focusElement )
    {
      var ch = focusElement ;
      var visible = true ;
      while ( ch )
      {
        if ( ch.nodeName.toUpperCase() == "BODY" ) break ;
        if ( ch === this.formList[index] ) break ;
        if ( ch.style.visibility == "hidden" )
        {
          focusElement = null ;
          break ;
        }
        ch = ch.parentNode ;
      }
    }

    var consumed = this.fireSelectionEvent ( index, event ) ;
    if ( consumed ) return null ;
    for ( i = 0 ; i < this.formList.length ; i++ )
    {
      form = this.formList[i] ;
      if ( index == i )
      {
        form.style.visibility = "inherit" ;
        form.style.zIndex = zIndexHigh ;
      }
      else
      {
        form.style.visibility = "hidden" ;
        form.style.zIndex = zIndexLow ;
      }
      if ( this.isNotebook )
      {
        var b = this.buttonList[i] ;
        if ( b.xselected )
        {
          if ( i != index )
          {
            b.xselected = false ;
            this.buttonStateHandler ( null, b, "normal" ) ;
          }
        }
        else
        if ( i == index )
        {
          b.xselected = true ;
          this.buttonStateHandler ( null, b, "normal" ) ;
        }
      }
    }
    this.selectedIndex = index ;
    if ( focusElement ) focusElement.focus() ;
    return this.formList[index] ;
  },
  closerStateHandler: function ( event, cl, state )
  {
    var index = -1 ;
    for ( var i = 0 ; i < this.closerButtonList.length ; i++ )
    {
      if ( cl == this.closerButtonList[i] )
      {
        index = i ;
        break ;
      }
    }
    var w = cl.offsetWidth ;
    var h = cl.offsetHeight ;
    if ( this.buttonList[index].disabled )
    {
      state = "disabled" ;
//      button.className = "ThemeNotebookButtonDisabled" ;
      cl.src = TGui.buildThemeImageUrl ( "NotebookButtonCloser", state, w, h ) ;
      return ;
    }
    cl.src = TGui.buildThemeImageUrl ( "NotebookButtonCloser", state, w, h ) ;
    var ev = new TEvent ( event ) ;
    ev.consume() ;
  },
  closerMouseUp: function ( event, cl )
  {
    var index = -1 ;
    for ( var i = 0 ; i < this.closerButtonList.length ; i++ )
    {
      if ( cl == this.closerButtonList[i] )
      {
        index = i ;
        break ;
      }
    }
    var w = cl.offsetWidth ;
    var h = cl.offsetHeight ;
    if ( this.buttonList[index].disabled ) return ;
    cl.src = TGui.buildThemeImageUrl ( "NotebookButtonCloser", "inside", w, h ) ;
    this.close ( index, event ) ;
  },
  closeImediately: function ( index )
  {
    this.close ( index, null, true ) ;
  },
  close: function ( index, event, imediately )
  {
    var form ;
    var i ;
    if ( isNaN ( index ) )
    {
      index = -1 ;
      for ( i = 0 ; i < this.formList.length ; i++ )
      {
        form = this.formList[i] ;
        index = i ;
        break ;
      }
    }
    if ( index < 0 )
    {
      return false ;
    }
    if ( ! imediately )
    {
      var consumed = this.fireCloseEvent ( index, event ) ;
      if ( consumed ) return false ;
    }
    var wasSelected = index == this.selectedIndex ;
    var wasLast     = index == this.formList.length - 1 ;
    form = this.formList[index] ;
    form.parentNode.removeChild ( form ) ;
    TGui.flushAttributes ( form ) ;
    this.formList.splice ( index, 1 ) ;
    var buttonWidth = 0 ;
    if ( this.buttonList.length > 0 )
    {
      var button = this.buttonList[index] ;
      buttonWidth = button.offsetWidth ;
      button.parentNode.removeChild ( button ) ;
      TGui.flushAttributes ( button ) ;
      var cl = this.closerButtonList[index] ;
      this.buttonList.splice ( index, 1 ) ;
      this.closerButtonList.splice ( index, 1 ) ;
    }
    if ( wasLast )
    {
//log ( "------------" ) ;
//log ( "this.formList.length: " + this.formList.length ) ;
//log ( "this.selectedIndex: " + this.selectedIndex ) ;
      if ( wasSelected )
      {
        this.selectedIndex = -1 ;
        this.select ( this.formList.length - 1, event ) ;
      }
    }
    else
    if ( this.buttonList.length > 0 )
    {
      if ( wasSelected )
      {
        buttonWidth -= this.buttonExtensionLeft + this.buttonExtensionRight ;
      }
      for ( i = index ; i < this.buttonList.length ; i++ )
      {
        var left = this.buttonList[i].offsetLeft - buttonWidth ;
        this.buttonList[i].style.left = left + "px" ;
      }
      if ( wasSelected )
      {
        this.selectedIndex = -1 ;
        this.select ( index, event ) ;
      }
    }
    return false ;
  },
  fireCloseEvent: function ( index, event )
  {
    if ( this.closeListener.length === 0 ) return false ;
    var ev = new TEvent ( event, TEvent.prototype.PROPERTY_CHANGE ) ;
    ev.setPeer ( this ) ;
    ev.oldValue = index ;
    ev.newValue = -1 ;
    for ( var i = 0 ; i < this.closeListener.length ; i++ )
    {
      this.closeListener[i].executeWithEvent ( ev ) ;
      if ( ev.isConsumed() )
      {
        ev.flush() ;
        return true ;
      }
    }
    ev.flush() ;
    return false ;
  },
  fireSelectionEvent: function ( index, event )
  {
    if ( this.selectionListener.length === 0 ) return false ;
    var ev = new TEvent ( event, TEvent.prototype.PROPERTY_CHANGE ) ;
    ev.setPeer ( this ) ;
    ev.oldValue = this.selectedIndex ;
    ev.newValue = index ;
    for ( var i = 0 ; i < this.selectionListener.length ; i++ )
    {
      this.selectionListener[i].executeWithEvent ( ev ) ;
      if ( ev.isConsumed() )
      {
        ev.flush() ;
        return true ;
      }
    }
    ev.flush() ;
    return false ;
  }
};
TMultiform.prototype.setValues = function ( xml )
{
  new TContainer ( this.div ).setValues ( xml ) ;
}
// --------------------------- Notes -----------------

TGuiClass.prototype.showInfo = function ( event, str, targetId, parentId )
{
  var e ;
  var id ;
  var img ;
  var note ;
  var ep ;
  if ( targetId )
  {
    e = document.getElementById ( targetId ) ;
    id = "Note." + targetId ;
  }
  str = TSys.translate ( str ) ;
  if ( id )
  {
    note = this.getPeerById ( id ) ;
    if ( ! note )
    {
      img = "<img src='Tango/Alert/info' width='16' height='16' />" ;
      note = new TTipBalloon ( img + "&nbsp;" + str, e ) ;
      if ( parentId )
      {
        ep = document.getElementById ( parentId ) ;
        if ( ep ) note.setParent ( ep ) ;
      }
      note.setId ( id ) ;
      note.setVisible ( true ) ;
    }
  }
  else
  {
    img = "<img src='Tango/Alert/info' width='16' height='16' />" ;
    note = new TTipBalloon ( img + "&nbsp;" + str, e ) ;
    if ( parent )
    {
      ep = document.getElementById ( parentId ) ;
      if ( ep ) note.setParent ( ep ) ;
    }
    note.setVisible ( true ) ;
  }
};
/**
 *  @constructor
 *  @extends TComponent
 */
TNote = function ( str, elem )
{
  Tango.initSuper ( this, TComponent, null ) ;
  this.str = str ;
  this.str = TGui.substituteThemeImages ( str ) ;
  this.eClose = null ;
  if ( typeof ( elem ) == 'string' ) this.elem = document.getElementById ( elem ) ;
  else                               this.elem = elem ;
  if ( this.elem ) this._anchorComponent = new TComponent ( this.elem ) ;
  this.offsetX = NaN ;
  this.offsetY = NaN ;
  this.id = TSys.getTempId() ;
  this.jsClassName = "TNote" ;
  this.closed = false ;
  this.maxWidth = 220 ;
  this.backgroundImageTagName = "Note" ;
  this.domClassName = "ThemeNote" ;
  this.parentDom = null ;
  this.closable = true ;
  this.autoClose = false ;
  this.autoCloseIgnoreAnchorComponent = false ;
  this.draggable = true ;
};
TNote.inherits( TComponent );
TNote.prototype.setParent = function ( id )
{
  if ( typeof ( id ) == 'string' )
  {
    this.parentDom = document.getElementById ( id ) ;
    if ( ! this.parentDom )
    {
      TSys.log ( "TNote#setParent: dom not found for id '" + id + "'" ) ;
      return ;
    }
  }
  else
  if ( typeof ( id ) == 'object' )
  {
    this.parentDom = id ;
  }
};
TNote.prototype.toString = function ()
{
  return "(" + this.jsClassName + ") [id=" + this.id + "]"
       ;
};
TNote.prototype.setId = function ( id )
{
  this.id = id ;
};
TNote.prototype.setClosable = function ( state )
{
  this.closable = state ? true : false ;
};
TNote.prototype.showOnHOver = function()
{
  if ( ! this.elem ) return ;
  this.showOnHOver = true ;
  this.setClosable ( false ) ;
  this.setAutoClose ( true, true ) ;
  TGui.addEventListener ( this.elem, "mouseover", this.mouseover.bind ( this ) ) ;
  TGui.addEventListener ( this.elem, "mouseout", this.mouseout.bind ( this ) ) ;
  this.draggable = false ;
};
TNote.prototype.mouseover = function()
{
  if ( this.showOnHOver )
  {
    if ( !this.dom )
    {
      this.show() ;
    }
    else
    {
      this.dom.style.left = ( TGui.getPageOffsetLeft ( this.elem ) + this.dxElem ) + "px" ;
      this.dom.style.top = ( TGui.getPageOffsetTop ( this.elem ) + this.dyElem ) + "px" ;
      if ( this.dom.offsetLeft <= 0 ) this.dom.style.left = "1px" ;
      this.setVisible ( true ) ;
    }
    return ;
  }
};
TNote.prototype.mouseout = function ( event )
{
  if ( this._anchorComponent )
  {
    if ( this._anchorComponent.inside ( event ) )
    {
      return ;
    }
  }
  if ( this.showOnHOver )
  {
    this.setVisible ( false ) ;
    return ;
  }
};
TNote.prototype.setAutoClose = function ( state, ignoreAnchorComponent )
{
  if ( this.autoClose ) return ;
  this.autoClose = true ;
  TGlobalEventHandler.addOnMouseDown ( new TFunctionExecutor ( this, this.mouseDownAutoClose ), this.dom ) ;
  this.autoCloseIgnoreAnchorComponent = ignoreAnchorComponent ? true : false ;
};
TNote.prototype.mouseDownAutoClose = function ( event )
{
  if ( this.closed ) return false ;
  if ( this.contains ( event ) )
  {
    return true ;
  }
  if ( this.autoCloseIgnoreAnchorComponent )
  {
    var ac = new TComponent ( this.elem ) ;
    if ( ac.contains ( event ) )
    {
      if ( this.showOnHOver )
      {
        this.setVisible ( false ) ;
        return true ;
      }
      return true ;
    }
  }
  if ( this.showOnHOver )
  {
    this.setVisible ( false ) ;
    return true ;
  }
  TGlobalEventHandler.removeOnMouseDown ( this.dom ) ;
  this.close() ;
  return false ;
};
TNote.prototype.setMaxWidth = function ( mw )
{
  if ( typeof ( mw ) == 'number' )
  {
    if ( mw > 30 ) this.maxWidth = mw ;
  }
};
TNote.prototype.setVisible = function ( state )
{
  if ( this.closed ) return ;
  if ( state )
  {
    if ( !this.dom ) this.show() ;
    else
    {
      this._adjustPosition() ;
      this.dom.style.visibility = "visible" ;
    }
  }
  else
  {
    if ( ! this.dom ) return ;
    else this.dom.style.visibility = "hidden" ;
  }
};
TNote.prototype.setAnchorElement = function ( elem )
{
  if ( this.elem === elem ) return ;
  if ( ! elem ) return ;
  this.elem = elem ;
  this._anchorComponent = new TComponent ( this.elem ) ;

  if ( isNaN ( this.offsetX ) ) this.offsetX = 20 ;
  var ex = TGui.getPageOffsetLeft ( this.elem ) ;
  var ey = TGui.getPageOffsetTop ( this.elem ) ;
  if ( this.parentDom )
  {
    var pex = TGui.getPageOffsetLeft ( this.parentDom ) ;
    var pey = TGui.getPageOffsetTop ( this.parentDom ) ;
    ex -= pex ;
    ey -= pey ;
  }

  var x = ex + this.elem.offsetWidth + this.offsetX ;

  if ( isNaN ( this.offsetY ) )
  {
    this.offsetY = Math.floor ( ( this.elem.offsetHeight / 2 ) - this.preferredHeight / 2 ) ;
  }
  var y = ey + this.offsetY ;
  this.dom.style.top = y + "px" ;
  this.dom.style.left = x + "px" ;
  if ( this.dom.offsetLeft <= 0 ) this.dom.style.left = "1px" ;
};
TNote.prototype.show = function()
{
  this.create() ;
  this._adjustPosition() ;
  this.dom.visibility = "visible" ;
};
TNote.prototype.create = function()
{
  var pos ;
  if ( this.closed )
  {
    throw this.toString() + " already closed." ;
  }
  if ( this.dom ) return ;

  this.dom = document.createElement ( "div" ) ;
  this.dom.style.position = "absolute" ;
  this.dom.className = this.domClassName ;
  this.dom.style.marginTop = "0px" ;
  this.dom.style.marginLeft = "0px" ;
  this.dom.style.marginBottom = "0px" ;
  this.dom.style.marginRight = "0px" ;
  this.dom.id = this.id ;
  this.dom.jsPeer = this ;
  this.dom.visibility = "hidden" ;

  this.dom.style.zIndex = TGui.zIndexNote ;

  var closerId = null ;
  var strTopHtml = "" ;
  if ( this.closable )
  {
    closerId = TSys.getTempId() ;
    var url = TGui.buildThemeImageUrl ( "NotebookButtonCloser", "normal", 16, 16 ) ;
    strTopHtml = "<p style='padding:0px;margin:0px;background-color:red;' ><img style='position:absolute;padding:0px;margin:0px;right:4px;' class='ThemeNotebookButtonCloser' id='" + closerId + "' src='" + url + "' /></p><br/>" ;
  }

  if ( this.parentDom )
  {
    this.parentDom.appendChild ( this.dom ) ;
  }
  else
  {
    document.getElementsByTagName ( "body" )[0].appendChild ( this.dom ) ;
  }

  var minWidth = NaN ;
  var minHeight = NaN ;
  var paddingBottom = 0 ;
  var paddingTop = 0 ;

  var backgroundImageTagName = this.backgroundImageTagName ;
  var imageMappingDom = Tango.getThemeDom ( backgroundImageTagName, "normal" ) ;
  if ( ! imageMappingDom )
  {
    backgroundImageTagName = "Note" ;
    imageMappingDom = Tango.getThemeDom ( backgroundImageTagName, "normal" ) ;
  }
  if ( ! imageMappingDom )
  {
    backgroundImageTagName = "Tooltip" ;
    imageMappingDom = Tango.getThemeDom ( backgroundImageTagName, "normal" ) ;
  }
  var spanPadding = "padding:4px" ;
  if ( imageMappingDom )
  {
    var xDom = new TXml ( imageMappingDom ) ;
    this.positionX = xDom.getAttribute ( "positionX" ) ;
    this.positionY = xDom.getAttribute ( "positionY" ) ;
    this.offsetX = xDom.getIntAttribute ( "offsetX" ) ;
    this.offsetY = xDom.getIntAttribute ( "offsetY" ) ;
    minWidth = xDom.getIntAttribute ( "min-width" ) ;
    minHeight = xDom.getIntAttribute ( "min-height" ) ;
    paddingBottom = xDom.getIntAttribute ( "padding-bottom", 0 ) ;
    paddingTop = xDom.getIntAttribute ( "padding-top", 0 ) ;
  }

  if ( this.str.startsWith ( "url:" ) )
  {
    pos = this.str.indexOf ( ':' ) ;
    this.str = "javascript:TSys.getText ( '" + this.str.substring ( pos+1 ) + "')" ;
  }
  if ( this.str.startsWith ( "javascript:" ) )
  {
    try
    {
      pos = this.str.indexOf ( ':' ) ;
      var str = this.str.substring ( pos+1 ) ;
      str = str.trim() ;
      var fe = new TFunctionExecutor ( str ) ;
      this.dom.innerHTML = strTopHtml + "<span style='margin:0px;" + spanPadding + ";' >"+fe.execute() + "</span>"  ;
    }
    catch ( exc )
    {
      this.dom.innerHTML = strTopHtml + "<span style='margin:0px;" + spanPadding + ";' >" + this.str  + "</span>" ;
      TSys.log ( exc  ) ;
    }
  }
  else
  {
    this.dom.innerHTML = strTopHtml + "<span style='margin:0px;" + spanPadding + ";' >" + this.str  + "</span>" ;
  }
  var xdom = new TXml ( this.dom ) ;
  var span = xdom.getDom ( "span" ) ;
  this.dom.style.height = ( span.offsetHeight + paddingTop + paddingBottom ) + "px" ;

  if ( closerId )
  {
    this.eClose = document.getElementById ( closerId  ) ;
    TGui.addEventListener ( this.eClose, "mouseover", TGui.setImageSrc.bind ( TGui, this.eClose, "NotebookButtonCloser", "inside" ) ) ;
    TGui.addEventListener ( this.eClose, "mouseout", TGui.setImageSrc.bind ( TGui, this.eClose, "NotebookButtonCloser", "normal" ) ) ;
    TGui.addEventListener ( this.eClose, "click", this.close.bind ( this ) ) ;
    TGui.addEventListener ( this.eClose, "mousedown", this.mouseDownCloser.bind ( this ) ) ;
    this.eClose.tooltip = TSys.translate ( "Close" ) ;
    TGui.addEventListener ( this.eClose, "mouseover", TGui.tooltipOver ) ;
    TGui.addEventListener ( this.eClose, "mouseout", TGui.tooltipOut ) ;
    TGui.addEventListener ( this.eClose, "mousedown", TGui.tooltipClose ) ;
  }

  this.preferredWidth = this.dom.offsetWidth ;
  if ( this.preferredWidth > this.maxWidth )
  {
    this.dom.style.width = this.maxWidth + "px" ;
    this.preferredWidth = this.dom.offsetWidth ;
    span.style.width = this.maxWidth + "px" ;
    this.dom.style.height = ( span.offsetTop + span.offsetHeight + paddingTop + paddingBottom ) + "px" ;
    this.preferredWidth = this.dom.offsetWidth ;
  }
  if ( ! isNaN ( minWidth ) )
  {
    if ( this.preferredWidth < minWidth )
    {
      this.dom.style.width = minWidth + "px" ;
      this.preferredWidth = this.dom.offsetWidth ;
    }
  }
  this.preferredHeight = this.dom.offsetHeight ;
  if ( ! isNaN ( minHeight ) )
  {
    if ( this.preferredHeight < minHeight )
    {
      this.dom.style.height = minHeight + "px" ;
      this.preferredHeight = this.dom.offsetHeight ;
    }
  }

  if ( this.eClose )
  {
    var divPaddingRight = TGui.getComputedStyleInt ( this.dom, "padding-right", 0 ) ;
    this.eClose.style.right = divPaddingRight + "px" ;
    var divPaddingTop = TGui.getComputedStyleInt ( this.dom, "padding-top", 0 ) ;
    this.eClose.style.top = divPaddingTop + "px" ;
  }

  this._adjustPosition() ;
  if ( imageMappingDom )
  {
    this.dom.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( backgroundImageTagName, "normal", this.dom.offsetWidth, this.dom.offsetHeight ) ;
  }
  if ( this.draggable ) TGui.addEventListener ( this.dom, "mousedown", Dragger.startDrag.bindAsEventListener ( Dragger, this.dom ) ) ;
};
TNote.prototype._adjustPosition = function()
{
  if ( this.elem )
  {
    if ( isNaN ( this.offsetX ) )
    {
      if ( this.positionX )
      {
        if ( this.positionX == "center" )
        {
          this.offsetX = - this.elem.offsetWidth + Math.floor ( ( this.elem.offsetWidth - this.dom.offsetWidth ) / 2 ) ;
        }
      }
      else this.offsetX = 10 ;
    }
    if ( isNaN ( this.offsetY ) )
    {
      if ( this.positionY )
      {
        if ( this.positionY == "center" ) this.offsetY = - Math.floor ( this.dom.offsetHeight / 2 ) ;
        else
        if ( this.positionY == "top" ) this.offsetY = - this.dom.offsetHeight - 2 ;
        else
        if ( this.positionY == "bottom" ) this.offsetY = this.elem.offsetHeight + 2 ;
      }
      else this.offsetY = Math.floor ( ( this.elem.offsetHeight / 2 ) - this.preferredHeight / 2 ) ;
    }
    var ex = TGui.getPageOffsetLeft ( this.elem ) ;
    var ey = TGui.getPageOffsetTop ( this.elem ) ;
    if ( this.parentDom )
    {
      var pex = TGui.getPageOffsetLeft ( this.parentDom ) ;
      var pey = TGui.getPageOffsetTop ( this.parentDom ) ;
      ex -= pex ;
      ey -= pey ;
    }

    var x = ex + this.elem.offsetWidth + this.offsetX ;
    var y = ey + this.offsetY ;
    this.dom.style.top = y + "px" ;
    this.dom.style.left = x + "px" ;
    this.dxElem = x - TGui.getPageOffsetLeft ( this.elem ) ;
    this.dyElem = y - TGui.getPageOffsetTop ( this.elem ) ;
  }
  else
  {
    var size = TGui.getBrowserWindowSize() ;
    this.dom.style.top = Math.floor ( ( size.height - this.preferredHeight ) / 2 ) + "px" ;
    this.dom.style.left = Math.floor ( ( size.width - this.preferredWidth ) / 2 ) + "px" ;
  }
  if ( this.dom.offsetLeft <= 0 ) this.dom.style.left = "1px" ;
};
TNote.prototype.close = function()
{
  if ( this.closed ) return ;
  TGui.flushAttributes ( this.dom, true ) ;
  this.dom.parentNode.removeChild ( this.dom ) ;
  this.dom = null ;
  this.closed = true ;
};
TNote.prototype.mouseDownCloser = function ( event )
{
  if ( this.closed ) return false ;
  TGui.setImageSrc ( this.eClose, "NotebookButtonCloser", "pressed" ) ;
  var e = new TEvent ( event ) ;
  e.consume() ;
  return false ;
};
/**
 *  @constructor
 *  @extends TNote
 */
var TTipBalloon = function ( str, elem )
{
  Tango.initSuper ( this, TNote, str, elem );
  this.jsClassName = "TTipBalloon" ;
  this.backgroundImageTagName = "TipBalloon" ;
  this.domClassName = "ThemeTipBalloon" ;
};
TTipBalloon.inherits( TNote );
/**
 *  @constructor
 *  @extends TContainer
 */
var TTextDisplay = function ( id )
{
  var dom = null ;
  if ( typeof ( id ) == 'string' )
  {
    dom = document.getElementById ( id ) ;
  }
  else
  if ( typeof ( id ) == 'object' && id !== null )
  {
    dom = id ;
  }
  Tango.initSuper ( this, TContainer, dom );
  this.jsClassName = "TTextDisplay" ;
  this.first = true ;
  this.pre = false ;
  this.escapeEntities = false ;
  this.lastSpan = null ;
  this.lastCode = null ;
  this.maxSize = 1000 * 20 ;
  this.lowerWatermark = this.maxSize - 1000 ;
  this.currentSize = 0 ;
  this.autoBottom = true ;
};
TTextDisplay.inherits( TContainer ) ;
/*
TTextDisplay.prototype.toString = function()
{
  
}
*/
TTextDisplay.prototype.getPeer = function()
{
  return new TTextDisplay() ;
};
TTextDisplay.prototype.layout = function ( ch, externalAttributes, radioGroups, layoutContext )
{
  this.dom = ch ;
  this.dom.jsPeer = this ;
};
TTextDisplay.prototype.setValue = function ( v )
{
  if ( !v ) return ;
  var e = v.get ( this.getName() ) ;
  if ( ! e ) return ;
  var s = e.getContent() ;
  this.clear() ;
  this.print ( s ) ;
};
TTextDisplay.prototype.print = function ( text )
{
  this._add ( text, true, true, true ) ;
};
TTextDisplay.prototype.println = function ( text )
{
  this._add ( text, true, true, false ) ;
};
TTextDisplay.prototype.add = function ( text, pre, escapeEntities )
{
  this._add ( text, pre, escapeEntities ) ;
};
TTextDisplay.prototype.addPre = function ( text, escapeEntities )
{
  this._add ( text, true, escapeEntities ) ;
};
TTextDisplay.prototype.addCode = function ( text, escapeEntities, style )
{
  this._add ( text, true, escapeEntities, false, style ) ;
};
TTextDisplay.prototype.appendCode = function ( text, escapeEntities, style )
{
  this._add ( text, true, escapeEntities, true, style ) ;
};
TTextDisplay.prototype.scrollToTop = function()
{
  this.dom.scrollTop = 0 ;
};
TTextDisplay.prototype.scrollToBottom = function()
{
  var h = 0 ;
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType !== DOM_ELEMENT_NODE )
    {
      continue ;
    }
    h += ch.offsetHeight + ch.offsetTop ;
  }
  var d = h - this.dom.clientHeight ;
  this.dom.scrollTop = d ;
};
TTextDisplay.prototype.clear = function()
{
  this.first = true ;
  if ( ! this.dom.span ) return ;
  var ch = this.dom.span.firstChild ;
  while ( ch )
  {
    var ch1 = ch.nextSibling ;
    this.dom.span.removeChild ( ch ) ;
    ch = ch1 ;
  }
};
TTextDisplay.prototype.newLine = function()
{
  this.first = false ;
  if ( ! this.dom.span ) return ;
  this._add ( "", true, false, false ) ;
};
TTextDisplay.prototype._add = function ( text, pre, escapeEntities, append, style )
{
  var code ;
  if ( ! this.dom ) return ;
  if ( typeof ( pre ) != 'boolean' ) pre = this.pre ;
  if ( typeof ( escapeEntities ) != 'boolean' ) escapeEntities = this.escapeEntities ;
  if ( ! this.dom.span )
  {
    var span = document.createElement ( "span" ) ;
    this.dom.span = span ;
    this.dom.appendChild ( span ) ;
  }
  if ( typeof ( text ) == 'string' )
  {
  }
  else
  if ( text instanceof TXml )
  {
    text = text.toString ( true ) ;
  }
  else
  {
    text = String ( text ) ;
  }
  if ( this.first )
  {
    this.first = false ;
  }
  else
  {
    if ( ! append ) this.dom.span.appendChild ( document.createElement ( "br" ) ) ;
  }
  var p = null ;
  if ( style ) p = TGui.createElement ( "<span style='" + style + "'></span>" ) ;
  else         p = document.createElement ( "span" ) ;
  this.lastSpan = p ;
  this.dom.span.appendChild ( p ) ;
  p.style.padding = "0px" ;
  p.style.margin = "0px" ;
  var textSize = text.length ;
  if ( pre )
  {
    if ( escapeEntities )
    {
      text = text.replace ( /&/g, "&amp;" ).replace ( /</g, "&lt;" ).replace ( />/g, "&gt;" ) ;
    }
    textSize = text.length ;
    if ( TSys.isIE() )
    {
      p.style.whiteSpace = "nowrap" ;
      code = document.createElement ( "code" ) ;
      this.lastCode = code ;
      p.appendChild ( code ) ;
      code.innerHTML = text.replace ( /\n/g, "<br/>" ).replace ( / /g, "&nbsp;" ) ;
    }
    else
    {
      p.style.whiteSpace = "pre" ;
      code = document.createElement ( "code" ) ;
      this.lastCode = code ;
      p.appendChild ( code ) ;
      code.innerHTML = text ;
    }
  }
  else
  {
    p.innerHTML = text ;
  }
  p._textSize = textSize ;
  this.currentSize += textSize ;
//TSys.logInternal = false ;
  if ( this.currentSize > this.maxSize )
  {
    var size = this.currentSize ;
    var a = [] ;
    for ( var ch = this.dom.span.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      if ( ch._textSize ) size -= ch._textSize ;
      if ( size <= this.lowerWatermark )
      {
        this.currentSize = size ;
        for ( var i = 0 ; i < a.length ; i++ )
        {
          this.dom.span.removeChild ( a[i] ) ;
        }
        a.length = 0 ;
        break ;
      }
      a.push ( ch ) ;
    }
  }
  if ( this.autoBottom ) this.scrollToBottom() ;
//  var height = this.dom.span.offsetHeight ;
//  var ypos = this.dom.span.scrollTop ;
//  this.dom.span.scrollBy ( 0, 40 ) ;
};
var TTagTextDisplay = function ( id )
{
  this.str = "<xml><DisplayContainer ></DisplayContainer></xml>" ;
};
TTagTextDisplay.prototype.getAxl = function ( dom )
{
  var x = new TXml ( dom ) ;
  var name = x.getAttribute ( "name" ) ;
  var id = x.getAttribute ( "id" ) ;
  var style = x.getAttribute ( "style" ) ;
  var axl = new TXml ( TSys.parseDom ( this.str ) ) ;
  var c = axl.getXml ( "DisplayContainer" ) ;
  if ( name ) c.addAttribute ( "name", name ) ;
  if ( id ) c.addAttribute ( "id", id ) ;
  var st = "overflow:auto;" ;
  if ( style )
  {
    style = style.trim() ;
    if ( style.charAt ( style.length - 1 ) != ';' ) style += ';' ;
    style += st ;
  }
  else
  {
    style = st ;
  }
  c.addAttribute ( "xstyle", style ) ;
  dom = axl.getDom() ;
  axl.dom = null ;
  return dom ;
};
TTagTextDisplay.prototype.getPeer = function()
{
  return new TTextDisplay() ;
};
TGui.addTagDefinition ( "TextDisplay", new TTagTextDisplay() ) ;
/**
 *  @constructor
 */
Locale = function ( optionalLocationCode )
{
  this.currencySymbol = undefined ;
  this.internationalCurrencySympol = undefined ;
  this.MonetaryDecimalSeparator = undefined ;
  this.DecimalSeparator = undefined ;
  this.GroupingSeparator = undefined ;
  this.CurrencySymbolInFront = undefined ;
  this.languageCode = null ;
  this.countryCode = null ;
  this.xml = TSys.getWebConfig().xml ;
  if ( typeof ( optionalLocationCode ) == 'string'
     && ( optionalLocationCode.length == 2 || optionalLocationCode.length == 5 )
     )
  {
    var url = TSys.getMainUrl()+"&action=GetLocale&LOC=" + optionalLocationCode ;
    try
    {
      var d = TSys.getXml ( url ) ;
      if ( d )
      {
        this.xml = new TXml ( d ) ;
				this.xml.add ( "Language",  optionalLocationCode ) ;
				this.setFormats() ;
      }
    }
    catch ( exc )
    {
      TSys.log ( exc ) ;
    }
  }
  else
  {
    this.setFormats() ;
  }
} ;
Locale.prototype =
{
  SHORT: 1,
  MEDIUM: 2,
  LONG: 3,
  setInternationalCurrencySymbol: function ( symbol )
  {
    this.internationalCurrencySymbol = symbol ;
    var url = TSys.getMainUrl()+"&action=GetCurrencySymbol&ICS=" + this.internationalCurrencySymbol ;
    var x = new TXml ( TSys.getXml ( url ) ) ;
    this.currencySymbol = x.getContent ( "CurrencySymbol" ) ;
//    this.CurrencySymbolInFront = x.getBool ( "CurrencySymbolInFront", true ) ;
  },
  setFormats: function ( webConfig )
  {
    var str = this.xml.getContent ( "FormatSymbols/Date" ) ;
    if ( ! str ) return ;
    var a = TSys.eval ( str ) ;
    var lang = a[0] ;
    this._userLanguage = lang ;
    this._monthNames = a[1] ;
    this._dayNames = a[2] ;
    this._dateFormatShort = a[3] ;
    this._dateFormatMedium = a[4] ;
    this._dateFormatLong = a[5] ;
    this._dateTimeFormatShort = a[6] ;
    this._dateTimeFormatMedium = a[7] ;
    this._dateTimeFormatLong = a[8] ;
  },
  flush: function()
  {
    this.xml = undefined ;
  },
  getLanguage: function()
  {
    if ( this.languageCode ) return this.languageCode ;
    if ( ! this.xml ) return TSys.getUserLanguage() ;
    var l = this.xml.getContent ( "Language" ) ;
    if ( ! l ) l = TSys.getUserLanguage() ;
    if ( l.indexOf ( '_' ) == 2 && l.length == 5 )
    {
      this.countryCode = l.substring ( 3 ) ;
      this.languageCode = l.substring ( 0, 2 ) ;
    }
    else
    {
      this.countryCode = l.toUpperCase() ;
      this.languageCode = l ;
    }
    return this.languageCode ;
  },
  getCountryCode: function()
  {
    if ( this.countryCode ) return this.countryCode ;
    if ( ! this.xml ) return "DE" ;
    var l = this.xml.getContent ( "Language", "de_DE" ) ;
    if ( l.indexOf ( '_' ) == 2 && l.length == 5 )
    {
      this.countryCode = l.substring ( 3 ) ;
      this.languageCode = l.substring ( 0, 2 ) ;
    }
    return this.countryCode ;
  },
  getLocationCode: function()
  {
    return this.getLanguage() + "_" + this.getCountryCode() ;
  },
  toString: function()
  {
    return "(Locale)"
         + "\ncurrencySymbol=" + this.getCurrencySymbol()
         + "\ninternationalCurrencySymbol=" + this.getInternationalCurrencySymbol()
         + "\nMonetaryDecimalSeparator=" + this.getMonetaryDecimalSeparator()
         + "\nDecimalSeparator=" + this.getDecimalSeparator()
         + "\nGroupingSeparator=" + this.getGroupingSeparator()
         + "\nCurrencySymbolInFront=" + this.isCurrencySymbolInFront()
         + "\nlanguage=" + this.getLanguage()
         + "\ncountryCode=" + this.getCountryCode()
    		 + "\nDateTimeFormatShort=" + this._dateTimeFormatShort
    		 + "\nDateTimeFormatMedium=" + this._dateTimeFormatMedium
    		 + "\nDateTimeFormatLong=" + this._dateTimeFormatLong
         ;
  },
  isCurrencySymbolInFront: function()
  {
    if ( typeof ( this.CurrencySymbolInFront ) != "undefined" ) return this.CurrencySymbolInFront ;
    if ( ! this.xml ) return true ;
    this.CurrencySymbolInFront = this.xml.getBool ( "CurrencySymbolInFront", true ) ;
    return this.CurrencySymbolInFront ;
  },
  getCurrencySymbol: function()
  {
    if ( this.currencySymbol ) return this.currencySymbol ;
    if ( ! this.xml )
    {
      this.currencySymbol = "\u20AC" ;
      return this.currencySymbol ;
    }
    this.currencySymbol = this.xml.getContent ( "CurrencySymbol", "\u20AC" ) ;
    return this.currencySymbol ;
  },
  getInternationalCurrencySymbol: function()
  {
    if ( this.internationalCurrencySymbol ) return this.internationalCurrencySymbol ;
    if ( ! this.xml )
    {
      this.internationalCurrencySymbol = "EUR" ;
      return this.internationalCurrencySymbol ;
    }
    this.internationalCurrencySymbol = this.xml.getContent ( "InternationalCurrencySymbol", "EUR" ) ;
    return this.internationalCurrencySymbol ;
  },
  getMonetaryDecimalSeparator: function()
  {
    if ( this.MonetaryDecimalSeparator ) return this.MonetaryDecimalSeparator ;
    if ( ! this.xml )
    {
      this.MonetaryDecimalSeparator = "." ;
      return this.MonetaryDecimalSeparator ;
    }
    this.MonetaryDecimalSeparator = this.xml.getContent ( "MonetaryDecimalSeparator", "," ) ;
    return this.MonetaryDecimalSeparator ;
  },
  getDecimalSeparator: function()
  {
    if ( this.DecimalSeparator ) return this.DecimalSeparator ;
    if ( ! this.xml )
    {
      this.DecimalSeparator = "." ;
      return this.DecimalSeparator ;
    }
    this.DecimalSeparator = this.xml.getContent ( "DecimalSeparator", "," ) ;
    return this.DecimalSeparator ;
  },
  getGroupingSeparator: function()
  {
    if ( this.GroupingSeparator ) return this.GroupingSeparator ;
    if ( ! this.xml )
    {
      this.GroupingSeparator = "," ;
      return this.GroupingSeparator ;
    }
    this.GroupingSeparator = this.xml.getContent ( "GroupingSeparator", "." ) ;
    return this.GroupingSeparator ;
  },
  formatMoneyWithCurrency: function ( amount )
  {
    if ( ! this.currencySymbol || ! this.DecimalSeparator )
    {
      this.getCurrencySymbol() ;
      this.getDecimalSeparator() ;
      this.isCurrencySymbolInFront() ;
    }
    if ( this.CurrencySymbolInFront ) return this.currencySymbol + " " + this.formatMoney ( amount ) ;
    return this.formatMoney ( amount ) + " " + this.currencySymbol ;
  },
  formatMoney: function ( amount )
  {
    if ( ! this.GroupingSeparator || this.DecimalSeparator || this.MonetaryDecimalSeparator )
    {
      this.getGroupingSeparator() ;
      this.getMonetaryDecimalSeparator() ;
    }
    if ( typeof ( amount ) != 'number' )
    {
      amount = parseFloat ( amount ) ;
      if ( isNaN ( amount ) ) amount = 0 ;
    }
    var str = amount.toFixed(2) ;
    if ( this.MonetaryDecimalSeparator != '.' ) str = str.replace ( '.', this.MonetaryDecimalSeparator ) ;
		var sign = str.substring ( 0, 1 ) ;
		if ( sign == "+" || sign == "-" )
		{
			str = str.substring ( 1 ) ;
		}
		else
		{
		  sign = "" ;
		}
    if ( str.length >= 10 )
    {
      str = str.substring ( 0, str.length - 9 ) + this.GroupingSeparator + str.substring ( str.length - 9, str.length - 6 ) + this.GroupingSeparator + str.substring ( str.length - 6 ) ;
    }
    else
    if ( str.length >= 7 )
    {
      str = str.substring ( 0, str.length - 6 ) + this.GroupingSeparator + str.substring ( str.length - 6 ) ;
    }
		if ( sign ) str = sign + str ;
    return str ;
  },
  formatFloat: function ( amount )
  {
    if ( ! this.DecimalSeparator )
    {
      this.getDecimalSeparator() ;
    }
    if ( typeof ( amount ) != 'number' )
    {
      amount = parseFloat ( amount ) ;
      if ( isNaN ( amount ) ) amount = 0 ;
    }
    var str = "" + amount ;
    if ( this.DecimalSeparator != '.' ) str = str.replace ( '.', this.DecimalSeparator ) ;
    return str ;
  },
  formatDateShort: function ( date )
  {
    return DateUtils.formatDate ( date, this._dateFormatShort, this._monthNames, this._dayNames ) ;
  },
  formatDateTimeShort: function ( date )
  {
    return DateUtils.formatDate ( date, this._dateTimeFormatShort, this._monthNames, this._dayNames ) ;
  },
  formatTimeShort: function ( date )
  {
    return DateUtils.formatDate ( date, "HH:mm:ss" ) ;
  },
  formatDateMedium: function ( date )
  {
    return DateUtils.formatDate ( date, this._dateFormatMedium, this._monthNames, this._dayNames ) ;
  },
  formatDateTimeMedium: function ( date )
  {
    return DateUtils.formatDate ( date, this._dateTimeFormatMedium, this._monthNames, this._dayNames ) ;
  },
  formatDateLong: function ( date )
  {
    return DateUtils.formatDate ( date, this._dateFormatLong, this._monthNames, this._dayNames ) ;
  },
  formatDateTimeLong: function ( date )
  {
    return DateUtils.formatDate ( date, this._dateTimeFormatLong, this._monthNames, this._dayNames ) ;
  },
  formatDate: function ( date, format )
  {
    return DateUtils.formatDate ( date, format, this._monthNames, this._dayNames ) ;
  },
  getDateFormatShort: function()
  {
    return this._dateFormatShort ;
  },
  getDateTimeFormatShort: function()
  {
    return this._dateTimeFormatShort ;
  },
  getDateFormatMedium: function()
  {
    return this._dateFormatMedium ;
  },
  getDateTimeFormatMedium: function()
  {
    return this._dateTimeFormatMedium ;
  },
  getDateFormatLong: function()
  {
    return this._dateFormatLong ;
  },
  getDateTimeFormatLong: function()
  {
    return this._dateTimeFormatLong ;
  },
  getDateFormat: function ( type )
  {
    if ( typeof ( type ) == 'string' )
    {
      var t = type.toUpperCase() ;
      if ( t == 'SHORT' ) type = this.SHORT ;
      else
      if ( t == 'MEDIUM' ) type = this.MEDIUM ;
      else
      if ( t == 'LONG' ) type = this.LONG ;
      else
      {
        var n = parseInt ( type ) ;
	if ( isNaN ( n ) ) return type ;
        type = n ;
      }
    }
    if ( type == this.SHORT ) return this._dateFormatShort ;
    if ( type == this.MEDIUM ) return this._dateFormatMedium ;
    if ( type == this.LONG ) return this._dateFormatLong ;
    return this._dateFormatShort ;
  },
  getDateTimeFormat: function ( type )
  {
    if ( typeof ( type ) == 'string' )
    {
      var t = type.toUpperCase() ;
      if ( t == 'SHORT' ) type = this.SHORT ;
      else
      if ( t == 'MEDIUM' ) type = this.MEDIUM ;
      else
      if ( t == 'LONG' ) type = this.LONG ;
      else
      {
        var n = parseInt ( type ) ;
	if ( isNaN ( n ) ) return type ;
        type = n ;
      }
    }
    if ( type == this.SHORT ) return this._dateTimeFormatShort ;
    if ( type == this.MEDIUM ) return this._dateTimeFormatMedium ;
    if ( type == this.LONG ) return this._dateTimeFormatLong ;
    return this._dateTimeFormatShort ;
  }
} ;
/**
 *  Global singleton <b>DateUtils</b>
 *  @constructor #@tagtest
 */
var DateUtilsClass = function()
{
};
DateUtilsClass.prototype =
{
  _initialized: false,
  _userLanguage: "en",
  SHORT: 1,
  MEDIUM: 2,
  LONG: 3,
  _monthDays: [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
  _monthNames: [],
  _dayNames: [],
  _dateFormatShort: [],
  _dateTimeFormatShort: [],
  _dateFormatMedium: [],
  _dateTimeFormatMedium: [],
  _dateFormatLong: [],
  _dateTimeFormatLong: [],
  _initialize: function()
  {
    this._initialized = true ;
    this._monthNames["en"] = new Array (
      'January',   'February', 'March',    'April'
    , 'May',       'June',     'July',     'August'
    , 'September', 'October',  'November', 'December'
    , 'Jan',       'Feb',      'Mar',      'Apr'
    , 'May',       'Jun',      'Jul',      'Aug'
    , 'Sep',       'Oct',      'Nov',      'Dec'
    );
    this._monthNames["de"] = new Array (
      'Januar',    'Februar',  'März',     'April'
    , 'Mai',       'Juni',     'Juli',     'August'
    , 'September', 'Oktober',  'November', 'Dezember'
    , 'Jan',       'Feb',      'Mrz',      'Apr'
    , 'Mai',       'Jun',      'Jul',      'Aug'
    , 'Sep',       'Okt',      'Nov',      'Dez'
    ) ;
    this._dayNames["en"] = new Array(
      'Sunday' ,'Monday' ,'Tuesday' ,'Wednesday' ,'Thursday' ,'Friday' ,'Saturday'
    , 'Sun' ,'Mon' ,'Tue' ,'Wed' ,'Thu' ,'Fri' ,'Sat'
    );
    this._dayNames["de"] = new Array(
      'Sonntag' ,'Montag' ,'Dienstag' ,'Mittwoch' ,'Donnerstag' ,'Freitag' ,'Samstag'
    , 'So' ,'Mo' ,'Di' ,'Mi' ,'Do' ,'Fr' ,'Sa'
    );
    this._dateFormatShort["en"] = "M/d/yy" ;
    this._dateTimeFormatShort["en"] = "M/d/yy HH:mm:ss" ;
    this._dateFormatMedium["en"] = "MMM/d/yyyy" ;
    this._dateTimeFormatMedium["en"] = "MMM/d/yyyy HH:mm:ss" ;
    this._dateFormatLong["en"] = "MMMM/d/yyyy" ;
    this._dateTimeFormatLong["en"] = "MMMM/d/yyyy HH:mm:ss" ;
    this._dateFormatShort["de"] = "d.M.yy" ;
    this._dateTimeFormatShort["de"] = "d.M.yy HH:mm:ss" ;
    this._dateFormatMedium["de"] = "d.MMM.yyyy" ;
    this._dateTimeFormatMedium["de"] = "d.MMM.yyyy HH:mm:ss" ;
    this._dateFormatLong["de"] = "d.MMMM.yyyy" ;
    this._dateTimeFormatLong["de"] = "d.MMMM.yyyy HH:mm:ss" ;
    this._setFormats() ;
  },
  getDateTimeFormatShort: function()
  {
    var f = this._dateTimeFormatShort[this._userLanguage] ;
    if ( f ) return f ;
    return this._dateTimeFormatShort["en"] ;
  },
  _setFormats: function ()
  {
    var webConfig = TSys.getWebConfig() ;
    if ( ! webConfig.getXml() ) return ;
    var str = webConfig.getXml().getContent ( "FormatSymbols/Date" ) ;
    if ( ! str ) return ;
    var a = TSys.eval ( str ) ;
    var lang = a[0] ;
    this._userLanguage = lang ;
    this._monthNames[lang] = a[1] ;
    this._dayNames[lang] = a[2] ;
    this._dateFormatShort[lang] = a[3] ;
    this._dateFormatMedium[lang] = a[4] ;
    this._dateFormatLong[lang] = a[5] ;
    this._dateTimeFormatShort[lang] = a[6] ;
    this._dateTimeFormatMedium[lang] = a[7] ;
    this._dateTimeFormatLong[lang] = a[8] ;
  },
  getWeekOfYear: function ( date )
  {
    var iYear = date.getFullYear();
    var iYearM1 = iYear - 1;
    var isLeapYear = this.isLeapYear ( date ) ;
    isLeapYearM1 = this.getMaxDays ( date.getFullYear(), 1 ) == 29 ;

    var iYearM1Mod100 = iYearM1 % 100;
    var iDayOfYear = this.getDayOfYear ( date ) ;

    var iJan1DayOfWeek = 1 + ((((Math.floor((iYearM1 - iYearM1Mod100) / 100) % 4) * 5) + (iYearM1Mod100 + Math.floor(iYearM1Mod100 / 4))) % 7);
    var iDayOfWeek = 1 + ( ( ( iDayOfYear + iJan1DayOfWeek - 1 ) - 1 ) % 7 ) ;
    var iDaysInYear = isLeapYear ? 366 : 365;
    var iWeekOfYear = 0;

    if ( ( iDayOfYear <= ( 8 - iJan1DayOfWeek ) ) && ( iJan1DayOfWeek > 4 ) )
    {
      iWeekOfYear = ( iJan1DayOfWeek == 5 || ( iJan1DayOfWeek == 6 && isLeapYearM1 ) ) ? 53 : 52;
    }
    else
    if ( iDaysInYear - iDayOfYear < 4 - iDayOfWeek )
    {
      iWeekOfYear = 1;
    }
    else
    {
      iWeekOfYear = Math.floor((iDayOfYear + (7 - iDayOfWeek) + (iJan1DayOfWeek - 1)) / 7);
      if (iJan1DayOfWeek > 4)
      {
        iWeekOfYear -= 1;
      }
    }
    return iWeekOfYear ;
  },
  getWeekOfYear2: function ( date )
  {
    // Skip to Thursday of this week
    var now = this.getDayOfYear(date) + (4 - date.getDay());
    // Find the first Thursday of the year
    var jan1 = new Date(date.getFullYear(), 0, 1);
    var then = (7 - jan1.getDay() + 4);
    return Math.floor ( ((now - then) / 7) + 1 ) ;
  },
  getDayOfYear: function ( date )
  {
    var iMonth = date.getMonth();
    var iFeb = this.getMaxDays ( date.getFullYear(), 1 ) ;
    var aDaysInMonth = new Array(31, iFeb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var iDayOfYear = 0;

    for ( var i = 0; i < iMonth; i++ )
    {
      iDayOfYear += aDaysInMonth[i];
    }
    iDayOfYear += date.getDate();
    return iDayOfYear ;
  },
  getFirstDayOfWeek: function()
  {
    var x = TSys.getWebConfig().getXml() ;
    return x.getInt ( "FirstDayOfWeek", 2 ) ;
  },
  getDayNames: function ( lang )
  {
    if ( ! this._initialized ) this._initialize() ;
    if ( ! lang ) lang = TSys.getLocale().getLanguage() ;
    var a = this._dayNames[lang] ;
    if ( ! a ) a = this._dayNames["en"] ;
    return a ;
  },
  getDayNamesShort: function ( lang )
  {
    var a = this.getDayNames() ;
    var b = [] ;
    for ( var i = 7 ; i < a.length ; i++ )
    {
      b.push ( a[i] ) ;
    }
    b.push ( a[7] ) ;
    return b ;
  },
  getMonthNames: function ( lang )
  {
    if ( ! this._initialized ) this._initialize() ;
    if ( ! lang ) lang = TSys.getLocale().getLanguage() ;
    var a = this._monthNames[lang] ;
    if ( ! a ) a = this._monthNames["en"] ;
    return a ;
  },
  isLeapYear: function ( date )
  {
    if ( this.getMaxDays ( date.getFullYear(), 1 ) == 29 ) return true ;
    return false ;
  },
  getMaxDays: function ( y, m )
  {
    if ( ! this._initialized ) this._initialize() ;
    if ( TSys.isDate ( y ) )
    {
      var d = y ;
      y = d.getFullYear() ;
      m = d.getMonth() ;
    }

    if ( m != 1 ) return this._monthDays[m] ;

    if ( ( y % 4 ) !== 0 ) return 28 ;
    if ( ( y % 100 ) === 0 )
    {
      if ( ( y % 400 ) === 0 ) return 29 ;
      return 28 ;
    }
    return 29 ;
  },
  roundDownToDay: function ( date )
  {
    var m = date.getTime() ;
    var d = new Date ( m ) ;
    d.setHours ( 0 ) ;
    d.setMinutes ( 0 ) ;
    d.setSeconds ( 0 ) ;
    d.setMilliseconds ( 0 ) ;
    return d ;
  },
  roundDownToWeek: function ( date )
  {
    var firstDayOfWeek = this.getFirstDayOfWeek() ;
    var d = this.roundDownToDay ( date ) ;

    for ( var i = 0 ; i < 40 ; i++ )
    {
      if ( d.getDay() == firstDayOfWeek - 1 )
      {
        break ;
      }
      d = this.addDay ( d, -1 ) ;
    }
    return d ;
  },
  roundDownToMonth: function ( date )
  {
    date = new Date ( date.getTime() ) ;
    date.setDate ( 1 ) ;
    date.setHours ( 0 ) ;
    date.setMinutes ( 0 ) ;
    date.setSeconds ( 0 ) ;
    date.setMilliseconds ( 0 ) ;
    return date ;
  },
  isToday: function ( date )
  {
    var d = new Date() ;
    if ( d.getFullYear() !== date.getFullYear() ) return false ;
    if ( d.getMonth() !== date.getMonth() ) return false ;
    if ( d.getDate() !== date.getDate() ) return false ;
    return true ;
  },
  addWeek: function ( date, nWeeks )
  {
    return this.addDay ( date, nWeeks * 7 ) ;
  },
  addDay: function ( date, nDay )
  {
    if ( ! this._initialized ) this._initialize() ;
    var millis = date.getTime() ;
    millis += nDay * 24 * 60 * 60 * 1000 ;
    var newDate = new Date ( millis ) ;
    if ( date.getTimezoneOffset() != newDate.getTimezoneOffset() )
    {
      millis += - ( date.getTimezoneOffset() - newDate.getTimezoneOffset() ) * 60 * 1000 ;
      newDate = new Date ( millis ) ;
    }
    return newDate ;
  },
  addMonth: function ( date, nMonth )
  {
    if ( ! this._initialized ) this._initialize() ;
    if ( ! TSys.isDate ( date ) )
    {
      throw "Not a date." ;
    }
    var day = date.getDate() ;
    var month = date.getMonth() ;
    var year = date.getFullYear() ;

    var factor = 1 ;
    if ( nMonth < 0 ) factor = -1 ;
    nMonth = Math.abs ( nMonth ) ;
    var dmonth = nMonth % 12 ;
    var dyear = Math.floor ( nMonth / 12 ) ;

    year = factor * dyear + year ;

    month = factor * dmonth + month ;

    if ( month < 0 )
    {
      month += 12 ;
      year-- ;
    }
    if ( month >= 12 )
    {
      month -= 12 ;
      year++ ;
    }
    var d = new Date ( date.getTime() ) ;
    d.setDate ( 1 ) ;
    d.setFullYear ( year ) ;
    d.setMonth ( month ) ;
    var maxDays = this.getMaxDays ( year, month ) ;
    if ( day > maxDays ) day = maxDays ;
    d.setDate ( day ) ;
    return d ;
  },
  formatTimeShort: function ( date )
  {
    if ( ! this._initialized ) this._initialize() ;
    if ( ! date ) date = new Date() ;
    return this.formatDate ( date, "HH:mm:ss" ) ;
  },
  formatDateShort: function ( date )
  {
    if ( ! this._initialized ) this._initialize() ;
    if ( ! date ) date = new Date() ;
    return this.formatDate ( date, this.getLocalizedDateFormatShort() ) ;
  },
  formatDateTimeShort: function ( date )
  {
    if ( ! this._initialized ) this._initialize() ;
    if ( ! date ) date = new Date() ;
    return this.formatDate ( date, this.getLocalizedDateTimeFormatShort() ) ;
  },
  formatDateLong: function ( date )
  {
    if ( ! this._initialized ) this._initialize() ;
    if ( ! date ) date = new Date() ;
    return this.formatDate ( date, this.getLocalizedDateFormat( this.LONG, false ) ) ;
  },
  formatDateTimeLong: function ( date )
  {
    if ( ! this._initialized ) this._initialize() ;
    if ( ! date ) date = new Date() ;
    return this.formatDate ( date, this.getLocalizedDateFormat( this.LONG, true ) ) ;
  },
  getLocalizedDateFormatShort: function()
  {
    return this.getLocalizedDateFormat ( this.SHORT, false ) ;
  },
  getLocalizedDateTimeFormatShort: function()
  {
    return this.getLocalizedDateFormat ( this.SHORT, true ) ;
  },
  getLocalizedDateFormat: function ( mode, includeTime )
  {
    var f ;
    if ( ! this._initialized ) this._initialize() ;
    if ( ! mode ) mode = 1 ;
    if ( mode > 3 ) mode = 3 ;
    var lang = TSys.getLocale().getLanguage() ;
    if ( ! lang ) lang = TSys.getUserLanguage() ;
    lang = lang.substring ( 0, 2 ) ;

    var post = "" ;
    if ( includeTime ) post = " HH:mm:ss" ;
    if ( mode == this.SHORT )
    {
      f = this._dateFormatShort[lang] ;
// if ( f.startsWith ( "M" ) )
{
  // var str = "" ;
  // str += "\nf=" + f ;
  // str += "\nlang=" + lang ;
  // str += "||||||||||||||" + TSys.toFullString ( this._dateFormatShort ) + "|||||||||||||||" ;
  // TSys.log ( str ) ;
}
      if ( f ) return f + post ;
      if ( lang == "en" ) return "M/d/yyyy" + post ;
      return "d.M.yyyy" + post ;
    }
    if ( mode == this.MEDIUM )
    {
      f = this._dateFormatMedium[lang] ;
      if ( f ) return f + post ;
      if ( lang == "en" ) return "MMM/d/yyyy" + post ;
      return "d.MMM.yyyy" + post ;
    }
    if ( mode == this.LONG )
    {
      f = this._dateFormatLong[lang] ;
      if ( f ) return f + post ;
      if ( lang == "en" ) return "MMMM/d/yyyy" + post ;
      return "d MMMM yyyy" + post ;
    }
  },
  formatDate: function ( date, format, monthNames, dayNames )
  {
    if ( ! this._initialized ) this._initialize() ;
    if ( ! TSys.isDate ( date ) )
    {
      if ( typeof ( date ) == 'string' ) date = this.parseDate ( date ) ;
      else
      if ( typeof ( date ) == 'number' )
      {
        if ( date >= 1 && date <= 3 )
        {
          format = this.getLocalizedDateFormat ( date ) ;
          date = new Date() ;
        }
        else
        {
          date = new Date ( date ) ;
        }
      }
      else                               date = new Date() ;
    }
		if ( format && format.indexOf ( "'" ) >= 0 )
		{
			var aa = format.split ( "'" ) ;
			var tt = "" ;
			for ( var ii = 0 ; ii < aa.length ; ii++ )
			{
				if ( ! aa[ii] )
				{
					continue ;
				}
				if ( ii & 0x01 )
				{
					tt += aa[ii] ;
				}
				else
				{
					tt += this.formatDate ( date, aa[ii], monthNames, dayNames ) ;
				}
			}
			return tt ;
		}
    var lang = TSys.getLocale().getLanguage() ;
    var mn = this.getMonthNames ( lang ) ;
    var dn = this.getDayNames ( lang ) ;
    if ( monthNames ) mn = monthNames ;
    if ( dayNames ) dn = dayNames ;

    if ( ! format ) format = this.getLocalizedDateTimeFormatShort() ;
    format=format+"";
    var result="";
    var i_format=0;
    var c="";
    var token="";
    var y=date.getFullYear()+"";
    var M=date.getMonth()+1;
    var d=date.getDate();
    var E=date.getDay();
    var H=date.getHours();
    var m=date.getMinutes();
    var s=date.getSeconds();
    var yyyy,yy,MMMM,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
    var value=new Object();
    if ( y.length < 4 )
    {
      y=""+(y-0+1900);
    }
    value["y"]=""+y;
    value["yyyy"]=y;
    value["yy"]=y.substring(2,4);
    value["M"]=M;
    value["MM"]=TSys.LZ(M);
    value["MMM"]=mn[M+11];
    value["MMMM"]=mn[M-1];
    value["d"]=d;
    value["dd"]=TSys.LZ(d);
    value["E"]=dn[E+7];
    value["EE"]=dn[E];
    value["H"]=H;
    value["HH"]=TSys.LZ(H);
    if ( H == 0 )
    {
      value["h"]=12;
    }
    else
    if ( H>12 )
    {
      value["h"]=H-12;
    }
    else
    {
      value["h"]=H;
    }
    value["hh"]=TSys.LZ(value["h"]);
    if ( H>11 )
    {
      value["K"]=H-12;
    }
    else
    {
      value["K"]=H;
    }
    value["k"]=H+1;
    value["KK"]=TSys.LZ(value["K"]);
    value["kk"]=TSys.LZ(value["k"]);
    if ( H > 11)
    {
      value["a"]="PM";
    }
    else
    {
      value["a"]="AM";
    }
    value["m"]=m;
    value["mm"]=TSys.LZ(m);
    value["s"]=s;
    value["ss"]=TSys.LZ(s);
    while ( i_format < format.length )
    {
      c = format.charAt ( i_format ) ;
      token="";
      while (  ( format.charAt ( i_format ) == c )
            && ( i_format < format.length )
            )
      {
        token += format.charAt ( i_format++ ) ;
      }
      if ( value[token] != null )
      {
        result += value[token];
      }
      else
      {
        result += token;
      }
    }
    return result;
  },
  isStandardDateFormat: function ( str )
  {
    var i ;
    if (  str.length != 19 /* yyyy-mm-ddThh:mm:ss */
       && str.length != 16 /* yyyy-mm-dd hh:mm*/
       && str.length != 10 /* yyyy-mm-dd */
       && str.length != 14 /* yyyymmddhhmmss */
       && str.length != 8  /* yyyymmdd */
       )
    {
      return false ;
    }
    if ( str.length == 19 ) /* yyyy-mm-ddThh:mm:ss */
    {
      if ( str.charAt ( 4 ) != "-" ) return false ;
      if ( str.charAt ( 7 ) != "-" ) return false ;
      if ( str.charAt ( 10 ) != " " && str.charAt ( 10 ) != "T" ) return false ;
      if ( str.charAt ( 13 ) != ":" ) return false ;
      if ( str.charAt ( 16 ) != ":" ) return false ;
      for ( i = 0 ; i < str.length ; i++ )
      {
        if ( i == 4 || i == 7 || i == 10 || i == 13 || i == 16 ) continue ;
	      if ( isNaN ( parseInt ( str.charAt ( i ) ) ) ) return false ;
      }
    }
    else
    if ( str.length == 16 ) /* yyyy-mm-ddThh:mm */
    {
      if ( str.charAt ( 4 ) != "-" ) return false ;
      if ( str.charAt ( 7 ) != "-" ) return false ;
      if ( str.charAt ( 10 ) != " " && str.charAt ( 10 ) != "T" ) return false ;
      if ( str.charAt ( 13 ) != ":" ) return false ;
      for ( i = 0 ; i < str.length ; i++ )
      {
        if ( i == 4 || i == 7 || i == 10 || i == 13 ) continue ;
	if ( isNaN ( parseInt ( str.charAt ( i ) ) ) ) return false ;
      }
    }
    else
    if ( str.length == 10 ) /* yyyy-mm-dd */
    {
      if ( str.charAt ( 4 ) != "-" ) return false ;
      if ( str.charAt ( 7 ) != "-" ) return false ;
      for ( i = 0 ; i < str.length ; i++ )
      {
        if ( i == 4 || i == 7 ) continue ;
        if ( isNaN ( parseInt ( str.charAt ( i ) ) ) ) return false ;
      }
    }
    else
    {
      for ( i = 0 ; i < str.length ; i++ )
      {
        if ( isNaN ( parseInt ( str.charAt ( i ) ) ) ) return false ;
      }
    }
    return true ;
  },
  stringToDate: function ( str )
  {
    return this.parseDate ( str ) ;
  },
  parseDate: function ( str )
  {
    var iYear ;
    var iMonth ;
    var iDay ;
    var iHour ;
    var iMinute ;
    var iSecond ;
    var date = new Date() ;
    if  ( str.length >= 19 && str.charAt ( 19 ) == '.' ) // yyyy-mm-ddThh:mm:ss.0
    {
      str = str.substring ( 0, 19 ) ;
    }
    if  ( str.length == 19 ) // yyyy-mm-ddThh:mm:ss
    {
      iYear = parseInt ( TSys.MLZ ( str.substring ( 0, 4 ) ) ) ;
      iMonth = parseInt ( TSys.MLZ ( str.substring ( 5, 7 ) ) ) ;
      iDay = parseInt ( TSys.MLZ ( str.substring ( 8, 10 ) ) ) ;
      iHour = parseInt ( TSys.MLZ ( str.substring ( 11, 13 ) ) ) ;
      iMinute = parseInt ( TSys.MLZ ( str.substring ( 14, 16 ) ) ) ;
      iSecond = parseInt ( TSys.MLZ ( str.substring ( 17 ) ) ) ;
      date.setDate ( 1 ) ;
      date.setFullYear ( iYear ) ;
      date.setMonth ( iMonth-1 ) ;
      date.setDate ( iDay ) ;
      date.setHours ( iHour ) ;
      date.setMinutes ( iMinute ) ;
      date.setSeconds ( iSecond ) ;
      date.setMilliseconds ( 0 ) ;
      return date ;
    }
    else
    if  ( str.length == 10 ) // yyyy-mm-dd
    {
      iYear = parseInt ( TSys.MLZ ( str.substring ( 0, 4 ) ) ) ;
      iMonth = parseInt ( TSys.MLZ ( str.substring ( 5, 7 ) ) ) ;
      iDay = parseInt ( TSys.MLZ ( str.substring ( 8, 10 ) ) ) ;
      date.setDate ( 1 ) ;
      date.setFullYear ( iYear ) ;
      date.setMonth ( iMonth-1 ) ;
      date.setDate ( iDay ) ;
      date.setHours ( 0 ) ;
      date.setMinutes ( 0 ) ;
      date.setSeconds ( 0 ) ;
      date.setMilliseconds ( 0 ) ;
      return date ;
    }
    else
    if  ( str.length == 14 ) // yyyymmddhhmmss
    {
      date = new Date() ;
      iYear = parseInt ( TSys.MLZ ( str.substring ( 0, 4 ) ) ) ;
      iMonth = parseInt ( TSys.MLZ ( str.substring ( 4, 6 ) ) ) ;
      iDay = parseInt ( TSys.MLZ ( str.substring ( 6, 8 ) ) ) ;
      iHour = parseInt ( TSys.MLZ ( str.substring ( 8, 10 ) ) ) ;
      iMinute = parseInt ( TSys.MLZ ( str.substring ( 10, 12 ) ) ) ;
      iSecond = parseInt ( TSys.MLZ ( str.substring ( 12 ) ) ) ;
      date.setDate ( 1 ) ;
      date.setFullYear ( iYear ) ;
      date.setMonth ( iMonth-1 ) ;
      date.setDate ( iDay ) ;
      date.setHours ( iHour ) ;
      date.setMinutes ( iMinute ) ;
      date.setSeconds ( iSecond ) ;
      date.setMilliseconds ( 0 ) ;
      return date ;
    }
    else
    if  ( str.length == 8 ) // yyyymmdd
    {
      date = new Date() ;
      iYear = parseInt ( TSys.MLZ ( str.substring ( 0, 4 ) ) ) ;
      iMonth = parseInt ( TSys.MLZ ( str.substring ( 4, 6 ) ) ) ;
      iDay = parseInt ( TSys.MLZ ( str.substring ( 6, 8 ) ) ) ;
      date.setDate ( 1 ) ;
      date.setFullYear ( iYear ) ;
      date.setMonth ( iMonth-1 ) ;
      date.setDate ( iDay ) ;
      date.setHours ( 0 ) ;
      date.setMinutes ( 0 ) ;
      date.setSeconds ( 0 ) ;
      date.setMilliseconds ( 0 ) ;
      return date ;
    }
    date = new Date ( Date.parse ( str ) ) ;
    return date ;
  },
  getTimeZoneId: function()
  {
    if ( ! this.TIMEZONE_ID )
    {
      var d = new Date() ;
      var tzOffset = d.getTimezoneOffset() ;
      var sign = tzOffset >= 0 ? "-" : "+" ;
      tzOffset = Math.abs ( tzOffset ) ;
      var m = tzOffset % 60 ;
      var h = Math.floor ( tzOffset / 60 ) ;
      this.TIMEZONE_ID = "GMT" + sign + TSys.LZ(h) + TSys.LZ(m) ;
    }
    return this.TIMEZONE_ID ;
  }
} ;
var DateUtils = new DateUtilsClass() ;
/**
 *  @constructor
 */
var EStyle = function ( objectString )
{
  this.style = null ;
  if ( ! objectString ) return ;
  if ( typeof ( objectString ) == 'string' ) this.style = TSys.eval ( objectString ) ;
  else this.style = objectString ;
};
EStyle.prototype.flush = function()
{
  this.style = null ;
};
EStyle.prototype.setImageRoot = function ( root )
{
  if ( ! root ) return null ;
  if ( ! this.style ) return null ;
  if ( ! this.style.image ) this.style.root = root ;
  else this.style.image.root = root ;
};
EStyle.prototype.getImageRoot = function()
{
  if ( ! this.style ) return undefined ;
  if ( this.style.image && this.style.image.root ) return this.style.image.root ;
  if ( this.style.root ) return this.style.root ;
};
EStyle.prototype.getImage = function()
{
  if ( ! this.style ) return null ;
  return this.style.image ;
};
EStyle.prototype.getPadding = function()
{
  if ( ! this.style ) return null ;
  return this.style.padding ;
};
EStyle.prototype.getPaddingString = function()
{
  if ( ! this.style ) return "" ;
  var p = this.style.padding ;
  var str = "" ;
  if ( p )
  {
    if ( typeof ( p.top ) == 'number' ) str += "padding-top:" + p.top + "px;" ;
    if ( typeof ( p.left ) == 'number' ) str += "padding-left:" + p.left + "px;" ;
    if ( typeof ( p.bottom ) == 'number' ) str += "padding-bottom:" + p.bottom + "px;" ;
    if ( typeof ( p.right ) == 'number' ) str += "padding-right:" + p.right + "px;" ;
  }
  return str ;
};
EStyle.prototype.getInsets = function()
{
  if ( ! this.style ) return null ;
  if ( ! this.style.insets ) return null ;
  var ins = new Insets ( this.style.insets ) ;
  return ins ;
};
EStyle.prototype.getSize = function()
{
  if ( ! this.style ) return null ;
  return this.style.size ;
};
EStyle.prototype.getHeight = function()
{
  if ( ! this.style ) return -1 ;
  if ( ! this.style.size ) return -1 ;
  if ( typeof ( this.style.size.height ) == 'number' ) return this.style.size.height ;
  return -1 ;
};
EStyle.prototype.getWidth = function()
{
  if ( ! this.style ) return -1 ;
  if ( ! this.style.size ) return -1 ;
  if ( typeof ( this.style.size.width ) == 'number' ) return this.style.size.width ;
  return -1 ;
};
EStyle.prototype.getImageAsDecoratorString = function ( imgRoot )
{
  var first ;
  if ( ! this.style ) return null ;
  var i = null ;
  if ( this.style.image ) i = this.style.image ;
  else i = this.style ;
  if ( ! i.src ) return null ;

  var sd = "{" ;
  sd += "src:'" + i.src + "'" ;
  if ( ! imgRoot ) imgRoot = i.root ;
  if ( ! imgRoot ) imgRoot = this.style.root ;
  if ( imgRoot ) sd += ",root:'" + imgRoot + "'" ;

  var border = i.border ;
  if ( ! border ) border = i ;
  if ( border )
  {
    var b = border ;
    sd += ",border:{" ;
    first = true ;
    if ( typeof ( b.top ) == 'number' ) { if(first){first=false;}else{sd+=",";} ; sd += "top:" + b.top ; };
    if ( typeof ( b.left ) == 'number' ) { if(first ){first=false;}else{sd+=",";} ; sd += "left:" + b.left ; };
    if ( typeof ( b.bottom ) == 'number' ) {if(first ){first=false;}else{sd+=",";} ; sd += "bottom:" + b.bottom ; };
    if ( typeof ( b.right ) == 'number' ) {if(first ){first=false;}else{sd+=",";} ; sd += "right:" + b.right ; };
    sd += "}" ;
  }
  var pattern = i.pattern ;
  if ( ! pattern ) pattern = i ;
  if ( pattern )
  {
    var p = pattern ;
    sd += ",pattern:{" ;
    first = true ;
    if ( p.top    ) { if(first){first=false;}else{sd+=",";} ; sd += "top:true" ; }
    if ( p.left   ) { if(first ){first=false;}else{sd+=",";} ; sd += "left:true" ; }
    if ( p.bottom ) { if(first ){first=false;}else{sd+=",";} ; sd += "bottom:true" ; }
    if ( p.right  ) { if(first ){first=false;}else{sd+=",";} ; sd += "right:true" ; }
    sd += "}";
  }
  if ( typeof ( i.opacity ) == 'number' ) sd += ",opacity:" + i.opacity ;
  if ( typeof ( i.type ) == 'string' ) sd += ",type:'" + i.type + "'" ;
  sd += "}" ;
  return sd ;
};
EStyle.prototype.getImageAsString = function ( imgRoot )
{
  if ( ! this.style ) return null ;
  if ( ! this.style.image ) return null ;
  var i = this.style.image ;
  var sd = "{" ;
  sd += "src:'" + i.src + "'" ;
  if ( ! imgRoot ) imgRoot = i.root ;
  if ( ! imgRoot ) imgRoot = this.style.root ;
  if ( imgRoot ) sd += ",root:'" + imgRoot + "'" ;
  if ( i.type ) sd += ",type:'" + i.type + "'" ;
  if ( i.border )
  {
    var b = i.border ;
    sd += ",border:{" ;
    var first = true ;
    if ( typeof ( b.top ) == 'number' ) { if(first){first=false;}else{sd+=",";} ; sd += "top:" + b.top ; }
    if ( typeof ( b.left ) == 'number' ) { if(first ){first=false;}else{sd+=",";} ; sd += "left:" + b.left ; }
    if ( typeof ( b.bottom ) == 'number' ) {if(first ){first=false;}else{sd+=",";} ; sd += "bottom:" + b.bottom ; }
    if ( typeof ( b.right ) == 'number' ) {if(first ){first=false;}else{sd+=",";} ; sd += "right:" + b.right ; }
    sd += "}";
  }
  if ( typeof ( i.opacity ) == 'number' ) sd += ",opacity:" + i.opacity ;
  sd += "}" ;
  return sd ;
};
EStyle.prototype.toString = function ( aName, aValue )
{
  var istr = this.getImageAsString() ;
  var str = "{" ;
  var first = true ;
  if ( typeof ( aName ) == 'string' && typeof ( aValue ) == 'string' )
  {
    aValue = aValue.replace ( /"/g, "\\\"" ) ;
    str += aName + ':"' + aValue + '"' ;
    first = false ;
  }
  if ( ! first ) str += ',' ;
  str += 'image:' + istr ;

  var c = this.style.color ;
  if ( c )
  {
    str += ',color:{' ;
    first = true ;
    if ( c.background ) { if(first){first=false;}else{str+=','};str+='background:"' + c.background + '"' ; }
    if ( c.foreground ) { if(first){first=false;}else{str+=','};str+='foreground:"' + c.foreground + '"' ; }
    str += '}' ;
  }
  var p = this.style.padding ;
  if ( p )
  {
    str += ',padding:{' ;
    first = true ;
    if ( typeof ( p.top ) == 'number' ) { if(first){first=false;}else{str+=','};str+='top:' + p.top ; }
    if ( typeof ( p.left ) == 'number' ) { if(first){first=false;}else{str+=','};str+='left:' + p.left ; }
    if ( typeof ( p.bottom ) == 'number' ) { if(first){first=false;}else{str+=','};str+='bottom:' + p.bottom ; }
    if ( typeof ( p.right ) == 'number' ) { if(first){first=false;}else{str+=','};str+='right:' + p.right ; }
    str += "}" ;
  }
  var f = this.style.font ;
  if ( f )
  {
    str += ',font:{' ;
    first = true ;
    if ( f.weight ) { if(first){first=false;}else{str+=','};str+='weight:"' + f.weight + '"' } ;
    str += '}' ;
  }
  str += "}" ;
  return str ;
};
EStyle.prototype.getTextShadow = function()
{
  var c = this.style.color ;
  if ( c ) return c.textShadow ;
};
EStyle.prototype.getForeground = function()
{
  var c = this.style.color ;
  if ( c ) return c.foreground ;
};
EStyle.prototype.getBackground = function()
{
  var c = this.style.color ;
  if ( c ) return c.background ;
};
EStyle.prototype.getStyleString = function()
{
  if ( ! this.style ) return ;
  var str = "" ;
  var c = this.style.color ;
  if ( c )
  {
    if ( c.background ) str+='background-color:' + c.background + ';' ;
    if ( c.foreground ) str+='color:' + c.foreground + ';' ;
  }
  var p = this.style.padding ;
  if ( p )
  {
    if ( typeof ( p.top ) == 'number' ) str += 'padding-top:' + p.top + "px;" ;
    if ( typeof ( p.left ) == 'number' ) str += 'padding-left:' + p.left + "px;" ;
    if ( typeof ( p.bottom ) == 'number' ) str += 'padding-bottom:' + p.bottom + "px;" ;
    if ( typeof ( p.right ) == 'number' ) str += 'padding-right:' + p.right + "px;" ;
  }
  var f = this.style.font ;
  if ( f )
  {
    if ( f.weight ) str += 'font-weight:' + f.weight ;
  }
  return str ;
};
EStyle.prototype.applyStyle = function ( htmlElement )
{
  if ( ! this.style ) return null ;
  var c = this.style.color ;
  if ( c )
  {
    if ( c.background ) htmlElement.style.backgroundColor = c.background ;
    if ( c.foreground ) htmlElement.style.color = c.foreground ;
  }
  var p = this.style.padding ;
  if ( p )
  {
    if ( typeof ( p.top ) == 'number' ) htmlElement.style.paddingTop = p.top + "px" ;
    if ( typeof ( p.left ) == 'number' ) htmlElement.style.paddingLeft = p.left + "px" ;
    if ( typeof ( p.bottom ) == 'number' ) htmlElement.style.paddingBottom = p.bottom + "px" ;
    if ( typeof ( p.right ) == 'number' ) htmlElement.style.paddingRight = p.right + "px" ;
  }
  var f = this.style.font ;
  if ( f )
  {
    if ( f.weight ) htmlElement.style.fontWeight = f.weight ;
  }
};
EStyle.prototype.apply = function ( htmlElement )
{
  if ( ! this.style ) return null ;
  this.applyStyle ( htmlElement ) ;
  if ( ! this.backgroundImageUrl && this.style.image )
  {
    var i = this.style.image ;
    if ( i )
    {
      this.backgroundImageUrl = TGui.buildScaledImageUrl ( i ) ;
    }
  }
  if ( this.backgroundImageUrl )
  {
     htmlElement.style.backgroundImage = "url("
                                       + this.backgroundImageUrl
                                       + "&width=" + htmlElement.offsetWidth
                                       + "&height=" + htmlElement.offsetHeight
                                       + ")"
                                       ;
  }
};
EStyle.prototype.getBackgroundImageUrl = function ( size )
{
  if ( ! this.style.image ) return ;
  var i = this.style.image ;
  if ( ! this.backgroundImageUrl ) this.backgroundImageUrl = TGui.buildScaledImageUrl ( i ) ;
  return "url("
       + this.backgroundImageUrl
       + "&width=" + size.width
       + "&height=" + size.height
       + ")"
       ;
};
EStyle.prototype.getSubStyle = function ( name )
{
  if ( ! this.style ) return null ;
  if ( ! this.style[name] ) return null ;
  var es = new EStyle ( this.style[name] ) ;
  if ( ! es.style.padding )es.style.padding = this.style.padding ;
  es.setImageRoot ( this.getImageRoot() ) ;
  return es ;
};
/**
 *  @constructor
 *  @extends TContainer
 */
var Canvas = function ( domXml )
{
  Tango.initSuper ( this, TContainer );
  this.jsClassName = "Canvas" ;
  if ( ! domXml ) return ;
  this.xml = new TXml ( domXml ) ;
  this.top = 0 ;
  this.left = 0 ;
  this.bottom = 0 ;
  this.right = 0 ;
  this.backgroundColor = null ;
  this.color = "black" ;
};
Canvas.inherits( TContainer ) ;
Canvas.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  this.dom.style.padding = "0px" ;
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.nodeName == "CANVAS" )
    {
      this.canvas = ch ; break ;
    }
  }
  if ( ! this.canvas.getContext )
  {
    this.canvas = null ;
    return ;
  }
  this.canvas.style.padding = "0px" ;
  this.backgroundColor = this.dom.style.backgroundColor ;
};
Canvas.prototype.setSize = function ( width, height )
{
  if ( ! this.canvas ) return ;
  TContainer.prototype.setSize.apply ( this, arguments ) ;
  var d = this.getSize() ;
  this.canvas.width = d.width ;
  this.canvas.height = d.height ;
};
Canvas.prototype.getContext = function()
{
  if ( ! this.canvas ) return undefined ;
  return this.canvas.getContext ( '2d' ) ;
};
Canvas.prototype.toDataURL = function()
{
  if ( ! this.canvas ) return undefined;
  return this.canvas.toDataURL() ;
};
Canvas.prototype.resized = function ( e )
{
  if ( ! this.canvas ) return ;
  var size = this.getSize() ;
  this.canvas.width = size.width ;
  this.canvas.height = size.height ;
};
Canvas.prototype.drawPixel = function ( x, y, color )
{
  var ctx = this.getContext() ;
  ctx.save() ;
  ctx.fillStyle = color ? color : this.color ;
  ctx.fillRect ( x, this.canvas.height - y, 1, 1 ) ;
  ctx.restore() ;
};
Canvas.prototype.drawLine = function ( x0, y0, x1, y1, color )
{
  var ctx = this.getContext() ;
  ctx.save() ;
  ctx.strokeStyle = color ;
  ctx.lineWidth = 1 ;
  ctx.beginPath();
  ctx.moveTo ( x0, this.canvas.height - y0 ) ;
  ctx.lineTo ( x1, this.canvas.height - y1 ) ;
  ctx.stroke();
  ctx.closePath();
  ctx.restore() ;
};
Canvas.prototype.clear = function()
{
  var ctx = this.getContext() ;
  ctx.fillStyle = "transparent" ;
  ctx.clearRect ( 0, 0, this.canvas.width, this.canvas.height ) ;
};
Canvas.prototype.drawPixelArray = function ( ya, color, inverse )
{
  this.clear() ;
  var ctx = this.getContext() ;
  ctx.save();
  var x = 0 ;
  var dx = 1 ;
  if ( inverse ) { x = this.canvas.width ; dx = -1 ; }
  ctx.strokeStyle = color ;
  ctx.beginPath();
  ctx.moveTo ( x, this.canvas.height - ya[0] ) ;
  x += dx ;
  for ( var i = 1 ; i < ya.length ; i++ )
  {
    var py = this.canvas.height - this.bottom - ya[i] ;
    if ( py >= this.top && py <= this.canvas.height - this.bottom )
    {
      ctx.lineTo ( x, py ) ;
    }
    x += dx ;
  }
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};
/**
 *  @constructor
 */
TActionEventHandler = function()
{
  this._flushed = false ;
  this.listenerList = [] ;
};
TActionEventHandler.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  for ( var i = 0 ; i < this.listenerList.length ; i++ )
  {
    this.listenerList[i].flush() ;
  }
  this.listenerList.length = 0 ;
};
TActionEventHandler.prototype.add = function ( obj, method, actionName )
{
  var n = '*' ;
  if ( typeof ( obj ) == 'object' && typeof ( method ) == 'function' )
  {
    if ( typeof ( actionName ) == 'string' ) n = actionName ;
  }
  else
  if ( typeof ( obj ) == 'function' )
  {
    if ( typeof ( method ) == 'string' ) n = method ;
    else
    if ( typeof ( actionName ) == 'string' ) n = actionName ;
  }
  var fe = new TFunctionExecutor ( obj, method ) ;
  this.listenerList.push ( fe ) ;
  fe.actionName = n ;
};
TActionEventHandler.prototype.fireEvent = function ( event, actionName )
{
  if ( ! actionName ) actionName = "" ;

  var ev = new TActionEvent ( event, actionName ) ;
  for ( var i = 0 ; i < this.listenerList.length ; i++ )
  {
    if (  this.listenerList[i].actionName == '*'
       || this.listenerList[i].actionName == actionName
       )
    {
      this.listenerList[i].executeWithEvent ( ev ) ;
      if ( this._flushed ) break ;
    }
  }
};
/**
 *  @constructor
 */
TItemChangedEventHandler = function()
{
  this._flushed = false ;
  this.listenerList = [] ;
};
TItemChangedEventHandler.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  for ( var i = 0 ; i < this.listenerList.length ; i++ )
  {
    this.listenerList[i].flush() ;
  }
  this.listenerList.length = 0 ;
};
TItemChangedEventHandler.prototype.add = function ( obj, method )
{
  var fe = new TFunctionExecutor ( obj, method ) ;
  this.listenerList.push ( fe ) ;
};
TItemChangedEventHandler.prototype.fireEvent = function ( ev )
{
  for ( var i = 0 ; i < this.listenerList.length ; i++ )
  {
    this.listenerList[i].executeWithEvent ( ev ) ;
    if ( this._flushed ) break ;
  }
};
/**
 *  @constructor
 *  @extends TComponent
 */
TCalendar = function ( dom )
{
  Tango.initSuper ( this, TComponent, null );
  this.xml = undefined ;
  this.jsClassName = "TCalendar" ;
  this.date = null ;
  this.today = new Date() ;
  this.initialDate = this.today ;
  this.todayStringDate = DateUtils.formatDate ( this.today, "yyyyMMdd" ) ;
  this.initialStringDate = DateUtils.formatDate ( this.initialDate, "yyyyMMdd" ) ;
  this.showButtons = false ;
  if ( dom )
  {
    this.xml = new TXml ( dom ) ;
    this.onclick = this.xml.getAttribute ( "onclick" ) ;
    this.ondblclick = this.xml.getAttribute ( "ondblclick" ) ;
    this.showButtons = this.xml.getBoolAttribute ( "show-buttons", true ) ;
  }
  this.actionHandler = new TActionEventHandler() ;
  this.itemHandler = new TItemChangedEventHandler() ;
  this.selectedBackgroundImage = undefined ;
  this.todayBackgroundImage = undefined ;
  this.listenerContext = null ;
  this.calendar = null ;
  if ( typeof ( Calendar ) === 'function' )
  {
    this.calendar = new Calendar() ;
  }
} ;
TCalendar.inherits( TComponent ) ;
TCalendar.prototype.flush = function ( w, h )
{
  if ( this._flushed ) return ;
  this._flushed= true ;
  this.actionHandler.flush() ;
  this.actionHandler = undefined ;
  this.itemHandler.flush() ;
  this.itemHandler = undefined ;
} ;
TCalendar.prototype.addActionListener = function ( self, method, actionName )
{
  this.actionHandler.add ( self, method, actionName ) ;
} ;
TCalendar.prototype.addItemListener = function ( self, method )
{
  this.itemHandler.add ( self, method ) ;
} ;
TCalendar.prototype.setSize = function ( w, h )
{
} ;
TCalendar.prototype.getValues = function ( x )
{
  if ( ! this.selectedStringDate )
  {
    s = DateUtils.formatDate ( this.initialDate, "yyyyMMdd" ) ;
  }
  else
  {
    s = this.selectedStringDate ;
  }
  x.setContent ( s ) ;
};
TCalendar.prototype.getVisibleDate = function()
{
  return this.date ;
};
TCalendar.prototype.setVisibleDate = function ( date )
{
  this.date = date ;
  this.render() ;
};
TCalendar.prototype.getDate = function()
{
  if ( ! this.dom ) return null ;
  if ( ! this.selectedStringDate )
  {
    return this.initialDate ;
  }
  var d = DateUtils.parseDate ( this.selectedStringDate ) ;
  d.setHours ( this.initialDate.getHours() ) ;
  d.setMinutes ( this.initialDate.getMinutes() ) ;
  d.setSeconds ( this.initialDate.getSeconds() ) ;
  return d ;
};
TCalendar.prototype.getTime = function()
{
  var date = this.getDate() ;
  if ( date ) return date.getTime() ;
  return 0 ;
};
/**
 *  @param {long|string|Date} millis, formatted date or a date object
 *  @param [format] if the value is a string
 */
TCalendar.prototype.setDate = function ( value, format )
{
  if ( ! this.dom ) return ;
  var date = null ;
  if  ( typeof ( value ) == 'string' )
  {
    date = DateUtils.parseDate ( value ) ;
  }
  else
  if ( typeof ( value ) == 'number' )
  {
    date = new Date ( value ) ;
  }
  else
  if ( TSys.isDate ( value ) )
  {
    date = value ;
  }
  if ( ! date )
  {
    date = new Date() ;
    date.setHours ( 0 ) ;
    date.setMinutes ( 0 ) ;
    date.setSeconds ( 0 ) ;
    date.setMilliseconds ( 0 ) ;
  }
  this.initialDate = date ;
  this.initialStringDate = DateUtils.formatDate ( date, "yyyyMMdd" ) ;
  this.preSelectedStringDate = this.initialStringDate ;
  this.date = date ;
  this.render() ;
};
/**
 *  @param {long} millis
 */
TCalendar.prototype.setTime = function ( millis )
{
  this.setDate ( millis ) ;
};
TCalendar.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  var xBack = Tango.getThemeXml ( "Calendar", "back" ) ;
  var padding = xBack.getPadding(-1) ;

  if ( this.onclick ) this.onclick = new TFunctionExecutor ( this.onclick, layoutContext ) ;
  if ( this.ondblclick ) this.ondblclick = new TFunctionExecutor ( this.ondblclick, layoutContext ) ;

  this.dom = dom ;
  this.dom.xClassName = "TCalendar" ;
  this.listenerContext = layoutContext.getListenerContext() ;
  this.date = new Date() ;
  var span = document.createElement ( "span" ) ;
  this.dom.appendChild ( span ) ;
  var tn = document.createTextNode ( "SUN" ) ;
  span.style.padding = "0px" ;
  span.style.margin = "0px" ;

  this.padding = 2 ;
  this.paddingRight = 6 ;
  this.paddingLeft = 0 ;

  span.appendChild ( tn ) ;
  this.dayWidth = span.offsetWidth + this.paddingLeft + this.paddingRight ;
  this.dayHeight = span.offsetHeight + this.padding + this.padding ;
  span.removeChild ( tn ) ;
  tn = document.createTextNode ( "00" ) ;
  span.appendChild ( tn ) ;
  this.weekWidth = span.offsetWidth ;
  span.removeChild ( tn ) ;
  this.dom.removeChild ( span ) ;

  this.addEventListener ( "click", this, this.click ) ;
  this.addEventListener ( "dblclick", this, this.dblclick ) ;
  var w = 8 * ( this.dayWidth + this.paddingLeft + this.paddingRight ) ;
  this.dom.style.width = w + "px" ;

  xBack = Tango.getThemeXml ( "Calendar", "back" ) ;
  if ( xBack )
  {
    this.dom.style.color = xBack.getAttribute ( "color", "black" ) ;
  }

  var st = "text-align:right;"
         + "width:" + this.dayWidth + "px;"
         + "padding:" + this.padding + "px;"
         + "padding-left:" + this.paddingLeft + "px;"
         + "padding-right:" + this.paddingRight + "px;"
//         + "height:" + this.dayHeight + "px;"
         ;
  padding.apply ( this.dom ) ;
  var x = null ;
  var tx =  Tango.themeImageMappingXml.getXml ( "Calendar" ) ;
  x = tx.getXml ( "day" ) ;
  this.tdStyleDay = st + "cursor:pointer;" + ( x ? x.getContent() : "" ) ;
  x = tx.getXml ( "day-names" ) ;
  this.tdStyleDayNames = 'text-align:center;' + ( x ? x.getContent() : "" ) ;
  x = tx.getXml ( "day-outside" ) ;
  this.tdStyleDayOutside = st + "cursor:pointer;" + ( x ? x.getContent() : "color:gray;" ) ;
  x = tx.getXml ( "week" ) ;
  this.tdStyleWeek = st + ( x ? x.getContent() : "color:gray;" ) ;
  x = tx.getXml ( "freeday" ) ;
  this.tdStyleFreeday = st + "cursor:pointer;" + ( x ? x.getContent() : "color:red;" ) ;
  x = tx.getXml ( "month" ) ;
  this.tdStyleMonth = 'text-align:center;' + ( x ? x.getContent() : "" ) ;

  this.render() ;
  this.dom.style.height = ( this.table.offsetHeight ) + "px" ;
  this.dom.style.width = ( this.table.offsetWidth ) + "px" ;
} ;
TCalendar.prototype.resized = function ( w, h )
{
  var width = this.dom.offsetWidth ;
  var height = this.dom.offsetHeight ;
  this.dom.style.backgroundImage = TCalendar.prototype.getBackgroundImage ( width, height ) ;
} ;
TCalendar.prototype.render = function()
{
var c = TGui.getComputedStyle ( this.dom, "color" ) ;
//log ( c ) ;
  var firstDayOfWeek = DateUtils.getFirstDayOfWeek() - 1 ;
  var startDate = DateUtils.roundDownToMonth ( this.date ) ;

  var freedays = null ;
  if ( this.calendar )
  {
    freedays = this.calendar.getFreedays ( startDate.getFullYear(), startDate.getMonth(), undefined ) ;
  }

  var title = DateUtils.formatDate ( startDate, "MMMM yyyy" ) ;
  var weekday = startDate.getDay() ;
  var diff = ( - weekday - ( 7 - firstDayOfWeek ) ) % 7 ;
  if ( Math.abs ( diff ) >= 7 ) diff = 0 ;
  startDate = DateUtils.addDay ( startDate, diff ) ;

  var dayIndexFrom = firstDayOfWeek ;
  var dayIndexTo = dayIndexFrom + 7 ;

  var tableID = TSys.getTempId() ;
  var str = "<table id='" + tableID + "' style='background-color:transparent;position:absolute;' >";
//  var str = "<table id='" + tableID + "' style='background-color:transparent;' >";

  var ylId = TSys.getTempId() + ":yl" ;
  var mlId = TSys.getTempId() + ":ml" ;
  var hId  = TSys.getTempId() + ":h" ;
  var mrId = TSys.getTempId() + ":mr" ;
  var yrId = TSys.getTempId() + ":yr" ;
  var okId = TSys.getTempId() + ":ok" ;
  var clId = TSys.getTempId() + ":cancel" ;
  if ( ! TGui.isLTR() )
  {
    ylId = TSys.getTempId() + ":yr" ;
    mlId = TSys.getTempId() + ":mr" ;
    mrId = TSys.getTempId() + ":ml" ;
    yrId = TSys.getTempId() + ":yl" ;
  }

  var yl = "<img style='width:11px;height:11px;cursor:pointer;padding-left:6px;' src='" + TGui.buildThemeImageUrl ( "Calendar", "year.left" ) + "' id='" + ylId + "' />" ;
  var ml = "<img style='width:11px;height:11px;cursor:pointer;padding-left:6px;' src='" + TGui.buildThemeImageUrl ( "Calendar", "month.left" ) + "' id='" + mlId + "' />" ;
  var h  = "<img style='width:11px;height:11px;cursor:pointer;padding-right:6px;' src='" + TGui.buildThemeImageUrl ( "Calendar", "home" ) + "' id='" + hId + "' />" ;
  var mr = "<img style='width:11px;height:11px;cursor:pointer;padding-right:6px;' src='" + TGui.buildThemeImageUrl ( "Calendar", "month.right" ) + "' id='" + mrId + "' />" ;
  var yr = "<img style='width:11px;height:11px;cursor:pointer;padding-right:6px;' src='" + TGui.buildThemeImageUrl ( "Calendar", "year.right" ) + "' id='" + yrId + "' />" ;
  var ok = "<img style='width:16px;height:16px;cursor:pointer;' src='" + TGui.buildThemeImageUrl ( "Calendar", "button.ok" ) + "' id='" + okId + "' />" ;
  var cl = "<img style='width:16px;height:16px;cursor:pointer;' src='" + TGui.buildThemeImageUrl ( "Calendar", "button.cancel" ) + "' id='" + clId + "' />" ;

  if ( TGui.isLTR() )
  {
    str += "<tr>" ;
    str += "<td colspan=2 style='text-align:left;' >" ;
    str += yl ;
    str += ml ;
    str += "</td>" ;
    str += "<td colspan=4 style='" + this.tdStyleMonth + "' >" + title + "</td>" ;
    str += "<td colspan=2 style='text-align:right;' >" ;
    str +=  h ;
    str += mr ;
    str += yr ;
    str += "</td>" ;
    str += "</tr>\n" ;
  }
  else
  {
    str += "<tr>" ;
    str += "<td colspan=2 style='text-align:right;' >" ;
    str += yr ;
    str += mr ;
    str += "</td>" ;
    str += "<td colspan=4 style='" + this.tdStyleMonth + "' >" + title + "</td>" ;
    str += "<td colspan=2 style='text-align:left;' >" ;
    str +=  h ;
    str += ml ;
    str += yl ;
    str += "</td>" ;
    str += "</tr>\n" ;
  }

  var a = DateUtils.getDayNamesShort() ;
  str += "<tr>" ;
  str += "<td style='" + this.tdStyleWeek + "' >&nbsp;</td>" ;
  for ( var j = dayIndexFrom ; j < dayIndexTo ; j++ )
  {
var k = j % 7 ;
    str += "<td style='" + this.tdStyleDayNames + "' >" + a[k] + "</td>" ;
  }
  str += "</tr>\n" ;
  var date = new Date ( startDate.getTime() ) ;
  var w = DateUtils.getWeekOfYear ( date ) ;
//    var w2 = DateUtils.getWeekOfYear2 ( date ) ;
  var idToBeSelected = "" ;
  var idToday = "" ;
  for ( var i = 0 ; i < 6 ; i++ )
  {
    str += "<tr>" ;
    if ( w < 10 ) str += "<td style='" + this.tdStyleWeek + "' >" + w + "</td>" ;
    else          str += "<td style='" + this.tdStyleWeek + "' >" + w + "</td>" ;
    w++ ;
if ( w > 52 ) w = 1 ;
    for ( j = dayIndexFrom ; j < dayIndexTo ; j++ )
    {
      var d = date.getDate() ;
      var im = date.getMonth() + 1 ;
      var id = date.getDate() ;
      var tid = TSys.getTempId() ;
      tid += ":DAY:" ;
      if ( this.date.getMonth() != date.getMonth() )
      {
        tid += "OUT:" ;
      }
      var stringDate = "" + date.getFullYear() ;
      if ( im < 10 ) stringDate += "0" + im ;
      else           stringDate += "" + im ;
      if ( id < 10 ) stringDate += "0" + id ;
      else           stringDate += "" + id ;
      tid += stringDate ;

      if ( this.preSelectedStringDate == stringDate )
      {
        this.preSelectedStringDate = "" ;
        idToBeSelected = tid ;
      }
      else
      if ( this.todayStringDate == stringDate )
      {
        idToday = tid ;
      }
      if ( this.date.getMonth() != date.getMonth() )
      {
        str += "<td id='" + tid + "' style='" + this.tdStyleDayOutside + "' >" + d + "</td>" ;
      }
      else
      {
        if ( date.getDay() === 0 || date.getDay() === 6 )
        {
          str += "<td id='" + tid + "' style='" + this.tdStyleFreeday + "' >" + d + "</td>" ;
        }
        else
        if ( freedays && freedays[d-1] == -1 )
        {
          str += "<td id='" + tid + "' style='" + this.tdStyleFreeday + "' >" + d + "</td>" ;
        }
        else
        {
          str += "<td id='" + tid + "' style='" + this.tdStyleDay + "' >" + d + "</td>" ;
        }
      }
      date = DateUtils.addDay ( date, 1 ) ;
    }
    str += "</tr>\n" ;
  }
  if ( this.showButtons )
  {
    str += "<tr>" ;
    str += "<td colspan=6 >&nbsp;</td>" ;
    str += "<td style='text-align:center;' >" + ok + "</td>" ;
    str += "<td style='text-align:center;' >" + cl + "</td>" ;
    str += "</tr>\n" ;
  }
  else
  {
    str += "<tr>" ;
    str += "<td colspan=8 >&nbsp;</td>" ;
    str += "</tr>\n" ;
  }
  str += "</table>" ;
  this.dom.innerHTML = str ;
  if ( idToBeSelected )
  {
    if ( this.selectedTD ) this.selectedTD.style.backgroundImage = "none" ;
    this.selectedTD = document.getElementById ( idToBeSelected ) ;
    this.selectedTD.style.backgroundImage = this.getSelectedBackgroundImage ( this.selectedTD ) ;
  }
  if ( idToday )
  {
    var td = document.getElementById ( idToday ) ;
    td.style.backgroundImage = this.getTodayBackgroundImage ( td ) ;
  }
  this.table = document.getElementById ( tableID ) ;
} ;
TCalendar.prototype.getBackgroundImage = function ( width, height )
{
  return "url(" + TGui.buildThemeImageUrl ( "Calendar", "back", width, height ) + ")" ;
} ;
TCalendar.prototype.getSelectedBackgroundImage = function ( TD )
{
  return "url(" + TGui.buildThemeImageUrl ( "Calendar", "selected", TD.offsetWidth, TD.offsetHeight ) + ")" ;
} ;
TCalendar.prototype.getTodayBackgroundImage = function ( TD )
{
  return "url(" + TGui.buildThemeImageUrl ( "Calendar", "today", TD.offsetWidth, TD.offsetHeight ) + ")" ;
} ;
TCalendar.prototype.dblclick = function ( event )
{
  var ev = new TEvent ( event ) ;
  var id = ev.getSource().id ;
  if ( ! id ) return ;
  if ( id.indexOf ( ":DAY:" ) <= 0 ) return ;
  if ( this.ondblclick )
  {
    if ( this.listenerContext )
    {
      this.listenerContext.changed ( event ) ;
    }
    this.ondblclick.executeWithEvent ( event ) ;
  }
} ;
TCalendar.prototype.click = function ( event )
{
  var ev = new TEvent ( event ) ;
  var id = ev.getSource().id ;
  if ( ! id ) return ;
  var months = 0 ;
  if ( id.endsWith ( ":yl" ) ) months = -12 ;
  if ( id.endsWith ( ":ml" ) ) months = -1 ;
  if ( id.endsWith ( ":mr" ) ) months = 1 ;
  if ( id.endsWith ( ":yr" ) ) months = 12 ;
  if ( months )
  {
    this.date = DateUtils.addMonth ( this.date, months ) ;
    this.render() ;
    return ;
  }
  if ( id.endsWith ( ":h" ) )
  {
    this.date = this.today ;
    this.render() ;
    return ;
  }
  if ( id.endsWith ( ":ok" ) )
  {
    this.actionHandler.fireEvent ( event, "OK" ) ;
    return ;
  }
  if ( id.endsWith ( ":cancel" ) )
  {
    this.selectedStringDate = this.initialStringDate ;
    this.actionHandler.fireEvent ( event, "CANCEL" ) ;
    return ;
  }
  if ( id.indexOf ( ":DAY:" ) > 0 )
  {
    if ( this.selectedTD )
    {
      if ( this.todayStringDate == this.selectedTD.id.substring ( id.lastIndexOf ( ":" ) + 1 ) )
      {
        this.selectedTD.style.backgroundImage = this.getTodayBackgroundImage ( this.selectedTD ) ;
      }
      else
      {
        this.selectedTD.style.backgroundImage = "none" ;
      }
    }
    this.selectedTD = ev.getSource() ;
    this.selectedTD.style.backgroundImage = this.getSelectedBackgroundImage ( this.selectedTD ) ;
    this.selectedStringDate = id.substring ( id.lastIndexOf ( ":" ) + 1 ) ;
    if ( this.listenerContext )
                {
      this.listenerContext._execute ( ev ) ;
    }
    if ( id.indexOf ( ":OUT:" ) > 0 )
    {
      this.preSelectedStringDate = this.selectedStringDate ;
      this.date = DateUtils.parseDate ( this.preSelectedStringDate ) ;
      if ( this.onclick ) this.onclick.executeWithEvent ( event ) ;
      ev = new TItemEvent ( event, this ) ;
      this.itemHandler.fireEvent ( ev ) ;
      this.render() ;
      return ;
    }
    this.itemHandler.fireEvent ( ev ) ;
    if ( this.onclick ) this.onclick.executeWithEvent ( event ) ;
  }
} ;
/**
 *  @constructor
 *  @extends TComponent
 */
Pagelet = function(xml)
{
  Tango.initSuper ( this, TContainer, null );
  if ( ! xml ) return ;
  this.jsClassName = "Pagelet" ;
  this.titleId = undefined ;
  this.bodyId = undefined ;
  this.cTitle = undefined ;
  this.cBody = undefined ;
  this.container = undefined ;
  this.first = true ;

  this.dragable = false ;
  this.resizable = false ;
  this.minimumWidth = 100 ;
  this.minimumHeight = 100 ;
  this.dragable = xml.getBoolAttribute ( "dragable", false ) ;
  this.resizable = xml.getBoolAttribute ( "resizable", false ) ;
  this.closable = xml.getBoolAttribute ( "closable", false ) ;
  xml.removeAttribute ( "dragable" ) ;
  xml.removeAttribute ( "resizable" ) ;
  this.minimumWidth = xml.getIntAttribute ( "minimum-width", this.minimumWidth ) ;
  this.minimumHeight = xml.getIntAttribute ( "minimum-height", this.minimumHeight ) ;
  this.name = xml.getAttribute ( "name" ) ;
  if ( ! this.name ) this.name = "Pagelet-" + this._nameCounter++ ;
  xml.removeAttribute ( "name" ) ;
  this._parent = undefined ;
  this._children = [] ;
};
Pagelet.inherits( TContainer ) ;
Pagelet.prototype._nameCounter = 1 ;
Pagelet.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
};
Pagelet.prototype.getParent = function ( qualifier )
{
  if ( typeof ( qualifier ) == 'function' )
  {
    if ( this instanceof qualifier )
    {
      return this ;
    }
    else
    if ( this._parent )
    {
      if ( this._parent instanceof qualifier )
      {
        return this._parent ;
      }
      if ( typeof ( this._parent.getParent ) == 'function' )
      {
        return this._parent.getParent() ;
      }
    }
    return null ;
  }
  return this._parent ;
};
Pagelet.prototype.setParent = function ( parentPagelet )
{
  this._parent = parentPagelet ;
};
Pagelet.prototype.close = function()
{
  this.remove() ;
};
Pagelet.prototype.remove = function()
{
  if ( this._removed ) return ;
  this._removed = true ;
  if ( this._parent && this._parent.removeChild ) this._parent.removeChild ( this ) ;
  TGui.flushAttributes ( this.dom, true ) ;
  if ( this.dom.parentNode )
  {
    this.dom.parentNode.removeChild ( this.dom ) ;
  }
};
Pagelet.prototype.getChild = function ( nameOrId )
{
  for ( var i = 0 ; i < this._children.length ; i++ )
  {
    if ( this._children[i].dom.name == nameOrId )
    {
      return this._children[i] ;
    }
  }
};
Pagelet.prototype.addChild = function ( child )
{
  this._children.push ( child ) ;
  child._parent = this ;
};
Pagelet.prototype.removeChild = function ( child )
{
  for ( var i = 0 ; i < this._children.length ; i++ )
  {
    if ( child === this._children[i] )
    {
      this._children.splice ( i, 1 ) ;
      break ;
    }
  }
};
Pagelet.prototype.isPagelet = function()
{
  return true ;
};
Pagelet.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  if ( this.dragable )
  {
    this.addEventListener ( "mousedown", this, this.mousedown ) ;
  }
};
Pagelet.prototype.getValues = function ( xml )
{
  this.cBody.getValues ( xml ) ;
};
Pagelet.prototype.setValues = function ( xml )
{
  this.cBody.setValues ( xml ) ;
};
Pagelet.prototype.reset = function()
{
  this.cBody.reset() ;
};
Pagelet.prototype.resized = function ( size )
{
  var b ;
  if ( this.first )
  {
    this.first = false ;
    if ( this.titleId ) this.cTitle = new TContainer ( this.titleId ) ;
    if ( this.bodyId )
    {
      this.cBody = new TContainer ( this.bodyId ) ;
      if ( this.cTitle )
      {
        var t = this.cTitle.dom ;
        if ( t.isDecoratorPart ) t = t.parentNode ;
        b = this.cBody.dom ;
        if ( b.isDecoratorPart ) b = b.parentNode ;

        var t1 = b.offsetTop ;
        b.style.top = ( t.offsetTop + t.offsetHeight ) + "px" ;
        var t2 = b.offsetTop ;
        var h = TGui.getComputedStyleInt ( b, "height", 0 ) ;
        var diff = t1 - t2 ;
        b.style.height = ( h + diff ) + "px" ;
      }
    }
    if ( this.dom.isDecoratorPart == "child" )
    {
      var dom = this.dom ;
      this.dom = this.dom.parentNode ;
      this.dom.jsPeer = this ;
      this.container = dom ;
    }
    else
    {
      this.container = this.dom ;
    }
    this.dom.name = this.name ;
    if ( this.resizable )
    {
      this.eResizeGripper = TGui.createElement ( "<img src='' onmousedown='return false;' />" ) ;
      b = this.cBody.dom ;
      b.appendChild ( this.eResizeGripper ) ;
      this.eResizeGripper.style.width = 11 + "px" ;
      this.eResizeGripper.style.height = 11  + "px";
      this.eResizeGripper.style.position = "absolute";
      this.eResizeGripper.xConstraints = new TConstraints() ;
      this.eResizeGripper.xConstraints.parseRight ( "0" ) ;
      this.eResizeGripper.xConstraints.parseBottom ( "0" ) ;
      this.eResizeGripper.src = TGui.buildThemeImageUrl ( "Misc", "resize-gripper" ) ;
      this.eResizeGripper.style.cursor = "se-resize" ;

      this.eResizeGripper.style.left = ( b.offsetWidth - this.eResizeGripper.offsetWidth ) + "px" ;
      this.eResizeGripper.style.top = ( b.offsetHeight - this.eResizeGripper.offsetHeight ) + "px" ;
      TGui.addEventListener ( this.eResizeGripper, "mousedown", this.startResize.bindAsEventListener ( this ) ) ;
    }
  }
};
Pagelet.prototype.getMinimumWidth = function()
{
  return this.minimumWidth ;
};
Pagelet.prototype.getMinimumHeight = function()
{
  return this.minimumHeight ;
};
Pagelet.prototype.startResize = function ( event )
{
  Dragger.startResizeComponent ( event, this, Dragger.SE_RESIZE ) ;
};
Pagelet.prototype.mousedown = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( this.cTitle )
  {
    var r = this.cTitle.getBoundsOnPage() ;
    var mx = ev.getX() ;
    var my = ev.getY() ;
    if ( r.contains ( mx, my ) )
    {
      if ( ev.getSource().nodeName == "IMG" ) return ;
      Dragger.startDrag ( event, this.dom ) ;
      Dragger.setDragInside ( true ) ;
    }
  }
};
/**
 *  @constructor
 */
PageletFactoryClass = function()
{
  this.jsClassName = "PageletFactoryClass" ;
  this.titleHeight = 24 ;
  this.currentPeer = undefined ;
};
PageletFactoryClass.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
};
PageletFactoryClass.prototype.getPeer = function()
{
  var p = this.currentPeer ;
  this.currentPeer = undefined ;
  return p ;
};
PageletFactoryClass.prototype.getAxl = function ( dom, attributes )
{
  var style ;
  var txml ;
  var xml = new TXml ( dom ) ;
  var axl = new TXml() ;
  var xCont = axl.addXml ( "Container" ) ;
  var title = xml.getAttribute ( "title" ) ;

  var decoTitle = xml.getAttribute ( "decoration-title" ) ;
  var decoBack = xml.getAttribute ( "decoration-back" ) ;
  var decoBody = xml.getAttribute ( "decoration-body" ) ;
  var styleTitle = xml.getAttribute ( "style-title" ) ;
  var styleBody = xml.getAttribute ( "style-body" ) ;
  var pagelet = xml.getAttribute ( "pagelet" ) ;
  if ( pagelet )
  {
    var p = attributes["jsPeer"] ;
    if ( p ) this.currentPeer = p ;
    attributes["jsPeer"] = null ;
    xml.removeAttribute ( "pagelet" ) ;
  }
  else
  {
    this.currentPeer = new Pagelet ( xml ) ;
  }

  xCont.copyAttributesFrom ( xml ) ;
  var bodyId = TSys.getTempId() ;
  var titleId ;
  if ( typeof ( title ) == 'string' && title != "false" )
  {
    titleId = TSys.getTempId() ;
    var xTitle = xCont.addXml ( "Container" ) ;
    if ( title )
    {
      style = "right:-2;attach-right:true;" ;
      if ( styleTitle )
      {
        if ( styleTitle.charAt ( styleTitle.length-1 ) != ';' ) styleTitle += ';' ;
        style = styleTitle + style ;
      }
      var xLabel = xTitle.add  ( "Label", title ) ;
      xLabel.addAttribute ( "style", style ) ;
      xLabel.addAttribute ( "class", "ThemePageletTitleLabel" ) ;
      if ( xml.getBoolAttribute ( "closable", false ) )
      {
        var xIcon = xTitle.add  ( "IconButton" ) ;
        xIcon.addAttribute ( "normal", TGui.buildThemeImageUrl ( "PageletClose", "normal" ) ) ;
        xIcon.addAttribute ( "inside", TGui.buildThemeImageUrl ( "PageletClose", "inside" ) ) ;
        xIcon.addAttribute ( "pressed", TGui.buildThemeImageUrl ( "PageletClose", "pressed" ) ) ;
        xIcon.addAttribute ( "style", "right:6;" ) ;
        xIcon.addAttribute ( "width", "12" ) ;
        xIcon.addAttribute ( "onclick", "*.close()" ) ;
      }
    }
    xTitle.addAttribute ( "name", "title" ) ;
    xTitle.addAttribute ( "id", titleId ) ;
    style = "left:0px;top:0px;right:-0;margin:0px;" ;
    if ( styleTitle )
    {
/*
      if ( styleTitle.charAt ( styleTitle.length-1 ) != ';' ) styleTitle += ';' ;
      style = styleTitle + style ;
*/
    }
    xTitle.addAttribute ( "style", style ) ;
    xTitle.addAttribute ( "class", "ThemePageletTitle" ) ;

    if ( ! decoTitle && ! decoBody && ! decoBack )
    {
      txml = Tango.getThemeXml ( "ContainerDecoration", "pagelet.title" ) ;
      if ( txml && txml.getContent() != 'none' )
      {
        xTitle.addAttribute ( "decoration", "pagelet.title" ) ;
      }
    }
    if ( decoTitle ) xTitle.addAttribute ( "decoration", decoTitle ) ;
  }

  var xBr = xCont.addXml ( "br" ) ;
  var xBody = xCont.addXml ( "Container" ) ;
  style = xml.getAttribute ( "style" ) ;
  var img = xml.getAttribute ( "img" ) ;
    
  var fullStyle = "padding:0px;" ;
  if ( style ) fullStyle += style;
  xCont.addAttribute ( "style", fullStyle ) ;
  xCont.addAttribute ( "class", "ThemePagelet" ) ;
  if ( ! decoTitle && ! decoBody && ! decoBack )
  {
    txml = Tango.getThemeXml ( "ContainerDecoration", "pagelet.back" ) ;
    if ( txml && txml.getContent() != 'none' )
    {
      xCont.addAttribute ( "decoration", "pagelet.back" ) ;
    }
    txml = Tango.getThemeXml ( "ContainerDecoration", "pagelet.body" ) ;
    if ( txml && txml.getContent() != 'none' )
    {
      xBody.addAttribute ( "decoration", "pagelet.body" ) ;
    }
  }
  if ( decoBack ) xCont.addAttribute ( "decoration", decoBack ) ;
  if ( decoBody ) xBody.addAttribute ( "decoration", decoBody ) ;

  style = "left:0px;right:-0;bottom:-0;" ;
  if ( styleBody )
  {
    if ( styleBody.charAt ( styleBody.length-1 ) != ';' ) styleBody += ';' ;
    style = styleBody + style ;
  }
  xBody.addAttribute ( "style", style ) ;
  xBody.addAttribute ( "class", "ThemePageletBody" ) ;
  xBody.addAttribute ( "name", "body" ) ;
  xBody.copyChildrenFrom ( xml ) ;
  xBody.addAttribute ( "id", bodyId ) ;
  if ( this.currentPeer )
  {
    this.currentPeer.titleId = titleId ;
    this.currentPeer.bodyId = bodyId ;
  }
  return axl.getDom() ;
};
PageletFactory = new PageletFactoryClass() ;
TGui.addTagDefinition ( "Pagelet", PageletFactory ) ;

/**
 *  @constructor
 */
Splitbar = function ( xElem, horizontal )
{
  this.horizontal = horizontal ? true : false ;
  this.vertical = ! this.horizontal ;
  this.dom = null ;
  this.previous = null ;
  this.next = null ;
  this.first = true ;
} ;
Splitbar.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  var txml ;
  var style ;
  this.dom = dom ;
  if ( this.horizontal )
  {
    TGui.addEventListener ( dom, "mousedown", Dragger.startSplitbarMove.bindAsEventListener ( Dragger, dom, true ) ) ;
    if ( ! dom.xConstraints )
    {
      var l = TGui.getComputedStyleInt ( dom.parentNode, "padding-left", 0 )
            + TGui.getComputedStyleInt ( dom.parentNode, "border-left-width", 0 )
            ;
      dom.style.left = l + "px" ;
      var r = TGui.getComputedStyleInt ( dom.parentNode, "padding-right", 0 )
            + TGui.getComputedStyleInt ( dom.parentNode, "border-right-width", 0 )
            ;
      dom.xConstraints = new TConstraints() ;
      dom.xConstraints.parseRight ( "-" + r ) ;
    }
    txml = Tango.getThemeXml ( "Splitbar", "gripper-horizontal" ) ;
    if ( txml )
    {
      style = txml.getAttribute ( "style", "" ) ;
      if ( style ) style = "style='" + style + "'" ;
      this.eGripper = TGui.createElement ( "<img src='' onmousedown='return false;' " + style + "/>" ) ;
      this.dom.appendChild ( this.eGripper ) ;
      this.eGripper.style.position = "absolute";
      this.eGripper.src = TGui.buildThemeImageUrl ( "Splitbar", "gripper-horizontal" ) ;
      this.eGripper.style.top = "0px" ;
    }
  }
  else
  {
    TGui.addEventListener ( dom, "mousedown", Dragger.startSplitbarMove.bindAsEventListener ( Dragger, dom, false ) ) ;
    if ( ! dom.xConstraints )
    {
      var t = TGui.getComputedStyleInt ( dom.parentNode, "padding-top", 0 )
            + TGui.getComputedStyleInt ( dom.parentNode, "border-top-width", 0 )
            ;
      dom.style.top = t + "px" ;
      var b = TGui.getComputedStyleInt ( dom.parentNode, "padding-bottom", 0 )
            + TGui.getComputedStyleInt ( dom.parentNode, "border-bottom-width", 0 )
            ;
      dom.xConstraints = new TConstraints() ;
      dom.xConstraints.parseBottom ( "-" + b ) ;
    }
    txml = Tango.getThemeXml ( "Splitbar", "gripper-vertical" ) ;
    if ( txml )
    {
      style = txml.getAttribute ( "style", "" ) ;
      if ( style ) style = "style='" + style + "'" ;
      this.eGripper = TGui.createElement ( "<img src='' onmousedown='return false;' " + style + "/>" ) ;
      this.dom.appendChild ( this.eGripper ) ;
      this.eGripper.style.position = "absolute";
      this.eGripper.src = TGui.buildThemeImageUrl ( "Splitbar", "gripper-vertical" ) ;
      this.eGripper.style.left = Math.floor ( ( this.dom.offsetWidth - this.eGripper.offsetWidth ) / 2 ) + "px" ;
    }
  }
} ;
Splitbar.prototype.resized = function ( w, h )
{
  var ch ;
  if ( this.horizontal )
  {
    if ( this.first )
    {
      this.first = false ;
      for ( ch = this.dom.previousSibling ; ch ; ch = ch.previousSibling )
      {
        if ( ch.nodeType == DOM_ELEMENT_NODE && ch.nodeName != 'BR' )
        {
          this.previous = ch ;
          this.dom.eTop = this.previous ;
          break ;
        }
      }
      for ( ch = this.dom.nextSibling ; ch ; ch = ch.nextSibling )
      {
        if ( ch.nodeType == DOM_ELEMENT_NODE && ch.nodeName != 'BR' )
        {
          this.next = ch ;
          this.dom.eBottom = this.next ;
          break ;
        }
      }
      this.previous.style.height = ( this.dom.offsetTop
                                   - this.previous.offsetTop
                                   - TGui.getComputedStyleInt ( this.previous, "padding-top", 0 )
                                   - TGui.getComputedStyleInt ( this.previous, "padding-bottom", 0 )
                                   - TGui.getComputedStyleInt ( this.previous, "border-top-width", 0 )
                                   - TGui.getComputedStyleInt ( this.previous, "border-bottom-width", 0 )
                                   ) + "px" ;
      var nextBottom = this.next.offsetTop + this.next.offsetHeight ;
      var thisBottom = this.dom.offsetTop + this.dom.offsetHeight ;
      this.next.style.top = ( this.dom.offsetTop + this.dom.offsetHeight ) + "px" ;
      this.next.style.height = ( nextBottom
                               - thisBottom
                               - TGui.getComputedStyleInt ( this.next, "padding-top", 0 )
                               - TGui.getComputedStyleInt ( this.next, "padding-bottom", 0 )
                               - TGui.getComputedStyleInt ( this.next, "border-top-width", 0 )
                               - TGui.getComputedStyleInt ( this.next, "border-bottom-width", 0 )
                               ) + "px" ;
      if ( this.eGripper ) this.eGripper.style.top = Math.floor ( ( this.dom.offsetHeight - this.eGripper.offsetHeight ) / 2 ) + "px" ;
    }
    if ( this.eGripper ) this.eGripper.style.left = Math.floor ( ( this.dom.offsetWidth - this.eGripper.offsetWidth ) / 2 ) + "px" ;
  }
  else
  {
    if ( this.first )
    {
      this.first = false ;
      for ( ch = this.dom.previousSibling ; ch ; ch = ch.previousSibling )
      {
        if ( ch.nodeType == DOM_ELEMENT_NODE && ch.nodeName != 'BR' )
        {
          this.previous = ch ;
          this.dom.eLeft = this.previous ;
          break ;
        }
      }
      for ( ch = this.dom.nextSibling ; ch ; ch = ch.nextSibling )
      {
        if ( ch.nodeType == DOM_ELEMENT_NODE && ch.nodeName != 'BR' )
        {
          this.next = ch ;
          this.dom.eRight = this.next ;
          break ;
        }
      }
      var t = TGui.getComputedStyleInt ( this.dom.parentNode, "padding-top", 0 )
            + TGui.getComputedStyleInt ( this.dom.parentNode, "border-top-width", 0 ) 
            ;
      var e = this.previous ? this.previous : this.next ;
      if ( e )
      {
        this.dom.style.top = e.offsetTop + "px" ;
        var c = e.xConstraints ;
        if ( c && c.bottomAttach && c.bottomMinus )
        {
          this.dom.xConstraints.parseBottom ( "-" + c.bottomValue ) ;
        }
      }
      this.previous.style.width = ( this.dom.offsetLeft
                                  - this.previous.offsetLeft
                                  - TGui.getComputedStyleInt ( this.previous, "padding-left", 0 )
                                  - TGui.getComputedStyleInt ( this.previous, "padding-right", 0 )
                                  - TGui.getComputedStyleInt ( this.previous, "border-left-width", 0 )
                                  - TGui.getComputedStyleInt ( this.previous, "border-right-width", 0 )
                                  ) + "px" ;
      var nextRight = this.next.offsetLeft + this.next.offsetWidth ;
      var thisRight = this.dom.offsetLeft + this.dom.offsetWidth ;
      this.next.style.left = ( this.dom.offsetLeft + this.dom.offsetWidth ) + "px" ;
      this.next.style.width = ( nextRight
                              - thisRight
                              - TGui.getComputedStyleInt ( this.next, "padding-left", 0 )
                              - TGui.getComputedStyleInt ( this.next, "padding-right", 0 )
                              - TGui.getComputedStyleInt ( this.next, "border-left-width", 0 )
                              - TGui.getComputedStyleInt ( this.next, "border-right-width", 0 )
                              ) + "px" ;
      if ( this.eGripper ) this.eGripper.style.left = Math.floor ( ( this.dom.offsetWidth - this.eGripper.offsetWidth ) / 2 ) + "px" ;
    }
    if ( this.eGripper ) this.eGripper.style.top = Math.floor ( ( this.dom.offsetHeight - this.eGripper.offsetHeight ) / 2 ) + "px" ;
  }
} ;
/**
 *  @constructor
 */
TagFactory = function ( xElem )
{
  this.jsClassName = "TagFactory" ;
  this.model = new TXml ( xElem ) ;
  this.modelContent = this.model.first() ;
  if ( this.modelContent && this.model.getAttribute ( "tag" ) )
  {
    TGui.addTagDefinition ( this.model.getAttribute ( "tag" ), this ) ;
    this.modelStyle = this.modelContent.getAttribute ( "style", "" ) ;
    if ( this.modelStyle )
    {
      this.modelStyle = this.modelStyle.trim() ;
      if ( this.modelStyle.charAt ( this.modelStyle.length-1 ) != ';' ) this.modelStyle += ';' ;
    }
  }
};
TagFactory.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
};
TagFactory.prototype.getAxl = function ( xElem )
{
  var xml = new TXml ( xElem ) ;
  var style = xml.getAttribute ( "style", "" ) ;
  if ( style && style.charAt ( style.length-1 ) != ';' ) style += ';' ;
  var fullStyle = this.modelStyle + ( style ? style : "" ) ;
  var axl = new TXml() ;
  axl.addDuplicate ( this.modelContent ) ;
  var parameter = xml.getAttribute ( "parameter" ) ;
  var oparameter = null ;
  if ( parameter )
  {
    parameter = parameter.trim() ;
    if ( parameter.charAt ( 0 ) == "{" && parameter.charAt ( parameter.length-1 ) == "}" )
    {
      oparameter = TSys.eval ( parameter ) ;
    }
  }
  var first = axl.first() ;
  first.copyAttributesFrom ( xml ) ;
  first.removeAttribute ( "parameter" ) ;
  first.addAttribute ( "style", fullStyle ) ;
  first.copyChildrenFrom ( xml ) ;
  if ( oparameter ) axl.replace ( oparameter, "[]" );
  if ( ! oparameter )
  {
    var an = xml.getAttributeNames() ;
    if ( an.length )
    {
      axl.replace ( an, xml.getAttributeValues(), "[]" );
    }
  }
  return axl.getDom() ;
};
/**
 *  @constructor
 */
TAnimatorClass = function()
{
};
TAnimatorClass.prototype =
{
  fadeIn: function ( component, options, ev )
  {
    var e = component ;
    if ( TGui.isComponent ( component ) ) e = component.getDom() ;
    else
    if ( component.dom ) e = component.dom ;
    var an = new Animator ( options ) ;
    an.addSubject ( new NumericalStyleSubject ( e, 'opacity', 0, 1 ) ) ;
    an.play() ;
  },
  animateIn: function ( component, options, ev )
  {
    if ( component instanceof TWindow )
    {
      if ( options instanceof TEvent ) { ev = options ; options = null ; }
      var dom = component.dom ;
      var loc = component.getLocation() ;
      component.setVisible ( false ) ;
      var csize = component.getInnerSize() ;
      var x0 = -1 ;
      var y0 = -1 ;
      if ( ev )
      {
        x0 = ev.getY() ;
        y0 = ev.getX() ;
      }
      else
      {
        var n = new Date().getTime() ;
        n = n & 0x3 ;
        var wSize = TGui.getBrowserWindowSize() ;
        if ( n === 0 ) { x0 = 0 ; y0 = 0 ; }
        if ( n === 1 ) { x0 = wSize.width ; y0 = 0 ; }
        if ( n === 2 ) { x0 = wSize.width ; y0 = wSize.height ; }
        if ( n === 3 ) { x0 = 0 ; y0 = wSize.height ; }
      }

/*
      dom.style.opacity = 0.2 ;
  dom.style.visibility = "visible" ; ;
      dom.style.top = x0 + "px" ;
      dom.style.left = y0 + "px" ;
      dom.style.width = "10px" ;
      dom.style.height = "10px" ;
      var thiz = this ;
    var t = new TTimer ( 200, function()
    {
      try
      {
      thiz.setTransition ( dom, "top,left,width,height,opacity", "0.3s" ) ;
dom.addEventListener("transitionend",
       	function(e)
	{
	if ( component.anidone ) return ;
      thiz.setTransitionOff ( dom ) ;
	component.anidone =true ;
	component._show();
	}
	,false
	);
      dom.style.opacity = 1 ;
      dom.style.top = loc.x + "px" ;
      dom.style.left = loc.y + "px" ;
      dom.style.width = csize.width + "px" ;
      dom.style.height = csize.height + "px" ;
      }
      catch ( exc )
      {
      }
    });
    t.setRepeats ( false ) ;
    t.start() ;
return ;
*/
      var ex0 = new Animator ( options ) ;
      if ( x0 >= 0 && y0 >= 0 )
      {
        ex0.addSubject(new NumericalStyleSubject( dom, "top", x0, loc.y )) ;
        ex0.addSubject(new NumericalStyleSubject( dom, "left", y0, loc.x )) ;
      }
      ex0.addSubject(new NumericalStyleSubject( dom, "width", 10, csize.width)) ;
      ex0.addSubject(new NumericalStyleSubject( dom, "height", 10, csize.height)) ;
      ex0.addSubject(new NumericalStyleSubject( dom, "opacity", 0.2, 1));
      ex0.play() ;
      return ;
    }
    var e = component ;
    if ( TGui.isComponent ( component ) ) e = component.getDom() ;
    else
    if ( component.dom ) e = component.dom ;
    var an = new Animator ( options ) ;
    an.addSubject ( new NumericalStyleSubject ( e, 'opacity', 0, 1 ) ) ;
    an.play() ;
  },
  fadeOut: function ( component, options, ev )
  {
    var e = component ;
    if ( TGui.isComponent ( component ) ) e = component.getDom() ;
    else
    if ( component.dom ) e = component.dom ;
    var an = new Animator ( options ) ;
    an.addSubject ( new NumericalStyleSubject ( e, 'opacity', 1, 0 ) ) ;
    an.play() ;
  },
  animateOut: function ( component, options, ev )
  {
    if ( component instanceof TWindow )
    {
      if ( options instanceof TEvent ) { ev = options ; options = null ; }
      var dom = component.dom ;
      var loc = component.getLocation() ;
//      component.setVisible ( false ) ;
      var csize = component.getInnerSize() ;
      var ex0 = new Animator ( options ) ;
      var x0 = -1 ;
      var y0 = -1 ;
      if ( ev )
      {
        x0 = ev.getY() ;
        y0 = ev.getX() ;
      }
      else
      {
        var n = new Date().getTime() ;
        n = n & 0x3 ;
        var wSize = TGui.getBrowserWindowSize() ;
        if ( n === 0 ) { x0 = 0 ; y0 = 0 ; }
        if ( n == 1 ) { x0 = wSize.width ; y0 = 0 ; }
        if ( n == 2 ) { x0 = wSize.width ; y0 = wSize.height ; }
        if ( n == 3 ) { x0 = 0 ; y0 = wSize.height ; }
      }
      if ( x0 >= 0 && y0 >= 0 )
      {
        ex0.addSubject(new NumericalStyleSubject( dom, "top", loc.y, x0 )) ;
        ex0.addSubject(new NumericalStyleSubject( dom, "left", loc.x, y0 )) ;
      }
      ex0.addSubject(new NumericalStyleSubject( dom, "width", csize.width, 10 )) ;
      ex0.addSubject(new NumericalStyleSubject( dom, "height", csize.height, 10 )) ;
      ex0.addSubject(new NumericalStyleSubject( dom, "opacity", 1, 0.0));
      ex0.play() ;
      return ;
    }
    var e = component ;
    if ( TGui.isComponent ( component ) ) e = component.getDom() ;
    else
    if ( component.dom ) e = component.dom ;
    var an = new Animator ( options ) ;
    an.addSubject ( new NumericalStyleSubject ( e, 'opacity', 1, 0 ) ) ;
    an.play() ;
  }
};
TAnimator = new TAnimatorClass() ;
/**
 *  @constructor
 *  @param {string|dom} id the id of an html element or
 *         the html dom element itself.
 */
var Calculator = function ( container )
{
  this.displayContainer = container ;
  this.container = container ;
  var table = container.getPeer ( "HISTORY" ) ;
  var tf = container.getComponent ( "q" ) ;
  this.displayContainer = container.getComponent ( "DISPLAY.CONTAINER" ) ;
  this.container = container ;
  this.memory = container.getPeer ( "MEMORY" ) ;
  this.tf = tf ;
  this.tfd = tf.dom ;
  this.labelStatus = this.container.getComponent ( "LABEL_STATUS" ) ;
  this.table = table ;
  this.displayContainer.addEventListener ( "keyup", this, this.displayContainerKey ) ;
  this.tf.addEventListener ( "keyup", this, this.actionKey ) ;
  this.displayContainer.addEventListener ( "click", this, this.click ) ;
  this.table.addKeyListener ( this, this.tableKey ) ;
  this.table.addSelectionListener ( this, this.tableSelected ) ;
  var str = "<xml>\n"
          + "<PopupMenu position='CENTER' >\n"
          + "  <MenuItem text='Delete Entry' onclick='*.removeSelectedHistoryEntry(event)' />\n"
          + "  <MenuItem text='Apply Formula' onclick='*.applyFormulaFromHistory(event)' />\n"
          + "  <MenuItem text='Append Formula' onclick='*.appendFormulaFromHistory(event)' />\n"
          + "  <MenuItem text='Apply Value' onclick='*.applyValueFromHistory(event)' />\n"
          + "  <MenuItem text='Append Value' onclick='*.appendValueFromHistory(event)' />\n"
          + "</PopupMenu>\n"
          + "</xml>\n"
          ;
  this.xTablePopupMenu = TSys.parseXml ( str ) ;
  this.popupClass = PopupMenu ;
  this._precision = 13 ;

  this.pbFunctions = this.container.getComponent ( "PB.FUNCTIONS" ) ;
};
Calculator.prototype =
{
  _functionNameList:
  [
    "sqrt"
  , "pow"
  , "abs"
  , "acos"
  , "asin"
  , "atan"
//  , "ceil"
  , "cos"
  , "exp"
//  , "floor"
  , "log"
//  , "max"
//  , "min"
  , "random"
//  , "round"
  , "sin"
  , "tan"
  ],
  _functionMenuCallback: function ( ev )
  {
    var mi = ev.getMenuItem() ;
    var name = mi.getName() ;
    if ( name.indexOf ( "(" ) < 0 ) name += "(" ;
    this.addChar ( name ) ;
  },
  _functionMenuHelper: function ( xpm, func )
  {
    var xi = xpm.addXml ( "MenuItem" ) ;
    xi.addAttribute ( "name", func ) ;
    xi.addAttribute ( "text", func + "()" ) ;
  },
  setPopupClass: function ( popupClass )
  {
    this.popupClass = popupClass ;
    this.table.setPopupMenu ( this.xTablePopupMenu, this.popupClass ) ;
    if ( this.pbFunctions.dom )
    {
      var xm = new TXml() ;
      var xpm = xm.addXml ( "PopupMenu" ) ;
      xpm.addAttribute ( "button", "left" ) ;
      xpm.addAttribute ( "position", "center" ) ;
      xpm.addAttribute ( "trigger", "mousedown" ) ;
//  xpm.addAttribute ( "class", "CosmosPopupMenu" ) ;
      for ( var i = 0 ; i < this._functionNameList.length ; i++ )
      {
        this._functionMenuHelper ( xpm, this._functionNameList[i] ) ;
      }
      this.pmw = new PopupMenuWrapper ( xm, this.pbFunctions.dom ) ;
      this.pmw.setPopupClass ( popupClass ) ;
      this._feFunctionMenuCallback = new TFunctionExecutor ( this, this._functionMenuCallback ) ;
      this.pmw._setDefaultAction ( this._feFunctionMenuCallback ) ;
    }
  },
  setTablePopupMenuXml: function ( xPopupMenu )
  {
    this.xTablePopupMenu = xPopupMenu ;
  },
  tableSelected: function ( event )
  {
    var index = this.table.getSelectedColumnIndex() ;
    if ( index !== 0 ) return ;
    var pm = null ;
    if ( ! this.xTablePopupMenu ) this.xTablePopupMenu = this.table.popupMenu ;
    if ( ! this.xTablePopupMenu ) return ;
    pm= new this.popupClass ( this.xTablePopupMenu, this.table.selectedCell ) ;
    pm.show ( event ) ;
  },
  tableKey: function ( event )
  {
    if ( event.type != "keypress" ) return ;
    var ev = new TEvent ( event ) ;
    var kc = ev.getKeyCode() ;
    if ( kc == 46 ) this.table.removeSelectedItem() ;
  },
  displayContainerKey: function ( event )
  {
    var ev = new TEvent ( event ) ;
    this.tfd.style.color = "black" ;
    if ( ! ev.isEnter() ) return ;
  },
  actionKey: function ( event )
  {
    var ev = new TEvent ( event ) ;
    this.tfd.style.color = "black" ;
    if ( ! ev.isEnter() ) return ;
    this.calc("=",true) ;
  },
  click: function ( event )
  {
    var ev = new TEvent ( event ) ;
    var e = ev.getSource() ;
    if ( ! e.name )
    {
      e = e.parentNode ;
    }
    if ( ev.getComponent().getDom() == this.displayContainer.getDom() )
    {
      return ;
    }
    if ( e.name )
    {
      this.tfd.style.color = "black" ;
      if ( e.name == "=" )
      {
        this.calc(e.name,true) ;
        return ;
      }
      if ( e.name.length == 1 ) this.addChar ( e.name ) ;
      else
      if ( e.name == "PI" ) this.addChar ( "\u03C0" ) ;
      else
      if ( e.name == 'inv' ) this.calcINV() ;
      else
      if ( e.name == 'CC' ) this.clearChar() ;
      else
      if ( e.name == 'CE' ) this.clearDisplay() ;
      else
      if ( e.name == 'sqrt' ) this.calcSQRT() ;
      else
      if ( e.name == 'radic3' ) this.calcRADIC3() ;
      else
      if ( e.name == 'super2' ) this.calcSUPER2() ;
      else
      if ( e.name == 'super3' ) this.calcSUPER3() ;
      else
      if ( e.name == 'LOG10' ) this.calcLOG10() ;
      else
      if ( e.name == '+/-' ) this.calcINVERT_SIGN() ;
      else
      this.calcFUNCTION(e.name) ;
    }
  },
  setActionIcon: function ( str )
  {
    this.actionIconString = "<img src='" + str + "' onmousedown='return false;' />" ;
  },
  addToHistory: function ( str, v, op )
  {
    var x = new TXml ( "row" ) ;
    if ( this.actionIconString )
    {
      x.add ( "ACTION", this.actionIconString ) ;
    }
    x.add ( "EXPRESSION", str ) ;
    x.add ( "RESULT", v ) ;
    x.add ( "OP", op ) ;
    this.table.insertRowAt ( x, 0 ) ;
  },
  _round: function ( v )
  {
    if ( typeof ( v ) != 'number' )
    {
      v = parseFloat ( v ) ;
    }
var vv = v.roundTo ( this._precision + 1 ) ;
var vvv = vv.toFixed ( this._precision ) ;
var vvvv = parseFloat ( vvv ) ;
//log ( "vv=" + vv ) ;
//log ( "vvv=" + vvv ) ;
//log ( "vvvv=" + vvvv ) ;
    return vvvv ;
  },
  display: function ( v, op )
  {
    if ( isNaN ( v ) || ! isFinite ( v ) ) this.tfd.style.color = "red" ;
    else
    {
      v = this._round ( v ) ;
      if ( op ) this.addToHistory ( this.tfd.value , v, op + " \u2192" ) ;
      this.tfd.value = v ;
    }
  },
  calcFUNCTION: function ( func )
  {
    var v = this.eval(func) ;
    this.display ( v, func.substring ( func.indexOf ( "." ) + 1 ) + "()" ) ;
  },
  calcLOG10: function()
  {
// x = 10 ** log ( x ) ;
// x = e ** ln ( x ) ;
// 10 ** log ( x ) = e ** ln ( x ) ;
// log(5) = 0.698970004336
// ln(5) = 1.60943791243
// ln(10) = 2.30258509299
// ln(5) / ln(10) = 0.698970004336
// log(x) = ln(x) / ln(10) ;
    var v = this.eval() ;
    v = Math.log ( v ) / Math.LN10 ;
    this.display ( v, "log()" ) ;
  },
  calcINVERT_SIGN: function()
  {
    var v = this.eval() ;
    this.display ( -1 * v ) ;
  },
  calcSUPER2: function()
  {
    var v = this.eval() ;
    this.display ( v * v, "x\u00B2" ) ;
  },
  calcSUPER3: function()
  {
    var v = this.eval() ;
    this.display ( v * v * v, "x\u00B3" ) ;
  },
  calcSQRT: function()
  {
    var v = this.eval() ;
    this.display ( Math.sqrt ( v ), "\u221Ax" ) ;
  },
  calcRADIC3: function()
  {
    var v = this.eval() ;
    this.display ( Math.pow ( v, 1/3 ), "\u221Bx" ) ;
  },
  calcINV: function()
  {
    var v = this.eval() ;
    this.display ( 1 / v, "1/x" ) ;
  },
  clearChar: function()
  {
    if ( this.tfd.value.length > 0 ) this.tfd.value = this.tfd.value.substring ( 0, this.tfd.value.length - 1 ) ;
    if ( ! this.tfd.value.length ) this.tfd.value = "" ;
  },
  addChar: function ( c )
  {
    var selStart = this.tf.getSelectionStart() ;
    var selEnd = this.tf.getSelectionEnd() ;
    var v = this.tfd.value ;
    if ( selStart == v.length ) this.tfd.value += c ;
    else
    {
      v = v.substring ( 0, selStart ) + c + v.substring ( selEnd ) ;
      this.tf.setText ( v ) ;
      this.tf.setCaretPosition ( selStart + c.length ) ;
    }
  },
  setStatusText: function ( txt )
  {
    if ( ! this.labelStatus || ! this.labelStatus.dom ) return ;
    if ( ! txt ) txt = "" ;
    txt = String ( txt ) ;
    this.labelStatus.setValue ( txt ) ;
  },
  eval: function ( func )
  {
    try
    {
      this.setStatusText() ;
      var org = this.tfd.value ;
      var s = org.replace ( /\u03C0/g, "" + Math.PI )
            .replace ( /pow/g, "Math.pow" )
            .replace ( /abs/g, "Math.abs" )
            .replace ( /ceil/g, "Math.ceil" )
            .replace ( /exp/g, "Math.exp" )
            .replace ( /floor/g, "Math.floor" )
            .replace ( /log/g, "Math.log" )
            .replace ( /max/g, "Math.max" )
            .replace ( /min/g, "Math.min" )
            .replace ( /random/g, "Math.random" )
            .replace ( /round/g, "Math.round" )
            .replace ( /sqrt/g, "Math.sqrt" )
            .replace ( /acos/g, "AC______" )
            .replace ( /asin/g, "AS______" )
            .replace ( /atan/g, "AT______" )
            .replace ( /cos/g, "Math.cos" )
            .replace ( /sin/g, "Math.sin" )
            .replace ( /tan/g, "Math.tan" )
            .replace ( /AC______/g, "Math.acos" )
            .replace ( /AS______/g, "Math.asin" )
            .replace ( /AT______/g, "Math.atan" )
            ;
      if ( func )
      {
        s = func + "(" + s + ")" ;
      }
      var v = parseFloat ( eval ( s ) ) ;
      if ( isNaN ( v ) ) this.setStatusText ( "Not a Number" ) ;
      else
      if ( ! isFinite ( v ) )  this.setStatusText ( "infinite" ) ;

      if ( isNaN ( v ) || ! isFinite ( v ) )
      {
        this.tfd.style.color = "red" ;
      }
      else
      {
        return this._round ( v ) ;
      }
    }
    catch ( exc )
    {
      var t = "" + exc ;
      var pos = 0 ;
      if ( t.indexOf ( "ReferenceError:" ) == 0 ) pos = t.indexOf ( ":" ) ;
      if ( t.indexOf ( "SyntaxError:" ) == 0 ) pos = t.indexOf ( ":" ) ;
      if ( pos ) t = t.substring ( pos+1 ).trim() ;
      this.setStatusText ( t ) ;
      this.tfd.style.color = "red" ;
    }
  },
  calc: function ( op, history )
  {
    try
    {
      this.setStatusText() ;
      var org = this.tfd.value ;
      var s = org.replace ( /\u03C0/g, "" + Math.PI )
            .replace ( /pow/g, "Math.pow" )
            .replace ( /abs/g, "Math.abs" )
            .replace ( /ceil/g, "Math.ceil" )
            .replace ( /exp/g, "Math.exp" )
            .replace ( /floor/g, "Math.floor" )
            .replace ( /log/g, "Math.log" )
            .replace ( /max/g, "Math.max" )
            .replace ( /min/g, "Math.min" )
            .replace ( /random/g, "Math.random" )
            .replace ( /round/g, "Math.round" )
            .replace ( /sqrt/g, "Math.sqrt" )
            .replace ( /acos/g, "AC______" )
            .replace ( /asin/g, "AS______" )
            .replace ( /atan/g, "AT______" )
            .replace ( /cos/g, "Math.cos" )
            .replace ( /sin/g, "Math.sin" )
            .replace ( /tan/g, "Math.tan" )
            .replace ( /AC______/g, "Math.acos" )
            .replace ( /AS______/g, "Math.asin" )
            .replace ( /AT______/g, "Math.atan" )
            ;
      var v = parseFloat ( eval ( s ) ) ;
      if ( isNaN ( v ) ) this.setStatusText ( "Not a Number" ) ;
      else
      if ( ! isFinite ( v ) )  this.setStatusText ( "infinite" ) ;

      if ( isNaN ( v ) || ! isFinite ( v ) ) this.tfd.style.color = "red" ;
      else
      {
        v = this._round ( v ) ;
        this.tfd.value = v ;
        if ( history ) this.addToHistory ( org, v, op ) ;
      }
    }
    catch ( exc )
    {
      var t = "" + exc ;
      var pos = 0 ;
      if ( t.indexOf ( "ReferenceError:" ) == 0 ) pos = t.indexOf ( ":" ) ;
      if ( t.indexOf ( "SyntaxError:" ) == 0 ) pos = t.indexOf ( ":" ) ;
      if ( pos ) t = t.substring ( pos+1 ).trim() ;
      this.setStatusText ( t ) ;
      this.tfd.style.color = "red" ;
    }
  },
  clearDisplay: function()
  {
    this.tfd.value = "";
  },
  clearHistory: function ( ev )
  {
    this.table.clear() ;
  },
  getData: function()
  {
    try
    {
      var x = TSys.getUserXml ( "/applicationdata/Calculator/Data.xml" ) ;
      if ( ! x ) return ;
      var xm = x.ensureXml ( "MEMORY" ) ;
      var xh = x.getXml ( "HISTORY" ) ;
      var en = xh.getEnum ( "row" ) ;
      while ( en.hasNext() )
      {
        var r = en.nextXml() ;
        var e = r.getXml ( "ACTION" ) ;
        if ( e ) e.remove() ;
        if ( this.actionIconString )
        {
          r.add ( "ACTION", this.actionIconString ) ;
        }
      }
      if ( this.container ) this.container.setValues ( x ) ;
      return x ;
    }
    catch ( exc )
    {
//log ( exc ) ;
    }
  },
  saveData: function ( xml )
  {
    if ( ! xml ) xml = this.container.getValues() ;
    var q = xml.getXml ( "q" ) ;
    if ( q ) q.remove() ;
    var xh = xml.getXml ( "HISTORY" ) ;
    var en = xh.getEnum ( "row" ) ;
    while ( en.hasNext() )
    {
      var r = en.nextXml() ;
      var e = r.getXml ( "ACTION" ) ;
      if ( e ) e.remove() ;
    }
    TSys.saveUserXml ( "/applicationdata/Calculator/Data.xml", xml ) ;
  },
  store: function ( n, str )
  {
    var r = this.memory.findRow ( "ID", "" + n ) ;
    var x = new TXml() ;
    var xRow = new TXml ( "row" ) ;
    xRow.add ( "ID", "" + n ) ;
    xRow.add ( "VALUE", this.tf.getText() ) ;
    if ( ! r )
    {
      this.memory.addRow ( xRow ) ;
    }
    else
    {
      r.update ( xRow ) ;
    }
  },
  recall: function ( n )
  {
    var r = this.memory.findRow ( "ID", "" + n ) ;
    var v = "" ;
    if ( r )
    {
      xRow = r.getXml() ;
      v = xRow.getContent ( "VALUE" ) ;
    }
    this.addChar ( v ) ;
  }
};
TextFieldDelayedEventHandler = function ( textfield, params, callbackObject, callbackMethod )
{
  if ( ! ( textfield instanceof TTextField ) )
  {
    textfield = new TTextField ( textfield ) ;
  }
  this.tf = textfield ;
  if ( params.callbackObject instanceof TFunctionExecutor )
  {
    this.fe = params.callbackObject ;
  }
  else
  {
    this.fe = new TFunctionExecutor ( params.callbackObject, params.callbackMethod ) ;
  }
  TGui.addToBeFlushed ( this.tf.getDom(), this ) ;
  this.tf.getDom().xTextFieldResultList = this ;
  this.timer = null ;
  this.timeoutMillis = 500 ;

  this.action = false ;
  if ( params.on === "action" )
  {
    this.action = true ;
    params.on = Tango.ua.ie ? "keydown" : "keyup" ;
  }
  TGui.addEventListener ( this.tf.getDom(), params.on, this.onkey.bindAsEventListener ( this ) ) ;
  this._init() ;
};
TextFieldDelayedEventHandler.prototype =
{
  setTimoutMillis: function ( millis )
  {
    this.timeoutMillis = millis ;
  },
  flush: function()
  {
    if ( this._flushed ) return ;
    this._flushed = true ;
    this.reset() ;
    this.timer = null ;
  },
  reset: function()
  {
    this.timer.stop() ;
  },
  _init: function()
  {
    var thiz = this ;
    this.timer = new TTimer ( this.timeoutMillis, function()
    {
      thiz._timedout() ;
    } );
    this.timer.setRepeats ( false ) ;
  },
  _timedout: function()
  {
    var ev = new TEvent() ;
    ev.setHtmlSource ( this.tf.dom ) ;
    this.fe.executeWithEvent ( ev ) ;
  },
  onkey: function ( event )
  {
    var ev = new TEvent ( event ) ;
    var kc = ev.getKeyCode() ;
    if ( ev.isEscape() )
    {
      ev.consume() ;
      this.reset() ;
    }
    else
    if ( ev.isEnter() )
    {
      this.reset() ;
      if ( this.action )
      {
        var ev = new TEvent() ;
        ev.setHtmlSource ( this.tf.dom ) ;
        this.fe.executeWithEvent ( ev ) ;
      }
    }
    else
    if ( ev.isAlt()
       || ( ev.isCtrl() && ev.getCharCode() !== 'V' )
       || kc === 37
       || kc === 38
       || kc === 39
       || kc === 40
       || kc === 13
       || kc === 9
       || kc === 16
       || kc === 17
       || kc === 18
       || kc === 19
       || kc === 27
       )
    {
      this.timer.stop() ;
      return ;
    }
    else
    if ( ev.isCursorUp() || ev.isCursorDown() )
    {
      this.timer.stop() ;
    }
    else
    if ( ev.isCursorLeft() || ev.isCursorRight() )
    {
      this.timer.stop() ;
    }
    else
    {
      this.timer.restart() ;
    }
  }
};

TextFieldResultList = function ( textfield, callbackObject, callbackMethod )
{
  if ( ! ( textfield instanceof TTextField ) )
  {
    textfield = new TTextField ( textfield ) ;
  }
  this.tf = textfield ;
  if ( callbackObject instanceof TFunctionExecutor )
  {
    this.fe = callbackObject ;
  }
  else
  {
    this.fe = new TFunctionExecutor ( callbackObject, callbackMethod ) ;
  }
  TGui.addToBeFlushed ( this.tf.getDom(), this ) ;
  this.tf.getDom().xTextFieldResultList = this ;
  this.timer = null ;
  this.div = null ;
  this.currentEntry = null ;
  this.timeoutMillis = 400 ; //200 ;
  this._init() ;
};
TextFieldResultList.prototype =
{
  flush: function()
  {
    if ( this._flushed ) return ;
    this.tf.getDom().xTextFieldResultList = null ;
    this._flushed = true ;
    this.reset() ;
    this.timer = null ;
    TGlobalEventHandler.removeOnMouseDown ( this.globalFunctionExecutor ) ;
  },
  reset: function()
  {
    this.timer.stop() ;
    if ( this.div )
    {
      this.tf.getDom().focus() ;
      TGui.flushAttributes ( this.div, true ) ;
      while ( this.div.firstChild )
      {
        this.div.removeChild ( this.div.firstChild ) ;
      }
      document.body.removeChild ( this.div ) ;
    }
    this.currentEntry = null ;
    this.div = null ;
  },
  click: function ( event )
  {
    this.timer.stop() ;
    var ev = new TEvent ( event ) ;
    var src = ev.getSource() ;
    if ( src.nodeName == 'B' ) src = src.parentNode ;
    var str = src.t ;
    this.tf.setText ( str ) ;
    this.reset() ;
    if ( this.tf.getDom().fExecutor )
    {
      ev.setHtmlSource ( this.tf.getDom() ) ;
      this.tf.getDom().fExecutor.executeWithEvent ( ev ) ;
    }
  },
  _init: function ( event )
  {
    var thiz = this ;
    this.timer = new TTimer ( this.timeoutMillis, function()
    {
      thiz._timedout() ;
    } );
    this.timer.setRepeats ( false ) ;
    TGui.addEventListener ( this.tf.getDom(), "keypress", this.tfKeypress.bindAsEventListener ( this ) ) ;
    TGui.addEventListener ( this.tf.getDom(), "keydown", this.tfKeydown.bindAsEventListener ( this ) ) ;
    /*
    TGui.addEventListener ( this.tf.getDom(), "keyup", this.tfConsume.bindAsEventListener ( this ) ) ;
    TGui.addEventListener ( this.tf.getDom(), "keypress", this.tfConsume.bindAsEventListener ( this ) ) ;
    */
    this.globalFunctionExecutor = TGlobalEventHandler.addOnMouseDown ( new TFunctionExecutor ( this, this._closeOnMouseDown ) ) ;
  },
  _timedout: function()
  {
    var ev = new TEvent() ;
    ev.setHtmlSource ( this.tf.dom ) ;
    if ( this.resultlistPatternType == "ASYNC" )
    {
      var thiz = this ;
      ev.callback = function ( a )
      {
        thiz._timedout_2 ( a ) ;
      } ;
      this.fe.executeWithEvent ( ev ) ;
    }
    else
    {
      var a = this.fe.executeWithEvent ( ev ) ;
      this._timedout_2 ( a ) ;
    }
  },
  _timedout_2: function ( a )
  {
    var i ;
    var span ;
    var t ;
    var t1 ;
    var t2 ;
    var t3 ;
    var str ;
    if ( this.div )
    {
      while ( this.div.firstChild )
      {
        this.div.removeChild ( this.div.firstChild ) ;
      }
    }
    if ( !a || ! a.length )
    {
      this.reset() ;
      return ;
    }
    this.tfloc = this.tf.getBoundsOnPage() ;
    if ( ! this.div )
    {
      this.div = document.createElement ( "span" ) ;
      this.div.className = "ThemeDisplayContainer" ;
      document.body.appendChild ( this.div ) ;
      this.div.style.zIndex = TGui.zIndexDnD ;
      this.div.style.position = 'absolute' ;
      this.div.style.top = ( this.tfloc.y + this.tfloc.height ) + "px" ;
      this.div.style.width = ( this.tfloc.width ) + "px" ;
      this.div.style.left = this.tfloc.x + "px" ;
      TGui.addEventListener ( this.div, "click", this.click.bindAsEventListener ( this ) ) ;
      this.divInnerSize = new TComponent ( this.div ).getInnerSize() ;
    }
/*
tfrl.resultlistPatternType = a["resultlistPatternType"] ;
*/
    var text = this.tf.getText() ;
    var TEXT = text.toUpperCase() ;
    var textLen = text.length ;

    if ( this.resultlistPatternType == "like" )
    {
      for ( i = 0 ; i < a.length ; i++ )
      {
        span = document.createElement ( "div" ) ;
        this.div.appendChild ( span ) ;
        span.className = "ThemeTableRowClass" ;
        t = a[i] ;
        var T = t.toUpperCase() ;
        span.t = t ;
        var pos = T.indexOf ( TEXT ) ;
        t1 = t.substring ( 0, pos ) ;
        t2 = t.substring ( pos, pos + textLen) ;
        t3 = t.substring ( pos + textLen ) ;

        span.innerHTML = t1 + "<b>" + t2 + "</b>" + t3 ;
        span.style.width = ( this.divInnerSize.width ) + "px" ;
        span.style.padding = "2px" ;
      }
    }
    else
    {
      for ( i = 0 ; i < a.length ; i++ )
      {
        span = document.createElement ( "div" ) ;
        this.div.appendChild ( span ) ;
        span.className = "ThemeTableRowClass" ;
        t = a[i] ;
        span.t = t ;
        t1 = t.substring ( 0, textLen ) ;
        t2 = t.substring ( textLen ) ;
        span.innerHTML = t1 + "<b>" + t2 + "</b>" ;
        span.style.width = ( this.divInnerSize.width ) + "px" ;
        span.style.padding = "2px" ;
      }
    }
  },
  tfKeypress: function ( event )
  {
    var ev = new TEvent ( event ) ;
    if ( ev.isCursorUp() )
    {
      // ev.consume() ;
      return ;
    }
    if ( ev.isCursorDown() )
    {
      // ev.consume() ;
      return ;
    }
    if ( ev.isEscape() )
    {
      this.tf.dom.focus() ;
    }
    else
    if ( ev.isEnter() )
    {
      this.tf.dom.focus() ;
    }
    else
    if ( ev.isCursorUp() || ev.isCursorDown() )
    {
    }
  },
  tfKeydown: function ( event )
  {
    var ne ;
    var str ;
    var ev = new TEvent ( event ) ;
    var kc = ev.getKeyCode() ;
    
    if ( this.div )
    {
      if ( ev.isCursorUp() )
      {
        ev.consume() ;
        if ( this.currentEntry )
        {
          this.currentEntry.className = "ThemeTableRowClass" ;
          ne = this.currentEntry.previousSibling ;
          if ( ! ne ) this.currentEntry = this.div.lastChild ;
          else this.currentEntry = ne ;
        }
        else
        {
          this.currentEntry = this.div.lastChild ;
        }
        this.currentEntry.className = "ThemeTableRowClassSelected" ;
        str = this.currentEntry.t ;
        this.tf.setText ( str ) ;
        return ;
      }
      if ( ev.isCursorDown() )
      {
        ev.consume() ;
        if ( this.currentEntry )
        {
          this.currentEntry.className = "ThemeTableRowClass" ;
          ne = this.currentEntry.nextSibling ;
          if ( ! ne ) this.currentEntry = this.div.firstChild ;
          else this.currentEntry = ne ;
        }
        else
        {
          this.currentEntry = this.div.firstChild ;
        }
        this.currentEntry.className = "ThemeTableRowClassSelected" ;
        str = this.currentEntry.t ;
        this.tf.setText ( str ) ;
        return ;
      }
    }
    if ( ev.isEscape() )
    {
      ev.consume() ;
      this.reset() ;
    }
    else
    if ( ev.isEnter() )
    {
      this.tf.dom.focus() ;
      this.reset() ;
    }
    else
    if ( ev.isCursorUp() || ev.isCursorDown() )
    {
      ev.consume() ;
      this.timer.stop() ;
    }
    else
    if ( ev.isAlt()
       || ( ev.isCtrl() && ev.getCharCode() !== 'V' )
       || kc === 37
       || kc === 38
       || kc === 39
       || kc === 40
       || kc === 13
       || kc === 9
       || kc === 16
       || kc === 17
       || kc === 18
       || kc === 19
       || kc === 27
       )
    {
      this.timer.stop() ;
      return ;
    }
    else
    {
      this.timer.restart() ;
    }
  },
  _closeOnMouseDown: function ( event )
  {
    var ev = new TEvent ( event ) ;
    var src = ev.getSource() ;
    if ( src.nodeName == 'B' ) src = src.parentNode ;
    if ( src === this.div || src.parentNode === this.div ) return true ;
    this.reset() ;
    return true ;
  }
} ;
/**
 *  @constructor
 */
MultiHash = function()
{
  this._hash = [] ;
};
MultiHash.prototype =
{
  put: function ( key, obj )
  {
    var l = this._hash[key] ;
    if ( ! l )
    {
      l = [] ;
      this._hash[key] = l ;
    }
    l.push ( obj ) ;
  },
  remove: function ( key, obj )
  {
    var l ;
    var index ;
    if ( key && ( typeof key === 'object' || typeof key === 'function' ) )
    {
      obj = key ;
      var keys = this.getKeys() ;
      for ( var i = 0 ; i < keys.length ; i++ )
      {
        l = this._hash[keys[i]]
        index = l.indexOf ( obj ) ;
        if ( index < 0 ) continue ;
        l.splice ( index, 1 ) ;
        if ( ! l.length )
        {
          delete this._hash[keys[i]] ;
        }
      }
      return ;
    }
    l = this._hash[key] ;
    if ( ! obj )
    {
      if ( ! l ) return false ;
      delete this._hash[key] ;
      return true ;
    }
    l = this._hash[key] ;
    if ( ! l ) return false ;
    return l.remove ( obj ) ;
  },
  get: function ( key )
  {
    var l = this._hash[key] ;
    return l ;
  },
  toString: function()
  {
    var str = "(MultiHash)" ;
    str += "size=" + this._hash.length ;
    for ( var k in this._hash )
    {
      var l = this._hash[k] ;
      if ( ! TSys.isArray ( l ) ) continue ;
      str += "\n  key=" + k + ",size=" + l.length ;
      if ( l.length == 1 )
      {
        str += "," + l[0] ;
      }
      else
      {
        for ( var i = 0 ; i < l.length ; i++ )
        {
          str += "\n    " + i + ":" + l[i] ;
        }
      }
    }
    return str ;
  }
};
TComponent.prototype.addTransitionEndListener = function ( listener )
{
  if ( ! this.dom ) return ;
  if ( this.dom.style.MozTransitionProperty !== undefined )
  {
    this.dom.addEventListener ( "transitionend", function ( e ) { listener ( e ) ; }, false ) ;
  }
  else
  if ( this.dom.style.OTransitionProperty !== undefined )
  {
    this.dom.addEventListener ( "oTransitionEnd", function ( e ) { listener ( e ) ; }, false ) ;
  }
  else
  if ( this.dom.style.WebkitTransitionProperty !== undefined )
  {
    this.dom.addEventListener ( "webkitTransitionEnd", function ( e ) { listener ( e ) ; }, false ) ;
  }
  else
  {
    this.dom.addEventListener ( "transitionend", function ( e ) { listener ( e ) ; }, false ) ;
  }
};
TComponent.prototype.setTransition = function ( property, duration, timingFunction )
{
  if ( ! this.dom ) return ;
  if ( ! timingFunction ) timingFunction = "ease-out" ;
  var dom = this.dom ;
  if ( dom.style.transitionProperty !== undefined )
  {
    dom.style.transitionProperty = property ;
    dom.style.transitionDuration = duration ;
    dom.style.transitionTimingFunction = timingFunction ;
  }
  else
  if ( dom.style.OTransitionProperty !== undefined )
  {
    dom.style.OTransitionProperty = property ;
    dom.style.OTransitionDuration = duration ;
    dom.style.OTransitionTimingFunction = timingFunction ;
  }
  else
  if ( dom.style.MozTransitionProperty !== undefined )
  {
    dom.style.MozTransitionProperty = property ;
    dom.style.MozTransitionDuration = duration ;
    dom.style.MozTransitionTimingFunction = timingFunction ;
  }
  else
  if ( dom.style.WebkitTransitionProperty !== undefined )
  {
    dom.style.WebkitTransitionProperty = property ;
    dom.style.WebkitTransitionDuration = duration ;
    dom.style.WebkitTransitionTimingFunction = timingFunction ;
  }
  else
  if ( dom.style.MsTransitionProperty !== undefined )
  {
    dom.style.MsTransitionProperty = property ;
    dom.style.MsTransitionDuration = duration ;
    dom.style.MsTransitionTimingFunction = timingFunction ;
  }
  else
  {
    dom.style.transitionProperty = property ;
    dom.style.transitionDuration = duration ;
    dom.style.transitionTimingFunction = timingFunction ;
  }
} ;
