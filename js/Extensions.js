/*
CalypsoClass.prototype.getInputStreamFromArgs0 = function ( msg )
{
  msg = new CoMessage ( "FILE.RESSOURCE" ) ;
  msg.setReturnFromArgs ( true ) ;
  msg.setXmlData ( "<FILE.RESSOURCE.REQUEST><Operation>GetFile</Operation><File>promo_tour_image20080609.png</File></FILE.RESSOURCE.REQUEST>" ) ;
//log ( msg ) ;

msg = new CoMessageFileRessource ( "GetFile", "promo_tour_image20080609.png" ) ;
var sMsg = msg.toString() ;
sMsg = encodeURIComponent ( sMsg ) ;
//log ( msg ) ;
    var url = this.tsActionServletName + "?coAction=GetInputStream&msg=" + sMsg ;
    var HTTP = TSys.getHttpRequestObject() ;
//log ( url ) ;
    HTTP.open ( "GET", url, false ) ;
//log ( "1 --------------" ) ;
    HTTP.send(url) ;
//log ( "2 --------------" ) ;
    if ( HTTP.status != 200 )
    {
//log ( "HTTP.status: " + HTTP.status ) ;
    var t = TSys.createHttpStatusText ( HTTP ) ;
//      TSys.throwHttpStatusException ( HTTP ) ;
//log ( t ) ;
return ;
    }
//log ( HTTP.responseText ) ;
  };
*/
function log ( text, full )
{
  if ( ! text )
  {
    TSys.debug ( text, full ) ;
    return ;
  }
  if ( typeof ( text.type ) == 'string' && typeof ( text.shiftKey ) == 'boolean' )
  {
    TSys.debug ( new TEvent ( text ) ) ;
  }
  else
  if ( text && typeof ( text.type ) == 'object' && typeof ( text.nodeType ) == 'number' )
  {
    TSys.debug ( new TXml ( text ) ) ;
  }
  else
  {
    TSys.debug ( text, full ) ;
  }
}
/**
 *  @constructor
 *  Global singleton <b>SystemNotifications</b>
 */
SystemNotificationsClass = function()
{
  this.jsClassName = "SystemNotificationsClass" ;
  this.me = null ;
  this.list = [] ;
};
SystemNotifications = new SystemNotificationsClass() ;
SystemNotificationsClass.prototype.progress = function ( str )
{
  var p = null ;
  if ( ! str ) str = "... in progress" ;
  if ( typeof ( str ) == 'string' )
  {
    p = { text: str, progress:true } ;
  }
  else
  if ( typeof ( str ) == 'object' )
  {
    p = str ;
    p.progress = true ;
  }
  else
  {
    p = { text: "" + str, progress:true } ;
  }
  this.notify ( p ) ;
}
SystemNotificationsClass.prototype.notify = function ( str )
{
  if ( this.me )
  {
    this._remove_me() ;
  }
  var p = null ;
  if ( ! str ) str = "Notification" ;
  if ( typeof ( str ) == 'string' )
  {
    p = { text: str } ;
  }
  else
  if ( typeof ( str ) == 'object' )
  {
    p = str ;
  }
  else
  {
    p = { text: "" + str } ;
  }
  this._showMessage ( p ) ;
}
SystemNotificationsClass.prototype.remove_me = function()
{
  if ( ! this.me ) return ;
  var me = this.me ;
  this.me = null ;
  $(me).stop(true).animate({opacity: 0}, 1000, 'linear').queue(function() {
    TGui.flushAttributes ( me, true ) ;
    me.parentNode.removeChild ( me ) ;
  });
}
SystemNotificationsClass.prototype._remove_me = function()
{
  if ( ! this.me ) return ;
  TGui.flushAttributes ( this.me, true ) ;
  this.me.parentNode.removeChild ( this.me ) ;
  this.me = null ;
}
SystemNotificationsClass.prototype._showMessage = function ( p )
{
  if ( ! p.icon )
  {
    p.icon = "Tango/Alert/info" ;
    p.icon_width = "32" ;
    p.icon_height = "32" ;
  }
  else
  {
    if ( ! p.icon_width ) p.icon_width = p.icon_height ;
    if ( ! p.icon_width ) p.icon_width = "16" ;
    if ( ! p.icon_height ) p.icon_height = p.icon_width ;
  }
  if ( ! p.text ) p.text = "Notification..." ;
  var t = p.text.replace ( /\n/g, "<br/>" ) ;
  var a = t.split ( "<br\/>" ) ;

  var ins = new Insets ( 8, 8, 8, 8 ) ;
  var pad = new Padding() ;
  if ( ! pad.top ) pad.top = ins.top + 2 ;
  if ( ! pad.left ) pad.left = ins.left + 2 ;
  if ( ! pad.bottom ) pad.bottom = ins.bottom + 2 ;
  if ( ! pad.right ) pad.right = ins.right + 2 ;
  var deco="{ src: 'rounded-box-black-70.png', type:'sliced'"
          + ", border: { top:"+ins.top+", left:"+ins.left+", bottom:"+ins.bottom+", right:"+ins.right+" }"
          + ", padding: { top:"+pad.top+", left:"+pad.left+", bottom:"+pad.bottom+", right:"+pad.right+" } }" ;

  var xe = null ;

  var axl = new TXml() ;
  var xCont = axl.add ( "Container" ) ;
  xCont.addAttribute ( "decoration", deco ) ;
  xCont.addAttribute ( "style", "color:white;top:10px;right:20px;") ;

  var xCont1 = xCont.add ( "Container" ) ;
  xCont1.addAttribute ( "style", "padding:0px;left:0px;right:-0px;") ;

  var xLeft = xCont1.add ( "Container" ) ;
  xLeft.addAttribute ( "style", "padding:0px;left:0px;top:0px;bottom:-0px;") ;

  xe = xLeft.add ( "img" ) ;
  xe.addAttribute ( "src", p.icon ) ;
  xe.addAttribute ( "style", "width:" + p.icon_width + "px;height:" + p.icon_height + "px;") ;

  var xRight = xCont1.add ( "Container" ) ;
  xRight.addAttribute ( "style", "padding:0px;top:0px;bottom:-0px;right:-0px;") ;

  var first = true ;
  if ( p.progress )
  {
    xe = xRight.add ( "img" ) ;
    xe.addAttribute ( "src", "throbber-white-on-black-small.gif") ;
    xe.addAttribute ( "style", "width:16px;height:16px;") ;
  }
  for ( var i = 0 ; i < a.length ; i++ )
  {
    if ( first )
    {
      first = false ;
      xe = xRight.add ( "Label" ) ;
      xe.addAttribute ( "text", a[i] ) ;
      xe.addAttribute ( "style", "font-weight:bold;") ;
    }
    else
    {
      xRight.add ( "br" ) ;
      xe = xRight.add ( "Label" ) ;
      xe.addAttribute ( "text", a[i] ) ;
    }
  }

  var m = TGui.getMain() ;
  this.me = TGui.createElement ( axl, m ) ;

  m.appendChild ( this.me ) ;
  var mc = new TContainer ( m ) ;
  var mcsize = mc.getSize() ;
  var mec = new TContainer ( this.me ) ;
  var mecsize = mec.getSize() ;

  var x = mcsize.width - mecsize.width - 20 ;
  mec.setLocation ( x, 10 ) ;
  this.me.style.zIndex = TGui.zIndexWindowAlwaysOnTop - 2 ;
//  this.me.style.visibility = "visible" ;
//alert($(this.me).html());
  $(this.me).css({opacity: 0, display: 'block'}).stop(true).animate({opacity: 1}, 1000, 'linear') ;
  mec.addEventListener ( "click", this, this.remove_me ) ;
}

