Tango.include ( "TSystem" ) ;

/**
 *  @constructor
 */
DnDConstants =
{
  /** @constant */ MOVE: 0x1,
  /** @constant */ COPY: 0x2,
  /** @constant */ COPY_OR_MOVE: 0x3,
  /** @constant */ LINK: 0x4,
  /** @constant */ REJECT: 0x10,
  /** @constant */ ACCEPT: 0x20
} ;
/**
 *  @constructor
 */
DnDDataFlavor =
{
  /** @constant */ NONE: 0,
  /** @constant */ TEXT_PLAIN: 1,
  /** @constant */ XML: 2,
  /** @constant */ URL: 3,
  /** @constant */ DOM_HTML: 4,
  /** @constant */ OBJECT: 5,
  /** @constant */ TEXT_HTML: 6,
  /** @constant */ DOM_XML: 7,
  /** @constant */ XML_ARRAY: 8
} ;
/**
 *  @constructor
 *  @extends TEvent
 */
var DnDEvent = function ( event, context )
{
  Tango.initSuper ( this, TEvent, event ) ;
  this.jsClassName = "DnDEvent" ;
  this.context = context ;
  this.mouseX = 0 ;
  this.mouseY = 0 ;
  this.mouseXOnPage = 0 ;
  this.mouseYOnPage = 0 ;
};
DnDEvent.inherits( TEvent ) ;
DnDEvent.prototype.getX = function() { return this.mouseX ; };
DnDEvent.prototype.getY = function() { return this.mouseY ; };
DnDEvent.prototype.getXOnPage = function() { return this.mouseXOnPage ; };
DnDEvent.prototype.getYOnPage = function() { return this.mouseYOnPage ; };
DnDEvent.prototype.toString = function()
{
  var str = TEvent.prototype.toString.apply ( this, arguments ) ;
  str += "\n[" ;
  str += "mouseXOnPage=" + this.mouseXOnPage ;
  str += ",mouseYOnPage=" + this.mouseYOnPage ;
  str += "]" ;
  return str ;
};

/**
 *  @constructor
 *  @extends DnDEvent
 */
var DragSourceEvent = function ( event, context )
{
  Tango.initSuper ( this, DnDEvent, event, context ) ;
  this.jsClassName = "DragSourceEvent" ;
};
DragSourceEvent.inherits ( DnDEvent ) ;
DragSourceEvent.prototype.getElement = function()
{
  return this.context.dndSource.getElement() ;
};
DragSourceEvent.prototype.getPeer = function()
{
  var e = this.context.dndSource.getElement() ;
  if ( e ) return e.jsPeer ;
  return null ;
};
/**
 *  @constructor
 *  @extends DragSourceEvent
 */
var DragSourceStartEvent = function ( event, context )
{
  Tango.initSuper ( this, DragSourceEvent, event, context ) ;
  this.jsClassName = "DragSourceStartEvent" ;
};
DragSourceStartEvent.inherits ( DragSourceEvent ) ;
/**
 *  @constructor
 *  @extends DragSourceEvent
 */
var DragSourceDropEvent = function ( event, context )
{
  Tango.initSuper ( this, DragSourceEvent, event, context ) ;
  this.jsClassName = "DragSourceDropEvent" ;
};
DragSourceDropEvent.inherits ( DragSourceEvent ) ;
DragSourceDropEvent.prototype.getDropSuccess = function() { return this.context.dndDropTargetDropCompleteSuccess ; };
DragSourceEvent.prototype.getDropAction = function() { return this.context.dndDropTargetDropAcceptAction ; };
/**
 *  @constructor
 *  @extends DnDEvent
 */
var DropTargetEvent = function ( event, context )
{
  Tango.initSuper ( this, DnDEvent, event, context ) ;
  this.jsClassName = "DropTargetEvent" ;
};
DropTargetEvent.inherits ( DnDEvent ) ;
DropTargetEvent.prototype.getElement = function()
{
  if ( this.context.dndCurrentDropTarget ) return this.context.dndCurrentDropTarget.getElement() ;
  return null ;
};
DropTargetEvent.prototype.getPeer = function()
{
  var e = this.getElement() ;
  if ( e ) return e.jsPeer ;
  return null ;
};
DropTargetEvent.prototype.acceptDrag = function ( dragOperation )
{
  this.context.acceptDragByDropTarget ( dragOperation ) ;
};
DropTargetEvent.prototype.rejectDrag = function()
{
  this.context.rejectDragByDropTarget() ;
};
DropTargetEvent.prototype.getTransferable = function()
{
  return this.context.dndSource.getTransferable() ;
};
DropTargetEvent.prototype.getDropAction = function()
{
  return this.context.userAction ;
};
/**
 *  @constructor
 *  @extends DropTargetEvent
 */
