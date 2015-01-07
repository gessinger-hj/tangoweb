/**
 *  @constructor
 *  @extends TActionEvent
 */
var THtmlEditorEvent = function ( event, actionName )
{
  Tango.initSuper ( this, TActionEvent, event, actionName ) ;
  this.jsClassName = "THtmlEditorEvent" ;
};
THtmlEditorEvent.inherits( TActionEvent ) ;
/**
 *  @constructor
 */
var THtmlEditorFactoryClass = function()
{
  this.currentPeer = null ;
  this.jsClassName = "THtmlEditorFactoryClass" ;
};
THtmlEditorFactoryClass.prototype =
{
  getAxl: function ( dom )
  {
    var xml = new TXml ( dom ) ;
    var style = xml.getAttribute ( "style" ) ;
    var name = xml.getAttribute ( "name" ) ;
    var id = xml.getAttribute ( "id" ) ;
    var x = new TXml() ;
    var xContainer = x.addXml ( "Container" ) ;
    xContainer.copyAttributesFrom ( xml ) ;
    if ( style )
    {
      style = style.trim() ;
      if ( style.charAt ( style.length-1 ) != ';' ) style += ';' ;
      xContainer.addAttribute ( "style", style ) ;
    }
    this.currentPeer = new THtmlEditor ( xml ) ;
    this.currentPeer.action = xml.getAttribute ( "action" ) ;
    this.currentPeer.onchange = xml.getAttribute ( "onchange" ) ;
    var xIframe = xContainer.add ( "iframe" ) ;
    xIframe.addAttribute ( "id", this.currentPeer.iframeId ) ;
    xIframe.addAttribute ( "name", this.currentPeer.iframeId ) ;
    xIframe.addAttribute ( "style", 'top:0px;left:0px;bottom:-0;right:-0;overflow:auto;' ) ;
    xIframe.addCDATA ( this.currentPeer.iframeString ) ;
    return x.getDom() ;
  },
  getPeer: function ( x )
  {
    return this.currentPeer ;
  }
};
var THtmlEditorFactory = new THtmlEditorFactoryClass() ;
TGui.addTagDefinition ( "HtmlEditor", THtmlEditorFactory ) ;
/**
 *  @constructor
 *  @extends TContainer
 */
