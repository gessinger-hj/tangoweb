/**
 *  @constructor
 *  @param {string|dom} id the id of an html element or
 *         the html dom element itself.
 */
var TComponent = function ( id )
{
  this.jsClassName = "TComponent" ;
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
  this.xPeerIsComponent = true ;
  if ( ! this.dom ) return ;
  if ( typeof ( this.dom.style ) != 'undefined' ) this.dom.oldCursor = this.dom.style.cursor ;
} ;
TComponent.prototype.toString = function()
{
  if ( !this.dom )
  {
    return "(" + this.jsClassName + ")[this.dom=null]" ;
  }
  var dim = this.getBounds() ;
  var ptop = TGui.getComputedStyle ( this.dom, "padding-top" ) ;
  var pleft = TGui.getComputedStyle ( this.dom, "padding-left" ) ;
  var pbottom = TGui.getComputedStyle ( this.dom, "padding-bottom" ) ;
  var pright = TGui.getComputedStyle ( this.dom, "padding-right" ) ;
  var mtop = TGui.getComputedStyle ( this.dom, "margin-top" ) ;
  var mleft = TGui.getComputedStyle ( this.dom, "margin-left" ) ;
  var mbottom = TGui.getComputedStyle ( this.dom, "margin-bottom" ) ;
  var mright = TGui.getComputedStyle ( this.dom, "margin-right" ) ;

  var str1 = "" ;
  var str2 = "" ;
  if ( ptop )
  {
    str1 = "padding:top=" + ptop + ",left=" + pleft + ",bottom=" + pbottom + ",right=" + pright ;
  }
  if ( mtop )
  {
    str2 = "margin:top=" + mtop + ",left=" + mleft + ",bottom=" + mbottom + ",right=" + mright ;
  }
  return "(" + this.jsClassName + ")"
       + "[name=" + this.getName() + ",x=" + dim.x + ",y=" + dim.y + ",width=" + dim.width + ",height=" + dim.height
       + ",enabled=" + !this.dom.disabled
       + ",nodeName=" + this.dom.tagName
       + ( this.dom.style ? ",visible=" + ( this.dom.style.visibility != 'hidden' ) : "" )
       + ( this.dom.xClassName ? ",xClassName=" + this.dom.xClassName : "" )
       + ( this.dom.className ? ",className=" + this.dom.className : "" )
       + ( this.dom.id ? ",id=" + this.dom.id : "" )
       + ( this.dom.path ? ",path=" + this.dom.path : "" )
       + ( this.dom.getValue ? ",getValue=" + this.dom.getValue : "" )
       + ( str1 ? "\n" + str1 : "" )
       + ( str2 ? "\n" + str2 : "" )
       + "]"
       ;
} ;
TComponent.prototype.getLocale = function()
{
  if ( this.dom && this.dom.xLocale ) return this.dom.xLocale ;
  return TSys.getLocale ( this.dom ) ;
} ;
TComponent.prototype.setLocale = function ( locale )
{
  if ( ! this.dom ) return ;
  this.dom.xLocale = locale ;
  TGui.addToBeFlushed ( this.dom, locale ) ;
} ;
TComponent.prototype.setAllInputEnabled = function ( state )
{
  TGui.setAllInputEnabled ( this.dom, state ) ;
} ;
TComponent.prototype.getExtendedProperty = function ( name, def )
{
  if ( ! this.dom ) return def ;
  var rc = def ;
  if ( this.dom.xProperties )
  {
    rc = this.dom.xProperties[name] ;
    if ( typeof ( rc ) == 'undefined' ) rc = def ;
  }
  return rc ;
};
/**
 *  @param {float} opacity.
 *  <br/>Constraints: 0 < opacity <= 1.0 or 0 < opacity <= 100
 */
TComponent.prototype.setOpacity = function ( opacity )
{
  if ( ! this.dom ) return ;
  TGui.setOpacity ( this.dom, opacity ) ;
};
/**
 *  Get the parent node as appropriate component
 */
TComponent.prototype.getParent = function()
{
  if ( ! this.dom ) return ;
  return TGui.getComponent ( this.dom.parentNode ) ;
};
/**
 *  @return {boolean} wether the dom element is valid
 */
TComponent.prototype.isValid = function() { return this.dom ? true : false ; };
/**
 *  @return {string} the id of the wrapped html dom element
 */
TComponent.prototype.getId = function() { return this.id ; };
TComponent.prototype.setId = function ( id ) { if ( id ) this.id = id ; };
/**
 *  @return {boolean} the enabled state
 */
TComponent.prototype.isEnabled = function() { return this.dom ? ! this.dom.disabled : false ; };
/**
 *  @return {boolean} the readOnly state
 */
TComponent.prototype.isReadOnly = function() { return this.dom ? ! this.dom.readOnly : false ; };
/**
 *  @return {object} the wrapped html dom element 
 */
TComponent.prototype.getDom = function() { return this.dom ; };
/**
 *  @return {string}[empty string] the name of the wrapped html dom element
 */
TComponent.prototype.getName = function() { return this.dom ? ( this.dom.name ? this.dom.name : "" ) : "" ; };
/**
 *  @return {string}[empty string] the path of the wrapped html dom element
 */
TComponent.prototype.getPath = function() { return this.dom ? ( this.dom.path ? this.dom.path : "" ) : "" ; };
/**
 *  @return {string}[empty string] the name of the wrapped html dom element
 */
TComponent.prototype.setName = function ( name ) { if ( this.dom ) this.dom.name = name ; return this ; };
/**
 *  @param {string} the new className attribute of the wrapped html dom element
 */
TComponent.prototype.setClassName = function(className) { if ( this.dom ) this.dom.className = className ; return this ; };
/**
 *  @return {string}[empty string] the className attribute of the wrapped html dom element
 */
TComponent.prototype.getClassName = function() { return this.dom ? ( this.dom.className ? this.dom.className : "" ) : "" ; };
/**
 *  @return {string} the JavaScript class-name of of the wrapped html dom element ( xClassName )
 */
TComponent.prototype.getJSClassName = function() { return this.jsClassName ; };
/**
 *  @return {string}[empty string] the extended class-name 
 */
TComponent.prototype.getXClassName = function() { return this.dom ? ( this.dom.xClassName ? this.dom.xClassName : "" ) : "" ; };

/**
 *  @param {int|TPoint|event} x
 *  @param {int} [y]
 *  @return {boolean} true if inside or on border, else false
 */
TComponent.prototype.contains = function ( x, y )
{
  if ( ! this.dom ) return false ;
  var r = this.getBoundsOnPage() ;
  return r.contains ( x, y ) ;
};
/**
 *  @param {int|TPoint|event} x
 *  @param {int} [y]
 *  @return {boolean} true if inside, border excluded, else false
 */
TComponent.prototype.inside = function ( x, y )
{
  if ( ! this.dom ) return false ;
  var r = this.getBoundsOnPage() ;
  return r.inside ( x, y ) ;
};
/**
 *  @return {int} the width
 */
TComponent.prototype.getWidth = function()
{
  if ( ! this.dom ) return 0 ;
  if ( this.dom.offsetWidth ) return this.dom.offsetWidth ;
  return TGui.getComputedStyleInt ( this.dom, "width" ) ;
};
/**
 *  @return {int} the height
 */
TComponent.prototype.getHeight = function()
{
  if ( ! this.dom ) return 0 ;
  if ( this.dom.offsetHeight ) return this.dom.offsetHeight ;
  return TGui.getComputedStyleInt ( this.dom, "height" ) ;
};
/**
 *  @return {TDimension} the size
 */
TComponent.prototype.getSize = function()
{
  if ( ! this.dom ) return new TDimension() ;
  return new TDimension ( this.getWidth(), this.getHeight() ) ;
};
/**
 *  @return {TDimension} the inner size
 */
TComponent.prototype.getInnerSize = function()
{
  if ( ! this.dom ) return new TDimension() ;
  var h = this.dom.offsetHeight
        - TGui.getComputedStyleInt ( this.dom, "border-top-width", 0 )
        - TGui.getComputedStyleInt ( this.dom, "padding-top", 0 )
        - TGui.getComputedStyleInt ( this.dom, "padding-bottom", 0 )
        - TGui.getComputedStyleInt ( this.dom, "border-bottom-width", 0 )
        ;
  var w = this.dom.offsetWidth
        - TGui.getComputedStyleInt ( this.dom, "border-left-width", 0 )
        - TGui.getComputedStyleInt ( this.dom, "padding-left", 0 )
        - TGui.getComputedStyleInt ( this.dom, "padding-right", 0 )
        - TGui.getComputedStyleInt ( this.dom, "border-right-width", 0 )
        ;
  return new TDimension ( w, h ) ;
};
/**
 *  @return {TPoint} the location
 */
TComponent.prototype.getLocation = function()
{
  if ( ! this.dom ) return new TPoint() ;
  return new TPoint ( this.dom.offsetLeft, this.dom.offsetTop ) ;
};
/**
 *  @return {TPoint} the location on page
 */
TComponent.prototype.getLocationOnPage = function()
{
  if ( ! this.dom ) return new TPoint() ;
  return new TPoint ( TGui.getPageOffsetLeft ( this.dom )
                    , TGui.getPageOffsetTop ( this.dom )
                    ) ;
};
/**
 *  @param {int|TPoint} x
 *  @param {int} [y]
 */
TComponent.prototype.setLocation = function ( x, y )
{
  if ( x && typeof ( x ) == 'object' && x.jsClassName == 'TPoint' )
  {
    this.dom.style.left = x.x + "px" ;
    this.dom.style.top = x.y + "px" ;
  }
  else
  {
    if ( typeof ( x ) == 'number' ) this.dom.style.left = x + "px" ;
    if ( typeof ( y ) == 'number' ) this.dom.style.top = y + "px" ;
  }
};
/**
 *  @return {TRectangle} the bounds
 */
TComponent.prototype.getBounds = function()
{
  if ( ! this.dom ) return new TRectangle() ;
  return new TRectangle ( this.dom.offsetLeft, this.dom.offsetTop, this.getWidth(), this.getHeight() ) ;
};
/**
 *  @return {TRectangle} the bounds on page
 */
TComponent.prototype.getBoundsOnPage = function()
{
  if ( ! this.dom ) return new TRectangle() ;
  return new TRectangle ( TGui.getPageOffsetLeft ( this.dom )
                        , TGui.getPageOffsetTop ( this.dom )
                        , this.dom.offsetWidth
                        , this.dom.offsetHeight
                        ) ;
};
/**
 *  @param {int|TRectangle} x
 *  @param {int} [y]
 *  @param {int} [width]
 *  @param {int} [height]
 */
TComponent.prototype.setBounds = function ( x, y, width, height )
{
  if ( typeof ( x ) == 'object' && x.jsClassName == 'TRectangle' )
  {
    this.setLocation ( x.x, x.y ) ;
    this.setSize ( x.width, x.height ) ;
  }
  else
  {
    this.setLocation ( x, y ) ;
    this.setSize ( width, height ) ;
  }
};
/**
 *  @param {int|TDimension} width
 *  @param {int} [height]
 */
TComponent.prototype.setSize = function ( width, height )
{
  var taraHeight = TGui.getComputedStyleInt ( this.dom, "padding-top", 0 )
                 + TGui.getComputedStyleInt ( this.dom, "padding-bottom", 0 )
                 + TGui.getComputedStyleInt ( this.dom, "border-top-width", 0 )
                 + TGui.getComputedStyleInt ( this.dom, "border-bottom-width", 0 )
                 ;
  var taraWidth = TGui.getComputedStyleInt ( this.dom, "padding-left", 0 )
                + TGui.getComputedStyleInt ( this.dom, "padding-right", 0 )
                + TGui.getComputedStyleInt ( this.dom, "border-left-width", 0 )
                + TGui.getComputedStyleInt ( this.dom, "border-right-width", 0 )
                ;

  if ( typeof ( width ) == 'object' && width.jsClassName == 'TDimension' )
  {
    this.dom.style.width  = ( width.width - taraWidth ) + "px" ;
    this.dom.style.height = ( width.height - taraHeight ) + "px" ;
  }
  else
  if ( typeof ( width ) == 'object' && width && width.jsClassName == 'TRectangle' )
  {
    this.dom.style.width  = ( width.width - taraWidth ) + "px" ;
    this.dom.style.height = ( width.height - taraHeight ) + "px" ;
  }
  else
  {
    this.dom.style.width  = ( width - taraWidth ) + "px" ;
    this.dom.style.height = ( height - taraHeight ) + "px" ;
  }
};
/**
 *  Sets the mandatory decoration if possible
 *  @param {boolean} state
 */
TComponent.prototype.setMandatory = function ( state )
{
  if ( ! this.dom ) return ;
  this.dom.mandatory = state ;
  TGui.setMandatoryDecoration ( this.dom ) ;
  var xDom = new TXml ( this.dom ) ;
  var lc = xDom.getListenerContextUp() ;
  if ( ! lc ) return ;
  lc.changed() ;
};
/**
 *  @param {boolean} state
 */
TComponent.prototype.setEditable = function ( state )
{
  if ( ! this.dom ) return ;
  var nstate = state ? true : false ;
  nstate = ! nstate ;
  if ( this.dom.readOnly == nstate ) return ;
  this.dom.readOnly = nstate ;
  if ( this.dom.jsPeer && this.dom.jsPeer.setEditable )
  {
    this.dom.jsPeer.setEditable ( state ? true : false ) ;
    return ;
  }
  if ( this.dom.xClassName == "Date" || this.dom.xClassName == "DateTime" )
  {
    this.dom.hDay.disabled = nstate ;
    this.dom.hMonth.disabled = nstate ;
    this.dom.hYear.disabled = nstate ;
    if ( this.dom.hHour ) this.dom.hHour.disabled = nstate ;
    if ( this.dom.hMinute ) this.dom.hMinute.disabled = nstate ;
    if ( this.dom.hSecond ) this.dom.hSecond.disabled = nstate ;
    if ( this.dom.hIcon ) this.dom.hIcon.disabled = nstate ;
  }
};
/**
 *  @param {boolean} state
 */
TComponent.prototype.setEnabled = function ( state )
{
  if ( ! this.dom ) return ;
  if ( typeof ( state ) == 'string' )
  {
    if ( state == "true" ) state = true ;
    else
    if ( state == "false" ) state = false ;
    else                    state = false ;
  }
  var st = state ? true : false ;
  st = ! st ;
  if ( this.dom.disabled == st ) return ;
  this.dom.disabled = st ;
  if ( this.dom.jsPeer && this.dom.jsPeer.setEnabled )
  {
    this.dom.jsPeer.setEnabled ( state ? true : false ) ;
    return ;
  }
  if ( this.dom.xClassName == "Date" || this.dom.xClassName == "DateTime" )
  {
    this.dom.hDay.disabled = this.dom.disabled ;
    this.dom.hMonth.disabled = this.dom.disabled ;
    this.dom.hYear.disabled = this.dom.disabled ;
    if ( this.dom.hHour ) this.dom.hHour.disabled = this.dom.disabled ;
    if ( this.dom.hMinute ) this.dom.hMinute.disabled = this.dom.disabled ;
    if ( this.dom.hSecond ) this.dom.hSecond.disabled = this.dom.disabled ;
    if ( this.dom.hIcon )
    {
      this.dom.hIcon.disabled = this.dom.disabled ;
      if ( this.dom.hIcon.disabled )
      {
        this.dom.hIcon.style.cursor = "default" ;
        this.dom.hIcon.style.visibility = "hidden" ;
      }
      else
      {
        this.dom.hIcon.style.cursor = "pointer" ;
        this.dom.hIcon.style.visibility = "inherit" ;
      }
    }
    return ;
  }
};
/**
 *  @param {boolean} state
 *  @param {string} [className]
 */
TComponent.prototype.setReadOnly = function ( state, className )
{
  if ( ! this.dom ) return ;
  state = state ? true : false ;
  this.dom.readOnly = state ;
  if ( className ) this.dom.className = className ;
  else
  {
    if ( this.dom.xClassName == 'TextField' )
    {
      if ( state )
      {
        if ( ! this.dom.orgClassName ) this.dom.orgClassName = this.dom.className ;
        this.dom.className = "ThemeTextFieldDisabled" ;
      }
      else
      {
        if ( this.dom.orgClassName ) this.dom.className = this.dom.orgClassName ;
	else                         this.dom.className = "ThemeTextField" ;
      }
    }
  }
};
/**
 *  @param {boolean} state
 */
