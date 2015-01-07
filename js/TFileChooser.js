Tango.include ( "TWindow" ) ;
var TFileChooser = function ( file, offset, pattern )
{
  this.lsProxy = file.getLsProxy() ;
  this.offset = offset ? offset : file.toString() ;
  this.pattern = pattern ? pattern : "" ;

  var windowId = "File.Chooser.Dialog" ;
  var str = TSys.translate ( "Files" ) ;
  var windowTitle = str + "..." ;
  this.w = new TWindow ( windowId ) ;
  this.w.setPagelet ( this ) ;
  this.w.setId ( windowId ) ;
  this.windowTitle = windowTitle ;
  this.modal = true ;
  Tango.mixin ( EventMulticasterTrait, this ) ;
  this.breadcrumb ;
  this.breadcrumbOffset = "" ;
  this._action = this._ACTION_OPEN_FILE ;
};
TFileChooser.prototype._ACTION_OPEN_FILE = 1 ;
TFileChooser.prototype._ACTION_SELECT_DIRECTORY = 2 ;
TFileChooser.prototype._ACTION_SAVE_FILE = 3 ;
TFileChooser.prototype._ACTION_SAVE_FILE_AS = 4 ;
TFileChooser.prototype.onloadTable = function ( ev )
{
  this.table = ev.getPeer() ;
};
TFileChooser.prototype.onload = function ( ev )
{
  this.PB_UP = ev.getContainer().getComponent ( "PB_UP" ) ;
};
TFileChooser.prototype.onloadBreadcrumb = function ( ev )
{
  this.breadcrumb = ev.getContainer() ;
};
TFileChooser.prototype.onSetValuesFile = function ( r )
{
  if ( r.getBoolAttribute ( "isDirectory", false ) )
  {
    var str = TGui.translateImageName ( "Tango/Folder.16/normal" ) ;
    r.add ( "IMG", str ) ;
  }
};
TFileChooser.prototype.setTitle = function ( title )
{
  if ( ! title ) return ;
  this.windowTitle = title ;
}
TFileChooser.prototype.setRootPath = function ( path )
{
  this.rootPath = path ;
}
TFileChooser.prototype.toString = function()
{
  return "(TFileChooser)"
       + "\n" + this.w
       ;
}
TFileChooser.prototype.flush = function()
{
  this.flushEventMulticaster() ;
  if ( this.w )
  {
    this.w.closeImmediately() ;
  }
  delete this.w ;
};
TFileChooser.prototype.windowClosing = function ( event )
{
  this.flush() ;
}
TFileChooser.prototype.cancel = function ( event )
{
  if ( this.w )
  {
    this.w.close() ;
  }
}
TFileChooser.prototype.apply = function ( event )
{
  var f ;
  var ev ;
  var thiz = this ;
  var ud = this.table.getSelectedUserXml() ;
  if ( this._action == this._ACTION_SAVE_FILE_AS )
  {
    var fName = this.TF_Pattern.getText().trim() ;
    if ( ! fName ) return ;
    f = new File ( this.lsProxy, this.offset, fName ) ;
    if ( f.exists() )
    {
      var d = new TUserDialog ( "File exists. Overwrite?" ) ;
      d.askYesNo ( function ( answer )
      {
        if ( ! answer.isYes() ) return ;
        ev = new TItemEvent ( event, f ) ;
        ev.setJsSource ( this ) ;
        thiz._fireEvent ( ev, "action-file" ) ;
        ev.flush() ;
      } ) ;
      return ;
    }
    ev = new TItemEvent ( event, f ) ;
    ev.setJsSource ( this ) ;
    this._fireEvent ( ev, "action-file" ) ;
    ev.flush() ;
    return ;
  }
  if ( ! ud ) return ;
  f = new File ( this.lsProxy, ud ) ;
  ev = new TItemEvent ( event, f ) ;
  ev.setJsSource ( this ) ;
  if ( f.isDirectory() )
  {
    if ( this._action == this._ACTION_SELECT_DIRECORY )
    {
      this._fireEvent ( ev, "action-direcory" ) ;
      ev.flush() ;
    }
  }
  else
  {
    if ( this._action == this._ACTION_OPEN_FILE )
    {
      this._fireEvent ( ev, "action-file" ) ;
      ev.flush() ;
    }
  }
  ev.flush() ;
};
TFileChooser.prototype.buttonHome = function ( event )
{
  this.offset = "" ;
  this.breadcrumbOffset = "" ;
  this.fill() ;
}
TFileChooser.prototype.buttonUp = function ( event )
{
  var parent = new File ( this.offset ).getParent() ;
  this.offset = parent ;
  this.fill() ;
}
TFileChooser.prototype.setModal = function ( state )
{
  this.modal = !!state ;
};
TFileChooser.prototype._setTitle = function ( text )
{
  if ( ! text ) text = "" ;
  this.w.setTitle ( this.windowTitle + text ) ;
};
TFileChooser.prototype.openFile = function ( pattern, title )
{
  this._action = this._ACTION_OPEN_FILE ;
  if ( title ) this.windowTitle = title ;
  else         this.windowTitle = "Open File from: " ;
  this._show() ;
};
TFileChooser.prototype.saveAs = function ( name, title )
{
  this._action = this._ACTION_SAVE_FILE_AS ;
  if ( title ) this.windowTitle = title ;
  else         this.windowTitle = "Save as: " ;
  this._show() ;
  if ( name ) this.TF_Pattern.setText ( name ) ;
};
TFileChooser.prototype._show = function()
{
  var tableId = "Table.File.Chooser.Dialog" ;
  this._setTitle() ;
  this.w.addWindowListener ( this ) ;
  this.w.create() ;
  this.TF_Pattern = this.w.getComponent ( "TF_Pattern" ) ;
  this.TF_PWD = this.w.getComponent ( "PWD" ) ;
  this.w.setModal ( this.modal ) ;
  this.fill() ;
  this.w.show() ;
};
TFileChooser.prototype.tableClick = function ( event )
{
  var colIndex = this.table.getSelectedColumnIndex() ;
  var ud = this.table.getSelectedUserXml() ;
  if ( ! ud ) return ;
  if ( ud.getAttribute ( "isDirectory" ) )
  {
    if ( colIndex == 0 )
    {
      this.offset  = ud.getAttribute ( "path" ) ;
      this.fill() ;
      return ;
    }
    if ( this._action == this._ACTION_SELECT_DIRECORY )
    {
      var name = ud.getContent ( "NAME" ) ;
      this.TF_Pattern.setText ( name ) ;
      return ;
    }
    return ;
  }
  var name = ud.getContent ( "NAME" ) ;
  this.TF_Pattern.setText ( name ) ;
};
TFileChooser.prototype.tableDblClick = function ( event )
{
  var ud = this.table.getSelectedUserXml() ;
  if ( !ud ) return ;
  if ( ud.getAttribute ( "isDirectory" ) )
  {
    this.offset  = ud.getAttribute ( "path" ) ;
    this.fill() ;
  }
  else
  {
    if ( this._action == this._ACTION_OPEN_FILE )
    {
      var f = new File ( this.lsProxy, ud ) ;
      var ev = new TItemEvent ( event, f ) ;
      ev.setJsSource ( this ) ;
      this._fireEvent ( ev, "action-file" ) ;
      ev.flush() ;
    }
  }
};
TFileChooser.prototype.fill = function ( bcoffset )
{
  var offset = this.offset ;
  var x = this.lsProxy.getFileList ( this.offset, this.pattern ) ;
  x.get ( "LS.RESULT/Files" ).elements ( function(e)
  {
    if ( e.getBoolAttribute ( "isDirectory" ) )
    {
      e.add ( "IMG", TGui.translateImageName("Tango/Folder.16/normal") ) ;
    }
    var f = new File ( offset, e.getContent ( "NAME" ) ) ;
    e.addAttribute ( "path", "" + f  ) ;
  });
  this.table.setValues ( x.get ( "LS.RESULT" ) ) ;
  var nameSpace = this.lsProxy.getNameSpace() ;
  if ( ! nameSpace ) nameSpace = "Default" ;
  this._setTitle ( nameSpace + ":/" + this.offset ) ;

  var offset = this.offset ;
  if ( bcoffset ) offset = bcoffset ;
  if ( offset )
  {
    this.PB_UP.setEnabled ( true ) ;
    var a = offset.split ( "/" ) ;
    var xs = "<xml>\n" ;
    var noffset = "" ;
    var js = "*.fillFilesFromBreadcrumb()" ;
    var js2 = "*.showDirectoriesFromBreadcrumb()" ;
    xs += "<PushButton img=\"home-icon-32.png\" style=\"margin-right:0px;\" name=\"" + noffset + "\" use-button-minimum=\"false\" onclick=\"" + js + "\"/>\n" ;
    for ( var i = 0 ; i < a.length ; i++ )
    {
      if ( ! a[i] ) continue ;
      xs += "<PushButton text=\"/\" style=\"margin-right:0px;\" name=\"" + noffset + "\" use-button-minimum=\"false\" onclick=\"" + js2 + "\"/>\n" ;
      if ( noffset )
      {
        noffset += "/" ;
      }
      noffset = noffset + a[i] ;
      xs += "<PushButton text=\"" + a[i] + "\" style=\"margin-right:0px;\" name=\"" + noffset + "\" use-button-minimum=\"false\" onclick=\"" + js + "\"/>\n" ;
    }
    xs += "</xml>\n" ;
    this.breadcrumb.setAxl ( xs ) ;
    this.breadcrumbOffset = offset ;
  }
  else
  {
    this.PB_UP.setEnabled ( false ) ;
    TGui.flushAttributes ( this.breadcrumb.dom ) ;
    var xs = "<xml>\n" ;
    var noffset = "" ;
    var js = "*.fillFilesFromBreadcrumb()" ;
    xs += "<PushButton img=\"home-icon-32.png\" style=\"margin-right:0px;\" name=\"" + noffset + "\" use-button-minimum=\"false\" onclick=\"" + js + "\"/>\n" ;
    xs += "</xml>\n" ;
    this.breadcrumb.setAxl ( xs ) ;
    this.breadcrumbOffset = offset ;
  }
};
TFileChooser.prototype.fillFilesFromBreadcrumb = function ( event )
{
  var ev = new TEvent ( event ) ;
  var c = ev.getComponent() ;

  this.offset = c.getName() ;
  var bcoffset = this.breadcrumbOffset ;
  this.fill ( bcoffset ) ;
};
TFileChooser.prototype.showDirectoryFromBreadcrumbPopup = function ( ev )
{
  var v = this.w.getValues() ;
  var c = ev.getMenuItem() ;
  this.offset = c.getName() ;
  this.fill() ;
  this.breadcrumbOffset = this.offset ;
};
TFileChooser.prototype.showDirectoriesFromBreadcrumb = function ( event )
{
  var ev = new TEvent ( event ) ;
  var c = ev.getComponent() ;

  var xml = c.dom.xPopup ;
  if ( ! xml )
  {
    var offset = c.getName() ;
    var f = new File ( this.lsProxy, offset ) ;
    var x = f.getDirList() ;
    var xFiles = x.get ( "LS.RESULT/Files" ) ;
    xml = new TXml() ;
    c.dom.xPopup = xml ;
    TGui.addToBeFlushed ( c.dom, xml ) ;
    var xPopup = xml.add ( "Popup" ) ;
    var en = xFiles.getEnum ( "row" ) ;
    while ( en.hasNext() )
    {
      var r = en.nextXml() ;
      var name = r.getContent ( "NAME" ) ;
      var mi = xPopup.add ( "MenuItem" ) ;
      mi.addAttribute ( "name", offset + "/" + name ) ;
      mi.addAttribute ( "text", name ) ;
    }
  }
  var pm = new PopupMenu ( xml, c.getDom() ) ;
  pm.setShowPosition ( "UNDER" ) ;
  var layoutContext = new LayoutContext() ;
  layoutContext.pushPagelet ( this ) ;
  pm.setDefaultAction ( new TFunctionExecutor ( "*.showDirectoryFromBreadcrumbPopup()", layoutContext ) ) ;
  pm.show ( event ) ;
  layoutContext.popPagelet ( this ) ;
};
// Hebugi@83!
// hans-juergen.gessinger@datamatics.eu
/*
E-Mail Adresse: hans-juergen.gessinger@datamatics.eu
Hans Jürgen Gessinger
Weblogin: email.datamatics.eu
Benutzername: hans-juergen.gessinger
Passwort: Hebugi@83!
-----------------------------------------------
IMAP-Server: email.datamatics.eu
Verschlüsselung: STARTTLS/SSL
Port:143/993

SMTP-Server: email.datamatics.eu
Verschlüsselung: STARTTLS/SSL
Port:25/465
*/
