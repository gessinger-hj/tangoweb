Tango.include ( "TSystem" ) ;
Tango.include ( "TComponents" ) ;
Tango.include ( "TTable" ) ;
Tango.include ( "TWindow" ) ;
Tango.include ( "TUtil" ) ;
Tango.include ( "TDialogChangePassword" ) ;
Tango.include ( "Calypso" ) ;
Tango.include ( "TTagDefinitions" ) ;
Tango.include ( "ReportEditor" ) ;
Tango.include ( "DragAndDrop" ) ;
Tango.include ( "FileRessource" ) ;
Tango.include ( "Net" ) ;
Tango.include ( "TPlot" ) ;
Tango.include ( "Admin" ) ;
Tango.include ( "Cosmos" ) ;
Tango.include ( "THtmlEditor" ) ;
Tango.include ( "RB" ) ;
Tango.include ( "ChartFactory" ) ;
Tango.include ( "FileSystem" ) ;
Tango.include ( "Ls" ) ;
Tango.include ( "Extensions" ) ;
Tango.include ( "MaxiMenu" ) ;

Tango.include ( "CalendarApp" ) ;

function typedParameter ( p0, p1, p2, p3, p4, p5, p6, p7, p8, p9 )
{
log ( "typeof(p0): " + typeof(p0) ) ; log ( "p0: " + p0 ) ;
log ( "typeof(p1): " + typeof(p1) ) ; log ( "p1: " + p1 ) ;
log ( "typeof(p2): " + typeof(p2) ) ; log ( "p2: " + p2 ) ;
log ( "typeof(p3): " + typeof(p3) ) ; log ( "p3: " + p3 ) ;
log ( "typeof(p4): " + typeof(p4) ) ; log ( "p4: " + p4 ) ;
log ( "typeof(p5): " + typeof(p5) ) ; log ( "p5: " + p5 ) ;
log ( "typeof(p6): " + typeof(p6) ) ; log ( "p6: " + p6 ) ;
log ( "typeof(p7): " + typeof(p7) ) ; log ( "p7: " + p7 ) ;
log ( "typeof(p8): " + typeof(p8) ) ; log ( "p8: " + p8 ) ;
log ( "typeof(p9): " + typeof(p9) ) ; log ( "p9: " + p9 ) ;
}
function initialize()
{
//  TSys.createLOG = true ;
  TSys.setApplicationName ( "TEST" ) ;
  var ta = TSys.getCookie ( "TANGOAPP" ) ;
  var m = TSys.getCookie ( "TANGO_MOBILE" ) ;
  var j = TSys.getCookie ( "JSESSIONID" ) ;
TSys.loadLib ( "DBQuery" ) ;

TSys.loadLib ( "FunctionEditor" ) ;
TSys.loadLib ( "IDM", { identity_to_client: false } ) ;
TSys.login ( "root", "654321" ) ;
// TSys.login ( "Admin", "admin_2008" ) ;
  var url = document.URL ;
  var pos = url.indexOf ( "?form=" ) ;
  PluginMonitor = new PluginMonitorClass() ;
  if ( pos > 0 )
  {
    pos = url.indexOf ( "=", pos ) ;
    var formName = url.substring ( pos+1 ) ;
    var startAxlName = "Basic.Main" ;
    TGui.renderStartPage ( startAxlName ) ;
    var form = TGui.selectOrAddMultiform ( "MF", formName ) ;

    if ( form )
    {
      var c = new TContainer ( form ) ;
      var t = c.getExtendedProperty ( "Title" ) ;
      if ( t ) window.document.title = t ;
      var favicon = c.getExtendedProperty ( "Favicon" ) ;
      if ( favicon )
      {
        var foundLink = null ;
        var docHead = document.getElementsByTagName("head")[0] ;
        var links = docHead.getElementsByTagName("link");
        for ( var i = 0 ; i < links.length ; i++ )
        {
          var link = links[i]
          // if (link.type == "image/x-icon" && link.rel == "shortcut icon" )
          if ( link.rel == "shortcut icon" )
          {
            foundLink = link ;
            break ;
          }
        }
        if ( foundLink ) link.href = favicon ;
//     folder-16.ico
// <link id="idfavicon" rel="shortcut icon" href="/apps/TEST/asterisk_yellow.ico" />
      }
    }
    else
    {
      window.document.title = formName ;
    }
  }
  else
  {
    TGui.renderStartPage() ;
  }

//  TSys.loadLib ( "Pagelets" ) ;
//  TSys.loadLib ( "AppleBar" ) ;
  // TSys.loadLib ( "Rating" ) ;

  var p = {} ;
  p.TABLE = "T_EXPORT_PARAMETER" ;
  p.KEY = "ID" ;
  p.NAME = "NAME" ;
  p.VALUE = "VALUE" ;
  p.FOREIGN_KEY = "ID_EXPORT_GROUP" ;
  p.TITLE = "Example..." ;
//  p.SEQUENCE = "S_CDR_FILE" ;
  TSys.loadLib ( "DBAttributes", p ) ;
j = null ;
//log ( "TANGOAPP: " + ta ) ;
//log ( "TANGO_MOBILE: " + m ) ;
//log ( "JSESSIONID: " + j ) ;
//  if ( j )
//  {
//    TSys.joinExistingSession() ;
//  }
//  else TSys.login ( "root", "654321" ) ; //else TSys.login ( "root", "123456" ) ;
// Cosmos.stringName="RessourcesII" ;
//var u = TSys.getUser() ;
//log ( u ) ;
}
_AnimatorColor = null ;
function animColor ( e )
{
  if ( ! _AnimatorColor )
  {
    _AnimatorColor = new Animator().addSubject(new ColorStyleSubject(e.getDom(), 'background-color', "#FFFFFF", "#F4C"));
  }
  _AnimatorColor.toggle() ;
}
_AnimatorOpacity = null ;
_AnimatorOpacityFrom = 0 ;
_AnimatorOpacityTo = 1 ;
function animOpacity ( e )
{
  if ( ! _AnimatorOpacity )
  {
    _AnimatorOpacity = new Animator (
    { onComplete:function()
      {
//log ( "------------------ onComplete ------" ) ;
      }
    , onStep:function()
      {
//log ( "------------------ onStep ------" ) ;
      }
    }) ;
    _AnimatorOpacity.addSubject(new NumericalStyleSubject(e.getDom(), 'opacity', _AnimatorOpacityFrom, _AnimatorOpacityTo));
  }
  _AnimatorOpacity.toggle() ;
}
GUIHandlerClass = function()
{
}
GUIHandlerClass.prototype =
{
  counter: 0,
  first: true,
  number: "123456",
  _constructor_: function()
  {
    this.first = false ;
  },
  onload: function(event)
  {
    this.container = event.getContainer() ;
    this.ch = this.container.getComponent ( "CHOICE" ) ;
  },
  handleChoice: function(event)
  {
    log ( "Number of items: " + this.ch.getNumberOfItems() ) ;
    var n = this.ch.getNumberOfItems() ;
    if ( n & 1 ) this.ch.setVisible ( false ) ;
    else this.ch.setVisible ( true ) ;
  },
  setV: function(event)
  {
    this.counter++ ;
    log ( "counter: " + this.counter ) ;
    var v = this.container.getValues() ;
    var MAIL = v.ensureXml ( "ADDRESS/MAIL" ) ;
    MAIL.setContent ( "xxxxxxxxxx" ) ;
    var CHOICE = v.ensureXml ( "ADDRESS/CHOICE" ) ;
    CHOICE.setContent ( 3 ) ;
    this.container.setValues ( v ) ;
  },
  showWindow: function(event)
  {
    var w = new TWindow ( "Window.Sample" ) ;
    w.setPagelet ( this ) ;
    w.create() ;
    w.show() ;
  }
}
function showDesklet ( name )
{
/*
  var elem = document.getElementById('myCanvas');
  if ( ! elem || ! elem.getContext ) return ;

  var context = elem.getContext('2d');
  if (context) {
  context.translate(0, 0);
//  context.rotate ( 0 );
  }
*/
//  TGui.addEventListener ( elem, "mousedown", function ( event ) { log ( "xxx" ) ; } ) ;
/*
context.fillStyle   = '#00f';
context.lineWidth   = 1;
context.strokeStyle = '#EEC900';
context.strokeRect(0,  0, 300, 150);
context.fillRect  (0,   0, 150, 50);
*/
/*
context.clearRect (30, 25,  90, 60);
*/
/*
var img = document.createElement ( 'img' ) ;
img.src = 'cosmos/clocks/OSXClock/base.png' ;
context.drawImage(img, 0, 0);
*/
}
C1 = function()
{
  this.jsClassName = "C1" ;
  Tango.mixin ( EventMulticasterTrait, this ) ;
};
//C1.prototype._parent = null ;
C1.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
}
C1.prototype.f1 = function(p1, p2)
{
  log ( "--------C1 ----------" ) ;
  log ( this + "- f1" ) ;
  log ( "p1=" + p1 ) ;
  log ( "p2=" + p2 ) ;
}
C1.prototype.f2 = function ( a, b )
{
  log ( "C1.prototype.f2" ) ;
  log ( this + ".f2() ----------" ) ;
  log ( "a=" + a ) ;
  log ( "b=" + b ) ;
}

