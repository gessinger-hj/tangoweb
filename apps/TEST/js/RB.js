/**
 *  @constructor
 */
/*
var RBClass = function()
{
}
RBClass.prototype.getTariffList = function ( pattern, id, tariff_model_id, status )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;

  var S = null ;
  if ( ! pattern ) pattern = '*' ;
  pattern = pattern.replace ( /\* /g, "%" ) ;
  var S = dbv.addSelect ( "select ID, TARIFF_NAME, STATUS, TARIFF_MODEL_ID, CLIENT_ID from T_TARIFF where TARIFF_NAME like ?" ) ;
  S.addHostValue ( pattern ) ;
  S.setTagName ( "T_TARIFF" ) ;
  var dbv = Calypso.getDbv ( msg ) ;
  var xml = dbv.getResultXml() ;
  return xml ;
}
RBClass.prototype.getTariffAttributesForId = function ( ID )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var Q = dbv.addQuery ( "T_TARIFF_ATTRIBUTES"
		       , [
		           "ATTRIBUTE_NAME"
                         , "ATTRIBUTE_DESCRIPTION"
                         , "ATTRIBUTE_VALUE"
                         , "TARIFF_ID"
                         , "ATTRIBUTE_TYPE_ID"
                         , "LAST_MODIFIED"
			 ]
		       , "TARIFF_ID=" + ID ) ;
  var dbv = Calypso.getDbv ( msg ) ;
  var x = dbv.getResultXml() ;
  return x ;
}
RBClass.prototype.saveNewTariffAttribute = function ( x )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var I = dbv.addInsert ( "T_TARIFF_ATTRIBUTES" ) ;
  I.addColumn ( "TARIFF_ID", x.getContent ( "TARIFF_ID" ) ) ;
  I.addColumn ( "ATTRIBUTE_NAME", x.getContent ( "ATTRIBUTE_NAME" ) ) ;
  I.addColumn ( "ATTRIBUTE_TYPE_ID", x.getContent ( "ATTRIBUTE_TYPE_ID" ) ) ;
  I.addColumn ( "ATTRIBUTE_VALUE", x.getContent ( "ATTRIBUTE_VALUE" ) ) ;
  I.addColumn ( "ATTRIBUTE_DESCRIPTION", x.getContent ( "ATTRIBUTE_DESCRIPTION" ) ) ;
  dbv = Calypso.getDbv ( msg ) ;
}
RBClass.prototype.saveModifiedTariffAttribute = function ( x )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var TARIFF_ID = x.getContent ( "TARIFF_ID" ) ;
  var ATTRIBUTE_NAME = x.getContent ( "ATTRIBUTE_NAME" ) ;
  var OLD_ATTRIBUTE_NAME = x.getContent ( "OLD_ATTRIBUTE_NAME" ) ;
  var U = dbv.addUpdate ( "T_TARIFF_ATTRIBUTES", "ATTRIBUTE_NAME='" + OLD_ATTRIBUTE_NAME + "' AND TARIFF_ID=" + TARIFF_ID ) ;
  U.addColumn ( "ATTRIBUTE_NAME", x.getContent ( "ATTRIBUTE_NAME" ) ) ;
  U.addColumn ( "ATTRIBUTE_TYPE_ID", x.getContent ( "ATTRIBUTE_TYPE_ID" ) ) ;
  U.addColumn ( "ATTRIBUTE_VALUE", x.getContent ( "ATTRIBUTE_VALUE" ) ) ;
  U.addColumn ( "ATTRIBUTE_DESCRIPTION", x.getContent ( "ATTRIBUTE_DESCRIPTION" ) ) ;
  dbv = Calypso.getDbv ( msg ) ;
}
RBClass.prototype.removeTariffAttribute = function ( TARIFF_ID, ATTRIBUTE_NAME )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var D = dbv.addDelete ( "T_TARIFF_ATTRIBUTES" ) ;
  D.addKeyColumn ( "ATTRIBUTE_NAME", ATTRIBUTE_NAME ) ;
  D.addKeyColumn ( "TARIFF_ID", TARIFF_ID ) ;
  dbv = Calypso.getDbv ( msg ) ;
}
RBClass.prototype.globalAttributeAlreadyExists = function ( TARIFF_ID, ATTRIBUTE_NAME )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var Q = dbv.addQuery ( "T_TARIFF_ATTRIBUTES", [ "ATTRIBUTE_NAME" ], "ATTRIBUTE_NAME='" + ATTRIBUTE_NAME + "' AND TARIFF_ID=" + TARIFF_ID ) ;
  dbv = Calypso.getDbv ( msg ) ;
  var x = dbv.getResultXml() ;
  if ( ! x ) return false ;
  if ( ! x.get ( "T_TARIFF_ATTRIBUTES" ).isEmpty() ) return true ;
  return false ;
}
RB = new RBClass() ;
*/
/**
 *  @constructor
 */
