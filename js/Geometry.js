var ContainerDecorator = function ( decoration )
{
  this.valid = false ;
  this.decoration = decoration ;
  this.decorationTypeFull = false ;
  if ( ! decoration ) decoration = "" ;
  this.decoration = decoration.trim() ;
  var dom ;
  var url ;
  if ( this.decoration.indexOf ( "cosmos" ) === 0 )
  {
    var part = this.decoration.substring ( this.decoration.lastIndexOf ( "/" ) + 1 ) ;
    if ( ! part ) return null ;
    var eStyle = Cosmos.getPart ( part ) ;
//TODO: part not found
    if ( ! eStyle ) return null ;
    var t = eStyle.getImageAsDecoratorString() ;
    this.scaledImageUrl = TGui.buildScaledImageUrl ( t ) ;
    this.decoration = eStyle.style ;
    this.decoration.type = "sliced" ;
    this.name = "normal" ;
    this.valid = true ;
  }
  else
  if ( this.decoration == "true" )
  {
    this.decoration = "ContainerDecoration" ;
    this.name = "normal" ;
    dom = Tango.getThemeDom ( this.decoration, this.name ) ;
    if ( dom ) this.valid = true ;
  } 
  else
  if ( this.decoration.charAt ( 0 ) == "{" && this.decoration.charAt ( this.decoration.length-1 ) ==  "}" )
  {
    this.name = "normal" ;
//    var deco="x={ src: 'img/deco-2.png', top: 4, left: 4, bottom: 4, right: 4 };"
    this.decoration = TSys.eval ( this.decoration ) ;
    if ( this.decoration.src &&
    this.decoration.src.indexOf ( "theme:" ) === 0 )
    {
      var pos = this.decoration.src.indexOf ( ':' ) ;
      var src = this.decoration.src.substring ( pos + 1 ) ;
      pos = src.indexOf ( '/' ) ;
      var type = src.substring ( 0, pos ) ;
      var state = src.substring ( pos + 1 ) ;
      this.decoration.type = "sliced" ;
      url = TSys.getImageFactoryServletName()
          + "?theme=" + Tango.getThemeName()
          + "&type=" + type
          + "&state=" + state
          ;
      this.scaledImageUrl = url ;
    }
    else
    {
      this.scaledImageUrl = TGui.buildScaledImageUrl ( this.decoration ) ;
    }
    this.valid = true ;
  }
  else
  {
    this.decoration = "ContainerDecoration" ;
    this.name = decoration ;
    dom = Tango.getThemeDom ( this.decoration, this.name ) ;
    if ( dom )
    {
      var xdom = new TXml ( dom ) ;
      var oo = {} ;
      oo.border = {} ;
      oo.border.top = xdom.getIntAttribute ( "top", 0 ) ;
      oo.border.left = xdom.getIntAttribute ( "left", 0 ) ;
      oo.border.bottom = xdom.getIntAttribute ( "bottom", 0 ) ;
      oo.border.right = xdom.getIntAttribute ( "right", 0 ) ;
      oo.padding = {} ;
      if ( ! xdom.getBoolAttribute ( "padding-ignore", false ) )
      {
        oo.padding.top = xdom.getIntAttribute ( "padding-top", 0 ) ;
        oo.padding.left = xdom.getIntAttribute ( "padding-left", 0 ) ;
        oo.padding.bottom = xdom.getIntAttribute ( "padding-bottom", 0 ) ;
        oo.padding.right = xdom.getIntAttribute ( "padding-right", 0 ) ;
      }
      oo.pattern = {} ;
      oo.pattern.top = xdom.getBoolAttribute ( "pattern-top", false ) ;
      oo.pattern.left = xdom.getBoolAttribute ( "pattern-left", false ) ;
      oo.pattern.bottom = xdom.getBoolAttribute ( "pattern-bottom", false ) ;
      oo.pattern.right = xdom.getBoolAttribute ( "pattern-right", false ) ;
      var color = xdom.getAttribute ( "color" ) ;
      if ( color ) oo.color = color ;
      oo.type = "sliced" ;
      url = TSys.getImageFactoryServletName()
          + "?theme=" + Tango.getThemeName()
          + "&type=ContainerDecoration"
          + "&state=" + this.name
          ;
      this.scaledImageUrl = url ;
      this.decoration = oo ;
      this.valid = true ;
    }
  }
  this.htmlElement = null ;
};
ContainerDecorator.prototype =
{
  setHtmlElement: function ( htmlElement )
  {
    this.htmlElement = htmlElement ;
    if ( this.decoration
       && typeof ( this.decoration ) == 'object'
       && typeof ( this.decoration.type ) == 'string'
       && this.decoration.type == "sliced"
       )
    {
      var newElement = this._createDecoration ( htmlElement ) ;
      this.htmlElement = newElement ;
      newElement.decorator = this ;
      return newElement ;
    }
    return null ;
  },
  resized: function(e)
  {
//log ( new TComponent ( e ) ) ;
//log ( new TComponent ( this.child ) ) ;
    if ( ! this.valid ) return ;
    if ( ! this.decoration ) return ;
    var w = this.htmlElement.offsetWidth ;
    var h = this.htmlElement.offsetHeight ;
    var url ;
    if ( this.scaledImageUrl )
    {
      if ( typeof ( this.decoration.type ) == 'string' && this.decoration.type == "sliced" )
      {
      }
      else
      {
        var u = this.scaledImageUrl + "&width=" + w + "&height=" + h ;
        url = "url(" + u + ")" ;
        this.htmlElement.style.backgroundImage = url ;
      }
    }
    else
    {
      url = TGui.buildThemeBackgroundImageUrl ( this.decoration, this.name, w, h ) ;
      this.htmlElement.style.backgroundImage = url ;
    }
  },
  _createDecoration: function ( e )
  {
    var url = this.scaledImageUrl ;
    var o = this.decoration ;
    var padding = o.padding ;
    var color = o.color ;
    if ( color && typeof ( color ) == 'object' )
    {
      color = color.foreground ;
      bgcolor = color.background ;
    }

    if ( o.image )
    {
      o = o.image ;
    }
    var border = o ;
    if ( o.border ) border = o.border ;
    if ( ! padding )
    {
      padding = { top:0,left:0,bottom:0,right:0 } ;
    }
    if ( isNaN ( padding.top ) ) padding.top = 0 ;
    if ( isNaN ( padding.left ) ) padding.left = 0 ;
    if ( isNaN ( padding.bottom ) ) padding.bottom = 0 ;
    if ( isNaN ( padding.right ) ) padding.right = 0 ;
    var pattern = o.pattern ;
    if  ( ! pattern ) pattern = {} ;

    this.child = e ;
    var div = document.createElement ( "div" ) ;
    e.parentNode.insertBefore ( div, e ) ;
    if ( color ) e.style.color = color ;
//    if ( bgcolor ) e.style.backgroundColor = bgcolor ;

    div.xConstraints = e.xConstraints ;
    e.xConstraints = null ;
    div.isDecoratorPart = "div" ;
    e.isDecoratorPart = "child" ;

    div.style.position = "absolute" ;
//log ( "e.offsetTop: " + e.offsetTop ) ;
//log ( "e.style.top: " + e.style.top ) ;
//log ( "e.style.left: " + e.style.left ) ;
//    div.style.top = e.offsetTop + "px" ;
//    div.style.left = e.offsetLeft + "px" ;
    div.style.width = ( padding.left + padding.right + e.offsetWidth ) + "px" ;
    div.style.height = ( padding.top + 2*padding.bottom + e.offsetHeight ) + "px" ;
    if ( e.style.zIndex ) div.style.zIndex = e.style.zIndex ;

    if ( e.style.visibility )
    {
      div.style.visibility = e.style.visibility ;
      e.style.visibility = "inherit" ;
    }
    e.parentNode.removeChild ( e ) ;

    var tl = document.createElement ( "div" ) ;
    div.appendChild ( tl ) ;
    tl.style.position = "absolute" ;
    tl.style.padding = "0px" ;
    tl.style.top = "0px" ;
    tl.style.left = "0px" ;
    tl.style.width = border.left + "px" ;
    tl.style.height = border.top + "px" ;
    tl.style.backgroundImage = "url(" + url + "&part=top-left)" ;
    tl.name = "top-left" ;
    tl.isDecoratorPart = "tl" ;

    var t = null ;
    if ( pattern.top )
    {
      t = document.createElement ( "div" ) ;
    }
    else
    {
      t = document.createElement ( "img" ) ;
    }
    div.appendChild ( t ) ;
    t.style.position = "absolute" ;
    t.style.padding = "0px" ;
    t.style.top = "0px" ;
    t.style.left = border.left + "px" ;
    t.style.width = "100px" ;
    t.style.height = border.top + "px" ;
    if ( pattern.top )
    {
      t.style.backgroundImage = "url(" + url + "&part=top" + ")" ;
    }
    else
    {
      t.src = url + "&part=top" ;
    }
    t.xConstraints = new TConstraints() ;
    t.xConstraints.setRightAttachComponent() ;
    t.xConstraints.parseRight ( "-0" ) ;
    t.name = "top" ;
    t.isDecoratorPart = "t" ;

    var tr = document.createElement ( "div" ) ;
    div.appendChild ( tr ) ;
    tr.style.position = "absolute" ;
    tr.style.padding = "0px" ;
    tr.style.top = "0px" ;
    tr.style.width = border.right + "px" ;
    tr.style.height = border.top + "px" ;
    tr.style.backgroundImage = "url(" + url + "&part=top-right)" ;
    tr.xConstraints = new TConstraints() ;
    tr.xConstraints.parseRight ( "0" ) ;
    tr.name = "top-right" ;
    tr.isDecoratorPart = "tr" ;

    var l = document.createElement ( "img" ) ;
    div.appendChild ( l ) ;
    l.style.position = "absolute" ;
    l.style.padding = "0px" ;
    l.style.top = border.top + "px" ;
    l.style.left = "0px" ;
    l.style.width = border.left + "px" ;
    l.style.height = "100px" ;
    l.src = url + "&part=left" ;
    l.xConstraints = new TConstraints() ;
    l.xConstraints.setBottomAttachComponent() ;
    l.xConstraints.parseBottom ( "-0" ) ;
    l.name = "left" ;
    l.isDecoratorPart = "l" ;

    var m = document.createElement ( "img" ) ;
    div.appendChild ( m ) ;
    m.style.position = "absolute" ;
    m.style.padding = "0px" ;
    m.style.top = border.top + "px" ;
    m.style.left = border.left + "px" ;
    m.style.width = "100px" ;
    m.style.height = "100px" ;
    m.src = url + "&part=middle" ;
    m.xConstraints = new TConstraints() ;
    m.xConstraints.setRightAttachComponent() ;
    m.xConstraints.parseRight ( "-0" ) ;
    m.xConstraints.setBottomAttachComponent() ;
    m.xConstraints.parseBottom ( "-0" ) ;
    m.name = "middle" ;
    m.isDecoratorPart = "m" ;

    var r = document.createElement ( "img" ) ;
    div.appendChild ( r ) ;
    r.style.position = "absolute" ;
    r.style.padding = "0px" ;
    r.style.top = border.top + "px" ;
    r.style.width = border.right + "px" ;
    r.style.height = "100px" ;
    r.src = url + "&part=right" ;
    r.xConstraints = new TConstraints() ;
    r.xConstraints.parseRight ( "0" ) ;
    r.xConstraints.setBottomAttachComponent() ;
    r.xConstraints.parseBottom ( "-0" ) ;
    r.name = "right" ;
    r.isDecoratorPart = "r" ;

    div.appendChild ( document.createElement ( "br" ) ) ;

    var bl = document.createElement ( "div" ) ;
    div.appendChild ( bl ) ;
    bl.style.position = "absolute" ;
    bl.style.padding = "0px" ;
    bl.style.left = "0px" ;
    bl.style.width = border.left + "px" ;
    bl.style.height = border.bottom + "px" ;
    bl.style.backgroundImage = "url(" + url + "&part=bottom-left)" ;
    bl.xConstraints = new TConstraints() ;
    bl.xConstraints.parseBottom ( "0" ) ;
    bl.name = "bottom-left" ;
    bl.isDecoratorPart = "bl" ;

    var b = document.createElement ( "img" ) ;
    div.appendChild ( b ) ;
    b.style.position = "absolute" ;
    b.style.padding = "0px" ;
    b.style.left = border.left + "px" ;
    b.style.width = "100px" ;
    b.style.height = border.bottom + "px" ;
    b.src = url + "&part=bottom" ;
    b.xConstraints = new TConstraints() ;
    b.xConstraints.setRightAttachComponent() ;
    b.xConstraints.parseRight ( "-0" ) ;
    b.xConstraints.parseBottom ( "0" ) ;
    b.name = "bottom" ;
    b.isDecoratorPart = "b" ;

    var br = document.createElement ( "div" ) ;
    div.appendChild ( br ) ;
    br.style.position = "absolute" ;
    br.style.padding = "0px" ;
    br.style.width = border.right + "px" ;
    br.style.height = border.bottom + "px" ;
    br.style.backgroundImage = "url(" + url + "&part=bottom-right)" ;
    br.xConstraints = new TConstraints() ;
    br.xConstraints.parseRight ( "0" ) ;
    br.xConstraints.parseBottom ( "0" ) ;
    br.name = "bottom-right" ;
    br.isDecoratorPart = "br" ;

    l.xConstraints.setBottomComponent ( bl ) ;
    m.xConstraints.setBottomComponent ( b ) ;
    r.xConstraints.setBottomComponent ( br ) ;

    this.tl = tl ;
    this.t = t ;
    this.tr = tr ;
    this.l = l ;
    this.m = m ;
    this.r = r ;
    this.bl = bl ;
    this.b = b ;
    this.br = br ;

    div.appendChild ( e ) ;
    e.style.position = "absolute" ;
    e.style.top = padding.top + "px" ;
    e.style.left = padding.left + "px" ;
    e.xConstraints = new TConstraints() ;
    e.xConstraints.parseRight ( "-" + padding.right ) ;
    e.xConstraints.parseBottom ( "-" + padding.bottom ) ;
    return div ;
  },
  getMinimumWidth: function()
  {
    var w = 0 ;
    if ( this.l ) w += this.l.offsetWidth ;
    if ( this.r ) w += this.r.offsetWidth ;
    return w ;
  },
  flush: function()
  {
    if ( this._flushed ) return ;
    this._flushed = true ;
    this.tl = null ;
    this.t = null ;
    this.tr = null ;
    this.l = null ;
    this.m = null ;
    this.r = null ;
    this.bl = null ;
    this.b = null ;
    this.br = null ;
    this.decoration = null ;
  }
};