TComponent.prototype.setVisible = function ( state )
{
  if ( ! this.dom ) return ;
  var visibility = state ? "inherit" : "hidden" ;
  if ( this.dom.isDecoratorPart == "child" )
  {
    this.dom.parentNode.style.visibility = visibility ;
  }
  else
  {
    this.dom.style.visibility = visibility ;
  }
};
/**
 *  @return {boolean} visibility
 */
TComponent.prototype.isVisible = function()
{
  if ( ! this.dom ) return false ;
  var dom = this.dom ;
  if ( this.dom.isDecoratorPart == "child" ) dom = this.dom.parentNode ;
  if ( dom.style.visibility == 'hidden' ) return false ;
  if ( dom.style.visibility == 'inherit' ) return true ;
  return true ;
};
TComponent.prototype.addEventListener = function ( eventType, listenerObject, listenerFunction )
{
  if ( ! this.dom ) return ;
  if ( typeof ( eventType ) == 'string' )
  {
    if ( typeof ( listenerObject ) == 'function' )
      TGui.addEventListener ( this.dom, eventType, listenerObject ) ;
    else
      TGui.addEventListener ( this.dom, eventType, listenerFunction.bindAsEventListener ( listenerObject ) ) ;
  }
  else
  if ( eventType && typeof ( eventType ) == 'object' )
  {
    var o = eventType ;
    if ( typeof ( o.mousedown ) == 'function' )
      TGui.addEventListener ( this.dom, "mousedown", o.mousedown.bindAsEventListener ( o ) ) ;
    if ( typeof ( o.mouseup ) == 'function' )
      TGui.addEventListener ( this.dom, "mouseup", o.mouseup.bindAsEventListener ( o ) ) ;
    if ( typeof ( o.mouseover ) == 'function' )
      TGui.addEventListener ( this.dom, "mouseover", o.mouseover.bindAsEventListener ( o ) ) ;
    if ( typeof ( o.mouseout ) == 'function' )
      TGui.addEventListener ( this.dom, "mouseout", o.mouseout.bindAsEventListener ( o ) ) ;
    if ( typeof ( o.mousemove ) == 'function' )
      TGui.addEventListener ( this.dom, "mousemove", o.mousemove.bindAsEventListener ( o ) ) ;
    if ( typeof ( o.click ) == 'function' )
      TGui.addEventListener ( this.dom, "click", o.click.bindAsEventListener ( o ) ) ;
    if ( typeof ( o.dblclick ) == 'function' )
      TGui.addEventListener ( this.dom, "dblclick", o.dblclick.bindAsEventListener ( o ) ) ;
  }
};
TComponent.prototype.addClickListener = function ( listenerObject, listenerFunction, eventType )
{
  if ( ! this.dom ) return ;
  if ( ! eventType ) eventType = "click" ;
  TGui.addEventListener ( this.dom, eventType, listenerFunction.bindAsEventListener ( listenerObject ) ) ;
};
TComponent.prototype.getComponent = function ( idOrName )
{
  if ( ! this.dom ) return null  ;
  if ( typeof ( idOrName ) != "string" )
  {
    throw "TContainer.getComponent(): Missing or invalid id: " + idOrName ;
  }
  var x = new TXml ( this.dom ) ;
  return TGui.getComponent ( x.getDomByIdOrName ( idOrName ) ) ;
};
TComponent.prototype.getComponentsByName = function ( name, callback )
{
  if ( ! this.dom ) return []  ;
  if ( typeof ( name ) != "string" )
  {
    throw "TComponent.getComponentsByName(): Missing or invalid name: " + name ;
  }
  var list = [] ;
  this._getComponentsByName ( this.dom, list, name, callback ) ;
  return list ;
};
TComponent.prototype._getComponentsByName = function ( dom, list, name, callback )
{
  var rc ;
  for ( var ch = dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.name == name )
    {
      if ( callback )
      {
        rc = callback ( TGui.getComponent ( ch ) ) ;
        if ( rc === false ) return false ;
      }
      else
      {
        list.push ( TGui.getComponent ( ch ) ) ;
      }
    }
    if ( ch.firstChild )
    {
      rc = this._getComponentsByName ( ch, list, name, callback ) ;
      if ( rc === false ) return false ;
    }
  }
};
TComponent.prototype.setColor = function ( color )
{
  if ( ! this.dom ) return ;
	this.dom.style.color = color ;
} ;
TComponent.prototype.setColor = function ( color )
{
  if ( ! this.dom ) return "" ;
	return this.dom.style.color ;
} ;
TComponent.prototype.getBackgroundColor = function()
{
  if ( ! this.dom ) return "" ;
	return this.dom.style.backgroundColor ;
} ;
TComponent.prototype.setBackgroundColor = function ( color )
{
  if ( ! this.dom ) return ;
	this.dom.style.backgroundColor = color ;
} ;
TComponent.prototype.append = function ( elementOrString )
{
  var el = null ;
  if ( ! elementOrString ) throw "TComponent.append(elementOrString): Missing elementOrString." ;
  if ( ! this.dom ) return el ;
  if ( typeof ( elementOrString ) === 'string' )
  {
    el = TGui.createElement ( elementOrString ) ;
  }
  else
  if ( typeof ( elementOrString.nodeType ) == 'number' && elementOrString.nodeName )
  {
    el = elementOrString ;
  }
  this.dom.appendChild ( el ) ;
  return this ;
} ;
TComponent.prototype.removeChildren = function()
{
  if ( ! this.dom ) return ;
  while ( this.dom.firstChild )
  {
    this.dom.removeChild ( this.dom.firstChild ) ;
  }
  return this ;
};
TComponent.prototype.findFirstChildElement = function ( nodeName )
{
  var ch = this.dom.firstChild ;
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType == DOM_ELEMENT_NODE )
    {
      if ( nodeName )
      {
        if ( nodeName === ch.nodeName ) return ch ;
      }
      else
      {
        return ch ;
      }
    }
  }
};
TComponent.prototype.layoutConstraints = function()
{
  if ( ! this.dom )
  {
    return ;
  }
  TGui.layoutConstraints ( this.dom ) ;
};

/**
 *  @constructor
 *  @extends TComponent
 *  @param {string|dom} id the id of an html element or
 *         the html dom element itself.
 */
var TContainer = function ( id )
{
  Tango.initSuper( this, TComponent, id );
  this.jsClassName = "TContainer" ;
} ;
TContainer.inherits( TComponent ) ;
TContainer.prototype.setSize = function ( width, height )
{
  this._super_.setSize.apply ( this, arguments ) ;
  if ( ! this.dom ) return ;
  if ( ! this.dom.firstChild ) return ;
  TGui.layoutConstraints ( this.dom ) ;
};
TContainer.prototype.layout = function()
{
  TGui.layoutConstraints ( this.dom ) ;
};
TContainer.prototype.scrollToTop = function()
{
  if ( ! this.dom ) return ;
  this.dom.scrollTop = 0 ;
};
TContainer.prototype.scrollToBottom = function()
{
  if ( ! this.dom ) return ;
  var h = 0 ;
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    h += ch.offsetHeight ;
  }
  this.dom.scrollTop = 100000 ;
};
TContainer.prototype.getValues = function ( xml )
{
  if ( ! this.dom ) return new TXml() ;
  return new TXml ( this.dom ).getValues ( xml ) ;
};
TContainer.prototype.setRefData = function ( xml )
{ 
  if ( ! this.dom ) return ;
  new TXml ( this.dom ).setRefData ( xml ) ;
};
TContainer.prototype.setValues = function ( xml )
{ 
  if ( ! this.dom ) return ;
  new TXml ( this.dom ).setValues ( xml ) ;
};
TContainer.prototype.isMandatoryOk = function()
{
  if ( ! this.dom ) return true ;
  return new TXml ( this.dom ).isMandatoryOk() ;
};
TContainer.prototype.resetChanged = function()
{
  if ( ! this.dom ) return ;
  var xDom = new TXml ( this.dom ) ;
  var lc = xDom.getListenerContext() ;
  if ( lc ) lc.reset() ;
};
TContainer.prototype.reset = function()
{
  if ( ! this.dom ) return ;
  var xDom = new TXml ( this.dom ) ;
  var lc = xDom.getListenerContext() ;
  if ( lc ) lc.reset() ;
  return new TXml ( this.dom ).reset() ;
};
TContainer.prototype.getDomByName = function ( name )
{
  if ( ! this.dom ) return ;
  return new TXml ( this.dom ).getDomByName ( name ) ;
};
TContainer.prototype.setText = function ( text )
{
  if ( ! this.dom ) return ;
  // if ( typeof ( text ) != 'string' ) text = String ( text ) ;
  // this.flushAttributes ( this.dom ) ;
  this.dom.innerHTML = text ;
  this.scrollToTop() ;
};
TContainer.prototype.setAllInputReadOnly = function ( state, tfClassName )
{
  if ( ! this.dom ) return ;
  TGui.setAllInputReadOnly ( this.dom, state, tfClassName ) ;
};
TContainer.prototype.hasChanged = function()
{
  if ( ! this.dom ) return false  ;
  var xDom = new TXml ( this.dom ) ;
  var lc = xDom.getListenerContext() ;
  if ( ! lc ) return false ;
  return lc.hasChanged() ;
};
TContainer.prototype.setChanged = function(state)
{
  if ( ! this.dom ) return ;
  var xDom = new TXml ( this.dom ) ;
  state = state ? true : false ;
  var lc = xDom.getListenerContext() ;
  if ( ! lc ) return ;
  if ( state ) lc.changed() ;
  else         lc.reset() ;
};
TContainer.prototype.getChangeListener = function()
{
  if ( ! this.dom ) return null  ;
  var xDom = new TXml ( this.dom ) ;
  return xDom.getListenerContext() ;
};
TContainer.prototype.checkStatus = function()
{
  if ( ! this.dom ) return null  ;
  var xDom = new TXml ( this.dom ) ;
  var lc = xDom.getListenerContext() ;
  if ( ! lc ) return ;
  return lc.check() ;
};
TContainer.prototype.getComponent = function ( idOrName )
{
  return this._super_.getComponent.apply ( this, arguments ) ;
};
TContainer.prototype.getComponentById = function ( id )
{
  if ( ! this.dom ) return null  ;
  if ( typeof ( id ) != "string" )
  {
    throw "TContainer.getComponentById(): Missing or invalid id: " + id ;
  }
  var x = new TXml ( this.dom ) ;
  return TGui.getComponent ( x.getDomById ( id ) ) ;
};
TContainer.prototype.getComponentByName = function ( name )
{
  if ( ! this.dom ) return null  ;
  if ( typeof ( name ) != "string" )
  {
    throw "TContainer.getComponentByName(): Missing or invalid name: " + name ;
  }
  var x = new TXml ( this.dom ) ;
  return TGui.getComponent ( x.getDomByName ( name ) ) ;
};
TContainer.prototype.getElement = function ( idOrName )
{
  if ( ! this.dom ) return null  ;
  if ( typeof ( idOrName ) != "string" )
  {
    throw "TContainer.getElement(): Missing or invalid id: " + idOrName ;
  }
  var x = new TXml ( this.dom ) ;
  return x.getDomByIdOrName ( idOrName ) ;
};
TContainer.prototype.getElementById = function ( id )
{
  if ( ! this.dom ) return null  ;
  if ( typeof ( id ) != "string" )
  {
    throw "TContainer.getElementById(): Missing or invalid id: " + id ;
  }
  var x = new TXml ( this.dom ) ;
  return x.getDomById ( id ) ;
};
TContainer.prototype.getElementByName = function ( name )
{
  if ( ! this.dom ) return null  ;
  if ( typeof ( name ) != "string" )
  {
    throw "TContainer.getElementByName(): Missing or invalid name: " + name ;
  }
  var x = new TXml ( this.dom ) ;
  return x.getDomByName ( name ) ;
};
TContainer.prototype.getPeerById = function ( id )
{
  var e = this.getElementById ( id ) ;
  if ( ! e ) return null ;
  if ( ! e.jsPeer ) return null ;
  return e.jsPeer ;
};
TContainer.prototype.getPeerByName = function ( name )
{
  var e = this.getElementByName ( name ) ;
  if ( ! e ) return null ;
  if ( ! e.jsPeer ) return null ;
  return e.jsPeer ;
};
TContainer.prototype.getPeer = function ( idOrName )
{
  if ( ! idOrName )
  {
    if ( ! this.dom ) return null ;
    return this.dom.jsPeer ;
  }
  var e = this.getElement ( idOrName ) ;
  if ( ! e ) return null ;
  if ( ! e.jsPeer ) return null ;
  return e.jsPeer ;
};
TContainer.prototype.getDropTarget = function ( idOrName )
{
  if ( ! idOrName )
  {
    if ( ! this.dom ) return null ;
    return this.dom.dndTarget ;
  }
  var e = this.getElement ( idOrName ) ;
  if ( ! e ) return null ;
  return e.dndTarget ;
};
TContainer.prototype.getDragSource = function ( idOrName )
{
  if ( ! idOrName )
  {
    if ( ! this.dom ) return null ;
    return this.dom.dndSource ;
  }
  var e = this.getElement ( idOrName ) ;
  if ( ! e ) return null ;
  return e.dndSource ;
};
TContainer.prototype.setAxl = function ( nameOrXml, pagelet )
{
  if ( ! this.dom ) return ;
  var x = null ;
  if ( typeof ( nameOrXml ) == 'string' )
  {
    if ( nameOrXml.indexOf ( "<" ) >= 0 && nameOrXml.indexOf ( ">" ) > 0 )
    {
      x = TSys.parseXml ( nameOrXml ) ;
    }
    else
    {
      var d = TSys.getAxl ( nameOrXml ) ;
      x = new TXml ( d ) ;
    }
  }
  else
  if ( nameOrXml && typeof ( nameOrXml ) == 'object' )
  {
    if ( nameOrXml.jsClassName == 'TXml' )
    {
      x = nameOrXml ;
    }
    else
    if ( nameOrXml.nodeName )
    {
      x = new TXml ( nameOrXml ) ;
    }
  }
  TGui.setAxl ( this.getDom(), x, pagelet ) ;
};
TContainer.prototype.findFirstFocusableElement = function()
{
  if ( ! this.dom ) return ;
  return TGui.findFirstFocusableElement ( this.dom ) ;
};
TComponent.prototype.findFirstFocusableSibling = function()
{
  if ( ! this.dom ) return ;
  return TGui.findFirstFocusableSibling ( this.dom ) ;
};
TContainer.prototype.findLastFocusableElement = function()
{
  if ( ! this.dom ) return ;
  return TGui.findLastFocusableElement ( this.dom ) ;
};
TContainer.prototype.getPagelet = function ( qualifier )
{
  if ( ! this.dom ) return ;
  if ( this.dom.xRecursive ) return ;
  this.dom.xRecursive = true ;
  var p = TGui.findPageletFromElement ( this.dom, qualifier ) ;
  this.dom.xRecursive = undefined ;
  return p ;
}
/**
 *  @constructor
 *  @extends TComponent
 *  @param {string|dom} id the id of an html element or
 *         the html dom element itself.
 */
var TLabel = function ( id )
{
  Tango.initSuper( this, TComponent, id );
  this.jsClassName = "TLabel" ;
} ;
TLabel.inherits( TComponent );
TLabel.prototype.getValue = function()
{
  if ( ! this.dom ) return null ;
  return TGui.getValueLabel ( this.dom ) ;
};
TLabel.prototype.setValue = function ( value )
{
  if ( ! this.dom ) return ;
  TGui.setValueLabel ( this.dom, value ) ;
};
TLabel.prototype.getText = function()
{
  return this.getValue() ;
};
TLabel.prototype.setText = function ( value )
{
  this.setValue ( value ) ;
};
TLabel.prototype.getDate = function()
{
  if ( ! this.dom ) return ;
  if ( this.dom.xsi_type != 'xsd-date' ) return null ;
  var s = this.dom.trueValue ;
  if ( typeof ( s ) == 'undefined' ) return null ;
  return DateUtils.parseDate ( s ) ;
};
TLabel.prototype.getTime = function()
{
  var date = this.getDate() ;
  if ( date ) return date.getTime() ;
  return 0 ;
};
TLabel.prototype.reset = function()
{
  this.dom.innerHTML = "" ;
  this.dom.trueValue = null ;
};
/**
 *  @constructor
 *  @extends TComponent
 *  @param {string|dom} id the id of an html element or
 *         the html dom element itself.
 */
