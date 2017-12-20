Tango.include ( "Extensions" ) ;
Tango.include ( "Picture" ) ;

/**
 *  @constructor
 */

Finder = function ( treeName )
{
  this.jsClassName = "Finder" ;
  this.offset = "" ;
  this.treeName = treeName ;
  this.lsProxy  = new LsProxy ( "" ) ;
  this.lsProxy.setKey ( "KEY0" ) ;
};
Finder.prototype.toString = function()
{
  return "(" + this.jsClassName + ")[lsProxy=" + this.lsProxy + "]" ;
};
Finder.prototype.onloadTable = function ( ev )
{
  this.table = ev.getPeer() ;
  this.table.addActionListener ( this, this.tableDblClick ) ;
  this.table.addSelectionListener ( this, this.tableClick ) ;
  this.table.addKeyListener ( this, this.tableKeyListener ) ;
};
Finder.prototype.onloadDisplay = function ( ev )
{
  this.display       = ev.getContainer() ;
  this.MF            = this.display.getPeer ( "MF" ) ;
  this.DISPLAY_TEXT  = this.display.getComponent ( "DISPLAY_TEXT" ) ;
  this.DISPLAY_IMAGE = this.display.getComponent ( "DISPLAY_IMAGE" ) ;
  this.TAB_IMAGE     = this.display.getComponent ( "TAB_IMAGE" ) ;
};
Finder.prototype.onloadTree = function ( ev )
{
  var thiz = this ;
  this.tree = ev.getPeer() ;
  this.tree.addSelectionListener ( this, this.treeItemSelected ) ;
  this.tree.addActionListener ( this, this.treeDblClick ) ;
  this.tree.addListener ( function(e)
  {
    var TR = e.getSource() ;
    if ( ! TR.isEmpty ) return ;
    var xRow = new TXml ( TR.domRow ) ;
    var path = xRow.getAttribute  ( "path" ) ;
    var p = e.getPagelet() ;
    var l = thiz.getDirList ( path ) ;
    var v = new TXml() ;
    l.get("LS.RESULT/Files").elements ( function(e)
    {
      var x  = v.add ( "node" ) ;
      var name = e.getContent ( "NAME" ) ;
      x.addAttribute ( "title",  name ) ;
      x.addAttribute ( "name",  name ) ;
      x.addAttribute ( "path",  path + "/" + name ) ;
    }) ;
    thiz.tree.addChildren ( e.getSource(), v ) ;
  }, "node-opened" ) ;
};
Finder.prototype.tableKeyListener = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( ev.isCursorLeft() || ev.isCursorRight() )
  {
    var ud, f ;
    ev.consume() ;
    if ( ev.getEvent().type != "keyup" ) return ;
    if ( ev.isCursorLeft() )
    {
      ud = this.table.getSelectedUserXml() ;
      if ( ud )
      {
        f = new File ( this.lsProxy, ud ) ;
      }
      else
      {
        // ud = this.tree.getSelectedUserXml() ;
      }
      if ( ! f ) return ;

      var p = f.getParent() ;
      if ( ! p ) return ;
      f = f.getParentFile() ;
      p = f.getParent() ;
      if ( ! p ) return ;
      this._fillTable ( p ) ;
      var fn = f.getName() ;
      var r = this.table.findRow ( "NAME", fn ) ;
      if ( r ) r.setSelected ( true ) ;
    }
    else
    if ( ev.isCursorRight() )
    {
      ud = this.table.getSelectedUserXml() ;
      if ( !ud ) return ;
      f = new File ( this.lsProxy, ud ) ;
      if ( ! f.isDirectory() ) return ;
      this.tableDblClick ( event ) ;
    }
  }
};
Finder.prototype.treeItemSelected = function ( ev )
{
  var ud = this.tree.getSelectedUserXml() ;
  if ( ud )
  {
    var path = ud.getAttribute ( "path" ) ;
    this._fillTable ( path ) ;
  }
};
Finder.prototype.treeDblClick = function ( ev )
{
  if ( ! this.tree.open_on_click )
  {
    var TR = this.tree.getSelectedItem() ;
    this.tree.openNode ( TR ) ;
  }
};
Finder.prototype._fillTableIfPathMatches = function ( path )
{
  if ( this.currentTablePath != path ) return ;
  if ( this.currentTableKey != this.lsProxy.getKey() ) return ;
  if ( this.currentTableNameSpace != this.lsProxy.getNameSpace() ) return ;
  this._fillTable ( path, true ) ;
};
Finder.prototype._fillTable = function ( path, checkSelected )
{
  var f  = new File ( this.lsProxy, path ) ;
  var x = f.getFileList ( this.pattern ) ;
  if ( !x ) this.table.clear() ;
  else
  {
    var P, n ;
    if ( checkSelected )
    {
      var ud = this.table.getSelectedUserXml() ;
      if ( ud )
      {
        p = ud.getContent ( "DIR" ) ;      
        n = ud.getContent ( "NAME" ) ;      
      }
    }
    x.get ( "LS.RESULT/Files" ).elements ( function(e)
    {
      if ( e.getBoolAttribute ( "isDirectory" ) )
      {
        e.add ( "IMG", TGui.translateImageName("Tango/Folder.16/normal") ) ;
      }
      e.addAttribute ( "path", path ) ;
    });
    this.table.setValues ( x.get ( "LS.RESULT" ) ) ;
    var r = this.table.findRow ( "NAME", n ) ;
    if ( r ) r.setSelected ( true ) ;
  }
  this.currentTablePath = path ;
  this.currentTableKey = this.lsProxy.getKey() ;
  this.currentTableNameSpace = this.lsProxy.getNameSpace() ;
  // var xInfo = x.get ( "LS.RESULT/Info" ) ; TODO
  // log ( xInfo ) ;
};
Finder.prototype.tableClick = function ( event )
{
  var colIndex = this.table.getSelectedColumnIndex() ;
  var ud = this.table.getSelectedUserXml() ;
  if ( ! ud ) return ;

  if ( ud.getAttribute ( "isDirectory" ) )
  {
    if ( colIndex === 0 )
    {
      this.tableDblClick ( event ) ;
    }
    return ;
  }
  this.tableDblClick ( event ) ;
};
Finder.prototype.tableDblClick = function ( event )
{
  var ud = this.table.getSelectedUserXml() ;
  if ( ! ud ) return ;
  var f = new File ( this.lsProxy, ud ) ;
  var path = f.getParent() ;
  var fullPath = f.toString() ;
  if ( f.isDirectory() )
  {
    var thiz = this ;
    this.tree.rows ( function ( TR )
    {
      if ( TR.domRow.getAttribute ( "path" ) === path )
      {
        thiz.tree.openNode ( TR ) ;
        return true ;
      }
      if ( TR.domRow.getAttribute ( "path" ) === fullPath )
      {
        thiz.tree.openNode ( TR ) ;
        var r = new TTableRow ( thiz.tree, TR ) ;
        r.setSelected ( true, true ) ;
        return false ;
      }
      return true ;
    });
  }
  else
  {
    this.displayFile ( f ) ;
  }
};
Finder.prototype.displayFile = function ( f )
{
  if ( f.isDirectory() ) return ;
  if ( f.isText() )
  {
    var str = f.getText() ;
    str = str.replace ( /\[##\]/g, "]]" ) ;
    this.DISPLAY_TEXT.setText ( "<span><pre>" + str + "</pre></span>" ) ;
    this.MF.select ( "TAB_TEXT" ) ;
  }
  else
  if ( f.isImage() )
  {
    var url = f.createImageUrl() ;
    var xml = new TXml();
    xml.add ( "PICTURE/srcName", f.getName() ) ;
    xml.add ( "PICTURE/src", url ) ;
    this.TAB_IMAGE.setValues ( xml ) ;
    this.MF.select ( "TAB_IMAGE" ) ;
    return ;
  }
  else
  if ( f.getName().endsWith ( ".svg" ) )
  {
    var url = f.createImageUrl() ;
    this.DISPLAY_TEXT.dom.innerHTML = "<span><img src=\"" + url + "\"></img></span>" ;
    this.MF.select ( "TAB_TEXT" ) ;
    return ;
  }
  if ( f.isArchive() )
  {
    var t = f.getArchiveList() ;
    this.DISPLAY_TEXT.setText ( "<span><pre>" + t + "</pre></span>" ) ;
    this.MF.select ( "TAB_TEXT" ) ;
    return ;
  }
};
Finder.prototype.onload = function ( ev )
{
  try
  {
    this.container = ev.getContainer() ;
    this.tree = this.container.getPeer ( this.treeName ) ;

    var xRef = Calypso.getAvailableNameSpaces ( "Ls*", "nameSpace" ) ;
    this.container.setRefData ( xRef ) ;

    this.showPlaces() ;
    this.showFileListOfPlace() ;
  }
  catch ( exc )
  {
    log(exc);
  }
};
Finder.prototype.changeNameSpace = function ( ev )
{
  this.setNameSpace ( this.container.getValues().getContent ( "nameSpace" ) ) ;
};
Finder.prototype.setNameSpace = function ( nameSpace )
{
  if ( this.lsProxy.getNameSpace() == nameSpace ) return ;
  this.lsProxy.setNameSpace ( nameSpace ) ;
  // this.display.setText ( "" ) ;
  this.showPlaces ( this.container ) ;
  this.showFileListOfPlace() ;
};
Finder.prototype.getDirList = function ( offset )
{
  if ( ! offset ) offset = this.offset ;
  return new File ( this.lsProxy, offset ).getDirList() ;
};
Finder.prototype.getPlaces = function()
{
  var x = this.lsProxy.getPlaces() ;
  this.keyToPlace  = [] ;
  var a = this.keyToPlace ;
  if ( x && x.get ( "LS.RESULT/Places" ) )
  {
    x.get ( "LS.RESULT/Places" ).elements ( function(e)
    {
      if ( e.getName() != "row" ) return ;
      a[e.getContent("key")] = e.getContent ( "title" ) ;
    }) ;
  }
  return x ;
};
Finder.prototype.showPlaces = function ( container )
{
  var x = this.getPlaces() ;
  var xResult = x.get ( "LS.RESULT" ) ;
  this.hostName = xResult.getContent ( "HostName" ) ;
  this.container.setValues ( xResult ) ;
};
Finder.prototype.showFileListOfPlace = function()
{
  var v = this.container.getValues() ;
  var pattern = v.getContent ( "PATTERN" ) ;
  this.lsProxy.setKey ( v.getContent ( "Places" ) ) ;
  var l = this.getDirList() ;
  v = new TXml() ;
  var xTREE2 = v.add ( "TREE2" ) ;
  var xTop = xTREE2.add ( "node" ) ;
  xTop.addAttribute ( "title",  this.keyToPlace[this.lsProxy.getKey()] ) ;
  xTop.addAttribute ( "name",  this.keyToPlace[this.lsProxy.getKey()] ) ;
  l.get("LS.RESULT/Files").elements ( function(e)
  {
    // var x  = xTREE2.add ( "node" ) ;
    var x  = xTop.add ( "node" ) ;
    x.addAttribute ( "title",  e.getContent ( "NAME" ) ) ;
    x.addAttribute ( "name",  e.getContent ( "NAME" ) ) ;
    x.addAttribute ( "path",  e.getContent ( "NAME" ) ) ;
  }) ;
  this.tree.setValues ( v ) ;
};
Finder.prototype.showFileInfo = function ( event )
{
  var ud = this.table.getSelectedUserXml() ;
  if ( ! ud ) return ;
  var f = new File ( this.lsProxy, ud.getAttribute ( "path" ), ud.getContent ( "NAME" ) ) ;
  log ( f ) ;
  f = new File ( this.lsProxy, ud ) ;
  log ( f ) ;
  var mt = f.getMimeType() ;
};
Finder.prototype.editFile = function ( event )
{
  var thiz = this ;
  var ud = this.table.getSelectedUserXml() ;
  if ( ! ud ) return ;
  var f = new File ( this.lsProxy, ud ) ;
  var w = new TWindow ( "DocumentEditor.Window",
  {
      SHOW_FILENAME: false
    , SHOW_MENU: true
  } ) ;
  w.create() ;
  var p = w.getPeer ( "DocumentEditor" ) ;
  p.addListener ( function(e)
  {
    var f = e.getItem() ;
    w.setTitle ( f.toString() ) ;
  }, "open" ) ;
  w.on ( "close", p._saveEditorStatus.bind ( p ) ) ;
  p.addListener ( function(e)
  {
    var f = e.getItem() ;
    if ( f )
    {
      thiz._fillTableIfPathMatches ( f.getParent() ) ;
    }
    var ww = e.getWindow() ;
    if ( ww )
    {
      ww.setTitle ( "Edit file..." ) ;
    }
    else
    {
      p._saveEditorStatus() ;
    }
  }, "close" ) ;
  p.addListener ( function(e)
  {
    var f = e.getItem() ;
    w.setTitle ( f.toString() ) ;
    thiz._fillTableIfPathMatches ( f.getParent() ) ;
  }, "save" ) ;
  p.editFile ( f ) ;
  w.show() ;
  p.addListener ( function(e)
  {
    var f = e.getItem() ;
    w.setTitle ( "*" + f.toString() ) ;
  }, "change" ) ;
};

/**
 *  @constructor
 */
LsProxy = function ( nameSpace, key )
{
  this.jsClassName = "LsProxy" ;
  this.nameSpace = nameSpace ? nameSpace : "" ;
  this.key = key ? key : "KEY0" ;
};
LsProxy.prototype.toString = function()
{
  return "(" + this.jsClassName + ")[nameSpace=" + this.nameSpace + "]" ;
};
LsProxy.prototype.getNameSpace = function()
{
  return this.nameSpace ;
};
LsProxy.prototype.setNameSpace = function ( nameSpace )
{
  this.nameSpace = nameSpace ? nameSpace : "" ;
};
LsProxy.prototype.getKey = function()
{
  return this.key ;
};
LsProxy.prototype.setKey = function ( key )
{
  this.key = key ;
};
LsProxy.prototype.getPlaces = function()
{
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>getPlaces</Operation>\n"
                 + "</LS.REQUEST>\n"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
  return x ;
};
LsProxy.prototype.getDirList = function ( offset )
{
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>getDirList</Operation>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + "</LS.REQUEST>\n"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
  return x ;
};
LsProxy.prototype.getFileList = function ( offset, pattern )
{
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>ls</Operation>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + ( pattern ? "<Pattern>" + pattern + "</Pattern>\n" : "" )
                 + "</LS.REQUEST>\n"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
  return x ;
};
LsProxy.prototype.getArchiveList = function ( offset, name )
{
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>getArchiveList</Operation>\n"
                 + "  <Name>" + name + "</Name>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + "</LS.REQUEST>\n"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
  if ( !x ) return "" ;
  var txt = x.getContent ( "LS.RESULT/Text" ) ;
  return txt ;
};
LsProxy.prototype.getFileInfo = function ( offset, name )
{
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>getFileInfo</Operation>\n"
                 + "  <Name>" + name + "</Name>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + "</LS.REQUEST>\n"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
  return x ;
};
LsProxy.prototype.getTextTransparent = function ( offset, name )
{
  return this.getText ( offset, name, true ) ;
};
LsProxy.prototype.getText = function ( offset, name, transparent )
{
  transparent = transparent ? true : false ;
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>getText</Operation>\n"
                 + "  <Name>" + name + "</Name>\n"
                 + "  <Transparent>" + transparent + "</Transparent>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + "</LS.REQUEST>\n"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
  if ( ! x ) return "" ;
  var str = x.getContent ( "LS.RESULT/Text" ) ;
  return str ;
};
LsProxy.prototype.createImageUrl = function ( offset, name )
{
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>download</Operation>\n"
                 + "  <Name>" + name + "</Name>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + "</LS.REQUEST>\n"
                 ) ;
  return Calypso.getHttpDocumentUrlForStream ( msg ) ;
};
LsProxy.prototype.saveText = function ( offset, name, text )
{
  var msg = new CoMessage ( "LS.REQUEST" ) ;

  text = text.replace ( /\]\]/g, "[##]" ) ;

  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>saveText</Operation>\n"
                 + "  <Name>" + name + "</Name>\n"
                 + "  <Text><![CDATA[" + text + "]]></Text>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + "</LS.REQUEST>\n"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
};
LsProxy.prototype.download = function ( offset, name )
{
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>download</Operation>\n"
                 + "  <Name>" + name + "</Name>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + "</LS.REQUEST>\n"
                 ) ;
  Calypso.downloadDocument ( msg ) ;
};
LsProxy.prototype.getHashes = function ( offset, name, type )
{
  if ( ! type ) type = "*" ;
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>getHashes</Operation>\n"
                 + "  <Name>" + name + "</Name>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + "  <Type>" + type + "</Type>\n"
                 + "</LS.REQUEST>\n"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
  if ( ! x ) return ;
  return x.get ( "LS.RESULT/Hashes" ) ;
};
LsProxy.prototype.fileExists = function ( offset, name )
{
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>fileExists</Operation>\n"
                 + "  <Name>" + name + "</Name>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + "</LS.REQUEST>\n"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
  if ( ! x ) return ;
  return x.getBool ( "LS.RESULT/FileInfo/exists", true ) ;
};
LsProxy.prototype.fileTouch = function ( offset, name )
{
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>fileTouch</Operation>\n"
                 + "  <Name>" + name + "</Name>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + "</LS.REQUEST>\n"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
  if ( ! x ) return ;
  return x.get ( "LS.RESULT/FileInfo" ) ;
};
LsProxy.prototype.fileCreate = function ( offset, name )
{
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>fileCreate</Operation>\n"
                 + "  <Name>" + name + "</Name>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + "</LS.REQUEST>\n"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
};
LsProxy.prototype.folderCreate = function ( offset, name )
{
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>folderCreate</Operation>\n"
                 + "  <Name>" + name + "</Name>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + "</LS.REQUEST>\n"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
};
LsProxy.prototype.folderRemove = function ( offset, name )
{
  var msg = new CoMessage ( "LS.REQUEST" ) ;
  msg.setNameSpace ( this.nameSpace ) ;
  msg.setXmlData ( "<LS.REQUEST>\n"
                 + "  <Operation>folderRemove</Operation>\n"
                 + "  <Name>" + name + "</Name>\n"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                 + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                 + "</LS.REQUEST>\n"
                 ) ;
  var x = Calypso.getXml ( msg ) ;
};
LsProxy.prototype.fileUpload = function ( v, submittedCallback )
{
  var w = new TUploadWindow() ;
  var taskName = ( this.nameSpace ? this.nameSpace + "::" : "" ) + "LS.REQUEST"
  w.setTaskName ( taskName ) ;
  var offset = v.getContent ( "Offset" ) ;
  w.setMsgXmlData ( "<xml>"
                  + "<LS.REQUEST>"
                  + "<Operation>upload</Operation>"
                 + ( this.key ? "<Key>" + this.key + "</Key>\n" : "" )
                  + ( offset ? "<Offset>" + offset + "</Offset>\n" : "" )
                  + "</LS.REQUEST>"
                  + "</xml>"
                  ) ;
  w.create() ;
  w.show() ;
  this.submittedCallback = submittedCallback ;
  w.addWindowListener ( this, this.uploadSubmitted, "onclose" ) ;
  return w ;
};
LsProxy.prototype.uploadSubmitted = function ( ev )
{
  if ( this.submittedCallback ) this.submittedCallback ( ev ) ;
  delete this.submittedCallback ;
};
LsProxy.prototype.getFile = function ( path, name )
{
  var f = new File ( path, name ) ;
  f.setLsProxy ( this ) ;
  return f ;
};

