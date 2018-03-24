Tango.include ( "TComponents" ) ;

/**
 *  @constructor
 */
CosmosClass = function()
{
  this.rootName = "cosmos" ;
  this.loginDirectoryName = "login" ;
  this.loginThemeName = "Neon" ;
  this.loginThemeName = "LinuxPeace" ;
  this.loginThemeName = "EPI-Night-Sky" ;
  this.loginThemeName = "default" ;
  this.widgetDirectoryName = "widgets" ;
  this.dockDirectoryName = "docks" ;
  this.stringDirectoryName = "strings" ;
  this.defaultStringName = "Netbook" ;
  this.stringName = TSys.getWebConfig().getValue ( "StringName" ) ;
  if ( ! this.stringName )
  {
    this.stringName = "Air" ;
  }
// this.stringName = "Netbook" ;
 // this.stringName = "Product" ;
 // this.stringName = "RessourcesII" ;
//  this.stringName = "Web2.0a" ;
 // this.stringName = "Red" ;
 // this.stringName = "Raphsody" ;
  this.defaultTooltipStyle = null ;
  this.tooltipStyle = null ;
  this.parts = [] ;
  this.initialized = false ;
  this.pluginDirectoryName = "plugins" ;
  this.defaultStyleXml = null ;
  this.styleXml = null ;

  this.dockThemeName = "Intrigue" ;
  this.dockThemeName = "WhiteGlass3D" ;
  this.dockThemeName = "AeroFrost" ;
  this.dockThemeName = "Tinted2" ;
  this.wallpaper = null ;
  this.servletName = "Tango" ;
  this.servletName = "Cosmos" ;
};
CosmosClass.prototype =
{
  _initialize_: function()
  {
    TGui.addLoginEndListener ( new TFunctionExecutor ( this, this.loginEndListener ) ) ;
    if ( this.initialized ) return ;
    this.defaultStyleXml = new TXml ( TSys.getAxl ( this.rootName + "/" + this.stringDirectoryName + "/" + this.defaultStringName + "/Style.xml" ) ) ;
    this.styleXml = new TXml ( TSys.getAxl ( this.rootName + "/" + this.stringDirectoryName + "/" + this.stringName + "/Style.xml" ) ) ;
    this.defaultTooltipStyle = this.defaultStyleXml.getStyle ( "Tooltip" ) ;
    this.defaultTooltipStyle.setImageRoot ( this.rootName + "/" + this.stringDirectoryName + "/" + this.defaultStringName ) ;
    this.tooltipStyle = this.styleXml.getStyle ( "Tooltip" ) ;
    if ( this.tooltipStyle )
    {
      this.tooltipStyle.setImageRoot ( this.rootName + "/" + this.stringDirectoryName + "/" + this.stringName ) ;
    }
    else
    {
      this.tooltipStyle = this.defaultTooltipStyle ;
    }
    this._loadCss ( "default" ) ;
    this._loadCss ( this.stringName ) ;
    this.initialized = true ;
    var xWallpaper = this.styleXml.get ( "Wallpaper" ) ;
    if ( xWallpaper )
    {
      this.wallpaper = xWallpaper.getContent() ;
      this.wallpaperBackgroundSize = xWallpaper.getAttribute ( "background-size" ) ;
    }
  },
  getServletName: function()
  {
    return this.servletName ;
  },
  loginEndListener: function ( event )
  {
    var e = TGui.getDesktopElement() ;
console.log ( "=====================");
    if ( this.wallpaper && e )
    {
      e.style.backgroundImage = "url(" + this.wallpaper + ")" ;
			if ( this.wallpaperBackgroundSize )
			{
      	e.style.WebkitBackgroundSize = this.wallpaperBackgroundSize ;
      	e.style.OBackgroundSize = this.wallpaperBackgroundSize ;
      	e.style.MozBackgroundSize = this.wallpaperBackgroundSize ;
//      e.style.MsBackgroundSize = this.wallpaperBackgroundSize ;
      	e.style.backgroundSize = this.wallpaperBackgroundSize ;
			}
    }
  },
  _loadCss: function ( name )
  {
    var cssName = this.rootName + "/" + this.stringDirectoryName + "/" + name + "/Style.css" ;
    var href = cssName + "?counter=" + TSys.getCounter() ;

    var en = new TXEnum ( document.getElementsByTagName('head')[0], 'link' ) ;
    var themeAlreadyPresent = false ;
    while ( en.hasNext() )
    {
      var d = en.next() ;
      if ( d.href.indexOf ( cssName ) >= 0 )
      {
        themeAlreadyPresent = true ;
        continue ;
      }
    }
    if ( ! themeAlreadyPresent )
    {
      var link = document.createElement ( 'link' ) ;
      link.rel = 'stylesheet'; 
      link.type = 'text/css'; 
      link.href = href ;
      document.getElementsByTagName('head')[0].appendChild(link); 
    }
    if ( name != "default" && name != this.defaultStringName )
    {
      for ( var i = 0 ; i < document.styleSheets.length ; i++ )
      {
        var sheet = document.styleSheets[i];
        if ( ! sheet.href ) continue ;
        if (  sheet.href.indexOf ( "cosmos/" ) >= 0
           && sheet.href.indexOf ( "/Style.css" ) > 0
           )
        {
          if ( sheet.href.indexOf ( "/default/" ) > 0 ) continue ;
          if ( sheet.href.indexOf ( "/" + this.stringName + "/" ) > 0 ) sheet.disabled = false ;
          else                                                          sheet.disabled = true ;
        }
      }
    }
  },
  getIconName: function ( name, state )
  {
    if ( ! this.initialized ) this._initialize_() ;
    if ( ! state ) state = 'normal' ;
    var x = this.styleXml.getXml ( name ) ;
    if ( x )
    {
      return this.getStringPath() + x.getAttribute ( state ) ;
    }
    x = this.defaultStyleXml.getXml ( name ) ;
    return this.getDefaultStringPath() + x.getAttribute ( state ) ;
  },
  getIconWidth: function ( name, def )
  {
    if ( ! def ) def = 16 ;
    if ( ! this.initialized ) this._initialize_() ;
    var x = this.styleXml.getXml ( name ) ;
    if ( ! x ) x = this.defaultStyleXml.getXml ( name ) ;
    return x.getIntAttribute ( "width", def ) ;
  },
  getIconHeight: function ( name, def )
  {
    if ( ! def ) def = 16 ;
    if ( ! this.initialized ) this._initialize_() ;
    var x = this.styleXml.getXml ( name ) ;
    if ( ! x ) x = this.defaultStyleXml.getXml ( name ) ;
    return x.getIntAttribute ( "height", def ) ;
  },
  getIconSearch: function ( state )
  {
    return this.getIconName ( "IconSearch", state ) ;
  },
  getIconConfigure: function ( state )
  {
    return this.getIconName ( "IconConfigure", state ) ;
  },
  getIconClose: function ( state )
  {
    return this.getIconName ( "IconClose", state ) ;
  },
  getIconReload: function ( state )
  {
    return this.getIconName ( "IconReload", state ) ;
  },
  getResizeGripper: function()
  {
    return this.getIconName ( "ResizeGripper" ) ;
  },
  getConfigRoot: function()
  {
    if ( ! this.initialized ) this._initialize_() ;
    return this.rootName + "/config/" ;
  },
  getLoginRoot: function()
  {
    if ( ! this.initialized ) this._initialize_() ;
    return this.rootName + "/" + this.loginDirectoryName + "/" ;
  },
  getLoginPath: function ( name )
  {
    if ( ! this.initialized ) this._initialize_() ;
    if ( name ) return this.getLoginRoot() + name ;
    return this.getLoginRoot() + this.loginThemeName + "/" ;
  },
  getWidgetRoot: function()
  {
    if ( ! this.initialized ) this._initialize_() ;
    return this.rootName + "/" + this.widgetDirectoryName + "/" ;
  },
  getDockRoot: function()
  {
    if ( ! this.initialized ) this._initialize_() ;
    return this.rootName + "/" + this.dockDirectoryName + "/" ;
  },
  getDefaultStringName: function()
  {
    if ( ! this.initialized ) this._initialize_() ;
    return this.defaultStringName ;
  },
  getStringName: function()
  {
    if ( ! this.initialized ) this._initialize_() ;
    return this.stringName ;
  },
  getDefaultStringPath: function()
  {
    if ( ! this.initialized ) this._initialize_() ;
    return this.getStringRoot() + this.defaultStringName + "/" ;
  },
  getStringPath: function ( stringName )
  {
    if ( ! this.initialized ) this._initialize_() ;
    if ( stringName ) return this.getStringRoot() + stringName ;
    return this.getStringRoot() + this.stringName + "/" ;
  },
  getStringRoot: function()
  {
    if ( ! this.initialized ) this._initialize_() ;
    return this.rootName + "/" + this.stringDirectoryName + "/" ;
  },
  getTooltipStyle: function()
  {
    if ( ! this.initialized ) this._initialize_() ;
    return this.tooltipStyle ;
  },
  getTooltip: function ( text )
  {
    if ( ! this.initialized ) this._initialize_() ;
    if ( ! this.tooltipStyle ) return text ;
    var str = this.tooltipStyle.toString ( "text", text ) ;
    return str ;
  },
  getPart: function ( partName )
  {
    if ( ! this.initialized ) this._initialize_() ;
    var p = this.parts[partName] ;
    if ( p ) return p ;
    var eStyle = this.styleXml.getStyle ( partName ) ;
    if ( eStyle )
    {
      eStyle.setImageRoot ( this.rootName + "/" + this.stringDirectoryName + "/" + this.stringName ) ;
      this.parts[partName] = eStyle ;
    }
    else
    {
      eStyle = this.defaultStyleXml.getStyle ( partName ) ;
      if ( ! eStyle ) return null ;
      eStyle.setImageRoot ( this.rootName + "/" + this.stringDirectoryName + "/" + this.defaultStringName ) ;
      this.parts[partName] = eStyle ;
    }
    return eStyle ;
  },
  getDialogBackground: function()
  {
    return this.getPart ( "DialogBackground" ) ;
  },
  showWidget: function ( widgetName )
  {
    var w = new Widget ( widgetName ) ;
    w.create() ;
    w.setAnimateInOut ( true ) ;
    w.show() ;
  },
  getWidgetImageUrl: function ( widgetName, imageName )
  {
    if ( ! this.initialized ) this._initialize_() ;
    return "ImageFactory/" + this.rootName + "/" + this.widgetDirectoryName + "/" + widgetName + "/" + imageName ;
  },
  getPluginImageUrl: function ( name, imageName )
  {
    if ( ! this.initialized ) this._initialize_() ;
    return "ImageFactory/" + this.rootName + "/" + this.pluginDirectoryName + "/" + name + "/" + imageName ;
  },
  getPluginAxl: function ( name, axlName )
  {
    if ( ! this.initialized ) this._initialize_() ;
    var url = this.rootName + "/" + this.pluginDirectoryName + "/" + name + "/" + axlName ;
    var axl = new TXml ( TSys.getAxl ( url ) ) ;
    return axl ;
  },
  getUserXml: function ( name )
  {
    if ( ! name ) throw "Cosmos.getUserXml: Missing 'name' parameter." ;
    var url = this.getServletName()+"?cosmosAction=GetUserXml&file=" + name ;
    return new TXml ( TSys.getXml ( url ) ) ;
  },
  saveUserXml: function ( name, xml )
  {
    if ( ! name ) throw "Cosmos.saveUserXml: Missing 'name' parameter." ;
    if ( ! xml ) throw "Cosmos.saveUserXml: Missing 'xml' parameter." ;
    var url = this.getServletName()+"?cosmosAction=SaveUserXml&file=" + name ;
    return TSys.httpPost ( url, String ( xml ), function ( HTTP ) { } ) ;
  },
  getWidget: function ( name )
  {
    return new TXml ( TSys.getAxl ( this.getWidgetRoot() + name + "/Widget.xml" ) ) ;
  }
};
CosmosClass.prototype.adjustHref = function ( t, url, editedHref )
{
  var isArray = TSys.isArray ( editedHref ) ;
  if ( url && url.charAt ( url.length - 1 ) != "/" ) url += "/" ;
  if ( t.indexOf ( "href=" ) < 0 ) return t ;
  var s = "" ;
  var pos = t.indexOf ( "href=" ) ;
  var pos1 ;
  while  ( pos > 0 )
  {
    var removeAnchor = false ;
    var posEQ = t.indexOf ( "=", pos ) ;
    var del = "" ;
    if ( t.charAt ( posEQ + 1 ) == '"' ) del = '"' ;
    else
    if ( t.charAt ( posEQ + 1 ) == "'" ) del = "'" ;
    if ( del )
    {
      var posH0 = posEQ + 2 ;
      var posH1 = t.indexOf ( del, posH0 ) ;
      var H = t.substring ( posH0, posH1 ) ;
    // http://share.feedsportal.com
      if ( H.indexOf ( "http" ) === 0 )
      {
        if ( H.indexOf ( "share.feedsportal.com" ) > 0 )
        {
          removeAnchor = true ;
        }
      }
      if ( H.indexOf ( "http" ) !== 0 )
      {
        var str = t.substring ( 0, posH0 ) + url + H + del + " " ;
        s += str ;
        if ( isArray ) editedHref.push ( H ) ;
        t = t.substring ( posH1 + 1 ) ;
        pos = 0 ;
      }
/*
      else
      {
if ( H.indexOf ( ".feedsportal." > 0 ) ) H = 'javascript:return false;' ;
        var str = t.substring ( 0, posH0 ) + H + del + " " ;
        s += str ;
        t = t.substring ( posH1 + 1 ) ;
        pos = 0 ;
      }
*/
    }
    if ( removeAnchor )
    {
 // log ( t ) ;
    }
    // else
    {
      pos1 = t.indexOf ( ">", pos ) ;
      s += t.substring ( 0, pos1 ) + " target='_blank' >\n" ;
      t = t.substring ( pos1 + 1 ) ;
    }
    pos = t.indexOf ( "href=" ) ;
  }
  if ( t.length > 0 ) s += t ;
  return s ;
};
CosmosClass.prototype.startPlugin = function ( name )
{
  var xml = new TXml ( TSys.getAxl ( this.rootName + "/" + this.pluginDirectoryName + "/" + name + "/Plugin.xml" ) ) ;
  var str = xml.getContent ( "Script" ) ;
  str = str.trim() ;
  if ( str.charAt ( 0 ) == "{" && str.charAt ( str.length - 1 ) == "}" )
  {
    var script = TSys.eval ( str ) ;
    try
    {
      script.xml = xml ;
      if ( typeof ( script._constructor_ ) == 'function' )
      {
        var a = TSys.toArray(arguments) ;
        if ( a.length > 1 )
        {
          a.splice ( 0, 1 ) ;
          script._constructor_.apply ( script, a ) ;
        }
        else
        {
          script._constructor_() ;
        }
        if ( typeof ( script._initialize_ ) == 'function' )
        {
          script._initialize_() ;
        }
      }
    }
    catch ( exc )
    {
      TSys.log ( exc ) ;
    }
  }
};
CosmosClass.prototype.getItemViewSourceOfAvailablePlugins = function ( pluginType )
{
  var x = this.getListOfAvailablePlugins() ;
  x = x.getXml ( "TABLE" ) ;
  return new ViewItemSourceXml ( x, "Image", [ "Description", "Title" ] ) ;
};
CosmosClass.prototype.getListOfAvailablePlugins = function ( pluginType )
{
  if ( pluginType ) pluginType = "&pluginType=" + pluginType ;
  else pluginType = "" ;
  var url = this.getServletName()+"?cosmosAction=ListPlugins" + pluginType ;
  return new TXml ( TSys.getXml ( url ) ) ;
};
CosmosClass.prototype.listPlugins = function ( pluginType )
{
  var x = this.getListOfAvailablePlugins ( pluginType ) ;
  var url = Cosmos.getConfigRoot() + "/Cosmos.Window.Plugins.Items.axl" ;
  var axl = new TXml ( TSys.getAxl ( url ) ) ;
  var w = new CosmosWindow ( axl ) ;
  w.create() ;
  w.show() ;

/*
  var url = Cosmos.getConfigRoot() + "/Cosmos.Window.Plugins.Table.axl" ;
  var axl = new TXml ( TSys.getAxl ( url ) ) ;
  var w = new CosmosWindow ( axl ) ;
  w.create() ;
  w.setValues ( x ) ;
  w.show() ;
*/
};
CosmosClass.prototype.createDeskIcon = function ( x, mx, my )
{
  var axl = new TXml() ;
  var xDeskIcon = axl.addXml ( 'DeskIcon' ) ;
  xDeskIcon.addAttribute ( 'removable', 'true' ) ;
  xDeskIcon.addAttribute ( 'src', x.getContent ( 'Image' ) ) ;
  xDeskIcon.addAttribute ( 'tooltip', x.getContent ( 'Title' ) ) ;
  var action =  '' ;
  var type = x.getContent ( 'Type' ) ;
  var name = x.getContent ( 'Name' ) ;
  if ( type == 'Widget' ) action = 'Cosmos.showWidget ( ' + name + ')' ;
  else                    action = 'Cosmos.startPlugin ( ' + name + ')' ;
  xDeskIcon.addAttribute ( 'action', action ) ;

  var targetElement = TGui.getDesktopElement() ;
  DeskIconFactory.createDeskIcon ( axl, targetElement, mx, my ) ;
};
CosmosClass.prototype.getDomByClassName = function ( name, list )
{
  return this._getDomByClassName ( document.body, name, list ) ;
};
CosmosClass.prototype._getDomByClassName = function ( dom, name, list )
{
  for  ( var ch = dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.xClassName == name )
    {
      if ( ! list ) return ch ;
      list.push ( ch) ;
    }
    else
    if ( ch.className == name )
    {
      if ( ! list ) return ch ;
      list.push ( ch) ;
    }
    else
    if ( ch.className && ch.className.indexOf ( name ) >= 0 )
    {
      if ( ! list ) return ch ;
      list.push ( ch) ;
    }
    if ( ch.firstChild )
    {
      var cch = this._getDomByClassName ( ch, name, list ) ;
      if ( ! list )
      {
        if ( cch ) return cch ;
      }
    }
  }
  return null ;
};
CosmosClass.prototype.googleMapURL = "http://maps.google.com/maps?hl=en&z=12" ;
CosmosClass.prototype.showGoogleMapSearch = function ( address )
{
var contentId = "map" ;
  var s = ""
        + "<xml>\n"
        + "  <Window resizable='true' closable='true' id='GOOGLE_MAP_X'>\n"
        + "    <Container style='bottom:-0px;right:-0px;' >\n"
        + "      <TextField name='address' style='right:-0px;' \n"
        + "        onkeyup=\"function(event)\n"
        + "        {\n"
        + "        l=[];\n"
        + "        var d=Cosmos.getDomByClassName('pac-container',l);\n"
        + "        if ( ! l.length ) return;\n"
        + "        if(l.length>1){l[0].parentNode.removeChild(l[0]);l[0]=l[1];}\n"
        + "        l[0].style.zIndex=64999 ;\n"
        + "        }\"\n"
        + "      />\n"
        + "      <br/>\n"
        + "      <Container name='" + contentId + "' style='bottom:-0px;right:-0px;width:500px;height:500px;' >\n"
        + "      </Container>\n"
        + "    </Container>\n"
        + "  </Window>\n"
        + "</xml>\n"
        ;
  var dom = TSys.parseDom ( s ) ;
  var w = new CosmosWindow ( dom ) ;
  w.create() ;

  var c = w.getComponent ( contentId ) ;
  w.excludeDrag ( c ) ;

  var tf = w.getComponent ( "address" ) ;

  var ctx = {} ;
  ctx.autocomplete = new google.maps.places.Autocomplete( tf.getDom() ) ;
  var latlng = new google.maps.LatLng(50.14554580000001, 7.166020800000069);
  var options =
  {
    zoom: 14,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  ctx.map = new google.maps.Map ( c.dom,options ) ;

  google.maps.event.addListener ( ctx.autocomplete, "place_changed", function()
  {
    var place = ctx.autocomplete.getPlace();
    if (place.geometry.viewport) {
      ctx.map.fitBounds(place.geometry.viewport);
    } else {
      ctx.map.setCenter(place.geometry.location);
      ctx.map.setZoom(17);
    }
    var image = new google.maps.MarkerImage ( place.icon
	                                    , new google.maps.Size(71, 71)
					    , new google.maps.Point(0, 0)
                                            , new google.maps.Point(17, 34)
				            , new google.maps.Size(35, 35)
					    );
    var marker = new google.maps.Marker ( { position:place.geometry.location, map:ctx.map } ) ;
    marker.setIcon(image);
    /*
    var infowindow = new google.maps.InfoWindow(); // TODO
    infowindow.open(ctx.map, marker);
    infowindow.setContent(place.name + "<b>x x xxxxx  xx </b>" );
    */
  });
  ctx.resized = function(ev)
  {
    google.maps.event.trigger ( this.map, "resize" ) ;
  };
  w.addListener ( ctx, ctx.resized, "resize" ) ;
  w.show() ;
  w.maximize ( 1 ) ;
  google.maps.event.trigger ( ctx.map, "resize" ) ;
};
CosmosClass.prototype.showGoogleMap = function ( latitude, longitude )
{
  var o = latitude ;
  if ( o && typeof ( o ) == 'object' && o.coords ) // GeoLocation: Position
  {
    latitude = o.coords.latitude ;
    longitude = o.coords.longitude ;
  }
  if ( ! latitude || ! longitude ) return ;
  var url = this.googleMapURL + "&ll=" + latitude + "," + longitude ;
  var w = this.createContentWindow ( "map" ) ;
  var c = w.getComponent ( "map" ) ;
  w.excludeDrag ( c ) ;
  var latlng = new google.maps.LatLng(latitude, longitude);
  var options =
  {
    zoom: 14,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var ctx = {} ;
  ctx.map = new google.maps.Map ( c.dom, options ) ;
  ctx.resized = function(ev)
  {
    google.maps.event.trigger ( this.map, "resize" ) ;
  };
  w.addListener ( ctx, ctx.resized, "resize" ) ;
  w.show() ;
  google.maps.event.trigger ( ctx.map, "resize" ) ;
};
CosmosClass.prototype.createContentWindow = function ( contentId )
{
  var s = ""
        + "<xml>\n"
        + "  <Window resizable='true' closable='true' >\n"
        + "    <Container name='" + contentId + "' style='width:500px;height:400px;' >\n"
        + "    </Container>\n"
        + "  </Window>\n"
        + "</xml>\n"
        ;
  var dom = TSys.parseDom ( s ) ;
  var w = new CosmosWindow ( dom ) ;
  w.create() ;
  return w ;
};

CosmosClass.prototype.createIframeWindow = function ( url, title, singleton, img )
{
  if ( ! title || String ( title ) == 'null' ) title = url ;
  var id = url ;
  if ( id.indexOf ( '?' ) > 0 ) id = id.substring ( 0, id.indexOf ( '?' ) ) ;
  id = id.replace ( /\//g, '_' ).replace ( /:/g, '_' ).replace ( /&/g, '_' ).replace ( /\=/g, "_" ).replace ( /,/g, "_" ).replace ( /\?/g, "_" ) ;
  var w ;
  if ( singleton )
  {
    w = this.getWindow ( id ) ;
    if ( w ) return w ;
  }
  if ( typeof ( img ) == "string" )
  {
    if ( img.indexOf ( "/" ) < 0 ) img = "img/" + img ;
    img = " img='" + img + "'" ;
  }
  else
  {
    img = "" ;
  }
  url = url.replace ( /&/g, "&amp;" ) ;
  var s = ""
        + "<xml>\n"
        + "  <Window resizable='true' title='" + title + "' id='" + id + "' " + img + " >\n"
        + "    <Container name='Form' style='width:500px;height:400px;' >\n"
        + "<iframe src='" + url + "' style='margin:0px;border:0px;bottom:-0;right:-0;'>\n"
        + "</iframe>\n"
        + "    </Container>\n"
        + "  </Window>\n"
        + "</xml>\n"
        ;
  var dom = TSys.parseDom ( s ) ;
  w = new CosmosWindow ( dom ) ;
  w.create() ;
  w.show() ;
  return w ;
};
CosmosClass.prototype.getExplanationFromFreeDictionary = function ( q )
{
  if ( ! q ) return "" ;
  q = encodeURIComponent ( q ) ;
  var url = "http://www.thefreedictionary.com/" ;
// log ( "url=" + url ) ;
  var u = new URLProxy ( url + q ) ;
  var t = u.getText() ;
// log ( t ) ;
  var pos0 = t.indexOf ( "<body" ) ;
  var pos1 = t.indexOf ( "</body>" ) ;
  t = t.substring ( pos0, pos1 + 6 ) ;
  pos0 = t.indexOf ( '<div id="MainTxt">' ) ;
  if ( pos0 < 0 )
  {
    t = "Not found" ;
  }
  else
  {
    pos0 = t.indexOf ( "<section", pos0 ) ;
    pos1 = t.indexOf ( "</section>", pos0 ) ;
    // pos0 = t.indexOf ( "<table", pos0 ) ;
    // pos1 = t.indexOf ( "</table>", pos0 ) ;
    t = t.substring ( pos0, pos1 ) ;
  }
  t = this.adjustHref ( t, url ) ;
  return t ;
};

Cosmos = new CosmosClass() ;
/**
 *  @constructor
 *  @extends TWindow
 */
var Widget = function ( name )
{
  Tango.initSuper ( this, TWindow, null );
  this.jsClassName = "Widget" ;
  this._showResizeGripper = false ;
  if ( name )
  {
    this.widgetName = name ;
    this.id = name ;
    this._borderless = true ;
    this._dragable = true ;
    this.xml = Cosmos.getWidget ( this.widgetName ) ;
    var xBackground = this.xml.getXml ( "Background" ) ;
    var decoration = null ;
    var eStyle = null ;
    if ( xBackground )
    {
      var dd = xBackground.getAttribute ( "decoration" ) ;
      if ( dd )
      {
        dd = dd.trim() ;
        var od = TSys.eval ( dd ) ;
        if ( od.image )
        {
          od.image.type = "sliced" ;
          eStyle = new EStyle ( od ) ;
        }
        else
        {
          var odd = { image: od } ;
          var b = {} ;
          od.border = b ;
          if ( typeof ( od.top ) == 'number' ) b.top = od.top ;
          if ( typeof ( od.left ) == 'number' ) b.left = od.left ;
          if ( typeof ( od.bottom ) == 'number' ) b.bottom = od.bottom ;
          if ( typeof ( od.right ) == 'number' ) b.right = od.right ;
          if ( typeof ( od.opacity ) == 'number' ) b.opacity = od.opacity ;
          od.type = "sliced" ;
          eStyle = new EStyle ( odd ) ;
        }
        eStyle.setImageRoot ( Cosmos.getWidgetRoot() + this.widgetName ) ;
      }
    }
    else
    {
      eStyle = Cosmos.getDialogBackground() ;
      this._hasCosmosBackground = true ;
    }
    if ( eStyle )
    {
      decoration = eStyle.getImageAsDecoratorString() ;
    }
    var resizable = false ;
    var closable = false ;
    var str = this.xml.getContent ( "Script" ) ;
    str = str.trim() ;
    if ( str.charAt ( 0 ) == "{" && str.charAt ( str.length - 1 ) == "}" )
    {
      this.script = TSys.eval ( str ) ;
      this.script.widget = this ;
      if ( typeof ( this.script.isPagelet ) == 'function' )
      {
        this.setPagelet ( this.script ) ;
      }
      if ( typeof ( this.script._constructor_ ) == 'function' )
      {
        this.script._constructor_ ( this ) ;
        resizable = this.script.resizable ? true : false ;
        closable = this.script.closable ? true : false ;
      }
    }
    var axl = this.xml.getXml ( "Axl" ) ;
    var css = this.xml.getContent ( "Css" ) ;
    var userContainer = axl.getXml ( "Container" ) ;
    if ( ! userContainer ) return ;
    var domContainer = userContainer.getDom() ;
    domContainer.parentNode.removeChild ( domContainer ) ;

    var xWindow = axl.addXml ( "Window" ) ;
    xWindow.addAttribute ( "resizable", "" + resizable ) ;
    xWindow.addAttribute ( "id", this.widgetName ) ;
    xWindow.addAttribute ( "background-color", "transparent" ) ;
    xWindow.addAttribute ( "dragable", "false" ) ;
    if ( css )
		{
		  xWindow.addAttribute ( "css", css ) ;
		}
    var xContainer = xWindow.addXml ( "Container" ) ;
    xContainer.getDom().appendChild ( domContainer ) ;
    this.resolveImgSrc ( domContainer ) ;
    if ( eStyle )
    {
      var style = "" ;
      var padding = eStyle.getPadding() ;
      var userContainerStyle = "" ;
      if ( padding )
      {
        if ( typeof ( padding.top ) == 'number' ) userContainerStyle += "top:" + padding.top + "px;" ;
        else                                      userContainerStyle += "top:0px;" ;
        if ( typeof ( padding.left ) == 'number' ) userContainerStyle += "left:" + padding.left + "px;" ;
        else                                       userContainerStyle += "left:0px;" ;
        if ( typeof ( padding.bottom ) == 'number' ) userContainerStyle += "bottom:-" + padding.bottom + ";" ;
        else                                         userContainerStyle += "bottom:-0;" ;
        if ( typeof ( padding.right ) == 'number' ) userContainerStyle += "right:-" + padding.right + ";" ;
        else                                        userContainerStyle += "right:-0;" ;
      }
      else
      {
        userContainerStyle += "top:0px;" ;
        userContainerStyle += "left:0px;" ;
        userContainerStyle += "bottom:-0;" ;
        userContainerStyle += "right:-0;" ;
      }
      userContainer.addAttribute ( "style", userContainerStyle + userContainer.getAttribute ( "style", "" ) ) ;
      style += eStyle.getStyleString() + "right:-0;bottom:-0;" ;
      xContainer.addAttribute ( "style", style ) ;
      var deco = eStyle.getImageAsDecoratorString() ;
      if ( deco ) xContainer.addAttribute ( "decoration", deco ) ;
    }
    else
    {
      xContainer.addAttribute ( "style", "right:-0;bottom:-0;" ) ;
      if ( decoration ) xContainer.addAttribute ( "decoration", decoration ) ;
    }
    if ( resizable )
    {
      var xPbResize = xContainer.addXml ( "IconButton" ) ;
      xPbResize.addAttribute ( "name", 'PRIVATE.PB.RESIZE' ) ;
      xPbResize.addAttribute ( "style", 'bottom:0px;width:11px;height:11px;right:0;visibility:hidden;' ) ;
      xPbResize.addAttribute ( "normal", 'Cosmos.getResizeGripper()' ) ;
    }
    if ( closable )
    {
      var xPbClose = xContainer.addXml ( "IconButton" ) ;
      xPbClose.addAttribute ( "name", 'PRIVATE.PB.CLOSE' ) ;
      xPbClose.addAttribute ( "style", 'top:0px;width:13px;height:13px;right:0;visibility:hidden;' ) ;
      xPbClose.addAttribute ( "inside", 'Cosmos.getIconClose ( "inside" )' ) ;
      xPbClose.addAttribute ( "normal", 'Cosmos.getIconClose ( "normal" )' ) ;
      xPbClose.addAttribute ( "pressed", 'Cosmos.getIconClose ( "pressed" )' ) ;
      xPbClose.addAttribute ( "onclick", 'TGui.closeTopWindow()' ) ;
    }
    this.axl2 = axl.getDom() ;
    this.secondaryInstance = TGui.getWindow ( this.id ) ;
  }
};
Widget.inherits( TWindow ) ;
Widget.prototype.resolveImgSrc = function ( domContainer )
{
  for ( var ch = domContainer.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    var img = ch.getAttribute ( "img" ) ;
    if ( img )
    {
      if ( img.indexOf ( "/" ) < 0 && img.indexOf ( "(" ) < 0 )
      {
        img = this.getImageUrl ( img ) ;
        new TXml ( ch ).addAttribute ( "img", img ) ;
      }
    }
    if ( ch.firstChild ) this.resolveImgSrc ( ch ) ;
  }
};
Widget.prototype.getImageUrl = function ( name )
{
  if ( name.indexOf ( "/" ) >= 0 ) return name ;
  return Cosmos.getWidgetRoot() + this.widgetName + "/" + name ;
};
Widget.prototype.getUserData = function ( file )
{
  if ( ! file ) file = "Data.xml" ;
  return Cosmos.getUserXml ( "/applicationdata/" + this.widgetName + "/" + file ) ;
};
Widget.prototype.saveUserData = function ( file, xml )
{
  if ( ! xml )
  {
    xml = file ;
    file = "Data.xml" ;
  }
  Cosmos.saveUserXml ( "applicationdata/" +  this.widgetName + "/" + file, xml ) ;
};
Widget.prototype.create = function()
{
  this.setAxl ( this.axl2 ) ;
  this.setBodyClassName ( "CosmosWidgetBody" ) ;
  if ( this._hasCosmosBackground )
  {
    this.setClassName ( "CosmosWindow", "CosmosWindowActivated" ) ;
  }
  else                             this.setClassName ( "CosmosWidget" ) ;
  TWindow.prototype.create.apply ( this, arguments ) ;
  if ( this.script && typeof ( this.script._initialize_ ) == 'function' )
  {
    this.script._initialize_ ( this ) ;
  }
  this.pbClose = this.getElementByName ( "PRIVATE.PB.CLOSE" ) ;
  var b = this.getComponentByName ( "PRIVATE.PB.RESIZE" ) ;
  if ( b.getDom() )
  {
    b.addEventListener ( "mousedown", this, this.wResize ) ;
    this.pbResize = b.getDom() ;
    this.pbResize.style.cursor = "nw-resize" ;
  }
};
Widget.prototype.wResize = function ( event, what )
{
  Dragger.stop() ;
  Dragger.startResizeComponent ( event, this, Dragger.SE_RESIZE ) ;
};
Widget.prototype.show = function()
{
  TWindow.prototype.show.apply ( this, arguments ) ;
  if ( this.secondaryInstance )
  {
    var d = this.secondaryInstance.getLocation() ;
    d.x += 20 ;
    d.y += 20 ;
    this.setLocation ( d ) ;
    this.secondaryInstance = undefined ;
  }
  if ( this.script && typeof ( this.script.onOpen ) == 'function' )
  {
    this.script.onOpen ( this ) ;
  }
};
Widget.prototype._setActivated = function ( state )
{
  TWindow.prototype._setActivated.apply ( this, arguments ) ;
  if ( this.script && typeof ( this.script.onFocus ) == 'function' )
  {
    this.script.onFocus ( state ) ;
  }
  if ( state )
  {
    if ( this.pbResize ) this.pbResize.style.visibility = "visible" ;
    if ( this.pbClose ) this.pbClose.style.visibility = "visible" ;
  }
  else
  {
    if ( this.pbResize ) this.pbResize.style.visibility = "hidden" ;
    if ( this.pbClose ) this.pbClose.style.visibility = "hidden" ;
  }
};
Widget.prototype.close = function ( event )
{
  if ( this.script && typeof ( this.script.onClose ) == 'function' )
  {
    var ev = new TEvent ( event ) ;
    this.script.onClose ( ev ) ;
    if ( ev.isConsumed() ) return ;
  }
  TWindow.prototype.close.apply ( this, arguments ) ;
};
Widget.prototype.dragStart = function ( ev )
{
  ev.setDragInside ( true ) ;
  var src = ev.getSource() ;
  if ( src === this.pbClose ) return false ;
  if ( src.xClassName == "ButtonText" ) return false ;
  if ( src.xClassName == "ButtonImage" ) return false ;
  if ( src.xClassName == "PushButton" ) return false ;
  if ( src.xClassName == "IconButton" ) return false ;
  if ( src.xClassName == "CustomButton" ) return false ;
  if ( src.xClassName == "CosmosButton" ) return false ;
  for ( var ch = src ; ch ; ch = ch.parentNode )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.nodeName == 'TABLE' )
    {
      return false ;
    }
    if ( ch.jsPeer )
    {
//      return false ;
    }
  }
  if ( this.script && typeof ( this.script.dragStart ) == 'function' )
  {
    var rc = this.script.dragStart ( ev ) ;
    if ( typeof ( rc ) == 'boolean' ) return rc ;
  }
  if ( src.nodeName == 'IMG' )
  {
    if ( ! src.isDecoratorPart ) return false ;
  }
  if ( src.nodeName == 'INPUT' ) return false ;
  if ( src.nodeName == 'TEXTAREA' ) return false ;
  return TWindow.prototype.dragStart.apply ( this, arguments ) ;
};
Widget.prototype.dragEnd = function ( event )
{
  if ( this.script && typeof ( this.script.dragEnd ) == 'function' )
  {
    this.script.dragEnd ( event ) ;
  }
  return TWindow.prototype.dragEnd.apply ( this, arguments ) ;
};
Widget.prototype.getAxl = function ( name )
{
  var url = Cosmos.getWidgetRoot() + this.widgetName + "/" + name ;
  var axl = new TXml ( TSys.getAxl ( url ) ) ;
  var xw = axl.getXml ( "Window" ) ;
  if ( ! xw ) xw = axl.getXml ( "Dialog" ) ;
  if ( xw )
  {
    var id = xw.getAttribute ( "id" ) ;
    if ( ! id ) id = this.widgetName ;
    else
    {
      id = this.widgetName + "." + id ;
    }
    xw.addAttribute ( "id", id ) ;
  }
  return axl ;
};

/**
 *  @constructor
 *  @extends TWindow
 */
var CosmosWindow = function ( name )
{
  Tango.initSuper ( this, TWindow, name );
  this.jsClassName = "CosmosWindow" ;
  this._showResizeGripper = false ;
  if ( name )
  {
  }
};
CosmosWindow.inherits( TWindow ) ;
CosmosWindow.prototype.show = function()
{
  TWindow.prototype.show.apply ( this, arguments ) ;
};
CosmosWindow.prototype._getAxlDom = function()
{
  var dom = TWindow.prototype._getAxlDom.apply ( this, arguments ) ;
  var x = new TXml ( dom ) ;
  this.setBorderless() ;
  this.setBackgroundColor ( "transparent" ) ;

  var userContainer = x.getXml ( "Container" ) ;
  if ( ! userContainer ) return dom ;
  var domContainer = userContainer.getDom() ;
  var xContainer = x.addXml ( "Container" ) ;
  xContainer.getDom().appendChild ( domContainer ) ;

  var eStyle = Cosmos.getDialogBackground() ;
  if ( ! eStyle ) return dom ;
  if ( eStyle )
  {
    var style = "" ;
    var padding = eStyle.getPadding() ;
    var userContainerStyle = "" ;
    if ( padding )
    {
      if ( typeof ( padding.top ) == 'number' ) userContainerStyle += "top:" + padding.top + "px;" ;
      else                                      userContainerStyle += "top:0px;" ;
      if ( typeof ( padding.left ) == 'number' ) userContainerStyle += "left:" + padding.left + "px;" ;
      else                                       userContainerStyle += "left:0px;" ;
      if ( typeof ( padding.bottom ) == 'number' ) userContainerStyle += "bottom:-" + padding.bottom + ";" ;
      else                                         userContainerStyle += "bottom:-0;" ;
      if ( typeof ( padding.right ) == 'number' ) userContainerStyle += "right:-" + padding.right + ";" ;
      else                                        userContainerStyle += "right:-0;" ;
    }
    else
    {
      userContainerStyle += "top:0px;" ;
      userContainerStyle += "left:0px;" ;
      userContainerStyle += "bottom:-0;" ;
      userContainerStyle += "right:-0;" ;
    }
    userContainer.addAttribute ( "style", userContainerStyle + userContainer.getAttribute ( "style", "" ) ) ;
    style += eStyle.getStyleString() + "right:-0;bottom:-0;" ;
    xContainer.addAttribute ( "style", style ) ;
    var deco = eStyle.getImageAsDecoratorString() ;
    if ( deco ) xContainer.addAttribute ( "decoration", deco ) ;
  }
  if ( x.getBoolAttribute ( "dragable", true ) )
  {
    this._dragable = true ;
  }
  if ( x.getAttribute ( "closable" ) != "false" )
  {
    var xPbClose = xContainer.addXml ( "IconButton" ) ;
    xPbClose.addAttribute ( "name", 'PRIVATE.PB.CLOSE' ) ;
    xPbClose.addAttribute ( "style", 'top:0px;width:13px;height:13px;right:0;visibility:hidden;' ) ;
    xPbClose.addAttribute ( "inside", 'Cosmos.getIconClose ( "inside" )' ) ;
    xPbClose.addAttribute ( "normal", 'Cosmos.getIconClose ( "normal" )' ) ;
    xPbClose.addAttribute ( "pressed", 'Cosmos.getIconClose ( "pressed" )' ) ;
    xPbClose.addAttribute ( "onclick", 'TGui.closeTopWindow()' ) ;
  }
  if ( this.isResizable() )
  {
    var xPbResize = xContainer.addXml ( "IconButton" ) ;
    xPbResize.addAttribute ( "name", 'PRIVATE.PB.RESIZE' ) ;
    xPbResize.addAttribute ( "style", 'bottom:0px;width:11px;height:11px;right:0;visibility:hidden;' ) ;
    xPbResize.addAttribute ( "normal", 'Cosmos.getResizeGripper()' ) ;
  }
  return dom ;
};
CosmosWindow.prototype.create = function()
{
  this.setBodyClassName ( "CosmosWindowBody" ) ;
  this.setClassName ( "CosmosWindow" ) ;
  TWindow.prototype.create.apply ( this, arguments ) ;
  this.pbClose = this.getElementByName ( "PRIVATE.PB.CLOSE" ) ;
  var b = this.getComponentByName ( "PRIVATE.PB.RESIZE" ) ;
  if ( b && b.getDom() )
  {
    b.addEventListener ( "mousedown", this, this.wResize ) ;
    this.pbResize = b.getDom() ;
    this.pbResize.style.cursor = "nw-resize" ;
  }
};
CosmosWindow.prototype.wResize = function ( event )
{
  Dragger.stop() ;
  Dragger.startResizeComponent ( event, this, Dragger.SE_RESIZE ) ;
};
CosmosWindow.prototype._setActivated = function ( state )
{
  TWindow.prototype._setActivated.apply ( this, arguments ) ;
  if ( state )
  {
    if ( this.pbResize ) this.pbResize.style.visibility = "visible" ;
    if ( this.pbClose ) this.pbClose.style.visibility = "visible" ;
  }
  else
  {
    if ( this.pbResize ) this.pbResize.style.visibility = "hidden" ;
    if ( this.pbClose ) this.pbClose.style.visibility = "hidden" ;
  }
};
CosmosWindow.prototype.dragStart = function ( ev )
{
  var src = ev.getSource() ;
  if ( src === this.pbClose ) return false ;
  if ( src.xClassName == "ButtonText" ) return false ;
  if ( src.xClassName == "ButtonImage" ) return false ;
  if ( src.xClassName == "PushButton" ) return false ;
  if ( src.xClassName == "IconButton" ) return false ;
  if ( src.xClassName == "CustomButton" ) return false ;
  if ( src.xClassName == "CosmosButton" ) return false ;
  if ( src.nodeName == 'IMG' )
  {
    if ( ! src.isDecoratorPart ) return false ;
  }
  if ( src.nodeName == 'INPUT' ) return false ;
  if ( src.nodeName == 'TEXTAREA' ) return false ;
  for ( var ch = src ; ch ; ch = ch.parentNode )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.nodeName == 'TABLE' )
    {
      return false ;
    }
    if ( ch.jsPeer )
    {
//      return false ;
    }
  }
  return TWindow.prototype.dragStart.apply ( this, arguments ) ;
};
/**
 *  @constructor
 *  @extends TUserDialog
 */