var TButton = function ( id )
{
  Tango.initSuper( this, TComponent, id );
  this.jsClassName = "TButton" ;
};
TButton.inherits( TComponent );
/**
 *  @param {boolean} state
 */
TButton.prototype.setEnabled = function ( state )
{
  if ( ! this.dom ) return ;
  this._super_.setEnabled.apply ( this, arguments ) ;
  if ( this.dom.jsPeer && this.dom.jsPeer.setEnabled ) return ;
  if ( this.dom.disabled )
  {
    setButtonDecoration ( this.dom, "disabled" ) ;
    this.dom.style.cursor = "default" ;
  }
  else
  {
    setButtonDecoration ( this.dom, "normal" ) ;
    this.dom.style.cursor = this.dom.oldCursor ;
  }
};
TButton.prototype.isChecked = function()
{
  return this.dom.checked ;
};
TButton.prototype.setChecked = function ( state )
{
  if ( ! this.dom ) return ;
  var st = state ? true : false ;
  st = ! st ;
  if ( this.dom.checked == st ) return ;
  this.dom.checked = st ;
  if ( this.dom.jsPeer && this.dom.jsPeer.setChecked )
  {
    this.dom.jsPeer.setChecked ( state ? true : false ) ;
    return ;
  }
  if ( this.dom.checked )
  {
    setButtonDecoration ( this.dom, "checked" ) ;
  }
  else
  {
    setButtonDecoration ( this.dom, "normal" ) ;
  }
} ;
TButton.prototype.getText = function()
{
  if ( ! this.dom ) return "" ;
  if ( ! this.dom.eTxt ) return "" ;
  return this.dom.eTxt.innerHTML ;
} ;
TButton.prototype.setText = function ( text )
{
  if ( ! this.dom ) return ;
  if ( ! this.dom.eTxt ) return ;
  if ( ! text ) text = "" ;
  this.dom.eTxt.innerHTML = text ;
} ;
/**
 *  @constructor
 *  @extends TComponent
 *  @param {string|dom} id the id of an html element or
 *         the html dom element itself.
 */
var TDate = function ( id )
{
  Tango.initSuper( this, TComponent, id );
  this.jsClassName = "TDate" ;
};
TDate.inherits( TComponent );
TDate.prototype.setEnabled = function ( state )
{
  if ( ! this.dom ) return ;
  this._super_.setEnabled.apply ( this, arguments ) ;
};
TDate.prototype.getDate = function()
{
  if ( ! this.dom ) return null ;
  var xDate = new TXml ( this.dom ) ;
  return xDate.getDateFromDate ( this.dom ) ;
};
TDate.prototype.getTime = function()
{
  var date = this.getDate() ;
  if ( date ) return date.getTime() ;
  return 0 ;
};
TDate.prototype.reset = function()
{
  if ( ! this.dom ) return ;
  return new TXml ( this.dom ).resetDate(this.dom) ;
};
/**
 *  @param {long|string|Date} millis, formatted date or a date object
 *  @param [format] if the value is a string
 */
TDate.prototype.setDate = function ( value, format )
{
  if ( ! this.dom ) return null ;
  if ( ! value ) value = new Date() ;
  TGui.setValuesDate ( this.dom, value, format ) ;
};
/**
 *  @param {long} millis
 */
TDate.prototype.setTime = function ( millis )
{
  if ( ! this.dom ) return null ;
  if ( ! millis ) millis = new Date().getTime() ;
  TGui.setValuesDate ( this.dom, millis ) ;
};
/**
 *  @param {Date} minDate
 */
TDate.prototype.setMinimumDate = function ( minDate )
{
  if ( ! this.dom ) return null ;
  if ( ! minDate ) return null ;
  var currentDate = this.getDate() ;
  this.dom.minDate = minDate ;
  var selectedIndex = this.dom.hYear.selectedIndex ;
  TGui._fillYearsInDate ( this.dom, null, selectedIndex ) ;
  if ( ! this.dom.xdefault )
  {
    if ( currentDate ) TGui.setValuesDate ( this.dom, currentDate ) ;
  }
};
/**
 *  @param {Date} maxDate
 */
TDate.prototype.setMaximumDate = function ( maxDate )
{
  if ( ! this.dom ) return null ;
  if ( ! maxDate ) return null ;
  var currentDate = this.getDate() ;
  this.dom.maxDate2 = maxDate ;
  if ( currentDate && currentDate.getTime() > maxDate.getTime() )
  {
    this.setDate ( maxDate ) ;
  }
};

/**
 *  @constructor
 *  @extends TComponent
 *  @param {string|dom} id the id of an html element or
 *         the html dom element itself.
 */
var ACNativeCheckbox = function ( id )
{
  Tango.initSuper( this, TComponent, id );
  this.jsClassName = "ACNativeCheckbox" ;
};
ACNativeCheckbox.inherits( TComponent );
ACNativeCheckbox.prototype.isChecked = function()
{
  return this.dom.checked ;
};
ACNativeCheckbox.prototype.setChecked = function ( state )
{
  var st = state ? true : false ;
  this.dom.checked = st ;
};
ACNativeCheckbox.prototype.getValue = function()
{
  return this.dom.value ;
};
ACNativeCheckbox.prototype.getDefault = function()
{
  return this.dom.xdefault ;
};

/**
 *  @constructor
 *  @extends TComponent
 *  @param {string|dom} id the id of an html element or
 *         the html dom element itself.
 */
var ACNativeRadio = function ( id )
{
  Tango.initSuper( this, TComponent, id );
  this.jsClassName = "ACNativeRadio" ;
};
ACNativeRadio.inherits( TComponent );
ACNativeRadio.prototype.isChecked = function()
{
  return this.dom.checked ;
};
ACNativeRadio.prototype.setChecked = function ( state )
{
  var st = state ? true : false ;
  this.dom.checked = st ;
};
/**
 *  @constructor
 *  @extends TComponent
 *  @param {string|dom} id the id of an html element or
 *         the html dom element itself.
 */
var TTextField = function ( id )
{
  Tango.initSuper( this, TComponent, id );
  this.jsClassName = "TTextField" ;
};
TTextField.inherits( TComponent );
TTextField.prototype.setValues = function ( xml )
{
  if ( ! this.name && this.dom ) this.name = this.dom.name ;
  if ( ! this.name ) return ;
  var xv = xml.getXml ( this.name ) ;
  if ( ! xv ) return ;
  var v = xv.getContent() ;
  this.setText ( v ) ;
};
TTextField.prototype.setText = function ( text )
{
  if ( ! this.dom ) return ;
  if ( ! text ) text = "" ;
  if (  this.dom.xType == 'float'
     || this.dom.xType == 'ufloat'
     || this.dom.xType == 'money'
     || this.dom.extendedType == 'float'
     || this.dom.extendedType == 'ufloat'
     || this.dom.extendedType == 'money'
     )
  {
    var decimalSeparator = this.getLocale().getDecimalSeparator() ;
    if ( decimalSeparator == ',' ) text = text.replace ( /\./g, ',' ) ;
    if ( text ) this.dom.trueValue = parseFloat ( text ) ;
    else        this.dom.trueValue = 0 ;
  }
  this.dom.value = text ;
  TGui.setMandatoryDecoration ( this.dom ) ;
};
TTextField.prototype.getValue = function()
{
  if ( ! this.dom ) return ;
  if (  this.dom.xType == 'float'
     || this.dom.xType == 'ufloat'
     || this.dom.xType == 'money'
     || this.dom.extendedType == 'float'
     || this.dom.extendedType == 'ufloat'
     || this.dom.extendedType == 'money'
     )
  {
    v = this.dom.value.replace ( /,/g, '.' ) ;
    return parseFloat ( v ) ;
  }
  return this.dom.value ;
};
TTextField.prototype.getText = function()
{
  if ( ! this.dom ) return ;
  if (  this.dom.xType == 'float'
     || this.dom.xType == 'ufloat'
     || this.dom.xType == 'money'
     || this.dom.extendedType == 'float'
     || this.dom.extendedType == 'ufloat'
     || this.dom.extendedType == 'money'
     )
  {
    v = this.dom.value.replace ( /,/g, '.' ) ;
    return v ;
  }
  return this.dom.value ;
};
TTextField.prototype.setCaretPositionToStart = function()
{
  this.setCaretPosition ( 0 ) ;
};
TTextField.prototype.setCaretPositionToEnd = function()
{
  this.setCaretPosition ( this.dom.value.length ) ;
};
TTextField.prototype.setCaretPosition = function ( iCaretPos )
{
  if ( ! this.dom ) return ;
  if ( document.selection )
  {
    this.dom.focus ();
    var r = document.selection.createRange() ;
    r.moveStart ( "character", - this.dom.value.length ) ;
    r.moveStart ( "character", iCaretPos ) ;
    r.moveEnd ( "character", - this.dom.value.length ) ;
    r.moveEnd ( "character", iCaretPos ) ;
    r.select() ;
    this.dom.focus ();
  }
  else
  if ( typeof ( this.dom.selectionStart ) === "number" )
  {
    this.dom.focus ();
    this.dom.selectionStart = iCaretPos;
    this.dom.selectionEnd = iCaretPos;
    this.dom.focus ();
  }
};
TTextField.prototype.setSelectionStart = function( n )
{
  if ( ! this.dom ) return ;
  if ( typeof ( this.dom.selectionStart ) === "number" )
  {
    this.dom.focus() ;
    this.dom.selectionStart = n ;
  }
};
TTextField.prototype.setSelectionEnd = function( n )
{
  if ( ! this.dom ) return ;
  if ( typeof ( this.dom.selectionEnd ) === "number" )
  {
    this.dom.focus() ;
    this.dom.selectionEnd = n ;
  }
};
TTextField.prototype.getSelectionStart = function()
{
  if ( ! this.dom ) return -1 ;
  if ( this.dom.createTextRange)
  {
    this.dom.focus() ;
    var r = document.selection.createRange().duplicate() ;
    r.moveEnd("character",  this.dom.value.length) ;
    if (r.text === "") return  this.dom.value.length ;
    return  this.dom.value.lastIndexOf(r.text) ;
  }
  return this.dom.selectionStart ;
};
TTextField.prototype.getSelectionEnd = function()
{
  if ( ! this.dom ) return -1 ;
  if ( this.dom.createTextRange)
  {
    this.dom.focus() ;
    var r = document.selection.createRange().duplicate() ;
    r.moveStart("character", - this.dom.value.length) ;
    return r.text.length ;
  }
  return this.dom.selectionEnd ;
};
TTextField.prototype.getCaretPosition = function()
{
  return this.getSelectionStart() ;
};

/**
 *  @constructor
 *  @extends TTextField
 *  @param {string|dom} id the id of an html element or
 *         the html dom element itself.
 */
var TTextArea = function ( id )
{
  Tango.initSuper( this, TTextField, id );
  this.jsClassName = "TTextArea" ;
};
TTextArea.inherits( TTextField );
TTextArea.prototype.setupTabHandler = function()
{
  var thiz = this ;
  if ( TSys.isIE() )
  {
    this.addEventListener ( "keydown", function ( event )
    {
      var e = new TEvent ( event ) ;
      if ( e.isTab() )
      {
        if ( e.getModifierName() ) return ;
        e.consume() ;
        var src = e.getSource() ;
        var iend = thiz.getCaretPosition() + 1 ;
        src.selection = document.selection.createRange();
        src.selection.text = String.fromCharCode(9);
        thiz.setCaretPosition ( iend ) ;
      }
    } );
  }
  else
  {
    var eventName = "keypress" ;
    if ( Tango.ua.webkit ) eventName = "keydown" ;
    thiz.addEventListener ( eventName, function ( event )
    {
      var e = new TEvent ( event ) ;
      if ( e.isTab() )
      {
        if ( e.getModifierName() ) return ;
        e.consume() ;
        var src = e.getSource() ;
        var iend = src.selectionEnd + 1 ;
        var str = src.value.substring ( 0, src.selectionStart )
                + String.fromCharCode(9)
	       	+ src.value.substring ( src.selectionEnd )
	       	;
        src.value = str ;
        src.selectionStart = iend ;
        src.selectionEnd = iend ;
      } 
    } ) ;
  }
} ;
/**
 *  @constructor
 *  @extends TComponent
 *  @param {string|dom} id the id of an html element or
 *         the html dom element itself.
 */

var TChoice = function ( id )
{
  Tango.initSuper( this, TComponent, id );
  this.jsClassName = "TChoice" ;
};
TChoice.inherits( TComponent );
TChoice.prototype.select = function ( pattern )
{
  if ( ! this.dom ) return ;
  var index = -1 ;
  if ( typeof ( pattern ) == 'string' )
  {
    for ( i = 0 ; i < this.dom.options.length ; i++ )
    {
      var t = this.dom.options[i].text ;
      if ( ! t )
      {
        t = this.dom.options[i].firstChild.nodeValue ;
      }
      if ( ! t ) continue ;
      if ( t.toUpperCase().indexOf ( pattern ) >= 0 )
      {
        this.dom.options[i].selected = true ;
        index = i ;
        break ;
      }
    }
    if ( index < 0 )
    {
      this.dom.value = pattern ;
    }
  }
  else
  if ( typeof ( pattern ) == 'number' )
  {
    if ( pattern < 0 || pattern >= this.dom.options.length )
    {
      throw "TChoice: Invalid index: '" + pattern + "'" ;
    }
    this.dom.options[pattern].selected = true ;
    index = pattern ;
  }
  return index ;
};
TChoice.prototype.getSelectedIndex = function()
{
  return this.dom.selectedIndex ;
};
TChoice.prototype.getSelectedItem = function()
{
  return this.dom.value ;
};
TChoice.prototype.getNumberOfItems = function()
{
  return this.dom.options.length ;
};
TChoice.prototype.isEmpty = function()
{
  return this.getNumberOfItems() ? false : true ;
};
TChoice.prototype.reset = function()
{
  this.removeAllItems() ;
};
TChoice.prototype.removeAllItems = function()
{
  if ( ! this.dom ) return ;
  this.dom.options.length = 0 ;
  TGui.setMandatoryDecoration ( this.dom ) ;
};
TChoice.prototype.setValues = function ( xmlDom )
{
  if ( xmlDom && typeof ( xmlDom.getDom ) == 'function' ) xmlDom = xmlDom.getDom() ;
  TGui.setValuesChoice ( this.dom, xmlDom, false ) ;
};
TChoice.prototype.setRefData = function ( xmlDom )
{
  if ( xmlDom && typeof ( xmlDom.getDom ) == 'function' ) xmlDom = xmlDom.getDom() ;
  TGui.setValuesChoice ( this.dom, xmlDom, true ) ;
};
TChoice.prototype.getRefData = function()
{
  var ch = this.dom ;
  var x = new TXml() ;
  var xx = x.add ( this.dom.name ) ;
  for ( var i = 0 ; i < ch.options.length ; i++ )
  {
    var opt = ch.options[i] ;
    if ( i === 0 && ch.xdefault == "false" )
    {
      if ( ! opt.value ) continue ;
    }
    var xopt = xx.add ( "option", opt.text ) ;
    xopt.addAttribute ( "value", opt.value ) ;
  }
  return x ;
};
TChoice.prototype.setOptions = function ( selectedIndex, valueArray, textArray )
{
  if ( ! selectedIndex ) selectedIndex = 0 ;
  if ( selectedIndex < 0 ) selectedIndex = 0 ;
  var ch = this.dom ;
  var isDate = ch.xsi_type == "xsd-date" ;
  var isDateTime = ch.xsi_type == "xsd-datetime" ;
  var defaultValue = ch.getAttribute ( "default" ) ;
  ch.options.length = 0 ;
  var index = 0 ;
  var date ;
  if ( ch.xdefault )
  {
    var opt = document.createElement ( "option" ) ;
    if ( ch.xdefault == "false" )
    {
      ch.options[index++] = new Option ( "", "", false, false );
    }
    else
    {
      ch.options[index++] = new Option ( ch.xdefault, "", false, false );
    }
  }
  for ( var i = 0 ; i < valueArray.length ; i++ )
  {
    var valueIn = valueArray[i] ;
    var textIn = textArray[i] ;
    if ( isDate )
    {
      date = DateUtils.parseDate ( textIn ) ;
      textIn = DateUtils.formatDateShort ( date ) ;
    }
    else
    if ( isDateTime )
    {
      date = DateUtils.parseDate ( textIn ) ;
      textIn = DateUtils.formatDateTimeShort ( date ) ;
    }
    if ( ! valueIn ) valueIn = textIn ;
    if ( valueIn == defaultValue )
      ch.options[index++] = new Option ( textIn, valueIn, true, true );
    else
    if ( index == selectedIndex )
      ch.options[index++] = new Option ( textIn, valueIn, true, true );
    else
      ch.options[index++] = new Option ( textIn, valueIn, false, false );
  }
};
/**
 *  @constructor
 *  @extends TComponent
 *  @param {string|dom} id the id of an html element or
 *         the html dom element itself.
 */
