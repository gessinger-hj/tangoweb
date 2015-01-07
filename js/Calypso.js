/**
 *  @constructor
 */
var TInvokationContext = function()
{
  this.isJava = false ;
  this.jsClassName = "TInvokationContext" ;
}
TInvokationContext.prototype.toString = function()
{
  var str = "(" + this.jsClassName + ")\n[\n" ;
  var first = true ;
  for ( var key in this )
  {
    var v = this[key] ;
    if ( typeof ( v ) == 'string' || typeof ( v ) == 'number' || typeof ( v ) == 'boolean' )
    {
      if ( first ) { str += "  " ; first = false ; }
      else         { str += " ," }
      str += key + "=" + v + "\n" ;
    }
    else
    if ( typeof ( v ) != 'function' )
    {
      if ( first ) { str += "  " ; first = false ; }
      else         { str += " ," }
      str += key + "\n" ;
    }
  }
  str += "]" ;
  return str ;
}
/**
 *  @constructor
 */
var TFunction = function ( f )
{
  this.method = f ;
}
TFunction.prototype.evaluate = function ( args )
{
  var a = null ;
  if ( args )
  {
    if ( TSys.isArray ( args ) ) a = args ;
    else { a = TSys.toArray ( arguments ) ; }
  }
  if ( ! a ) a = [] ;
  if ( a.length )
  {
    if ( a[0] instanceof TInvokationContext )
    {
    }
    else
    {
      a.splice ( 0, 0, null ) ;
      a[0] = new TInvokationContext() ;
    }
  }
  else
  {
    a[0] = new TInvokationContext() ;
  }
  return this.method.apply ( this.method, a ) ;
}

/**
 *  @constructor
 */
var TGlobalsClass = function()
{
  this.nameToFunction = [] ;
}
TGlobalsClass.prototype.getFunction = function ( name, dontChache )
{
  var f = this.nameToFunction[name] ;
  if ( f ) return f ;
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;

  if ( ! name ) throw "TGlobals.getFunction: Missing parameter 'name'" ;
  var S = dbv.addSelect ( "select FUNCTION_TYPE_ID, FUNCTION_NAME, FUNCTION_BODY from T_FUNCTION where FUNCTION_NAME=?" ) ;
  S.addHostValue ( name ) ;
  S.setTagName ( "T_FUNCTION" ) ;
  var dbv = Calypso.getDbv ( msg ) ;
  var xml = dbv.getResultXml() ;
  var sf = xml.getContent ( "T_FUNCTION/row/FUNCTION_BODY" ) ;
  if ( ! sf ) return null ;
  var f = eval ( "x=" + sf ) ;
//  var f = eval ( "(" + sf + ")" ) ;
  var ff = new TFunction ( f ) ;
  if ( ! dontChache ) this.nameToFunction[name] = ff ;
  return ff ;
}
TGlobalsClass.prototype.getFunctionScriptXml = function ( id, name, type )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var S = null ;
  if ( ! id && ! name ) throw "TGlobals.getFunction: Missing parameter 'id' or 'name'" ;
  var where = "" ;
  if ( id )
  {
    var S = dbv.addSelect ( "select FUNCTION_ID, FUNCTION_TYPE_ID, FUNCTION_NAME, FUNCTION_BODY, ELIGIBILITY from T_FUNCTION where FUNCTION_ID=?" ) ;
    S.addHostValue ( id ) ;
    S.setTagName ( "T_FUNCTION" ) ;
  }
  else
  if ( name )
  {
    var S = dbv.addSelect ( "select FUNCTION_ID, FUNCTION_TYPE_ID, FUNCTION_NAME, FUNCTION_BODY, ELIGIBILITY from T_FUNCTION where FUNCTION_NAME=?" ) ;
    S.addHostValue ( name ) ;
    S.setTagName ( "T_FUNCTION" ) ;
  }
  dbv = Calypso.getDbv ( msg ) ;
  return dbv.getResultXml() ;
}
TGlobalsClass.prototype.getFunctionBody = function ( name )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var S = null ;
  if ( ! name ) throw "TGlobals.getFunction: Missing parameter 'name'" ;
  var S = dbv.addSelect ( "select FUNCTION_TYPE_ID, FUNCTION_NAME, FUNCTION_BODY from T_FUNCTION where FUNCTION_NAME=?" ) ;
  S.addHostValue ( name ) ;
  S.setTagName ( "T_FUNCTION" ) ;
  dbv = Calypso.getDbv ( msg ) ;
  var xml = dbv.getResultXml() ;
  return xml.getContent ( "T_FUNCTION/row/FUNCTION_BODY" ) ;
}
TGlobalsClass.prototype.saveFunctionBody = function ( id, name, body )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var U = dbv.addUpdate ( "T_FUNCTION" ) ;
  U.addKeyColumn ( "FUNCTION_ID", String ( id ) ) ;
  U.addColumn ( "FUNCTION_BODY", body ) ;
  dbv = Calypso.getDbv ( msg ) ;
}
TGlobalsClass.prototype.saveFunctionScript = function ( id, name, body, eligibility )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var U = dbv.addUpdate ( "T_FUNCTION" ) ;
  U.addKeyColumn ( "FUNCTION_ID", String ( id ) ) ;
  U.addColumn ( "FUNCTION_BODY", body ) ;
  U.addColumn ( "ELIGIBILITY", eligibility ) ;
  dbv = Calypso.getDbv ( msg ) ;
}
TGlobalsClass.prototype.createFunctionScript = function ( FUNCTION_NAME, FUNCTION_TYPE_ID, FUNCTION_BODY, ELIGIBILITY )
{
  var FUNCTION_ID = Database.getNextValFromSequence ( "SEQ_FUNCTION" ) ;
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var I = dbv.addInsert ( "T_FUNCTION" ) ;
  I.addColumn ( "FUNCTION_ID", FUNCTION_ID ) ;
  I.addColumn ( "FUNCTION_NAME", FUNCTION_NAME ) ;
  I.addColumn ( "FUNCTION_TYPE_ID", FUNCTION_TYPE_ID ) ;
  I.addColumn ( "FUNCTION_BODY", FUNCTION_BODY ) ;
  I.addColumn ( "ELIGIBILITY", ELIGIBILITY ) ;
  dbv = Calypso.getDbv ( msg ) ;
}
TGlobalsClass.prototype.getFunctionList = function ( pattern )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;

  var S = null ;
  if ( ! pattern ) pattern = '*' ;
  pattern = pattern.replace ( /\*/g, "%" ) ;
  var S = dbv.addSelect ( "select FUNCTION_ID, FUNCTION_TYPE_ID, FUNCTION_NAME from T_FUNCTION where FUNCTION_NAME like ?" ) ;
  S.addHostValue ( pattern ) ;
  S.setTagName ( "T_FUNCTION" ) ;
  var dbv = Calypso.getDbv ( msg ) ;
  var xml = dbv.getResultXml() ;
  return xml ;
}
TGlobalsClass.prototype.functionAlreadyExists = function ( FUNCTION_NAME, FUNCTION_TYPE_ID )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var Q = dbv.addQuery ( "T_FUNCTION", [ "FUNCTION_NAME" ], "FUNCTION_NAME='" + FUNCTION_NAME + "'" ) ;
  dbv = Calypso.getDbv ( msg ) ;
  var x = dbv.getResultXml() ;
  if ( ! x ) return false ;
  if ( ! x.get ( "T_FUNCTION" ).isEmpty() ) return true ;
  return false ;
}
TGlobalsClass.prototype.saveNewGlobalAttribute = function ( x )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var I = dbv.addInsert ( "T_GLOBAL_ATTRIBUTES" ) ;
  I.addColumn ( "ATTRIBUTE_NAME", x.getContent ( "ATTRIBUTE_NAME" ) ) ;
  I.addColumn ( "ATTRIBUTE_TYPE_ID", x.getContent ( "ATTRIBUTE_TYPE_ID" ) ) ;
  I.addColumn ( "ATTRIBUTE_VALUE", x.getContent ( "ATTRIBUTE_VALUE" ) ) ;
  I.addColumn ( "ATTRIBUTE_DESCRIPTION", x.getContent ( "ATTRIBUTE_DESCRIPTION" ) ) ;
  dbv = Calypso.getDbv ( msg ) ;
}
TGlobalsClass.prototype.saveModifiedGlobalAttribute = function ( x )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var ATTRIBUTE_NAME = x.getContent ( "ATTRIBUTE_NAME" ) ;
  var OLD_ATTRIBUTE_NAME = x.getContent ( "OLD_ATTRIBUTE_NAME" ) ;
  var U = dbv.addUpdate ( "T_GLOBAL_ATTRIBUTES", "ATTRIBUTE_NAME='" + OLD_ATTRIBUTE_NAME + "'" ) ;
  U.addColumn ( "ATTRIBUTE_NAME", x.getContent ( "ATTRIBUTE_NAME" ) ) ;
  U.addColumn ( "ATTRIBUTE_TYPE_ID", x.getContent ( "ATTRIBUTE_TYPE_ID" ) ) ;
  U.addColumn ( "ATTRIBUTE_VALUE", x.getContent ( "ATTRIBUTE_VALUE" ) ) ;
  U.addColumn ( "ATTRIBUTE_DESCRIPTION", x.getContent ( "ATTRIBUTE_DESCRIPTION" ) ) ;
  dbv = Calypso.getDbv ( msg ) ;
}
TGlobalsClass.prototype.removeGlobalAttribute = function ( ATTRIBUTE_NAME )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var D = dbv.addDelete ( "T_GLOBAL_ATTRIBUTES" ) ;
  D.addKeyColumn ( "ATTRIBUTE_NAME", ATTRIBUTE_NAME ) ;
  dbv = Calypso.getDbv ( msg ) ;
}
TGlobalsClass.prototype.globalAttributeAlreadyExists = function ( ATTRIBUTE_NAME )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var Q = dbv.addQuery ( "T_GLOBAL_ATTRIBUTES", [ "ATTRIBUTE_NAME" ], "ATTRIBUTE_NAME='" + ATTRIBUTE_NAME + "'" ) ;
  dbv = Calypso.getDbv ( msg ) ;
  var x = dbv.getResultXml() ;
  if ( ! x ) return false ;
  if ( ! x.get ( "T_GLOBAL_ATTRIBUTES" ).isEmpty() ) return true ;
  return false ;
}
TGlobals = new TGlobalsClass() ;
/**
 *  @constructor
 */
var GlobalAttributesClass = function()
{
  this.nameToValue = [] ;
}
GlobalAttributesClass.prototype.get = function ( name, def )
{
  var v = this.nameToValue[name] ;
  if ( typeof ( v ) != 'undefined' ) return v ;
  var x = this.getAll() ;
  v = this.nameToValue[name] ;
  if ( typeof ( v ) != 'undefined' ) return v ;
  return def ;
}
AttributeType =
{
  STRING: 'string',
  STRING_ID: '1',
  FLOAT: 'float',
  FLOAT_ID: '2',
  DATE: 'date',
  DATE_ID: '3',
  INT: 'int',
  INT_ID: '4',
  SFLOAT: 'sfloat',
  SFLOAT_ID: '5',
  SINT: 'sint',
  SINT_ID: '6',
  isDate: function ( type )
  {
    if ( type == this.DATE ) return true ;
    if ( type == this.DATE_ID ) return true ;
    return false ;
  }
}