var CosmosUserDialog = function ( text, title )
{
  Tango.initSuper ( this, TUserDialog, text, title ) ;
  this.setBorderless() ;
  this.setEStyle ( Cosmos.getDialogBackground() ) ;
  this.setButtonTagName ( "CosmosButton" ) ;
  this.setBodyClassName ( "CosmosWindowBody" ) ;
  this.setClassName ( "CosmosWindow" ) ;
};
CosmosUserDialog.inherits( TUserDialog );

/**
 *  @constructor
 */
var DeskletHandlerClass = function()
{
  this.componentList = [] ;
  TSys.addLogoutListener ( new TFunctionExecutor ( this, this.logoutListener ) ) ;
  this.persistentData = null ;
};
DeskletHandlerClass.prototype =
{
  _getPersistentData: function()
  {
    if ( this.persistentData ) return this.persistentData ;
    var pd = TSys.getPersistentData() ;
    this.persistentData = pd.ensureXml ( "Desklets" ) ;
    return this.persistentData ;
  },
  add: function ( desklet )
  {
    this.componentList.push ( desklet ) ;
  },
  remove: function ( desklet )
  {
    for ( var i = 0 ; i < this.componentList.length ; i++ )
    {
      if ( this.componentList[i] === desklet )
      {
        var di = this.componentList[i] ;
        this.componentList.splice ( i, 1 ) ;
        var name = di.getName() ;
        if ( name )
        {
          if ( ! TSys.loggedIn ) break ;
          if ( ! di.storeBounds ) break ;
          var pd = this._getPersistentData() ;
          var xpd = pd.ensureXml ( name ) ;
          var xBounds = xpd.ensureXml ( "Location" ) ;
          xBounds.addAttribute ( "x", "" + di.dom.offsetLeft ) ;
          xBounds.addAttribute ( "y", "" + di.dom.offsetTop ) ;
        }
        break ;
      }
    }
  },
  logoutListener: function()
  {
    var pd = this._getPersistentData() ;
    for ( var i = 0 ; i < this.componentList.length ; i++ )
    {
      var di = this.componentList[i] ;
      var name = di.getName() ;
      if ( ! name ) continue ;
      try
      {
        var xpd = pd.ensureXml ( name ) ;
        var xBounds = xpd.ensureXml ( "Location" ) ;
        xBounds.addAttribute ( "x", "" + di.dom.offsetLeft ) ;
        xBounds.addAttribute ( "y", "" + di.dom.offsetTop ) ;
      }
      catch ( exc )
      {
        log ( exc ) ;
      }
    }
  }
};
var DeskletHandler = new DeskletHandlerClass() ;