var TCheckbox = function ( id )
{
  var axl = null ;
  Tango.initSuper( this, TComponent, id );
  if ( id && ( id instanceof TXml ) )
  {
    axl = id ;
    id = null ;
    this.value = axl.getAttribute ( "value", "" ) ;
    this.text = axl.getAttribute ( "text", "" ) ;
    if ( ! this.value ) this.value = this.text ;
    if ( ! this.text ) this.text = this.value ;
    this.onchange = axl.getAttribute ( "onchange", "" ) ;
    this.name = axl.getAttribute ( "name", "" ) ;
    this.xdefault = axl.getAttribute ( "default", "" ) ;
    this.checked = axl.getBoolAttribute ( "checked", false ) ;
    this.disabled = axl.getBoolAttribute ( "disabled", false ) ;
  }
  this.jsClassName = "TCheckbox" ;
};
TCheckbox.inherits( TComponent );
TCheckbox.prototype.getValue = function ( xml )
{
  if ( ! xml )
  {
    return this.value ;
  }
  if ( ! this.name ) return ;
  if ( ! this.dom.checked )
  {
    if ( this.xdefault )
    {
      xml.add ( this.name, this.xdefault ) ;
    }
    return ;
  }
  xml.add ( this.name, this.value ) ;
};
TCheckbox.prototype.getDefault = function()
{
  return this.xdefault ;
};
TCheckbox.prototype.setValues = function ( xml )
{
  if ( ! this.name && this.dom ) this.name = this.dom.name ;
  if ( ! this.name ) return ;
  var xv = xml.getXml ( this.name ) ;
  if ( ! xv ) return ;
  var v = xv.getContent() ;
  this.setChecked ( v == this.value ) ;
};
TCheckbox.prototype._getThemeData = function()
{
  this.imgWidth = 13 ;
  var txml = Tango.getThemeXml ( "Checkbox", "normal" ) ;
  txml = txml.getParent() ;
  this.imgWidth = txml.getIntAttribute ( "width", this.imgWidth ) ;
  this.imgNormal = TGui.buildThemeImageUrl ( "Checkbox", "normal" ) ;
  this.imgInside = TGui.buildThemeImageUrl ( "Checkbox", "inside" ) ;
  this.imgPressed = TGui.buildThemeImageUrl ( "Checkbox", "pressed" ) ;
  this.imgNormal_on = TGui.buildThemeImageUrl ( "Checkbox", "normal.on" ) ;
  this.imgInside_on = TGui.buildThemeImageUrl ( "Checkbox", "inside.on" ) ;
  this.imgPressed_on = TGui.buildThemeImageUrl ( "Checkbox", "pressed.on" ) ;
  this.imgDisabled = null ;
  if ( Tango.getThemeDom ( "Checkbox", "disabled" ) ) this.imgDisabled = TGui.buildThemeImageUrl ( "Checkbox", "disabled" ) ;
  this.imgDisabled_on = null ;
  if ( Tango.getThemeDom ( "Checkbox", "disabled.on" ) ) this.imgDisabled = TGui.buildThemeImageUrl ( "Checkbox", "disabled.on" ) ;
};
TCheckbox.prototype.addToListenerContext = function ( listenerContext )
{
  listenerContext.addOnMouseUp ( this.dom ) ;
};
TCheckbox.prototype._renderImage = function()
{
  if ( this.dom.checked )
  {
    if ( this.dom.disabled )
    {
      this.dom.className = this._getClassNameDisabled() ;
      if ( this.imgDisabled_on ) this.img.src = this.imgDisabled_on ;
      else
      {
        this.img.src = this.imgNormal_on ;
        TGui.setOpacity ( this.img, 0.5 ) ;
      }
    }
    else
    {
      this.dom.className = this._getClassName() ;
      this.img.src = this.imgNormal_on ;
    }
  }
  else
  {
    if ( this.dom.disabled )
    {
      this.dom.className = this._getClassNameDisabled() ;
      if ( this.imgDisabled ) this.img.src = this.imgDisabled ;
      else
      {
        this.img.src = this.imgNormal ;
        TGui.setOpacity ( this.img, 0.5 ) ;
      }
    }
    else
    {
      this.dom.className = this._getClassName() ;
      this.img.src = this.imgNormal ;
    }
  }
};
TCheckbox.prototype.setClassImages = function ( dom, refresh )
{
  if ( ! refresh ) return ;
  this._getThemeData() ;
  this.img.style.width = this.imgWidth + "px" ;
  this.img.style.height = this.imgWidth + "px" ;
  this._renderImage() ;
  TGui.layoutButtonLike ( { dom:this.dom, imgWidth:this.imgWidth, useButtonMinimum:true, debug:false, xAlign:"left" } ) ;
  return true ;
};
TCheckbox.prototype._getClassName = function()
{
  return 'ThemeCheckbox' ;
};
TCheckbox.prototype._getClassNameDisabled = function()
{
  return 'ThemeCheckboxDisabled' ;
};
TCheckbox.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  this.dom.xClassName = "Checkbox2" ;
  this.setName ( this.name ) ;
  this.dom.checked = this.checked ;
  this.dom.disabled = this.disabled ;
  this._getThemeData() ;

  var s = "<img width='" + this.imgWidth + "' height='" + this.imgWidth + "' class='ButtonImage' onmousedown='return false;' />" ;
  if ( this.text )
  {
    s += "<span class='ButtonText' >" + this.text + "</span>" ;
  }
  this.dom.innerHTML = s ;

  var xch  = new TXml ( this.dom ) ;
  this.img = xch.getDomByClassName ( "ButtonImage" ) ;
  this.txt = xch.getDomByClassName ( "ButtonText" ) ;

  this._renderImage() ;

  TGui.layoutButtonLike ( { dom:this.dom, imgWidth:this.imgWidth, useButtonMinimum:true } ) ;

  this.addEventListener ( this ) ;
  if ( this.onchange )
  {
    this.dom.fExecutor = new TFunctionExecutor ( this.onchange, layoutContext ) ;
  }
};
TCheckbox.prototype.mousedown = function ( event )
{
  if ( this.dom.disabled ) return ;
  if ( this.dom.checkable )
  {
    this.img.src = this.imgPressed_on ;
  }
  else
  {
    if ( this.dom.checked ) this.img.src = this.imgPressed_on ;
    else                    this.img.src = this.imgPressed ;
  }
};
TCheckbox.prototype.mouseup = function ( event )
{
  if ( this.dom.disabled ) return ;
  if ( this.dom.checkable )
  {
    if ( ! this.dom.checked )
    {
      this.dom.checked = true ;
      this.dom.checkableGroup.checkableChecked ( this.dom  ) ;
      this.img.src = this.imgInside_on ;
    }
    else
    {
      this.img.src = this.imgInside_on ;
    }
  }
  else
  {
    this.dom.checked = ! this.dom.checked ;
    if ( this.dom.checked ) this.img.src = this.imgInside_on ;
    else                    this.img.src = this.imgInside ;
  }
};
TCheckbox.prototype.click = function ( event )
{
  if ( this.dom.disabled ) return ;
  if ( this.dom.fExecutor ) this.dom.fExecutor.executeWithEvent ( event ) ;
};
TCheckbox.prototype.mouseover = function ( event )
{
  if ( this.dom.disabled ) return ;
  if ( this.dom.checked ) this.img.src = this.imgInside_on ;
  else                    this.img.src = this.imgInside ;
};
TCheckbox.prototype.mouseout = function ( event )
{
  if ( this.dom.disabled ) return ;
  if ( this.dom.checked ) this.img.src = this.imgNormal_on ;
  else                    this.img.src = this.imgNormal ;
};
TCheckbox.prototype.setChecked = function ( state )
{
  if ( ! this.dom ) return ;
  var st = state ? true : false ;
  if ( this.dom.checked == st ) return ;
  this.dom.checked = st ;
  if ( this.dom.checked ) this.img.src = this.imgNormal_on ;
  else                    this.img.src = this.imgNormal ;
};
TCheckbox.prototype.isChecked = function()
{
  return this.dom.checked ;
};
TCheckbox.prototype.setEnabled = function ( state )
{
  this._super_.setEnabled.apply ( this, arguments ) ;
  this._renderImage() ;
};
/**
 *  @constructor
 *  @extends TComponent
 *  @param {string|dom} id the id of an html element or
 *         the html dom element itself.
 */
var TRadio = function ( id )
{
  Tango.initSuper( this, TCheckbox, id );
  this.jsClassName = "TRadio" ;
  this.xdefault = false ;
};
TRadio.inherits( TCheckbox );
TRadio.prototype._getThemeData = function()
{
  this.imgWidth = 13 ;
  var txml = Tango.getThemeXml ( "Radio", "normal" ) ;
  txml = txml.getParent() ;
  this.imgWidth = txml.getIntAttribute ( "width", this.imgWidth ) ;
  this.imgNormal = TGui.buildThemeImageUrl ( "Radio", "normal" ) ;
  this.imgInside = TGui.buildThemeImageUrl ( "Radio", "inside" ) ;
  this.imgPressed = TGui.buildThemeImageUrl ( "Radio", "pressed" ) ;
  this.imgNormal_on = TGui.buildThemeImageUrl ( "Radio", "normal.on" ) ;
  this.imgInside_on = TGui.buildThemeImageUrl ( "Radio", "inside.on" ) ;
  this.imgPressed_on = TGui.buildThemeImageUrl ( "Radio", "pressed.on" ) ;
  this.imgDisabled = null ;
  if ( Tango.getThemeDom ( "Radio", "disabled" ) ) this.imgDisabled = TGui.buildThemeImageUrl ( "Radio", "disabled" ) ;
  this.imgDisabled_on = null ;
  if ( Tango.getThemeDom ( "Radio", "disabled.on" ) ) this.imgDisabled = TGui.buildThemeImageUrl ( "Radio", "disabled.on" ) ;
};
TRadio.prototype.layout = function ( dom, externalAttributes, dummy, layoutContext, a )
{
//  this._super_.layout.apply ( this, arguments ) ;
  TCheckbox.prototype.layout.apply ( this, arguments ) ;
  if ( a["CheckableGroup"] )
  {
    this.dom.checkable = true ;
    a["CheckableGroup"].addCheckable ( this.dom ) ;
  }
};
TRadio.prototype._getClassName = function()
{
  return 'ThemeRadio' ;
};
TRadio.prototype._getClassNameDisabled = function()
{
  return 'ThemeRadioDisabled' ;
};
/**
 *  @constructor
 *  @extends TComponent
 *  @param {axl} the axl definition
 */
MenuContainer = function ( id )
{
  this.axl = null ;
  if ( id && ( id instanceof TXml ) )
  {
    this.axl = id ;
    id = null ;
    this.name = this.axl.getAttribute ( "name", "" ) ;
  }
  Tango.initSuper( this, TComponent, id );
  this.jsClassName = "MenuContainer" ;
  this.pathToDisabledState = [] ;
  this.path = "" ;
  this._isRoot = true ;
  this.pagelet = null ;
  this.anchorElement = null ;
  this._closeOnMouseDown = undefined ;
  this._closeOnKeyDown = undefined ;
  this._flushed = false ;
};
MenuContainer.inherits( TComponent );
MenuContainer.prototype.setDefaultAction = function ( defaultAction )
{
  this.defaultAction = defaultAction ;
} ;
MenuContainer.prototype.getDefaultAction = function()
{
  return this.defaultAction ;
} ;
MenuContainer.prototype.flush = function()
{
  this.mouseDownAutoCloseVeto = 0 ;
  if ( this._flushed ) return ;
  this._flushed = true ;
  TGlobalEventHandler.removeOnMouseDown ( this._closeOnMouseDown ) ;
  TGlobalEventHandler.removeOnKeyDown ( this._closeOnKeyDown ) ;
  this.flushAll() ;
  this.pathToDisabledState.length = 0 ;
  this.pathToDisabledState = undefined ;
  this.pagelet = undefined ;
  this.anchorElement = undefined ;
  this.dom = undefined ;
  if ( this._closeOnMouseDown ) this._closeOnMouseDown.flush() ;
  this._closeOnMouseDown = undefined ;
  if ( this._closeOnKeyDown ) this._closeOnKeyDown.flush() ;
  this._closeOnKeyDown = undefined ;
};
MenuContainer.prototype.mouseDownAutoClose = function ( event )
{
  this.mouseDownAutoCloseVeto-- ;
  if ( this.mouseDownAutoCloseVeto >= 0 ) return true ;
  var ev = new TEvent ( event ) ;
  var peer = ev.getPeer() ;
  if ( peer instanceof MenuContainer )
  {
    if ( peer == this ) return true ;
  }
  if ( ( peer instanceof MenuButton ) || ( peer instanceof MenuPane ) )
  {
    var p = peer.getRoot() ;
    if ( p == this ) return true ;
  }
  this.closeAll() ;
  return true ;
};
MenuContainer.prototype.keyDownAutoClose = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( !ev.isEscape() ) return true ;
  ev.consume() ;

  if ( TSys.getWebConfig().menuShortcuts )
  {
    if ( this.openChild )
    {
      if ( ! this.openChild.dom.isFocusOwner )
      {
        return true ;
      }
      if ( this.openChild.openChild )
      {
        var b = this.openChild.openChild.parent ;
        this.openChild.closeAll() ;
        b.setDecoration ( "inside", event ) ;
        return true ;
      }
    }
  }
  this.closeAll("normal") ;
  return true ;
};
MenuContainer.prototype.getRoot = function()
{
  return this ;
};
MenuContainer.prototype.getPagelet = function()
{
  if ( this.pagelet ) return this.pagelet ;
  return TGui.findPageletFromElement ( this.getAnchorElement(), "" ) ;
};
MenuContainer.prototype._findPaneXml = function ( axl, a, index )
{
  var en = axl.elements() ;
  while ( en.hasNext() )
  {
    var x = en.nextXml() ;
    if ( x.getAttribute ( "name" ) == a[index] )
    {
      if ( index >= a.length - 1 ) return x ;
      return this._findPaneXml ( x, a, index+1 ) ;
    }
  }
  return undefined ;
};
MenuContainer.prototype.getAnchorElement = function()
{
  return this.anchorElement ;
};
/**
 *  @constructor
 *  @extends MenuContainer
 *  @param {axl} the axl definition
 */
