//http://178.63.86.211/solute/cd/banner
//http://www.mupads.de/solute/cd/banner
//http://afe2.specificclick.net/adserve/
//http://im.banner.t-online.de/addyn/3.0
//http://im.banner.t-online.de/bind
Tango.include ( "TSystem" ) ;
Tango.include ( "TComponents" ) ;
Tango.include ( "TTable" ) ;
Tango.include ( "TWindow" ) ;
//Tango.include ( "TSpecialWindows" ) ;
Tango.include ( "TUtil" ) ;
Tango.include ( "TDialogChangePassword" ) ;
Tango.include ( "Calypso" ) ;
Tango.include ( "TTagDefinitions" ) ;
Tango.include ( "ReportEditor" ) ;
Tango.include ( "TFileHandler" ) ;
Tango.include ( "TFileExplorer" ) ;
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
Calendar = function ( dt )
{
  if ( ! dt ) this.date = new Date() ;
  else
  if ( TSys.isDate  ( td ) )
  {
    this.date = dt ;
  }
  else
  if ( typeof ( dt ) == 'number' )
  {
    this.date = new Date ( dt ) ;
  }
  else
  if ( typeof ( dt ) == 'string' )
  {
    this.date = DateUtils.parseDate ( dt ) ;
  }
  this.jsClassName        = "Calendar" ;
  this.newYearsEveFactor  = 0.5 ;
  this.christmasEveFactor = 0.5 ;
  this.hoursPerDay        = 8.0 ;
};

Calendar.prototype.AREAS                        = {} ;
Calendar.prototype.AREAS.GERMANY                = "GERMANY" ;
Calendar.prototype.AREAS.BADEN_WUERTTEMBERG     = "BADEN_WUERTTEMBERG" ;
Calendar.prototype.AREAS.BAYERN                 = "BAYERN" ;
Calendar.prototype.AREAS.BERLIN                 = "BERLIN" ;
Calendar.prototype.AREAS.BRANDENBURG            = "BRANDENBURG" ;
Calendar.prototype.AREAS.BREMEN                 = "BREMEN" ;
Calendar.prototype.AREAS.HAMBURG                = "HAMBURG" ;
Calendar.prototype.AREAS.HESSEN                 = "HESSEN" ;
Calendar.prototype.AREAS.MECKLENBURG_VORPOMMERN = "MECKLENBURG_VORPOMMERN" ;
Calendar.prototype.AREAS.NIEDERSACHSEN          = "NIEDERSACHSEN" ;
Calendar.prototype.AREAS.NORDRHEIN_WESTFALEN    = "NORDRHEIN_WESTFALEN" ;
Calendar.prototype.AREAS.RHEINLAND_PFALZ        = "RHEINLAND_PFALZ" ;
Calendar.prototype.AREAS.SAARLAND               = "SAARLAND" ;
Calendar.prototype.AREAS.SACHSEN                = "SACHSEN" ;
Calendar.prototype.AREAS.SACHSEN_ANHALT         = "SACHSEN_ANHALT" ;
Calendar.prototype.AREAS.SCHLESWIG_HOLSTEIN     = "SCHLESWIG_HOLSTEIN" ;
Calendar.prototype.AREAS.THUERINGEN             = "THUERINGEN" ;
Calendar.prototype.AREAS.AUSTRIA                = "AUSTRIA" ;
Calendar.prototype.AREAS.SCHWEIZ                = "SCHWEIZ" ;
Calendar.prototype.AREAS.FRANCE                 = "FRANCE" ;
Calendar.prototype.AREAS.UK                     = "UNITED_KINGDOM" ;
Calendar.prototype.AREAS.DEFAULT                = Calendar.prototype.AREAS.GERMANY ;

Calendar.prototype._VariableFreedays = null ;
Calendar.prototype._FixedFreedays = null ;