/**
 *  @constructor
 */
File = function ( lsProxy, path, name )
{
  this.lsProxy ;
  if ( lsProxy instanceof LsProxy )
  {
    this.lsProxy = lsProxy ;
    if ( path instanceof TXml )
    {
      this.xFileInfo = path ;
      path = this.xFileInfo.getContent ( "DIR" ) ;
      if ( ! path ) path = name ;
      name = this.xFileInfo.getContent ( "NAME" )
      this.lsProxy.setKey ( this.xFileInfo.getContent ( "KEY" ) ) ;
    }
  }
  // else
  // if ( lsProxy instanceof TXml )
  // {
  //   this.xFileInfo = lsProxy ;
  //   var p = this.xFileInfo.getContent ( "DIR" ) ;
  //   if ( ! path ) path = p ;
  //   name = this.xFileInfo.getContent ( "NAME" )
  //   this.key = this.xFileInfo.getContent ( "KEY" ) ;
  // }
  else
  {
    path = lsProxy ;
    name = path ;
  }
  this.setPath ( path, name ) ;
}
File.prototype.setPath = function ( path, name )
{
  this.path = path ? path : "" ;
  if ( name ) this.path += "/" + name ;
  this.path = this.toCanonicalFormat ( this.path ) ;
  if ( this.path.length > 0 && this.path.charAt ( 0 ) == '/' )
  {
    this.path = this.path.substring ( 1 ) ;
  }
  if ( this.path.length > 0 && this.path.charAt ( this.path.length-1 ) == '/' )
  {
    this.path = this.path.substring ( 0, this.path.length ) ;
  }
};
File.prototype.toString = function()
{
  return this.path ;
};
File.prototype.getName = function()
{
  var pos = this.path.lastIndexOf ( "/" ) ;
  if ( pos >= 0 ) return this.path.substring ( pos + 1 ) ;
  return this.path ;
};
File.prototype.getParent = function()
{
  var pos = this.path.lastIndexOf ( "/" ) ;
  if ( pos >= 0 ) return this.path.substring ( 0, pos ) ;
  return "" ;
};
File.prototype.getParentFile = function()
{
  return new File ( this.lsProxy, this.getParent() ) ;
};
File.prototype.setKey = function ( key )
{
  this.lsProxy.setKey ( key ) ;
  return this ;
};
File.prototype.getKey = function()
{
  return this.lsProxy.getKey() ;
};
File.prototype.setLsProxy = function ( h )
{
  this.lsProxy = h ;
  return this ;
};
File.prototype.getLsProxy = function()
{
  return this.lsProxy ;
};
File.prototype.setNameSpace = function ( nameSpace )
{
  this.lsProxy.setNameSpace ( nameSpace ) ;
  return this ;
};
File.prototype.getNameSpace = function()
{
  return this.lsProxy.getNameSpace() ;
};
File.prototype.toCanonicalFormat = function ( path )
{
  if ( ! path ) return "" ;
  path = path.replace ( /\\\\/g, "/" ) ;
  var doubleSlashPos = path.indexOf ( "//" ) ;

  if ( doubleSlashPos >= 0 )
  {
    var size = path.length ;
    var sb = "" ;
    var lastWasHit = false ;
    var start = 0 ;
    for ( var i = start ; i < size ; i++ )
    {
      var c = path.charAt ( i ) ;
      if ( c == "/" )
      {
        if ( ! lastWasHit ) sb += c ;
        lastWasHit = true ;
      }
      else
      {
        sb += c ;
        lastWasHit = false ;
      }
    }
    path = sb ;
  }
  return path ;
};
File.prototype.getText = function ( type )
{
  return this.lsProxy.getText ( this.getParent(), this.getName() ) ;
};
File.prototype.getTextTransparent = function ( type )
{
  return this.lsProxy.getTextTransparent ( this.getParent(), this.getName() ) ;
};
File.prototype.getHashes = function ( type )
{
  if ( ! type ) type = "*" ;
  return this.lsProxy.getHashes ( this.getParent(), this.getName(), "*" ) ;
};
File.prototype.touch = function()
{
  return this.lsProxy.fileTouch ( this.getParent(), this.getName() ) ;
};
File.prototype.saveText = function ( text )
{
  this.lsProxy.saveText ( this.getParent(), this.getName(), text ) ;
};
File.prototype.createFolder = function()
{
  this.lsProxy.folderCreate ( this.getParent(), this.getName() ) ;
};
File.prototype.removeFolder = function()
{
  this.lsProxy.folderRemove ( this.getParent(), this.getName() ) ;
};
File.prototype.createFile = function()
{
  this.lsProxy.fileCreate ( this.getParent(), this.getName() ) ;
};
File.prototype.getXFileInfo = function()
{
  if ( this.xFileInfo ) return this.xFileInfo ;
  if ( ! this.lsProxy )
  {
    throw "Missing this.lsProxy" ;
  }
  var x = this.lsProxy.getFileInfo ( this.getParent(), this.getName() ) ;
  if ( ! x ) return ;
  return x.get ( "LS.RESULT/Info/row" ) ;
};
File.prototype.getMimeType = function()
{
  var xf = this.getXFileInfo() ;
  if ( ! xf ) return "" ;
  var mt = xf.getContent ( "MIME_TYPE" ) ;
  if ( ! mt ) mt = xf.getAttribute ( "mimeType" ) ;
  if ( ! mt ) mt = "" ;
  return mt ;
};
File.prototype.isDirectory = function()
{
  var xf = this.getXFileInfo() ;
  if ( ! xf ) return false ;
  return xf.getBoolAttribute ( "isDirectory", false ) ;
};
File.prototype.isText = function()
{
  var xf = this.getXFileInfo() ;
  if ( ! xf ) return ;
  if ( xf.getBoolAttribute ( "isDirectory", false ) ) return ;
  var NAME = xf.getContent ( "NAME" ) ;
  var MIME_TYPE = xf.getContent ( "MIME_TYPE" ) ;
  var FILE_TYPE = xf.getContent ( "FILE_TYPE" ) ;

  if ( MIME_TYPE.indexOf ( "text/" ) >= 0 ) return true ;
  else
  if ( MIME_TYPE.indexOf ( "application/xml" ) >= 0 ) return true ;
  else
  if ( NAME.endsWith ( ".conf" ) ) return true ;
  else
  if ( NAME.endsWith ( ".sh" ) ) return true ;
  else
  if ( NAME.endsWith ( ".ini" ) ) return true ;
  else
  if ( NAME.endsWith ( ".axl" ) ) return true ;
  else
  if ( FILE_TYPE.indexOf ( "text" ) >= 0 ) return true ;
  return false ;
};
File.prototype.isArchive = function()
{
  var FILE = this.path.toUpperCase() ;
  if ( FILE.endsWith ( ".ZIP"  ) ) return true ;
  if ( FILE.endsWith ( ".JAR"  ) ) return true ;
  if ( FILE.endsWith ( ".TAR.GZ"  ) ) return true ;
  return false ;
};
File.prototype.isImage = function()
{
  var FILE = this.path.toUpperCase() ;
  if ( FILE.endsWith ( ".PNG"  ) ) return true ;
  if ( FILE.endsWith ( ".GIF"  ) ) return true ;
  if ( FILE.endsWith ( ".JPG"  ) ) return true ;
  if ( FILE.endsWith ( ".JPEG" ) ) return true ;
  if ( FILE.endsWith ( ".BMP" ) ) return true ;
  if ( FILE.endsWith ( ".JPE" ) ) return true ;

  var xf = this.getXFileInfo() ;
  if ( ! xf ) return ;
  if ( xf.getBoolAttribute ( "isDirectory", false ) ) return ;
  if ( xf.getBoolAttribute ( "isImage", false ) ) return true ;
  var NAME = xf.getContent ( "NAME" ) ;
  var MIME_TYPE = xf.getContent ( "MIME_TYPE" ) ;
  var FILE_TYPE = xf.getContent ( "FILE_TYPE" ) ;

  if ( MIME_TYPE.indexOf ( "image" ) >= 0 ) return true ;
  if ( FILE_TYPE.indexOf ( "image" ) >= 0 ) return true ;
  return false ;
};
File.prototype.createImageUrl = function()
{
  if ( ! this.lsProxy )
  {
    throw "Missing this.lsProxy" ;
  }
  return this.lsProxy.createImageUrl ( this.getParent(), this.getName() ) ;
};
File.prototype.getFileList = function ( pattern )
{
  return this.lsProxy.getFileList ( this.path, pattern ) ;
};
File.prototype.getArchiveList = function()
{
  return this.lsProxy.getArchiveList ( this.getParent(), this.getName() ) ;
};
File.prototype.download = function()
{
  this.lsProxy.download ( this.getParent(), this.getName() ) ;
};
File.prototype.exists = function()
{
  return this.lsProxy.fileExists ( this.getParent(), this.getName() ) ;
};
File.prototype.getDirList = function()
{
  return this.lsProxy.getDirList ( this.toString() ) ;
};
File.prototype.length = function()
{
  var xInfo = this.getXFileInfo() ;
  return xInfo.getInt ( "SIZE" ) ;
};