/**
 *  @constructor
 */
AceEditorFactoryClass = function()
{
  this.currentPeer = undefined ;
} ;
AceEditorFactoryClass.prototype =
{
  getAxl: function ( dom )
  {
    var xml = new TXml ( dom ) ;
    var axl = TSys.parseXml ( "<xml><Container></Container></xml>" ) ;
    var c = axl.getXml ( "Container" ) ;
    var modeId = xml.getAttribute ( "mode", "text" ) ;
    c.copyAttributesFrom ( xml ) ;
    var st = xml.getAttribute ( "style" ) ;
    if ( ! st ) st = "" ;
    st = st.trim() ;
    if ( st.length && st.charAt ( st.length-1 ) != ';' ) st += ';' ;
    st += "padding:0px;" ;
    c.addAttribute ( "style", st ) ;

    this.currentPeer = new AceEditor() ;
    this.currentPeer.modeId = modeId ; //"javascript" ;
    this.currentPeer.text = xml.getContent() ;
    return axl.getDom() ;
  },
  flush: function()
  {
  },
  getPeer: function()
  {
    return this.currentPeer ;
  }
}
var AceEditorFactory = new AceEditorFactoryClass() ;
TGui.addTagDefinition ( "AceEditor", AceEditorFactory ) ;
/**
 *  @constructor
 */