var DropTargetDropEvent = function ( event, context )
{
  Tango.initSuper ( this, DropTargetEvent, event, context ) ;
  this.jsClassName = "DropTargetDropEvent" ;
};
DropTargetDropEvent.inherits ( DropTargetEvent ) ;
DropTargetDropEvent.prototype.acceptDrop = function ( dropAction )
{
  this.context.acceptDropByDropTarget ( dropAction ) ;
};
DropTargetDropEvent.prototype.rejectDrop = function()
{
  this.context.rejectDropByDropTarget() ;
};
DropTargetDropEvent.prototype.dropComplete = function ( success )
{
  this.context.dropCompleteByDropTarget ( success ) ;
};

/**
 *  @constructor
 */
var Transferable = function ( flavor, dataSourceFunction )
{
  this.jsClassName = "Transferable" ;
  this.name = "" ;
  if ( typeof ( flavor ) != 'undefined' )
  {
    if ( TSys.isArray ( flavor ) ) this.dataFlavorList = flavor ;
    else
    if ( typeof ( flavor ) == 'number' )
    {
      this.dataFlavorList = [] ;
      this.dataFlavorList.push ( flavor ) ;
    }
    else
    if ( typeof ( flavor ) == 'function' )
    {
      this.dataSourceFunction = flavor ;
    }
  }
  if ( ! this.dataFlavorList ) this.dataFlavorList = [] ;
  if ( ! this.dataSourceFunction ) this.dataSourceFunction = dataSourceFunction ;
};
Transferable.prototype.setName = function ( name )
{
  if ( typeof ( name ) == 'string' ) this.name = name ;
};
Transferable.prototype.getName = function()
{
  return this.name ;
};
Transferable.prototype.toString = function()
{
    var s = "(" + this.jsClassName + ")[" + this.dataFlavorList + "]";
    return s;
};
Transferable.prototype.isDataFlavorSupported = function ( flavor )
{
  for ( var i = 0 ; i < this.dataFlavorList.length ; i++ )
  {
    if ( flavor == this.dataFlavorList[i] ) return true ;
  }
  return false ;
};
Transferable.prototype.getData = function ( flavor )
{
  if ( typeof ( this.dataSourceFunction ) == 'function' ) return this.dataSourceFunction ( flavor ) ;
  return null ;
};
/**
 *  @constructor
 *  @extends Transferable
 */
var StringTransferable = function ( str )
{
  if ( typeof ( str ) == 'function' )
  {
    Tango.initSuper ( this, Transferable, DnDDataFlavor.TEXT_PLAIN, str ) ;
  }
  else
  {
    Tango.initSuper ( this, Transferable, DnDDataFlavor.TEXT_PLAIN, this.getString ) ;
    this.data = str ;
  }
};
StringTransferable.inherits ( Transferable ) ;
StringTransferable.prototype.getString = function ( flavor )
{
  return this.data ;
};

/**
 *  @constructor
 */
