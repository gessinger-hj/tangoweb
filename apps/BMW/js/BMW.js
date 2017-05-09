Tango.include ( "TSystem" ) ;
Tango.include ( "TComponents" ) ;
Tango.include ( "TTable" ) ;
Tango.include ( "TWindow" ) ;
//Tango.include ( "TSpecialWindows" ) ;
Tango.include ( "TUtil" ) ;
Tango.include ( "TDialogChangePassword" ) ;
Tango.include ( "Calypso" ) ;
Tango.include ( "TTagDefinitions" ) ;
Tango.include ( "TFileHandler" ) ;
Tango.include ( "TFileExplorer" ) ;
Tango.include ( "DragAndDrop" ) ;
Tango.include ( "FileRessource" ) ;
Tango.include ( "Net" ) ;
Tango.include ( "TPlot" ) ;
Tango.include ( "Admin" ) ;
Tango.include ( "Cosmos" ) ;
Tango.include ( "FileSystem" ) ;
Tango.include ( "Ls" ) ;
Tango.include ( "Extensions" ) ;
Tango.include ( "TFileChooser" ) ;

var _ReferenceData = null ;

SWAAppClass = function()
{
  this.jsClassName = "SWAAppClass" ;
}
SWAAppClass.prototype =
{
  toString: function()
  {
    return "(" + this.jsClassName + ")" ;
  },
  test: function(event,action)
  {
var ev = new TEvent ( event ) ;
  var p = ev.getPeer() ;
log ( p.getSelectedUserXml() ) ;
  }
} ;
SWAApp = new SWAAppClass() ;
function getSearchResult()
{
  try
  {
    return TSys.getPrivateXml ( "Alphabet.contract.data.xml" ) ;
  }
  catch ( exc )
  {
    TSys.log ( "getReferencedata(): " + exc  ) ;
  }
}
function getReferenceData()
{
  try
  {
    _ReferenceData = TSys.getPrivateXml ( "reference.data.xml" ) ;
  }
  catch ( exc )
  {
    TSys.log ( "getReferencedata(): " + exc  ) ;
  }
}
var _Wp = null ;
function logout()
{
  _FAHRGESTELL_NUMMER = null ;
  _SearchResult = null ;
  _ReferenceData = null ;
  TSys.logout() ;
}
function login ( event )
{
  var xCont = TGui.getContainerXml ( event ) ;
  var mTextList = xCont.getMandatoryText() ;
  if ( mTextList.length > 0 )
  {
    var d = new TUserDialog ( mTextList.join ( "<br/>" ) ) ;
    d.info() ;
    return ;
  }
  var vals = xCont.getValues() ;
  var uid = vals.getContent ( "UID" ) ;
  var pwd = vals.getContent ( "PWD" ) ;
  try
  {
    var status = TSys.login ( uid, pwd ) ;
    if ( status != 200 )
    {
      xCont.reset() ;
      return ;
    }

    TGui.renderWorkPage() ;
    getReferenceData() ;

    var u = TSys.getUser() ;
// log ( u ) ;

//document.onselectstart = function () { return false; };
//document.ondragstart = function (event) { log(newTEvent(event));return false; };
//document.body.ondragstart = function (event) { log(newTEvent(event));throw("xxx");return false; };
//document.ondrag = function (event) { log(newTEvent(event));return false; };
//document.body.ondrag = function (event) { log(newTEvent(event));throw("xxx");return false; };
    TGui.getDragSource ( 'ID.DnD.Source.Form.Layout.1' ).addListener (
    {
      dragStart: function ( evt )
      {
        var XOnPage = evt.getXOnPage() ;
        var YOnPage = evt.getYOnPage() ;
        var X = evt.getX() ;
        var Y = evt.getY() ;
        var src = evt.getSource() ;
        var c = evt.getComponent() ;
        return "TEXT-1" ;
      },
      dragDropEnd: function ( evt )
      {
        if ( ! evt.getDropSuccess() ) return ;
      }
    } ) ;
    dndSource = TGui.getDragSource ( 'ID.DnD.Source.Form.Layout.2' ).addListener (
    {
      getDragElement: function ( evt )
      {
        var src = evt.getSource() ;
        if ( src.nodeName == 'IMG' ) return src ;
        if ( src.nodeName == 'DIV' )
{
return src ;
}
        return null ;
      },
      dragStart: function ( evt )
      {
        this.pendingElement = null ;
        var e = evt.getElement() ;
        var src = evt.getSource() ;
        if ( src.nodeName == 'IMG' )
        {
          this.pendingElement = src ;
          return new Transferable ( [ DnDDataFlavor.TEXT_PLAIN, DnDDataFlavor.DOM_HTML ]
                                  , function( dataFlavor )
                                    {
                                      if ( dataFlavor == DnDDataFlavor.TEXT_PLAIN )
                                      {
                                        return e.innerHTML ;
                                      }
                                      else
                                      {
                                        return src ;
                                      }
                                    }
                                  ) ;
        }
        else
        {
          return new Transferable ( [ DnDDataFlavor.TEXT_PLAIN ]
                                  , function( dataFlavor )
                                    {
                                      if ( dataFlavor == DnDDataFlavor.TEXT_PLAIN )
                                      {
                                        return e.innerHTML ;
                                      }
                                    }
                                  ) ;
        }
      },
      dragDropEnd: function ( evt )
      {
        if ( ! evt.getDropSuccess() ) return ;
        if ( evt.getDropAction() == DnDConstants.MOVE )
        {
          if ( this.pendingElement )
          {
            if ( this.pendingElement.parentNode )
              this.pendingElement.parentNode.removeChild ( this.pendingElement ) ;
          }
        }
      }
    } ) ;
    TGui.getDragSource ( 'ID.DnD.Target.Form.Layout.1' ).addListener (
    {
      getDragElement: function ( evt )
      {
        var src = evt.getSource() ;
        if ( src.nodeName == 'IMG' ) return src ;
        return null ;
      },
      dragStart: function ( evt )
      {
        var src = evt.getSource() ;
        if ( src.nodeName != 'IMG' ) return null ;
        return new Transferable ( DnDDataFlavor.DOM_HTML, function ( dataFlavor ) { return src ; } ) ;
      }
    } ) ;
    var dndTarget = TGui.getDropTarget ( 'ID.DnD.Target.Form.Layout.1' ).addListener (
    {
      dragEnter: function ( evt )
      {
        evt.acceptDrag ( DnDConstants.COPY_OR_MOVE ) ;
      },
      drop: function ( evt )
      {
        var action = evt.getDropAction() ;
        var t = evt.getTransferable();
        if ( t.isDataFlavorSupported ( DnDDataFlavor.DOM_HTML ) )
        {
          evt.acceptDrop ( action) ;
          var d = t.getData ( DnDDataFlavor.DOM_HTML ) ;
          var e = evt.getElement() ;
          d = d.cloneNode ( true ) ;
          e.appendChild ( d ) ;
          evt.dropComplete ( true ) ;
        }
        else
        if ( t.isDataFlavorSupported ( DnDDataFlavor.TEXT_PLAIN ) )
        {
          evt.acceptDrop ( action) ;
          var d = t.getData ( DnDDataFlavor.TEXT_PLAIN ) ;
          var e = evt.getElement() ;
          e.innerHTML = d ;
          evt.dropComplete ( true ) ;
        }
        else
        if ( t.isDataFlavorSupported ( DnDDataFlavor.TEXT_HTML ) )
        {
          evt.acceptDrop ( action) ;
          var d = t.getData ( DnDDataFlavor.TEXT_HTML ) ;
          var e = evt.getElement() ;
          e.innerHTML = d ;
          evt.dropComplete ( true ) ;
        }
        else
        {
          evt.rejectDrop() ;
        }
      }
    }) ;
 /*XXX ??????????????

    TSys.setLogoutFunction ( new function()
    {
      TSys.logout() ;
    } ) ;
*/
//      TGui.addEventListener ( document.getElementById ( "DivLayoutTest" ), "mousedown", displayLayout ) ;
//    TGui.setDeskElement ( "MF.HOME" ) ;
  }
  catch ( exc )
  {
    TSys.log ( "initialize(): " + exc ) ;
    alert ( "Leider konnte die Anwendung nicht richtig\ninitialisiert werden." ) ;
    throw exc ;
  }
}
function hrefFunction ( event )
{
log ( "-------hrefFunction----------" ) ;
log ( "event: " + event ) ;
var ev = new TEvent ( event ) ;
log ( ev ) ;
}
function nop()
{
//log ( "actionHref--------" ) ;
}
function displayLayout ( event )
{
  var ev = new TEvent ( event ) ;
  var e = ev.getSource() ;
log ( "-----------------" ) ;
  var a = new Array() ;

  addValue ( e, a, "padding-left" ) ;
  addValue ( e, a, "padding-right" ) ;
  addValue ( e, a, "margin-left" ) ;
  addValue ( e, a, "margin-right" ) ;
  addValue ( e, a, "border-left-width" ) ;
  addValue ( e, a, "border-right-width" ) ;
  addValue ( e, a, "padding-top" ) ;
  addValue ( e, a, "padding-bottom" ) ;
  addValue ( e, a, "margin-top" ) ;
  addValue ( e, a, "margin-bottom" ) ;
  addValue ( e, a, "border-top-width" ) ;
  addValue ( e, a, "border-width" ) ;
  addValue ( e, a, "border-bottom-width" ) ;

  addValue ( e, a, "width" ) ;
  addValue ( e, a, "height" ) ;

  a.push ( "e.offsetLeft: " + e.offsetLeft ) ;
  a.push ( "e.offsetWidth: " + e.offsetWidth ) ;
  a.push ( "e.offsetHeight: " + e.offsetHeight ) ;

log ( a.join ( "\n" ) ) ;
}
function addValue ( e, a, name )
{
  a.push ( name + ": " + TGui.getComputedStyleInt ( e, name, 0 ) ) ;
}
function reset ( event )
{
  _FAHRGESTELL_NUMMER = null ;
  _SearchResult = null ;

  var xCont = TGui.getContainerXml ( event ) ;
  xCont.reset() ;

  var form = new TContainer ( "Form.Fahrzeug.Suchresultat" ) ;
  form.reset() ;

  var xVals = new TXml() ;
  xVals.addDom ( "Title.Fahrzeugdaten", "Suchresultat" ) ;
  form.setValues ( xVals ) ;

  var eDom = null ;
  eDom = form.getDomByName ( "ERLAUBTE_REIFEN" ) ;
  var ch = new TChoice ( eDom ) ;
  ch.removeAllItems() ;

  eDom = form.getDomByName ( "ERLAUBTE_SERVICES" ) ;
  ch = new TChoice ( eDom ) ;
  ch.removeAllItems() ;

  var pb = new TButton ( "PB_auftragFreigeben" ) ;
  pb.setVisible ( false ) ;

  form = new TContainer ( "Form.Fahrzeug.History" ) ;
  form.setText ( "" ) ;
}
var _FAHRGESTELL_NUMMER = null ;
var _SearchResult = null ;
function searchByFahrgestellNummer ( event )
{
  var xCont = TGui.getContainerXml ( event ) ;
  var mTextList = xCont.getMandatoryText() ;
  if ( mTextList.length > 0 )
  {
    var dUserDialog = new TUserDialog ( mTextList.join ( "<br/>" ) ) ;
    dUserDialog.error() ;
    return ;
  }
  var xValsIn = xCont.getValues() ;
  _FAHRGESTELL_NUMMER = xValsIn.getContent ( "FAHRGESTELLNUMMER" ) ;
  var form = new TContainer ( "Form.Fahrzeug.Suchresultat" ) ;

  var xVals = new TXml() ;
  xVals.addDom ( "Title.Fahrzeugdaten"
               , "Daten f&uuml;r Fahrgestellnummer: " + _FAHRGESTELL_NUMMER
               ) ;
  form.setValues ( xVals ) ;

  _SearchResult = getSearchResult() ;
  form.setValues ( _SearchResult ) ;
  
  var text = TSys.getText ( "Alphabet.html" ) ;
 
  var tableForm = document.getElementById ( "Form.Fahrzeug.History" ) ;
  tableForm.innerHTML = text ;
  var pb = new TButton ( "PB_auftragFreigeben" ) ;
  pb.setVisible ( true ) ;
}
function auftragFreigeben(event)
{
  var xCont = TGui.getContainerXml ( event ) ;
  var mTextList = xCont.getMandatoryText() ;
  if ( mTextList.length > 0 )
  {
    var d = new TUserDialog ( mTextList.join ( "<br/>" ) ) ;
    d.error() ;
    return ;
  }
  var xValsIn = xCont.getValues() ;
  var s = "Der Auftrag f&uuml;r fahrgestellnummer: <b>" + _FAHRGESTELL_NUMMER + "</b>"
        + "wird jetzt freigegeben."
        + "<br/>Reifen: <b>" + xValsIn.getContent ( "ERLAUBTE_REIFEN" ) + "</b>"
        + "<br/>Service: <b>" + xValsIn.getContent ( "ERLAUBTE_SERVICES" ) + "</b>"
        ;
  reset ( event ) ;
  var tableForm = new TContainer ( "Form.Fahrzeug.History" ) ;
  tableForm.setText ( s ) ;
}
function searchAuftraege(event)
{
  var ev = new TEvent ( event ) ;
  var xCont = TGui.getContainerXml ( event ) ;
  var mTextList = xCont.getMandatoryText() ;
  if ( mTextList.length > 0 )
  {
    var nn = TGui.getPeerById ( "Note.Auftraege" ) ;
    if ( nn )
    {
      return ;
    }
    var n = new TTipBalloon ( mTextList.join ( "<br/>" ), 'Auftragssuche.AUFTRAGSNUMMER' ) ; //ev.getSource() ) ;
    n.setId ( "Note.Auftraege" ) ;
    n.setParent ( "Form.Auftragssuche" ) ;
    n.setVisible ( true ) ;
    n.setAutoClose() ;
    return ;
  }
  var xValsIn = ev.getValues() ;
  var AUFTRAGS_NUMMER = xValsIn.getContent ( "AUFTRAGS_NUMMER" ) ;

  if ( AUFTRAGS_NUMMER && AUFTRAGS_NUMMER.length > 0 )
  {
  }
  var text = TSys.getText ( "Auftragsuebersicht.html" ) ;
  var tableForm = new TContainer ( "Form.Auftraege.History" ) ;
  tableForm.setText ( text ) ;
}
function keineHausnummer ( event )
{
  var ev = new TEvent ( event ) ;
  var tf = new TComponent ( 'TF.SIGNED-INT' ) ;
  var vals = ev.getValues() ;
  if ( vals.getBool ( "KeineHausnummer", false ) )
  {
    tf.setMandatory ( false ) ;
  }
  else
  {
    tf.setMandatory ( 'Bitte geben Sie eine Hausnummer ein.' ) ;
  }
}
function getDocument ( msg )
{
  msg.setReturnFromArgs ( true ) ;
  var url = Calypso.getUrl() ;
  var HTTP = TSys.httpPost ( url, msg.toString() ) ;

  if ( HTTP.status != 200 )
  {
    TSys.throwHttpStatusException ( HTTP ) ;
  }
  return HTTP.responseText ;
}
function addTab(event)
{
  var nb = TGui.getPeerById ( "NB" ) ;
  var id = "Notebook.Order.Tab" ;
  var str = ""
            + "<Container"
            + " id='" + id + "'"
            + " label='DESCRIPTION'"
            + " closable='true'"
            + " reset='false' >"
            + "</Container>"
            ;
  nb.add ( str ) ;
}
function displayFileExplorer(event)
{
  var d = new TWindow ( "TFileExplorer" ) ;
  d.create() ;
  d.show() ;
}
function askYesNo ( event )
{
  var d = new TUserDialog ( "Add personal data?" ) ;
  d.setTitle ( "Document Test..." ) ;
//  d.ask ( myAnswerFunction, null, null, this ) ;
//  d.askYesNo ( this, myAnswerFunction ) ;
//  d.askYesNoCancel ( this, myAnswerFunction ) ;
  d.setUserFunction ( myAnswerFunction, [ "xx", "yy" ] ) ;
  d.askYesNoCancel() ;
}
function myAnswerFunction ( params, aa, bb )
{
log ( "aa: " + aa ) ;
log ( "bb: " + bb ) ;
try
{
  var persData = TSys.getPersistentData() ;
  if ( params.isYes() ) persData.setValue ( "TheName", "TheValue" ) ;
  else                  persData.remove ( "TheName" ) ;
}
catch ( exc )
{
  alert ( exc ) ;
}
}
function initialize()
{
  TSys.setApplicationName ( "BMW" ) ;
  TSys.createLOG = true ;
  TSys.showNativeErrors = true ;
/*
  try
  {
*/
//TSys.loadLib ( "AppleBar" ) ;
    TGui.renderStartPage() ;
//    if ( !TSys.isIE() ) new GameSailboat().start() ;
Tango.include ( "TSpecialWindows" ) ;
//document.onselectstart = function () { return false; };
//document.ondragstart = function (event) { log(newTEvent(event));return false; };
//document.body.ondragstart = function (event) { log(newTEvent(event));throw("xxx");return false; };
//document.ondrag = function (event) { log(newTEvent(event));return false; };
//document.body.ondrag = function (event) { log(newTEvent(event));throw("xxx");return false; };
/*
var fstr = "function evaluate(str){ log('XXX i am the function:' + str ) ;}" ;
var f = eval ( "x=" + fstr ) ;
log ( String ( f ) ) ;
log ( typeof ( f ) ) ;
f("dadadadadada") ;
*/
//log ( "TSys.isKhtml(): " + TSys.isKhtml() ) ;
/*
  }
  catch ( exc )
  {
    TSys.log ( "initialize(): " + exc ) ;
    alert ( "Leider konnte die Anwendung nicht richtig\ninitialisiert werden." ) ;
    throw exc ;
  }
*/
}
function fillTableDev (event )
{
  var f = new TContainer ( "Form.Table.Dev" ) ;
  var tab = f.getPeerByName ( "TABLE.ORDER" ) ;

  var x = TSys.getPrivateXml ( "Table.Test.xml" ) ;
  var tx = x.getXml ( "DATA" ) ;
  tx.setName ( "TABLE.ORDER" ) ;
  f.setValues  ( x ) ;
  var xx = x.getXml ( "TABLE.ORDER" ) ;
  xx.setName ( "TABLE.ORDER.COPY" ) ;
  f.setValues  ( x ) ;
}
function tableDevAddRow ( event, index )
{
  var f = new TContainer ( "Form.Table.Dev" ) ;
  var tab = f.getPeerByName ( "TABLE.ORDER" ) ;

  index = parseInt ( index ) ;
  var xml = new TXml() ;
  var xTable = xml.addXml ( "TABLE.ORDER" ) ;
  var xRow = null ;
  var n = tab.getNumberOfRows() ;
  xml = new TXml() ;
  xTable = xml.addXml ( "TABLE.ORDER" ) ;
  xRow = xTable.addXml ( "row" ) ;
  xRow.addXml ( "NAME", "V1-"+n ) ;
  xRow.addXml ( "DESCRIPTION", "V2-"+n ) ;
  xRow.addXml ( "VALUE", "V3-"+n ) ;
//  tab.addRow ( xRow ) ;
  tab.insertRowAt ( xRow, index ) ;
}
function tableDevMoveRow ( event, what )
{
  var f = new TContainer ( "Form.Table.Dev" ) ;
  var tab = f.getPeerByName ( "TABLE.ORDER" ) ;

  var row = tab.getSelectedRow() ;
  if ( row )
  {
    if ( what == 'up' ) row.moveUp() ;
    if ( what == 'down' ) row.moveDown() ;
    if ( what == 'top' ) row.moveToTop() ;
    if ( what == 'bottom' ) row.moveToBottom() ;
  }
}
function tableDevSetText (event )
{
  var f = new TContainer ( "Form.Table.Dev" ) ;
  var tab = f.getPeerByName ( "TABLE.ORDER" ) ;

  var row = tab.getSelectedRow() ;
  if ( row )
  {
    row.setColumnVisibleText ( 0, "TEXT-" + row.index ) ;
    row.setColumnVisibleText ( "N2", "TEXT2-" + row.index ) ;
  }
}
function tableDevRemoveRow (event )
{
  var f = new TContainer ( "Form.Table.Dev" ) ;
  var tab = f.getPeerByName ( "TABLE.ORDER" ) ;
  var row = tab.getSelectedRow() ;
  if ( row )
  {
    row.remove() ;
  }
}
function fillTableTest (event )
{
  var x = TSys.getPrivateXml ( "Table.Test.xml" ) ;
  var f = new TContainer ( "Form.Table.Test" ) ;
  f.reset() ;
  f.setValues  ( x ) ;
}
function getValuesTableTest (event )
{
  var f = new TContainer ( "Form.Table.Test" ) ;
  var x = new TXml() ;
  f.getValues(x) ;
  var ok = f.isMandatoryOk() ;
log ( x ) ;
var ee = x.addDom ( "aaaaaaaaaa", "bbbbbbbbbbbbbbb" ) ;
log ( x ) ;
log ( "----: " + ee.nodeName ) ;
  var tab = f.getPeerByName ( "TABLE.DATA" ) ;
  var ud = tab.getSelectedUserXml() ;
log ( ud ) ;
}
function fillTableHtml(event)
{
  var X = new CoDbQueryHtml ( "T_PersonType" ) ;
  X.setCaption ( "X TEST X" ) ;
  X.showDocument ( 'Form.Table.Test.Html' ) ;
//  var str = X.getDocument() ;
//  var form = document.getElementById ( 'Form.Table.Test.Html' ) ;
//form.innerHTML = str ;
}
var enabled = false ;
function enableDisable(event,id)
{
  enabled = ! enabled ;
  new TContainer ( id ).setAllInputReadOnly ( enabled, null ) ;
}
function showHtmlEditor(event)
{
  var w = new THtmlEditorWindow() ;
  w.create() ;
  w.show() ;
//  w.addPropertyChangeListener ( myPropertyChanged, "TEXT" ) ;
  w.addActionListener ( myActionListener ) ;
  w.setText ( "<pre>This is an initial\nText</pre>" ) ;
}
function getValues ( event )
{
  var ev = new TEvent ( event ) ;
  var x = ev.getValues() ;
log ( x ) ;
}

