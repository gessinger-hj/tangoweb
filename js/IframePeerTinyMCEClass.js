var IframePeerTinyMCEClass = function ( theTinyMCE )
{
  this.jsClassName = "IframePeerTinyMCEClass" ;
  this.tinyMCE = theTinyMCE ;
  this.theBodyContainer = null ;
  this.theContainer = null ;
  this.theTextArea = null ;
  this.doc = null ;
  this.body = null ;

  this.firstResized = true ;
  this.editorId = "THE.TEXTAREA" ;
  this.actionListener = [] ;
  this._flushed = false ;
  this.onChangeVeto = false ;
  this.onSaveContentVeto = false ;
  this.propertyChangeHandler = new PropertyChangeHandler() ;
  this._changed = false ;
}
IframePeerTinyMCEClass.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;

  this.tinyMCE = null ;
  this.theBodyContainer = null ;
  this.theContainer = null ;
  this.theTextArea = null ;
  this.body.jsPeer = null ;
  this.body = null ;
  for ( var i = 0 ; i < this.actionListener.length ; i++ )
  {
    this.actionListener[i].flush() ;
  }
  this.actionListener.length = 0 ;
  this.actionListener = null ;
  this.propertyChangeHandler.flush() ;
  this.propertyChangeHandler = null ;
}
IframePeerTinyMCEClass.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
}
IframePeerTinyMCEClass.prototype.onload = function(id)
{
  TSys.createLOG = true ;

  this.doc = document ;
  this.body = document.getElementsByTagName ( 'body' )[0] ;
  this.body.jsPeer = this ;

  if ( typeof ( opera ) != 'undefined' )
  {
    this.body.onresize = iframeResizeHandler ;
  }
  if ( typeof ( opera ) == 'undefined' )
  {
    window.onresize = iframeResizeHandler ;
  }
  var self = this ;
  this.tinyMCE.init({
  // General options
  mode : "none",
  theme : "advanced",
  plugins : "safari,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,iespell,inlinepopups,insertdatetime,preview,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras",

  // Theme options
  theme_advanced_buttons1 : "save,|,bold,italic,underline,strikethrough,removeformat,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect",
  theme_advanced_buttons2 : "bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,cleanup,|,insertdate,inserttime,preview,|,forecolor,backcolor,sub,sup,|,hr,nonbreaking,blockquote",
  theme_advanced_buttons3 : "",
//  theme_advanced_buttons2 : "search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,cleanup,|,insertdate,inserttime,preview,|,forecolor,backcolor",
//  theme_advanced_buttons3 : "sub,sup,|,charmap,iespell,advhr,nonbreaking,blockquote,pagebreak",
//  theme_advanced_buttons1 : "save,Xnewdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,Xstyleselect,formatselect,fontselect,fontsizeselect",
//  theme_advanced_buttons2 : "Xcut,Xcopy,Xpaste,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,X|,Xlink,Xunlink,Xanchor,cleanup,|,insertdate,inserttime,preview,|,forecolor,backcolor",
//  theme_advanced_buttons3 : "Xtablecontrols,X|,Xhr,Xremoveformat,Xvisualaid,X|,sub,sup,|,charmap,iespell,advhr",
//  theme_advanced_buttons4 : "Xcite,Xabbr,Xacronym,X|,Xvisualchars,nonbreaking,blockquote,pagebreak",
  theme_advanced_toolbar_location : "top",
  theme_advanced_toolbar_align : "left",
  theme_advanced_statusbar_location : "",
  add_form_submit_trigger : 0,
  setup : function(ed) {
    ed.onChange.add(function(ed) {
            self.onChange ( ed ) ;
        });
    ed.onSaveContent.add(function(ed) {
            self.onSaveContent ( ed ) ;
        });
    }
});
/*
  this.tinyMCE.init({
    mode : "none",
    theme : "advanced",
    theme_advanced_toolbar_location : "top",
    theme_advanced_toolbar_align : "left",
    theme_advanced_resizing : true
  });
*/
  this.tinyMCE.execCommand('mceAddControl', true, this.editorId );

  this.theBodyContainer = document.getElementById ( 'THE.BODY.CONTAINER' ) ;
  this.theBodyContainer.xConstraints = new TConstraints() ;
  this.theBodyContainer.xConstraints.parseRight ( "-0" ) ;
  this.theBodyContainer.xConstraints.parseBottom ( "-0" ) ;

  this.theContainer = document.getElementById ( 'THE.CONTAINER' ) ;
  this.theContainer.xConstraints = new TConstraints() ;
  this.theContainer.xConstraints.parseRight ( "-0" ) ;
  this.theContainer.xConstraints.parseBottom ( "-0" ) ;
  this.theContainer.xConstraints.setBottomAttachComponent() ;

  this.theTextArea = document.getElementById ( this.editorId  ) ;
  this.theTextArea.xConstraints = new TConstraints() ;
  this.theTextArea.xConstraints.parseRight ( "-0" ) ;
  this.theTextArea.xConstraints.parseBottom ( "-0" ) ;

  var browserWindowSize = TGui.getBrowserWindowSize() ;
  this.theBodyContainer.style.width = browserWindowSize.width + "px" ;
  this.theBodyContainer.style.height = browserWindowSize.height + "px" ;
  TGui.layoutConstraints ( this.theBodyContainer, true ) ;

  this.body.style.margin = "0px" ;
  this.body.style.padding = "0px" ;

  this.resized ( browserWindowSize ) ;

  if ( top != window )
  {
    var iframe = top.document.getElementById ( id ) ;
    if ( iframe && iframe.parentNode && iframe.parentNode.jsPeer )
    {
      if ( iframe.parentNode.jsPeer && typeof ( iframe.parentNode.jsPeer._installIframe ) == 'function' )
      {
        iframe.parentNode.jsPeer._installIframe ( iframe, this ) ;
      }
    }
  }
}
IframePeerTinyMCEClass.prototype.resized = function ( size )
{
  var theTextArea = this.doc.getElementById ( this.editorId ) ;
  var theTextArea_tbl = this.doc.getElementById ( this.editorId + "_tbl" ) ;
  var theTextArea_ifr = this.doc.getElementById ( this.editorId + "_ifr" ) ;
  var theTextArea_parent = this.doc.getElementById ( this.editorId + "_parent" ) ;
  if ( this.firstResized && theTextArea_ifr )
  {
    this.firstResized = false ;
    theTextArea_ifr.style.height = "100%" ;
    theTextArea_ifr.style.width = "100%" ;
    theTextArea_parent.style.margin = "0px" ;
    theTextArea_parent.style.padding = "0px" ;
  }
  this.theBodyContainer.style.width = size.width + "px" ;
  this.theBodyContainer.style.height = size.height + "px" ;
  TGui.layoutConstraints ( this.theBodyContainer, true ) ;

  var theContainer_width = TGui.getComputedStyleInt ( this.theContainer, "width" ) + "px";
  var theContainer_height = TGui.getComputedStyleInt ( this.theContainer, "height" ) + "px";
  if ( theTextArea_ifr )
  {
    theTextArea_tbl.style.width = theContainer_width ;
    theTextArea_tbl.style.height = theContainer_height ;
    theTextArea_parent.style.width = theContainer_width ;
    theTextArea_parent.style.height = theContainer_height ;
    theTextArea.style.width = theContainer_width ;
    theTextArea.style.height = theContainer_height ;
  }
}
function iframeResizeHandler ( event )
{
  var browserWindowSize = TGui.getBrowserWindowSize() ;
  IframePeerTinyMCE.resized ( browserWindowSize ) ;
}

