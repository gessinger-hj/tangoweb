MaxiMenu = function ( param )
{
  this.getAxlCallback = param.getAxlCallback ;
  this.target = param.target ;
  if ( param.useTimer && this.getAxlCallback )
  {
    this.timer = new TTimer ( 700, function(t)
    {
      t.thiz.getAxlCallback.apply ( t.thiz, [ t.thiz ] ) ;
      t.thiz._create() ;
      t.thiz._show() ;
    }) ;
    this.timer.thiz = this ;
    this.timer.setRepeats ( false ) ;
  }
  this._mouseDownAutoClose = new TFunctionExecutor ( this, this.mouseDownAutoClose ) ;
  TGlobalEventHandler.addOnMouseDown ( this._mouseDownAutoClose ) ;
  this._keyDownAutoClose = new TFunctionExecutor ( this, this.keyDownAutoClose ) ;
  TGlobalEventHandler.addOnKeyDown ( this._keyDownAutoClose ) ;
  this._eventMulticaster = null ;
  this.last_show_millis = 0 ;
};
MaxiMenu.prototype.addEventListener = function ( obj, method, type )
{
  if ( ! this._eventMulticaster ) this._eventMulticaster = new EventMulticaster() ;
  this._eventMulticaster.add ( obj, method, type ) ;
};
MaxiMenu.prototype.toString = function()
{
  return "(MaxiMenu)" ;
} ;
MaxiMenu.prototype.stop = function()
{
  if( this.timer ) this.timer.stop() ;
};
MaxiMenu.prototype.start = function()
{
  if( this.timer ) this.timer.start() ;
};
MaxiMenu.prototype.keyDownAutoClose = function ( event )
{
  if ( ! this.me ) return true ;
  var ev = new TEvent ( event ) ;
  if ( !ev.isEscape() ) return true ;
  ev.consume() ;
  this.remove() ;
  return true ;
} ;
MaxiMenu.prototype.mouseDownAutoClose = function ( event )
{
  this.stop() ;
  if ( !this.me ) return true ;
  if ( this.inside ( event ) ) return true ;
  this.remove() ;
  return true ;
} ;
MaxiMenu.prototype.isOpen = function()
{
  return this.me !== null && this.mec.isVisible() ;
} ;
MaxiMenu.prototype.remove = function ( event )
{
  this.stop() ;
  if ( ! this.me ) return ;
  TGui.flushAttributes ( this.me, true ) ;
  this.me.parentNode.removeChild ( this.me ) ;
  this.me = null ;
  this.mec = null ;
  if ( this._eventMulticaster ) this._eventMulticaster.fireEvent ( "remove" ) ;
} ;
MaxiMenu.prototype.setAxl = function ( axl )
{
  this.axl = axl ;
} ;
MaxiMenu.prototype.setLocation = function ( x, y )
{
  if ( typeof ( x ) == "number" && typeof ( y ) == "number" )
  {
    this.location = new TPoint ( x, y ) ;
  }
  else
  if ( x && ( x instanceof TPoint ) )
  {
    this.location = x ;
  }
  else
  {
    return ;
  }
  if ( this.mec ) this.mec.setLocation ( this.location ) ;
} ;
MaxiMenu.prototype.setResizable = function ( state )
{
  this._resizable = !! state ;
} ;
MaxiMenu.prototype.show = function ( event )
{
  if ( this.timer )
  {
    var dt = new Date().getTime() - this.last_show_millis ;
    if ( dt > 300 && dt < 1000 )
    {
      this.getAxlCallback.apply ( this, [ this ] ) ;
      this._create() ;
      this._show() ;
    }
    else
    {
      this.start() ;
    }
  }
  else
  {
    if ( event )
    {
      var ev = new TEvent ( event ) ;
      ev.consume() ;
    }
    if ( !this._created )
    {
      if ( this.getAxlCallback ) this.getAxlCallback.apply ( this, [ this ] ) ;
      this._create() ;
    }
    this._show() ;
  }
} ;
MaxiMenu.prototype.create = function()
{
  this._create() ;
} ;
MaxiMenu.prototype._create = function()
{
  this._created = true ;
  this.last_show_millis = new Date().getTime() ;
  var txml = Tango.getThemeXml ( "Menu", "normal" ) ;
  var ins = txml.getInsets() ;
  var pad = txml.getPadding() ;
  if ( ! pad.top ) pad.top = ins.top + 2 ;
  if ( ! pad.left ) pad.left = ins.left + 2 ;
  if ( ! pad.bottom ) pad.bottom = ins.bottom + 2 ;
  if ( ! pad.right ) pad.right = ins.right + 2 ;

  var bounds_target = TGui.getBoundsOnPageOf ( this.target ) ;

  var deco="{ src: \"theme:Menu/normal\", type:\"sliced\""
          + ", border: { top:"+ins.top+", left:"+ins.left+", bottom:"+ins.bottom+", right:"+ins.right+" }"
          + ", padding: { top:"+pad.top+", left:"+pad.left+", bottom:"+pad.bottom+", right:"+pad.right+" } }" ;
  var xCont = this.axl.get ( "Container" ) ;
  xCont.addAttribute ( "decoration", deco ) ;
  xCont.addAttribute ( "style"
		                 , "top:" + this.location.y + "px;"
  	                 + "left:" + ( this.location.x - bounds_target.x ) + "px;"
  	                 + "visibility:hidden;"
  	                 ) ;

  this.me = TGui.createElement ( this.axl, this.target ) ;
  this.target.appendChild ( this.me ) ;

  this.mec = new TContainer ( this.me ) ;
  this.mec.addEventListener ( "mouseout", this, this.mouseout ) ;

  if ( this._resizable )
  {
    var eResizeGripper = TGui.createElement ( "<img src='' onmousedown='return false;' />" ) ;
    this.me.appendChild ( eResizeGripper ) ;
    eResizeGripper.style.width = 11 + "px" ; // TODO
    eResizeGripper.style.height = 11  + "px";
    eResizeGripper.style.position = "absolute";
    eResizeGripper.xConstraints = new TConstraints() ;
    eResizeGripper.xConstraints.parseRight ( "0" ) ;
    eResizeGripper.xConstraints.parseBottom ( "0" ) ;
    eResizeGripper.src = TGui.buildThemeImageUrl ( "Misc", "resize-gripper" ) ;
    eResizeGripper.style.cursor = "se-resize" ;
    eResizeGripper.style.left = ( this.me.offsetWidth - eResizeGripper.offsetWidth ) + "px" ;
    eResizeGripper.style.top = ( this.me.offsetHeight - eResizeGripper.offsetHeight ) + "px" ;
    TGui.addEventListener ( eResizeGripper, "mousedown", this.startResize.bindAsEventListener ( this ) ) ;
    var mw = this.me.offsetWidth ;
    var mh = this.me.offsetHeight ;
    this.mec.getMinimumWidth = function() { return mw ; } ;
    this.mec.getMinimumHeight = function() { return mh ; } ;
  }
} ;
MaxiMenu.prototype.startResize = function ( event )
{
  Dragger.startResizeComponent ( event, this.mec, Dragger.SE_RESIZE ) ;
} ;
MaxiMenu.prototype._show = function ( event )
{
  var bounds_target = TGui.getBoundsOnPageOf ( this.target ) ;
  this._created = false ;
  var bounds_me = this.mec.getBounds() ;
  if ( bounds_me.y + bounds_me.height > bounds_target.height )
  {
    this.me.style.top = ( bounds_target.height - bounds_me.height ) + "px" ;
  }
  if ( bounds_me.x + bounds_me.width > bounds_target.width )
  {
    this.me.style.left = ( bounds_target.width - bounds_me.width ) + "px" ;
  }
  if ( bounds_me.x < 0 )
  {
    this.me.style.left = "0px" ;
  }
  this.me.style.visibility = "inherit" ;
  var fe = this.mec.findFirstFocusableElement() ;
  if ( fe ) fe.focus() ;
} ;
MaxiMenu.prototype.inside = function ( event )
{
  if ( ! this.mec ) return false ;
  var b = this.mec.inside ( event ) ;
  if ( b ) return b ;
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  var body = document ;
  for ( var ch = src ; ch ; ch = ch.parentNode )
  {
    if ( ch.xClassName === "TCalendar" ) return true ; // TODO
    if ( ch.nodeName.toUpperCase() == "BODY" ) return false ;
    if ( ch === this.me ) return true ;
  }
  return false ;
} ;
MaxiMenu.prototype.mouseout = function ( event )
{
  if ( this.inside ( event ) ) return ;
  if ( ! this._eventMulticaster ) return ;
  this._eventMulticaster.fireEvent ( event, "mouseout" ) ;
} ;
MaxiMenu.prototype.setValues = function ( xml )
{
  if ( ! this.mec ) return ;
  this.mec.setValues ( xml ) ;
} ;
MaxiMenu.prototype.getValues = function ( xml )
{
  if ( ! this.mec ) return xml ;
  return this.mec.setValues ( xml ) ;
} ;
MaxiMenu.prototype.getContainer = function()
{
  return this.mec ;
} ;