GlobalAttributesClass.prototype.getAll = function()
{
  var msg = new CoMessage ( Calypso.get_DB_EXECUTE_STMT() ) ;
  var dbv = new CoDbv ( msg ) ;
  var stmt = dbv.addXStatement ( "TangoUtils" ) ;
  var xValues = new TXml() ;
  xValues.setName ( "Values" ) ;
  stmt.addElement ( xValues ) ;
  stmt.addElement ( "Action", "GetGlobalAttributes" ) ;
  var dbv = Calypso.getDbv ( msg ) ;
  var x = dbv.getResultXml() ;

  this.nameToValue.length = 0 ;
  if ( ! x ) return x ;
  var en = x.getEnum ( "T_GLOBAL_ATTRIBUTES", "row" ) ;
  while ( en.hasNext() )
  {
    var xRow = en.nextXml() ;
    var xElem = xRow.getXml ( "ATTRIBUTE_VALUE" ) ;
    var type = xElem.getAttribute ( "type" ) ;
    var attrValue = xElem.getContent() ;
    if ( type == 'float' || type == 'sfloat' ) attrValue = parseFloat ( attrValue ) ;
    if ( type == 'int' || type == 'sint' ) attrValue = parseInt ( attrValue ) ;
    if ( type == 'date' ) attrValue = xRow.getDate ( 'ATTRIBUTE_VALUE' ) ;
    this.nameToValue[xRow.getContent ( "ATTRIBUTE_NAME" )] = attrValue ;
  }
  return x ;
}
GlobalAttributesClass.prototype.saveAll = function ( xValues )
{
  var msg = new CoMessage ( Calypso.get_DB_EXECUTE_STMT() ) ;
  var dbv = new CoDbv ( msg ) ;
  var stmt = dbv.addXStatement ( "TangoUtils" ) ;
  xValues.setName ( "Values" ) ;
  stmt.addElement ( xValues ) ;
  stmt.addElement ( "Action", "SaveGlobalAttributes" ) ;
  this.nameToValue.length = 0 ;
  var dbv = Calypso.getDbv ( msg ) ;
  return dbv.getResultXml() ;
}
GlobalAttributesClass.prototype.onclickTableItem = function ( ev )
{
  var w = ev.getWindow() ;
  w.getComponent ( "PB.Modify" ).setEnabled ( true ) ;
  w.getComponent ( "PB.Remove" ).setEnabled ( true ) ;
}
GlobalAttributesClass.prototype.onchangeTableItem = function ( ev )
{
  var src = ev.getSource() ;
  if ( ! src.mandatory )
  {
    src.mandatory = true ;
    src.extendedType = new TFunctionExecutor ( this, this._typeMandatoryCallback ) ;
    var tab = ev.getPeer() ;
    var x = tab.getSelectedUserXml() ;
    src.ATTRIBUTE_TYPE_ID = x.getContent ( "ATTRIBUTE_TYPE_ID" ) ;
  }
  TGui.setMandatoryDecoration ( src, false, ev.getEvent() ) ;
}
GlobalAttributesClass.prototype._typeMandatoryCallback = function ( str, src, event )
{
  if ( ! src.value ) return false ;
  var type = src.ATTRIBUTE_TYPE_ID ;
  if ( type == "1" ) return true ;
  if ( type == "2" )
  {
    var b = TGui.checkFloat ( str, src ) ;
    if ( ! src.value ) return false ;
//    if ( ! b ) return false ;
  }
  else
  if ( type == "3" )
  {
    if ( ! DateUtils.isStandardDateFormat ( str ) ) return false ;
  }
  return true ;
}
GlobalAttributesClass.prototype.edit = function ( event )
{
  var ev = new TEvent ( event ) ;
  var xResult = GlobalAttributes.getAll() ;
  var w = new TWindow ( "Dialog.Edit.GlobalAttributes" ) ;
  w.create() ;
  var tab = w.getPeer ( "T_GLOBAL_ATTRIBUTES" ) ;
  var sep = TSys.getLocale(tab.dom).getDecimalSeparator() ;
  tab.addSetValuesListener ( function ( xRow )
  {
    var rs = xRow.getContent ( "ATTRIBUTE_TYPE_ID" ) ;
    if ( rs == "2" )
    {
      var rx = xRow.get ( "ATTRIBUTE_VALUE" ) ;
      if ( sep == ',' )
      {
        rx.setContent ( rx.getContent().replace ( /\./, "," ) ) ;
      }
    }
  } ) ;
  tab.addGetValuesListener ( function ( xRow )
  {
    var rs = xRow.getContent ( "ATTRIBUTE_TYPE_ID" ) ;
    if ( rs == "2" )
    {
      var rx = xRow.get ( "ATTRIBUTE_VALUE" ) ;
      rx.setContent ( rx.getContent().replace ( /,/, "." ) ) ;
    }
  } ) ;
  w.setValues ( xResult ) ;
  var tab = w.getPeer ( "T_GLOBAL_ATTRIBUTES" ) ;
  var en = tab.rows() ;
  while ( en.hasNext() )
  {
    var TR = en.next() ;
    var TD = TR.firstChild ;
    for ( var ch = TD.nextSibling ; ch ; ch = ch.nextSibling )
    {
      if ( ! ch.xInput ) continue ;
      if ( ch.xInput.type == "text" )
      {
        var xml = new TXml ( TR.domRow )
        var ATTRIBUTE_TYPE_ID = xml.getContent ( "ATTRIBUTE_TYPE_ID" ) ;
        if ( ATTRIBUTE_TYPE_ID == "2" ) ch.xInput.style.textAlign = 'right' ;
      }
    }
  }
  w.show() ;
} ;
GlobalAttributesClass.prototype.save = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var vals = w.getValues() ;
  try
  {
    GlobalAttributes.saveAll ( vals ) ;
    w.closeImediately() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
GlobalAttributesClass.prototype.modify = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var tab = w.getPeer ( "T_GLOBAL_ATTRIBUTES" ) ;
  var x = tab.getSelectedUserXml() ;
  if ( ! x )
  {
    var d = new TUserDialog ( "Please select an item." ) ;
    d.error() ;
    return ;
  }
  var old = x.ensureXml ( "OLD_ATTRIBUTE_NAME" ) ;
  old.setContent ( x.getContent ( "ATTRIBUTE_NAME" ) ) ;
  var ww = new TWindow ( "Dialog.Edit.GlobalAttributes.Modify" ) ;
  ww.create() ;
  ww.setValues( x ) ;
  ww.addAttribute ( "w", w ) ;
  ww.show() ;
} ;
GlobalAttributesClass.prototype.modifySave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var ATTRIBUTE_NAME = v.getContent ( "ATTRIBUTE_NAME" ) ;
  var OLD_ATTRIBUTE_NAME = v.getContent ( "OLD_ATTRIBUTE_NAME" ) ;
  var w = ev.getWindow() ;
  try
  {
    if ( OLD_ATTRIBUTE_NAME != ATTRIBUTE_NAME && TGlobals.globalAttributeAlreadyExists ( ATTRIBUTE_NAME ) )
    {
      var str = TSys.translate ( "AlreadyExistsArg0", null, [ ATTRIBUTE_NAME ] ) ;
      var d = new TUserDialog ( str ) ;
      d.error(w) ;
      return ;
    }
    TGlobals.saveModifiedGlobalAttribute ( v ) ;
    var pw = w.getAttribute ( "w" ) ;
    var xResult = GlobalAttributes.getAll() ;
    pw.setValues ( xResult ) ;
    var tab = pw.getPeer ( "T_GLOBAL_ATTRIBUTES" ) ;
    tab.findRow ( "ATTRIBUTE_NAME", ATTRIBUTE_NAME ).setSelected ( true, true ) ;
    var en = tab.rows() ;
    while ( en.hasNext() )
    {
      var TR = en.next() ;
      var TD = TR.firstChild ;
      for ( var ch = TD.nextSibling ; ch ; ch = ch.nextSibling )
      {
        if ( ! ch.xInput ) continue ;
        if ( ch.xInput.type == "text" )
        {
          var xml = new TXml ( TR.domRow )
          var ATTRIBUTE_TYPE_ID = xml.getContent ( "ATTRIBUTE_TYPE_ID" ) ;
          if ( ATTRIBUTE_TYPE_ID == "2" ) ch.xInput.style.textAlign = 'right' ;
        }
      }
    }
    w.closeImediately() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
GlobalAttributesClass.prototype.addNew = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = new TWindow ( "Dialog.Edit.GlobalAttributes.New" ) ;
  w.create() ;
  w.addAttribute ( "w", ev.getWindow() ) ;
  w.show() ;
} ;
GlobalAttributesClass.prototype.addNewSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var ATTRIBUTE_NAME = v.getContent ( "ATTRIBUTE_NAME" ) ;
  var w = ev.getWindow() ;
  try
  {
    if ( TGlobals.globalAttributeAlreadyExists ( ATTRIBUTE_NAME ) )
    {
      var str = TSys.translate ( "AlreadyExistsArg0", null, [ ATTRIBUTE_NAME ] ) ;
      var d = new TUserDialog ( str ) ;
      d.error(w) ;
      return ;
    }
    TGlobals.saveNewGlobalAttribute ( v ) ;
    var pw = w.getAttribute ( "w" ) ;
    var xResult = GlobalAttributes.getAll() ;
    pw.setValues ( xResult ) ;
    var tab = pw.getPeer ( "T_GLOBAL_ATTRIBUTES" ) ;
    tab.findRow ( "ATTRIBUTE_NAME", ATTRIBUTE_NAME ).setSelected ( true, true ) ;
    var en = tab.rows() ;
    while ( en.hasNext() )
    {
      var TR = en.next() ;
      var TD = TR.firstChild ;
      for ( var ch = TD.nextSibling ; ch ; ch = ch.nextSibling )
      {
        if ( ! ch.xInput ) continue ;
        if ( ch.xInput.type == "text" )
        {
          var xml = new TXml ( TR.domRow )
          var ATTRIBUTE_TYPE_ID = xml.getContent ( "ATTRIBUTE_TYPE_ID" ) ;
          if ( ATTRIBUTE_TYPE_ID == "2" ) ch.xInput.style.textAlign = 'right' ;
        }
      }
    }
    w.closeImediately() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
GlobalAttributesClass.prototype.remove = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var tab = w.getPeer ( "T_GLOBAL_ATTRIBUTES" ) ;
  var x = tab.getSelectedUserXml() ;
  if ( ! x )
  {
    var d = new TUserDialog ( "Please select an item." ) ;
    d.error() ;
    return ;
  }

  var d = new TUserDialog ( "AreYouSureToDeleteSelectedItem" ) ;
  var ATTRIBUTE_NAME = x.getContent ( "ATTRIBUTE_NAME" ) ;
  d.callOnConfirmation ( this.remove2, [ w, ATTRIBUTE_NAME ], this )
  d.askYesNo() ;
} ;
GlobalAttributesClass.prototype.remove2 = function ( w, ATTRIBUTE_NAME )
{
  TGlobals.removeGlobalAttribute ( ATTRIBUTE_NAME ) ;
  var xResult = GlobalAttributes.getAll() ;
  w.setValues ( xResult ) ;
  var tab = w.getPeer ( "T_GLOBAL_ATTRIBUTES" ) ;
  var en = tab.rows() ;
  while ( en.hasNext() )
  {
    var TR = en.next() ;
    var TD = TR.firstChild ;
    for ( var ch = TD.nextSibling ; ch ; ch = ch.nextSibling )
    {
      if ( ! ch.xInput ) continue ;
      if ( ch.xInput.type == "text" )
      {
        var xml = new TXml ( TR.domRow )
        var ATTRIBUTE_TYPE_ID = xml.getContent ( "ATTRIBUTE_TYPE_ID" ) ;
        if ( ATTRIBUTE_TYPE_ID == "2" ) ch.xInput.style.textAlign = 'right' ;
      }
    }
  }
  w.getComponent ( "PB.Modify" ).setEnabled ( false ) ;
  w.getComponent ( "PB.Remove" ).setEnabled ( false ) ;
} ;
GlobalAttributes = new GlobalAttributesClass() ;

/**
 *  @constructor
 */