/**
 *  @constructor
 *  @extends TContainer
 */
var DeskletBase = function ( name, deskletDom, id )
{
  if ( name )
  {
    if ( ! id )
    {
      this.containerDom = TGui.getDesktopElement() ;
    }
    else
    if ( typeof ( id ) == 'string' )
    {
      this.containerDom = document.getElementById ( id ) ;
    }
    else
    if ( id && typeof ( id ) == 'object' && id.nodeName )
    {
      this.containerDom = id ;
    }
    else
    {
      throw "id is not an html-id or html element" ;
    }
    DeskletHandler.add ( this ) ;
    this.dragable = true ;
  }
  Tango.initSuper ( this, TContainer, deskletDom );
  this.jsClassName = "DeskletBase" ;
  if ( this.dom )
  {
    this.dom.jsPeer = this ;
    this.containerDom.appendChild ( this.dom ) ;
    this.dom.style.position = "absolute" ;
  }
  if ( name ) this.setName ( name ) ;
  if ( TSys.loggedIn ) this.storeBounds = true ;
};
DeskletBase.inherits( TContainer ) ;
DeskletBase.prototype.getImageUrl = function ( name )
{
  return Cosmos.getPluginImageUrl ( this.getName(), name ) ;
};
DeskletBase.prototype.getAxl = function ( name )
{
  return Cosmos.getPluginAxl ( this.getName(), name ) ;
};
DeskletBase.prototype.getUserData = function ( file )
{
  if ( ! file ) file = "Data.xml" ;
  return Cosmos.getUserXml ( "/applicationdata/" + this.getName() + "/" + file ) ;
};
DeskletBase.prototype.saveUserData = function ( file, xml )
{
  if ( ! xml )
  {
    xml = file ;
    file = "Data.xml" ;
  }
  Cosmos.saveUserXml ( "applicationdata/" +  this.getName() + "/" + file, xml ) ;
};
DeskletBase.prototype.setName = function ( name )
{
  if ( ! this.dom ) return ;
  this.dom.name = name ;
  var pd = TSys.getPersistentData() ;
  if ( pd )
  {
    var xpd = pd.ensureXml ( "Desklets/" + this.dom.name ) ;
    var bounds = xpd.getRectangle ( "Location" ) ;
    if ( bounds ) this.setLocation ( bounds.x, bounds.y ) ;
  }
};
DeskletBase.prototype.initialize = function()
{
  this._installDrag() ;
};
DeskletBase.prototype._installDrag = function()
{
  if ( ! this.isDragable() ) return ;
  if ( this._dragInstalled ) return ;
  if ( this.dom.offsetWidth && this.dom.offsetHeight )
  {
    this._dragInstalled = true ;
    TGui.addEventListener ( this.dom, "mousedown", this._dragMousedown.bindAsEventListener ( this ) ) ;
  }
};
DeskletBase.prototype._dragMousedown = function ( event )
{
  var src = new TEvent ( event ).getSource() ;
  this.isImg = src.nodeName == 'IMG' ;
  this.dragged = false ;
  Dragger.startDrag ( event, this.dom ) ;
};
DeskletBase.prototype.dragStart = function ( event )
{
  this.oldzIndex = this.dom.style.zIndex ;
  this.dom.style.zIndex = TGui.zIndexDnD ;
  event.setDragInside ( true ) ;
  return true ;
};
DeskletBase.prototype.dragEnd = function ( event )
{
  this.dom.style.zIndex = this.oldzIndex ;
  this.dragged = true ;
};
DeskletBase.prototype.setDragable = function ( state )
{
  if ( typeof ( state ) == 'boolean' && ! state ) this.dragable = false ;
  this.dragable = true ;
};
DeskletBase.prototype.isDragable = function()
{
  return this.dragable  ;
};
DeskletBase.prototype.close = function()
{
  if ( ! this.dom ) return ;
  this.flush() ;
  TGui.flushAttributes ( this.dom ) ;
  this.dom.parentNode.removeChild ( this.dom ) ;
};
DeskletBase.prototype.flush = function()
{
  DeskletHandler.remove ( this ) ;
};
/**
 *  @constructor
 *  @extends DeskletBase
 */
