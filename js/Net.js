/**
 *  Global singleton <b>Net</b>
 *  @constructor
 */
//"use strict" ;
var NetClass = function()
{
  this.myIpAddress = null ;
};
NetClass.prototype =
{
  getGeoLocationPosition: function ( callback, /* optional */ ipOrHostName )
  {
    var net = new NetClass() ;
    net.callback = callback ;
    net.ipOrHostName = ipOrHostName ;
    net._getGeoLocationPosition() ;
  },
  _getGeoLocationPosition: function()
  {
    if ( ! this.ipOrHostName && navigator.geolocation )
    {
      var thiz = this ;
      navigator.geolocation.getCurrentPosition
      (
        function(position)
        {
          thiz.callback ( position ) ;
        },
        function ( positionError )
        {
          thiz.callback ( thiz._getByUtrace ( thiz.ipOrHostName ) ) ;
/*
log ( "positionError.code: " + positionError.code ) ;
log ( "positionError.POSITION_UNAVAILABLE: " + positionError.POSITION_UNAVAILABLE ) ;
log ( "positionError.TIMEOUT: " + positionError.TIMEOUT ) ;
log ( "positionError.PERMISSION_DENIED: " + positionError.PERMISSION_DENIED ) ;
log ( "positionError.UNKNOWN_ERROR: " + positionError.UNKNOWN_ERROR ) ;
log ( "noLocation navigator.geolocation" ) ;
*/
        }
      ) ;
      return ;
    }
    this.callback ( this._getByUtrace ( this.ipOrHostName ) ) ;
  },
  _getByUtrace: function ( ipOrHostName )
  {
    if ( ! this.ipOrHostName ) this.ipOrHostName = this.whatIsMyIpAddress() ;

    var xutrace = this._utrace ( this.ipOrHostName ) ;

    var p = {} ;
    p.coords = {} ;
    p.address = {} ;
    p.coords.latitude = xutrace.getContent ( "latitude" ) ;
    p.coords.longitude = xutrace.getContent ( "longitude" ) ;
    p.address.city = xutrace.getContent ( "region" ) ;
    if ( ! p.coords.longitude ) p.code = 1 ;
    return p ;
  },
  whatIsMyIpAddress: function()
  {
    var u = new URLProxy ( "http://www.whatismyip.com/automation/n09230945.asp" ) ;
    var s = u.getText() ;
    return s ;
  },
  _utrace: function ( name )
  {
    var url = "http://xml.utrace.de/?query=" + name ;
    var u = new URLProxy ( url ) ;
    var x = u.getXml() ;
    return x.get ( "Content/results/result" ) ;
  },
  hostNameToIpAddress: function ( name )
  {
    var nn = parseInt ( name ) ;
    if ( ! isNaN ( nn ) )
    {
      return n ;
    }
    var xutrace = this._utrace ( name ) ;
    if ( xutrace.isEmpty() )
    {
      return ;
    }
    var ip = xutrace.getContent ( "ip" ) ;
    var host = xutrace.getContent ( "host" ) ;
    return ip ;
  }
};
var Net = new NetClass() ;
/**
 *  @constructor
 */