var DnDSource = function ( id, listener  )
{
  this.jsClassName = "DnDSource" ;
  this._flushed = false ;
  this.dom = null ;
  this.id = null ;
  if ( typeof ( id ) == 'string' )
  {
    this.id = id ;
    this.dom = document.getElementById ( id ) ;
  }
  else
  if ( id && typeof ( id ) == 'object' )
  {
    this.id = id.id ;
    this.dom = id ;
  }
  if ( ! this.dom ) return ;
  TGui.addEventListener ( this.dom, "mousedown", Dragger.dndStart.bindAsEventListener ( Dragger, this ) ) ;
  this.dom.dndSource = this ;
  this.dragElementMove = null ;
  this.dragElementIsDefault = false ;
  this.listener = [] ;
  this.transferable = null ;
  this.imagesChecked = false ;
  this.imagesByTheme = false ;
  this.iconsByTheme = false ;
  this.dragStartLocationX = 0 ;
  this.dragStartLocationY = 0 ;
  Dragger.addDragSource ( this ) ;
  if ( typeof ( listener ) == 'string' )
  {
    listener = listener.trim() ;
    if ( listener )
    {
      if ( listener.charAt ( 0 ) == "{" && listener.charAt ( listener.length - 1 ) == "}" )
      {
        var l = TSys.eval ( listener ) ;
        if ( l )
        {
          this.addListener ( l ) ;
          if ( typeof ( l._initialize_ ) == 'function' )
          {
            l._initialize_() ;
          }
        }
      }
    }
  }
};
DnDSource.prototype.getElement = function()
{
  return this.dom ;
};
DnDSource.prototype.getTransferable = function()
{
  return this.transferable ;
};
DnDSource.prototype._getIcons = function ( evt )
{
  var domMove = Tango.getThemeDom ( "DnDImages", "Move" ) ;
  var domCopy = Tango.getThemeDom ( "DnDImages", "Copy" ) ;
  var domReject = Tango.getThemeDom ( "DnDImages", "Reject" ) ;
  var domIconAccept = Tango.getThemeDom ( "DnDImages", "IconAccept" ) ;
  var domIconReject = Tango.getThemeDom ( "DnDImages", "IconReject" ) ;
  var domIconCopy = Tango.getThemeDom ( "DnDImages", "IconCopy" ) ;
  if ( domMove && domCopy && domReject )
  {
    var x = new TXml ( domMove ) ;
    var w = x.getIntAttribute ( "width", 32 ) ;
    var h = x.getIntAttribute ( "height", 32 ) ;
    var hotspotx = x.getIntAttribute ( "hotspotx", Math.floor ( w/2 ) ) ;
    var hotspoty = x.getIntAttribute ( "hotspoty", Math.floor ( h/2 ) ) ;
    var src = x.getAttribute ( "src" ) ;
    if ( ! src ) return ;

    var div = document.createElement ( "div" ) ;
    div.style.position = "absolute" ;
    div.style.zIndex = TGui.zIndexDnD ;
    document.getElementsByTagName ( "body" )[0].appendChild ( div ) ;
    div.style.width = w + "px" ;
    div.style.height = h + "px" ;
    div.style.top = ( evt.getYOnPage() - hotspoty ) + "px" ;
    div.style.left = ( evt.getXOnPage() - hotspotx ) + "px" ;

    var left = w ;
    if ( domIconAccept && domIconReject )
    {
      var img = document.createElement ( "img" ) ;
      div.appendChild ( img ) ;
      img.style.position = "absolute" ;
      img.style.width = "16px" ;
      img.style.height = "16px" ;
      img.style.top = ( h - 16 ) + "px" ;
      left = w - 16 ;
      img.style.left = left + "px" ;
      img.style.visibility = "hidden" ;
      div.stateIcon = img ;
    }
    if ( domIconCopy )
    {
      var img = document.createElement ( "img" ) ;
      div.appendChild ( img ) ;
      img.style.position = "absolute" ;
      img.style.width = "16px" ;
      img.style.height = "16px" ;
      img.style.top = ( h - 16 ) + "px" ;
      img.style.left = ( left - 16 ) + "px" ;
      img.style.visibility = "hidden" ;
      img.src = TGui.buildThemeImageUrl ( "DnDImages", "IconCopy" ) ;
      div.stateCopyIcon = img ;
    }
    this.dragElementMove = div ;
    this.imagesByTheme = true ;
  }
};
DnDSource.prototype._getDragElementFromListener = function ( evt, dndOperation )
{
  var de = null ;
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].getDragElement )
    {
      de = this.listener[i].getDragElement ( evt ) ;
      if ( de ) break ;
    }
  }
  if ( ! de )
  {
    return ;
  }
  var domIconAccept = Tango.getThemeDom ( "DnDImages", "IconAccept" ) ;
  var domIconReject = Tango.getThemeDom ( "DnDImages", "IconReject" ) ;
  var domIconCopy = Tango.getThemeDom ( "DnDImages", "IconCopy" ) ;

  var w = TGui.getComputedStyleInt ( de, "width", 0 ) ;
  var h = TGui.getComputedStyleInt ( de, "height", 0 ) ;
  if ( !w )
  {
    w = de.offsetWidth ;
    if ( !w ) w = 32 ;
  }
  if ( !h )
  {
    h = de.offsetHeight ;
    if ( !h ) h = 32 ;
  }
  var p = TGui.getLocationOnPageOf ( de ) ;
  var div = document.createElement ( "div" ) ;
  div.style.position = "absolute" ;
  div.style.zIndex = TGui.zIndexDnD ;
  document.getElementsByTagName ( "body" )[0].appendChild ( div ) ;
  div.style.width = w + "px" ;
  div.style.height = h + "px" ;

