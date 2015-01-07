Tango.include ( "Calypso" ) ;

// ------------- TDisplay -------------------------
var TDisplay = function()
{
  this.requestTagName = "ACDISP.REQUEST" ;
  this.resultTagName = "ACDISP.RESULT" ;
};
TDisplay.prototype.getRequestTagName = function()
{
  return this.requestTagName ;
};
TDisplay.prototype.getResultTagName = function()
{
  return this.resultTagName ;
};
TDisplay.prototype.downloadDocument = function ( ud, askQuestion )
{
  if ( typeof ( _CurrentNameSpace ) != 'undefined' ) this.taskName = _CurrentNameSpace + this.requestTagName ;
  else                                               this.taskName = this.requestTagName ;

  var NAME = null ;
  var FULL_NAME = null ;
  if ( typeof ( ud ) == 'object' && ud.jsClassName == "TXml" )
  {
    NAME = ud.getContent ( "NAME" ).trim() ;
    FULL_NAME = ud.getContent ( "DIR" ).trim() + "/" + NAME ;
    mimeType = ud.getAttribute ( "mimeType" ) ;
  }
  else
  {
    throw "TDisplay: Missing or invalid name parameter: " + typeof ( ud ) ;
  }
  var msg = new CoMessage ( this.taskName ) ;
  msg.setXmlData ( "<" + this.requestTagName + ">"
                   + "<FullName>" + FULL_NAME + "</FullName>\n"
                   + "<Subject>ACDISP.REQUEST</Subject>\n"
                   + "<Operation>GetData</Operation>\n"
                   + "<Download>true</Download>\n"
                   + "</" + this.requestTagName + ">"
                   ) ;
  if ( askQuestion )
  {
    var str = TSys.translate ( "QuestionDownloadFile", null, [ NAME ] ) ;
    var str2 = TSys.translate ( "DownloadFile" ) ;
    var dUserDialog = new TUserDialog ( str ) ;
    dUserDialog.setTitle ( str2 + "?" ) ;
    dUserDialog.setUserFunction ( this.downloadAnswerFunction, [ msg, mimeType, NAME ], this ) ;
    dUserDialog.askYesNo() ;
    return ;
  }
  try
  {
    Calypso.downloadDocument ( msg, mimeType, NAME ) ;
  }
  catch ( exc )
  {
    var dUserDialog = new TUserDialog ( String ( exc  ) ) ;
    dUserDialog.info() ;
  }
/*
  if ( ud.getAttribute ( "isDirectory" ) )
  {
return ;
  }
*/
};
TDisplay.prototype.getDocument = function ( ud, callback, self )
{
  if ( typeof ( _CurrentNameSpace ) != 'undefined' ) this.taskName = _CurrentNameSpace + this.requestTagName ;
  else                                               this.taskName = this.requestTagName ; 

  var NAME = null ;
  var FULL_NAME = null ;
  if ( typeof ( ud ) == 'object' && ud.jsClassName == "TXml" )
  {
    NAME = ud.getContent ( "NAME" ).trim() ;
    FULL_NAME = ud.getContent ( "DIR" ).trim() + "/" + NAME ;
    mimeType = ud.getAttribute ( "mimeType" ) ;
  }
  else
  {
    throw "TDisplay: Missing or invalid name parameter: " + typeof ( ud ) ;
  }
  if ( ud.getAttribute ( "isDirectory" ) )
  {
    throw "TDisplay: Cannot display a directory: " + FULL_NAME ;
  }
  var msg = new CoMessage ( this.taskName ) ;
  msg.setXmlData ( "<" + this.requestTagName + ">"
                 + "<FullName>" + FULL_NAME + "</FullName>\n"
                 + "<Subject>ACDISP.REQUEST</Subject>\n"
                 + "<Operation>GetData</Operation>\n"
                 + "</" + this.requestTagName + ">"
                 ) ;
  Calypso.getXml ( msg, callback, self ) ;
};
TDisplay.prototype.getDocumentUrl = function ( ud, callback, self )
{
  if ( typeof ( _CurrentNameSpace ) != 'undefined' ) this.taskName = _CurrentNameSpace + this.requestTagName ;
  else                                               this.taskName = this.requestTagName ;

  var NAME = null ;
  var FULL_NAME = null ;
  if ( typeof ( ud ) == 'object' && ud.jsClassName == "TXml" )
  {
    NAME = ud.getContent ( "NAME" ).trim() ;
    FULL_NAME = ud.getContent ( "DIR" ).trim() + "/" + NAME ;
    mimeType = ud.getAttribute ( "mimeType" ) ;
  }
  else
  {
    throw "TDisplay: Missing or invalid name parameter: " + typeof ( ud ) ;
  }
  if ( ud.getAttribute ( "isDirectory" ) )
  {
    throw "TDisplay: Cannot display a directory: " + FULL_NAME ;
  }
  var msg = new CoMessage ( this.taskName ) ;
  msg.setXmlData ( "<" + this.requestTagName + ">"
                 + "<FullName>" + FULL_NAME + "</FullName>\n"
                 + "<Subject>ACDISP.REQUEST</Subject>\n"
                 + "<Operation>GetData</Operation>\n"
                 + "<Download>true</Download>\n"
                 + "</" + this.requestTagName + ">"
                 ) ;
  var url = Calypso.getHttpDocumentUrl ( msg, mimeType, NAME ) ;
  return url ;
};
TDisplay.prototype.downloadAnswerFunction = function ( answer, msg, mimeType, NAME )
{
  try
  {
    if ( answer.isYes() )
    {
      Calypso.downloadDocument ( msg, mimeType, NAME ) ;
    }
    else                  {}
  }
  catch ( exc )
  {
    throw exc ;
  }
};
TDisplay.prototype.getDirectoryTree = function ( path, callback, self )
{
  if ( typeof ( _CurrentNameSpace ) != 'undefined' ) this.taskName = _CurrentNameSpace + this.requestTagName ;
  else                                               this.taskName = this.requestTagName ;
  var msg = new CoMessage ( this.taskName ) ;
  msg.setXmlData ( "<" + this.requestTagName + ">\n"
                 + "<Operation>GetFileList</Operation>\n"
                 + "<SelectDirectories>true</SelectDirectories>"
                 + "<SelectFiles>false</SelectFiles>"
                 + "<ListAsTree>true</ListAsTree>"
                 + ( path ? "<Path>" + path + "</Path>" : "" )
                 + "</" + this.requestTagName + ">\n"
                 ) ;
  if ( ! callback && ! self )
  {
    var xml = Calypso.getXml ( msg ) ;
    return xml.getXml ( this.getResultTagName() ) ;
  }
  var thizz = this ;
  Calypso.getXml ( msg, function ( xml )
  {
    var fe = new TFunctionExecutor ( self, callback ) ;
    var x = xml.getXml ( thizz.getResultTagName() ) ;
    fe.execute ( [ x ] ) ;
  } ) ;
};
TDisplay.prototype.getDirectoryList = function ( path, pattern, callback, self, showGoUp, rootPath )
{
  if ( typeof ( _CurrentNameSpace ) != 'undefined' ) this.taskName = _CurrentNameSpace + this.requestTagName ;
  else                                               this.taskName = this.requestTagName ;
  var msg = new CoMessage ( this.taskName ) ;
  msg.setXmlData ( "<" + this.requestTagName + ">\n"
                 + "<Operation>GetFileList</Operation>\n"
                 + "<IconElementName>IMG</IconElementName>"
                 + "<IconDirUp>" + Tango.getFolderUpIcon() + "</IconDirUp>"
                 + "<IconDir>" + Tango.getFolderIcon() + "</IconDir>"
                 + "<SelectDirectories>true</SelectDirectories>"
                 + "<SelectFiles>true</SelectFiles>"
                 + "<ListAsTree>false</ListAsTree>"
                 + "<ShowGoUp>" + ( showGoUp ? "true" : "false" ) + "</ShowGoUp>"
                 + ( rootPath ? "<RootName>" + rootPath + "</RootName>" : "" )
                 + ( path ? "<Path>" + path + "</Path>" : "" )
                 + ( pattern ? "<Pattern>" + pattern + "</Pattern>" : "" )
                 + "</" + this.requestTagName + ">\n"
                 ) ;
//  Calypso.getXml ( msg, callback, self ) ;
  var thizz = this ;
  Calypso.getXml ( msg, function ( xml )
  {
    var fe = new TFunctionExecutor ( self, callback ) ;
    var x = xml.getXml ( thizz.getResultTagName() ) ;
    fe.execute ( [ x ] ) ;
  } ) ;
};