Calendar.prototype._initialize = function()
{
  if ( this._VariableFreedays )
  {
    return ;
  }
  this._FixedFreedays  = {} ;
  this._VariableFreedays = {} ;

  var BW = this.setGermanFreedays() ; //      Baden-Wuerttemberg
  var BY = this.setGermanFreedays() ; //      Bayern
  var BE = this.setGermanFreedays() ; //      Berlin
  var BB = this.setGermanFreedays() ; //      Brandenburg
  var HB = this.setGermanFreedays() ; //      Hansestadt Bremen
  var HH = this.setGermanFreedays() ; //      Hansestadt Hamburg
  var HE = this.setGermanFreedays() ; //      Hessen
  var MV = this.setGermanFreedays() ; //      Mecklenburg-Vorpommern
  var NI = this.setGermanFreedays() ; //      Niedersachsen
  var NW = this.setGermanFreedays() ; //      Nordrhein-Westfalen
  var RP = this.setGermanFreedays() ; //      Rheinland-Pfalz
  var SL = this.setGermanFreedays() ; //      Saarland
  var SN = this.setGermanFreedays() ; //      Sachsen
  var ST = this.setGermanFreedays() ; //      Sachsen-Anhalt
  var SH = this.setGermanFreedays() ; //      Schleswig-Holstein
  var TH = this.setGermanFreedays() ; //      Thueringen

  var DEF = this.setGermanFreedays() ;

  BW[0][5] = -1 ; //  6. Januar Heilige Drei Koenige
  BY[0][5] = -1 ; //  6. Januar Heilige Drei Koenige
  ST[0][5] = -1 ; //  6. Januar Heilige Drei Koenige

  SL[7][14] = -1 ; //  15. August Mariae Himmelfahrt

  BB[9][30] = -1 ; //  31. Oktober Reformationstag
  MV[9][30] = -1 ; //  31. Oktober Reformationstag
  SN[9][30] = -1 ; //  31. Oktober Reformationstag
  ST[9][30] = -1 ; //  31. Oktober Reformationstag
  TH[9][30] = -1 ; //  31. Oktober Reformationstag

  BW[10][0] = -1 ; //  1. November Allerheiligen
  BY[10][0] = -1 ; //  1. November Allerheiligen
  NW[10][0] = -1 ; //  1. November Allerheiligen
  RP[10][0] = -1 ; //  1. November Allerheiligen
  SL[10][0] = -1 ; //  1. November Allerheiligen
  SN[10][0] = -1 ; //  1. November Allerheiligen

  this._FixedFreedays [ this.AREAS.BADEN_WUERTTEMBERG ]     = BW ;
  this._FixedFreedays [ this.AREAS.BAYERN ]                 = BY ;
  this._FixedFreedays [ this.AREAS.BERLIN ]                 = BE ;
  this._FixedFreedays [ this.AREAS.BRANDENBURG ]            = BB ;
  this._FixedFreedays [ this.AREAS.BREMEN ]                 = HB ;
  this._FixedFreedays [ this.AREAS.HAMBURG ]                = HH ;
  this._FixedFreedays [ this.AREAS.HESSEN ]                 = HE ;
  this._FixedFreedays [ this.AREAS.MECKLENBURG_VORPOMMERN ] = MV ;
  this._FixedFreedays [ this.AREAS.NIEDERSACHSEN ]          = NI ;
  this._FixedFreedays [ this.AREAS.NORDRHEIN_WESTFALEN ]    = NW ;
  this._FixedFreedays [ this.AREAS.RHEINLAND_PFALZ ]        = RP ;
  this._FixedFreedays [ this.AREAS.SAARLAND ]               = SL ;
  this._FixedFreedays [ this.AREAS.SACHSEN ]                = SN ;
  this._FixedFreedays [ this.AREAS.SACHSEN_ANHALT ]         = ST ;
  this._FixedFreedays [ this.AREAS.SCHLESWIG_HOLSTEIN ]     = SH ;
  this._FixedFreedays [ this.AREAS.THUERINGEN ]             = TH ;
  this._FixedFreedays [ this.AREAS.DEFAULT ]                = DEF ;

  var i = 0 ;

  var AUS = [] ; //      AUSTRIA
  for ( i = 0 ; i < 12 ; i++ ) AUS[i] = [] ;

  AUS[0][0] = -1 ;   // 1. Januar
  AUS[0][5] = -1 ; //  6. Januar Heilige Drei Koenige
  AUS[4][0] = -1 ;   // 1. Mai / Staatsfeiertag
  AUS[7][14] = -1 ; //  15. August Mariae Himmelfahrt
  AUS[9][25] = -1 ; //  26. Oktober Nationalfeiertag
  AUS[10][0] = -1 ; //  1. November Allerheiligen
  AUS[11][7] = -1 ; //    8. Dezember Mariae Empfaengnis
  AUS[11][23] = -0.5 ; //    Heiligabend
  AUS[11][24] = -1 ; //    1. Weihnachtstag
  AUS[11][25] = -1 ; //    Stephanstag / 2. Weihnachtstag
  AUS[11][30] = -0.5 ; //    Silvester
  this._FixedFreedays [ this.AREAS.AUSTRIA ] = AUS ;

  var SCHW = [] ; //      SCHWEIZ
  for ( i = 0 ; i < 12 ; i++ ) SCHW[i] = [] ;
  SCHW[0][0] = -1 ;   // 1. Januar
  SCHW[7][1] = -1 ; //  1. August Nationalfeiertag
  SCHW[11][23] = -0.5 ; //    Heiligabend
  SCHW[11][24] = -1 ; //    1. Weihnachtstag
  SCHW[11][30] = -0.5 ; //    Silvester
  this._FixedFreedays [ this.AREAS.SCHWEIZ ] = SCHW ;

  var FRA = [] ; //      FRANCE
  for ( i = 0 ; i < 12 ; i++ ) FRA[i] = [] ;
  FRA[0][0] = -1 ;   // 1. Januar
  FRA[4][0] = -1 ;   // 1. Mai
  FRA[4][7] = -1 ; //  8. Mai / Tag des Sieges 1945
  FRA[6][14] = -1 ; //  14. Juli / Nationalfeiertag
  FRA[7][14] = -1 ; //  15. August Mariae Himmelfahrt
  FRA[10][0] = -1 ; //  1. November Allerheiligen
  FRA[10][10] = -1 ; //  11. November / Gedenktag 1914
  FRA[11][23] = -0.5 ; //    Heiligabend
  FRA[11][24] = -1 ; //    1. Weihnachtstag
  FRA[11][30] = -0.5 ; //    Silvester
  this._FixedFreedays [ this.AREAS.FRANCE ] = FRA ;

  var U = [] ; //      UK
  for ( i = 0 ; i < 12 ; i++ ) U[i] = [] ;
  U[0][0] = -1 ;   // 1. Januar
  U[4][0] = -1 ;   // 1. Mai

  U[4][29] = -1 ; //  30. Mai Springbank holiday ???
  U[7][29] = -1 ; //  29. August Summer bank holiday ???
  U[11][23] = -0.5 ; //    Heiligabend
  U[11][24] = -1 ; //    1. Weihnachtstag / Christmas day
  U[11][25] = -1 ; //    2. Weihnachtstag / Boxing day
  U[11][30] = -0.5 ; //    Silvester
  this._FixedFreedays [ this.AREAS.UK ] = U ;
};
Calendar.prototype.setChristmasEveFactor = function ( factor )
{
  this._initialize() ;
  this.christmasEveFactor = factor ;
  for ( var k in this._FixedFreedays )
  {
    var aa = this._FixedFreedays[k] ;
    aa[11][23] = - this.christmasEveFactor ;
  }
};
Calendar.prototype.setNewYearsEveFactor = function ( factor )
{
  this._initialize() ;
  this.newYearsEveFactor  = factor ;
  for ( var k in this._FixedFreedays )
  {
    var aa = this._FixedFreedays[k] ;
    aa[11][30] = - this.newYearsEveFactor ;
  }
};
Calendar.prototype.setHoursPerDay = function ( hoursPerDay )
{
  this._initialize() ;
  this.hoursPerDay = hoursPerDay ;
};
Calendar.prototype.getFixedFreedaysFor = function ( areaName )
{
  if ( ! this._FixedFreedays )
  {
    this._initialize() ;
  }
  var a = this._FixedFreedays[areaName] ;
  if ( a ) return a ;
  return this._FixedFreedays[this.AREAS.DEFAULT] ;
};
Calendar.prototype.getVariableFreedays = function ( areaName, year )
{
  if ( ! this._VariableFreedays )
  {
    this._initialize() ;
  }
  var variable = this._VariableFreedays[ areaName + ":" + year ] ;
  if ( ! variable )
  {
    variable = this.fillVariableFreedays ( areaName, year ) ;
    this._VariableFreedays[ areaName + ":" + year ] = variable ;
  }
  return variable ;
};
Calendar.prototype.calculateSpecificFreedays = function ( areaName, year )
{
  var XX = [] ;
  for ( var i = 0 ; i < 12 ; i++ ) XX[i] = [] ;
  if ( areaName === this.AREAS.SACHSEN )
  {
    var d = this.calculateBussUndBettag ( year ) ;
    var month = d.getMonth() ;
    var day   = d.getDate() - 1 ;
    XX[month][day] = -1 ;
  }
  return XX ;
};
Calendar.prototype.calculateBussUndBettag = function ( year )
{
  var start = new Date ( year, 11, 24, 0, 0, 0 ) ;
  var i =0 ;
  for ( i = 0 ; i < 40 ; i++ )
  {
    if ( start.getDay() === 0 )
    {
      break ;
    }
    start = DateUtils.addDay ( start, -1 ) ;
  }
  start = DateUtils.addDay ( start, - ( 7 * 4 ) ) ;
  for ( i = 0 ; i < 40 ; i++ )
  {
    if ( start.getDay() === 3 )
    {
      break ;
    }
    start = DateUtils.addDay ( start, -1 ) ;
  }
  //start = DateUtils.addDay ( start, -1 ) ;
  return start ;
};
Calendar.prototype.setGermanFreedays = function ( XX )
{
  if ( ! XX ) XX = [] ;
  for ( var i = 0 ; i < 12 ; i++ ) XX[i] = [] ;
  XX[0][0] = -1 ;   // 1. Januar
  XX[4][0] = -1 ;   // 1. Mai
  XX[9][2] = -1 ;   // 3. Oktober Deutschen Einheit
  XX[11][23] = -0.5 ; //    Heiligabend
  XX[11][24] = -1 ; //    1. Weihnachtstag
  XX[11][25] = -1 ; //    2. Weihnachtstag
  XX[11][30] = -0.5 ; //    Silvester
  return XX ;
};
Calendar.prototype.fillVariableFreedays = function ( areaName, year )
{
  var variable = [] ;
  for ( var i = 0 ; i < 12 ; i++ ) variable[i] = [] ;
  var ostern = this.getEasterAsMarchDay ( year ) ;

  var d = new Date ( year, 2, 1, 0, 0, 0 ) ;
  ostern -= 1 ;
  var month = 0 ;
  var day   = 0 ;

  if ( areaName === this.AREAS.FRANCE )
  {
    d = DateUtils.addDay ( d, ostern + 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Ostermontag

    d = DateUtils.addDay ( d, 38 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Christi Himmelfahrt

    d = DateUtils.addDay ( d, 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Pfingstmontag
  }
  else
  if ( areaName === this.AREAS.AUSTRIA )
  {
    d = DateUtils.addDay ( d, ostern + 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Ostermontag

    d = DateUtils.addDay ( d, 38 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Christi Himmelfahrt

    d = DateUtils.addDay ( d, 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Pfingstmontag

    d = DateUtils.addDay ( d, 10 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Fronleichnam 
  }
  else
  if ( areaName === this.AREAS.SCHWEIZ )
  {
    d = DateUtils.addDay ( d, ostern + 38 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Christi Himmelfahrt
  }
  else
  if ( areaName === this.AREAS.UK )
  {
    d = DateUtils.addDay ( d, ostern - 2 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Karfreitag

    d = DateUtils.addDay ( d, 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Ostermontag

    d = DateUtils.addDay ( d, 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Pfingstmontag
  }
  else
  {
    d = DateUtils.addDay ( d, ostern - 2 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Karfreitag

    d = DateUtils.addDay ( d, 2 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Ostersonntag

    d = DateUtils.addDay ( d, 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Ostermontag

    d = DateUtils.addDay ( d, 38 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Christi Himmelfahrt

    d = DateUtils.addDay ( d, 10 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Pfingstsonntag

    d = DateUtils.addDay ( d, 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Pfingstmontag

    if ( ! ( areaName === this.AREAS.HAMBURG ) )
    {
      d = DateUtils.addDay ( d, 10 ) ;
      month = d.getMonth() ;
      day   = d.getDate() ;
      variable[month][day-1] = -1 ; // Fronleichnam 
    }
  }
  return variable ;
};
Calendar.prototype.getFreedays = function ( year, month, areaName )
{
    if ( ! areaName ) areaName = this.AREAS.DEFAULT ;
    var a = [] ;
    var fixed = this.getFixedFreedaysFor ( areaName ) ;
    var specific = this.calculateSpecificFreedays ( areaName, year ) ;
    var variable = this.getVariableFreedays ( areaName, year ) ;
    var j ;
    for ( j = 0 ; j < 31 ; j++ )
    {
      if ( typeof ( fixed[month][j] ) != 'undefined' && fixed[month][j] != 0 )
      {
        a[j] = fixed[month][j] ; //1 ;
      }
      else
      if ( typeof ( specific[month][j] ) != 'undefined' && specific[month][j] != 0 )
      {
        a[j] = specific[month][j] ; //1 ;
      }
      else
      if ( typeof ( variable[month][j] ) != 'undefined' && variable[month][j] != 0 )
      {
        a[j] = variable[month][j] ; //1 ;
      }
    }
    return a ;
};
Calendar.prototype.getEasterDate = function ( year )
{
  var easter = this.getEasterAsMarchDay ( year ) ;
  var ed = new Date ( year, 2, 1, 0, 0, 0 ) ;
  if ( easter > 31 )
  {
    easter -= 31 ;
    ed = DateUtils.addMonth ( ed, 1 ) ;
    ed.setDate ( easter ) ;
  }
  return ed ;
};
Calendar.prototype.getEasterAsMarchDay = function ( year )
{
  var a = year % 19 ;
  var b = year % 4 ;
  var c = year % 7 ;
  var H1 = Math.floor ( year / 100 ) ;
  var H2 = Math.floor ( year / 400 ) ;
  var q = 4 + H1 - H2 ;
  var m = 15 + H1 - H2 - ( ( 8 * H1 + 13 ) / 25 ) ;
  m = 15 + H1 - H2 - Math.floor ( ( 8 * H1 + 13 ) / 25 ) ;
  var d = ( 19 * a + m ) % 30 ;
  var e = ( 2 * b + 4 * c + 6 * d + q ) % 7 ;
  var march_day = 22 + d + e ;
  if ( march_day === 57 ) march_day = 50 ;
  if ( d === 28 && e === 6 && a > 10 ) march_day = 49 ;
  return march_day ;
};
Calendar.prototype.getBeweglicheFeiertage = function ( year )
{
  var h = new TXml() ;
  var item = null ;
  var ostern = this.getEasterAsMarchDay ( year ) ;

  var d = new Date ( year, 2, 1, 0, 0, 0 ) ;
  ostern -= 1 ;

  d  = DateUtils.addDay ( d, ostern - 46 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Aschermittwoch" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 43 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Gr\u00FCndonnerstag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 1 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Karfreitag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 2 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Ostersonntag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 1 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Ostermontag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 38 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Christi Himmelfahrt" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 10 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Pfingstsonntag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 1 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Pfingstmontag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 10 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Fronleichnam" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d = this.calculateBussUndBettag ( year ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Bu&szlig; und Bettag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  return h ;
};
Calendar.prototype.calculateNumberOfWorkingHours = function ( start, end, areaName, hoursPerDay )
{
  if ( ! start ) return 0 ;
  if ( ! end ) return 0 ;
  hoursPerDay = hoursPerDay ? hoursPerDay : this.hoursPerDay ;

  var start_time = start.getTime() / 1000 ;
  var end_time = end.getTime() / 1000 ;

  if ( end_time < start_time )
  {
    var s = start_time ;
    start_time = end_time ;
    end_time = s ;
  }

  var n = 0 ;
  var start_year  = start.getFullYear() ;
  var start_momth = start.getMonth() ;
  var start_day   = start.getDate() ;

  var end_year  = end.getFullYear() ;
  var end_momth = end.getMonth() ;
  var end_day   = end.getDate() ;

  var current = start ;

  if ( ! areaName ) areaName = this.AREAS.DEFAULT ;
  fixed = this.getFixedFreedaysFor ( areaName ) ;
  specific = this.calculateSpecificFreedays ( areaName, start_year ) ;
  while ( true )
  {
    var year      = current.getFullYear() ;
    var dayOfWeek = current.getDay() ;
    var month     = current.getMonth() ;
    var day       = current.getDate() ;

    if ( dayOfWeek == 0 || dayOfWeek == 6 ) //TODO: max / min ?
    {
      if (  end_year == current.getFullYear()
         && end_momth == current.getMonth()
         && end_day == current.getDate()
         )
      {
        break ;
      }
      current = DateUtils.addDay ( current, 1 ) ;
      continue ;
    }
    n += 1 ; //XXXXXXXXXXXXXXXX

    if ( year != start_year )
    {
      specific = this.calculateSpecificFreedays ( areaName, year ) ;
    }
    var variable = this.getVariableFreedays ( areaName, year ) ;

    var f = fixed[month][day-1] ;
    if ( ! f ) f = 0 ;
    var v = variable[month][day-1] ;
    if ( ! v ) v = 0 ;
    var s = specific[month][day-1] ;
    if ( ! s ) s = 0 ;
    if ( hoursPerDay >= 1 )
    {
      if ( f != 0 ) n += f ;
      else
      if ( v != 0 ) n += v ;
      else
      if ( s != 0 ) n += s ;
    }
    else
    {
      if ( f != 0 ) n += 1 ;
      else
      if ( v != 0 ) n += 1 ;
      else
      if ( s != 0 ) n += 1 ;
    }

    if (  end_year == current.getFullYear()
       && end_momth == current.getMonth()
       && end_day == current.getDate()
       )
    {
      break ;
    }
    current = DateUtils.addDay ( current, 1 ) ;
  }
  return hoursPerDay * n ;
}

CalendarApp = function()
{
  this._cal = new Calendar() ;
  this._cal.setChristmasEveFactor ( 1 ) ;
  this._cal.setNewYearsEveFactor ( 1 ) ;
  this._cal.setHoursPerDay ( 8.5 ) ;
};
CalendarApp.prototype.getEasterDate = function ( year )
{
log ( "year=" + year ) ;
  var easter = this._cal.getEasterDate ( year ) ;
log ( "easter=" + easter ) ;
};
CalendarApp.prototype.getBeweglicheFeiertage = function ( year )
{
log ( "year=" + year ) ;
  var x = this._cal.getBeweglicheFeiertage ( year ) ;
log ( x ) ;
};
CalendarApp.prototype.getFreedays = function ( year, month )
{
log ( "year=" + year ) ;
log ( "month=" + month ) ;
  var x = this._cal.getFreedays ( year, month, this._cal.SACHSEN ) ;
log ( "==============================" ) ;
log ( x ) ;
};
CalendarApp.prototype.calculateNumberOfWorkingHours = function ( year, month )
{
  var start = new Date ( 2013, 11, 1 ) ;
  var end = new Date ( 2013, 11, 31 ) ;
log ( "start=" + start ) ;
log ( "end=" + end ) ;
  var n = this._cal.calculateNumberOfWorkingHours ( start, end, null ) ;
log ( "n=" + n ) ;
};
CalendarApp.prototype.calculateFromCalendars = function ( event )
{
  var ev = new TEvent ( event ) ;
  var c = ev.getContainer() ;
  var cSTART = c.getComponent ( "START" ) ;
  var cEND   = c.getComponent ( "END" ) ;
  var start = cSTART.getDate() ;
  var end = cEND.getDate() ;
  if ( start.getTime() > end.getTime() )
  {
    end = start ;
    cEND.setTime ( end ) ;
  }
  var n = this._cal.calculateNumberOfWorkingHours ( start, end, null ) ;
  var cNOWH = c.getComponent ( "NOWH" ) ;
  cNOWH.setText ( n ) ;

  var n1 = this._cal.calculateNumberOfWorkingHours ( start, end, null, 1 ) ;
  var cNOWD = c.getComponent ( "NOWD" ) ;
  cNOWD.setText ( n1 ) ;
};
CalendarApp.prototype.areaChanged = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var areaName = v.getContent ( "areaName" ) ;
  var c = ev.getContainer() ;
  var cSTART = c.getComponent ( "START" ) ;
  var cEND   = c.getComponent ( "END" ) ;
  var start = cSTART.getVisibleDate() ;
  var end = cEND.getVisibleDate() ;
  Calendar.prototype.AREAS.DEFAULT = areaName ;
  cSTART.setVisibleDate ( start ) ;
  cEND.setVisibleDate ( end ) ;
};
CalendarApp.prototype.onopen = function ( event )
{
  try
  {
    var xml = TSys.getUserXml ( "CalendarApp.xml" ) ;
    this._cal.christmasEveFactor = xml.get ( "christmasEveFactor" ) ;
    this._cal.newYearsEveFactor = xml.get ( "newYearsEveFactor" ) ;
  }
  catch ( exc )
  {
    // log ( exc ) ;
  }
};
CalendarApp.prototype.onclose = function ( event )
{
  var xml = new TXml() ;
  xml.add ( "christmasEveFactor", this._cal.christmasEveFactor ) ;
  xml.add ( "newYearsEveFactor", this._cal.newYearsEveFactor ) ;
  TSys.saveUserXml ( "CalendarApp.xml", xml ) ;
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
