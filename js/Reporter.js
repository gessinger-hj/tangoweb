Tango.include ( "Calypso" ) ;
/**
 *  @constructor
 */
Reporter = function()
{
  this.REPORTER_HOST = undefined ;
  this.REPORTER_PORT = undefined ;
};
Reporter.prototype = 
{
  _initializeConnectionParameter: function()
  {
    if ( typeof ( this.REPORTER_NAMESPACE ) == 'undefined' )
    {
      this.REPORTER_NAMESPACE = TSys.getWebConfig().getValue ( "REPORTER_NAMESPACE" ) ;
    }
    if ( typeof ( this.REPORTER_HOST ) == 'undefined' )
    {
      this.REPORTER_HOST = TSys.getWebConfig().getValue ( "REPORTER_HOST" ) ;
    }
    if ( typeof ( this.REPORTER_PORT ) == 'undefined' )
    {
      this.REPORTER_PORT = TSys.getWebConfig().getValue ( "REPORTER_PORT" ) ;
    }
  },
  setNameSpace: function ( nameSpace )
  {
    this.REPORTER_NAMESPACE = nameSpace ;
  },
  getReport: function ( name, xValues, format )
  {
    if ( ! format ) format = "html" ;
    format = format.toLowerCase() ;
    this._initializeConnectionParameter() ;
    var msg = new CoMessage ( "REPORTER.REQUEST" ) ;
    msg.setNameSpace ( this.REPORTER_NAMESPACE ) ;
    msg.setHost ( this.REPORTER_HOST ) ;
    msg.setPort ( this.REPORTER_PORT ) ;
    if ( xValues ) xValues.setName ( "Values" ) ;
    else xValues = "" ;
    msg.setXmlData ( 
                "<REPORTER.REQUEST>\n"
               + "<Operation>GetReport</Operation>\n"
               + "<Name>" + name + "</Name>\n"
               + "<Format>" + format + "</Format>\n"
               + "<SaveToFile>false</SaveToFile>\n"
               + "<Download>false</Download>\n"
               + xValues
               + "</REPORTER.REQUEST>\n"
               ) ;
    var xResult = Calypso.getXml ( msg ) ;
    if ( format == 'html' )
    {
      return xResult.getContent ( "REPORTER.RESULT/Html" ) ;
    }
    return xResult ;
  },
  downloadReport: function ( name, xValues, format )
  {
    if ( ! format ) format = "pdf" ;
    format = format.toLowerCase() ;
    this._initializeConnectionParameter() ;
    var msg = new CoMessage ( "REPORTER.REQUEST" ) ;
    msg.setNameSpace ( this.REPORTER_NAMESPACE ) ;
    msg.setHost ( this.REPORTER_HOST ) ;
    msg.setPort ( this.REPORTER_PORT ) ;

    if ( xValues ) xValues.setName ( "Values" ) ;
    else xValues = "" ;
    msg.setXmlData ( 
                "<REPORTER.REQUEST>\n"
               + "<Operation>GetReport</Operation>\n"
               + "<Name>" + name + "</Name>\n"
               + "<Format>" + format + "</Format>\n"
               + "<SaveToFile>false</SaveToFile>\n"
               + "<Download>true</Download>\n"
               + xValues
               + "</REPORTER.REQUEST>\n"
               ) ;
    Calypso.downloadDocument ( msg, format ) ;
  },
  getAxl: function ( context, reportName )
  {
    if ( ! context ) context = "TVN" ;
    var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
    var dbv = new CoDbv ( msg ) ;
    var Q = dbv.addQuery ( "ACT_REPORT", [ "REPORT_NAME", "DESCRIPTION", "AXL" ]
                         , "REPORT_NAME='" + reportName + "' and CONTEXT='" + context + "' and axl is not null"
                         ) ;
    dbv = Calypso.getDbv ( msg ) ;
    var xResult = dbv.getResultXml() ;
    return xResult.getXml ( "ACT_REPORT/row" ) ;
  },
  getAxlList: function ( context )
  {
    if ( ! context ) context = "TVN" ;
    var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
    var dbv = new CoDbv ( msg ) ;
    var Q = dbv.addQuery ( "ACT_REPORT", [ "REPORT_NAME", "DESCRIPTION", "AXL" ]
                         , "CONTEXT='" + context + "' and axl is not null"
                         ) ;
    dbv = Calypso.getDbv ( msg ) ;
    return dbv.getResultXml() ;
  },
  showDialog: function ( reportName, axlBody, windowTitle )
  {
    if ( ! windowTitle ) windowTitle = reportName ;
    var windowId = "WINDOW.ID." + reportName ;
    var w = TGui.getWindow ( windowId ) ;
    if ( w ) return ;

    var dom = null ;
    if ( typeof ( axlBody ) == 'string' )
    {
      var xDocument = TSys.parseDom ( axlBody ) ;
      dom = new TXml ( xDocument ).getDom() ;
    }
    else
    if ( typeof ( axlBody ) == 'object' )
    {
      if ( axlBody.jsClassName == 'TXml' )
      {
        dom = axlBody.domRoot ;
      }
      else
      {
        dom = axlBody ;
      }
    }
    var xDom = new TXml ( dom ) ;
    var str = xDom.getContent ( "Title" ) ;
    if ( str ) windowTitle = str ;
    xDom.addAttribute ( "bottom", "-0" ) ;
    xDom.addAttribute ( "bottomAttachComponent", "true" ) ;
    xDom.addAttribute ( "right", "-0" ) ;
    var xName = xDom.addXml ( "Hidden" ) ;
    xName.addAttribute ( "name", "REPORT_NAME" ) ;
    xName.addAttribute ( "value", reportName ) ;
    w = new TWindow ( "TDialog.Reporter" ) ;
    w.setId ( windowId ) ;
    w.setTitle ( windowTitle ) ;
    w.create() ;
    var formTop = w.getElementByName ( "Form.Top" ) ;
    TGui.setAxl ( formTop, dom ) ;
    var pbApply = w.getElementByName ( "PB.APPLY" ) ;
    TGui.addEventListener ( pbApply, "click", this.buttonCreateReport.bindAsEventListener ( this, reportName ) ) ;
    w.show() ;
  },
  buttonCreateReport: function ( event, reportName )
  {
    var ev = new TEvent ( event ) ;
    var w = ev.getWindow() ;
    var xValues = ev.getValues() ;
    var format = xValues.getContent ( "FORMAT", "pdf" ) ;
    if ( ! reportName ) reportName = xValues.getContent ( "REPORT_NAME" ) ;
    this.downloadReport ( reportName, xValues, format ) ;
  }
} ;
