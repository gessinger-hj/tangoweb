// --------------------- Window ----------------
Tango.include ( "TComponents" ) ;
Tango.include ( "TUtil" ) ;
/**
 *  @constructor
 *  @extends TComponent
 */
var TWindow = function ( name, axlAttributes )
{
  Tango.initSuper( this, TComponent, null );
  this.jsClassName = "TWindow" ;
  if ( name ) this.setAxl ( name ) ;
  this.title = null ;
  this.modal = true ;
  this._resizable = true ;
  this._showResizeGripper = true ;
  this.savePosition = true ;
  this._closerVisible = true ;
  this._closerSingle = false ;
  this._maxRestoreVisible = true ;
  this.onClose = null ;
  this._closing = false ;
  this._closed = false ;
  this.cursorPosition = -1 ;
  this.windowListener = null ;
  this.dragStartListener = [] ;
  this.currentZIndex = TGui.zIndexWindow ;
  this.activated = true ;
  this._attributes = [] ;
  this._fadeOut = false ;
  this._fadeIn = false ;
  this._animateOut = false ;
  this._animateIn = false ;
  this._alwaysOnTop = false ;
  this._borderless = false ;
  this._dragable = false ;
  this._resizeBorderWatermark = 6 ;
  this._backgroundColor = null ;
  this._pagelet = null ;
  this._currentBoundsOnPage = null ;
  this._ignoreDecorator = false ;
  this._initialX = -1 ;
  this._initialY = -1 ;
  this.xPeerIsWindow = true ;
  this._created = false ;
  this._bodyClassName = "ThemeWindowBody" ;
  this._className = "ThemeWindow" ;
  this._classNameActivated = "ThemeWindowActivated" ;
  this._closeWithEscape = false ;
  this._excluseDrag = [] ;
  this._axlAttributes = axlAttributes ;
  this._flushed = false ;
  this._shown = false ;
  this._showing = false ;
};
TWindow.inherits( TComponent ) ;
TWindow.prototype.isFlushed = function()
{
  return this._flushed  ;
} ;
TWindow.prototype.isShown = function()
{
  return this._shown  ;
} ;
TWindow.prototype.isShowing = function()
{
  return this._showing  ;
} ;
TWindow.prototype.isClosed = function()
{
  return this._closed  ;
} ;
TWindow.prototype.isClosing = function()
{
  return this._closing  ;
} ;
TWindow.prototype.setFadeInOut = function ( state )
{
  this._fadeOut = state ;
  this._fadeIn = state ;
};
TWindow.prototype.setAnimateInOut = function ( state )
{
  this._animateOut = state ;
  this._animateIn = state ;
};
TWindow.prototype.getPagelet = function()
{
  return this._pagelet ;
};
TWindow.prototype.setPagelet = function ( pagelet )
{
  this._pagelet = pagelet ;
  if ( ! this._pagelet ) return ;
  if ( typeof ( this._pagelet ) != 'object' ) return ;
  if ( typeof ( this._pagelet.isPagelet ) != 'function' )
  {
    this._pagelet.isPagelet = function() { return true; } ;
  }
};
TWindow.prototype.setBorderless = function()
{
  this._borderless = true ;
};
TWindow.prototype.setAlwaysOnTop = function ( state )
{
  this._alwaysOnTop = state ? true : false ;
  if ( this._alwaysOnTop )
  {
    this.currentZIndex = TGui.zIndexWindowAlwaysOnTop ;
  }
};
TWindow.prototype.isAlwaysOnTop = function()
{
  return this._alwaysOnTop ;
};
TWindow.prototype.addAttribute = function ( name, value )
{
  if ( typeof ( name ) != 'string' ) return ;
  if ( typeof ( value ) == 'undefined' ) return ;
  this._attributes[ name ] = value ;
};
TWindow.prototype.getAttribute = function ( name )
{
  if ( typeof ( name ) != 'string' ) return ;
  return this._attributes[ name ] ;
};
TWindow.prototype.getAttributes = function()
{
  return this._attributes ;
};
TWindow.prototype.setAxl = function ( name )
{
  if ( ! name ) return ;

  if ( typeof ( name ) == 'string' )
  {
    if ( name.indexOf ( "<" ) >= 0 )
    {
      this.name = null ;
      this.id   = null ;
      this.axl = TSys.parseDom ( name ) ;
    }
    else
    {
      this.name = name ;
      this.id   = null ;
      this.axl = null ;
    }
  }
  else
  if ( typeof ( name ) == 'object' )
  {
    this.name = null ;
    this.id   = null ;
    if ( name.jsClassName && name.jsClassName == 'TXml' )
    {
      this.axl = name.getDom() ;
    }
    else
    {
      this.axl = name ;
    }
  }
};
TWindow.prototype.excludeDrag = function ( c )
{
  this._excluseDrag.push ( c ) ;
};
TWindow.prototype.isDragAllowdFromPoint = function ( x, y )
{
  for ( var i = 0 ; i < this._excluseDrag.length ; i++ )
  {
    if ( this._excluseDrag[i].contains ( x, y ) ) return false ;
  }
  return true ;
};
TWindow.prototype.addDragStartListener = function ( obj, method )
{
  var fx = new TFunctionExecutor ( obj, method ) ;
  this.dragStartListener.push ( fx ) ;
};
TWindow.prototype._addWindowListener = function ( str, eventType, layoutContext )
{
  var fx = new TFunctionExecutor ( str, layoutContext ) ;
  fx.xEventType = eventType ;
  if ( ! this.windowListener )
  {
    this.windowListener = [] ;
  }
  this.windowListener.push ( fx ) ;
};
TWindow.prototype.on = function ( obj, method, eventType )
{
  this.addWindowListener ( obj, method, eventType ) ;
};
TWindow.prototype.addWindowListener = function ( obj, method, eventType )
{
  var fx = null ;
  if (  obj
     && typeof ( obj ) == 'object'
     && typeof ( obj.windowClosing ) == 'function'
     )
  {
    fx            = new TFunctionExecutor ( obj, obj.windowClosing ) ;
    eventType     = "onclose" ;
    fx.xEventType = eventType ;
  }
  else
  {
    if ( obj && method && eventType ) {}
    else
    if ( typeof obj === 'string' && typeof method === 'function' )
    {
      eventType = obj ;
      obj       = method ;
    }
    if ( ! method && ! eventType ) eventType = "onclose" ;
    else
    if ( typeof ( method ) == "string" && ! eventType )
    {
      eventType = method ;
      method    = null ;
    }
    else
    if ( obj && method && ! eventType ) eventType = "onclose" ;
    fx = new TFunctionExecutor ( obj, method ) ;
    if ( eventType.indexOf ( "on" ) !== 0 )
    {
      eventType = "on" + eventType ;
    }
    fx.xEventType = eventType ;
  }
  if ( ! this.windowListener )
  {
    this.windowListener = [] ;
  }
  this.windowListener.push ( fx ) ;
};
TWindow.prototype.toString = function()
{
  if ( ! this.dom )
  {
  return "(" + this.jsClassName + ")[state=invalid,id=" + this.id
       + "]"
       ;
  }
  return "(" + this.jsClassName + ")[id=" + this.id
       + ",x=" + this.dom.offsetLeft
       + ",y=" + this.dom.offsetTop
       + ",width=" +  this.dom.offsetWidth
       + ",height=" +  this.dom.offsetHeight
       + "]"
       ;
};
TWindow.prototype.resizeStart = function ( event )
{
};
TWindow.prototype.resizeEnd = function ( event )
{
  if ( TSys.isIE6() )
  {
    if ( this._currentBoundsOnPage ) TGui.setAllInputVisible ( null, this._currentBoundsOnPage, true, this.dom ) ;
    this._currentBoundsOnPage = TGui.getBoundsOnPageOf ( this.dom ) ;
    TGui.setAllInputVisible ( null, this._currentBoundsOnPage, false, this.dom ) ;
  }
};
TWindow.prototype.dragStart = function ( event )
{
  if ( ! this.isDragAllowdFromPoint ( event ) ) return false ;
  for ( var i = 0 ; i < this.dragStartListener.length ; i++ )
  {
    if ( this.dragStartListener[i].executeWithEvent ( event ) === false ) return false ;
  }
  if ( this._borderless && this._dragable )
  {
    return true ;
  }
  if ( this.cursorPosition < 0 ) return false ;
  if ( this.isMaximized() ) return false ;
  if ( ! this.cursorPosition )
  {
    var dom = Tango.getThemeDom ( "Globals/Window", "drag" ) ;
    if ( ! TSys.isIE() && dom )
    {
      var x = new TXml ( dom ) ;
      var op = x.getFloatAttribute ( "opacity" ) ;
      if ( ! isNaN ( op ) ) this.setOpacity ( op ) ;
    }
  }
  return true ;
};
TWindow.prototype.dragEnd = function ( event )
{
  if ( TSys.isIE6() )
  {
    if ( this._currentBoundsOnPage ) TGui.setAllInputVisible ( null, this._currentBoundsOnPage, true, this.dom ) ;
    this._currentBoundsOnPage = TGui.getBoundsOnPageOf ( this.dom ) ;
    TGui.setAllInputVisible ( null, this._currentBoundsOnPage, false, this.dom ) ;
  }
  else
  if ( ! TSys.isIE() )
  {
    this.setOpacity ( 1 ) ;
  }
};
TWindow.prototype.setSavePosition = function ( state )
{
  this.savePosition = state ? true : false ;
};
TWindow.prototype.toFront = function()
{
  TWM.toFront ( this ) ;
};
TWindow.prototype.windowClicked = function()
{
  TWM.toFront ( this ) ;
};
TWindow.prototype.close = function ( event )
{
//  if ( ! this.id ) return ;
  this._close ( event, false ) ;
};
TWindow.prototype.closeImmediately = function()
{
//  if ( ! this.id ) return ;
  this._close ( null, true ) ;
};
TWindow.prototype.closeImediately = function()
{
//  if ( ! this.id ) return ;
  this._close ( null, true ) ;
};
TWindow.prototype._close = function ( event, imediately )
{
  if ( this._flushed ) return ;
  if ( this._closing )
  {
    return ;
  }
  this._closing = true ;
  var animator = null ;
  if ( event && typeof ( event ) === 'object' && typeof ( event.start ) === 'function' )
  {
    animator = event ;
  }
  else
  {
    if ( ! imediately )
    {
      if ( this.windowListener )
      {
        var i = 0 ;
        ev = new TWindowEvent ( event, TWindowEvent.prototype.WINDOW_CLOSING ) ;
        ev.setHtmlSource ( this.mdiv ) ;
        ev.setPeer ( this ) ;
        for ( i = 0 ; i < this.windowListener.length ; i++ )
        {
          var fx = this.windowListener[i] ;
          if ( fx.xEventType !== "onclose" ) continue ;
          fx.executeWithEvent ( ev ) ;
          if ( ev.isConsumed() )
          {
            this._closing = false ;
            ev.flush() ;
            return ;
          }
        }
        ev.flush() ;
      }
    }
  }
  if ( this.windowListener )
  {
    var i = 0 ;
    ev = new TWindowEvent ( event, TWindowEvent.prototype.WINDOW_CLOSED ) ;
    ev.setHtmlSource ( this.mdiv ) ;
    ev.setPeer ( this ) ;
    for ( i = 0 ; i < this.windowListener.length ; i++ )
    {
      var fx = this.windowListener[i] ;
      if ( fx.xEventType !== "onclosed" ) continue ;
      fx.executeWithEvent ( ev ) ;
    }
    ev.flush() ;
  }

  if ( this._closed ) return ;

  if ( this.css ) Tango.unuseCss ( this.css ) ;
  var pd = TSys.getPersistentData() ;
  if ( this.id && pd )
  {
    var xpd = pd.ensureXml ( "Windows/" + this.id ) ;
    var lpd = new TPersistentData ( xpd ) ;
    TGui._collectPersistentData ( lpd, this.dBody );
    if ( lpd.isEmpty() )
    {
      xpd.remove() ;
    }
  }
  if ( this.modal )
  {
    TGui.releaseModalDialogZIndex() ;
  }
  if ( this.dom.xSavePosition )
  {
    var p = this.getNormalBounds() ;
    TWM.setSavedWindowBounds ( this.dom.id, p ) ;
  }
  if ( animator && typeof ( animator ) == 'object' && typeof ( animator.start ) == 'function' )
  {
    animator.start() ;
  }
  else
  {
    if ( this._fadeOut ) // this._fadeOut && TSys.getPreferenceValueBool ( "WindowCloseAnimationFadeOut", false ) )
    {
      var win = this ;
      TAnimator.fadeOut ( this,
      {
        onComplete: function()
        {
          TWM.removeWindow ( win ) ;
          win._flush() ;
        }
      } ) ;
    }
    else
    if ( this._animateOut ) // this._fadeOut && TSys.getPreferenceValueBool ( "WindowCloseAnimationFadeOut", false ) )
    {
      var win = this ;
      TAnimator.animateOut ( this,
      {
        onComplete: function()
        {
          TWM.removeWindow ( win ) ;
          win._flush() ;
        }
      } ) ;
    }
    else
    {
      TWM.removeWindow ( this ) ;
      this._flush() ;
    }
  }
};
TWindow.prototype._flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  this._closed = true ;
  var ch = this.dom ;
  TGui.flushAttributes ( ch, true ) ;
  ch.parentNode.removeChild ( ch ) ;

  if ( this.mdiv )
  {
    TGui.flushEventListener ( this.mdiv ) ;
    this.mdiv.parentNode.removeChild ( this.mdiv ) ;
  }
  TGui.flushAttributes ( this.dom ) ;
  this.dom = null ;
  if ( ! this._borderless )
  {
    this.mdiv = null ;
    this.dTop = null ;
    this.dTitle = null ;
    this.dLeft = null ;
    this.dBottom = null ;
    this.dRight = null ;
    this.dClose = null ;
    this.dMaxRestore = null ;
  }
  this.dBody = null ;
  if ( TSys.isIE6() )
  {
    if ( this._currentBoundsOnPage ) TGui.setAllInputVisible ( null, this._currentBoundsOnPage, true, this.dom ) ;
    this._currentBoundsOnPage = null ;
  }
  this.id = null ;
  this.externalAttributes = null ;
  this.firstTextField = null ;
  this.firstINPUT = null ;
  this._attributes.length = 0 ;
  this._attributes = null ;
  this.focusElement = null ;
};
TWindow.prototype.isMaximized = function()
{
  return this.isMaximizedState ? true : false ;
};
TWindow.prototype.maximize = function ( type )
{
  this.normalBounds = this.getBounds() ;
  var size = TGui.getBrowserWindowSize() ;

  if ( this.dMaxRestore )
  {
    TGui.setImageSrc ( this.dMaxRestore, "WindowRestore", "normal" ) ;
  }
  this.isMaximizedState = true ;

  if ( isNaN ( type ) || type == 1 )
  {
    this.maximizedType = 1 ;
    this.setBounds ( 0, 0, size.width, size.height ) ;
  }
  else
  if ( type == 2 )
  {
    this.maximizedType = 2 ;
    this.setBounds ( 0, this.normalBounds.y, size.width, this.normalBounds.height ) ;
  }
  else
  if ( type == 3 )
  {
    this.maximizedType = 3 ;
    this.setBounds ( this.normalBounds.x, 0, this.normalBounds.width, size.height ) ;
  }
};
TWindow.prototype.restore = function()
{
  if ( this.dMaxRestore )
  {
    TGui.setImageSrc ( this.dMaxRestore, "WindowMax", "normal" ) ;
  }
  this.isMaximizedState = false ;
  if ( this.normalBounds )
  {
    this.setBounds ( this.normalBounds.x
                   , this.normalBounds.y
                   , this.normalBounds.width
                   , this.normalBounds.height
                   ) ;
    this.normalBounds = null ;
  }
};
TWindow.prototype.getNormalBounds = function()
{
  if ( this.normalBounds ) return this.normalBounds ;
  return this.getBounds() ;
};
TWindow.prototype.setCloserVisible = function ( state )
{
  this._closerVisible = state ? true : false ;
  if ( ! this._closerVisible ) this._maxRestoreVisible = false ;
};
TWindow.prototype.setMaxRestoreVisible = function ( state )
{
  this._maxRestoreVisible = state ? true : false ;
  if ( ! this._maxRestoreVisible ) this._closerSingle = true ;
};
TWindow.prototype.setModal = function ( state )
{
  this.modal = state ? true : false ;
  this.modalIsSet = true ;
};
TWindow.prototype.isModal = function()
{
  return this.modal ;
};
TWindow.prototype.isResizable = function() { return this._resizable ; };
TWindow.prototype.isBorderless = function() { return this._borderless ; };
TWindow.prototype.isDragable = function() { return this._dragable ; };
TWindow.prototype.setBackgroundColor = function ( bg ) { this._backgroundColor = bg ; };
TWindow.prototype.setTitle = function ( title )
{
  this.title = title ? title : "" ;
  this.title = TSys.translate ( this.title ) ;
  if ( this.dTitle )
  {
    this.dTitle.innerHTML = this.title ;
    var type = 'normal' ;
    if ( ! this.activated ) type = 'disabled' ;
    var txml = Tango.getThemeXml ( "WindowTitle", type ) ;
    if ( txml )
    {
      this.dTitle.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "WindowTitle", type, this.dTitle.offsetWidth, this.dTitle.offsetHeight );
    }
    else
    {
      this.dTitle.style.backgroundImage = "none" ;
    }
  }
};
TWindow.prototype.getTitle = function()
{
  return this.title ;
};
TWindow.prototype.getBody = function()
{
  return this.dBody ;
};
TWindow.prototype.setValues = function ( xml )
{
  if ( ! this._created )
  {
    throw "Illegal state for setValues(): create first." ;
  }
  var xmlBody = new TXml ( this.dBody ) ;
  xmlBody.setValues ( xml ) ;
};
TWindow.prototype.getValues = function(xml)
{
  var xmlBody = new TXml ( this.dBody ) ;
  return xmlBody.getValues(xml) ;
};
TWindow.prototype.beep = function()
{
  var filter = null ;
  var opacity = null ;
  var beepOpacity = TSys.getPreferenceValueFloat ( "DialogBackgroundOpacity", 0.0 ) ;
  if ( beepOpacity < 0.3 ) beepOpacity = 0.5 ;
  else
  if ( beepOpacity < 0.6 ) beepOpacity = 0.8 ;
  else                    beepOpacity = 0.9 ;
  if ( TSys.isIE() && Tango.ua.ieVersion <= 9 )
  {
    filter = this.mdiv.style.filter ;
    beepOpacity = Math.floor ( beepOpacity * 100 ) ;
    this.mdiv.style.filter = "alpha(opacity=" + beepOpacity + ")" ;
  }
  else
  {
    opacity = this.mdiv.style.opacity ;
    beepOpacity = Math.floor ( beepOpacity * 100 ) / 100 ;
    this.mdiv.style.opacity = beepOpacity ;
  }
  var self = this ;
  var t = new TTimer ( 200, function()
  {
    if ( filter ) self.mdiv.style.filter = filter ;
    if ( opacity ) self.mdiv.style.opacity = opacity ;
  } ) ;
  t.setRepeats ( false ) ;
  t.start() ;
};
TWindow.prototype.setBackgroundOpacity = function ( opacity )
{
  if ( !this.modal ) return ;
  TGui.setOpacity ( this.mdiv, opacity ) ;
};
TWindow.prototype._getAxlDom = function()
{
  var response = null ;
  if ( this.name )
  {
    var dd = TSys.getAxlFromCache ( this.name ) ;
    if ( dd )
    {
      response = dd ;
    }
    else
    {
      response = TSys.getAxl ( this.name, this._axlAttributes ) ;
      TSys.putAxlToCache ( this.name, response ) ;
    }
  }
  else
  if ( this.axl ) response = this.axl ;

  var xResponse = new TXml ( response ) ;
  var dom = xResponse.getDom ( "Dialog" ) ;
  if ( dom )
  {
    response = dom ;
    if ( ! this.modalIsSet ) this.modal = true ;
  }
  else
  {
    dom = xResponse.getDom ( "Window" ) ;
    response = dom ;
    if ( ! this.modalIsSet ) this.modal = false ;
  }

  if ( dom )
  {
    var xdom = new TXml ( dom ) ;
    var t = dom.getAttribute ( "title" ) ;
    if ( t && ! this.title ) this.title = t ;
    var modal = dom.getAttribute ( "modal" ) ;
    if ( !this.modalIsSet && modal && modal == "true" ) this.modal = true ;

    var name = dom.getAttribute ( "name" ) ;
    var id = dom.getAttribute ( "id" ) ;
    if  (   id && ! name ) name = id ;
    if  ( ! id &&   name ) id   = name ;
    if ( ! this.name ) this.name = name ;
    if ( id && ! this.id ) this.id = id ;
    if ( ! this.id ) this.id = this.name ;

    var res  = dom.getAttribute ( "resizable" ) ;
    if ( res && String ( res ) == 'false' ) this._resizable = false ;
    this._closeWithEscape = dom.getAttribute ( "close-with-escape" ) == 'true' ? true : false ;
    this._backgroundColor = dom.getAttribute ( "background-color" ) ;
    if ( dom.getAttribute ( "dragable" ) == "true" ) this._dragable = true ;
    if ( dom.getAttribute ( "borderless" ) == "true" ) this._borderless = true ;

    this.css = dom.getAttribute ( "css" ) ;
    if ( this.css ) Tango.useCss ( this.css ) ;
    this._initialX = xdom.getIntAttribute ( "x", this._initialX ) ;
    this._initialY = xdom.getIntAttribute ( "y", this._initialY ) ;
  }
  return response ;
};
TWindow.prototype.setBodyClassName = function ( bodyClassName )
{
  this._bodyClassName = bodyClassName ;
} ;
TWindow.prototype.setClassName = function ( className, classNameActivated )
{
  this._className = className ;
  this._classNameActivated = classNameActivated ? classNameActivated : className ;
} ;
TWindow.prototype.create = function()
{
  var response = this._getAxlDom() ;

  var layoutContext = new LayoutContext() ;
  layoutContext.window = this ;
  if ( this._pagelet ) layoutContext.pushPagelet ( this._pagelet ) ;

  var pagelet = response.getAttribute ( "pagelet" ) ;
  if ( pagelet )
  {
    var fe = TSys.tryFunctionExecutor ( pagelet, new TXml ( response ) ) ;
    if ( fe )
    {
      var pl = fe.execute ( response ) ;
      if ( ! pl ) pl = fe.object ;
      fe.flush() ;
      this.setPagelet ( pl ) ;
      layoutContext.pushPagelet ( pl ) ;
    }
  }

  var onclose = response.getAttribute ( "onclose" ) ;
  if ( onclose ) this._addWindowListener ( onclose, "onclose", layoutContext ) ;

  var onopen = response.getAttribute ( "onopen" ) ;
  if ( onopen ) this._addWindowListener ( onopen, "onopen", layoutContext ) ;

  var onshow = response.getAttribute ( "onshow" ) ;
  if ( onshow ) this._addWindowListener ( onopen, "onshow", layoutContext ) ;

  var xElements = new TXEnum ( response ) ;
  this.externalAttributes = new Array() ;
  var ctx = new TCreateHtmlContext() ;
  if ( this._pagelet ) ctx.pushPagelet ( this._pagelet ) ;
  ctx.windowId = this.id ;
  var sHtml = TGui.createHtmlContainer ( xElements, this.externalAttributes, ctx ) ; // executeOnLoad DONE

  this.dom = document.createElement ( "div" ) ;
  this.dom.jsPeer = this ;
  this.dom.style.position = "absolute" ;
  this.dom.className = this._className ;
  this.dom.xClassName = "Window" ;
  this.dom.xPseudoTopWindow = true ;
  this.dom.style.zIndex = this.currentZIndex ;
  this.dom.style.visibility = "hidden" ;
  this.dom.style.margin = "0px" ;
  this.dom.style.border = "0px" ;
  this.dom.style.padding = "0px" ;
  this.dom.style.overflow = "hidden" ;

  this.dom.id = this.id ;
  this.dom.name = this.name ;

  if ( this._closeWithEscape )
  {
    var fe = new TFunctionExecutor ( this, this.close ) ;
    TGlobalEventHandler.addToShortCutList ( 27, this.dom, fe ) ;
  }
  if ( this.savePosition )
  {
    this.dom.xSavePosition = true ;
  }
  var bdy = document.getElementsByTagName ( "body" )[0] ;
  var bdy1 = bdy.firstChild ;
//    bdy.appendChild ( this.dom ) ;
  if ( !bdy1 ) bdy.appendChild ( this.dom ) ;
  else         bdy.insertBefore ( this.dom, bdy1 ) ;
  if ( this.modal )
  {
    this.mdiv = document.createElement ( "div" ) ;
    this.mdiv.style.position = "absolute" ;
    this.mdiv.className = "ModalDiv" ;
    this.currentZIndex = TGui.getModalDialogZIndex() ;
    this.mdiv.style.zIndex = this.currentZIndex ;
    this.dom.style.zIndex = this.currentZIndex + 1 ;
    this.mdiv.style.visibility = "hidden" ;
    bdy.appendChild ( this.mdiv ) ;
    this.mdiv.id = TSys.getTempId() ;
    this.dom.modalDivId = this.mdiv.id ;
    if ( TGui.lastMouseupButton )
    {
      setButtonDecoration ( TGui.lastMouseupButton, "normal" ) ;
    }
    if ( TGui.lastMouseupComponent && typeof ( TGui.lastMouseupComponent.setStyleNormal ) == 'function' )
    {
      TGui.lastMouseupComponent.setStyleNormal() ;
    }

    var bgcolor = TSys.getPreferenceValue ( "ModalBackgroundColor", "#000000" ) ;
    var opacity = TSys.getPreferenceValueFloat ( "DialogBackgroundOpacity", 0.0 ) ;
    var txml = Tango.getThemeXml ( "Globals/Window", "modal" ) ;
    if ( txml )
    {
      var op = txml.getFloatAttribute ( "opacity", -1 ) ;
      if ( op >= 0 ) opacity = op ;
      var bg = txml.getAttribute ( "color" ) ;
      if ( ! bg ) bg = txml.getAttribute ( "background-color" ) ;
      if ( bg ) bgcolor = bg ;
    }
    this.mdiv.style.backgroundColor = bgcolor ;
    TGui.setOpacity ( this.mdiv, opacity  ) ;
  }

  if ( ! this._borderless )
  {
    this.dTop = document.createElement ( "div" ) ; this.dom.appendChild ( this.dTop ) ;
    this.dTop.style.position = "absolute" ;
    this.dTop.className = "ThemeWindowTop" ;
    this.dTop.xClassName = "WindowTop" ;

    this.dTopLeft = document.createElement ( "div" ) ; this.dTop.appendChild ( this.dTopLeft ) ;
    this.dTopLeft.style.position = "absolute" ;
    this.dTopLeft.className = "ThemeWindowTopLeft" ;
    this.dTopLeft.xClassName = "WindowTopLeft" ;

    this.dTopMid = document.createElement ( "div" ) ; this.dTop.appendChild ( this.dTopMid ) ;
    this.dTopMid.style.position = "absolute" ;
    this.dTopMid.className = "ThemeWindowTopMid" ;
    this.dTopMid.xClassName = "WindowTopMid" ;

    this.dTitle = document.createElement ( "div" ) ; this.dTopMid.appendChild ( this.dTitle ) ;
    this.dTitle.style.position = "absolute" ;
    this.dTitle.className = "ThemeWindowTitle" ;
    this.dTitle.xClassName = "WindowTitle" ;
    this.dTitle.style.whiteSpace = "nowrap" ;
 
    this.dTopRight = document.createElement ( "div" ) ; this.dTop.appendChild ( this.dTopRight ) ;
    this.dTopRight.style.position = "absolute" ;
    this.dTopRight.className = "ThemeWindowTopRight" ;
    this.dTopRight.xClassName = "WindowTopRight" ;

    var img = response.getAttribute ( "img" ) ;
    if ( img )
    {
      img = TGui.translateImageName ( img ) ;
      this.eImg = TGui.createElement ( "<img src='' onmousedown='return false;' />" ) ;
      this.dTop.appendChild ( this.eImg ) ;
      this.eImg.style.width = 16 + "px" ;
      this.eImg.style.height = 16  + "px";
      this.eImg.style.position = "absolute";
      this.eImg.className = "ThemeWindowImage";
      if ( img.indexOf ( "/" ) < 0 ) img = "img/" + img ;
      this.eImg.src = img ;
    }

    this.closerThemeType = "WindowClose" ;
    if ( this._closerVisible )
    {
      if ( this._resizable && this._maxRestoreVisible )
      {
        var domMax = Tango.getThemeDom ( "WindowMax", "normal" ) ;
        var domRestore = Tango.getThemeDom ( "WindowRestore", "normal" ) ;
        if ( domMax && domRestore )
        {
          var domRestore = Tango.getThemeDom ( "WindowRestore", "normal" ) ;
          this.dMaxRestore = document.createElement ( "img" ) ;
          this.dTop.appendChild ( this.dMaxRestore ) ;
          this.dMaxRestore.style.position = "absolute" ;
          this.dMaxRestore.style.cursor = "pointer" ;
          this.dMaxRestore.className = "ThemeWindowMaxRestore" ;
          this.dMaxRestore.xClassName = "WindowMaxRestore" ;
        }
      }
      if ( ! this.dMaxRestore )
      {
        var domCloseSingle = Tango.getThemeDom ( "WindowCloseSingle", "normal" ) ;
        if ( domCloseSingle ) this.closerThemeType = "WindowCloseSingle" ;
      }
      this.dClose = document.createElement ( "img" ) ;
      this.dTop.appendChild ( this.dClose ) ;
      this.dClose.style.position = "absolute" ;
      this.dClose.className = "ThemeWindowClose" ;
      this.dClose.xClassName = "WindowClose" ;
      if ( this.eImg )
      {
        var xp = this._createWindowMenu ( "under", "left" ) ;
        new PopupMenuWrapper ( xp, this.eImg ) ;
      }
      if ( this.dClose )
      {
        var xp = this._createWindowMenu ( "mouse", "right" ) ;
        new PopupMenuWrapper ( xp, this.dTop ) ;
      }
      if ( ! this.eImg )
      {
        var domMenu = Tango.getThemeDom ( "WindowMenu", "normal" ) ;
        if ( domMenu )
        {
          this.dMenu = document.createElement ( "img" ) ;
          this.dTop.appendChild ( this.dMenu ) ;
          this.dMenu.style.position = "absolute" ;
          this.dMenu.style.cursor = "pointer" ;
          this.dMenu.className = "ThemeWindowMenu" ;
          this.dMenu.xClassName = "WindowMenu" ;
          var xp = this._createWindowMenu ( "under", "left" ) ;
          new PopupMenuWrapper ( xp, this.dMenu ) ;
        }
      }
    }

    this.dTopImage = TGui.insertScalableBackgroundImage ( this.dTop, "WindowTopMid", false, true, this.dTopLeft );
    this.dTopImage.xConstraints.setRightAttachComponent() ;
    this.dTopImage.xConstraints.setRightComponent ( this.dTopRight ) ;
    this.dTopImage.style.left = this.dTopLeft.offsetWidth + "px" ;

    this.dLeft = document.createElement ( "div" ) ; this.dom.appendChild ( this.dLeft ) ;
    this.dLeft.style.position = "absolute" ;
    this.dLeft.className = "ThemeWindowLeft" ;
    this.dLeft.xClassName = "WindowLeft" ;
    var dom = Tango.getThemeDom ( "WindowLeft", "normal" ) ;
    if ( dom )
    {
      var w = this.dLeft.offsetWidth ;
      var h = this.dLeft.offsetHeight ;
/*
        var url = TGui.buildThemeBackgroundImageUrl ( "WindowLeft", "normal", w, h )
        this.dLeft.style.backgroundImage = url
*/
      this.dLeftImage = TGui.insertScalableBackgroundImage ( this.dLeft, "WindowLeft", false, true );
      this.dLeftImage.xConstraints.parseBottom ( "-0" ) ;
      this.dLeftImage.xConstraints.parseRight ( "-0" ) ;
      this.dLeftImage.style.top = "0px" ;
      this.dLeftImage.style.left = "0px" ;
      this.dLeftImage.style.border = "0px" ;
    }

    this.dRight = document.createElement ( "div" ) ; this.dom.appendChild ( this.dRight ) ;
    this.dRight.style.position = "absolute" ;
    this.dRight.className = "ThemeWindowRight" ;
    this.dRight.xClassName = "WindowRight" ;
    var dom = Tango.getThemeDom ( "WindowRight", "normal" ) ;
    if ( dom )
    {
      var w = this.dRight.offsetWidth ;
      var h = this.dRight.offsetHeight ;
/*
        var url = TGui.buildThemeBackgroundImageUrl ( "WindowRight", "normal", w, h )
        this.dRight.style.backgroundImage = url
*/
      this.dRightImage = TGui.insertScalableBackgroundImage ( this.dRight, "WindowRight", false, true );
      this.dRightImage.xConstraints.parseBottom ( "-0" ) ;
      this.dRightImage.xConstraints.parseRight ( "-0" ) ;
      this.dRightImage.style.top = "0px" ;
      this.dRightImage.style.left = "0px" ;
      this.dRightImage.style.border = "0px" ;
    }

    this.dBottom = document.createElement ( "div" ) ; this.dom.appendChild ( this.dBottom ) ;
    this.dBottom.style.position = "absolute" ;
    this.dBottom.className = "ThemeWindowBottom" ;
    this.dBottom.xClassName = "WindowBottom" ;

    this.dBottomLeft = document.createElement ( "div" ) ; this.dBottom.appendChild ( this.dBottomLeft ) ;
    this.dBottomLeft.style.position = "absolute" ;
    this.dBottomLeft.className = "ThemeWindowBottomLeft" ;
    this.dBottomLeft.xClassName = "WindowBottomLeft" ;
    this.dBottomLeft.style.padding = "0px" ;
    this.dBottomLeft.style.margin = "0px" ;
    this.dBottomLeft.style.border = "0px" ;

    this.dBottomMid = document.createElement ( "div" ) ; this.dBottom.appendChild ( this.dBottomMid ) ;
    this.dBottomMid.style.position = "absolute" ;
    this.dBottomMid.className = "ThemeWindowBottomMid" ;
    this.dBottomMid.xClassName = "WindowBottomMid" ;
    this.dBottomMid.style.padding = "0px" ;
    this.dBottomMid.style.margin = "0px" ;
    this.dBottomMid.style.border = "0px" ;

    this.dBottomRight = document.createElement ( "div" ) ; this.dBottom.appendChild ( this.dBottomRight ) ;
    this.dBottomRight.style.position = "absolute" ;
    this.dBottomRight.className = "ThemeWindowBottomRight" ;
    this.dBottomRight.xClassName = "WindowBottomRight" ;
    this.dBottomRight.style.padding = "0px" ;
    this.dBottomRight.style.margin = "0px" ;
    this.dBottomRight.style.border = "0px" ;

    this.dBottomImage = TGui.insertScalableBackgroundImage ( this.dBottom, "WindowBottom", false, true, this.dBottomLeft );
    this.dBottomImage.xConstraints.setRightAttachComponent() ;
    this.dBottomImage.xConstraints.setRightComponent ( this.dBottomRight ) ;
    this.dBottomImage.xConstraints.parseBottom ( "-0" ) ;
    this.dBottomImage.style.left = this.dBottomLeft.offsetWidth + "px" ;
  }

  this.dBody = document.createElement ( "div" ) ; this.dom.appendChild ( this.dBody ) ;
  this.dBody.style.position = "absolute" ;
  if ( Tango.ua.mobile )
  {
    this.dBody.className = "ThemeMobileWindowBody" ;
  }
  else
  {
    this.dBody.className = this._bodyClassName ;
  }
  this.dBody.xClassName = "WindowBody" ;
  this.dBody.style.overflow = "hidden" ;
  this.dBody.style.margin = "0px" ;
  this.dBody.style.border = "0px" ;
  this.dBody.style.padding = "0px" ;
if ( Tango.ua.mobile )
{
  this.dBody.style.fontSize = "larger" ;
}
  if ( this._backgroundColor ) this.dBody.style.backgroundColor = this._backgroundColor ;

  this.dBody.innerHTML = sHtml ;

  TGui.layout ( this.dBody, this.externalAttributes, null, layoutContext ) ;
  this.firstTextField = layoutContext.firstTextField ;
  this.firstINPUT = layoutContext.firstINPUT ;
  this.focusElement = layoutContext.focusElement ;
  this.firstBUTTON = layoutContext.firstBUTTON ;

  if ( this._resizable && this._showResizeGripper )
  {
    this.eResizeGripper = TGui.createElement ( "<img src='' onmousedown='return false;' />" ) ;
    this.dBody.appendChild ( this.eResizeGripper ) ;
    this.eResizeGripper.style.width = 11 + "px" ; // TODO
    this.eResizeGripper.style.height = 11  + "px";
    this.eResizeGripper.style.position = "absolute";
    this.eResizeGripper.xConstraints = new TConstraints() ;
    this.eResizeGripper.xConstraints.parseRight ( "0" ) ;
    this.eResizeGripper.xConstraints.parseBottom ( "0" ) ;
    this.eResizeGripper.src = TGui.buildThemeImageUrl ( "Misc", "resize-gripper" ) ;
    this.eResizeGripper.style.cursor = "se-resize" ;
    TGui.addEventListener ( this.eResizeGripper, "mousemove", this.mm.bindAsEventListener ( this ) ) ;
    TGui.addEventListener ( this.eResizeGripper, "mousedown", this.startResizeWindow.bindAsEventListener ( this ) ) ;
  }

  if ( ! this._borderless )
  {
    this.dTitle.innerHTML = this.title ;
  }
  TGui.layoutConstraints ( this.dBody, true ) ;
  applyZIndexInput ( this.dom, this.currentZIndex ) ;

  this._created = true ;
  var xpd = TSys.getPersistentWindowData ( this.id ) ;
  if ( xpd ) new TXml ( this.dBody ).setValues ( xpd ) ;
  ctx.executeOnLoad() ;
};
TWindow.prototype._createWindowMenu = function ( position, button )
{
  var xp = new TXml() ;
  var xPopup = xp.add ( "PopupMenu" ) ;
  xPopup.addAttribute ( "position", position ? position : "under" ) ;
  xPopup.addAttribute ( "button", button ? button : "left" ) ;
  xPopup.addAttribute ( "trigger", "mousedown" ) ;
  var xC = xPopup.add ( "MenuItem" ) ;
  xC.addAttribute ( "text", TSys.translate ( "WindowClose" ) ) ;
  xC.addAttribute ( "onclick", "function(event){var w=new TEvent(event).getWindow();w.close();}" ) ;
  if ( this.dMaxRestore )
  {
    var xM = xPopup.add ( "MenuItem" ) ;
    xM.addAttribute ( "text", TSys.translate ( "WindowMinMax" ) ) ;
    xM.addAttribute ( "onclick", "function(event){var w=new TEvent(event).getWindow();w.ml(event);}" ) ;
  }
  return xp ;
};
function applyZIndexInput ( elem, zIndex )
{
  var ch = elem.firstChild ;
  while ( ch )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      ch = ch.nextSibling ;
      continue ; // Textknoten
    }
    if ( ch.nodeName.toUpperCase() == 'IFRAME' )
    {
      ch.style.zIndex = zIndex + 1 ;
    }
    else
    if ( ch.type )
    {
      if (  ch.type == 'text'
         || ch.type == 'password'
         || ch.type == 'textarea'
         || ch.type == 'select'
         )
      {
        ch.style.zIndex = zIndex + 1 ;
      }
    }
    if ( ch.firstChild )
    {
      applyZIndexInput ( ch, zIndex ) ;
    }
    ch = ch.nextSibling ;
  }
}
TWindow.prototype.getCssValues = function()
{
  var themeName = "/" + Tango.getThemeName() + "/" ;
  var a = [] ;
  for ( var i = 0 ; i < document.styleSheets.length ; i++ )
  {
    var sheet = document.styleSheets[i];
    if ( ! sheet.href ) continue ;
    if ( sheet.href.indexOf ( themeName ) < 0 ) continue ;
    var rules = null ;
    if ( sheet.cssRules) rules = sheet.cssRules;
    else
    if ( sheet.rules) rules = sheet.rules;
    for ( var j = 0 ; j < rules.length ; j++ )
    {
      if ( ! rules[j].selectorText ) continue ;
      if ( rules[j].selectorText.indexOf ( ".ThemeWindow" ) == 0 )
      {
        var r = rules[j] ;
        var name = r.selectorText ;
        var pos = name.indexOf ( "," ) ;
        if ( pos > 0 ) name = name.substring ( 6, pos ) ;
        else           name = name.substring ( 6 ) ;
        var o = {} ;
        o.width = TGui.parsePixel ( r.style.width ) ;
        o.height = TGui.parsePixel ( r.style.height ) ;
        o.right = TGui.parsePixel ( r.style.right ) ;
        o.left = TGui.parsePixel ( r.style.left ) ;
        o.top = TGui.parsePixel ( r.style.top ) ;
        a[name] = o ;
      }
    }
  }
  return a ;
};
TWindow.prototype.setClassImages = function ( ch, refresh )
{
  if ( this._borderless )
  {
    TGui.setClassStyles ( ch, refresh ) ;
    TGui.setClassImages ( ch, refresh ) ;
    return true ;
  }
  TGui.setClassStyles ( ch, refresh ) ;
  var ww = this.getCssValues() ;
//TSys.logInternal = false ;
//log ( ww ) ;
  var style =  null ;
  style = ww["WindowTop"] ;
  if ( style && !isNaN ( style.height ) ) this.dTop.style.height = style.height + "px" ;

  style = ww["WindowTitle"] ;
  if ( style && !isNaN ( style.top ) ) this.dTitle.style.top = style.top + "px" ;
  else
  {
    this.dTitle.style.top = Math.floor ( ( this.dTop.offsetHeight - this.dTitle.offsetHeight ) / 2 ) + "px" ;
  }
  style = ww["WindowTopLeft"] ;
  if ( style && !isNaN ( style.width ) ) this.dTopLeft.style.width = style.width + "px" ;
  this.dTopLeft.style.height = this.dTop.offsetHeight + "px" ;

  this.dTopMid.style.left = this.dTopLeft.offsetLeft + "px" ;
  this.dTopMid.style.height = this.dTop.offsetHeight + "px" ;

  style = ww["WindowTopRight"] ;
  if ( style && !isNaN ( style.width ) ) this.dTopRight.style.width = style.width + "px" ;
  this.dTopRight.style.height = this.dTop.offsetHeight + "px" ;

  style = ww["WindowLeft"] ;
  if ( style && !isNaN ( style.width ) ) this.dLeft.style.width = style.width + "px" ;
  this.dLeft.style.top = this.dTop.offsetHeight + "px" ;

  style = ww["WindowRight"] ;
  if ( style && !isNaN ( style.width ) ) this.dRight.style.width = style.width + "px" ;
  this.dRight.style.top = this.dTop.offsetHeight + "px" ;

  style = ww["WindowBottom"] ;
  if ( style && !isNaN ( style.height ) ) this.dBottom.style.height = style.height + "px" ;

  this.dLeft.style.height = ( this.dom.offsetHeight - this.dTop.offsetHeight - this.dBottom.offsetHeight ) + "px" ;
if ( this.dLeftImage )
{
  this.dLeftImage.style.width = this.dLeft.offsetWidth + "px" ;
  this.dLeftImage.style.height = this.dLeft.offsetHeight + "px" ;
}
  this.dRight.style.height = ( this.dom.offsetHeight - this.dTop.offsetHeight - this.dBottom.offsetHeight ) + "px" ;
if ( this.dRightImage )
{
  this.dRightImage.style.width = this.dRight.offsetWidth + "px" ;
  this.dRightImage.style.height = this.dRight.offsetHeight + "px" ;
}

  this.dBottomLeft.style.width = this.dLeft.offsetWidth + "px" ;
  this.dBottomLeft.style.height = this.dBottom.offsetHeight + "px" ;

  this.dBottomRight.style.width = this.dRight.offsetWidth + "px" ;
  this.dBottomRight.style.height = this.dBottom.offsetHeight + "px" ;

  this.dBottomMid.style.left = this.dBottomLeft.offsetWidth + "px" ;
  this.dBottomMid.style.width = ( this.dom.offsetWidth - this.dLeft.offsetWidth - this.dRight.offsetWidth ) + "px" ;

  this.dTopImage.style.left = this.dTopLeft.offsetWidth + "px" ;
  this.dTopImage.style.height = this.dTop.offsetHeight + "px" ;
  this.dTopImage.height = this.dTop.offsetHeight ;
  this.dBottomImage.style.left = this.dLeft.offsetWidth + "px" ;
  this.dBottomImage.style.height = this.dBottom.offsetHeight + "px" ;
  this.dBottomImage.height = this.dBottom.offsetHeight ;

  this.dBottom.style.top = ( this.dom.offsetHeight - this.dBottom.offsetHeight ) + "px" ;

  this.dBody.style.top = this.dTop.offsetHeight + "px" ;
  this.dBody.style.left = this.dLeft.offsetWidth + "px" ;

  if ( this.eImg )
  {
    var style = ww["WindowImage"] ;
    if ( style )
    {
      if ( ! isNaN ( style.left ) ) this.eImg.style.left = style.left + "px" ;
      if ( ! isNaN ( style.top ) ) this.eImg.style.top = style.top + "px" ;
      else                         this.eImg.style.top = Math.floor ( ( this.dTop.offsetHeight - this.eImg.offsetHeight ) / 2 ) + "px" ;
    }
    else
    {
      this.eImg.style.top = Math.floor ( ( this.dTop.offsetHeight - this.eImg.offsetHeight ) / 2 ) + "px" ;
      this.eImg.style.left = 6 + "px" ;
    }
  }
  if ( this.dMenu )
  {
    var style = ww["WindowImage"] ;
    if ( style )
    {
      if ( ! isNaN ( style.left ) ) this.dMenu.style.left = style.left + "px" ;
      if ( ! isNaN ( style.top ) ) this.dMenu.style.top = style.top + "px" ;
      else                         this.dMenu.style.top = Math.floor ( ( this.dMenu.offsetHeight - this.dMenu.offsetHeight ) / 2 ) + "px" ;
    }
    else
    {
      this.dMenu.style.top = Math.floor ( ( this.dMenu.offsetHeight - this.dMenu.offsetHeight ) / 2 ) + "px" ;
      this.dMenu.style.left = 6 + "px" ;
    }
  }
  if ( this.dClose )
  {
    if ( ! this.dMaxRestore )
    {
      var domCloseSingle = Tango.getThemeDom ( "WindowCloseSingle", "normal" ) ;
      if ( domCloseSingle ) this.closerThemeType = "WindowCloseSingle" ;
      else                  this.closerThemeType = "WindowClose" ;
    }
    else this.closerThemeType = "WindowClose" ;
    var style = ww["WindowClose"] ;
    if ( style )
    {
      if ( ! isNaN ( style.width ) ) this.dClose.style.width = style.width + "px" ;
      if ( ! isNaN ( style.top ) ) this.dClose.style.top = style.top + "px" ;
      else                         this.dClose.style.top = Math.floor ( ( this.dTop.offsetHeight - this.dClose.offsetHeight ) / 2 ) + "px" ;
      if ( isNaN ( style.right ) ) style.right = 4 ;
      this.dClose.xConstraints.parseRight ( "" + style.right ) ;
    }
  }
  if ( this.dMaxRestore )
  {
    var style = ww["WindowMaxRestore"] ;
    if ( style )
    {
      if ( !isNaN ( style.width ) ) this.dMaxRestore.style.width = style.width + "px" ;
      if ( !isNaN ( style.top ) ) this.dMaxRestore.style.top = style.top + "px" ;
      else                    this.dMaxRestore.style.top = Math.floor ( ( this.dTop.offsetHeight - this.dMaxRestore.offsetHeight ) / 2 ) + "px" ;
      if ( isNaN ( style.right ) ) style.right = 4 ;
      this.dMaxRestore.xConstraints.parseRight ( "" + style.right ) ;
    }
  }
  if ( this.dClose ) TGui.setImageSrc ( this.dClose, this.closerThemeType, "normal" ) ;
  if ( this.dMaxRestore )
  {
    if ( this.isMaximized() ) TGui.setImageSrc ( this.dMaxRestore, "WindowRestore", "normal" ) ;
    else                      TGui.setImageSrc ( this.dMaxRestore, "WindowMax", "normal" ) ;
  }
  if ( TGui.getComputedStyle ( this.dTop, "text-align" ) != "center" )
  {
    this.dTitle.style.left = Math.floor ( ( this.dTop.offsetWidth - this.dTitle.offsetWidth ) / 2 ) + "px" ;
  }
  else
  {
    var x = 0 ;
    if ( this.eImg ) x = this.eImg.offsetLeft + this.eImg.offsetWidth ;
    else
    if ( this.dMenu ) x = this.dMenu.offsetLeft + this.dMenu.offsetWidth ;
    else
    {
    }
    if ( x ) x -= this.dTopMid.offsetLeft ;
    this.dTitle.style.left = ( x + 4 ) + "px" ;
  }
  if ( this.dTitle )
  {
    var type = 'normal' ;
    if ( ! this.activated ) type = 'disabled' ;
    var txml = Tango.getThemeXml ( "WindowTitle", type ) ;
    if ( txml )
    {
      this.dTitle.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "WindowTitle", type, this.dTitle.offsetWidth, this.dTitle.offsetHeight );
    }
    else
    {
      this.dTitle.style.backgroundImage = "none" ;
    }
  }

  this.setSize ( this.dom.offsetWidth, this.dom.offsetHeight ) ;

  ww.length = 0 ;
  TGui.setClassImages ( ch, refresh ) ;
  return true ;
};
TWindow.prototype.show = function ( animator )
{
  if ( Tango.ua.realMobile ) this._dragable = false ;
  var bodySize = new TDimension ( this.dBody.offsetWidth, this.dBody.offsetHeight ) ;

  TGui.calculateLayoutBorders ( this.dom ) ;

  if ( ! this._borderless )
  {
    if ( this.dTop.offsetHeight <= 20 )
    {
      this.dTop.style.height = "20px" ;
    }
    TGui.calculateLayoutBorders ( this.dTop ) ;
    TGui.calculateLayoutBorders ( this.dTopLeft ) ;
    TGui.calculateLayoutBorders ( this.dTopMid ) ;
    TGui.calculateLayoutBorders ( this.dTitle ) ;
    TGui.calculateLayoutBorders ( this.dTopRight ) ;
    if ( this._closerVisible )
    {
      TGui.calculateLayoutBorders ( this.dClose ) ;
      if ( this.dMaxRestore ) TGui.calculateLayoutBorders ( this.dMaxRestore ) ;
      if ( this.dMenu ) TGui.calculateLayoutBorders ( this.dMenu ) ;
    }
    TGui.calculateLayoutBorders ( this.dLeft ) ;
    TGui.calculateLayoutBorders ( this.dRight ) ;
    TGui.calculateLayoutBorders ( this.dBottom ) ;
    TGui.calculateLayoutBorders ( this.dBody ) ;

    var ihTop = TGui.getComputedStyleInt ( this.dTop, "height", 0 ) ;

    var iwTopLeft = TGui.getComputedStyleInt ( this.dTopLeft, "width", 0 ) ;
    var wTopLeft = iwTopLeft + this.dTopLeft.xOuterWidth ;

    var iwTopMid = TGui.getComputedStyleInt ( this.dTopMid, "width", 0 ) ;
    var wTopMid = iwTopMid + this.dTopMid.xOuterWidth ;

    var iwTopRight = TGui.getComputedStyleInt ( this.dTopRight, "width", 0 ) ;
    var wTopRight = iwTopRight + this.dTopRight.xOuterWidth ;

    var iwLeft = TGui.getComputedStyleInt ( this.dLeft, "width", 0 ) ;
    var wLeft = iwLeft + this.dLeft.xOuterWidth ;

    var ihBottom = TGui.getComputedStyleInt ( this.dBottom, "height", 0 ) ;
    var hBottom = ihBottom + this.dBottom.xOuterHeight ;

    var iwRight = TGui.getComputedStyleInt ( this.dRight, "width", 0 ) ;
    var wRight = iwRight + this.dRight.xOuterWidth ;

    this.dLeft.style.width = iwLeft + "px" ;
    this.dRight.style.width = iwRight + "px" ;

    var botBorderTopWidth = TGui.getComputedStyleInt ( this.dBottom, "border-top-width" ) ;
    var botBorderTopStyle = TGui.getComputedStyle ( this.dBottom, "border-top-style" ) ;
    var botBorderTopColor = TGui.getComputedStyle ( this.dBottom, "border-top-color" ) ;

    var botBackgroundColor = TGui.getComputedStyle ( this.dBottom, "background-color" ) ;

    var botBorderBottomWidth = TGui.getComputedStyleInt ( this.dBottom, "border-bottom-width" ) ;
    var botBorderBottomStyle = TGui.getComputedStyle ( this.dBottom, "border-bottom-style" ) ;
    var botBorderBottomColor = TGui.getComputedStyle ( this.dBottom, "border-bottom-color" ) ;

    this.dBottom.style.height = ( ihBottom + botBorderTopWidth + botBorderBottomWidth ) + "px" ;
    this.dBottom.style.borderTopWidth = "0px" ;
    this.dBottom.style.borderLeftWidth = "0px" ;
    this.dBottom.style.borderBottomWidth = "0px" ;
    this.dBottom.style.borderRightWidth = "0px" ;

    this.dBottomLeft.style.width = ( TGui.getComputedStyleInt ( this.dLeft, "width", 0 ) + TGui.getComputedStyleInt ( this.dLeft, "border-right-width", 0 ) ) + "px" ;
    this.dBottomLeft.style.borderTopWidth = "0px" ; //botBorderTopWidth + "px" ;
    this.dBottomLeft.style.borderTopStyle = "solid" ;
    this.dBottomLeft.style.borderTopColor = "transparent" ;
    this.dBottomLeft.style.borderLeftWidth = TGui.getComputedStyleInt ( this.dLeft, "border-left-width" ) + "px" ;
    this.dBottomLeft.style.borderLeftStyle = TGui.getComputedStyle ( this.dLeft, "border-left-style" ) ;
    this.dBottomLeft.style.borderLeftColor = TGui.getComputedStyle ( this.dLeft, "border-left-color" ) ;
    this.dBottomLeft.style.borderRightWidth = "0px" ;
    this.dBottomLeft.style.borderRightStyle = "solid" ;
    this.dBottomLeft.style.borderRightColor = "transparent" ;
    this.dBottomLeft.style.borderBottomWidth = botBorderBottomWidth + "px" ;
    this.dBottomLeft.style.borderBottomStyle = botBorderBottomStyle ;
    this.dBottomLeft.style.borderBottomColor = botBorderBottomColor ;
    this.dBottomLeft.style.height = ( ihBottom + botBorderTopWidth ) + "px" ;
    this.dBottomLeft.style.backgroundColor = botBackgroundColor ;

    this.dBottomMid.style.height = ihBottom + "px" ;
    this.dBottomMid.style.left = this.dBottomLeft.offsetWidth + "px" ;
    this.dBottomMid.style.height = ihBottom + "px" ;
    this.dBottomMid.style.borderTopWidth = botBorderTopWidth + "px" ;
    this.dBottomMid.style.borderTopStyle = botBorderTopStyle ;
    this.dBottomMid.style.borderTopColor = botBorderTopColor ;

    this.dBottomMid.style.borderBottomWidth = botBorderBottomWidth + "px" ;
    this.dBottomMid.style.borderBottomStyle = botBorderBottomStyle ;
    this.dBottomMid.style.borderBottomColor = botBorderBottomColor ;
    this.dBottomMid.style.backgroundColor = botBackgroundColor ;

    this.dBottomRight.style.height = ( ihBottom + botBorderTopWidth ) + "px" ;
    this.dBottomRight.style.width = ( TGui.getComputedStyleInt ( this.dRight, "width", 0 ) + TGui.getComputedStyleInt ( this.dRight, "border-left-width", 0 ) ) + "px" ;
    this.dBottomRight.style.borderTopWidth = "0px" ;
    this.dBottomRight.style.borderTopStyle = "solid" ;
    this.dBottomRight.style.borderTopColor = "transparent" ;
    this.dBottomRight.style.borderLeftWidth = "0px" ;
    this.dBottomRight.style.borderLeftStyle = "solid" ;
    this.dBottomRight.style.borderLeftColor = "transparent" ;
    this.dBottomRight.style.borderRightWidth = TGui.getComputedStyleInt ( this.dRight, "border-right-width" ) + "px" ;
    this.dBottomRight.style.borderRightStyle = TGui.getComputedStyle ( this.dRight, "border-right-style" ) ;
    this.dBottomRight.style.borderRightColor = TGui.getComputedStyle ( this.dRight, "border-right-color" ) ;
    this.dBottomRight.style.borderBottomWidth = botBorderBottomWidth + "px" ;
    this.dBottomRight.style.borderBottomStyle = botBorderBottomStyle ;
    this.dBottomRight.style.borderBottomColor = botBorderBottomColor ;

    this.dBottomRight.style.backgroundColor = botBackgroundColor ;
    this.dBottom.style.backgroundColor = "transparent" ;

    this.dTopImage.style.left = this.dTopLeft.offsetWidth + "px" ;
    this.dTopImage.style.height = this.dTop.offsetHeight + "px" ;
    this.dTopImage.height = this.dTop.offsetHeight + "px" ;
    if ( this.eImg )
    {
      var t = TGui.getComputedStyleInt ( this.eImg, "top", -1 ) ;
      if ( t <= 0 ) this.eImg.style.top = Math.floor ( ( this.dTop.offsetHeight - this.eImg.offsetHeight ) / 2 ) + "px" ;
      else          this.eImg.style.top = t + "px" ;
      this.eImg.style.left = TGui.getComputedStyleInt ( this.eImg, "left", 6 ) + "px" ;
    }
    if ( this.dMenu )
    {
      var t = TGui.getComputedStyleInt ( this.dMenu, "top", -1 ) ;
      if ( t <= 0 ) this.dMenu.style.top = Math.floor ( ( this.dTop.offsetHeight - this.dMenu.offsetHeight ) / 2 ) + "px" ;
      else          this.dMenu.style.top = t + "px" ;
      this.dMenu.style.left = TGui.getComputedStyleInt ( this.dMenu, "left", 6 ) + "px" ;
    }
    this.dBottomImage.style.left = this.dLeft.offsetWidth + "px" ;
    this.dBottomImage.style.height = this.dBottom.offsetHeight + "px" ;

    var domWindowBottom = Tango.getThemeDom ( "WindowBottom", "normal" ) ;
    var domWindowBottomLeft = Tango.getThemeDom ( "WindowBottomLeft", "normal" ) ;
    var domWindowBottomRight = Tango.getThemeDom ( "WindowBottomRight", "normal" ) ;
    if ( domWindowBottomLeft || domWindowBottom )
    {
      var w = this.dBottomLeft.offsetWidth ;
      var h = this.dBottomLeft.offsetHeight ;
      var name = domWindowBottomLeft ? "WindowBottomLeft" : "WindowBottom" ;
    }
    if ( domWindowBottom )
    {
      var w = this.dBottomMid.offsetWidth ;
      var h = this.dBottomMid.offsetHeight ;
    }
    if ( domWindowBottomRight || domWindowBottom )
    {
      var w = this.dBottomRight.offsetWidth ;
      var h = this.dBottomRight.offsetHeight ;
      var name = domWindowBottomRight ? "WindowBottomRight" : "WindowBottom" ;
    }

    var wWindow = bodySize.width + wLeft + wRight ;
    var iwWindow = wWindow - this.dom.xOuterWidth ;
    var hWindow = this.dTop.offsetHeight + bodySize.height + hBottom ;
    var ihWindow = hWindow - this.dom.xOuterHeight ;
    var iwBottom = iwWindow - this.dBottom.xOuterHeight ;

    this.dTop.style.top  = "0px" ;
    this.dTop.style.left = "0px" ;
    this.dTop.style.width = iwWindow + "px" ;

    this.dTopLeft.style.top  = "0px" ;
    this.dTopLeft.style.left = "0px" ;
    this.dTopLeft.style.height = ihTop + "px" ;

    this.dTopMid.style.top  = "0px" ;
    this.dTopMid.style.left = wTopLeft + "px" ;
    this.dTopMid.style.height = ihTop + "px" ;

    this.dTopRight.style.top  = "0px" ;
    this.dTopRight.style.height = ihTop + "px" ;

    var wClose = 0 ;
    var hClose = 0 ;
    var rClose = 0 ;
    var tClose = 0 ;
    var wMaxRestore = 0 ;
    var hMaxRestore = 0 ;
    var rMaxRestore = 0 ;
    var wMenu = 0 ;
    var hMenu = 0 ;
    var lMenu = 0 ;
    if ( this._closerVisible )
    {
      wClose = TGui.getComputedStyleInt ( this.dClose, "width", 16 ) ;
      hClose = TGui.getComputedStyleInt ( this.dClose, "height", 16 ) ;
      rClose = TGui.getComputedStyleInt ( this.dClose, "right", 6 ) ;
      tClose = TGui.getComputedStyleInt ( this.dClose, "top", -1 ) ;
      if ( this.dMaxRestore )
      {
        wMaxRestore = TGui.getComputedStyleInt ( this.dMaxRestore, "width", 16 ) ;
        hMaxRestore = TGui.getComputedStyleInt ( this.dMaxRestore, "height", 16 ) ;
        rMaxRestore = TGui.getComputedStyleInt ( this.dMaxRestore, "right", 6 ) ;
      }
      if ( this.dMenu )
      {
        wMenu = TGui.getComputedStyleInt ( this.dMenu, "width", 16 ) ;
        hMenu = TGui.getComputedStyleInt ( this.dMenu, "height", 16 ) ;
        lMenu = TGui.getComputedStyleInt ( this.dMenu, "left", 6 ) ;
      }
    }
    var tTitle = TGui.getComputedStyleInt ( this.dTitle, "top", -1 ) ;
    if ( tTitle <= 0 )
    {
      this.dTitle.style.top = Math.floor ( ( this.dTop.offsetHeight - this.dTitle.offsetHeight ) / 2 ) + "px" ;
    }
    else
    {
      this.dTitle.style.top = tTitle + "px" ;
    }

    if ( TGui.getComputedStyle ( this.dTop, "text-align" ) == "center" )
    {
      this.dTitle.style.left = Math.floor ( ( this.dTop.offsetWidth - this.dTitle.offsetWidth - wMaxRestore - wClose ) / 2 ) + "px" ;
    }
    else
    {
      var x = 0 ;
      if ( this.eImg ) x = this.eImg.offsetLeft + this.eImg.offsetWidth ;
      else
      if ( this.dMenu ) x = lMenu + wMenu ;
      else
      {
      }
      if ( x ) x -= this.dTopMid.offsetLeft ;
      this.dTitle.style.left = ( x + 4 ) + "px" ;
    }
    var txml = Tango.getThemeXml ( "WindowTitle", "normal" ) ;
    if ( txml )
    {
      this.dTitle.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "WindowTitle", "normal", this.dTitle.offsetWidth, this.dTitle.offsetHeight );
    }
    else
    {
      this.dTitle.style.backgroundImage = "none" ;
    }

    if ( this._closerVisible )
    {
      if ( tClose <= 0 )
      {
        this.dClose.style.top = Math.floor ( ( this.dTop.offsetHeight - hClose ) / 2 ) + "px" ;
        if ( this.dMaxRestore ) this.dMaxRestore.style.top = Math.floor ( ( this.dTop.offsetHeight - hClose ) / 2 ) + "px" ;
      }
      else
      {
        this.dClose.style.top = tClose + "px" ;
        if ( this.dMaxRestore ) this.dMaxRestore.style.top = tClose + "px" ;
      }
      this.dClose.xRight = rClose ;
      this.dClose.src = TGui.buildThemeImageUrl ( this.closerThemeType, "normal", wClose, hClose ) ;
 
      TGui.addEventListener ( this.dClose, "mouseover", TGui.setImageSrc.bind ( TGui, this.dClose, this.closerThemeType, "inside" ) ) ;
      TGui.addEventListener ( this.dClose, "mouseout", TGui.setImageSrc.bind ( TGui, this.dClose, this.closerThemeType, "normal" ) ) ;
      TGui.addEventListener ( this.dClose, "click", this.close.bind ( this ) ) ;
      TGui.addEventListener ( this.dClose, "mousedown", this.mouseDownClose.bind ( this ) ) ;
      if ( this._closeWithEscape )
        this.dClose.tooltip = TSys.translate ( "WindowClose" ) + " ( ESC )";
      else
        this.dClose.tooltip = TSys.translate ( "WindowClose" ) ;
      TGui.addEventListener ( this.dClose, "mouseover", TGui.tooltipOver ) ;
      TGui.addEventListener ( this.dClose, "mouseout", TGui.tooltipOut ) ;
      TGui.addEventListener ( this.dClose, "mousedown", TGui.tooltipClose ) ;
      if ( this.dMaxRestore )
      {
        this.dMaxRestore.xRight = rMaxRestore ;
        this.dMaxRestore.src = TGui.buildThemeImageUrl ( "WindowMax", "normal", wMaxRestore, hMaxRestore ) ;

        TGui.addEventListener ( this.dMaxRestore, "mouseover", this.mouseOverMaxRestore.bind ( this ) ) ;
        TGui.addEventListener ( this.dMaxRestore, "mouseout", this.mouseOutMaxRestore.bind ( this ) ) ;

        TGui.addEventListener ( this.dMaxRestore, "click", this.maxRestore.bind ( this ) ) ;
        TGui.addEventListener ( this.dMaxRestore, "mousedown", this.mouseDownMaxRestore.bind ( this ) ) ;
        this.dMaxRestore.tooltip = TSys.translate ( "WindowMinMax" ) ;
        TGui.addEventListener ( this.dMaxRestore, "mouseover", TGui.tooltipOver ) ;
        TGui.addEventListener ( this.dMaxRestore, "mouseout", TGui.tooltipOut ) ;
        TGui.addEventListener ( this.dMaxRestore, "mousedown", TGui.tooltipClose ) ;
      }
      if ( this.dMenu )
      {
        this.dMenu.style.width = wMenu + "px" ;
        this.dMenu.style.height = hMenu  + "px";
        this.dMenu.style.left = lMenu  + "px";
        TGui.setImageSrc ( this.dMenu, "WindowMenu", "normal" ) ;
        TGui.addEventListener ( this.dMenu, "mouseover", this.mouseOverMenu.bind ( this ) ) ;
        TGui.addEventListener ( this.dMenu, "mousedown", this.mouseDownMenu.bind ( this ) ) ;
        TGui.addEventListener ( this.dMenu, "mouseup", this.mouseUpMenu.bind ( this ) ) ;
        TGui.addEventListener ( this.dMenu, "mouseout", this.mouseOutMenu.bind ( this ) ) ;
      }
    }

    this.dLeft.style.top = this.dTop.offsetHeight + "px" ;
    this.dLeft.style.left = "0px" ;

    this.dBottom.style.left = "0px" ;

    this.dBottomLeft.style.top = "0px" ;
    this.dBottomLeft.style.left = "0px" ;
    this.dBottomMid.style.top = "0px" ;
    this.dBottomRight.style.top = "0px" ;
    this.dBottomRight.style.right = "0px" ;

    this.dRight.style.top = this.dTop.offsetHeight + "px" ;
    this.dRight.style.width = iwRight + "px" ;

    this.dBody.style.top = this.dTop.offsetHeight + "px" ;
    this.dBody.style.left = wLeft + "px" ;

    this.dBody.style.width = bodySize.width + "px" ;
    this.dBody.style.height = bodySize.height + "px" ;

    this.dom.style.width = iwWindow + "px" ;
    this.dom.style.height = ihWindow + "px" ; 
  }
  else
  {
    this.dom.style.width = this.dBody.offsetWidth + "px" ;
    this.dom.style.height = this.dBody.offsetHeight + "px" ; 
    this.dBody.style.top = "0px" ;
    this.dBody.style.left = "0px" ;
  }

  TGui.addEventListener ( this.dom, "mousedown", this.windowClicked.bind ( this ) ) ;
  var wSize = TGui.getBrowserWindowSize() ;
  var wSizeA = TGui.getAdjustedBrowserWindowSize() ;

  var p = null ;
  var pendingBounds = null ;
  if ( this.savePosition )
  {
    p = TWM.getSavedWindowBounds ( this.dom.id ) ;
    if ( p && this._resizable ) pendingBounds = p ;
  }
  if ( ! p )
  {
    var sp = TGui.getPageScrollPosition() ;
    p = new TRectangle ( Math.floor ( ( wSize.width - this.dom.offsetWidth ) / 2 )
                        , Math.floor ( ( wSize.height - this.dom.offsetHeight ) / 2 )
                        ) ;
    p.x += sp.x ;
    p.y += sp.y ;
  }
  if ( p.x + this.dom.offsetWidth > wSizeA.width )
  {
    p.x = wSizeA.width - this.dom.offsetWidth ;
  }
  if ( p.y + this.dom.offsetHeight > wSizeA.height )
  {
    p.y = wSizeA.height - this.dom.offsetHeight ;
  }
  if ( p.x < 0 ) p.x = 0 ;
  if ( p.y < 0 ) p.y = 0 ;
  if ( this._initialX >= 0 ) p.x = this._initialX ;
  if ( this._initialY >= 0 ) p.y = this._initialY ;

  this.dom.style.left = p.x + "px" ;
  this.dom.style.top = p.y + "px" ; 