var CanvasDesklet = function ( name, id )
{
  canvas = null ;
  var dom = null ;
  if ( name )
  {
    canvas = document.createElement ( 'canvas' ) ;
    if ( ! canvas || ! canvas.getContext ) return ;
    this.canvas = canvas ;
    dom = document.createElement ( 'div' ) ;
    dom.appendChild ( this.canvas ) ;
    this.canvas.style.top = "0px" ;
    this.canvas.style.left = "0px" ;
    this.canvas.style.position = "absolute" ;
  }
  Tango.initSuper ( this, DeskletBase, name, dom, id );
  this.jsClassName = "CanvasDesklet" ;
};
CanvasDesklet.inherits( DeskletBase ) ;
CanvasDesklet.prototype.initialize = function()
{
  DeskletBase.prototype.initialize.apply ( this, arguments ) ;
};
CanvasDesklet.prototype.flush = function()
{
  DeskletBase.prototype.flush.apply ( this, arguments ) ;
};
CanvasDesklet.prototype.getContext = function()
{
  return this.canvas.getContext('2d');
};
CanvasDesklet.prototype.setSize = function ( width, height )
{
  TComponent.prototype.setSize.apply ( this, arguments );
  var d = this.getSize() ;
  this.dom.width = d.width ;
  this.dom.height = d.height ;
  this.canvas.width = d.width ;
  this.canvas.height = d.height ;
};

/**
 *  @constructor
 *  @extends CanvasDesklet
 */
var ClockDesklet = function ( name, id )
{
  if ( ! id ) id = TGui.getDesktopElement() ;
  Tango.initSuper ( this, CanvasDesklet, name, id );
  this.jsClassName = "ClockDesklet" ;
};
ClockDesklet.inherits( CanvasDesklet ) ;
ClockDesklet.prototype.setPainter = function ( self, method )
{
  this.initialize() ;
  this.painter = new TFunctionExecutor ( self, method ) ;
  var thiz = this ;
  this.timer = new TTimer ( 1000, function() { thiz.painter.execute() ; } ) ;
  this.timer.setInitialDelay ( 10 ) ;
  this.timer.start() ;
};
ClockDesklet.prototype.initialize = function()
{
  CanvasDesklet.prototype.initialize.apply ( this, arguments ) ;
};
ClockDesklet.prototype.flush = function()
{
  if ( this.timer ) this.timer.stop() ;
  this.timer = null ;
  if ( this.painter )
  {
    this.painter.flush() ;
  }
  this.painter = null ;
  CanvasDesklet.prototype.flush.apply ( this, arguments ) ;
};
ClockDesklet.prototype.setSize = function ( width, height )
{
  CanvasDesklet.prototype.setSize.apply ( this, arguments );
};
/**
 *  @constructor
 *  @extends ClockDesklet
 */
var ClockDeskletDefault = function ( name, id )
{
  Tango.initSuper ( this, ClockDesklet, name, id );
  this.jsClassName = "ClockDeskletDefault" ;
  if ( ! name ) return ;
  this.hourhand = null ;
  this.hourhandLoaded = true ;
  this.hourhandDraw = true ;

  this.minutehand = null ;
  this.minutehandLoaded = true ;
  this.minutehandDraw = true ;

  this.secondhand = null ;
  this.secondhandLoaded = true ;
  this.secondhandDraw = true ;

  this.overlay = null ;
  this.overlayLoaded = true ;
  this.overlayDraw = true ;

  this.top = null ;
  this.topLoaded = true ;
  this.topDraw = true ;

  this.back = null ;
  this.backLoaded = true ;
  this.backDraw = true ;

  this.startAngle = 0 ;
  this.dom.isFocusable = true ;
};
ClockDeskletDefault.inherits( ClockDesklet ) ;
ClockDeskletDefault.prototype.focusGained = function()
{
  if ( this.eClose ) this.eClose.style.visibility = "visible" ;
};
ClockDeskletDefault.prototype.focusLost = function()
{
  if ( this.eClose ) this.eClose.style.visibility = "hidden" ;
};
ClockDeskletDefault.prototype.setSize = function ( width, height )
{
  ClockDesklet.prototype.setSize.apply ( this, arguments );
  if ( this.eClose )
  {
    this.eClose.style.left = ( this.dom.offsetWidth - this.eClose.offsetWidth ) + "px" ;
    this.eClose.style.top = ( this.dom.offsetHeight - this.eClose.offsetHeight ) + "px" ;
    return ;
  }
  var iconButtonStyle = "width:13px;height:13px;" ;
  var str = "<img src='" + Cosmos.getIconClose ( "normal" ) + "' style='" + iconButtonStyle + "' onmousedown='return false;'></img>" ;
  this.eClose = TGui.createElement ( str ) ;
  this.dom.appendChild ( this.eClose ) ;
  this.eClose.style.position = 'absolute' ;
  this.eClose.style.left = ( this.dom.offsetWidth - this.eClose.offsetWidth ) + "px" ;
  this.eClose.style.top = ( this.dom.offsetHeight - this.eClose.offsetHeight ) + "px" ;
  this.eClose.style.visibility = "hidden" ;

  var cIMG = new TComponent ( this.eClose ) ;
  var el = {
             mouseup: function ( event )
             {
               this.di.eClose.src = Cosmos.getIconClose ( "inside" ) ;
             },
             mousedown: function ( event )
             {
               this.di.eClose.src = Cosmos.getIconClose ( "pressed" ) ;
             },
             mouseover: function ( event )
             {
               this.di.eClose.src = Cosmos.getIconClose ( "inside" ) ;
             },
             mouseout: function ( event )
             {
               this.di.eClose.src = Cosmos.getIconClose ( "normal" ) ;
             },
             click: function ( event )
             {
               this.di.close ( event ) ;
             }
           } ;
  el.di = this ;
  cIMG.addEventListener ( el ) ;
  this.addEventListener ( this ) ;
};
ClockDeskletDefault.prototype.mouseover = function ( event )
{
//  if ( this.eClose ) this.eClose.style.visibility = "visible" ;
};
ClockDeskletDefault.prototype.mouseout = function ( event )
{
//  if ( this.eClose ) this.eClose.style.visibility = "hidden" ;
};
ClockDeskletDefault.prototype.setStartAngle = function ( alpha )
{
  this.startAngle = alpha ;
};
ClockDeskletDefault.prototype.setBack = function ( img )
{
  if ( ! img ) return ;
  this.backLoaded = false ;
  var thiz = this ;
  this.back = new Image() ;
  this.back.onload = function(e) { thiz.backLoaded = true ; };
  if ( img.indexOf ( "/" ) < 0 ) this.back.src = this.getImageUrl ( img ) ;
  else                           this.back.src = img ;
};
ClockDeskletDefault.prototype.setHourHand = function ( img )
{
  if ( ! img ) return ;
  this.hourhandLoaded = false ;
  var thiz = this ;
  this.hourhand = new Image() ;
  this.hourhand.onload = function(e) { thiz.hourhandLoaded = true ; };
  if ( img.indexOf ( "/" ) < 0 ) this.hourhand.src = this.getImageUrl ( img ) ;
  else                           this.hourhand.src = img ;
};
ClockDeskletDefault.prototype.setMinuteHand = function ( img )
{
  if ( ! img ) return ;
  this.minutehandLoaded = false ;
  var thiz = this ;
  this.minutehand = new Image() ;
  this.minutehand.onload = function(e) { thiz.minutehandLoaded = true ; };
  if ( img.indexOf ( "/" ) < 0 ) this.minutehand.src = this.getImageUrl ( img ) ;
  else                           this.minutehand.src = img ;
};
ClockDeskletDefault.prototype.setSecondHand = function ( img )
{
  if ( ! img ) return ;
  this.secondhandLoaded = false ;
  var thiz = this ;
  this.secondhand = new Image() ;
  this.secondhand.onload = function(e) { thiz.secondhandLoaded = true ; };
  if ( img.indexOf ( "/" ) < 0 ) this.secondhand.src = this.getImageUrl ( img ) ;
  else                           this.secondhand.src = img ;
};
ClockDeskletDefault.prototype.setOverlay = function ( img )
{
  if ( ! img ) return ;
  this.overlayLoaded = false ;
  var thiz = this ;
  this.overlay = new Image() ;
  this.overlay.onload = function(e) { thiz.overlayLoaded = true ; };
  if ( img.indexOf ( "/" ) < 0 ) this.overlay.src = this.getImageUrl ( img ) ;
  else                           this.overlay.src = img ;
};
ClockDeskletDefault.prototype.setTop = function ( img )
{
  if ( ! img ) return ;
  this.topLoaded = false ;
  var thiz = this ;
  this.top = new Image() ;
  this.top.onload = function(e) { thiz.topLoaded = true ; };
  if ( img.indexOf ( "/" ) < 0 ) this.top.src = this.getImageUrl ( img ) ;
  else                           this.top.src = img ;
};
ClockDeskletDefault.prototype.start = function()
{
  this.setPainter ( this, this.paint ) ;
};
ClockDeskletDefault.prototype.paintBack = function()
{
  if ( this.back && this.backDraw )
  {
    try
    {
      var context = this.getContext('2d');
      context.drawImage( this.back, 0, 0);
    }
    catch ( exc )
    {
      log ( exc ) ;
    }
  }
};
ClockDeskletDefault.prototype.paint = function()
{
  if ( ! Tango.ua.opera && ! Tango.ua.chrome && ! Tango.ua.firefox )
  {
    if ( this.hourhand && ! this.hourhandLoaded ) { this.timer.stop() ; this.timer.start() ; return ; }
    if ( this.minutehand && ! this.minutehandLoaded )  { this.timer.stop() ; this.timer.start() ; return ; }
    if ( this.secondhand && ! this.secondhandLoaded )  { this.timer.stop() ; this.timer.start() ; return ; }
    if ( this.overlay && ! this.overlayLoaded )  { this.timer.stop() ; this.timer.start() ; return ; }
    if ( this.top && ! this.topLoaded )  { this.timer.stop() ; this.timer.start() ; return ; }
    if ( this.back && ! this.backLoaded )  { this.timer.stop() ; this.timer.start() ; return ; }
  }

  var size = this.getSize() ;
  var context = this.getContext('2d');
  context.clearRect(0, 0, size.width, size.height);

  this.paintBack() ;
  context.save();

  context.translate(size.width/2, size.height/2);

  var d = new Date() ;

  var hh = d.getHours() + d.getMinutes() / 60.0 ;
  var hoursAngle = hh * ( 360 / 12 ) ;
  var mm = d.getMinutes() + d.getSeconds() / 60.0 ;
  var minutesAngle = mm * ( 360 / 60 ) ;
  var secondsAngle = d.getSeconds() * ( 360 / 60 ) ;

  var ha = hoursAngle * ( Math.PI * 2 / 360.0 ) + this.startAngle ;
  var ma = minutesAngle * ( Math.PI * 2 / 360.0 ) + this.startAngle ;
  var sa = secondsAngle * ( Math.PI * 2 / 360.0 ) + this.startAngle ;

  if ( this.hourhand && this.hourhandDraw )
  {
    context.save();
    context.rotate( ha );
    context.drawImage ( this.hourhand, -size.width/2, -size.height/2 ) ;
    context.restore();
  }

  if ( this.minutehand && this.minutehandDraw )
  {
    context.save();
    context.rotate ( ma );
    context.drawImage ( this.minutehand, -size.width/2, -size.height/2 ) ;
    context.restore();
  }

  if ( this.secondhand && this.secondhandDraw )
  {
    context.rotate ( sa );
    context.drawImage ( this.secondhand, -size.width/2, -size.height/2 ) ;
  }

  context.restore();
  if ( this.overlay && this.overlayDraw )
  {
    context.drawImage( this.overlay, 0, 0);
  }
  if ( this.top && this.topDraw )
  {
    context.drawImage( this.top, 0, 0);
  }
};