var Menubar = function ( axl, dom )
{
  Tango.initSuper( this, MenuContainer, axl );
  this.jsClassName = "Menubar" ;
  if ( axl )
  {
    var style = axl.getAttribute ( "style", "" ) ;
    if ( style.indexOf ( "height" ) >= 0 )
    {
      var aResult = TGui.parseStyle ( style, "height" ) ;
      if ( aResult )
      {
        style = aResult[0] ;
        this._styleHeight = parseInt ( aResult[1] ) ;
        if ( isNaN ( this._styleHeight ) ) this._styleHeight = 0 ;
      }
    }
  }
  if ( dom )
  {
    this.dom = dom ;
    this.dom.jsPeer = this ;
  }
  this.mbList = [] ;
  this.mbListRight = [] ;
};
Menubar.inherits( MenuContainer );
Menubar.prototype.closeAll = function ( state )
{
state = "normal" ;
  if ( ! this.openChild ) return ;
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ! ch.jsPeer ) continue ;
    ch.jsPeer.closeAll(state) ;
    if ( state ) ch.jsPeer.state = state ;
    ch.jsPeer.setDecoration ( ch.jsPeer.state ) ;
  }
};
Menubar.prototype.flushAll = function()
{
  while ( this.dom.firstChild )
  {
    if ( this.dom.firstChild.nodeType != DOM_ELEMENT_NODE || ! this.dom.firstChild.jsPeer )
    {
      this.dom.removeChild ( this.dom.firstChild ) ;
      continue ;
    }
    this.dom.firstChild.jsPeer.flushAll() ;
  }
  this.mbList.length = 0 ;
  this.mbListRight.length = 0 ;
  if ( this.onopen ) this.onopen.flush() ;
  this.onopen = undefined ;
  this.dom = undefined ;
};
Menubar.prototype.layout = function ( dom, externalAttributes, dummy, layoutContext )
{
  this.dom = dom ;
  this.dom.xClassName = "XMenubar" ;
  this.setName ( this.name ) ;
  this._closeOnMouseDown = new TFunctionExecutor ( this, this.mouseDownAutoClose ) ;
  TGlobalEventHandler.addOnMouseDown ( this._closeOnMouseDown ) ;
  this._closeOnKeyDown = new TFunctionExecutor ( this, this.keyDownAutoClose ) ;
  TGlobalEventHandler.addOnKeyDown ( this._closeOnKeyDown ) ;
  this.anchorElement = this.dom.parentNode ;

  var maxHeight = 0 ;
  var maxStyleHeight = 0 ;
  var pt = TGui.getComputedStyleInt ( dom, "padding-top", 0 ) ;
  var pb = TGui.getComputedStyleInt ( dom, "padding-bottom", 0 ) ;
  var pl = TGui.getComputedStyleInt ( dom, "padding-left", 0 ) ;
  var pr = TGui.getComputedStyleInt ( dom, "padding-right", 0 ) ;
  var x = pl ;

  this.dLeft = document.createElement ( "div" ) ;
  this.dom.appendChild ( this.dLeft ) ;
  this.dLeft.style.position = "absolute" ;
  this.dLeft.style.top = "0px" ;
  this.dLeft.style.left = "0px" ;
  this.dLeft.style.padding = "0px" ;
  this.dLeft.style.margin = "0px" ;

  this.eImg = TGui.createElement ( "<img src='' onmousedown='return false;' />" ) ;
  this.dom.appendChild ( this.eImg ) ;
  this.eImg.style.position = "absolute" ;
  this.eImg.style.top = "0px" ;
  this.eImg.style.left = "0px" ;
  this.eImg.style.padding = "0px" ;
  this.eImg.style.margin = "0px" ;

  var en = this.axl.elements() ;
  this.mbList = [] ;
  this.mbListRight = [] ;
  while ( en.hasNext() )
  {
    var xMenuButton = en.nextXml() ;
    var name = xMenuButton.getName() ;
    var style = xMenuButton.getAttribute ( "style" ) ;
    var right = undefined ;
    if ( style )
    {
      if ( style.indexOf ( "right" ) >= 0 )
      {
        var aResult = TGui.parseStyle ( style, "right" ) ;
        if ( aResult )
        {
          style = aResult[0] ;
          right = parseInt ( aResult[1] ) ;
          if ( isNaN ( right ) || right < 0 ) right = undefined ;
        }
      }
    }
    if ( name == "MenuButton" || name == "MenuItem" )
    {
      var mb = new MenuButton ( this, xMenuButton, "MenuButton" ) ;
      if ( mb.dom.disabled ) mb.setDecoration ( "disabled" ) ;
      else                   mb.setDecoration ( "normal" ) ;
      this.mbList.push ( mb ) ;
      if ( right >= 0 )
      {
        mb.offsetRight = right ;
        this.mbListRight.push ( mb ) ;
      }
      else
      {
        mb.dom.style.left = x + "px" ;
        x += mb.dom.offsetWidth ;
      }
    }
  }
  this.pagelet = layoutContext.getPagelet() ;
  this.dRight = document.createElement ( "div" ) ;
  this.dom.appendChild ( this.dRight ) ;
  this.dRight.style.position = "absolute" ;
  this.dRight.style.top = "0px" ;
  this.dRight.style.padding = "0px" ;
  this.dRight.style.margin = "0px" ;

  this._layout() ;
};
Menubar.prototype.setClassImages = function ( dom, refresh )
{
  this._layout() ;
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ! ch.jsPeer ) continue ;
    ch.jsPeer.flushChildren() ;
  }
};
Menubar.prototype._layout = function()
{
  var maxHeight = 0 ;
  var maxStyleHeight = 0 ;
  var pt = TGui.getComputedStyleInt ( this.dom, "padding-top", 0 ) ;
  var pb = TGui.getComputedStyleInt ( this.dom, "padding-bottom", 0 ) ;
  var pl = TGui.getComputedStyleInt ( this.dom, "padding-left", 0 ) ;
  var pr = TGui.getComputedStyleInt ( this.dom, "padding-right", 0 ) ;

  var mbpt = 0 ;
  var mbpb = 0 ;
  var mbpl = 0 ;
  var mbpr = 0 ;
  var i ;
  var x = pl ;

  var first = true ;
  for ( i = 0 ; i < this.mbList.length ; i++ )
  {
    if ( first )
    {
      first = false ;
      mbpt = TGui.getComputedStyleInt ( this.mbList[i].dom, "padding-top", 0 ) ;
      mbpb = TGui.getComputedStyleInt ( this.mbList[i].dom, "padding-bottom", 0 ) ;
      mbpl = TGui.getComputedStyleInt ( this.mbList[i].dom, "padding-left", 0 ) ;
      mbpr = TGui.getComputedStyleInt ( this.mbList[i].dom, "padding-right", 0 ) ;
    }
    this.mbList[i].dom.style.top = pt + "px" ;
    maxStyleHeight = Math.max ( maxStyleHeight, TGui.parsePixel ( this.mbList[i].dom.style.height ) ) ;
    TGui.layoutButtonLike ( { dom:this.mbList[i].dom, imgWidth:16, contentOnly:true } ) ;
  }
  if ( this._styleHeight )
  {
    maxStyleHeight = this._styleHeight - pt - pb - mbpt - mbpb ;
  }
  for ( i = 0 ; i < this.mbList.length ; i++ )
  {
    this.mbList[i].dom.style.height = maxStyleHeight + "px" ;
    maxHeight = Math.max ( maxHeight, this.mbList[i].dom.offsetHeight ) ;
    TGui.layoutButtonLike ( { dom:this.mbList[i].dom, imgWidth:16, contentOnly:true } ) ;
    this.mbList[i].setDecoration ( "normal" ) ;
  }
  if ( this._styleHeight )
  {
    maxHeight = this._styleHeight - pt - pb ;
  }
  var txmlStyle = Tango.getThemeXml ( "Menubar", "style" ) ;
  var txmlLeft = Tango.getThemeXml ( "Menubar", "left" ) ;
  var txmlRight = Tango.getThemeXml ( "Menubar", "right" ) ;
  var leftWidth = pl ;
  var rightWidth = pr ;

  var cssClass = null ;
  var xMenubar = Tango.getThemeXml ( "Menubar" ) ;
  if ( xMenubar.getBoolAttribute ( "pure-css", false ) )
  {
    this.dom.style.backgroundImage = "" ;
    var pxml2 = xMenubar.get ( "normal" ) ;
    cssClass = pxml2.getAttribute ( "class" ) ;
    txmlLeft = 0 ;
    txmlRight = 0 ;
    this.eImg.style.display = 'NONE' ;
  }
  else
  {
    this.eImg.style.display = '' ;
  }

  this.dom.style.height = maxHeight + "px" ;
  this.eImg.style.height = this.dom.offsetHeight + "px" ;

  if ( cssClass )
  {
    this.dom.className = cssClass ;
    // this.eImg
  }
  else
  {
    this.eImg.src = TGui.buildThemeImageUrl ( "Menubar", "normal", NaN, this.dom.offsetHeight ) ;
  }

  if ( txmlStyle )
  {
    leftWidth = txmlStyle.getIntAttribute ( "left-width", leftWidth ) ;
    rightWidth = txmlStyle.getIntAttribute ( "right-width", rightWidth ) ;
  }
  if ( ! txmlLeft ) this.dLeft.style.width = "0px" ;
  else
  {
    this.dLeft.style.width = leftWidth + "px" ;
    this.dLeft.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "Menubar", "left"
                                                                      , this.dLeft.offsetWidth, this.dLeft.offsetHeight ) ;
  }
  if ( ! txmlRight ) this.dRight.style.width = "0px" ;
  else
  {
    this.dRight.style.width = rightWidth + "px" ;
    this.dRight.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "Menubar", "right"
                                                                      , this.dRight.offsetWidth, this.dRight.offsetHeight ) ;
  }
  this.eImg.style.left = this.dLeft.offsetWidth + "px" ;
  this.eImg.style.width = ( this.dom.offsetWidth - this.dLeft.offsetWidth - this.dRight.offsetWidth ) + "px" ;
  this.dLeft.style.height = this.dom.offsetHeight + "px" ;
  this.dRight.style.height = this.dom.offsetHeight + "px" ;
};
Menubar.prototype.resized = function ( size )
{
  this.dRight.style.left = ( this.dom.offsetWidth - this.dRight.offsetWidth ) + "px" ;
  this.eImg.style.left = this.dLeft.offsetWidth + "px" ;
  this.eImg.style.width = ( this.dom.offsetWidth - this.dLeft.offsetWidth - this.dRight.offsetWidth ) + "px" ;

  var x = this.dom.offsetWidth ;
  for ( var i = this.mbListRight.length - 1 ; i >= 0 ; i-- )
  {
    var mb = this.mbListRight[i] ;
    x -= mb.offsetRight + mb.dom.offsetWidth ;
    mb.dom.style.left = x + "px" ;
  }
};
Menubar.prototype.setEnabled = function ( name, state )
{
  if ( typeof ( name ) != 'string' ) return ;
  state = state ? true : false ;
  var a = name.split ( "/" ) ;
  var index = 0 ;
  this.pathToDisabledState[name] = ! state ;
  var b = this._findButton ( a, index ) ;
  if ( b ) b.setEnabled ( state ) ;
};
Menubar.prototype.isEnabled = function ( name )
{
  var a = name.split ( "/" ) ;
  var index = 0 ;
  var b = this._findButton ( a, index ) ;
  if ( b ) return b.isEnabled() ;
  return true ;
};
Menubar.prototype.findButton = function ( name )
{
  var a = name.split ( "/" ) ;
  var index = 0 ;
  return this._findButton ( a, index ) ;
};
Menubar.prototype._findButton = function ( a, index )
{
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.name == a[index] )
    {
      if ( index >= a.length - 1 )
      {
        return ch.jsPeer ;
      }
      return ch.jsPeer._findButton ( a, index+1 ) ;
    }
  }
  return undefined ;
};
Menubar.prototype.getChildNamesOf = function ( name )
{
  var a = name.split ( "/" ) ;
  var index = 0 ;
  var b = this._findButton ( a, index ) ;
  if ( ! b )
  {
    var xPane = this._findPaneXml ( this.axl, a, index ) ;
    if ( ! xPane ) return [] ;
    var a2 = [] ;
    var en = xPane.elements() ;
    while ( en.hasNext() )
    {
      var x = en.nextXml() ;
      if ( x.getAttribute ( "name" ) ) a2.push ( x.getAttribute ( "name" ) ) ;
    }
    return a2 ;
  }
  return b.getChildNames() ;
};
Menubar.prototype.stopMenuTimer = function()
{
  this.buttonToBeOpened = undefined ;
  if ( ! this.timer ) return ;
  this.timer.stop() ;
};
Menubar.prototype.startMenuTimer = function ( button, menuPaneType )
{
  if ( ! ( button instanceof MenuButton ) ) return ;
  this.buttonToBeOpened = button ;
  this.menuPaneType = menuPaneType ;
  if ( ! this.timer )
  {
    var thiz = this ;
    this.timer = new TTimer ( 700, function ( e )
    {
      if ( thiz.buttonToBeOpened )
      {
        thiz.buttonToBeOpened._openPane ( null, thiz.menuPaneType ) ;
      }
    } ) ;
    this.timer.setRepeats ( false ) ;
  }
  this.timer.stop() ;
  this.timer.start() ;
};
/**
 *  @constructor
 *  @extends TComponent
 */