var AceEditor = function()
{
  Tango.initSuper ( this, TComponent );
  this.jsClassName = "AceEditor" ;
  this.first = true ;
  Tango.mixin ( EventMulticasterTrait, this ) ;
  this.file ;
  this.modeId = "text" ;
} ;
AceEditor.inherits ( TComponent ) ;
AceEditor.prototype._modes = [] ;
AceEditor.prototype._inv_modes = [] ;
AceEditor.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  this.flushEventMulticaster() ;
};
AceEditor.prototype.getMode = function()
{
  return this.modeId ;
};
AceEditor.prototype.setMode = function ( mode )
{
  var m = this._modes[mode] ;
  if ( ! m )
  {
		m = this._inv_modes[mode] ;
	}
	if ( ! m )
	{
    var rm = require("ace/mode/" + mode );
		if ( ! rm )
		{
			var thiz = this ;
  		var jsf = this.getBaseUrl() + "mode-" + mode + ".js" ;
			this.include ( jsf, function()
			{
    		var rm = require("ace/mode/" + mode );
    		var m2 = new rm.Mode() ;
    		thiz._modes[mode] = m2 ;
        thiz.modeId = mode ;
        thiz._setMode ( m2 ) ;
      }
      , function()
      {
        var rm = require("ace/mode/text" );
        var m2 = new rm.Mode() ;
        thiz._modes[mode] = m2 ;
        thiz.modeId = mode ;
        thiz._setMode ( m2 ) ;
      }) ;
      return ;
    }
    m = new rm.Mode() ;
    this._modes[mode] = m ;
  }
  this.modeId = mode ;
	this._setMode ( m ) ;
} ;
AceEditor.prototype.include = function ( scriptName, callback, onerr )
{
	var href = scriptName ;
	var en;
	if ( scriptName.endsWith ( ".css" ) )
	{
		en = new TXEnum ( document.getElementsByTagName('head')[0], 'link' ) ;
		var link = document.createElement ( 'link' ) ;
		link.rel = 'stylesheet'; 
		link.type = 'text/css'; 
		link.href = href ;
		if ( link.onreadystatechange !== undefined )
		{
			link.onreadystatechange = function()
			{
				if ( link.readyState == 'complete' )
				{
					callback.call();
				}
			};
		}
		else
		{
			link.onload = function()
			{
        callback.call();
      };
      link.onerror = function()
      {
				callback.call();
				// onerr.call();
			};
		}
		
		document.getElementsByTagName('head')[0].appendChild(link); 
		return ;
	}
	var script = document.createElement ( 'script' ) ; 
	script.type = 'text/javascript'; 
	script.src = href ;
	if ( script.onreadystatechange !== undefined )
	{
		script.onreadystatechange = function()
		{
			if ( script.readyState == 'complete' )
			{
				callback.call();
			}
		 };
	}
	else
	{
		script.onload = function()
		{
      callback.call();
    };
    script.onerror = function()
    {
			callback.call();
			// onerr.call();
		};
	}
	document.getElementsByTagName('head')[0].appendChild(script); 
};
AceEditor.prototype._setMode = function ( m )
{
  if ( !this.EditSession )
  {
    this.EditSession = require("ace/edit_session").EditSession;
    this.UndoManager = require("ace/undomanager").UndoManager;
  }
  this.editor.getSession().removeEventListener("change", this.$onDocumentChange);
  this.editor.getSession().removeEventListener("changeAnnotation", this.$onChangeAnnotation);
  var t = this.getText() ;
  var es = new this.EditSession ( t  ) ;
  es.setTabSize(2);
  es.setMode(m);
  es.setUndoManager(new this.UndoManager());
  this.editor.setSession ( es ) ;
  this.editor.getSession().addEventListener("change", this.$onDocumentChange);
  this.editor.getSession().addEventListener("changeAnnotation", this.$onChangeAnnotation);
} ;
AceEditor.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  this.tempId = TSys.getTempId() ;
  this.dom.id = this.tempId ;
  this.dom.xClassName = "AceEditor" ;
};
AceEditor.prototype.getBaseUrl = function()
{
	return this.baseUrl ;
};
AceEditor.prototype.resized = function ( size )
{
  if ( this.first )
  {
    var en = new TXEnum ( document.getElementsByTagName("head")[0], "script" ) ;
    while ( en.hasNext() )
    {
      var d = en.next() ;
			if ( d.src && d.src.endsWith ( "/ace.js" ) )
			{
        var str = "" + document.location ;
        this.baseUrl = d.src.substring ( str.length, d.src.indexOf ( "ace.js" ) ) ;
				break ;
			}
    }
    this.first = false ;
    this.editor = ace.edit( this.tempId );
    this.editor.renderer.setShowPrintMargin ( false ) ;
    // this.editor.setTheme("ace/theme/textmate");
    // this.editor.setTheme("ace/theme/cobalt");
    var theme = TSys.getPreferenceValue ( "AceTheme", "xcode" ) ;

    this.setTheme ( theme ) ;
    var modeClass = require ( "ace/mode/" + this.modeId ).Mode;
    var mode = new modeClass() ;
    this.editor.getSession().setMode( mode );
    this.editor.getSession().setValue ( this.text ) ;
    this.$onDocumentChange = this.onDocumentChange.bind(this);
    this.editor.getSession().addEventListener("change", this.$onDocumentChange);
    this.$onChangeAnnotation = this.onChangeAnnotation.bind(this);
    this.editor.getSession().addEventListener("changeAnnotation", this.$onChangeAnnotation);
  }
  this.editor.resize() ;
};
AceEditor.prototype.getValue = function ( x )
{
  x.addCDATA ( this.getName(), this.editor.getSession().getValue() ) ;
};
AceEditor.prototype.setValue = function ( x )
{
  var e = x.get ( this.getName() ) ;
  if ( ! e ) return ;
  this.setText ( e.getContent() ) ;
};
AceEditor.prototype.getText = function()
{
  return this.editor.getSession().getValue() ;
};
AceEditor.prototype.getFile = function()
{
  return this.file ;
};
AceEditor.prototype.setFile = function ( file )
{
  this.file =file ;
  this.directory = file.getParentFile() ;
  this.setModeFromFile ( file ) ;
};
AceEditor.prototype.getDirectory = function()
{
  return this.directory ;
};
AceEditor.prototype.setText = function ( t )
{
  this.clear() ;
  if ( t instanceof File )
  {
    this.setTextFromFile ( t ) ;
    return ;
  }
  if ( t )
  {
    t = t.replace ( /\[##\]/g, "]]" ) ;
  }
  this.editor.getSession().setValue ( t ) ;
  this.editor.resize() ;
  this.editor.focus() ;
};
AceEditor.prototype.setModeFromFile = function ( file )
{
  var mode = "text" ;
  var name = file.getName() ;
  name = name.toLowerCase() ;
  if ( name.endsWith ( ".js" ) ) mode = "javascript" ;
  if ( name.endsWith ( ".c" ) ) mode = "c_cpp" ;
  if ( name.endsWith ( ".h" ) ) mode = "c_cpp" ;
  if ( name.endsWith ( ".cpp" ) ) mode = "c_cpp" ;
  if ( name.endsWith ( ".hpp" ) ) mode = "c_cpp" ;
  if ( name.endsWith ( ".C" ) ) mode = "c_cpp" ;
  if ( name.endsWith ( ".H" ) ) mode = "c_cpp" ;
  if ( name.endsWith ( ".java" ) ) mode = "java" ;
  if ( name.endsWith ( ".xml" ) ) mode = "xml" ;
  if ( name.endsWith ( ".axl" ) ) mode = "xml" ;
  if ( name.endsWith ( ".xsd" ) ) mode = "xsd" ;
  if ( name.endsWith ( ".xsl" ) ) mode = "xsl" ;
  if ( name.endsWith ( ".html" ) ) mode = "html" ;
  if ( name.endsWith ( ".htm" ) ) mode = "html" ;
  if ( name.endsWith ( ".css" ) ) mode = "css" ;
  if ( name.endsWith ( ".scala" ) ) mode = "scala" ;
  if ( name.endsWith ( ".sql" ) ) mode = "sql" ;
  if ( name.endsWith ( ".json" ) ) mode = "json" ;
  if ( name.endsWith ( ".php" ) ) mode = "php" ;
  if ( name.endsWith ( ".coffee" ) ) mode = "coffee" ;
  if ( name.startsWith ( "makefile" ) ) mode = "makefile" ;
  if ( name.endsWith ( ".pl" ) ) mode = "perl" ;
  if ( name.endsWith ( ".pm" ) ) mode = "perl" ;
  if ( name.endsWith ( ".phy" ) ) mode = "python" ;
  if ( name.endsWith ( ".py" ) ) mode = "python" ;
  if ( name.endsWith ( ".rb" ) ) mode = "ruby" ;
  if ( name.endsWith ( ".sh" ) ) mode = "sh" ;
  if ( name.endsWith ( ".ini" ) ) mode = "sh" ;
  if ( name.endsWith ( ".tcl" ) ) mode = "tcl" ;
  if ( name.endsWith ( ".vbs" ) ) mode = "vbscript" ;
  if ( name.endsWith ( ".pgsql" ) ) mode = "pgsql" ;
  this.setMode ( mode ) ;
};
AceEditor.prototype.setTextFromFile = function ( file )
{
  this.setModeFromFile ( file ) ;
  var t = file.getTextTransparent() ;
  this.setText ( t ) ;

  this.file = file ;
  this.directory = file.getParentFile() ;
};
AceEditor.prototype.clear = function ( t )
{
  this.editor.getSession().setValue ( "" ) ;
  this.file = null ;
};
AceEditor.prototype.gotoLine = function ( n )
{
  if ( typeof ( n ) == 'string' ) n = parseInt ( n ) ;
  if ( isNaN ( n ) ) n = 0 ;
  this.editor.gotoLine ( n, 0 ) ;
  return this.getCurrentLineNumber() ;
};
AceEditor.prototype.getCurrentLineNumber = function()
{
  var l = this.editor.getCursorPosition();
  if ( ! l ) return 0 ;
  return l["row"] + 1 ;
};
AceEditor.prototype.find = function ( pattern, backwards, regex )
{
  if ( ! pattern ) return ;
  this.editor.find ( pattern, {
  backwards: !! backwards,
  wrap: true,
  caseSensitive: false,
  wholeWord: false,
  regExp: !! regex
  });
};
AceEditor.prototype.findPrevious = function()
{
  this.editor.findPrevious() ;
};
AceEditor.prototype.findNext = function()
{
  this.editor.findNext() ;
};
AceEditor.prototype.getTheme = function()
{
  return this._currentTHEME ;
};
AceEditor.prototype.setTheme = function ( event )
{
  if ( typeof ( event ) === 'string' )
  {
    this._currentTHEME = event ;
    this.editor.setTheme ( "ace/theme/" + event ) ;
    return ;
  }
  var ev = $E(event) ;
  var theme = ev.getComponent().getSelectedItem() ;
  this._currentTHEME = theme ;
  this.editor.setTheme ( "ace/theme/" + theme ) ;
};
AceEditor.prototype.setFontSize = function ( event )
{
	var ev = $E(event) ;
	var size = parseInt(ev.getComponent().getSelectedItem()) ;
  this.editor.setFontSize ( size ) ;
};
AceEditor.prototype.onDocumentChange = function ( e )
{
/*
        var delta = e.data;
        var range = delta.range;
*/
  var ev = new TEvent() ;
  ev.setHtmlSource ( this.dom ) ;
  ev.setPeer ( this ) ;
  this._fireEvent ( ev, "change" ) ;
};
AceEditor.prototype.onChangeAnnotation = function()
{
  var ev = new TEvent() ;
  ev.setHtmlSource ( this.dom ) ;
  ev.setPeer ( this ) ;
  this._fireEvent ( ev, "changeAnnotation" ) ;
//        this.renderer.setAnnotations(this.session.getAnnotations());
};
AceEditor.prototype.getSession = function()
{
  return this.editor.getSession() ;
};
AceEditor.prototype.getAnnotations = function()
{
  var s = this.getSession() ;
  return s.getAnnotations() ;
};
AceEditor.prototype.getNumberOfAnnotations = function()
{
/*
    var m = s.getMarkers() ;
*/
  var s = this.getSession() ;
  var m = s.getAnnotations() ;
  if ( ! m ) return 0 ;
  var n = 0 ;
  for ( var key in m )
  {
    n++ ;
  }
  return n ;
} ;
function $E ( event ) { return new TEvent ( event ) ; }
function $V ( event ) { return new TEvent ( event ).getValues() ; }
function $C ( event, name ) { return name ? new TEvent ( event ).getContainer().getComponent ( name ) : new TEvent ( event ).getContainer() ; }


DocumentEditor = function ( )
{
  this.jsClassName = "DocumentEditor" ;
  this.container ;
  Tango.mixin ( EventMulticasterTrait, this ) ;
  this._temporaryTHEME = "" ;
  this._showErrorTable = false ;
};
DocumentEditor.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
};
DocumentEditor.prototype.setShowErrorTable = function ( state )
{
  this._showErrorTable = !! state ;
}
DocumentEditor.prototype.isShowErrorTable = function()
{
  return this._showErrorTable ;
}
DocumentEditor.prototype.__save = function ( ev )
{
  if ( ev.isShift() ) this.saveAs ( ev.getEvent() ) ;
  else
  if ( this._DocumentChanged ) this.save ( ev.getEvent() ) ;
};
DocumentEditor.prototype.__close = function ( ev )
{
  this.close ( ev.getEvent() ) ;
};
DocumentEditor.prototype.onload = function ( ev )
{
  this.container = ev.getContainer() ;
  this.editor = this.container.getComponent ( "EDITOR" ) ;
  this.editor.addListener ( this, this._onDocumentChange, "change" ) ;
  this.editor.addListener ( this, this._onChangeAnnotation, "changeAnnotation" ) ;
  this.TABLE_ERRORS = this.container.getPeer ( "TABLE_ERRORS" ) ;
  this.TF_gotoLine = this.container.getComponent ( "TF_gotoLine" ) ;
  this.TF_pattern = this.container.getComponent ( "TF_pattern" ) ;
  this.TB_saveText = this.container.getComponent ( "TB_saveText" ) ;
  this.TB_saveAs = this.container.getComponent ( "TB_saveAs" ) ;
  this.TB_closeDocumentEditor = this.container.getComponent ( "TB_closeDocumentEditor" ) ;
  this.L_name = this.container.getComponent ( "L_name" ) ;
  this.SB1 = this.container.getComponent ( "SB1" ) ;
  this.showErrorTable ( false ) ;
  this.w = ev.getWindow() ;
  if ( this.w )
  {
    this.w.addWindowListener ( this, this.closeWindow ) ;
  }
  this.choiceButton = this.container.getComponent ( "THEME" ) ;
  var theme = TSys.getPreferenceValue ( "AceTheme", "xcode" ) ;
  this._showErrorTable = TSys.getPreferenceValueBool ( "ShowErrorTable", this._showErrorTable ) ;

  this.choiceButton.select ( theme ) ;
  var thiz = this ;
  TGlobalEventHandler.addToShortCutList ( 'S', this.container.getDom(), new TFunctionExecutor ( function(ev)
  {
    thiz.__save ( ev ) ;
  })) ;
  TGlobalEventHandler.addToShortCutList ( 'W', this.container.getDom(), new TFunctionExecutor ( function(ev)
  {
    thiz.__close ( ev ) ;
  })) ;
};
DocumentEditor.prototype.showErrorTable = function ( state )
{
  if ( ! this._showErrorTable )
  {
    state = false ;
  }
  if (  state && this.TABLE_ERRORS.dom.style.display.toUpperCase() != 'NONE' )
  {
    return ;
  }
  if ( !state && this.TABLE_ERRORS.dom.style.display.toUpperCase() == 'NONE' )
  {
    return ;
  }

  var constraintsEditor = this.editor.dom.xConstraints ;
  var parentNode = new TComponent ( this.editor.dom.parentNode ) ;
  var editorSize ;
  if ( this.TABLE_ERRORS.dom.style.display.toUpperCase() == 'NONE' )
  {
    this.SB1.dom.style.display            = '' ;
    this.TABLE_ERRORS.dom.style.display   = '' ;
    constraintsEditor.bottomAttach        = undefined ;
    constraintsEditor.bottomMinus         = undefined ;
    constraintsEditor.bottomValue         = undefined ;
    this.editor.setSize ( this.editor.size0 ) ;
  }
  else
  {
    this.editor.size0 = this.editor.getSize() ;
    this.SB1.dom.style.display = 'NONE' ;
    this.TABLE_ERRORS.dom.style.display = 'NONE' ;
    constraintsEditor.bottomAttach = true ;
    constraintsEditor.bottomMinus = true ;
    constraintsEditor.bottomValue = 0 ;
  }
  TGui.layoutConstraints ( parentNode.dom ) ;
};
DocumentEditor.prototype.gotoLine = function ( event )
{
  var n = parseInt ( this.TF_gotoLine.getText() ) ;
  if ( isNaN ( n ) ) return ;
  this.editor.gotoLine ( this.TF_gotoLine.getText() ) ;
  var cln = this.editor.getCurrentLineNumber() ;
  if ( n != cln )
  {
    this.TF_gotoLine.setText ( cln ) ;
  }
};
DocumentEditor.prototype.gotoLineFromTable = function ( event )
{
  var ev = new TEvent ( event ) ;
  var ud = this.TABLE_ERRORS.getSelectedUserXml() ;
  if ( ! ud ) return ;
  var linn = ud.getInt ( "LINE" ) ;
  this.editor.gotoLine ( linn ) ;
};
DocumentEditor.prototype.find = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( ev.isEnter() )
  {
    if ( ev.isShift() ) this.findPrevious ( event ) ;
    else                this.findNext ( event ) ;
    return ;
  }
  var n = parseInt ( this.TF_pattern.getText() ) ;
  this.editor.gotoLine ( 0 ) ;
  this.editor.find ( this.TF_pattern.getText() ) ;
} ;
DocumentEditor.prototype.findNext = function ( event )
{
  this.editor.findNext() ;
} ;
DocumentEditor.prototype.findPrevious = function ( event )
{
  this.editor.findPrevious() ;
} ;
DocumentEditor.prototype.setTheme = function ( event )
{
  this._temporaryTHEME = "" ;
  this.editor.setTheme ( event ) ;
} ;
DocumentEditor.prototype.onopen_THEME_ChoiceButton = function ( ev )
{
  var choiceButton = ev.getComponent() ;
  var pane = ev.getMenu() ;
  var thiz = this ;
  this._currentTHEME = this.editor.getTheme() ;
  thiz._temporaryTHEME = "" ;
  pane.addEventListener ( "mouseover", function ( e )
  {
    var ee = new TEvent ( e ) ;
    var p = ee.getPeer() ;
    if ( p instanceof MenuItem && p.jsClassName === "MenuItem" )
    {
      var n = p.getName() ;
      if ( n == thiz._temporaryTHEME )
      {
        return ;
      }
      thiz._temporaryTHEME = n ;
      var v = choiceButton._valueList[ parseInt ( n ) ] ;
      if ( v )
      {
        thiz.editor.setTheme ( v ) ;
      }
    }
  } ) ;
} ;
DocumentEditor.prototype.onclose_THEME_ChoiceButton = function ( ev )
{
  if ( this._temporaryTHEME )
  {
    this.editor.setTheme ( this._currentTHEME ) ;
  }
} ;
DocumentEditor.prototype.setFontSize = function ( event )
{
  this.editor.setFontSize ( event ) ;
} ;
DocumentEditor.prototype.openWithFileChooser = function ( event )
{
  if ( this._DocumentChanged )
  {
    var thiz = this ;
    var d = new TUserDialog ( "WindowDataAreChangedDiscard" ) ;
    d.askYesNo ( function ( answer )
    {
      if ( ! answer.isYes() ) return ;
      thiz._DocumentChanged = false ;
      thiz._openWithFileChooser() ;
    } ) ;
    return ;
  }
  this._openWithFileChooser() ;
};
DocumentEditor.prototype._openWithFileChooser = function ( event )
{
  var directory = this.editor.getDirectory() ;
  var f ;
  if ( ! directory )
  {
    f = new File ( new LsProxy() ) ;
  }
  else
  {
    f = directory ;
  }
  var thiz = this ;
  var d = new TFileChooser ( f ) ;
  d.addListener ( function(e)
  {
    var file = e.getItem() ;
    e.getWindow().close() ;
    thiz.editFile ( file ) ;
  }, "action-file");
  d.openFile() ;
} ;
DocumentEditor.prototype.saveAs = function ( event )
{
  var directory = this.editor.getDirectory() ;
  var file = this.editor.getFile() ;
  var fName = "" ;
  if ( file ) fName = file.getName() ;
  var f ;
  if ( ! directory )
  {
    f = new File ( new LsProxy() ) ;
  }
  else
  {
    f = directory ;
  }
  var thiz = this ;
  var d = new TFileChooser ( f ) ;
  d.addListener ( function(e)
  {
    var fItem = e.getItem() ;
    e.getWindow().close() ;
    thiz.editor.setFile ( fItem ) ;
    thiz.save() ;
    if ( thiz.L_name.isValid() ) thiz.L_name.setText ( fItem.toString() ) ;
    if ( thiz.editor.getMode() == "javascript" || thiz.editor.getMode() == "css" )
    {
      thiz.showErrorTable ( true ) ;
    }
    else
    {
      thiz.showErrorTable ( false ) ;
    }
    thiz._DocumentChanged = false ;
    var ev = new TItemEvent ( event, fItem ) ;
    ev.setJsSource ( thiz ) ;
    thiz._fireEvent ( ev, "save" ) ;
    ev.flush() ;
    thiz.editor.editor.focus() ;
  }, "action-file");
  d.saveAs ( fName ) ;
} ;
DocumentEditor.prototype.closeWindow = function ( event )
{
  if ( this._DocumentChanged )
  {
    var thiz = this ;
    var d = new TUserDialog ( "WindowDataAreChangedDiscard" ) ;
    d.askYesNo ( function ( answer )
    {
      if ( ! answer.isYes() ) return ;
      thiz._DocumentChanged = false ;
      thiz.clear() ;
      if ( thiz.w ) thiz.w.closeImediately() ;
    } ) ;
    if ( event.jsClassName ) event.consume() ;
    else                     new TEvent ( event ).consume() ;
    return false ;
  }
  if ( this.w ) this.w.closeImediately() ;
  var f = this.editor.getFile() ;
  var ev = new TItemEvent ( event, f ) ;
  this.clear() ;
  this.TB_saveText.setEnabled ( false ) ;
  this.TB_saveAs.setEnabled ( false ) ;
  this.TB_closeDocumentEditor.setEnabled ( false ) ;
  ev.setJsSource ( this ) ;
  this._fireEvent ( ev, "close" ) ;
  ev.flush() ;
};
DocumentEditor.prototype.close = function ( event )
{
  if ( this._DocumentChanged )
  {
    var thiz = this ;
    var d = new TUserDialog ( "WindowDataAreChangedDiscard" ) ;
    d.askYesNo ( function ( answer )
    {
      if ( ! answer.isYes() ) return ;
      thiz._DocumentChanged = false ;
      thiz.clear() ;
    } ) ;
    return ;
  }
  var f = this.editor.getFile() ;
  this.clear() ;

  this.TB_saveText.setEnabled ( false ) ;
  this.TB_saveAs.setEnabled ( false ) ;
  this.TB_closeDocumentEditor.setEnabled ( false ) ;
  this._saveEditorStatus()
  var ev = new TItemEvent ( event, f ) ;
  ev.setJsSource ( this ) ;
  this._fireEvent ( ev, "close" ) ;
  ev.flush() ;
};
DocumentEditor.prototype._saveEditorStatus = function()
{
  var theme = this.editor.getTheme() ;
  TSys.setPreferenceValue ( "AceTheme", theme ) ;
  TSys.setPreferenceValue ( "ShowErrorTable", this.isShowErrorTable() ) ;
  TSys.savePersistentData() ;
};
DocumentEditor.prototype.editFile = function ( f )
{
  if ( ! f.isText() )
  {
    var d = new TUserDialog ( "Not a textfile:" + f.getName())
    d.error() ;
    return ;
  }
  if ( this._DocumentChanged )
  {
    var thiz = this ;
    var d = new TUserDialog ( "WindowDataAreChangedDiscard" ) ;
    d.askYesNo ( function ( answer )
    {
      if ( ! answer.isYes() ) return ;
      thiz._DocumentChanged = false ;
      thiz.setText ( f ) ;
    } ) ;
    return ;
  }
  this.setText ( f ) ;
};
DocumentEditor.prototype.save = function ( event )
{
  this.TB_saveText.setEnabled ( false ) ;
  this.TB_saveAs.setEnabled ( true ) ;
  this.TB_closeDocumentEditor.setEnabled ( true ) ;
  var f = this.editor.getFile() ;
  if ( f )
  {
    f.saveText ( this.editor.getText() ) ;
    this.editor.editor.focus() ;
    this._DocumentChanged = false ;
    var ev = new TItemEvent ( event, f ) ;
    ev.setJsSource ( this ) ;
    this._fireEvent ( ev, "save" ) ;
    ev.flush() ;
  }
  else
  {
    this.saveAs ( event ) ;
  }
};
DocumentEditor.prototype._onDocumentChange = function ( ev )
{
  if ( this._onDocumentChangeVeto ) return ;
  if ( ! this._DocumentChanged )
  {
    this.TB_saveText.setEnabled ( true ) ;
    this.TB_saveAs.setEnabled ( true ) ;
    this.TB_closeDocumentEditor.setEnabled ( true ) ;
  }
  this._DocumentChanged = true ;
  var f = this.editor.getFile() ;
  var ev = new TItemEvent ( event, f ) ;
  ev.setJsSource ( this ) ;
  this._fireEvent ( ev, "change" ) ;
  ev.flush() ;
};
DocumentEditor.prototype.clear = function ( ev )
{
  var veto = this._onDocumentChangeVeto ;
  this._onDocumentChangeVeto = true ;
  this.editor.clear() ;
  this.TABLE_ERRORS.clear() ;
  this.showErrorTable ( false ) ;
  this._DocumentChanged = false ;
  if ( this.L_name.isValid() ) this.L_name.setText() ;
  this._onDocumentChangeVeto = veto ;
} ;
DocumentEditor.prototype.setText = function ( t )
{
  this.TABLE_ERRORS.clear() ;
  this._onDocumentChangeVeto = true ;
  this.editor.setText ( t ) ;
  this._onDocumentChangeVeto = false ;
  this._DocumentChanged = false ;
  this.TB_saveText.setEnabled ( false ) ;
  this.TB_saveAs.setEnabled ( false ) ;
  this.TB_closeDocumentEditor.setEnabled ( false ) ;
  if ( t instanceof File )
  {
    if ( this.L_name.isValid() ) this.L_name.setText ( t.toString() ) ;
    this.TB_saveAs.setEnabled ( true ) ;
    this.TB_closeDocumentEditor.setEnabled ( true ) ;
  }
  if ( this.editor.getMode() == "javascript" || this.editor.getMode() == "css" )
  {
    this.showErrorTable ( true ) ;
  }
  else
  {
    this.showErrorTable ( false ) ;
  }
  var ev ;
  if ( t instanceof File ) ev = new TItemEvent ( null, t ) ;
  else                     ev = new TItemEvent ( null ) ;
  ev.setJsSource ( this ) ;
  this._fireEvent ( ev, "open" ) ;
  ev.flush() ;
  return true ;
} ;
DocumentEditor.prototype.getFile = function()
{
  return this.editor.getFile() ;
};
DocumentEditor.prototype.getText = function()
{
};
DocumentEditor.prototype._onChangeAnnotation = function ( ev )
{
  var m = this.editor.getAnnotations() ;

  if ( ! m )
  {
    this.TABLE_ERRORS.clear() ;
    return ;
  }
  var x = new TXml() ;
  var xx  = x.add ( "TABLE_ERRORS" ) ;

  var i = 0 ;
  for ( i= 0 ; i < m.length ; i++ )
  {
    var text = "" ;
    var desc = m[i] ;
    var linn = desc.row + 1 ;
    var coln = desc.column ;
    var type = desc.type ;
    text = desc.text ;
    if ( ! text ) continue ;
    var r  = xx.add ( "row" ) ;
    r.add ( "LINE", linn  ) ;
    r.add ( "COLUMN", coln  ) ;
    r.add ( "TEXT", text  ) ;
  }
/*
  for ( var key in m )
  {
    var text = "" ;
    var list = m[key] ;
    var desc = list[0] ;
    var linn = desc.row + 1 ;
    var coln = desc.column ;
    var type = desc.type ;
    for  ( var i = 0 ; i < list.length ; i++ )
    {
      var d = list[i] ;
      if ( text ) text += " - " ;
      text += d.text ;
    }
    if ( ! text ) continue ;
    var r  = xx.add ( "row" ) ;
    r.add ( "LINE", linn  ) ;
    r.add ( "COLUMN", coln  ) ;
    r.add ( "TEXT", text  ) ;
  }
 */
  this.TABLE_ERRORS.setValues ( x ) ;
};

