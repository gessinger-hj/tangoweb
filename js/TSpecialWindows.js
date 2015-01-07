/**
 *  @constructor
 *  @extends TWindow
 */
var THtmlEditorWindow = function ( id )
{
  Tango.initSuper ( this, TWindow, null );
  this.jsClassName = "THtmlEditorWindow" ;
  if ( id ) this.id = id ;
  else      this.id = "HTML.EDITOR.WINDOW.ID" ;
  this.propertyChangeHandler = new PropertyChangeHandler() ;
  this.actionListener = [] ;
  this.iframeId = "IFRAME.ID" ;
  this.iframe = null ;
  this.iframePeer = null ;
  this.pbSave = null ;
  this.title = "Html Editor" ;
  this.pendingText = null ;
  this.windowString = ""
  + "<xml>\n"
  +   "<Window resizable='true' id='" +  this.id + "' >\n"
  +     "<Container style='width:700px;height:400px;right:-0;bottom:-0;' >\n"
  +       "<iframe name='" + this.iframeId + "' id='" + this.iframeId + "' style='top:0px;left:0px;bottom:-0;right:-0;attach-bottom:true;' >"
  +       "<![CDATA[\n"
  +       "<html>\n"
  +       "<head>\n"
  +       "<link rel='stylesheet' type='text/css' href='Tango.css'>\n"
  +       "<script type='text/javascript' src='Tango.js' ></script>\n"
  +       "<script type='text/javascript' src='TSystem.js' ></script>\n"
  +       "<script type='text/javascript' src='IframePeerTinyMCEClass.js' ></script>\n"
  +       "<script type='text/javascript' src='tinymce/jscripts/tiny_mce/tiny_mce_src.js'></script>\n"
  +       "<script type='text/javascript' language='javascript' >\n"
/*
  +         "function IframePeerTinyMCEClass_iframeLoaded()\n"
  +         "{\n"
  +           "IframePeerTinyMCE = new IframePeerTinyMCEClass ( tinyMCE ) ;\n"
  +           "IframePeerTinyMCE.onload() ;\n"
  +         "}\n"
*/
  +       "</script>\n"
  +       "</head>\n"
  +       "<body onload='IframePeerTinyMCEClass_iframeLoaded()'>\n"
  +       "<span id='THE.BODY.CONTAINER' style='position:absolute;top:0px;left:0px;margin:0px;padding:0px;' >\n"
  +       "  <span id='THE.CONTAINER' style='position:absolute;top:0px;left:0px;margin:0px;padding:0px;' >\n"
  +       "    <textarea id='THE.TEXTAREA' name='content' style='position:absolute;width:100%;height:100%;margin:0px;border:0px;' >\n"
  +       "    </textarea>\n"
  +       "  </span>\n"
  +       "</span>\n"
  +       "</body>\n"
  +       "</html>\n"
  +       "]]>\n"
  +       "</iframe>\n"
  +       "<br/>\n"
  +       "<Container style='right:0;bottom:0;' >\n"
  +          "<PushButton text='Toggle Editor' name='PB.TOGGLE_EDITOR' />\n"
  +          "<PushButton text='%Save%' name='PB.SAVE' disabled='true' />\n"
  +          "<PushButton text='%Close%' name='PB.CLOSE' />\n"
  +       "</Container>\n"
  +     "</Container>\n"
  +   "</Window>\n"
  + "</xml>\n"
  ;
}
THtmlEditorWindow.inherits( TWindow ) ;
THtmlEditorWindow.prototype.getIframePeer = function()
{
  this.iframe = this.getElementByName ( this.iframeId ) ;
  if ( ! this.iframe ) return null ;
  if ( this.iframePeer ) return this.iframePeer ;
  for ( var i = 0 ; i < 5 ; i++ )
  {
    if ( this._getIframePeer() ) return this.iframePeer ;
  }
  return this.iframePeer ;
}
THtmlEditorWindow.prototype._getIframePeer = function()
{
  if ( ! this.iframe ) return null ;
  if ( this.iframePeer ) return this.iframePeer ;
  var doc = this.iframe.contentDocument;
  if ( ! doc && this.iframe.contentWindow ) doc = this.iframe.contentWindow.document;
  if ( doc && doc.body )
  {
    var b = doc.body ;
    this.iframePeer = doc.body.jsPeer ;
  }
  if ( this.iframePeer )
  {
    this.iframePeer.addActionListener ( this, this.actionPerformed ) ;
    this.iframePeer.addPropertyChangeListener ( this, this.propertyChange ) ;
  }
  return this.iframePeer ;
}
THtmlEditorWindow.prototype.create = function()
{
  this.setAxl ( this.windowString ) ;
  TWindow.prototype.create.apply ( this, arguments ) ;

  this.iframe = this.getElementByName ( this.iframeId ) ;
  TGui.addEventListener ( this.iframe, "load", this.onload.bindAsEventListener ( this ) ) ;

  var e = null ;
  e = this.getElementByName ( "PB.CLOSE" ) ;
  TGui.addEventListener ( e, "click", this.close.bindAsEventListener ( this ) ) ;
  e = this.getElementByName ( "PB.SAVE" ) ;
  this.pbSave = new TButton ( e ) ;
  TGui.addEventListener ( e, "click", this.save.bindAsEventListener ( this ) ) ;
  e = this.getElementByName ( "PB.TOGGLE_EDITOR" ) ;
  TGui.addEventListener ( e, "click", this.toggleEditor.bindAsEventListener ( this ) ) ;
  this.getIframePeer() ;
}
THtmlEditorWindow.prototype.onload = function()
{
  this.getIframePeer() ;
  if ( this.pendingText )
  {
    this.setText ( this.pendingText ) ;
    this.pendingText = null ;
  }
}
THtmlEditorWindow.prototype.show = function()
{
  TWindow.prototype.show.apply ( this, arguments ) ;
  this.getIframePeer() ;
  this.addWindowListener ( this, this.windowEvents ) ;
}
THtmlEditorWindow.prototype.windowEvents = function ( ev )
{
  if ( this.hasChanged() )
  {
    var d = new TUserDialog ( "Data are changed. Save it?", this.getTitle() ) ;
    d.setOwnerWindow ( this ) ;
    d.askYesNoCancel ( this, this.closeAnswer ) ;
    ev.consume() ;
  }
}
THtmlEditorWindow.prototype.closeAnswer = function ( answer )
{
  if ( answer.isYes() )
  {
    this.save() ;
    this.closeImediately() ;
  }
  else
  if ( answer.isNo() )
  {
    this.closeImediately() ;
  }
}
THtmlEditorWindow.prototype.close = function()
{
  TWindow.prototype.close.apply ( this, arguments ) ;
}
THtmlEditorWindow.prototype._flush = function()
{
  TWindow.prototype._flush.apply ( this, arguments ) ;
  this.iframe = null ;
  this.iframePeer = null ;
  for ( var i = 0 ; i < this.actionListener.length ; i++ )
  {
    this.actionListener[i].flush() ;
  }
  this.actionListener.length = 0 ;
  this.actionListener = null ;
  this.propertyChangeHandler.flush() ;
  this.propertyChangeHandler = null ;
  this.pbSave = null ;
}
THtmlEditorWindow.prototype.setText = function ( str )
{
  if ( ! this.getIframePeer() )
  {
    this.pendingText = str ;
    return ;
  }
  this.iframePeer.setText ( str ) ;
}
THtmlEditorWindow.prototype.getText = function()
{
  if ( ! this.getIframePeer() ) return "" ;
  return this.iframePeer.getText() ;
}
THtmlEditorWindow.prototype.toggleEditor = function()
{
  if ( ! this.getIframePeer() ) return ;
  return this.iframePeer.toggleEditor() ;
}
THtmlEditorWindow.prototype.save = function ( event )
{
  var ev = new THtmlEditorEvent ( event, "SAVE" ) ;
  ev.setPeer ( this ) ;
  this.fireActionEvent ( ev ) ;
  this._setChanged ( false ) ;
}
THtmlEditorWindow.prototype._setChanged = function ( state )
{
  if ( this._flushed ) return ;
  state = state ? true : false ;
  this.setTitleChangedIndicator ( state ) ;
  this.getIframePeer().setChanged ( state ) ;
  this.pbSave.setEnabled ( state ) ;
}
THtmlEditorWindow.prototype.setTitleChangedIndicator = function ( state )
{
  var t = this.getTitle() ;
  if ( state )
  {
    if ( t && t.charAt ( 0 ) != '*' ) this.setTitle ( '*' + t ) ;
  }
  else
  {
    if ( t && t.charAt ( 0 ) == '*' ) this.setTitle ( t.substring ( 1 ) ) ;
  }
}
THtmlEditorWindow.prototype.addActionListener = function ( obj, method )
{ 
  this.actionListener.push ( new TFunctionExecutor ( obj, method ) ) ;
}
THtmlEditorWindow.prototype.addPropertyChangeListener = function ( obj, method, propertyName )
{
  this.propertyChangeHandler.add ( obj, method, propertyName )
}
THtmlEditorWindow.prototype.propertyChange = function ( ev )
{
  this.propertyChangeHandler.fireEvent ( ev ) ;
  if ( ev.getPropertyName() == 'TEXT' )
  {
    this._setChanged ( true ) ;
  }
}
THtmlEditorWindow.prototype.actionPerformed = function ( ev )
{
  this.fireActionEvent ( ev ) ;
}
THtmlEditorWindow.prototype.fireActionEvent = function ( ev )
{
  for ( var i = 0 ; i < this.actionListener.length ; i++ )
  {
    this.actionListener[i].executeWithEvent ( ev ) ;
    if ( this._flushed ) break ;
  }
}
THtmlEditorWindow.prototype.hasChanged = function()
{
  var wBody = new TXml ( this.getBody() ) ;
  var lc = wBody.getListenerContext() ;
  if ( lc )
  {
    if ( lc.hasChanged() ) return true ;
  }
  if ( ! this.getIframePeer() ) return false ;
  return this.getIframePeer().hasChanged() ;
};
/**
 * Special version for IE < 10
 *  @constructor
 *  @extends TWindow
 */