//  this.dom.style.left = "-" + this.dom.offsetWidth + "px" ;
//  this.dom.style.top =  "0px" ; 

  this.dom.className = this._classNameActivated ;
  if ( this._resizable )
  {
    if ( ! this._borderless )
    {
      TGui.addEventListener ( this.dTop, "mousemove", this.mm.bindAsEventListener ( this ) ) ;
      TGui.addEventListener ( this.dLeft, "mousemove", this.mm.bindAsEventListener ( this ) ) ;
      TGui.addEventListener ( this.dBottom, "mousemove", this.mm.bindAsEventListener ( this ) ) ;
      TGui.addEventListener ( this.dRight, "mousemove", this.mm.bindAsEventListener ( this ) ) ;

      if ( Tango.ua.mobile )
      {
        TGui.addEventListener ( this.dTop, "touchstart", this.mlmobile.bindAsEventListener ( this ) ) ;
      }
      else
      {
        TGui.addEventListener ( this.dTop, "dblclick", this.ml.bindAsEventListener ( this ) ) ;
        TGui.addEventListener ( this.dTop, "click", this.topclick.bindAsEventListener ( this ) ) ;
      }

      TGui.addEventListener ( this.dTop, "mousedown", this.startResizeWindow.bindAsEventListener ( this ) ) ;
      TGui.addEventListener ( this.dLeft, "mousedown", this.startResizeWindow.bindAsEventListener ( this ) ) ;
      TGui.addEventListener ( this.dBottom, "mousedown", this.startResizeWindow.bindAsEventListener ( this ) ) ;
      TGui.addEventListener ( this.dRight, "mousedown", this.startResizeWindow.bindAsEventListener ( this ) ) ;
    }
    else
    {
      if ( this._dragable )
      {
        TGui.addEventListener ( this.dom, "mousedown", this.startDrag.bindAsEventListener ( this ) ) ;
      }
    }
  }
  else
  {
    if ( ! this._borderless )
    {
      this.dTop.style.cursor = "move" ;
      TGui.addEventListener ( this.dTop, "mousedown", this.startDrag.bindAsEventListener ( this ) ) ;
      TGui.addEventListener ( this.dTop, "mousemove", this.mm.bindAsEventListener ( this ) ) ;
    }
    else
    {
      if ( this._dragable )
      {
        TGui.addEventListener ( this.dom, "mousedown", this.startDrag.bindAsEventListener ( this ) ) ;
      }
    }
  }
  if ( this.modal )
  {
    this.mdiv.style.top = "0px" ;
    this.mdiv.style.left = "0px" ;
    this.mdiv.style.width = wSizeA.width + "px" ;
    this.mdiv.style.height = wSizeA.height + "px" ;
    this.mdiv.style.visibility = "visible" ;
    TGui.addEventListener ( this.mdiv, "mousedown", this.beep.bind ( this ) ) ;
  }
  if ( this.pendingBounds ) this.setSize ( this.pendingBounds.width, this.pendingBounds.height ) ;
  else                      this.setSize ( this.dom.offsetWidth, this.dom.offsetHeight ) ;
  if ( pendingBounds )      this.setSize ( pendingBounds.width, pendingBounds.height ) ;
  else                      this.setSize ( this.dom.offsetWidth, this.dom.offsetHeight ) ;

  if ( this.windowListener )
  {
    var ev = new TWindowEvent ( null, TWindowEvent.prototype.WINDOW_OPENED ) ;
    ev.setHtmlSource ( this.dom ) ;
    ev.setPeer ( this ) ;
    for ( var i = 0 ; i < this.windowListener.length ; i++ )
    {
      var fx = this.windowListener[i] ;
      if ( fx.xEventType != "onopen" ) continue ;
      fx.executeWithEvent ( ev ) ;
    }
    ev.flush() ;
  }
  this._showing = true ;
  if ( animator )
  {
    if ( typeof ( animator ) == 'object' )
    {
      if ( typeof ( animator.start ) == 'function' )
      {
        animator.start ( this ) ;
      }
    }
  }
  else
  {
    if ( this._fadeIn )
    {
      var thiz = this ;
      TAnimator.fadeIn ( this,
      {
        onComplete: function()
        {
          thiz._show() ;
        }
      } ) ;
    }
    else
    if ( this._animateIn )
    {
      var thiz = this ;
      TAnimator.animateIn ( this,
      {
        onComplete: function()
        {
          thiz._show() ;
        }
      } ) ;
    }
    else
    {
      this._show() ;
    }
  }
};
TWindow.prototype._show = function()
{
  if ( this._shown ) return ;
  this._shown = true ;
  this.dom.style.visibility = "visible" ;

  TGui.setClassImages ( this.dom, true ) ;

  var focusElement = this.focusElement ;
  if ( ! focusElement ) focusElement = this.firstTextField ;
  if ( ! focusElement ) focusElement = this.firstINPUT ;
  if ( ! focusElement ) focusElement = this.firstBUTTON ;
  var focusElementVisible = false ;
  if ( focusElement )
  {
    focusElementVisible = true ;
    var ch = focusElement ;
    while ( ch )
    {
      if ( ch == this.dom ) break ;
      if ( ch.style.visibility == "hidden" )
      {
        focusElementVisible = false ;
        break ;
      }
      ch = ch.parentNode ;
    }
  }

  if ( TSys.isIE6() )
  {
    this._currentBoundsOnPage = TGui.getBoundsOnPageOf ( this.dom ) ;
    TGui.setAllInputVisible ( null, this._currentBoundsOnPage, false, this.dom ) ;
  }
  if ( document.activeElement && typeof ( document.activeElement.blur ) == 'function' ) document.activeElement.blur() ;
  if ( focusElement && focusElementVisible )
  {
    focusElement.focus() ;
  }

  TWM.addWindow ( this ) ;
  TWM.toFront ( this ) ;
  if ( this.windowListener )
  {
    var ev = new TWindowEvent ( null, TWindowEvent.prototype.WINDOW_OPENED ) ;
    ev.setHtmlSource ( this.dom ) ;
    ev.setPeer ( this ) ;
    for ( var i = 0 ; i < this.windowListener.length ; i++ )
    {
      var fx = this.windowListener[i] ;
      if ( fx.xEventType != "onshow" ) continue ;
      fx.executeWithEvent ( ev ) ;
    }
    ev.flush() ;
  }
};
TWindow.prototype.startDrag = function ( event )
{
  Dragger.startDrag ( event, this.dom ) ;
};
TWindow.prototype.startResizeWindow = function ( event )
{
  var e = new TEvent ( event ) ;
  if ( e.isButtonMiddle() )
  {
    return ;
  }
  if ( this.cursorPosition == 0 ) Dragger.startDrag ( event, this.getDom(), true ) ;
  else Dragger.startResizeComponent ( event, this, this.cursorPosition ) ;
};
TWindow.prototype.getZIndex = function()
{
  return this.currentZIndex ;
};
TWindow.prototype._setActivated = function ( state )
{
  if ( this.activated == state ) return ;
  this.activated = state ;
  if ( this.activated )
  {
    this.dom.className = this._classNameActivated ;
    this.dBody.className = "ThemeWindowBody" ;
    if ( ! this._borderless )
    {
      if ( this.dClose )
      {
        var wClose = TGui.getComputedStyleInt ( this.dClose, "width", 16 ) ;
        var hClose = TGui.getComputedStyleInt ( this.dClose, "height", 16 ) ;
        this.dClose.src = TGui.buildThemeImageUrl ( this.closerThemeType, "normal", wClose, hClose ) ;
        this.dClose.disabled = false ;
      }
      if ( this.dMaxRestore )
      {
        var wMaxRestore = TGui.getComputedStyleInt ( this.dMaxRestore, "width", 16 ) ;
        var hMaxRestore = TGui.getComputedStyleInt ( this.dMaxRestore, "height", 16 ) ;
        if ( this.isMaximized() ) TGui.setImageSrc ( this.dMaxRestore, "WindowRestore", "normal" ) ;
        else                      TGui.setImageSrc ( this.dMaxRestore, "WindowMax", "normal" ) ;
        this.dMaxRestore.disabled = false ;
      }
      this.dTopLeft.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( this.dTopLeft.xClassName, "normal"
                                                                              , this.dTopLeft.offsetWidth, this.dTopLeft.offsetHeight ) ;
      this.dTopImage.src = TGui.buildThemeImageUrl ( "WindowTopMid", "normal", NaN, this.dTop.offsetHeight ) ;
      this.dTopRight.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( this.dTopRight.xClassName, "normal"
                                                                               , this.dTopRight.offsetWidth, this.dTopRight.offsetHeight ) ;
      this.dTop.className = "ThemeWindowTop" ;
      this.dBottomLeft.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "WindowBottomLeft", "normal"
                                                                                 , this.dBottomLeft.offsetWidth, this.dBottomLeft.offsetHeight ) ;
      this.dBottomImage.src = TGui.buildThemeImageUrl ( "WindowBottom", "normal", NaN, this.dBottom.offsetHeight );
      this.dBottomRight.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "WindowBottomRight", "normal"
                                                                                 , this.dBottomRight.offsetWidth, this.dBottomRight.offsetHeight ) ;
      if ( this.dLeftImage )
        this.dLeftImage.src = TGui.buildThemeImageUrl ( "WindowLeft", "normal", this.dLeft.offsetWidth, this.dLeft.offsetHeight );
      if ( this.dRightImage )
        this.dRightImage.src = TGui.buildThemeImageUrl ( "WindowRight", "normal", this.dRight.offsetWidth, this.dRight.offsetHeight );
      var txml = Tango.getThemeXml ( "WindowTitle", "normal" ) ;
      if ( txml )
      {
        this.dTitle.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "WindowTitle", "normal", this.dTitle.offsetWidth, this.dTitle.offsetHeight );
      }
      else
      {
        this.dTitle.style.backgroundImage = "none" ;
      }
    }
  }
  else
  {
    this.dom.className = this._className ;
    this.dBody.className = "ThemeWindowBodyDisabled" ;
    if ( ! this._borderless )
    {
      if ( this.dClose )
      {
        var wClose = TGui.getComputedStyleInt ( this.dClose, "width", 16 ) ;
        var hClose = TGui.getComputedStyleInt ( this.dClose, "height", 16 ) ;
        this.dClose.src = TGui.buildThemeImageUrl ( this.closerThemeType, "disabled", wClose, hClose ) ;
        this.dClose.disabled = true ;
      }
      if ( this.dMaxRestore )
      {
        if ( this.isMaximized() ) TGui.setImageSrc ( this.dMaxRestore, "WindowRestore", "disabled" ) ;
        else                      TGui.setImageSrc ( this.dMaxRestore, "WindowMax", "disabled" ) ;
        this.dMaxRestore.disabled = true ;
      }
      this.dTopLeft.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( this.dTopLeft.xClassName, "disabled"
                                                                              , this.dTopLeft.offsetWidth, this.dTopLeft.offsetHeight ) ;
      this.dTopImage.src = TGui.buildThemeImageUrl ( "WindowTopMid", "disabled", NaN, this.dTop.offsetHeight ) ;
      this.dTopRight.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( this.dTopRight.xClassName, "disabled"
                                                                              , this.dTopRight.offsetWidth, this.dTopRight.offsetHeight ) ;
      this.dTop.className = "ThemeWindowTopDisabled" ;
      this.dBottomLeft.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "WindowBottomLeft", "disabled"
                                                                                 , this.dBottomLeft.offsetWidth, this.dBottomLeft.offsetHeight ) ;
      this.dBottomImage.src = TGui.buildThemeImageUrl ( "WindowBottom", "disabled", NaN, this.dBottom.offsetHeight );
      this.dBottomRight.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "WindowBottomRight", "disabled"
                                                                                 , this.dBottomRight.offsetWidth, this.dBottomRight.offsetHeight ) ;
      if ( this.dLeftImage )
        this.dLeftImage.src = TGui.buildThemeImageUrl ( "WindowLeft", "disabled", this.dLeft.offsetWidth, this.dLeft.offsetHeight );
      if ( this.dRightImage )
        this.dRightImage.src = TGui.buildThemeImageUrl ( "WindowRight", "disabled", this.dRight.offsetWidth, this.dRight.offsetHeight );
      var txml = Tango.getThemeXml ( "WindowTitle", "disabled" ) ;
      if ( txml )
      {
        this.dTitle.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "WindowTitle", "disabled", this.dTitle.offsetWidth, this.dTitle.offsetHeight );
      }
      else
      {
        this.dTitle.style.backgroundImage = "none" ;
      }
    }
  }
};
TWindow.prototype.setZIndex = function ( zIndex )
{
  if ( this.dom.style.zIndex == zIndex ) return ;
  this.currentZIndex = zIndex ;
  if ( this.modal )
  {
    this.mdiv.style.zIndex = this.currentZIndex ;
    this.dom.style.zIndex = this.currentZIndex + 1 ;
  }
  else
  {
    this.dom.style.zIndex = this.currentZIndex ;
  }
  applyZIndexInput ( this.dom, this.currentZIndex ) ;
};
TWindow.prototype.mouseDownClose = function ( event )
{
  TGui.setImageSrc ( this.dClose, this.closerThemeType, "pressed" ) ;
  var e = new TEvent ( event ) ;
  e.consume() ;
  return false ;
};
TWindow.prototype.mouseOverMenu = function ( event )
{
  if ( ! this.dMenu ) return ;
  TGui.setImageSrc ( this.dMenu, "WindowMenu", "inside" ) ;
  this.dMenu.style.cursor = 'pointer' ;
  return false ;
};
TWindow.prototype.mouseOutMenu = function ( event )
{
  if ( ! this.dMenu ) return ;
  TGui.setImageSrc ( this.dMenu, "WindowMenu", "normal" ) ;
  var e = new TEvent ( event ) ;
  e.consume() ;
  return false ;
};
TWindow.prototype.mouseDownMenu = function ( event )
{
  TGui.setImageSrc ( this.dMenu, "WindowMenu", "pressed" ) ;
  var e = new TEvent ( event ) ;
  e.consume() ;
  return false ;
};
TWindow.prototype.mouseUpMenu = function ( event )
{
  TGui.setImageSrc ( this.dMenu, "WindowMenu", "inside" ) ;
  var e = new TEvent ( event ) ;
  e.consume() ;
  return false ;
};
TWindow.prototype.mouseOverMaxRestore = function ( event )
{
  if ( this.isMaximized() ) TGui.setImageSrc ( this.dMaxRestore, "WindowRestore", "inside" ) ;
  else                      TGui.setImageSrc ( this.dMaxRestore, "WindowMax", "inside" ) ;
  this.dMaxRestore.style.cursor = 'pointer' ;
  var e = new TEvent ( event ) ;
  e.consume() ;
  return false ;
};
TWindow.prototype.mouseOutMaxRestore = function ( event )
{
  if ( this.isMaximized() ) TGui.setImageSrc ( this.dMaxRestore, "WindowRestore", "normal" ) ;
  else                      TGui.setImageSrc ( this.dMaxRestore, "WindowMax", "normal" ) ;
  var e = new TEvent ( event ) ;
  e.consume() ;
  return false ;
};
TWindow.prototype.mouseDownMaxRestore = function ( event )
{
  if ( this.isMaximized() ) TGui.setImageSrc ( this.dMaxRestore, "WindowRestore", "pressed" ) ;
  else                      TGui.setImageSrc ( this.dMaxRestore, "WindowMax", "pressed" ) ;
  var e = new TEvent ( event ) ;
  e.consume() ;
  return false ;
};
TWindow.prototype.maxRestore = function ( event )
{
  this.ml ( event ) ;
};
TWindow.prototype.mlmobile = function ( event )
{
  if ( ! this.lastTap )
  {
    this.lastTap = new Date().getTime() ;
    return ;
  }
  var now = new Date().getTime() ;
  if ( now - this.lastTap <= 500 )
  {
    this.ml ( event ) ;
  }
  this.lastTap = 0 ;
};
TWindow.prototype.topclick = function ( event )
{
  var e = new TEvent ( event ) ;
  if ( e.isButtonMiddle() )
  {
    if ( this.isMaximized() )
    {
      this.restore() ;
      e.consume() ;
      return ;
    }
    if ( e.isShift() )
    {
      this.maximize ( 2 ) ;
    }
    else
    {
      this.maximize ( 3 ) ;
    }
    e.consume() ;
  }
};
TWindow.prototype.ml = function ( event )
{
  var e = new TEvent ( event ) ;
  if ( this.isMaximized() ) this.restore() ;
  else
  {
    if ( e.isShift() ) this.maximize ( 2 ) ;
    else
    if ( e.isCtrl() ) this.maximize ( 3 ) ;
    else               this.maximize() ;
  }
  e.consume() ;
  return false ;
};
TWindow.prototype.mm = function ( event )
{
  if ( this._borderless )
  {
    return ;
  }
  if ( this.isMaximized() ) return ;

  if ( ! event ) event = window.event;
  var x = event.pageX || ( event.clientX + ( document.documentElement.scrollLeft
                                           || document.body.scrollLeft
                                           )) ;
  var y = event.pageY || ( event.clientY + (  document.documentElement.scrollTop
                                           || document.body.scrollTop
                                           ));
  this.cursorPosition = 0 ;


  var src = event.target || event.srcElement || event.originalTarget ;
  if ( this.dMaxRestore === src )
  {
    this.dMaxRestore.style.cursor = "pointer" ;
    return ;
  }
  if ( this.eImg === src )
  {
    this.eImg.style.cursor = "pointer" ;
    return ;
  }
  if ( this.eResizeGripper === src )
  {
    this.cursorPosition = Dragger.SE_RESIZE ;
    return ;
  }

  this.dTop.style.cursor = "move" ;

  if ( ! this._resizable ) return ;

  if ( src === this.dLeft || src === this.dLeftImage )
  {
    this.cursorPosition = Dragger.W_RESIZE ;
    this.dLeft.style.cursor = "w-resize" ;
    return ;
  }
  else
  if (  src === this.dBottomLeft )
  {
    this.cursorPosition = Dragger.SW_RESIZE ;
    this.dBottomLeft.style.cursor = "sw-resize" ;
    return ;
  }
  else
  if (  src === this.dBottomRight )
  {
    this.cursorPosition = Dragger.SE_RESIZE ;
    this.dBottomRight.style.cursor = "se-resize" ;
  }
  else
  if (  src === this.dBottom
     || src === this.dBottomMid
     || src === this.dBottomImage
     )
  {
    this.cursorPosition = Dragger.S_RESIZE ;
    this.dBottom.style.cursor = "s-resize" ;
    return ;
  }
  else
  if ( src === this.dRight || src === this.dRightImage )
  {
    this.cursorPosition = Dragger.E_RESIZE ;
    this.dRight.style.cursor = "e-resize" ;
    this.dTop.style.cursor = "e-resize" ;
    return ;
  }
  var wx = x - this.dom.offsetLeft ;
  var wy = y - this.dom.offsetTop ;
  if ( wx <= this._resizeBorderWatermark )
  {
    if ( wy <= this._resizeBorderWatermark )
    {
      this.cursorPosition = Dragger.NW_RESIZE ;
      this.dTop.style.cursor = "nw-resize" ;
    }
    else
    if ( this.dom.offsetHeight - wy <= this._resizeBorderWatermark )
    {
      this.cursorPosition = Dragger.SW_RESIZE ;
      this.dLeft.style.cursor = "sw-resize" ;
      this.dBottom.style.cursor = "sw-resize" ;
    }
    else
    {
      this.cursorPosition = Dragger.W_RESIZE ;
      this.dLeft.style.cursor = "w-resize" ;
      this.dTop.style.cursor = "w-resize" ;
    }
  }
  else
  if ( this.dom.offsetWidth - wx <= this._resizeBorderWatermark )
  {
    if ( wy <= this._resizeBorderWatermark )
    {
      this.cursorPosition = Dragger.NE_RESIZE ;
      this.dTop.style.cursor = "ne-resize" ;
    }
    else
    if ( this.dom.offsetHeight - wy <= this._resizeBorderWatermark )
    {
      this.cursorPosition = Dragger.SE_RESIZE ;
      this.dRight.style.cursor = "se-resize" ;
      this.dBottom.style.cursor = "se-resize" ;
    }
    else
    {
      this.cursorPosition = Dragger.E_RESIZE ;
      this.dRight.style.cursor = "e-resize" ;
      this.dTop.style.cursor = "e-resize" ;
    }
  }
  else
  if ( wy <= this._resizeBorderWatermark )
  {
    this.cursorPosition = Dragger.N_RESIZE ;
    this.dTop.style.cursor = "n-resize" ;
  }
  else
  if ( this.dom.offsetHeight - wy <= this._resizeBorderWatermark )
  {
    this.cursorPosition = Dragger.S_RESIZE ;
    this.dBottom.style.cursor = "s-resize" ;
  }
};
TWindow.prototype._pageResized = function ( pageSize )
{
  if ( ! this.dom.xConstraints ) return ;
  if ( ! pageSize ) pageSize = TGui.getBrowserWindowSize() ;
  if ( this.dom.xConstraints.bottomAttach )
  {
    var b = this.getBounds() ;
    if ( this.dom.xConstraints.bottomMinus )
    {
    }
    else
    {
      this.setLocation ( b.x, pageSize.height - b.height - this.dom.xConstraints.bottomValue ) ;
    }
  }
  if ( this.dom.xConstraints.rightAttach )
  {
    var b = this.getBounds() ;
    if ( this.dom.xConstraints.rightMinus )
    {
    }
    else
    {
      this.setLocation ( pageSize.width - b.width - this.dom.xConstraints.rightValue, b.y ) ;
    }
  }
};
TWindow.prototype.setConstraints = function ( constraints )
{
  this.dom.xConstraints  = constraints ;
  this._pageResized ( null ) ;
};
TWindow.prototype.setBounds = function ( x, y, width, height )
{
  if ( this._showing )
  {
    TComponent.prototype.setBounds.apply ( this, arguments ) ;
  }
  else
  {
    if ( x instanceof TRectangle )
    {
      this.pendingBounds = x ;
    }
    else
    {
      this.pendingBounds = new TRectangle ( x, y, width, height ) ;
    }
  }
};
TWindow.prototype.setSize = function ( width, height )
{
  this.dom.style.width  = width + "px" ;
  this.dom.style.height = height + "px" ;

  if ( ! this._borderless )
  {
    if ( ! this.dTop.xConstraints )
    {
      this.dTop.xConstraints = new TConstraints() ;
      this.dTop.xConstraints.parseRight ( "-0" ) ;

      this.dTopMid.xConstraints = new TConstraints() ;
      this.dTopMid.xConstraints.parseRight ( "-0" ) ;
      this.dTopMid.xConstraints.setRightAttachComponent() ;

      this.dTopRight.xConstraints = new TConstraints() ;
      this.dTopRight.xConstraints.parseRight ( "0" ) ;

      if ( this.dClose )
      {
        this.dClose.xConstraints = new TConstraints() ;
        this.dClose.xConstraints.parseRight ( "" + this.dClose.xRight ) ;
      }
      if ( this.dMaxRestore )
      {
        this.dMaxRestore.xConstraints = new TConstraints() ;
        this.dMaxRestore.xConstraints.parseRight ( "" + this.dMaxRestore.xRight ) ;
        this.dMaxRestore.xConstraints.setRightComponent ( this.dClose ) ;
        this.dMaxRestore.xConstraints.setRightAttachComponent() ;
      }
      this.dLeft.xConstraints = new TConstraints() ;
      this.dLeft.xConstraints.parseBottom ( "-0" ) ;
      this.dLeft.xConstraints.setBottomAttachComponent() ;

      this.dRight.xConstraints = new TConstraints() ;
      this.dRight.xConstraints.parseRight ( "0" ) ;
      this.dRight.xConstraints.parseBottom ( "-0" ) ;
      this.dRight.xConstraints.setBottomAttachComponent() ;

      this.dBottom.xConstraints = new TConstraints() ;
      this.dBottom.xConstraints.parseBottom ( "0" ) ;
      this.dBottom.xConstraints.parseRight ( "-0" ) ;

      this.dBody.xConstraints = new TConstraints() ;
      this.dBody.xConstraints.parseBottom ( "-0" ) ;
      this.dBody.xConstraints.parseRight ( "-0" ) ;
    }
    this.dTop.style.width  = width + "px" ;
    if ( TGui.getComputedStyle ( this.dTop, "text-align" ) == "center" )
    {
      this.dTitle.style.left = ( ( this.dTop.offsetWidth - this.dTitle.offsetWidth ) / 2 ) + "px" ;
    }
    var wBody = this.dom.offsetWidth - this.dLeft.offsetWidth - this.dRight.offsetWidth ;
    var hBody = this.dom.offsetHeight - this.dTop.offsetHeight - this.dBottom.offsetHeight ;
    this.dLeft.style.height = hBody + "px" ;

    this.dRight.style.height = hBody + "px" ;
    this.dRight.style.left = ( this.dom.offsetWidth - this.dRight.offsetWidth ) + "px" ;

    this.dBottom.style.width = ( width - this.dBottom.xOuterWidth ) + "px" ;
    this.dBottom.style.top = ( this.dom.offsetHeight - this.dBottom.offsetHeight ) + "px" ;

    this.dBottomMid.style.width = wBody + "px" ;
    this.dBottomRight.style.left = ( this.dom.offsetWidth - this.dBottomRight.offsetWidth ) + "px" ;

    this.dBody.style.width =  wBody + "px" ;
    this.dBody.style.height = hBody + "px" ;

    TGui.layoutConstraints ( this.dTop ) ;
    TGui.layoutConstraints ( this.dLeft ) ;
    TGui.layoutConstraints ( this.dRight ) ;
    TGui.layoutConstraints ( this.dBottom ) ;
    TGui.layoutConstraints ( this.dBody ) ;
  }
  else
  {
    this.dBody.style.width =  this.dom.offsetWidth + "px" ;
    this.dBody.style.height = this.dom.offsetHeight + "px" ;
    TGui.layoutConstraints ( this.dBody ) ;
  }
};
TWindow.prototype.setHtmlText = function ( htmlText )
{
  var wBody = new TXml ( this.getBody() ) ;
  var eForm = wBody.getDomByName ( "Form" ) ;

  if ( ! htmlText ) eForm.innerHTML = "&nbsp;" ;
  else              eForm.innerHTML = htmlText ;
};
TWindow.prototype.getElement = function ( idOrName )
{
  var wBody = new TXml ( this.getBody() ) ;
  return wBody.getDomByIdOrName ( idOrName ) ;
};
TWindow.prototype.getElementByName = function ( name )
{
  var wBody = new TXml ( this.getBody() ) ;
  return wBody.getDomByName ( name ) ;
};
TWindow.prototype.getElementById = function ( id )
{
  var wBody = new TXml ( this.getBody() ) ;
  return wBody.getDomById ( id ) ;
};
TWindow.prototype.getXmlByName = function ( name )
{
  var wBody = new TXml ( this.getBody() ) ;
  return wBody.getXmlByName ( name ) ;
};
TWindow.prototype.getXmlById = function ( id )
{
  var wBody = new TXml ( this.getBody() ) ;
  return wBody.getXmlById ( id ) ;
};
TWindow.prototype.getListenerContext = function()
{
  var wBody = new TXml ( this.getBody() ) ;
  return wBody.getListenerContext() ;
};
TWindow.prototype.checkStatus = function()
{
  var wBody = new TXml ( this.getBody() ) ;
  var lc = wBody.getListenerContext() ;
  if ( ! lc ) return ;
  return lc.check() ;
};
TWindow.prototype.hasChanged = function()
{
  var wBody = new TXml ( this.getBody() ) ;
  var lc = wBody.getListenerContext() ;
  if ( ! lc ) return false ;
  return lc.hasChanged() ;
};
TWindow.prototype.resetChanged = function()
{
  var wBody = new TXml ( this.getBody() ) ;
  var lc = wBody.getListenerContext() ;
  if ( ! lc ) return false ;
  return lc.reset() ;
};
TWindow.prototype.changed = function()
{
  var wBody = new TXml ( this.getBody() ) ;
  var lc = wBody.getListenerContext() ;
  if ( ! lc ) return ;
  return lc.changed() ;
};
TWindow.prototype.setRefData = function ( xRefData )
{
  var wBody = new TXml ( this.getBody() ) ;
  wBody.setRefData ( xRefData ) ;
};
TWindow.prototype.getPeer = function ( idOrName )
{
  var e = this.getElement ( idOrName ) ;
  if ( ! e ) return null ;
  if ( ! e.jsPeer ) return null ;
  return e.jsPeer ;
};
TWindow.prototype.getPeerById = function ( id )
{
  if ( typeof ( id ) != "string" )
  {
    throw "TWindow.getPeerById(): Missing or invalid id: " + id ;
  }
  var wBody = new TXml ( this.getBody() ) ;
  var e = wBody.getDomById ( id ) ;
  if ( ! e ) throw "TWindow.getPeerById(): element for id='" + id + "' not found." ;
  if ( ! e.jsPeer ) throw "TWindow.getPeerById(): element id='" + id + "' has no peer." ;
  return e.jsPeer ;
};
TWindow.prototype.getPeerByName = function ( name )
{
  if ( typeof ( name ) != "string" )
  {
    throw "TWindow.getPeerByName(): Missing or invalid name: " + name ;
  }
  var wBody = new TXml ( this.getBody() ) ;
  var e = wBody.getDomByName ( name ) ;
  if ( ! e ) throw "TWindow.getPeerByName(): element for name='" + name + "' not found." ;
  if ( ! e.jsPeer ) throw "TWindow.getPeerByName(): element name='" + name + "' has no peer." ;
  return e.jsPeer ;
};
TWindow.prototype.getComponent = function ( idOrName )
{
  if ( ! this.dom ) return null  ;
  if ( typeof ( idOrName ) != "string" )
  {
    throw "TContainer.getComponent(): Missing or invalid id: " + idOrName ;
  }
  var x = new TXml ( this.getBody() ) ;
  return TGui.getComponent ( x.getDomByIdOrName ( idOrName ) ) ;
};
TWindow.prototype.getComponentById = function ( id )
{
  if ( ! this.dom ) return null  ;
  if ( typeof ( id ) != "string" )
  {
    throw "TContainer.getComponentById(): Missing or invalid id: " + id ;
  }
  var x = new TXml ( this.getBody() ) ;
  return TGui.getComponent ( x.getDomById ( id ) ) ;
};
TWindow.prototype.getComponentByName = function ( name )
{
  if ( ! this.dom ) return null  ;
  if ( typeof ( name ) != "string" )
  {
    throw "TWindow.getComponentByName(): Missing or invalid name: " + name ;
  }
  var x = new TXml ( this.getBody() ) ;
  return TGui.getComponent ( x.getDomByName ( name ) ) ;
};
TWindow.prototype.lock = function()
{
  var div = document.createElement ( "div" ) ;
  this.mlock = div ;
  var p = this.dom.parentNode ;
  var nch = this.dom.nextSibling ;
  var img = document.createElement ( "img" ) ;
  if ( nch )
  {
    p.insertBefore ( div, nch ) ;
  }
  else
  {
    p.appendChild ( div ) ;
  }
  div.appendChild ( img ) ;
  div.style.position = "absolute" ;
  div.style.top = this.dom.offsetTop + "px" ;
  div.style.left = this.dom.offsetLeft + "px" ;
  div.style.width = this.dom.offsetWidth + "px" ;
  div.style.height = this.dom.offsetHeight + "px" ;
  div.style.zIndex = this.dom.style.zIndex + 10 ;
  img.src = "img/Spinning_wheel_throbber.gif" ;
  img.style.position = "absolute" ;
  img.width = 32 ;
  img.height = 32 ;
  var x = Math.floor ( ( div.offsetWidth - img.width ) / 2 ) ;
  var y = Math.floor ( ( div.offsetHeight - img.height ) / 2 ) ;
  img.style.left = x + "px" ;
  img.style.top = y + "px" ;
};
TWindow.prototype.unlock = function()
{
  if ( ! this.mlock ) return ;
  this.mlock.parentNode.removeChild ( this.mlock ) ;
  this.mlock = null ;
};
TWindow.prototype.setAllInputEnabled = function ( state )
{
  TGui.setAllInputEnabled ( this.getBody(), state ) ;
} ;
TWindow.prototype.findFirstFocusableElement = function()
{
  var c = new TContainer ( this.getBody() ) ;
  return c.findFirstFocusableElement() ;
} ;
TWindow.prototype.findLastFocusableElement = function()
{
  var c = new TContainer ( this.getBody() ) ;
  return c.findLastFocusableElement() ;
} ;
TWindow.prototype.close = function ( event )
{
  this.__close ( event, false ) ;
}
TWindow.prototype.closeImmediately = function()
{
  this.__close ( null, true ) ;
}
TWindow.prototype.closeImediately = function()
{
  this.__close ( null, true ) ;
}
TWindow.prototype.__close = function ( p1, state )
{
  if ( this._eventMulticaster )
  {
    this._eventMulticaster.flush() ;
    this._eventMulticaster = null ;
  }
  this._close ( p1, state ) ;
}
TWindow.prototype.addListener = function ( obj, method, eventName )
{
  if ( ! this._eventMulticaster )
    this._eventMulticaster = new EventMulticaster() ;
  this._eventMulticaster.add ( obj, method, eventName ) ;
} ;
TWindow.prototype.resizing = function ( event )
{
  if ( ! this._eventMulticaster ) return ;
  var ev = new TEvent ( event ) ;
  ev.setHtmlSource ( this.dom ) ;
  ev.setPeer ( this ) ;
  this._eventMulticaster.fireEvent ( ev, "resize" ) ;
}