var CalypsoClass = function()
{
  this.DB_REQUEST = undefined ;
  this.DB_EXECUTE_STMT = undefined ;
  this.traceMessage = false ;
  this.retry = true ;
}
CalypsoClass.prototype =
{
  jsClassName: 'Calypso',
  tsActionServletName: "CoDataFactory",
  coDefaultAction: "Execute",
  setTraceMessageShort: function()
  {
    this.traceMessageShort = "short" ;
  },
  setTraceMessage: function()
  {
    this.traceMessage = "true" ;
  },
  setTraceMessageOff: function()
  {
    this.traceMessage = false ;
  },
  get_DB_REQUEST: function()
  {
    if ( this.DB_REQUEST ) return this.DB_REQUEST ;
    this.DB_REQUEST = TSys.getWebConfig().getValue ( "DB_REQUEST", "DB:REQUEST" ) ;
    return this.DB_REQUEST ;
  },
  get_DB_EXECUTE_STMT: function()
  {
    if ( this.DB_EXECUTE_STMT ) return this.DB_EXECUTE_STMT ;
    this.DB_EXECUTE_STMT = TSys.getWebConfig().getValue ( "DB_EXECUTE_STMT", "DB:EXECUTE-STMT" ) ;
    return this.DB_EXECUTE_STMT ;
  },
  getUrl: function ( action )
  {
    return this.tsActionServletName
	   + "?coAction=" + ( action ? action : this.coDefaultAction )
	   + ( this.traceMessage ? "&trace-message=" + this.traceMessage : "" )
	   ;
  },
  getActionServletName: function()
  {
    return this.tsActionServletName ;
  },
  get: function ( tsMsg, tsAction )
  {
    var url0 = this.getUrl(tsAction) ;
    var url = url0 ;
    var HTTP = TSys.httpPost ( url, tsMsg.toString() ) ;
    if ( HTTP.status == 0 && this.retry )
    {
      url = url0 ;
      HTTP = TSys.httpPost ( url, tsMsg.toString() ) ;
    }
    return HTTP ;
  },
  getDbv2: function ( msg, callback, self )
  {
    if ( typeof ( NetResource ) != 'undefined' && TSys.getWebConfig().getBool ( "AuditLog", true ) )
    {
      try
      {
        var auditEvent = new AuditEvent() ;
        auditEvent.setAction ( msg.taskName ) ;
        var t = msg.toString() ;
        var t = t.substring ( t.indexOf ( "<NamedVariables>" ) + "<NamedVariables>".length
                            , t.lastIndexOf ( "</NamedVariables>" )
                            ) ;
        auditEvent.setText ( t ) ;
        NetResource.auditlog ( auditEvent ) ;
      }
      catch ( exc)
      {
        // TSys.log ( exc ) ;
      }
    }
    if ( ! callback )
    {
      var HTTP = this.get ( msg ) ;
      if ( HTTP.status == 200 )
      {
        var dbv = new CoDbv ( HTTP.responseXML.documentElement ) ;
        if ( msg.nameSpace ) dbv.setNameSpace ( msg.nameSpace ) ;
        return dbv ;
      }
      if (  HTTP.responseText
         && HTTP.responseText.indexOf ( "<ERROR" ) > 0
         && HTTP.responseText.indexOf ( "<NamedVariables" ) > 0
         )
      {
        var v = new CoDbv ( HTTP.responseXML.documentElement ) ;
        if ( msg.nameSpace ) v.setNameSpace ( msg.nameSpace ) ;
        throw v.getErrorMessage() ;
      }
      TSys.throwHttpStatusException ( HTTP ) ;
    }

    var url = this.getUrl() ;
    var fe = new TFunctionExecutor ( self, callback ) ;
    TSys.httpPost ( url, msg, function ( HTTP )
    {
      if ( HTTP.readyState != 4 ) return ;
      if ( HTTP.status == 200 )
      {
        var dbv = new CoDbv ( HTTP.responseXML.documentElement ) ;
        if ( msg.nameSpace ) dbv.setNameSpace ( msg.nameSpace ) ;
        fe.execute ( [ dbv ] ) ;
        return ;
      }
      if (  HTTP.responseText
         && HTTP.responseText.indexOf ( "<ERROR" ) > 0
         && HTTP.responseText.indexOf ( "<NamedVariables" ) > 0
         )
      {
        var dbv = new CoDbv ( HTTP.responseXML.documentElement ) ;
        if ( msg.nameSpace ) dbv.setNameSpace ( msg.nameSpace ) ;
        fe.execute ( [ dbv ] ) ;
        return ;
      }
      fe.execute ( [ HTTP.responseText ] ) ;
      return ;
    } );
  },
  getDbv: function ( msg, callback, self )
  {
    return this.getDbv2 ( msg, callback, self ) ;
  },
  getHttpDocument: function ( msg )
  {
    msg.setReturnFromArgs ( true ) ;
    var url = this.getUrl() ;
    var HTTP = TSys.httpPost ( url, msg.toString() ) ;
    if ( HTTP.status != 200 )
    {
      TSys.throwHttpStatusException ( HTTP ) ;
    }
    return HTTP.responseText ;
  },
  getHttpDocumentUrl: function ( msg, mimeType, docName )
  {
    if ( mimeType ) msg.setReturnFromArgsMimeType ( mimeType ) ;
    else            msg.setReturnFromArgs ( true ) ;
    var url = this.getUrl ( "CacheDocument" ) ;
    var HTTP = TSys.httpPost ( url, msg.toString() ) ;
    if ( HTTP.status != 200 )
    {
      TSys.throwHttpStatusException ( HTTP ) ;
    }
    var t = HTTP.responseText ;
    var newUrl = this.getUrl ( "RetrieveCachedDocument" ) + "&key=" + t ;
    if ( docName ) newUrl += "&name=" + encodeURIComponent ( docName ) ;
    return newUrl ;
  },
  getHttpDocumentUrlForStream: function ( msg, mimeType, docName )
  {
    if ( mimeType ) msg.setReturnFromArgsMimeType ( mimeType ) ;
    else            msg.setReturnFromArgs ( true ) ;
    var url = this.getUrl ( "CacheDocument" ) ;
    var HTTP = TSys.httpPost ( url, msg.toString() ) ;
    if ( HTTP.status != 200 )
    {
      TSys.throwHttpStatusException ( HTTP ) ;
    }
    var t = HTTP.responseText ;
    var newUrl = this.getUrl ( "RetrieveCachedDocumentAsStream" ) + "&key=" + t ;
    if ( docName ) newUrl += "&name=" + encodeURIComponent ( docName ) ;
    return newUrl ;
  },
  downloadDocument: function ( msg, mimeType, docName, callback )
  {
    var cb = callback ;
    if ( typeof ( mimeType ) == 'function' )
    {
      cb = mimeType ;
      mimeType = undefined ;
    }
    var isPlain = mimeType == "html" || mimeType == "htm" || mimeType == "xml" || mimeType == "dssxml" ;
    if  ( typeof ( opera ) != 'undefined' ) isPlain = true ;
    if ( mimeType && mimeType.indexOf ( "/" ) > 0 ) msg.setReturnFromArgsMimeType ( mimeType ) ;
    else                                            msg.setReturnFromArgs ( true ) ;
    var u = this.getUrl ( "CacheDocument" ) ;
    var thiz = this ;
    TSys.httpPost ( u, msg.toString(), function ( HTTP )
    {
      if ( HTTP.readyState != 4 ) return ;
      thiz.downloadDocumentCallback ( HTTP, docName, isPlain, cb ) ;
    } ) ;
  },
  downloadDocumentCallback: function ( HTTP, docName, isPlain, callback )
  {
    if ( HTTP.status != 200 )
    {
      if ( typeof ( callback ) == 'function' )
      {
        try
	{
          callback ( HTTP ) ;
	}
	catch ( exc )
	{
	  TSys.log ( exc ) ;
	}
        return ;
      }
      var s = TSys.createHttpStatusText ( HTTP ) ;
      if ( s )
      {
        var d = new TUserDialog ( s ) ;
        d.error() ;
      }
      return ;
    }
    var t = HTTP.responseText ;
    var p1 = "" ;
    if ( TSys.isIE() )
    {
      if ( TSys.getWebConfig().getBool ( "IE-SPECIAL-DOWNLOAD", false ) )
      {
        p1 = "&usehtmlenvelope=true" ;
      }
    }
    var nuUrl = this.getUrl ( "RetrieveCachedDocument" ) + p1 + "&key=" + t ;
    if ( docName ) nuUrl += "&name=" + encodeURIComponent ( docName ) ;

    if ( TSys.isIE() )
    {
      if ( TSys.getWebConfig().getBool ( "IE-SPECIAL-DOWNLOAD", false ) )
      {
        window.open( nuUrl, "", "menubar=yes,toolbar=yes,scrollbars=yes,locationbar=yes,resizable=yes,dependent=yes" ) ;
      }
      else
      {
        location.href  = nuUrl ;
      }
    }
    else
    if ( ! isPlain )
    {
      location.href  = nuUrl ;
    }
    else
    {
      window.open( nuUrl, "", "menubar=yes,toolbar=yes,scrollbars=yes,locationbar=yes,resizable=yes,dependent=yes" ) ;
    }
  }
} ;
CalypsoClass.prototype.getXml = function ( msg, callback, self, errorCallback )
{
  if ( !msg || typeof ( msg ) != 'object' )
  {
    throw "Calypso::getXml(): msg is not an CoMessage\n" + String ( msg ) ;
  }
  if ( msg.jsClassName != 'CoMessage' )
  {
    throw "Calypso::getXml(): msg is not an CoMessage\n" + String ( msg ) ;
  }
  var sMsg = msg.toString() ;
  var url = this.getUrl() ;
  if ( ! callback )
  {
    var HTTP = TSys.httpPost ( url, msg ) ;
    if ( HTTP.status != 200 )
    {
      if ( typeof ( errorCallback ) == 'function' )
      {
        errorCallback ( HTTP ) ;
        return ;
      }
      if ( HTTP.status == 403 )
      {
        if ( TSys.loggedIn )
        {
          var d = new TUserDialog ( "SessionEndedLoginAgain" ) ;
          d.setUserFunction ( function(){TSys.logout();} ) ;
          d.info() ;
        }
      }

      var t = TSys.createHttpStatusText ( HTTP ) ;
      if ( ! TSys.showNativeErrors )
      {
        throw t ;
      }
      if ( t )
      {
        var d = new TUserDialog ( t ) ;
        d.error() ;
      }
      return null ;
    }
    var rx = HTTP.responseXML ;
    if ( ! rx ) return null ;
    var xData = new TXml ( rx ) ;
    var xml = xData.getXml ( "xml" ) ;
    if ( xml )
    {
      xml.domDoc = xData.domDoc ;
      return xml ;
    }
    return xData ;
  }
  var fe = new TFunctionExecutor ( self, callback ) ;
  TSys.httpPost ( url, msg, function ( HTTP )
  {
    if ( HTTP.readyState != 4 ) return ;
    if ( HTTP.status != 200 )
    {
      if ( typeof ( errorCallback ) == 'function' )
      {
        errorCallback ( HTTP ) ;
        return ;
      }
      var t = TSys.createHttpStatusText ( HTTP ) ;
      if ( t )
      {
        if ( ! TSys.showNativeErrors )
        {
          TSys.log ( t ) ;
          return ;
        }
        t = "ThisServiceIsCurrentlyNotAvailable" ;
        var d = new TUserDialog ( t ) ;
        d.error() ;
      }
      return ;
    }
    var rx = HTTP.responseXML ;
    var xml = null ;
    var xData = null ;
    if ( rx )
    {
      xData = new TXml ( HTTP.responseXML.documentElement ) ;
      xml = xData.getXml ( "xml" ) ;
    }
    if ( xml )
    {
      xml.domDoc = xData.domDoc ;
      fe.execute ( [ xml ] ) ;
    }
    else
    {
      fe.execute ( [ xData ] ) ;
    }
  } ) ;
}

/**
 *  @constructor
 */