/**
 *  @constructor
 *  Global singleton <b>SystemNotifications</b>
 */
SystemNotifierClass = function ( p )
{
  this.jsClassName = "SystemNotifierClass" ;
  this.me = null ;
  this.list = [] ;
  this.width = 200 ;
  this.showIcons = true ;
  if ( p )
  {
    this.width = p.width ? p.width : 200 ;
    this.showIcons = p.showIcons === false ? false : true ;
  }
  Tango.mixin ( EventMulticasterTrait, this ) ;
};
SystemNotifier = new SystemNotifierClass() ;
SystemNotifierClass.prototype.progress = function ( str )
{
  var p = null ;
  if ( ! str ) str = "... in progress" ;
  if ( typeof ( str ) == 'string' )
  {
    p = { text: str, progress:true } ;
  }
  else
  if ( typeof ( str ) == 'object' )
  {
    p = str ;
    p.progress = true ;
  }
  else
  {
    p = { text: "" + str, progress:true } ;
  }
  if ( ! p.id ) p.id = TSys.getTempId() ;
  return this.notify ( p ) ;
};
SystemNotifierClass.prototype.notify = function ( str )
{
  if ( this.me )
  {
    this._remove_me() ;
  }
  var p = null ;
  if ( ! str ) str = "Notification" ;
  if ( typeof ( str ) == 'string' )
  {
    p = { text: str } ;
  }
  else
  if ( typeof ( str ) == 'object' )
  {
    p = str ;
  }
  else
  {
    p = { text: "" + str } ;
  }
  if ( ! p.id ) p.id = TSys.getTempId() ;
  this._showMessage ( p ) ;
  return p.id ;
};
SystemNotifierClass.prototype.click = function ( e )
{
  var ev = new TEvent() ;
  ev.setHtmlSource ( this.dom ) ;
  ev.setPeer ( this ) ;
  this.emit ( ev, "click" ) ;

  // var ev = new TEvent ( e ) ;
  // var elem = ev.getSource() ;
  // for ( ; elem && elem !== this.main ; elem = elem.parentNode )
  // {
  //   if ( elem.nodeType != DOM_ELEMENT_NODE ) continue ;
  //   if ( elem.ownerIsNotifier )
  //   {
  //     this.remove ( null, elem ) ;
  //   }
  // }
};
SystemNotifierClass.prototype.clear = function()
{
  if ( ! this.dom ) return ;
  while ( this.main.firstChild )
  {
    this.main.removeChild ( this.main.firstChild ) ;
  }
};
SystemNotifierClass.prototype.close = function()
{
  this.remove() ;
};
SystemNotifierClass.prototype.remove = function ( id, elem )
{
  if ( ! this.dom ) return ;
  if ( ! id && ! elem )
  {
    TGui.flushAttributes ( this.dom, true ) ;
    this.dom.parentNode.removeChild ( this.dom ) ;
    this.dom = null ;
    return ;
  }
  for ( var ch = this.main.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.nodeName === "SPAN" && ( ch.name === id || ch === elem ) )
    {
      while ( ch )
      {
        var nextSibling = ch.nextSibling ;
        ch.parentNode.removeChild ( ch ) ;
        ch = nextSibling ;
        if ( ch && ch.nodeName === "SPAN" )
        {
          break ;
        }
      }
      break ;
    }
  }
};
SystemNotifierClass.prototype.removeLastEntry = function()
{
  if ( ! this.dom ) return ;

  while ( this.main.lastChild )
  {
    var nodeName = this.main.lastChild.nodeName ;
    this.main.removeChild ( this.main.lastChild ) ;
    if ( nodeName === "SPAN" ) break ;
  }
};
SystemNotifierClass.prototype._showMessage = function ( p )
{
  if ( this.showIcons )
  {
    if ( ! p.icon )
    {
      p.icon = "Tango/Alert/info" ;
      p.icon_width = "16" ;
      p.icon_height = "16" ;
    }
    else
    {
      if ( ! p.icon_width ) p.icon_width = p.icon_height ;
      if ( ! p.icon_width ) p.icon_width = "16" ;
      if ( ! p.icon_height ) p.icon_height = p.icon_width ;
    }
  }
  if ( ! p.text ) p.text = "Notification..." ;
  if ( ! this.dom )
  {
    var s = ""
    + "<style type='text/css'>\n"
    + ".note\n"
    + "{\n"
    + "  margin: 0;\n"
    + "  padding: 4px;\n"
    + "  background:rgba(255,255,255,0.95);\n"
    + "  box-shadow:0 6px 12px rgba(0,0,0,0.7);\n"
    + "  border-radius:5px 5px 5px 5px;\n"
    + "  padding-top: 5px;\n"
    + "  padding-left: 5px; \n"
    + "  padding-bottom: 5px; \n"
    + "  padding-right: 5px; \n"
    + "}\n"
    + "</style>\n"
    + "<div class='note'>\n"
    + "</div>\n"
    ;
    var axl = new TXml() ;
    var xCont = axl.add ( "Container" ) ;
    xCont.addAttribute ( "style", "width:" + this.width + "px;top:0px;right:10px;") ;
    xCont.addCDATA ( "Html", s ) ;
    var m = TGui.getMain() ;
    this.dom = TGui.createElement ( axl, m ) ;
    m.appendChild ( this.dom ) ;
    var mc = new TContainer ( m ) ;
    var mcsize = mc.getSize() ;
    var mec = new TContainer ( this.dom ) ;
    var mecsize = mec.getSize() ;
    var x = mcsize.width - mecsize.width - 20 ;
    mec.setLocation ( x, 10 ) ;
    this.dom.style.zIndex = TGui.zIndexWindowAlwaysOnTop - 2 ;
    this.main = mec.findFirstChildElement ( "DIV" ) ;
    mec.addEventListener ( "click", this, this.click ) ;
  }
  var text = "" ;
  var imgName ;
  if ( this.showIcons )
  {
    if ( p.progress )
    {
      text = "<img src='" + TGui.translateImageName ( "Tango/Misc/throbber16" ) + "'" + " style='width:16px;height:16px;'></img>"  ;
    }
    else
    {
      imgName = TGui.translateImageName ( p.icon ) ;
      text = "<img src='" + imgName + "'" + " style='width:" + p.icon_width + "px;height:" + p.icon_height + "px;'></img>"  ;
    }
  }
  text += p.text ;
  var span = document.createElement ( "span" ) ;
  span.innerHTML = text ;
  this.main.appendChild ( span ) ;
  this.main.appendChild ( document.createElement ( "br" ) ) ;
  span.name = p.id ;
  span.ownerIsNotifier = true ;
}

