var DOM_ELEMENT_NODE = 1;
var DOM_ATTRIBUTE_NODE = 2;
var DOM_TEXT_NODE = 3;
var DOM_CDATA_SECTION_NODE = 4;
var DOM_ENTITY_REFERENCE_NODE = 5;
var DOM_ENTITY_NODE = 6;
var DOM_PROCESSING_INSTRUCTION_NODE = 7;
var DOM_COMMENT_NODE = 8;
var DOM_DOCUMENT_NODE = 9;
var DOM_DOCUMENT_TYPE_NODE = 10;
var DOM_DOCUMENT_FRAGMENT_NODE = 11;
var DOM_NOTATION_NODE = 12;

/*
Object.prototype.callSuper = function( parentClass )
{
  // Apply parent's constructor to this object
  if( arguments.length > 1 )
  {
    // Note: 'arguments' is an Object, not an Array
    parentClass.apply( this, Array.prototype.slice.call( arguments, 1 ) );
  }
  else
  {
    parentClass.call( this );
  }
};
*/
if ( typeof Object.create !== 'function' )
{
  Object.create = function (o)
  {
    function F() { } ;
    F.prototype = o ;
    return new F();
  };
}
if ( typeof Object.getPrototypeOf !== "function" )
{
  if ( typeof "test".__proto__ === "object" )
  {
    Object.getPrototypeOf = function(object)
    {
      return object.__proto__;
    };
  }
  else
  {
    Object.getPrototypeOf = function(object)
    {
      return object.constructor.prototype;
    };
  }
};
Function.prototype.inherits = function ( parentClass )
{
  if ( ! parentClass )
  {
    return ;
  }
  // this.prototype = new parentClass();
  this.prototype = Object.create ( parentClass.prototype ) ;
  this.prototype.constructor = this;
};
/**
 *  @constructor
 */