/**
 *  @constructor
 *  @extends DeskletBase
 */
var Desklet = function ( name, id )
{
  var elem = null ;
  if ( name )
  {
    elem = document.createElement ( 'div' ) ;
  }
  Tango.initSuper ( this, DeskletBase, name, elem );
  this.jsClassName = "Desklet" ;
  if ( name )
  {
    this.dom.style.padding = "0px" ;
    this.dom.style.margin = "0px" ;
    this.initialize() ;
  }
};
Desklet.inherits( DeskletBase ) ;
Desklet.prototype.initialize = function()
{
  DeskletBase.prototype.initialize.apply ( this, arguments ) ;
};
Desklet.prototype.flush = function()
{
  DeskletBase.prototype.flush.apply ( this, arguments ) ;
};
Desklet.prototype.getContext = function()
{
  return this.dom.getContext('2d');
};
Desklet.prototype.setSize = function ( width, height )
{
  TContainer.prototype.setSize.apply ( this, arguments ) ;
  this._installDrag() ;
};

/**
 *  @constructor
 */
var CosmosLoginFactoryClass = function()
{
  this.currentPeer = null ;
};
CosmosLoginFactoryClass.prototype =
{
  getAxl: function ( dom )
  {
    var xml = new TXml ( dom ) ;
    var url = Cosmos.getLoginPath() + "Login.axl" ;
    var x = TSys.getAxl ( url ) ;
    var xx = new TXml ( x ) ;
    var axl = xx.getXml ( "axl" ) ;
    var xImages = xx.getXml ( "Images" ) ;
    if ( xImages )
    {
      this.backgroundMain = xImages.get ( "BackgroundMain" ) ;
    }
    var xCss = xx.getXml ( "Css" ) ;
    if ( xCss )
    {
      var cssName = xCss.getContent() ;
      if ( cssName ) Tango.useCss ( cssName ) ;
    }
    return axl.getDom() ;
  },
  isPagelet: function()
  {
    return true ;
  },
  login: function ( event )
  {
    login ( event ) ;
  },
  getPeer: function()
  {
    return this ;
  },
  layout: function ( dom, externalAttributes, radioGroups, layoutContext )
  {
    this.dom = dom ;
    var m = TGui.getMain() ;
    if ( this.backgroundMain )
    {
      var str = this.backgroundMain.getContent() ;
      var backgroundSize = this.backgroundMain.getAttribute ( "background-size" ) ;
      m.style.backgroundImage = "url(" + str + ")" ;
      if ( backgroundSize )
      {
        m.style.WebkitBackgroundSize = backgroundSize ;
        m.style.OBackgroundSize = backgroundSize ;
        m.style.MozBackgroundSize = backgroundSize ;
        m.style.backgroundSize = backgroundSize ;
      }
    }
  }
};
CosmosLoginFactoryClass.prototype.getImageUrl = function ( img )
{
  return Cosmos.getLoginPath() + img ;
};
CosmosLoginFactoryClass.prototype.resolveImgSrc = function ( domContainer )
{
  for ( var ch = domContainer.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    var img = ch.getAttribute ( "img" ) ;
    if ( img )
    {
      if ( img.indexOf ( "/" ) < 0 && img.indexOf ( "(" ) < 0 )
      {
        img = this.getImageUrl ( img ) ;
        new TXml ( ch ).addAttribute ( "img", img ) ;
      }
    }
    if ( ch.firstChild ) this.resolveImgSrc ( ch ) ;
  }
};
var CosmosLoginFactory = new CosmosLoginFactoryClass() ;
TGui.addTagDefinition ( "CosmosLogin", CosmosLoginFactory ) ;
/**
 *  @constructor
 */
var DockFactory = function()
{
  this.i = 0 ;
  this.style = "align-center:x;bottom:0;background-color:transparent;" ; //height:20px;width:100px;" ;
  this.str = "<xml><Container ></Container></xml>" ;
  this.iconMin = 22 ;
  this.iconMax = 32 ;
  this.lastId = null ;
  this.currentIconMin = 0 ;
  this.currentIconMax = 0 ;

  this.currentInsets = null ;
  this.currentSize = null ;
  this.currentBaseLine = 0 ;

  this.onClickList = null ;
  this.textList = [] ;
  this.styleXml = null ;
  this.reflection = true ;
};
DockFactory.prototype =
{
  getStyleXml: function()
  {
    // if ( ! this.styleXml )this.styleXml = new TXml ( TSys.getXml ( Cosmos.getDockRoot() + Cosmos.dockThemeName + "/Style.xml" ) ) ;
    if ( ! this.styleXml )this.styleXml = new TXml ( TSys.getAxl ( Cosmos.getDockRoot() + Cosmos.dockThemeName + "/Style.xml" ) ) ;
    return this.styleXml ;
  },
  getAxl: function ( dom )
  {
    var xml = new TXml ( dom ) ;
    this.currentInsets = null ;

    this.getStyleXml() ;
    var eStyle = this.styleXml.getStyle ( "Main" ) ;
    eStyle.setImageRoot ( Cosmos.getDockRoot() + Cosmos.dockThemeName ) ;
    var decoration = eStyle.getImageAsString() ;
    var dockHeight = eStyle.getHeight() ;
    if ( dockHeight < 0 ) dockHeight = 0 ;
    if ( ! this.currentInsets ) this.currentInsets = eStyle.getInsets() ;
    if ( this.reflection )
    {
//this.currentInsets.bottom = 0 ;
    }

    if ( ! this.currentInsets ) this.currentInsets = new Insets ( 2, 4, 0, 4 ) ;
    this.onClickList = [] ;
    this.textList = [] ;

    var dx = 0 ;

    var min = xml.getIntAttribute ( "icon-min", this.iconMin ) ;
    var max = xml.getIntAttribute ( "icon-max", this.iconMax ) ;

    var hmin = min ;
    var hmax = max ;
    if ( this.reflection )
    {
      hmin = Math.floor ( hmin * 1.5 ) ;
      hmax = Math.floor ( hmax * 1.5 ) ;
    }

    this.currentIconMin = min ;
    this.currentIconMax = max ;
    this.currentIconHMin = hmin ;
    this.currentIconHMax = hmax ;

    this.i++ ;
    var axl = new TXml ( TSys.parseDom ( this.str ) ) ;
    var c = axl.getXml ( "Container" ) ;

    if ( ! dockHeight ) dockHeight = hmin ;
    var height = this.currentInsets.top + dockHeight + this.currentInsets.bottom ;
    this.currentBaseLine = height - this.currentInsets.bottom ;

    var iconTop = this.currentBaseLine - hmin ;

    var n = 0 ;
    var x = this.currentInsets.left ;
    for ( var ch = xml.getDom().firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      if ( ch.nodeName != "Item" ) continue ;
      var icon = ch.getAttribute ( "icon" ) ;
      var onclick = ch.getAttribute ( "onclick" ) ;
      var text = ch.getAttribute ( "text" ) ;
      if ( ! icon ) continue ;
      var img = c.addXml ( "img" ) ;
      if ( this.reflection )
      {
        img.addAttribute ( "src", "{src:'" + icon + "',parameter:{reflection:true,reflection_scale:0.5}}" ) ;
      }
      else
      {
        img.addAttribute ( "src", icon ) ;
      }
      if ( n > 0 ) x += dx ;
      img.addAttribute ( "style", "left:" + x + "px;top:" + iconTop + "px;width:" + min + "px;height:" + hmin + "px;" ) ;
      if ( onclick ) this.onClickList.push ( new TFunctionExecutor ( onclick ) ) ;
      else           this.onClickList.push ( "" ) ;
      if ( text ) this.textList.push ( text ) ;
      else        this.textList.push ( "" ) ;
      var droptarget = ch.getAttribute ( "droptarget" ) ;
      if ( droptarget ) img.addAttribute ( "droptarget", droptarget ) ;
      x += min ;
      n++ ;
    }
    this.currentSize = new TDimension ( x - dx + this.currentInsets.left + this.currentInsets.right
                                      , height
                                      ) ;
    var style = this.style + "height:" + this.currentSize.height + "px;width:" + this.currentSize.width + "px;z-index:" + TGui.zIndexDock + ";" ;

    c.addAttribute ( "xstyle", style ) ;
    if ( decoration ) c.addAttribute ( "decoration", decoration ) ;
    return axl.getDom() ;
  },
  flush: function()
  {
  },
  getPeer: function()
  {
    var d = new Dock() ;
    d.reflection = this.reflection ;
    d.styleXml = this.styleXml ;
    d.insets = this.currentInsets ;
    d.size = this.currentSize ;
    d.viewport = new TRectangle ( this.currentInsets.left
                                , this.currentInsets.top
                                , this.currentSize.width - this.currentInsets.left - this.currentInsets.right
                                , this.currentSize.height - this.currentInsets.top - this.currentInsets.bottom
                                ) ;
    d.setMinMax ( this.currentIconMin, this.currentIconMax ) ;
    d.setMinMaxHeight ( this.currentIconHMin, this.currentIconHMax ) ;
    d.setBaseline ( this.currentBaseLine ) ;
    d.onClickList = this.onClickList ;
    d.textList = this.textList ;
    d.themeName = Cosmos.dockThemeName ;
    this.onClickList = null ;
    this.textList = null ;
    return d ;
  }
};
TGui.addTagDefinition ( "Dock", new DockFactory() ) ;

/**
 *  @constructor
 */