var MenuPane = function ( parent, axl, minimumWidth )
{
  if ( ! parent )
  {
    Tango.initSuper( this, TComponent, null );
    return ;
  }
  this.parent = parent ;
  var dom = document.createElement ( "div" ) ;
  Tango.initSuper( this, TComponent, dom );
  this.jsClassName = "MenuPane" ;
  document.body.appendChild ( dom ) ;
  this.dom.style.position = "absolute" ;
  this.mouseIsDown = false ;
//  if ( ! TSys.isKhtml )
  {
    this.dom.style.zIndex = TGui.zIndexMenu ;
  }
  this.dom.style.visibility = "hidden" ;
  this.dom.className = this.getNormalCssClassName() ;
  this.dom.xClassName = "Menu" ;
  this.dom.jsPeer = this ;
  this._flushed = false ;
  this.setName ( this.parent.getName() ) ;
  this.path = "" ;
  this.axl = axl ;
  var maxHeight = 0 ;
  var maxWidth = 0 ;
  var maxStyleWidth = 0 ;
  this._initialize() ;
  var pt = TGui.getComputedStyleInt ( this.dom, "padding-top", 0 ) ;
  var pl = TGui.getComputedStyleInt ( this.dom, "padding-left", 0 ) ;
  var pb = TGui.getComputedStyleInt ( this.dom, "padding-bottom", 0 ) ;
  var pr = TGui.getComputedStyleInt ( this.dom, "padding-right", 0 ) ;
  var x = pl ;
  var y = pt ;
  // var en = this.axl.getEnum ( "MenuItem" ) ;
  var en = this.axl.elements() ;
  while ( en.hasNext() )
  {
    var xMenuButton = en.nextXml() ;
    var mb = null ;
    if ( xMenuButton.getName() === "MenuItem" )
    {
      mb = this.getMenuItemInstance ( this, xMenuButton ) ;
    }
    else
    if ( xMenuButton.getName() === "MenuTitle" || xMenuButton.getName() === "Title" )
    {
      mb = this.getMenuTitleInstance ( this, xMenuButton ) ;
    }
    else
    if ( xMenuButton.getName() === "MenuSeparator" || xMenuButton.getName() === "Separator" )
    {
      mb = this.getMenuSeparatorInstance ( this, xMenuButton ) ;
    }
    else
    {
      continue ;
    }
    mb.dom.style.top = y + "px" ;
    mb.dom.style.left = x + "px" ;
    y += mb.dom.offsetHeight ;
    maxWidth = Math.max ( maxWidth, mb.dom.offsetWidth ) ;
    maxStyleWidth = Math.max ( maxStyleWidth, TGui.parsePixel ( mb.dom.style.width ) ) ;
    maxHeight = Math.max ( maxHeight, mb.dom.offsetHeight ) ;
  }
  if ( minimumWidth )
  {
    if ( minimumWidth > maxWidth + pl + pr )
    {
      var newWidth = minimumWidth - pl - pr ;
      maxStyleWidth += newWidth - maxWidth ;
      maxWidth = newWidth ;
    }
  }
  if ( maxWidth > 0 && maxHeight > 0 )
  {
    for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( dom.nodeType != DOM_ELEMENT_NODE ) continue ;
      ch.style.width = maxStyleWidth + "px" ;
      if ( ch.eCloser )
      {
        ch.eCloser.style.left = ( ch.offsetWidth - ch.eCloser.offsetWidth - TGui.getComputedStyleInt ( ch, "padding-right", 0 )  )  + "px" ;
      }
      if ( ch.jsPeer )
      {
        if ( ch.disabled ) ch.jsPeer.setDecoration ( "disabled" ) ;
        else               ch.jsPeer.setDecoration ( "normal" ) ;
      }
    }
    dom.style.width = maxWidth + "px" ;
    dom.style.height = y + "px" ;
  }
  this.mouseMoved = false ;
  this.addEventListener ( "mousemove", this, this.mousemove ) ;
  this.dom.isFocusable = true ;
};
MenuPane.inherits( TComponent );
//-----------------------
MenuPane.prototype.focusGained = function()
{
} ;
MenuPane.prototype.focusLost = function()
{
} ;
MenuPane.prototype._handleCursorKeys = function ( ev )
{
  ev.consume() ;
  var jsPeer_first = null ;
  var jsPeer_inside = null ;
  var jsPeer_first_after = null ;
  var ch ;
  
  if ( ev.isCursorDown() )
  {
    for ( ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      if ( ch.jsPeer.dom.disabled ) continue ;
      if ( ch.jsPeer.state == 'inside' )
      {
        jsPeer_inside = ch.jsPeer ;
	continue ;
      }
      if ( ! jsPeer_first )
      {
        jsPeer_first = ch.jsPeer ;
      }
      if ( jsPeer_inside && ! jsPeer_first_after )
      {
        jsPeer_first_after = ch.jsPeer ;
      }
    }
    if ( ! jsPeer_inside )
    {
      if ( jsPeer_first )
      {
        jsPeer_first.onShortcutCharacter  ( ev.getEvent() ) ;
      }
    }
    else
    {
      if ( jsPeer_first_after )
      {
        jsPeer_inside.setDecoration("normal") ;
        jsPeer_inside.closeAll("normal") ;
        jsPeer_first_after.onShortcutCharacter  ( ev.getEvent() ) ;
      }
      else
      {
        jsPeer_inside.setDecoration("normal") ;
        jsPeer_inside.closeAll("normal") ;
        if ( jsPeer_first ) jsPeer_first.onShortcutCharacter  ( ev.getEvent() ) ;
      }
    }
  }
  else
  if ( ev.isCursorUp() )
  {
    var jsPeer_last = null ;
    jsPeer_inside = null ;
    var jsPeer_first_before = null ;
    for ( ch = this.dom.lastChild ; ch ; ch = ch.previousSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      if ( ch.jsPeer.dom.disabled ) continue ;
      if ( ch.jsPeer.state == 'inside' )
      {
        jsPeer_inside = ch.jsPeer ;
        continue ;
      }
      if ( ! jsPeer_last )
      {
        jsPeer_last = ch.jsPeer ;
      }
      if ( jsPeer_inside && ! jsPeer_first_before )
      {
        jsPeer_first_before = ch.jsPeer ;
      }
    }
    if ( ! jsPeer_inside )
    {
      if ( jsPeer_last )
      {
        jsPeer_last.onShortcutCharacter  ( ev.getEvent() ) ;
      }
    }
    else
    {
      if ( jsPeer_first_before )
      {
        jsPeer_inside.setDecoration("normal") ;
        jsPeer_inside.closeAll("normal") ;
        jsPeer_first_before.onShortcutCharacter  ( ev.getEvent() ) ;
      }
      else
      {
        jsPeer_inside.setDecoration("normal") ;
        jsPeer_inside.closeAll("normal") ;
        if ( jsPeer_inside ) jsPeer_last.onShortcutCharacter  ( ev.getEvent() ) ;
      }
    }
  }
  else
  if ( ev.isCursorLeft() )
  {
    if ( this.parent.jsClassName == 'MenuItem' && this.parent.parent )
    {
      this.parent.parent.closeAll() ;
      for ( ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
      {
        if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
        if ( ch.jsPeer.dom.disabled ) continue ;
        if ( ch.jsPeer.state == 'inside' )
        {
          ch.jsPeer.setDecoration("normal") ;
	  break ;
        }
      }
      this.parent.setDecoration("inside") ;
    }
  }
  else
  if ( ev.isCursorRight() )
  {
    if ( this.openChild )
    {
      var first = true ;
      for ( ch = this.openChild.dom.firstChild ; ch ; ch = ch.nextSibling )
      {
        if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
        if ( ch.jsPeer.dom.disabled ) continue ;
        ch.jsPeer.setDecoration("inside") ;
        ch.jsPeer.closeAll() ;
        ch.jsPeer.onShortcutCharacter  ( ev.getEvent() ) ;
        break ;
      }
    }
    else
    {
      jsPeer_inside = null ;
      for ( ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
      {
        if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
        if ( ch.jsPeer.dom.disabled ) continue ;
        if ( ch.jsPeer.state == 'inside' )
        {
          jsPeer_inside = ch.jsPeer ;
          ch.jsPeer.onShortcutCharacter  ( ev.getEvent(), true ) ;
	  break ;
        }
      }
      if ( ! jsPeer_inside )
      {
        for ( ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
        {
          if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
          if ( ch.jsPeer.dom.disabled ) continue ;
          ch.jsPeer.setDecoration ( "inside" ) ;
	  break ;
        }
      }
    }
  }
} ;
MenuPane.prototype.onkeyup = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( ev.isCursorUp() || ev.isCursorDown() )
  {
    ev.consume() ;
    return ;
  }
} ;
MenuPane.prototype.onkeydown = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( ev.isEscape() )
  {
    if ( this.parent.jsClassName == 'MenuItem' && this.parent.parent )
    {
      this.parent.closeAll ( "normal" ) ;
      if ( TSys.menuShortcuts ) TGlobalEventHandler.setFocus ( this.parent.parent.dom ) ;
      return ;
    }
  }
  if ( ev.isCursorUp() || ev.isCursorDown() || ev.isCursorLeft() || ev.isCursorRight() )
  {
    ev.consume() ;
    // if ( Tango.ua.opera ) return ;
    this._handleCursorKeys ( ev ) ;
    return ;
  }
} ;
MenuPane.prototype.onkeypress = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( ev.isCursorUp() || ev.isCursorDown() || ev.isCursorLeft() || ev.isCursorRight() )
  {
    if ( ! Tango.ua.opera ) return ;
    // this._handleCursorKeys ( ev ) ;
    return ;
  }
  if ( ev.isEnter() )
  {
    for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      if ( ch.jsPeer.dom.disabled ) continue ;
      if ( ch.jsPeer.state == 'inside' )
      {
        ch.jsPeer.onShortcutCharacterClick ( event ) ;
	break ;
      }
    }
    return ;
  }
} ;
//-----------------------
MenuPane.prototype.isAnimated = function()
{
  return TGui.isMenuAnimated() ;
};
MenuPane.prototype.mousemove = function ( event )
{
  this.mouseMoved = true ;
};
MenuPane.prototype._initialize = function()
{
};
MenuPane.prototype.getMenuItemInstance = function ( parent, xMenuButton )
{
  return new MenuItem ( parent, xMenuButton ) ;
};
MenuPane.prototype.getMenuTitleInstance = function ( parent, xMenuButton )
{
  return new MenuTitle ( parent, xMenuButton ) ;
};
MenuPane.prototype.getMenuSeparatorInstance = function ( parent, xMenuButton )
{
  return new MenuSeparator ( parent, xMenuButton ) ;
};
MenuPane.prototype.getRoot = function()
{
  return this.parent.getRoot() ;
};
MenuPane.prototype.getAnchorElement = function()
{
  return this.parent.getAnchorElement() ;
};
MenuPane.prototype.getNormalCssClassName = function()
{
  var pxml = Tango.getThemeXml ( "Menu" ) ;
  if ( pxml.getBoolAttribute ( "pure-css", false ) )
  {
    return pxml.get ( "normal" ).getAttribute ( "class" ) ;
  }
  return "ThemeMenu" ;
} ;
MenuPane.prototype.getBackgroundImageUrl = function ( menuPaneType )
{
  var pxml = Tango.getThemeXml ( "Menu" ) ;
  if ( pxml.getBoolAttribute ( "pure-css", false ) )
  {
    var state = "normal" ;
    var x = null ;
    var clazz = null ;
    if ( menuPaneType )
    {
      var t = menuPaneType.type ;
      if ( t )
      {
        x = pxml.get ( t ) ;
        if ( x ) clazz = x.getAttribute ( "class" ) ;
      }
    }
    if ( ! clazz )
    {
      x = pxml.get ( "normal" ) ;
      clazz = x.getAttribute ( "class" ) ;
    }
    if ( clazz )
    {
      return "css:" + clazz ;
    }
    return ;
  }

  var s = this.getSize() ;
  return TGui.buildThemeBackgroundImageUrl ( "Menu", "normal", s.width, s.height ) ;
};
MenuPane.prototype._open = function ( event, menuPaneType )
{
  var bgurl = this.getBackgroundImageUrl ( menuPaneType ) ;
  if ( bgurl.indexOf ( "css:" ) === 0 )
  {
    this.dom.style.backgroundImage = "" ;
    this.dom.className = bgurl.substring ( 4 ) ;
  }
  else
  {
    this.dom.style.backgroundImage = bgurl ;
  }
  if ( ! this.isAnimated() )
  {
    if ( TSys.isIE6() )
    {
      TGui.setAllInputVisible ( null, this.getBounds(), false, this.dom ) ;
    }
    this.dom.style.visibility = "visible" ;
    if ( TSys.menuShortcuts ) TGlobalEventHandler.setFocus ( this.dom ) ;
    return ;
  }
var thiz = this ;
var isize = this.getSize() ;
var an = new ComponentAnimator ( this ) ;
an.animate ( { onStart: function()
               {
                 var c = this.getComponent() ;
                 var bounds = c.getBounds() ;
                 var innerSize = c.getInnerSize() ;
                 c.dom.style.overflow = "hidden" ;
                 var x0 = bounds.x ;
                 var y0 = bounds.y ;
                 c.setLocation ( x0, y0 ) ;
                 c.dom.style.width = "20px" ;
                 c.dom.style.height = "20px" ;
                 c.setVisible ( true ) ;
                 this.addSubjects (
                 {
                   top:{ from: y0, to: bounds.y }
                 , left:{ from: x0, to: bounds.x }
                 , width:{ from: 20, to: innerSize.width }
                 , height:{ from: 20, to: innerSize.height }
                 } ) ;
               },
               options:
               {
                 onComplete: function()
                 {
                   thiz.setSize ( isize.width, isize.height ) ;
                   if ( TSys.menuShortcuts ) TGlobalEventHandler.setFocus ( thiz.dom ) ;
                 }
               }
             }
 ) ;
an.start() ;
};
MenuPane.prototype.closeAll = function(state)
{
  if ( TSys.isIE6() )
  {
    TGui.setAllInputVisible ( null, this.getBounds(), true, this.dom ) ;
  }
  if ( this.openChild )
  {
    if ( TSys.menuShortcuts ) TGlobalEventHandler.setFocus ( this.dom ) ;
  }
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    ch.jsPeer.setDecoration(state) ;
    ch.jsPeer.closeAll(state) ;
  }
  this.openChild = null ;
};
MenuPane.prototype.setEnabled = function ( state )
{
  state = state ? true : false ;
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    ch.jsPeer.setEnabled ( state ) ;
  }
};
MenuPane.prototype.getItem = function ( name )
{
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.name == name ) return ch.jsPeer ;
  }
};
MenuPane.prototype.flushAll = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  while ( this.dom.firstChild )
  {
    if ( this.dom.firstChild.nodeType != DOM_ELEMENT_NODE )
    {
      this.dom.removeChild ( this.dom.firstChild ) ;
      continue ;
    }
    this.dom.firstChild.jsPeer.flushAll() ;
  }
  TGui.flushAttributes ( this.dom, true ) ;
  this.dom.parentNode.removeChild ( this.dom ) ;
  this.dom = undefined ;
  if ( this.onopen ) this.onopen.flush() ;
  this.onopen = undefined ;
};
MenuPane.prototype._findButton = function ( a, index )
{
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.name == a[index] )
    {
      if ( index >= a.length - 1 ) return ch.jsPeer ;
      return ch.jsPeer._findButton ( a, index+1 ) ;
    }
  }
  return undefined ;
};
MenuPane.prototype.getChildNames = function()
{
  var a = [] ;
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.name )
    {
      a.push ( ch.name ) ;
    }
  }
  return a ;
};
/**
 *  @constructor
 *  @extends TComponent
 */