/**
 *  @constructor
 *  @extends TWindow
 */
var TLogWindow = function ( id )
{
  TGui._creating_TLogWindow = true ;
  Tango.initSuper ( this, TWindow, null );
  this.jsClassName = "TLogWindow" ;
  if ( id ) this.id = id ;
  else      this.id = "The.Log.Window" ;
  this.title = "The Log Window" ;
  this.TD = null ;

  this.create() ;
  this.show() ;
  TGui._creating_TLogWindow = false ;
};
TLogWindow.inherits( TWindow ) ;
TLogWindow.prototype.create = function()
{
  var axlString = ""
  + "<xml>\n"
  + "  <Window resizable='true' close-with-escape='true' id='" + this.id + "' >\n"
  + "    <Container style='right:-0;bottom:-0;width:400px;height:400px;' >\n"
+ " <Toolbar style='left:0px;top:0px;'>\n"
  + "        <ToolbarButton img='Tango/Misc/edit-clear-32' img-width='24' tooltip='Clear' name='PB.CLEAR' />\n"
  + "        <ToolbarButton img='Tango/Misc/left-32' img-width='24' name='PB.ATTACH-LEFT' tooltip='Attach to left of browser' />\n"
  + "        <ToolbarButton img='Tango/Misc/right-32' img-width='24' name='PB.ATTACH-RIGHT' tooltip='Attach to right of browser' />\n"
  + "        <ToolbarButton img='Tango/Misc/top-32' img-width='24' name='PB.ATTACH-TOP' tooltip='Attach to top of browser' />\n"
  + "        <ToolbarButton img='Tango/Misc/bottom-32' img-width='24' name='PB.ATTACH-BOTTOM' tooltip='Attach to bottom of browser' />\n"
  + "        <ToolbarButton img='Tango/Misc/left-right-32' img-width='24' name='PB.MAX-HORIZONTAL' tooltip='Maximize horizontal' />\n"
  + "        <ToolbarButton img='Tango/Misc/top-bottom-32' img-width='24' name='PB.MAX-VERTICAL' tooltip='Maximize vertical' />\n"
  + "        <ToolbarButton img='Tango/Misc/close-32' img-width='24' tooltip='Close' onclick='TGui.closeTopWindow(event)' style='right:4px;' />\n"
+ " </Toolbar >\n"
  + "      <br />\n"
  + "      <DisplayContainer id='" + this.id + ".Display' style='left:0px;bottom:-0;right:-0;attach-bottom:true;overflow:auto;'>\n"
  + "      </DisplayContainer>\n"
  + "      <br />\n"
//  + "      <Container style='bottom:0;right:0;' >\n"
//  + "      </Container>\n"
  + "    </Container>\n"
  + "  </Window>\n"
  + "</xml>\n"
  ;
  this.setAxl ( axlString ) ;
  TWindow.prototype.create.apply ( this, arguments ) ;
  this.TD = new TTextDisplay ( this.getElementById ( this.id + '.Display' ) ) ;
  this.TD.dir = "ltr" ;
  var pb = this.getElementByName ( "PB.CLEAR" ) ;
  TGui.addEventListener ( pb, "click", this.clear.bindAsEventListener ( this ) ) ;
  pb = this.getElementByName ( "PB.ATTACH-BOTTOM" ) ;
  TGui.addEventListener ( pb, "click", this._attachToBrowserWindow.bindAsEventListener ( this, 'b' ) ) ;
  pb = this.getElementByName ( "PB.ATTACH-RIGHT" ) ;
  TGui.addEventListener ( pb, "click", this._attachToBrowserWindow.bindAsEventListener ( this, 'r' ) ) ;
  pb = this.getElementByName ( "PB.ATTACH-TOP" ) ;
  TGui.addEventListener ( pb, "click", this._attachToBrowserWindow.bindAsEventListener ( this, 't' ) ) ;
  pb = this.getElementByName ( "PB.ATTACH-LEFT" ) ;
  TGui.addEventListener ( pb, "click", this._attachToBrowserWindow.bindAsEventListener ( this, 'l' ) ) ;
  pb = this.getElementByName ( "PB.MAX-HORIZONTAL" ) ;
  TGui.addEventListener ( pb, "click", this._attachToBrowserWindow.bindAsEventListener ( this, 'mh' ) ) ;
  pb = this.getElementByName ( "PB.MAX-VERTICAL" ) ;
  TGui.addEventListener ( pb, "click", this._attachToBrowserWindow.bindAsEventListener ( this, 'mv' ) ) ;
};
TLogWindow.prototype.show = function()
{
  TWindow.prototype.show.apply ( this, arguments ) ;
};
TLogWindow.prototype._attachToBrowserWindow = function ( event, place )
{
  var c = this.dom.xConstraints ;
  if ( ! c ) c = new TConstraints() ;
  var loc = this.getLocation() ;

  if ( place === 'b' )
  {
    if ( ! c.bottomAttach ) c.parseBottom ( "0" ) ;
    else                    c.bottomAttach = false ;
  }
  else
  if ( place === 'r' )
  {
    if ( ! c.rightAttach ) c.parseRight ( "0" ) ;
    else c.rightAttach = false ;
  }
  else
  if ( place === 't' )
  {
    c.bottomAttach = false ;
    c.rightAttach  = false ;
    loc.y = 0 ;
    this.setLocation ( loc ) ;
  }
  else
  if ( place === 'l' )
  {
    c.bottomAttach = false ;
    c.rightAttach  = false ;
    loc.x = 0 ;
    this.setLocation ( loc ) ;
  }
  else
  if ( place === 'mh' )
  {
    if ( this.isMaximized() )
    {
      this.restore() ;
      if ( this.maximizedType === 2 ) return ;
    }
    this.maximize ( 2 ) ;
  }
  else
  if ( place === 'mv' )
  {
    if ( this.isMaximized() )
    {
      this.restore() ;
      if ( this.maximizedType === 3 ) return ;
    }
    this.maximize ( 3 ) ;
  }
  this.setConstraints ( c ) ;
/*
(TConstraints)[
 rightAttach=undefined
 rightMinus=undefined
 rightValue=undefined
 bottomAttach=true
 bottomMinus=false
 bottomValue=0
 center: x=false, y=false]
*/
//log ( c ) ;
};
TLogWindow.prototype.addCode = function ( text, escapeEntities )
{
  this.TD.add ( text, true, escapeEntities ) ;
};
TLogWindow.prototype.add = function ( text, pre, escapeEntities )
{
  this.TD.add ( text, pre, escapeEntities ) ;
};
TLogWindow.prototype.println = function ( text )
{
  this.TD.println ( text ) ;
};
TLogWindow.prototype.print = function ( text )
{
  this.TD.print ( text ) ;
};
TLogWindow.prototype.newLine = function()
{
  this.TD.newLine() ;
};
TLogWindow.prototype.clear = function()
{
  this.TD.clear() ;
};
TLogWindow.prototype.getTextDisplay = function()
{
  return this.TD ;
};
TLogWindow.prototype.scrollToTop = function()
{
  this.TD.scrollToTop() ;
};
TLogWindow.prototype.scrollToBottom = function()
{
  this.TD.scrollToBottom() ;
};