var Dock = function()
{
  this.jsClassName = "Dock" ;
  this.dom = null ;
  this.iconList = [] ;
  this.iconBoundsList = [] ;
  this.min = 0 ;
  this.max = 0 ;
  this.delta = 0 ;
  this.active = false ;
  this.animationActive = false ;

  this.baseline = 0 ;
  this.insets = null ;
  this.size = null ;
  this.viewport = null ;
  this.gaussArrayW = [] ;
  this.gaussArrayH = [] ;
  this.iconWidth = 0 ;
  this.iconHeight = 0 ;
  this.textDivList = [] ;
  TGlobalEventHandler.addOnMouseDown ( new TFunctionExecutor ( this, this.onPageMouseDown ) ) ;
};
Dock.prototype =
{
  onPageMouseDown: function()
  {
    if ( ! this.animationActive ) return true ;
    this.animationActive = false ;
    return true ;
  },
  setBaseline: function ( px )
  {
    this.baseline = px ;
  },
  setMinMax: function ( min, max )
  {
    this.min = min ;
    this.max = max ;
    this.iconWidth = min ;
    this.delta = max - min ;
  },
  setMinMaxHeight: function ( min, max )
  {
    this.minH = min ;
    this.maxH = max ;
    this.iconHeight = min ;
    this.deltaH = max - min ;
  },
  layout: function ( dock, externalAttributes, radioGroups, layoutContext )
  {
    this.dom = dock ;
    if ( this.dom.isDecoratorPart == "child" )
    {
       this.dom = this.dom.parentNode ;
    }
    for ( var ch = dock.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      if ( ch.nodeName != "IMG" ) continue ;
      this.iconList.push ( ch ) ;
    }
    TGui.addEventListener ( dock, "mousemove", this.onMouseMove.bindAsEventListener ( this ) ) ;
    TGui.addEventListener ( dock, "click", this.onMouseClick.bindAsEventListener ( this ) ) ;
    TGui.addEventListener ( dock, "mouseout", this.onMouseOut.bindAsEventListener ( this ) ) ;
    this.calculateGauss() ;
    new DnDTarget ( this.dom, this ) ;
  },
  resized: function()
  {
    if ( ! this.baseWidth ) this.baseWidth = this.dom.offsetWidth ;
  },
  flush: function()
  {
    if ( this._flushed ) return ;
    this._flushed = true ;
    this.iconList.length = 0 ;
  },
  onMouseOut: function ( event )
  {
    if ( this.animationActive ) return ;
    if ( ! this.active ) return ;
    var ev = new TEvent ( event ) ;
    var loc = TGui.getLocationOnPageOf ( this.dom ) ;
    var mx = ev.getX() - loc.x ;
    var my = ev.getY() - loc.y ;
    if ( this.viewport.contains ( mx, my ) ) return ;
    for ( var i = 0 ; i < this.iconBoundsList.length ; i++ )
    {
      var b = this.iconBoundsList[i] ;
      if ( i == this.iconBoundsList.length - 1 )
      {
        if ( mx >= b.x + b.width ) {}
        else
        if ( b.contains ( mx, my ) ) return ;
      }
      else
      {
        if ( b.contains ( mx, my ) ) return ;
      }
    }
    this.active = false ;
    this.resetIcons() ;
  },
  onMouseClick: function ( event )
  {
    if ( this.animationActive ) return ;
    var ev = new TEvent ( event ) ;
    var src = ev.getSource() ;
    if ( src.nodeName != 'IMG' ) return ;

    for ( var i = 0 ; i < this.iconList.length ; i++ )
    {
      if ( src === this.iconList[i] )
      {
        if ( this.textDivList[i] ) this.textDivList[i].style.visibility = "hidden" ;
        break ;
      }
    }
    var dy = 3 ;
    var yTop = src.offsetTop - src.offsetHeight ;
    var yBot = src.offsetTop ;
    var factor = 1 ;
    var y = yBot ;
    var n = 0 ;
    var self = this ;
    this.animationActive = true ;
    var timer = new TTimer ( 20, function()
    {
      n++ ;
      if ( n > 60 || ! self.animationActive )
      {
        self.animationActive = false ;
        self.resetIcons() ;
        self = null ;
        src = null ;
        timer.stop() ;
        return ;
      }
      if ( factor == - 1 )
      {
        if ( y <= yTop ) factor = 1 ;
      }
      else
      if ( factor == 1 )
      {
        if ( y >= yBot ) factor = - 1 ;
      }
      y = y + factor * dy ;
      src.style.top = y + "px" ;
    }) ;
    timer.start() ;
    if ( src.fExecutor ) src.fExecutor.executeWithEvent ( event ) ;
  },
  onMouseMove: function ( event, thisElement )
  {
    var div ;
    var img ;
    var i ;
    var x ;
    var b ;
    if ( this.animationActive ) return ;
    if ( ! this.iconBoundsList.length )
    {
      var eStyle = this.styleXml.getStyle ( "Label" ) ;
      if ( eStyle )
      {
        eStyle.setImageRoot ( Cosmos.getDockRoot() + this.themeName ) ;
      }
      else
      {
        eStyle = Cosmos.getTooltipStyle() ;
      }
      for ( i = 0 ; i < this.iconList.length ; i++ )
      {
        img = this.iconList[i] ;
        this.iconBoundsList.push ( new TRectangle ( img.offsetLeft, img.offsetTop, img.offsetWidth, img.offsetHeight ) ) ;
        if ( this.onClickList[i] ) img.fExecutor = this.onClickList[i] ;
        if ( ! this.textList[i] )
        {
          this.textDivList.push ( "" ) ;
        }
        else
        {
          var textDiv = document.createElement ( "span" ) ;
          this.textDivList.push ( textDiv ) ;
          this.dom.appendChild ( textDiv ) ;
          textDiv.style.whiteSpace = "nowrap" ;
          textDiv.innerHTML = this.textList[i] ;
          textDiv.style.visibility = "hidden" ;
          textDiv.style.position = "absolute" ;
          if ( eStyle )
          {
            eStyle.apply ( textDiv ) ;
          }
        }
      }
    }
    var ev = new TEvent ( event ) ;
    var src = ev.getSource() ;
    var loc = TGui.getLocationOnPageOf ( this.dom ) ;
    var mx = ev.getX() - loc.x ;
    var my = ev.getY() - loc.y ;

    if ( thisElement ) src = thisElement ;
    if ( ! this.active )
    {
      if ( src.nodeName != 'IMG' ) return ;
      var found = false ;
      for ( i = 0 ; i < this.iconList.length ; i++ )
      {
        if ( src === this.iconList[i] )
        {
          found = true ; break ;
        }
      }
      if ( ! found ) return ;
    }
    this.active = true ;
    var gaussX0 = Math.abs ( Math.floor ( ( this.viewport.width - mx + this.viewport.x ) ) ) ;

    var totalWidth = 0 ;
    var gaussX = gaussX0 ;
    for ( i = 0 ; i < this.iconList.length ; i++ )
    {
      img = this.iconList[i] ;
      b = this.iconBoundsList[i] ;
      var fx = this.gaussArrayW[gaussX] ;
      var fy = this.gaussArrayH[gaussX] ;
      b.x = x ;
      b.y = this.baseline - fy ; //- Math.floor ( fx / 4 ) ;
      b.width = fx ;
      b.height = fy ;
      totalWidth += fx ;
      img.style.width = fx + "px" ;
      img.style.height = fy + "px" ;

      gaussX += this.iconWidth ;
      x += fx ;
    }

    var bws = TGui.getBrowserWindowSize() ;
    var w = this.insets.left + this.insets.right + totalWidth ;
    x = ( this.dom.offsetWidth - totalWidth ) / 2 ;
    if ( x < 0 ) x = Math.ceil ( x ) ;
    else         x = Math.floor ( x ) ;
    for ( i = 0 ; i < this.iconList.length ; i++ )
    {
      b = this.iconBoundsList[i] ;
      b.x = x ;
      img = this.iconList[i] ;
      img.style.left = x + "px" ;
      img.style.top = b.y + "px" ;
      if ( img === src )
      {
        if ( this.textDivList[i] )
        {
          div = this.textDivList[i] ;
          div.style.visibility = "visible" ;
          div.style.top = Math.floor ( b.y - this.textDivList[i].offsetHeight - 4 ) + "px" ;
          div.style.left = ( b.x + Math.floor ( ( b.width - div.offsetWidth ) / 2 ) ) + "px" ;
        }
      }
      else
      {
        if ( this.textDivList[i] )
        {
          div = this.textDivList[i] ;
          div.style.visibility = "hidden" ;
        }
      }
      x += b.width ;
    }
  },
  resetIcons: function()
  {
    this.dom.style.width = this.baseWidth + "px" ;
    TGui.layoutConstraints ( this.dom ) ;
    var totalWidth = 0 ;
    var x = 0 ;
    var img ;
    var i ;
    var b ;
    for ( i = 0 ; i < this.iconList.length ; i++ )
    {
      img = this.iconList[i] ;
      b = this.iconBoundsList[i] ;
      var fx = this.iconWidth ;
      var fy = this.iconHeight ;
      b.x = x ;
      b.y = this.baseline - fy ;
      b.width = fx ;
      b.height = fy ;
      totalWidth += fx ;
      img.style.width = fx + "px" ;
      img.style.height = fy + "px" ;
      x += fx ;
    }

    x = this.viewport.x + ( this.viewport.width - totalWidth ) / 2 ;
    if ( x < 0 ) x = Math.ceil ( x ) ;
    else         x = Math.floor ( x ) ;
    for ( i = 0 ; i < this.iconList.length ; i++ )
    {
      b = this.iconBoundsList[i] ;
      img = this.iconList[i] ;
      img.style.left = x + "px" ;
      img.style.top = b.y + "px" ;
      x += b.width ;
      if ( this.textDivList[i] ) this.textDivList[i].style.visibility = "hidden" ;
    }
  },
  calculateGauss: function()
  {
//    var sigma = 0.1 ;
    var sigma = 0.02 ;
//    var yscale = this.delta ;
    var yscale = this.deltaH * 2.5 ;
    var dx = 1 / this.viewport.width ;
    var i = 0 ;
    for ( var x = -1 ; x < 1 ; x += dx )
    {
      var y = Math.exp ( - ( x*x ) / sigma ) ;
      var py = Math.floor ( y * yscale ) + this.min ;
      this.gaussArrayW.push ( py ) ;
      if ( this.reflection ) py = Math.floor ( 1.5 * py ) ;
      this.gaussArrayH.push ( py ) ;
      i++ ;
    }
  }
};
Dock.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
};
Dock.prototype.dragEnter = function ( evt )
{
  evt.acceptDrag ( DnDConstants.COPY_OR_MOVE ) ;
};
Dock.prototype.dragExit = function ( evt )
{
};
Dock.prototype.dragOver = function ( evt )
{
  var t = evt.getTransferable();
  var mx = evt.getX() ;
  var my = evt.getY() ;
  if (  ! t.isDataFlavorSupported ( DnDDataFlavor.XML )
     || t.getName() != 'COSMOS.ITEM'
     )
  {
    // evt.rejectDrag() ;
    evt.acceptDrag ( DnDConstants.COPY ) ;
    return ;
  }
  evt.acceptDrag ( DnDConstants.COPY ) ;
};
Dock.prototype.drop = function ( evt )
{
  var action = evt.getDropAction() ;
log ( " action=" +   action ) ;
  var t = evt.getTransferable();
  var mx = evt.getX() ;
  var my = evt.getY() ;
  if (  ! t.isDataFlavorSupported ( DnDDataFlavor.XML )
     || t.getName() != 'COSMOS.ITEM'
     )
  {
      evt.rejectDrop() ;
      return ;
  }
  evt.acceptDrop ( action) ;
  var action = evt.getDropAction() ;
  var x = t.getData ( DnDDataFlavor.XML ) ;
log(x);
  // Cosmos.createDeskIcon ( x, mx, my ) ;
  evt.dropComplete ( true ) ;
};

/**
 *  @constructor
 *  @extends PopupMenu
 */
var CosmosPopupMenu = function ( id, anchorElement )
{
  Tango.initSuper ( this, PopupMenu, id, anchorElement );
  this.jsClassName = "CosmosPopupMenu" ;
};
CosmosPopupMenu.inherits( PopupMenu );
CosmosPopupMenu.prototype.getMenuPaneInstance = function ( )
{
  return new CosmosMenuPane ( this, this.xMenuPane ) ;
};
/**
 *  @constructor
 *  @extends MenuPane
 */
var CosmosMenuPane = function ( parent, axl )
{
  Tango.initSuper ( this, MenuPane, parent, axl );
  this.jsClassName = "CosmosMenuPane" ;
};
CosmosMenuPane.inherits( MenuPane );
CosmosMenuPane.prototype._initialize = function()
{
  var eStyle = Cosmos.getPart ( "MenuPane" ) ;
  eStyle.applyStyle ( this.dom ) ;
};
CosmosMenuPane.prototype.getBackgroundImageUrl = function()
{
  var eStyle = Cosmos.getPart ( "MenuPane" ) ;
  var styleString = eStyle.getStyleString() ;
  var decoration = eStyle.getImageAsString() ;
  var s = this.getSize() ;
  var url = eStyle.getBackgroundImageUrl ( s ) ;
  return url ;
};
CosmosMenuPane.prototype.getMenuItemInstance = function ( parent, xMenuButton )
{
  return new CosmosMenuItem ( parent, xMenuButton ) ;
};
CosmosMenuPane.prototype.isAnimated = function()
{
  return true ;
};
/**
 *  @constructor
 *  @extends MenuItem
 */
CosmosMenuItem = function ( parent, axl )
{
  if ( ! parent )
  {
    Tango.initSuper ( this, MenuItem, null );
    return ;
  }
  Tango.initSuper ( this, MenuItem, parent, axl, "CosmosMenuItem" );
  this.jsClassName = "CosmosMenuItem" ;
};
CosmosMenuItem.inherits( MenuItem );
CosmosMenuItem.prototype._initialize = function()
{
  this.eStyle = Cosmos.getPart ( "MenuItem" ) ;
  var normal = this.eStyle.getSubStyle ( "normal" ) ;
  normal.applyStyle ( this.dom ) ;
};
CosmosMenuItem.prototype.getMenuPaneInstance = function ( )
{
  return new CosmosMenuPane ( this, this.xMenuPane ) ;
};
CosmosMenuItem.prototype.setDecoration = function ( state )
{
  if ( ! state ) return ;
  var width  = this.dom.offsetWidth ;
  var height = this.dom.offsetHeight ;
  var url = null ;

  var s = this.getSize() ;
  if ( this.dom.disabled )
  {
    state = "disabled" ;
  }
  var es = this.eStyle.getSubStyle ( state ) ;
  es.applyStyle ( this.dom ) ;
  url = es.getBackgroundImageUrl ( s ) ;
  this.dom.style.backgroundImage = url ;
};
var DeskIconFactoryClass = function()
{
  this.iconId = TSys.getTempId() ;
  this.width = 64 ;
  this.height = 64 ;
  this.iconWidth = this.width + 4 ;
  this.iconHeight = this.height + 4 ;
  this.str = "<xml><Container><Container name='OVERLAY' style='top:0px;left:0px;bottom:-0;right:-0;background-color:transparent;' /></Container></xml>" ;
  this.action = null ;
  this.executeOnDblClick = false ;
  this.componentList = [] ;
  TSys.addLogoutListener ( new TFunctionExecutor ( this, this.logoutListener ) ) ;
  TSys.addLoginListener ( new TFunctionExecutor ( this, this.loginListener ) ) ;
};
/**
 *  @constructor
 */