var MenuButton = function ( parent, axl, xClassName )
{
  if ( ! parent )
  {
    Tango.initSuper( this, TComponent, null );
    return ;
  }
  this.parent = parent ;
  var dom = document.createElement ( "div" ) ;
  Tango.initSuper( this, TComponent, dom );
  this.jsClassName = "MenuButton" ;
  this.parent.dom.appendChild ( dom ) ;
  this.dom.style.position = "absolute" ;
  this.dom.className = "Theme"  + xClassName ;
  this.dom.xClassName = xClassName ;
  this._initialize() ;
  var name = axl.getAttribute ( "name", "" ) ;
  this.setName ( name ) ;
  this.state = "normal" ;
  if ( axl.getAttribute ( "onclick" ) )
  {
    this.onclick = new TFunctionExecutor ( axl.getAttribute ( "onclick" ), this.getRoot().getPagelet() ) ;
  }
  if ( axl.getAttribute ( "onopen" ) )
  {
    this.onopen = new TFunctionExecutor ( axl.getAttribute ( "onopen" ), this.getRoot().getPagelet() ) ;
  }
  if ( axl.getBoolAttribute ( "disabled", false ) ) dom.disabled = true ;
  if ( axl.getAttribute ( "tooltip" ) )
  {
    this.dom.tooltip = axl.getAttribute ( "tooltip" ) ;
    TGui.addEventListener ( this.dom, "mouseover", TGui.tooltipOver ) ;
    TGui.addEventListener ( this.dom, "mouseout", TGui.tooltipOut ) ;
    TGui.addEventListener ( this.dom, "mousedown", TGui.tooltipClose ) ;
  }
  this.imgWidth = axl.getIntAttribute ( "img-width", 16 ) ;
  this.imgHeight = axl.getIntAttribute ( "img-height", 16 ) ;
  if ( ! this.imgWidth ) this.imgWidth = this.imgHeight ;
  if ( ! this.imgHeight ) this.imgHeight = this.imgWidth ;
  this.path = "" ;
  if ( this.dom.name )
  {
    var p = parent ;
    if ( p instanceof MenuPane ) p = p.parent ;
    if ( p._isRoot ) this.path = this.dom.name ;
    else
    if ( p.path ) this.path = p.path + "/" + this.dom.name ;
    if ( p.path && typeof  ( this.getRoot().pathToDisabledState[this.path] ) != 'undefined' )
    {
      this.dom.disabled = this.getRoot().pathToDisabledState[this.path] ;
    }
  }
  var text = this.createText ( axl ) ;
  this.dom.innerHTML = text ;
  this._layout() ;
  if ( this.dom.disabled ) this.setDecoration ( "disabled" ) ;
  else                     this.setDecoration ( "normal" ) ;
  if ( Tango.ua.realMobile )
  {
    this.addEventListener ( "touchend", this, this.mouseout ) ;
    this.addEventListener ( "touchstart", this, this.mousedown ) ;
    this.addEventListener ( "click", this, this.mouseclick ) ;
  }
  else
  {
    this.addEventListener ( this ) ;
    if ( this.shortcutCharacter )
    {
      if ( this.onclick )
      {
        this.feOnShortcutCharacterClick = new TFunctionExecutor ( this, this.onShortcutCharacterClick ) ;
        TGlobalEventHandler.addToShortCutList ( this.shortcutCharacter, this.dom, this.feOnShortcutCharacterClick ) ;
      }
      else
      {
        this.feOnShortcutCharacter = new TFunctionExecutor ( this, this.onShortcutCharacter, [ true ] ) ;
        TGlobalEventHandler.addToShortCutList ( this.shortcutCharacter, this.dom, this.feOnShortcutCharacter ) ;
      }
    }
  }
  if ( ! axl.isEmpty() )
  {
    this.xMenuPane = axl ;
  }
  this.dom.jsPeer = this ;
  this._flushed = false ;
};
MenuButton.inherits( TComponent );
MenuButton.prototype._initialize = function()
{
};
MenuButton.prototype.setDecoration = function ( state, event )
{
  var width  = this.dom.offsetWidth ;
  var height = this.dom.offsetHeight ;
  var clazz = this.dom.xClassName ;
  if ( ! clazz ) clazz = this.dom.className ;
  var url = null ;

  var ev ;
  if ( event ) ev = new TEvent ( event ) ;
  this.state = state ;
  if ( this.dom.disabled )
  {
    this.dom.className = "Theme" + clazz + "Disabled" ;
    state = "disabled" ;
    url = TGui.buildThemeBackgroundImageUrl ( clazz, state, width, height ) ;
    if ( this.dom.eCloser && this.menuRightArrowImage ) this.dom.eCloser.src = this.menuRightArrowImage ;
    if ( this.dom.eCloser && this.menuDownArrowImage ) this.dom.eCloser.src = this.menuDownArrowImage ;
    if ( this.dom.eImg ) TGui.setOpacity ( this.dom.eImg, 0.5 ) ;
  }
  else
  {
    if ( ! ( this instanceof MenuItem ) )
    {
      if ( this.parent.openChild && this.parent.openChild == this.menuPane )
      {
        state = "pressed" ;
      }
    }
    url = TGui.buildThemeBackgroundImageUrl ( clazz, state, width, height ) ;
    if ( state == "inside" )
    {
      this.dom.className = "Theme" + clazz + "Inside" ;
      if ( this.dom.eCloser && this.menuRightArrowImageInside ) this.dom.eCloser.src = this.menuRightArrowImageInside ;
      if ( this.dom.eCloser && this.menuDownArrowImageInside ) this.dom.eCloser.src = this.menuDownArrowImageInside ;
    }
    else
    if ( state == "pressed" ) this.dom.className = "Theme" + clazz + "Pressed" ;
    else
    if ( state == "disabled" )
    {
      this.dom.className = "Theme" + clazz + "Disabled" ;
      if ( this.dom.eImg ) TGui.setOpacity ( this.dom.eImg, 0.5 ) ;
    }
    else
    {
      if ( this.dom.eCloser && this.menuRightArrowImage ) this.dom.eCloser.src = this.menuRightArrowImage ;
      if ( this.dom.eCloser && this.menuDownArrowImage ) this.dom.eCloser.src = this.menuDownArrowImage ;
      this.dom.className = "Theme" + clazz ;
      if ( this.dom.eImg ) TGui.setOpacity ( this.dom.eImg, 1.0 ) ;
    }
  }
  this.dom.style.backgroundImage = url ;
};
MenuButton.prototype.getRoot = function()
{
  return this.parent.getRoot() ;
};
MenuButton.prototype.getAnchorElement = function()
{
  return this.parent.getAnchorElement() ;
};
MenuButton.prototype._findButton = function ( a, index )
{
  if ( ! this.menuPane ) return undefined ;
  return this.menuPane._findButton ( a, index ) ;
};
MenuButton.prototype._layout = function()
{
  var d = this.dom ;
  TGui.layoutButtonLike ( { dom:d, imgWidth:this.imgWidth, imgHeight:this.imgHeight } ) ;
  if ( d.disabled && d.eImg ) TGui.setOpacity ( d.eImg, 0.5 ) ;
};
MenuButton.prototype.setSize = function ( w, h )
{
  this._super_.setSize.apply ( this, arguments ) ;
  TGui.layoutButtonLike ( { dom:this.dom
		           , imgWidth:this.imgWidth
		           , imgHeight:this.imgHeight
		           , contentOnly:true
			   } ) ;
  if ( this.dom.disabled ) this.setDecoration ( "disabled" ) ;
  else                     this.setDecoration ( "normal" ) ;
};
MenuButton.prototype.createText = function ( axl )
{
  var txml ;
  var text = axl.getAttribute ( "text" ) ;
  if ( ! text ) text = "No Text" ;
  var p = TGui.renderShortcutText ( text ) ;
  text = p.text ;
  this.shortcutCharacter = p.shortcutCharacter ;
  text = "<span class='ButtonText' >" + text + "</span>" ;
  var img = axl.getAttribute ( "img" ) ;
  if ( img )
  {
    img = TGui.translateImageName ( img ) ;
    text = "<img style='width:" + this.imgWidth + "px;height:" + this.imgHeight + "px;' class='ButtonImage' src='" + img + "' />" + text ;
  }
  if ( ! axl.isEmpty() )
  {
    txml = Tango.getThemeXml ( "MenuButton" ) ;
    if ( txml && txml.getBoolAttribute ( "show-arrow", false ) )
    {
      txml = Tango.getThemeXml ( "Arrow", [ "menu.down", "down" ] ) ;
      var arrowName = txml.getName() ;
      var w = txml.getIntAttribute ( "width", 11 ) ;
      var h = txml.getIntAttribute ( "height", 11 ) ;
      this.menuDownArrowImage = TGui.buildThemeImageUrl ( "Arrow", arrowName ) ;

      txml = Tango.getThemeXml ( "Arrow", [ "menu.down.inside", "down.inside" ] ) ;
      if ( ! txml ) this.menuDownArrowImageInside = this.menuRightArrowImage ;
      else
      {
        arrowName = txml.getName() ;
        this.menuDownArrowImageInside = TGui.buildThemeImageUrl ( "Arrow", arrowName ) ;
      }
      text += "<img style='position:absolute;width:" + w + "px;height:" + h + "px;' class='Arrow' src='" + this.menuDownArrowImage + "' />" ;
    }
  }
  return text ;
};
MenuButton.prototype.getChildNames = function()
{
  var a = [] ;
  if ( ! this.xMenuPane ) return a ;
  var en = this.xMenuPane.elements() ;
  while ( en.hasNext() )
  {
    var x = en.nextXml() ;
    if ( x.getAttribute ( "name" ) ) a.push ( x.getAttribute ( "name" ) ) ;
  }
  return a ;
};
MenuButton.prototype.closeAll = function(state)
{
  this.mouseIsDown = false ;
  if ( ! this.menuPane ) return ;
  this.parent.openChild = null ;
  this.menuPane.closeAll(state) ;
  this.menuPane.dom.style.visibility = "hidden" ;
};
MenuButton.prototype.flushAll = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  this.parent.openChild = null ;
  if ( this.menuPane )
  {
    this.menuPane.flushAll() ;
  }
  this.menuPane = undefined ;
  this.xMenuPane = undefined ;
  TGui.flushAttributes ( this.dom, true ) ;
  this.dom.parentNode.removeChild ( this.dom ) ;
  this.dom = undefined ;
  if ( this.onopen ) this.onopen.flush() ;
  this.onopen = undefined ;
  if ( this.feOnShortcutCharacter ) this.feOnShortcutCharacter.flush() ;
  this.feOnShortcutCharacter = undefined ;
  if ( this.feOnShortcutCharacterClick ) this.feOnShortcutCharacterClick.flush() ;
  this.feOnShortcutCharacterClick = undefined ;
};
MenuButton.prototype.flushChildren = function()
{
  this.parent.openChild = null ;
  if ( this.menuPane )
  {
    this.menuPane.flushAll() ;
  }
  this.menuPane = undefined ;
};
MenuButton.prototype.getMenuPaneInstance = function ( minimumWidth )
{
  return new MenuPane ( this, this.xMenuPane, minimumWidth ) ;
};
MenuButton.prototype._openPane = function ( event, menuPaneType )
{
  if ( ! this.menuPane && this.xMenuPane )
  {
    this.menuPane = this.getMenuPaneInstance() ;
  }
  if ( this.menuPane )
  {
    if ( this.onopen )
    {
      var ev = new TMenuEvent ( event ) ;
      var root = this.getRoot() ;
      ev.setHtmlSource ( this.dom ) ;
//      ev.setHtmlSource ( this.getAnchorElement() ) ;
      ev.menuItem = this ;
      ev.menuPane = this.menuPane ;
      ev.menuRoot = root ;
      var rc = this.onopen.executeWithEvent ( ev ) ;
      if ( typeof ( rc ) == 'boolean' && ! rc ) return ;
    }
    var p = this.getLocationOnPage() ;
    var size = this.getSize() ;
    p.y += size.height ;
    var bsize = TGui.getBrowserWindowSize() ;
    var psize = this.menuPane.getSize() ;
    if ( p.x + psize.width > bsize.width )
    {
      p.x -= psize.width - size.width;
    }
    this.menuPane.setLocation ( p ) ;
    this.parent.openChild = undefined ;
    this.menuPane._open ( event, menuPaneType ) ;
    this.parent.openChild = this.menuPane ;
    this.setDecoration ( this.state ) ;
  }
};
MenuButton.prototype.setEnabled = function ( state )
{
  this._super_.setEnabled.apply ( this, arguments ) ;
  if ( this.dom.disabled ) this.setDecoration ( "disabled" ) ;
  else                     this.setDecoration ( "normal" ) ;
};
MenuButton.prototype.onShortcutCharacter = function ( event, openChild )
{
  var ch ;
  var ev = new TEvent ( event ) ;
  ev.consume() ;
  if ( this instanceof MenuItem )
  {
    if ( this.dom.disabled ) return ;
    if ( openChild )
    {
      this.mouseover ( event ) ;
      var first = true ;
      for ( ch = this.parent.openChild.dom.firstChild ; ch ; ch = ch.nextSibling )
      {
        if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
        if ( ch.jsPeer.dom.disabled ) continue ;
        if ( first )
	      {
          first = false ;
          ch.jsPeer.setDecoration ( "inside" ) ;
          continue ;
        }
        if ( ch.jsPeer.state == 'inside' )
        {
          ch.jsPeer.setDecoration ( "normal" ) ;
        }
      }
    }
    else
    {
      for ( ch = this.parent.dom.firstChild ; ch ; ch = ch.nextSibling )
      {
        if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
        if ( ch.jsPeer.dom.disabled ) continue ;
        if ( ch.jsPeer.state == 'inside' )
        {
          ch.jsPeer.setDecoration ( "normal" ) ;
	        break ;
        }
      }
      this.setDecoration ( "inside" ) ;
    }
    return ;
  }
  else
  {
    if ( this.menuPane && this.menuPane.isVisible() ) return ;
    this.mousedown ( event ) ;
    if ( ! this.menuPane ) return ;
    for ( ch = this.menuPane.dom.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      if ( ch.jsPeer.dom.disabled ) continue ;
      ch.jsPeer.mousedown ( event ) ;
      ch.jsPeer.setDecoration ( "inside" ) ;
      break ;
    }
  }
};
MenuButton.prototype.onShortcutCharacterClick = function ( event )
{
  this.mouseup ( event ) ;
  var ev = new TEvent ( event ) ;
  ev.consume() ;
  if ( this instanceof MenuItem )
  {
    this.setDecoration ( "normal", event ) ;
  }
};

MenuButton.prototype.mouseover = function ( event )
{
  if ( this.dom.disabled ) return ;
  var ev = new TEvent ( event ) ;
  if ( this.state !== "inside" )
  {
    this.setDecoration ( "inside", event ) ;
  }
  if ( this instanceof MenuItem )
  {
    if ( this.parent.openChild && this.parent.openChild == this.menuPane ) return ;
    if ( this.parent.openChild )
    {
      this.parent.closeAll() ;
      this.setDecoration ( "inside", event ) ;
    }
    if ( this.menuPane || this.xMenuPane )
    {
      this._openPane ( event, { type: "child" } ) ;
    }
  }
  else
  {
    if ( ! this.parent.openChild )
    {
      if ( Tango.ua.realMobile )
      {
        this._openPane ( event, { type: "first" } ) ;
      }
      else
      {
        this.parent.startMenuTimer ( this, { type: "first" } ) ;
      }
      return ;
    }
    if ( this.parent.openChild == this.menuPane ) return ;
    if ( this.parent.openChild )
    {
      this.parent.closeAll() ;
    }
    if ( this.menuPane || this.xMenuPane )
    {
      this._openPane ( event, { type: "first" } ) ;
    }
  }
};
MenuButton.prototype.mouseout = function ( event )
{
  if ( this.dom.disabled ) return ;

  var ev = new TEvent ( event ) ;
  if ( ev.getSource() !== this.dom )
  {
    return ;
  }
  if ( this.inside ( event ) )
  {
    return ;
  }
  if ( this.parent instanceof Menubar ) this.parent.stopMenuTimer() ;
  this.setDecoration ( "normal", event ) ;
  this.mouseIsDown = false ;
};
MenuButton.prototype.mousedown = function ( event )
{
  if ( this.dom.disabled ) return ;
  this.mouseIsDown = true ;
  if ( this instanceof MenuItem )
  {
    if ( Tango.ua.realMobile )
    {
      if ( this.menuPane || this.xMenuPane )
      {
        this.setDecoration ( "pressed", event ) ;
        this.parent.closeAll() ;
        this._openPane ( event, { type: "child" } ) ;
      }
    }
    else
    {
      if ( ! this.menuPane && ! this.xMenuPane ) this.setDecoration ( "pressed", event ) ;
    }
  }
  else
  {
    var ev = new TMenuEvent ( event ) ;
    this.setDecoration ( "pressed", event ) ;
    if ( this.menuPane || this.xMenuPane )
    {
      if ( this.parent instanceof Menubar ) this.parent.stopMenuTimer() ;
      if ( this.menuPane === this.parent.openChild ) return ;
      this.parent.closeAll("normal") ;
      this._openPane ( event, { type: "first" } ) ;
    }
    if ( !Tango.ua.realMobile )
    {
      ev.consume() ;
    }
  }
};
MenuButton.prototype.mouseclick = function ( event )
{
  if ( ! Tango.ua.realMobile ) return ;
  this.mouseup ( event, true ) ;
};
MenuButton.prototype.mouseup = function ( event, ignoreDecoration )
{
  if ( this.dom.disabled ) return ;
  var ev = new TMenuEvent ( event ) ;

  var state = undefined ;
  if ( ev.isKeyEvent() ) state = "normal" ;
  if ( ! ignoreDecoration ) this.setDecoration ( "inside", event ) ;
  if ( ! Tango.ua.realMobile )
  {
    if ( ev.isMouseEvent() )
    {
      if ( ! this.mouseIsDown )
      {
        if ( ! this.parent.mouseMoved ) return ;
      }
    }
  }
  var fe = this.onclick ;
  if ( ! fe ) fe = this.getRoot().getDefaultAction() ;
  if ( fe )
  {
    var root = this.getRoot() ;
    ev.setHtmlSource ( this.getAnchorElement() ) ;
    ev.menuItem = this ;
    ev.menuPane = this.parent ;
    ev.menuRoot = root ;
    // try
    {
      fe.executeWithEvent ( ev ) ;
      if ( this._flushed ) return ;
      root.closeAll(state) ;
    }
    // catch ( exc )
    // {
    //   if ( this._flushed ) return ;
    //   root.closeAll(state) ;
    //   throw exc ;
    // }
    return ;
  }
  if ( this.menuPane || this.xMenuPane )
  {
    return ;
  }
  this.getRoot().closeAll(state) ;
};
/**
 *  @constructor
 *  @extends MenuButton
 */
var MenuItem = function ( parent, axl, xClassName )
{
  if ( ! parent )
  {
    Tango.initSuper( this, MenuButton, null );
    return ;
  }
  var dom = document.createElement ( "div" ) ;
  Tango.initSuper( this, MenuButton, parent, axl, xClassName ? xClassName : "MenuItem" );
  this.jsClassName = "MenuItem" ;
};
MenuItem.inherits( MenuButton );
MenuItem.prototype.createText = function ( axl )
{
  var txml, w ;
  var text = axl.getAttribute ( "text" ) ;
  if ( ! text ) text = "No Text" ;
  var p = TGui.renderShortcutText ( text, TSys.getWebConfig().menuShortcuts ) ;
  text = p.text ;
  this.shortcutCharacter = p.shortcutCharacter ;
  text = "<span class='ButtonText' >" + text + "</span>" ;
  var img = axl.getAttribute ( "img" ) ;
  if ( img )
  {
    img = TGui.translateImageName ( img ) ;
    text = "<img style='width:16px;height:16px;' class='ButtonImage' src='" + img + "' />" + text ;
    txml = Tango.getThemeXml ( "MenuItem" ) ;
    this.imgLeft = txml.getIntAttribute ( "img-left", 0 ) ;
  }
  if ( ! axl.isEmpty() )
  {
    txml = Tango.getThemeXml ( "Arrow", [ "menu.right", "right" ] ) ;
    var arrowName = txml.getName() ;
    txml = Tango.getThemeXml ( "Arrow", arrowName ) ;
    w = txml.getIntAttribute ( "width", 11 ) ;
    var h = txml.getIntAttribute ( "height", 11 ) ;
    this.menuRightArrowImage = TGui.buildThemeImageUrl ( "Arrow", arrowName ) ;

    txml = Tango.getThemeXml ( "Arrow", [ "menu.right.inside", "right.inside" ] ) ;
    if ( ! txml ) this.menuRightArrowImageInside = this.menuRightArrowImage ;
    else
    {
      arrowName = txml.getName() ;
      this.menuRightArrowImageInside = TGui.buildThemeImageUrl ( "Arrow", arrowName ) ;
    }

    text += "<img style='position:absolute;width:" + w + "px;height:" + h + "px;' class='Arrow' src='" + this.menuRightArrowImage + "' />" ;
  }
  return text ;
};
MenuItem.prototype._layout = function()
{
  var d = this.dom ;
  TGui.layoutButtonLike ( { dom:d, imgWidth:this.imgWidth, imgHeight:this.imgHeight, closerClassName:'Arrow', imgIndent:true, alignLeft:true, imgLeft:this.imgLeft } ) ;
  if ( d.disabled && d.eImg ) this.setOpacity ( d.eImg, 0.5 ) ;
};
MenuItem.prototype.getMenuPaneInstance = function ( )
{
  return new MenuPane ( this, this.xMenuPane ) ;
};
MenuItem.prototype._openPane = function ( event, menuPaneType )
{
  if ( ! this.menuPane && this.xMenuPane )
  {
    this.menuPane = this.getMenuPaneInstance() ;
  }
  if ( this.menuPane )
  {
    if ( this.onopen )
    {
      var ev = new TMenuEvent ( event ) ;
      var root = this.getRoot() ;
      ev.setHtmlSource ( this.getAnchorElement() ) ;
      ev.menuItem = this ;
      ev.menuPane = this.menuPane ;
      ev.menuRoot = root ;
      var rc = this.onopen.executeWithEvent ( ev ) ;
      if ( typeof ( rc ) == 'boolean' && ! rc ) return ;
    }
    var p = this.getLocationOnPage() ;
    var size = this.getSize() ;
    var bsize = TGui.getBrowserWindowSize() ;
    var psize = this.menuPane.getSize() ;
    if ( p.x + size.width + psize.width > bsize.width )
    {
      p.x -= psize.width ;
    }
    else
    {
      p.x += size.width ;
    }
    this.menuPane.setLocation ( p ) ;
    this.parent.openChild = undefined ;
    this.menuPane._open ( event, menuPaneType ) ;
    this.parent.openChild = this.menuPane ;
  }
};
/**
 *  @constructor
 *  @extends MenuItem
 */