// ---------------- UserDialog: ask, info, ... ----------------
var _TUserDialog_Initialized = false ;
/**
 *  @constructor
 */
TUserDialog = function ( text, title )
{
  if ( ! text && ! title )
  {
//    TSys.log ( "Missing text and title parameter in new TUserDialog" ) ;
    return ;
  }
  if ( typeof Error !== 'undefined' && ( text instanceof Error ) )
  {
    text = TSys.getStackTrace ( text ) ;
  }
  this.userFunction = null ;
  this.ownerWindow = null ;
  this.imageArray = new Array() ;

  this.imageArray["question"] = "img/alert-question.gif" ;
  this.imageArray["info"] = "img/alert-info.gif" ;
  this.imageArray["error"] = "img/alert-error.gif" ;
  this.imageArray["warning"] = "img/alert-excl.gif" ;

  if ( ! _TUserDialog_Initialized )
  {
    _TUserDialog_Initialized = true ;
  }
  if ( typeof ( this.text ) != 'string' ) this.text = String ( this.text ) ;
  if ( text ) this.text = TSys.translate ( text ) ;
  else        this.text = "???" ;

  if ( title ) this.title = TSys.translate ( title ) ;
  else         this.title = null ;
  this._borders = true ;
  this._eStyle = null ;
  this._buttonTagName = "PushButton" ;
  this._fadeInOut = false ;
  this._animateInOut = false ;
  this.jsClassName = "TUserDialog" ;
  if ( TGui._dialogDecorator )
  {
    TGui._dialogDecorator.execute ( this ) ;
  }
  this._bodyClassName = null ;
  this._closeWithEscape = false ;
};

