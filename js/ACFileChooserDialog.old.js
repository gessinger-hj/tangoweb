Tango.include ( "TWindow" ) ;
Tango.include ( "TDisplay" ) ;
var TFileChooser = function ( path, pattern )
{
  this.pattern = pattern ;
  this.path = path ;
  this.rootpath = null ;

  this.entryChoosen = false ;
  this.DIR = null ;
  this.NAME = null ;
  this.actionListener = null ;

  var windowId = "File.Chooser.Dialog" ;
  var str = TSys.translate ( "Files" ) ;
  var windowTitle = str + "..." ;
  this.w = new TWindow ( windowId ) ;
  this.w.setPagelet ( this ) ;
  this.w.setId ( windowId ) ;
  this.windowTitle = windowTitle ;
  this.closeOnApply = true ;

  this.fileActionCommand = null ;
  this.modal = true ;
  this.acDisplay = new TDisplay() ;
}
TFileChooser.prototype.onloadTable = function ( ev )
{
  this.table = ev.getPeer() ;
}
TFileChooser.prototype.setTitle = function ( title )
{
  if ( ! title ) return ;
  this.windowTitle = title ;
}
TFileChooser.prototype.setCloseOnApply = function ( state )
{
  if ( state === true ) this.closeOnApply = true ;
  else                  this.closeOnApply = false ;
}
TFileChooser.prototype.setRootPath = function ( path )
{
  this.rootPath = path ;
}
TFileChooser.prototype.setActionListener = function ( self, method )
{
  this.actionListener = new TFunctionExecutor ( self, method ) ;
}
TFileChooser.prototype.getFilePattern = function()
{
  return this.filePattern ;
}
TFileChooser.prototype.getDirectory = function()
{
  return this.DIR ;
}
TFileChooser.prototype.getFilename = function()
{
  return this.NAME ;
}
TFileChooser.prototype.toString = function()
{
  return "(TFileChooser)"
       + "\n" + this.w
       ;
}
TFileChooser.prototype.windowClosing = function ( event )
{
  this.w = null ;
  if ( this.actionListener ) this.actionListener.flush() ;
  this.actionListener = null ;
  if  ( ! this.entryChoosen )
  {
    this.DIR = null ;
    this.NAME = null ;
  }
}
TFileChooser.prototype.getSelectedXml = function()
{
  return this.table.getSelectedUserXml() ;
}
TFileChooser.prototype.apply = function ( event )
{
  var ud = this.table.getSelectedUserXml() ;
  if ( ! ud ) return ;
  this.entryChoosen = true ;
  this.DIR = ud.getContent ( "DIR" ).trim() ;
  this.NAME = ud.getContent ( "NAME" ).trim() ;
  var vals = this.w.getValues() ;
  this.filePattern = vals.getContent ( "Pattern" ).trim() ;
  if ( this.actionListener )
  {
    var ev = new TEvent ( event ) ;
    ev.setJsSource ( this ) ;
    this.actionListener.executeWithEvent ( ev ) ;
    ev.flush() ;
  }
  if ( this.closeOnApply ) this.w.close() ;
}
TFileChooser.prototype.textfieldPWD = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( ! ev.isEnter() ) return false ;

  var vals = this.w.getValues() ;
  this.fill ( vals.getContent ( "PWD" ), vals.getContent ( "Pattern" ) ) ;
}
TFileChooser.prototype.textfieldPattern = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( ! ev.isEnter() ) return false ;
  var vals = this.w.getValues() ;
  this.fill ( vals.getContent ( "PWD" ), vals.getContent ( "Pattern" ) ) ;
}
TFileChooser.prototype.buttonHome = function ( event )
{
  var vals = this.w.getValues() ;
  var dir = vals.getContent ( "HOME" ) ;
  this.fill ( dir, null ) ;
}
TFileChooser.prototype.buttonRoot = function ( event )
{
  var vals = this.w.getValues() ;
  var dir = vals.getContent ( "ROOT", "/" ) ;
  this.fill ( dir, null ) ;
}
TFileChooser.prototype.setFileActionCommand = function ( self, method )
{
  this.fileActionCommand = new TFunctionExecutor ( self, method ) ;
}
TFileChooser.prototype.setModal = function ( state )
{
  this.modal = state ;
}
TFileChooser.prototype.flush = function()
{
  this.w = null ;
  if ( this.fileActionCommand ) this.fileActionCommand.flush() ;
  this.fileActionCommand = null ;
}
TFileChooser.prototype.show = function()
{
  var tableId = "Table.File.Chooser.Dialog" ;
  this.w.setTitle ( this.windowTitle ) ;
  this.w.addWindowListener ( this ) ;
  this.w.create() ;
  this.w.setModal ( this.modal ) ;
  this.fill() ;
  this.w.show() ;
}
TFileChooser.prototype.fill = function ( path, pattern )
{
  if ( ! path ) path = this.path ;
  if ( ! pattern ) pattern = this.pattern ;
  this.acDisplay.getDirectoryList ( path, pattern, this.fillCallback, this, true, this.rootPath ) ;
}
TFileChooser.prototype.fillCallback = function ( x )
{
  this.w.setValues ( x ) ;
}
TFileChooser.prototype.tableDblClick = function ( event )
{
  var ev = event ;
  var tab = ev.getJsSource() ; 
  ev.consume() ;

  var ud = tab.getSelectedUserXml() ;
  if ( !ud ) return ;
  if ( ud.getAttribute ( "isDirectory" ) )
  {
    this.DIR = ud.getContent ( "DIR" ).trim() ;
    this.NAME = ud.getContent ( "NAME" ).trim() ;
    var path = this.DIR + "/" + this.NAME ;
    var vals = this.w.getValues() ;
    this.fill ( path, vals.getContent ( "Pattern" ) ) ;
  }
  else
  if ( this.fileActionCommand )
  {
    this.fileActionCommand.executeWithEvent ( ev ) ;
  }
  return false ;
}
TFileChooser.prototype.tableClick = function ( event )
{
  var ev = event ;
  var tab = ev.getJsSource() ; 
  ev.consume() ;

  var colIndex = tab.getSelectedColumnIndex() ;
  var ud = tab.getSelectedUserXml() ;
  if ( ! ud ) return ;
  this.DIR = ud.getContent ( "DIR" ).trim() ;
  this.NAME = ud.getContent ( "NAME" ).trim() ;
  if ( colIndex == 0 && ud.getAttribute ( "isDirectory" ) )
  {
    var path = this.DIR + "/" + this.NAME ;
    var vals = this.w.getValues() ;
    this.fill ( path, vals.getContent ( "Pattern" ) ) ;
    return false ;
  }
  return false ;
}