//  div.style.top = ( evt.getYOnPage() - 8 ) + "px" ;
//  div.style.left = ( evt.getXOnPage() - 8 ) + "px" ;

  div.style.top = ( p.y ) + "px" ;
  div.style.left = ( p.x ) + "px" ;

  if ( de.nodeName == 'TR' )
  {
    if ( de.parentNode )
    {
      de = de.cloneNode ( true ) ;
    }
    if ( de.className == "ThemeTableRowClassSelected" )
    {
      de.className = "ThemeTableRowClass" ;
    }
    var T = document.createElement ( "table" ) ;
    var TBODY = document.createElement ( "tbody" ) ;
    T.appendChild ( TBODY ) ;
    TBODY.appendChild ( de ) ;
    div.appendChild ( T ) ;
    var fg = TGui.getComputedStyle ( de, "color" ) ;
    var bg = TGui.getComputedStyle ( de, "background-color" ) ;
    if ( fg )
    {
      if ( fg.charAt ( 0 ) == '"' ) fg = fg.substring ( 1, fg.length - 1 ) ;
      if ( fg.charAt ( 0 ) == "'" ) fg = fg.substring ( 1, fg.length - 1 ) ;
      div.style.color = fg ;
    }
    if ( bg )
    {
      if ( bg.charAt ( 0 ) == '"' ) bg = bg.substring ( 1, bg.length - 1 ) ;
      if ( bg.charAt ( 0 ) == "'" ) bg = bg.substring ( 1, bg.length - 1 ) ;
      div.style.backgroundColor = bg ;
    }
    var ww = TGui.getComputedStyleInt ( T, "width", 0 ) ;
    var hh = TGui.getComputedStyleInt ( T, "height", 0 ) ;
    if ( !ww )
    {
      ww = T.offsetWidth ;
    }
    if ( ! hh )
    {
       hh = T.offsetHeight ;
    }
    if ( ww & hh )
    {
      div.style.width = ww + "px" ;
      div.style.height = hh + "px" ;
      w = ww ;
      h = hh ;
    }
    this.dragElementMove = div ;
  }
  else
  if ( de.nodeName == 'IMG' )
  {
    div.style.width = w + "px" ;
    div.style.height = h + "px" ;
    div.style.backgroundImage = "url(" + de.src + ")" ;
    this.dragElementMove = div ;
  }
  else
  {
    if ( de.parentNode )
    {
      de = de.cloneNode ( true ) ;
    }
    div.appendChild ( de ) ;
    this.dragElementMove = div ;
  }
  if ( this.dragElementMove )
  {
    var left = w ;
    if ( domIconAccept && domIconReject )
    {
      var img = document.createElement ( "img" ) ;
      div.appendChild ( img ) ;
      img.style.position = "absolute" ;
      img.style.width = "16px" ;
      img.style.height = "16px" ;
      img.style.top = ( h - 16 ) + "px" ;
      left = w - 16 ;
      img.style.left = left + "px" ;
      img.style.visibility = "hidden" ;
      div.stateIcon = img ;
    }
    if ( domIconCopy )
    {
      var img = document.createElement ( "img" ) ;
      div.appendChild ( img ) ;
      img.style.position = "absolute" ;
      img.style.width = "16px" ;
      img.style.height = "16px" ;
      img.style.top = ( h - 16 ) + "px" ;
      img.style.left = ( left - 16 ) + "px" ;
      img.style.visibility = "hidden" ;
      img.src = TGui.buildThemeImageUrl ( "DnDImages", "IconCopy" ) ;
      div.stateCopyIcon = img ;
    }
  }
};
DnDSource.prototype.getDragElement = function ( evt, dndOperation )
{
  if ( ! this.dragElementMove )
  {
    this._getDragElementFromListener ( evt, dndOperation ) ;
    if ( ! this.dragElementMove )
    {
      this._getIcons ( evt ) ;
    }
  }
  if ( ! this.dragElementMove )
  {
    this.dragElementIsDefault = true ;
    var div = document.createElement ( "div" ) ;
    div.style.position = "absolute" ;
    div.style.top = ( evt.getYOnPage() - 8 ) + "px" ;
    div.style.left = ( evt.getXOnPage() - 8 ) + "px" ;
    div.style.zIndex = TGui.zIndexDnD ;
    document.getElementsByTagName ( "body" )[0].appendChild ( div ) ;
    div.style.width = ( 16 ) + "px" ;
    div.style.height = ( 16 ) + "px" ;
    div.style.backgroundColor = "yellow" ;
    this.dragElementMove = div ;
  }
  if ( this.dragElementIsDefault )
  {
    if ( dndOperation & DnDConstants.REJECT )
    {
      this.dragElementMove.style.backgroundColor = "red" ;
      return this.dragElementMove ;
    }
    if ( dndOperation & DnDConstants.ACCEPT )
    {
      this.dragElementMove.style.backgroundColor = "green" ;
      return this.dragElementMove ;
    }
    if ( dndOperation & DnDConstants.MOVE )
    {
      this.dragElementMove.style.backgroundColor = "yellow" ;
      return this.dragElementMove ;
    }
    if ( dndOperation & DnDConstants.COPY )
    {
      this.dragElementMove.style.backgroundColor = "blue" ;
      return this.dragElementMove ;
    }
  }
  else
  if ( this.imagesByTheme )
  {
    if ( dndOperation & DnDConstants.REJECT && ! this.dragElementMove.stateIcon )
    {
      this.dragElementMove.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "DnDImages", "Reject" );
      return this.dragElementMove ;
    }
    if ( dndOperation & DnDConstants.ACCEPT && dndOperation & DnDConstants.COPY )
    {
      this.dragElementMove.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "DnDImages", "Copy" );
      if ( this.dragElementMove.stateIcon )
      {
        this.dragElementMove.stateIcon.src = TGui.buildThemeImageUrl ( "DnDImages", "IconAccept" ) ;
        this.dragElementMove.stateIcon.style.visibility = "visible" ;
      }
      return this.dragElementMove ;
    }
    if ( dndOperation & DnDConstants.ACCEPT && dndOperation & DnDConstants.MOVE )
    {
      this.dragElementMove.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "DnDImages", "Move" );
      if ( this.dragElementMove.stateIcon )
      {
        this.dragElementMove.stateIcon.src = TGui.buildThemeImageUrl ( "DnDImages", "IconAccept" ) ;
        this.dragElementMove.stateIcon.style.visibility = "visible" ;
      }
      return this.dragElementMove ;
    }
    if ( dndOperation & DnDConstants.MOVE )
    {
      this.dragElementMove.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "DnDImages", "Move" );
      if ( dndOperation & DnDConstants.REJECT )
      {
        this.dragElementMove.stateIcon.src = TGui.buildThemeImageUrl ( "DnDImages", "IconReject" ) ;
        this.dragElementMove.stateIcon.style.visibility = "visible" ;
      }
      else
      if ( dndOperation & DnDConstants.ACCEPT )
      {
      }
      else
      if ( this.dragElementMove.stateIcon )
      {
        this.dragElementMove.stateIcon.style.visibility = "hidden" ;
      }
      return this.dragElementMove ;
    }
    if ( dndOperation & DnDConstants.COPY )
    {
      this.dragElementMove.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "DnDImages", "Copy" );
      if ( dndOperation & DnDConstants.REJECT )
      {
        this.dragElementMove.stateIcon.src = TGui.buildThemeImageUrl ( "DnDImages", "IconReject" ) ;
        this.dragElementMove.stateIcon.style.visibility = "visible" ;
      }
      else
      if ( dndOperation & DnDConstants.ACCEPT )
      {
      }
      else
      if ( this.dragElementMove.stateIcon )
      {
        this.dragElementMove.stateIcon.style.visibility = "hidden" ;
      }
      return this.dragElementMove ;
    }
  }
  else
  if ( this.dragElementMove )
  {
    if ( this.dragElementMove.stateIcon )
    {
      if ( dndOperation & DnDConstants.ACCEPT )
      {
        this.dragElementMove.stateIcon.src = TGui.buildThemeImageUrl ( "DnDImages", "IconAccept" ) ;
        this.dragElementMove.stateIcon.style.visibility = "visible" ;
      }
      else
      if ( dndOperation & DnDConstants.REJECT )
      {
        this.dragElementMove.stateIcon.src = TGui.buildThemeImageUrl ( "DnDImages", "IconReject" ) ;
        this.dragElementMove.stateIcon.style.visibility = "visible" ;
      }
      else
      {
        this.dragElementMove.stateIcon.style.visibility = "hidden" ;
      }
      if ( this.dragElementMove.stateCopyIcon )
      {
        if ( dndOperation & DnDConstants.COPY )
        {
          this.dragElementMove.stateCopyIcon.style.visibility = "visible" ;
        }
        else
        {
          this.dragElementMove.stateCopyIcon.style.visibility = "hidden" ;
        }
      }
    }
  }
  return this.dragElementMove ;
};
DnDSource.prototype.dragStart = function ( evt )
{
  this.dragStartLocationX = evt.getXOnPage() ;
  this.dragStartLocationY = evt.getYOnPage() ;
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].dragStart )
    {
      var transferable = this.listener[i].dragStart ( evt ) ;
      if ( typeof ( transferable ) == 'string' )
      {
        this.transferable = new StringTransferable ( transferable ) ;
        return true ;
      }
      else
      if ( transferable && typeof ( transferable ) == 'object' )
      {
        if ( transferable.jsClassName == "Transferable" )
        {
          this.transferable = transferable ;
          return true ;
        }
        else
        {
//          this.transferable = new ObjectTransferable ( transferable ) ;
        }
      }
    }
  }
  return false ;
};
DnDSource.prototype.dragEnter = function ( evt )
{
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].dragEnter )
    {
      this.listener[i].dragEnter ( evt ) ;
    }
  }
};
DnDSource.prototype.dragOver = function ( evt )
{
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].dragOver )
    {
      this.listener[i].dragOver ( evt ) ;
    }
  }
};
DnDSource.prototype.dragExit = function ( evt )
{
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].dragExit )
    {
      this.listener[i].dragExit ( evt ) ;
    }
  }
};
DnDSource.prototype.userActionChanged = function ( evt )
{
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].userActionChanged )
    {
      this.listener[i].userActionChanged ( evt ) ;
    }
  }
};
DnDSource.prototype.dragDropEnd = function ( evt )
{
  this.imagesByTheme = false ;
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].dragDropEnd )
    {
      this.listener[i].dragDropEnd ( evt ) ;
    }
  }
  if ( this.dragElementMove )
  {
    if ( ! evt.getDropSuccess() )
    {
      var x0 = this.dragStartLocationX ;
      var y0 = this.dragStartLocationY ;
      var x1 = evt.getXOnPage() ;
      var y1 = evt.getYOnPage() ;
      var n = 10 ;
      var dx = Math.floor ( Math.abs ( x1 - x0 ) / n ) ;
      var dy = Math.floor ( Math.abs ( y1 - y0 ) / n ) ;
      if ( x1 > x0 ) dx = - dx ;
      if ( y1 > y0 ) dy = - dy ;
      var e = this.dragElementMove ;
      this.dragElementMove = null ;
      var timer = new TTimer ( 50, function()
      {
        n-- ;
        if ( n <= 0 )
        {
          timer.stop() ;
          if ( e.parentNode )
          {
            e.stateIcon = null ;
            e.parentNode.removeChild ( e ) ;
          }
        }
        else
        {
          e.style.left = ( e.offsetLeft + dx ) + "px" ;
          e.style.top = ( e.offsetTop + dy ) + "px" ;
        }
      }) ;
      timer.start() ;
    }
    else
    {
      if ( this.dragElementMove.parentNode )
      {
        this.dragElementMove.stateIcon = null ;
        this.dragElementMove.parentNode.removeChild ( this.dragElementMove ) ;
      }
      this.dragElementMove = null ;
    }
  }
};
DnDSource.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  Dragger.removeDragSource ( this ) ;
  this.dom.dndSource = null ;
  this.dom = null ;
  this.id = null ;
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].flush ) this.listener[i].flush() ;
  }
  this.listener.length = 0 ;
};
DnDSource.prototype.addListener = function ( l )
{
  this.listener.push ( l ) ;
};
DnDSource.prototype.removeListener = function ( l )
{
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( l === this.listener[i] )
    {
      this.listener.splice ( i, 1 ) ;
      break ;
    }
  }
};

