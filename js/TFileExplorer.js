Tango.include ( "TTable" ) ;
Tango.include ( "TDisplay" ) ;
// ------------- FileExplorer ----------------------
var TFileExplorer = function ( formTree, formTable, formDisplay )
{
  this.jsClassName = "TFileExplorer" ;
  this._actionOnClick = false ;
  if ( formTree instanceof TXml )
  {
    this._actionOnClick = formTree.getBoolAttribute ( "action-on-click", false ) ;
  }
  this.tree = null ;
  this.acDisplay = new TDisplay() ;
}
TFileExplorer.prototype.onloadTable = function ( ev )
{
  this.table = ev.getPeer() ;
  this.table.addActionListener ( this, this.tableDblClick ) ;
  this.table.addSelectionListener ( this, this.tableClick ) ;
}
TFileExplorer.prototype.onloadDisplay = function ( ev )
{
  this.display = ev.getContainer() ;
}
TFileExplorer.prototype.onloadTree = function ( ev )
{
  this.tree = ev.getPeer() ;
}
TFileExplorer.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
}
TFileExplorer.prototype.setRoot = function ( root )
{
  this.root = root ;
}
TFileExplorer.prototype.showSelectedFile = function()
{
  var ud = this.table.getSelectedUserXml() ;
  if ( !ud )
  {
    var d = new TUserDialog ( "PleaseFirstSelectAnEntry" ) ;
    d.info() ;
    return ;
  }
  if ( ud.getAttribute ( "isDirectory" ) )
  {
    return ;
  }
  try
  {
    this.displayFileFromXml ( ud ) ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( String ( exc  ) ) ;
    d.info() ;
  }
}
TFileExplorer.prototype.downloadSelectedFile = function()
{
  var ud = this.table.getSelectedUserXml() ;
  if ( !ud )
  {
    var d = new TUserDialog ( "PleaseFirstSelectAnEntry" ) ;
    d.info() ;
    return ;
  }
  if ( ud.getAttribute ( "isDirectory" ) )
  {
    return ;
  }
  try
  {
    this.acDisplay.downloadDocument ( ud ) ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( String ( exc  ) ) ;
    d.info() ;
  }
}
TFileExplorer.prototype.tableClick = function ( event )
{
  if ( ! this._actionOnClick ) return ;
  var ev = event ;
  var tab = ev.getJsSource() ; 

  var colIndex = tab.getSelectedColumnIndex() ;
  var ud = tab.getSelectedUserXml() ;
  if ( !ud ) return ;
  if ( ! this.checkIsTextOrImage ( ud ) ) return ;
  this.displayFileFromXml ( ud ) ;
  return false ;
}
TFileExplorer.prototype.tableDblClick = function ( event )
{
  var ev = event ;
  var tab = ev.getPeer() ; 

  var eud = tab.getSelectedUserData() ;
  if ( !eud ) return ;
  var ud = new TXml ( eud ) ;
  if ( ud.getAttribute ( "isDirectory" ) )
  {
    var DIR = ud.getContent ( "DIR" ).trim() ;
    var NAME = ud.getContent ( "NAME" ).trim() ;
    DIR = DIR.replace ( /\\/g, "/" ) ;
    var path = DIR + "/" + NAME ;

    var node = this.tree.getNodeByName ( path ) ;

    if ( node && node.getParent() )
    {
      node.getParent().open() ;
    }
    this.fillTable ( path, null )
    if ( node ) node.select() ;
  }
  else
  {
    this.displayFileFromXml ( ud ) ;
  }
  return false ;
}
TFileExplorer.prototype.displayFileFromXml = function ( ud )
{
  if ( !ud ) return ;
  var NAME = ud.getContent ( "NAME" ).trim() ;
  var isText = ud.getAttribute ( "isText" ) == "true" ? true : false ;
  var mimeType = ud.getAttribute ( "mimeType" ) ;
  try
  {
    if ( mimeType.indexOf ( "text" ) == 0 || isText || TSys.isMimetypeText ( mimeType, NAME ) )
    {
      var self = this ;
      this.acDisplay.getDocument ( ud, function ( xml )
      {
        var t = xml.getContent ( "ACDISP.RESULT/Html" ) ;
        self.display.setText ( t ) ;
      } ) ;
    }
    else
    if ( mimeType.indexOf ( "image" ) == 0 )
    {
      var url = this.acDisplay.getDocumentUrl ( ud ) ;
      this.display.setText ( "<span><img src='" + url + "' /></span>" ) ;
    }
    else
    {
      this.acDisplay.downloadDocument ( ud, true ) ;
    }
  }
  catch ( exc )
  {
    var d = new TUserDialog ( String ( exc  ) ) ;
    d.info() ;
    throw exc ;
  }
}
TFileExplorer.prototype.checkIsTextOrImage = function ( ud )
{
  if ( !ud ) return false ;
  if ( ud.getAttribute ( "isDirectory" ) ) return false ;
  var NAME = ud.getContent ( "NAME" ).trim() ;
  var isText = ud.getAttribute ( "isText" ) == "true" ? true : false ;
  var mimeType = ud.getAttribute ( "mimeType" ) ;
  if ( mimeType.indexOf ( "text" ) == 0 || isText || TSys.isMimetypeText ( mimeType, NAME ) )
  {
    return true ;
  }
  else
  if ( mimeType.indexOf ( "image" ) == 0 )
  {
    return true ;
  }
  return false ;
}
// ------------------- Tree --------------------------
TFileExplorer.prototype.fillTree = function ( event, path, pattern )
{
   if ( ! path ) path = this.root ;
   this.acDisplay.getDirectoryTree ( path, this.fillTreeCallback, this ) ;
}
TFileExplorer.prototype.fillTreeCallback = function ( x )
{
  var xFileListRoot = x.getXml ( "FileList" ) ;
  var PWD = x.getContent ( "PWD" ) ;
  PWD = PWD.replace ( /\\/g, "/" ) ;
  var NAME = PWD ;
  var pos = PWD.lastIndexOf ( "/" ) ;
  var DIR = "" ;
  if ( pos > 0 )
  {
    DIR = PWD.substring ( 0, pos ) ;
    NAME = PWD.substring ( pos+1 ) ;
  }

  if ( xFileListRoot )
  {
    xFileListRoot.addAttribute ( "isDirectory", true ) ;
    xFileListRoot.addDom ( "DIR", DIR ) ;
    xFileListRoot.addDom ( "NAME", NAME ) ;
    var en = xFileListRoot.getEnum ( "row" ) ;
    this.tree.clear() ;

    var n = 0 ;
    var node = this.tree.add ( n, -1, NAME, xFileListRoot ) ;
    node.setName ( PWD ) ;
    this._buildTree ( en, n ) ;
  }
  this.tree.show() ;
}
TFileExplorer.prototype._buildTree = function ( en, n )
{
  var nRoot = n ;
  while ( en.hasNext() )
  {
    var xRow = new TXml ( en.next() ) ;
    var DIR = xRow.getContent ( "DIR" ).trim() ;
    var NAME = xRow.getContent ( "NAME" ).trim() ;
    n++ ;
    DIR = DIR.replace ( /\\/g, "/" ) ;
    var nodeName = DIR + "/" + NAME ;
    var node = this.tree.add ( n, nRoot, NAME, xRow ) ;
    node.setName ( nodeName ) ;
    var xFileList = xRow.getXml ( "FileList" ) ;
    if ( xFileList )
    {
      var en2 = xFileList.getEnum ( "row" ) ;
      n = this._buildTree ( en2, n ) ;
    }
  }
  return n ;
}
TFileExplorer.prototype.treeItemSelected = function ( ev )
{
  var tree = ev.getPeer() ;
  var ud = tree.getSelectedUserXml() ;
  if ( ud )
  {
    var DIR = ud.getContent ( "DIR" ).trim() ;
    var NAME = ud.getContent ( "NAME" ).trim() ;
    this.fillTable ( DIR + "/" + NAME ) ;
  }
}
TFileExplorer.prototype.fillTable = function ( path, pattern )
{
  this.acDisplay.getDirectoryList ( path, pattern, this.fillTableCallback, this ) ;
}
TFileExplorer.prototype.fillTableCallback = function ( x )
{
  if ( ! x )
  {
    this.table.setData () ;
    return ;
  }
  var x = x.getXml ( "FileList" ) ;
  this.table.setData ( x ) ;
}
