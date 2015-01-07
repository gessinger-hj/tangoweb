ISDPConstants =
{
  ATTRIBUTES_KEY: "ATTRIBUTES"
}
/**
 *  @constructor
 */
ISDPPublisherClass = function ( userName )
{
  this.jsClassName = "ISDPPublisherClass" ;
  this.ISDP_HOST = undefined ;
  this.ISDP_PORT = undefined ;
  this.setUserName ( userName ) ;
  this.target = "" ;
  this.errorCallback = null ;
}
ISDPPublisherClass.prototype.setTarget = function ( target )
{
  this.target = target ;
}
ISDPPublisherClass.prototype.setUserName = function ( userName )
{
  this.userName = userName ? userName : "" ;
}
ISDPPublisherClass.prototype.getUserName = function()
{
  return this.userName ;
}
ISDPPublisherClass.prototype.toString = function()
{
  return "(" + this.jsClassName + ")[ISDP_PORT=" + this.ISDP_PORT + ",ISDP_HOST=" + this.ISDP_HOST + "]" ;
}
ISDPPublisherClass.prototype._prepareMessage = function ( operation, xmlBody )
{
  var msg = new CoMessage ( this.target + ":" + operation ) ; 
  if ( typeof ( this.ISDP_HOST ) == 'undefined' )
  {
    this.ISDP_HOST = TSys.getWebConfig().getValue ( "ISDP_HOST" ) ;
  }
  if ( typeof ( this.ISDP_PORT ) == 'undefined' )
  {
    this.ISDP_PORT = TSys.getWebConfig().getValue ( "ISDP_PORT" ) ;
  }
  msg.setHost ( this.ISDP_HOST ) ;
  msg.setPort ( this.ISDP_PORT ) ;

  var reqId = TSys.getTempId() ;
  var dateTimeValue = DateUtils.formatDate ( new Date(), 'yyyy-MM-ddTHH:mm:ss' ) ;

  msg.xmlDataTransparent = true ;
  var nv = "<" + ISDPConstants.ATTRIBUTES_KEY + " type='values' >\n"
	 + "<A>nnnn</A>\n"
         + "<REQUEST_ID>" + reqId + "</REQUEST_ID>\n"
         + "<REQUEST_STATUS>NEW</REQUEST_STATUS>\n"
         + "<REQUEST_TYPE>" + operation + "</REQUEST_TYPE>\n"
         + "</" + ISDPConstants.ATTRIBUTES_KEY + ">\n"
	 ;
  msg.addNamedVariable ( nv ) ;

  msg.setXmlData ( "<" + operation + " time='" + dateTimeValue + "'>\n"
                 + "  <requestId>" + reqId + "</requestId>\n"
                 + "  <userName>" + this.userName + "</userName>\n"
                 + xmlBody
                 + "</" + operation + ">\n"
                 ) ;
  return msg ;
} ;
ISDPPublisherClass.prototype.setErrorCallback = function ( errorCallback )
{
  this.errorCallback = errorCallback ;
} ;
ISDPPublisherClass.prototype.executeOperation = function ( operation, xmlBody, callback, errorCallback )
{
  if ( TSys.getWebConfig().getBool ( "AuditLog", true ) )
  {
    try
    {
      var auditEvent = new AuditEvent() ;
      auditEvent.setAction ( this.userName + "::" + this.target + ":" + operation ) ;
      auditEvent.setText ( xmlBody ) ;
      NetResource.auditlog ( auditEvent ) ;
    }
    catch ( exc)
    {
      TSys.log ( exc ) ;
    }
  }
  if ( ! errorCallback ) errorCallback = this.errorCallback ;
  var msg = this._prepareMessage ( operation, xmlBody ) ;
  var x = Calypso.getXml ( msg, callback, null, errorCallback ) ;
  if ( ! x ) return ;
  if ( callback ) return ;
  var xResponse = x.getXml ( operation + "Response" ) ;
  if ( ! xResponse )
  {
    var en = x.elements()
    while ( en.hasNext() )
    {
      var e = en.nextXml() ;
      if ( e.getBoolAttribute ( "msg-xml", false ) )
      {
        xResponse = e ;
        break ;
      }
    }
  }
  var status = x.getContent ( "status" ) ;
  return xResponse ;
} ;
ISDPPublisherClass.prototype.downloadDocument = function ( operation, xmlBody, callback )
{
  if ( TSys.getWebConfig().getBool ( "AuditLog", true ) )
  {
    try
    {
      var auditEvent = new AuditEvent() ;
      auditEvent.setAction ( this.userName + "::" + this.target + ":" + operation ) ;
      auditEvent.setText ( xmlBody ) ;
      NetResource.auditlog ( auditEvent ) ;
    }
    catch ( exc)
    {
      TSys.log ( exc ) ;
    }
  }
  var msg = this._prepareMessage ( operation, xmlBody ) ;
  msg.setReturnDocumentFromNamedVariables ( "ATTRIBUTES", "DOCUMENT" ) ;
  Calypso.downloadDocument ( msg, callback ) ;
} ;
ISDPPublisher = new ISDPPublisherClass() ;