var TUploadWindow = function()
{
  Tango.initSuper ( this, TWindow, null );
  Tango.mixin ( EventMulticasterTrait, this ) ;

  this.jsClassName = "TUploadWindow" ;
  this.taskName = "UPLOAD" ;
  this._uploadAttributeNames = [] ;
  this._uploadAttributeValues = [] ;
  this.title = TSys.translate ( "FileUpload" ) ;
  this.buttonUploadText = TSys.translate ( "Upload" ) ;
  this.topText = TSys.translate ( "PleaseSelectAFileAndPressUpload" ) ;
  var img = TGui.buildThemeImageUrl ( "Alert", "info", NaN, NaN )  ;
  this.msgSuccess = "<img src='" + img + "' width='32' height='32' />" + TSys.translate ( "TheFileHasBeenUploadedSucessfully" ) ;
  this.msgSuccess += "<script>TIframeUploadHelper.callback('upload-success');</script>" ;
  img = TGui.buildThemeImageUrl ( "Alert", "error", NaN, NaN )  ;
  this.msgError = "<img src='" + img + "' width='32' height='32' />" + TSys.translate ( "TheFileCouldNotBeUploaded" ) ;
  this.msgError += "<script>TIframeUploadHelper.callback('upload-error');</script>" ;
  this.iframeStringPre = ""
  + "<html>\n"
  + "<head>\n"
  + "<link rel='stylesheet' type='text/css' href='Tango.css'>\n"
//  + "<link rel='stylesheet' type='text/css' href='TIframeUploadHelper.css' >\n"
  + "<script type='text/javascript' src='Tango.js' ></script>\n"
  + "<script type='text/javascript' src='TSystem.js' ></script>\n"
  + "<script type='text/javascript' src='TComponents.js' ></script>\n"
  + "<script type='text/javascript' src='TUtil.js' ></script>\n"
  + "<script type='text/javascript' src='TIframeUploadHelper.js' ></script>\n"
  + "<script type='text/javascript' language='javascript' >\n"
  + "function iframeLoaded()\n"
  + "{\n"
  + "  Tango.include ( 'TIframeUploadHelper' ) ;"
  // + "  TIframeUploadHelper.onload ( '" + Tango.getThemeName() + "' ) ;\n"
  + "};\n"
  + "</script>\n"
  + "</head>\n"
//  + "<body >"
  + "<body onload='iframeLoaded()'>\n"
  ;
  this.iframeString = ""
  + "<form id='FORM_UPLOAD' method='POST' enctype='multipart/form-data' class='example' action='" + TSys.getWebConfig().getContextPath() + "/FileUploadServlet#formParameter#'>\n"
  + "<input type=hidden name='task' value='#TASKNAME#' />\n"
//  + "<input type=hidden name='msgSuccess' value='#msgStart##msgSuccess##msgStop#' />\n"
  + "<input type=hidden name='msgSuccess' value='#msgSuccess#' />\n"
  + "<input type=hidden name='msgError' value='#msgErrorStart##msgError##msgErrorStop#' />\n"
  + "<input type=hidden name='FULL_TEXT_PRE' value='#FULL_TEXT_PRE#' />\n"
  + "<input type=hidden name='FULL_TEXT_POST' value='#FULL_TEXT_POST#' />\n"
  + "<input type=hidden name='FULL_TEXT' value='#FULL_TEXT#' />\n"
  + "<input type=hidden name='MSG_XML_DATA' value='#MSG_XML_DATA#' />\n"
  + "#TOPTEXT#\n"
  + "<br/>\n"
  + "<input id='INPUT_FILE' type='file' name='UploadFile' style='width:96%;'>"
  + "<br/>"
  + "</form>"
  ;
  this.iframeStringPost = ""
  + "</body>"
  + "</html>\n"
  ;
  this.axlString1 = ""
  + "<xml>\n"
  + "  <Window modal='true' resizable='true' id='WINDOW.UPLOAD' close-with-escape='true'>\n"
  + "    <Container style='right:-0;bottom:-0;' Xstyle='width:400px;height:400px;' >\n"
  + "      <iframe name='IFRAME_UPLOAD' style='margin:0px;right:-0;bottom:-0;'><![CDATA[\n"
  ;
  this.axlString2 = ""
  + "      ]]></iframe>\n"
  + "      <br />\n"
  + "      <Container bottom='0' right='0' >\n"
  + "        <PushButton text='#BUTTON_UPLOAD_TEXT#' name='PB_SUBMIT1' disabled='true'/>\n"
//  + "        <PushButton text='%Retry%' name='PB_RETRY' />\n"
  + "        <PushButton text='%Close%' name='PB_CLOSE' onclick='TGui.closeTopWindow(event)' />\n"
  + "      </Container>\n"
  + "    </Container>\n"
  + "  </Window>\n"
  + "</xml>\n"
  ;

  this.actionListener = [] ;
  this._uploadFile = null ;
}
TUploadWindow.inherits( TWindow ) ;
TUploadWindow.prototype.setTopLineText = function ( str )
{
  this.topText = str ;
}
TUploadWindow.prototype.setButtonUploadText = function ( str )
{
  this.buttonUploadText = str ;
}
TUploadWindow.prototype.create = function()
{
  var formParameter = "" ;
  if ( this._uploadAttributeNames.length )
  {
    formParameter = "?" ;
    var first = true ;
    for ( var i = 0 ; i < this._uploadAttributeNames.length ; i++ )
    {
      if ( first ) first = false ;
      else formParameter += "&" ;
      formParameter += this._uploadAttributeNames[i] + "=" + this._uploadAttributeValues[i] ;
    }
  }
  this.iframeString = this.iframeString.replace ( "#TASKNAME#", this.taskName ) ;
  this.iframeString = this.iframeString.replace ( "#TOPTEXT#", this.topText ) ;
  if ( this._msgXmlData )
  {
    var str = this._escapeChars ( this._msgXmlData ) ;
    this.iframeString = this.iframeString.replace ( "#MSG_XML_DATA#", str ) ;
  }
  this.axlString2 = this.axlString2.replace ( "#BUTTON_UPLOAD_TEXT#", this.buttonUploadText ) ;
  this.iframeString = this.iframeString.replace ( "#msgSuccess#", this._escapeChars ( this.msgSuccess ) ) ;
  this.iframeString = this.iframeString.replace ( "#msgError#", this._escapeChars ( this.msgError ) ) ;
  this.iframeString = this.iframeString.replace ( "#formParameter#", formParameter ) ;

  this.iframeString = this.iframeString.replace ( "#FULL_TEXT#", this._escapeChars ( this.iframeString ) ) ;

  this.iframeString = this.iframeString.replace ( "#FULL_TEXT_PRE#", this._escapeChars ( this.iframeStringPre ) ) ;
  this.iframeString = this.iframeString.replace ( "#FULL_TEXT_POST#", this._escapeChars ( this.iframeStringPost ) ) ;

  this.iframeString = this.iframeStringPre + this.iframeString + this.iframeStringPost ;
  this.setAxl ( this.axlString1 + this.iframeString + this.axlString2 ) ;
  TWindow.prototype.create.apply ( this, arguments ) ;
  this.PB_RETRY = this.getComponent ( "PB_RETRY" ) ;
  if ( this.PB_RETRY.dom ) this.PB_RETRY.addEventListener ( "click", this.retry.bindAsEventListener ( this ) ) ;
  this.PB_SUBMIT1 = this.getComponent ( "PB_SUBMIT1" ) ;
  this.PB_SUBMIT1.addEventListener ( "click", this.submit.bindAsEventListener ( this ) ) ;
  this.PB_CLOSE = this.getComponent ( "PB_CLOSE" ) ;

  this.IFRAME_UPLOAD = this.getElementByName ( "IFRAME_UPLOAD" ) ;
  this.IFRAME_UPLOAD_DOCUMENT = this.IFRAME_UPLOAD.contentDocument;
  if (this.IFRAME_UPLOAD_DOCUMENT == undefined || this.IFRAME_UPLOAD_DOCUMENT == null)
    this.IFRAME_UPLOAD_DOCUMENT = this.IFRAME_UPLOAD.contentWindow.document;
  this.IFRAME_UPLOAD_BODY = this.IFRAME_UPLOAD_DOCUMENT.body ;
  this.INPUT_FILE = this.IFRAME_UPLOAD_DOCUMENT.getElementById ( "INPUT_FILE" ) ;
  if ( this.INPUT_FILE )
  {
    TGui.addEventListener ( this.INPUT_FILE, "change", this.change.bindAsEventListener ( this ) ) ;
  }
  document.TIframeUploadHelper_callback = this._callback.bind ( this ) ;
};
TUploadWindow.prototype._callback = function ( eventName, b )
{
  if ( eventName === "frame-onload" )
  {
    this.IFRAME_UPLOAD = this.getElementByName ( "IFRAME_UPLOAD" ) ;
    this.IFRAME_UPLOAD_DOCUMENT = this.IFRAME_UPLOAD.contentDocument;
    if (this.IFRAME_UPLOAD_DOCUMENT == undefined || this.IFRAME_UPLOAD_DOCUMENT == null)
      this.IFRAME_UPLOAD_DOCUMENT = this.IFRAME_UPLOAD.contentWindow.document;

    this.IFRAME_UPLOAD_BODY = this.IFRAME_UPLOAD_DOCUMENT.body ;
    var INPUT_FILE = this.IFRAME_UPLOAD_DOCUMENT.getElementById ( "INPUT_FILE" ) ;
    if ( INPUT_FILE && INPUT_FILE !== this.INPUT_FILE )
    {
      this.INPUT_FILE = INPUT_FILE ;
      TGui.addEventListener ( this.INPUT_FILE, "change", this.change.bindAsEventListener ( this ) ) ;
    }
    this.FORM_UPLOAD = this.IFRAME_UPLOAD_DOCUMENT.getElementById ( "FORM_UPLOAD" ) ;
  }
  else
  {
    this.getCloseButton().dom.focus() ;
  }

  var ev = new TItemEvent ( null, eventName ) ;
  ev.setPeer ( this ) ;
  this._fireEvent ( ev ) ;
};
TUploadWindow.prototype.change = function ( event )
{
  var ev = new TEvent ( event ) ;
  this.PB_SUBMIT1.setEnabled ( true ) ;
  var ev = new TItemEvent ( event, "input" ) ;
  ev.setPeer ( this ) ;
  this._fireEvent ( ev ) ;
};
TUploadWindow.prototype._escapeChars = function ( str )
{
  return str.replace ( /</g, "{lt}" ).replace ( />/g, "{gt}" ).replace ( /"/g, "{quot}" ).replace ( /'/g, "{apos}" ) ;
}
TUploadWindow.prototype.setTaskName = function ( taskName )
{
  this.taskName = taskName ;
}
TUploadWindow.prototype._flush = function()
{
  TWindow.prototype._flush.apply ( this, arguments ) ;
  this._uploadAttributeNames.length = 0 ;
  this._uploadAttributeValues.length = 0 ;
  this._uploadAttributeNames = null ;
  this._uploadAttributeValues = null ;
  this.actionListener.length = 0 ;
  this.actionListener = null ;
  this.flushEventMulticaster() ;
}
TUploadWindow.prototype.addUploadAttribute = function ( name, value )
{
  if ( typeof ( name ) != 'string' ) return ;
  if (  typeof ( value ) != 'string'
     && typeof ( value ) != 'number'
     && typeof ( value ) != 'boolean'
     )
  {
    return ;
  }
  name = escape ( name ) ;
  value = escape ( String ( value ) ) ;
  this._uploadAttributeNames.push ( name ) ;
  this._uploadAttributeValues.push ( value ) ;
};
TUploadWindow.prototype.getSubmitButton = function()
{
  return this.PB_SUBMIT1 ;
};
TUploadWindow.prototype.getCloseButton = function()
{
  return this.PB_CLOSE ;
};
TUploadWindow.prototype.getUploadFile = function()
{
  return this.INPUT_FILE.value ;
};
TUploadWindow.prototype.setMsgXmlData = function ( xmlString )
{
  this._msgXmlData = xmlString ;
}
TUploadWindow.prototype.show = function()
{
  TWindow.prototype.show.apply ( this, arguments ) ;
}
TUploadWindow.prototype.retry = function ( event )
{
  this.IFRAME_UPLOAD_DOCUMENT.open();
  this.IFRAME_UPLOAD_DOCUMENT.write ( this.iframeString ) ;
  this.IFRAME_UPLOAD_DOCUMENT.close();
}
TUploadWindow.prototype.showProgress = function()
{
  var img = document.createElement ( "img" ) ;
  this.IFRAME_UPLOAD_BODY.appendChild ( img ) ;
  img.style.position = "absolute" ;
  img.style.width = "32px" ;
  img.style.height = "32px" ;
  
  var size = new TContainer ( this.IFRAME_UPLOAD_BODY ).getSize() ;

  img.style.left = Math.floor ( ( size.width - 32 ) / 2 ) + "px" ;
  img.style.top = Math.floor ( ( size.height - 32 ) / 2 ) + "px" ;
  img.src = TGui.buildThemeImageUrl ( "Misc", "throbber", NaN, NaN ) ;
};
TUploadWindow.prototype.submit = function ( event )
{
  var eINPUT_FILE = this.IFRAME_UPLOAD_DOCUMENT.getElementById ( "INPUT_FILE" ) ;
  if ( ! eINPUT_FILE ) return ;
  this._uploadFile = eINPUT_FILE.value ;
  var ev = new TActionEvent ( event, "SUBMIT" ) ;
  ev.setPeer ( this ) ;
  if ( ! this._fireActionEvent ( ev ) ) return ;
  var b = this._fireEvent ( "before-submit" ) ;
  if ( b === false ) return ;
  this.PB_SUBMIT1.setEnabled ( false ) ;
  this.showProgress() ;
  var thiz = this ;
  TSys.executeLater ( function() // IE8: event checked
  {
    var FORM_UPLOAD = thiz.IFRAME_UPLOAD_DOCUMENT.getElementById ( "FORM_UPLOAD" ) ;
    FORM_UPLOAD.submit() ;
  }) ;
}
TUploadWindow.prototype._fireActionEvent = function ( ev )
{
  for ( var i = 0 ; i < this.actionListener.length ; i++ )
  {
    if ( ! this.actionListener[i].executeWithEvent ( ev ) ) return false ;
  }
  return true ;
}
TUploadWindow.prototype.addActionListener = function ( obj, method )
{
  this.actionListener.push ( new TFunctionExecutor ( obj, method ) ) ;
}
/**
 *  @constructor
 *  @extends TItemEvent
 */
var ResponseEvent = function ( item, response )
{
  Tango.initSuper ( this, TItemEvent, null, item ) ;
  this.jsClassName = "ResponseEvent" ;
  this.response = response ;
};
ResponseEvent.inherits( TItemEvent ) ;
ResponseEvent.prototype.setResponse = function ( response )
{
  this.response = response ;
}
ResponseEvent.prototype.getResponse = function()
{
  return this.response ;
}
ResponseEvent.prototype.toString = function()
{
  return "(" + this.jsClassName + ")[" + TSys.toFullString ( this.response ) + "]" ;
}
ResponseEvent.prototype.isBad = function()
{
  if ( ! this.response ) return false ;
  if ( this.response.code === 'undefined' ) return false ;
  return this.response.code !== 0 ;
};
/**
 *  @constructor
 */
var UploadContainerFactory = function ( id )
{
  // var st_dropzone = "border: 2px dashed #BBBBBB;border-radius: 5px;color: #BBBBBB;padding: 4px;text-align: center;overflow:auto;background-color:white;" ;
  var st_dropzone = "border: 2px dashed #BBBBBB;border-radius: 5px;color: #BBBBBB;padding: 4px;overflow:auto;background-color:white;" ;
  this.src = "<xml>\n"
           + "  <Container name='X' onload='*.onload()'>\n"
           + "    <Label text='#top-line-text#'/>\n"
           + "    <br/>\n"
           + "    <Container style='right:-0px;'><Html><![CDATA[<input type='file' name='INPUT_FILE' style='width:100%;' #MULTIPLE# >]]></Html></Container>\n"
           + "    <br/>\n"
           + "    <Container name='dropzone' style='right:-4px;bottom:-0px;" + st_dropzone + "' >\n"
           + "    </Container>\n"
           + "    <br/>\n"
           + "    <Container style='right:0px;bottom:0px;' >\n"
           + "      <PushButton name='PB_IMPORT' text='#button-upload-text#' disabled='true' onclick='*._import()' />\n"
           + "      #cancel#\n"
           + "      #close#\n"
           + "    </Container>\n"
           + "  </Container>\n"
           + "</xml>"
           ;
};
UploadContainerFactory.prototype.getAxl = function ( dom )
{
  var xml = new TXml ( dom ) ;
  var t ;

  this.top_line_text      = xml.getAttribute ( "top-line-text", 'Please select a file and press <b>#button-upload-text#</b>' )
                            .replace ( /</g, "&lt;" ).replace ( />/g, "&gt;" ).replace ( /'/g, "&quot;" ) ;
  this.button_upload_text = xml.getAttribute ( "button-upload-text", 'Import' )
                            .replace ( /</g, "&lt;" ).replace ( />/g, "&gt;" ).replace ( /'/g, "&quot;" ) ;
  this.task_name          = xml.getAttribute ( "task-name", 'UPLOAD' ) ;
  this.title              = xml.getAttribute ( "title", 'File Import...' ).replace ( /</g, "&lt;" ).replace ( />/g, "&gt;" ) ;
  this.show_cancel        = xml.getBoolAttribute ( "show-cancel", false ) ;
  this.show_close        = xml.getBoolAttribute ( "show-close", false ) ;
  var src = this.src.replace ( /#top-line-text#/g, this.top_line_text )
                    .replace ( /#button-upload-text#/g, this.button_upload_text )
                    ;
  if ( xml.getAttribute ( "oncancel" ) || this.show_cancel )
  {
    src = src.replace ( /#cancel#/g, "<PushButton name='PB_CANCEL' text='%Cancel%' onclick='*.cancel()'/>" ) ;
  }
  else
  {
    src = src.replace ( /#cancel#/g, "" ) ;
  }
  if ( xml.getAttribute ( "onclose" ) || this.show_close )
  {
    src = src.replace ( /#close#/g, "<PushButton name='PB_CLOSE' text='%Close%' onclick='*.close()'/>" ) ;
  }
  else
  {
    src = src.replace ( /#close#/g, "" ) ;
  }

  this.multiple = xml.getAttribute ( "multiple" ) ;
  if ( this.multiple === "true" || this.multiple === 'multiple' )
  {
    this.multiple = true ;
  }
  else
  {
    this.multiple = false ;
  }
  if ( this.multiple )
  {
    src = src.replace ( /#MULTIPLE#/g, "multiple" ) ;
  }
  else
  {
    src = src.replace ( /#MULTIPLE#/g, "" ) ;
  }
  var axl = new TXml ( src ) ;
  var xCont = axl.get ( "Container" ) ;
  xCont.copyAttributesFrom ( xml ) ;

  var style = xml.getAttribute ( "style" ) ;
  var st = "" ;
  if ( style )
  {
    style = style.trim() ;
    if ( style.charAt ( style.length - 1 ) != ';' ) style += ';' ;
    style += st ;
  }
  else
  {
    style = st ;
  }
  if ( style ) xCont.addAttribute ( "style", style ) ;
  dom = axl.getDom() ;
  axl.dom = null ;
  this.currentPeer = new UploadContainer ( xml ) ;
  return dom ;
};
UploadContainerFactory.prototype.getPeer = function()
{
  return this.currentPeer ;
};
TGui.addTagDefinition ( "UploadContainer", new UploadContainerFactory() ) ;
/**
 *  @constructor
 *  @extends TContainer
 */
var UploadContainer = function ( axl )
{
  this.axl = axl ;
  Tango.initSuper ( this, TContainer );
  this.jsClassName = "UploadContainer" ;
  Tango.mixin ( EventMulticasterTrait, this ) ;
  this.oninput = axl.getAttribute ( "oninput" ) ;
  this.onimport = axl.getAttribute ( "onimport" ) ;
  this.oncancel = axl.getAttribute ( "oncancel" ) ;
  this.onclose = axl.getAttribute ( "onclose" ) ;
  this.onupload_success = axl.getAttribute ( "onupload-success" ) ;
  this.onupload_error = axl.getAttribute ( "onupload-error" ) ;
  this.multiple = axl.getAttribute ( "multiple" ) ;
  if ( this.multiple === "true" || this.multiple === 'multiple' )
  {
    this.multiple = true ;
  }
  else
  {
    this.multiple = false ;
  }
  this._msgXmlData = null ;
  this.task_name = axl.getAttribute ( "task-name" ) ;
  this.send_async = axl.getBoolAttribute ( "send-async", false ) ;
  this.msgSuccess = '{ "code":0,"state":"SUCCESS", "file":"{FILE}" }' ;
  this.msgError   = '{ "code":-1,"state":"ERROR", "file":"{FILE}" }' ;
};
UploadContainer.inherits( TContainer ) ;
UploadContainer.prototype.setMsgXmlData = function ( xml )
{
  this._msgXmlData = xml ;
};
UploadContainer.prototype.getMsgXmlData = function()
{
  return this._msgXmlData ;
};
UploadContainer.prototype.setTaskName = function ( taskName )
{
  this.task_name = taskName ;
};
UploadContainer.prototype.getTaskName = function()
{
  return this.task_name ;
};
UploadContainer.prototype.setSendAsync = function ( state )
{
  this.send_async = !! state ;
};
UploadContainer.prototype.isPagelet = function()
{
  return true ;
};
UploadContainer.prototype.onload = function ( event )
{
  this.PB_IMPORT = this.getComponent ( "PB_IMPORT" ) ;
  this.PB_CANCEL = this.getComponent ( "PB_CANCEL" ) ;
  this.PB_CLOSE = this.getComponent ( "PB_CLOSE" ) ;
  this.dropzone = this.getComponent ( "dropzone" ) ;
  this.dropzone.addEventListener ( 'dragover', this, this.ondragover ) ;
  this.dropzone.addEventListener ( 'drop', this, this.ondrop ) ;
  this.resetDropzone() ;
};
UploadContainer.prototype.resetDropzone = function()
{
  this.dropzone.dom.style.fontSize = "18px" ;
  this.dropzone.dom.style.color = "#BBBBBB" ;
  if ( this.multiple )
  {
    this.dropzone.setText ( "Drop files here or select with file dialog." ) ;
  }
  else
  {
    this.dropzone.setText ( "Drop file here or select with file dialog." ) ;
  }
};
UploadContainer.prototype.setDropboxText = function ( text )
{
  this.dropzone.dom.style.fontSize = "inherit" ;
  this.dropzone.dom.style.color = "inherit" ;
  this.dropzone.setText ( text ) ;
};
UploadContainer.prototype.ondrop = function ( event )
{
  event.stopPropagation() ;
  event.preventDefault() ;
  if ( ! this.multiple && event.dataTransfer.files.length > 1 )
  {
    this.PB_IMPORT.setEnabled ( false ) ;
    var d = new TUserDialog ( "Only 1 file allowed."
                             , "File Upload..."
                             ) ;
    d.error() ;
    return false ;
  }
  this._uploadFileList = event.dataTransfer.files ;
  this._fireOnInput ( event ) ;
};
UploadContainer.prototype.ondragover = function ( event )
{
  event.stopPropagation() ;
  event.preventDefault() ;
  event.dataTransfer.dropEffect = 'copy';
};
UploadContainer.prototype.getImportButton = function()
{
  return this.PB_IMPORT ;
};
UploadContainer.prototype.getUploadFileList = function()
{
  return this._uploadFileList ;
};
UploadContainer.prototype.setMsgXmlData = function ( xmlString )
{
  this._msgXmlData = xmlString ;
}
UploadContainer.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  this.dom.xClassName = "UploadContainer" ;
  this.setName ( dom.name ) ;
  this.INPUT_FILE = this.getComponent ( "INPUT_FILE" ) ;
  this.addEventListener ( "change", this, this._change ) ;
  if ( this.oninput ) this.oninput = new TFunctionExecutor ( this.oninput, layoutContext ) ;
  if ( this.onimport ) this.onimport = new TFunctionExecutor ( this.onimport, layoutContext ) ;
  if ( this.oncancel ) this.oncancel = new TFunctionExecutor ( this.oncancel, layoutContext ) ;
  if ( this.onclose ) this.onclose = new TFunctionExecutor ( this.onclose, layoutContext ) ;
  if ( this.onupload_success ) this.onupload_success = new TFunctionExecutor ( this.onupload_success, layoutContext ) ;
  if ( this.onupload_error ) this.onupload_error = new TFunctionExecutor ( this.onupload_error, layoutContext ) ;
};
UploadContainer.prototype._change = function ( event )
{
  this._uploadFileList = this.INPUT_FILE.dom.files ;
  this._fireOnInput ( event ) ;
};
UploadContainer.prototype._fireOnInput = function ( event )
{
  var ev = new TEvent ( event ) ;
  var files = this.getUploadFileList() ;
  if ( ! files.length )
  {
    this.PB_IMPORT.setEnabled ( false ) ;
  }
  else
  {
    this.PB_IMPORT.setEnabled ( true ) ;
  }
  var ev = new TItemEvent ( event, "input" ) ;
  ev.setPeer ( this ) ;
  if ( this._fireEvent ( ev ) === false )
  {
    this.PB_IMPORT.setEnabled ( false ) ;
    this.resetDropzone() ;
    return ;
  }
  if ( this.oninput )
  {
    if ( this.oninput.executeWithEvent ( ev ) === false )
    {
      this.PB_IMPORT.setEnabled ( false ) ;
      this.resetDropzone() ;
      return ;
    }
  }
  var output = [];
  if ( ! files.length )
  {
    this.resetDropzone() ;
  }
  else
  {
    for ( var i = 0, f ; f = files[i] ; i++ )
    {
      output.push('<li><strong>', f.name, '</strong></li>' ) ;
    }
    this.setDropboxText ( '<ol>' + output.join('') + '</ol>' ) ;
  }
};
UploadContainer.prototype._import = function ( event )
{
  var ev = new TItemEvent ( event, "import" ) ;
  ev.setPeer ( this ) ;
  this._fireEvent ( ev ) ;
  if ( this.onimport ) this.onimport.executeWithEvent ( ev ) ;
};
UploadContainer.prototype.cancel = function ( event )
{
  var ev = new TItemEvent ( event, "cancel" ) ;
  ev.setPeer ( this ) ;
  this._fireEvent ( ev ) ;
  if ( this.oncancel ) this.oncancel.executeWithEvent ( ev ) ;
};
UploadContainer.prototype.close = function ( event )
{
  var ev = new TItemEvent ( event, "close" ) ;
  ev.setPeer ( this ) ;
  this._fireEvent ( ev ) ;
  if ( this.onclose ) this.onclose.executeWithEvent ( ev ) ;
};
/*
oReq.addEventListener("progress", updateProgress, false);
oReq.addEventListener("load", transferComplete, false);
oReq.addEventListener("abort", transferCanceled, false);


var files = INPUT_FILE.files ;
log ( files, true ) ;
log ( "window.FormData=" + window.FormData ) ;
log ( "window.File=" + window.File ) ;
log ( "window.FileReader=" + window.FileReader ) ;
log ( "window.FileList=" + window.FileList ) ;
 */
UploadContainer.prototype.showProgress = function()
{
  var img = document.createElement ( "img" ) ;
  this._throbber = img ;
  this.dom.appendChild ( img ) ;
  img.style.position = "absolute" ;
  img.style.width = "32px" ;
  img.style.height = "32px" ;
  var size = this.getSize() ;
  img.style.left = Math.floor ( ( size.width - 32 ) / 2 ) + "px" ;
  img.style.top = Math.floor ( ( size.height - 32 ) / 2 ) + "px" ;
  img.src = TGui.buildThemeImageUrl ( "Misc", "throbber", NaN, NaN ) ;
};
UploadContainer.prototype.stopProgress = function()
{
  if ( ! this._throbber ) return ;
  this._throbber.parentNode.removeChild ( this._throbber ) ;
};
UploadContainer.prototype.sendAllFiles = function ( callback )
{
  this.getImportButton().setEnabled ( false ) ;
  var thiz = this ;
  this.setSendAsync ( true ) ;
  TSys.executeLaterNoWorkingPanel ( function ()
  {
    thiz._sendAllFiles ( callback ) ;
  } ) ;
};
UploadContainer.prototype._sendAllFiles = function ( callback )
{
  try
  {
    var listDone = [] ;
    var listRest = [] ;
    var files = this.getUploadFileList() ;
    for ( var i = 0 ; i < files.length ; i++ )
    {
      listRest.push ( files[i] ) ; 
    }
    var wp = TSys.showThrobberTypeWorkingPanel ( { opacity: 0.1 } ) ;
    var thiz = this ;
    var f = listRest.shift() ;
    var cb = function sendCallback ( e )
    {
      if ( e.isBad() )
      {
        if ( this.onupload_error ) this.onupload_error.executeWithEvent ( e ) ;
        this._fireEvent ( e ) ;
        if ( typeof callback === 'function' ) callback.call ( thiz, { code:-1, status:'ERROR', file: f.name } ) ;
        wp.close() ;
        return ;
      }
      listDone.push ( e.response.file ) ;
      if ( ! listRest.length )
      {
        wp.close() ;
        thiz.showCurrentFileStatus ( listDone, listRest ) ;
        if ( thiz.onupload_success ) this.onupload_success.executeWithEvent ( e ) ;
        this._fireEvent ( e ) ;
        if ( typeof callback === 'function' ) callback.call ( thiz, { code:0, status:'SUCCESS', file: f.name } ) ;
        return ;
      }
      f = listRest.shift() ;
      thiz.showCurrentFileStatus ( listDone, listRest, f.name ) ;
      thiz._sendFile ( f, cb, true ) ; 
    }
    this.showCurrentFileStatus ( listDone, listRest, f.name ) ;
    this._sendFile ( f, cb, true ) ;
  }
  finally
  {
    // this.stopProgress() ;
  }
};
UploadContainer.prototype.showCurrentFileStatus = function ( listDone, listRest, pendingName )
{
  var list = [] ;
  for ( var i = 0 ; i < listDone.length ; i++ )
  {
    list.push('<li>', listDone[i], '&nbsp;\u221A</li>' ) ;
  }
  if ( pendingName )
  {
    list.push('<li>', pendingName, '&nbsp;\u25C0</li>' ) ;
  }
  for ( var i = 0 ; i < listRest.length ; i++ )
  {
    list.push('<li><strong>', listRest[i].name, '</strong></li>' ) ;
  }
  this.setDropboxText ( '<ol>' + list.join('') + '</ol>' ) ;
};
UploadContainer.prototype.sendFile = function ( file, callback )
{
  this.getImportButton().setEnabled ( false ) ;
  var thiz = this ;
  TSys.executeLater ( function (){thiz._sendFile ( file, callback ) ; } ) ;
};
UploadContainer.prototype._sendFile = function ( file, callback, bulk )
{
  var p = "" ; //this.getFormParameter() ;
  var uri = TSys.getWebConfig().getContextPath() + "/FileUploadServlet" + p ;
  var xhr = new XMLHttpRequest();
  var fd = new FormData();
  xhr.open ( "POST", uri, this.send_async ) ;
  var thiz = this ;
  xhr.onerror = function ( e )
  {
    var ev = new ResponseEvent ( "upload-error" ) ; 
    ev.setPeer ( thiz ) ;
    var r = { code:-1, status:'ERROR', HTTP_status: xhr.status, HTTP_responseText:xhr.responseText, file: file.name } ;
    ev.setResponse ( r ) ;
    if ( ! bulk )
    {
      thiz._fireEvent ( ev ) ;
      if ( ! bulk )
      {
        if ( thiz.onupload_error ) thiz.onupload_error.executeWithEvent ( ev ) ;
      }
    }
    if ( typeof callback === 'function' )
    {
      callback.call ( thiz, ev ) ;
    }
  };
  xhr.onload = function()
  {
    var responseText = xhr.responseText.trim() ;
    var response = responseText ;
    var responseCode ;
    if ( responseText.indexOf ( "{" ) === 0 && responseText.lastIndexOf ( "}" ) === responseText.length - 1 )
    {
      response = JSON.parse ( responseText ) ;
      responseCode = response.code ;
    }
    var ev, key, error = false ;
    if ( xhr.status == 200 )
    {
      if ( typeof responseCode !== 'undefined' )
      {
        if ( responseCode === 0 )
        {
          ev = new ResponseEvent ( "upload-success" ) ;
        }
        else
        {
          error = true ;
          ev = new ResponseEvent ( "upload-error" ) ; 
        }
      }
      else
      {
        error = true ;
        ev = new ResponseEvent ( "upload-error" ) ;
      }
    }
    else
    {
      error = true ;
      ev = new ResponseEvent ( "upload-error" ) ;
    }
    if ( typeof responseCode === 'undefined' ) response = {} ;

    ev.setResponse ( response ) ;
    response["HTTP_status"] = xhr.status ;
    response["HTTP_responseText"] = xhr.responseText ;

    ev.setPeer ( thiz ) ;
    if ( ! bulk )
    {
      thiz._fireEvent ( ev ) ;
      if ( error && thiz.onupload_error )
      {
        thiz.onupload_error.executeWithEvent ( ev ) ;
      }
      if ( ! error && thiz.onupload_success )
      {
        thiz.onupload_success.executeWithEvent ( ev ) ;
      }
    }
    if ( typeof callback === 'function' )
    {
      callback.call ( thiz, ev ) ;
    }
  };
  fd.append ( "task", this.getTaskName() ) ;
  fd.append ( "msgSuccess", this.msgSuccess ) ;
  fd.append ( "msgError", this.msgError ) ;
  fd.append ( "MSG_XML_DATA", this.getMsgXmlData() ) ;
  fd.append ( "UploadFile", file, file.name ) ;
  /* Initiate a multipart/form-data upload*/
  xhr.send ( fd ) ;
};
/**
 *  @constructor
 *  @extends TWindow
 */
var TUploadWindow2 = function()
{
  Tango.initSuper ( this, TWindow, null );
  Tango.mixin ( EventMulticasterTrait, this ) ;

  this.jsClassName = "TUploadWindow2" ;
  this.taskName = "UPLOAD" ;
  this._uploadAttributeNames = [] ;
  this._uploadAttributeValues = [] ;
  this.title = TSys.translate ( "FileUpload" ) ;
  this.buttonUploadText = TSys.translate ( "Upload" ) ;
  this.topText = TSys.translate ( "PleaseSelectAFileAndPressUpload" ) ;
  this.send_async = false ;
  this.multiple = false ;
  this.show_cancel = false ;
  this.show_close = true ;
  this.axlString = ""
  + "<xml>\n"
  + "  <Window modal='true' resizable='true' id='WINDOW.UPLOAD' close-with-escape='true'>\n"
  + "    <Container name='X' style='right:-0;bottom:-0;' Xstyle='width:400px;height:400px;' >\n"
  + "    </Container>\n"
  + "  </Window>\n"
  + "</xml>\n"
  ;

}
TUploadWindow2.inherits( TWindow ) ;
TUploadWindow2.prototype.setTopLineText = function ( str )
{
  this.topText = str ;
};
TUploadWindow2.prototype.setButtonUploadText = function ( str )
{
  this.buttonUploadText = str ;
};
TUploadWindow2.prototype.setTaskName = function ( taskName )
{
  this.taskName = taskName ;
};
TUploadWindow2.prototype.setMsgXmlData = function ( xmlString )
{
  this._msgXmlData = xmlString ;
};
TUploadWindow2.prototype.setSendAsync = function ( state )
{
  this.send_async = !! state ;
};
TUploadWindow2.prototype.setShowCancel = function ( state )
{
  this.show_cancel = !! state ;
};
TUploadWindow2.prototype.setShowClose = function ( state )
{
  this.show_close = !! state ;
};
TUploadWindow2.prototype.setMultiple = function ( state )
{
  this.multiple = !! state ;
};
TUploadWindow2.prototype.create = function()
{
  var axl = new TXml ( this.axlString ) ;
  var wc = axl.get ( "Window/Container" ) ;
  var xCont = wc.add ( "Container", { Xonload:'*.onload()', style:"left:0px;top:0px;right:-0px;bottom:-0px;" }) ;
  var xUpl = xCont.add ( "UploadContainer",
  {
    name:'ulc'
  , style:"left:0px;top:0px;right:-0px;bottom:-0px;"
  , "top-line-text":this.topText
  , "button-upload-text":this.buttonUploadText
  , "task-name":this.taskName
  , "send-async":this.send_async
  , "multiple":this.multiple
  , "show-cancel":this.show_cancel
  , "show-close":this.show_close
  }
  ) ;
  this.setAxl ( axl ) ;
  TWindow.prototype.create.apply ( this, arguments ) ;
  this._UploadContainer = this.getPeer ( "ulc" ) ;
  this._UploadContainer.setTaskName ( this.taskName ) ;
  this._UploadContainer.setMsgXmlData ( this._msgXmlData ) ;
  this._UploadContainer.setSendAsync ( this.send_async ) ;
  this._UploadContainer.on ( "input", this.oninput.bind ( this ) ) ;
  this._UploadContainer.on ( "import", this.onimport.bind ( this ) ) ;
  this._UploadContainer.on ( "cancel", this.oncancel.bind ( this ) ) ;
  this._UploadContainer.on ( "close", this.onclose.bind ( this ) ) ;
  this._UploadContainer.on ( "upload-success", this.onupload_success.bind ( this ) ) ;
  this._UploadContainer.on ( "upload-error", this.onupload_error.bind ( this ) ) ;
};
TUploadWindow2.prototype.oninput = function ( e ) { return this._fireEvent ( e ) ; } ;
TUploadWindow2.prototype.onimport = function ( e ) { return this._fireEvent ( e ) ; } ;
TUploadWindow2.prototype.oncancel = function ( e ) { this._fireEvent ( e ) ; this.close() ; } ;
TUploadWindow2.prototype.onclose = function ( e ) { this._fireEvent ( e ) ; this.close() ; } ;
TUploadWindow2.prototype.onupload_success = function ( e ) { return this._fireEvent ( e ) ; } ;
TUploadWindow2.prototype.onupload_error = function ( e ) { return this._fireEvent ( e ) ; } ;

TUploadWindow2.prototype._flush = function()
{
  TWindow.prototype._flush.apply ( this, arguments ) ;
  // this._uploadAttributeNames.length = 0 ;
  // this._uploadAttributeValues.length = 0 ;
  // this._uploadAttributeNames = null ;
  // this._uploadAttributeValues = null ;
  // this.actionListener = null ;
  this.flushEventMulticaster() ;
}
TUploadWindow2.prototype.getSubmitButton = function()
{
  return this.getImportButton() ;
};
TUploadWindow2.prototype.getImportButton = function()
{
  return this._UploadContainer.getImportButton() ;
};