/*
var TariffAttributes = function ( TARIFF_ID )
{
  this.TARIFF_ID = TARIFF_ID ;
  this.jsClassName = "TariffAttributes" ;
} ;
TariffAttributes.prototype.toString = function()
{
  return "(" + this.jsClassName + ")[TARIFF_ID=" + this.TARIFF_ID + "]" ;
} ;
TariffAttributes.prototype.saveAll = function ( xValues )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var en = xValues.getEnum ( "T_TARIFF_ATTRIBUTES/row" ) ;
  while ( en.hasNext() )
  {
    var xRow = en.nextXml() ;
    var U = dbv.addUpdate ( "T_TARIFF_ATTRIBUTES" ) ;
    U.addKeyColumn ( "TARIFF_ID", xRow.getContent ( "TARIFF_ID" ) ) ;
    U.addKeyColumn ( "ATTRIBUTE_NAME", xRow.getContent ( "ATTRIBUTE_NAME" ) ) ;
    U.addColumn ( "ATTRIBUTE_VALUE", xRow.getContent ( "ATTRIBUTE_VALUE" ) ) ;
    U.addColumn ( "ATTRIBUTE_DESCRIPTION", xRow.getContent ( "ATTRIBUTE_DESCRIPTION" ) ) ;
    U.addLastModifiedColumn ( "LAST_MODIFIED", xRow.getContent ( "LAST_MODIFIED" ) ) ;
  }
  var dbv = Calypso.getDbv ( msg ) ;
  return dbv.getResultXml() ;
}
TariffAttributes.prototype.onclickTableItem = function ( ev )
{
  var w = ev.getWindow() ;
  w.getComponent ( "PB.Modify" ).setEnabled ( true ) ;
  w.getComponent ( "PB.Remove" ).setEnabled ( true ) ;
}
TariffAttributes.prototype.onchangeTableItem = function ( ev )
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
TariffAttributes.prototype._typeMandatoryCallback = function ( str, src, event )
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
TariffAttributes.prototype.edit = function ( ID )
{
  var x = RB.getTariffAttributesForId ( ID ) ;
  var w = new TWindow ( "Tariff.Window.Edit.Attributes" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  x.ensureXml ( "TARIFF_ID" ).setContent ( ID ) ;
  w.setValues ( x ) ;
  w.show() ;
} ;
TariffAttributes.prototype.save = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var vals = w.getValues() ;
  try
  {
    this.saveAll ( vals ) ;
    w.resetChanged() ;
//    w.closeImediately() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
TariffAttributes.prototype.modify = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var tab = w.getPeer ( "T_TARIFF_ATTRIBUTES" ) ;
  var x = tab.getSelectedUserXml() ;
  if ( ! x )
  {
    var d = new TUserDialog ( "Please select an item." ) ;
    d.error() ;
    return ;
  }
  var old = x.ensureXml ( "OLD_ATTRIBUTE_NAME" ) ;
  old.setContent ( x.getContent ( "ATTRIBUTE_NAME" ) ) ;
  var ww = new TWindow ( "Tariff.Window.Edit.Attributes.Modify" ) ;
  ww.setPagelet ( this ) ;
  ww.create() ;
  ww.setValues( x ) ;
  ww.addAttribute ( "w", w ) ;
  ww.show() ;
} ;
TariffAttributes.prototype.modifySave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var TARIFF_ID = v.getContent ( "TARIFF_ID" ) ;
  var ATTRIBUTE_NAME = v.getContent ( "ATTRIBUTE_NAME" ) ;
  var OLD_ATTRIBUTE_NAME = v.getContent ( "OLD_ATTRIBUTE_NAME" ) ;
  var w = ev.getWindow() ;
  try
  {
    if ( OLD_ATTRIBUTE_NAME != ATTRIBUTE_NAME && RB.tariffAttributeAlreadyExists ( TARIFF_ID, ATTRIBUTE_NAME ) )
    {
      var str = TSys.translate ( "AlreadyExistsArg0", null, [ ATTRIBUTE_NAME ] ) ;
      var d = new TUserDialog ( str ) ;
      d.error(w) ;
      return ;
    }
    RB.saveModifiedTariffAttribute ( v ) ;
    var pw = w.getAttribute ( "w" ) ;
    var x = RB.getTariffAttributesForId ( TARIFF_ID ) ;
    pw.setValues ( x ) ;
    var tab = pw.getPeer ( "T_TARIFF_ATTRIBUTES" ) ;
    tab.findRow ( "ATTRIBUTE_NAME", ATTRIBUTE_NAME ).setSelected ( true, true ) ;
    w.closeImediately() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
TariffAttributes.prototype.addNew = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = new TWindow ( "Tariff.Window.Edit.Attributes.New" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  var v = ev.getValues() ;
  w.setValues ( v ) ;
  w.addAttribute ( "w", ev.getWindow() ) ;
  w.show() ;
} ;
TariffAttributes.prototype.addNewSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var TARIFF_ID = v.getContent ( "TARIFF_ID" ) ;
  var ATTRIBUTE_NAME = v.getContent ( "ATTRIBUTE_NAME" ) ;
  var w = ev.getWindow() ;
  try
  {
    if ( RB.globalAttributeAlreadyExists ( TARIFF_ID, ATTRIBUTE_NAME ) )
    {
      var str = TSys.translate ( "AlreadyExistsArg0", null, [ ATTRIBUTE_NAME ] ) ;
      var d = new TUserDialog ( str ) ;
      d.error(w) ;
      return ;
    }
    RB.saveNewTariffAttribute ( v ) ;
    var pw = w.getAttribute ( "w" ) ;
    var x = RB.getTariffAttributesForId ( TARIFF_ID ) ;
    pw.setValues ( x ) ;
    var tab = pw.getPeer ( "T_TARIFF_ATTRIBUTES" ) ;
    tab.findRow ( "ATTRIBUTE_NAME", ATTRIBUTE_NAME ).setSelected ( true, true ) ;
    w.closeImediately() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
TariffAttributes.prototype.remove = function ( event )
{
  var ev = new TEvent ( event ) ;
  var w = ev.getWindow() ;
  var tab = w.getPeer ( "T_TARIFF_ATTRIBUTES" ) ;
  var x = tab.getSelectedUserXml() ;
  if ( ! x )
  {
    var d = new TUserDialog ( "Please select an item." ) ;
    d.error() ;
    return ;
  }

  var d = new TUserDialog ( "AreYouSureToDeleteSelectedItem" ) ;
  var TARIFF_ID = x.getContent ( "TARIFF_ID" ) ;
  var ATTRIBUTE_NAME = x.getContent ( "ATTRIBUTE_NAME" ) ;
  d.callOnConfirmation ( this.remove2, [ w, TARIFF_ID, ATTRIBUTE_NAME ], this )
  d.askYesNo() ;
} ;
TariffAttributes.prototype.remove2 = function ( w, TARIFF_ID, ATTRIBUTE_NAME )
{
  RB.removeTariffAttribute ( TARIFF_ID, ATTRIBUTE_NAME ) ;
  var x = RB.getTariffAttributesForId ( TARIFF_ID ) ;
  w.setValues ( x ) ;
  w.getComponent ( "PB.Modify" ).setEnabled ( false ) ;
  w.getComponent ( "PB.Remove" ).setEnabled ( false ) ;
} ;
*/

