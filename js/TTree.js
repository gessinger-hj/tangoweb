var __TM = {} ;
/**
 *  @constructor
 */
_TTree = function ( xDom )
{
  this.config = {
    target          : null,
    folderLinks      : true,
    useSelection    : true,
    useCookies      : true,
    useLines        : true,
    useIcons        : true,
    closeSameLevel  : false,
    inOrder          : false
  }
//folder_open-dropline-16.png
  this.icon = {
    root        : 'img/base.gif',
    folder      : 'img/folder-dropline-16.png', //folder.gif'
    folderOpen  : 'img/folder_open-dropline-16.png', //folderopen.gif',
    node        : 'img/folder-dropline-16.png', //folder.gif', //page.gif',
    empty        : 'img/empty.gif',
    line        : 'img/line.gif',
    join        : 'img/join.gif',
    joinBottom  : 'img/joinbottom.gif',
    plus        : 'img/plus.gif',
    plusBottom  : 'img/plusbottom.gif',
    minus        : 'img/minus.gif',
    minusBottom  : 'img/minusbottom.gif',
    nlPlus      : 'img/nolines_plus.gif',
    nlMinus      : 'img/nolines_minus.gif'
  };
  this.icon.root = this.getFolderOpenIcon() ;
  this.icon.folder = this.getFolderIcon() ;
  this.icon.folderOpen = this.getFolderOpenIcon() ;
  this.icon.node = this.getFolderIcon() ;
  this.icon.plus = this.getTreePlusIcon() ;
  this.icon.plusBottom = this.getTreePlusBottomIcon() ;
  this.icon.nlPlus = this.getTreePlusNolinesIcon() ;
  this.icon.minus = this.getTreeMinusIcon() ;
  this.icon.minusBottom = this.getTreeMinusBottomIcon() ;
  this.icon.nlMinus = this.getTreeMinusNolinesIcon() ;
  this.aNodes = [];
  this.aIndent = [];
  this._selectedFound = false;
  this.completed = false;
  this.showRoot = true ;

  Tango.initSuper ( this, TComponent, null );

  this.selectionListener = [] ;
  this._flushed = false ;
  this.objId = TSys.getTempId() ;
  this.treeId = "__TM." + this.objId ;
  __TM[this.objId] = this ;
  this._selectedNode = null ;
  this._selectedIndex = -1 ;

  this.itemListener = [] ;
  this.actionListener = [] ;
  this.jsClassName = "_TTree" ;

  this.root = new _TTreeNode( this, -1 ) ;
  if (  xDom && typeof ( xDom ) == 'object'
     && xDom.tagName == "Tree"
     )
  {
    var xml = new TXml ( xDom ) ;
    this.resettable = xml.getBoolAttribute ( "reset", false ) ;
    this.path = xml.getAttribute ( "path" ) ;
    this.node_name = xml.getAttribute ( "node-name", "node" ) ;
    this.get_values = xml.getBoolAttribute ( "get-values", false ) ;
    this.firstData = xml.getXml ( "Data" ) ;
    var onclick = xml.getAttribute ( "onclick" ) ;
    if ( onclick ) this.addSelectionListener ( onclick ) ;
    this.nodesPlain = xml.getBoolAttribute ( "nodes-plain", false ) ;
    this.nodesPlain = xml.getBoolAttribute ( "plain", this.nodesPlain ) ;
  }
};
_TTree.inherits( TComponent ) ;
_TTree.prototype.setClassImages = function ( elem, refresh )
{
  this.icon.root = this.getFolderOpenIcon() ;
  this.icon.folder = this.getFolderIcon() ;
  this.icon.folderOpen = this.getFolderOpenIcon() ;
  this.icon.node = this.getFolderIcon() ;
  this.icon.plus = this.getTreePlusIcon() ;
  this.icon.plusBottom = this.getTreePlusBottomIcon() ;
  this.icon.nlPlus = this.getTreePlusNolinesIcon() ;
  this.icon.minus = this.getTreeMinusIcon() ;
  this.icon.minusBottom = this.getTreeMinusBottomIcon() ;
  this.icon.nlMinus = this.getTreeMinusNolinesIcon() ;
  this.show() ;
  return true ;
}
_TTree.prototype.layout = function ( dom, externalAttributes, x, layoutContext, a )
{
  this.dom = dom ;
  this.span = document.createElement ( "span" ) ;
  this.dom.appendChild ( this.span ) ;
  this.dom.isLayedout = true ;
  if ( this.firstData )
  {
    this._setValues ( this.firstData ) ;
  }
  TGui.addEventListener ( this.dom, "click", this.onclick.bindAsEventListener ( this ) ) ;
};
_TTree.prototype.getValues = function ( xml )
{
  if ( ! this.get_values ) return ;
  if ( ! xml ) xml = new TXml() ;

  var si = this.getSelectedItem() ;
  if ( ! si ) return ;
  var x = this.getSelectedUserXml() ;
  if ( ! x ) return ;
  if ( si.pid < 0 && this.setBySetValues )
  {
    for ( var ch = x.getDom().firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      xml.addDuplicate ( new TXml ( ch ) ) ;
    }
  }
  else
  {
    xml.addDuplicate ( x ) ;
  }
}
_TTree.prototype.setValues = function ( xml )
{
  this.setBySetValues = true ;
  var x = xml ;
  if ( xml.jsClassName == "TXml" )
  {
  }
  else
  {
    x = new TXml ( xml ) ;
  }
  var xx = undefined ;
  if ( this.dom.path )
  {
    xx = x.getXml ( this.dom.path ) ;
  }
  if ( ! xx )
  {
    xx = x.getXml ( this.dom.name ) ;
  }
  if ( ! xx )
  {
    if ( x.getName() == this.name )
    {
      xx = x ;
    }
  }
  if ( xx )
  {
    this._setValues ( xx ) ;
  }
  else
  if ( this.nodesPlain )
  {
    this._setValues ( x.first() ) ;
  }
};
_TTree.prototype._setValues = function ( xml )
{
  var n = 0 ;
  var en = xml.getEnum ( this.node_name ) ;
  if ( ! en.hasNext() ) return ;
 
  this.clear() ;
  var node = this.add ( n, -1, "", xml ) ;
  node.setName ( xml.getAttribute ( "name" ) ) ;
  this.__setValues ( en, n ) ;
  this.show() ;
};
_TTree.prototype.__setValues = function ( en, n )
{
  var nRoot = n ;
  while ( en.hasNext() )
  {
    var xNode = new TXml ( en.next() ) ;
    n++ ;
    var node = this.add ( n, nRoot, "", xNode ) ;
    node.setName ( xNode.getAttribute ( "name", "" ) ) ;
    var en2 = xNode.getEnum ( this.node_name ) ;
    n = this.__setValues ( en2, n ) ;
  }
  return n ;
}
_TTree.prototype.resized = function ( size )
{
//this.span.style.border = "2px solid black" ;
//this.span.style.backgroundColor = "yellow" ;
}
_TTree.prototype.setParentContainer = function ( container )
{
  this.dom = container ;
  this.dom.jsPeer = this ;
}
_TTree.prototype.getNodeByName = function ( name )
{
  for ( var i = 0 ; i < this.aNodes.length ; i++ )
  {
    if ( this.aNodes[i].name == name ) return this.aNodes[i] ;
  }
}
_TTree.prototype.show = function()
{
  var str = this.asString() ;
//var t = str.replace ( /&/g, "--" ) ;
//log ( TSys.parseXml ( t ) ) ;
//  this.dom.innerHTML = str ;
//log ( "--------------" ) ;
//log ( new TComponent ( this.dom ) ) ;
//log ( new TComponent ( this.span ) ) ;
  this.span.innerHTML = str ;
//log ( new TComponent ( this.span ) ) ;
//log ( "              --------------" ) ;
//log ( new TComponent ( this.span.firstChild ) ) ;
//  this.span.innerHTML = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" ;
}
_TTree.prototype.getRefId = function()
{
  return this.treeId ;
}
_TTree.prototype.getSelectedItem = function()
{
  return this._selectedNode ;
}
_TTree.prototype.getSelectedUserData = function()
{
  if ( ! this._selectedNode ) return null ;
  return this._selectedNode._userData ;
}
_TTree.prototype.getSelectedUserXml = function()
{
  if ( ! this._selectedNode ) return null ;
  if ( ! this._selectedNode._userData ) return null ;
  return new TXml ( this._selectedNode._userData ) ;
}
_TTree.prototype.clear = function()
{
  for ( var i = 0 ; i < this.aNodes.length ; i++ )
  {
    this.aNodes[i].flush() ;
  }
  this.aNodes.length = 0 ;
}
_TTree.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  for ( var i = 0 ; i < this.aNodes.length ; i++ )
  {
    this.aNodes[i].flush() ;
  }
  this.aNodes.length = 0 ;
  for ( var i = 0 ; i < this.selectionListener.length ; i++ )
  {
    this.selectionListener[i].flush() ;
  }
  this.selectionListener.length = 0 ;
  this.selectionListener = null ;
  __TM[this.objId] = null ;
}
_TTree.prototype._fireSelectionEvent = function ( args )
{
  for ( var i = 0 ; i < this.selectionListener.length ; i++ )
  {
    this.selectionListener[i].execute ( args ) ;
    if ( this._flushed ) break ;
  }
}
_TTree.prototype.addSelectionListener = function ( self, listener )
{
  this._addSelectionListener ( new TFunctionExecutor ( self, listener ) ) ;
}
_TTree.prototype._addSelectionListener = function ( functionExecutor )
{
  if ( ! functionExecutor ) return ;
  this.selectionListener.push ( functionExecutor ) ;
}
_TTree.prototype.onclick = function ( event )
{
  var ev = new TEvent ( event ) ;
  this._lastClickSource = ev.getSource() ;
  if ( this._lastClickSource && this._lastClickSource.nodeName == 'A' )
  {
    this.s ( this._lastClickSource.parentNode.id ) ;
    this._select ( this._lastClickSource.parentNode.id ) ;
  }
};
_TTree.prototype._select = function(index)
{
  var a = null ;
  var ev = new TItemEvent ( null ) ;
  a = [] ;
  a[0] = ev ;
  a[1] = this._selectedIndex ;
  this._selectedNode = this.aNodes[this._selectedIndex] ;
  ev.setItem ( this._selectedNode ) ;
  ev.setPeer ( this ) ;
  if ( this._lastClickSource && this._lastClickSource.nodeName == 'A' )
  {
    ev.setHtmlSource ( this._lastClickSource ) ;
  }
  this._fireSelectionEvent ( a ) ;
}

