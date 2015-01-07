Tango.include ( "TWindow" ) ;
Tango.include ( "TDisplay" ) ;
Tango.include ( "TTable" ) ;

var _TheFileExplorer2 = null ;
var TFileExplorerWindow = function ( path, pattern )
{
  _TheFileExplorer2 = this ;
  this.taskName = null ;
  this.pattern = pattern ;
  this.path = path ;
  this.rootpath = null ;
  this.requestTagName = null ;
  this.resultTagName = null ;

  this.entryChoosen = false ;
  this.DIR = null ;
  this.NAME = null ;
  this.actionListener = null ;

  var windowId = "TFileExplorer" ;
  var str = TSys.translate ( "Files" ) ;
  var windowTitle = str + "..." ;
  this.w = new TWindow ( windowId ) ;
  this.w.setId ( windowId ) ;
  this.windowTitle = windowTitle ;

  this.fileActionCommand = null ;
  this.modal = true ;
  this.acDisplay = new TDisplay() ;
  this.ROOT = "" ;
}
TFileExplorerWindow.prototype.setTitle = function ( title )
{
  if ( ! title ) return ;
  this.windowTitle = title ;
}
TFileExplorerWindow.prototype.setRootPath = function ( path )
{
  this.rootPath = path ;
}
TFileExplorerWindow.prototype.setActionListener = function ( self, method )
{
  this.actionListener = new TFunctionExecutor ( self, method ) ;
}
TFileExplorerWindow.prototype.toString = function()
{
  return "(TFileExplorerWindow)"
       + "\n" + this.w
       ;
}
TFileExplorerWindow.prototype.windowClosing = function ( event )
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
TFileExplorerWindow.prototype.getSelectedXml = function()
{
  var eud = this.table.getSelectedUserData() ;
  if ( !eud ) return ;
  return new TXml ( eud ) ;
}
TFileExplorerWindow.prototype.buttonRefreshEventListener = function ( event )
{
  this.fillTree ( this.rootPath, null ) ;
}
TFileExplorerWindow.prototype.buttonDownloadFileEventListener = function ( event )
{
  var eud = this.table.jsPeer.getSelectedUserData() ;
  if ( !eud ) return ;
  var ud = new TXml ( eud ) ;
  this.acDisplay.downloadDocument ( ud, false ) ;
}
TFileExplorerWindow.prototype.setFileActionCommand = function ( self, method )
{
  this.fileActionCommand = new TFunctionExecutor ( self, method ) ;
}
TFileExplorerWindow.prototype.setModal = function ( state )
{
  this.modal = state ;
}
TFileExplorerWindow.prototype.flush = function()
{
  this.w = null ;
  if ( this.fileActionCommand ) this.fileActionCommand.flush() ;
  this.fileActionCommand = null ;
}
TFileExplorerWindow.prototype.show = function()
{
  this.w.setTitle ( this.windowTitle ) ;
  this.w.addWindowListener ( this ) ;
  this.w.create() ;
  this.w.setModal ( this.modal ) ;

  var wBody = new TXml ( this.w.getBody() ) ;

  this.formTree = wBody.getDomById ( "Window.FileExplorer.Form.Tree" ) ;
  this.formTree.jsPeer = this ;
  var newID = TSys.getTempId() ;
  this.formTree.id = newID ;
  this.tree = null ;
  this.table = wBody.getDomById ( "Window.FileExplorer.Table.FileList" ) ;
  this.table.jsPeer.addActionListener ( this, this.tableDblClick ) ;
  this.table.jsPeer.addSelectionListener ( this, this.tableClick ) ;
  this.formDisplay = wBody.getDomById ( "Window.FileExplorer.Form.Display" ) ;

  var pbHome = wBody.getDomByName ( "PB.Refresh" ) ;
  TGui.addEventListener ( pbHome, "click", this.buttonRefreshEventListener.bindAsEventListener ( this ) ) ;
  var pbRoot = wBody.getDomByName ( "PB.DownloadFile" ) ;
  TGui.addEventListener ( pbRoot, "click", this.buttonDownloadFileEventListener.bindAsEventListener ( this ) ) ;
  this.fillTree ( this.rootPath ) ;
  this.w.show() ;
}
TFileExplorerWindow.prototype.tableDblClick = function ( event )
{
  var ev = event ;
  var tab = ev.getJsSource() ; 

  var eud = tab.getSelectedUserData() ;
  if ( !eud ) return ;
  var ud = new TXml ( eud ) ;
  if ( ud.getAttribute ( "isDirectory" ) )
  {
    var DIR = ud.getContent ( "DIR" ).trim() ;
    var NAME = ud.getContent ( "NAME" ).trim() ;
    var path = null ;
    if ( DIR.indexOf ( "\\" ) > 0 )
    {
      path = DIR + "\\" + NAME ;
    }
    else
    {
      path = DIR + "/" + NAME ;
    }
    var pn = this.pathToParentN[DIR] ;
    if ( ! isNaN ( pn ) )
    {
      xx.open ( pn ) ;
      this.fillTable ( path, null )
    }
    var n = this.pathToN[path] ;
    if ( ! isNaN ( n ) )
    {
      xx.s ( n ) ;
    }
  }
  else
  {
    this.displayFileFromXml ( ud ) ;
  }
  return false ;
}
TFileExplorerWindow.prototype.displayFileFromXml = function ( ud )
{
  if ( !ud ) return ;
  var NAME = ud.getContent ( "NAME" ).trim() ;
  var isText = String ( ud.getAttribute ( "isText" ) ) == "true" ? true : false ;
  var mimeType = ud.getAttribute ( "mimeType" ) ;
  try
  {
    if ( mimeType.indexOf ( "text" ) == 0 || isText || TSys.isMimetypeText ( mimeType, NAME ) )
    {
      var self = this ;
      this.acDisplay.getDocument ( ud, function ( xml )
      {
        var t = xml.getContent ( "ACDISP.RESULT/Html" ) ;
        self.formDisplay.innerHTML = t ;
      } ) ;
    }
    else
    if ( mimeType.indexOf ( "image" ) == 0 )
    {
      var url = this.acDisplay.getDocumentUrl ( ud ) ;
      this.formDisplay.innerHTML = "<span><img src='" + url + "' /></span>" ;
    }
    else
    {
      this.acDisplay.downloadDocument ( ud, true ) ;
    }
  }
  catch ( exc )
  {
    var dUserDialog = new TUserDialog ( String ( exc  ) ) ;
    dUserDialog.info() ;
    throw exc ;
  }
}
TFileExplorerWindow.prototype.tableClick = function ( event )
{
  var ev = event ;
  var tab = ev.getJsSource() ; 

  var colIndex = tab.getSelectedColumnIndex() ;
  var eud = tab.getSelectedUserData() ;
  if ( !eud ) return ;
  var ud = new TXml ( eud ) ;
  return false ;
}
// ------------------- Tree --------------------------
TFileExplorerWindow.prototype.fillTree = function ( path, pattern )
{
   this.acDisplay.getDirectoryTree ( path, this.fillTreeCallback, this ) ;
}
TFileExplorerWindow.prototype.fillTreeCallback = function ( x )
{
  this.nToXml = [] ;
  this.pathToN = [] ;
  this.pathToParentN = [] ;
  this.ROOT = x.getContent ( "HOME" ) ;
  var NAME = this.ROOT ;
  var pos = this.ROOT.lastIndexOf ( "/" ) ;
  if ( pos < 0 ) pos = this.ROOT.lastIndexOf ( "\\" ) ;
  if ( pos > 0 ) NAME = this.ROOT.substring ( pos+1 ) ;

  var xFileListRoot = x.getXml ( "FileList" ) ;
  if ( xFileListRoot )
  {
//log ( x ) ; //FileListRoot ) ;
    var en = xFileListRoot.getEnum ( "row" ) ;
    this.tree = new _TTree('xx');
xx = this.tree ;
    var n = 0 ;
    this.tree._ParentContainerId = this.formTree.id ;
//    this.tree.add( n,-1, ROOT, "javascript:Nop_fHref('" + this.formTree.id + "')");
    this.pathToN[this.ROOT] = n ;
    this.tree.add ( n, -1, NAME, "javascript:TheFileExplorer_fHref('" + this.formTree.id + "'," + n + ")" ) ;
    this.buildTree ( en, n ) ;
  }
  var str = String ( this.tree ) ;
//log ( str ) ;
  this.formTree._TTree = this.tree ;
  this.formTree._TheFileExplorer = this ;
  this.formTree.innerHTML = str ;
}
TFileExplorerWindow.prototype.buildTree = function ( en, n )
{
  var nRoot = n ;
  while ( en.hasNext() )
  {
    var xRow = new TXml ( en.next() ) ;
    var DIR = xRow.getContent ( "DIR" ).trim() ;
    var NAME = xRow.getContent ( "NAME" ).trim() ;
    n++ ;
    this.nToXml[n] = xRow ;
    if ( DIR.indexOf ( "\\" ) > 0 )
    {
      this.pathToN[DIR + "\\" + NAME] = n ;
    }
    else
    {
      this.pathToN[DIR + "/" + NAME] = n ;
    }
    this.pathToParentN[DIR] = nRoot ;
    var node = this.tree.add ( n, nRoot, NAME, "javascript:TheFileExplorer2_fHref('" + this.formTree.id + "'," + n + ")" ) ;
    var xFileList = xRow.getXml ( "FileList" ) ;
    if ( xFileList )
    {
      var en2 = xFileList.getEnum ( "row" ) ;
      n = this.buildTree ( en2, n ) ;
    }
  }
  return n ;
}
// ------------------- Table -------------------------
TFileExplorerWindow.prototype.fillTable = function ( path, pattern )
{
  this.acDisplay.getDirectoryList ( path, pattern, this.fillTableCallback, this ) ;
}
TFileExplorerWindow.prototype.fillTableCallback = function ( x )
{
  if ( ! x )
  {
    this.table.jsPeer.setData () ;
    return ;
  }
  var x = x.getXml ( "FileList" ) ;
  this.table.jsPeer.setData ( x ) ;
}
/*
function Nop_fHref ( src, n )
{
}
*/
function TheFileExplorer2_fHref ( parentContainerId, n )
{
  var form = document.getElementById ( parentContainerId ) ;
  var _TTree = form._TTree ;
  var jsPeer = form.jsPeer ;
  var xRow = jsPeer.nToXml[n] ;
  if ( xRow )
  {
    var DIR = xRow.getContent ( "DIR" ).trim() ;
    var NAME = xRow.getContent ( "NAME" ).trim() ;
    jsPeer.fillTable ( DIR + "/" + NAME ) ;
  }
  else
  {
//    jsPeer.fillTable ( jsPeer.ROOT ) ;
  }
}