var CoMessage = function ( taskName )
{
  if ( ! taskName ) return ;
  this.taskName = taskName ;
  this.namedVariables = new Array() ;
  this.returnFromArgsMimeType = null ;
  this.returnFromArgs = false ;
  this.xmlData = null ;
  this.xmlDataTransparent = false ;
  this.uid = TSys.uid ;
  this.pwd = TSys.pwd ;
  this.language = TSys.userLanguage ? TSys.userLanguage : "de" ;
  this.jsClassName = "CoMessage" ;
  this.nameSpace = null ;
  this.nameSpaceFromConstructor = false ;
  var pos = taskName.indexOf ( "::" ) ;
  if  ( pos > 0 )
  {
    this.nameSpaceFromConstructor = true ;
    this.nameSpace = taskName.substring ( 0, pos ) ;
    this.taskName = taskName.substring ( pos + 2 ) ;
  }
  if ( ! this.nameSpace )
  {
    this.nameSpace = TSys.getWebConfig().getNamespace() ;
  }
  this.attributeNames = null ;
  this.attributeValues = null ;
  this.host = "" ;
  this.port = "" ;
}
CoMessage.prototype =
{
  setHost: function ( host )
  {
    this.host = host ;
  },
  setPort: function ( port )
  {
    this.port = port ;
  },
  addAttribute: function ( name, value )
  {
    if ( ! this.attributeNames )
    {
      this.attributeNames = [] ;
      this.attributeValues = [] ;
    }
    if ( typeof ( name ) != 'string' ) return ;
    if (  typeof ( value ) != 'string'
       && typeof ( value ) != 'number'
       && typeof ( value ) != 'boolean'
       )
    {
      return ;
    }
    this.attributeNames.push ( name ) ;
    this.attributeValues.push ( value ) ;
  },
  setNameSpace: function ( nameSpace )
  {
    this.nameSpace = nameSpace ;
  },
  getNameSpace: function ( nameSpace )
  {
    this.nameSpace = nameSpace ;
  },
  setReturnFromArgs: function ( state )
  {
    this.returnFromArgs = state ? true : false ;
  },
  setReturnFromArgsMimeType: function ( mimeType )
  {
    this.returnFromArgsMimeType = mimeType ;
  },
  setReturnDocumentFromNamedVariables: function ( namedVariablesName, namedVariablesKey )
  {
    this.returnDocumentFromNamedVariablesName = namedVariablesName ;
    this.returnDocumentFromNamedVariablesKey = namedVariablesKey ;
  },
  setXmlData: function ( xmlString )
  {
    this.xmlData = xmlString ;
  },
  addXmlData: function ( xmlString, value )
  {
    if ( value )
    {
      xmlString = "<" + xmlString + ">" + value + "</" + xmlString + ">" ;
    }
    if ( ! this.xmlData ) this.xmlData = xmlString ;
    else                  this.xmlData += xmlString ;
  },
  addNamedVariable: function ( nv )
  {
    this.namedVariables.push ( nv ) ;
  },
  setUid: function ( uid )
  {
    this.uid = uid ;
  },
  setPwd: function ( pwd )
  {
    this.pwd = pwd ;
  },
  toString: function()
  {
    var namespace = this.nameSpace ;
    if ( ! this.nameSpaceFromConstructor && ( this.host || this.port ) )
    {
      namespace = "" ;
    }
    var s = "<xml>\n"
          + "<Task>" + ( namespace ? namespace + "::" : "" ) + this.taskName + "</Task>\n"
          + "<User>\n"
          + "<Uid>" + this.uid + "</Uid>\n"
          + "<Pwd>" + this.pwd + "</Pwd>\n"
          + "<Language>" + this.language + "</Language>\n"
          + "</User>\n"
          + "<XmlDataTransparent>" + this.xmlDataTransparent + "</XmlDataTransparent>\n"
          + ( this.host ? "<Host>" + this.host + "</Host>\n" : "" )
          + ( this.port ? "<Port>" + this.port + "</Port>\n" : "" )
          ;
    var TIMEZONE_ID = DateUtils.getTimeZoneId() ;
    if ( ! this.attributeNames )
    {
      s += "<Attributes>\n" ;
      s += "<TIMEZONE_ID>" + TIMEZONE_ID + "</TIMEZONE_ID>\n" ;
      s += "</Attributes>\n" ;
    }
    else
    {
      s += "<Attributes>\n" ;
      s += "<TIMEZONE_ID>" + TIMEZONE_ID + "</TIMEZONE_ID>\n" ;
      for ( var i = 0 ; i < this.attributeNames.length ; i++ )
      {
        s += "<" + this.attributeNames[i] + ">"
           + "<![CDATA[" + this.attributeValues[i] + "]]>"
           + "</" + this.attributeNames[i] + ">\n"
           ;
      }
      s += "</Attributes>\n" ;
    }
    var returnDocumentAttributes = "" ;
    if ( this.returnDocumentFromNamedVariablesName )
    {
      returnDocumentAttributes = " namedVariablesName='" + this.returnDocumentFromNamedVariablesName +"' "
                               + " namedVariablesKey='" + this.returnDocumentFromNamedVariablesKey + "'"
                               ;
    }
    if ( this.returnFromArgsMimeType )
    {
      s += "<ReturnFromArgs index=0 mimeType='" + this.returnFromArgsMimeType + "' " + returnDocumentAttributes + "/>\n"
    }
    else
    if ( this.returnFromArgs )
    {
      s += "<ReturnFromArgs index=0 " + returnDocumentAttributes + "/>\n"
    }
    if ( this.xmlData )
    {
      s += "<data>" ;
      s += this.xmlData ;
      s += "</data>" ;
    }
    if ( this.namedVariables.length > 0 )
    {
      s += "<NamedVariables>\n" ;
      for ( var i = 0 ; i < this.namedVariables.length ; i++ )
      {
        var t = this.namedVariables[i].toString() ;
        if ( t ) s += t ;
      }
      s += "</NamedVariables>\n" ;
    }
    s += "</xml>\n"
    return s ;
  }
}
/**
 *  @constructor
 */
var CoDbRefQuery = function ( tableName, optionColumn, valueColumn, nameColumn, where )
{
  this.tableName = tableName ;
  this.optionColumn = optionColumn ;
  this.valueColumn = valueColumn ;
  this.nameColumn = nameColumn ;
  this.where = where ;
  this.tag = "RefQuery"

  if ( ! this.nameColumn && ! this.where ) this.nameColumn = this.valueColumn ;
}
CoDbRefQuery.prototype =
{
  toString: function()
  {
    var s = "<" + this.tag + ">\n"
          + "<Table>" + this.tableName + "</Table>\n"
          + "<Name>" + this.nameColumn + "</Name>\n"
          + "<Option>" + this.optionColumn + "</Option>\n"
          ;
    if ( this.valueColumn )
    {
      s += "<Value>" + this.valueColumn + "</Value>\n" ;
    }
    if ( this.where )
    {
      s += "<Where><![CDATA[" + this.where + "]]></Where>\n"
    }
    s += "</" + this.tag + ">\n"
    return s ;
  }
}
/**
 *  @constructor
 */
var CoDbSelect = function ( tagName, selectStatement, hostValues )
{
  this.columns = [] ;
  this.tagName = "" ;
  this.hostValues = [] ;
  this.tag = "Select"
  this.formatHtml = false ;
  this.download = false ;
  this.limit = "" ;
  if ( tagName && ! selectStatement && ! hostValues )
  {
    selectStatement = tagName ; tagName = "" ;
  }
  else
  if ( typeof ( tagName ) == 'string' && TSys.isArray ( selectStatement ) && ! hostValues )
  {
    hostValues = selectStatement ;
    selectStatement = tagName ;
    tagName = "" ;
  }
  this.selectStatement = selectStatement ;
  if ( typeof ( hostValues ) == 'string' || typeof ( hostValues ) == 'number' )
  {
    this.addHostValue ( String ( hostValues ) ) ;
  }
  else
  if ( TSys.isArray ( hostValues ) )
  {
    for ( var i = 0 ; i < hostValues.length ; i++ )
    {
      this.addHostValue ( hostValues[i] ) ;
    }
  }
  if ( tagName ) this.setTagName ( tagName ) ;
}
/*
<Select>
  <SelectStatement>
        select  ...
  </SelectStatement>
  <Columns />
  <TagName>T_ORDER_TO_CATEGORY</TagName>
  <HostValues>
    <Value>10274</Value>
  </HostValues>
</Select>
*/

CoDbSelect.prototype.setTagName = function ( name )
{
  this.tagName = name ;
}
CoDbSelect.prototype.setLimit = function ( limit )
{
  this.limit = limit ;
}
CoDbSelect.prototype.setFormatHtml = function()
{
  this.formatHtml = true ;
}
CoDbSelect.prototype.setDownload = function()
{
  this.download = true ;
}
CoDbSelect.prototype.addColumnName = function ( name )
{
  this.columns.push ( name ) ;
}
CoDbSelect.prototype.addHostValue = function ( value )
{
  this.hostValues.push ( value ) ;
}
CoDbSelect.prototype.toString = function()
{
  var dateFormat = DateUtils.getDateTimeFormatShort() ;
  var s = "<" + this.tag + ">\n"
        + "<SelectStatement><![CDATA[" + this.selectStatement + "]]></SelectStatement>\n"
        + "<TagName>" + this.tagName + "</TagName>\n"
        + "<Html>" + this.formatHtml + "</Html>\n"
        + "<Download>" + this.download + "</Download>\n"
        + "<DateFormat>" + dateFormat + "</DateFormat>\n"
        + ( this.limit ? "<Limit>" + this.limit + "</Limit>\n" : "" )
        ;
  if ( this.columns.length )
  {
    s += "<Columns>\n" ;
    for ( var i = 0 ; i < this.columns.length ; i++ )
    {
      s += "<Column>" + this.columns[i] + "</Column>\n" ;
    }
    s += "</Columns>\n" ;
  }
  if ( this.hostValues.length )
  {
    s += "<HostValues>\n" ;
    for ( var i = 0 ; i < this.hostValues.length ; i++ )
    {
      s += "<Value>" + this.hostValues[i] + "</Value>\n" ;
    }
    s += "</HostValues>\n" ;
  }
  s += "</" + this.tag + ">\n"
  return s ;
}
/**
 *  @constructor
 */
var CoDbXStatement = function ( statementName )
{
  if ( ! statementName ) return ;
  this.statementName = statementName ;
  if ( ! statementName ) throw "CoDbXStatement: Missing argument statementName" ;
  this.elements = null ;
  this.dbQuery = null ;
  this.xmlElementNames = [] ;
  this.xmlElements = [] ;
}
CoDbXStatement.prototype =
{
  setDbQuery: function ( dbQuery )
  {
    this.dbQuery = dbQuery ;
  },
  addElement: function ( name, value )
  {
    if ( typeof ( value ) == 'string' )
    {
      if ( ! this.elements ) this.elements = "" ;
      this.elements += "<" + name + "><![CDATA[" + value + "]]></" + name + ">" ;
    }
    else
    if ( typeof ( value ) == 'number' )
    {
      if ( ! this.elements ) this.elements = "" ;
      this.elements += "<" + name + "><![CDATA[" + value + "]]></" + name + ">" ;
    }
    else
    if ( typeof ( value ) == 'object' && value.jsClassName == "TXml" )
    {
      this.xmlElementNames.push ( name ) ;
      this.xmlElements.push ( value ) ;
    }
    else
    if ( ! value && typeof ( name ) == 'object' && name.jsClassName == "TXml" )
    {
      this.xmlElements.push ( name ) ;
    }
    else
    {
      throw "CoDbXStatement.addElement(): Invalid value type:\n" + value ;
    }
  },
  toString: function()
  {
    var s = "<STMT>\n"
          + "<ID>" + this.statementName + "</ID>\n"
          ;
    if ( this.elements ) s += this.elements ;
    if ( this.dbQuery )
    {
      s += "<Query>\n" ;
      s += this.dbQuery ;
      s += "</Query>\n" ;
    }
    if ( this.xmlElementNames && this.xmlElementNames.length > 0 )
    {
      for ( var i = 0 ; i < this.xmlElementNames.length ; i++ )
      {
        s += "<" + this.xmlElementNames[i] + ">\n" ;
        s += this.xmlElements[i].toString() ;
        s += "\n</" + this.xmlElementNames[i] + ">\n" ;
      }
    }
    else
    if ( this.xmlElements && this.xmlElements.length > 0 )
    {
      for ( var i = 0 ; i < this.xmlElements.length ; i++ )
      {
        s += this.xmlElements[i].toString() ;
      }
    }
    s += "</STMT>\n"
    return s ;
  }
}
/**
 *  @constructor
 */