// Adds a new node to the node array
_TTree.prototype.add = function(id, pid, text, url, title, target, icon, iconOpen, open)
{
  var x = null ;
  if ( typeof ( url ) == 'string' )
  {
  }
  else
  if ( url && typeof ( url ) == 'object' && url.jsClassName == 'TXml' )
  {
    x = url ;
    url = null ;
    if ( ! text ) text = x.getAttribute ( "title" ) ;
    if ( ! icon ) icon = x.getAttribute ( "img" ) ;
    if ( ! iconOpen ) iconOpen = x.getAttribute ( "img-open" ) ;
    if ( icon )
    {
      if ( icon.indexOf ( "/" ) < 0 ) icon = "img/" + icon ;
    }
    if ( iconOpen )
    {
      if ( iconOpen.indexOf ( "/" ) < 0 ) iconOpen = "img/" + iconOpen ;
    }
    if ( icon && ! iconOpen ) iconOpen = icon ;
  }
  var node = this.aNodes[this.aNodes.length] = new _TTreeNode( this, id, pid, text, url, title, target, icon, iconOpen, open);
  if ( x ) node.setUserData ( x.getDom() ) ;
  return node ;
};

// Open/close all nodes
_TTree.prototype.openAll = function() {
  this.oAll(true);
};
_TTree.prototype.closeAll = function() {
  this.oAll(false);
};