/**
 *  @constructor
 */
var DnDTarget = function ( id, listener )
{
    this.jsClassName = "DnDTarget" ;
    this._flushed = false ;
    this.dom = null ;
    this.id = null ;
    this.shape = null ;
    this.x = 0 ;
    this.y = 0 ;
    this.width = 0 ;
    this.height = 0 ;
    this._flushed = false ;
    this._parentWindow = undefined;

  if ( typeof ( id ) == 'string' )
  {
    this.id = id ;
    this.dom = document.getElementById ( id ) ;
  }
  else
  if ( id && typeof ( id ) == 'object' )
  {
    this.id = id.id ;
    this.dom = id ;
  }
  if ( ! this.dom ) return ;
  Dragger.addDropTarget ( this ) ;
  this.resized() ;
  this.dom.dndTarget = this ;
  this.listener = [] ;
  if ( typeof ( listener ) == 'string' )
  {
    listener = listener.trim() ;
    if ( listener )
    {
      if ( listener.charAt ( 0 ) == "{" && listener.charAt ( listener.length - 1 ) == "}" )
      {
        var l = TSys.eval ( listener ) ;
        if ( l )
        {
          this.addListener ( l ) ;
          if ( typeof ( l._initialize_ ) == 'function' )
          {
            l._initialize_() ;
          }
        }
      }
    }
  }
  else
  if ( listener && typeof ( listener ) == 'object' )
  {
    this.listener.push ( listener ) ;
  }
};
DnDTarget.prototype.getParentWindow = function()
{
  if ( this._parentWindow === undefined )
  {
    this._parentWindow = TWM.getWindow ( this.dom ) ;
  }
  return this._parentWindow ;
};
DnDTarget.prototype.resized = function()
{
  this.shape = TGui.getBoundsOnPageOf ( this.dom ) ;
  this.top = this.shape.y ;
  this.left = this.shape.x ;
  this.bottom = this.shape.y + this.shape.height ;
  this.right = this.shape.x + this.shape.width ;
};
DnDTarget.prototype.getElement = function()
{
  return this.dom ;
};
DnDTarget.prototype.dragEnter = function ( evt )
{
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].dragEnter )
    {
      this.listener[i].dragEnter ( evt ) ;
    }
  }
};
DnDTarget.prototype.dragOver = function ( evt )
{
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].dragOver )
    {
      this.listener[i].dragOver ( evt ) ;
    }
  }
};
DnDTarget.prototype.dragExit = function ( evt )
{
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].dragExit )
    {
      this.listener[i].dragExit ( evt ) ;
    }
  }
};
DnDTarget.prototype.userActionChanged = function ( evt )
{
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].userActionChanged )
    {
      this.listener[i].userActionChanged ( evt ) ;
    }
  }
};
DnDTarget.prototype.drop = function ( evt )
{
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].drop ) this.listener[i].drop ( evt ) ;
  }
};
DnDTarget.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  Dragger.removeDropTarget ( this ) ;
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( this.listener[i].flush ) this.listener[i].flush() ;
  }
  this.listener.length = 0 ;
};
DnDTarget.prototype.addListener = function ( l )
{
  this.listener.push ( l ) ;
};
DnDTarget.prototype.removeListener = function ( l )
{
  for ( var i = 0 ; i < this.listener.length ; i++ )
  {
    if ( l === this.listener[i] )
    {
      this.listener.splice ( i, 1 ) ;
      break ;
    }
  }
};
DraggerClass.prototype.dndStart = function ( event, dndSource )
{
  if ( this.dndSource ) return false ;
  if ( ! this.dragSourceEvent )
  {
    this.dragSourceEvent = new DragSourceEvent ( null, this ) ;
    this.dragSourceDropEvent = new DragSourceDropEvent ( null, this ) ;
    this.dragSourceStartEvent = new DragSourceStartEvent ( null, this ) ;
    this.dropTargetEvent = new DropTargetEvent ( null, this ) ;
    this.dropTargetDropEvent = new DropTargetDropEvent ( null, this ) ;
  }
//  this.disableUserSelect() ;

  this.dragInside = false ;
  var browserWindowSize = TGui.getBrowserWindowSize() ;
  this.dragArea = new Insets ( 0, 0, browserWindowSize.height, browserWindowSize.width ) ;

  this.userAction = 1 ;
  if ( this.pendingUserAction ) this.userAction = this.pendingUserAction ;
  this.initDnDDropStates() ;
  this.dragSourceEvent._setEvent ( event ) ;
  this.dragSourceStartEvent._setEvent ( event ) ;
  this.dragSourceDropEvent._setEvent ( event ) ;
  var componentElement = dndSource.getElement() ;
  var locOnPage = TGui.getLocationOnPageOf ( componentElement ) ;
  this.dragSourceEvent.mouseX = this.mouseX - locOnPage.x ;
  this.dragSourceEvent.mouseY = this.mouseY - locOnPage.y ;
  this.dragSourceEvent.mouseXOnPage = this.mouseX ;
  this.dragSourceEvent.mouseYOnPage = this.mouseY ;
  this.dragSourceStartEvent.mouseX = this.dragSourceEvent.mouseX ;
  this.dragSourceStartEvent.mouseY = this.dragSourceEvent.mouseY ;
  this.dragSourceStartEvent.mouseXOnPage = this.mouseX ;
  this.dragSourceStartEvent.mouseYOnPage = this.mouseY ;
  this.dragSourceDropEvent.mouseX = this.dragSourceEvent.mouseX ;
  this.dragSourceDropEvent.mouseY = this.dragSourceEvent.mouseY ;
  this.dragSourceDropEvent.mouseXOnPage = this.mouseX ;
  this.dragSourceDropEvent.mouseYOnPage = this.mouseY ;

  this.resizeWindow = null ;
  this.dragSplitbar = null ;
  this.mouseOffsetX = 0 ;
  this.mouseOffsetY = 0 ;
  this.dndCurrentDropTarget = null ;
/*
  this.dragPending = true ;
  this.dragWatermarkPixel = 5 ;
*/
  this.dragStartX = this.mouseX ;
  this.dragStartY = this.mouseY ;

  this.dndSource = dndSource ;

  this.dndDragStartPending = true ;
  this.active = true ;
};
DraggerClass.prototype._dndMove = function ( event )
{
  var x = this.mouseX -  this.mouseOffsetX ;
  if ( this.dragInside )
  {
    if ( x >= this.dragArea.left && x + this.dragElement.offsetWidth < this.dragArea.right )
    {
      this.dragElement.style.left = x + "px" ;
    }
    var y  = this.mouseY - this.mouseOffsetY ;
    if ( y >= this.dragArea.top && y + this.dragElement.offsetHeight < this.dragArea.bottom )
    {
      this.dragElement.style.top  = y + "px" ;
    }
  }
  else
  {
    if ( this.mouseX >= this.dragArea.left && this.mouseX < this.dragArea.right )
    {
      this.dragElement.style.left = x + "px" ;
    }
    var y  = this.mouseY - this.mouseOffsetY ;
    if ( this.mouseY >= this.dragArea.top && this.mouseY < this.dragArea.bottom )
    {
      this.dragElement.style.top  = y + "px" ;
    }
  }
  var foundTarget = null ;
  var windowFromPosition = TWM.getWindowFromPosition ( this.mouseX, this.mouseY ) ;
  for ( var i = 0 ; i < this.dndDropTargets.length ; i++ )
  {
    var tgt = this.dndDropTargets[i] ;
    if ( ! tgt.visibleOnScreen ) continue ;
    if ( this.mouseX < tgt.left ) continue ;
    if ( this.mouseX > tgt.right ) continue ;
    if ( this.mouseY < tgt.top ) continue ;
    if ( this.mouseY > tgt.bottom ) continue ;
    var parentWindow = tgt.getParentWindow() ;
    if ( windowFromPosition && windowFromPosition != parentWindow ) continue ;
    this.dropTargetEvent._setEvent ( event ) ;
    this.dropTargetEvent.mouseX = this.mouseX - tgt.left ;
    this.dropTargetEvent.mouseY = this.mouseY - tgt.top ;
    this.dropTargetEvent.mouseXOnPage = this.mouseX ;
    this.dropTargetEvent.mouseYOnPage = this.mouseY ;
    foundTarget = tgt ;
    break ;
  }
  this.dragSourceEvent.mouseXOnPage = this.mouseX ;
  this.dragSourceEvent.mouseYOnPage = this.mouseY ;
  if ( ! foundTarget && this.dndCurrentDropTarget )
  {
    this.dndCurrentDropTarget.dragExit ( this.dropTargetEvent ) ;
    this.dndSource.dragExit ( this.dragSourceEvent ) ;
    this.dndCurrentDropTarget = null ;
    this.initDnDDragStates() ;
    this.getDragObject ( this.userAction ) ;
  }
  else
  if ( foundTarget )
  {
    if ( foundTarget === this.dndCurrentDropTarget )
    {
      this.dndCurrentDropTarget.dragOver ( this.dropTargetEvent ) ;
      this.dndSource.dragOver ( this.dragSourceEvent ) ;
    }
    else
    {
      if ( this.dndCurrentDropTarget )
      {
        this.getDragObject ( this.userAction ) ;
        this.dndCurrentDropTarget.dragExit ( this.dropTargetEvent ) ;
        this.dndSource.dragExit ( this.dragSourceEvent ) ;
      }
      this.dndCurrentDropTarget = foundTarget ;
      this.initDnDDragStates() ;
      this.dndCurrentDropTarget.dragEnter ( this.dropTargetEvent ) ;
//          this.getDragObject ( this.userAction ) ;
      this.dndSource.dragEnter ( this.dragSourceEvent ) ;
    }
  }
};
