/**
 *  @constructor
 *  @extends TUploadWindow
 */
var ISDPUploadWindow = function ( operation, xmlBody )
{
  Tango.initSuper ( this, TUploadWindow, null );
  this.jsClassName = "ISDPUploadWindow" ;
  this.operation = operation ;
  this.xmlBody = xmlBody ? xmlBody : "" ;
}
ISDPUploadWindow.inherits( TUploadWindow ) ;
ISDPUploadWindow.prototype.create = function()
{
  var reqId = TSys.getTempId() ;
  var xData = "<Data>\n"
            + "<" + this.operation + ">\n"
            + this.xmlBody
            + "</" + this.operation + ">\n"
            + "</Data>\n"
            ;
  var xNamedVariables = "<NamedVariables>\n"
         + "<ATTRIBUTES>\n"
         + "<REQUEST_ID>" + reqId + "</REQUEST_ID>\n"
         + "<REQUEST_STATUS>NEW</REQUEST_STATUS>\n"
         + "<REQUEST_TYPE>" + this.operation + "</REQUEST_TYPE>\n"
         + "</ATTRIBUTES>\n"
         + "</NamedVariables>\n"
  ;
  var xControl = "<Control>\n"
               + "<DataNamedVariablesName>ATTRIBUTES</DataNamedVariablesName>\n"
               + "</Control>\n"
               ;
  var msgXmlData = "<xml multipart=\"true\">"
                 + xData
                 + xNamedVariables
                 + xControl
                 + "</xml>"
                 ;

  this.setMsgXmlData ( msgXmlData ) ;
  TUploadWindow.prototype.create.apply ( this, arguments ) ;
}