// Outputs the tree to the page
_TTree.prototype.asString = function()
{
  this._selectedIndex = -1 ;
  this._selectedNode = null ;
  var str = '<span class="TTree" style="margin:4px;" >\n';
//  if (this.config.useCookies) this._selectedIndex = this.getSelectedId();
  str += this._asString_addNode(this.root);
  str += '</span>';
  if (!this._selectedFound) this._selectedIndex = -1;
  this.completed = true;
  return str;
};

// Creates the tree structure
_TTree.prototype._asString_addNode = function(parent)
{
  var str = '';
  var n = 0 ;
//  if (this.config.inOrder) n = parent._ai;
  for ( n ; n < this.aNodes.length ; n++ )
  {
    if ( this.aNodes[n].pid == parent.id )
    {
      var cn = this.aNodes[n];
      cn._ai = n;
      this.setCS(cn);
      if (!cn.target && this.config.target) cn.target = this.config.target;
      if (cn._hc && !cn._io && this.config.useCookies) cn._io = this.isOpen(cn.id);
      if (!this.config.folderLinks && cn._hc) cn.url = null;
      if (this.config.useSelection && cn.id == this._selectedIndex && !this._selectedFound)
      {
          cn._is = true;
          this._selectedIndex = n;
          this._selectedFound = true;
      }
      str += this._asString_node(cn, n);
      if (cn._ls) break;
    }
  }
  return str;
};