C2 = function()
{
  Tango.initSuper ( this, C1 ) ;
  this.jsClassName = "C2" ;
};
C2.inherits( C1 ) ;
C2.prototype.f1 = function()
{
  log ( "--------C2 ----------" ) ;
  log ( this + "- f1" ) ;
  this._super_.f1.apply ( this, arguments ) ;
}
C3 = function()
{
  Tango.initSuper ( this, C2 ) ;
  this.jsClassName = "C3" ;
};
C3.inherits( C2 ) ;
C3.prototype.f2 = function ( a, b )
{
  log ( this + ".f2() ----------" ) ;
  // callSuper ( this, "f2", a, b )
  callSuper ( this, "f2", arguments ) ;
}

FInterface = {} ;
FInterface._parent = "PARENT" ;
FInterface.getParent = function() { return this._parent ; }
function inheritTest()
{
  var c1 = new C1() ;
  var c2 = new C2() ;
  var c3 = new C3() ;
Tango.mixin ( FInterface, c1 ) ;
log ( "log---------------------" ) ;
log ( c1 ) ;
log ( c2 ) ;
log ( "c1.f1()--------------------" ) ;
c1.f1("A","B") ;
log ( "c2.f1()--------------------" ) ;
c2.f1("AA","BB") ;
var s = c1 == "(C1)" ;
log ( "s=" + s ) ;
log ( "FInterface.getParent()=" + FInterface.getParent() ) ;
log ( "typeof (c1.getParent)=" + typeof (c1.getParent) ) ;
log ( "typeof (c1._parent)=" + typeof (c1._parent) ) ;
log ( "c1._parent=" + c1._parent ) ;
log ( "c1.getParent()=" + c1.getParent() ) ;

c1.addListener ( function(e)
		{
		log ( e.getType() ) ;
		}) ;
c1._fireEvent ( "XXX--XXXX" ) ;
  c3.f2 ( 1, 2 ) ;
}
function callSuper ( obj, name, a )
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
      // proto[name].apply ( obj, Array.prototype.slice.call( arguments, 2 ) ) ;
      proto[name].apply ( obj, a ) ;
      break ;
    }
  }
}
DatabaseConnectionEditor = function()
{
	this.container ;
  this.r1 = new RegExp( "\\$\\[name\\]", "g");
  this.r2 = new RegExp( "\\$\\[host\\]", "g");
  this.r3 = new RegExp( "\\$\\[port\\]", "g");
};
DatabaseConnectionEditor.prototype =
{
  vendor:
	{
		oracle:
	 	{
      pattern: "jdbc:oracle:thin:@$[host]:$[port]:$[name]"
    , port: 1521
		}
//jdbc:ingres://localhost:2521/UDID;dbms_user=mcmd;dbms_password=mcmd
	, sqlite:
 		{
			pattern: "jdbc:sqlite:$[file]"
    , port: ""
		}
	, mysql:
 		{
			pattern: "jdbc:mysql://$[host]:$[port]/$[name]"
    , port: 3306
		}
	, sybase:
 		{
			pattern: "jdbc:sybase:Tds:$[host]:$[port]/$[name]"
    , port: 2638
		}
	, postgresql:
 		{
			pattern: "jdbc:postgresql://$[host]:$[port]/$[name]"
    , port: 5432
		}
	},
  onload: function ( ev )
	{
	  this.container = ev.getContainer() ;
		var x = new TXml() ;
		var xd = x.add ( "vendor" ) ;
		for ( var k in this.vendor )
		{
			var o = xd.add ( "option", k ) ;
		}
    this.container.setValues ( x ) ;
		this.patternLabel = this.container.getComponent ( "pattern" ) ;
	},
  onchange: function ( event )
	{
		var v = $V ( event ) ;
		this.container.reset() ;
    this.vendorName = v.getContent ( "vendor" ) ;
		if ( ! this.vendorName ) return ;
		this.pattern = this.vendor[this.vendorName].pattern ;
		var x = new TXml() ;
		x.add ( "host", "localhost" ) ;
		x.add ( "port", this.vendor[this.vendorName].port ) ;
    this.container.setValues ( x ) ;
		this.setPatternLabel ( event ) ;
	},
  test: function ( event )
	{
		var v = $V ( event ) ;
		log ( v ) ;
	},
  save: function ( event )
	{
		var v = $V ( event ) ;
		log ( v ) ;
	},
  setPatternLabel: function ( event )
	{
    if ( ! this.pattern ) return ;
		var v = $V ( event ) ;
    var p = this.pattern.replace ( this.r1, v.getContent ( "name" ) )
			             			.replace ( this.r2, v.getContent ( "host" ) )
                   			.replace ( this.r3, v.getContent ( "port" ) )
									 			;
		this.patternLabel.setText ( p ) ;
  },
  onkeyup: function ( event )
  {
    this.setPatternLabel ( event ) ;
  },
  cancel: function ( event )
  {
  }
};