DeskIconFactoryClass.prototype =
{
  getAxl: function ( dom )
  {
    var xml = new TXml ( dom ) ;
    this.xmlDefinition = null ;
    if ( xml.getBoolAttribute ( "removable", false ) )
    {
      this.xmlDefinition = xml ;
    }
    var axl = new TXml ( TSys.parseDom ( this.str ) ) ;
    var c = axl.getXml ( "Container" ) ;
    var c2 = c.getXml ( "Container" ) ;
    c.addAttribute ( "style", "width:" + this.iconWidth + "px;height:" + this.iconHeight + "px;visibility:hidden;" ) ;
    var src = xml.getAttribute ( "src" ) ;
    if ( src.indexOf ( "(" ) > 0 && src.indexOf ( ")" ) > src.indexOf ( "(" ) )
    {
      var fe = new TFunctionExecutor ( src ) ;
      src = fe.execute() ;
    }
    this.tooltip = xml.getAttribute ( "tooltip" ) ;

    this.action = null ;
    this.executeOnDblClick = false ;
    this.action = xml.getAttribute ( "action" ) ;
    if ( ! this.action )
    {
      this.action = xml.getAttribute ( "ondblclick" ) ;
      if ( this.action ) this.executeOnDblClick = true ;
    }
    if ( ! this.action )
    {
      this.action = xml.getAttribute ( "onclick" ) ;
      if ( this.action ) this.executeOnDblClick = false ;
    }
    this.name = xml.getAttribute ( "name" ) ;
    if ( this.action )
    {
      if ( ! this.name ) this.name = this.action.replace ( /[ \(\)\[\]\/,\{\}\.]/g, '_' ) ;
      this.action = new TFunctionExecutor ( this.action ) ;
    }

    this.eStyle = Cosmos.getPart ( "DeskIcon" ) ;
    this.backgroundImageUrl = TGui.buildScaledImageUrl ( this.eStyle.getImage() ) ;

    var paddingString = this.eStyle.getPaddingString() ;
    var padding = this.eStyle.getPadding() ;
    var top = "0px;" ;
    if ( padding && typeof ( padding.top ) == 'number' ) top = padding.top + "px;" ;

    var xImg = c.addXml ( "img" ) ;
    xImg.addAttribute ( "style", "align-center:xy;width:" + this.width + "px;height:" + this.height + "px;" ) ; //top:" + top ) ;
    xImg.addAttribute ( "src", src ) ;
    if ( this.tooltip )
    {
      if ( c2 ) c2.addAttribute ( "tooltip", Cosmos.getTooltip ( this.tooltip ) ) ;
      else      c.addAttribute ( "tooltip", Cosmos.getTooltip ( this.tooltip ) ) ;
    }
    return axl.getDom() ;
  },
  flush: function()
  {
  },
  getPeer: function()
  {
    var d = new DeskIcon() ;
    this.componentList.push ( d ) ;
    d.ondblclick = this.ondblclick ;
    this.ondblclick = null ;
    d.backgroundImageUrl = this.backgroundImageUrl ;
    d.action = this.action ;
    d.executeOnDblClick = this.executeOnDblClick ;
    d.name = this.name ;
    d.tooltip = this.tooltip ;
    d.eStyle = this.eStyle ;
    d.xmlDefinition = this.xmlDefinition ;
    d.saveDefinition = d.xmlDefinition !== null ;
    d.removable = d.xmlDefinition !== null ;
    return d ;
  },
  removeComponent: function ( deskIcon )
  {
    for ( var i = 0 ; i < this.componentList.length ; i++ )
    {
      if ( this.componentList[i] === deskIcon )
      {
        var di = this.componentList[i] ;
        this.componentList.splice ( i, 1 ) ;
        di.flush() ;
        break ;
      }
    }
  },
  remove: function ( deskIcon )
  {
    this.removeComponent ( deskIcon ) ;
    deskIcon.flush() ;
    if ( ! deskIcon.name ) return ;
    var pd = TSys.getPersistentData() ;
    var xpd = pd.getElement ( "DeskIcon/" + deskIcon.name ) ;
    if ( xpd ) xpd.remove() ;
  },
  logoutListener: function()
  {
    var pd = TSys.getPersistentData() ;
    for ( var i = 0 ; i < this.componentList.length ; i++ )
    {
      var di = this.componentList[i] ;
      if ( ! di.name ) continue ;
      try
      {
        var xpd = pd.ensureXml ( "DeskIcon/" + di.name ) ;
        var xBounds = xpd.ensureXml ( "Bounds" ) ;
        xBounds.addAttribute ( "x", "" + di.dom.offsetLeft ) ;
        xBounds.addAttribute ( "y", "" + di.dom.offsetTop ) ;
        xBounds.addAttribute ( "width", "" + di.dom.offsetWidth ) ;
        xBounds.addAttribute ( "height", "" + di.dom.offsetHeight ) ;
        if ( di.saveDefinition && di.xmlDefinition )
        {
          xpd.remove ( "DeskIcon" ) ;
          xpd.remove ( "axl" ) ;
          var axl = xpd.addXml ( "axl" ) ;
          axl.addDuplicate ( di.xmlDefinition ) ;
        }
      }
      catch ( exc )
      {
        log ( exc ) ;
      }
    }
  },
  loginListener: function()
  {
  },
  onload: function ( ev )
  {
    if ( ! TSys.loggedIn ) return ;
    var targetElement = ev.getSource() ;
    var pd = TSys.getPersistentData() ;
    var xpd = pd.getElement ( "DeskIcon" ) ;
    var en = xpd.getEnum ( DOM_ELEMENT_NODE ) ;
    while ( en.hasNext() )
    {
      var d = en.nextXml().getDom ( "axl" ) ;
      if ( ! d ) continue ;
      var axl = new TXml ( d ) ;
      this.createDeskIcon ( axl, targetElement ) ;
    }
  },
  createDeskIcon: function ( axl, targetElement, mx, my )
  {
    var span = document.createElement ( 'span' ) ;
    document.body.appendChild ( span ) ;
    span.style.width = this.width + "px" ;
    span.style.height = this.height + "px" ;
    TGui.setAxl ( span, axl ) ;
    var edi = span.firstChild ;

    span.removeChild ( edi ) ;
    document.body.removeChild ( span ) ;
    targetElement.appendChild ( edi ) ;
    if ( typeof ( mx ) == 'number' && typeof ( my ) == 'number')
    {
      edi.style.top = Math.floor ( my - ( edi.offsetHeight / 2 ) ) + 'px' ;
      edi.style.left = Math.floor ( mx - ( edi.offsetWidth / 2 ) ) + 'px' ;
    }
  }
};
var DeskIconFactory = new DeskIconFactoryClass() ;
TGui.addTagDefinition ( "DeskIcon", DeskIconFactory ) ;
/**
 *  @constructor
 *  @extends TComponent
 */
var DeskIcon = function()
{
  Tango.initSuper ( this, TComponent, null );
  this.dom = null ;
  this.img = null ;
  this.action = null ;
  this.bounds = null ;
  this.first = true ;
  this.jsClassName = "DeskIcon" ;
};
DeskIcon.inherits( TComponent ) ;
DeskIcon.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  this.dom.xClassName = "DeskIcon" ;
  if ( this.name )
  {
    var pd = TSys.getPersistentData() ;
    var xpd = pd.ensureXml ( "DeskIcon/" + this.name ) ;
    this.bounds = xpd.getRectangle ( "Bounds" ) ;
  }
  for ( var ch = dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.nodeName != "IMG" ) continue ;
    this.img = ch ;
    break ;
  }
  this.eStyle.apply ( this.dom ) ;
  if ( this.eStyle.style.inside )
  {
    this.eStyle.style.inside.root = Cosmos.getStringPath() ;
    this.insideImageUrl = TGui.buildScaledImageUrl ( this.eStyle.style.inside ) ;
  }
  else
  {
    this.dom.style.backgroundImage = "none" ;
  }
  if ( this.eStyle.style.overlay )
  {
    this.eStyle.style.overlay.root = Cosmos.getStringPath() ;
    this.overlayImageUrl = TGui.buildScaledImageUrl ( this.eStyle.style.overlay ) ;
  }
  TGui.addEventListener ( this.img, "click", this.img_click.bindAsEventListener ( this ) ) ;
  TGui.addEventListener ( this.img, "dblclick", this.img_dblclick.bindAsEventListener ( this ) ) ;

  this.addEventListener ( this ) ;
};
DeskIcon.prototype.resized = function()
{
  if ( this.first )
  {
    this.first = false ;
    if ( this.bounds )
    {
      this.dom.style.left = this.bounds.x + "px" ;
      this.dom.style.top = this.bounds.y + "px" ;
    }
    var c = new TContainer ( this.dom ) ;
    var eOVERLAY = c.getElementByName ( "OVERLAY" ) ;
    if ( eOVERLAY )
    {
      if ( this.overlayImageUrl )
      {
        var u = this.overlayImageUrl + "&width=" + eOVERLAY.offsetWidth + "&height=" + eOVERLAY.offsetHeight ;
        var url = "url(" + u + ")" ;
        eOVERLAY.style.backgroundImage = url ;
      }
      if ( this.removable )
      {
        var iconButtonStyle = "width:13px;height:13px;" ;
        var str = "<img src='" + Cosmos.getIconClose ( "normal" ) + "' style='" + iconButtonStyle + "' onmousedown='return false;'></img>" ;
        eOVERLAY.innerHTML = str ;
        this.eClose = eOVERLAY.firstChild ;
eOVERLAY.removeChild ( this.eClose ) ;
this.dom.appendChild ( this.eClose ) ;
        this.eClose.style.position = 'absolute' ;
        this.eClose.style.left = ( this.dom.offsetWidth - this.eClose.width ) + "px" ;
        this.eClose.style.top = ( this.dom.offsetHeight - this.eClose.height ) + "px" ;
        this.eClose.style.visibility = "hidden" ;

        var cIMG = new TComponent ( this.eClose ) ;
        var el = {
                   mouseup: function ( event )
                   {
                     this.di.eClose.src = Cosmos.getIconClose ( "inside" ) ;
                   },
                   mousedown: function ( event )
                   {
                     this.di.eClose.src = Cosmos.getIconClose ( "pressed" ) ;
                   },
                   mouseover: function ( event )
                   {
                     this.di.eClose.src = Cosmos.getIconClose ( "inside" ) ;
                   },
                   mouseout: function ( event )
                   {
                     this.di.eClose.src = Cosmos.getIconClose ( "normal" ) ;
                   },
                   click: function ( event )
                   {
                     this.di.dom.parentNode.removeChild ( this.di.dom ) ;
                     DeskIconFactory.remove ( this.di ) ;
                   }
                 } ;
             el.di = this ;
        cIMG.addEventListener ( el ) ;
      }
    }
    this.dom.style.visibility = "inherit" ;
  }
};
DeskIcon.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  DeskIconFactory.removeComponent ( this ) ;
};
DeskIcon.prototype.img_click = function ( event )
{
  if ( this.dragged ) return ;
  if ( ! this.action ) return ;
  if ( ! this.isImg ) return ;
  if ( ! this.executeOnDblClick ) this.action.executeWithEvent ( event ) ;
};
DeskIcon.prototype.mousedown = function ( event )
{
  var src = new TEvent ( event ).getSource() ;
  if ( src == this.eClose ) return ;
  this.isImg = src.nodeName == 'IMG' ;
  this.dragged = false ;
  Dragger.startDrag ( event, this.dom ) ;
};
DeskIcon.prototype.dragStart = function ( event )
{
  this.oldzIndex = this.dom.style.zIndex ;
  this.dom.style.zIndex = TGui.zIndexDnD ;
  event.setDragInside ( true ) ;
  return true ;
};
DeskIcon.prototype.dragEnd = function ( event )
{
  this.dom.style.zIndex = this.oldzIndex ;
  this.dragged = true ;
};
DeskIcon.prototype.img_dblclick = function ( event )
{
  if ( ! this.action ) return ;
  if ( ! this.isImg ) return ;
  if ( this.executeOnDblClick ) this.action.executeWithEvent ( event ) ;
};
DeskIcon.prototype.mousemove = function ( event )
{
};
DeskIcon.prototype.mouseover = function ( event )
{
  var url ;
  var u ;
  if ( this.inside )
  {
  }
  else
  {
    if ( this.eClose )
    {
      this.eClose.style.visibility = "visible" ;
    }
    this.inside = true ;
    if ( this.insideImageUrl )
    {
      u = this.insideImageUrl + "&width=" + this.dom.offsetWidth + "&height=" + this.dom.offsetHeight ;
      url = "url(" + u + ")" ;
      this.dom.style.backgroundImage = url ;
    }
    else
    {
      u = this.backgroundImageUrl + "&width=" + this.dom.offsetWidth + "&height=" + this.dom.offsetHeight ;
      url = "url(" + u + ")" ;
      this.dom.style.backgroundImage = url ;
    }
  }
};
DeskIcon.prototype.mouseout = function ( event, thisElement )
{
  this.inside = false ;
  if ( this.insideImageUrl )
  {
    var u = this.backgroundImageUrl + "&width=" + this.dom.offsetWidth + "&height=" + this.dom.offsetHeight ;
    var url = "url(" + u + ")" ;
    this.dom.style.backgroundImage = url ;
  }
  else
  {
    this.dom.style.backgroundImage = "none" ;
  }
  if ( this.eClose )
  {
    this.eClose.style.visibility = "hidden" ;
  }
};
/**
 *  @constructor
 */
var CosmosButtonFactoryClass = function()
{
  Tango.initSuper ( this, CustomButtonFactoryClass );
  this.jsClassName = "CosmosButtonFactoryClass" ;
};
CosmosButtonFactoryClass.inherits( CustomButtonFactoryClass ) ;

CosmosButtonFactoryClass.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
};
CosmosButtonFactoryClass.prototype.getEStyle = function ( xml )
{
  var stringPath = Cosmos.getStringPath() ;
  var eStyle = Cosmos.getPart ( "Button" ) ;
  var sub = null ;
  sub = eStyle.getSubStyle ( "normal" ) ;
  if ( sub ) sub.setImageRoot ( stringPath ) ;
  sub = eStyle.getSubStyle ( "inside" ) ;
  if ( sub ) sub.setImageRoot ( stringPath ) ;
  sub = eStyle.getSubStyle ( "pressed" ) ;
  if ( sub ) sub.setImageRoot ( stringPath ) ;
  sub = eStyle.getSubStyle ( "disabled" ) ;
  if ( sub ) sub.setImageRoot ( stringPath ) ;
  return eStyle ;
};
CosmosButtonFactoryClass.prototype.getTooltip = function ( text )
{
  return Cosmos.getTooltip ( text ) ;
};

var CosmosButtonFactory = new CosmosButtonFactoryClass() ;
TGui.addTagDefinition ( "CosmosButton", CosmosButtonFactory ) ;

/**
 *  @constructor
 *  @extends ChoiceButtonFactoryClass
 */
CosmosChoiceButtonFactoryClass = function()
{
  Tango.initSuper ( this, ChoiceButtonFactoryClass );
  this.jsClassName = "CosmosChoiceButtonFactoryClass" ;
};
CosmosChoiceButtonFactoryClass.inherits( ChoiceButtonFactoryClass ) ;

CosmosChoiceButtonFactoryClass.prototype.createPeer = function ( eStyle, xml )
{
  return new CosmosChoiceButton ( eStyle, xml ) ;
};
CosmosChoiceButtonFactoryClass.prototype.getEStyle = function ( xml )
{
  xml.addAttribute ( "arrow", "up.down" ) ;

  var stringPath = Cosmos.getStringPath() ;
  var eStyle = Cosmos.getPart ( "Button" ) ;
  var sub = null ;
  sub = eStyle.getSubStyle ( "normal" ) ;
  if ( sub ) sub.setImageRoot ( stringPath ) ;
  sub = eStyle.getSubStyle ( "inside" ) ;
  if ( sub ) sub.setImageRoot ( stringPath ) ;
  sub = eStyle.getSubStyle ( "pressed" ) ;
  if ( sub ) sub.setImageRoot ( stringPath ) ;
  sub = eStyle.getSubStyle ( "disabled" ) ;
  if ( sub ) sub.setImageRoot ( stringPath ) ;
  return eStyle ;
};
var CosmosChoiceButtonFactory = new CosmosChoiceButtonFactoryClass() ;
TGui.addTagDefinition ( "CosmosChoiceButton", CosmosChoiceButtonFactory ) ;

/**
 *  @constructor
 *  @extends ChoiceButton
 */
var CosmosChoiceButton = function ( eStyle, xml )
{
  Tango.initSuper ( this, ChoiceButton, eStyle, xml );
  this.jsClassName = "CosmosChoiceButton" ;
};
CosmosChoiceButton.inherits( ChoiceButton ) ;
CosmosChoiceButton.prototype.getXClassName = function()
{
  return "CosmosChoiceButton";
} ;
CosmosChoiceButton.prototype.setExtendedStyles = function()
{
  CustomButton.prototype.setExtendedStyles.apply ( this ) ;
};
CosmosChoiceButton.prototype.getCssClassName = function ( state )
{
};
CosmosChoiceButton.prototype.getPopupClassName = function()
{
  return "CosmosPopupMenu" ;
} ;
CosmosChoiceButton.prototype.getArrowHtml = function()
{
  if ( ! this.arrow ) return "" ;
  var w = Cosmos.getIconWidth ( "ArrowUpDown" ) ;
  var h = Cosmos.getIconHeight ( "ArrowUpDown" ) ;
  this.arrowImageUrlNormal = Cosmos.getIconName ( "ArrowUpDown", "normal" ) ;
  this.arrowImageUrlInside = Cosmos.getIconName ( "ArrowUpDown", "inside" ) ;
  this.arrowImageUrlPressed = Cosmos.getIconName ( "ArrowUpDown", "pressed" ) ;
  this.arrowImageUrlDisabled = Cosmos.getIconName ( "ArrowUpDown", "disabled" ) ;
  return "<img style='position:absolute;width:" + w + "px;height:" + h + "px;' class='Arrow' src='" + this.arrowImageUrlNormal + "' />" ;
};
/**
 *  @constructor
 *  @extends CustomTextFieldFactoryClass
 */
var CosmosTextFieldFactoryClass = function()
{
  Tango.initSuper ( this, CustomTextFieldFactoryClass );
  this.jsClassName = "CosmosTextFieldFactoryClass" ;
};
CosmosTextFieldFactoryClass.inherits( CustomTextFieldFactoryClass ) ;