var THtmlEditor = function ( axl )
{
  Tango.initSuper ( this, TComponent, null );
  this.jsClassName = "THtmlEditor" ;
  this.propertyChangeHandler = new PropertyChangeHandler() ;
  this.actionListener = [] ;
  this.iframeId = TSys.getTempId() ;
  this.iframe = null ;
  this.iframePeer = null ;
  this.title = "Html Editor" ;
  this.pendingText = null ;
  this.iframeString = ""
  +       "<html>\n"
  +       "<head>\n"
  +       "<link rel='stylesheet' type='text/css' href='Tango.css'>\n"
  +       "<script type='text/javascript' src='Tango.js' ></script>\n"
  +       "<script type='text/javascript' src='TSystem.js' ></script>\n"
  +       "<script type='text/javascript' src='IframePeerTinyMCEClass.js' ></script>\n"
  +       "<script type='text/javascript' src='tinymce/jscripts/tiny_mce/tiny_mce_src.js'></script>\n"
  +       "<script type='text/javascript' language='javascript' >\n"
  +       "</script>\n"
  +       "</head>\n"
  +       "<body onload='IframePeerTinyMCEClass_iframeLoaded(\"" + this.iframeId + "\")'>\n"
  +       "<span id='THE.BODY.CONTAINER' style='position:absolute;top:0px;left:0px;margin:0px;padding:0px;' >\n"
  +       "  <span id='THE.CONTAINER' style='position:absolute;top:0px;left:0px;margin:0px;padding:0px;' >\n"
  +       "    <textarea id='THE.TEXTAREA' name='content' style='position:absolute;width:100%;height:100%;margin:0px;border:0px;' >\n"
  +       "    </textarea>\n"
  +       "  </span>\n"
  +       "</span>\n"
  +       "</body>\n"
  +       "</html>\n"
  ;
};
THtmlEditor.inherits( TComponent ) ;
THtmlEditor.prototype.getValue = function ( xml )
{
  var n = this.getName() ;
  if ( n )
  {
    xml.addCDATA ( n, this.getText() ) ;
  }
};
THtmlEditor.prototype.setValues = function ( xml )
{
  var x = xml.getXml ( this.getName() ) ;
  if ( ! x ) return ;
  var str = xml.getContent ( this.getName() ) ;
  this.setText ( str ) ;
};
THtmlEditor.prototype.getIframePeer = function()
{
  if ( this.iframePeer ) return this.iframePeer ;
  this.iframe = document.getElementById ( this.iframeId ) ;
  if ( ! this.iframe ) return null ;
  for ( var i = 0 ; i < 5 ; i++ )
  {
    if ( this._getIframePeer() ) return this.iframePeer ;
  }
  return this.iframePeer ;
}
THtmlEditor.prototype._installIframe = function ( iframe, iframePeer )
{
  if ( this.iframePeer ) return ;
  this.iframe = iframe ;
  this.iframePeer = iframePeer ;
  this.iframePeer.addActionListener ( this, this.actionPerformed ) ;
  this.iframePeer.addPropertyChangeListener ( this, this.propertyChange ) ;
}
THtmlEditor.prototype._getIframePeer = function()
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
THtmlEditor.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  this.iframe = document.getElementById ( this.iframeId ) ;
  if ( this.action )
  {
    this.addActionListener ( new TFunctionExecutor ( this.action, layoutContext ) ) ;
  }
  if ( this.onchange )
  {
    this.addPropertyChangeListener ( new TFunctionExecutor ( this.onchange, layoutContext ) ) ;
  }
}
THtmlEditor.prototype.resized = function ( size )
{
  if ( ! this.getIframePeer() ) return ;
}
THtmlEditor.prototype.onload = function()
{
  this.getIframePeer() ;
  if ( this.pendingText )
  {
    this.setText ( this.pendingText ) ;
    this.pendingText = null ;
  }
}
THtmlEditor.prototype.addToListenerContext = function ( listenerContext )
{
  listenerContext.addPropertyChangeListenerTo ( this ) ;
}
THtmlEditor.prototype.flush = function()
{
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
}
THtmlEditor.prototype.setText = function ( str )
{
  if ( ! this.getIframePeer() )
  {
    this.pendingText = str ;
    return ;
  }
  this.iframePeer.setText ( str ) ;
}
THtmlEditor.prototype.insertText = function ( text )
{
  if ( ! this.getIframePeer() ) return ;
  var ed = this.iframePeer.getEditor() ;
  ed.execCommand('mceInsertContent', false, text);
}
THtmlEditor.prototype.getText = function()
{
  if ( ! this.getIframePeer() ) return "" ;
  return this.iframePeer.getText() ;
}
THtmlEditor.prototype.toggleEditor = function()
{
  if ( ! this.getIframePeer() ) return ;
  return this.iframePeer.toggleEditor() ;
}
THtmlEditor.prototype._setChanged = function ( state )
{
  if ( this._flushed ) return ;
  state = state ? true : false ;
  this.getIframePeer().setChanged ( state ) ;
}
THtmlEditor.prototype.addActionListener = function ( obj, method )
{ 
  if ( obj instanceof ( TFunctionExecutor ) ) this.actionListener.push ( obj ) ;
  else this.actionListener.push ( new TFunctionExecutor ( obj, method ) ) ;
}
THtmlEditor.prototype.addPropertyChangeListener = function ( obj, method, propertyName )
{
  this.propertyChangeHandler.add ( obj, method, propertyName )
}
THtmlEditor.prototype.propertyChange = function ( ev )
{
  this.propertyChangeHandler.fireEvent ( ev ) ;
  if ( ev.getPropertyName() == 'TEXT' )
  {
    this._setChanged ( true ) ;
  }
}
THtmlEditor.prototype.actionPerformed = function ( ev )
{
  this.fireActionEvent ( ev ) ;
}
THtmlEditor.prototype.fireActionEvent = function ( ev )
{
  for ( var i = 0 ; i < this.actionListener.length ; i++ )
  {
    this.actionListener[i].executeWithEvent ( ev ) ;
    if ( this._flushed ) break ;
  }
}
THtmlEditor.prototype.hasChanged = function()
{
  if ( ! this.getIframePeer() ) return false ;
  return this.getIframePeer().hasChanged() ;
}