function checkPassword ( event )
{
  var ev = $E ( event ) ;
  // log ( ev ) ;
  var t = ev.getSource().value ;
  var c = ev.getContainer() ;
  var o = testPassword ( t ) ;
// log ( o, true ) ;
  c.getComponent ( "passwordmeter" ).setText ( o.html ) ;
};
function mosel_webcams  ( title )
{
  var baseUrl = "http://www.mosel-webcams.de/"
  baseUrl += title.toLowerCase() ;

  var id = baseUrl.replace ( /\//g, '_' ).replace ( /:/g, '_' ).replace ( /\=/g, '_' ).replace ( /&/g, '_' ).replace ( /,/g, "_" ).replace ( /\?/g, "_" ) ;
  var url = baseUrl ;
  url = url.replace ( /&/g, "&amp;" ) ;
// log ( "url=" + url ) ;

  var s = ""
        + "<xml>\n"
        + "  <Window resizable='false' title='" + title + "' id='" + id + "'>\n"
        + "    <Container name='Form' style='left:0px;top:0px;width:610px;height:434px;overflow:hidden;right:-0;bottom:-0;' >\n"
        + "<iframe src='" + url + "' style='margin:0px;border:0px;left:-34px;top:-282px;overflow:hidden;width:610px;height:480px;bottom:-0;right:-0;'>\n"
        + "</iframe>\n"
        + "    </Container>\n"
        + "  </Window>\n"
        + "</xml>\n"
        ;
  // var w = new CosmosWindow ( s ) ;
  var w = new TWindow ( s ) ;
  // var dom = TSys.parseDom ( s ) ;
  // var w = new TWindow ( dom ) ;
  w.create() ;
  w.show() ;
  return w ;
};
getCssValues = function ( selector )
{
  var themeName = "/" + Tango.getThemeName() + "/" ;
  var a = {} ;
  for ( var i = 0 ; i < document.styleSheets.length ; i++ )
  {
    var sheet = document.styleSheets[i];
    if ( ! sheet.href ) continue ;
    // if ( sheet.href.indexOf ( themeName ) < 0 ) continue ;
    var rules = null ;
    if ( sheet.cssRules) rules = sheet.cssRules;
    else
    if ( sheet.rules) rules = sheet.rules;
    for ( var j = 0 ; j < rules.length ; j++ )
    {
      if ( ! rules[j].selectorText ) continue ;
      if ( rules[j].selectorText.indexOf ( ".Theme" ) >= 0 )
      {
        var r = rules[j] ;
        var selectorText = r.selectorText ;
        var pos = selectorText.indexOf ( "," ) ;
        if ( pos > 0 ) selectorText = selectorText.substring ( 0, pos ) ;
        if ( selectorText.indexOf ( ".Theme" ) === 0 )
        {
          selectorText = selectorText.substring ( 6 ) ;
        }
        if ( selectorText.indexOf ( "." ) === 0 )
        {
          selectorText = selectorText.substring ( 1 ) ;
        }
        if ( selector && ! selector[selectorText] )
        {
          continue ;
        }
        var o = {} ;
        // o.width  = r.style.width ;
        // o.height = r.style.height ;
        // o.right  = r.style.right ;
        // o.left   = r.style.left ;
        // o.top    = r.style.top ;
        var k = 0 ;
        if ( r.style.width ) { o.width         = TGui.parsePixel ( r.style.width ) ; k = 1 ; }
        if ( r.style.height ) { o.height        = TGui.parsePixel ( r.style.height ) ; k = 1 ; }
        if ( r.style.right ) { o.right         = TGui.parsePixel ( r.style.right ) ; k = 1 ; }
        if ( r.style.left ) { o.left          = TGui.parsePixel ( r.style.left ) ; k = 1 ; }
        if ( r.style.top ) { o.top           = TGui.parsePixel ( r.style.top ) ; k = 1 ; }
        if ( r.style.padding ) { o.padding       = TGui.parsePixel ( r.style.padding ) ; k = 1 ; }
        if ( r.style.paddingTop ) { o.paddingTop    = TGui.parsePixel ( r.style.paddingTop ) ; k = 1 ; }
        if ( r.style.paddingLeft ) { o.paddingLeft   = TGui.parsePixel ( r.style.paddingLeft ) ; k = 1 ; }
        if ( r.style.paddingBottom ) { o.paddingBottom = TGui.parsePixel ( r.style.paddingBottom ) ; k = 1 ; }
        if ( r.style.paddingRight ) { o.paddingRight  = TGui.parsePixel ( r.style.paddingRight ) ; k = 1 ; }
        if ( k )
        {
          a[selectorText] = o ;
        }
      }
    }
  }
  return a ;
};