IframePeerTinyMCEClass.prototype.getEditor = function()
{
  var ed = this.tinyMCE.get ( this.editorId ) ;
  return ed ;
}
IframePeerTinyMCEClass.prototype.getText = function()
{
  var ed = this.tinyMCE.get ( this.editorId ) ;
  if ( ed )
  {
    return ed.getContent() ;
  }
  return this.theTextArea.value ;
}
IframePeerTinyMCEClass.prototype.setText = function ( str )
{
  var ed = this.tinyMCE.get ( this.editorId ) ;
  if ( ed )
  {
    ed.setContent ( str ) ;
  }
  else
  {
    this.theTextArea.value = str ;
  }
  this._changed = false ;
}
IframePeerTinyMCEClass.prototype.toggleEditor = function()
{
  if ( ! this.tinyMCE.get(this.editorId)) 
  {
    this.tinyMCE.execCommand('mceAddControl', false, this.editorId); 
  }
  else 
  {
    this.onSaveContentVeto = true ;
    this.tinyMCE.execCommand('mceRemoveControl', false, this.editorId);
  }
}
IframePeerTinyMCEClass.prototype.onChange = function ( ed )
{
  if ( this.onChangeVeto )
  {
    this.onChangeVeto = false ;
    return ;
  }
  this._changed = true ;
  var ev = new TPropertyChangeEvent ( null, "TEXT" ) ;
  ev.setPeer ( this ) ;
  ev.setOldValue ( "0" ) ;
  ev.setNewValue ( "1" ) ;
  this.propertyChangeHandler.fireEvent ( ev ) ;
}
IframePeerTinyMCEClass.prototype.onSaveContent = function ( ed )
{
  if ( this.onSaveContentVeto )
  {
    this.onSaveContentVeto = false ;
    return ;
  }
  var ev = new THtmlEditorEvent ( null, "SAVE" ) ;
  ev.setPeer ( this ) ;
  this.fireActionEvent ( ev ) ;
  this._changed = false ;
}
IframePeerTinyMCEClass.prototype.addPropertyChangeListener = function ( obj, method, propertyName )
{
  this.propertyChangeHandler.add ( obj, method, propertyName ) ;
}
IframePeerTinyMCEClass.prototype.addActionListener = function ( obj, method )
{ 
  if ( obj instanceof ( TFunctionExecutor ) ) this.actionListener.push ( obj ) ;
  else this.actionListener.push ( new TFunctionExecutor ( obj, method ) ) ;
}
IframePeerTinyMCEClass.prototype.fireActionEvent = function ( ev )
{
  for ( var i = 0 ; i < this.actionListener.length ; i++ )
  {
    this.actionListener[i].executeWithEvent ( ev ) ;
    if ( this._flushed ) break ;
  }
}
IframePeerTinyMCEClass.prototype.hasChanged = function()
{
  return this._changed ;
}
IframePeerTinyMCEClass.prototype.setChanged = function ( state )
{
  this._changed = state ? true : false ;
}
var IframePeerTinyMCE = null ;
function IframePeerTinyMCEClass_iframeLoaded(id)
{
  IframePeerTinyMCE = new IframePeerTinyMCEClass ( tinyMCE ) ;
  IframePeerTinyMCE.onload(id) ;
}