var URLProxy = function ( url )
{
  if ( ! url ) return ;
  this.jsClassName = 'URLProxy' ;
  this.url = url ;
  this.nsAlias = [] ;
  this.nsName = [] ;
  this.headers = null ;
};
URLProxy.prototype.setPostContent = function ( postContent )
{
  if ( ! postContent ) postContent = "" ;
  this.postContent = postContent ;
  this.requestMethod = "POST" ;
};
URLProxy.prototype.getHeaders = function()
{
  return this.headers ;
};
URLProxy.prototype.getUrl = function()
{
  if ( TSys.getWebConfig().getBool ( "USE-HTTPGW" ) )
  {
    return "CoDataFactory"+"?coAction=URLProxy" ;
  }
  return TSys.getDataFactoryUrl()+"&action=URLProxy" ;
};
URLProxy.prototype.getText = function ( obj, method )
{
  var url = this.getUrl() ;
  var xml = "<xml>"
          + "<Type>text</Type>"
          + "<Mode>xml</Mode>"
          + "<RequestMethod>" + this.requestMethod + "</RequestMethod>"
          + ( this.requestMethod == "POST" ? "<PostContent><![CDATA[" + this.postContent + "]]></PostContent>" : "" )
          + "<Url>" + this.url + "</Url>"
          + "</xml>"
          ;
  var HTTP ;
  if ( obj )
  {
    var thiz = this ;
    HTTP = TSys.httpPost ( url, xml, function ( HTTP )
    {
      var fe = new TFunctionExecutor ( obj, method ) ;
      var xResult = new TXml ( HTTP.responseXML.documentElement ) ;
      thiz.headers = xResult.getXml ( "Headers" ) ;
      fe.execute ( xResult.getContent ( "Content" ) ) ;
    } ) ;
  }
  else
  {
    HTTP = TSys.httpPost ( url, xml ) ;
    if ( HTTP.status != 200 )
    {
      TSys.throwHttpStatusException ( HTTP ) ;
    }
    var xResult = new TXml ( HTTP.responseXML.documentElement ) ;
    this.headers = xResult.getXml ( "Headers" ) ;
    return xResult.getContent ( "Content" ) ;
  }
};
URLProxy.prototype.getXml = function ( obj, method )
{
  var url = this.getUrl() ;
  var xml = "<xml>"
          + "<Type>xml</Type>"
          + "<RequestMethod>" + this.requestMethod + "</RequestMethod>"
          + ( this.requestMethod == "POST" ? "<PostContent>" + this.postContent + "</PostContent>" : "" )
          + "<Url>" + this.url + "</Url>"
          + "</xml>"
          ;
  var HTTP = TSys.httpPost ( url, xml, obj, method ) ;
  if ( ! obj && ! method )
  {
    if ( HTTP.status != 200 )
    {
      TSys.throwHttpStatusException ( HTTP ) ;
    }
    return new TXml ( HTTP.responseXML.documentElement ) ;
  }
};
/**
 *  @constructor
 */
var INet = function ( url )
{
  Tango.initSuper ( this, URLProxy, url ) ;
  this.jsClassName = 'INet' ;
};
INet.inherits( URLProxy ) ;
INet.prototype.whois = function ( ip, obj, method )
{
  var url = this.getUrl() ;
  var xml = "<xml>"
          + "<Type>inet</Type>"
          + "<Cmd>whois</Cmd>"
          + "<Ip>" + ip + "</Ip>"
          + "</xml>"
          ;
  if ( obj )
  {
    TSys.httpPost ( url, xml, function ( HTTP )
    {
      var xResult = new TXml ( HTTP.responseXML.documentElement ) ;
      var content = xResult.getContent  ( "Content" ) ;
      if ( method )
      {
        method.call ( obj, content ) ;
      }
      else
      {
        obj ( content ) ; 
      }
    } ) ;
    return ;
  }
  var HTTP = TSys.httpPost ( url, xml, obj, method ) ;
  if ( ! obj && ! method )
  {
    if ( HTTP.status != 200 )
    {
      TSys.throwHttpStatusException ( HTTP ) ;
    }
    return new TXml ( HTTP.responseXML.documentElement ) ;
  }
};

/**
 *  @constructor
 */
var SoapClient = function ( url )
{
  Tango.initSuper ( this, URLProxy, url );
  this.jsClassName = 'SoapClient' ;
};
SoapClient.inherits( URLProxy ) ;
SoapClient.prototype.addNameSpace = function ( alias, name )
{
  this.nsAlias.push ( alias ) ;
  this.nsName.push ( name ) ;
};
SoapClient.prototype.execute = function ( xmlOperation )
{
  var url = this.getUrl() ;
  var xml = "<xml>" ;
      xml += "<Type>soap</Type>" ;
      xml += "<Url>" + this.url + "</Url>" ;
      xml += "<NameSpaces>" ;
      for ( var i = 0 ; i < this.nsAlias.length ; i++ )
      {
        xml += "<Item alias='" + this.nsAlias[i] + "' name='" + this.nsName[i] + "' />" ;
      }
      xml += "</NameSpaces>" ;
      xml += "<Operation>" + xmlOperation + "</Operation>" ;
      xml += "</xml>" ;

  var HTTP = TSys.httpPost ( url, xml, null );
  if ( HTTP.status != 200 )
  {
    TSys.throwHttpStatusException ( HTTP ) ;
  }
  return new TXml ( HTTP.responseXML.documentElement ) ;
};