// Creates the node icon, url and text
_TTree.prototype._asString_node = function(node, nodeId) {
  var str = '<div class="TTreeNode" id="' + nodeId + '" >' + this.indent(node, nodeId);
  if (this.config.useIcons)
  {
    if (!node.icon) node.icon = (this.root.id == node.pid) ? this.icon.root : ((node._hc) ? this.icon.folder : this.icon.node);
    if (!node.iconOpen) node.iconOpen = (node._hc) ? this.icon.folderOpen : this.icon.node;
    if ( this.root.id == node.pid )
    {
      if ( ! node.iconIsSet )
      {
        if ( ! node.icon ) node.icon = this.icon.root;
      }
      if ( ! node.iconOpenIsSet )
      {
        if ( ! node.iconOpen ) node.iconOpen = this.icon.root;
      }
    }
    str += '<img id="i' + this.treeId + nodeId + '" src="' + ((node._io) ? node.iconOpen : node.icon) + '" alt=""';
    if ( node.url && node.url != 'self' ) str += ' onclick="javascript:'+ this.treeId + '.s(' + nodeId + '); ' + node.url + ';"\n';
    str += ' />\n';
  }
  if ( node.url )
  {
    var nl = node.url ;
    if ( nl == 'self' ) nl = "" ;
    else                nl = 'href="' + node.url + '"' ;
    node.aID = 's' + this.treeId + nodeId ;
    str += '<a id="s' + this.treeId + nodeId + '" class="' + ((this.config.useSelection) ? ((node._is ? 'nodeSel' : 'node')) : 'node') + '" ' + nl ; //+ '"';
    if (node.title) str += ' title="' + node.title + '"';
    if (node.target) str += ' target="' + node.target + '"';
    if (this.config.useSelection && ((node._hc && this.config.folderLinks) || !node._hc))
    {
//      str += ' onclick="javascript: ' + this.treeId + '.s(' + nodeId + ');"';
    }
    str += '>';
  }
  else
  if ((!this.config.folderLinks || !node.url) && node._hc && node.pid != this.root.id)
  {
    str += '<a href="javascript: ' + this.treeId + '.o(' + nodeId + ');" class="node">';
  }
  str += node.text;
  if (node.url || ((!this.config.folderLinks || !node.url) && node._hc)) str += '</a>';
  str += '</div>';
if ( node.pid == this.root.id )
{
  if ( ! this.showRoot ) str = "" ;
}
  if (node._hc) {
    str += '<div id="d' + this.treeId + nodeId + '" class="clip" style="display:' + ((this.root.id == node.pid || node._io) ? 'block' : 'none') + ';">';
    str += this._asString_addNode(node);
    str += '</div>';
  }
  this.aIndent.pop();
  return str;
};

