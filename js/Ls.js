/**
 *  @constructor
 */
Tango.include ( "FileSystem.js" ) ;
LsResourceLocator = function ( lsp )
{
  Tango.initSuper( this, File, lsp  );
  this.jsClassName = "LsResourceLocator" ;
  this.hostName = "" ;
  lsp.setNameSpace ( "Default" ) ;
} ;
LsResourceLocator.inherits( File ) ;
LsResourceLocator.prototype.toString = function()
{
  var t = this._super_.toString.apply ( this, arguments ) ;
  var lsp = this.lsProxy ;
  var s = lsp.getNameSpace()
       + "::"
       + lsp.getKey()
       + ":"
       + t
       ;
  return s ;
};
LsResourceLocator.prototype.setNameSpace = function ( nameSpace )
{
  if ( nameSpace === this.getNameSpace() )
  {
    return ;
  }
  var t = this._super_.setNameSpace.apply ( this, arguments ) ;
  this.setPath ( "" ) ;
};
LsResourceLocator.prototype.getPath = function()
{
  return this.path ;
};
LsResourceLocator.prototype.setCurrentResourceLocation = function ( rl )
{
  if ( ! rl ) return ;
  var p1 = rl.indexOf ( "::" ) ;
  if ( p1 <= 0 ) return ;
  var p2 = rl.indexOf ( ":", p1 + 2 ) ;
  if ( p2 <= 0 ) return ;
  var t1 = rl.substring ( 0, p1 ) ;
  var t2 = rl.substring ( p1+2, p2 ) ;
  var t3 = rl.substring ( p2+1 ) ;
  this.setNameSpace ( t1 ) ;
  this.setKey ( t2 ) ;
  this.setPath ( t3 ) ;
};
/**
 *  @constructor
 */
