/**
 *  @constructor
 */
var TXml = function ( xmlDom, value, attr )
{
  if ( ! attr && value && typeof value === 'object' )
  {
    attr = value ;
    value = null ;
  }
  this.realName = null ;
  this.jsClassName = "TXml" ;
  if ( ! xmlDom )
  {
    this.domDoc = TSys.parseDom ( "<xml></xml>" ) ;
    this.domRoot = this.domDoc.firstChild ;
  }
  else
  if ( typeof ( xmlDom ) == 'string' )
  {
    if ( xmlDom.indexOf ( "<xml" ) === 0 )
    {
      this.domDoc = TSys.parseDom ( xmlDom ) ;
      this.domRoot = this.domDoc.firstChild ;
    }
    else
    {
      this.domDoc = TSys.parseDom ( "<xml></xml>" ) ;
      this.domRoot = this.domDoc.firstChild ;
      this.realName = xmlDom ;
    }
  }
  else
  {
    if ( xmlDom.nodeType == DOM_ELEMENT_NODE )
    {
      this.domDoc = null ;
      this.domRoot = xmlDom ;
    }
    else
    if ( xmlDom.nodeType == DOM_DOCUMENT_NODE )
    {
      var doc = xmlDom ;
      var firstElement = null ;
      for ( var ch = xmlDom.firstChild ; ch ; ch = ch.nextSibling )
      {
        if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
        firstElement = ch ;
        break ;
      }
      if ( firstElement )
      {
        this.domDoc = xmlDom ;
        this.domRoot = firstElement ;
      }
      else
      {
        this.domDoc = null ;
        this.domRoot = xmlDom ;
      }
    }
  }
  if ( this.domRoot.parentNode )
  {
    if ( this.domRoot.parentNode.nodeType == DOM_DOCUMENT_NODE )
    {
      this.domDoc = this.domRoot.parentNode ;
    }
  }
  if ( typeof ( value ) == 'string' )
  {
    var t = this.getDocumentNode().createTextNode ( value ) ;
    this.domRoot.appendChild ( t ) ;
  }
  if ( attr && typeof attr === 'object' )
  {
    for ( var key in attr )
    {
      d.addAttribute ( key, attr[key] ) ;
    }
  }
};
TXml.prototype =
{
  createElement: function ( name, value )
  {
    var doc = null ;
    if ( typeof ( this.domDoc ) != 'undefined' )
    {
      doc = this.domDoc ;
    }
    else
    {
      doc = document ;
    }
    var e = doc.createElement ( name ) ;
    if ( value )
    {
      var t = doc.createTextNode ( value ) ;
      e.appendChild ( t ) ;
    }
    return e ;
  },
  flush: function()
  {
    this.domDoc = null ;
    this.domRoot = null ;
  },
  first: function()
  {
    for ( var ch = this.domRoot.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType == DOM_ELEMENT_NODE )
      {
        return new TXml ( ch ) ;
      }
    }
  },
  last: function()
  {
    for ( var ch = this.domRoot.lastChild ; ch ; ch = ch.previousSibling )
    {
      if ( ch.nodeType == DOM_ELEMENT_NODE )
      {
        return new TXml ( ch ) ;
      }
    }
  },
  addDuplicate: function ( domSource, firstName )
  {
    if ( ! domSource ) return ;
    var doc = this.getDocumentNode() ;
    if ( domSource.jsClassName == "TXml" )
    {
      if ( ! firstName ) firstName = domSource.getName() ;
      domSource = domSource.getDom() ;
    }
    else
    if ( domSource.nodeType == DOM_DOCUMENT_NODE )
    {
      domSource = new TXml ( domSource ).getDom() ;
    }
    else
    if ( domSource.nodeType == DOM_TEXT_NODE )
    {
      if ( typeof ( domSource.nodeValue ) == 'string' )
      {
        var tn = doc.createTextNode ( domSource.nodeValue ) ;
        this.domRoot.appendChild ( tn ) ;
      }
      return ;
    }
    else
    if ( domSource.nodeType == DOM_CDATA_SECTION_NODE )
    {
      if ( typeof ( domSource.nodeValue ) == 'string' )
      {
        var tn = doc.createCDATASection ( domSource.nodeValue ) ;
        this.domRoot.appendChild ( tn ) ;
      }
      return ;
    }

    this._addDuplicate ( domSource, doc, this.domRoot, firstName ) ;
  },
  _addDuplicate: function ( domSource, doc, domTarget, firstName )
  {
    var nn = domSource.nodeName ;
    if ( firstName )
    {
      nn = firstName ;
    }
    else
    if ( domSource.xNodeName )
    {
      nn = domSource.xNodeName ;
    }
    else
    if ( domSource.getAttribute ( "xNodeName" ) )
    {
      nn = domSource.getAttribute ( "xNodeName" ) ;
    }
    var newNode = null ;
    if ( nn == 'IMG' )
    {
      newNode = doc.createElement ( nn + "X" ) ;
      if ( TSys.isIE() ) this.addAttribute ( "xNodeName", nn ) ;
      else this.domRoot.xNodeName = nn ;
    }
    else
    {
      newNode = doc.createElement ( nn ) ;
    }
    domTarget.appendChild ( newNode ) ;
    if ( ! TSys.isIE() )
    {
      newNode.xNodeName = nn ;
    }
    if ( domSource.attributes && domSource.attributes.length > 0 )
    {
      for ( i = 0 ; i < domSource.attributes.length ; i++ )
      {
        if ( ! domSource.attributes[i].nodeValue ) continue ;
        if ( domSource.attributes[i].nodeValue == "inherit" ) continue ;
        if ( domSource.attributes[i].nodeName == "xNodeName" ) continue ;
        var attr = doc.createAttribute ( domSource.attributes[i].nodeName ) ;
        attr.value = domSource.attributes[i].nodeValue ;
        newNode.setAttributeNode ( attr ) ;
      }
    }
    var ch = domSource.firstChild ;
    while ( ch )
    {
      if ( ch.nodeType == DOM_TEXT_NODE )
      {
        if ( typeof ( ch.nodeValue ) == 'string' )
        {
          var tn = doc.createTextNode ( ch.nodeValue ) ;
          newNode.appendChild ( tn ) ;
        }
      }
      else
      if ( ch.nodeType == DOM_ELEMENT_NODE )
      {
        this._addDuplicate ( ch, doc, newNode ) ;
      }
      else
      if ( ch.nodeType == DOM_CDATA_SECTION_NODE )
      {
        if ( typeof ( ch.nodeValue ) == 'string' )
        {
          var tn = doc.createCDATASection ( ch.nodeValue ) ;
          newNode.appendChild ( tn ) ;
        }
      }
      ch = ch.nextSibling ;
    }
  },
  getAttributeNames: function()
  {
    var a = [] ;
    if ( ! this.domRoot.attributes || ! this.domRoot.attributes.length ) return a ;
    var doc = this.getDocumentNode() ;
    for ( i = 0 ; i < this.domRoot.attributes.length ; i++ )
    {
      if ( doc === document )
      {
        if ( ! this.domRoot.attributes[i].nodeValue ) continue ;
      }
      if ( this.domRoot.attributes[i].nodeValue == "inherit" ) continue ;
      if ( this.domRoot.attributes[i].nodeName == "xNodeName" ) continue ;
      if ( typeof ( this.domRoot.attributes[i].nodeValue ) != 'string' ) continue ;
      a.push ( this.domRoot.attributes[i].nodeName ) ;
    }
    return a ;
  },
  getAttributeValues: function()
  {
    var a = [] ;
    if ( ! this.domRoot.attributes || ! this.domRoot.attributes.length ) return a ;
    var doc = this.getDocumentNode() ;
    for ( i = 0 ; i < this.domRoot.attributes.length ; i++ )
    {
      if ( doc === document )
      {
        if ( ! this.domRoot.attributes[i].nodeValue ) continue ;
      }
      if ( this.domRoot.attributes[i].nodeValue == "inherit" ) continue ;
      if ( this.domRoot.attributes[i].nodeName == "xNodeName" ) continue ;
      if ( typeof ( this.domRoot.attributes[i].nodeValue ) != 'string' ) continue ;
      a.push ( this.domRoot.attributes[i].nodeValue ) ;
    }
    return a ;
  },
  toString: function ( prettyPrint )
  {
    return this._toString ( this.domRoot, true, prettyPrint ) ;
  },
  _toString: function ( xmlDom, first, prettyPrint, indent )
  {
    if ( ! xmlDom ) return ;
    if ( first ) indent = "" ;
    else
    if ( prettyPrint )
    {
      indent += "  " ;
    }
    var nn = xmlDom.nodeName ;

    if ( xmlDom.nodeType == DOM_DOCUMENT_NODE )
    {
      return "<xml></xml>" ;
    }
    if ( first )
    {
      if ( this.realName ) nn = this.realName ;
    }
    if ( xmlDom.xNodeName )
    {
      nn = xmlDom.xNodeName ;
    }
    else
    if ( xmlDom.getAttribute ( "xNodeName" ) )
    {
      nn = xmlDom.getAttribute ( "xNodeName" ) ;
    }
    var ch = xmlDom.firstChild ;
    var s = indent + "<" + nn ;
    if ( xmlDom.attributes )
    {
      if ( xmlDom.attributes.length > 0 )
      {
        var doc = this.getDocumentNode() ;
        for ( i = 0 ; i < xmlDom.attributes.length ; i++ )
        {
          if ( doc === document )
          {
            if ( ! xmlDom.attributes[i].nodeValue ) continue ;
	         }
          if ( xmlDom.attributes[i].nodeValue == "inherit" ) continue ;
          if ( xmlDom.attributes[i].nodeName == "xNodeName" ) continue ;
          if ( typeof ( xmlDom.attributes[i].nodeValue ) != 'string' ) continue ;
          if ( xmlDom.attributes[i].nodeValue.indexOf ( "'" ) >= 0 )
          {
            s += " " + xmlDom.attributes[i].nodeName + "=\""
               + xmlDom.attributes[i].nodeValue
               + "\""
               ;
          }
          else
          {
            s += " " + xmlDom.attributes[i].nodeName + "='"
               + xmlDom.attributes[i].nodeValue
               + "'"
               ;
          }
        }
      }
    }
    var isEmpty = true ;
    var hasText = false ;
    var startTagDone = false ;
    if ( ch )
    {
      if ( ch.nodeType == DOM_ELEMENT_NODE ) { s += ">\n" ; isEmpty = false ; startTagDone = true ; }
      else
      if ( ch.nodeType == DOM_TEXT_NODE && ch.nodeValue && ch.nodeValue == "\n" ) { s += ">\n" ; isEmpty = false ; startTagDone = true ; }
    }
    var s2 = "" ;
    while ( ch )
    {
      if ( ch.nodeType == DOM_ELEMENT_NODE )
      {
        if ( ! startTagDone ) { s += ">" ; startTagDone = true ; }
        s += this._toString ( ch, false, prettyPrint, indent ) ;
      }
      else
      if ( ch.nodeType == DOM_TEXT_NODE )
      {
        if ( ch.nodeValue && ch.nodeValue != "\n" )
        {
          if ( ! startTagDone ) { s += ">" ; startTagDone = true ; }
          hasText = true ;
          var str = ch.nodeValue ;
          if ( str.indexOf ( "<![CDATA[" ) == 0 )
          {
            s += str ;
          }
          else
          {
            var s3 = str.replace ( /</g, "&lt;" ).replace ( />/g, "&gt;" ).replace ( /&/g, "&amp;" ) ;
            s += s3 ;
          }
        }
      }
      else
      if ( ch.nodeType == DOM_CDATA_SECTION_NODE )
      {
        if ( ! startTagDone ) { s += ">" ; startTagDone = true ; }
        hasText = true ;
        s += "<![CDATA[" + ch.nodeValue + "]]>" ;
      }
      ch = ch.nextSibling ;
    }
    if ( isEmpty )
    {
      if ( hasText ) s += "</" + nn + ">\n" ;
      else           s += "/>\n" ;
    }
    else s += indent + "</" + nn + ">\n" ;
    return s ;
  },
  ensureElement: function ( path, value )
  {
    return this.ensureXml ( path, value ) ;
  },
  ensureXml: function ( path, value )
  {
    var e = this.getXml ( path ) ;
    if ( e ) return e ;
    e = this.addXml ( path, value ) ;
    return e ;
  },
  getParent: function()
  {
    if ( ! this.domRoot.parentNode ) return null ;
    if ( this.domRoot.parentNode.nodeType == DOM_DOCUMENT_NODE ) return null ;
    return new TXml ( this.domRoot.parentNode ) ;
  },
  remove: function ( path )
  {
    if ( path )
    {
      var e = this.getXml ( path ) ;
      if ( e ) e.remove() ;
    }
    else
    {
      this.domRoot.parentNode.removeChild ( this.domRoot ) ;
    }
  },
  removeAllChildren: function()
  {
    var ch = this.domRoot.firstChild ;
    while ( ch )
    {
      var ch2 = ch.nextSibling ;
      this.domRoot.removeChild ( ch ) ;
      ch = ch2 ;
    }
  },
  setName: function ( name )
  {
    if ( ! name ) return ;
    this.realName = name ;
    if ( this.domRoot )
    {
      if ( TSys.isIE() ) this.addAttribute ( "xNodeName", name ) ;
      else this.domRoot.xNodeName = name ;
    }
  },
  getDocumentNode: function()
  {
    var ch = this.domRoot ;
    while ( ch )
    {
      if ( ch.nodeType == DOM_DOCUMENT_NODE )
      {
        return ch ;
      }
      ch = ch.parentNode ;
    }
    return document ;
  },
  setContent: function ( value )
  {
    if ( typeof ( value ) == 'undefined' ) return ;
    if ( typeof ( value ) == 'number' ) value = String ( value ) ;
    var doc = document ;

    var ch = this.domRoot ;
    while ( ch )
    {
      if ( ch.nodeType == DOM_DOCUMENT_NODE )
      {
        doc = ch ;
        break ;
      }
      ch = ch.parentNode ;
    }
    var s = value ;
    if ( TSys.isDate ( value ) )
    {
      s = DateUtils.formatDate ( value, "yyyyMMddHHmmss" ) ;
    }
    var firstChild = this.domRoot.firstChild ;
    if ( ! firstChild )
    {
      var tn = doc.createTextNode ( s ) ;
      this.domRoot.appendChild ( tn ) ;
      return ;
    }

    if ( firstChild.nodeType == DOM_TEXT_NODE )
    {
      var t = doc.createTextNode ( s ) ;
      this.domRoot.replaceChild ( t, firstChild ) ;
    }
    else
    if ( firstChild.nodeType == DOM_CDATA_SECTION_NODE )
    {
      var t = doc.createCDATASection ( s ) ;
      this.domRoot.replaceChild ( t, firstChild ) ;
    }
    else
    {
      var t = doc.createTextNode ( s ) ;
      this.domRoot.insertBefore ( t, firstChild ) ;
    }
    return this.domRoot ;
  },
  isCDATA: function()
  {
    if ( ! this.domRoot ) return false ;
    if ( ! this.domRoot.firstCHild ) return false ;
    return this.domRoot.firstChild.nodeType == DOM_CDATA_SECTION_NODE ;
  },
  isEmpty: function()
  {
    var ch = this.domRoot.firstChild ;
    while ( ch )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) { ch = ch.nextSibling ; continue ; }
      return false ;
    }
    return true ;
  },
  size: function()
  {
    var n = 0 ;
    var ch = this.domRoot.firstChild ;
    while ( ch )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) { ch = ch.nextSibling ; continue ; }
      n++ ;
      ch = ch.nextSibling ;
    }
    return n ;
  },
  add: function ( path, value )
  {
    return this.addXml ( path, value ) ;
  },
  addXml: function ( path, value )
  {
    var attr = null ;
    if ( value && typeof value === 'object' )
    {
      if ( ! TSys.isDate ( value ) )
      {
        attr = value ;
        value = undefined ;
      }
    }
    var d = this.addDom ( path, value, DOM_TEXT_NODE ) ;
    if ( d instanceof TXml )
    {
    }
    else
    {
      d = new TXml ( d ) ;
    }
    if ( attr )
    {
      for ( var key in attr )
      {
        d.addAttribute ( key, attr[key] ) ;
      }
    }
    return d ;
  },
  addCDATA: function ( path, value )
  {
    if ( path && typeof ( value ) != 'string' && typeof ( value ) != 'number' )
    {
      var t = this.getDocumentNode().createCDATASection ( String ( path ) ) ;
      this.getDom().appendChild ( t ) ;
      return t ;
    }
    return this.addDom ( path, value, DOM_CDATA_SECTION_NODE ) ;
  },
  addText: function ( value )
  {
    if ( typeof ( value ) == 'string' || typeof ( value ) == 'number' )
    {
      var t = this.getDocumentNode().createTextNode ( String ( value ) ) ;
      this.getDom().appendChild ( t ) ;
      return t ;
    }
  },
  addDom: function ( path, value, domValueType )
  {
    if ( path instanceof TXml )
    {
      if ( this.getDocumentNode() != path.getDocumentNode() )
      {
        this.addDuplicate ( path ) ;
      }
      else
      {
        this.getDom().appendChild ( path.getDom() ) ;
      }
      return path ;
    }
    if ( typeof ( domValueType ) != 'number' ) domValueType = DOM_TEXT_NODE ;
    var targetElement = this.domRoot ;
    var pathArrayIndex = 0 ;
    var pathArray = null ;
    if ( path.indexOf ( "/" ) > 0 )
    {
      pathArray = path.split ( '/' ) ;
    }
    else
    {
      pathArray = [ path ] ;
    }
    if ( path.indexOf ( "../" ) == 0 )
    {
      pathArrayIndex = 1 ;
      targetElement = targetElement.parentNode ;
    }

    var doc = document ;
    var ch = this.domRoot ;
    while ( ch )
    {
      if ( ch.nodeType == DOM_DOCUMENT_NODE )
      {
        doc = ch ;
        break ;
      }
      ch = ch.parentNode ;
    }
    if ( pathArray.length == 1 )
    {
      var e = doc.createElement ( pathArray[0] ) ;
      var t = null ;
      if ( typeof ( value ) == 'string' )
      {
        if ( domValueType == DOM_TEXT_NODE )
          t = doc.createTextNode ( value ) ;
        if ( domValueType == DOM_CDATA_SECTION_NODE )
          t = doc.createCDATASection ( value ) ;
      }
      else
      if ( typeof ( value ) == 'number' )
      {
        if ( domValueType == DOM_TEXT_NODE )
          t = doc.createTextNode ( String ( value ) ) ;
        if ( domValueType == DOM_CDATA_SECTION_NODE )
          t = doc.createCDATASection ( String ( value ) ) ;
      }
      else
      if ( TSys.isDate ( value ) )
      {
        var s = DateUtils.formatDate ( value, "yyyyMMddHHmmss" ) ;
        t = doc.createTextNode ( s ) ;
      }
      if ( t ) e.appendChild ( t ) ;
      if ( ! TSys.isIE() )
      {
        e.xNodeName = pathArray[0] ;
      }
      targetElement.appendChild  ( e ) ;
      return e ;
    }
    return this._addDom ( doc, targetElement, pathArray, pathArrayIndex, value, domValueType ) ;
  },
  _addDom: function ( doc, parent, pathArray, pathArrayIndex, value, domValueType )
  {
    var name = pathArray[pathArrayIndex] ;
    if ( name === ".." )
    {
      return this._addDom ( doc, parent.parentNode, pathArray, pathArrayIndex + 1, value, domValueType ) ;
    }
    var NAME = name.toUpperCase() ;
    var ch = parent.firstChild ;

    var sibling = null ;
    if ( pathArrayIndex < pathArray.length - 1 )
    {
      while ( ch )
      {
        if ( ch.nodeType != DOM_ELEMENT_NODE ) { ch = ch.nextSibling ; continue ; }
        if ( ch.nodeName && ch.nodeName.toUpperCase() == NAME )
        {
          sibling = ch ;
          break ;
        }
        ch = ch.nextSibling ;
      }
      if ( ! sibling )
      {
        sibling = doc.createElement ( name ) ;
        if ( ! TSys.isIE() )
        {
          sibling.xNodeName = name ;
        }
        parent.appendChild  ( sibling ) ;
      }
      return this._addDom ( doc, sibling, pathArray, pathArrayIndex + 1, value, domValueType ) ;
    }
    sibling = doc.createElement ( name ) ;
    var t = null ;
    if ( typeof ( value ) == 'string' )
    {
      if ( domValueType == DOM_TEXT_NODE )
        t = doc.createTextNode ( value ) ;
      if ( domValueType == DOM_CDATA_SECTION_NODE )
        t = doc.createCDATASection ( value ) ;
    }
    else
    if ( typeof ( value ) == 'number' )
    {
      if ( domValueType == DOM_TEXT_NODE )
        t = doc.createTextNode ( String ( value ) ) ;
      if ( domValueType == DOM_CDATA_SECTION_NODE )
        t = doc.createCDATASection ( String ( value ) ) ;
    }
    else
    if ( TSys.isDate ( value ) )
    {
      var s = DateUtils.formatDate ( value, "yyyyMMddHHmmss" ) ;
      t = doc.createTextNode ( s ) ;
    }
    if ( t ) sibling.appendChild ( t ) ;
    if ( ! TSys.isIE() )
    {
      sibling.xNodeName = name ;
    }
    parent.appendChild ( sibling ) ;
    return sibling ;
  },
  getAttribute: function ( name, def )
  {
    var a  = this.domRoot.getAttribute ( name ) ;
    if ( a ) return a ;
    return def ;
  },
  getIntAttribute: function ( name, def )
  {
    var a  = this.domRoot.getAttribute ( name ) ;
    if ( a )
    {
      var i = parseInt ( a ) ;
      if ( ! isNaN ( i ) ) return i ;
    }
    if ( typeof ( def ) == 'number' ) return def ;
    return NaN ;
  },
  getBoolAttribute: function ( name, def )
  {
    var a  = this.domRoot.getAttribute ( name ) ;
    if ( ! a )
    {
      if ( def ) return true ;
      else       return false ;
    }
    if ( a == "true" ) return true ;
    return false ;
  },
  getFloatAttribute: function ( name, def )
  {
    var a  = this.domRoot.getAttribute ( name ) ;
    if ( a )
    {
      var i = parseFloat ( a ) ;
      if ( ! isNaN ( i ) ) return i ;
    }
    if ( typeof ( def ) == 'number' ) return def ;
    return NaN ;
  },
  addAttribute: function ( name, value )
  {
    var doc = this.getDocumentNode() ; //document ;
    var attr = doc.createAttribute ( name ) ;
    attr.value = "" + value ;
    this.domRoot.setAttributeNode ( attr ) ;
  },
  xmlAt: function ( index )
  {
    var d = this.domAt ( index ) ;
    if ( d ) return new TXml ( d ) ;
    return null ;
  },
  domAt: function ( index )
  {
    if ( typeof ( index ) != 'number' ) index = 0 ;
    for ( var ch = this.domRoot.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      index -- ;
      if ( index < 0 ) return ch ;
    }
    return null ;
  },
  get: function ( path )
  {
    return this.getXml ( path ) ;
  },
  getXml: function ( path )
  {
    if ( ! path ) return this ;
    var dom = this.getDom ( path ) ;
    if ( ! dom ) return null ;
    return new TXml ( dom ) ;
  },
  getDom: function ( path )
  {
    if ( ! path ) return this.domRoot ;
    var pathArray = path.split ( '/' ) ;
    return this._getDom ( this.domRoot, pathArray, 0 ) ;
  },
  _getDom: function ( xmlDom, pathArray, index )
  {
    var name = pathArray[index] ;
    if ( name == ".." )
    {
      return arguments.callee.call ( this, xmlDom.parentNode, pathArray, index + 1 ) ;
    }
    if ( name == "." )
    {
      return arguments.callee.call ( this, xmlDom, pathArray, index + 1 ) ;
    }
    var NAME = name.toUpperCase() ;
    var counter = NaN ;
    var getLast = false ;
    if ( name.indexOf ( '[' ) > 0 )
    {
      var n1 = name.substring ( name.indexOf ( '[' ) + 1 ) ;
      if ( n1.indexOf ( ']' ) > 0 )
      {
        n1 = n1.substring ( 0, n1.indexOf ( ']' ) ) ;
        if ( n1 == "last()" )
        {
          getLast = true ;
        }
        else
        {
          counter = parseInt ( n1 ) ;
          if ( counter <= 0 ) counter = NaN ;
        }
      }
      name = name.substring ( 0, name.indexOf ( '[' ) ) ;
      NAME = name.toUpperCase() ;
    }
    var lastFoundElement = null ;
    for ( var ch = xmlDom.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      var found = false ;
      if ( ch.nodeName && ch.nodeName.toUpperCase() == NAME )
      {
        found = true ;
      }
      if ( ! found && ch.xNodeName == name ) found = true ;
      if ( ! found && ch.attributes["xNodeName"] )
      {
        if ( name == ch.attributes["xNodeName"].nodeName ) found = true ;
      }
      if ( ! found && ch.getAttributeNode("xNodeName") )
      {
        if ( name == ch.getAttributeNode("xNodeName").nodeValue ) found = true ;
      }
      if ( found )
      {
        lastFoundElement = ch ;
        if ( ! isNaN ( counter ) )
        {
          counter-- ;
          if ( counter > 0 )
          {
            continue ;
          }
        }
        if ( index == pathArray.length - 1 )
        {
          if ( ! getLast )
          {
            return ch ;
          }
        }
        return arguments.callee.call(this, ch, pathArray, index + 1 ) ;
      }
    }
    return lastFoundElement ;
  },
  getXmlByContent: function ( contentStr )
  {
    var e = this.getDomByContent ( str ) ;
    if ( ! e ) return null ;
    return new TXml ( e ) ;
  },
  getXmlByAttribute: function ( attrName, attrValue )
  {
    var e = this.getDomByAttribute ( attrName, attrValue ) ;
    if ( ! e ) return null ;
    return new TXml ( e ) ;
  },
  getDomByContent: function ( str )
  {
    if ( typeof ( str ) == 'number' ) str = String ( str ) ;
    for ( var ch = this.domRoot.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.firstChild && ch.firstChild.nodeType == DOM_TEXT_NODE )
      {
        if ( ch.firstChild.nodeValue == str ) return ch ;
      }
    }
  },
  getDomByAttribute: function ( attrName, attrValue )
  {
    for ( var ch = this.domRoot.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      var a = ch.getAttribute ( attrName ) ;
      if ( a )
      {
        if ( ! attrValue ) return ch ;
        if ( a == attrValue ) return ch ;
      }
    }
  },
  getContent: function ( path, def )
  {
    if ( typeof ( def ) != 'string' ) def = "" ;
    if ( ! path || path == '.' )
    {
      if ( ! this.domRoot.firstChild ) return def ;
//log ( "this.domRoot.nodeName: " + this.domRoot.nodeName ) ;
//log ( "typeof ( this.domRoot.firstChild.nodeValue ): " + typeof ( this.domRoot.firstChild.nodeValue ) ) ;
//log ( "this.domRoot.firstChild.nodeValue: >" + this.domRoot.firstChild.nodeValue + "<" ) ;
      if ( typeof ( this.domRoot.firstChild.nodeValue ) != 'string' ) return def ;
      return this.domRoot.firstChild.nodeValue ;
    }
    var x = this.getDom ( path ) ;
    if ( ! x ) return def ;
    if ( ! x.firstChild ) return def ;
    if ( x.firstChild )
    {
      var value = x.firstChild.nodeValue ;
      if ( typeof ( value ) != 'string' ) return def ;
      return value ;
    }
    return def ;
  },
  getInt: function ( path, def )
  {
    var s = null ;
    if ( typeof ( path ) == 'number' )
    {
      s = this.getContent() ;
      def = path ;
    }
    else s = this.getContent ( path ) ;
    if ( ! s )
    {
      if ( typeof ( def ) == 'number' ) return def ;
      else       return NaN ;
    }
    var i = NaN ;
    i = parseInt ( s ) ;
    if ( isNaN ( i ) )
    {
      if ( typeof ( def ) == 'number' ) return def ;
      else       return NaN ;
    }
    return i ;
  },
  getFloat: function ( path, def )
  {
    var s = null ;
    if ( typeof ( path ) == 'number' )
    {
      s = this.getContent() ;
      def = path ;
    }
    else s = this.getContent ( path ) ;
    if ( ! s )
    {
      if ( typeof ( def ) == 'number' ) return def ;
      else       return NaN ;
    }
    var i = NaN ;
    i = parseFloat ( s ) ;
    if ( isNaN ( i ) )
    {
      if ( typeof ( def ) == 'number' ) return def ;
      else       return NaN ;
    }
    return i ;
  },
  getBool: function ( path, def )
  {
    var s = null ;
    if ( typeof ( path ) == 'boolean' )
    {
      s = this.getContent() ;
      def = path ;
    }
    else s = this.getContent ( path ) ;
    if ( ! s )
    {
      if ( def ) return true ;
      else       return false ;
    }
    if ( s == "true" ) return true ;
    return false ;
  },
  getDate: function ( path, def )
  {
    var s = null ;
    if ( TSys.isDate ( path ) )
    {
      s = this.getContent() ;
      def = path ;
    }
    else s = this.getContent ( path ) ;
    var s = this.getContent ( path ) ;
    if ( ! s )
    {
      if ( def ) return def ;
      else       return false ;
    }
    if ( !s ) return null ;
    return DateUtils.parseDate ( s ) ;
  },
  elements: function ( visitor )
  {
    if ( typeof (  visitor ) == 'function' )
    {
      if ( ! this.domRoot ) return ;
      for ( var ch = this.domRoot.firstChild ; ch ; ch = ch.nextSibling )
      {
        if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
        var rc = visitor ( new TXml ( ch ) ) ;
        if ( rc === false ) break ;
      }
    }
    else
    {
      return new TXEnum ( this.domRoot, DOM_ELEMENT_NODE ) ;
    }
  },
  children: function ( visitor )
  {
    if ( typeof (  visitor ) == 'function' )
    {
      if ( ! this.domRoot ) return ;
      for ( var ch = this.domRoot.firstChild ; ch ; ch = ch.nextSibling )
      {
        var rc = visitor ( ch ) ;
        if ( rc === false ) break ;
      }
    }
    else
    {
      return new TXEnum ( this.domRoot ) ;
    }
  },
  duplicate: function()
  {
    var x = new TXml ( this.getName() ) ;
    x.copyChildrenFrom ( this ) ;
    return x ;
  },
  copyChildrenFrom: function ( xSource )
  {
    var en = xSource.children() ;
    while ( en.hasNext() )
    {
      this.addDuplicate ( en.next() ) ;
    }
  },
  copyChildrenTo: function ( xTarget )
  {
    var en = this.children() ;
    while ( en.hasNext() )
    {
      xtarget.addDuplicate ( en.next() ) ;
    }
  },
  copyAttributesFrom: function ( domSource )
  {
    if ( ! domSource ) return ;
    if ( domSource.jsClassName == "TXml" ) domSource = domSource.getDom() ;
    else
    if ( domSource.nodeType == DOM_DOCUMENT_NODE )
    {
      domSource = new TXml ( domSource ).getDom() ;
    }

    var a = domSource.attributes ;
    if ( ! a || a.length == 0 ) return ;
    var doc = this.getDocumentNode() ;
    for ( i = 0 ; i < a.length ; i++ )
    {
      if ( ! a[i].nodeValue ) continue ;
      if ( a[i].nodeValue == "inherit" ) continue ;
      if ( a[i].nodeName == "xNodeName" ) continue ;
      var attr = doc.createAttribute ( a[i].nodeName ) ;
      attr.value = a[i].nodeValue ;
      this.domRoot.setAttributeNode ( attr ) ;
    }
  },
  getEnum: function ( path, name ) //TODO: define: path, name -> name, path
  {
    if ( typeof ( path ) == 'number' )
    {
      return new TXEnum ( this.domRoot, path ) ;
    }
    if ( ! path && ! name )
    {
      return new TXEnum ( this.domRoot ) ;
    }
    if ( ! name ) // path is to be read as tag-name
    {
      var pos = path.lastIndexOf ( '/' ) ;
      if ( pos > 0 )
      {
        name = path.substring ( pos + 1 ) ;
        path = path.substring ( 0, pos ) ;
      }
      else return new TXEnum ( this.getDom(), path ) ;
    }
    var x = this.getDom ( path ) ;
    return new TXEnum ( x, name ) ;
  },
  getXmlByName: function ( name )
  {
    var dom = this._getDomByName ( this.domRoot, name ) ;
    if ( dom ) return new TXml ( dom ) ;
    return null ;
  },
  getXmlById: function ( id )
  {
    var e = this._getDomById ( this.domRoot, id ) ;
    if ( ! e ) return null ;
    return new TXml ( e ) ;
  },
  getDomByIdOrName: function ( idOrName )
  {
    return this._getDomByIdOrName ( this.domRoot, idOrName ) ;
  },
  _getDomByIdOrName: function ( xmlDom, idOrName )
  {
    if ( xmlDom.id == idOrName ) return xmlDom ;
    if ( xmlDom.name == idOrName ) return xmlDom ;
    for ( var ch = xmlDom.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      if ( ch.getAttribute && ch.getAttribute ( "id" ) == idOrName )
      {
        if ( ch.getAttribute ( "id" ) == idOrName )
        {
          return ch ;
        }
      }
      else
      if ( ch.id == idOrName )
      {
        return ch ;
      }
      else
      if ( ch.name == idOrName )
      {
        return ch ;
      }
      else
      if ( ch.getAttribute && ch.getAttribute ( "name" ) == idOrName )
      {
        return ch ;
      }
      if ( ch.firstChild )
      {
        var cch = this._getDomByIdOrName ( ch, idOrName ) ;
        if ( cch ) return cch ;
      }
    }
    return null ;
  },
  getDomById: function ( id )
  {
    return this._getDomById ( this.domRoot, id ) ;
  },
  _getDomById: function ( xmlDom, id )
  {
    if ( xmlDom.id == id ) return xmlDom ;
    for ( var ch = xmlDom.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      if ( ! ch.id && ch.getAttribute )
      {
        if ( ch.getAttribute ( "id" ) == id )
        {
          return ch ;
        }
      }
      else
      if ( ch.id == id )
      {
        return ch ;
      }
      if ( ch.firstChild )
      {
        var cch = this._getDomById ( ch, id ) ;
        if ( cch ) return cch ;
      }
    }
    return null ;
  },
  getDomByName: function ( name )
  {
    return this._getDomByName ( this.domRoot, name ) ;
  },
  _getDomByName: function ( xmlDom, name )
  {
    if ( xmlDom.name == name ) return xmlDom ;
    for ( var ch = xmlDom.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ! ch.name && ch.getAttribute )
      {
        if ( ch.getAttribute ( "name" ) == name )
        {
          return ch ;
        }
      }
      else
      if ( ch.name == name )
      {
        return ch ;
      }

      if ( ch.firstChild )
      {
        var cch = this._getDomByName ( ch, name ) ;
        if ( cch ) return cch ;
      }
    }
    return null ;
  },
  getXmlByNameUp: function ( name )
  {
    var dom = this._getDomByNameUp ( this.domRoot, name ) ;
    if ( dom ) return new TXml ( dom ) ;
    return null ;
  },
  getDomByNameUp: function ( name )
  {
    return this._getDomByNameUp ( this.domRoot, name ) ;
  },
  _getDomByNameUp: function ( xmlDom, name )
  {
    for ( var parent = xmlDom ; parent ; parent = parent.parentNode )
    {
      if ( ! parent.name && parent.getAttribute )
      {
        if ( parent.getAttribute ( "name" ) == name )
        {
          return parent ;
        }
      }
      else
      if ( parent.name && parent.name == name )
      {
        return parent ;
      }
    }
    return null ;
  },
  getXmlByClassName: function ( name )
  {
    var dom = this._getDomByClassName ( this.domRoot, name ) ;
    if ( dom ) return new TXml ( dom ) ;
    return null ;
  },
  getDomByClassName: function ( name )
  {
    return this._getDomByClassName ( this.domRoot, name ) ;
  },
  _getDomByClassName: function ( xmlDom, name )
  {
    for  ( var ch = xmlDom.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.xClassName == name ) return ch ;
      if ( ch.className == name ) return ch ;
      if ( ch.firstChild )
      {
        var cch = this._getDomByClassName ( ch, name ) ;
        if ( cch ) return cch ;
      }
    }
    return null ;
  },
  getXmlByTagName: function ( name )
  {
    name = name.toUpperCase() ;
    var dom = this._getDomByTagName ( this.domRoot, name ) ;
    if ( dom ) return new TXml ( dom ) ;
    return null ;
  },
  getDomByTagName: function ( name )
  {
    name = name.toUpperCase() ;
    return this._getDomByTagName ( this.domRoot, name ) ;
  },
  _getDomByTagName: function ( xmlDom, name )
  {
    for  ( var ch = xmlDom.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeName.toUpperCase() == name ) return ch ;
      if ( ch.firstChild )
      {
        var cch = this._getDomByTagName ( ch, name ) ;
        if ( cch ) return cch ;
      }
    }
    return null ;
  },
  getName: function()
  {
    if ( this.realName ) return this.realName ;
    if ( this.domRoot.xNodeName ) return this.domRoot.xNodeName ;
    if ( this.domRoot.attributes["xNodeName"] )
      return this.domRoot.attributes["xNodeName"].nodeName ;
    if ( this.domRoot.getAttributeNode("xNodeName") )
      return this.domRoot.getAttributeNode("xNodeName").nodeValue ;
    return this.domRoot.nodeName ;
  }
};
TXml.prototype.removeAttribute = function ( name )
{
  if ( ! name ) return ;
  var an = this.domRoot.getAttributeNode ( name ) ;
  if ( an )
  {
    this.domRoot.removeAttributeNode ( an ) ;
    return true ;
  }
  return false ;
};
TXml.prototype.resetDate = function ( hDate )
{
  if ( typeof hDate.resettable === 'boolean' && ! hDate.resettable )
  {
    return ;
  }
  if (  hDate.mandatory
     || ( typeof ( hDate.xdefault ) == 'string' && hDate.xdefault != 'true' )
     )
  {
    hDate.hDay.selectedIndex = 0 ;
    hDate.hMonth.selectedIndex = 0 ;
    hDate.hYear.selectedIndex = 0 ;
    if ( hDate.xClassName == "DateTime" )
    {
      if ( hDate.hHour ) hDate.hHour.value = "" ;
      if ( hDate.hMinute ) hDate.hMinute.value = "" ;
      if ( hDate.hSecond ) hDate.hSecond.value = "" ;
    }
  }
  else
  if ( TSys.isDate ( hDate.defaultDate ) )
  {
    if ( hDate.defaultDateOffsetMillis )
    {
      new TDate ( hDate ).setDate ( new Date ( new Date().getTime() + hDate.defaultDateOffsetMillis ) ) ;
    }
    else
    {
      new TDate ( hDate ).setDate ( new Date() ) ;
    }
  }
};
TXml.prototype.getDateStringFromDate = function ( hDate )
{
  var day = hDate.hDay.selectedIndex ;
  if ( ! hDate.showDayOfMonth ) day = 0 ;
  var month = hDate.hMonth.selectedIndex ;
  if ( hDate.xdefault )
  {
    if ( day == 0 || month == 0 || hDate.hYear.selectedIndex == 0 )
    {
      if (  ( hDate.xClassName == "Date" && hDate.xdefault.length == 8 )
         || ( hDate.xClassName == "DateTime" && hDate.xdefault.length == 14 )
         )
      {
        return hDate.xdefault ;
      }
      return null ;
    }
    day-- ;
    month-- ;
  }
  var retStr = null ;
  if ( hDate.xClassName == "Date" )
  {
    if ( hDate.defaultDayOfMonth )
    {
      if ( hDate.defaultDayOfMonth == "first" ) day = 0 ;
      else
      if ( hDate.defaultDayOfMonth == "last" )
      {
        var n = DateUtils.getMaxDays ( parseInt ( hDate.hYear.value ), month ) ;
	day = n - 1 ;
      }
      else
      {
        var i = parseInt ( hDate.defaultDayOfMonth ) ;
	if ( isNaN ( i ) )
	{
          TSys.log ( "Invalid default-day-of-month=" + hDate.defaultDayOfMonth + " in " + hDate.name ) ;
	  i = 1 ;
	}
        var n = DateUtils.getMaxDays ( parseInt ( hDate.hYear.value ), month ) ;
	if ( i < 1 || i > n )
	{
          TSys.log ( "Invalid default-day-of-month=" + hDate.defaultDayOfMonth + " in " + hDate.name ) ;
	  i = 1 ;
	}
	i-- ;
      }
    }
    else
    {
    }
    retStr = hDate.hYear.value + TSys.LZ ( month + 1 ) + TSys.LZ ( day + 1 ) ;
    if ( hDate.defaultTime ) retStr += hDate.defaultTime ;
  }
  else
  if ( hDate.xClassName == "DateTime" )
  {
    var h = hDate.hHour.value ;
    var m = hDate.hMinute.value ;
    var s = hDate.hSecond ? hDate.hSecond.value : '0' ;

    if ( h.length >= 2 )
    {
      while ( h.indexOf ( '0' ) == 0 && h.length > 1 )
      {
        h = h.substring ( 1 ) ;
      }
    }
    if ( m.length >= 2 )
    {
      while ( m.indexOf ( '0' ) == 0 && m.length > 1 )
      {
        m = m.substring ( 1 ) ;
      }
    }
    if ( s.length >= 2 )
    {
      while ( s.indexOf ( '0' ) == 0 && s.length > 1 )
      {
        s = s.substring ( 1 ) ;
      }
    }
    var h = parseInt ( h ) ;
    var m = parseInt ( m ) ;
    var s = parseInt ( s ) ;

    if ( isNaN ( h ) ) h = 0 ;
    if ( isNaN ( m ) ) m = 0 ;
    if ( isNaN ( s ) ) s = 0 ;
    if ( hDate.minDate )
    {
      h = Math.max ( h, hDate.minDate.getHours() ) ;
      m = Math.max ( m, hDate.minDate.getMinutes() ) ;
      s = Math.max ( s, hDate.minDate.getSeconds() ) ;
    }
    retStr = hDate.hYear.value
           + TSys.LZ ( month + 1 )
           + TSys.LZ ( day + 1 )
           + TSys.LZ ( h )
           + TSys.LZ ( m )
           + TSys.LZ ( s )
           ;
  }
  var formatOut = hDate.formatOut ;
  if ( retStr != null && formatOut )
  {
    var date = DateUtils.parseDate ( retStr ) ;
    retStr = DateUtils.formatDate ( date, formatOut ) ;
  }
  return retStr ;
};
TXml.prototype.getDateFromDate = function ( hDate )
{
  var day = hDate.hDay.selectedIndex ;
  if ( ! hDate.showDayOfMonth ) day = 0 ;
  var month = hDate.hMonth.selectedIndex ;
  if ( hDate.xdefault )
  {
    if ( day == 0 || month == 0 || hDate.hYear.selectedIndex == 0 )
    {
      if (  ( hDate.xClassName == "Date" && hDate.xdefault.length == 8 )
         || ( hDate.xClassName == "DateTime" && hDate.xdefault.length == 14 )
         )
      {
        return DateUtils.parseDate ( hDate.xdefault ) ;
      }
      return null ;
    }
    day-- ;
    month-- ;
  }
  var retStr = null ;
  if ( hDate.xClassName == "Date" )
  {
    retStr = hDate.hYear.value + TSys.LZ ( month + 1 ) + TSys.LZ ( day + 1 ) ;
  }
  else
  if ( hDate.xClassName == "DateTime" )
  {
    var h = hDate.hHour.value ;
    var m = hDate.hMinute.value ;
    var s = hDate.hSecond ? hDate.hSecond.value : '0' ;

    if ( h.length >= 2 )
    {
      while ( h.indexOf ( '0' ) == 0 && h.length > 1 )
      {
        h = h.substring ( 1 ) ;
      }
    }
    if ( m.length >= 2 )
    {
      while ( m.indexOf ( '0' ) == 0 && m.length > 1 )
      {
        m = m.substring ( 1 ) ;
      }
    }
    if ( s.length >= 2 )
    {
      while ( s.indexOf ( '0' ) == 0 && s.length > 1 )
      {
        s = s.substring ( 1 ) ;
      }
    }
    h = parseInt ( h ) ;
    m = parseInt ( m ) ;
    s = parseInt ( s ) ;
    if ( isNaN ( h ) ) h = 0 ;
    if ( isNaN ( m ) ) m = 0 ;
    if ( isNaN ( s ) ) s = 0 ;
    retStr = hDate.hYear.value
           + TSys.LZ ( month + 1 )
           + TSys.LZ ( day + 1 )
           + TSys.LZ ( h )
           + TSys.LZ ( m )
           + TSys.LZ ( s )
           ;
  }
  return DateUtils.parseDate ( retStr ) ;
};
TXml.prototype.getValues = function ( xml, dom, recursive )
{ 
  if ( ! xml )
  {
    xml = new TXml() ;
    xml.setName ( "xml" ) ;
  }
  var returnXml = xml ;
  if ( ! dom ) dom = this.domRoot ;
  if ( dom.path )
  {
    var pXml = xml.ensureXml ( dom.path ) ;
    xml = pXml ;
  }
  if ( ! recursive )
  {
    if ( ! dom.jsPeergetValuesActive )
    {
      if ( dom.jsPeer && dom.jsPeer.getValues )
      {
        dom.jsPeergetValuesActive = true ;
        dom.jsPeer.getValues ( xml ) ;
        dom.jsPeergetValuesActive = false ;
        return returnXml ;
      }
    }
  }
  for ( var ch = dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.xPseudoTopWindow ) continue ;
    if ( ch.name || ch.path )
    {
      var path = ch.name ;
      if ( ch.trueName ) path = ch.trueName ;
      if ( ch.path )
      {
        path = ch.path ;
      }
      if ( ch.jsPeer && ch.jsPeer.getValues )
      {
        var xx = xml.addXml ( path ) ;
        if ( ch.valueHook && ch.valueHook.object && ch.valueHook.object.getValue )
			  {
          if ( ch.valueHook.object.getValue ( xx, ch ) === false ) continue ;
			  }
        ch.jsPeer.getValues ( xx ) ;
        continue ;
      }
      if ( ch.jsPeer && ch.jsPeer.getValue )
      {
        if ( ch.valueHook && ch.valueHook.object && ch.valueHook.object.getValue )
			  {
          if ( ch.valueHook.object.getValue ( xml, ch ) === false ) continue ;
			  }
        ch.jsPeer.getValue ( xml ) ;
        continue ;
      }
      if ( ch.valueHook && ch.valueHook.object && ch.valueHook.object.getValue )
			{
        if ( ch.valueHook.object.getValue ( xml, ch ) === false ) continue ;
			}
      if (  ch.xClassName == "Date"
         || ch.xClassName == "DateTime"
         )
      {
        var s = this.getDateStringFromDate ( ch ) ;
        if ( s )
        {
          xml.addDom ( path, s ) ;
        }
        else
        if ( ch.xdefaultIsNull )
        {
          var x = xml.addXml ( path, "" ) ;
          x.addAttribute ( "isNull", "true" ) ;
        }
        continue ;
      }
      if (  ch.xClassName == "Label" )
      {
        if ( ch.getValue )
        {
          var s = TGui.getValueLabel ( ch ) ;
          if ( s ) xml.addDom ( path, s ) ;
          else
          if ( typeof ( s ) == 'number' ) xml.addDom ( path, s ) ;
          continue ;
        }
      }
      if ( ch.xClassName == "ToolbarToggle" || ch.xClassName == "ToolbarToggleSmall" )
      {
        if ( ch.value ) xml.addDom ( path, ch.value ) ;
        continue ;
      }
      if ( ch.type )
      {
        var val = null ;
        if ( ch.type == 'select-one' )
        {
          if ( typeof ( ch.xdefault ) == 'string' )
          {
            if ( ch.selectedIndex > 0 )
            {
              xml.addDom ( path, ch.value ) ;
            }
            else
            if ( ch.xdefaultIsNull )
            {
              var x = xml.addXml ( path, "" ) ;
              x.addAttribute ( "isNull", "true" ) ;
            }
          }
          else
          {
            xml.addDom ( path, ch.value ) ;
          }
        }
        else
        if ( ch.type == 'select-multiple' )
        {
          var x = null ;
          for ( i = 0 ; i < ch.options.length ; i++ )
          {
            if ( ch.options[i].selected )
            {
              if ( ! x ) x = xml.addXml ( path ) ;
              if ( ch.options[i].value )
              {
                x.addDom ( "option", ch.options[i].value ) ;
              }
              else
              {
                x.addDom ( "option", ch.options[i].firstChild.nodeValue ) ;
              }
            }
          }
        }
        else
        if ( ch.type == 'hidden' )
        {
          xml.addDom ( path, ch.value ) ;
        }
        else
        if ( ch.type == 'checkbox' )
        {
          if ( ch.checked ) xml.addDom ( path, ch.value ) ;
          else
          if ( TSys.isString ( ch.xdefault ) )
          {
            xml.addDom ( path, String ( ch.xdefault ) ) ;
          }
        }
        else
        if ( ch.type == 'radio' )
        {
          if ( ch.checked ) xml.addDom ( path, ch.value ) ;
        }
        else
        if (  ch.type == 'text'
           || ch.type == 'password'
           )
        {
          if ( ch.value && ! ch.mandatoryTextDisplayed )
          {
            if (  ch.extendedType == "float"
               || ch.extendedType == "ufloat"
               || ch.extendedType == "money"
               || ch.xType == "money"
               || ch.xType == "float"
               || ch.xType == "ufloat"
               )
            {
              var t = ch.value ;
              var sep = TSys.getLocale(ch).getDecimalSeparator() ;
	      if ( sep == ',' ) t = t.replace ( /,/g, '.' ) ;
              xml.addDom ( path, t ) ;
            }
            else
            {
              xml.addDom ( path, ch.value ) ;
            }
          }
          else
          if ( typeof ( ch.xdefault ) == "string" )
          {
            xml.addDom ( path, ch.xdefault ) ;
          }
          else
          if ( ch.xdefaultIsNull )
          {
            var x = xml.addXml ( path, "" ) ;
            x.addAttribute ( "isNull", "true" ) ;
          }
        }
        else
        if ( ch.type == 'textarea' )
        {
          if ( ch.value )
          {
            xml.addDom ( path, ch.value ) ;
          }
          else
          if ( ch.xdefaultIsNull )
          {
            var x = xml.addXml ( path, "" ) ;
            x.addAttribute ( "isNull", "true" ) ;
          }
        }
        continue ;
      }
    }
    if ( ! TGui.guiElementClassNames[ch.xClassName] )
    {
      if ( ch.firstChild ) arguments.callee.call ( this, xml, ch, true ) ;
    }
  }
  return returnXml ;
};
TXml.prototype.getMandatoryText = function ( dom, mTextList )
{ 
  if ( ! dom ) dom = this.domRoot ;
  if ( ! mTextList ) mTextList = new Array() ;
  for ( var ch = dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      continue ;
    }
    if ( ch.name )
    {
      if ( ch.mandatory && ch.type )
      {
        var val = null ;
        if ( ch.type == 'select-one' )
        {
          if ( ! ch.value || ch.value.length == 0 ) mTextList.push ( ch.mandatory ) ;
        }
        else
        if ( ch.type == 'select-multiple' )
        {
          var found = false ;
          for ( i = 0 ; i < ch.options.length ; i++ )
          {
            if ( ch.options[i].selected )
            {
              found = true ;
              break ;
            }
          }
          if ( ! found ) mTextList.push ( ch.mandatory ) ;
        }
        else
        if (  ch.type == 'text'
           || ch.type == 'password'
           || ch.type == 'int'
           )
        {
          if ( ! ch.value ) mTextList.push ( ch.mandatory ) ;
          else
          if ( ch.value.length == 0 ) mTextList.push ( ch.mandatory ) ;
          else
          if ( ch.minlength && ch.value.length < ch.minlength )mTextList.push ( ch.mandatory ) ;
        }
        else
        if ( ch.type == 'textarea' )
        {
          if ( ! ch.value || ch.value.length == 0 ) mTextList.push ( ch.mandatory ) ;
        }
        continue ;
      }
    }
    if ( ch.firstChild ) arguments.callee.call ( this, ch, mTextList ) ;
  }
  return mTextList ;
} ;
TXml.prototype.isMandatoryOk = function ( dom, ev )
{ 
  if ( ! dom ) dom = this.domRoot ;
  var ch = dom.firstChild ;
  while ( ch )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      ch = ch.nextSibling ;
      continue ;
    }
    if ( ch.fMandatoryCheck )
    {
      var tt = ch.value ;
      if ( ch.mandatoryTextDisplayed ) ch.value = "" ;
      var b = ch.fMandatoryCheck.execute ( ch ) ;
      if ( ch.mandatoryTextDisplayed ) ch.value = tt ;
      if ( ! b ) { ch.xMandatoryOk = false ; return false ; }
      ch.xMandatoryOk = true ;
      ch = ch.nextSibling ;
      continue ;
    }
    if ( ch.jsPeer && ch.jsPeer.isMandatoryOk )
    {
      if ( ! ch.jsPeer.isMandatoryOk(ev) ) return false ;
    }
    if ( ch.name )
    {
      if ( ch.type == 'text'
           && ch.extendedType
           && typeof ( ch.extendedType ) == 'object'
           && ch.extendedType.jsClassName == 'TFunctionExecutor'
         )
      {
        var e = null ;
        if ( ev ) e = ev.getEvent() ;
        var state = ch.extendedType.execute ( [ ch.value, ch, e ] ) ;
        if ( typeof ( state ) == 'boolean' & ! state )
	{
          ch.xMandatoryOk = false ;
	  return false ;
	}
        ch.xMandatoryOk = true ;
        ch = ch.nextSibling ;
        continue ;
      }
      if ( ! ch.mandatory && ch.type == 'text' )
      {
        if ( ch.extendedType == "email" )
        {
          if ( ch.value && ! TGui.checkEmail ( ch.value ) ) return false ;
        }
      }
      if ( ch.mandatory && ch.type )
      {
        var val = null ;
        if ( ch.type == 'select-one' )
        {
          if ( ! ch.value || ch.value.length == 0 ) return false ;
        }
        else
        if ( ch.type == 'select-multiple' )
        {
          var found = false ;
          for ( i = 0 ; i < ch.options.length ; i++ )
          {
            if ( ch.options[i].selected )
            {
              found = true ;
              break ;
            }
          }
          if ( ! found ) return false ;
        }
        else
        if (  ch.type == 'text'
           || ch.type == 'password'
           || ch.type == 'int'
           )
        {
          var t = ch.value ;
          if ( ch.mandatoryTextDisplayed ) t = "" ;
          if ( ch.extendedType == "password" )
          {
            if ( ! TSys.getPasswordValidator().validate ( t ) ) return false ;
          }
          if ( ch.extendedType == "email" )
          {
            if ( ! TGui.checkEmail ( t ) ) return false ;
          }
          else
          if ( ch.extendedType == "float" )
          {
            if ( typeof ( ch.trueValue ) == 'undefined' && ! TGui.checkFloat ( t ) ) return false ;
          }
          else
          if ( ch.extendedType == "ufloat" )
          {
            if ( typeof ( ch.trueValue ) == 'undefined' && ! TGui.checkFloat ( t ) ) return false ;
          }
          if ( ! t ) return false ;
	  /*
          else
          if ( t == 0 ) return false ;
	  */
          else
          if ( ch.minlength && t.length < ch.minlength ) return false ;
          if ( TSys.isNumber ( ch.xMin ) )
          {
            if ( ch.xType == 'money' || ch.xType == 'float' || ch.xType == 'ufloat' )
            {
              var i = parseFloat ( t ) ;
              if ( isNaN ( i ) ) i = parseFloat ( ch.trueValue ) ;
              if ( isNaN ( i ) || i < ch.xMin )
                return false ;
            }
            else
            {
              var i = parseInt ( t ) ;
              if ( isNaN ( i ) ) i = parseInt ( ch.trueValue ) ;
              if ( isNaN ( i ) || i < ch.xMin )
                return false ;
            }
          }
        }
        else
        if ( ch.type == 'textarea' )
        {
          if ( ! ch.value || ch.value.length == 0 ) return false ;
          else
          if ( ch.minlength && ch.value.length < ch.minlength ) return false ;
        }
        ch = ch.nextSibling ; 
        continue ;
      }
      else
      if ( ch.xClassName == "Date" || ch.xClassName == 'DateTime' )
      {
        if ( ! TGui.isMandatoryOkDate ( ch, ev ) ) return false ;
        ch = ch.nextSibling ; 
        continue ;
      }
      else
      if ( ch.xClassName == "Label" )
      {
        if ( ch.mandatory )
        {
          if ( ! ch.innerHTML.trim() ) return false ;
        }
      }
    }
    if ( ! this.isMandatoryOk ( ch, ev ) ) return false ;
    ch = ch.nextSibling ; 
  }
  return true ;
};
TXml.prototype.reset = function()
{ 
  if ( this.domRoot.listenerContext )
  {
    this.domRoot.listenerContext.reset() ;
  }
  this._reset ( this.domRoot ) ;
};
TXml.prototype._reset = function ( htmlDom )
{ 
  if ( htmlDom.xIsResettable )
  {
    if ( htmlDom.xClassName == "TitleLabel" )
    {
      htmlDom.titleLabelMid.innerHTML = "&nbsp;" ;
      return ;
    }
    TGui.flushAttributes ( htmlDom ) ;
    htmlDom.innerHTML = "" ;
    return ;
  }
  for ( var ch = htmlDom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      continue ;
    }
    if ( ch.listenerContext )
    {
      ch.listenerContext.reset() ;
    }
    if ( ( ch.type == 'text' || ch.type == 'textarea' ) && ch.xIsResettable )
    {
      ch.value = "" ;
      if ( ch.mandatory ) TGui.setMandatoryDecoration ( ch );
    }
    else
    if ( ch.type == 'password' && ch.xIsResettable )
    {
      ch.value = "" ;
      if ( ch.mandatory ) TGui.setMandatoryDecoration ( ch );
    }
    else
    if ( ch.type == 'select-multiple' && ch.xIsResettable )
    {
      ch.options.length = 0 ;
      if ( ch.mandatory ) TGui.setMandatoryDecoration ( ch );
    }
    else
    if ( ch.type == 'select-one' )
    {
      if ( ch.xIsResettable )
      {
        if ( typeof ( ch.xResetIndex ) != 'number' )
        {
          ch.options.length = 0 ;
        }
        else
        {
          var n = ch.xResetIndex ;
          if ( n < 0 || n >= ch.options.length ) n = 0 ;
          ch.selectedIndex = n ;
        }
        if ( ch.mandatory ) TGui.setMandatoryDecoration ( ch );
      }
      else
      if ( ch.xIsResettable === false )
			{
      }
      else
      if (  ch.mandatory
         || ( typeof ( ch.xdefault ) == 'string' && ch.xdefault != 'true' )
         )
      {
        ch.selectedIndex = 0 ;
        TGui.setMandatoryDecoration ( ch );
      }
    }
    else
    if ( ch.type == 'checkbox' )
    {
      ch.checked = false ;
    }
    else
    if ( ch.xClassName == 'Label' && ch.xIsResettable )
    {
      ch.innerHTML = "&nbsp;" ;
			if ( typeof ( ch.trueValue ) != "undefined" )
			{
			  ch.trueValue = undefined ;
			}
      if ( ch.mandatory ) TGui.setMandatoryDecoration ( ch );
    }
    else
    if ( ch.xClassName == 'Date' || ch.xClassName == 'DateTime' )
    {
      this.resetDate ( ch ) ;
      if ( ch.mandatory ) TGui.setMandatoryDecoration ( ch );
    }
/*
        if ( ch.type == 'radio' )
*/
    else
    if ( ch.xClassName == "TitleLabel" )
    {
      if ( ch.xIsResettable ) ch.titleLabelMid.innerHTML = "&nbsp;" ;
    }
    else
    if ( ch.nodeName.toUpperCase() == "DIV" || ch.nodeName.toUpperCase() == "SPAN" )
    {
      if ( ch.jsPeer && ch.jsPeer.reset && ! ch.jsPeerResetActive )
      {
        ch.jsPeerResetActive = true ;
        ch.jsPeer.reset() ;
        ch.jsPeerResetActive = false ;
        if ( ch.jsPeer.reset() )
        {
          if ( ch.firstChild )
          {
            arguments.callee.call ( this, ch ) ;
          }
        }
      }
      else
      if ( ch.xIsResettable )
      {
        TGui.flushAttributes ( ch ) ;
        ch.innerHTML = "" ;
      }
      else
      if ( ch.firstChild )
      {
        arguments.callee.call ( this, ch ) ;
      }
    }
  }
};
TXml.prototype.getListenerContext = function()
{ 
  if ( this.domRoot.listenerContext )
  {
    return this.domRoot.listenerContext ;
  }
  return this._getListenerContext ( this.domRoot ) ;
};
TXml.prototype._getListenerContext = function ( htmlDom )
{ 
  if ( htmlDom.listenerContext ) return htmlDom.listenerContext ;
  for ( var ch = htmlDom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      continue ;
    }
    if ( ch.listenerContext )
    {
      return ch.listenerContext ;
    }
    if ( ch.firstChild )
    {
      var lc = this._getListenerContext ( ch ) ;
      if ( lc ) return lc ;
    }
  }
};
TXml.prototype.getListenerContextUp = function()
{ 
  if ( this.domRoot.listenerContext )
  {
    return this.domRoot.listenerContext ;
  }
  return this._getListenerContextUp ( this.domRoot ) ;
};
TXml.prototype._getListenerContextUp = function ( htmlDom )
{ 
  if ( htmlDom.listenerContext ) return htmlDom.listenerContext ;
  for ( var ch = htmlDom.parentNode ; ch ; ch = ch.parentNode )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      continue ;
    }
    if ( ch.nodeName.toUpperCase() == "BODY" ) return null ;
    if ( ch.listenerContext )
    {
      return ch.listenerContext ;
    }
  }
};
TXml.prototype.setRefData = function ( xmlElem, htmlDom )
{ 
  this.setValues ( xmlElem, htmlDom, true ) ;
};
TXml.prototype.setValues = function ( xmlElem, htmlDom, referenceData )
{ 
  if ( ! xmlElem ) return ;
  if ( ! htmlDom )
  {
    htmlDom = this.domRoot ;
  }
  if ( ! referenceData )
  {
    if ( htmlDom.valueHook && htmlDom.valueHook.object && htmlDom.valueHook.object.setValue )
	  {
      htmlDom.valueHook.object.setValue ( xmlElem, htmlDom ) ;
	  }
  }
  this._setValues ( xmlElem, htmlDom, referenceData ) ;
};
TXml.prototype._setValues = function ( xmlElem, htmlDom, referenceData )
{ 
  if ( ! xmlElem ) return ;
  if ( ! htmlDom )
  {
    htmlDom = this.domRoot ;
  }

  if ( ! referenceData )
  {
    if ( htmlDom.jsPeer && htmlDom.jsPeer.setValues )
    {
      if ( ! htmlDom.jsPeersetValuesActive )
      {
        htmlDom.jsPeersetValuesActive = true ;
        htmlDom.jsPeer.setValues ( xmlElem ) ;
        htmlDom.jsPeersetValuesActive = false ;
        return ;
      }
    }
    else
    if ( htmlDom.path )
    {
      var xmlPath = xmlElem.getXml ( htmlDom.path ) ;
      if ( ! xmlPath ) return ;
      xmlElem = xmlPath ;
    }
  }
  else
  {
    if ( htmlDom.jsPeer && htmlDom.jsPeer.setRefData )
    {
      if ( ! htmlDom.jsPeersetRefDataActive )
      {
        htmlDom.jsPeersetRefDataActive = true ;
        htmlDom.jsPeer.setRefData ( xmlElem ) ;
        htmlDom.jsPeersetRefDataActive = false ;
        return ;
      }
      return ;
    }
  }
  var ch = htmlDom.firstChild ;
  while ( ch )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      ch = ch.nextSibling ;
      continue ;
    }
    if ( ! referenceData )
    {
      if ( ch.jsPeer && ch.jsPeer.setValue )
      {
        if ( ch.valueHook && ch.valueHook.setValue )
        {
          ch.valueHook.setValue ( xmlElem, ch ) ;
			  }
        ch.jsPeer.setValue ( xmlElem ) ;
        ch = ch.nextSibling ; 
        continue ;
      }
    }
    else
    if ( ch.jsPeer && ch.jsPeer.setRefData )
    {
      ch.jsPeer.setRefData ( xmlElem ) ;
      ch = ch.nextSibling ; 
      continue ;
    }
    if ( ch.name || ( ! referenceData && ch.path ) )
    {
      var isDate = false ;
      var isDateTime = false ;
      var clazz = ch.xClassName ;
      if ( ! clazz ) clazz = ch.className ;
      if ( ch.xsi_type == "xsd-date" )
      {
        isDate = true ;
      }
      if ( ch.xsi_type == "xsd-datetime" )
      {
        isDateTime = true ;
      }
      var xmlDom = null ;
      if ( ! referenceData && ch.path )
      {
        xmlDom = xmlElem.getDom ( ch.path ) ;
      }
      else
      {
        if ( ch.trueName )
        {
          if ( ch.trueName == xmlElem.domRoot.nodeName ) xmlDom = xmlElem.domRoot ;
          else                                           xmlDom = xmlElem.getDom ( ch.trueName ) ;
        }
        else
        {
          if ( ch.name == xmlElem.domRoot.nodeName ) xmlDom = xmlElem.domRoot ;
          else                                       xmlDom = xmlElem.getDom ( ch.name ) ;
        }
      }
      if ( ! xmlDom )
      {
        if ( ch.valueHook && ch.valueHook.object && ch.valueHook.object.setValue )
			  {
          ch.valueHook.object.setValue ( null, ch ) ;
			  }
      }
      if ( xmlDom )
      {
        if ( ch.valueHook && ch.valueHook.object && ch.valueHook.object.setValue )
			  {
          ch.valueHook.object.setValue ( new TXml ( xmlDom ), ch ) ;
			  }
        var t = "" ;
        if ( xmlDom.firstChild ) t = xmlDom.firstChild.nodeValue ;
        if ( ! t ) t = "" ;
        if (  clazz == 'Date'
           || clazz == 'DateTime'
           )
        {
          if ( t ) TGui.setValuesDate ( ch, t ) ;
        }
        else
        if ( clazz == 'Label' )
        {
          if ( referenceData )
          {
            var en = new TXEnum ( xmlDom, "option" ) ;
            while ( en.hasNext() )
            {
              var d = new TXml ( en.next() ) ;
              var v = d.getAttribute ( "value" ) ;
              var n = d.getContent() ;
              if ( ! v ) v = n ;
              if ( ! n ) continue ;
              if ( ! ch.xMappings ) ch.xMappings = [] ;
              ch.xMappings[v] = n ;
            }
          }
          else
          {
            TGui.setValueLabel ( ch, t ) ;
          }
        }
        else
        if ( clazz == 'TitleLabel' )
        {
          if ( ! t ) t = "&nbsp;" ;
          ch.titleLabelMid.innerHTML = t ;
        }
        else
        if ( clazz == 'TitleLabelMid' )
        {
          if ( ! t ) t = "&nbsp;" ;
          ch.innerHTML = t ;
        }
        else
        if ( ch.type == 'select-multiple' && t )
        {
          ch.value = t ;
        }
        else
        if ( ch.type == 'hidden' )
        {
          ch.value = t ;
        }
        else
        if ( ch.type == 'text' )
        {
          if (  ch.extendedType == "float"
             || ch.extendedType == "ufloat"
             || ch.extendedType == "money"
             || ch.xType == "money"
             || ch.xType == "float"
             || ch.xType == "ufloat"
             )
          {
            var sep = TSys.getLocale(ch).getDecimalSeparator() ;
            if ( sep == "," ) t = t.replace ( /\./, "," ) ;
          }
          ch.value = t ;
          if ( ch.mandatory )
          {
            ch.mandatoryTextDisplayed = false ;
            TGui.setMandatoryDecoration ( ch );
          }
	  else
	  {
            if ( ch.extendedType == "email" )
	    {
              TGui.setMandatoryDecoration ( ch );
	    }
	  }
        }
        else
        if ( ch.type == 'checkbox' )
        {
          if ( t == ch.value ) ch.checked = true ;
          else                 ch.checked = false ;
        }
        else
        if ( ch.type == 'radio' )
        {
          if ( t == ch.value ) ch.checked = true ;
          else                 ch.checked = false ;
        }
        else
        if ( ch.type == 'textarea' )
        {
          ch.value = t ;
          if ( ch.mandatory )
	  			{
            ch.mandatoryTextDisplayed = false ;
            TGui.setMandatoryDecoration ( ch );
	  			}
        }
        else
        if ( ch.type == 'select-one' )
        {
          TGui.setValuesChoice ( ch, xmlDom, referenceData ) ;
        }
      }
    }
    if ( ch.firstChild )
    {
      if ( ch.xClassName == 'TitleLabel' )
      {
        ch = ch.nextSibling ; 
        continue ;
      }
      if ( ch.xClassName && ( TGui.guiElementClassNames[ch.xClassName] ) )
      {
        ch = ch.nextSibling ; 
        continue ;
      }
      this._setValues ( xmlElem, ch, referenceData ) ;
    }
    ch = ch.nextSibling ; 
  }
};
TXml.prototype.removeAllEmptyChildren = function()
{ 
  var ch = this.domRoot.firstChild ;
  while ( ch )
  {
    if ( ch.nodeType == DOM_ELEMENT_NODE )
    {
      if ( ! ch.firstChild || ! ch.firstChild.nodeValue || ch.firstChild.nodeValue == '\n' )
      {
        var ch2 = ch.nextSibling ;
        ch.parentNode.removeChild ( ch ) ;
        ch = ch2 ;
        continue ;
      }
    }
    else
    if ( ch.nodeType == DOM_TEXT_NODE )
    {
      if ( ! ch.nodeValue || ch.nodeValue == "\n" )
      {
        var ch2 = ch.nextSibling ;
        ch.parentNode.removeChild ( ch ) ;
        ch = ch2 ;
        continue ;
      }
    }
    ch = ch.nextSibling ;
  }
};
TXml.prototype.indexOf = function()
{ 
  var p = this.domRoot.parentNode ;
  if ( p.nodeType != DOM_ELEMENT_NODE ) return 0 ;
  var index = 0 ;
  for ( var ch = p.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch === this.domRoot ) return index ;
    index++ ;
  }
  return -1 ;
};
TXml.prototype.insertBefore = function ( xml )
{
  var parent = this.domRoot.parentNode ;
  if ( parent.nodeType != DOM_ELEMENT_NODE ) return null ;
  var doc = this.getDocumentNode() ;
  if ( doc !== xml.getDocumentNode() )
  {
    var newNode = doc.createElement ( xml.getName() ) ;
    parent.insertBefore ( newNode, this.domRoot ) ;
    var newXml = new TXml ( newNode ) ;
    newXml.copyChildrenFrom ( xml ) ;
    newXml.copyAttributesFrom ( xml ) ;
  }
  else
  {
    parent.insertBefore ( xml.getDom(), this.domRoot ) ;
  }
};
TXml.prototype.insertAfter = function ( xml )
{
  var parent = this.domRoot.parentNode ;
  if ( parent.nodeType != DOM_ELEMENT_NODE ) return null ;
  var doc = this.getDocumentNode() ;
  var nextElement = null ;
  for ( var ch = this.domRoot.nextSibling ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    nextElement = ch ;
    break ;
  }
  if ( ! nextElement )
  {
    var newNode = doc.createElement ( xml.getName() ) ;
    parent.appendChild ( newNode ) ;
    var newXml = new TXml ( newNode ) ;
    newXml.copyChildrenFrom ( xml ) ;
    newXml.copyAttributesFrom ( xml ) ;
  }
  else
  {
    var newNode = doc.createElement ( xml.getName() ) ;
    parent.insertBefore ( newNode, nextElement ) ;
    var newXml = new TXml ( newNode ) ;
    newXml.copyChildrenFrom ( xml ) ;
    newXml.copyAttributesFrom ( xml ) ;
  }
};
TXml.prototype.moveTo = function ( index )
{
  var parent = this.domRoot.parentNode ;
  if ( parent.nodeType != DOM_ELEMENT_NODE ) return -1 ;
  if ( typeof ( index ) != 'number' )
  {
    throw "Invalid value for parameter for 'index' (" + typeof ( index ) + ")" ;
  }
  if ( index < 0 ) return -1 ;

  var thisIndex = -1 ;
  var numberOfElements = 0 ;
  var elementAtIndex = null ;
  var n = 0 ;
  for ( var ch = parent.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    numberOfElements++ ;
    if ( ch === this.domRoot ) thisIndex = n ;
    if ( n == index ) elementAtIndex = ch ;
    n++ ;
  }
  if ( index == thisIndex ) return -1 ;
  if ( numberOfElements <= 1 ) return -1 ;
  if ( index >= numberOfElements ) return -1 ;

  if ( index == 0 )
  {
    parent.removeChild ( this.domRoot ) ;
    parent.insertBefore ( this.domRoot, parent.firstChild ) ;
  }
  else
  if ( index + 1 == numberOfElements )
  {
    parent.removeChild ( this.domRoot ) ;
    parent.appendChild ( this.domRoot ) ;
  }
  else
  {
    if ( index > thisIndex )
    {
      parent.removeChild ( this.domRoot ) ;
      parent.insertBefore ( this.domRoot, elementAtIndex.nextSibling ) ;
    }
    else
    {
      parent.removeChild ( this.domRoot ) ;
      parent.insertBefore ( this.domRoot, elementAtIndex ) ;
    }
  }
  return index ;
};
TXml.prototype.getPadding = function ( path, def )
{
  return this._getInsets ( new Padding(), path, "padding", def ) ;
};
TXml.prototype.getInsets = function ( path, def )
{
  return this._getInsets ( new Insets(), path, null, def ) ;
};
TXml.prototype._getInsets = function ( obj, path, prefix, def )
{
  if ( typeof ( path ) == 'number' ) { def = path ; path = "" ; }
  if ( ! prefix ) prefix = "" ;
  else            prefix = prefix + "-" ;
  if ( ! def ) def = 0 ;
  if ( ! path )
  {
    obj.top = this.getIntAttribute ( prefix + "top", def );
    obj.left = this.getIntAttribute ( prefix + "left", def );
    obj.bottom = this.getIntAttribute ( prefix + "bottom", def );
    obj.right = this.getIntAttribute ( prefix + "right", def );
    return obj ;
  }
  var x = this.getXml ( path ) ;
  if ( !x) return obj ;
  obj.top = x.getIntAttribute ( prefix + "top", def );
  obj.left = x.getIntAttribute ( prefix + "left", def );
  obj.bottom = x.getIntAttribute ( prefix + "bottom", def );
  obj.right = x.getIntAttribute ( prefix + "right", def );
  return obj ;
};
TXml.prototype.getRectangle = function ( path )
{
  if ( ! path )
  {
    return new TRectangle ( this.getIntAttribute ( "x", 0 )
                          , this.getIntAttribute ( "y", 0 )
                          , this.getIntAttribute ( "width", 0 )
                          , this.getIntAttribute ( "height", 0 )
                          ) ;
  }
  var x = this.getXml ( path ) ;
  if ( !x) return null ;
  return new TRectangle ( x.getIntAttribute ( "x", 0 )
                        , x.getIntAttribute ( "y", 0 )
                        , x.getIntAttribute ( "width", 0 )
                        , x.getIntAttribute ( "height", 0 )
                        ) ;
};
TXml.prototype.getStyle = function ( path )
{
  var e = this.getXml ( path ) ;
  if ( ! e ) return null ;
  var str = e.getContent() ;
  return new EStyle ( str ) ;
};
TXml.prototype.sort = function ( path, factor )
{
	if ( ! factor ) factor = 1 ;
	var en ;
  var elementName = "" ;
  var pos = -1 ;
  if ( path )
  {
    pos = path.indexOf ( "[" ) ;
  }
  if ( pos >= 0 )
  {
    elementName = path.substring ( pos + 1 ) ;
    path = path.substring ( 0, pos ) ;
    pos = elementName.indexOf ( "]" ) ;
    if ( pos > 0 ) elementName = elementName.substring ( 0, pos ) ;
  }
  var childName = path ;
  var parentXmlElement = this ;
	if ( path && path.indexOf ( "/" ) > 0 )
	{
    childName = path.substring ( 0, path.lastIndexOf ( "/" ) ) ;
    var n = path.substring ( path.lastIndexOf ( "/" ) + 1 ) ;
    if ( childName )
    {
      parentXmlElement = this.get ( childName ) ;
    }
    if ( ! parentXmlElement )
    {
      return ;
    }
	  en = parentXmlElement.getEnum ( n ) ;
	}
	else
	if ( childName )
	{
	  en = this.getEnum ( childName ) ;
	}
	else
	{
	  en = this.elements() ;
	}
	var list = [] ;
  while ( en.hasNext() )
	{
		list.push ( en.nextXml() ) ;
	}
	if ( elementName )
	{
		list.sort ( function ( e1, e2 )
		{
			return ( e1.getContent ( elementName ).toUpperCase() > e2.getContent ( elementName ).toUpperCase() ? factor : - factor ) ;
		});
	}
	else
	{
		list.sort ( function ( e1, e2 )
		{
			return ( e1.getContent().toUpperCase() > e2.getContent().toUpperCase() ? factor : - factor ) ;
		});
	}
	var i = 0 ;
	var parentNode = parentXmlElement.getDom() ;
  for ( i = 0 ; i < list.length ; i++ )
	{
		list[i].remove() ;
	}
  for ( i = 0 ; i < list.length ; i++ )
	{
		parentNode.appendChild ( list[i].getDom() ) ;
	}
  list.length = 0 ;
};
TXml.prototype.visit = function ( visitor )
{
  this._visit ( visitor, this.domRoot, true, 0 ) ;
} ;
TXml.prototype._visit = function ( visitor, dom, first, depth )
{
  if ( ! dom ) return true ;
  if ( dom.nodeType == DOM_DOCUMENT_NODE ) return true ;

  if ( typeof visitor.visit === 'function' )
  {
    if ( ! visitor.visit ( new TXml ( dom ), depth ) )
    {
      return false ;
    }
  }
  else
  {
    if ( ! visitor.call ( null, new TXml ( dom ), depth ) )
    {
      return false ;
    }
  }
  var ch = dom.firstChild ;
  for ( ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType !== DOM_ELEMENT_NODE ) continue ;
    if ( ! this._visit ( visitor, ch, false, depth + 1 ) )
    {
      return false ;
    }
  }
  return true ;
} ;
TXml.prototype.replace = function ( names, values, delimiter )
{
  var visitor =
  {
    flush:function()
    {
      this.regexp.length = 0 ;
      this.regexp = null ;
      this.values = null ;
    },
    visit:function(x)
    {
      var str = x.getContent().trim() ;
      if ( str )
      {
        if ( str.indexOf ( "$" ) >= 0 )
        {
          for ( var i = 0 ; i < this.regexp.length ; i++ )
          {
            str = str.replace ( this.regexp[i], this.values[i] );
          }
          x.setContent ( str ) ;
        }
      }
      var a = x.getAttributeNames() ;
      var b = x.getAttributeValues() ;
      for ( var i = 0 ; i < b.length ; i++ )
      {
        var str = b[i] ;
        if ( str.indexOf ( "$" ) >= 0 )
        {
          for ( var j = 0 ; j < this.regexp.length ; j++ )
          {
            str = str.replace ( this.regexp[j], this.values[j] );
          }
          x.addAttribute ( a[i], str ) ;
        }
      }
      return true ;
    },
    init: function ( n, v, del )
    {
      this.regexp = [] ;
      if ( ! TSys.isArray ( n ) && n && typeof ( n ) == 'object' )
      {
        this.values = [] ;
        for ( var k in n )
        {
          var val = n[k] ;
          if ( typeof ( val ) == 'string' ) {}
          else
          if ( typeof ( val ) == 'number' ) val = String ( val ) ;
          else
          if ( typeof ( val ) == 'boolean' ) val = String ( val ) ;
          else continue ;
          if ( v == "[]" )
          {
            var r = new RegExp( "\\$\\[" + k + "\\]", "g");
            this.regexp.push ( r ) ;
            this.values.push ( val ) ;
          }
          else
          {
            var r = new RegExp( "\\$\\{" + k + "\\}", "g");
            this.regexp.push ( r ) ;
            this.values.push ( val ) ;
          }
        }
      }
      else
      {
        this.values = v ;
        for ( var i = 0 ; i < n.length ; i++ )
        {
          if ( delimiter == "[]" )
          {
            var r = new RegExp( "\\$\\[" + names[i] + "\\]", "g");
            this.regexp.push ( r ) ;
          }
          else
          {
            var r = new RegExp( "\\$\\{" + names[i] + "\\}", "g");
            this.regexp.push ( r ) ;
          }
        }
      }
    }
  } ;
  visitor.init ( names, values, delimiter ) ;
  this.visit(visitor) ;
  visitor.flush() ;
};