var MenuTitle = function ( parent, axl, xClassName )
{
  if ( ! parent )
  {
    Tango.initSuper( this, MenuItem, null );
    return ;
  }
  Tango.initSuper( this, MenuItem, parent, axl, xClassName ? xClassName : "MenuItem" );
  this.jsClassName = "MenuTitle" ;
};
MenuTitle.inherits( MenuItem );
MenuTitle.prototype.mouseover = function ( event )
{
};
MenuTitle.prototype.mouseout = function ( event )
{
};
MenuTitle.prototype.mousedown = function ( event )
{
};
MenuTitle.prototype.mouseup = function ( event )
{
};
MenuTitle.prototype._layout = function()
{
  MenuItem.prototype._layout.apply ( this, arguments ) ;
  this.dom.style.fontWeight = 'bold' ;
  var pad = TGui.getPadding ( this.dom ) ;
  var x = Math.floor ( ( this.dom.offsetWidth - this.dom.eTxt.offsetWidth ) / 2 ) ;
  x += pad.left ;
  this.dom.eTxt.style.left = x + "px" ;
};
var MenuSeparator = function ( parent, axl, xClassName )
{
  if ( ! parent )
  {
    Tango.initSuper( this, MenuItem, null );
    return ;
  }
  Tango.initSuper( this, MenuItem, parent, axl, xClassName ? xClassName : "MenuItem" );
  this.jsClassName = "Separator" ;
};
MenuSeparator.inherits( MenuItem );
MenuSeparator.prototype.mouseover = function ( event )
{
};
MenuSeparator.prototype.mouseout = function ( event )
{
};
MenuSeparator.prototype.mousedown = function ( event )
{
};
MenuSeparator.prototype.mouseup = function ( event )
{
};
MenuSeparator.prototype.createText = function ( x )
{
};
MenuSeparator.prototype.setSize = function ( w, h )
{
};
MenuSeparator.prototype._layout = function()
{
  MenuItem.prototype._layout.apply ( this, arguments ) ;
  // this.dom.style.backgroundColor = 'red' ;
  this.dom.style.height = '0px' ;
  this.dom.style.paddingTop = '0px' ;
  this.dom.style.paddingBottom = '2px' ;
  this.dom.style.borderTopWidth = '1px' ;
  this.dom.style.borderTopStyle = 'solid' ;
  // var fg = TGui.getComputedStyle ( this.dom, "color" ) ;
  // this.dom.style.borderTopColor = 'black' ;
  var c = new TXml ( this.dom ) ;
  c.removeAllChildren() ;
};


/**
 *  @constructor
 *  @extends TEvent
 */
var TMenuEvent = function ( event )
{
  Tango.initSuper( this, TEvent, event, TEvent.prototype.MENU );
  this.jsClassName = "TMenuEvent" ;
};
TMenuEvent.inherits( TEvent ) ;
TMenuEvent.prototype.getRoot = function() { return this.menuItem.getRoot() ; };
TMenuEvent.prototype.getMenu = function() { return this.menuPane ; };
TMenuEvent.prototype.getMenuItem = function() { return this.menuItem ; };

/**
 *  @constructor
 *  @extends MenuContainer
 *  @param {axl} the axl definition
 */
var PopupMenu = function ( id, anchorElement )
{
  if ( typeof ( id ) == 'string' )
  {
    id = new TXml ( TSys.getAxl ( id ) ) ;
  }
  Tango.initSuper( this, MenuContainer, id );
  this.jsClassName = "PopupMenu" ;
  if ( ! this.axl ) return ;
  this.xMenuPane = this.axl.first() ;
  this.onopen = this.xMenuPane.getAttribute ( "onopen", "" ) ;
  this.anchorElement = anchorElement ;
  this.dom = anchorElement ;
  this.first = true ;
  this.showType = this.SHOW_MOUSE ;
  this.setShowPosition ( this.xMenuPane.getAttribute ( "position" ) ) ;
  this._onopenInternal = false ;
};
PopupMenu.inherits( MenuContainer );
PopupMenu.prototype.SHOW_UNDER = 1 ;
PopupMenu.prototype.SHOW_RIGHT = 2 ;
PopupMenu.prototype.SHOW_CENTER = 3 ;
PopupMenu.prototype.SHOW_MOUSE = 4 ;
PopupMenu.prototype.SHOW_OVER = 5 ;
PopupMenu.prototype.setAnchorElement = function ( anchorElement )
{
  this.anchorElement = anchorElement ;
  this.dom = anchorElement ;
};
PopupMenu.prototype.setShowPosition = function ( position )
{
  if ( ! position ) return ;
  if ( position.toUpperCase() == 'UNDER' ) this.showType = this.SHOW_UNDER ;
  if ( position.toUpperCase() == 'OVER' ) this.showType = this.SHOW_OVER ;
  if ( position.toUpperCase() == 'CENTER' ) this.showType = this.SHOW_CENTER ;
  if ( position.toUpperCase() == 'RIGHT' ) this.showType = this.SHOW_RIGHT ;
  if ( position.toUpperCase() == 'MOUSE' ) this.showType = this.SHOW_MOUSE ;
} ;
PopupMenu.prototype.setMinimumWidth = function ( width )
{
  this.minimumWidth = width ;
} ;
PopupMenu.prototype.setOnClose = function ( fe )
{
  this.onclose = fe ;
} ;
PopupMenu.prototype.setShowOver = function()
{
  this.showType = this.SHOW_OVER ;
} ;
PopupMenu.prototype.setShowUnder = function()
{
  this.showType = this.SHOW_UNDER ;
};
PopupMenu.prototype.setShowCenter = function()
{
  this.showType = this.SHOW_CENTER ;
};
PopupMenu.prototype.setShowRight = function()
{
  this.showType = this.SHOW_RIGHT ;
};
PopupMenu.prototype.setShowMouse = function()
{
  this.showType = this.SHOW_MOUSE ;
};
PopupMenu.prototype.show = function ( event )
{
  var ev = new TEvent ( event ) ;
  var f = this.first ;
  if ( this.first )
  {
    this.first = false ;
    if ( this.onopen && typeof ( this.onopen ) == 'string' )
    {
      this._onopenInternal = true ;
      var pagelet = this.getRoot().getPagelet() ;
      if ( ! pagelet ) pagelet = ev.getPagelet() ;
      this.onopen = new TFunctionExecutor ( this.onopen, pagelet ) ;
    }
  }
  this._openPane ( event ) ;
  if ( f )
  {
    this.mouseDownAutoCloseVeto = 0 ;
    if ( ev.getGenericType() == 'mousedown' ) this.mouseDownAutoCloseVeto = 1 ;
    this._closeOnMouseDown = new TFunctionExecutor ( this, this.mouseDownAutoClose ) ;
    TGlobalEventHandler.addOnMouseDown ( this._closeOnMouseDown ) ;
    this._closeOnKeyDown = new TFunctionExecutor ( this, this.keyDownAutoClose ) ;
    TGlobalEventHandler.addOnKeyDown ( this._closeOnMouseDown ) ;
  }
};
PopupMenu.prototype.getMenuPaneInstance = function ( )
{
  return new MenuPane ( this, this.xMenuPane, this.minimumWidth ) ;
};
PopupMenu.prototype._openPane = function ( event )
{
  var ev ;
  if ( this.menuPane && this.menuPane.isVisible() )
  {
    return ;
  }
  if ( ! this.menuPane && this.xMenuPane )
  {
    this.menuPane = this.getMenuPaneInstance() ;
  }
  if ( this.menuPane )
  {
    var p = new TComponent ( this.anchorElement ).getBoundsOnPage() ;
    var size = this.menuPane.getSize() ;
    var x = 0 ;
    var y = 0 ;
    if ( this.showType == this.SHOW_OVER )
    {
      x = p.x ;
      y = p.y - size.height ;
    }
    else
    if ( this.showType == this.SHOW_UNDER )
    {
      x = p.x ;
      y = p.y + p.height ;
    }
    else
    if ( this.showType == this.SHOW_CENTER )
    {
      x = p.x + Math.floor ( ( p.width - size.width ) / 2 ) ;
      y = p.y + Math.floor ( ( p.height - size.height ) / 2 ) ;
    }
    else
    if ( this.showType == this.SHOW_MOUSE )
    {
      ev = new TEvent ( event ) ;
      x = ev.getX() ;
      y = ev.getY() ;
    }
    var bsize = TGui.getAdjustedBrowserWindowSize() ;
    if ( y + size.height > bsize.height )
    {
      y = bsize.height - size.height;
    }
    if ( x + size.width > bsize.width )
    {
      x = bsize.width - size.width;
    }
    if ( x < 0 ) x = 0 ;
    if ( y < 0 ) y = 0 ;
    this.menuPane.setLocation ( x, y ) ;
    if ( this.onopen && ! this.menuPane.isVisible() )
    {
      ev = new TMenuEvent ( event ) ;
      var root = this.getRoot() ;
      ev.setHtmlSource ( this.getAnchorElement() ) ;
      ev.menuItem = this ;
      ev.menuPane = this.menuPane ;
      ev.menuRoot = root ;
      var rc = this.onopen.executeWithEvent ( ev ) ;
      if ( typeof ( rc ) == 'boolean' && ! rc ) return ;
      var loc = this.menuPane.getLocation() ;
      if ( loc.x < 0 ) loc.x = 0 ;
      if ( loc.y < 0 ) loc.y = 0 ;
      if ( loc.y + size.height > bsize.height )
      {
        var overlap = loc.y + size.height - bsize.height ;
	var yy = Math.floor ( Math.max ( 0, loc.y - overlap ) ) ;
        loc.y = yy ;
      }
      this.menuPane.setLocation ( loc.x, loc.y ) ;
    }
    this.menuPane._open ( event, { type: 'top' } ) ;
  }
};
PopupMenu.prototype.closeAll = function()
{
  if ( ! this.menuPane ) return ;
  if ( this.onclose ) this.onclose.execute() ;
  this.onclose = undefined ;
  this.flush() ;
};
PopupMenu.prototype.flushAll = function()
{
  if ( this.onopen && this._onopenInternal ) this.onopen.flush() ;
  this.onopen = undefined ;
  if ( ! this.menuPane ) return ;
  this.menuPane.flushAll() ;
};
/**
 *  @constructor
 */
PopupMenuWrapper = function ( id, anchorElement )
{
  this.id = id ;
  this.anchorElement = anchorElement ;
  this.position = null ;
  if ( id instanceof TXml )
  {
    var xp = id.first() ;
    this.position = xp.getAttribute ( "position" ) ;
    this.triggerButton = xp.getAttribute ( "button" ) ;
    this.trigger = xp.getAttribute ( "trigger" ) ;
    this.popupClassName = xp.getAttribute ( "class" ) ;
    this.onclick = xp.getAttribute ( "onclick" ) ;
  }
  if ( anchorElement ) this.setAnchorElement ( anchorElement ) ;
  this.pm = null ;
};
PopupMenuWrapper.prototype =
{
  _setAdjustWidthToAnchor: function()
  {
    this._adjustWidthToAnchor = true ;
  },
  _setPopupXml: function ( popupXml )
  {
    this.id = popupXml ;
  },
  setPopupClass: function ( popupClass )
  {
    this.popupClass = popupClass ;
  },
  setAnchorElement: function ( anchorElement )
  {
    if ( anchorElement.jsPeer && typeof ( anchorElement.jsPeer.setPopupMenu ) == 'function' )
    {
      anchorElement.jsPeer.setPopupMenu ( this.id ) ;
      this.flush() ;
      return ;
    }
    this.anchorElement = anchorElement ;
    if ( ! this.anchorElement.xToBeFlushed ) this.anchorElement.xToBeFlushed = [] ;
    this.anchorElement.xToBeFlushed.push ( this ) ;
    if ( this.trigger == 'mousedown' )
    {
      TGui.addEventListener ( this.anchorElement, "mousedown", this.mouseTrigger.bindAsEventListener ( this ) ) ;
    }
    else
    {
      TGui.addEventListener ( this.anchorElement, "mouseup", this.mouseTrigger.bindAsEventListener ( this ) ) ;
    }
  },
  setLayoutContext: function ( layoutContext )
  {
    if ( this.onclick )
    {
      this.defaultAction = new TFunctionExecutor ( this.onclick, layoutContext ) ;
    }
  },
  _setDefaultAction: function ( fe )
  {
    this.defaultAction = fe ;
  },
  _setOnOpen: function ( fe )
  {
    this._onOpen = fe ;
  },
  _setOnClose: function ( fe )
  {
    this._onClose = fe ;
  },
  mouseTrigger: function ( event )
  {
    if ( this.anchorElement.disabled ) return ;
    var ev = new TEvent ( event ) ;
    if ( this.pm )
    {
      this.pm.closeAll() ;
      return false ;
    }
    if ( ev.isButtonLeft() && this.triggerButton == 'left' )
    {
    }
    else
    if ( ev.isButtonRight() )
    {
    }
    else
    if ( ev.isButtonLeft() && ev.isAlt() )
    {
    }
    else
    if ( ev.isButtonLeft() && ev.isShift() )
    {
    }
    else
    {
      return ;
    }
    if ( this.popupClassName )
    {
      var func = eval ( this.popupClassName ) ;
      if ( typeof ( func ) == 'function' )
      {
        this.pm = new func ( this.id, this.anchorElement ) ;
      }
    }
    else
    if ( this.popupClass )
    {
      this.pm = new this.popupClass ( this.id, this.anchorElement ) ;
    }
    else
    {
      this.pm = new PopupMenu ( this.id, this.anchorElement ) ;
    }
    this.pm.setDefaultAction ( this.defaultAction ) ;
    if ( this._adjustWidthToAnchor ) this.pm.setMinimumWidth ( this.anchorElement.offsetWidth ) ;
    this.pm.setOnClose ( new TFunctionExecutor ( this, this.onpmclose ) ) ;
    this.pm.setShowPosition ( this.position ) ;
    if ( this._onOpen && ! this.pm.onopen ) this.pm.onopen = this._onOpen ;
    this.pm.show ( event ) ;
    if ( this.anchorElement .nodeName.toUpperCase() === "BUTTON" )
    {
      setButtonDecoration ( this.anchorElement, "normal" ) ;
    }
    return false ;
  },
  onpmclose: function ( ev )
  {
    if ( this._onClose )
    {
      if ( ! ev )
      {
        ev = new TEvent() ;
        ev.setPeer ( this.pm ) ;
        ev.setHtmlSource ( this.pm.getDom() ) ;
      }
      this._onClose.executeWithEvent ( ev ) ;
    }
    this.pm = null ;
  },
  flush: function()
  {
    this.id = null ;
    this.anchorElement = null ;
  }
};