TUserDialog.prototype.toString = function()
{
  return "(" + this.jsClassName + ")"
       ;
};
TUserDialog.prototype.setFadeInOut = function ( state )
{
  this._fadeInOut = state ;
};
TUserDialog.prototype.setAnimateInOut = function ( state )
{
  this._animateInOut = state ;
};
TUserDialog.prototype.setEStyle = function ( eStyle )
{
  this._eStyle = eStyle ;
};
TUserDialog.prototype.setButtonTagName = function ( name )
{
  this._buttonTagName = name ;
};
TUserDialog.prototype.setBodyClassName = function ( name )
{
  this._bodyClassName = name ;
};
TUserDialog.prototype.setClassName = function ( name )
{
  this._className = name ;
};
TUserDialog.prototype.setBorderless = function()
{
  this._borders = false ;
};
TUserDialog.prototype.setOwnerWindow = function ( ownerWindow )
{
  this.ownerWindow = ownerWindow ;
};
TUserDialog.prototype.setTitle = function ( title )
{
  if ( title ) this.title = TSys.translate ( title ) ;
  else         this.title = null ;
};
TUserDialog.prototype.callOnConfirmation = function ( userFunction, parameter, self )
{
  this._callOnConfirmation = true ;
  this.setUserFunction ( userFunction, parameter, self ) ;
};
TUserDialog.prototype.setUserFunction = function ( userFunction, parameter, self )
{
  var f = userFunction ;
  var o = self ;
  var a = parameter ;

  if ( typeof ( userFunction ) == 'object' && typeof ( parameter ) == 'function' )
  {
    o = userFunction ;
    f = parameter ;
    if ( TSys.isArray ( self ) ) a = self ;
    else
    if ( typeof ( self ) != 'undefined' ) a = [ self ] ;
    else a = null ;
  }
  else
  if ( typeof ( userFunction ) == 'function' )
  {
    f = userFunction ;
    if ( TSys.isArray ( parameter ) ) a = parameter;
    else
    if ( typeof ( parameter ) != 'undefined' ) a = [ parameter ] ;
    else a = null ;
  }

  this.userFunction = new TFunctionExecutor ( o, f );
  if ( a && ! TSys.isArray ( a ) )
  {
    throw "TUserDialog.setUserFunction: parameter must be an array" ;
  }
  this.userFunctionParameters = a ;
};
TUserDialog.prototype.askYesNo = function ( userFunction, self )
{
  this.ask ( userFunction, null, null, self ) ;
};
TUserDialog.prototype.askYesNoCancel = function ( userFunction, self )
{
  this.ask ( userFunction, [ "yes", "no", "cancel" ], [ "Yes", "No", "Cancel" ], self ) ;
};
TUserDialog.prototype.setDefaultTo = function ( buttonName )
{
  this.defaultButtonName = buttonName ;
};
TUserDialog.prototype.setDefaultToYes = function()
{
  this.defaultButtonName = "yes" ;
};
TUserDialog.prototype.setDefaultToNo = function()
{
  this.defaultButtonName = "no" ;
};
TUserDialog.prototype.setDefaultToCancel = function()
{
  this.defaultButtonName = "cancel" ;
};
TUserDialog.prototype.ask = function ( userFunction, nameArray, textArray, self )
{
  if ( ! this.title ) this.title = TSys.translate ( "%Question%..." ) ;
  if ( TSys.isArray ( nameArray ) ) this.nameArray = nameArray ;
  else                               this.nameArray = [ "yes", "no" ] ;
  if ( TSys.isArray ( textArray ) ) this.textArray = textArray ;
  else                               this.textArray = [ "Yes", "No" ] ;
  if ( userFunction ) this.userFunction = new TFunctionExecutor ( self, userFunction );
  this.execute ( "question", this.imageArray["question"] ) ;
};