var CoDbInsert = function ( tableName )
{
  if ( ! tableName ) return ;
  this.tableName = tableName ;
  this.keyColumns = [] ;
  this.keyValues = [] ;
  this.generatedKeyColumns = [] ;
  this.columns = [] ;
  this.values = [] ;
  this.columnAttrNames = [] ;
  this.columnAttrValues = [] ;
}
CoDbInsert.prototype.addColumn = function ( name, value )
{
  this.columns.push ( name ) ;
  this.values.push ( value ) ;
  this.columnAttrNames.push ( false ) ;
  this.columnAttrValues.push ( false ) ;
}
CoDbInsert.prototype.addEncryptColumn = function ( name, value ) // TODO
{
  this.columns.push ( columnName ) ;
  this.values.push ( value ) ;
  this.columnAttrNames.push ( "isEncryptColumn" ) ;
  this.columnAttrValues.push ( "true" ) ;
} ;
CoDbInsert.prototype.addKeyColumn = function ( name, value )
{
  this.keyColumns.push ( name ) ;
  this.keyValues.push ( value ) ;
}
CoDbInsert.prototype.addGeneratedKeyColumn = function ( name )
{
  this.generatedKeyColumns.push ( name ) ;
}
CoDbInsert.prototype.toString = function()
{
  var s = "<Insert>\n"
        + "<Table>" + this.tableName + "</Table>\n"
        + "<row>\n"
        ;
  for ( var i = 0 ; i < this.columns.length ; i++ )
  {
    s += "<" + this.columns[i] ;
    if ( this.columnAttrNames[i] && this.columnAttrValues[i] )
    {
      s += " " + this.columnAttrNames[i] + "='" + this.columnAttrValues[i] + "'" ;
    }
    s += "><![CDATA[" + this.values[i] + "]]></" + this.columns[i] + ">\n" ;
  } 
  for ( var i = 0 ; i < this.keyColumns.length ; i++ )
  {
    s += "<" + this.keyColumns[i] + " key='true' ><![CDATA[" + this.keyValues[i] + "]]></" + this.keyColumns[i] + ">\n" ;
  } 
  s += "</row>\n" ;
  if ( this.generatedKeyColumns.length )
  {
    s += "<GeneratedKeyColumns>\n" ;
    for ( var i = 0 ; i < this.generatedKeyColumns.length ; i++ )
    {
      s += "<" + this.generatedKeyColumns[i] + "/>\n" ;
    }
    s += "</GeneratedKeyColumns>\n" ;
  }
  s += "</Insert>\n" ;
  return s ;
}
/**
 *  @constructor
 */
var CoDbDelete = function ( tableName, where )
{
  if ( ! tableName ) return ;
  this.tableName = tableName ;
  if ( ! tableName ) throw ( "CoDbDelete: Missing argument tableName" ) ;
  this.columnNames = [] ;
  this.columnValues = [] ;
  this.keyColumns = [] ;
  this.where = where ;
  this.tag = "Delete" ;
  this.lastModifiedColumns = [] ;
}
CoDbDelete.prototype.addKeyColumn = function ( name, value )
{
  if ( typeof ( value ) == 'object' )
  {
    if ( value && value.jsClassName == 'TXml' ) this.columnValues.push ( value.getContent ( name ) ) ;
  }
  else this.columnValues.push ( value ) ;
  this.columnNames.push ( name ) ;
  this.keyColumns.push ( true ) ;
  this.lastModifiedColumns.push ( false ) ;
}
CoDbDelete.prototype.addLastModifiedColumn = function ( name, value )
{
  if ( typeof ( value ) == 'object' )
  {
    if ( value && value.jsClassName == 'TXml' ) this.columnValues.push ( value.getContent ( name ) ) ;
  }
  else this.columnValues.push ( value ) ;
  this.columnNames.push ( name ) ;
  this.keyColumns.push ( false ) ;
  this.lastModifiedColumns.push ( true ) ;
}
CoDbDelete.prototype.toString = function()
{
  var s = "<" + this.tag + ">\n"
        + "<Table>" + this.tableName + "</Table>\n"
        + "<row>\n"
        ;
  for ( var i = 0 ; i < this.columnNames.length ; i++ )
  {
    var sa = null ;
    if ( this.keyColumns[i] || this.lastModifiedColumns[i] )
    {
      sa = "" ;
      if ( this.keyColumns[i] )
      {
        sa += " key='true' " ;
      }
      if ( this.lastModifiedColumns[i] )
      {
        sa += " lastModificationDate='true' " ;
      }
    }

    if ( sa )
    {
      s += "<" + this.columnNames[i] + sa + "><![CDATA["
         + this.columnValues[i]
         + "]]></" + this.columnNames[i] + ">\n"
         ;
    }
    else
    {
      s += "<" + this.columnNames[i] + "><![CDATA["
         + this.columnValues[i]
         + "]]></" + this.columnNames[i] + ">\n"
         ;
    }
  } 
  s += "</row>\n" ;

  sa = null ;
  if ( this.where )
  {
    s += "<Where><![CDATA[" + this.where + "]]></Where>\n"
  }
  s += "</" + this.tag + ">\n" ;
  return s ;
}

/**
 *  @constructor
 */
var CoDbUpdate = function ( tableName, where )
{
  if ( ! tableName ) return ;
  this.tableName = tableName ;
  if ( ! tableName ) throw ( "CoDbUpdate: Missing argument tableName" ) ;
  this.columnNames = [] ;
  this.columnValues = [] ;
  this.keyColumns = [] ;
  this.nullColumns = [] ;
  this.where = where ;
  this.tag = "Update" ;
  this.lastModifiedColumns = [] ;
  this.generatedKeyColumns = [] ;
  this.columnAttrNames = [] ;
  this.columnAttrValues = [] ;
}
CoDbUpdate.prototype.addEncryptColumn = function ( name, value )
{
  this.columns.push ( columnName ) ;
  this.values.push ( value ) ;
  this.keyColumns.push ( false ) ;
  this.nullColumns.push ( false ) ;
  this.lastModifiedColumns.push ( false ) ;
  this.generatedKeyColumns.push ( false ) ;
  this.columnAttrNames.push ( "isEncryptColumn" ) ;
  this.columnAttrValues.push ( "true" ) ;
} ;
CoDbUpdate.prototype.addColumn = function ( name, value )
{
  if ( typeof ( value ) == 'object' )
  {
    if ( value && value.jsClassName == 'TXml' ) this.columnValues.push ( value.getContent ( name ) ) ;
  }
  else this.columnValues.push ( value ) ;
  this.columnNames.push ( name ) ;
  this.keyColumns.push ( false ) ;
  this.nullColumns.push ( false ) ;
  this.lastModifiedColumns.push ( false ) ;
  this.generatedKeyColumns.push ( false ) ;
  this.columnAttrNames.push ( false ) ;
  this.columnAttrValues.push ( false ) ;
}
CoDbUpdate.prototype.addKeyColumn = function ( name, value )
{
  if ( typeof ( value ) == 'object' )
  {
    if ( value && value.jsClassName == 'TXml' ) this.columnValues.push ( value.getContent ( name ) ) ;
  }
  else this.columnValues.push ( value ) ;
  this.columnNames.push ( name ) ;
  this.keyColumns.push ( true ) ;
  this.nullColumns.push ( false ) ;
  this.lastModifiedColumns.push ( false ) ;
  this.generatedKeyColumns.push ( false ) ;
  this.columnAttrNames.push ( false ) ;
  this.columnAttrValues.push ( false ) ;
}
CoDbUpdate.prototype.addLastModifiedColumn = function ( name, value )
{
  if ( typeof ( value ) == 'object' )
  {
    if ( value && value.jsClassName == 'TXml' ) this.columnValues.push ( value.getContent ( name ) ) ;
  }
  else this.columnValues.push ( value ) ;
  this.columnNames.push ( name ) ;
  this.keyColumns.push ( false ) ;
  this.nullColumns.push ( false ) ;
  this.lastModifiedColumns.push ( true ) ;
  this.generatedKeyColumns.push ( false ) ;
  this.columnAttrNames.push ( false ) ;
  this.columnAttrValues.push ( false ) ;
}
CoDbUpdate.prototype.addNullColumn = function ( name )
{
  this.columnNames.push ( name ) ;
  this.columnValues.push ( "" ) ;
  this.keyColumns.push ( false ) ;
  this.nullColumns.push ( true ) ;
  this.lastModifiedColumns.push ( false ) ;
  this.generatedKeyColumns.push ( false ) ;
  this.columnAttrNames.push ( false ) ;
  this.columnAttrValues.push ( false ) ;
}
CoDbUpdate.prototype.addGeneratedKeyColumn = function ( name )
{
  this.columnNames.push ( name ) ;
  this.columnValues.push ( "" ) ;
  this.keyColumns.push ( false ) ;
  this.nullColumns.push ( false ) ;
  this.lastModifiedColumns.push ( false ) ;
  this.generatedKeyColumns.push ( true ) ;
  this.columnAttrNames.push ( false ) ;
  this.columnAttrValues.push ( false ) ;
}
CoDbUpdate.prototype.toString = function()
{
  var s = "<" + this.tag + ">\n"
        + "<Table>" + this.tableName + "</Table>\n"
        + "<row>\n"
        ;
  for ( var i = 0 ; i < this.columnNames.length ; i++ )
  {
    var sa = null ;
    if ( this.generatedKeyColumns[i] ) continue ;
    if ( this.keyColumns[i] || this.nullColumns[i] || this.lastModifiedColumns[i] || this.columnAttrNames[i] )
    {
      sa = "" ;
      if ( this.keyColumns[i] )
      {
        sa += " key='true' " ;
      }
      if ( this.nullColumns[i] )
      {
        sa += " isNull='true' " ;
      }
      if ( this.lastModifiedColumns[i] )
      {
        sa += " lastModificationDate='true' " ;
      }
      if ( this.columnAttrNames[i] )
      {
        sa += " " + this.columnAttrNames[i] + "='" + this.columnAttrValues[i] + "' " ;
      }
    }


    if ( sa )
    {
      s += "<" + this.columnNames[i] + sa + "><![CDATA["
         + this.columnValues[i]
         + "]]></" + this.columnNames[i] + ">\n"
         ;
    }
    else
    {
      s += "<" + this.columnNames[i] + "><![CDATA["
         + this.columnValues[i]
         + "]]></" + this.columnNames[i] + ">\n"
         ;
    }
  } 
  s += "</row>\n" ;

  sa = null ;
  for ( var i = 0 ; i < this.columnNames.length ; i++ )
  {
    if ( ! this.generatedKeyColumns[i] ) continue ;
    if ( ! sa ) sa = "<GeneratedKeyColumns>\n" ;
    sa += "<" + this.columnNames[i] + "/>\n" ;
  }
  if ( sa ) sa += "</GeneratedKeyColumns>\n" ;
  if ( this.where )
  {
    s += "<Where><![CDATA[" + this.where + "]]></Where>\n"
  }
  s += "</" + this.tag + ">\n" ;
  return s ;
}

/**
 *  @constructor
 */