// Adds the empty and line icons
_TTree.prototype.indent = function(node, nodeId)
{
  var str = '';
  if (this.root.id != node.pid) {
    for (var n=0; n<this.aIndent.length; n++)
      str += '<img src="' + ( (this.aIndent[n] == 1 && this.config.useLines) ? this.icon.line : this.icon.empty ) + '" alt="" />';
    (node._ls) ? this.aIndent.push(0) : this.aIndent.push(1);
    if ( node._hc )
    {
      str += '<a href="javascript: ' + this.treeId + '.o(' + nodeId + ');"><img id="j' + this.treeId + nodeId + '" src="';
      if (!this.config.useLines)
      {
        str += (node._io) ? this.icon.nlMinus : this.icon.nlPlus;
      }
      else
      {
        str += node._io
               ? ( node._ls && this.config.useLines ) ? this.icon.minusBottom : this.icon.minus
               : ( node._ls && this.config.useLines ) ? this.icon.plusBottom : this.icon.plus
               ;
      }
      str += '" alt="" /></a>';
    }
    else
    {
      str += '<img src="' + ( (this.config.useLines) ? ((node._ls) ? this.icon.joinBottom : this.icon.join ) : this.icon.empty) + '" alt="" />';
    }
  }
  return str;
};

// Checks if a node has any children and if it is the last sibling
_TTree.prototype.setCS = function(node)
{
  var lastId;
  node._hc = node._children.length > 0 ;
  node._ls = false ;
  for (var n=0; n<this.aNodes.length; n++)
  {
    if (this.aNodes[n].pid == node.pid) lastId = this.aNodes[n].id;
  }
  if (lastId==node.id) node._ls = true;
};

// Returns the selected node
_TTree.prototype.getSelectedId = function() {
  var sn = this.getCookie('cs' + this.treeId);
  return (sn) ? sn : null;
};

// Highlights the selected node
_TTree.prototype.s = function(id)
{
  if (!this.config.useSelection) return;
  var node = this.aNodes[id];
  if ( node._hc && !this.config.folderLinks ) return;
  if ( this._selectedNode != node )
  {
    if ( this._selectedNode )
    {
      if ( ! this._selectedNode.eA ) this._selectedNode.eA = document.getElementById(this._selectedNode.aID) ;
      this._selectedNode.eA.className = "node" ;
    }
    if ( ! node.eA ) node.eA = document.getElementById( node.aID) ;
    node.eA.className = "nodeSel";
    this._selectedIndex = id;
    if (this.config.useCookies) this.setCookie('cs' + this.treeId, node.id);
    this._selectedNode = node ;
  }
};

// Toggle Open or close
_TTree.prototype.o = function(id) {
  var node = this.aNodes[id];
  this.nodeStatus ( !node._io, id, node._ls ) ;
  node._io = !node._io;
  if (this.config.closeSameLevel) this.closeLevel(node);
  if (this.config.useCookies) this.updateCookie();
};
_TTree.prototype.open = function(id)
{
  var cn = id ;
  if ( ! ( id instanceof _TTreeNode ) ) cn = this.aNodes[id];
  else                                 id = cn.id ;
  if ( cn._io ) return ;
  this.nodeStatus(!cn._io, id, cn._ls);
  cn._io = !cn._io;
  if (this.config.closeSameLevel) this.closeLevel(cn);
};