var TangoClass = function()
{
  this.counter = new Date().getTime() ;
  this.themeName = "default" ;
  this.themeCssLoaded = false ;
  this.themeImageMappingXml = null ;
  this.themeOffset = "" ;
  this._cssUsage = [] ;
  this.ua =
  {
    mobile: false,
    realMobile: false,
    _init_: function()
    {
      var na = navigator, ua = na.userAgent ;
      var i = -1 ;
      if ( ua.indexOf(" Mobile ") > 0 ) this.mobile = true ;
      if ( ua.indexOf(" Mobile/") > 0 ) this.mobile = true ;

      this.iphone = ua.indexOf("(iPhone;") >= 0 ;
      this.ipod = ua.indexOf("(iPod;") >= 0 ;
      if ( this.iphone ) this.mobile = true ;
      if ( this.ipod ) this.mobile = true ;
      this.khtml = ua.indexOf("KHTML/") >= 0 ;

      i = ua.indexOf("Firefox/") ;
      this.firefox = i >= 0 ;
      if ( i >= 0 ) this.ffVersion = parseFloat(ua.substr(i + 8));

      this.ie = typeof ActiveXObject != 'undefined' ;
      this.ie6 = this.ie && /MSIE [56]/.test(ua);
      i = ua.indexOf("MSIE") ;
      if ( i >= 0 ) this.ieVersion = parseFloat(ua.substr(i + 4));

      i = ua.indexOf("Opera/") ;
      this.opera = i >= 0 && typeof opera != 'undefined' ;
      if ( this.opera )
      {
        var j = ua.indexOf("Version/") ;
        if ( j >= 0 ) this.operaVersion = parseFloat(ua.substr(j + 8));
	      else          this.operaVersion = parseFloat(ua.substr(i + 6));
        if ( ! this.mobile ) this.mobile = ua.toUpperCase().indexOf("MINI") >= 0 ;
        if ( ! this.mobile ) this.mobile = ua.toUpperCase().indexOf("MOBI") >= 0 ;
      }

      this.webkit = /WebKit/.test(ua);
      i = ua.indexOf ( "Chrome/" ) ;
      this.chrome = i >= 0 ;
      if ( i >= 0 ) this.chromeVersion = parseFloat(ua.substr(i + 7));
      i = ua.indexOf ( "Safari/" ) ;
      if ( ! this.chrome && i >= 0 )
      {
        this.safari = true ;
        i = ua.indexOf ( "Version/" ) ;
        this.safariVersion = parseFloat(ua.substr(i + 8)) ;
      }

      this.gecko = ! this.khtml && ! this.webkit && /Gecko/.test(ua);
      this.mac = ua.indexOf('Mac') != -1;
      this.air = /adobeair/i.test(ua);
      this.MDA = ua.indexOf("MDA") >= 0 ;
      this.PPC = ua.indexOf("PPC") >= 0 ;
      if ( this.MDA || this.PPC ) this.mobile = true ;
      this.realMobile = this.mobile ;
      this.useGenericButtons = true ;
//      if ( this.firefox ) this.useGenericButtons = false ;
      // if ( this.ie ) this.useGenericButtons = false ;
    }
  } ;
  this.ua._init_() ;
  this._classToThemeStyle = [] ;
  this._typeToThemeXml = [] ;
  this._typeToThemeImageSrc = [] ;
  this._buttonIsCSS3 = undefined ;
};
ThemeStyle = function()
{
  this.jsClassName = "ThemeStyle" ;
  this.padding = null ;
  this.shiftX = 0 ;
  this.shiftY = 0 ;
  this.offsetX = 0 ;
  this.offsetY = 0 ;
  this.width = 0 ;
  this.height = 0 ;
} ;
ThemeStyle.prototype =
{
  toString: function()
  {
    return "(" + this.jsClassName + ")"
         + "[padding=" + this.padding
         + " \n,shiftX=" + this.shiftX + ",shiftY=" + this.shiftY
         + " \n,offsetX=" + this.offsetX + ",offsetY=" + this.offsetY
         + " \n,width=" + this.width + ",height=" + this.height
         + "]"
         ;
  }
} ;
TangoClass.prototype =
{
  isArray: function (a) { return this.isObject(a) && a.constructor == Array; },
  isObject: function (a) { return (a && typeof a == 'object') ; },
  getThemeStyle: function ( clazz, style )
  {
    var styleName = style ? style : "Style" ;
    var ts = this._classToThemeStyle[styleName+clazz] ;
    if ( ts ) return ts ;
    ts = new ThemeStyle() ;
    if ( this.themeImageMappingXml )
    {
      var xClass = this.themeImageMappingXml.getXml ( clazz ) ;
      if ( xClass )
      {
        var xStyle = xClass.get ( styleName ) ;
        if ( xStyle )
        {
          ts.width = xStyle.getIntAttribute ( "width", 0 ) ;
          ts.height = xStyle.getIntAttribute ( "height", 0 ) ;
          ts.offsetX = xStyle.getIntAttribute ( "offsetX", 0 ) ;
          ts.offsetY = xStyle.getIntAttribute ( "offsetY", 0 ) ;
          ts.shiftX = xStyle.getIntAttribute ( "shiftX", 0 ) ;
          ts.shiftY = xStyle.getIntAttribute ( "shiftY", 0 ) ;
        }
        ts.padding = xClass.getPadding ( styleName ) ;
      }
    }
    this._classToThemeStyle[styleName+clazz] = ts ;
    if ( ! ts.padding ) ts.padding = new Padding() ;
    return ts ;
  },
  getThemeImageSrc: function ( type, state )
  {
    var src = null ;
    if ( ! state )
    {
      src = this._typeToThemeImageSrc[type] ;
      if ( src ) return src ;
    }
    src = this._typeToThemeImageSrc[type+state] ;
    if ( src ) return src ;
    var tx = this.getThemeXml ( type, state ) ;
    if ( ! tx ) return "" ;
    src = tx.getAttribute ( "src", "" ) ;
    if ( src )
    {
      if ( ! state ) this._typeToThemeImageSrc[type] = src ;
      else           this._typeToThemeImageSrc[type+state] = src ;
    }
    return src ;
  },
  buttonIsCSS3: function()
  {
    if ( typeof ( this._buttonIsCSS3 ) == 'boolean' ) return this._buttonIsCSS3 ;
    this._buttonIsCSS3 = false ;
    var src = this.getThemeImageSrc ( "PushButton", "normal" ) ;
    if ( src == 'none' )
    {
      this._buttonIsCSS3 = true ;
    }
    return this._buttonIsCSS3 ;
  },
  getThemeXml: function ( type, state )
  {
    var tx;
    var xType;
    if ( ! state )
    {
      tx = this._typeToThemeXml[type] ;
      if ( tx ) return tx ;
      if ( ! this.themeImageMappingXml ) return null ;
      xType = this.themeImageMappingXml.getXml ( type ) ;
      if ( xType )
      {
        this._typeToThemeXml[type] = xType ;
      }
      return xType ;
    }
    tx = this._typeToThemeXml[type+state] ;
    if ( tx ) return tx ;
    var dom = this.getThemeDom ( type, state ) ;
    if ( ! dom ) return null ;
    xType = new TXml ( dom ) ;
    if ( xType ) this._typeToThemeXml[type+state] = xType ;
    return xType ;
  },
  getThemeDom: function ( type, state )
  {
    if ( ! this.themeImageMappingXml ) return null ;
    if ( ! type ) return null ;
    var xType = this.themeImageMappingXml.getXml ( type ) ;
    if ( ! xType ) return null ;
    if ( ! state ) state = "normal" ;
//TSys.logInternal = false ;
    if ( this.isArray ( state ) )
    {
      for ( var i = 0 ; i < state.length ; i++ )
      {
        var dom = xType.getDom ( state[i] ) ;
        if ( dom ) return dom ;
      }
      return null ;
    }
    return xType.getDom ( state ) ;
  },
  getThemeAttribute: function ( type, state, attrName )
  {
    if ( ! this.themeImageMappingXml ) return null ;
    if ( ! type ) return null ;
    var xType = this.themeImageMappingXml.getXml ( type ) ;
    if ( ! xType ) return null ;
    if ( ! attrName )
    {
      return xType.getAttribute ( state ) ;
    }
    if ( ! state ) state = "normal" ;
    var x = xType.getXml ( state ) ;
    if ( ! x ) return null ;
    return x.getAttribute ( attrName ) ;
  },
  getCounter: function()
  {
    this.counter++ ;
    return this.counter ;
  },
  getThemeName: function()
  {
    return this.themeName ;
  },
  isThemeCssLoaded: function()
  {
    return this.themeCssLoaded ;
  },
  _endsWith: function ( str, needle )
  {
    if ( ! needle ) return false ;
    var pos = str.indexOf ( needle ) ;
    if ( pos < 0 ) return false ;
    if ( str.length - needle.length == pos ) return true ;
    return false ;
  },
  _disableNotUsedThemeCss: function()
  {
    for ( var i = 0 ; i < document.styleSheets.length ; i++ )
    {
      var sheet = document.styleSheets[i];
      if ( ! sheet.href ) continue ;
      if (  sheet.href.indexOf ( "themes/" ) >= 0
         && sheet.href.indexOf ( "Style.css" ) > 0
         )
      {
        if ( sheet.href.indexOf ( this.themeName ) > 0 )
        {
          sheet.disabled = false ;
        }
        else
        {
          sheet.disabled = true ;
        }
      }
    }
  },
  loadTheme: function ( themeName, callback )
  {
    if ( ! themeName ) return false ;
    if ( this.themeName == themeName ) return false ;
    this.themeName = themeName ;
    var url = TSys.getMainUrl()+"&theme=" + themeName + "&action=GetThemeImageMapping" ;
    this._classToPadding = [] ;
    this._classToThemeStyle = [] ;
    this._typeToThemeXml = [] ;
    this._typeToThemeImageSrc = [] ;
    this._buttonIsCSS3 = undefined ;
    this.themeImageMappingXml = new TXml ( TSys.getXml ( url ) ) ;
    var to = this.themeImageMappingXml.getAttribute ( "themeOffset" ) ;
    if ( to ) this.themeOffset = to ;
    else      this.themeOffset = "themes" ;
    this._loadThemeCss ( callback ) ;
    return true ;
  },
  _loadThemeCss: function ( callback )
  {
    var str ;
    if ( this.themeName == "default" ) return ;

    var cssName = this.themeOffset + "/" + this.themeName + "/Style.css"; 
    var href = cssName + "?counter=" + this.getCounter() ;
    var en = new TXEnum ( document.getElementsByTagName('head')[0], 'link' ) ;
    var themeAlreadyPresent = false ;
    while ( en.hasNext() )
    {
      var d = en.next() ;
      if ( ! d.href ) continue ;
      if ( d.href.indexOf ( cssName ) >= 0 )
      {
        themeAlreadyPresent = true ;
        break ;
      }
    }
    if ( ! themeAlreadyPresent )
    {
      var link = document.createElement ( 'link' ) ;
//      str = this._httpGetText ( href ) ; // PRELOAD css
      link.rel = 'stylesheet'; 
      link.type = 'text/css'; 
      link.href = href ;

			var thiz = this ;
	    if ( link.onreadystatechange !== undefined )
	    {
	      link.onreadystatechange = function()
	      {
					if ( link.readyState == 'complete' )
					{
      			thiz.themeCssLoaded = true ;
      			thiz._disableNotUsedThemeCss() ;
      			TGui.setClassImages ( null, true ) ;
						if ( typeof ( callback ) == 'function' )
						{
							callback() ;
						}
					}
				};
        document.getElementsByTagName('head')[0].appendChild(link); 
			}
			else
			{
				var f = function()
				{
      		thiz.themeCssLoaded = true ;
      		thiz._disableNotUsedThemeCss() ;
      		TGui.setClassImages ( null, true ) ;
					if ( typeof ( callback ) == 'function' )
					{
						callback() ;
					}
				};
				if ( this.ua.chrome )
				{
      		document.getElementsByTagName('head')[0].appendChild(link); 
					var img = document.createElement('img');
    			img.onerror = function() { f() ; } ;
    			img.src = href;
				}
				else
				if ( this.ua.webkit )
				{
      		document.getElementsByTagName('head')[0].appendChild(link); 
    			f() ;
				}
				else
				{
      		document.getElementsByTagName('head')[0].appendChild(link); 
					link.onload = f ;
				}
			}
    }
    else
    {
      this._disableNotUsedThemeCss() ;
      this.themeCssLoaded = true ;
      TGui.setClassImages ( null, true ) ;
			if ( typeof ( callback ) == 'function' )
			{
				callback() ;
			}
    }
  },
  /**
   * load javascript dynamically
   */
  include: function ( scriptName )
  {
    var href;
    var en;
    if ( typeof ( scriptName ) == 'undefined' || ! scriptName ) return ;
    if ( this._endsWith ( scriptName, ".css" ) )
    {
      href = scriptName + "?counter=" + this.getCounter() ;
      if ( ! this.ua.firefox && ! this.ua.opera && ! this.ua.mobile )
      {
//        var str = this._httpGetText ( href ) ; // PRELOAD css
      }
      en = new TXEnum ( document.getElementsByTagName('head')[0], 'link' ) ;
      var link = document.createElement ( 'link' ) ;
      link.rel = 'stylesheet'; 
      link.type = 'text/css'; 
      link.href = href ;
      document.getElementsByTagName('head')[0].appendChild(link); 
      return ;
    }
    if ( ! this._endsWith ( scriptName, ".js" ) )
    {
      scriptName += ".js" ;
    }
    href = scriptName + "?counter=" + this.getCounter() ;
    en = new TXEnum ( document.getElementsByTagName('head')[0], 'script' ) ;
    while ( en.hasNext() )
    {
      var d = en.next() ;
      if ( d.src.indexOf ( scriptName ) >= 0 )
      {
        return ;
      }
    }
    if ( ! this.ua.firefox && ! this.ua.opera && ! this.ua.mobile )
    {
//      var str = this._httpGetText ( href ) ; // PRELOAD js
    }
    var script = document.createElement ( 'script' ) ; 
    script.type = 'text/javascript'; 
    script.src = href ;
    document.getElementsByTagName('head')[0].appendChild(script); 
  },
  loadJavaScript: function ( scriptName )
  {
    if ( ! scriptName ) return ;
    var href = scriptName ;
    var en = new TXEnum ( document.getElementsByTagName('head')[0], 'script' ) ;
    while ( en.hasNext() )
    {
      var d = en.next() ;
      if ( d.src.indexOf ( scriptName ) >= 0 )
      {
        return ;
      }
    }
    var script = document.createElement ( 'script' ) ; 
    script.type = 'text/javascript'; 
    script.src = href ;
    document.getElementsByTagName('head')[0].appendChild(script); 
  },
  getHttpRequestObject: function()
  {
    if (typeof window.XMLHttpRequest != 'undefined' )
    {
      return new XMLHttpRequest();
    }
    if (typeof window.ActiveXObject != 'undefined' )
    {
      try
      {
        return new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch ( e )
      {
        return new ActiveXObject("Msxml2.XMLHTTP");
      }
    }
    return new XMLHttpRequest();
  },
  _httpGetText: function ( url )
  {
    var HTTP = this.getHttpRequestObject() ;
    HTTP.open ( "GET", url, false ) ;
    HTTP.send(null) ;
    return HTTP.responseText ;
  },
  useCss: function ( name )
  {
    if ( ! this._cssUsage[name] )
    {
      this.loadCss ( name ) ;
      this._cssUsage[name] = 1 ;
      return ;
    }
    this._cssUsage[name] = this._cssUsage[name] + 1 ;
  },
  unuseCss: function ( name )
  {
    var n = this._cssUsage[name] ;
    if ( isNaN ( n ) ) return ;
    n-- ;
    if ( n > 0 )
    {
      this._cssUsage[name] = n ;
      return ;
    }
    this._cssUsage[name] = 0 ;
    var en = new TXEnum ( document.getElementsByTagName('head')[0], 'link' ) ;
    while ( en.hasNext() )
    {
      var d = en.next() ;
      if ( ! d.href ) continue ;
      if ( d.href.endsWith ( name ) )
      {
        d.parentNode.removeChild ( d ) ;
        break ;
      }
    }
  },
  loadCss: function ( name )
  {
    var en = new TXEnum ( document.getElementsByTagName('head')[0], 'link' ) ;
    var themeAlreadyPresent = false ;
    while ( en.hasNext() )
    {
      var d = en.next() ;
      if ( ! d.href ) continue ;
      if ( d.href.indexOf ( name ) >= 0 )
      {
        themeAlreadyPresent = true ;
        break ;
      }
    }
    if ( themeAlreadyPresent ) return ;
    this._httpGetText ( name ) ; // PRELOAD
    var link = document.createElement ( 'link' ) ;
    link.rel = 'stylesheet'; 
    link.type = 'text/css'; 
    link.href = name ;
    document.getElementsByTagName('head')[0].appendChild(link); 
  },
  initSuper: function ( thiz, parentClass )
  {
    thiz._super_ = parentClass.prototype ;
    // Apply parent's constructor to this object
    if( arguments.length > 2 )
    {
      // Note: 'arguments' is an Object, not an Array
      parentClass.apply( thiz, Array.prototype.slice.call( arguments, 2 ) );
    }
    else
    {
      parentClass.call( thiz );
    }
  }
};
TangoClass.prototype.isActiveXObject = function ( obj )
{
  if ( typeof ( ActiveXObject ) != 'undefined' && ( obj instanceof ActiveXObject ) )
  {
    return true ;
  }
  return false ;
} ;
TangoClass.prototype.getFolderIcon = function()
{
  var dom = this.getThemeDom ( "Folder.16", "normal" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "Folder.16", "normal", NaN, NaN ) ;
  return null ;
} ;
TangoClass.prototype.getFolderOpenIcon = function()
{
  var dom = this.getThemeDom ( "Folder.16", "open" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "Folder.16", "open", NaN, NaN ) ;
  return null ;
} ;
TangoClass.prototype.getFolderUpIcon = function()
{
  var dom = this.getThemeDom ( "Folder.16", "up" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "Folder.16", "up", NaN, NaN ) ;
  return null ;
} ;
TangoClass.prototype.getThemeStyleRule = function ( selectorName )
{
  var sheet = null ;
  var cssName = this.themeOffset + "/" + this.themeName + "/Style.css"; 
  for ( var i = 0 ; i < document.styleSheets.length ; i++ )
  {
    var sh = document.styleSheets[i];
    if ( ! sh.href ) continue ;
    if ( sh.href.indexOf ( cssName ) >= 0 )
    {
      sheet = sh ;
      break ;
    }
  }
  if ( sheet === null ) return null ;
  var rules = null ;
  if ( sheet.cssRules) rules = sheet.cssRules ;
  else
  if ( sheet.rules) rules = sheet.rules ;
  for ( var j = 0 ; j < rules.length ; j++ )
  {
    if ( rules[j].selectorText.indexOf ( selectorName ) >= 0 )
    {
      var r = rules[j] ;
      var o = {} ;
      o.width = this.parsePixel ( r.style.width ) ;
      o.height = this.parsePixel ( r.style.height ) ;
      o.right = this.parsePixel ( r.style.right ) ;
      o.left = this.parsePixel ( r.style.left ) ;
      o.top = this.parsePixel ( r.style.top ) ;
      o.paddingTop = this.parsePixel ( r.style.paddingTop ) ;
      o.paddingLeft = this.parsePixel ( r.style.paddingLeft ) ;
      o.paddingBottom = this.parsePixel ( r.style.paddingBottom ) ;
      o.paddingRight = this.parsePixel ( r.style.paddingRight ) ;
      return o ;
    }
  }
};
TangoClass.prototype.parsePixel = function ( pix )
{
  if ( typeof ( pix ) === 'string' )
  {
    var i = parseInt ( pix ) ;
    if ( pix.indexOf ( '.' ) >= 0 )
    {
      if ( i >= 0 ) i = parseInt ( parseFloat ( pix ) + 0.5 ) ;
      else          i = - parseInt ( - parseFloat ( pix ) + 0.5 ) ;
    }
    return i ;
  }
  return pix ;
};
TangoClass.prototype.mixin = function ( from, to )
{
  for ( var key in from )
  {
    if ( ! from.hasOwnProperty (key) ) continue ;
    // if ( typeof ( to[key] ) != 'undefined' ) continue ;
    if ( to.hasOwnProperty ( key ) ) continue ;
    if ( from[key] && typeof ( from[key] ) === 'object' && typeof ( from[key].create ) === 'function' )
    {
      to[key] = from[key].create.call() ;
      continue ;
    }
    to[key] = from[key] ;
  }
};
TangoClass.prototype.isArguments = function ( args )
{
  if ( args === null ) return false;
  if ( typeof args !== 'object' ) return false;
  if ( typeof args.callee !== 'function' ) return false;
  if ( typeof args.length !== 'number' ) return false;
  if ( args.constructor !== Object ) return false;
  return true;
};
TangoClass.prototype.callSuper = function ( obj, name, a )
{
  if  ( ! obj ) return ;
  if  ( ! name ) return ;
  var proto = Object.getPrototypeOf  ( obj ) ;
  while ( proto )
  {
    proto = Object.getPrototypeOf  ( proto ) ;
    if ( ! proto ) break ;
    if ( typeof ( proto[name] ) === 'function' )
    {
      if ( ! a )
      {
        proto[name].call ( obj ) ;
      }
      else
      if ( this.isArguments ( a ) )
      {
        proto[name].apply ( obj, a ) ;
      }
      else
      if ( this.isArray ( a ) )
      {
        proto[name].call ( obj, a ) ;
      }
      else
      {
        var aa = [ a ] ;
        proto[name].call ( obj, aa ) ;
      }
      break ;
    }
  }
};
var hasStacks = false;
try {
  if ( typeof Error !== 'undefined' )
  {
    throw new Error();
  }
} catch (e) {
    hasStacks = !!e.stack;
};
TangoClass.prototype.where = function ( str )
{
  var t = this._where ( str ) ;
  if ( typeof t !== 'undefined' )
  {
    log ( t ) ;
  }
};
TangoClass.prototype._where = function ( str )
{
  if (!hasStacks) {
      return;
  }
  try
  {
    throw new Error();
  }
  catch (e)
  {
    var lines = e.stack.split ("\n") ;

    var firstLine = lines[0].indexOf("@") > 0 ? lines[2] : lines[3];
    firstLine = firstLine.trim() ;
    if ( firstLine.indexOf ( "at " ) === 0 ) firstLine = firstLine.substring ( 3 ) ;
    if ( firstLine.indexOf ( "<anonymous function: " ) === 0 )
    {
      firstLine = firstLine.substring ( "<anonymous function: ".length ) ;
    }
    var p1 = firstLine.indexOf ( "http" ) ;
    if ( p1 > 0 )
    {
      var p2 = firstLine.lastIndexOf ( "/" ) ;
      if ( p2 > 0 )
      {
        firstLine = firstLine.substring ( 0, p1 ) + firstLine.substring ( p2 + 1 ) ;
      }
    }
    var p1 = firstLine.indexOf ( "?" ) ;
    if ( p1 > 0 )
    {
      var p2 = firstLine.indexOf ( ":", p1 ) ;
      if ( p2 > 0 )
      {
        firstLine = firstLine.substring ( 0, p1 ) + firstLine.substring ( p2 ) ;
      }
    }
    if ( str )
    {
      return str + ": " + firstLine ;
    }
    return firstLine ;
  }
};

Tango = new TangoClass() ;
/**
 *  @constructor
 */
var TXEnum = function ( xmlDom, tagName )
{
  this.xmlDom = xmlDom ;
  this.xmlCurrent = null ;
  this.nodeType = 0 ;
  if ( typeof ( tagName ) == 'number' )
  {
    this.nodeType = tagName ;
  }
  else
  {
    if ( tagName ) tagName = tagName.toUpperCase() ;
    this.tagName = tagName ;
  }
};
TXEnum.prototype =
{
  flush: function()
  {
    this.xmlDom = null ;
    this.tagName = null ;
    this.xmlCurrent = null ;
  },
  reset: function()
  {
    this.xmlCurrent = null ;
  },
  _hasNext: function()
  {
    if ( ! this.xmlDom ) return false ;
    if ( ! this.xmlCurrent )
    {
      return this.xmlDom.firstChild !== null ;
    }
    return this.xmlCurrent.nextSibling !== null ;
  },
  hasNext: function()
  {
    var currentSave ;
    var e ;
    if ( ! this.xmlDom ) return false ;
    if ( ! this.tagName && ! this.nodeType ) return this._hasNext() ;
    if ( this.nodeType )
    {
      this.xmlFound = null ;
      currentSave = this.xmlCurrent ;
      while ( this._hasNext() )
      {
        e = this._next() ;
        if ( e.nodeType == this.nodeType )
        {
          this.xmlCurrent = currentSave ;
          return true ;
        }
      }
    }
    else
    {
      this.xmlFound = null ;
      currentSave = this.xmlCurrent ;
      while ( this._hasNext() )
      {
        e = this._next() ;
        if ( e.nodeName && e.nodeName.toUpperCase() == this.tagName )
        {
          this.xmlCurrent = currentSave ;
          return true ;
        }
      }
    }
    return false ;
  },
  _next: function()
  {
    if ( ! this.xmlCurrent )
    {
      this.xmlCurrent = this.xmlDom.firstChild ;
      return this.xmlCurrent ;
    }
    this.xmlCurrent = this.xmlCurrent.nextSibling ;
    return this.xmlCurrent ;
  },
  nextXml: function()
  {
    return new TXml ( this.next() ) ;
  },
  next: function()
  {
    var e;
    if ( ! this.tagName && ! this.nodeType ) return this._next() ;
    if ( this.nodeType )
    {
      while ( this._hasNext() )
      {
        e = this._next() ;
        if ( e.nodeType == this.nodeType )
        {
          return e ;
        }
      }
      return null ;
    }
    while ( this._hasNext() )
    {
      e = this._next() ;
      if ( e.nodeName && e.nodeName.toUpperCase() == this.tagName )
      {
        return e ;
      }
    }
  }
};
/**
 * @constructor
 * @param {object} event the event object from window
 * @param {int} [eventType]
 *   One of the following values:
 * <ul>
 * <li>TEvent.prototype.CHANGED</li>
 * <li>TEvent.prototype.RESET</li>
 * <li>TEvent.prototype.ITEM_SELECTED</li>
 * <li>TEvent.prototype.KEYBOARD</li>
 * <li>TEvent.prototype.MOUSE</li>
 * <li>TEvent.prototype.ITEM_DESELECTED</li>
 * <li>TEvent.prototype.PROPERTY_CHANGE</li>
 * <li>TEvent.prototype.ACTION</li>
 * <li>TEvent.prototype.MENU</li>
 *  </ul>
 */
var TEvent = function ( event, eventType )
{
  this.jsEvent = null ;
  this.htmlSource = null ;
  this.consumed = false ;
  this.jsClassName = "TEvent" ;
  this.eventType = -1 ;
  this.oldValue = null ;
  this.newValue = null ;
  this.propertyName = null ;
  this.action = null ;
  this._redirectSource = false ;

  if ( typeof event === 'string' )
  {
    this.event = null ;
    this.eventType = event ;
  }
  else
  {
    this._setEvent ( event, eventType ) ;
  }
  this.isEvent = true ;
};
TEvent.prototype =
{
  CHANGED: 1,
  RESET: 2,
  ITEM_SELECTED: 3,
  KEYBOARD: 4,
  MOUSE: 5,
  ITEM_DESELECTED: 6,
  PROPERTY_CHANGE: 7,
  ACTION: 8,
  LOAD: 9,
  XACTION: 10,
  TYPE_MAX: 10,
  isLoad: function()
  {
    return this.eventType == this.LOAD ;
  },
  isAction: function()
  {
    return this.eventType == this.ACTION ;
  },
  isMenu: function()
  {
    return this.eventType == this.MENU ;
  },
  isReset: function()
  {
    return this.eventType == this.RESET ;
  },
  isChanged: function()
  {
    return this.eventType == this.CHANGED ;
  },
  isItemSelected: function()
  {
    return this.eventType == this.ITEM_SELECTED ;
  },
  isItemDeselected: function()
  {
    return this.eventType == this.ITEM_DESELECTED ;
  },
  isPropertyChange: function()
  {
    return this.eventType == this.PROPERTY_CHANGE ;
  },
  getType: function()
  {
    return this.eventType ;
  },
  setType: function ( type )
  {
    if ( typeof ( type ) != 'number' ) throw "TEvent.setType(): type is not a number: '" + typeof ( type ) ;
    if ( type <= 0 || type > this.TYPE_MAX ) throw "TEvent.setType(): ivalid type: '" + type ;
    this.eventType = type ;
  },
  typeToString: function()
  {
    if ( this.eventType == this.CHANGED ) return "CHANGED" ;
    if ( this.eventType == this.RESET ) return "RESET" ;
    if ( this.eventType == this.ITEM_SELECTED ) return "ITEM_SELECTED" ;
    if ( this.eventType == this.KEYBOARD ) return "KEYBOARD" ;
    if ( this.eventType == this.MOUSE ) return "MOUSE" ;
    if ( this.eventType == this.ITEM_DESELECTED ) return "ITEM_DESELECTED" ;
    if ( this.eventType == this.PROPERTY_CHANGE ) return "PROPERTY_CHANGE" ;
    if ( this.eventType == this.ACTION ) return "ACTION" ;
    if ( this.eventType == this.LOAD ) return "LOAD" ;
    if ( this.eventType == this.MENU ) return "MENU" ;
  },
  getAction: function()
  {
    return this.action ;
  },
  getItem: function()
  {
    return this.item ;
  },
  setItem: function ( item )
  {
    this.item = item ;
  },
  setPropertyName: function ( name )
  {
    this.propertyName = name ;
  },
  getPropertyName: function()
  {
    return this.propertyName ;
  },
  getOldValue: function()
  {
    if ( this.jsEvent ) return this.jsEvent.oldValue ;
    return this.oldValue ;
  },
  setOldValue: function ( val )
  {
    this.oldValue = val ;
  },
  getNewValue: function()
  {
    if ( this.jsEvent ) return this.jsEvent.newValue ;
    return this.newValue ;
  },
  setNewValue: function ( val )
  {
    this.newValue = val ;
  },
  setHtmlSource: function ( htmlSource )
  {
    this.htmlSource = htmlSource ;
  },
  getWindow: function()
  {
    var ch = this.getSource() ;
    while ( ch )
    {
      if ( ch.xPseudoTopWindow  )
      {
        return ch.jsPeer ;
      }
      ch = ch.parentNode ;
    }
    var p = this.getPeer() ;
    if ( p instanceof TWindow ) return p ;
//    if ( p ) return p ;
    return null ;
  },
  getEvent: function()
  {
    return this.event ;
  },
  getSource: function()
  {
    if ( this.htmlSource ) return this.htmlSource ;
    if ( ! this.event )
    {
      if ( this.jsEvent ) return this.jsEvent.getSource() ;
      return null ;
    }
//    this.htmlSource = this.event.originalTarget || this.event.srcElement || this.event.target ;
    this.htmlSource = this.event.target || this.event.srcElement || this.event.originalTarget ;
    return this.htmlSource ;
  },
  isConsumed: function()
  {
    if ( this.jsEvent ) return this.jsEvent.isConsumed() ;
    return this.consumed ;
  },
  isLeftClick: function()
  {
    if ( ! this.event ) return false ;
    return    ( this.event.which && this.event.which == 1 )
           || ( this.event.button && this.event.button == 1 ) ;
  },
  getButton: function()
  {
    if ( ! this.event ) return null ;
    return this.event.which || this.event.button ;
  },
  isButtonLeft: function()
  {
    return this.getButton() == 1 ;
  },
  isButtonMiddle: function()
  {
    if ( TSys.isIE() && Tango.ua.ieVersion <= 9 ) return this.getButton() == 3 ;
    return this.getButton() == 2 ;
  },
  isButtonRight: function()
  {
    if ( TSys.isIE() && Tango.ua.ieVersion <= 9 ) return this.getButton() == 2 ;
    return this.getButton() == 3 ;
  },
  getX: function()
  {
    if ( ! this.event ) return -1 ;
    return this.event.pageX || (this.event.clientX +
      (document.documentElement.scrollLeft || document.body.scrollLeft));
  },
  getY: function()
  {
    if ( ! this.event ) return -1 ;
    return this.event.pageY
        || ( this.event.clientY + (  document.documentElement.scrollTop
                                  || document.body.scrollTop
                                  )
           );
  },
  consume: function()
  {
    this.consumed = true ;
    if ( this.jsEvent ) this.jsEvent.consume() ;
    if ( ! this.event ) return ;
    if ( this.event.preventDefault )
    {
      this.event.preventDefault();
      this.event.stopPropagation();
    }
    else
    {
      this.event.returnValue = false;
      this.event.cancelBubble = true;
    }
  },
  getXml: function()
  {
    if ( ! this.event ) return null ;
    return TGui.getContainerXml ( this.event ) ;
  },
  getContainer: function ( ignoreName )
  {
    var src = this.getSource() ;
    if ( ! src ) return ;
    var p = TGui.getContainerDomFromElement ( src, ignoreName ) ;
    if ( p ) return new TContainer ( p ) ;
    return null ;
  },
  getValues: function(xml)
  {
    var src = this.getSource() ;
    if ( ! src ) return ;
    var p = TGui.getContainerDomFromElement ( src ) ;
    if ( ! p ) return null ;
    var x = new TXml ( p ) ;
    return x.getValues(xml) ;
  },
  getCharCode: function()
  {
    var kc = this.getKeyCode() ;
    if ( kc ) return String.fromCharCode(kc) ; //.toUpperCase().charCodeAt(0) ;
  },
  getKeyCode: function()
  {
    if ( ! this.event ) return -1 ;
    var kc = this.event.keyCode ? this.event.keyCode : this.event.which ;
    if ( ! kc ) return 0 ;
    return kc ;
  },
  isEscape: function() { return this.getKeyCode() == 27 ; },
  isTabOnly: function()
  {
    if ( this.getKeyCode() != 9 ) return false ;
    if ( this.event.shiftKey && this.event.shiftKey != 0 ) return false ;
    if ( this.event.ctrlKey && this.event.ctrlKey != 0 ) return false ;
    if ( this.event.altKey && this.event.altKey != 0 ) return false ;
    return true ;
  },
  isTab: function() { return this.getKeyCode() == 9 ; },
  isCursorLeft: function() { return this.getKeyCode() == 37 ; },
  isCursorUp: function() { return this.getKeyCode() == 38 ; },
  isCursorRight: function() { return this.getKeyCode() == 39 ; },
  isCursorDown: function() { return this.getKeyCode() == 40 ; },
  isShift: function() { return this.event.shiftKey && this.event.shiftKey != 0 ; },
  isCtrl: function() { return  this.event.ctrlKey && this.event.ctrlKey != 0 ; },
  isAlt: function() { return  this.event.altKey && this.event.altKey != 0 ; },
  getModifierName: function()
  {
    var s = "" ;
    if ( this.isShift() )
    {
      if ( s.length > 0 ) s += ", " ;
      s += "SHIFT" ;
    }
    if ( this.isCtrl() )
    {
      if ( s.length > 0 ) s += ", " ;
      s += "CTRL" ;
    }
    if ( this.isAlt() )
    {
      if ( s.length > 0 ) s += ", " ;
      s += "ALT" ;
    }
    return s ;
  },
  isEnter: function()
  {
    return ( this.event.keyCode ? this.event.keyCode : this.event.which ) == 13 ;
  },
  hasModifiers: function()
  {
    if ( this.event.shiftKey && this.event.shiftKey != 0 ) return true ;
    if ( this.event.ctrlKey && this.event.ctrlKey != 0 ) return true ;
    if ( this.event.altKey && this.event.altKey != 0 ) return true ;
    return false ;
  },
  flush: function()
  {
    this.component = null ;
    if ( this.jsEvent ) this.jsEvent.flush() ;
  },
  setPeer: function ( peer )
  {
    this.jsSource = peer ;
  },
  setJsSource: function ( peer )
  {
    this.jsSource = peer ;
  },
  getPeer: function()
  {
    if ( this.jsSource ) return this.jsSource ;
    if ( this.jsEvent )
    {
      return this.jsEvent.getJsSource() ;
    }
    if ( ! this.jsSource )
    {
      var src = this.getSource() ;
      for ( var src = this.getSource() ; src ; src = src.parentNode )
      {
        if ( src.jsPeer ) return src.jsPeer ;
      }
    }
    return this.jsSource ;
  },
  getJsSource: function()
  {
    return this.getPeer() ;
  },
  getPagelet: function ( qualifier )
  {
    var src = this.getSource() ;
    return TGui.findPageletFromElement ( src, qualifier ) ;
  }
};
TEvent.prototype._setEvent = function ( event, eventType )
{
  if ( !event ) event = window.event;
  this.event = event ;
  this.htmlSource = null ;
  if (  this.event
     && this.event.jsClassName
     && this.event.getEvent
     )
  {
    this.jsEvent = this.event ;
    this.event = this.event.getEvent() ;
    this.eventType = this.jsEvent.eventType ;
    this.htmlSource = this.jsEvent.htmlSource ;
  }
  else
  if ( eventType )
  {
    if ( typeof ( eventType ) == 'number' ) this.eventType = eventType ;
  }
};
TEvent.prototype.setAction = function ( name )
{
  this.action = name ;
};
TEvent.prototype.getComponent = function()
{
  var src = this.getSource() ;
  if ( ! src ) return ;
  return TGui.getComponent ( src ) ;
};
TEvent.prototype.toString = function()
{
  if ( ! this.event )
  {
    return "(" + this.jsClassName + ")[consumed=" + this.consumed
          + ( this.eventType >= 0 || typeof ( this.eventType ) == 'string' ? ",type=" + this.typeToString() + "(" + this.eventType + ")" : "" )
          + ( this.action ? ",action=" + this.getAction() : "" )
          + ( this.propertyName ? ",propertyName=" + this.propertyName : "" )
          + ( this.oldValue || typeof ( this.oldValue ) == 'number' || typeof ( this.oldValue ) == 'string' ? ",old-value=" + this.oldValue : "" )
          + ( this.newValue || typeof ( this.newValue ) == 'number' || typeof ( this.newValue ) == 'string' ? ",new-value=" + this.newValue : "" )
          + ( this.getSource() ?  + "\n source=" + this.getSource() : "" )
          + ( this.getSource() && this.getSource().name ? ",name=" + this.getSource().name : "" )
          + ( this.getSource() && this.getSource().id ? ",id=" + this.getSource().id : "" )
          + ( this.getPeer() ? ",peer=" + this.getPeer() : "" )
          + "]"
          ;
  }
  return "(" + this.jsClassName + ")[consumed=" + this.consumed + ",x=" + this.getX() + ",y=" + this.getY()
          + ",charCode=" + this.getCharCode() 
          + ",keyCode=" + this.getKeyCode() 
          + ",button=" + this.getButton()
          + ",modifiers=" + this.getModifierName()
          + ",generic-type=" + this.event.type
          + ( this.eventType >= 0 || typeof ( this.eventType ) == 'string' ? ",type=" + this.typeToString() + "(" + this.eventType + ")" : "" )
          + ( this.isShift() ? ",SHIFT" : "" )
          + ( this.isCtrl() ? ",CTRL" : "" )
          + ( this.isAlt() ? ",ALT" : "" )
          + ( this.action ? ",action=" + this.getAction() : "" )
          + ( this.propertyName ? ",propertyName=" + this.propertyName : "" )
          + ( this.oldValue || typeof ( this.oldValue ) == 'number' || typeof ( this.oldValue ) == 'string' ? ",old-value=" + this.oldValue : "" )
          + ( this.newValue || typeof ( this.newValue ) == 'number' || typeof ( this.newValue ) == 'string' ? ",new-value=" + this.newValue : "" )
          + ( this.getSource().name ? ",name=" + this.getSource().name : "" )
          + ( this.getSource().id ? ",id=" + this.getSource().id : "" )
          + ",node=" + this.getSource().nodeName
          + ",source=" + this.getSource() 
          + ( this.getPeer() ? ",peer=" + this.getPeer() : "" )
          + "]"
          ;
};
TEvent.prototype.getGenericType = function()
{
  if ( ! this.event ) return "" ;
  return this.event.type ;
};
TEvent.prototype.isMouseEvent = function()
{
  if ( ! this.event ) return false ;
  return this.event.type.indexOf ( "mouse" ) == 0  ;
};
TEvent.prototype.isKeyEvent = function()
{
  if ( ! this.event ) return false ;
  return this.event.type.indexOf ( "key" ) == 0  ;
};
/**
 *  @constructor
 *  @extends TEvent
 */
var ACDragEvent = function ( event )
{
  Tango.initSuper ( this, TEvent, event ) ;
  this.jsClassName = "ACDragEvent" ;
};
ACDragEvent.inherits( TEvent ) ;
ACDragEvent.prototype.setDragger = function ( dragger )
{
  this.dragger = dragger ;
};
ACDragEvent.prototype.setDragArea = function ( top, left, bottom, right )
{
  this.dragger.setDragArea ( new Insets ( top, left, bottom, right ) ) ;
};
ACDragEvent.prototype.setDragInside = function ( state )
{
  this.dragger.setDragInside ( state ) ;
};
/**
 *  @constructor
 *  @extends TEvent
 */
var TItemEvent = function ( event, item, type )
{
  if ( ! type ) type = TEvent.prototype.ITEM_SELECTED ;
  Tango.initSuper ( this, TEvent, event, type ) ;
  this.jsClassName = "TItemEvent" ;
  this.item = item ;
};
TItemEvent.inherits( TEvent ) ;
/**
 *  @constructor
 *  @extends TEvent
 */
var ACSelectionEvent = function ( event, item, type )
{
  if ( ! type ) type = TEvent.prototype.ITEM_SELECTED ;
  Tango.initSuper ( this, TEvent, event, type ) ;
  this.jsClassName = "ACSelectionEvent" ;
  this.item = item ;
};
ACSelectionEvent.inherits( TEvent ) ;
/**
 *  @constructor
 *  @extends TEvent
 */
var TActionEvent = function ( event, actionName )
{
  Tango.initSuper ( this, TEvent, event, TEvent.prototype.ACTION ) ;
  this.jsClassName = "TActionEvent" ;
  this.action = actionName ;
  if ( ! this.action ) this.action = "*" ;
};
TActionEvent.inherits( TEvent ) ;
/**
 *  @constructor
 *  @extends TEvent
 */
var TPropertyChangeEvent = function ( event, propertyName )
{
  Tango.initSuper ( this, TEvent, event, TEvent.prototype.PROPERTY_CHANGE ) ;
  this.jsClassName = "TPropertyChangeEvent" ;
  this.propertyName = propertyName ;
};
TPropertyChangeEvent.inherits( TEvent ) ;
/**
 *  @constructor
 *  @extends TEvent
 */
var TLoadEvent = function ( event, propertyName )
{
  Tango.initSuper ( this, TEvent, event, TEvent.prototype.LOAD ) ;
  this.jsClassName = "TLoadEvent" ;
  this.propertyName = propertyName ;
};
TLoadEvent.inherits( TEvent ) ;
/**
 *  @constructor
 */
PropertyChangeHandler = function()
{
  this._flushed = false ;
  this.listenerList = [] ;
  this.propertyNameList = [] ;
  this.jsClassName = "PropertyChangeHandler" ;
};
PropertyChangeHandler.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  for ( var i = 0 ; i < this.listenerList.length ; i++ )
  {
    this.listenerList[i].flush() ;
  }
  this.listenerList.length = 0 ;
  this.propertyNameList.length = 0 ;
};
PropertyChangeHandler.prototype.add = function ( obj, method, propertyName )
{
  var pn = '.*' ;
  if ( obj instanceof TFunctionExecutor )
  {
    if ( typeof ( method ) == 'string' ) pn = method ;
    this.listenerList.push ( obj ) ;
    this.propertyNameList.push ( pn ) ;
    return ;
  }
  else
  if ( typeof ( obj ) == 'string' )
  {
    if ( typeof ( method ) == 'string' ) pn = method ;
    else
    if ( typeof ( propertyName ) == 'string' ) pn = propertyName ;
  }
  else
  if ( typeof ( obj ) == 'object' && typeof ( method ) == 'function' )
  {
    if ( typeof ( propertyName ) == 'string' ) pn = propertyName ;
  }
  else
  if ( typeof ( obj ) == 'function' )
  {
    if ( typeof ( method ) == 'string' ) pn = method ;
    else
    if ( typeof ( propertyName ) == 'string' ) pn = propertyName ;
  }
  var fe = new TFunctionExecutor ( obj, method ) ;
  fe.o = obj ;
  fe.m = method ;
  this.listenerList.push ( fe ) ;
  this.propertyNameList.push ( pn ) ;
};
PropertyChangeHandler.prototype.fireEvent = function ( ev, propertyName )
{
  if ( typeof ( propertyName ) == 'string' )
  {
  }
  else
  {
    propertyName = ev.getPropertyName() ;
  }
  if ( ! propertyName ) propertyName = "" ;

  var oldVal = ev.getOldValue() ;
  var newVal = ev.getNewValue() ;
  if (  ( oldVal != null && typeof ( oldVal ) != 'undefined' )
     || ( newVal != null && typeof ( newVal ) != 'undefined' )
     )
  {
    if ( oldVal == newVal ) return ;
  }
  for ( var i = 0 ; i < this.listenerList.length ; i++ )
  {
    if (  this.propertyNameList[i] == '.*'
       || this.propertyNameList[i] == propertyName
       )
    {
      var returnCode = this.listenerList[i].executeWithEvent ( ev ) ;
      if ( this._flushed ) return ;
      if ( returnCode === false ) return returnCode ;
    }
  }
};
PropertyChangeHandler.prototype.remove = function ( fe )
{
  for ( var i = 0 ; i < this.listenerList.length ; i++ )
  {
    var e = this.listenerList[i] ;
    if ( e === fe )
    {
      this.listenerList.splice ( i, 1 ) ;
      this.propertyNameList.splice ( i, 1 ) ;
      break ;
    }
    if ( this.listenerList.o === fe )
    {
      this.listenerList.splice ( i, 1 ) ;
      this.propertyNameList.splice ( i, 1 ) ;
      break ;
    }
    if ( this.listenerList.m === fe )
    {
      this.listenerList.splice ( i, 1 ) ;
      this.propertyNameList.splice ( i, 1 ) ;
      break ;
    }
  }
};
PropertyChangeTrait = {} ;
PropertyChangeTrait.__propertyChangeHandler = { create: function(){return new PropertyChangeHandler();} } ;
PropertyChangeTrait.addPropertyChangeListener = function ( obj, method, propertyName )
{
  this.__propertyChangeHandler.add ( obj, method, propertyName ) ;
}
PropertyChangeTrait.removePropertyChangeListener = function ( obj )
{
  this.__propertyChangeHandler.remove ( obj ) ;
}
PropertyChangeTrait._firePropertyChangeEvent = function ( ev, propertyName )
{
  this.__propertyChangeHandler.fireEvent ( ev, propertyName ) ;
};