var _TD = null ;
var _LW = null ;
function displayClearText ( event )
{
  if ( ! _LW ) _LW = new TLogWindow() ;
  if ( ! _TD ) _TD = new TTextDisplay ( 'Form.TextDisplay.Test.Display.2' ) ;
  var td = TGui.getPeerById ( 'Form.TextDisplay.Test.Display' ) ;
  _TD.clear() ;
  td.clear() ;
  _LW.clear() ;
}
function displayAddText10 ( event, text )
{
  if ( ! _LW ) _LW = new TLogWindow() ;
  if ( ! _TD ) _TD = new TTextDisplay ( 'Form.TextDisplay.Test.Display.2' ) ;
  var td = TGui.getPeerById ( 'Form.TextDisplay.Test.Display' ) ;
  for ( var i = 0 ; i < 100 ; i++ )
  {
    _TD.add ( text ) ;
    td.add ( text ) ;
    _LW.println( text ) ;
  }
}
var count = 1 ;
function displayAddText ( event, append )
{
  if ( ! _TD ) _TD = new TTextDisplay ( 'Form.TextDisplay.Test.Display.2' ) ;
  var td = TGui.getPeerById ( 'Form.TextDisplay.Test.Display' ) ;
  text = "afv afv adfv dfg dfg \na fafdfg dfg \n    DF SDF SF Sa sfasdf adfg sdgfs fdgh fh fh F SF SDF S" ;
  _TD.addPre ( text ) ;
  _TD.addPre ( new TXml ( "Values" ), true ) ;
  if ( append )
  {
    if ( count > 5 ) { td.newLine() ; _LW.newLine() ; count = 1 ; }
    td.print ( count ) ;
    count++ ;
  }
  else
  {
    td.println ( "xx xx xx\nxx xx xx" ) ;
  }
}
function displayNewLine ( event )
{
  if ( ! _LW ) _LW = new TLogWindow() ;
  if ( ! _TD ) _TD = new TTextDisplay ( 'Form.TextDisplay.Test.Display.2' ) ;
  var td = TGui.getPeerById ( 'Form.TextDisplay.Test.Display' ) ;
  _TD.newLine() ;
  td.newLine() ;
  _LW.newLine() ;
}
function myPropertyChanged ( ev )
{
log ( "============= BMW ==================" ) ;
log ( ev ) ;
}
function myActionListener ( ev )
{
  var peer = ev.getPeer() ;
  var txt = peer.getText() ;
  var msg = new CoMessage ( "UPLOAD" ) ;
  msg.addAttribute ( "Content-Type", "text/html" ) ;
  msg.setXmlData ( "<REQUEST>"
                 + "<Text><![CDATA[" + txt + "]]></Text>"
                 + "</REQUEST>"
                 ) ;
  var xx = Calypso.getXml ( msg ) ;
}
function setHtmlEditorText(str)
{
  var w = TGui.getWindow ( "HTML.EDITOR.WINDOW.ID" ) ;
  w.setText ( str ) ;
}
function showUploadWindow(event)
{
//  FileRessource.uploadFile ( TSys.getUser().getUid() + "/data" ) ;
  new FileRessource().uploadImageFile() ;
}
function xmlTest(event)
{
  var xml = new TXml() ;
  var x = xml.addXml ( "Aaa", "BBB" ) ;
  var y = x.addXml ( "Yyy", "yYy" ) ;
  y.addAttribute ( "Name", "Value" ) ;
log ( xml ) ;
log ( "xml.getDocumentNode() === document: " + ( xml.getDocumentNode() === document ) ) ;
log ( "xml.getDocumentNode().nodeType: " + xml.getDocumentNode().nodeType ) ;
log ( "xml.getDocumentNode().firstChild.nodeName: " + xml.getDocumentNode().firstChild.nodeName ) ;
  var xx = new TXml() ;
var exx = xx.addDom ( "aaa" ) ;
log ( xx ) ;
log ( "exx.nodeName: " + exx.nodeName ) ;
  var xxx = TSys.getEmptyXmlDocument() ;
var exxx = xxx.addDom ( "aaa" ) ;
log ( xxx ) ;
log ( "exxx.nodeName: " + exxx.nodeName ) ;
  var xmlDom = TSys.parseDom ( "<xml></xml>" ) ;
  var xmlXml = new TXml ( xmlDom ) ;
log ( xmlXml ) ;
  var exmlXml = xmlXml.getDocumentNode() ;
log ( "exmlXml === document: " + ( exmlXml === document ) ) ;
log ( "exmlXml.firstChild.nodeName: " + exmlXml.firstChild.nodeName ) ;
   var ex = x.getDom() ;
   var t = x.getDocumentNode().createCDATASection ( "XXXXXXXXXXXXXXXXXXXX" ) ;
   ex.appendChild ( t ) ;
   var ee = x.addCDATA ( "_CDATA_", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa" ) ;
   x.addCDATA ( "-----CDATA 2 --------------" ) ;
   x.addText ( "A Text node" ) ;
log ( x ) ;

}
function getFileRessourceImages ( event )
{
  var fr = new FileRessource() ;
//  var xml = fr.getAvailableFiles() ;
  var xml = fr.getAvailableImageFiles() ;
  var en = xml.getEnum ( "FILE.RESSOURCE.RESULT", "row" ) ;
  while ( en.hasNext() )
  {
    var r = new TXml ( en.next() ) ;
    var NAME = r.getContent ( "NAME" ) ;
    var img = fr.buildImgString ( NAME ) ;
    r.addDom ( "PREVIEW", img ) ;
  }
  var c = new TContainer ( 'FILE.RESSOURCE.RESULT' ) ;
  c.setValues ( xml ) ;
}
function showWidget ( what, event )
{
  var w = new Widget ( what ) ;
  w.create() ;
  w.show() ;
}
function mainOnLoad (ev )
{
log ( ev ) ;
}
function onchangeFormDateTest ( event )
{
  var ev = new TEvent ( event ) ;
  var c = ev.getComponent() ;
//log ( ev.getComponent() ) ;
log ( c.getDate() ) ;
}
function showDBFunctions()
{
  var f = TGlobals.getFunction ( "CALCULATE_CHANGE_DATE" ) ;
//log ( sf ) ;
var date = new Date() ;
log ( date ) ;
var rc = f.evaluate( date );
log ( rc ) ;
}
/*
<?xml version='1.0' encoding='UTF-8' ?>
  <SOAP-ENV:Envelope
    xmlns:typ='http://types.webservice.customermodule.isdp.danet.de'
    xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'
    xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'
    SOAP-ENV:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'
    xmlns:xsd='http://www.w3.org/2001/XMLSchema'
   >
    <SOAP-ENV:Body>
      <typ:getCustomer>
        <requestId>ID1237465054874</requestId>
        <user>test</user>
        <password>secret</password>
        <customerIdList />
        <condition />
      </typ:getCustomer>
    </SOAP-ENV:Body>
  </SOAP-ENV:Envelope>
*/
function tableCustomerDblClick()
{
  var f = new TContainer ( "Form.Customer.Module" ) ;
  var p = f.getPeerByName ( "TABLE.CUSTOMER" ) ;
  var ud = p.getSelectedUserXml() ;
  var pp = f.getPeerByName ( "DISPLAY.CUSTOMER.DETAILS" ) ;
pp.clear() ;
pp.print ( String ( ud ) ) ;
  var f2 = new TContainer ( "Form.Customer.Module.Left" ) ;
  f2.setValues ( ud ) ;
}
function showSoapDataSkills()
{
  try
  {
    var u = new SoapClient ( "http://wevli125.de.corp.danet.com:8060/skillmanagement-wsi/services/skillmanagement" ) ;
    u.addNameSpace ( "xmlns:typ", 'http://types.webservice.skillmanagement.isdp.danet.de' ) ;

var op = ""
+"<typ:getSkillTemplate>\n"
+"  <requestId>" + TSys.getTempId() + "</requestId>\n"
+"  <user>test</user>\n"
+"  <password>secret</password>\n"
+"  <skillTemplate>\n"
+"    <displayGroup>2</displayGroup>\n"
+"  </skillTemplate>\n"
+"</typ:getSkillTemplate>\n"
;
    var xml = u.execute ( op ) ;
    var x = xml.getXml ( "Content/getSkillTemplateResponse" ) ;
    var f = new TContainer ( "Form.Skill.Tree" ) ;
    f.setValues ( x ) ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error() ;
    throw exc ;
  }
}
function showSoapData()
{
  try
  {
    var u = new SoapClient ( "http://wevwi016.de.corp.danet.com:8080/customermodule-wsi/services/customermodule" ) ;
    u.addNameSpace ( "xmlns:typ", 'http://types.webservice.customermodule.isdp.danet.de' ) ;

var op = ""
+"<typ:getCustomer>\n"
+"  <requestId>" + TSys.getTempId() + "</requestId>\n"
+"  <user>test</user>\n"
+"  <password>secret</password>\n"
+"  <customerIdList />\n"
+"  <condition />\n"
+"</typ:getCustomer>\n"
;
    var xml = u.execute ( op ) ;
    var xResponse = xml.getXml ( "Content/getCustomerResponse" ) ;
xResponse.setName ( "TABLE.CUSTOMER" ) ;
    var f = new TContainer ( "Form.Customer.Module" ) ;
    f.setValues ( xResponse ) ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error() ;
    throw exc ;
  }
}
var xif = null ;
function showSVG()
{
/*
  var t = TSys.getText ( "data.xml" ) ;
//log ( t ) ;
  if ( ! xif )
  {
    xif = document.createElement ( "iframe" ) ;
    document.body.appendChild ( xif ) ;
xif.style.width = "400px" ;
xif.style.height = "400px" ;
xif.style.backgroundColor = "white" ;
  }
  xif.src = "data.xml" ;
    {
      var doc = xif.contentDocument;
      if ( ! doc ) doc = xif.contentWindow.document;
      if ( doc && doc.body )
      {
        var b = doc.body ;
log ( new TXml ( b ) ) ;
      }
    }
*/
}
function showWeather()
{
  Cosmos.startPlugin ( "Weather" ) ;

/*
*/
}