// Open or close all nodes
_TTree.prototype.oAll = function(status) {
  for (var n=0; n<this.aNodes.length; n++) {
    if (this.aNodes[n]._hc && this.aNodes[n].pid != this.root.id) {
      this.nodeStatus(status, n, this.aNodes[n]._ls)
      this.aNodes[n]._io = status;
    }
  }
  if (this.config.useCookies) this.updateCookie();
};

// Opens the tree to a specific node
_TTree.prototype.openTo = function(nId, bSelect, bFirst) {
  if (!bFirst) {
    for (var n=0; n<this.aNodes.length; n++) {
      if (this.aNodes[n].id == nId) {
        nId=n;
        break;
      }
    }
  }
  var cn=this.aNodes[nId];
  if ( cn.pid == this.root.id || !cn._parent ) return;
  cn._io = true;
  cn._is = bSelect;
  if (this.completed && cn._hc) this.nodeStatus(true, cn._ai, cn._ls);
  if (this.completed && bSelect) this.s(cn._ai);
  else if (bSelect) this._sn=cn._ai;
  this.openTo ( cn._parent._ai, false, true ) ;
};

// Closes all nodes on the same level as certain node
_TTree.prototype.closeLevel = function(node)
{
  for ( var n = 0 ; n < this.aNodes.length ; n++ )
  {
    if (this.aNodes[n].pid == node.pid && this.aNodes[n].id != node.id && this.aNodes[n]._hc)
    {
      this.nodeStatus(false, n, this.aNodes[n]._ls);
      this.aNodes[n]._io = false;
      this.closeAllChildren(this.aNodes[n]);
    }
  }
}

// Closes all children of a node
_TTree.prototype.closeAllChildren = function(node)
{
  for (var n=0; n<this.aNodes.length; n++)
  {
    if ( this.aNodes[n].pid == node.id && this.aNodes[n]._hc)
    {
      if (this.aNodes[n]._io) this.nodeStatus(false, n, this.aNodes[n]._ls);
      this.aNodes[n]._io = false;
      this.closeAllChildren(this.aNodes[n]);    
    }
  }
}

// Change the status of a node(open or closed)
_TTree.prototype.nodeStatus = function ( status, id, bottom )
{
  eDiv  = document.getElementById('d' + this.treeId + id);
  eJoin  = document.getElementById('j' + this.treeId + id);
  if (this.config.useIcons)
  {
    eIcon  = document.getElementById('i' + this.treeId + id);
    eIcon.src = (status) ? this.aNodes[id].iconOpen : this.aNodes[id].icon;
  }
  eJoin.src = (this.config.useLines)
              ? ( status
                ? ( bottom
                  ? this.icon.minusBottom : this.icon.minus )
                    : ( bottom ? this.icon.plusBottom : this.icon.plus ) )
              : ( status ? this.icon.nlMinus :this.icon.nlPlus ) ;
  eDiv.style.display = status ? 'block': 'none';
};


// [Cookie] Clears a cookie
_TTree.prototype.clearCookie = function() {
  var now = new Date();
  var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);
  this.setCookie('co'+this.treeId, 'cookieValue', yesterday);
  this.setCookie('cs'+this.treeId, 'cookieValue', yesterday);
};

// [Cookie] Sets value in a cookie
_TTree.prototype.setCookie = function(cookieName, cookieValue, expires, path, domain, secure) {
  document.cookie =
    escape(cookieName) + '=' + escape(cookieValue)
    + (expires ? '; expires=' + expires.toGMTString() : '')
    + (path ? '; path=' + path : '')
    + (domain ? '; domain=' + domain : '')
    + (secure ? '; secure' : '');
};