var CoDbQuery = function ( tableName, columns, where, whereValues )
{
  if ( ! tableName ) return ;
  this.jsClassName = "CoDbQuery" ;
  this.tableName = tableName ;
  this.tagName = tableName ;
  if ( ! tableName ) throw ( "CoDbQuery: Missing argument tableName" ) ;
  if ( ! columns ) throw ( "CoDbQuery: Missing argument columns" ) ;
  this.columns = columns ;
  if ( typeof ( columns ) == 'string' ) 
  {
    this.columns = [ columns ] ;
  }
  this.columnAttrNames = [] ;
  this.columnAttrValues = [] ;
  this.where = where ;
  this.tag = "Query" ;
  this.xmlData = null ;
  this.whereValues = [] ;
  if ( typeof ( whereValues ) == 'string' ) 
  {
    this.whereValues.push ( whereValues ) ;
  }

  if ( TSys.isArray ( whereValues ) )
  {
    for ( var i = 0 ; i < whereValues.length ; i++ )
    {
      this.whereValues.push ( whereValues[i] ) ;
    }
  }
  this.pwd = "" ;
  this.limit = "" ;
}
CoDbQuery.prototype.setLimit = function ( limit )
{
  this.limit = limit ;
}
CoDbQuery.prototype.setPassword = function ( pwd ) // TODO
{
  this.pwd = pwd ;
}
CoDbQuery.prototype.setTagName = function ( tagName )
{
  this.tagName = tagName ;
}
CoDbQuery.prototype.setXmlData = function ( xmlData )
{
  this.xmlData = xmlData ;
} ;
CoDbQuery.prototype.addEncryptColumn = function ( columnName )
{
  if ( ! this.columnAttrNames.length )
  {
    for ( var i = 0 ; i < this.columns.length ; i++ )
    {
      this.columnAttrNames.push ( false ) ;
      this.columnAttrValues.push ( false ) ;
    }
  }
  this.columns.push ( columnName ) ;
  this.columnAttrNames.push ( "isEncryptColumn" ) ;
  this.columnAttrValues.push ( "true" ) ;
} ;
CoDbQuery.prototype.toString = function()
{
  var s = "<" + this.tag + ">\n"
        + "<Table>" + this.tableName + "</Table>\n"
        + "<TagName>" + this.tagName + "</TagName>\n"
        + "<TagWord>" + this.pwd + "</TagWord>\n"
        + "<Columns>\n"
        ;
  for ( var i = 0 ; i < this.columns.length ; i++ )
  {
    s += "<Column" ;
    if ( this.columnAttrNames[i] && this.columnAttrValues[i] )
    {
      s += " " + this.columnAttrNames[i] + "='" + this.columnAttrValues[i] + "'" ;
    }
    s += ">" + this.columns[i] + "</Column>\n" ;
  }
  s += "</Columns>\n" ;
  if ( this.where )
  {
    s += "<Where><![CDATA[" + this.where + "]]>"
  }
  if ( this.whereValues.length )
  {
    for ( var i = 0 ; i < this.whereValues.length ; i++ )
    {
      s += "<v>" + this.whereValues[i] + "</v>\n" ;
    }
  }
  if ( this.where )
  {
    s += "</Where>\n"
  }
  if ( this.xmlData )
  {
    s += "<xmlData>" ;
    s += this.xmlData ;
    s += "</xmlData>" ;
  }
  if ( this.limit ) s += "<Limit>" + this.limit + "</Limit>\n" ;
  s += "</" + this.tag + ">\n"
  return s ;
}
/**
 *  @constructor
 */
var CoDbv = function ( domResponse )
{
  this.domResponse = null ;
  this.requests = new Array() ;
  this.statements = new Array() ;
  this.nameSpace = null ;
  this.name = "CoDbVars" ;
  this.tagName = null ;
  if ( domResponse && typeof ( domResponse ) == 'object' )
  {
    if ( domResponse.nodeName )
    {
      this.domResponse = domResponse ;
    }
    else
    if ( domResponse.jsClassName == 'CoMessage' )
    {
      this.nameSpace = domResponse.nameSpace ;
      domResponse.addNamedVariable ( this ) ;
    }
  }
}
CoDbv.prototype =
{
  getTagName: function()
  {
    if ( this.tagName ) return this.tagName ;
    this.tagName = ( this.nameSpace ? this.nameSpace + "::" : "" ) + this.name ;
    return this.tagName ;
  },
  setNameSpace: function ( nameSpace )
  {
    this.nameSpace = nameSpace ;
  },
  getResultXml: function()
  {
    if ( ! this.domResponse ) return null ;
    var xResponse = new TXml ( this.domResponse ) ;
    var tagName = ( this.nameSpace ? this.nameSpace + "__" : "" ) + this.name ;
    var x = xResponse.getDom ( "NamedVariables/" + tagName + "/RESULT/xml" ) ;
    if ( ! x ) return null ;
    return new TXml ( x ) ;
  },
  getErrorXml: function()
  {
    if ( ! this.domResponse ) return null ;
    var xResponse = new TXml ( this.domResponse ) ;
    var tagName = ( this.nameSpace ? this.nameSpace + "__" : "" ) + this.name ;
    var x = xResponse.getDom ( "NamedVariables/" + tagName + "/ERROR/elem" ) ;
    if ( ! x ) return null ;
    return new TXml ( x ) ;
  },
  getErrorMessage: function()
  {
    if ( ! this.domResponse ) return null ;
    var xResponse = new TXml ( this.domResponse ) ;
    var tagName = ( this.nameSpace ? this.nameSpace + "__" : "" ) + this.name ;
    var t = xResponse.getContent ( "NamedVariables/" + tagName + "/ERROR/elem/Error/Error/Message" ) ;
    if ( t ) return t ;
    return xResponse.getContent ( "NamedVariables/" + tagName + "/ERROR/elem/Error/Message" ) ;
  },
  addQuery: function ( tableName, columns, where, whereValues )
  {
    var stmt = new CoDbQuery ( tableName, columns, where, whereValues ) ;
    this.requests.push ( stmt ) ;
    return stmt ;
  },
  addSelect: function ( tagName, selectStatament, hostValues )
  {
    var stmt = new CoDbSelect ( tagName, selectStatament, hostValues ) ;
    this.requests.push ( stmt ) ;
    return stmt ;
  },
  addUpdate: function ( tableName, where )
  {
    var stmt = new CoDbUpdate ( tableName, where ) ;
    this.requests.push ( stmt ) ;
    return stmt ;
  },
  addDelete: function ( tableName, where )
  {
    var stmt = new CoDbDelete ( tableName, where ) ;
    this.requests.push ( stmt ) ;
    return stmt ;
  },
  addInsert: function ( tableName )
  {
    var stmt = new CoDbInsert ( tableName ) ;
    this.requests.push ( stmt ) ;
    return stmt ;
  },
  addStatement: function ( stmt )
  {
    this.requests.push ( stmt ) ;
    return stmt ;
  },
  addXStatement: function ( statement )
  {
    var stmt = null ;
    if ( typeof ( statement ) == "string" )
    {
      stmt = new CoDbXStatement ( statement ) ;
    }
    else
    {
      stmt = statement ;
    }
    this.statements.push ( stmt ) ;
    return stmt ;
  },
  addRefQuery: function ( tableName, option, value, name, where )
  {
    var stmt = new CoDbRefQuery ( tableName, option, value, name, where ) ;
    this.requests.push ( stmt ) ;
    return stmt ;
  },
  toString: function()
  {
    if ( this.domResponse )
    {
      return new TXml ( this.domResponse ).toString() ;
    }
    var tagName = this.getTagName() ;
    var s = "<" + tagName + ">\n" ;

    if ( this.requests.length > 0 )
    {
      s += "<REQUEST>\n" ;
      for ( var i = 0 ; i < this.requests.length ; i++ )
      {
        s += this.requests[i].toString() ;
      }
      s += "</REQUEST>\n" ;
    }
    if ( this.statements.length > 0 )
    {
      s += "<STMT>\n" ;
      for ( var i = 0 ; i < this.statements.length ; i++ )
      {
        s += this.statements[i].toString() ;
      }
      s += "</STMT>\n" ;
    }
    s += "</" + tagName + ">\n"
       ;
    return s ;
  }
}
/**
 *  @constructor
 */
var CoDbQueryHtml = function ( tableName, where )
{
  if ( ! tableName ) throw ( "CoDbQueryHtml: Missing argument tableName" ) ;
  this.tableName = tableName ;
  this.where = where ;

  this.captionText = null ;
  this.tableAttributes = null ;
  this.tableHeadAttributes = null ;
  this.tableBodyAttributes = null ;
  this.columnNames = new Array() ;
  this.columns = new Array() ;
  this.columnHrefFunctions = new Array() ;
  this.mimeType = "text/html" ;
}
CoDbQueryHtml.prototype.setCaption = function ( captionText )
{
  this.captionText = captionText ;
}
CoDbQueryHtml.prototype.setMimeType = function ( mimeType )
{
  this.mimeType = mimeType ;
}
CoDbQueryHtml.prototype.addTableAttribute = function ( name, value )
{
  if ( ! this.tableAttributes ) this.tableAttributes = new Array() ;
  this.tableAttributes.push ( " " + name + "='" + value + "'\n" ) ;
}
CoDbQueryHtml.prototype.addTableHeadAttribute = function ( name, value )
{
  if ( ! this.tableHeadAttributes ) this.tableHeadAttributes = new Array() ;
  this.tableHeadAttributes.push ( " " + name + "='" + value + "'\n" ) ;
}
CoDbQueryHtml.prototype.addTableBodyAttribute = function ( name, value )
{
  if ( ! this.tableBodyAttributes ) this.tableBodyAttributes = new Array() ;
  this.tableBodyAttributes.push ( " " + name + "='" + value + "'\n" ) ;
}
CoDbQueryHtml.prototype.addIdColumn = function ( columnName )
{
  this.hasColumnIndexForID = true ;
  this.columnIndexForID = this.columnNames.length ;
  this.columnNames.push ( columnName ) ;
  this.columns.push ( columnName ) ;
  this.columnHrefFunctions.push ( "nil" ) ;
}
CoDbQueryHtml.prototype.addColumn = function ( columnName, columnTitle, hrefFunction )
{
  this.columnNames.push ( columnName ) ;
  if ( columnTitle ) this.columns.push ( columnTitle ) ;
  else               this.columns.push ( columnName ) ;
  if ( ! hrefFunction ) hrefFunction = "nil" ;
  this.columnHrefFunctions.push ( hrefFunction ) ;
}
CoDbQueryHtml.prototype.addStyleSheet = function ( name )
{
  if ( ! this.styleSheets ) this.styleSheets = new Array() ;
  this.styleSheets.push ( name ) ;
}
CoDbQueryHtml.prototype.setOnLoadFunction = function ( name )
{
  this.onLoadFunction = name ;
}
CoDbQueryHtml.prototype.setDefaultText = function ( defaultText )
{
  this.defaultText = defaultText ;
}
CoDbQueryHtml.prototype.toString = function()
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;

  var xmlData = "<Table >\n" ;
  if ( this.captionText ) xmlData += "<Caption>" + this.captionText + "</Caption>\n" ;
  if ( this.tableAttributes && this.tableAttributes.length > 0 )
  {
    xmlData += "<Attributes\n" ;
    for ( var i = 0 ; i < this.tableAttributes.length ; i++ )
    {
      xmlData += this.tableAttributes[i] ;
    }
    xmlData += "/>\n" ;
  }
  if ( this.tableHeadAttributes && this.tableHeadAttributes.length > 0 )
  {
    xmlData += "<HeadAttributes\n" ;
    for ( var i = 0 ; i < this.tableHeadAttributes.length ; i++ )
    {
      xmlData += this.tableHeadAttributes[i] ;
    }
    xmlData += "/>\n" ;
  }
  if ( this.tableBodyAttributes && this.tableBodyAttributes.length > 0 )
  {
    xmlData += "<BodyAttributes\n" ;
    for ( var i = 0 ; i < this.tableBodyAttributes.length ; i++ )
    {
      xmlData += this.tableBodyAttributes[i] ;
    }
    xmlData += "/>\n" ;
  }
  if ( this.defaultText )
  {
    this.defaultText = this.defaultText.replace ( /</g, "&lt;" ).replace ( />/g, "&gt;" ) ;
    xmlData += "<DefaultText>" + this.defaultText + "</DefaultText>\n" ;
  }
  xmlData += "<Columns>\n" ;
  for ( var i = 0 ; i < this.columns.length ; i++ )
  {
    if ( this.hasColumnIndexForID && i == this.columnIndexForID )
    {
      xmlData += "<Item isID='true' >\n" ;
    }
    else
    {
      xmlData += "<Item>\n" ;
    }
    if ( this.columnHrefFunctions[i] != "nil" )
    {
      xmlData += "<Href>" + this.columnHrefFunctions[i] + "</Href>\n" ;
    }
    xmlData += "<Title>" + this.columns[i] + "</Title>\n" ;
    xmlData += "</Item>\n" ;
  }
  xmlData += "</Columns>\n" ;
  xmlData += "</Table>\n" ;
  if ( this.styleSheets && this.styleSheets.length > 0 )
  {
    xmlData += "<StyleSheets>\n" ;
    for ( var i = 0 ; i < this.styleSheets.length ; i++ )
    {
      xmlData += "<Item>" + this.styleSheets[i] + "</Item>\n" ;
    }
    xmlData += "</StyleSheets>\n" ;
  }
  if ( this.onLoadFunction )
  {
    xmlData += "<OnLoadFunction>" + this.onLoadFunction + "</OnLoadFunction>" ;
  }

  var dbv = new CoDbv(msg) ;
  var dbQuery = dbv.addQuery ( this.tableName
                             , this.columnNames
                             , this.where
                             ) ;
  dbQuery.tag = "HtmlQuery" ;
  dbQuery.setXmlData ( xmlData ) ;
  msg.setReturnFromArgsMimeType ( this.mimeType ? this.mimeType : "text/html" ) ;
  return msg.toString() ;
}
CoDbQueryHtml.prototype.getDocument = function()
{
  var url = Calypso.getUrl() ;
  var HTTP = TSys.httpPost ( url, this.toString() ) ;

  if ( HTTP.status != 200 )
  {
    TSys.throwHttpStatusException ( HTTP ) ;
  }
  return HTTP.responseText ;
}
CoDbQueryHtml.prototype.downloadDocument = function ( mimeType )
{
  if ( mimeType ) this.mimeType = mimeType ;
  var url = Calypso.getUrl ( "CacheDocument" ) ;
  var HTTP = TSys.httpPost ( url, this.toString() ) ;
  var t = HTTP.responseText ;
  var url = Calypso.getUrl ( "RetrieveCachedDocument" ) + "&key=" + t ;
  TSys.downloadDocument ( url ) ;
}
CoDbQueryHtml.prototype.showDocument = function ( id )
{
  var e = document.getElementById ( id ) ;
  if ( ! e )
  {
    throw "Element not found, id='" + id + "'" ;
  }
  TGui.flushAttributes ( e ) ;
  if ( e.nodeName.toUpperCase() == "IFRAME" )
  {
    var url = Calypso.getUrl ( "CacheDocument" ) ;
    var HTTP = TSys.httpPost ( url, this.toString() ) ;
    var t = HTTP.responseText ;
    var url = Calypso.getUrl ( "RetrieveCachedDocument" ) + "&key=" + t ;
    e.src = url ;
  }
  else
  {
    var t = this.getDocument() ;
    e.innerHTML = t ;
  }
  return new TXml ( e ) ;
}
/**
 *  @constructor
 */