TariffEditorClass = function ( x )
{
  this.jsClassName = "TariffEditor" ;
}
TariffEditorClass.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
} ;
TariffEditorClass.prototype.create = function()
{
  var w = new TWindow ( "Tariff.Window.Create" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  w.show() ;
} ;
TariffEditorClass.prototype.tariffAlreadyExists = function ( CLIENT_ID, TARIFF_NAME )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var Q = dbv.addQuery ( "T_TARIFF", [ "TARIFF_NAME" ], "TARIFF_NAME='" + TARIFF_NAME + "' and CLIENT_ID=" + CLIENT_ID ) ;
  dbv = Calypso.getDbv ( msg ) ;
  var x = dbv.getResultXml() ;
  if ( ! x ) return false ;
  if ( ! x.get ( "T_TARIFF" ).isEmpty() ) return true ;
  return false ;
}
TariffEditorClass.prototype.saveNewTariff = function ( CLIENT_ID, TARIFF_MODEL_ID, ID, TARIFF_NAME )
{
  var msg = new CoMessage ( Calypso.get_DB_REQUEST() ) ;
  var dbv = new CoDbv ( msg ) ;
  var I = dbv.addInsert ( "T_TARIFF" ) ;
  I.addColumn ( "CLIENT_ID", CLIENT_ID ) ;
  I.addColumn ( "TARIFF_MODEL_ID", TARIFF_MODEL_ID ) ;
  I.addColumn ( "ID", ID ) ;
  I.addColumn ( "TARIFF_NAME", TARIFF_NAME ) ;
  dbv = Calypso.getDbv ( msg ) ;
}
TariffEditorClass.prototype.createSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var TARIFF_MODEL_ID = v.getContent ( "TARIFF_MODEL_ID" ) ;
  var TARIFF_NAME = v.getContent ( "TARIFF_NAME" ) ;
  var CLIENT_ID = v.getContent ( "CLIENT_ID" ) ;
  var w = ev.getWindow() ;
  try
  {
    if ( this.tariffAlreadyExists ( CLIENT_ID, TARIFF_NAME ) )
    {
      var str = TSys.translate ( "AlreadyExistsArg0", null, [ TARIFF_NAME ] ) ;
      var d = new TUserDialog ( str ) ;
      d.error(w) ;
      return ;
    }
    var ID = Database.getNextValFromSequence ( "SEQ_FUNCTION" ) ;
    this.saveNewTariff ( CLIENT_ID, TARIFF_MODEL_ID, ID, TARIFF_NAME ) ;
    var x = RB.getTariffList ( "*" ) ;
    this.tableContainer.setValues ( x ) ;
    var tab = this.tableContainer.getPeer ( "T_TARIFF" ) ;
    tab.findRow ( "TARIFF_NAME", TARIFF_NAME ).setSelected ( true, true ) ;
    w.closeImediately() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error(w) ;
    throw exc ;
  }
} ;
TariffEditorClass.prototype.setTableContainer = function ( tableContainer )
{
  this.tableContainer = tableContainer ;
}
TariffEditor = new TariffEditorClass() ;