TUserDialog.prototype.info = function ( ownerWindow )
{
  if ( ownerWindow ) this.ownerWindow = ownerWindow ;
  if ( ! this.title ) this.title = TSys.translate ( "%Information%..." ) ;
  this.nameArray = [ "ok" ] ;
  this.textArray = [ "Ok" ] ;
  this._closeWithEscape = true ;
  this.execute ( "info", this.imageArray["info"] ) ;
};
TUserDialog.prototype.warning = function ( ownerWindow )
{
  if ( ownerWindow ) this.ownerWindow = ownerWindow ;
  if ( ! this.title ) this.title = TSys.translate ( "%Warning%..." ) ;
  this.nameArray = [ "ok" ] ;
  this.textArray = [ "Ok" ] ;
  this._closeWithEscape = true ;
  this.execute ( "warning", this.imageArray["warning"] ) ;
};
TUserDialog.prototype.error = function ( ownerWindow )
{
  if ( ownerWindow ) this.ownerWindow = ownerWindow ;
  if ( ! this.title ) this.title = TSys.translate ( "%Error%..." ) ;
  this.nameArray = [ "ok" ] ;
  this.textArray = [ "Ok" ] ;
  this._closeWithEscape = true ;
  this.execute ( "error", this.imageArray["error"] ) ;
};
TUserDialog.prototype.execute = function ( type, imgSrc )
{
  var dom = Tango.getThemeDom ( "Alert", type ) ;
  var w = 32 ;
  var h = 32 ;
  if ( dom )
  {
    imgSrc = TGui.buildThemeImageUrl ( "Alert", type, NaN, NaN );
    var x = new TXml ( dom ) ;
    w = x.getIntAttribute ( "width", w ) ;
    h = x.getIntAttribute ( "height", h ) ;
  }
  if ( typeof ( this.text ) != 'string' ) this.text = String ( this.text ) ;
  
  var styleAttr = "" ;
  var decoAttr = "" ;
  if ( this._eStyle )
  {
    styleAttr = "style='" + this._eStyle.getStyleString() + "'" ;
    decoAttr = "decoration='" + this._eStyle.getImageAsDecoratorString().replace ( /'/g, "&apos;" ) + "'" ;
  }
  var s = ""
  + "<xml>\n"
  + "<Dialog resizable='false' title='" + this.title + "' id='Dialog.Ask.Yes.No' close-with-escape='" + this._closeWithEscape + "'>\n"
  + "  <Container name='Body' right='-4' " + styleAttr + " " + decoAttr + ">\n"
  + "    <Container ><![CDATA[<div ><img src='" + imgSrc + "' style='width:" + w + "px;height:" + h + "px;' /></div>]]></Container>\n"
  + "    <Container right='-0' ><![CDATA[<div style='white-space:nowrap;' >" + this.text.replace ( /\n/g, "<br/>" ) + "</div>]]></Container>\n"
  + "    <br/>\n"
  + "    <Container Xright='4' center='x' >\n"
  ;
  var indexOfDefault = -1 ;
  var i ;
  for ( i = 0 ; i < this.nameArray.length ; i++ )
  {
    s += "<" + this._buttonTagName + " name='" + this.nameArray[i] + "' text='" ;
    if ( this.textArray.length > i )
    {
      s += TSys.translate ( this.textArray[i] ) + "' " ;
    }
    else
    {
      s += this.nameArray[i] + "' " ;
    }
    if ( this._closeWithEscape && this.nameArray.length == 1 && i == 0 )
    {
      indexOfDefault = i ;
      s += " default='true' " ;
    }
    else
    if ( this.defaultButtonName == this.nameArray[i] )
    {
      indexOfDefault = i ;
      s += " default='true' " ;
    }
    s += " />\n" ;
  }
  s += "</Container>\n</Container>\n</Dialog></xml>\n" ;
  var dom = TSys.parseDom ( s ) ;
  this.d = new TWindow ( dom ) ;
  this.d._ignoreDecorator = true ;
  this.d.setFadeInOut ( this._fadeInOut ) ;
  this.d.setAnimateInOut ( this._animateInOut ) ;
  this.d.setSavePosition ( false ) ;
  if ( this._bodyClassName ) this.d.setBodyClassName ( this._bodyClassName ) ;
  if ( this._className ) this.d.setClassName ( this._className ) ;
  if ( ! this._borders  )
  {
    this.d.setBorderless() ;
    this.d._dragable = true ;
  }
//  this.d._fadeOut = false ;

  if ( this.title ) this.d.setTitle ( this.title ) ;
  else              this.d.setTitle ( "Question..." ) ;

  this.d.setCloserVisible ( false ) ;
  if ( this._borders )
  {
    if ( type == 'info' || type == 'error' || type == 'warning' )
    {
      this.d.setCloserVisible ( true ) ;
      this.d.setMaxRestoreVisible ( false ) ;
    }
  }
  this.d.create() ;
  this.d.dom.style.zIndex = TGui.zIndexUserDialog ;
  this.d.mdiv.style.zIndex = TGui.zIndexMDivUserDialog ;
  var dBody = new TXml ( this.d.getBody() ) ;

  if ( this._eStyle )
  {
//    this._eStyle.apply ( this.d.dBody ) ;
    this.d.dom.style.backgroundColor = "transparent" ;
    this.d.dBody.style.backgroundColor = "transparent" ;
  }
  for ( i = 0 ; i < this.nameArray.length ; i++ )
  {
    var button = dBody.getDomByName ( this.nameArray[i] ) ;
    if ( ! button ) continue ;
    TGui.addEventListener ( button, "click", this.answer.bindAsEventListener ( this ) ) ;
    if ( indexOfDefault == i )
    {
      var fe = new TFunctionExecutor ( this, this.answer ) ;
      TGlobalEventHandler.addToShortCutList ( 13, button, fe ) ;
    }
  }
  if ( this.ownerWindow )
  {
    var windowBounds = this.ownerWindow.getBounds() ;
    var p = { start: function ( w )
              {
                var thisBounds = w.getBounds() ;
                w.setLocation ( windowBounds.x + Math.floor ( ( windowBounds.width - thisBounds.width ) / 2 )
                              , windowBounds.y + Math.floor ( ( windowBounds.height - thisBounds.height ) / 2 )
                              ) ;
                w._show() ;
              }
            } ;
    this.d.show ( p ) ;
  }
  else
  {
    this.d.show() ;
  }
};
TUserDialog.prototype.answer = function ( event )
{
  try
  {
    if ( this.userFunction )
    {
      var ev = null ;
      if ( event && event.jsClassName )
      {
        ev = event ;
      }
      else
      {
        ev = new TEvent ( event ) ;
      }
      ev.consume() ;
      var e = ev.getSource() ;
      var name = e.name ;
      if ( ! name )
      {
        var ch = e ;
        while ( ch )
        {
          if ( ch.name )
          {
            name = ch.name ;
            break ;
          }
          ch = ch.parentNode ;
        }
      }
      var ans = new TAnswer ( name ) ;
      if ( ! this._callOnConfirmation )
      {
        if ( this.userFunctionParameters )
        {
          this.userFunctionParameters.splice ( 0, 0, ans ) ;
          this.userFunction.execute ( this.userFunctionParameters ) ;
        }
        else
        {
          this.userFunction.execute ( [ ans ] ) ;
        }
      }
      else
      if ( ans.isYes() )
      {
        if ( this.userFunctionParameters )
        {
          this.userFunction.execute ( this.userFunctionParameters ) ;
        }
        else
        {
          this.userFunction.execute ( [ ans ] ) ;
        }
      }
    }
  }
  catch ( exc )
  {
    var d = new TUserDialog ( String ( exc  ) ) ;
    d.info() ;
    throw exc ;
  }
  this.d.close() ;
  this.d = null ;
};
/**
 *  @constructor
 */
TAnswer = function ( name )
{
  this.name = name ;
};
TAnswer.prototype.toString = function()
{
  return "(TAnswer)[answer=" + this.name + "]" ;
};
TAnswer.prototype.isYes = function() { return this.name == "yes" ; };
TAnswer.prototype.isNo = function() { return this.name == "no" ; };
TAnswer.prototype.isCancel = function() { return this.name == "cancel" ; };
TAnswer.prototype.isName = function ( name ) { return this.name == name ; };

/**
 *  @constructor
 *  @extends TEvent
 */
var TWindowEvent = function ( event, windowState )
{
  Tango.initSuper ( this, TEvent, event ) ;
  this.jsClassName = "TWindowEvent" ;
  this.windowState = windowState ;
};
TWindowEvent.inherits( TEvent ) ;
TWindowEvent.prototype.WINDOW_CLOSING = 1 ;
TWindowEvent.prototype.WINDOW_OPENED = 2 ;
TWindowEvent.prototype.WINDOW_SHOWN = 2 ;
TWindowEvent.prototype.WINDOW_CLOSED = 4 ;
TWindowEvent.prototype.toString = function ()
{
  var str = TEvent.prototype.toString.apply ( this, arguments ) ;
  str += "\n[" ;
  str += "WINDOW_STATE=" + this.stateToString() ;
  str += "]" ;
  return str ;
};
TWindowEvent.prototype.stateToString = function ()
{
  if ( this.windowState == this.WINDOW_CLOSING ) return "WINDOW_CLOSING" ;
  if ( this.windowState == this.WINDOW_OPENED ) return "WINDOW_OPENED" ;
  if ( this.windowState == this.WINDOW_SHOWN ) return "WINDOW_SHOWN" ;
  if ( this.windowState == this.WINDOW_CLOSED ) return "WINDOW_CLOSED" ;
  return "UNKNOWN(" + this.windowState + ")" ;
};
ComponentAnimator = function ( c )
{
  if ( ! c ) return ;
  if ( typeof ( c ) == 'string' )
  {
    this.comp = TGui.getComponent ( c ) ;
  }
  else
  if ( TGui.isComponent ( c ) )
  {
    this.comp = c ;
  }
  this.jsClassName = "ComponentAnimator" ;
  this.an = null ;
};
ComponentAnimator.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
};
ComponentAnimator.prototype.start = function()
{
  if ( this.onStart ) this.onStart.call(this);
  this.an.play() ;
};
ComponentAnimator.prototype.getComponent = function ()
{
  return this.comp ;
};
ComponentAnimator.prototype.addSubjects = function ( o )
{
  for ( var k in o )
  {
    var v = o[k] ;
    if ( typeof ( v ) == 'function' )
    {
      continue ;
    }
    if ( ! v ) continue ;
    if ( typeof ( v ) != 'object' ) continue ;
    if ( k == 'options' )
    {
      this.an.setOptions ( v ) ;
      continue ;
    }
    var from = v.from ;
    var to = v.to ;
    if ( typeof ( from ) == 'number' && typeof ( to ) == 'number' )
    {
      this.an.addSubject ( new NumericalStyleSubject ( this.comp.dom, k, from, to ) ) ;
      continue ;
    }
  }
};
ComponentAnimator.prototype.animate = function ( o )
{
  var options = o["options"] ;
  for ( var k in o )
  {
    var v = o[k] ;
    if ( typeof ( v ) == 'function' )
    {
      if ( k == 'onStart' )
      {
        this.onStart = v ;
      }
      continue ;
    }
    if ( ! v ) continue ;
    if ( typeof ( v ) != 'object' ) continue ;
    if ( k == 'options' )
    {
      continue ;
    }
    var from = v.from ;
    var to = v.to ;
    if ( typeof ( from ) == 'number' && typeof ( to ) == 'number' )
    {
      if ( ! this.an ) this.an = new Animator ( options ) ;
      this.an.addSubject ( new NumericalStyleSubject ( this.comp.dom, k, from, to ) ) ;
      continue ;
    }
  }
  if ( ! this.an )
  {
    if ( ! this.an ) this.an = new Animator ( options ) ;
  }
  return this ;
} ;
WindowAnimator = function ( w )
{
  Tango.initSuper ( this, ComponentAnimator, w );
  this.jsClassName = "WindowAnimator" ;
};
WindowAnimator.inherits( ComponentAnimator ) ;
WindowAnimator.prototype.getWindow = function ()
{
  return this.comp ;
};