// [Cookie] Gets a value from a cookie
_TTree.prototype.getCookie = function(cookieName) {
  var cookieValue = '';
  var posName = document.cookie.indexOf(escape(cookieName) + '=');
  if (posName != -1) {
    var posValue = posName + (escape(cookieName) + '=').length;
    var endPos = document.cookie.indexOf(';', posValue);
    if (endPos != -1) cookieValue = unescape(document.cookie.substring(posValue, endPos));
    else cookieValue = unescape(document.cookie.substring(posValue));
  }
  return (cookieValue);
};

// [Cookie] Returns ids of open nodes as a string
_TTree.prototype.updateCookie = function() {
  var str = '';
  for (var n=0; n<this.aNodes.length; n++) {
    if (this.aNodes[n]._io && this.aNodes[n].pid != this.root.id) {
      if (str) str += '.';
      str += this.aNodes[n].id;
    }
  }
  this.setCookie('co' + this.treeId, str);
};

// [Cookie] Checks if a node id is in a cookie
_TTree.prototype.isOpen = function(id) {
  var aOpen = this.getCookie('co' + this.treeId).split('.');
  for (var n=0; n<aOpen.length; n++)
    if (aOpen[n] == id) return true;
  return false;
};

/**
 *  @constructor
 */
_TTreeNode = function ( tree, id, pid, text, url, title, target, icon, iconOpen, open)
{
  this.id = id;
  this.pid = pid;
  if ( ! text ) text = "" ;
  this.text = text;
  this.url = url;
  this.title = title;
  this.target = target;
  this.icon = icon;
  this.iconOpen = iconOpen;
  this._io = open || false;
  this._is = false;
  this._ls = false;
  this._hc = false; // has children
  this._ai = 0;     // actual index
  this._userData = null ;
  this.name = url ;
  this.tree = tree ;
  if ( ! url )
  {
    var index = tree.aNodes.length ;
    this.url = "self" ; //"javascript:" + tree.getRefId() + "._select(" + index + ")" ;
  }
  this.iconIsSet = icon ? true : false ;
  this.iconOpenIsSet = iconOpen ? true : false ;
  this._parent = tree.aNodes[pid] ;
  this._children = [] ;
  if ( this._parent ) this._parent._children.push ( this ) ;
};
_TTreeNode.prototype.toString = function()
{
  return "(_TTreeNode)"
  + "\n  this.id=" + this.id
  + "\n  this.pid=" + this.pid
  + "\n  this.text='" + this.text + "'"
  + "\n  this.name='" + this.name + "'"
  + "\n  this.url='" + this.url + "'"
  + "\n  this.title='" + this.title + "'"
  + "\n  this.target='" + this.target + "'"
  + "\n  this.icon='" + this.icon + "'"
  + "\n  this.iconOpen='" + this.iconOpen + "'"
  + "\n  this._io=" + this._io
  + "\n  this._is=" + this._is
  + "\n  this._ls=" + this._ls
  + "\n  this._hc=" + this._hc
  + "\n  this._ai=" + this._ai
//  + "\n  this._parent=" + this._parent
  ;
}
_TTreeNode.prototype.getParent = function()
{
  return this._parent ;
}
_TTreeNode.prototype.setName = function ( name )
{
  this.name = name ;
}
_TTreeNode.prototype.getName = function()
{
  return this.name ;
}
_TTreeNode.prototype.setUserData = function ( dom )
{
  this._userData = dom ;
}
_TTreeNode.prototype.getUserData = function()
{
  return this._userData ;
}
_TTreeNode.prototype.getUserDataXml = function()
{
  return new TXml ( this._userData ) ;
}
_TTreeNode.prototype.open = function()
{
  this.tree.open ( this ) ;
}
_TTreeNode.prototype.select = function()
{
  this.tree.s ( this.id ) ;
}
_TTreeNode.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  this._userData = null ;
  this._children.length = 0 ;
  this._children = null ;
}
_TTreeNode.prototype._collectAllChildren = function ( n, a )
{
  a.push ( n ) ;
  for ( var i = 0 ; i < n._children.length ; i++ )
  {
    this._collectAllChildren ( n._children[i] , a )
  }
}
_TTreeNode.prototype.remove = function()
{
  var n = this ;
  var p = this._parent ;
  if ( p )
  {
    var childIndex = p._children.indexOf ( this ) ;
    p._children.splice ( childIndex, 1 ) ;
  }
  if ( this._userData )
  {
    new TXml ( this._userData ).remove() ;
    this._userData = undefined ;
  }
  var a = [] ;
  this._collectAllChildren ( n, a )
  for ( var i = 0 ; i < a.length ; i++ )
  {
    a[i]._children.length = 0 ;
    var ai = a[i]._ai ;
    this.tree.aNodes.splice ( ai, 1 ) ;
    for ( var j = ai ; j < this.tree.aNodes.length ; j++ )
    {
      if ( this.tree.aNodes[i].id > ai ) this.tree.aNodes[i].id-- ;
      if ( this.tree.aNodes[i].pid > ai ) this.tree.aNodes[i].pid-- ;
      if ( this.tree.aNodes[i]._ai > ai ) this.tree.aNodes[i]._ai-- ;
    }
  }
  a.length = 0 ;
  if ( p )
  {
    this.tree.setCS (p) ;
    if ( p._io && ! p._hc ) p._io = false ;
  }
  this.tree._selectedNode = null ;
  this.tree._selectedIndex = -1 ;
}
_TTree.prototype.folderIcon = "img/folder-dropline-16.png" ;
_TTree.prototype.folderOpenIcon = "img/folder_open-dropline-16.png" ;
_TTree.prototype.folderUpIcon = "img/dropline-folder-up.png" ;
_TTree.prototype.getFolderIcon = function()
{
  var dom = Tango.getThemeDom ( "Folder.16", "normal" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "Folder.16", "normal", NaN, NaN ) 
  return this.folderIcon ;
} ;
_TTree.prototype.getFolderOpenIcon = function()
{
  var dom = Tango.getThemeDom ( "Folder.16", "open" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "Folder.16", "open", NaN, NaN ) 
  return this.folderOpenIcon ;
} ;
_TTree.prototype.getFolderUpIcon = function()
{
  var dom = Tango.getThemeDom ( "Folder.16", "up" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "Folder.16", "up", NaN, NaN ) 
  return this.folderUpIcon ;
} ;
_TTree.prototype.getTreePlusIcon = function()
{
  var dom = Tango.getThemeDom ( "TreeViewNode", "plus" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "TreeViewNode", "plus", NaN, NaN ) 
  return 'img/plus.gif' ;
} ;
_TTree.prototype.getTreePlusBottomIcon = function()
{
  var dom = Tango.getThemeDom ( "TreeViewNode", "plus-bottom" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "TreeViewNode", "plus-bottom", NaN, NaN ) 
  return 'img/plusbottom.gif' ;
} ;
_TTree.prototype.getTreePlusNolinesIcon = function()
{
  var dom = Tango.getThemeDom ( "TreeViewNode", "plus-nolines" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "TreeViewNode", "plus-nolines", NaN, NaN ) 
  return 'img/nolines_plus.gif' ;
} ;
_TTree.prototype.getTreeMinusIcon = function()
{
  var dom = Tango.getThemeDom ( "TreeViewNode", "minus" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "TreeViewNode", "minus", NaN, NaN ) 
  return 'img/minus.gif' ;
} ;
_TTree.prototype.getTreeMinusBottomIcon = function()
{
  var dom = Tango.getThemeDom ( "TreeViewNode", "minus-bottom" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "TreeViewNode", "minus-bottom", NaN, NaN ) 
  return 'img/minusbottom.gif' ;
} ;
_TTree.prototype.getTreeMinusNolinesIcon = function()
{
  var dom = Tango.getThemeDom ( "TreeViewNode", "minus-nolines" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "TreeViewNode", "minus-nolines", NaN, NaN ) 
  return 'img/nolines_minus.gif' ;
}