/**
 *  @constructor
 */
EventMulticaster = function()
{
  Tango.initSuper ( this, PropertyChangeHandler );
  this.jsClassName = "EventMulticaster" ;
}
EventMulticaster.inherits( PropertyChangeHandler ) ;
EventMulticaster.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
};
EventMulticaster.prototype.fireEvent = function ( evt, type )
{
  var returnCode ;
  var ev = null ;
  if ( TGui.isEvent ( evt ) )
  {
    ev = new TEvent ( evt ) ;
    if ( type ) ev.eventType = type  ;
  }
  else
  if ( typeof ( evt ) == 'string' )
  {
    ev = new TEvent ( null ) ;
    ev.eventType = evt  ;
  }
  else
  if ( evt && typeof ( evt ) == 'object' && evt.jsClassName )
  {
    ev = evt ;
    if ( type ) ev.eventType = type  ;
    else
    {
      if ( evt instanceof TItemEvent )
      {
        ev.eventType = ev.item ;
      }
    }
  }
  else
  {
    ev = new TEvent ( evt ) ;
    if ( type ) ev.eventType = type  ;
  }

  for ( var i = 0 ; i < this.listenerList.length ; i++ )
  {
    if (  this.propertyNameList[i] == '*'
       || this.propertyNameList[i] == '.*'
       || this.propertyNameList[i] == ev.eventType
       )
    {
      returnCode = this.listenerList[i].executeWithEvent ( ev ) ;
      if ( ev.isConsumed() ) return ;
      if ( returnCode === false ) return returnCode ;
      if ( this._flushed ) return ;
    }
    else
    if ( this.propertyNameList[i].indexOf ( '*' ) > 0 )
    {
      if ( this.propertyNameList[i].indexOf ( ".*" ) < 0 ) this.propertyNameList[i] = this.propertyNameList[i].replace ( /\*/g, ".*" ) ;
      var reg = new RegExp ( this.propertyNameList[i], 'i' ) ;
      if ( this.propertyNameList[i].match ( reg ) )
      {
        returnCode = this.listenerList[i].executeWithEvent ( ev ) ;
        if ( ev.isConsumed() ) break ;
        if ( returnCode === false ) return returnCode ;
        if ( this._flushed ) break ;
      }
    }
  }
}
EventMulticasterTrait = {} ;
EventMulticasterTrait.__eventMulticaster = { create: function(){return new EventMulticaster();} } ;
EventMulticasterTrait.addListener = function ( obj, method, propertyName )
{
  if ( ! this.__eventMulticaster ) return ;
  this.__eventMulticaster.add ( obj, method, propertyName ) ;
}
EventMulticasterTrait.on = function ( propertyName, obj, method )
{
  this.addListener ( obj, method, propertyName ) ;
}
EventMulticasterTrait.removeListener = function ( obj )
{
  if ( ! this.__eventMulticaster ) return ;
  this.__eventMulticaster.remove ( obj ) ;
}
EventMulticasterTrait._fireEvent = function ( ev, type )
{
  if ( ! this.__eventMulticaster ) return ;
  return this.__eventMulticaster.fireEvent ( ev, type ) ;
}
EventMulticasterTrait.flushEventMulticaster = function()
{
  if ( this.__eventMulticaster ) this.__eventMulticaster.flush() ;
  this.__eventMulticaster = null ;
}


