/**
 *  @constructor
 */
ReportApi = function()
{
  this.jsClassName = "ReportApi" ;
};
ReportApi.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
};
ReportApi.prototype.getDB = function()
{
  if ( this._db ) return this._db ;
  this._db = new DatabaseClass() ;

  this.nameSpace = TSys.getWebConfig().getValue ( "REPORTER_NAMESPACE" ) ;
  if ( ! this.nameSpace ) this.nameSpace = "" ; 
  this.host = TSys.getWebConfig().getValue ( "REPORTER_HOST" ) ;
  this.port = TSys.getWebConfig().getValue ( "REPORTER_PORT" ) ;

  this._db.setNameSpace ( this.nameSpace ) ;
  this._db.setHost ( this.host ) ;
  this._db.setPort ( this.port ) ;

  return this._db ;
};
ReportApi.prototype.setNameSpace = function ( nameSpace )
{
  if ( ! this._db )
  {
    this.getDB() ;
  }
  if ( this.nameSpace != nameSpace )
  {
    this.nameSpace = nameSpace ;
    this._db.setNameSpace ( this.nameSpace ) ;
  }
};
ReportApi.prototype.getNameSpace = function()
{
  if ( ! this._db ) this.getDB() ;
  return this.nameSpace ;
};
ReportApi.prototype._createDbRequestMessage = function()
{
  if ( typeof ( this.nameSpace ) == 'undefined' )
  {
    this.nameSpace = TSys.getWebConfig().getValue ( "REPORTER_NAMESPACE" ) ;
    if ( ! this.nameSpace ) this.nameSpace = "" ; 
    this.host = TSys.getWebConfig().getValue ( "REPORTER_HOST" ) ;
    this.port = TSys.getWebConfig().getValue ( "REPORTER_PORT" ) ;
  }
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setHost ( this.host ) ;
  msg.setPort ( this.port ) ;
  return msg ;
};
ReportApi.prototype.getReportStatements = function ( REPORT_ID )
{
  var sql = "select"
          + "  a.REPORT_STMT_ID"
          + ", a.ROOT_TAG"
          + ", a.LAST_MODIFIED"
          + ", a.CREDENTIAL_ID"
          + ", a.DESCRIPTION"
          + ", a.TYPE"
          + ", a.CONTEXT"
          + ", a.PARENT_STMT_ID"
          + ", b.POSITION"
//          + ", DEFINITION"
          + "  from ACT_REPORT_STMT a, ACT_REPORT_TO_STMT b"
	  + " where b.REPORT_ID=" + REPORT_ID
	  + "   and a.REPORT_STMT_ID=b.REPORT_STMT_ID"
	  + " order by b.POSITION"
          ;
  var x = this.getDB().select ( "ACT_REPORT_STMT", sql ) ;
  return x ;
};
ReportApi.prototype.getReportStatementDetails = function ( REPORT_STMT_ID )
{
  var sql = "select"
          + "  a.REPORT_STMT_ID"
          + ", a.ROOT_TAG"
          + ", a.LAST_MODIFIED"
          + ", a.CREDENTIAL_ID"
          + ", a.DESCRIPTION"
          + ", a.TYPE"
          + ", a.CONTEXT"
          + ", a.PARENT_STMT_ID"
          + ", b.POSITION"
//          + ", DEFINITION"
          + "  from ACT_REPORT_STMT a, ACT_REPORT_TO_STMT b"
	  + " where a.REPORT_STMT_ID=" + REPORT_STMT_ID
	  + "   and a.REPORT_STMT_ID=b.REPORT_STMT_ID"
          ;
  return this.getDB().select ( "ACT_REPORT_STMT", sql ) ;
};
ReportApi.prototype.getReportStatementDefinition = function ( REPORT_STMT_ID )
{
  var sql = "select"
          + "  DEFINITION"
          + "  from ACT_REPORT_STMT a"
	  + " where a.REPORT_STMT_ID=" + REPORT_STMT_ID
          ;
  return this.getDB().select ( "ACT_REPORT_STMT", sql ) ;
};
ReportApi.prototype._searchReport = function ( xValues )
{
  var REPORT_NAME = xValues.getContent ( "REPORT_NAME" ) ;
  if ( ! REPORT_NAME ) REPORT_NAME = '%' ;
  REPORT_NAME = REPORT_NAME.replace ( /\*/g, "%" ) ;
  var where = "" ;
  if ( REPORT_NAME.indexOf ( '%' ) < 0 ) REPORT_NAME = "%" + REPORT_NAME + "%" ;
  if ( REPORT_NAME.indexOf ( '%' ) >= 0 ) where = " UPPER(REPORT_NAME) like '" + REPORT_NAME.toUpperCase() + "'" ;
  else where = " REPORT_NAME='" + REPORT_NAME + "'" ;
  var x = this.getDB().query ( "ACT_REPORT"
  , [ 
    "REPORT_ID"
  , "REPORT_NAME"
  , "DESCRIPTION"
  , "ROOT_TAG"
  , "CONTEXT"
  , "CREDENTIAL_ID"
  , "START_DATE"
  , "END_DATE"
  , "LAST_EXECUTED"
  , "LAST_MODIFIED"
  , "FILE_NAME"
  , "DOC_TYPE_NAME"
  , "LOOP_VAR_NAME"
//  , "LOOP_DEFINITION"
  , "DEFAULT_FORMAT"
  , "CSV_DELIMITER"
  , "CSV_SEPARATOR"
//  , "AXL"
//  , "FIX_HEADER_RECORD"
  ]
  , where
  ) ;
  return x ;
};
ReportApi.prototype.getReport = function ( REPORT_ID )
{
  var x = this.getDB().query ( "ACT_REPORT"
  , [ 
    "REPORT_ID"
  , "REPORT_NAME"
  , "DESCRIPTION"
  , "ROOT_TAG"
  , "CONTEXT"
  , "CREDENTIAL_ID"
  , "START_DATE"
  , "END_DATE"
  , "LAST_EXECUTED"
  , "LAST_MODIFIED"
  , "FILE_NAME"
  , "DOC_TYPE_NAME"
  , "LOOP_VAR_NAME"
//  , "LOOP_DEFINITION"
  , "DEFAULT_FORMAT"
  , "CSV_DELIMITER"
  , "CSV_SEPARATOR"
//  , "AXL"
//  , "FIX_HEADER_RECORD"
  ]
  , "REPORT_ID=" + REPORT_ID
  ) ;
  if ( ! x ) return x ;
  x = x.getXml ( "ACT_REPORT/row" ) ;
  return x ;
};
ReportApi.prototype.testCronExpression = function ( CRON_EXPRESSION )
{
  var msg = new CoMessage ( "REPORTER.REQUEST" ) ;
  msg.setHost ( this.host ) ;
  msg.setPort ( this.port ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  var xData = new TXml ( "REPORTER.REQUEST" ) ;
  xData.add ( "Operation", "TestCronExpression" ) ;
  xData.add ( "CRON_EXPRESSION", CRON_EXPRESSION ) ;
  msg.setXmlData ( "" + xData ) ;
  var x = Calypso.getXml ( msg ) ;
  return x.get ( "REPORTER.RESULT" ) ;
} ;
ReportApi.prototype.testCredential = function ( DBURL, DBUID, DBPWD )
{
  var msg = new CoMessage ( "REPORTER.REQUEST" ) ;
  msg.setHost ( this.host ) ;
  msg.setPort ( this.port ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  var xData = new TXml ( "REPORTER.REQUEST" ) ;
  xData.add ( "Operation", "TestCredential" ) ;
  xData.add ( "DBURL", DBURL ) ;
  xData.add ( "DBUID", DBUID ) ;
  xData.add ( "DBPWD", DBPWD ) ;
  msg.setXmlData ( "" + xData ) ;
  var x = Calypso.getXml ( msg ) ;
  var ok = x.getBool ( "REPORTER.RESULT/OK", false ) ;
  return ok ;
} ;
ReportApi.prototype.getCredentialsAsRefData = function()
{
  var xCredentials = this.getDB().query ( "ACT_REPORT_CREDENTIALS"
		                        , [ "CREDENTIAL_ID", "DBURL", "DBUID" ]
		                        ) ;
  var xRef = new TXml() ;
  var xC = xRef.add ( "CREDENTIAL_ID" ) ;
  var en = xCredentials.getEnum ( "ACT_REPORT_CREDENTIALS", "row" ) ;
  while ( en.hasNext() )
  {
    var r = en.nextXml() ;
    xOpt = xC.add ( "option", r.getContent ( "DBUID" ) + " / " + r.getContent ( "DBURL" ) ) ;
    xOpt.addAttribute ( "value", r.getContent ( "CREDENTIAL_ID" ) ) ;
  }
  return xRef ;
}
/**
 *  @constructor
 */
ReportEditor = function()
{
  this.jsClassName = "ReportEditor" ;
  this.api = new ReportApi() ;
  this.REPORT_ID = null ;
};
ReportEditor.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
};
ReportEditor.prototype.onload = function ( event )
{
  var c = event.getContainer() ;
  this.cRIGHT = c.getComponent ( "RIGHT" ) ;
  this.cRIGHT_DETAILS = this.cRIGHT.getComponent ( "RIGHT_DETAILS" ) ;
  this.cSearchParameter = c.getComponent ( "SEARCH_PARAMETER" ) ;
  this.searchResultTable = c.getPeer ( "ACT_REPORT" ) ;
  this.reportStatementTable = c.getPeer ( "ACT_REPORT_STMT" ) ;
  this.pbEditReport = c.getComponent ( 'PB.EditReport' ) ;
  this.pbEditVariables = c.getComponent ( 'PB.EditVariables' ) ;
  this.pbExecuteReport = c.getComponent ( 'PB.ExecuteReport' ) ;
  this.reportStatementTable = c.getPeer ( "ACT_REPORT_STMT" ) ;
  this.pbEditStatementDefinition = c.getComponent ( "PB.EditStatementDefinition" ) ;
  this.pbEditStatement = c.getComponent ( "PB.EditStatement" ) ;
  this.pbEditSchedule = c.getComponent ( "PB.EditSchedule" ) ;
  this.pbRemoveStatement = c.getComponent ( "PB.RemoveStatement" ) ;
  this.pbNewStatement = c.getComponent ( "PB.NewStatement" ) ;
  this.chFormat = c.getComponent ( "CH.FORMAT" ) ;
  this.chNameSpace = c.getComponent ( "NameSpace" ) ;
  var xRef = Calypso.getAvailableNameSpaces ( "Reporter*", "NameSpace" ) ;
  c.setRefData ( xRef ) ;
};
ReportEditor.prototype.changeNameSpace = function ( event )
{
  this._resetAll() ;
};
ReportEditor.prototype.getDB = function()
{
  return this.api.getDB() ;
};
ReportEditor.prototype.statementsTableSelected = function ( ev )
{
  this.pbEditStatementDefinition.setEnabled ( true ) ;
  this.pbEditStatement.setEnabled ( true ) ;
  this.pbRemoveStatement.setEnabled ( true ) ;
};
ReportEditor.prototype.statementsTableChanged = function ( ev )
{
  var c = ev.getComponent() ;

  if ( ! c ) return ;
  if ( c.getName() == "PARENT_STMT_ID" )
  {
    var v = this.reportStatementTable.getSelectedUserXml() ;
    var REPORT_STMT_ID = v.getContent ( "REPORT_STMT_ID" ) ;
    var PARENT_STMT_ID = v.getContent ( "PARENT_STMT_ID" ) ;
    var nv = ev.getNewValue() ;
    if ( REPORT_STMT_ID == nv )
    {
      c.select ( PARENT_STMT_ID ) ;
      return ;
    }
    var msg = this.api._createDbRequestMessage() ;
    var dbv = new CoDbv ( msg ) ;

    var U = dbv.addUpdate ( "ACT_REPORT_STMT" ) ;
    U.addKeyColumn ( "REPORT_STMT_ID", REPORT_STMT_ID ) ;
    if ( ! nv )
    {
      U.addNullColumn ( "PARENT_STMT_ID" ) ;
      var e = v.get ( "PARENT_STMT_ID" ) ;
      if ( e ) e.remove() ;
    }
    else
    {
      U.addColumn ( "PARENT_STMT_ID", nv ) ;
      var e = v.ensureXml ( "PARENT_STMT_ID" ) ;
      e.setContent ( nv ) ;
    }
    dbv = Calypso.getDbv ( msg ) ;
  }
};
ReportEditor.prototype.showReport = function ( event )
{
  var v = this.searchResultTable.getSelectedUserXml() ;
  this.cRIGHT.setValues ( v ) ;

  var CREDENTIAL_ID = v.getContent ( "CREDENTIAL_ID" ) ;
  if ( CREDENTIAL_ID )
  {
    var xCredentials = this.getDB().query ( "ACT_REPORT_CREDENTIALS"
		                          , [ "DBURL", "DBUID" ]
		                          , " CREDENTIAL_ID=" + CREDENTIAL_ID
		                          ) ;
    this.cRIGHT.setValues ( xCredentials.get ( "ACT_REPORT_CREDENTIALS/row" ) ) ;
  }

  this.REPORT_ID = v.getContent ( "REPORT_ID" ) ;
  this.fillReportStatementTable ( this.REPORT_ID, null ) ;
  var x = this.getDB().query ( "ACT_REPORT_SCHEDULE"
  , [ 
    "REPORT_ID"
  , "SCHEDULE_ID"
  , "CRON_EXPRESSION"
  ]
  , "REPORT_ID=" + this.REPORT_ID
  ) ;
  var xSchedule = x.get ( "ACT_REPORT_SCHEDULE/row" ) ;
  if ( ! xSchedule )
  {
    xSchedule = new TXml() ;
    xSchedule.add ( "SCHEDULE_ID", "" ) ;
    xSchedule.add ( "CRON_EXPRESSION", "" ) ;
  }
  this.cRIGHT.setValues ( xSchedule ) ;

  this.pbEditReport.setEnabled ( true ) ;
  this.pbEditVariables.setEnabled ( true ) ;
  this.pbExecuteReport.setEnabled ( true ) ;
  this.pbEditStatementDefinition.setEnabled ( false ) ;
  this.pbEditStatement.setEnabled ( false ) ;
  this.pbRemoveStatement.setEnabled ( false ) ;
  this.chFormat.setEnabled ( true ) ;
  this.pbNewStatement.setEnabled ( true ) ;
  this.pbEditSchedule.setEnabled ( true ) ;
  if ( this.reportVariablesEditor )
  {
    this.editVariables() ;
  }
};
function ReportEditor_statementsTableUp ( event )
{
  var ev = new TEvent ( event ) ;
  var elem = ev.getSource() ;
  var p = TGui.findPageletFromElement ( elem, ReportEditor ) ;
  p.statementsTableUp ( event ) ;
}
function ReportEditor_statementsTableDown ( event )
{
  var ev = new TEvent ( event ) ;
  var elem = ev.getSource() ;
  var p = TGui.findPageletFromElement ( elem, ReportEditor ) ;
  p.statementsTableDown ( event ) ;
}
ReportEditor.prototype.statementsTableUp = function (event)
{
  var r = this.reportStatementTable.getSelectedRow() ;
  r.moveUp() ;
  this.statementsTableAdjustPositions() ;
}
ReportEditor.prototype.statementsTableDown = function (event)
{
  var r = this.reportStatementTable.getSelectedRow() ;
  r.moveDown() ;
  this.statementsTableAdjustPositions() ;
}
ReportEditor.prototype.statementsTableAdjustPositions = function (event)
{
  var r = this.reportStatementTable.getFirstRow() ;
  if ( ! r ) return ;
  var POSITION = 0 ;
  var msg = this.api._createDbRequestMessage() ;
  var dbv = new CoDbv ( msg ) ;

  while ( r )
  {
    var U = dbv.addUpdate ( "ACT_REPORT_TO_STMT" ) ;
    var td_POSITION = r.getCellHtmlElement ( "POSITION" ) ;
    td_POSITION.innerHTML = POSITION ;
    var x = r.getXml() ;
    var xPOSITION = x.get ( "POSITION" ) ;
    xPOSITION.setContent ( POSITION ) ;
    var REPORT_STMT_ID = x.getContent ( "REPORT_STMT_ID" ) ;
    U.addKeyColumn ( "REPORT_ID", this.REPORT_ID ) ;
    U.addKeyColumn ( "REPORT_STMT_ID", REPORT_STMT_ID ) ;
    U.addColumn ( "POSITION", POSITION ) ;
    POSITION++ ;
    r = r.getNextSibling() ;
  }
  dbv = Calypso.getDbv ( msg ) ;
} ;
ReportEditor.prototype.fillReportStatementTable = function ( REPORT_ID, REPORT_STMT_ID )
{
  var actionString = ""
//                   + "<img src='" + TGui.buildThemeImageUrl ( "Misc", "edit-remove" ) + "'"
//                   + " style='border-style: none;width:16px;height:16px;'"
//                   + " onmousedown='return false;'"
//                   + " onclick='DBQuery_removeFromColumnsTable(event)'"
//                   + " />"
//                   + "<img src='${home}/arrow_up.gif'"
                   + "<img src='img/arrow_up.gif'"
                   + " style='border-style: none;width:16px;height:16px;'"
                   + " onmousedown='return false;'"
                   + " onclick='ReportEditor_statementsTableUp(event)'"
                   + " />"
//                   + "<img src='${home}/arrow_down.gif'"
                   + "<img src='img/arrow_down.gif'"
                   + " style='border-style: none;width:16px;height:16px;'"
                   + " onmousedown='return false;'"
                   + " onclick='ReportEditor_statementsTableDown(event)'"
                   + " />"
                   ;
  var x = this.api.getReportStatements ( REPORT_ID ) ;
  var en = x.getEnum ( "ACT_REPORT_STMT", "row" ) ;
  var xRefData = new TXml() ;
  var xData = xRefData.add ( "PARENT_STMT_ID" ) ;
  xOpt = xData.add ( "option", "" ) ;
  xOpt.addAttribute ( "value", "" ) ;
  while ( en.hasNext() )
  {
    var r = en.nextXml() ;
    var ID = r.getContent ( "REPORT_STMT_ID" ) ;
    xOpt = xData.add ( "option", r.getContent ( "ROOT_TAG" ) + "(" + ID + ")" ) ;
    xOpt.addAttribute ( "value", ID ) ;
  }
  this.reportStatementTable.clear() ;
  this.reportStatementTable.setRefData ( xRefData ) ;
  this.reportStatementTable.setValues ( x ) ;
  if ( REPORT_STMT_ID )
  {
    var r = this.reportStatementTable.findRow ( "REPORT_STMT_ID", REPORT_STMT_ID ) ;
    if ( r ) r.setSelected ( true, true ) ;
  }
  var en = this.reportStatementTable.rows() ;
  while ( en.hasNext() )
  {
    var TR = en.next() ;
    var TD = TR.firstChild ;
    TD.innerHTML = actionString ;
  }
  this.reportStatementTable.adjustHeader() ;
};
ReportEditor.prototype.searchReport = function ( event )
{
  try
  {
    var ev = new TEvent ( event ) ;
    var v = ev.getValues() ;
    var nameSpace = v.getContent ( "NameSpace" ) ;
    if ( nameSpace == "Default" ) nameSpace = "" ;
    this.api.setNameSpace ( nameSpace ) ;
    this._searchReport() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error() ;
    throw exc ;
  }
};
ReportEditor.prototype._searchReport = function ( REPORT_ID )
{
  var v = this.cSearchParameter.getValues() ;
  var xResult = this.api._searchReport ( v ) ;
  var x = xResult.getXml ( "ACT_REPORT" ) ;
  this.searchResultTable.setData ( x  ) ;
  if ( REPORT_ID )
  {
    var r = this.searchResultTable.findRow ( "REPORT_ID", REPORT_ID ) ;
    r.setSelected ( true ) ;
  }
  this.cRIGHT.reset() ;
  this.pbEditReport.setEnabled ( false ) ;
  this.pbEditVariables.setEnabled ( false ) ;
  this.pbExecuteReport.setEnabled ( false ) ;
  this.pbEditStatementDefinition.setEnabled ( false ) ;
  this.pbEditStatement.setEnabled ( false ) ;
  this.pbRemoveStatement.setEnabled ( false ) ;
  this.chFormat.setEnabled ( false ) ;
  this.pbNewStatement.setEnabled ( false ) ;
  this.pbEditSchedule.setEnabled ( false ) ;
  if ( this.reportVariablesEditor )
  {
    this.reportVariablesEditor.reset() ;
  }
} ;
ReportEditor.prototype._resetAll = function()
{
  this.searchResultTable.clear() ;
  this.cRIGHT.reset() ;
  this.pbEditReport.setEnabled ( false ) ;
  this.pbEditVariables.setEnabled ( false ) ;
  this.pbExecuteReport.setEnabled ( false ) ;
  this.pbEditStatementDefinition.setEnabled ( false ) ;
  this.pbEditStatement.setEnabled ( false ) ;
  this.pbRemoveStatement.setEnabled ( false ) ;
  this.chFormat.setEnabled ( false ) ;
  this.pbNewStatement.setEnabled ( false ) ;
  this.pbEditSchedule.setEnabled ( false ) ;
  if ( this.reportVariablesEditor )
  {
    this.reportVariablesEditor.reset() ;
  }
} ;
ReportEditor.prototype.editReport = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var REPORT_ID = v.getContent ( "REPORT_ID" ) ;
  var w = new TWindow ( "Dialog.EditReport" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  var xRef = this.api.getCredentialsAsRefData() ;
  w.setRefData ( xRef ) ;
  var x = this.api.getReport ( REPORT_ID ) ;
  w.setValues ( x ) ;
  w.show() ;
};
ReportEditor.prototype.editReportSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w = ev.getWindow() ;
  var U = this.getDB().createUpdate ( "ACT_REPORT" ) ;
  var en = v.elements() ;
  var REPORT_ID = v.getContent ( "REPORT_ID" ) ;
  while ( en.hasNext() )
  {
    var x = en.nextXml() ;
    if ( x.getName() == "REPORT_ID" ) U.addKeyColumn ( x.getName(), x.getContent() ) ;
    else                              U.addColumn ( x.getName(), x.getContent() ) ;
  }
  try
  {
    U.execute() ;
    w.closeImediately() ;
    this._searchReport ( REPORT_ID ) ;
    this.showReport() ;
    this.refreshReports() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
};
ReportEditor.prototype.createReport = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w = new TWindow ( "Report.Dialog.Create" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  var xRef = this.api.getCredentialsAsRefData() ;
  w.setRefData ( xRef ) ;
  w.show() ;
};
ReportEditor.prototype.createReportSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w = ev.getWindow() ;

  var x = this.getDB().select ( "select max(REPORT_ID) \"REPORT_ID\" from ACT_REPORT" ) ;
  var REPORT_ID = x.getInt ( "ACT_REPORT/row/REPORT_ID", -1 ) + 1 ;

  var I = this.getDB().createInsert ( "ACT_REPORT" ) ;
  var en = v.elements() ;
  I.addColumn ( "REPORT_ID", REPORT_ID ) ;
  while ( en.hasNext() )
  {
    var x = en.nextXml() ;
    I.addColumn ( x.getName(), x.getContent() ) ;
  }
  try
  {
    I.execute() ;
    w.closeImediately() ;
    this._searchReport ( REPORT_ID ) ;
    this.showReport() ;
    this.refreshReports() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
};
ReportEditor.prototype.editReportStatementDefinition = function ( event )
{
  var v = this.reportStatementTable.getSelectedUserXml() ;
  var REPORT_STMT_ID = v.getContent ( "REPORT_STMT_ID" ) ;
  var x = this.api.getReportStatementDefinition ( REPORT_STMT_ID ) ;
  if ( ! x ) return ;
  x = x.getXml ( "ACT_REPORT_STMT/row" ) ;

  var w = new TWindow ( "Dialog.EditReportStatementDefinition" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  var ta = w.getComponent ( "DEFINITION" ) ;
  var rv = this.cRIGHT_DETAILS.getValues() ;

  x.add ( "REPORT_NAME_AND_TAG", rv.getContent ( "REPORT_NAME" ) + "/" + v.getContent ( "ROOT_TAG" ) ) ;

  w.setValues ( rv ) ;
  w.setValues ( v ) ;
  w.setValues ( x ) ;
  w.show() ;
} ;
ReportEditor.prototype.editReportStatementDefinitionSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var v = w.getValues() ;
  var U = this.getDB().createUpdate ( "ACT_REPORT_STMT" ) ;
  var REPORT_STMT_ID = v.getContent ( "REPORT_STMT_ID" ) ;
  U.addKeyColumn ( "REPORT_STMT_ID", REPORT_STMT_ID ) ;
  U.addColumn ( "DEFINITION", v.getContent ( "DEFINITION" ) ) ;
  try
  {
    U.execute() ;
//    w.closeImediately() ;
    w.resetChanged() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
ReportEditor.prototype.testReportStatementDefinition = function ( event )
{
//return ;
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var v = w.getValues() ;
  var definition = v.getContent ( "DEFINITION" ) ;
  try
  {
    var msg = new CoMessage ( "REPORTER.REQUEST" ) ;
    msg.setHost ( this.api.host ) ;
    msg.setPort ( this.api.port ) ;
    msg.setNameSpace ( this.api.nameSpace ) ;
    var xData = new TXml ( "REPORTER.REQUEST" ) ;
    xData.add ( "Operation", "TestReportStatementDefinition" ) ;
    xData.addCDATA ( "Definition", definition ) ;
    msg.setXmlData ( "" + xData ) ;
    var x = Calypso.getXml ( msg ) ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
ReportEditor.prototype.editReportStatementDetails = function ( event )
{
  var v = this.reportStatementTable.getSelectedUserXml() ;
  var REPORT_STMT_ID = v.getContent ( "REPORT_STMT_ID" ) ;
  var x = this.api.getReportStatementDetails ( REPORT_STMT_ID ) ;
  var w = new TWindow ( "Dialog.EditReportStatementDetails" ) ;
  w.setPagelet ( this ) ;
  w.create() ;

  var xRef = this.api.getCredentialsAsRefData() ;
  w.setRefData ( xRef ) ;
  var xx = x.get ( "ACT_REPORT_STMT/row" ) ;
  w.setValues ( xx ) ;
  w.show() ;
} ;
ReportEditor.prototype.editReportStatementDetailsSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w = ev.getWindow() ;
  var U = this.getDB().createUpdate ( "ACT_REPORT_STMT" ) ;
  var en = v.elements() ;
  var REPORT_STMT_ID = v.getContent ( "REPORT_STMT_ID" ) ;
  while ( en.hasNext() )
  {
    var x = en.nextXml() ;
    if ( x.getName() == "POSITION" )
    {
    }
    else
    if ( x.getName() == "LAST_MODIFIED" ) U.addLastModifiedColumn ( x.getName(), x.getContent() ) ;
    else
    if ( x.getName() == "REPORT_STMT_ID" ) U.addKeyColumn ( x.getName(), x.getContent() ) ;
    else
    if ( x.getBoolAttribute ( "isNull", false ) ) U.addNullColumn ( x.getName(), x.getContent() ) ;
    else                                   U.addColumn ( x.getName(), x.getContent() ) ;
  }
  try
  {
    U.execute() ;
    w.closeImediately() ;
    this.fillReportStatementTable ( this.REPORT_ID, REPORT_STMT_ID ) ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
ReportEditor.prototype.downloadDefinitions = function ( event )
{
  var msg = new CoMessage ( "REPORTER.REQUEST" ) ;
  msg.setHost ( this.api.host ) ;
  msg.setPort ( this.api.port ) ;
  msg.setNameSpace ( this.api.nameSpace ) ;
  var xData = new TXml ( "REPORTER.REQUEST" ) ;
  xData.add ( "Operation", "GetReportDefinitions" ) ;
  xData.add ( "Download", "true" ) ;
  msg.setXmlData ( "" + xData ) ;
  Calypso.downloadDocument ( msg ) ;
} ;
ReportEditor.prototype.refreshReports = function ( event )
{
  var msg = new CoMessage ( "REPORTER.REQUEST" ) ;
  msg.setHost ( this.api.host ) ;
  msg.setPort ( this.api.port ) ;
  msg.setNameSpace ( this.api.nameSpace ) ;
  var xData = new TXml ( "REPORTER.REQUEST" ) ;
  xData.add ( "Operation", "Refresh" ) ;
  msg.setXmlData ( "" + xData ) ;
  var x = Calypso.getXml ( msg ) ;
} ;
ReportEditor.prototype.executeReport = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var REPORT_NAME = v.getContent ( "REPORT_NAME" ) ;
  var FORMAT = v.getContent ( "CH.FORMAT" ) ;
var xml = new TXml() ;
  if ( FORMAT != 'html' )
  {
    var r = new Reporter() ;
    r.setNameSpace ( this.api.nameSpace ) ;
    r.downloadReport ( REPORT_NAME, xml, FORMAT ) ;
    return ;
  }
  var r = new Reporter() ;
  r.setNameSpace ( this.api.nameSpace ) ;
  var str = r.getReport ( REPORT_NAME, xml, "html" ) ;
  var w = TWM.getWindow ( "Window.ShowReport" ) ;
  if ( ! w )
  {
    w = new TWindow ( "Window.ShowReport" ) ;
    w.create() ;
    w.show() ;
  }
  var c = w.getComponent ( "DISPLAY" ) ;
  c.setText ( str ) ;
  w.setTitle ( REPORT_NAME ) ;
} ;
ReportEditor.prototype.editCredentials = function ( event )
{
  var w = new TWindow ( "Dialog.Edit.Credentials" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  var x = this.getDB().query ( "ACT_REPORT_CREDENTIALS"
                         , [ "CREDENTIAL_ID", "DBUID", "DBURL", "CONTEXT" ]
                         ) ;
  w.setValues ( x ) ;
  w.show() ;
} ;
ReportEditor.prototype.removeCredential = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w1 = ev.getWindow() ;
  var row = v.get ( "row" ) ;
  if ( ! row ) row = v.get ( "ACT_REPORT_CREDENTIALS/row" ) ;
  if ( ! row ) return ;
  var CREDENTIAL_ID = v.getContent ( "CREDENTIAL_ID" ) ;
  var d = new TUserDialog ( "AreYouSureToDeleteSelectedItem" ) ;
  d.callOnConfirmation ( this, this.removeCredential2, [ CREDENTIAL_ID ] )
  d.askYesNo() ;
} ;
ReportEditor.prototype.removeCredential2 = function ( CREDENTIAL_ID )
{
} ;
ReportEditor.prototype.modifyCredential = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w1 = ev.getWindow() ;
  var row = v.get ( "row" ) ;
  if ( ! row ) row = v.get ( "ACT_REPORT_CREDENTIALS/row" ) ;
  if ( ! row ) return ;
  var w = new TWindow ( "Dialog.Edit.Credentials.Modify" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  w.setValues ( row ) ;
  w.show() ;
  w.addAttribute ( "w1", w1 ) ;
} ;
ReportEditor.prototype.modifyCredentialSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w = ev.getWindow() ;
  var DBUID = v.getContent ( "DBUID" ) ;
  var DBURL = v.getContent ( "DBURL" ) ;
  var CREDENTIAL_ID = v.getContent ( "CREDENTIAL_ID" ) ;
  var U = this.getDB().createUpdate ( "ACT_REPORT_CREDENTIALS" ) ;
  U.addKeyColumn ( "CREDENTIAL_ID", CREDENTIAL_ID ) ;
  U.addColumn ( "DBUID", DBUID ) ;
  U.addColumn ( "DBURL", DBURL ) ;

  try
  {
    U.execute() ;
    var w1 = w.getAttribute ( "w1" ) ;
    w.closeImediately() ;
    var x = this.getDB().query ( "ACT_REPORT_CREDENTIALS"
                           , [ "CREDENTIAL_ID", "DBUID", "DBURL", "CONTEXT" ]
                           ) ;
    w1.setValues ( x ) ;
    var tab = w1.getPeer ( "ACT_REPORT_CREDENTIALS" ) ;
    var r = tab.findRow ( "CREDENTIAL_ID", CREDENTIAL_ID ) ;
    r.setSelected ( true ) ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
ReportEditor.prototype.modifyCredentialPassword = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w = new TWindow ( "Dialog.Edit.Password" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  w.setValues ( v ) ;
  w.show() ;
};
ReportEditor.prototype.modifyCredentialPasswordSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w = ev.getWindow() ;
  var DBPWD = v.getContent ( "DBPWD" ) ;
  var CREDENTIAL_ID = v.getContent ( "CREDENTIAL_ID" ) ;
  var U = this.getDB().createUpdate ( "ACT_REPORT_CREDENTIALS" ) ;
  U.addKeyColumn ( "CREDENTIAL_ID", CREDENTIAL_ID ) ;
  U.addColumn ( "DBPWD", DBPWD ) ;
  U.addNullColumn ( "SALT" ) ;

  try
  {
    U.execute() ;
    w.closeImediately() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
};
ReportEditor.prototype.newCredential = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w1 = ev.getWindow() ;
  var row = v.get ( "row" ) ;

  var x = this.getDB().select ( 'select max(credential_id) "CREDENTIAL_ID" from ACT_REPORT_CREDENTIALS' ) ;
  var CREDENTIAL_ID = x.getInt ( "ACT_REPORT_CREDENTIALS/row/CREDENTIAL_ID", -1 ) + 1 ;
  var v = new TXml() ;
  v.add ( "CREDENTIAL_ID", CREDENTIAL_ID ) ;

  var w = new TWindow ( "Dialog.New.Credential" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  w.setValues ( v ) ;
  w.show() ;
  w.addAttribute ( "w1", w1 ) ;
};
ReportEditor.prototype.newCredentialSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w = ev.getWindow() ;
  var CREDENTIAL_ID = v.getContent ( "CREDENTIAL_ID" ) ;
  var DBURL = v.getContent ( "DBURL" ) ;
  var DBUID = v.getContent ( "DBUID" ) ;
  var DBPWD = v.getContent ( "DBPWD" ) ;
  var w1 = w.getAttribute ( "w1" ) ;
  try
  {
    var ok = this.api.testCredential ( DBURL, DBUID, DBPWD ) ;
    if ( ! ok )
    {
      var d = new TUserDialog ( "InvalidCredentials" ) ;
      d.error(w) ;
      return ;
    }
    var sql = "select"
            + "  CREDENTIAL_ID"
            + "  from ACT_REPORT_CREDENTIALS"
	    + " where DBURL=? AND DBUID=?"
            ;
    var x = this.getDB().select ( "ACT_REPORT_CREDENTIALS", sql, [ DBURL, DBUID ] ) ;
    if ( x.get ( "ACT_REPORT_CREDENTIALS/row" ) )
    {
      var str = TSys.translate ( "AlreadyExistsArg0", null, [ DBURL + " -- " + DBUID ] ) ;
      var d = new TUserDialog ( str ) ;
      d.error(w) ;
      return ;
    }
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    return ;
  }
  try
  {
    this.getDB().insert ( "ACT_REPORT_CREDENTIALS"
                    , [ "CREDENTIAL_ID", "DBURL", "DBUID", "DBPWD" ]
                    , [ CREDENTIAL_ID, DBURL, DBUID, DBPWD ]
                    ) ;
    w.closeImediately() ;
    var x = this.getDB().query ( "ACT_REPORT_CREDENTIALS"
                           , [ "CREDENTIAL_ID", "DBUID", "DBURL", "CONTEXT" ]
                           ) ;
    w1.setValues ( x ) ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
};
ReportEditor.prototype.newCredentialTest = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var DBURL = v.getContent ( "DBURL" ) ;
  var DBUID = v.getContent ( "DBUID" ) ;
  var DBPWD = v.getContent ( "DBPWD" ) ;
  var ok = this.api.testCredential ( DBURL, DBUID, DBPWD ) ;
  return ok ;
} ;
ReportEditor.prototype.editVariables = function ( event )
{
  var v = this.cRIGHT_DETAILS.getValues() ;
  if ( ! this.reportVariablesEditor )
  {
    this.reportVariablesEditor = new ReportVariablesEditor ( this ) ;
  }
  this.reportVariablesEditor.edit ( v ) ;
} ;
ReportEditor.prototype.createNewStatement = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = new TWindow ( "Dialog.CreateNewReportStatement" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  var v = new TXml() ;
  v.add ( "REPORT_ID", this.REPORT_ID ) ;
  var xRef = this.api.getCredentialsAsRefData() ;
  w.setRefData ( xRef ) ;
  w.setValues ( v ) ;
  w.show() ;
} ;
ReportEditor.prototype.createNewStatementSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w = ev.getWindow() ;

  var CREDENTIAL_ID = v.getContent ( "CREDENTIAL_ID" ) ;

  var x = this.getDB().select ( "select max(REPORT_STMT_ID) \"REPORT_STMT_ID\" from ACT_REPORT_STMT" ) ;
  var REPORT_STMT_ID = x.getInt ( "ACT_REPORT_STMT/row/REPORT_STMT_ID", -1 ) + 1 ;

  var xx = this.getDB().select ( "select max(POSITION) \"POSITION\" from ACT_REPORT_TO_STMT where REPORT_ID=" + this.REPORT_ID ) ;
  var POSITION = xx.getInt ( "ACT_REPORT_TO_STMT/row/POSITION", -1 ) + 1 ;

  var I_REPORT_STMT = this.getDB().createInsert ( "ACT_REPORT_STMT" ) ;
  var I_REPORT_TO_STMT = this.getDB().createInsert ( "ACT_REPORT_TO_STMT" ) ;

  I_REPORT_STMT.addColumn ( "REPORT_STMT_ID", REPORT_STMT_ID ) ;
  I_REPORT_STMT.addColumn ( "ROOT_TAG", v.getContent ( "ROOT_TAG" ) ) ;
  I_REPORT_STMT.addColumn ( "CONTEXT", v.getContent ( "CONTEXT" ) ) ;
  I_REPORT_STMT.addColumn ( "DESCRIPTION", v.getContent ( "DESCRIPTION" ) ) ;
  I_REPORT_STMT.addColumn ( "DEFINITION", v.getContent ( "DEFINITION" ) ) ;
  I_REPORT_STMT.addColumn ( "TYPE", v.getContent ( "TYPE", "SQL" ) ) ;

  if ( CREDENTIAL_ID ) I_REPORT_STMT.addColumn ( "CREDENTIAL_ID", CREDENTIAL_ID ) ;

  I_REPORT_TO_STMT.addColumn ( "REPORT_STMT_ID", REPORT_STMT_ID ) ;
  I_REPORT_TO_STMT.addColumn ( "REPORT_ID", this.REPORT_ID ) ;
  I_REPORT_TO_STMT.addColumn ( "POSITION", POSITION ) ;

  I_REPORT_STMT.execute() ;
  I_REPORT_TO_STMT.execute() ;
  /*
  var I_REPORT_STMT = this.getDB().createInsert ( "ACT_REPORT_STMT" ) ;
  var I_REPORT_TO_STMT = I_REPORT_STMT.addInsert ( "ACT_REPORT_TO_STMT" ) ;

  I_REPORT_STMT.addColumn ( "REPORT_STMT_ID", REPORT_STMT_ID ) ;
  I_REPORT_STMT.addColumn ( "ROOT_TAG", v.getContent ( "ROOT_TAG" ) ) ;
  I_REPORT_STMT.addColumn ( "CONTEXT", v.getContent ( "CONTEXT" ) ) ;
  I_REPORT_STMT.addColumn ( "DESCRIPTION", v.getContent ( "DESCRIPTION" ) ) ;
  I_REPORT_STMT.addColumn ( "DEFINITION", v.getContent ( "DEFINITION" ) ) ;

  I_REPORT_TO_STMT.addColumn ( "REPORT_STMT_ID", REPORT_STMT_ID ) ;
  I_REPORT_TO_STMT.addColumn ( "REPORT_ID", this.REPORT_ID ) ;
  I_REPORT_TO_STMT.addColumn ( "POSITION", POSITION ) ;

  I_REPORT_STMT.execute() ;
  */

  this.fillReportStatementTable ( this.REPORT_ID, REPORT_STMT_ID ) ;
  w.closeImediately() ;
} ;
ReportEditor.prototype.removeStatement = function ( event )
{
  var v = this.reportStatementTable.getSelectedUserXml() ;

  if ( ! v ) return ;
  var REPORT_STMT_ID = v.getContent ( "REPORT_STMT_ID" ) ;
  var d = new TUserDialog ( "AreYouSureToDeleteSelectedItem" ) ;
  d.callOnConfirmation ( this, this.removeStatement2, [ REPORT_STMT_ID ] )
  d.askYesNo() ;
} ;
ReportEditor.prototype.removeStatement2 = function ( REPORT_STMT_ID )
{
  var D_REPORT_TO_STMT = this.getDB().createDelete ( "ACT_REPORT_TO_STMT" ) ;
  D_REPORT_TO_STMT.addKeyColumn ( "REPORT_STMT_ID", REPORT_STMT_ID ) ;
  D_REPORT_TO_STMT.addKeyColumn ( "REPORT_ID", this.REPORT_ID ) ;
  var D_REPORT_STMT = D_REPORT_TO_STMT.addDelete ( "ACT_REPORT_STMT" ) ;
  D_REPORT_STMT.addKeyColumn ( "REPORT_STMT_ID", REPORT_STMT_ID ) ;
  D_REPORT_TO_STMT.execute() ;
  this.fillReportStatementTable ( this.REPORT_ID, null ) ;
} ;
ReportEditor.prototype.editSchedule = function ( event )
{
  var v = this.cRIGHT_DETAILS.getValues() ;
  var x = this.getDB().select ( "select * from ACT_REPORT_SCHEDULE where REPORT_ID=?", [ this.REPORT_ID ] ) ;
  var w = new TWindow ( "Dialog.EditReportSchedule" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  var xx = x.get ( "ACT_REPORT_SCHEDULE/row" ) ;
  w.setValues ( xx ) ;
  if ( xx )
  {
    var pbRemove = w.getComponent ( "PB.Remove" ) ;
    pbRemove.setVisible ( true ) ;
  }
  w.show() ;
} ;
ReportEditor.prototype.helpOnCronExpression = function ( event )
{
//  var str = TSys.getText ( "cron-expressions.htm" ) ;
//log ( str ) ;
  TGui.createIframeWindow ( "cron-expressions.htm", null, true ) ;
} ;
ReportEditor.prototype.editScheduleSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w = ev.getWindow() ;
  var SCHEDULE_ID = v.getInt ( "SCHEDULE_ID", 0 ) ;
  if ( ! SCHEDULE_ID )
  {
    var xx = this.getDB().select ( "select max(SCHEDULE_ID) \"SCHEDULE_ID\" from ACT_REPORT_SCHEDULE" ) ;
    SCHEDULE_ID = xx.getInt ( "ACT_REPORT_SCHEDULE/row/SCHEDULE_ID", -1 ) + 1 ;
  }
  if ( SCHEDULE_ID <= 0 )
  {
    SCHEDULE_ID = 10000 ;
    var I = this.getDB().createInsert ( "ACT_REPORT_SCHEDULE" ) ;
    I.addColumn ( "SCHEDULE_ID", SCHEDULE_ID ) ;
    I.addColumn ( "REPORT_ID", this.REPORT_ID ) ;
    var en = v.elements() ;
    while ( en.hasNext() )
    {
      var x = en.nextXml() ;
      if ( x.getName() == "SCHEDULE_ID" ) continue ;
      I.addColumn ( x.getName(), x.getContent() ) ;
    }
    I.execute() ;
  }
  else
  {
    var U = this.getDB().createUpdate ( "ACT_REPORT_SCHEDULE" ) ;
    U.addKeyColumn ( "SCHEDULE_ID", SCHEDULE_ID ) ;
    var en = v.elements() ;
    while ( en.hasNext() )
    {
      var x = en.nextXml() ;
      if ( x.getName() == "LAST_MODIFIED" ) U.addLastModifiedColumn ( x.getName(), x.getContent() ) ;
      else
      if ( x.getName() == "SCHEDULE_ID" ) {}
      else
      if ( x.getBoolAttribute ( "isNull", false ) ) U.addNullColumn ( x.getName(), x.getContent() ) ;
      else                                   U.addColumn ( x.getName(), x.getContent() ) ;
    }
    U.execute() ;
  }
  var x = new TXml() ;
  x.add ( "SCHEDULE_ID", SCHEDULE_ID ) ;
  x.add ( "CRON_EXPRESSION", v.getContent ( "CRON_EXPRESSION" ) ) ;
  this.cRIGHT.setValues ( x ) ;
  w.closeImediately() ;
  this.refreshReports() ;
} ;
ReportEditor.prototype.editScheduleRemove = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w = ev.getWindow() ;
  var SCHEDULE_ID = v.getInt ( "SCHEDULE_ID", 0 ) ;
  if ( ! SCHEDULE_ID ) return ;

  var d = new TUserDialog ( "AreYouSureToRemoveThisSchedule" ) ;
  d.callOnConfirmation ( this, this.editScheduleRemove2, [ w, SCHEDULE_ID ] )
  d.askYesNo() ;
} ;
ReportEditor.prototype.editScheduleRemove2 = function ( w, SCHEDULE_ID )
{
  var x = new TXml() ;
  x.add ( "SCHEDULE_ID", "" ) ;
  x.add ( "CRON_EXPRESSION", "" ) ;
  this.cRIGHT.setValues ( x ) ;
  var D = this.getDB().createDelete ( "ACT_REPORT_SCHEDULE", "SCHEDULE_ID=" + SCHEDULE_ID ) ;
  D.execute() ;
  w.closeImediately() ;
  this.refreshReports() ;
} ;
ReportEditor.prototype.editGlobalFunctions = function ( event )
{
  if ( ! this.reportFunctionsEditorGlobal )
  {
    this.reportFunctionsEditorGlobal = new ReportFunctionsEditor ( this ) ;
    this.reportFunctionsEditorGlobal.setTypeGlobal ( true ) ;
  }
  this.reportFunctionsEditorGlobal.edit ( null ) ;
} ;
ReportEditor.prototype.editFunctions = function ( event )
{
  var v = this.cRIGHT_DETAILS.getValues() ;
  if ( ! this.reportFunctionsEditor )
  {
    this.reportFunctionsEditor = new ReportFunctionsEditor ( this ) ;
    this.reportFunctionsEditor.setTypeGlobal ( false ) ;
  }
  this.reportFunctionsEditor.edit ( v ) ;
/*
    "REPORT_ID"          NUMBER(*,0),
    "NAME"               VARCHAR2(64 BYTE) NOT NULL ENABLE,
    "DESCRIPTION"        VARCHAR2(512 BYTE),
    "CONTEXT"            VARCHAR2(32 BYTE) DEFAULT 'TVN' NOT NULL ENABLE,
    "BODY" CLOB NOT NULL ENABLE,
    "POSITION" NUMBER(*,0) DEFAULT 1 NOT NULL ENABLE,
    "LAST_MODIFIED" DATE DEFAULT SYSDATE NOT NULL ENABLE,
*/ 
} ;
ReportEditor.prototype.editFunctionsSave = function ( event )
{
} ;

/**
 *  @constructor
 */
ReportVariablesEditor = function ( reportEditor )
{
  this.jsClassName = "ReportVariablesEditor" ;
  this.reportEditor = reportEditor ;
};
ReportVariablesEditor.prototype.toString = function()
{
  return "(" + this.jsClassName + ")[REPORT_ID=" + this.REPORT_ID + "]" ;
};
ReportVariablesEditor.prototype.getDB = function()
{
  return this.reportEditor.getDB() ;
}
ReportVariablesEditor.prototype.getAll = function()
{
  return this.getDB().select ( "select * from ACT_REPORT_VARIABLES where REPORT_ID=?", [ this.REPORT_ID ] ) ;
}
ReportVariablesEditor.prototype.reset = function()
{
  var w = TGui.getWindow ( "Window.Edit.ReportVariables" ) ;
  if ( w ) w.closeImediately() ;
  this.reportEditor.reportVariablesEditor = undefined ;
}
ReportVariablesEditor.prototype.editWindowClose = function ( event )
{
  this.reportEditor.reportVariablesEditor = undefined ;
}
ReportVariablesEditor.prototype.edit = function ( xReportDetails )
{
  this._xReportDetails = xReportDetails ;
  this.REPORT_ID = xReportDetails.getContent ( "REPORT_ID" ) ;
  var x = this.getAll() ;
  var w = TGui.getWindow ( "Window.Edit.ReportVariables" ) ;
  if ( !w )
  {
    w = new TWindow ( "Window.Edit.ReportVariables" ) ;
    w.setPagelet ( this ) ;
    w.create() ;
    w.setValues ( this._xReportDetails) ;
    w.setValues ( x ) ;
    w.show() ;
  }
  else
  {
    w.setValues ( this._xReportDetails) ;
    w.setValues ( x ) ;
  }
} ;
ReportVariablesEditor.prototype.modify = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var tab = w.getPeer ( "ACT_REPORT_VARIABLES" ) ;
  var x = tab.getSelectedUserXml() ;
  if ( ! x )
  {
    var d = new TUserDialog ( "Please select an item." ) ;
    d.error() ;
    return ;
  }
  var old = x.ensureXml ( "OLD_NAME" ) ;
  old.setContent ( x.getContent ( "NAME" ) ) ;
  var ww = new TWindow ( "Dialog.Edit.ReportVariables.Modify" ) ;
  ww.setPagelet ( this ) ;
  ww.create() ;
  ww.setValues( x ) ;
  ww.addAttribute ( "w", w ) ;
  ww.show() ;
} ;
ReportVariablesEditor.prototype.modifySave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var NAME = v.getContent ( "NAME" ) ;
  var OLD_NAME = v.getContent ( "OLD_NAME" ) ;
  var w = ev.getWindow() ;
  try
  {
    if ( OLD_NAME != NAME && this.nameAlreadyExists ( NAME ) )
    {
      var str = TSys.translate ( "AlreadyExistsArg0", null, [ NAME ] ) ;
      var d = new TUserDialog ( str ) ;
      d.error(w) ;
      return ;
    }
    this.updateModified ( v ) ;
    var pw = w.getAttribute ( "w" ) ;
    var xResult = this.getAll() ;
    pw.setValues ( xResult ) ;
    var tab = pw.getPeer ( "ACT_REPORT_VARIABLES" ) ;
    var r = tab.findRow ( "NAME", NAME ) ;
    r.setSelected ( true, true ) ;
    w.closeImediately() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
ReportVariablesEditor.prototype.updateModified = function ( v )
{
  var U = this.getDB().createUpdate ( "ACT_REPORT_VARIABLES" ) ;
  var en = v.elements() ;
  var REPORT_ID = v.getContent ( "REPORT_ID" ) ;
  var VALUE = v.getContent ( "VALUE" ) ;
  this.checkBraces ( VALUE ) ;
  while ( en.hasNext() )
  {
    var x = en.nextXml() ;
    if ( x.getName() == "REPORT_VAR_ID" ) U.addKeyColumn ( x.getName(), x.getContent() ) ;
    else
    if ( x.getName() == "OLD_NAME" ) {}
    else                                  U.addColumn ( x.getName(), x.getContent() ) ;
  }
  try
  {
    U.execute() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
ReportVariablesEditor.prototype.nameAlreadyExists = function ( NAME )
{
  var x = this.getDB().query ( "ACT_REPORT_VARIABLES", [ "NAME" ], "REPORT_ID=" + this.REPORT_ID + " and UPPER(NAME)='" + NAME.toUpperCase() + "'" ) ;
  if ( ! x ) return false ;
  if ( ! x.get ( "ACT_REPORT_VARIABLES" ).isEmpty() ) return true ;
  return false ;
}
ReportVariablesEditor.prototype.remove = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var tab = w.getPeer ( "ACT_REPORT_VARIABLES" ) ;
  var x = tab.getSelectedUserXml() ;
  if ( ! x )
  {
    var d = new TUserDialog ( "Please select an item." ) ;
    d.error() ;
    return ;
  }

  var d = new TUserDialog ( "AreYouSureToDeleteSelectedItem" ) ;
  var REPORT_VAR_ID = x.getContent ( "REPORT_VAR_ID" ) ;
  d.callOnConfirmation ( this.remove2, [ w, REPORT_VAR_ID ], this )
  d.askYesNo() ;
} ;
ReportVariablesEditor.prototype.remove2 = function ( w, REPORT_VAR_ID )
{
  var D = this.getDB().createDelete ( "ACT_REPORT_VARIABLES", "REPORT_VAR_ID=" + REPORT_VAR_ID ) ;
  D.execute() ;
  var x = this.getAll() ;
  w.setValues ( x ) ;
} ;
ReportVariablesEditor.prototype.addNew = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = new TWindow ( "Dialog.Edit.ReportVariables.New" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  w.addAttribute ( "w", ev.getWindow() ) ;
  w.show() ;
} ;
ReportVariablesEditor.prototype.addNewSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var NAME = v.getContent ( "NAME" ) ;
  var w = ev.getWindow() ;
  try
  {
    if ( this.nameAlreadyExists ( NAME ) )
    {
      var str = TSys.translate ( "AlreadyExistsArg0", null, [ NAME ] ) ;
      var d = new TUserDialog ( str ) ;
      d.error(w) ;
      return ;
    }
    this.saveNew ( v ) ;
    var pw = w.getAttribute ( "w" ) ;
    var xResult = this.getAll() ;
    pw.setValues ( xResult ) ;
    var tab = pw.getPeer ( "ACT_REPORT_VARIABLES" ) ;
    tab.findRow ( "NAME", NAME ).setSelected ( true, true ) ;
    w.closeImediately() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
ReportVariablesEditor.prototype.checkBraces = function ( str )
{
  var parenthesisCounter = 0 ;
  var curlyBracesCounter = 0 ;
  for ( var i = 0 ; i < str.length ; i++ )
  {
    var c = str.charAt ( i ) ;
    if ( c == '(' )
    {
      if ( i == 0 ) throw "Syntax Errror at: 1" ;
      parenthesisCounter++ ;
      continue ;
    }
    if ( c == ')' )
    {
      if ( i == 0 ) throw "Syntax Errror at: 1" ;
      parenthesisCounter-- ;
      continue ;
    }
    if ( c == '{' )
    {
      if ( i == 0 ) throw "Syntax Errror at: 1" ;
      if ( str.charAt ( i - 1 ) != '$' ) throw "Syntax Errror at: " + ( i+1 ) + ". Missing $ sign." ; 
      curlyBracesCounter++ ;
      continue ;
    }
    if ( c == '}' )
    {
      if ( i == 0 ) throw "Syntax Errror at: 1" ;
      curlyBracesCounter-- ;
      continue ;
    }
  }
  if ( parenthesisCounter )
  {
    throw "() do not match (counter=" + parenthesisCounter + ")." ;
  }
  if ( curlyBracesCounter )
  {
    throw "{} do not match (counter=" + curlyBracesCounter + ")." ;
  }
} ;
ReportVariablesEditor.prototype.saveNew = function ( v )
{
  var x = this.getDB().select ( "select max(REPORT_VAR_ID) \"REPORT_VAR_ID\" from ACT_REPORT_VARIABLES" ) ;
  var REPORT_VAR_ID = x.getInt ( "ACT_REPORT_VARIABLES/row/REPORT_VAR_ID", -1 ) + 1 ;
  var I = this.getDB().createInsert ( "ACT_REPORT_VARIABLES" ) ;

  var VALUE = v.getContent ( "VALUE" ) ;
  this.checkBraces ( VALUE ) ;
  I.addColumn ( "REPORT_VAR_ID", REPORT_VAR_ID ) ;
  I.addColumn ( "REPORT_ID", this.REPORT_ID ) ;
  I.addColumn ( "NAME", v.getContent ( "NAME" ) ) ;
  I.addColumn ( "TYPE", v.getContent ( "TYPE", "S" ) ) ;
  I.addColumn ( "VALUE", VALUE ) ;
  I.addColumn ( "TEXT", v.getContent ( "TEXT" ) ) ;
  I.execute() ;
} ;

/**
 *  @constructor
 */
ReportFunctionsEditor = function ( reportEditor )
{
  this.jsClassName = "ReportFunctionsEditor" ;
  this.reportEditor = reportEditor ;
  this._isGlobal = false ;
};
ReportFunctionsEditor.prototype.toString = function()
{
  return "(" + this.jsClassName + ")[REPORT_ID=" + this.REPORT_ID + "]" ;
};
ReportFunctionsEditor.prototype.setTypeGlobal = function ( state )
{
  this._isGlobal = state ? true : false ;
};
ReportFunctionsEditor.prototype.getDB = function()
{
  return this.reportEditor.getDB() ;
}
ReportFunctionsEditor.prototype.getAll = function()
{
  var x = null ;
  if ( this._isGlobal )
  {
    x = this.getDB().query ( "ACT_REPORT_FUNCTIONS"
		             , [ "REPORT_FUNCTION_ID"
                               , "CONTEXT"
                               , "NAME"
                               , "DESCRIPTION"
			       ]
			     , "REPORT_ID is null"
		             ) ;
  }
  else
  {
    x = this.getDB().query ( "ACT_REPORT_FUNCTIONS"
		             , [ "REPORT_FUNCTION_ID"
                               , "REPORT_ID"
                               , "CONTEXT"
                               , "NAME"
                               , "DESCRIPTION"
			       ]
			     , "REPORT_ID=?"
			     ,  this.REPORT_ID
		             ) ;
  }
  return x ;
}
ReportFunctionsEditor.prototype.reset = function()
{
//  var w = TGui.getWindow ( "Window.Edit.ReportFunctions" ) ;
//  if ( w ) w.closeImediately() ;
//  this.reportEditor.reportFunctionsEditor = undefined ;
}
ReportFunctionsEditor.prototype.editWindowClose = function ( event )
{
  this.reportEditor.reportFunctionsEditor = undefined ;
}
ReportFunctionsEditor.prototype.edit = function ( v )
{
  if ( v )
  {
    this.REPORT_ID = v.getContent ( "REPORT_ID" ) ;
  }
  var x = this.getAll() ;
  var w = TGui.getWindow ( "Window.Edit.ReportFunctions" ) ;
  if ( !w )
  {
    w = new TWindow ( "Window.Edit.ReportFunctions" ) ;
    if ( this._isGlobal ) w.setTitle ( "Edit Global Functions..." ) ;
    else                  w.setTitle ( "Edit Functions..." ) ;
    w.setPagelet ( this ) ;
    w.create() ;
    w.setValues ( x ) ;
    w.show() ;
  }
  else
  {
    w.setValues ( x ) ;
  }
} ;
ReportFunctionsEditor.prototype.modify = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var tab = w.getPeer ( "ACT_REPORT_FUNCTIONS" ) ;
  var x = tab.getSelectedUserXml() ;
  if ( ! x )
  {
    var d = new TUserDialog ( "Please select an item." ) ;
    d.error() ;
    return ;
  }
  var old = x.ensureXml ( "OLD_NAME" ) ;
  old.setContent ( x.getContent ( "NAME" ) ) ;
  var ww = new TWindow ( "Dialog.Edit.ReportFunctions.Modify" ) ;
  ww.setPagelet ( this ) ;
  ww.create() ;
  ww.setValues( x ) ;
  ww.addAttribute ( "w", w ) ;
  ww.show() ;
} ;
ReportFunctionsEditor.prototype.modifySave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var NAME = v.getContent ( "NAME" ) ;
  var OLD_NAME = v.getContent ( "OLD_NAME" ) ;
  var w = ev.getWindow() ;
  try
  {
    if ( OLD_NAME != NAME && this.nameAlreadyExists ( NAME ) )
    {
      var str = TSys.translate ( "AlreadyExistsArg0", null, [ NAME ] ) ;
      var d = new TUserDialog ( str ) ;
      d.error(w) ;
      return ;
    }
    this.updateModified ( v ) ;
    var pw = w.getAttribute ( "w" ) ;
    var xResult = this.getAll() ;
    pw.setValues ( xResult ) ;
    var tab = pw.getPeer ( "ACT_REPORT_FUNCTIONS" ) ;
    var r = tab.findRow ( "NAME", NAME ) ;
    r.setSelected ( true, true ) ;
    w.closeImediately() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
ReportFunctionsEditor.prototype.updateModified = function ( v )
{
  var U = this.getDB().createUpdate ( "ACT_REPORT_FUNCTIONS" ) ;
  var en = v.elements() ;
  var REPORT_ID = v.getContent ( "REPORT_FUNCTION_ID" ) ;
  while ( en.hasNext() )
  {
    var x = en.nextXml() ;
    if ( x.getName() == "REPORT_FUNCTION_ID" ) U.addKeyColumn ( x.getName(), x.getContent() ) ;
    else
    if ( x.getName() == "LAST_MODIFIED" ) U.addLastModifiedColumn ( x.getName(), x.getContent() ) ;
    else
    if ( x.getName() == "OLD_NAME" ) {}
    else                                  U.addColumn ( x.getName(), x.getContent() ) ;
  }
  try
  {
    U.execute() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
ReportFunctionsEditor.prototype.nameAlreadyExists = function ( NAME )
{
  var x = null ;
  if ( this._isGlobal )
  {
    x = this.getDB().query ( "ACT_REPORT_FUNCTIONS", [ "NAME" ], "UPPER(NAME)='" + NAME.toUpperCase() + "'" ) ;
  }
  else
  {
    x = this.getDB().query ( "ACT_REPORT_FUNCTIONS", [ "NAME" ], "UPPER(NAME)='" + NAME.toUpperCase() + "'" ) ;
  }
  if ( ! x ) return false ;
  if ( ! x.get ( "ACT_REPORT_FUNCTIONS" ).isEmpty() ) return true ;
  return false ;
}
ReportFunctionsEditor.prototype.remove = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var tab = w.getPeer ( "ACT_REPORT_FUNCTIONS" ) ;
  var x = tab.getSelectedUserXml() ;
  if ( ! x )
  {
    var d = new TUserDialog ( "Please select an item." ) ;
    d.error() ;
    return ;
  }

  var d = new TUserDialog ( "AreYouSureToDeleteSelectedItem" ) ;
  var REPORT_FUNCTION_ID = x.getContent ( "REPORT_FUNCTION_ID" ) ;
  d.callOnConfirmation ( this.remove2, [ w, REPORT_FUNCTION_ID ], this )
  d.askYesNo() ;
} ;
ReportFunctionsEditor.prototype.remove2 = function ( w, REPORT_FUNCTION_ID )
{
  var D = this.getDB().createDelete ( "ACT_REPORT_FUNCTIONS", "REPORT_FUNCTION_ID=" + REPORT_FUNCTION_ID ) ;
  D.execute() ;
  var x = this.getAll() ;
  w.setValues ( x ) ;
} ;
ReportFunctionsEditor.prototype.addNew = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = new TWindow ( "Dialog.Edit.ReportFunctions.New" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  w.addAttribute ( "w", ev.getWindow() ) ;
  w.show() ;
} ;
ReportFunctionsEditor.prototype.addNewSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var NAME = v.getContent ( "NAME" ) ;
  var w = ev.getWindow() ;
  try
  {
    if ( this.nameAlreadyExists ( NAME ) )
    {
      var str = TSys.translate ( "AlreadyExistsArg0", null, [ NAME ] ) ;
      var d = new TUserDialog ( str ) ;
      d.error(w) ;
      return ;
    }
    this.saveNew ( v ) ;
    var pw = w.getAttribute ( "w" ) ;
    var xResult = this.getAll() ;
    pw.setValues ( xResult ) ;
    var tab = pw.getPeer ( "ACT_REPORT_FUNCTIONS" ) ;
    tab.findRow ( "NAME", NAME ).setSelected ( true, true ) ;
    w.closeImediately() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
ReportFunctionsEditor.prototype.saveNew = function ( v )
{
  var x = this.getDB().select ( "select max(REPORT_FUNCTION_ID) \"REPORT_FUNCTION_ID\" from ACT_REPORT_FUNCTIONS" ) ;
  var REPORT_FUNCTION_ID = x.getInt ( "ACT_REPORT_FUNCTIONS/row/REPORT_FUNCTION_ID", -1 ) + 1 ;
  var I = this.getDB().createInsert ( "ACT_REPORT_FUNCTIONS" ) ;

  I.addColumn ( "REPORT_FUNCTION_ID", REPORT_FUNCTION_ID ) ;
  I.addColumn ( "NAME", v.getContent ( "NAME" ) ) ;
  I.addColumn ( "CONTEXT", v.getContent ( "CONTEXT" ) ) ;
  I.addColumn ( "DESCRIPTION", v.getContent ( "DESCRIPTION" ) ) ;
  var sBODY = ""
  + "/*\n"
  + "**---------------------------------\n"
  + "** @tbs@\n"
  + "**---------------------------------\n"
  + "*/\n"
  + "function execute ( ctx )\n"
  + "{\n"
  + "}\n"
  ;
  I.addColumn ( "BODY", sBODY ) ;
  I.execute() ;
} ;
ReportFunctionsEditor.prototype.editScript = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var tab = w.getPeer ( "ACT_REPORT_FUNCTIONS" ) ;
  var v = tab.getSelectedUserXml() ;
  if ( ! v )
  {
    var d = new TUserDialog ( "Please select an item." ) ;
    d.error() ;
    return ;
  }
  var REPORT_FUNCTION_ID = v.getContent ( "REPORT_FUNCTION_ID" ) ;
  var x = this.getDB().query ( "ACT_REPORT_FUNCTIONS"
		             , [ "REPORT_FUNCTION_ID"
                               , "BODY"
			       ]
			     , "REPORT_FUNCTION_ID=?"
			     ,  REPORT_FUNCTION_ID
		             ) ;
  var xx = x.get ( "ACT_REPORT_FUNCTIONS/row" ) ;
  var w = new TWindow ( "Dialog.Edit.ReportFunctions.Editor" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  w.setValues ( xx ) ;
  w.addAttribute ( "w", w ) ;
  w.show() ;
} ;
ReportFunctionsEditor.prototype.onloadFormEditor = function ( ev )
{
  this.formEditor = ev.getContainer() ;
  this.formEditor.resetChanged() ;
} ;
ReportFunctionsEditor.prototype.onloadFormBODY = function ( ev )
{
  this.formBODY = ev.getContainer() ;
} ;
ReportFunctionsEditor.prototype.testFunction = function ( event )
{
  var ta = this.formBODY.getComponent ( "BODY" ) ;
  var td = this.formBODY.getComponent ( "INFO_BODY" ) ;
  var a1 = this.doit ( ta, td ) ;
  return a1 ;
} ;
ReportFunctionsEditor.prototype.doit = function ( ta, info )
{
  var str = ta.getText() ;
  if ( str.length < 100 ) str = str.trim() ;
  if ( str.length == 0 ) return true ;
  var x = TSys.evaluateJavaScript ( str, true, false, true ) ;
  if ( ! x )
  {
    var n1 = "img/apply-16.png" ;
    info.dom.style.color = "green" ;
    info.setText ( "<img src=" + n1 + "></img><span>%NoError%</span>" ) ;
    return true ;
  }
  var msg = x.getContent ( "Message" ) ;
  var pos = msg.indexOf ( "EvaluatorException:" ) ;
  if ( pos < 0 ) pos = msg.indexOf ( "EcmaError:" ) ;
  if ( pos > 0 ) pos = msg.indexOf ( ":", pos ) ;
  if ( pos > 0 ) pos++ ;
  if ( pos > 0 ) msg = msg.substring ( pos ) ;
  msg = msg.trim() ;
  info.dom.style.color = "red" ;
  info.setText ( msg ) ;
  var n2 = "img/error-16.png" ;
  info.setText ( "<img src=" + n2 + "></img><span>" + msg + "</span>" ) ;
  return msg.length == 0 ;
} ;
ReportFunctionsEditor.prototype.saveFunction = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w = ev.getWindow() ;
  var REPORT_FUNCTION_ID = v.getContent ( "REPORT_FUNCTION_ID" ) ;
  var fBODY = v.getContent ( "BODY" ) ;
  if ( ! this.testFunction() )
  {
    var d = new TUserDialog ( "Please correct the errors before save." ) ;
    d.error() ;
    return ;
  }
  var U = this.getDB().createUpdate ( "ACT_REPORT_FUNCTIONS" ) ;
  U.addKeyColumn ( "REPORT_FUNCTION_ID", REPORT_FUNCTION_ID ) ;
  U.addColumn ( "BODY", fBODY ) ;
  U.execute() ;
  this.formEditor.resetChanged() ;
} ;