CosmosTextFieldFactoryClass.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
};
CosmosTextFieldFactoryClass.prototype.getEStyle = function ( xml )
{
  var stringPath = Cosmos.getStringPath() ;
  var eStyle = Cosmos.getPart ( "TextField" ) ;
//  eStyle.style.isCosmos = true ;
  var eSub = eStyle.getSubStyle ( "normal" ) ;
  eSub.setImageRoot ( Cosmos.getStringPath() ) ;
  return eStyle ;
};
var CosmosTextFieldFactory = new CosmosTextFieldFactoryClass() ;
TGui.addTagDefinition ( "CosmosTextField", CosmosTextFieldFactory ) ;

/**
 *  @constructor
 */
var CosmosItemViewFactoryClass = function()
{
  Tango.initSuper ( this, ItemViewFactoryClass );
};
CosmosItemViewFactoryClass.inherits( ItemViewFactoryClass ) ;
CosmosItemViewFactoryClass.prototype._createPeer = function ( xml )
{
  return new CosmosItemView ( xml ) ;
};

var CosmosItemViewFactory = new CosmosItemViewFactoryClass() ;
TGui.addTagDefinition ( "CosmosItemView", CosmosItemViewFactory ) ;
CosmosItemViewFactoryClass.prototype._getCssClassName = function()
{
  return "CosmosItemView" ;
};
/**
 *  @constructor
 *  @extends ItemView
 */
var CosmosItemView = function ( axl )
{
  Tango.initSuper ( this, ItemView, axl );
  var eStyle = Cosmos.getPart ( "ViewItem" ) ;
  if ( eStyle )
  {
    this._imgUrl = {} ;
    var sub = null ;
    sub = eStyle.getSubStyle ( "normal" ) ;
    if ( sub ) this._imgUrl.normal = TGui.buildScaledImageUrl ( sub.style.image ) ;
    sub = eStyle.getSubStyle ( "selected" ) ;
    if ( sub ) this._imgUrl.selected = TGui.buildScaledImageUrl ( sub.style.image ) ;
    sub = eStyle.getSubStyle ( "inside" ) ;
    if ( sub ) this._imgUrl.inside = TGui.buildScaledImageUrl ( sub.style.image ) ;
    sub = eStyle.getSubStyle ( "selectedInside" ) ;
    if ( sub ) this._imgUrl.selectedInside = TGui.buildScaledImageUrl ( sub.style.image ) ;

    if ( ! this._imgUrl.selectedInside ) this._imgUrl.selectedInside = this._imgUrl.selected ;
    if ( ! this._imgUrl.selected ) this._imgUrl.selected = this._imgUrl.selectedInside ;
  }
};
CosmosItemView.inherits( ItemView ) ;
CosmosItemView.prototype.getItemClass = function()
{
  return "ThemeCosmosViewItem" ;
};
CosmosItemView.prototype.setItemSelected = function ( e, state )
{
  if ( ! e ) return ;
  if ( state ) e.className = "ThemeCosmosViewItemSelected" ;
  else         e.className = "ThemeCosmosViewItem" ;
  this.setItemSelectedImages ( e, state ) ;
};
CosmosItemView.prototype.setItemHighlighted = function ( e, state )
{
  if ( ! e ) return ;
  if ( state ) e.className = "ThemeCosmosViewItemHighlighted" ;
  else         e.className = "ThemeCosmosViewItem" ;
  this.setItemHighlightedImages ( e, state ) ;
};
/**
 *  @constructor
 */
PODServiceProvider = function ( current, baseurl )
{
  if ( ! current ) return ;
  if ( ! baseurl ) return ;
  if ( baseurl.charAt ( baseurl.length-1 ) != "/" ) baseurl = baseurl + "/" ;
  this.jsClassName = "PictureOfTheDay" ;
  this.baseurl = baseurl ;
  this.current = current ;
  this.initial = current ;
  this.date = null ;
  this.title = null ;
  this.next = null ;
  this.previous = null ;
  this.wallpaper = null ;
  this.imageUrl = null ;
} ;
PODServiceProvider.prototype.reset = function()
{
  this.current = this.initial ;
} ;
PODServiceProvider.prototype.getProviderTitle = function()
{
  return "No Title" ;
} ;
PODServiceProvider.prototype.getIcon = function()
{
  return "" ;
} ;
PODServiceProvider.prototype.getProviderName = function()
{
  return this.jsClassName ;
} ;
PODServiceProvider.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
} ;
PODServiceProvider.prototype.flush = function()
{
} ;
PODServiceProvider.prototype.getImageUrl = function()
{
  return this.imageUrl ;
} ;
PODServiceProvider.prototype.setCurrent = function ( url )
{
  this.current = url ;
} ;
PODServiceProvider.prototype.getTitle = function()
{
  return this.title ;
} ;
PODServiceProvider.prototype.setTitle = function ( title )
{
  this.title = title ;
} ;
PODServiceProvider.prototype.getDate = function()
{
  return this.date ;
} ;
PODServiceProvider.prototype.setDate = function ( date )
{
  this.date = date ;
} ;
PODServiceProvider.prototype.getNext = function()
{
  return this.next ;
} ;
PODServiceProvider.prototype.getPrevious = function()
{
  return this.previous ;
} ;
PODServiceProvider.prototype.getWallpaper = function()
{
  return this.wallpaper ;
} ;
PODServiceProvider.prototype.getDescription = function()
{
  return this.description ;
} ;
PODServiceProvider.prototype.execute = function(url)
{
} ;
PODServiceProvider.prototype.findHREF = function ( t, tag, start )
{
  return this._findUrlAttribute ( t, tag, start, "href" ) ;
} ;
PODServiceProvider.prototype.findSRC = function ( t, tag, start )
{
  return this._findUrlAttribute ( t, tag, start, "src" ) ;
} ;
PODServiceProvider.prototype._findUrlAttribute = function ( t, tag, start, attr )
{
  if ( typeof ( start ) != 'number' ) start = 0 ;
  var pos0 = t.indexOf ( tag, start ) ;
  if ( pos0 < 0 ) return null ;
  pos0 = t.indexOf ( attr + "=", pos0 ) ;
  if ( pos0 < 0 ) return null ;
  pos0 = t.indexOf ( '"', pos0 ) + 1 ;
  var pos1 = t.indexOf ( '"', pos0 ) ;
  var str = t.substring ( pos0, pos1 ) ;
  if ( str.indexOf ( "http" ) !== 0 ) return this.baseurl + str ;
  return str ;
} ;

PictureOfTheDay = function ( container )
{
  this.jsClassName = "PictureOfTheDay" ;
  this.container = container ;
  this.TEXT = container.getComponent ( "TEXT" ) ;
  this.IC = container.getPeer ( "IC" ) ;
  this.pbPrevious = container.getComponent ( "PB.PREVIOUS" ) ;
  this.pbPrevious.addEventListener ( "click", this, this.showPrevious ) ;
  this.pbNext = container.getComponent ( "PB.NEXT" ) ;
  this.pbNext.addEventListener ( "click", this, this.showNext ) ;
  this.pbWallpaper = container.getComponent ( "PB.WALLPAPER" ) ;
  this.pbWallpaper.addEventListener ( "click", this, this.showWallpaper ) ;
  this.serviceprovider = null ;
  this.next = null ;
  this.previous = null ;
  this.wallpaper = null ;
  this.imageUrl = null ;
} ;
PictureOfTheDay.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
} ;
PictureOfTheDay.prototype.flush = function()
{
} ;
PictureOfTheDay.prototype.setServiceProvider = function ( sp )
{
  this.serviceprovider = sp ;
  this.serviceprovider.reset() ;
  this.serviceprovider.execute() ;
  this.show() ;
} ;
PictureOfTheDay.prototype.show = function()
{
  var vals = new TXml() ;
  vals.add ( "title", this.serviceprovider.getTitle() ) ;
  vals.add ( "date", this.serviceprovider.getDate() ) ;
  vals.add ( "provider_title", this.serviceprovider.getProviderTitle() ) ;
  this.container.setValues ( vals ) ;

  this.next = this.serviceprovider.getNext() ;
  this.previous = this.serviceprovider.getPrevious() ;
  this.wallpaper = this.serviceprovider.getWallpaper() ;
  this.imageUrl = this.serviceprovider.getImageUrl() ;

  if ( this.next ) this.pbNext.setVisible ( true ) ;
  else             this.pbNext.setVisible ( false ) ;
  if ( this.previous ) this.pbPrevious.setVisible ( true ) ;
  else                 this.pbPrevious.setVisible ( false ) ;
  this.IC.setImage ( this.imageUrl, false ) ;
  this.TEXT.setText ( "<span>" + this.serviceprovider.getDescription() + "</span>" ) ;
};
PictureOfTheDay.prototype.showPrevious = function ( event )
{
  if ( this.previous )
  {
    this.serviceprovider.setCurrent(this.previous) ;
    this.serviceprovider.execute() ;
    this.show() ;
  }
} ;
PictureOfTheDay.prototype.showNext = function ( event )
{
  if ( this.next )
  {
    this.serviceprovider.setCurrent(this.next) ;
    this.serviceprovider.execute() ;
    this.show() ;
  }
} ;
PictureOfTheDay.prototype.showWallpaper = function ( event )
{
  if ( this.wallpaper )
  {
    window.open ( this.wallpaper ) ;
  }
} ;
/**
 *  @constructor
 */
www_timeanddate_com = function()
{
};
www_timeanddate_com.prototype.searchCity = function ( q )
{
log ( "q=" + q ) ;
  var xResult = new TXml() ;
  var xTab  = xResult.add ( "table.result" ) ;
  q = encodeURIComponent ( q ) ;
  var url = "http://www.timeanddate.com/worldclock/results.html?query=" + q ;
  var u = new URLProxy ( url ) ;
  var t = u.getText() ;
log ( url ) ;
// log ( t ) ;
  var n ;
  var xRow ;

  if ( t.indexOf  ( 'Results of Search' ) < 0 )
  {
log ( "1 ---------------------------" ) ;
    xRow = xTab.add ( "row" ) ;
    var pos0 = t.indexOf ( "/city.html?n=" ) ;
    pos0 += "/city.html?n=".length ;
    var pos1 = t.indexOf ( "\"", pos0 ) ;
    n = t.substring ( pos0, pos1 ) ;
    pos0 = t.indexOf ( "class=biggest>" ) ;
    pos0 = t.indexOf ( ">", pos0 ) + 1 ;
    pos1 = t.indexOf ( ",", pos0 ) ;
    var city  = t.substring  ( pos0, pos1 ) ;
    xRow.add ( "dnam", city ) ;
    xRow.add ( "number", n ) ;
  }
  else
  if ( t.indexOf  ( "\"/worldclock/city.html?n=" ) > 0 )
  {
log ( "2 ---------------------------" ) ;
    var pos = 0 ;
    pos = t.indexOf ( "\"/worldclock/city.html?n=", pos ) ;
    var i = 0 ;
    while ( pos > 0 )
    {
      i++ ;
      if ( i > 5 ) break ;
      xRow = xTab.add ( "row" ) ;
      var p0 = t.indexOf ( "=", pos ) + 1 ;
      var p1 = t.indexOf ( "\"", p0 ) ;
      n = t.substring ( p0, p1 ) ;
      p0 = t.indexOf ( ">", pos ) + 1 ;
      p1 = t.indexOf ( "<", p0 ) ;
      var str = t.substring ( p0, p1 ) ;
      xRow.add ( "dnam", str ) ;
      xRow.add ( "number", n ) ;
      pos = t.indexOf ( "\"/worldclock/city.html?n=", p1 ) ;
    }
  }
log ( "3 ---------------------------" ) ;
  return xResult ;
} ;
www_timeanddate_com.prototype.getParameter = function ( n )
{
  var str ;
  var pos0 = 0 ;
  var pos1 = 0 ;
  var url2 = "https://www.timeanddate.com/worldclock/city.html?n=" + n ;
  var u = new URLProxy ( url2 ) ;
  var t = u.getText() ;

  pos0 = t.indexOf ( "span id=ct " ) ;
  pos0 = t.indexOf ( ">", pos0 ) ;
  pos1 = t.indexOf ( "<", pos0 ) ;
  str = t.substring ( pos0+1, pos1  ) ;

  var t0 = str.indexOf ( ":" ) ;
  t0 -= 4 ;
  t0 = str.indexOf ( " ", t0 ) + 1 ;
  var t1 = str.lastIndexOf ( ":" ) ;
  str = str.substring ( t0, t1 ) ;
  t0 = str.indexOf ( ":" ) ;
  var sh = str.substring  ( 0, t0 ) ;
  if ( sh.charAt ( 0 ) == "0" ) sh = str.substring  ( 1, t0 ) ;
  var h = parseInt ( sh ) ;
  var m = parseInt ( str.substring  ( t0 + 1 ) ) ;
  var d = new Date() ;
  var lh = d.getHours() ;
  var lm = d.getMinutes() ;
  var utch = d.getUTCHours() ;
  var utcm = d.getUTCMinutes() ;

  var p = {} ;
  if ( h <= ( lh - 12 ) )
  {
    p.dHours = h + 24 - lh ;
    p.dUTCHours = h + 24 - utch ;
  }
  else
  {
    p.dHours = h - lh ;
    p.dUTCHours = h - utch ;
  }
  p.zone = p.dUTCHours  ;
  p.cityNumber = n  ;
  p.dMinutes = m - lm ;
  p.dUTCMinutes = m - utcm ;
  pos0 = t.indexOf ( "Lat/Long:" ) ;
  pos0 = t.indexOf ( ">", pos0 ) + 1 ;
  pos0 = t.indexOf ( ">", pos0 ) + 1 ;
  pos1 = t.indexOf ( "<", pos0 ) ;

  var latLon = t.substring ( pos0, pos1 ) ;
  latLon = latLon.replace ( /°/g, " " ).replace ( /\&nbsp;/g, " " ) ;
  var ll = latLon.split("/") ;
  var lat = ll[0].trim() ;
  var lon = ll[1].trim() ;

  var degrees = parseInt  ( lat ) ;
  var seconds = parseInt  ( lat.substring ( lat.indexOf ( " " ) + 1 ) ) ;
  seconds = seconds / 60 ;
  degrees += seconds ;
  p.latitude = degrees.roundTo ( 2 ) ;
  if ( lat.indexOf ( "'S" ) > 0 )
  {
    p.latitude = "-" + p.latitude ;
  }

  degrees = parseInt  ( lon ) ;
  seconds = parseInt  ( lon.substring ( lon.lastIndexOf ( " " ) + 1 ) ) ;

  seconds = seconds / 60 ;
  degrees += seconds ;
  p.longitude = degrees.roundTo ( 2 ) ;
  if ( lon.indexOf ( "'W" ) > 0 )
  {
    p.longitude = "-" + p.longitude ;
  }
  pos0 = t.indexOf ( "class=biggest>" ) ;
  pos0 = t.indexOf ( ">", pos0 ) + 1 ;
  pos1 = t.indexOf ( ",", pos0 ) ;
  p.dnam  = t.substring  ( pos0, pos1 ) ;
// log ( p, true ) ;
  return p ;
} ;