var DatabaseClass = function ( nameSpace, host, port )
{
  this.host = host ? host : "" ;
  this.port = port ? port : "" ;
  this.nameSpace = nameSpace ? nameSpace : "" ;
}
DatabaseClass.prototype =
{
  setHost: function ( host )
  {
    this.host = host ;
  },
  setPort: function ( port )
  {
    this.port = port ;
  },
  setNameSpace: function ( nameSpace )
  {
    this.nameSpace = nameSpace ;
  },
  getNameSpace: function()
  {
    if ( ! this.nameSpace )
    {
      this.nameSpace = TSys.getWebConfig().getNamespace() ;
    }
    return this.nameSpace ;
  },
  get_DB_REQUEST: function()
  {
    return Calypso.get_DB_REQUEST() ;
  },
  get_DB_EXECUTE_STMT: function()
  {
    return Calypso.get_DB_EXECUTE_STMT() ;
  },
  _createRequestMessage: function()
  {
    var msg = new CoMessage ( this.get_DB_REQUEST() ) ;
    msg.setHost ( this.host ) ;
    msg.setPort ( this.port ) ;
    msg.setNameSpace ( this.getNameSpace() ) ;
    return msg ;
  },
  _createXStatementMessage: function()
  {
    var msg = new CoMessage ( this.get_DB_EXECUTE_STMT() ) ;
    msg.setHost ( this.host ) ;
    msg.setPort ( this.port ) ;
    msg.setNameSpace ( this.getNameSpace() ) ;
    return msg ;
  },
  select: function ( tagName, stmt, hostValues )
  {
    var msg = this._createRequestMessage() ;
    var dbv = new CoDbv ( msg ) ;
    dbv.addSelect ( tagName, stmt, hostValues ) ;
    var dbv = Calypso.getDbv ( msg ) ;
    return dbv.getResultXml() ;
  },
  downloadXml: function ( tagName, stmt, hostValues )
  {
    var msg = this._createRequestMessage() ;
    var dbv = new CoDbv ( msg ) ;
    var S = dbv.addSelect ( tagName, stmt, hostValues ) ;
    S.setDownload() ;
    Calypso.downloadDocument ( msg ) ;
  },
  query: function ( tableName, columns, where, whereValues )
  {
    var msg = this._createRequestMessage() ;
    var dbv = new CoDbv ( msg ) ;
    dbv.addQuery ( tableName, columns, where, whereValues ) ;
    var dbv = Calypso.getDbv ( msg ) ;
    return dbv.getResultXml() ;
  },
  insert: function ( tableName, columns, values )
  {
    var msg = this._createRequestMessage() ;
    var dbv = new CoDbv ( msg ) ;
    var I = dbv.addInsert ( tableName ) ;
    for ( var i = 0 ; i < columns.length ; i++ )
    {
      I.addColumn ( columns[i], values[i] ) ;
    }
    var dbv = Calypso.getDbv ( msg ) ;
    return dbv.getResultXml() ;
  },
  getRefData: function ( tableName, optionColumn, valueColumn, nameColumn, where )
  {
    var msg = this._createRequestMessage() ;
    var dbv = new CoDbv ( msg ) ;
    dbv.addRefQuery ( tableName, optionColumn, valueColumn, nameColumn, where ) ;
    var dbv = Calypso.getDbv ( msg ) ;
    return dbv.getResultXml() ;
  },
  createQuery: function ( tableName, columns, where, whereValues )
  {
    var msg = this._createRequestMessage() ;
    return new DatabaseQueryRequest ( this, msg, tableName, columns, where, whereValues ) ;
  },
  createSelect: function ( tagName, selectStatement, hostValues )
  {
    var msg = this._createRequestMessage() ;
    return new DatabaseSelectRequest ( this, msg, tagName, selectStatement, hostValues ) ;
  },
  createUpdate: function ( tableName, where )
  {
    var msg = this._createRequestMessage() ;
    return new DatabaseUpdateRequest ( this, msg, tableName, where ) ;
  },
  createInsert: function ( tableName )
  {
    var msg = this._createRequestMessage() ;
    return new DatabaseInsertRequest ( this, msg, tableName ) ;
  },
  createXStatement: function ( statementName )
  {
    var msg = this._createXStatementMessage() ;
    return new DatabaseXStatementRequest ( this, msg, statementName ) ;
  },
  createDownloadStatement: function()
  {
    var msg = this._createXStatementMessage() ;
    return new DatabaseDownloadStatementRequest ( this, msg, "DownloadDocument" ) ;
  },
  getNextValFromSequence: function ( sequenceName )
  {
    var msg = this._createXStatementMessage() ;
    var dbv = new CoDbv ( msg ) ;
    var stmt = dbv.addXStatement ( "TangoUtils" ) ;
    var xValues = new TXml() ;
    stmt.addElement ( "Action", "GetNextValFromSequence" ) ;
    if ( sequenceName ) stmt.addElement ( "SequenceName", sequenceName ) ;
    var dbv = Calypso.getDbv ( msg ) ;
    var x = dbv.getResultXml() ;
    return x.getInt ( "NextVal", 0 ) ;
  },
  createDelete: function ( tableName, where )
  {
    var msg = this._createRequestMessage() ;
    return new DatabaseDeleteRequest ( this, msg, tableName, where ) ;
  },
  getRefData2: function ( tableName, valueColumn, textColumn, nameColumn )
  {
    if ( !textColumn ) textColumn = valueColumn ;
    if ( !valueColumn ) valueColumn = textColumn ;
    if ( !nameColumn ) nameColumn = valueColumn ;
    var sql = "SELECT UNIQUE " + valueColumn + ", " + textColumn + ", " + nameColumn + " FROM " + tableName + " ORDER BY 1" ;

    var x = this.select ( tableName, sql ) ;
    var xRef = new TXml() ;
    var xCode = xRef.add ( valueColumn ) ;
    var en = x.getEnum ( tableName + "/row" ) ;
    while ( en.hasNext() )
    {
      var xr = en.nextXml() ;
      var opt = xCode.add ( "option", xr.getContent ( textColumn ) ) ;
      opt.addAttribute ( "value", xr.getContent ( valueColumn ) ) ;
      if ( nameColumn ) opt.addAttribute ( "name", xr.getContent ( nameColumn ) ) ;
    }
    return xRef ;
  }
  // getRefData2: function ( sql, tagName, valueColumn, textColumn, nameColumn )
  // {
  //   if ( !textColumn ) textColumn = valueColumn ;
  //   if ( !valueColumn ) valueColumn = textColumn ;
  //   if ( !nameColumn ) nameColumn = valueColumn ;
  //   var tableName = tagName ;
  //   if ( sql && sql.toUpperCase().indexOf ( "FROM" ) < 0 )
  //   {
  //     tableName = sql ;
  //     sql = null ;
  //   }
  //   if ( ! sql )
  //   {
  //     sql = "SELECT UNIQUE " + valueColumn + ", " + textColumn + ", " + nameColumn + " FROM " + tableName + " ORDER BY 1" ;
  //   }
  //   var x = this.select ( tagName, sql ) ;
  //   var xRef = new TXml() ;
  //   var xCode = xRef.add ( tagName ) ;
  //   var en = x.getEnum ( tagName + "/row" ) ;
  //   while ( en.hasNext() )
  //   {
  //     var xr = en.nextXml() ;
  //     var opt = xCode.add ( "option", xr.getContent ( textColumn ) ) ;
  //     opt.addAttribute ( "value", xr.getContent ( valueColumn ) ) ;
  //     if ( nameColumn ) opt.addAttribute ( "name", xr.getContent ( nameColumn ) ) ;
  //   }
  //   return xRef ;
  // }
};
Database = new DatabaseClass() ;

/**
 *  @constructor
 *  @extends CoDbQuery
 */
var DatabaseQueryRequest = function ( db, msg, tableName, columns, where, whereValues )
{
  Tango.initSuper ( this, CoDbQuery, tableName, columns, where, whereValues );
  this.jsClassName = "DatabaseQueryRequest" ;
  this.db = db ;
  this.msg = msg ;
  var dbv = new CoDbv ( msg ) ;
  dbv.requests.push ( this ) ;
}
DatabaseQueryRequest.inherits( CoDbQuery ) ;
DatabaseQueryRequest.prototype.execute = function ()
{
  try
  {
    var dbv = Calypso.getDbv ( this.msg ) ;
    return dbv.getResultXml() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error() ;
    throw exc ;
  }
}
/**
 *  @constructor
 *  @extends CoDbSelect
 */
var DatabaseSelectRequest = function ( db, msg, tagName, selectStatement, hostValues )
{
  Tango.initSuper ( this, CoDbSelect, tagName, selectStatement, hostValues );
  this.jsClassName = "DatabaseSelectRequest" ;
  this.db = db ;
  this.msg = msg ;
  this.dbv = new CoDbv ( msg ) ;
  this.dbv.requests.push ( this ) ;
}
DatabaseSelectRequest.inherits( CoDbSelect ) ;
DatabaseSelectRequest.prototype.execute = function ()
{
  this.dbv = null ;
  try
  {
    var dbv = Calypso.getDbv ( this.msg ) ;
    return dbv.getResultXml() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error() ;
    throw exc ;
  }
}
/**
 *  @constructor
 *  @extends CoDbUpdate
 */