Ls = function ( nameSpace, event )
{
  this.jsClassName = "Ls" ;
  this.initialized = false ;
  if ( typeof ( nameSpace ) != 'string' || nameSpace.length > 100 )
  {
    nameSpace = "" ;
  }
  this.options = this.getUserData() ;
  var lsProxy = new LsProxy ( nameSpace ) ;
  this.rl = new LsResourceLocator ( lsProxy ) ;
  this.rl.setKey ( "KEY0" ) ;
};
Ls.prototype.toString = function()
{
  return "(" + this.jsClassName + ")[LsResourceLocator=" + this.rl + "]" ;
};
Ls.prototype.onload = function ( ev )
{
  TSys.addUnloadListener ( new TFunctionExecutor ( this, this.onunload ) ) ;
  this.showPlaces ( ev.getContainer() ) ;
  var currentResourceLocation = this.options.getContent ( "CurrentResourceLocation" ) ;
  this.setCurrentResourceLocation ( currentResourceLocation ) ;
};
Ls.prototype._setCurrentResourceLocation = function ( currentResourceLocation )
{
  if ( currentResourceLocation )
  {
    this.options.ensureElement ( "CurrentResourceLocation" ).setContent ( currentResourceLocation ) ;
    this.rl.setCurrentResourceLocation ( currentResourceLocation ) ;
  }
};
Ls.prototype.setCurrentResourceLocation = function ( currentResourceLocation )
{
  if ( currentResourceLocation )
  {
    this.rl.setCurrentResourceLocation ( currentResourceLocation ) ;
    var x = this.rl.lsProxy.getPlaces() ;
    var xResult = x.get ( "LS.RESULT" ) ;
    this.hostName = xResult.getContent ( "HostName" ) ;
    this.container.setValues ( xResult ) ;
    var v = new TXml() ;
    v.add ( "nameSpace", this.rl.getNameSpace() ) ;
    v.add ( "Places", this.rl.getKey() ) ;
    this.container.setValues ( v ) ;
  }
  this.showFileListOfPlace() ;
};
Ls.prototype.onunload = function ( event )
{
  this.saveUserData() ;
};
Ls.prototype.showPlaces = function ( container )
{
  this.container = container ;
  // this.rl.setNameSpace ( "Default" ) ;
  this.rl.setPath ( "" ) ;
  var x = this.rl.lsProxy.getPlaces() ;
  var xResult = x.get ( "LS.RESULT" ) ;
  this.hostName = xResult.getContent ( "HostName" ) ;
  this.container.setValues ( xResult ) ;
  var v = this.container.getValues() ;
  this.rl.setKey ( v.getContent ( "Places" ) ) ;

  if ( ! this.initialized )
  {
    this.initialized = true ;
    var xRef = Calypso.getAvailableNameSpaces ( "Ls*", "nameSpace" ) ;
    this.container.setRefData ( xRef ) ;
    this.tableFiles = this.container.getPeer ( "Files" ) ;
    var dsl = new this.DragSourceListener ( this ) ;
    var dtl = new this.DropTargetListener ( this ) ;
    this.tableFiles.addDragSourceListener ( dsl ) ;
    this.tableFiles.addDropTargetListener ( dtl ) ;
    this.MF = this.container.getPeer ( "MF" ) ;
    this.c_content = this.container.getComponent ( "DocumentEditor" ) ;
    this.documentEditor = this.c_content.getPeer() ;
    this.documentEditor.addListener ( this, this.onCloseDocument, "close" ) ;
    this.documentEditor.addListener ( this, this.onSaveDocument, "save" ) ;
    this.documentEditor.addListener ( this, this.onOpenDocument, "open" ) ;

    this.display = this.container.getComponent ( "DISPLAY" ) ;
    this.tbFolderUp = this.container.getComponent ( "TB.FolderUp" ) ;
    this.tbDownload = this.container.getComponent ( "TB.Download" ) ;
    this.tbShowContent = this.container.getComponent ( "TB.ShowContent" ) ;
    this.tbEdit = this.container.getComponent ( "TB.Edit" ) ;
    this.tbFileRemove = this.container.getComponent ( "TB.FileRemove" ) ;
    this.breadcrumb = this.container.getComponent ( "Breadcrumb" ) ;
    this.tableFiles.addKeyListener ( this, this.tableFilesKeyListener ) ;
  }
};
Ls.prototype.getUserData = function ( applicationName, file )
{
  try
  {
    return Cosmos.getUserXml ( "/applicationdata/Ls/Data.xml" ) ;
  }
  catch ( exc )
  {

  }
  return new TXml() ;
};
Ls.prototype.saveUserData = function()
{
  this.options.ensureElement ( "CurrentResourceLocation" ).setContent ( this.rl ) ;
  Cosmos.saveUserXml ( "applicationdata/Ls/Data.xml", this.options ) ;
};
Ls.prototype.editOptions = function ( event )
{
  this.options.ensureElement ( "CurrentResourceLocation" ).setContent ( this.rl ) ;
  this.saveUserData() ;
};
Ls.prototype.changeNameSpace = function ( ev )
{
  this.setNameSpace ( this.container.getValues().getContent ( "nameSpace" ) ) ;
};
Ls.prototype.setNameSpace = function ( nameSpace )
{
  if ( this.rl.getNameSpace() == nameSpace ) return ;
  this.rl.setNameSpace ( nameSpace ) ;
  this.display.setText ( "" ) ;
  this.MF.select ( "C-DISPLAY" ) ;
  this.showPlaces ( this.container ) ;
  this.showFileListOfPlace() ;
};
Ls.prototype.changePlace = function ( e )
{
  this.rl.setPath ( "" ) ;
  this.showFileListOfPlace() ;
};
Ls.prototype.showFileListOfPlace = function()
{
  var v = this.container.getValues() ;
  var pattern = v.getContent ( "PATTERN" ) ;
  this.rl.setKey ( v.getContent ( "Places" ) ) ;
  var x = this.getFileList ( this.rl.getPath(), pattern ) ;
  x.add ( "BreadcrumbOffset", "" ) ;

  this.container.setValues ( x ) ;
};
Ls.prototype.onclickFiles = function ( event )
{
  var ud = this.tableFiles.getSelectedUserXml() ;
  var f = new File ( this.rl.lsProxy, ud ) ;
  if ( f.isDirectory() )
  {
    this.tbDownload.setEnabled ( false ) ;
    this.tbEdit.setEnabled ( false ) ;
    this.tbFileRemove.setEnabled ( true ) ;
    var index = this.tableFiles.getSelectedColumnIndex() ;
    if ( index === 0 )
    {
      this.fillFiles ( event ) ;
    }
  }
  else
  {
    if ( f.length() < 1000000 )
    {
      this.tbDownload.setEnabled ( true ) ;
      this.tbEdit.setEnabled ( true ) ;
      this.tbFileRemove.setEnabled ( true ) ;
      if ( this.MF.getSelectedIndex() === 1 )
      {
        this.ondblclickFiles ( event ) ;
      }
      else
      {
        this.showText ( f ) ;
      }
    }
    else
    {
      this.tbDownload.setEnabled ( true ) ;
      // this.tbEdit.setEnabled ( true ) ;
      this.tbFileRemove.setEnabled ( true ) ;
      // this.showText ( f ) ;
    }
  }
  this.tbShowContent.setEnabled ( true ) ;
};
Ls.prototype.ondblclickFiles = function ( event )
{
  var ud = this.tableFiles.getSelectedUserXml() ;
  var f = new File ( this.rl.lsProxy, ud ) ;
  if ( f.isDirectory() )
  {
    this.fillFiles ( event ) ;
    return ;
  }
  if ( f.isText() )
  {
    this.documentEditor.editFile ( f ) ;
    TGlobalEventHandler.unFocus() ;
  }
  else this.showText ( f ) ;
};
Ls.prototype.folderUp = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = this.container.getValues() ;
  var offset = v.getContent ( "Offset" ) ;
  var pos = offset.lastIndexOf ( "/" ) ;
  if ( pos < 0  )
  {
    offset = "" ;
  }
  else
  {
    offset = offset.substring ( 0, pos ) ;
  }
  var pattern = v.getContent ( "PATTERN" ) ;
  var x = this.getFileList ( offset, pattern ) ;
  x.add ( "BreadcrumbOffset", offset ) ;
  this.container.setValues ( x ) ;
};
Ls.prototype.showText = function ( f )
{
  if ( f.isDirectory() ) return ;
  if ( f.isImage() )
  {
    var url = f.createImageUrl() ;
    // this.display.dom.innerHTML = "<span><img name='IMG' src='" + url + "'></img></span>" ;

    TGui.flushAttributes ( this.display.dom ) ;
    this.display.dom.innerHTML = "" ;

    var espan = document.createElement ( "span" ) ;
    this.display.dom.appendChild ( espan ) ;

    var etxt = document.createElement ( "span" ) ;
    espan.appendChild ( etxt ) ;
    var fn = f.getName() ;

    var ebr = document.createElement ( "br" ) ;
    espan.appendChild ( ebr ) ;

    var eimg = document.createElement ( "img" ) ;
    espan.appendChild ( eimg ) ;
    eimg.onload
    TGui.addEventListener ( eimg, "load", function(e)
    {
      var t = fn + " (" + eimg.width + "x" + eimg.height + ")" ;
// log ( eimg.width ) ;
      etxt.innerHTML = t ;
    } ) ;
    eimg.src = url ;
    this.MF.select ( "C-DISPLAY" ) ;
    return ;
  }
  if ( f.isArchive() )
  {
    var t = f.getArchiveList() ;
    this.display.setText ( "<span><pre>" + t + "</pre></span>" ) ;
    this.MF.select ( "C-DISPLAY" ) ;
    return ;
  }
  var str = f.getText() ;
  str = str.replace ( /\[##\]/g, "]]" ) ;
  this.display.setText ( "<span><pre>" + str + "</pre></span>" ) ;
  this.MF.select ( "C-DISPLAY" ) ;
};
Ls.prototype.editFile = function ( event )
{
  this.ondblclickFiles ( event ) ;
};
Ls.prototype.onOpenDocument = function ( f )
{
  this.MF.select ( "DocumentEditor" ) ;
};
Ls.prototype.onCloseDocument = function ( event )
{
  this.MF.select ( "C-DISPLAY" ) ;
};
Ls.prototype.onSaveDocument = function ( event )
{
  this.refreshFiles() ;
};

Ls.prototype.refreshFiles = function()
{
  var v = this.container.getValues() ;
  var offset = v.getContent ( "Offset" ) ;
  var pattern = v.getContent ( "PATTERN" ) ;
  if ( pattern && pattern.indexOf ( "*" ) < 0 ) pattern = "*" + pattern + "*" ;
  var x = this.getFileList ( offset, pattern ) ;
  x.add ( "BreadcrumbOffset", offset ) ;
  this.container.setValues ( x ) ;
};
Ls.prototype.fillFiles = function ( event )
{
  var ud = this.tableFiles.getSelectedUserXml() ;
  var f = new File  ( this.rl.lsProxy, ud ) ;
  var v = this.container.getValues() ;
  var offset = f.toString() ;
  var pattern = v.getContent ( "PATTERN" ) ;
  if ( pattern && pattern.indexOf ( "*" ) < 0 ) pattern = "*" + pattern + "*" ;
  var x = this.getFileList ( offset, pattern ) ;
  x.add ( "BreadcrumbOffset", offset ) ;
  this.container.setValues ( x ) ;
};
Ls.prototype.fillFilesFromBreadcrumb = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = this.container.getValues() ;
  var c = ev.getComponent() ;

  var offset = c.getName() ;
  var pattern = v.getContent ( "PATTERN" ) ;
  var bcoffset = v.getContent ( "BreadcrumbOffset", offset ) ;
  if ( pattern && pattern.indexOf ( "*" ) < 0 ) pattern = "*" + pattern + "*" ;
  var x = this.getFileList ( offset, pattern, bcoffset ) ;
  this.container.setValues ( x ) ;
};
Ls.prototype.showDirectoriesFromBreadcrumb = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = this.container.getValues() ;
  var c = ev.getComponent() ;

  var xml = c.dom.xPopup ;
  if ( ! xml )
  {
    var offset = c.getName() ;
    var x = this.rl.lsProxy.getDirList ( offset ) ;
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
  var pl = this.container.getPagelet() ;
  layoutContext.pushPagelet ( pl ) ;
  pm.setDefaultAction ( new TFunctionExecutor ( "*.showDirectoryFromBreadcrumbPopup()", layoutContext ) ) ;
  pm.show ( event ) ;
  layoutContext.popPagelet ( pl ) ;
};
Ls.prototype.showDirectoryFromBreadcrumbPopup = function ( ev )
{
  var v = this.container.getValues() ;
  var c = ev.getMenuItem() ;
  var offset = c.getName() ;
  var pattern = v.getContent ( "PATTERN" ) ;
  if ( pattern && pattern.indexOf ( "*" ) < 0 ) pattern = "*" + pattern + "*" ;
  var x = this.getFileList ( offset, pattern ) ;
  x.add ( "BreadcrumbOffset", offset ) ;
  this.container.setValues ( x ) ;
};
Ls.prototype.getFileList = function ( offset, pattern, bcoffset )
{
  this.rl.setPath ( offset ) ;
  this._setCurrentResourceLocation ( this.rl.toString() ) ;
  var x = this.rl.getFileList ( pattern ) ;
  if ( x )
  {
    x.get ( "LS.RESULT/Files" ).elements ( function(e)
    {
      e.addAttribute ( "path", offset ) ;
    }) ;
  }

  var xs, noffset, js, js2 ;
  if ( bcoffset ) offset = bcoffset ;
  if ( offset )
  {
    this.tbFolderUp.setEnabled ( true ) ;
    var a = offset.split ( "/" ) ;
    xs = "<xml>\n" ;
    noffset = "" ;
    js = "*.fillFilesFromBreadcrumb()" ;
    js2 = "*.showDirectoriesFromBreadcrumb()" ;
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
  }
  else
  {
    TGui.flushAttributes ( this.breadcrumb.dom ) ;
    // this.breadcrumb.setText ( "" ) ;
    this.tbFolderUp.setEnabled ( false ) ;
    xs = "<xml>\n" ;
    noffset = "" ;
    js = "*.fillFilesFromBreadcrumb()" ;
    js2 = "*.showDirectoriesFromBreadcrumb()" ;
    xs += "<PushButton img=\"home-icon-32.png\" style=\"margin-right:0px;\" name=\"" + noffset + "\" use-button-minimum=\"false\" onclick=\"" + js + "\"/>\n" ;
    xs += "</xml>\n" ;
    this.breadcrumb.setAxl ( xs ) ;
  }
  this.tbDownload.setEnabled ( false ) ;
  this.tbEdit.setEnabled ( false ) ;
  this.tbFileRemove.setEnabled ( false ) ;
  this.tbShowContent.setEnabled ( false ) ;
  var xx = x.get ( "LS.RESULT" ) ;
  var xInfo = xx.get ( "Info" ) ;
  if ( xInfo )
  {
    var KB = xInfo.getFloat ( "KB" ) ;
    KB = "%'.2f".sprintf ( KB ) ;
    var sInfo = "" + KB + " kb in "
              + xInfo.getInt ( "Files" ) + " files, "
              + xInfo.getInt ( "Dirs" ) + " directories"
              ;
    xx.add ( "DirInfo", sInfo ) ;
  }
  return xx ;
};
Ls.prototype.showWindow = function()
{
  this.w = new TWindow ( "Ls.Window" ) ;
  this.w.setPagelet ( this ) ;
  this.w.create() ;

  this.showPlaces ( this.w ) ;
  this.showFileListOfPlace() ;

  this.w.setTitle ( this.hostName ) ;
  this.w.show() ;
};
Ls.prototype.DragSourceListener = function ( ls )
{
  this.ls = ls ;
};
Ls.prototype.DragSourceListener.prototype =
{
  getDragElement: function ( evt )
  {
    var src = evt.getSource() ;
    var tr = null ;
    if ( src.nodeName == 'TD' )
    {
      tr = src.parentNode ;
    }
    else
    if ( src.nodeName == 'TR' )
    {
      tr = src ;
    }
    if ( tr ) return tr ;
    return null ;
  },
  dragStart: function ( evt )
  {
    var tab = evt.getPeer() ;
    if ( ! tab ) return ;
    var x = tab.getSelectedUserXml() ;
    if ( ! x ) return null ;
    var src = evt.getSource() ;
    var tr = null ;
    if ( src.nodeName != 'TD' && src.nodeName != 'TR' )
    {
      return null ;
    }
    var t = new Transferable ( DnDDataFlavor.XML_ARRAY, function ( dataFlavor )
    {
      if ( dataFlavor == DnDDataFlavor.XML_ARRAY )
      {
        var t = tab ;
        var a = tab.getSelectedItems() ;
        for ( var i = 0 ; i < a.length ; i++ )
        {
          a[i] = new TXml ( a[i] ) ;
        }
        return a ;
      }
    } ) ;
    t.setName ( tab.getName() ) ;
    var v = this.ls.container.getValues() ;
    t.offset = v.getContent ( "Offset" ) ;
    t.key = v.getContent ( "Places" ) ;
    t.id = t.key + ":" + t.offset ;
    t.hostName = this.ls.hostName ;
    t.ls = this.ls ;
    return t ;
  },
  dragDropEnd: function ( evt )
  {
    this.ls.refreshFiles() ;
    if ( ! evt.getDropSuccess() ) return ;
  }
} ;
Ls.prototype.DropTargetListener = function ( ls )
{
  this.ls = ls ;
};
Ls.prototype.DropTargetListener.prototype =
{
  getId: function( )
  {
    if ( this.id ) return this.id ;
    var v = this.ls.container.getValues() ;
    this.key = v.getContent ( "Places" ) ;
    this.offset = v.getContent ( "Offset" ) ;
    this.id = this.key + ":" + this.offset ;
    return this.id ;
  },
  dragEnter: function ( evt )
  {
    this.id = undefined ;
    var t = evt.getTransferable();
    if ( t.id == this.getId() )
    {
      evt.rejectDrag() ;
      return ;
    }
    if ( t.hostName != this.ls.hostName )
    {
      evt.rejectDrag() ;
      return ;
    }
    evt.acceptDrag ( DnDConstants.COPY_OR_MOVE ) ;
  },
  dragExit: function ( evt )
  {
    this.id = undefined ;
  },
  dragOver: function ( evt )
  {
    var tab = evt.getPeer() ;
    var t = evt.getTransferable();
    if ( t.hostName != this.ls.hostName )
    {
      evt.rejectDrag() ;
      return ;
    }
    if ( t.getName() != tab.getName() )
    {
      evt.rejectDrag() ;
      return ;
    }
    if ( t.id == this.getId() )
    {

      var r = this.ls.tableFiles.getRowFromPosition ( evt.getX(), evt.getY() ) ;
      if ( r && r.getXml().getBoolAttribute ( "isDirectory", false ) )
      {
      }
      else
      {
        evt.rejectDrag() ;
        return ;
      }
    }
    evt.acceptDrag ( DnDConstants.COPY_OR_MOVE ) ;
  },
  drop: function ( evt )
  {
    var action = evt.getDropAction() ;
    var t = evt.getTransferable();
    var tab = evt.getPeer() ;

    var op = action == DnDConstants.COPY ? "copy" : "move" ;

    var dropDir = "" ;
    var offset = this.offset ;
    var r = null ;
    if ( t.id == this.getId() )
    {
      r = this.ls.tableFiles.getRowFromPosition ( evt.getX(), evt.getY() ) ;
      if ( r && r.getXml().getBoolAttribute ( "isDirectory", false ) )
      {
        dropDir = r.getXml().getContent ( "NAME" ) ;
        if ( offset ) offset += "/" ;
        offset += dropDir ;
      }
      else
      if ( op == "copy" )
      {
      }
      else
      {
        evt.rejectDrop() ;
        return ;
      }
    }
    else
    if (  t.getName() != tab.getName()
       || ! t.isDataFlavorSupported ( DnDDataFlavor.XML_ARRAY )
       || t.hostName != this.ls.hostName
       )
    {
      evt.rejectDrop() ;
      return ;
    }
    this.ls_source = t.ls ;
    evt.acceptDrop ( action) ;

    this.str0 = "<LS.REQUEST>\n"
              + "  <Operation>" + op + "</Operation>\n"
              + "  <To>\n"
              + "    <HostName>" + this.ls.hostName + "</HostName>\n"
              + "    <Key>" + this.key + "</Key>\n"
              + "    <Offset>" + offset + "</Offset>\n"
              + "    <List>\n"
              ;
    this.str1 = "   </List>\n"
	      + "  </To>\n"
              + "  <From>\n"
              + "    <HostName>" + t.hostName + "</HostName>\n"
              + "    <Key>" + t.key + "</Key>\n"
              + "    <Offset>" + t.offset + "</Offset>\n"
              + "    <List>\n"
	      ;
    try
    {
      var a = t.getData ( DnDDataFlavor.XML_ARRAY ) ;
      var list = [] ;
      var to_list = [] ;
      var tab2 = this.ls.tableFiles ;
      var alreadyExists = [] ;
      var i ;
      var NAME ;

      if ( dropDir )
      {
        for ( i = 0 ; i < a.length ; i++ )
        {
          NAME = a[i].getContent ( "NAME" ) ;
          if ( this.ls.lsProxy.fileExists ( this.key, offset, NAME ) )
	        {
            if ( r ) alreadyExists.push ( NAME ) ;
	        }
	        else
	        {
	          list.push ( NAME ) ;
	          to_list.push ( NAME ) ;
	        }
        }
      }
      else
      {
        if ( op == "copy" && t.id == this.getId() )
        {
          for ( i = 0 ; i < a.length ; i++ )
          {
            NAME = a[i].getContent ( "NAME" ) ;
            r = tab2.findRow ( "NAME", NAME ) ;
            if ( r )
	          {
              to_list.push ( "Copy-of-" + NAME ) ;
	            list.push ( NAME ) ;
	          }
	          else
	          {
	            list.push ( NAME ) ;
	            to_list.push ( NAME ) ;
	          }
          }
        }
        else
        {
          for ( i = 0 ; i < a.length ; i++ )
          {
            NAME = a[i].getContent ( "NAME" ) ;
            r = tab2.findRow ( "NAME", NAME ) ;
            if ( r )
	    {
	      alreadyExists.push ( NAME ) ;
	    }
	    else
	    {
	      list.push ( NAME ) ;
	      to_list.push ( NAME ) ;
	    }
          }
        }
      }
      if ( alreadyExists.length )
      {
        var thiz = this ;
        var d = new TUserDialog ( "The following files exist, overwrite?\n" + alreadyExists.join ( "<br/>" ) ) ;
        d.askYesNoCancel ( function ( answer )
        {
	  if ( answer.isCancel() ) return ;
	  if ( answer.isYes() ) thiz.doAction ( list, to_list, alreadyExists ) ;
	  if ( answer.isNo() ) thiz.doAction ( list, to_list, null ) ;
        } ) ;
      }
      else
      {
        this.doAction ( list, to_list ) ;
      }
      evt.dropComplete ( true ) ;
    }
    catch ( exc )
    {
      evt.dropComplete ( false ) ;
      TSys.log ( exc ) ;
    }
  },
  doAction: function ( list, to_list, alreadyExists )
  {
    var i ;
    if ( ! list.length && ( ! alreadyExists || ! alreadyExists.length ) )
    {
      return ;
    }
    for ( i = 0 ; i < list.length ; i++ )
    {
      this.str0 += "<File>" + to_list[i] + "</File>\n" ;
      this.str1 += "<File>" + list[i] + "</File>\n" ;
    }
    if ( alreadyExists )
    {
      for ( i = 0 ; i < alreadyExists.length ; i++ )
      {
        this.str0 += "<File overwrite='true' >" + alreadyExists[i] + "</File>\n" ;
        this.str1 += "<File overwrite='true' >" + alreadyExists[i] + "</File>\n" ;
      }
    }
    var str2 = ""
             + "    </List>\n"
             + "  </From>\n"
             + "</LS.REQUEST>\n"
             ;
    var msg = new CoMessage ( "LS.REQUEST" ) ;
    msg.setNameSpace ( this.ls.rl.getNameSpace() ) ;
    msg.setXmlData ( this.str0 + this.str1 + str2 ) ;
    var x = Calypso.getXml ( msg ) ;
    this.ls.refreshFiles() ;
    this.ls_source.refreshFiles() ;
  }
} ;
Ls.prototype.tableFilesKeyListener = function ( event )
{
  var r ;
  var ev = new TEvent ( event ) ;
  if ( ev.isCursorLeft() || ev.isCursorRight() )
  {
    ev.consume() ;
    if ( ev.getEvent().type != "keyup" ) return ;
    if ( ev.isCursorLeft() )
    {
      if ( ! this.tbFolderUp.isEnabled() ) return ;
      var v = this.container.getValues() ;
      var offset = v.getContent ( "Offset" ) ;
      var f = new File  ( offset ) ;
      var fn = f.getName() ;
      this.folderUp ( event ) ;
      r = this.tableFiles.findRow ( "NAME", fn ) ;
      if ( r ) r.setSelected ( true ) ;
    }
    else
    if ( ev.isCursorRight() )
    {
      var ud = this.tableFiles.getSelectedUserXml() ;
      if ( ! ud.getBoolAttribute ( "isDirectory", false ) ) return ;
      this.ondblclickFiles ( event ) ;
      r = this.tableFiles.getFirstRow() ;
      if ( r ) r.setSelected ( true ) ;
    }
  }
};
Ls.prototype.onSetValuesFile = function ( r )
{
  if ( r.getBoolAttribute ( "isDirectory", false ) )
  {
    var str = TGui.translateImageName ( "Tango/Folder.16/normal" ) ;
    r.add ( "ICON", str ) ;
  }
};
Ls.prototype.onopenTablePopup = function ( ev )
{
  var m = ev.getMenu() ;
  m.setEnabled ( false ) ;
  var ud = this.tableFiles.getSelectedUserXml() ;
  if ( ! ud ) return ;
  var f = new File ( this.rl.lsProxy, ud ) ;
  var mi = null ;
  mi = m.getItem ( "MI.Display" ) ;
  mi.setEnabled ( true ) ;
  mi = m.getItem ( "MI.FileTouch" ) ;
  mi.setEnabled ( true ) ;
  if ( f.isDirectory() )
  {
    return ;
  }
  mi = m.getItem ( "MI.Download" ) ;
  mi.setEnabled ( true ) ;
  if ( f.isText() )
  {
    mi = m.getItem ( "MI.Edit" ) ;
    mi.setEnabled ( true ) ;
  }
  mi = m.getItem ( "MI.Hashes" ) ;
  mi.setEnabled ( true ) ;
  mi = m.getItem ( "MI.FileRemove" ) ;
  mi.setEnabled ( true ) ;
};
Ls.prototype.fileTouch = function ( type )
{
  var ud = this.tableFiles.getSelectedUserXml() ;
  if ( ! ud ) return ;
  var f = new File ( this.rl.lsProxy, ud ) ;
  var x = f.touch() ;
  this.refreshFiles() ;
  var r = this.tableFiles.findRow ( "NAME", ud.getContent ( "NAME" ) ) ;
  if ( r ) r.setSelected ( true ) ;
};
Ls.prototype.showHashes = function ( type )
{
  var ud = this.tableFiles.getSelectedUserXml() ;
  if ( ! ud ) return ;
  var f = new File ( this.rl.lsProxy, ud ) ;
  if ( f.isDirectory() ) return ;

  var x = f.getHashes() ;
  var w = new TWindow ( "Ls.Window.ShowHashes" ) ;

  w.setPagelet ( this ) ;
  w.create() ;
  w.setTitle ( f.getName() ) ;
  w.setValues ( x ) ;
  w.show() ;
};
Ls.prototype.checkHash = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var w = ev.getWindow() ;
  var name = ev.getComponent().getName() ;
  var c ;
  if ( name.charAt ( 0 ) == 'T' )
  {
    var hashName = name.substring ( 1 ) ;
    var hash = v.getContent ( hashName ) ;
    var value = v.getContent ( name ) ;

    var cName = "L"+ hashName ;
    if ( ! value )
    {
      c = w.getComponent ( cName ) ;
      c.dom.style.color = "black" ;
      return ;
    }
    if ( hash != value )
    {
      c = w.getComponent ( cName ) ;
      c.dom.style.color = "red" ;
      return ;
    }
    if ( hash == value )
    {
      c = w.getComponent ( cName ) ;
      c.dom.style.color = "green" ;
      return ;
    }
  }
};
Ls.prototype.clone = function()
{
  var v = this.container.getValues() ;
  var pattern = v.getContent ( "PATTERN" ) ;
  var offset = v.getContent ( "Offset" ) ;
  var key = this.rl.lsProxy.getKey() ;

  var ls = new Ls ( this.rl.lsProxy.getNameSpace() ) ;
  ls.rl.lsProxy.setKey ( key ) ;
  ls.w = new TWindow ( "Ls.Window" ) ;
  ls.w.setPagelet ( ls ) ;
  ls.w.create() ;

  ls.showPlaces ( ls.w ) ;
  var x = new TXml() ;
  x.add ( "Places", key ) ;
  x.add ( "key", key ) ;
  x.add ( "PATTERN", pattern ) ;
  x.add ( "offset", offset ) ;
  x.add ( "BreadcrumbOffset", offset ) ;
  ls.container.setValues ( x ) ;
  ls.setCurrentResourceLocation ( this.rl.toString() ) ;

  ls.refreshFiles() ;

  ls.w.setTitle ( this.hostName ) ;
  ls.w.show() ;

  if ( this.w )
  {
    var loc = this.w.getBounds() ;
    ls.w.setLocation ( loc.x+ 20 , loc.y + 20 ) ;
  }
};
Ls.prototype.folderCreate = function ( event )
{
  var w = new TWindow ( "Ls.Window.FolderCreate" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  w.show() ;
};
Ls.prototype.folderCreateSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var vv = ev.getValues() ;
  var name = vv.getContent ( "FOLDER.NAME" ) ;
  var w = ev.getWindow() ;
  try
  {
    var v = this.container.getValues() ;
    var offset = v.getContent ( "Offset" ) ;
    new File ( this.rl.lsProxy, offset, name ).createFolder() ;
    w.closeImediately() ;
    this.refreshFiles() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error() ;
  }
};
Ls.prototype.fileCreate = function ( event )
{
  var w = new TWindow ( "Ls.Window.FileCreate" ) ;
  w.setPagelet ( this ) ;
  w.create() ;
  w.show() ;
};
Ls.prototype.fileCreateSave = function ( event )
{
  var ev = new TEvent ( event ) ;
  var vv = ev.getValues() ;
  var name = vv.getContent ( "FILE.NAME" ) ;
  var w = ev.getWindow() ;
  try
  {
    var v = this.container.getValues() ;
    var offset = v.getContent ( "Offset" ) ;
    new File ( this.rl.lsProxy, offset, name ).createFile() ;
    w.closeImediately() ;
    this.refreshFiles() ;
  }
  catch ( exc )
  {
    var d = new TUserDialog ( exc ) ;
    d.error() ;
  }
};
Ls.prototype.folderRemove = function ( event )
{
  var v = this.container.getValues() ;
  var ud = this.tableFiles.getSelectedUserXml() ;
  if ( ! ud ) return ;
  var f = new File ( this.rl.lsProxy, ud ) ;
  var thiz = this ;
  var d = new TUserDialog ( "Are you sure to remove the file:\n" + f.getName() + "?" ) ;
  d.askYesNo ( function ( answer )
  {
    if ( ! answer.isYes() ) return ;
    f.removeFolder() ;
    thiz.refreshFiles() ;
  } ) ;

};
Ls.prototype.fileDownload = function ( event )
{
  var ud = this.tableFiles.getSelectedUserXml() ;
  if ( ! ud ) return ;
  var f = new File ( this.rl.lsProxy, ud ) ;
  f.download() ;
};
Ls.prototype.fileUpload = function ( event )
{
  var thiz = this ;
  var v = this.container.getValues() ;
  this.rl.lsProxy.fileUpload ( v, function ( ev )
  {
    thiz.refreshFiles() ;
  }) ;
};
Ls.prototype._imageUpload = function ( base )
{
  var w = new TUploadWindow() ;
  w.setTaskName ( "LS.REQUEST" ) ;
/*
  w.addUploadAttribute ( "AttributeName-1", "AttributeValue-1" ) ;
  w.addUploadAttribute ( "AttributeName-2", "AttributeValue-2" ) ;
  w.addUploadAttribute ( "AttributeName=-2", "AttributeValue=-2" ) ;
*/
  w.setMsgXmlData ( "<xml>"
                  + "<LS.REQUEST>"
                  + "<Operation>uploadImageFile</Operation>"
                  + ( base ? "<Base>" + base + "</Base>" : "" )
                  + "</LS.REQUEST>"
                  + "</xml>"
                  ) ;
  w.setTitle ( "Image Import..." ) ;
  w.setTopLineText ( "Please select an image file and press <b>Import</b>" ) ;
  w.setButtonUploadText ( "Import" ) ;
  w.create() ;
  w.addActionListener ( this, this._actionSubmit ) ;
  w.show() ;
  return w ;
};
Ls.prototype._actionSubmit = function ( ev )
{
  var w = ev.getPeer() ;
  var f = w.getUploadFile() ;
  var ff = new File ( f ) ;
  if ( ! ff.isImage() )
  {
    var d = new TUserDialog ( "The choosen file is <b>not</b> an image."
                            , "Image Import..."
                            ) ;
    d.error ( w ) ;
    return false ;
  }
  return true ;
};