var DatabaseUpdateRequest = function ( db, msg, tableName, where )
{
  Tango.initSuper ( this, CoDbUpdate, tableName, where );
  this.jsClassName = "DatabaseUpdateRequest" ;
  this.db = db ;
  this.msg = msg ;
  var dbv = new CoDbv ( msg ) ;
  dbv.requests.push ( this ) ;
}
DatabaseUpdateRequest.inherits( CoDbUpdate ) ;
DatabaseUpdateRequest.prototype.execute = function ()
{
  try
  {
    var dbv = Calypso.getDbv ( this.msg ) ;
    return dbv.getResultXml() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error() ;
    throw exc ;
  }
}
/**
 *  @constructor
 *  @extends CoDbDelete
 */
var DatabaseDeleteRequest = function ( db, msg, tableName, where )
{
  Tango.initSuper ( this, CoDbDelete, tableName, where );
  this.jsClassName = "DatabaseDeleteRequest" ;
  this.db = db ;
  this.msg = msg ;
  this.dbv = new CoDbv ( msg ) ;
  this.dbv.requests.push ( this ) ;
}
DatabaseDeleteRequest.inherits( CoDbDelete ) ;
DatabaseDeleteRequest.prototype.addDelete = function ( tableName, where )
{
  return this.dbv.addDelete ( tableName, where ) ;
}
DatabaseDeleteRequest.prototype.execute = function ()
{
  try
  {
    var dbv = Calypso.getDbv ( this.msg ) ;
    this.dbv = null ;
    this.msg = null ;
//    delete this.dbv ;
//    delete this.msg ;
    return dbv.getResultXml() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error() ;
    throw exc ;
  }
}
/**
 *  @constructor
 *  @extends CoDbInsert
 */
var DatabaseInsertRequest = function ( db, msg, tableName )
{
  Tango.initSuper ( this, CoDbInsert, tableName );
  this.jsClassName = "DatabaseInsertRequest" ;
  this.db = db ;
  this.msg = msg ;
  this.dbv = new CoDbv ( msg ) ;
  this.dbv.requests.push ( this ) ;
}
DatabaseInsertRequest.inherits( CoDbInsert ) ;
DatabaseInsertRequest.prototype.execute = function ()
{
  try
  {
    var dbv = Calypso.getDbv ( this.msg ) ;
    this.dbv = null ;
    this.msg = null ;
//    delete this.dbv ;
//    delete this.msg ;
    return dbv.getResultXml() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error() ;
    throw exc ;
  }
}
DatabaseInsertRequest.prototype.addInsert = function ( tableName )
{
  return this.dbv.addInsert ( tableName ) ;
}
/**
 *  @constructor
 *  @extends CoDbXStatement
 */
var DatabaseXStatementRequest = function ( db, msg, statementName )
{
  Tango.initSuper ( this, CoDbXStatement, statementName );
  this.jsClassName = "DatabaseXStatementRequest" ;
  this.db = db ;
  this.msg = msg ;
  var dbv = new CoDbv ( msg ) ;
  dbv.statements.push ( this ) ;
}
DatabaseXStatementRequest.inherits( CoDbXStatement ) ;
DatabaseXStatementRequest.prototype.execute = function ()
{
  try
  {
    var dbv = Calypso.getDbv ( this.msg ) ;
    return dbv.getResultXml() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error() ;
    throw exc ;
  }
}
/**
 *  @constructor
 *  @extends CoDbXStatement
 */
var DatabaseDownloadStatementRequest = function ( db, msg, statementName )
{
  Tango.initSuper ( this, CoDbXStatement, statementName );
  this.jsClassName = "DatabaseDownloadStatementRequest" ;
  this.db = db ;
  this.msg = msg ;
  var dbv = new CoDbv ( msg ) ;
  dbv.statements.push ( this ) ;
  this.xValues = new TXml ( "Values" ) ;
  this.addElement ( this.xValues ) ;
}
DatabaseDownloadStatementRequest.inherits( CoDbXStatement ) ;
DatabaseDownloadStatementRequest.prototype.setTableName = function ( name )
{
  this.xValues.add ( "Table", name ) ;
}
DatabaseDownloadStatementRequest.prototype.setFileNameColumn = function ( name )
{
  this.xValues.add ( "FileNameColumn", name ) ;
}
DatabaseDownloadStatementRequest.prototype.setFileName = function ( name )
{
  this.xValues.add ( "FileName", name ) ;
}
DatabaseDownloadStatementRequest.prototype.setBlobColumnName = function ( name )
{
  this.xValues.add ( "BlobColumn", name ) ;
}
DatabaseDownloadStatementRequest.prototype.setWhere = function ( name )
{
  this.xValues.add ( "Where", name ) ;
}
DatabaseDownloadStatementRequest.prototype.execute = function ()
{
  try
  {
    Calypso.downloadDocument ( this.msg ) ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error() ;
    throw exc ;
  }
}
/**
 *  @constructor
 */
VXXmlMailMessage = function ( fromMailAddress )
{
  this._X = new TXml ( "XmlMail" ) ;
  this.setFromMailAddress ( fromMailAddress ) ;
};
VXXmlMailMessage.prototype =
{
  flush: function()
  {
    this._X = null ;
  },
  toString: function()
  {
    return "" + this._X ;
  },
  getXml: function()
  {
    return this._X ;
  },
  setMailHost: function ( mailHost )
  {
    var x = this._X.ensureElement ( "MailHost" ) ;
    x.setContent ( mailHost ) ;
  },
  setFromMailAddress: function ( fromMailAddress )
  {
    var x =this._X.ensureElement ( "from" ) ;
    x.setContent ( fromMailAddress ) ;
  },
  setSubject: function ( subject )
  {
    var x =this._X.ensureElement ( "subject" ) ;
    x.setContent ( subject ) ;
  },
  addTORecipient: function ( toMailAddress )
  {
    var recipients =this._X.ensureElement ( "recipients" ) ;
    var rs = recipients.ensureElement ( "to" ) ;
    rs.add ( "r", toMailAddress ) ;
  },
  addCCRecipient: function ( ccMailAddress )
  {
    var recipients =this._X.ensureElement ( "recipients" ) ;
    var rs = recipients.ensureElement ( "cc" ) ;
    rs.add ( "r", ccMailAddress ) ;
  },
  addBCCRecipient: function ( bccMailAddress )
  {
    var recipients =this._X.ensureElement ( "recipients" ) ;
    var rs = recipients.ensureElement ( "bcc" ) ;
    rs.add ( "r", bccMailAddress ) ;
  },
  addBodyPart: function ( text, mimeType )
  {
    if ( ! text ) return false ;
    if ( ! mimeType ) return mimeType = "text/html" ;
    var body =this._X.ensureElement ( "body" ) ;
    var xBodyPart = body.add ( "body-part", "<![CDATA[" + text + "]]>" ) ;
    xBodyPart.addAttribute ( "mime-type", mimeType ) ;
    return true ;
  }
};
/**
 *  @constructor
 */
CoMailMessage = function ( msg )
{
  this.m_XmlMailList = [] ;
  this.domResponse = null ;
  this.nameSpace = null ;
  this.name = "CoMail" ;
  this.tagName = null ;
  this.msg = msg ;
  if ( msg instanceof CoMessage )
  {
    this.nameSpace = this.msg.nameSpace ;
    this.msg.addNamedVariable ( this ) ;
  }
  else
  {
    this.msg = new CoMessage ( "SEND-MAIL-SMTP" ) ;
    this.nameSpace = this.msg.nameSpace ;
    this.msg.addNamedVariable ( this ) ;
  }
}
CoMailMessage.prototype =
{
  toString: function()
  {
    var str = "" ;
    if ( this.nameSpace )
    {
      str += "<" + this.nameSpace + "::" + this.name + "><XmlMailList>\n" ;
    }
    else
    {
      str += "<" + this.name + "><XmlMailList>" ;
    }
    for ( var i = 0 ; i < this.m_XmlMailList.length ; i++ )
    {
      str += this.m_XmlMailList[i] ;
    }
    if ( this.nameSpace )
    {
      str += "</XmlMailList></" + this.nameSpace + "::" + this.name + ">" ;
    }
    else
    {
      str += "</XmlMailList></" + this.name + ">" ;
    }
    return str ;
  },
  addXml: function ( xmm )
  {
    this.m_XmlMailList.push ( xmm.getXml() ) ;
  },
  send: function ( callback )
  {
    if ( typeof ( callback ) == 'function' )
    {
      var thiz = this ;
      Calypso.getXml ( this.msg, function(xml)
      {
        if ( ! xml )
	{
	  callback ( xml ) ;
	  return ;
	}
        var tagName = ( thiz.nameSpace ? thiz.nameSpace + "__" : "" ) + thiz.name ;
        callback ( xml.getXml ( "NamedVariables/" + tagName + "/XmlMailResultList/XmlMailResultList" ) ) ;
      }) ;
      return ;
    }
    var xResult = Calypso.getXml ( this.msg ) ;
    if ( ! xResult ) return null ;
    var tagName = ( this.nameSpace ? this.nameSpace + "__" : "" ) + this.name ;
    var x = xResult.getXml ( "NamedVariables/" + tagName + "/XmlMailResultList/XmlMailResultList" ) ;
    return x ;
  }
} ;

// Extensions 
CalypsoClass.prototype.getAvailableNameSpaceList = function ( pattern )
{
  if ( ! pattern ) pattern = "*" ;
  var msg = new CoMessage ( "SYS$::LIST_SUBSCRIBER" ) ;
  msg.setXmlData ( "<Name>" + pattern + "</Name>" ) ;
  var xData = Calypso.getXml ( msg ) ;
  if ( ! xData ) return ;

  var en = xData.getEnum ( "SubscriberList", "Subscriber" ) ;
  var l = [] ;

  while ( en.hasNext() )
  {
    var sub = en.next() ;
    var nameSpace = sub.getAttribute ( "nameSpace" ) ;
    if ( ! nameSpace )
    {
      continue ;
    }
    var pos = nameSpace.indexOf ( "::" ) ;
    if ( pos > 0 )
    {
      nameSpace = nameSpace.substring ( 0, pos ) ;
    }
    l.push ( nameSpace ) ;
  }
  return l ;
} ;
CalypsoClass.prototype.getAvailableNameSpaces = function ( pattern, optionName )
{
  if ( ! pattern ) pattern = "*" ;
  if ( ! optionName ) optionName = "NameSpaces" ;
  var msg = new CoMessage ( "SYS$::LIST_SUBSCRIBER" ) ;
  msg.setXmlData ( "<Name>" + pattern + "</Name>" ) ;
  var xData = Calypso.getXml ( msg ) ;
  if ( ! xData ) return ;
//log ( xData ) ;

  var en = xData.getEnum ( "SubscriberList", "Subscriber" ) ;
  var xRef = new TXml() ;
  var xNameSpaces = xRef.add ( optionName ) ;

  var l = [] ;
  var first = false ;

  var defaultExists = false ;
  while ( en.hasNext() )
  {
    var sub = en.next() ;
    var nameSpace = sub.getAttribute ( "nameSpace" ) ;
    if ( ! nameSpace )
    {
      defaultExists = true ;
      continue ;
    }
    var pos = nameSpace.indexOf ( "::" ) ;
    var displayName = nameSpace ;
    if ( pos > 0 )
    {
      displayName = nameSpace.substring ( 0, pos ) ;
      nameSpace = displayName ;
    }
    l.push ( nameSpace ) ;
  }

  if ( defaultExists )
  {
    var xOpt = xNameSpaces.add ( "option", "Default" ) ;
    xOpt.addAttribute ( "value", "" ) ;
  }
  for ( var i = 0 ; i < l.length ; i++ )
  {
    var xOpt = xNameSpaces.add ( "option", l[i] ) ;
    xOpt.addAttribute ( "value", l[i] ) ;
  }
  return xRef ;
} ;

Calypso = new CalypsoClass() ;
