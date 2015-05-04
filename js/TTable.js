/**
 *  @constructor
 */
var TTable = function ( xmlAttributes )
{
  if ( ! xmlAttributes )
  {
    return ;
  }
  TTable.prototype.counter++ ;
  this._counter = TTable.prototype.counter ;
  this.jsClassName = "TTable" ;
  this.name = "TTable$" + this._counter ;
  this.selectedColumnIndex = -1 ;
  this.selectedItem = null ;
  this.selectedCell = null ;
  this.selectMultiple = false ;
  this.wordWrap = false ;
  this.showHeader = true ;
  this.rowName = "row" ;
  this.getValuesAll = false ;
  this.getValuesChanged = false ;
  this.getValuesNone = false ;
  this.rowsPlain = false ;
  this._hasChanged = false ;
  this.dom = null ;
  this.selectable = true ;

  this.oldBehaviour = false ;

  if (  typeof ( xmlAttributes ) == 'object'
     && xmlAttributes.tagName
     && xmlAttributes.tagName == "Table"
     )
  {
    this.xmlAttributes = xmlAttributes ;
    var s = this.xmlAttributes.getAttribute ( "name" ) ;
    if  ( s ) this.name = s ;
    this.resettable = this.xmlAttributes.getAttribute ( "reset" ) ;
    if ( this.resettable && this.resettable == 'true' ) this.resettable = true ;
    else                                                this.resettable = false ;
    this.sortable = this.xmlAttributes.getAttribute ( "sortable" ) ;
    if ( this.sortable && this.sortable == 'true' ) this.sortable = true ;
    else                                            this.sortable = false ;
    this.selectable = this.xmlAttributes.getAttribute ( "selectable" ) ;
    if ( this.selectable && this.selectable == 'false' ) this.selectable = false ;
    else                                                 this.selectable = true ;
    this.path = this.xmlAttributes.getAttribute ( "path" ) ;
    var rowName = this.xmlAttributes.getAttribute ( "row-name" ) ;
    if ( rowName ) this.rowName = rowName ;
    var multiple = this.xmlAttributes.getAttribute ( "multiple" ) ;
    this.selectMultiple = String  ( multiple ) == 'true' ? true : false ;
    var get_values = this.xmlAttributes.getAttribute ( "get-values" ) ;
    if ( get_values )
    {
      if ( get_values === "all" ) this.getValuesAll = true ;
      if ( get_values === "changed" ) this.getValuesChanged = true ;
      if ( get_values === "false" ) this.getValuesNone = true ;
    }
    else
    {
      var getValuesAll = this.xmlAttributes.getAttribute ( "getValuesAll" ) ;
      this.getValuesAll = String  ( getValuesAll ) == 'true' ? true : false ;
    }

    s = this.xmlAttributes.getAttribute ( "show-header" ) ;
    if ( String ( s ) == 'false' ) this.showHeader = false ;
    this.rowsPlain = this.xmlAttributes.getAttribute ( "rows-plain" ) == 'true' ;
    this.selectOnFill = this.xmlAttributes.getAttribute ( "select-on-fill" ) ;
    if ( this.selectOnFill )
    {
      this.selectOnFill = parseInt ( this.selectOnFill ) ;
      if ( isFinite ( this.selectOnFill ) ) this.selectOnFill += 1 ;
    }
    this.autofocus = this.xmlAttributes.getAttribute ( "autofocus" ) == 'true' ;
    this.selectonfocus = this.xmlAttributes.getAttribute ( "selectonfocus" ) == 'true' ;
  }
  this.columnTypes = [] ;
  this.textAlign = [] ;
  this.mappings = [] ;
  this.mappingLists = [] ;
  this.itemListener = [] ;
  this.propertyChangeHandler = new PropertyChangeHandler() ;
  this.actionListener = [] ;
  this.selectionListener = [] ;
  this.keyListener = [] ;
  this.editable = [] ;
  this.editableWidth = [] ;
  this.mandatory = [] ;
  this.sortableList = [] ;
  this.anyEditable = false ;
  this.anyMandatory = false ;

  this.formats = [] ;

  this._flushed = false ;
  this.numberOfSelectedRows = 0 ;
  if ( this.selectable ) this.selectedRowClassName = "ThemeTableRowClassSelected" ;
  else                   this.selectedRowClassName = "ThemeTableRowClass" ;
  this.popupMenu = null ;
  this.popupMenuClass = PopupMenu ;
  this.setValuesListener = [] ;
  this.getValuesListener = [] ;
  this.preSortedIndex = -1 ;
  this.preSortedDirection = 0 ;
};
TTable.prototype =
{
  counter: 0
};
TTable.prototype.toString = function()
{
  return "(" + this.jsClassName + ")["
//         + "id=" + this.dom.id
       + ",name=" + this.name
       + "]"
       ;
};
TTable.prototype.setName = function ( name )
{
  if ( typeof ( name ) == 'string' ) this.name = name ;
};
TTable.prototype.hasChanged = function()
{
  return this._hasChanged ;
};
TTable.prototype.setChanged = function ( state )
{
  this._hasChanged = state ? true : false ;
};
TTable.prototype.resized = function ( size )
{
  var h = 0 ;
  var dw = TGui.getComputedStyleInt ( this.dom, "padding-left", 0 )
         + TGui.getComputedStyleInt ( this.dom, "padding-right", 0 )
         + TGui.getComputedStyleInt ( this.dom, "border-left-width", 0 )
         + TGui.getComputedStyleInt ( this.dom, "border-right-width", 0 )
         ;
  var dh = TGui.getComputedStyleInt ( this.dom, "padding-top", 0 )
         + TGui.getComputedStyleInt ( this.dom, "padding-bottom", 0 )
         + TGui.getComputedStyleInt ( this.dom, "border-top-width", 0 )
         + TGui.getComputedStyleInt ( this.dom, "border-bottom-width", 0 )
         ;
  var h1 ;
  if ( this.oldBehaviour )
  {
    if ( this.THEAD ) h = this.THEAD.offsetHeight ;
    this.TABLE.style.top = "0px" ;
    if ( this.TABLE2 )
    {
      this.TABLE2.style.top = - h + "px" ;
      this.TABLE2.style.visibility = "hidden" ;
    }
    this.domBody.style.top = "0px" ;
    this.domBody.style.width = ( this.dom.offsetWidth - dw ) + "px" ;
    h1 = this.dom.offsetHeight - dh ;
    if ( h1 < 0 ) h1 = 0 ;
    this.domBody.style.height = h1 + "px" ;
  }
  else
  {
    if ( this.THEAD2 )
    {
      h = this.THEAD2.offsetHeight ;
    }
    else
    if ( this.THEAD )
    {
      h = this.THEAD.offsetHeight ;
    }
    this.domBody.style.top = h + "px" ;
    this.domBody.style.width = ( this.dom.offsetWidth - dw ) + "px" ;
    h1 = this.dom.offsetHeight - h - dh ;
    if ( h1 < 0 ) h1 = 0 ;
    this.domBody.style.height = h1 + "px" ;
    this.handleTD2Right ( false ) ;
  }
};
TTable.prototype.handleTD2Right = function ( refresh )
{
  if ( ! this.TR2  ) return ;
  var txml = Tango.getThemeXml ( "TableHeader", "normal" ) ;
  var ins = txml.getInsets() ;
  var spanWidth = this.domBody.offsetWidth - this.TABLE.offsetWidth ;
  if ( spanWidth <= ins.left + ins.right ) return ;
  if ( ! this.TD2Right )
  {
    this.TD2Right = document.createElement ( "td" ) ;
    this.TR2.appendChild ( this.TD2Right ) ;
  }
  if ( refresh )
  {
    if ( this.TD2Right.dSpan )
    {
      while ( this.TD2Right.dSpan.firstChild )
      {
        this.TD2Right.dSpan.removeChild ( this.TD2Right.dSpan.firstChild ) ;
      }
      this.TD2Right.removeChild ( this.TD2Right.dSpan ) ;
      this.TD2Right.dSpan = undefined ;
      this.TD2Right.dTL = undefined ;
      this.TD2Right.dL = undefined ;
      this.TD2Right.dBL = undefined ;
      this.TD2Right.iT = undefined ;
      this.TD2Right.iM = undefined ;
      this.TD2Right.iB = undefined ;
      this.TD2Right.dTR = undefined ;
      this.TD2Right.dR = undefined ;
      this.TD2Right.dBR = undefined ;
    }
  }
  if ( ! this.TD2Right.dSpan )
  {
    var url = TSys.getImageFactoryServletName()
            + "?theme=" + Tango.getThemeName()
            + "&type=TableHeader"
            + "&state=normal"
            ;
    this.TD2Right.style.padding = "0px" ;
    this.TD2Right.style.backgroundColor = "yellow" ;

    var span = document.createElement ( "span" ) ;
    this.TD2Right.dSpan = span ;
    this.TD2Right.appendChild ( span ) ;
    span.style.position = "absolute" ;
    span.style.width = spanWidth + "px" ;

    this.TD2Right.dTL = document.createElement ( "div" ) ;
    span.appendChild ( this.TD2Right.dTL ) ;
    this.TD2Right.dTL.style.position = "absolute" ;
    this.TD2Right.dTL.style.top = "0px" ;
    this.TD2Right.dTL.style.left = "0px" ;
    this.TD2Right.dTL.style.padding = "0px" ;
    this.TD2Right.dTL.style.margin = "0px" ;
    this.TD2Right.dTL.style.width = ins.left + "px" ;
    this.TD2Right.dTL.style.height = ins.top + "px" ;
this.TD2Right.dTL.style.backgroundImage = "url(" + url + "&part=top-left)" ;

    this.TD2Right.dL = document.createElement ( "div" ) ;
    span.appendChild ( this.TD2Right.dL ) ;
    this.TD2Right.dL.style.position = "absolute" ;
    this.TD2Right.dL.style.top = ins.top + "px" ;
    this.TD2Right.dL.style.left = "0px" ;
    this.TD2Right.dL.style.padding = "0px" ;
    this.TD2Right.dL.style.margin = "0px" ;
    this.TD2Right.dL.style.width = ins.left + "px" ;
    this.TD2Right.dL.style.height = ( this.TD2Right.offsetHeight - ins.top - ins.bottom ) + "px" ;
this.TD2Right.dL.style.backgroundImage = "url(" + url + "&part=left)" ;

    this.TD2Right.dBL = document.createElement ( "div" ) ;
    span.appendChild ( this.TD2Right.dBL ) ;
    this.TD2Right.dBL.style.position = "absolute" ;
    this.TD2Right.dBL.style.top = ( this.TD2Right.offsetHeight - ins.bottom ) + "px" ;
    this.TD2Right.dBL.style.left = "0px" ;
    this.TD2Right.dBL.style.padding = "0px" ;
    this.TD2Right.dBL.style.margin = "0px" ;
    this.TD2Right.dBL.style.width = ins.left + "px" ;
    this.TD2Right.dBL.style.height = ins.bottom + "px" ;
this.TD2Right.dBL.style.backgroundImage = "url(" + url + "&part=bottom-left)" ;

    this.TD2Right.iT = document.createElement ( "img" ) ;
    span.appendChild ( this.TD2Right.iT ) ;
    this.TD2Right.iT.style.position = "absolute" ;
    this.TD2Right.iT.style.top = "0px" ;
    this.TD2Right.iT.style.left = ins.left + "px" ;
    this.TD2Right.iT.style.padding = "0px" ;
    this.TD2Right.iT.style.margin = "0px" ;
    this.TD2Right.iT.style.border = "0px" ;
    this.TD2Right.iT.style.width = ( spanWidth - ins.left - ins.right ) + "px" ;
    this.TD2Right.iT.style.height = ins.top + "px" ;
this.TD2Right.iT.src = url + "&part=top" ;

    this.TD2Right.iM = document.createElement ( "img" ) ;
    span.appendChild ( this.TD2Right.iM ) ;
    this.TD2Right.iM.style.position = "absolute" ;
    this.TD2Right.iM.style.top = ins.top + "px" ;
    this.TD2Right.iM.style.left = ins.left + "px" ;
    this.TD2Right.iM.style.padding = "0px" ;
    this.TD2Right.iM.style.margin = "0px" ;
    this.TD2Right.iM.style.border = "0px" ;
    this.TD2Right.iM.style.width = ( spanWidth - ins.left - ins.right ) + "px" ;
    this.TD2Right.iM.style.height = ( this.TD2Right.offsetHeight - ins.top - ins.bottom ) + "px" ;
this.TD2Right.iM.src = url + "&part=middle" ;

    this.TD2Right.iB = document.createElement ( "img" ) ;
    span.appendChild ( this.TD2Right.iB ) ;
    this.TD2Right.iB.style.position = "absolute" ;
    this.TD2Right.iB.style.top = ( this.TD2Right.offsetHeight - ins.bottom ) + "px" ;
    this.TD2Right.iB.style.left = ins.left + "px" ;
    this.TD2Right.iB.style.padding = "0px" ;
    this.TD2Right.iB.style.margin = "0px" ;
    this.TD2Right.iB.style.border = "0px" ;
    this.TD2Right.iB.style.width = ( spanWidth - ins.left - ins.right ) + "px" ;
    this.TD2Right.iB.style.height = ins.top + "px" ;
this.TD2Right.iB.src = url + "&part=bottom" ;

    this.TD2Right.dTR = document.createElement ( "div" ) ;
    span.appendChild ( this.TD2Right.dTR ) ;
    this.TD2Right.dTR.style.position = "absolute" ;
    this.TD2Right.dTR.style.top = "0px" ;
    this.TD2Right.dTR.style.left = ( spanWidth - ins.right ) + "px" ;
    this.TD2Right.dTR.style.padding = "0px" ;
    this.TD2Right.dTR.style.margin = "0px" ;
    this.TD2Right.dTR.style.width = ins.right + "px" ;
    this.TD2Right.dTR.style.height = ins.top + "px" ;
this.TD2Right.dTR.style.backgroundImage = "url(" + url + "&part=top-right)" ;

    this.TD2Right.dR = document.createElement ( "div" ) ;
    span.appendChild ( this.TD2Right.dR ) ;
    this.TD2Right.dR.style.position = "absolute" ;
    this.TD2Right.dR.style.top = ins.top + "px" ;
    this.TD2Right.dR.style.left = ( span.offsetWidth - ins.right ) + "px" ;
    this.TD2Right.dR.style.padding = "0px" ;
    this.TD2Right.dR.style.margin = "0px" ;
    this.TD2Right.dR.style.width = ins.left + "px" ;
    this.TD2Right.dR.style.height = ( this.TD2Right.offsetHeight - ins.top - ins.bottom ) + "px" ;
this.TD2Right.dR.style.backgroundImage = "url(" + url + "&part=right)" ;

    this.TD2Right.dBR = document.createElement ( "div" ) ;
    span.appendChild ( this.TD2Right.dBR ) ;
    this.TD2Right.dBR.style.position = "absolute" ;
    this.TD2Right.dBR.style.top = ( this.TD2Right.offsetHeight - ins.bottom ) + "px" ;
    this.TD2Right.dBR.style.left = ( span.offsetWidth - ins.right ) + "px" ;
    this.TD2Right.dBR.style.padding = "0px" ;
    this.TD2Right.dBR.style.margin = "0px" ;
    this.TD2Right.dBR.style.width = ins.right + "px" ;
    this.TD2Right.dBR.style.height = ins.bottom + "px" ;
this.TD2Right.dBR.style.backgroundImage = "url(" + url + "&part=bottom-right)" ;
  }
  else
  {
    this.TD2Right.dSpan.style.width = spanWidth + "px" ;
    this.TD2Right.iT.style.width = ( spanWidth - ins.left - ins.right ) + "px" ;
    this.TD2Right.iM.style.width = ( spanWidth - ins.left - ins.right ) + "px" ;
    this.TD2Right.iB.style.width = ( spanWidth - ins.left - ins.right ) + "px" ;
    this.TD2Right.dTR.style.left = ( spanWidth - ins.right ) + "px" ;
    this.TD2Right.dR.style.left = ( spanWidth - ins.right ) + "px" ;
    this.TD2Right.dBR.style.left = ( spanWidth - ins.right ) + "px" ;
  }
};
TTable.prototype.domBodyScrolled = function ( event )
{
  if ( ! this.TABLE2 ) return ;
  var x = this.domBody.scrollLeft ;
  if ( x <= 0 )
  {
    this.TABLE2.style.left = "0px" ;
  }
  else
  {
    this.TABLE2.style.left = -x + "px" ;
  }
};
TTable.prototype.layout = function ( dom, externalAttributes, nix, layoutContext )
{
  this.window = layoutContext.window ;
  this.dom = dom ;
  this.dom.style.overflow = "hidden" ;
  this.domBody = document.createElement ( "div" ) ;
  this.dom.appendChild ( this.domBody ) ;
  this.domBody.style.border = "0px" ;
  this.domBody.style.padding = "0px" ;
  this.domBody.style.margin = "0px" ;
  this.domBody.style.position = "absolute" ;
  this.domBody.style.overflow = "auto" ;
  this.domBody.style.left = "0px" ;
  this.tableHeaderHeight = 0 ;

  if ( ! this.xmlAttributes ) return ;
  this.dom.isFocusable = true ;
  var xml = new TXml ( this.xmlAttributes ) ;
  var columnNames = [] ;
  var columnTitles = [] ;
  var columnTooltips = [] ;
  this.columnTypes = [] ;
  this.textAlign = [] ;
  this.vAlign = [] ;
  this.mappings = [] ;
  this.mappingLists = [] ;
  this.editable = [] ;
  this.editableWidth = [] ;
  this.mandatory = [] ;
  this.sortableList = [] ;
  this.formats = [] ;
  var en = xml.getEnum ( "Columns", "Column" ) ;
  var colIndex = 0 ;
	var i ;
  while ( en.hasNext() )
  {
    var x = en.next() ;
    var name = x.getAttribute ( "name" ) ;
    var title = x.getAttribute ( "title" ) ;
    var tooltip = x.getAttribute ( "tooltip" ) ;
    if ( ! title ) title = name ;
    var type = x.getAttribute ( "type" ) ;
    var align = x.getAttribute ( "align" ) ;
    var valign = x.getAttribute ( "valign" ) ;
    var editable = x.getAttribute ( "editable" ) ;
    if ( editable == "choice" ) {}
    else
    if ( editable == "check" ) {}
    else
    if ( editable == "radio" ) {}
    else
    if ( editable == "text" ) {}
    else
    if ( editable == "textarea" )
    {
    }
    else editable = String ( editable ) == 'true' ? true : false ;

    this.editable.push ( editable ) ;
    if ( editable ) this.anyEditable = true ;
    var format = x.getAttribute ( "format" ) ;
    format = format ? format : false ;
    this.formats.push ( format ) ;

    var sortable = x.getAttribute ( "sortable" ) ;
    if ( typeof ( sortable ) != 'string' ) sortable = this.sortable ;
    else
    if ( sortable == 'false' ) sortable = false ;
    else
    if ( sortable == 'true' ) sortable = true ;
    this.sortableList.push ( sortable ) ;

    var editableWidth = x.getAttribute ( "width" ) ;
    editableWidth = parseInt ( editableWidth ) ;
    if ( isNaN ( editableWidth ) ) editableWidth = 0 ;
    this.editableWidth.push ( editableWidth ) ;

    var mandatory = x.getAttribute ( "mandatory" ) ;
    mandatory = mandatory ? mandatory : "" ;
    this.mandatory.push ( mandatory ) ;
    if ( mandatory ) this.anyMandatory = true ;

    if ( ! name ) name = title ;
    if ( ! name ) continue ;
    columnNames.push ( name ) ;
    if ( ! title ) title = " " ;
    columnTitles.push ( title ) ;
    if ( ! tooltip ) tooltip = "" ;
    columnTooltips.push ( tooltip ) ;
    this.columnTypes.push ( type ? type : "" ) ;
    this.textAlign.push ( align ) ;
    this.vAlign.push ( valign ) ;
    var xMappings = new TXml ( x ).getDom ( "Mappings" ) ;
    if ( ! xMappings )
    {
      this.mappings.push ( null ) ;
    	this.mappingLists.push ( null ) ;
    }
    else
    {
      var mappingList = [] ;
      var hMap = this.getMappings ( xMappings, mappingList ) ;
      if ( hMap ) this.mappingLists.push ( mappingList ) ;
      else        this.mappingLists.push ( null ) ;
      this.mappings.push ( hMap ) ;
    }
    var preSorted = x.getAttribute ( "pre-sorted" ) ;
    if ( preSorted )
    {
      if ( preSorted == 'up' ) { this.preSortedIndex = colIndex ; this.preSortedDirection = 1 ; }
      else
      if ( preSorted == 'down' ) { this.preSortedIndex = colIndex ; this.preSortedDirection = -1 ; }
      else
      if ( preSorted == '+' ) { this.preSortedIndex = colIndex ; this.preSortedDirection = 1 ; }
      else
      if ( preSorted == '-' ) { this.preSortedIndex = colIndex ; this.preSortedDirection = -1 ; }
    }
    colIndex++ ;
  }
  this.setColumns ( columnNames, columnTitles ) ;

  var str = this.xmlAttributes.getAttribute ( "click" ) ;
  if ( ! str ) str = this.xmlAttributes.getAttribute ( "onclick" ) ;
  if ( str ) this._addSelectionListener ( new TFunctionExecutor ( str, layoutContext ) ) ;
  str = this.xmlAttributes.getAttribute  ( "dblclick" ) ;
  if ( ! str ) str = this.xmlAttributes.getAttribute ( "ondblclick" ) ;
  if ( str ) this._addActionListener ( new TFunctionExecutor ( str, layoutContext ) ) ;

  str = this.xmlAttributes.getAttribute  ( "onchange" ) ;
  if ( str )
  {
    var selectable = this.xmlAttributes.getAttribute ( "selectable" ) ;
    if ( this.selectable && this.xmlAttributes.getAttribute ( "selectable" ) != "true" )
    {
      this.selectable = false ;
      if ( this.selectable ) this.selectedRowClassName = "ThemeTableRowClassSelected" ;
      else                   this.selectedRowClassName = "ThemeTableRowClass" ;
    }
    this.addPropertyChangeListener ( new TFunctionExecutor ( str, layoutContext ) ) ;
  }

  str = this.xmlAttributes.getAttribute  ( "onsetvalues" ) ;
  if ( str ) this.addSetValuesListener ( new TFunctionExecutor ( str, layoutContext ) ) ;
  str = this.xmlAttributes.getAttribute  ( "ongetvalues" ) ;
  if ( str ) this.addGetValuesListener ( new TFunctionExecutor ( str, layoutContext ) ) ;

  this.xmlAttributes = null ;

  this.TABLE = document.createElement ( "table" ) ;
  this.domBody.appendChild ( this.TABLE ) ;
  this.TABLE.className = "ThemeTableClass" ;
  this.TABLE.xClassName = "Table" ;
  this.TABLE.border = 0 ;
  this.TABLE.cellSpacing = 0 ;
  this.TABLE.cellPadding = 2 ;
  if ( this.popupMenu ) this.TABLE.oncontextmenu = function(){return false;};
  this.TBODY = document.createElement ( "tbody" ) ;
  this.TABLE.appendChild ( this.TBODY ) ;
  this.TBODY.className = "ThemeTableBodyClass" ;
  var h ;
  if ( this.showHeader )
  {
    this.TABLE2 = document.createElement ( "table" ) ;
    this.dom.appendChild ( this.TABLE2 ) ;
    this.TABLE2.className = "ThemeTableClass" ;
    this.TABLE2.xClassName = "Table" ;
    this.TABLE2.border = 0 ;
    this.TABLE2.cellSpacing = 0 ;
    this.TABLE2.cellPadding = 2 ;

    this.THEAD = document.createElement ( "thead" ) ;
    this.TABLE.appendChild ( this.THEAD ) ;
    this.THEAD.className = "ThemeTableHeadClass" ;
    this.THEAD2 = document.createElement ( "thead" ) ;
    this.TABLE2.appendChild ( this.THEAD2 ) ;
    this.THEAD2.className = "ThemeTableHeadClass" ;

    var TR = document.createElement ( "tr" ) ;
    var TR2 = document.createElement ( "tr" ) ;
    this.THEAD.appendChild ( TR ) ;
    this.THEAD2.appendChild ( TR2 ) ;
    TR.style.cursor = "default" ;
    TR2.style.cursor = "default" ;
    this.TR2 = TR2 ;

    for ( i = 0 ; i < this.columnTitles.length ; i++ )
    {
      var TD = document.createElement ( "td" ) ;
      var TD2 = document.createElement ( "td" ) ;
      TR.appendChild ( TD ) ;
      TR2.appendChild ( TD2 ) ;
      if ( columnTooltips[i] )
      {
        TD2.tooltip = columnTooltips[i] ;
      }
      if ( ! this.columnTitles[i] ) this.columnTitles[i] = "." ;
      if ( this.columnTitles[i].indexOf ( "<" ) >= 0 && this.columnTitles[i].indexOf ( ">" ) > 0 )
      {
        var span = document.createElement ( "span" ) ;
        TD.appendChild ( span ) ;
        span.innerHTML = this.columnTitles[i] ;
        var span2 = document.createElement ( "span" ) ;
        TD2.appendChild ( span2 ) ;
        span2.innerHTML = this.columnTitles[i] ;
      }
      else
      {
        TD.appendChild ( document.createTextNode ( this.columnTitles[i] ) ) ;
        TD2.appendChild ( document.createTextNode ( this.columnTitles[i] ) ) ;
      }
      if ( ! this.wordWrap ) { TD.style.whiteSpace = "nowrap" ; TD2.style.whiteSpace = "nowrap" ; }
      if ( this.sortableList[i] )
      {
        this.arrowUpImage = TGui.buildThemeImageUrl ( "Arrow", "up" ) ;
        var img = document.createElement ( "img" ) ;
        var txml = Tango.getThemeXml ( "Arrow", "up" ) ;
        var w = txml.getIntAttribute ( "width", 11 ) ;
        h = txml.getIntAttribute ( "height", 11 ) ;
        img.style.width = w + "px" ;
        img.style.height = h + "px" ;
        img.style.marginLeft = 4 + "px" ;
        img.style.visibility = "hidden" ;
        img.src = this.arrowUpImage ;
        TD.appendChild ( img ) ;
        TD.arrowImage = img ;

        var img2 = document.createElement ( "img" ) ;
        img2.style.width = w + "px" ;
        img2.style.height = h + "px" ;
        img2.style.marginLeft = 4 + "px" ;
        img2.style.visibility = "hidden" ;
        img2.src = this.arrowUpImage ;
        TD2.appendChild ( img2 ) ;
        TD2.arrowImage = img2 ;
      }
    }
  }

  if ( Tango.ua.realMobile )
  {
    TGui.addEventListener ( this.TABLE, "touchstart", this.touchstart.bindAsEventListener ( this ) ) ;
    TGui.addEventListener ( this.TABLE, "touchmove", this.touchmove.bindAsEventListener ( this ) ) ;
    TGui.addEventListener ( this.TABLE, "touchend", this.touchend.bindAsEventListener ( this ) ) ;
  }
  else
  {
    TGui.addEventListener ( this.TABLE, "dblclick", this.mouseDoubleClicked.bindAsEventListener ( this ) ) ;
    TGui.addEventListener ( this.TABLE, "mousedown", this.mouseDown.bindAsEventListener ( this ) ) ;
  }
  TGui.addEventListener ( this.TABLE, "mouseup", this.mouseUp.bindAsEventListener ( this ) ) ;
  this.dom.style.padding = "0px" ;
  if ( TGui.isLTR() )
  {
    this.TABLE.style.left = "0px" ;
  }
  this.TABLE.style.top = TGui.getComputedStyleInt ( this.dom, "border-top", 0 ) + "px" ;
  this.TABLE.style.margin = "0px" ;
  this.TABLE.style.border = "0px" ;
  TGui.addEventListener ( this.TABLE, "resize", this._tableResize.bindAsEventListener ( this ) ) ;
  TGui.addEventListener ( this.domBody, "scroll", this.domBodyScrolled.bindAsEventListener ( this ) ) ;
  this._setHeaderImages() ;
  var xData = xml.get ( "Data" ) ;
  if ( xData )
  {
    this.setData ( xData ) ;
    xData.remove() ;
  }
  if ( this.THEAD )
  {
    h = this.THEAD.offsetHeight ;
    this.TABLE.style.position = "absolute" ;
    this.TABLE.style.top = -h + "px" ; // XXX
    this.TABLE2.style.position = "absolute" ;
    this.TABLE2.style.top = "0px" ;
  }
  if ( TGui.isLTR() )
  {
    this.TABLE.style.left = "0px" ;
    if ( this.TABLE2 ) this.TABLE2.style.left = "0px" ;
  }
  columnTooltips.length = 0 ;
  xml.flush() ;

  this._focusHelper  = document.createElement ( "input" ) ;
  this._focusHelper.type = "text" ;
  this.dom.appendChild ( this._focusHelper ) ;
  this._focusHelper.style.borderWidth = "0px" ;
  this._focusHelper.style.backgroundColor = "transparent" ;
  this._focusHelper.style.color = "transparent" ;
  this._focusHelper.style.outline = "none" ;
  this._focusHelper.value = "" ;
  this._focusHelper.id = "" + ( 4711 + this._counter ) ;
  this._focusHelper._focusHelperOwner = this ;
  var thiz = this ;
  TGui.addEventListener ( this._focusHelper, "focus", function(ee)
  {
    TGlobalEventHandler.setFocus ( thiz.dom ) ;
  } ) ;
  TGui.addEventListener ( this._focusHelper, "blur", function(ee)
  {
    TGlobalEventHandler.unFocus() ;
  } ) ;
};
TTable.prototype.getFocusHelper = function()
{
  return this._focusHelper ;
};
TTable.prototype.setClassImages = function()
{
  var txml = Tango.getThemeXml ( "Selected", "background" ) ;
  if ( txml ) this.selectedBackgroundImageExists = true ;
  else        this.selectedBackgroundImageExists = false ;
  this._setHeaderImages ( true ) ;
  this._setClassImagesRow() ;
};
TTable.prototype.adjustHeader = function()
{
  this._setHeaderImages() ;
};
TTable.prototype._tableResize = function()
{
  this._setHeaderImages() ;
};
TTable.prototype._setHeaderImages = function ( refresh )
{
  if ( ! this.THEAD ) return ;
  var TABLE_width = this.TABLE.offsetWidth ;
  this.THEAD.className = "" ;
  this.THEAD.className = "ThemeTableHeadClass" ;
  this.THEAD2.className = "" ;
  this.THEAD2.className = "ThemeTableHeadClass" ;
  var TR = this.THEAD.firstChild ;
  var TR2 = this.THEAD2.firstChild ;
  if ( ! TR ) return ;
  var widthList = [] ;
  var i = 0 ;
  for ( var TD = TR.firstChild ; TD ; TD = TD.nextSibling )
  {
    if ( TD.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( TD.nodeName != "TD" ) continue ;
    TD.className = 'ThemeTableHeaderCellClass' ;
    if ( this.oldBehaviour )
    {
      if ( ! TD.listenerInstalled )
      {
        TD.listenerInstalled = true ;
        if ( this.sortableList[i] )
        {
          TGui.addEventListener ( TD, "mouseover", this.mouseOnHeader.bindAsEventListener ( this, "inside", TD, "mouseover", i ) ) ;
          TGui.addEventListener ( TD, "mouseout", this.mouseOnHeader.bindAsEventListener ( this, "normal", TD, "mouseout", i ) ) ;
//            TGui.addEventListener ( TD, "mousedown", this.mouseOnHeader.bindAsEventListener ( this, "pressed", TD, "mousedown", i ) ) ;
          TGui.addMouseDownEventListener ( TD, this.mouseOnHeader.bindAsEventListener ( this, "pressed", TD, "mousedown", i ) ) ;
          TGui.addEventListener ( TD, "mouseup", this.mouseOnHeader.bindAsEventListener ( this, "inside", TD, "mouseup", i ) ) ;
        }
      }
    }
    else
    {
      var dw = TGui.getComputedStyleInt ( TD, "padding-left", 0 )
             + TGui.getComputedStyleInt ( TD, "padding-right",0 )
             + TGui.getComputedStyleInt ( TD, "border-left",0 )
             + TGui.getComputedStyleInt ( TD, "border-right",0 )
             ;
      var ww = TD.offsetWidth - dw ;
      widthList.push ( ww ) ;
    }
    i++ ;
  }
  if ( this.oldBehaviour ) return ;
  this.TABLE2.style.width = TABLE_width + "px" ;
  i = 0 ;
  for ( TD = TR2.firstChild ; TD ; TD = TD.nextSibling )
  {
    if ( TD.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( TD.nodeName != "TD" ) continue ;
    if ( TD === this.TD2Right )
    {
      break ;
    }
    if ( TD.style.display.toUpperCase() === "NONE" )
    {
      i++ ;
      continue ;
    }
    TD.className = 'ThemeTableHeaderCellClass' ;
    TD.style.width = widthList[i] + "px" ;
    if ( ! TD.listenerInstalled )
    {
      TD.listenerInstalled = true ;
      if ( this.sortableList[i] )
      {
        TGui.addEventListener ( TD, "mouseover", this.mouseOnHeader.bindAsEventListener ( this, "inside", TD, "mouseover", i ) ) ;
        TGui.addEventListener ( TD, "mouseout", this.mouseOnHeader.bindAsEventListener ( this, "normal", TD, "mouseout", i ) ) ;
        TGui.addEventListener ( TD, "mousedown", this.mouseOnHeader.bindAsEventListener ( this, "pressed", TD, "mousedown", i ) ) ;
        TGui.addEventListener ( TD, "mouseup", this.mouseOnHeader.bindAsEventListener ( this, "inside", TD, "mouseup", i ) ) ;
      }
      else
      if ( TD.tooltip )
      {
        TGui.addEventListener ( TD, "mouseover", this.mouseOnHeaderTooltip.bindAsEventListener ( this, "inside", TD, "mouseover", i ) ) ;
        TGui.addEventListener ( TD, "mouseout", this.mouseOnHeaderTooltip.bindAsEventListener ( this, "normal", TD, "mouseout", i ) ) ;
      }
    }
    i++ ;
  }
  this.handleTD2Right ( refresh ) ;
  for ( TD = TR2.firstChild ; TD ; TD = TD.nextSibling )
  {
    if ( TD.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( TD.nodeName != "TD" ) continue ;
    TD.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "TableHeader", "normal", TD.offsetWidth, TD.offsetHeight ) ;
  }
};
TTable.prototype.mouseOnHeaderTooltip = function ( event, what, td, action, columnIndex )
{
  if ( td.tooltip )
  {
    if ( action === "mouseover" ) TGui.tooltipOver ( event ) ;
    else
    if ( action === "mouseout" ) TGui.tooltipOut ( event ) ;
    else
    if ( action === "mousedown" ) TGui.tooltipClose ( event ) ;
  }
};
TTable.prototype.mouseOnHeader = function ( event, what, td, action, columnIndex )
{
  if ( td.tooltip )
  {
    if ( action === "mouseover" ) TGui.tooltipOver ( event ) ;
    else
    if ( action === "mouseout" ) TGui.tooltipOut ( event ) ;
    else
    if ( action === "mousedown" ) TGui.tooltipClose ( event ) ;
  }
  td.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "TableHeader", what, td.offsetWidth, td.offsetHeight ) ;
  if ( what == "inside" )
  {
    td.className = 'ThemeTableHeaderCellClassInside' ;
  }
  else
  if ( what == "normal" )
  {
    td.className = 'ThemeTableHeaderCellClass' ;
  }
  else
  if ( what == "pressed" )
  {
    td.className = 'ThemeTableHeaderCellClassPressed' ;
  }
  if ( action == 'mouseup' )
  {
    this.selectedColumnIndex = columnIndex ;
    var ev = new TEvent ( event ) ;
    if ( ev.isButtonLeft() )
    {
      if ( this.sortableList[columnIndex] )
      {
        var row = td.parentNode ;
        if ( this.columnTypes.length <= this.selectedColumnIndex ) return ;
        if ( ! this.sortedTR || ! this.sortedTR.sortedTD || this.sortedTR.sortedTD != td )
        {
          if ( this.sortedTR ) this.sortedTR.sortDirection = 0 ;
          this.sortedTR = row ;
          this.sortedTR.sortDirection = 1 ;
        }
        else
        {
          this.sortedTR.sortDirection *= -1 ;
        }
        this.sortColumn ( this.selectedColumnIndex, this.sortedTR.sortDirection ) ;

        if ( this.sortedTR.sortedTD )
        {
          this.sortedTR.sortedTD.arrowImage.style.visibility = "hidden" ;
        }
        if ( this.sortedTR.sortDirection == 1 )
        {
          td.arrowImage.style.visibility = "inherit" ;
          td.arrowImage.src = TGui.buildThemeImageUrl ( "Arrow", "up" ) ;
        }
        if ( this.sortedTR.sortDirection == -1 )
        {
          td.arrowImage.style.visibility = "inherit" ;
          td.arrowImage.src = TGui.buildThemeImageUrl ( "Arrow", "down" ) ;
        }
        this.sortedTR.sortedTD = td ;
        this.preSortedIndex = -1 ;
        this.preSortedDirection = 0 ;
      }
    }
    ev.consume() ;
  }
};
TTable.prototype.setColumns = function ( columnNames, columnTitles )
{
  if ( ! TSys.isArray ( columnNames ) )
  {
    throw "TTable: columnNames must be an array" ;
  }
  if ( columnNames.length === 0 )
  {
    throw "TTable: columnNames must not be empty" ;
  }
  if ( ! columnTitles )
  {
    columnTitles = columnNames ;
  }
  else
  {
    if ( ! TSys.isArray ( columnTitles ) )
    {
      throw "TTable: columnTitles must be an array" ;
    }
    if ( columnNames.length != columnTitles.length )
    {
      throw "TTable, setColumns: columnTitles must have the same length as columnNames" ;
    }
  }
  this.columnNames = columnNames ;
  this.namesOfHiddenColumns = [] ;

  this.column2Index = new Array() ;
  this.index2Column = new Array() ;
  if ( ! this.vAlign ) this.vAlign = [] ;
  var i ;
  for ( i = 0 ; i < columnNames.length ; i++ )
  {
    this.column2Index[columnNames[i]] = i ;
    this.index2Column[i] = columnNames[i] ;
  }
  this.columnTitles = columnTitles ;
};
TTable.prototype.onkeyup = function ( event )
{
  this.fireKeyEvent ( event ) ;
  var ev = new TEvent ( event ) ;
  if ( ev.isCursorUp() || ev.isCursorDown() )
  {
    ev.consume() ;
    return ;
  }
};
TTable.prototype.onkeydown = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( ev.isCursorUp() || ev.isCursorDown() )
  {
    ev.consume() ;
    // if ( Tango.ua.opera ) return ;
    this._handleCursorKeys ( ev ) ;
    return ;
  }
  if ( ev.isEnter() )
  {
    if ( ! this.selectedItem ) return ;
    ev = new TActionEvent ( event, "ACTION" ) ;
    ev.setPeer ( this ) ;
    ev.setHtmlSource ( this.TABLE ) ;
    this.fireActionEvent ( ev ) ;
    return ;
  }
  this.fireKeyEvent ( event ) ;
};
TTable.prototype.onkeypress = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( ev.isCursorUp() || ev.isCursorDown() )
  {
    if ( ! Tango.ua.opera ) return ;
    // this._handleCursorKeys ( ev ) ;
    return ;
  }
  this.fireKeyEvent ( event ) ;
};
TTable.prototype._handleCursorKeys = function ( ev )
{
  var d ;
  var nextSibling ;
  if ( ev.isCursorDown() && this.TBODY.firstChild )
  {
    this.selectedCell = null ;
    if ( ! this.selectedItem )
    {
      this._setSelected ( this.TBODY.firstChild, true ) ;
      this.domBody.scrollTop = this.selectedItem.offsetTop ;
    }
    else
    {
      nextSibling = this.selectedItem.nextSibling ;
      for ( ; nextSibling ; nextSibling = nextSibling.nextSibling )
      {
        if ( nextSibling.style.display.toUpperCase() !== "NONE" ) break ;
      }
      if ( nextSibling )
      {
        this._setSelected ( this.selectedItem, false ) ;
        this._setSelected ( nextSibling, true, true, ev.getEvent() ) ;
        d = this.selectedItem.offsetTop - this.domBody.clientHeight ;
        // if ( this.THEAD2 ) d += this.THEAD2.offsetHeight ;
        if ( d < 0 ) d = 0 ;
        if ( this.domBody.scrollTop != d ) this.domBody.scrollTop = d ;
      }
    }
  }
  else
  if ( ev.isCursorUp() && this.TBODY.firstChild )
  {
    this.selectedCell = null ;
    if ( ! this.selectedItem )
    {
      this._setSelected ( this.TBODY.lastChild, true ) ;
      this.domBody.scrollTop = this.selectedItem.offsetTop ;
    }
    else
    {
      nextSibling = this.selectedItem.previousSibling ;
      for ( ; nextSibling ; nextSibling = nextSibling.previousSibling )
      {
        if ( nextSibling.style.display.toUpperCase() !== "NONE" ) break ;
      }
      if ( nextSibling )
      {
        this._setSelected ( this.selectedItem, false ) ;
        this._setSelected ( nextSibling, true, true, ev.getEvent() ) ;
        d = this.domBody.scrollTop - this.selectedItem.offsetTop ;
        var dd = 0 ;
        if ( this.THEAD2 ) dd = this.THEAD2.offsetHeight ;
        d += dd ;
        if ( d >= 0 )
        {
          this.domBody.scrollTop = this.selectedItem.offsetTop - dd ;
        }
      }
    }
  }
};
TTable.prototype.focusGained = function()
{
  if ( typeof ( this._borderColor ) == 'undefined' ) this._borderColor = TGui.getComputedStyle ( this.dom, "border-color" ) ;
  this.dom.className = "ThemeTableContainerFocused" ;
  if ( this.selectonfocus )
  {
    if ( ! this.selectedItem && this.TBODY.firstChild )
    {
      this._setSelected ( this.TBODY.firstChild, true, true ) ;
    }
  }
};
TTable.prototype.focusLost = function()
{
  this.dom.className = "ThemeTableContainer" ;
};
TTable.prototype.clear = function()
{
  this.removeAll() ;
};
TTable.prototype.reset = function()
{
  if ( !this.resettable ) return ;
  this.removeAll() ;
};
TTable.prototype.getNumberOfRows = function()
{
  return this.TBODY.lastChild ? this.TBODY.lastChild.sectionRowIndex + 1 : 0 ;
};
TTable.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  this.popupMenu = null ;
  this.popupMenuClass = null ;
  if ( this.THEAD )
  {
    var TR = this.THEAD.firstChild ;
    if ( TR )
    {
      for ( var ch = TR.firstChild ; ch ; ch = ch.nextSibling )
      {
        if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
        if ( ch.nodeName != "TD" ) continue ;
        TGui.flushAttributes ( ch ) ;
      }
    }
  }
  var i ;
  for ( i = 0 ; i < this.keyListener.length ; i++ )
  {
    this.keyListener[i].flush() ;
  }
  for ( i = 0 ; i < this.selectionListener.length ; i++ )
  {
    this.selectionListener[i].flush() ;
  }
  for ( i = 0 ; i < this.actionListener.length ; i++ )
  {
    this.actionListener[i].flush() ;
  }
  for ( i = 0 ; i < this.itemListener.length ; i++ )
  {
    this.itemListener[i].flush() ;
  }
  this.propertyChangeHandler.flush() ;
  this.propertyChangeHandler = null ;
  this.actionListener.length = 0 ;
  this.keyListener.length = 0 ;
  this.selectionListener.length = 0 ;
  this.itemListener.length = 0 ;
  this.columnTypes.length = 0 ;
  this.textAlign.length = 0 ;
  this.vAlign.length = 0 ;
  this.mappings.length = 0 ;
  this.mappingLists.length = 0 ;
  this.editable.length = 0 ;
  this.editableWidth.length = 0 ;

  this.itemListener = null ;
  this.columnTypes = null ;
  this.textAlign = null ;
  this.formats.length = 0 ;
  this.vAlign = null ;
  this.mappings = null ;
  this.mappingLists = null ;
  this.actionListener = null ;
  this.selectionListener = null ;
  this.keyListener = null ;
  this.editable = null ;
  this.editableWidth = null ;
  this.removeAll() ;
};
TTable.prototype.setValues = function ( xml )
{
  if ( typeof ( xml ) != 'object' ) throw "TTable.setValues(): invalid xml data: " + xml ;
  if ( ! this.path && ( ! this.name || this.name.indexOf ( "$" ) >= 0 ) )
  {
//      TSys.log ( "TTable.setValues(): table has no name: " + this.name ) ;
//      throw "TTable.setValues(): table has no name: " +this.name ;
    return ;
  }

  if ( ! xml )
  {
    this.removeAll() ;
    return ;
  }
  var x = xml ;
  if ( xml.jsClassName == "TXml" )
  {
  }
  else
  {
    x = new TXml ( xml ) ;
  }
  var xmlDom = null ;
  if ( this.path )
  {
    xmlDom = x.getDom ( this.path ) ;
  }
  if ( ! xmlDom )
  {
    xmlDom = x.getDom ( this.name ) ;
  }
  if ( ! xmlDom )
  {
    if ( x.getName() == this.name )
    {
      xmlDom = x.getDom() ;
    }
  }
  if ( xmlDom ) this.setData ( xmlDom ) ;
  else
  if ( this.rowsPlain )
  {
    this.setData ( x ) ;
  }
};
TTable.prototype.getLocale = function()
{
  return TSys.getLocale ( this.dom ) ;
};
TTable.prototype.setData = function ( data )
{
  var si = this.selectedItem ;
  this.selectedItem = null ;
  this.selectedCell = null ;
  if ( si )
  {
    var ev = new TEvent ( null, TEvent.prototype.ITEM_DESELECTED ) ;
    ev.setHtmlSource ( this.dom ) ;
    this.fireItemEvent ( ev ) ;
  }
  this._hasChanged = false ;
  var sortedTR_previous = this.sortedTR ;
  var selectedColumnIndex_previous = this.selectedColumnIndex ;
/* do not reset but KEEP THE SORTING
  if ( this.sortedTR )
  {
    this.sortedTR.sortDirection = 0 ;
    if ( this.sortedTR.sortedTD && this.sortedTR.sortedTD.arrowImage )
    {
      this.sortedTR.sortedTD.arrowImage.style.visibility = "hidden" ;
    }
    this.sortedTR = null ;
  }
  this.selectedColumnIndex = -1 ;
*/
  if ( this.dom )
  {
    this.dom.scrollTop = 0 ;
  }

  if ( ! this.dom ) throw "TTable: setData: this.dom == null" ;
  if ( ! data )
  {
    this.removeAll() ;
    return ;
  }
  if ( typeof ( data ) == 'string' )
  {
    return ;
  }
  var dom = null ;
  if ( data.nodeName )
  {
    dom = data ;
  }
  else
  if ( data.jsClassName == "TXml" )
  {
    dom = data.getDom() ;
  }
  else
  {
    throw "TTable: setData: table data must be: html-string | xml-dom | TXml" ;
  }
  while ( this.TBODY.firstChild )
  {
    this.TBODY.removeChild ( this.TBODY.firstChild ) ;
  }
  this.sortedTR = null ;
  var en = new TXEnum ( dom, this.rowName ) ;
  var columnValues = [] ;
  var columnVisibleText = [] ;
  var columnIsIcon = [] ;
  var n = 0 ;
  var TR = null ;
  var maxStrings = [] ;
  var editableComponents = [] ;
  var radioAndCheckboxNames = [] ;
  var eRowElements = [] ;
  var i ;
  for ( i = 0 ; i < this.columnNames.length ; i++ )
  {
    maxStrings[i] = this.columnTitles[i] ;
    editableComponents[i] = [] ;
    radioAndCheckboxNames[i] = TSys.getTempId() ;
  }
  var locale = this.getLocale() ;
  var decimalSeparator = locale.getDecimalSeparator() ;
  var a ;
  var t ;
  var tt ;
  var eCB = null ;
  var val = null ;
  var def = null ;
  var fontSize = null ;
  var fontWeight = null ;
  var fontFamily = null ;
  var ch = null ;
  var index ;
  while ( en.hasNext() )
  {
    var eRow = en.next() ;
    if ( this.setValuesListener.length )
    {
      this.fireOnSetValues ( new TXml ( eRow ) ) ;
    }
    TR = document.createElement ( "tr" ) ;
    this.TBODY.appendChild ( TR ) ;
    TR.className = "ThemeTableRowClass" ;

    var color = eRow.getAttribute ( "color" ) ;
    var bgcolor = eRow.getAttribute ( "background-color" ) ;
    fontWeight = eRow.getAttribute ( "font-weight" ) ;
    fontSize = eRow.getAttribute ( "font-size" ) ;
    fontFamily = eRow.getAttribute ( "font-family" ) ;
    var font = eRow.getAttribute ( "font" ) ;
		if ( eRow.getAttribute ( "selectable" ) === "false" )
		{
			TR.unselectable = true ;
		}

    if ( font ) TR.style.font = font ;
    if ( color ) TR.style.color = color ;
    if ( bgcolor ) TR.style.backgroundColor = bgcolor ;
    if ( fontWeight ) TR.style.fontWeight = fontWeight ;
    if ( fontSize ) TR.style.fontSize = fontSize ;
    if ( fontFamily ) TR.style.fontFamily = fontFamily ;

    for ( ch = eRow.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;

      index = this.column2Index[ch.nodeName] ;
      if ( isNaN ( index ) ) continue ;
      eRowElements[index] = ch ;
      columnVisibleText[index] = ch.getAttribute ( "visibleText" ) ;
      var s = null ;
      if ( ch.firstChild && ch.firstChild.nodeValue )
      {
        columnValues[index] = String ( ch.firstChild.nodeValue ) ;
      }
      else
      {
        columnValues[index] = "" ;
      }

      if ( ! columnValues[index] && ! columnVisibleText[index] )
      {
        columnVisibleText[index] = "" ;
        columnValues[index] = "" ;
      }
      else
      if ( ! columnValues[index] )
      {
        columnValues[index] = columnVisibleText[index] ;
      }
      else
      if ( ! columnVisibleText[index] )
      {
        columnVisibleText[index] = columnValues[index] ;
      }
      if ( ch.getAttribute ( "isIcon" ) )
      {
        columnIsIcon[index] = true ;
        columnVisibleText[index] = "  " ;
      }
      a = this.mappings[index] ;
      if ( a )
      {
        var as = a[columnVisibleText[index]] ;
        if ( typeof ( as ) != 'undefined' ) columnVisibleText[index] = as ;
      }
      if ( columnVisibleText[index].length > maxStrings[index].length )
      {
        maxStrings[index] = columnVisibleText[index] ;
      }
    }

    if ( n % 2 == 1 ) TR.className = "ThemeTableRowClassAlternate" ;

    n++ ;
    TR.originalIndex = n ;
    TR.domRow = eRow ;
    for ( i = 0 ; i < columnValues.length ; i++ )
    {
      var eRowChild = eRowElements[i] ;
      var TD = document.createElement ( "td" ) ;
      TR.appendChild ( TD ) ;
      TD.name = this.index2Column[i] ;
      if ( this.namesOfHiddenColumns[TD.name] )
      {
        TD.style.display = 'NONE' ;
      }

      if ( ! columnValues[i] ) columnValues[i] = "  " ;
      if ( ! columnVisibleText[i] ) columnVisibleText[i] = "  " ;
      var str ;
      var canEdit = true ;
      var f ;
      if ( columnIsIcon[i] || this.columnTypes[i] == 'icon' )
      {
        str = columnValues[i].trim() ;
        if ( str )
        {
          TD.innerHTML = "<img src='" + str + "' />" ;
        }
        else
        {
          TD.innerHTML = "" ;
        }
      }
      else
      if ( this.editable[i] && this.editable[i] != 'textarea' )
      {
        if (  this.editable[i] == "check"
           || this.editable[i] == "checkbox"
           || this.editable[i] == "radio"
           )
        {
          canEdit = true ;
          var disabledString = "" ;
          if ( eRowChild )
          {
            a = eRowChild.getAttribute ( "editable" ) ;
            if ( a == "false" ) { canEdit = false ; disabledString = " disabled='true'" ; }
          }
          if ( TSys.isIE() )
          {
            var type = this.editable[i] ;
            if ( type != 'radio' ) type = 'checkbox' ;

            a = this.mappings[i] ;
            tt = columnVisibleText[i].trim() ;
            str = columnValues[i] ;

            var checked = "" ;
            if ( a )
            {
              val = a["value"] ;
              def = a["default"] ;
              if ( tt == val ) checked = "checked" ;
            }
            if ( ! val ) val = "4" ;

            // TD.innerHTML = "<input type='" + type +"' name='" + radioAndCheckboxNames[i] + "' value='" + val + "' " + disabledString + " " + checked + " ></input>" ;
            TD.innerHTML = "<input type='" + type +"' name='" + this.columnNames[i] + "' value='" + val + "' " + disabledString + " " + checked + " ></input>" ;
            for ( var ee = TD.firstChild ; ee ; ee = ee.nextSibling )
            {
              if ( ee.nodeName == 'INPUT' )
              {
                eCB = ee ;
                break ;
              }
            }
            if ( def ) eCB.xDefaultValue = def ;
          }
          else
          {
            eCB = document.createElement ( "input" ) ;
            if ( this.editable[i] == "radio" )
            {
              eCB.type = 'radio' ;
              eCB.xClassName = "Radio" ;
            }
            else
            {
              eCB.type = 'checkbox' ;
              eCB.xClassName = "Checkbox" ;
            }
            TD.appendChild ( eCB ) ;
            if ( ! canEdit ) eCB.disabled = true ;
            // eCB.name = radioAndCheckboxNames[i] ;
            eCB.name = this.columnNames[i] ;
            a = this.mappings[i] ;
            tt = columnVisibleText[i].trim() ;
            str = columnValues[i] ;
            if ( a )
            {
              val = a["value"] ;
              def = a["default"] ;
              if ( typeof ( val ) != 'undefined' ) eCB.value = val ;
              if ( typeof ( def ) != 'undefined' ) eCB.xDefaultValue = def ;
              if ( tt == val ) eCB.checked = true ;
            }
            else
            {
              eCB.value = str ;
            }
          }
          TD.xInput = eCB ;
          if ( TSys.isIE() )
          {
            TGui.addEventListener ( eCB, "click", this._editableComponentChanged.bindAsEventListener ( this ) ) ;
          }
          else
          {
            TGui.addEventListener ( eCB, "change", this._editableComponentChanged.bindAsEventListener ( this ) ) ;
          }
        }
        else
        if ( this.editable[i] == "choice" )
        {
          canEdit = true ;
          if ( eRowChild )
          {
            a = eRowChild.getAttribute ( "editable" ) ;
            if ( a == "false" ) canEdit = false ;
          }
          var eCH = document.createElement ( "SELECT" ) ;
          editableComponents[i].push ( eCH ) ;
          eCH.name = this.columnNames[i] ;
          eCH.xClassName = "Choice" ;
          TD.appendChild ( eCH ) ;
          if ( ! canEdit ) eCH.disabled = true ;
          TD.xInput = eCH ;
          eCH.className = 'ThemeChoice' ;
          eCH.mandatory = this.mandatory[i] ;
          if ( this.editableWidth[i] ) eCH.style.width = this.editableWidth[i] + "px" ;
          a = this.mappings[i] ;
          if ( a )
          {
            var ml = this.mappingLists[i] ;
            var ii = 0 ;
            if ( eCH.mandatory ) eCH.options[ii++] = new Option ( "", "", false, false );
            for ( var iii = 0 ; iii < ml.length ; iii++ )
            {
              var key = ml[iii] ;
              val = a[key] ;
              if ( typeof ( val ) !== 'string' ) continue ;

              if ( columnValues[i] === key )
              {
                eCH.options[ii++] = new Option ( val, key, true, true );
              }
              else
              {
                eCH.options[ii++] = new Option ( val, key, false, false );
              }
            }
          }
          if ( eCH.mandatory )
          {
            TGui.addEventListener ( eCH, "change", TGui.checkMandatory ) ;
            TGui.setMandatoryDecoration ( eCH, false ) ;
          }
          TGui.addEventListener ( eCH, "change", this._editableComponentChanged.bindAsEventListener ( this ) ) ;
        }
        else
        if ( this.editable[i] === true || this.editable[i] == "text" )
        {
          a  = null ;
          canEdit = true ;
          var vt ;
          if ( eRowChild )
          {
            a = eRowChild.getAttribute ( "type" ) ;
            if ( a ) tempType = a ;
            a = eRowChild.getAttribute ( "editable" ) ;
            if ( a == "false" ) canEdit = false ;
          }
          if ( ! canEdit )
          {
            t = this.columnTypes[i] ;
            if ( columnVisibleText[i].indexOf  ( '<' ) >= 0 )
            {
              TD.innerHTML = columnVisibleText[i] ;
            }
            else
            if ( columnVisibleText[i].indexOf  ( '\n' ) >= 0 )
            {
              columnVisibleText[i] = columnVisibleText[i].trim() ;
              if ( columnVisibleText[i].indexOf  ( '\n' ) >= 0 )
              {
                str = columnVisibleText[i].replace ( /\n/g, "<br/>" ) ;
                TD.innerHTML = str ;
              }
              else
              {
                vt = columnVisibleText[i].trim() ;
	  						if ( ! vt ) vt = "" ;
                if ( t == "money" && vt )
	  						{
                  TD.innerHTML = locale.formatMoneyWithCurrency ( vt ) ;
	  						}
	  						else
                if ( ( t === 'float' || t === 'ufloat' ) && vt )
	  						{
                  if ( decimalSeparator == "," ) vt = vt.replace ( /\./, "," ) ;
                  TD.innerHTML = vt ;
          			}
	  						else
	  						{
                  TD.innerHTML = vt ;
          			}
              }
            }
            else
            {
              vt = columnVisibleText[i].trim() ;
							if ( ! vt ) vt = "" ;
              if ( t == "money" && vt )
							{
                TD.innerHTML = locale.formatMoneyWithCurrency ( vt ) ;
							}
							else
              if ( t === 'float' || t === 'ufloat' )
							{
                if ( decimalSeparator == "," ) vt = vt.replace ( /\./, "," ) ;
                TD.innerHTML = vt ;
        			}
							else
							{
                TD.innerHTML = vt ;
        			}
            }
            if ( t === "money" || t === 'float' || t === 'ufloat' || t === 'int' )
            {
              TD.style.textAlign = 'right' ;
            }
          }
          else
          {
            vt = columnVisibleText[i].trim() ;
            var eTF = document.createElement ( "INPUT" ) ;
            editableComponents[i].push ( eTF ) ;
            eTF.type = 'text' ;
            eTF.name = this.columnNames[i] ;
            eTF.xClassName = "TextField" ;
            eTF.value = vt ;
            TD.appendChild ( eTF ) ;
            TD.xInput = eTF ;
            eTF.className = 'ThemeTextField' ;
            eTF.mandatory = this.mandatory[i] ;
            if ( this.editableWidth[i] ) eTF.style.width = this.editableWidth[i] + "px" ;
            if ( eTF.mandatory ) TGui.setMandatoryDecoration ( eTF ) ;
            var tempType = this.columnTypes[i] ;
            if ( tempType == "int" )
            {
              eTF.style.textAlign = 'right' ;
              eTF.xType = "int" ;
              TGui.addEventListener ( eTF, "keyup", TGui.checkInput.bindAsEventListener ( TGui ) ) ;
              if ( this.mandatory[i] ) TGui.addEventListener ( eTF, "keyup", TGui.checkMandatory ) ;
            }
            else
            if ( tempType === "float" || tempType === 'ufloat' || tempType === "money" )
            {
              if ( decimalSeparator == "," ) vt = vt.replace ( /\./, "," ) ;
              eTF.value = vt ;
              TD.dir = "ltr" ;
              eTF.style.textAlign = 'right' ;
              eTF.extendedType = tempType === 'ufloat' ? 'ufloat' : 'float' ;
              TGui.addEventListener ( eTF, "keyup", TGui.checkInput.bindAsEventListener ( TGui ) ) ;
              if ( this.mandatory[i] ) TGui.addEventListener ( eTF, "keyup", TGui.checkMandatory ) ;
            }
            else
            if ( eTF.mandatory )
            {
              TGui.addEventListener ( eTF, "keyup", TGui.checkMandatory ) ;
            }
            TGui.addEventListener ( eTF, "keyup", this._editableComponentChanged.bindAsEventListener ( this ) ) ;
            TGlobalEventHandler._add_focushandler ( eTF ) ;
            eTF.window = this.window ;
          }
        }
      }
      else
      if ( this.columnTypes[i] == "date" )
      {
        columnValues[i] = columnValues[i].trim() ;
        if ( ! columnValues[i] )
        {
          TD.appendChild ( document.createTextNode ( "" ) ) ;
        }
        else
        {
          if ( ! this.formats[i] )
    			{
            TD.appendChild ( document.createTextNode ( locale.formatDateShort ( columnValues[i] ) ) ) ;
    			}
    			else
    			{
            f = locale.getDateFormat ( this.formats[i] ) ;
            TD.appendChild ( document.createTextNode ( locale.formatDate ( columnValues[i], f ) ) ) ;
    			}
        }
      }
      else
      if ( this.columnTypes[i] == "datetime" )
      {
        columnValues[i] = columnValues[i].trim() ;
        if ( ! columnValues[i] )
        {
          TD.appendChild ( document.createTextNode ( "" ) ) ;
        }
        else
        {
          if ( ! this.formats[i] )
    			{
            TD.appendChild ( document.createTextNode ( locale.formatDateTimeShort ( columnValues[i] ) ) ) ;
    			}
    			else
    			{
            f = locale.getDateFormat ( this.formats[i] ) ;
            TD.appendChild ( document.createTextNode ( locale.formatDateTime ( columnValues[i], f ) ) ) ;
    			}
        }
      }
      else
      if ( this.columnTypes[i] == "float" )
      {
        var cv = columnValues[i].trim() ;
        if ( cv )
        {
          if ( this.formats[i] )
          {
            var d = parseFloat ( cv ) ;
            StringFormatter.locale = locale ;
            cv = this.formats[i].sprintf ( d ) ;
            StringFormatter.locale = null ;
            if ( cv.indexOf ( ' ' ) >= 0 ) cv = cv.replace ( / /g, "&nbsp;" ) ;
            TD.innerHTML = cv ;
    			}
    			else
    			{
            TD.appendChild ( document.createTextNode ( locale.formatFloat ( cv ) ) ) ;
    			}
        }
        TD.dir = "ltr" ;
      }
      else
      if ( this.columnTypes[i] == "money" )
      {
        columnValues[i] = columnValues[i].trim() ;
        if ( columnValues[i] )
        {
          TD.appendChild ( document.createTextNode ( locale.formatMoneyWithCurrency ( columnValues[i] ) ) ) ;
        }
        TD.dir = "ltr" ;
      }
      else
      if ( columnVisibleText[i].indexOf  ( '<' ) >= 0 )
      {
        TD.innerHTML = columnVisibleText[i] ;
        if ( this.editable[i] == 'textarea' ) TD.editableTextArea = true ;
      }
      else
      if ( columnVisibleText[i].indexOf  ( '\n' ) >= 0 )
      {
        columnVisibleText[i] = columnVisibleText[i].trim() ;
        if ( columnVisibleText[i].indexOf  ( '\n' ) >= 0 )
        {
          str = columnVisibleText[i].replace ( /\n/g, "<br/>" ) ;
          TD.innerHTML = str ;
        }
        else
        {
          TD.appendChild ( document.createTextNode ( columnVisibleText[i] ) ) ;
        }
        if ( this.editable[i] == 'textarea' ) TD.editableTextArea = true ;
      }
      else
      {
        TD.appendChild ( document.createTextNode ( columnVisibleText[i] ) ) ;
        if ( this.editable[i] == 'textarea' ) TD.editableTextArea = true ;
      }
      if ( ! this.editable[i] )
      {
        t = this.columnTypes[i] ;
        if ( t == "money" || t == 'float' || t == 'int' )
        {
          TD.style.textAlign = 'right' ;
        }
        else
        if ( this.editableWidth[i] )
        {
          TD.style.whiteSpace = "" ;
          TD.style.width = this.editableWidth[i] + "px" ;
        }
      }
      if ( ! TR.unselectable ) TR.style.cursor = "pointer" ;
			else TR.style.cursor = "default" ;
      TD.className = "ThemeTableCellClass" ;
      if ( ! TD.style.width && ! this.wordWrap ) TD.style.whiteSpace = "nowrap" ;
      if ( this.textAlign.length > i && this.textAlign[i] ) TD.style.textAlign = this.textAlign[i] ;
      if ( this.vAlign.length > i && this.vAlign[i] ) TD.style.verticalAlign = this.vAlign[i] ;
      columnValues[i] = null ;
      columnIsIcon[i] = false ;
      columnVisibleText[i] = null ;
      eRowElements[i] = null ;
    }
  }
  this.TABLE.style.visibility = "hidden" ;
  this.TABLE.style.visibility = "inherit" ;

  var body = document.getElementsByTagName ( "body" )[0] ;
  var span = document.createElement ( "span" ) ;
  span.style.padding = "0px" ;
  span.style.margin = "0px" ;
  body.appendChild ( span ) ;
  span.innerHTML = "&nbsp;" ;

  fontSize = null ;
  fontWeight = null ;
  fontFamily = null ;
  var first = true ;
  for ( i = 0 ; i < this.editable.length ; i++ )
  {
    if ( this.editable[i] && this.editable[i] != "choice" )
    {
      if ( ! this.columnTypes[i] && ! this.editableWidth[i] )
      {
        if ( first )
        {
          a = editableComponents[i] ;
          if ( a[0] )
          {
            fontSize = TGui.getComputedStyle ( a[0], "font-size" ) ;
            fontWeight = TGui.getComputedStyle ( a[0], "font-weight" ) ;
            fontFamily = TGui.getComputedStyle ( a[0], "font-family" ) ;
            if ( fontSize ) span.style.fontSize = fontSize ;
            if ( fontWeight ) span.style.fontWeight = fontWeight ;
            if ( fontFamily ) span.style.fontFamily = fontFamily ;
            first = false ;
          }
        }
        span.innerHTML = maxStrings[i] ;
        var w = span.offsetWidth ; //+ 2 * TGui.M_width ;
        a = editableComponents[i] ;
        for ( var j = 0 ; j < a.length ; j++ )
        {
          a[j].style.width = w + "px" ;
          if ( fontSize ) a[j].style.fontSize = fontSize ;
          if ( fontWeight ) a[j].style.fontWeight = fontWeight ;
          if ( fontFamily ) a[j].style.fontFamily = fontFamily ;
          a[j] = null ;
        }
        a.length = 0 ;
        editableComponents[i] = null ;
      }
    }
  }
  maxStrings.length = 0 ;
  editableComponents.length = 0 ;
  body.removeChild ( span ) ;

  this._setHeaderImages() ;
  this._setClassImagesRow() ;
  if ( sortedTR_previous && selectedColumnIndex_previous >= 0 )
  {
   this.sortedTR = sortedTR_previous ;
   this.selectedColumnIndex = selectedColumnIndex_previous ;
   this.sortColumn ( this.selectedColumnIndex, this.sortedTR.sortDirection ) ;
  }
  else
  if ( this.preSortedIndex >= 0 )
  {
    this.sortColumn ( this.preSortedIndex, this.preSortedDirection ) ;
    if ( this.THEAD2 && this.THEAD2.firstChild )
    {
      var TR2 = this.THEAD2.firstChild ;
      i = 0 ;
      for ( ch = TR2.firstChild ; ch ; ch = ch.nextSibling )
      {
        if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
        if ( ch.nodeName != "TD" ) continue ;
        if ( i == this.preSortedIndex )
        {
          this.sortedTR = TR2 ;
          this.sortedTR.sortedTD = ch ;
          this.sortedTR.sortDirection = this.preSortedDirection ;
          break ;
        }
        i++ ;
      }
    }
    if ( this.sortedTR && this.sortedTR.sortedTD )
    {
      if ( this.sortedTR.sortDirection == 1 )
      {
        this.sortedTR.sortedTD.arrowImage.src = TGui.buildThemeImageUrl ( "Arrow", "up" ) ;
        this.sortedTR.sortedTD.arrowImage.style.visibility = "inherit" ;
      }
      if ( this.sortedTR.sortDirection == -1 )
      {
        this.sortedTR.sortedTD.arrowImage.src = TGui.buildThemeImageUrl ( "Arrow", "down" ) ;
        this.sortedTR.sortedTD.arrowImage.style.visibility = "inherit" ;
      }
    }
  }
  if ( this.TBODY.firstChild && this.selectOnFill )
  {
    this._setSelected ( this.TBODY.firstChild, true, true, null, true ) ;
  }
  if ( this.autofocus )
  {
    TGlobalEventHandler.setFocus ( this.dom ) ;
  }
};
TTable.prototype.mouseUp = function ( event )
{
  if ( this.currentTextArea && !this.currentTextAreaFocusDone  )
  {
    this.currentTextArea.focus() ;
    this.currentTextAreaFocusDone = true ;
    return ;
  }
  var ev ;

  if ( Tango.ua.firefox )
  {
    ev = new TEvent ( event, TEvent.prototype.ITEM_SELECTED ) ;
    ev.setPeer ( this ) ;
    ev.setHtmlSource ( this.TABLE ) ;
    this.fireItemEvent ( ev ) ;
    this.fireSelectionEvent ( ev ) ;
  }

  if ( this.popupMenu )
  {
    ev = new TEvent ( event ) ;
    var src = ev.getSource() ;
    var TD = src ;
    var TR = src.parentNode ;
    if ( TR.nodeName.toUpperCase() == "TD" )
    {
      TD = TR ;
      TR = TR.parentNode ;
    }
    var tbody = TR.parentNode ;
    if ( tbody && tbody.nodeName.toUpperCase() == "TBODY" )
    {
      if ( ev.isButtonRight()
         || ( ev.isButtonLeft() && ev.isAlt() )
         || ( ev.isButtonLeft() && ev.isShift() )
         )
      {
        if ( tbody.nodeName.toUpperCase() == "THEAD" )
        {
          return ;
        }
        else
        {
          var pm = new this.popupMenuClass ( this.popupMenu, TD ) ;
          pm.show ( event ) ;
        }
      }
    }
  }
  if ( this.selectMultiple )
  {
    ev = new TEvent ( event ) ;
    if ( ev.isCtrl() ) return ;
    if ( ev.isShift() ) return ;
    this.getNumberOfSelectedItems() ;
    if ( this.numberOfSelectedRows > 1 )
    {
      this.deselectAll() ;
      this.mouseDown ( event ) ;
    }
  }
};
TTable.prototype.touchstart = function ( event )
{
  this.touchMoveOccured = false ;
  this.doubleTapOccured = false ;
  if ( ! this.lastTap  )
  {
    this.lastTap = new Date().getTime() ;
    return ;
  }
  var now = new Date().getTime() ;
  if ( now - this.lastTap <= 500 )
  {
    this.lastTap = 0 ;
    if ( event.touches.length > 1 )
    {
      return ;
    }
    this.doubleTapOccured = true ;
    this.mouseDown ( event ) ;
    this.mouseDoubleClicked ( event ) ;
    var ev = new TEvent ( event ) ;
    ev.consume() ;
  }
  this.lastTap = 0 ;
};
TTable.prototype.touchmove = function ( event )
{
  this.touchMoveOccured = true ;
};
TTable.prototype.touchend = function ( event )
{
  if ( this.touchMoveOccured )
  {
    this.touchMoveOccured = false ;
    return ;
  }
  if ( this.doubleTapOccured )
  {
    this.doubleTapOccured = false ;
    return ;
  }
  this.touchMoveOccured = false ;
  this.mouseDown ( event ) ;
  var ev = new TEvent ( event ) ;
  ev.consume() ;
};
TTable.prototype.mouseDown = function ( event )
{
  var ev = new TEvent ( event ) ;
  ev.setPeer ( this ) ;
  var src = ev.getSource() ;

  if ( ! src )
  {
    ev.flush() ;
    return ;
  }

  var TD = src ;
  var TR = src.parentNode ;
  if ( ! TR )
  {
    ev.flush() ;
    return ;
  }
  this.selectedCell = null ;

  var ch ;
  TD = null ;
  TR = null ;
  for ( ch = src ; ch ; ch = ch.parentNode )
  {
    if ( ch.nodeName.toUpperCase() == "TD" )
    {
      TD = ch ;
    }
    if ( ch.nodeName.toUpperCase() == "TR" )
    {
      TR = ch ;
      break ;
    }
  }
if ( ev.isCtrl() && ev.isShift() )
{
  log ( new TXml ( TR.domRow ) ) ;
  return ;
}
  // if ( TR.nodeName.toUpperCase() == "TD" )
  // {
  //   TD = TR ;
  //   TR = TR.parentNode ;
  // }
  if ( TR.unselectable ) return ;
  var tbody = TR.parentNode ;
  this.selectedColumnIndex = -1 ;

  var en = new TXEnum ( TR, "td" ) ;
  while ( en.hasNext() )
  {
    this.selectedColumnIndex++ ;
    var th = en.next() ;
    if ( th === TD )
    {
      break ;
    }
  }
  if ( tbody.nodeName.toUpperCase() == "THEAD" )
  {
    return ;
  }
  if ( tbody.nodeName.toUpperCase() != "TBODY" ) return ;

  this.selectedCell = TD ;
  if ( TD.editableTextArea )
  {
    if ( TD.currentTextArea ) return ;
    if ( this.currentTextArea )
    {
      this._saveCurrentTextArea( true ) ;
      return ;
    }
    if ( this.selectedItem )
    {
      this._setSelected ( this.selectedItem, false, false, event ) ;
    }
    this._setSelected ( TR, true, false, event ) ;

    var w = TD.offsetWidth > 100 ? TD.offsetWidth - 4 : 100 ;
    var h = TD.offsetHeight > 100 ? TD.offsetHeight - 4 : 100 ;
    var xv = new TXml ( TD.parentNode.domRow ) ;
    var v = xv.getContent ( TD.name ) ;
    v = v.replace ( /<BR>/g, "\n" ).replace ( /<br>/g, "\n" ) ;
    while ( TD.firstChild )
    {
      TD.removeChild ( TD.firstChild ) ;
    }
    this.currentTextArea = document.createElement ( "TEXTAREA" ) ;
    TD.appendChild ( this.currentTextArea ) ;
    TD.currentTextArea = this.currentTextArea ;
    this.currentTextArea.className = "ThemeTextArea" ;
    this.currentTextArea.style.top = "0px" ;
    this.currentTextArea.style.left = "0px" ;
    this.currentTextArea.style.width = w + "px" ;
    this.currentTextArea.style.height = h + "px" ;
    this.currentTextArea.value = v ;
    TGui.addEventListener ( this.currentTextArea, "keydown", this._editableComponentStateChanged.bindAsEventListener ( this ) ) ;
    TGui.addEventListener ( this.currentTextArea, "keyup", this._editableComponentStateChanged.bindAsEventListener ( this ) ) ;
    TGui.addEventListener ( this.currentTextArea, "blur", this._editableComponentStateChanged.bindAsEventListener ( this ) ) ;
    this.currentTextAreaFocusDone = false ;
    this._setHeaderImages() ;
    this._setClassImagesRow() ;
    this.currentTextArea.TD = TD ;
    TD.appendChild ( document.createElement ( "br" ) ) ;
    var span = document.createElement ( "span" ) ;
    TD.appendChild ( span ) ;
    var img = document.createElement ( "img" ) ;
    span.style.width = "100%" ;
    span.appendChild ( img ) ;
    img.style.width = "16px" ;
    img.style.height = "16px" ;
    img.src = TGui.buildThemeImageUrl ( "Misc", "ok" ) ;
    TGui.addEventListener ( img, "mousedown", this._textareaOkMouseDown.bindAsEventListener ( this ) ) ;
    img = document.createElement ( "img" ) ;
    span.appendChild ( img ) ;
    img.style.width = "16px" ;
    img.style.height = "16px" ;
    img.src = TGui.buildThemeImageUrl ( "Misc", "edit-cancel" ) ;
    TGui.addEventListener ( img, "mousedown", this._textareaCancelMouseDown.bindAsEventListener ( this ) ) ;
    return ;
  }
  if ( this.selectMultiple )
  {
    if ( ev.isCtrl() )
    {
    }
    else
    if ( ev.isShift() )
    {
    }
    else
    {
      this.getNumberOfSelectedItems() ;
      if ( this.numberOfSelectedRows > 1 ) return ;
      this.deselectAll() ;
    }
  }
  else
  {
    this.deselectAll() ;
  }

  if ( this.selectMultiple && ev.isShift() )
  {
    var firstIndex = -1 ;
    var firstRow = null ;
    var rowIndex = -1 ;
    var lastIndex = -1 ;
    var lastRow = null ;

    this.selectedItem = TR ;

    var r = this.TBODY.firstChild ;
    var index = 0 ;
    while ( r )
    {
      if ( r.nodeType != DOM_ELEMENT_NODE )
      {
        r = r.nextSibling ;
        continue ;
      }
      if ( r === TR ) rowIndex = index ;
      if ( r.selected )
      {
        firstRow = r ;
        firstIndex = index ; break ;
      }
      index++ ;
      r = r.nextSibling ;
    }
    if ( r )
    {
      while ( r )
      {
        if ( r.nodeType != DOM_ELEMENT_NODE )
        {
          r = r.nextSibling ;
          continue ;
        }
        if ( r == TR ) rowIndex = index ;
        if ( r.selected )
        {
          lastRow = r ;
          lastIndex = index ;
        }
        index++ ;
        r = r.nextSibling ;
      }
    }
    this.deselectAll() ;
//      if ( rowIndex == -1 ) TR.index ;
    if ( firstIndex == -1 && lastIndex == -1 )
    {
      this._selectItems ( this.TBODY.firstChild, TR ) ;
    }
    else
    if ( firstIndex >= 0 && rowIndex >= firstIndex )
    {
      this._selectItems ( firstRow, TR ) ;
    }
    else
    if ( firstIndex >= 0 && rowIndex <= firstIndex )
    {
      this._selectItems ( TR, lastRow ) ;
    }
    this.selectedItem = TR ;
    ev.setType ( TEvent.prototype.ITEM_SELECTED ) ;
    try
    {
      this.fireSelectionEvent ( ev ) ;
      this.fireItemEvent ( ev ) ;
    }
    finally
    {
      ev.flush() ;
    }
  }
  else
  {
    if ( TR.selected )
    {
      if ( this.selectMultiple && ev.isCtrl() )
      {
        this._setSelected ( TR, false, true, event ) ;
      }
      else
      {
        this._setSelected ( TR, true, true, event ) ;
      }
    }
    else
    {
      this._setSelected ( TR, true, true, event ) ;
    }
  }
};
TTable.prototype._setSelected = function ( TR, state, fireSelectionEvent, event, ignoreBrowser )
{
  var ev ;
  state = state ? true : false ;

  if ( ! TR ) return ;
  if ( TR.selected == state ) return ;
  var isKey = false ;
  if ( event ) isKey = event.type.indexOf ( "key" ) === 0 ;
  if ( state )
  {
    TR.className = this.selectedRowClassName ;
    TR.selected = true ;
    this.selectedItem = TR ;
    if ( this.selectedBackgroundImageExists )
    {
      TR.style.backgroundColor = "transparent" ;
      TR.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "Selected", "background", TR.offsetWidth, TR.offsetHeight ) ;
    }
    if ( ! Tango.ua.firefox || isKey || ignoreBrowser )
    {
      ev = new TEvent ( event, TEvent.prototype.ITEM_SELECTED ) ;
      ev.setPeer ( this ) ;
      ev.setHtmlSource ( this.TABLE ) ;
      this.fireItemEvent ( ev ) ;
      if ( fireSelectionEvent ) this.fireSelectionEvent ( ev ) ;
    }
  }
  else
  {
    if ( TR.sectionRowIndex % 2 == 1 ) TR.className = "ThemeTableRowClassAlternate" ;
    else                               TR.className = "ThemeTableRowClass" ;
    TR.selected = false ;
    this.selectedItem = null ;
    if ( this.selectedBackgroundImageExists )
    {
      TR.style.backgroundImage = "none" ;
    }
    if ( ! Tango.ua.firefox || isKey || ignoreBrowser )
    {
      ev = new TEvent ( event, TEvent.prototype.ITEM_DESELECTED ) ;
      ev.setPeer ( this ) ;
      ev.setHtmlSource ( this.TABLE ) ;
      this.fireItemEvent ( ev ) ;
      if ( fireSelectionEvent ) this.fireSelectionEvent ( ev ) ;
    }
  }
};
TTable.prototype._textareaOkMouseDown = function ( event )
{
};
TTable.prototype._textareaCancelMouseDown = function ( event )
{
  this.currentTextArea.nosave = true ;
};
TTable.prototype._editableComponentStateChanged = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( event.type == 'blur' )
  {
  }
  else
  if ( ev.isEnter() && ev.isCtrl() ) {}
  else
  if ( event.type == 'keydown' && ev.isEscape() )
  {
    this._saveCurrentTextArea ( false ) ;
    return ;
  }
  else
  if ( event.type == 'mouseup' )
  {
    return ;
  }
  else
  {
    return ;
  }
  this._saveCurrentTextArea ( true ) ;
};
TTable.prototype._saveCurrentTextArea = function ( save )
{
  var xml ;
  if ( this.currentTextArea.nosave ) save = false ;
  var TD = this.currentTextArea.TD ;
  this.currentTextArea.TD = null ;
  var ta = this.currentTextArea ;
  this.currentTextArea = null ;
  var str = TD.currentTextArea.value ;
  TGui.flushAttributes ( TD ) ;
  TD.currentTextArea = null ;
  while ( TD.firstChild )
  {
    TD.removeChild ( TD.firstChild ) ;
  }
  if ( save )
  {
    TD.innerHTML = str.replace ( /\n/g, "<br/>" ) ;
    this._setHeaderImages() ;
    this._setClassImagesRow() ;
    xml = new TXml ( TD.parentNode.domRow ) ;
    var old = xml.getContent ( TD.name ) ;
    if ( old == str ) return ;
    xml.remove ( TD.name ) ;
    var x = xml.addCDATA ( TD.name, str ) ;

    var TR = TD ;
    for ( ; TR ; TR = TR.parentNode )
    {
      if ( TR.nodeName.toUpperCase() == 'TR' )
      {
        TR.hasChanged = true ;
        break ;
      }
    }
    this._hasChanged = true ;
    var ev = new TPropertyChangeEvent ( null, "EDITABLE_COMPONENT" ) ;
    ev.setHtmlSource ( ta ) ;
    ev.setPeer ( this ) ;
    this.propertyChangeHandler.fireEvent ( ev ) ;
  }
  else
  {
    xml = new TXml ( TD.parentNode.domRow ) ;
    TD.innerHTML = xml.getContent ( TD.name ) ;
  }
};
TTable.prototype._editableComponentChanged = function ( event )
{
  var x ;
  var newValue ;
  var ev = new TEvent ( event ) ;
  var kc = ev.getKeyCode() ;
  if (  kc == 27 // isEscape
     || kc == 33
     || kc == 34
     || kc == 35
     || kc == 36
     || kc == 37 // isCursorLeft
     || kc == 38 // isCursorUp
     || kc == 39 // isCursorRight
     || kc == 40 // isCursorRight
     || kc == 45
     || kc == 144 // NUM
     ) return ;
  if ( ev.isCtrl() )
  {
    if ( ev.getCharCode() == 'C' ) return ;
    if ( ev.getCharCode() == 'A' ) return ;
    if ( ev.isAlt() ) return ;
  }
  if ( kc == 16 ) return ; // shift only
  if ( kc == 17 ) return ; // CTRL only
  if ( kc == 18 ) return ;
  if ( kc == 20 ) return ;

  var TR = ev.getSource() ;
  for ( ; TR ; TR = TR.parentNode )
  {
    if ( TR.nodeName.toUpperCase() == 'TR' )
    {
      TR.hasChanged = true ;
      break ;
    }
  }
  if ( ev.isTab() )
  {
    if ( ! this.selectedItem )
    {
      this._setSelected ( TR, true ) ;
    }
    else
    if ( this.selectedItem && this.selectedItem != TR )
    {
      this._setSelected ( this.selectedItem, false ) ;
      this._setSelected ( TR, true ) ;
    }
    return ;
  }
  this._hasChanged = true ;
  ev = new TPropertyChangeEvent ( event, "EDITABLE_COMPONENT" ) ;
  var c = ev.getComponent() ;
  if ( c instanceof TChoice )
  {
    x = new TXml ( TR.domRow ) ;
    var oldValue = x.getContent ( c.getName() ) ;
//      ev.setOldValue ( oldValue ) ;
    newValue = c.getSelectedItem() ;
    ev.setNewValue ( newValue ) ;
  }
  else
  if ( ( c instanceof TCheckbox ) || ( c instanceof TRadio ) )
  {
    x = new TXml ( TR.domRow ) ;
    if ( c.isChecked() )
    {
      newValue = c.getValue() ;
      if ( typeof ( newValue ) != 'undefined' ) ev.setNewValue ( newValue ) ;
    }
  }
  else
  if ( c instanceof TTextField )
  {
    x = new TXml ( TR.domRow ) ;
    newValue = c.getText() ;
    if ( typeof ( newValue ) != 'undefined' ) ev.setNewValue ( newValue ) ;
  }
  ev.setPeer ( this ) ;
  this.propertyChangeHandler.fireEvent ( ev ) ;
};
TTable.prototype.firePropertyChangeEvent = function ( ev )
{
  if ( ! this.propertyChangeHandler ) return ;
  this._hasChanged = true ;
  if ( ! ev ) ev = new TPropertyChangeEvent ( null, "EDITABLE_COMPONENT" ) ;
  var c = ev.getComponent() ;
  if ( c )
  {
    if ( c instanceof TChoice )
    {
    }
    else
    if ( ( c instanceof TCheckbox ) || ( c instanceof TRadio ) )
    {
    }
    else
    if ( c instanceof TTextField )
    {
    }
  }
  ev.setPeer ( this ) ;
  this.propertyChangeHandler.fireEvent ( ev ) ;
};
TTable.prototype.getNumberOfSelectedItems = function()
{
  this.numberOfSelectedRows = 0 ;
  for ( var r = this.TBODY.firstChild ; r ; r = r.nextSibling )
  {
    if ( r.nodeType != DOM_ELEMENT_NODE )
    {
      continue ;
    }
    if ( r.className == "ThemeTableRowClassSelected" ) this.numberOfSelectedRows++ ;
  }
  return this.numberOfSelectedRows ;
};
TTable.prototype._selectItems = function ( startRow, endRow )
{
  this.numberOfSelectedRows = 0 ;
  var r = startRow ;
  while ( r )
  {
    if ( r.nodeType != DOM_ELEMENT_NODE )
    {
      r = r.nextSibling ;
      continue ;
    }
    this.numberOfSelectedRows++ ;
    r.className = this.selectedRowClassName ;
    r.selected = true ;
    if ( this.selectedBackgroundImageExists )
    {
//        TR.style.backgroundColor = "transparent" ;
      TR.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "Selected", "background", TR.offsetWidth, TR.offsetHeight ) ;
    }
    if ( r == endRow ) break ;
    r = r.nextSibling ;
  }
};
TTable.prototype._setClassImagesRow = function()
{
  for ( var TR = this.TBODY.firstChild ; TR ; TR = TR.nextSibling )
  {
    if ( TR.nodeType != DOM_ELEMENT_NODE )
    {
      continue ;
    }
    if ( ! TR.selected ) continue ;
    if ( this.selectedBackgroundImageExists )
    {
      TR.className = this.selectedRowClassName ;
      // TR.style.backgroundColor = "transparent" ;
      TR.style.backgroundImage = TGui.buildThemeBackgroundImageUrl ( "Selected", "background", TR.offsetWidth, TR.offsetHeight ) ;
    }
    else
    {
//        TR.style.backgroundColor = "inherit" ;
      TR.style.backgroundImage = "none" ;
      TR.className = this.selectedRowClassName ;
    }
  }
};
TTable.prototype.getAllItems = function ( changedOnly )
{
  var a = [] ;
  var ch = this.TBODY.firstChild ;
  var index = 0 ;
  while ( ch )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      ch = ch.nextSibling ;
      continue ;
    }
    if ( changedOnly && ! ch.hasChanged )
    {
      ch = ch.nextSibling ;
      continue ;
    }
//      ch.hasChanged = false ;
    a.push ( ch.domRow ) ;
    if ( this.anyEditable )
    {
      var xRow = new TXml ( ch.domRow   ) ;
      var ch1 = ch.firstChild ;
      index  = 0 ;
      while ( ch1 )
      {
        if ( ch1.xInput )
        {
          var x = xRow.getXml ( this.columnNames[index] ) ;
          if ( ! x ) x = xRow.addXml ( this.columnNames[index] ) ;
          if ( ch1.xInput.type == 'checkbox' || ch1.xInput.type == 'radio' )
          {
            if ( ch1.xInput.checked ) x.setContent ( ch1.xInput.value ) ;
            else
            {
              if ( ch1.xInput.xDefaultValue ) x.setContent ( ch1.xInput.xDefaultValue ) ;
            }
          }
          else
          if ( ch1.xInput.type == 'select-one' )
          {
            x.setContent ( ch1.xInput.value ) ;
          }
          else
          {
            var v = ch1.xInput.value ;
            if ( this.columnTypes[index] == 'float' || this.columnTypes[index] == 'money' )
      {
        v = v.replace ( /,/g, '.' ) ;
      }
            x.setContent ( v ) ;
          }
        }
        index++ ;
        ch1 = ch1.nextSibling ;
      }
      if ( this.getValuesListener.length )
      {
        this.fireOnGetValues ( xRow ) ;
      }
    }
    ch = ch.nextSibling ;
  }
  return a ;
};
TTable.prototype.getSelectedRows = function()
{
  if ( ! this.selectMultiple )
  {
    if ( ! this.selectedItem ) return [] ;
    return [ new TTableRow ( this, this.selectedItem ) ] ;
  }
  var a = [] ;
  for ( var ch = this.TBODY.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      continue ;
    }
    if ( ch.selected )
    {
      a.push ( new TTableRow ( this, ch ) ) ;
    }
  }
  return a ;
};
TTable.prototype.getSelectedItems = function()
{
  var a = [] ;
  var ch ;
  var index ;
  var xRow ;
  var x ;
  var v ;
  if ( ! this.selectMultiple )
  {
    if ( this.selectedItem )
    {
      a.push ( this.selectedItem.domRow ) ;
      if ( this.anyEditable )
      {
        xRow = new TXml ( this.selectedItem.domRow   ) ;
        ch = this.selectedItem.firstChild ;
        index  = 0 ;
        while ( ch )
        {
          if ( ch.xInput )
          {
            x = xRow.getXml ( this.columnNames[index] ) ;
            if ( ! x ) x = xRow.addXml ( this.columnNames[index] ) ;
            if ( ch.xInput.type == 'checkbox' || ch.xInput.type == 'radio' )
            {
              if ( ch.xInput.checked ) x.setContent ( ch.xInput.value ) ;
              else
              {
                if ( ch.xInput.xDefaultValue ) x.setContent ( ch.xInput.xDefaultValue ) ;
              }
            }
            else
            if ( ch.xInput.type == 'select-one' )
            {
              x.setContent ( ch.xInput.value ) ;
            }
            else
            {
              v = ch.xInput.value ;
              if ( this.columnTypes[index] == 'float' || this.columnTypes[index] == 'money' )
              {
                v = v.replace ( /,/g, '.' ) ;
              }
              x.setContent ( v ) ;
            }
          }
          index++ ;
          ch = ch.nextSibling ;
        }
        if ( this.getValuesListener.length )
        {
          this.fireOnGetValues ( xRow ) ;
        }
      }
    }
  }
  else
  {
    ch = this.TBODY.firstChild ;
    index = 0 ;
    while ( ch )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE )
      {
        ch = ch.nextSibling ;
        continue ;
      }
      if ( ch.selected )
      {
        a.push ( ch.domRow ) ;
        if ( this.anyEditable )
        {
          xRow = new TXml ( ch.domRow ) ;
          var ch1 = ch.firstChild ;
          index  = 0 ;
          while ( ch1 )
          {
            if ( ch1.firstChild )
            {
              if ( ch1.firstChild.nodeName == 'INPUT' || ch1.firstChild.nodeName == 'SELECT' )
              {
                x = xRow.getXml ( this.columnNames[index] ) ;
                if ( ! x ) x = xRow.addXml ( this.columnNames[index] ) ;
                if ( ch1.firstChild.type == 'select-one' )
                {
                  x.setContent ( ch1.firstChild.value ) ;
                }
                else
                {
                  v = ch1.firstChild.value ;
                  if ( this.columnTypes[index] == 'float' || this.columnTypes[index] == 'money' )
                  {
                    v = v.replace ( /,/g, '.' ) ;
                  }
                  x.setContent ( v ) ;
                }
              }
            }
            index++ ;
            ch1 = ch1.nextSibling ;
          }
        }
      }
      ch = ch.nextSibling ;
    }
  }
  return a ;
};
TTable.prototype.fireActionEvent = function ( ev )
{
  if ( this._flushed ) return ;
  for ( var i = 0 ; i < this.actionListener.length ; i++ )
  {
    this.actionListener[i].executeWithEvent ( ev ) ;
    if ( this._flushed ) break ;
  }
  ev.consume() ;
};
TTable.prototype.fireKeyEvent = function ( ev )
{
  if ( this._flushed ) return ;
  for ( var i = 0 ; i < this.keyListener.length ; i++ )
  {
    this.keyListener[i].executeWithEvent ( ev ) ;
    if ( this._flushed ) break ;
  }
};
TTable.prototype.fireSelectionEvent = function ( ev )
{
  if ( this._flushed ) return ;
  for ( var i = 0 ; i < this.selectionListener.length ; i++ )
  {
    this.selectionListener[i].executeWithEvent ( ev ) ;
    if ( this._flushed ) break ;
  }
};
TTable.prototype.fireItemEvent = function ( ev )
{
  if ( this._flushed ) return ;
  for ( var i = 0 ; i < this.itemListener.length ; i++ )
  {
    this.itemListener[i].executeWithEvent ( ev ) ;
    if ( ! this.selectionListener ) break ;
    if ( this._flushed ) break ;
  }
};
TTable.prototype.deselectAll = function()
{
  var si = this.selectedItem ;
  var TR = this.TBODY.firstChild ;
  while ( TR )
  {
    if ( TR.nodeType != DOM_ELEMENT_NODE )
    {
      TR = TR.nextSibling ;
      continue ;
    }
    if ( TR.selected )
    {
      if ( this.selectedBackgroundImageExists )
      {
        TR.style.backgroundImage = "none" ;
      }
      if ( TR.sectionRowIndex % 2 == 1 ) TR.className = "ThemeTableRowClassAlternate" ;
      else                               TR.className = "ThemeTableRowClass" ;
    }
    TR.selected = false ;
    TR = TR.nextSibling ;
  }
  this.selectedItem = null ;
  this.numberOfSelectedRows = 0 ;
  if ( si )
  {
    var ev = new TEvent ( null, TEvent.prototype.ITEM_DESELECTED ) ;
    this.fireItemEvent ( ev ) ;
  }
};
TTable.prototype.mouseClicked = function ( event )
{
  var ev = new TEvent ( event ) ;
};
TTable.prototype.mouseDoubleClicked = function ( event )
{
  var ev = new TEvent ( event ) ;
  ev.setJsSource ( this ) ;
  ev.consume() ;
  var src = ev.getSource() ;
  if ( ! src )
  {
    ev.flush() ;
    return ;
  }
  var TD = src ;
  var TR = src.parentNode ;
  if ( ! TR )
  {
    ev.flush() ;
    return ;
  }
  if ( TR.nodeName.toUpperCase() == "TD" )
  {
    TD = TR ;
    TR = TR.parentNode ;
  }
  var tbody = TR.parentNode ;
  this.selectedColumnIndex = -1 ;

  var en = new TXEnum ( TR, "td" ) ;
  while ( en.hasNext() )
  {
    this.selectedColumnIndex++ ;
    var th = en.next() ;
    if ( th == TD )
    {
      break ;
    }
  }
  if ( tbody.nodeName.toUpperCase() == "THEAD" )
  {
    ev.flush() ;
    return ;
  }
  try
  {
    ev.setAction ( "ACTION" ) ;
    this.fireActionEvent ( ev ) ;
  }
  finally
  {
    ev.flush() ;
  }
};
TTable.prototype.getSelectedColumnIndex = function()
{
  return this.selectedColumnIndex ;
};
TTable.prototype.getSelectedIndex = function()
{
  return this.selectedItem ? this.selectedItem.sectionRowIndex : -1 ;
};
TTable.prototype.getSelectedItem = function()
{
  return this.selectedItem ;
};
TTable.prototype.removeSelectedItem = function()
{
  if ( ! this.selectedItem ) return ;
  var si = this.selectedItem ;
  this.deselectAll() ;
  this.TBODY.removeChild ( si ) ;
  this._setHeaderImages() ;
  this._setClassImagesRow() ;
  var ev = new TPropertyChangeEvent ( null, "ROW_REMOVED" ) ;
  this.firePropertyChangeEvent ( ev ) ;
};
TTable.prototype.getSelectedUserData = function()
{
  return this.selectedItem ? this.selectedItem.domRow : null ;
};
TTable.prototype.getSelectedUserXml = function()
{
  return this.selectedItem ? new TXml ( this.selectedItem.domRow ) : null ;
};
TTable.prototype.addPropertyChangeListener = function ( obj, method, propertyName )
{
  this.propertyChangeHandler.add ( obj, method, propertyName ) ;
};
TTable.prototype.addItemListener = function ( self, listener )
{
  this._addItemListener ( new TFunctionExecutor ( self, listener ) ) ;
};
TTable.prototype._addItemListener = function ( functionExecutor )
{
  if ( ! functionExecutor ) return ;
  this.itemListener.push ( functionExecutor ) ;
};
TTable.prototype.addKeyListener = function ( self, listener )
{
  this._addKeyListener ( new TFunctionExecutor ( self, listener ) ) ;
};
TTable.prototype._addKeyListener = function ( functionExecutor )
{
  if ( ! functionExecutor ) return ;
  this.keyListener.push ( functionExecutor ) ;
};
TTable.prototype.addSelectionListener = function ( self, listener )
{
  this._addSelectionListener ( new TFunctionExecutor ( self, listener ) ) ;
};
TTable.prototype._addSelectionListener = function ( functionExecutor )
{
  if ( ! functionExecutor ) return ;
  this.selectionListener.push ( functionExecutor ) ;
};
TTable.prototype.addActionListener = function ( self, listener )
{
  this._addActionListener ( new TFunctionExecutor ( self, listener ) ) ;
};
TTable.prototype._addActionListener = function ( functionExecutor )
{
  if ( ! functionExecutor ) return ;
  this.actionListener.push ( functionExecutor ) ;
};
TTable.prototype.getCurrentSortDirection = function()
{
  if ( ! this.sortedTR ) return undefined ;
  return this.sortedTR.sortDirection ;
};
TTable.prototype.sortColumn = function ( columnIndex, sortDirection )
{
  var executeDelayed = false ;
  if ( TSys.isIE() && Tango.ua.ieVersion <= 9 )
  {
    if ( this.getNumberOfRows() > 50 )
    {
      executeDelayed = true ;
    }
  }
  else
  {
    if ( this.getNumberOfRows() * this.columnTypes > 5000 )
    {
      executeDelayed = true ;
    }
  }
  if ( executeDelayed )
  {
    var thiz = this ;
    TSys.executeLater ( function()
    {
      thiz._sortColumn ( columnIndex, sortDirection ) ;
    });
  }
  else
  {
    this._sortColumn ( columnIndex, sortDirection ) ;
  }
};
TTable.prototype._sortColumn = function ( columnIndex, sortDirection )
{
  var hasInput = this.editable[columnIndex] ? true : false ;
  var colName = this.index2Column[columnIndex] ;
  if ( ! colName ) return ;
  var a = new Array() ;

  var allIsEmpty = true ;
  var r = this.TBODY.firstChild ;
  var i = 0 ;
  var ii ;
  var isInt   = this.columnTypes[columnIndex] === "int"   || this.columnTypes[columnIndex] === "long" ;
  var isFloat = this.columnTypes[columnIndex] === "float" || this.columnTypes[columnIndex] === "money" ;
  var isIcon  = this.columnTypes[columnIndex] === "icon" ;
  while ( r )
  {
    if ( r.nodeType != DOM_ELEMENT_NODE )
    {
      r = r.nextSibling ;
      continue ;
    }
    if ( r.nodeName.toUpperCase() === "TR" )
    {
      var ud = r.domRow ;
      if ( isIcon )
      {
        a[i] = r ;
        i++ ;
        allIsEmpty = false ;
        r.tempStr = r.originalIndex ;
        r = r.nextSibling ;
        continue ;
      }
      var str = null ;
      if ( hasInput )
      {
        var i2 = 0 ;
        for ( var TD = r.firstChild ; TD ; TD = TD.nextSibling )
        {
          if ( TD.nodeType != DOM_ELEMENT_NODE ) continue ;
          if ( i2 == columnIndex )
          {
            if ( ! TD.xInput )
            {
              str = new TXml ( ud ).getContent ( colName ) ;
              break ;
            }
            str = TD.xInput.value ;
            break ;
          }
          i2++ ;
        }
      }
      else
      if ( ud )
      {
        str = new TXml ( ud ).getContent ( colName ) ;
      }
      a[i] = r ;
      i++ ;
      if ( isInt )
      {
        ii = parseInt ( str ) ;
        if ( isNaN ( ii ) )
        {
          r.tempStr = str ;
        }
        else
        {
          r.tempStr = ii ;
        }
      }
      else
      if ( isFloat )
      {
        ii = parseFloat ( str ) ;
        if ( isNaN ( ii ) )
        {
          r.tempStr = str ;
        }
        else
        {
          r.tempStr = ii ;
        }
      }
      else
      {
        r.tempStr = str ;
      }
      allIsEmpty = false ;
    }
    r = r.nextSibling ;
  }
  var factor = sortDirection ;
  if ( ! allIsEmpty )
  {
    a.sort ( function ( e1, e2 )
    {
      if ( typeof ( e1.tempStr ) === 'undefined' )
      {
        return factor ;
      }
      if ( typeof ( e2.tempStr ) === 'undefined' )
      {
        return - factor ;
      }
      if ( typeof ( e1.tempStr ) === 'string' && typeof ( e2.tempStr ) === 'string' )
      {
        return ( e1.tempStr.toUpperCase() > e2.tempStr.toUpperCase() ? factor : - factor ) ;
      }
      return ( e1.tempStr > e2.tempStr ? factor : - factor ) ;
    } );
  }
  i = 0 ;
  for ( i = 0 ; i < a.length ; i++ )
  {
    a[i].tempStr = undefined ;
    this.TBODY.removeChild ( a[i] ) ;
    this.TBODY.appendChild ( a[i] ) ;
    if ( i % 2 == 1 ) a[i].className = "ThemeTableRowClassAlternate" ;
    else              a[i].className = "ThemeTableRowClass" ;
    a[i] = null ;
  }
  a.length = 0 ;
};
TTable.prototype.getValues = function ( xml )
{
  if ( this.getValuesNone ) return ;
  if ( ! xml ) xml = new TXml() ;
  var a = null ;
  if ( this.getValuesChanged ) a = this.getAllItems ( true ) ;
  else
  if ( this.getValuesAll ) a = this.getAllItems() ;
  else                      a = this.getSelectedItems() ;
  for ( var i = 0 ; i < a.length ; i++ )
  {
    xml.addDuplicate ( a[i], this.rowName ) ;
  }
  a.length = 0 ;
  return xml ;
};
TTable.prototype.getMappings = function ( domMappings, mappingList )
{
  var hMap = null ;
  var str ;
  for ( var ch = domMappings.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      continue ;
    }
    var value = ch.getAttribute ( "value" ) ;
    var def   = ch.getAttribute ( "default" ) ;
    var fc = ch.firstChild ;
    if ( ! fc && ! def )
    {
      str = "" ;
      if ( ! hMap )
      {
        hMap = new Array() ;
      }
      if ( typeof ( value ) !== 'string' ) value = str ;
      hMap[value] = str ;
      mappingList.push ( value ) ;
    }
    else
    if ( fc )
    {
      str = fc.nodeValue ;
      if ( ! hMap )
      {
        hMap = new Array() ;
      }
      if ( typeof ( value ) !== 'string' ) value = str ;
      var str2 = TSys.translate ( str ) ;
      if ( ! str2 ) str2 = "" ;
      hMap[value] = str2 ;
      mappingList.push ( value ) ;
    }
    else
    if ( def )
    {
      if ( ! hMap )
      {
        hMap = new Array() ;
      }
      if ( typeof ( value ) !== 'string' ) value = def ;
      hMap["value"] = value ;
      hMap["default"] = def ;
      mappingList.push ( value ) ;
    }
  }
  return hMap ;
};
TTable.prototype.setRefData = function ( xml )
{
  if ( ! xml ) return ;
  var dom = xml ;
  if ( dom.jsClassName == "TXml" ) dom = xml.getDom() ;
  var en = new TXEnum ( dom, DOM_ELEMENT_NODE ) ;
  while ( en.hasNext() )
  {
    dom = en.next() ;
    var index = this.column2Index[dom.nodeName] ;
    if ( index >= 0 )
    {
      var mappingList = [] ;
      var hMap = this.getMappings ( dom, mappingList ) ;
      if ( hMap )
      {
        this.mappings[index] = hMap ;
        this.mappingLists[index] = mappingList ;
      }
    }
  }
};
TTable.prototype.isMandatoryOk = function()
{
  if ( ! this.anyMandatory ) return true ;
  if ( ! this.anyEdityble ) return true ;
  var r = this.TBODY.firstChild ;
  var index = 0 ;
  while ( r )
  {
    if ( r.nodeType != DOM_ELEMENT_NODE )
    {
      r = r.nextSibling ;
      continue ;
    }
    var ch = r.firstChild ;
    while ( ch )
    {
      if ( ch.firstChild )
      {
        if ( ch.firstChild.nodeName == 'SELECT' )
        {
          if ( ! new TXml ( ch ).isMandatoryOk() ) return false ;
        }
        else
        if ( ch.firstChild.nodeName == 'INPUT' )
        {
          if ( ! new TXml ( ch ).isMandatoryOk() ) return false ;
        }
      }
      ch = ch.nextSibling ;
    }
    r = r.nextSibling ;
  }
  return true ;
};
TTable.prototype.addToListenerContext = function ( listenerContext )
{
  if ( this.anyEditable )
  {
    listenerContext.addPropertyChangeListenerTo ( this ) ;
  }
  else
  {
    listenerContext.addItemListenerTo ( this ) ;
  }
};
TTable.prototype.findRow = function ( name, value )
{
  if ( typeof ( value ) == 'number' ) value = String ( value ) ;
  for ( var ch = this.TBODY.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    var xRow = new TXml ( ch.domRow   ) ;
    if ( xRow.getContent ( name ) == value )
    {
      return new TTableRow ( this, ch ) ;
    }
  }
  return null ;
};
TTable.prototype.selectRow = function ( name, pattern )
{
  this.deselectAll() ;
  if ( ! pattern )
  {
    this.scrollToTop() ;
    return ;
  }
  pattern = pattern.toUpperCase() ;
  for ( var TR = this.TBODY.firstChild ; TR ; TR = TR.nextSibling )
  {
    if ( TR.nodeType != DOM_ELEMENT_NODE ) continue ;
    var xRow = new TXml ( TR.domRow   ) ;
    var oc = xRow.getContent ( name ) ;
    if ( oc.toUpperCase().indexOf ( pattern ) >= 0 )
    {
      var r = new TTableRow ( this, TR ) ;
      r.setSelected ( true ) ;
      r.setVisibleOnScreen() ;
			return r ;
    }
  }
};
TTable.prototype.getContainer = function()
{
  if ( ! this._container )
    this._container = new TContainer ( this.dom ) ;
  return this._container ;
};
TTable.prototype.getBounds = function()
{
  return this.getContainer().getBounds() ;
};
TTable.prototype.setPopupMenu = function ( popupMenu, popupMenuClass )
{
  this.popupMenu = popupMenu ;
  this.popupMenuClass = popupMenuClass ? popupMenuClass : PopupMenu ;
};
TTable.prototype.setVisible = function ( state )
{
  this.getContainer().setVisible ( state ) ;
};
TTable.prototype.getName = function()
{
  return this.name ;
};
TTable.prototype.getSelectedRow = function()
{
  if ( ! this.selectedItem ) return null ;
  return new TTableRow ( this, this.selectedItem ) ;
};
TTable.prototype.getFirstRow = function()
{
  return this.getRowAt ( 0 ) ;
};
TTable.prototype.getLastRow = function()
{
  return this.getRowAt ( -1 ) ;
};
TTable.prototype.getRowAt = function ( index )
{
  var n = 0 ;
  var TR ;
  if ( index < 0 )
  {
    TR = this.TBODY.lastChild ;
    if ( ! TR ) return null ;
    return new TTableRow ( this, TR ) ;
  }
  for ( TR = this.TBODY.firstChild ; TR ; TR = TR.nextSibling )
  {
    if ( TR.sectionRowIndex == index ) return new TTableRow ( this, TR ) ;
  }
  return null ;
};
TTable.prototype.setColumnEditTypeRadio = function ( colIndexOrName )
{
  var index = this.getColumnIndexByName ( colIndexOrName ) ;
  if ( index < 0 ) return ;
  if ( this.editable[index] == "check" || this.editable[index] == "checkbox" )
  {
    this.editable[index] = "radio" ;
  }
};
TTable.prototype.setColumnEditTypeCheckBox = function ( colIndexOrName )
{
  var index = this.getColumnIndexByName ( colIndexOrName ) ;
  if ( index < 0 ) return ;
  if ( this.editable[index] == "radio" )
  {
    this.editable[index] = "check" ;
  }
};
TTable.prototype.checkAll = function ( colIndexOrName, state )
{
  state = state ? true : false ;
  var index = this.getColumnIndexByName ( colIndexOrName ) ;
  if ( index < 0 ) return ;
  if ( this.editable[index] != "check" ) return ;
  for ( var tr = this.TBODY.firstChild ; tr ; tr = tr.nextSibling )
  {
    var n = 0 ;
    tr.hasChanged = true ;
    for ( var td = tr.firstChild ; td ; td = td.nextSibling )
    {
      if ( n == index )
      {
        if ( ! td.xInput ) throw "Table: " + this.getName() + ", column " + index + " has no checkable." ;
        td.xInput.checked = state ;
        break ;
      }
      n++ ;
    }
  }
};
TTable.prototype.setColumnType = function ( colIndexOrName, type )
{
  var index = this.getColumnIndexByName ( colIndexOrName ) ;
  if ( index < 0 ) return ;
  this.columnTypes[index] = type ;
};
TTable.prototype.setColumnTitle = function ( colIndexOrName, title )
{
  if ( ! title ) title = "" ;
  var index = this.getColumnIndexByName ( colIndexOrName ) ;
  if ( index < 0 ) return ;

  var n = 0 ;
  var TR = this.THEAD.firstChild ;
  for ( var ch = TR.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( n == index )
    {
      ch.firstChild.nodeValue = title ;
      break ;
    }
    n++ ;
  }
/*
  this.columnTypes[index] = type ;
*/
};
TTable.prototype.getColumnIndexByName = function ( name )
{
  if ( typeof ( name ) == 'string' )
  {
    if ( ! name ) return -1 ;
  }
  else
  if ( typeof ( name ) == 'number' )
  {
    if ( name < 0 && name >= this.getNumberOfRows() ) return -1 ;
    return name ;
  }
  var index = this.column2Index[name] ;
  if ( typeof ( index ) == 'undefined' ) return -1 ;
  return index ;
};
TTable.prototype.getColumnNameByIndex = function ( index )
{
  if ( typeof ( index ) != 'number' ) return null ;
  return this.index2Column[index] ;
};
TTable.prototype.addRow = function ( row )
{
  return this.insertRowAt ( row, -1 ) ;
};
TTable.prototype.insertRowAt = function ( row, index )
{
  var locale = this.getLocale() ;
  var decimalSeparator = locale.getDecimalSeparator() ;
  var n = this.getNumberOfRows() ;
  var k ;
  var tr ;
  var i ;
  var f ;
  var a, str, tt, val, def, td, wmax ;
  if ( typeof ( index ) != 'number' ) index = -1 ;
  else
  if ( index < 0 )
  {
  }
  else
  if ( index >= n ) index = -1 ;

  var realName = this.rowName ;
  var eRow = row ;
  if ( row.jsClassName )
  {
    if ( row.jsClassName == "TXml" )
    {
      eRow = row.getDom() ;
      realName = row.getName() ;
    }
    else
    if ( row.jsClassName == "TTableRow" ) eRow = row.getDom() ;
  }
  if ( eRow.nodeName.toUpperCase() != this.rowName.toUpperCase() )
  {
    var xx = new TXml ( eRow ) ;
    var xxx = xx.getXml (this.rowName  ) ;
    if ( xxx && ! xxx.isEmpty() ) eRow = xxx.getDom() ;
  }
  this.sortedTR = null ;
  var columnValues = new Array() ;
  var columnVisibleText = new Array() ;
  var columnIsIcon = new Array() ;
  var TR = null ;

  TR = document.createElement ( "tr" ) ;
  if ( index < 0 )
  {
    if ( n % 2 == 1 ) TR.className = "ThemeTableRowClassAlternate" ;
    TR.originalIndex = n ;
    this.TBODY.appendChild ( TR ) ;
  }
  else
  {
    if ( n === 0 )
    {
      if ( n % 2 == 1 ) TR.className = "ThemeTableRowClassAlternate" ;
      TR.originalIndex = n ;
      this.TBODY.appendChild ( TR ) ;
    }
    else
    {
      k = 0 ;
      for ( tr = this.TBODY.firstChild ; tr ; tr = tr.nextSibling )
      {
        if ( k == index )
        {
          this.TBODY.insertBefore ( TR, tr ) ;
          break ;
        }
        k++ ;
      }
    }
    k = 0 ;
    for ( tr = this.TBODY.firstChild ; tr ; tr = tr.nextSibling )
    {
      if ( k % 2 == 1 ) TR.className = "ThemeTableRowClassAlternate" ;
      else              TR.className = "ThemeTableRowClass" ;
      tr.originalIndex = k ;
      k++ ;
    }
  }
  TR.className = "ThemeTableRowClass" ;
  var color = eRow.getAttribute ( "color" ) ;
  var bgcolor = eRow.getAttribute ( "background-color" ) ;
  var fontWeight = eRow.getAttribute ( "font-weight" ) ;
  var fontSize = eRow.getAttribute ( "font-size" ) ;
  var fontFamily = eRow.getAttribute ( "font-family" ) ;
  var font = eRow.getAttribute ( "font" ) ;
	if ( eRow.getAttribute ( "selectable" ) === "false" )
	{
		TR.unselectable = true ;
	}

  if ( font ) TR.style.font = font ;
  if ( color ) TR.style.color = color ;
  if ( bgcolor ) TR.style.backgroundColor = bgcolor ;
  if ( fontWeight ) TR.style.fontWeight = fontWeight ;
  if ( fontSize ) TR.style.fontSize = fontSize ;
  if ( fontFamily ) TR.style.fontFamily = fontFamily ;

  var editableComponents = [] ;
  var maxStrings = [] ;
  for ( i = 0 ; i < this.columnNames.length ; i++ )
  {
    maxStrings[i] = this.columnTitles[i] ;
    editableComponents[i] = [] ;
  }
  decimalSeparator = this.getLocale().getDecimalSeparator() ;
  var eRowElements = new Array() ;
  for ( var ch = eRow.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;

    var colIndex = this.column2Index[ch.nodeName] ;
    if ( isNaN ( colIndex ) ) continue ;
    eRowElements[colIndex] = ch ;
    columnVisibleText[colIndex] = ch.getAttribute ( "visibleText" ) ;
    var s = null ;
    if ( ch.firstChild && ch.firstChild.nodeValue )
    {
      columnValues[colIndex] = String ( ch.firstChild.nodeValue ) ;
    }
    else
    {
      columnValues[colIndex] = "" ;
    }

    if ( ! columnValues[colIndex] && ! columnVisibleText[colIndex] )
    {
      columnVisibleText[colIndex] = "" ;
      columnValues[colIndex] = "" ;
    }
    else
    if ( ! columnValues[colIndex] )
    {
      columnValues[colIndex] = columnVisibleText[colIndex] ;
    }
    else
    if ( ! columnVisibleText[colIndex] )
    {
      columnVisibleText[colIndex] = columnValues[colIndex] ;
    }
    if ( ch.getAttribute ( "isIcon" ) )
    {
      columnIsIcon[colIndex] = true ;
      columnVisibleText[colIndex] = "  " ;
    }
    a = this.mappings[colIndex] ;
    if ( a )
    {
      var as = a[columnVisibleText[colIndex]] ;
      if ( typeof ( as ) != 'undefined' ) columnVisibleText[colIndex] = as ;
    }
    if ( columnVisibleText[colIndex].length > maxStrings[colIndex].length )
    {
      maxStrings[colIndex] = columnVisibleText[colIndex] ;
    }
  }

  TR.domRow = eRow ;
  TR.domRowRealName = realName ;
  var tdIndexToBeAdjusted = [] ;
  for ( i = 0 ; i < columnValues.length ; i++ )
  {
    var eRowChild = eRowElements[i] ;
    if ( ! eRowChild )
    {
      // continue ;
    }
    var TD = document.createElement ( "td" ) ;
    TR.appendChild ( TD ) ;
    if ( eRowChild ) TD.name = eRowChild.nodeName ;
    if ( this.namesOfHiddenColumns[TD.name] )
    {
      TD.style.display = 'NONE' ;
    }
    if ( ! columnValues[i] ) columnValues[i] = "  " ;
    if ( ! columnVisibleText[i] ) columnVisibleText[i] = "  " ;
    if ( columnIsIcon[i] )
    {
      TD.innerHTML = "<img src='" + columnValues[i] + "' />" ;
    }
    else
    if ( columnVisibleText[i].indexOf  ( '<' ) >= 0 )
    {
      TD.innerHTML = columnVisibleText[i] ;
    }
    else
    if ( columnVisibleText[i].indexOf  ( '\n' ) >= 0 )
    {
      str = columnVisibleText[i].replace ( /\n/g, "<br/>" ) ;
      TD.innerHTML = str ;
    }
    else
    {
      if ( this.columnTypes.length > i )
      {
        if ( this.columnTypes[i] == "money" || this.columnTypes[i] == 'float' || this.columnTypes[i] == 'int' )
        {
          TD.style.textAlign = 'right' ;
        }
        if ( this.columnTypes[i] == "date" )
        {
          columnValues[i] = columnValues[i].trim() ;
          if ( ! columnValues[i] )
          {
            TD.appendChild ( document.createTextNode ( "" ) ) ;
          }
          else
          {
            if ( ! this.formats[i] )
	          {
              TD.appendChild ( document.createTextNode ( locale.formatDateShort ( columnValues[i] ) ) ) ;
	          }
	          else
	          {
              f = locale.getDateFormat ( this.formats[i] ) ;
              TD.appendChild ( document.createTextNode ( locale.formatDate ( columnValues[i], f ) ) ) ;
	          }
          }
        }
        else
        if ( this.columnTypes[i] == "datetime" )
        {
          columnValues[i] = columnValues[i].trim() ;
          if ( ! columnValues[i] )
          {
            TD.appendChild ( document.createTextNode ( "" ) ) ;
          }
          else
          {
            if ( ! this.formats[i] )
	          {
              TD.appendChild ( document.createTextNode ( locale.formatDateTimeShort ( columnValues[i] ) ) ) ;
	          }
	          else
	          {
              f = locale.getDateFormat ( this.formats[i] ) ;
              TD.appendChild ( document.createTextNode ( locale.formatDateTime ( columnValues[i], f ) ) ) ;
	          }
          }
        }
        else
        if ( this.columnTypes[i] == "float" )
        {
          var cv = columnValues[i].trim() ;
          if ( cv )
          {
            if ( this.formats[i] )
            {
              var d = parseFloat ( cv ) ;
              StringFormatter.locale = locale ;
              cv = this.formats[i].sprintf ( d ) ;
              StringFormatter.locale = null ;
              if ( cv.indexOf ( ' ' ) >= 0 ) cv = cv.replace ( / /g, "&nbsp;" ) ;
              TD.innerHTML = cv ;
	          }
	          else
	          {
              TD.appendChild ( document.createTextNode ( locale.formatFloat ( cv ) ) ) ;
	          }
          }
          TD.dir = "ltr" ;
        }
        else
        if ( this.columnTypes[i] == "money" )
        {
          columnValues[i] = columnValues[i].trim() ;
          if ( columnValues[i] )
          {
            TD.appendChild ( document.createTextNode ( locale.formatMoneyWithCurrency ( columnValues[i] ) ) ) ;
          }
          TD.dir = "ltr" ;
        }
        else
        {
          if ( this.editable[i] )
          {
            if (  this.editable[i] == "check"
               || this.editable[i] == "checkbox"
               || this.editable[i] == "radio"
               )
            {
              var eCB = null ;
              if ( TSys.isIE() )
              {
                var type = this.editable[i] ;
                if ( type != 'radio' ) type = 'checkbox' ;

                a = this.mappings[i] ;
                tt = columnVisibleText[i].trim() ;
                str = columnValues[i] ;

                val = null ;
                def = null ;
                var checked = "" ;
                if ( a )
                {
                  val = a["value"] ;
                  def = a["default"] ;
                  if ( tt == val ) checked = "checked" ;
                }
                if ( ! val ) val = "4" ;

//                TD.innerHTML = "<input type='" + type +"' name='" + radioAndCheckboxNames[i] + "' value='" + val + "' " + checked + " ></input>" ;
//                TD.innerHTML = "<input type='" + type +"' name='" + this.columnNames[i] + "' value='" + val + "' " + checked + " ></input>" ;
                TD.innerHTML = "<input type='" + type +"' ' value='" + val + "' " + checked + " ></input>" ;
                for ( var ee = TD.firstChild ; ee ; ee = ee.nextSibling )
                {
                  if ( ee.nodeName == 'INPUT' )
                  {
                    eCB = ee ;
                    break ;
                  }
                }
                if ( def ) eCB.xDefaultValue = def ;
              }
              else
              {
                eCB = document.createElement ( "input" ) ;
                if ( this.editable[i] == "radio" )
                {
                  eCB.type = 'radio' ;
                  eCB.xClassName = "Radio" ;
                }
                else
                {
                  eCB.type = 'checkbox' ;
                  eCB.xClassName = "Checkbox" ;
                }
                TD.appendChild ( eCB ) ;
//                eCB.name = radioAndCheckboxNames[i] ;
//                eCB.name = this.columnNames[i] ;
                a = this.mappings[i] ;
                tt = columnVisibleText[i].trim() ;
                str = columnValues[i] ;
                if ( a )
                {
                  val = a["value"] ;
                  def = a["default"] ;
                  if ( val ) eCB.value = val ;
                  if ( def ) eCB.xDefaultValue = def ;
                  if ( tt == val ) eCB.checked = true ;
                }
                else
                {
                  eCB.value = str ;
                }
              }
              TD.xInput = eCB ;
              TGui.addEventListener ( eCB, "change", this._editableComponentChanged.bindAsEventListener ( this ) ) ;
            }
            else
            if ( this.editable[i] == "choice" )
            {
              var eCH = document.createElement ( "SELECT" ) ;
              editableComponents[i].push ( eCH ) ;
              eCH.name = this.columnNames[i] ;
              eCH.xClassName = "Choice" ;
              TD.appendChild ( eCH ) ;
              TD.xInput = eCH ;
              eCH.className = 'ThemeChoice' ;
              eCH.mandatory = this.mandatory[i] ;
              if ( this.editableWidth[i] ) eCH.style.width = this.editableWidth[i] + "px" ;
              a = this.mappings[i] ;
              if ( a )
              {
                var ii = 0 ;
                if ( eCH.mandatory ) eCH.options[ii++] = new Option ( "", "", false, false );
                var ml = this.mappingLists[i] ;
                for ( var iii = 0 ; iii < ml.length ; iii++ )
                {
                  var key = ml[iii] ;
                  val = a[key] ;
                  if ( typeof ( val ) != 'string' ) continue ;
                  if ( columnValues[i] == key )
                  {
                    eCH.options[ii++] = new Option ( val, key, true, true );
                  }
                  else
                  {
                    eCH.options[ii++] = new Option ( val, key, false, false );
                  }
                }
              }
              if ( eCH.mandatory )
              {
                TGui.addEventListener ( eCH, "change", TGui.checkMandatory ) ;
                TGui.setMandatoryDecoration ( eCH, false ) ;
              }
              TGui.addEventListener ( eCH, "change", this._editableComponentChanged.bindAsEventListener ( this ) ) ;
            }
            else
            if ( this.editable[i] === true || this.editable[i] == "text" )
            {
              var canEdit = true ;
              var eTF = document.createElement ( "INPUT" ) ;
              TD.appendChild ( eTF ) ;
              editableComponents[i].push ( eTF ) ;
              eTF.type = 'text' ;
              eTF.name = this.columnNames[i] ;
              eTF.xClassName = "TextField" ;
              var vt = columnVisibleText[i].trim() ;
              eTF.value = vt ;
              TD.xInput = eTF ;
              eTF.className = 'ThemeTextField' ;
              eTF.mandatory = this.mandatory[i] ;

              if ( this.editableWidth[i] ) eTF.style.width = this.editableWidth[i] + "px" ;
							else                         tdIndexToBeAdjusted[i] = "x" ;

              if ( eTF.mandatory ) TGui.setMandatoryDecoration ( eTF ) ;
              var tempType = this.columnTypes[i] ;
              a  = null ;
              if ( eRow ) a  = eRow.getAttribute ( "type" ) ;
              if ( a ) tempType = a ;
              if ( tempType == "int" )
              {
                eTF.style.textAlign = 'right' ;
                eTF.xType = "int" ;
                TGui.addEventListener ( eTF, "keyup", TGui.checkInput.bindAsEventListener ( TGui ) ) ;
                if ( this.mandatory[i] ) TGui.addEventListener ( eTF, "keyup", TGui.checkMandatory ) ;
              }
              else
              if ( tempType == "float" || tempType == "money" )
              {
                if ( decimalSeparator == "," ) vt = vt.replace ( /\./, "," ) ;
                eTF.value = vt ;
                TD.dir = "ltr" ;
                eTF.style.textAlign = 'right' ;
                eTF.extendedType = "float" ;
                TGui.addEventListener ( eTF, "keyup", TGui.checkInput.bindAsEventListener ( TGui ) ) ;
                if ( this.mandatory[i] ) TGui.addEventListener ( eTF, "keyup", TGui.checkMandatory ) ;
              }
              else
              if ( eTF.mandatory )
              {
                TGui.addEventListener ( eTF, "keyup", TGui.checkMandatory ) ;
              }
              TGui.addEventListener ( eTF, "keyup", this._editableComponentChanged.bindAsEventListener ( this ) ) ;
              TGlobalEventHandler._add_focushandler ( eTF ) ;
              eTF.window = this.window ;
            }
          }
          else
          {
            TD.appendChild ( document.createTextNode ( columnVisibleText[i] ) ) ;
          }
        }
      }
      else
      {
        TD.appendChild ( document.createTextNode ( columnVisibleText[i] ) ) ;
      }
    }
    if ( ! TR.unselectable ) TR.style.cursor = "pointer" ;
    else TR.style.cursor = "default" ;
    if ( ! this.wordWrap ) TD.style.whiteSpace = "nowrap" ;
    if ( this.textAlign.length > i && this.textAlign[i] ) TD.style.textAlign = this.textAlign[i] ;
    columnValues[i] = null ;
    columnIsIcon[i] = false ;
    columnVisibleText[i] = null ;
  }

	var body = document.getElementsByTagName ( "body" )[0] ;
	var span = document.createElement ( "span" ) ;
	span.style.padding = "0px" ;
	span.style.margin = "0px" ;
	body.appendChild ( span ) ;
	span.innerHTML = "&nbsp;" ;

	var first = true ;
	fontSize = null ;
	fontWeight = null ;
	fontFamily = null ;
	for ( i = 0 ; i < this.editable.length ; i++ )
	{
		if ( this.editable[i] && this.editable[i] != "choice" )
		{
			if ( ! this.columnTypes[i] && ! this.editableWidth[i] )
			{
				if ( first )
				{
					a = editableComponents[i] ;
					if ( a[0] )
					{
						fontSize = TGui.getComputedStyle ( a[0], "font-size" ) ;
						fontWeight = TGui.getComputedStyle ( a[0], "font-weight" ) ;
						fontFamily = TGui.getComputedStyle ( a[0], "font-family" ) ;
						if ( ! fontSize ) fontSize = TGui.getComputedStyle ( span, "font-size" ) ;
						if ( ! fontWeight ) fontWeight = TGui.getComputedStyle ( span, "font-weight" ) ;
						if ( ! fontFamily ) fontFamily = TGui.getComputedStyle ( span, "font-family" ) ;
						if ( fontSize ) span.style.fontSize = fontSize ;
						if ( fontWeight ) span.style.fontWeight = fontWeight ;
						if ( fontFamily ) span.style.fontFamily = fontFamily ;
						first = false ;
					}
				}
				span.innerHTML = maxStrings[i] ;
				var w = span.offsetWidth ; //+ 2 * TGui.M_width ;
				a = editableComponents[i] ;
				for ( var j = 0 ; j < a.length ; j++ )
				{
					a[j].style.width = w + "px" ;
					if ( fontSize ) a[j].style.fontSize = fontSize ;
					if ( fontWeight ) a[j].style.fontWeight = fontWeight ;
					if ( fontFamily ) a[j].style.fontFamily = fontFamily ;
					a[j] = null ;
				}
				a.length = 0 ;
				editableComponents[i] = null ;
			}
		}
	}
	maxStrings.length = 0 ;
	editableComponents.length = 0 ;
	body.removeChild ( span ) ;

  var dw ;
//  var index = 0 ;
  for ( tr = this.TBODY.firstChild ; tr ; tr = tr.nextSibling )
  {
    index = 0 ;
    for ( td = tr.firstChild ; td ; td = td.nextSibling )
    {
      if ( tdIndexToBeAdjusted[index] )
      {
        wmax = tdIndexToBeAdjusted[index] >= 0 ? wmax : 0 ;
        wmax = Math.max ( wmax, td.xInput.offsetWidth ) ;
        tdIndexToBeAdjusted[index] = wmax ;
        if ( typeof ( dw ) == 'undefined' )
				{
          dw = TGui.getComputedStyleInt ( td.xInput, "padding-left", 0 )
             + TGui.getComputedStyleInt ( td.xInput, "padding-right", 0 )
             + TGui.getComputedStyleInt ( td.xInput, "border-left-width", 0 )
             + TGui.getComputedStyleInt ( td.xInput, "border-right-width", 0 )
             ;
				}
      }
      index++ ;
    }
  }
  for ( tr = this.TBODY.firstChild ; tr ; tr = tr.nextSibling )
  {
    index = 0 ;
    for ( td = tr.firstChild ; td ; td = td.nextSibling )
    {
      if ( tdIndexToBeAdjusted[index] )
      {
        wmax = tdIndexToBeAdjusted[index] ;
				td.xInput.style.width = ( wmax - dw ) + "px" ;
      }
      index++ ;
    }
  }

  tdIndexToBeAdjusted.length = 0 ;
  columnValues.length = 0 ;
  columnVisibleText.length = 0 ;
  columnIsIcon.length = 0 ;
  this._setHeaderImages() ;
  this._setClassImagesRow() ;
  return new TTableRow ( this, TR ) ;
};
TTable.prototype.removeAll = function ()
{
  this.deselectAll() ;
  this._hasChanged = false ;
  if ( ! this.TBODY ) return ;
  if ( this.sortedTR )
  {
    this.sortedTR.sortDirection = 0 ;
    if ( this.sortedTR.sortedTD && this.sortedTR.sortedTD.arrowImage )
    {
      this.sortedTR.sortedTD.arrowImage.style.visibility = "hidden" ;
     }
    this.sortedTR = null ;
  }

  var atLeastOneRowRemoved = false ;
  var TR = this.TBODY.firstChild ;
  while ( TR )
  {
    atLeastOneRowRemoved = true ;
    var ch1 = TR.nextSibling ;
    if ( this.anyEditable )
    {
      TGui.flushAttributes ( TR ) ;
    }
    this.TBODY.removeChild ( TR ) ;
    TR = ch1 ;
  }
  this.TABLE.style.visibility = "hidden" ;
  this.TABLE.style.visibility = "inherit" ;
  if ( atLeastOneRowRemoved )
  {
    var ev = new TPropertyChangeEvent ( null, "ROW_REMOVED" ) ;
    this.firePropertyChangeEvent ( ev ) ;
  }
};
TTable.prototype.setRowHighlighted = function ( state, TR )
{
  if ( ! state )
  {
    if ( this.highlightedRow )
    {
      this.highlightedRow.className = this.highlightedRow_className ;
    }
    this.highlightedRow = null ;
    return ;
  }
  if ( TR === this.highlightedRow ) return ;
  if ( this.highlightedRow )
  {
    this.highlightedRow.className = this.highlightedRow_className ;
  }
  this.highlightedRow = TR ;
  this.highlightedRow_className = TR.className ;
  TR.className = "ThemeTableRowClassHighlighted" ;
};
TTable.prototype.getRowFromPosition = function ( x, y )
{
  var TR = this.TBODY.firstChild ;
  if ( ! TR ) return null ;
//  var width = tr.firstChild.offsetLeft + tr.firstChild.offsetWidth ;
  var width = TR.offsetWidth ;
  if ( x > width ) return null ;
 
  var y0 = this.dom.scrollTop + TR.offsetTop ;
  y = y - TR.offsetTop ;
  for ( ; TR ; TR = TR.nextSibling )
  {
    if ( TR.offsetTop - y0 + TR.offsetHeight > y )
    {
      return new TTableRow ( this, TR ) ;
    }
  }
};
TTable.prototype.scrollToTop = function()
{
  this.domBody.scrollTop = 0 ;
};
TTable.prototype.scrollToBottom = function()
{
  var lc = this.TBODY.lastChild ;
  if ( ! lc ) return ;
  var d = lc.offsetTop - this.domBody.clientHeight ;
  if ( ! this.showHeader ) d += this.selectedItem.offsetHeight ;
  this.domBody.scrollTop = d ;
};
TTable.prototype.scrollToLeft = function()
{
  this.domBody.scrollLeft = 0 ;
};
TTable.prototype.createExcel = function()
{
  var str = this.getText() ;
  while ( str.indexOf ( "<img " ) >= 0 )
  {
    var pos = str.indexOf ( "<img " ) ;
    var pos1 = str.indexOf ( ">", pos ) ;
    str = str.substring ( 0, pos ) + str.substring ( pos1+1 ) ;
  }
  TSys.downloadGeneratedDocumentFromTable ( str, "xls" ) ;
};
TTable.prototype.createCsv = function()
{
  var str = this.getText() ;
  while ( str.indexOf ( "<img " ) >= 0 )
  {
    var pos = str.indexOf ( "<img " ) ;
    var pos1 = str.indexOf ( ">", pos ) ;
    str = str.substring ( 0, pos ) + str.substring ( pos1+1 ) ;
  }
  TSys.downloadGeneratedDocumentFromTable ( str, "csv" ) ;
};
TTable.prototype.print = function()
{
  var str = this.getText() ;
  TSys.print ( str ) ;
};
TTable.prototype.getText = function()
{
  var str = "" ;
  if ( ! this.anyEditable )
  {
    return this.TABLE.parentNode.innerHTML ;
  }

  str += "<table class='" + this.TABLE.className + "'"
       +  " border=" + this.TABLE.border
       +  " cellspacing=" + this.TABLE.cellSpacing
       +  " cellpadding=" + this.TABLE.cellPadding
       +  ">"
       ;
  if ( this.THEAD )
  {
    str += "<thead class='" + this.THEAD.className + "'>" ;
    str += this.THEAD.innerHTML ;
    str += "</thead>" ;
  }
  str += "<tbody>" ;
  var index = 0 ;
  for ( var ch = this.TBODY.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE )
    {
      continue ;
    }
    str += "<tr class='" + ch.className + "'>" ;
    index  = -1 ;
    for ( var ch1 = ch.firstChild ; ch1 ; ch1 = ch1.nextSibling )
    {
      index++ ;
      if ( ! ch1.xInput )
      {
        str += "<td class='" + ch1.className + "'>" ;
        str += ch1.innerHTML ;
        str += "</td>" ;
        continue ;
      }
      str += "<td class='" + ch1.className + "'>" ;
      if ( ch1.xInput.type == 'checkbox' || ch1.xInput.type == 'radio' )
      {
        if ( ch1.xInput.checked ) str += ch1.xInput.value ;
        else
        {
          if ( ch1.xInput.xDefaultValue ) str += ch1.xInput.xDefaultValue ;
        }
      }
      else
      if ( ch1.xInput.type == 'select-one' )
      {
        var selectedIndex = ch1.xInput.selectedIndex ;
        if ( selectedIndex < 0 )
        {
          str += "&nbsp;</td>" ;
          continue ;
        }
        str += ch1.xInput.options[selectedIndex].text ;
      }
      else
      {
        str += ch1.xInput.value ;
      }
      str += "</td>" ;
    }
    str += "</tr>" ;
  }
  str += "</tbody>" ;
  str += "</table>" ;
  return str ;
};
TTable.prototype.addDropTargetListener = function ( listener )
{
  this.dom.dndTarget.addListener ( listener ) ;
};
TTable.prototype.addDragSourceListener = function ( listener )
{
  this.dom.dndSource.addListener ( listener ) ;
};
TTable.prototype.rows = function ( visitor )
{
  if ( typeof (  visitor ) == 'function' )
  {
    for ( var ch = this.TBODY.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      var rc = visitor ( ch ) ;
      if ( rc === false ) break ;
    }
  }
  else
  {
    return new TXEnum ( this.TBODY, "TR" ) ;
  }
};

TTable.prototype.addSetValuesListener = function ( obj, method )
{
  if ( obj instanceof TFunctionExecutor ) this.setValuesListener.push ( obj ) ;
  else this.setValuesListener.push ( new TFunctionExecutor ( obj, method ) ) ;
} ;
TTable.prototype.addGetValuesListener = function ( obj, method )
{
  if ( obj instanceof TFunctionExecutor ) this.getValuesListener.push ( obj ) ;
  else this.getValuesListener.push ( new TFunctionExecutor ( obj, method ) ) ;
} ;
TTable.prototype.fireOnSetValues = function ( x )
{
  for ( var i = 0 ; i < this.setValuesListener.length ; i++ )
  {
    this.setValuesListener[i].execute ( x ) ;
  }
};
TTable.prototype.fireOnGetValues = function ( x )
{
  for ( var i = 0 ; i < this.getValuesListener.length ; i++ )
  {
    this.getValuesListener[i].execute ( x ) ;
  }
};
TTable.prototype.setVisibleRowsIf = function ( name, pattern )
{
  var TR = this.TBODY.firstChild ;
  if ( ! TR ) return ;
  var xRow = new TXml ( TR.domRow   ) ;
  var first_TR = null ;
	if ( pattern.indexOf ( "*" ) >= 0 )
	{
	  if ( pattern.indexOf ( ".*" ) < 0 ) pattern = pattern.replace ( /\*/g, ".*" ) ;
		var reg = new RegExp ( pattern, 'i' ) ;
  	for ( ; TR ; TR = TR.nextSibling )
  	{
    	if ( TR.nodeType != DOM_ELEMENT_NODE ) continue ;
			xRow.domRoot = TR.domRow ;
			var str = xRow.getContent ( name ) ;
			if ( str.match ( reg ) )
			{
				if ( ! first_TR ) first_TR = TR ;
				TR.style.display = "" ;
			}
			else
			{
				TR.style.display = "NONE" ;
			}
		}
	}
	else
	{
  	pattern = pattern.toUpperCase() ;
  	for ( ; TR ; TR = TR.nextSibling )
  	{
    	if ( TR.nodeType != DOM_ELEMENT_NODE ) continue ;
			xRow.domRoot = TR.domRow ;
			var oc = xRow.getContent ( name ) ;
			if ( oc.toUpperCase().indexOf ( pattern ) >= 0 )
			{
				if ( ! first_TR ) first_TR = TR ;
				TR.style.display = "" ;
			}
			else
			{
				TR.style.display = "NONE" ;
			}
		}
	}
	if ( first_TR ) return new TTableRow ( this, first_TR ) ;
};
TTable.prototype.toggleColumnVisibility = function ( indexOrName )
{
  if ( this.isColumnVisible ( indexOrName ) )
  {
    this.setColumnVisible ( indexOrName, false ) ;
  }
  else
  {
    this.setColumnVisible ( indexOrName, true ) ;
  }
};
TTable.prototype.isColumnVisible = function ( indexOrName )
{
  var index = this.getColumnIndexByName ( indexOrName ) ;
  if ( index < 0 ) return false ;
  var colName = this.columnNames[index] ;
  return ! this.namesOfHiddenColumns[colName] ;
};
TTable.prototype.setColumnVisible = function ( indexOrName, state )
{
  var index = this.getColumnIndexByName ( indexOrName ) ;
  if ( index < 0 ) return ;

  var colName = this.columnNames[index] ;
  var value = 'NONE' ;
  if ( state )
  {
    value = '' ;
    delete this.namesOfHiddenColumns[colName] ;
  }
  else
  {
    this.namesOfHiddenColumns[colName] = true ;
  }

  var TD, TR, i ;
  for ( TR = this.TBODY.firstChild ; TR ; TR = TR.nextSibling )
  {
    i = index ;
    for ( TD = TR.firstChild ; TD ; TD = TD.nextSibling )
    {
      if ( i == 0 )
      {
        TD.style.display = value ;
        break ;
      }
      i-- ;
    }
  }
  if ( this.THEAD )
  {
    for ( TR = this.THEAD.firstChild ; TR ; TR = TR.nextSibling )
    {
      i = index ;
      for ( TD = TR.firstChild ; TD ; TD = TD.nextSibling )
      {
        if ( i == 0 )
        {
          TD.style.display = value ;
          break ;
        }
        i-- ;
      }
    }
  }
  if ( this.THEAD2 )
  {
    for ( TR = this.THEAD2.firstChild ; TR ; TR = TR.nextSibling )
    {
      i = index ;
      for ( TD = TR.firstChild ; TD ; TD = TD.nextSibling )
      {
        if ( i == 0 )
        {
          TD.style.display = value ;
          break ;
        }
        i-- ;
      }
    }
  }
  this.adjustHeader() ;
};
TTable.prototype.setEnabled = function ( state )
{
  if ( state )
  {
    if ( this.glassOverTable )
    {
      this.glassOverTable.parentNode.removeChild ( this.glassOverTable ) ;
    }
    this.glassOverTable = null ;
  }
  else
  {
    if ( this.glassOverTable ) return ;
    var parent = this.dom.parentNode ;
    var ct = new TComponent ( this.dom ) ;
    var b = ct.getBounds() ;
    var div = document.createElement ( "div" ) ;
    this.dom.parentNode.appendChild ( div ) ;
    div.style.position = "absolute" ;
    div.style.top = b.y + "px" ;
    div.style.left = b.x + "px" ;
    div.style.width = b.width + "px" ;
    div.style.height = b.height + "px" ;
    if ( TSys.isIE() )
    {
      div.style.backgroundColor = "#000000" ;
      new TComponent ( div ).setOpacity ( 0.0 ) ;
    }
    this.glassOverTable = div ;
  }
};
/**
 *  @constructor
 */
var TTableRow = function ( table, TR )
{
  this.jsClassName = "TTableRow" ;
  this.table = table ;
  this.TR = TR ;
};
TTableRow.prototype =
{
  toString : function()
  {
    return "(" + this.jsClassName + ")[index=" + this.TR.sectionRowIndex + ",TR=" + this.TR + "table=" + this.table
         + "\nxml:" + this.getXml()
         + "\n]" ;
  },
  getTable: function() { return this.table ; },
  getIndex: function() { return this.TR.sectionRowIndex ; },
  getDom: function() { return this.TR.domRow ; },
  getXml: function() { return new TXml ( this.TR.domRow ) ; },
  getHtmlElement: function() { return this.TR ; },
  getInputComponentAt: function ( indexOrName )
  {
    var index = this.table.getColumnIndexByName ( indexOrName ) ;
    if ( index < 0 ) return null ;
    for ( var TD = this.TR.firstChild ; TD ; TD = TD.nextSibling )
    {
      if ( index === 0 )
      {
        if ( ! TD.xInput ) return ;
        return TGui.getComponent ( TD.xInput ) ;
      }
      index-- ;
    }
    return null ;
  },
  getCellHtmlElement: function ( indexOrName )
  {
    var index = this.table.getColumnIndexByName ( indexOrName ) ;
    if ( index < 0 ) return null ;
    for ( var TD = this.TR.firstChild ; TD ; TD = TD.nextSibling )
    {
      if ( index === 0 ) return TD ;
      index-- ;
    }
    return null ;
  },
  getCellIndexFromX: function ( x )
  {
    var index = 0 ;
    for ( var TD = this.TR.firstChild ; TD ; TD = TD.nextSibling )
    {
      if ( TD.offsetLeft <= x && x <= TD.offsetLeft + TD.offsetWidth ) return index ;
      index++ ;
    }
    return -1 ;
  },
  update: function ( xml )
  {
    if ( ! xml ) xml = this.TR.domRow ;
    var domNew = xml ;
    if ( xml.jsClassName == "TXml" ) domNew = xml.getDom() ;
    xml = new TXml ( domNew ) ;

    var xRow = this.getXml() ;
    var locale = this.table.getLocale() ;
    var decimalSeparator = locale.getDecimalSeparator() ;
		var c, f ;
    for ( ch = domNew.firstChild ; ch ; ch = ch.nextSibling )
    {
      if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
      var x = new TXml ( ch ) ;
      var name = x.getName() ;
      var xOld = xRow.ensureXml ( name ) ;
      var str = x.getContent() ;
      xOld.setContent ( str ) ;
      var index = this.table.column2Index[name] ;
      if ( typeof ( index ) == 'undefined' ) continue ;
      var i = 0 ;
      var TD = null ;
      for ( var td = this.TR.firstChild ; td ; td = td.nextSibling )
      {
        if ( i == index )
        {
          TD = td ;
	  			break ;
				}
				i++ ;
      }
      if ( ! TD )
      {
        continue ;
      }
      var t = this.table.columnTypes[i] ;
      if ( ! str ) str = "" ;
      var vt = str.trim() ;
      var a = this.table.mappings[i] ;
      if ( a )
      {
        var as = a[vt] ;
        if ( typeof ( as ) != 'undefined' ) vt = as ;
      }
      if ( TD.xInput )
      {
        if ( TD.xInput.type == 'checkbox' )
        {
          c = new TCheckbox ( TD.xInput ) ;
	  			c.setValues ( xml ) ;
        }
        else
        if ( TD.xInput.type == 'radio' )
        {
          c = new TRadio ( TD.xInput ) ;
	  			c.setValues ( xml ) ;
        }
        else
        if ( TD.xInput.type == 'select-one' )
        {
          c = new TChoice ( TD.xInput ) ;
	  			c.setValues ( xml ) ;
        }
        else
        {
          c = new TTextField ( TD.xInput ) ;
	  			c.setValues ( xml ) ;
        }
				continue ;
      }
      if ( t == "money" && vt )
      {
        TD.innerHTML = locale.formatMoneyWithCurrency ( vt ) ;
      }
      else
      if ( t == 'float' && vt )
      {
        if ( decimalSeparator == "," ) vt = vt.replace ( /\./, "," ) ;
        TD.innerHTML = vt ;
      }
      else
      if ( t == "date" )
      {
        if ( ! vt )
        {
          TD.innerHTML = "&nbsp;" ;
        }
        else
        {
          if ( ! this.table.formats[i] )
          {
            TD.innerHTML = locale.formatDateShort ( vt ) ;
	  			}
	  			else
	  			{
            f = locale.getDateFormat ( this.table.formats[i] ) ;
            TD.innerHTML = locale.formatDate ( vt, f ) ;
	  			}
        }
      }
      else
      if ( t == "datetime" )
      {
        if ( ! vt )
        {
          TD.innerHTML = "&nbsp;" ;
        }
        else
        {
          if ( ! this.table.formats[i] )
	  			{
            TD.innerHTML = locale.formatDateTimeShort ( vt ) ;
	  			}
	  			else
	  			{
            f = locale.getDateFormat ( this.table.formats[i] ) ;
            TD.innerHTML = locale.formatDateTime ( vt, f ) ;
	  			}
        }
      }
      else
      {
        TD.innerHTML = vt ;
      }
    }
    this.table.setClassImages() ;
  },
  setVisibleOnScreen: function()
  {
    var d = this.TR.offsetTop - this.table.domBody.clientHeight ;
    if ( ! this.showHeader ) d += this.TR.offsetHeight ;
    this.table.domBody.scrollTop = d ;
  },
  setChanged: function ( state )
  {
    this.TR.hasChanged = state ? true : false ;
  },
  setSelected: function ( state, fireSelectionEvent )
  {
    if ( state && this.table.selectedItem && this.table.selectedItem !== this.TR )
    {
      this.table._setSelected ( this.table.selectedItem, false, fireSelectionEvent, null, true ) ;
    }
    this.table._setSelected ( this.TR, state, fireSelectionEvent, null, true ) ;
  },
  remove: function()
  {
    if ( this.TR.sectionRowIndex == this.table.getSelectedIndex() )
    {
      this.setSelected ( false ) ;
    }
    this.table.TBODY.removeChild ( this.TR ) ;
    this.table._setHeaderImages() ;
    this.table._setClassImagesRow() ;
    var ev = new TPropertyChangeEvent ( null, "ROW_REMOVED" ) ;
    this.table.firePropertyChangeEvent ( ev ) ;
  },
  moveToTop: function()
  {
    this.moveTo ( 0 ) ;
  },
  moveToBottom: function()
  {
    this.moveTo ( this.table.getNumberOfRows() - 1 ) ;
  },
  moveUp: function()
  {
    if ( this.TR.sectionRowIndex === 0 ) return ;
    this.moveTo ( this.TR.sectionRowIndex - 1 ) ;
  },
  moveDown: function()
  {
    if ( this.TR.sectionRowIndex >= this.table.getNumberOfRows() ) return ;
    this.moveTo ( this.TR.sectionRowIndex + 1 ) ;
  },
  moveTo: function ( index )
  {
		var tr ;
    if ( typeof ( index ) != 'number' )
    {
      throw "Invalid value for parameter for 'index' (" + typeof ( index ) + ")" ;
    }
    if ( index < 0 )
    {
      return ;
    }
    if ( index >= this.table.getNumberOfRows() )
    {
      return ;
    }
    if ( index == this.TR.sectionRowIndex ) return ;
    if ( this.table.getNumberOfRows() <= 1 ) return ;
    if ( index === 0 )
    {
      this.table.TBODY.removeChild ( this.TR ) ;
      this.table.TBODY.insertBefore ( this.TR, this.table.TBODY.firstChild ) ;
    }
    else
    if ( index + 1 == this.table.getNumberOfRows() )
    {
      this.table.TBODY.removeChild ( this.TR ) ;
      this.table.TBODY.appendChild ( this.TR ) ;
    }
    else
    {
      var TR = null ;
      for ( tr = this.table.TBODY.firstChild ; tr ; tr = tr.nextSibling )
      {
        if ( tr.sectionRowIndex == index )
        {
          TR = tr ;
          break ;
        }
      }
      if ( index > this.TR.sectionRowIndex )
      {
        this.table.TBODY.removeChild ( this.TR ) ;
        this.table.TBODY.insertBefore ( this.TR, TR.nextSibling ) ;
      }
      else
      {
        this.table.TBODY.removeChild ( this.TR ) ;
        this.table.TBODY.insertBefore ( this.TR, TR ) ;
      }
    }
    var k = 0 ;
    for ( tr = this.table.TBODY.firstChild ; tr ; tr = tr.nextSibling )
    {
      tr.originalIndex = k ;
      k++ ;
    }
    var ev = new TPropertyChangeEvent ( null, "ROW_MOVED" ) ;
    this.table.firePropertyChangeEvent ( ev ) ;
  },
  setColumnVisibleText: function ( indexOrName, text )
  {
    if ( ! text ) text = "&nbsp;" ;
    var index = this.table.getColumnIndexByName ( indexOrName ) ;
    if ( index < 0 ) return ;
    var n = 0 ;
    for ( var td = this.TR.firstChild ; td ; td = td.nextSibling )
    {
      if ( n == index )
      {
        td.innerHTML = text ;
        break ;
      }
      n++ ;
    }
    this.table._setHeaderImages() ;
    this.table._setClassImagesRow() ;
  },
  setHighlighted: function ( state )
  {
    this.table.setRowHighlighted ( state, this.TR ) ;
  },
  getNextSibling: function()
  {
    if ( ! this.TR ) return ;
    var nextTR = this.TR.nextSibling ;
    if ( ! nextTR ) return ;
    return new TTableRow ( this.table, nextTR ) ;
  },
  setVisible: function ( state )
  {
    if ( ! this.TR ) return ;
		if ( state )
		{
			this.TR.style.display = "" ;
		}
		else
		{
			TR.style.display = "NONE" ;
		}
    return this ;
  },
  isVisible: function()
  {
    if ( ! this.TR ) return ;
		return this.TR.style.display != "NONE" ;
  }
};
TTree = function ( xElem )
{
  var t = "<xml>\n"
  +"<Table show-header='false'>\n"
  +"<Columns>\n"
  +"<Column name='TEXT' />\n"
  +"</Columns>\n"
  +"</Table>\n"
  +"</xml>\n"
  ;
  var xt = TSys.parseXml ( t ) ;
  var xTable = xt.get ( "Table" ) ;

  this.xml = new TXml ( xElem ) ;

  Tango.mixin ( EventMulticasterTrait, this ) ;

  var onclick    = this.xml.getAttribute ( "onclick" ) ;
  var ondblclick = this.xml.getAttribute ( "ondblclick" ) ;
  var path       = this.xml.getAttribute ( "path" ) ;
  var name       = this.xml.getAttribute ( "name" ) ;
  var onsetvalues       = this.xml.getAttribute ( "onsetvalues" ) ;
  var ongetvalues       = this.xml.getAttribute ( "ongetvalues" ) ;
  this.nodes_plain = this.xml.getBoolAttribute ( "nodes-plain", false ) ;
  this.open_on_click = this.xml.getBoolAttribute ( "open-on-click", false ) ;

  if ( onclick ) xTable.addAttribute ( "onclick", onclick ) ;
  if ( ondblclick ) xTable.addAttribute ( "ondblclick", ondblclick ) ;
  if ( path ) xTable.addAttribute ( "path", path ) ;
  if ( name ) xTable.addAttribute ( "name", name ) ;
  if ( onsetvalues ) xTable.addAttribute ( "onsetvalues", onsetvalues ) ;
  if ( ongetvalues ) xTable.addAttribute ( "ongetvalues", ongetvalues ) ;

  this.node_name  = this.xml.getAttribute ( "node-name", "node" ) ;
  xTable.addAttribute ( "row-name", this.node_name ) ;

  this.title_attribute_name = this.xml.getAttribute ( "title-attribute-name", 'title' ) ;
  this.resettable = this.xml.getBoolAttribute ( "reset", false ) ;
  this.get_values = this.xml.getBoolAttribute ( "get-values", false ) ;
  this.preopen_level = this.xml.getIntAttribute ( "preopen-level", 1 ) ;
  this.always_show_chevron = this.xml.getBoolAttribute ( "always-show-chevron", false ) ;
  this.onchevron = this.xml.getAttribute ( "node-changed" ) ;

  var xmlAttributes = xTable.getDom() ;
  Tango.initSuper( this, TTable, xmlAttributes );
  this.jsClassName = "TTree" ;

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
};
TTree.prototype.flush = function()
{
  this.flushEventMulticaster() ;
  TTable.prototype.flush.apply ( this, arguments ) ;
};

TTree.inherits( TTable ) ;
TTree.prototype.folderIcon = "img/folder-dropline-16.png" ;
TTree.prototype.folderOpenIcon = "img/folder_open-dropline-16.png" ;
TTree.prototype.folderUpIcon = "img/dropline-folder-up.png" ;
TTree.prototype.getFolderIcon = function()
{
  var dom = Tango.getThemeDom ( "Folder.16", "normal" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "Folder.16", "normal", NaN, NaN ) ;
  return this.folderIcon ;
} ;
TTree.prototype.getFolderOpenIcon = function()
{
  var dom = Tango.getThemeDom ( "Folder.16", "open" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "Folder.16", "open", NaN, NaN ) ;
  return this.folderOpenIcon ;
} ;
TTree.prototype.getFolderUpIcon = function()
{
  var dom = Tango.getThemeDom ( "Folder.16", "up" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "Folder.16", "up", NaN, NaN ) ;
  return this.folderUpIcon ;
} ;
TTree.prototype.getTreePlusIcon = function()
{
  var dom = Tango.getThemeDom ( "TreeViewNode", "plus" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "TreeViewNode", "plus", NaN, NaN ) ;
  return 'img/plus.gif' ;
} ;
TTree.prototype.getTreePlusBottomIcon = function()
{
  var dom = Tango.getThemeDom ( "TreeViewNode", "plus-bottom" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "TreeViewNode", "plus-bottom", NaN, NaN ) ;
  return 'img/plusbottom.gif' ;
} ;
TTree.prototype.getTreePlusNolinesIcon = function()
{
  var dom = Tango.getThemeDom ( "TreeViewNode", "plus-nolines" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "TreeViewNode", "plus-nolines", NaN, NaN ) ;
  return 'img/nolines_plus.gif' ;
} ;
TTree.prototype.getTreeMinusIcon = function()
{
  var dom = Tango.getThemeDom ( "TreeViewNode", "minus" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "TreeViewNode", "minus", NaN, NaN ) ;
  return 'img/minus.gif' ;
} ;
TTree.prototype.getTreeMinusBottomIcon = function()
{
  var dom = Tango.getThemeDom ( "TreeViewNode", "minus-bottom" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "TreeViewNode", "minus-bottom", NaN, NaN ) ;
  return 'img/minusbottom.gif' ;
} ;
TTree.prototype.getTreeMinusNolinesIcon = function()
{
  var dom = Tango.getThemeDom ( "TreeViewNode", "minus-nolines" ) ;
  if ( dom ) return TGui.buildThemeImageUrl ( "TreeViewNode", "minus-nolines", NaN, NaN ) ;
  return 'img/nolines_minus.gif' ;
};
TTree.prototype.setClassImages = function ( elem, refresh )
{
  var txml = Tango.getThemeXml ( "Selected", "background" ) ;
  if ( txml ) this.selectedBackgroundImageExists = true ;
  else        this.selectedBackgroundImageExists = false ;

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

  var x = new TXml ( this.TBODY ) ;
  var dom ;
  for ( var TR = this.TBODY.firstChild ; TR ; TR = TR.nextSibling )
  {
    x.domRoot = TR ;
    if ( TR.hasThemeFolder )
    {
      dom = x.getDomByName ( "FOLDER" ) ;
      if ( TR.isOpen ) dom.src = this.icon.folderOpen ;
      else             dom.src = this.icon.folder ;
    }
    if ( TR.domRow.firstChild && TR.domRow.firstChild.nodeName == this.node_name || this.always_show_chevron )
    {
      dom = x.getDomByName ( "MARKER" ) ;
      if ( dom )
      {
        if ( TR.isOpen ) dom.src = this.icon.nlMinus ;
        else             dom.src = this.icon.nlPlus ;
      }
    }
  }
  return true ;
};
TTree.prototype.closeAll = function ( event )
{
  var TR ;
  for ( TR = this.TBODY.firstChild ; TR ; TR = TR.nextSibling )
  {
    if ( TR.isOpen )
    {
      this.closeNode ( TR, event ) ;
    }
  }
};
TTree.prototype.openAll = function ( event )
{
  var TR ;
  for ( TR = this.TBODY.firstChild ; TR ; TR = TR.nextSibling )
  {
    if ( ! TR.isEmpty )
    {
      this.openNode ( TR, event ) ;
    }
  }
};
TTree.prototype._mouseup = function ( event )
{
  var ev = new TEvent ( event ) ;

  var comp = ev.getComponent() ;
  var name = comp.getName() ;
  var TR ;
  var ch ;
  for ( ch = comp.getDom() ; ch ; ch = ch.parentNode )
  {
    if ( ch.nodeName.toUpperCase() === 'TR' )
    {
      TR = ch ;
      break ;
    }
  }
  if ( ! TR ) return ;

  if ( name === "FOLDER" )
  {
  }
  else
  if ( name === "MARKER" )
  {
    if ( TR.isOpen ) this.closeNode ( TR, event ) ;
    else             this.openNode ( TR, event ) ;
  }
  else
  if ( this.open_on_click )
  {
    if ( ! TR.isOpen ) this.openNode ( TR, event ) ;
  }
};
TTree.prototype.onkeydown = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( ev.isCursorLeft() || ev.isCursorRight() )
  {
    var TR = this.selectedItem ;
    ev.consume() ;
    if ( ! TR ) return ; 
    if ( ev.isCursorRight() )
    {
      if ( TR.isEmpty && ! this.always_show_chevron ) return ; 
      if ( ! TR.isOpen )
      {
        this.openNode ( TR, event ) ;
      }
    }
    if ( ev.isCursorLeft() )
    {
      if ( TR.isEmpty || ! TR.isOpen )
      {
        var depthToFind = TR.currentDepth - 1 ;
        for ( ; TR ; TR = TR.previousSibling )
        {
          if ( TR.currentDepth == depthToFind )
          {
            this._setSelected ( this.selectedItem, false, false, event ) ;
            this._setSelected ( TR, true, true, event ) ;
            break ;
          }
        }
        return ;
      }
      if ( TR.isOpen )
      {
        this.closeNode ( TR, event ) ;
      }
    }
    return ;
  }
  TTable.prototype.onkeydown.apply ( this, arguments ) ;
};
TTree.prototype.toggleNode = function ( TR )
{
  if ( ! TR ) return ;
  if ( TR.isOpen ) this.closeNode ( TR ) ;
  else             this.openNode ( TR ) ;
} ;
TTree.prototype.closeNode = function ( TR, event )
{
  if ( ! TR ) return ;
  if ( ! TR.isOpen ) return ;
  
  var xTR = new TXml ( TR ) ;
  var indicator = xTR.getDomByName ( "MARKER" ) ;
  var eFolder = xTR.getDomByName ( "FOLDER" ) ;

  var ev = new TEvent ( event ) ;
  ev.setPeer ( this ) ;
  ev.setHtmlSource ( TR ) ;
  if ( TR.isEmpty )
  {
    if ( this.always_show_chevron )
    {
      this._fireEvent ( ev, "node-closed" ) ;
      indicator.src = this.icon.nlPlus ;
      if ( TR.hasThemeFolder ) eFolder.src = this.icon.folder ;
      else
      if ( TR._icon )
      {
        eFolder.src = TR._icon ;
      }
      TR.isOpen = false ;
    }
    return ;
  }

  indicator.src = this.icon.nlPlus ;
  if ( TR.hasThemeFolder ) eFolder.src = this.icon.folder ;
  else
  if ( TR._icon )
  {
    eFolder.src = TR._icon ;
  }
  TR.isOpen = false ;

  var selectedItem ;
  for ( var ch = TR.nextSibling ; ch ; ch = ch.nextSibling )
  {
    if ( this.selectedItem === ch )
    {
      selectedItem = ch ;
    }
    if ( ch.currentDepth > TR.currentDepth )
    {
      ch.style.display = "NONE" ;
      continue ;
    }
    break ;
  }
  if ( selectedItem )
  {
    this._setSelected ( this.selectedItem, false, false, event ) ;
    this._setSelected ( TR, true, true, event ) ;
  }
  this._fireEvent ( ev, "node-closed" ) ;
};
TTree.prototype.openNode = function ( TR, event )
{
  if ( ! TR ) return ;
  if ( TR.isOpen ) return ;

  var xTR = new TXml ( TR ) ;
  var indicator = xTR.getDomByName ( "MARKER" ) ;
  var eFolder = xTR.getDomByName ( "FOLDER" ) ;
  
  var ev = new TEvent ( event ) ;
  ev.setPeer ( this ) ;
  ev.setHtmlSource ( TR ) ;
  if ( TR.isEmpty )
  {
    if ( this.always_show_chevron )
    {
      this._fireEvent ( ev, "node-opened" ) ;
      indicator.src = this.icon.nlMinus ;
      if ( TR.hasThemeFolder ) eFolder.src = this.icon.folderOpen ;
      else
      if ( TR._iconOpen )
      {
        eFolder.src = TR._iconOpen ;
      }
      TR.isOpen = true ;
    }
    return ;
  }

  indicator.src = this.icon.nlMinus ;
  if ( TR.hasThemeFolder ) eFolder.src = this.icon.folderOpen ;
  else
  if ( TR._iconOpen )
  {
    eFolder.src = TR._iconOpen ;
  }

  TR.isOpen = true ;

  var selectedItem ;
  for ( var ch = TR.nextSibling ; ch ; ch = ch.nextSibling )
  {
    if ( ch.currentDepth > TR.currentDepth )
    {
      ch.style.display = "" ;
      if ( ch.isOpen === false && ch.nextSibling )
      {
        var ch2 ;
        var found = false ;
        var lastch ;
        for ( ch2 = ch.nextSibling ; ch2 ; ch2 = ch2.nextSibling )
        {
          if ( ch2.currentDepth <= ch.currentDepth )
          {
            found = true ;
            ch = ch2.previousSibling ;
            break ;
          }
          lastch = ch2 ;
        }
        if ( ! found ) ch = lastch ;
      }
      continue ;
    }
    break ;
  }
  this._fireEvent ( ev, "node-opened" ) ;
};
TTree.prototype.layout = function ( dom, externalAttributes, nix, layoutContext )
{
  TTable.prototype.layout.apply ( this, arguments ) ;
  TGui.addEventListener ( this.TBODY, "mouseup", this._mouseup.bindAsEventListener ( this ) ) ;
  if ( this.onchevron )
  {
    this.addEventListener ( new TFunctionExecutor ( this.onchevron, layoutContext ), "node-.*" ) ;
  }

  var xData = this.xml.get ( "Data" ) ;
  this._fillFromTree ( xData ) ;
};
TTree.prototype.getValues = function( xml )
{
  if ( ! this.get_values ) return xml ;
  TTable.prototype.getValues.apply ( this, arguments ) ;
};
TTree.prototype.setValues = function ( xml )
{
  if ( ! this.path && ( ! this.name || this.name.indexOf ( "$" ) >= 0 ) )
  {
    return ;
  }
  if ( ! xml )
  {
    this.removeAll() ;
    return ;
  }
  var x ;
  if ( this.path )
  {
    x = xml.get ( this.path ) ;
  }
  if ( ! x )
  {
    x = xml.get ( this.name ) ;
  }
  if ( ! x )
  {
    if ( xml.getName() == this.name )
    {
      x = xml ;
    }
  }
  if ( ! x ) return ;
  this.removeAll() ;
  this._fillFromTree ( x ) ;
};
TTree.prototype.addChildren = function ( TR_parent, x )
{
  var thiz = this ;
  var depth = TR_parent.currentDepth + 1 ;
  var sectionRowIndex = TR_parent.sectionRowIndex ;
  var isLast = thiz.TBODY.lastChild === TR_parent ;
  var nextSibling_TR = TR_parent.nextSibling ;
  var sempty = '<img src="' + this.icon.empty + '" style="width:16px;height:16px;" alt="" />';
  var en  = x.elements() ;

  while ( en.hasNext() )
  {
    var e = en.nextXml() ;

    if ( e.getName() != thiz.node_name && ! thiz.nodes_plain ) continue ;

    var TR = document.createElement ( "tr" ) ;

    var blanks = "" ; 
    for ( var i = 1 ; i < depth ; i++ ) { blanks += sempty ; }

    var title = e.getAttribute ( thiz.title_attribute_name, "no-text" ) ;
    var text = "<span>" + blanks ;
    var simg ;
    var timg ;
    var icon = e.getAttribute ( "icon" ) ;
    var img = e.getAttribute ( "img" ) ;
    var iconOpen = e.getAttribute ( "img-open" ) ;
    if ( ! icon ) icon = img ;
    icon = TGui.translateImageName ( icon ) ;
    iconOpen = TGui.translateImageName ( iconOpen ) ;
    TR._icon = icon ;
    TR._iconOpen = iconOpen ;

    if ( e.get ( thiz.node_name ) || thiz.nodes_plain )
    {
      if ( depth <= thiz.preopen_level )
      {
        if ( ! icon )
        {
          icon = thiz.icon.folderOpen ;
          TR.hasThemeFolder = true ;
        }
        TR.isOpen = true ;
        timg = '<img name="MARKER" src="' + thiz.icon.nlMinus + '" style="width:16px;height:16px;" alt="" />';
        simg = '<img name="FOLDER" src="' + icon + '" style="width:16px;height:16px;" alt="" />';
      }
      else
      if ( depth === thiz.preopen_level + 1 )
      {
        if ( ! icon )
        {
          icon = thiz.icon.folder ;
          TR.hasThemeFolder = true ;
        }
        TR.isOpen = false ;
        timg = '<img name="MARKER" src="' + thiz.icon.nlPlus + '" style="width:16px;height:16px;" alt="" />';
        simg = '<img name="FOLDER" src="' + icon + '" style="width:16px;height:16px;" alt="" />';
      }
      else
      {
        if ( ! icon )
        {
          icon = thiz.icon.folder ;
          TR.hasThemeFolder = true ;
        }
        TR.isOpen = false ;
        timg = '<img name="MARKER" src="' + thiz.icon.nlPlus + '" style="width:16px;height:16px;" alt="" />';
        simg = '<img name="FOLDER" src="' + icon + '" style="width:16px;height:16px;" alt="" />';
        TR_display = "NONE" ;
      }
      text += timg + simg + "&nbsp;" + title + "</span>" ;
    }
    else
    {
      if ( ! icon )
      {
        icon = thiz.icon.folder ;
        TR.hasThemeFolder = true ;
      }
      if ( thiz.always_show_chevron )
      {
        timg = '<img name="MARKER" src="' + thiz.icon.nlPlus + '" style="width:16px;height:16px;" alt="" />';
      }
      else
      {
        timg = '<img name="MARKER" src="' + thiz.icon.empty + '" style="width:16px;height:16px;" alt="" />';
      }
      simg = '<img name="FOLDER" src="' + icon + '" style="width:16px;height:16px;" alt="" />';
      text += timg + simg + "&nbsp;" + title + "</span>" ;
      TR.isEmpty = true ;
      TR.isOpen = false ;
    }
    TR.currentDepth = depth ;
    sectionRowIndex++ ;
    var index = sectionRowIndex ;
    var n = index + 1 ;

    if ( n % 2 == 1 ) TR.className = "ThemeTableRowClassAlternate" ;
    else              TR.className = "ThemeTableRowClass" ;
    TR.originalIndex = n ;
    if ( isLast )
    {
      thiz.TBODY.appendChild ( TR ) ;
    }
    else
    {
      thiz.TBODY.insertBefore ( TR, nextSibling_TR ) ;
    }

    TR.domRow = e.getDom() ;
    TR.domRowRealName = thiz.node_name ;
    var TD = document.createElement ( "td" ) ;
    TR.appendChild ( TD ) ;
    TD.style.whiteSpace = "nowrap" ;
    TD.innerHTML = text ;
    TR_parent.isEmpty = false ;
  }
};
TTree.prototype._fillFromTree = function ( xtree )
{
  if ( ! xtree ) return ;

  var thiz = this ;
  var sempty = '<img src="' + thiz.icon.empty + '" style="width:16px;height:16px;" alt="" />';

  xtree.visit (
  {
    visit: function ( e, depth )
    {
      if ( depth === 0 ) return true ;
      if ( thiz.setValuesListener.length )
      {
        thiz.fireOnSetValues ( e ) ;
      }
      if ( e.getName() === thiz.node_name || thiz.nodes_plain )
      {
        var TR = document.createElement ( "tr" ) ;

        var blanks = "" ; 
        for ( var i = 1 ; i < depth ; i++ ) { blanks += sempty ; }

        var title = e.getAttribute ( thiz.title_attribute_name, "no-text" ) ;
        var text = "<span style='padding:0px;'>" + blanks ;
        var simg ;
        var timg ;
        var TR_display = "" ;
        var icon = e.getAttribute ( "icon" ) ;
        var img = e.getAttribute ( "img" ) ;
        var iconOpen = e.getAttribute ( "img-open" ) ;
        if ( ! icon ) icon = img ;
        icon = TGui.translateImageName ( icon ) ;
        iconOpen = TGui.translateImageName ( iconOpen ) ;
        TR._icon = icon ;
        TR._iconOpen = iconOpen ;
        if ( e.get ( thiz.node_name ) || thiz.nodes_plain )
        {
          if ( depth <= thiz.preopen_level )
          {
            if ( ! icon )
            {
              icon = thiz.icon.folderOpen ;
              TR.hasThemeFolder = true ;
            }
            TR.isOpen = true ;
            timg = '<img name="MARKER" src="' + thiz.icon.nlMinus + '" style="width:16px;height:16px;" alt="" />';
            simg = '<img name="FOLDER" src="' + icon + '" style="width:16px;height:16px;" alt="" />';
          }
          else
          if ( depth === thiz.preopen_level + 1 )
          {
            if ( ! icon )
            {
              icon = thiz.icon.folderOpen ;
              TR.hasThemeFolder = true ;
            }
            TR.isOpen = false ;
            timg = '<img name="MARKER" src="' + thiz.icon.nlPlus + '" style="width:16px;height:16px;" alt="" />';
            simg = '<img name="FOLDER" src="' + icon + '" style="width:16px;height:16px;" alt="" />';
          }
          else
          {
            if ( ! icon )
            {
              icon = thiz.icon.folderOpen ;
              TR.hasThemeFolder = true ;
            }
            TR.isOpen = false ;
            timg = '<img name="MARKER" src="' + thiz.icon.nlPlus + '" style="width:16px;height:16px;" alt="" />';
            simg = '<img name="FOLDER" src="' + icon + '" style="width:16px;height:16px;" alt="" />';
            TR_display = "NONE" ;
          }
          text += timg + simg + "&nbsp;<span style='padding:0px;vertical-align:middle;'>" + title + "</span></span>" ;
        }
        else
        {
          if ( ! icon )
          {
            icon = thiz.icon.folderOpen ;
            TR.hasThemeFolder = true ;
          }
          if ( thiz.always_show_chevron )
          {
            timg = '<img name="MARKER" src="' + thiz.icon.nlPlus + '" style="width:16px;height:16px;" alt="" />';
          }
          else
          {
            timg = '<img name="MARKER" src="' + thiz.icon.empty + '" style="width:16px;height:16px;" alt="" />';
          }
          simg = '<img name="FOLDER" src="' + icon + '" style="width:16px;height:16px;" alt="" />';
          text += timg + simg + "&nbsp;" + title + "</span>" ;
          TR.isEmpty = true ;
          TR.isOpen = false ;
          if ( depth > thiz.preopen_level + 1 )
          {
            TR_display = "NONE" ;
          }
        }
        TR.currentDepth = depth ;
        var index = thiz.TBODY.lastChild ? thiz.TBODY.lastChild.sectionRowIndex + 1 : 0 ;
        var n = index + 1 ;

        if ( n % 2 == 1 ) TR.className = "ThemeTableRowClassAlternate" ;
        else              TR.className = "ThemeTableRowClass" ;
        TR.originalIndex = n ;
        thiz.TBODY.appendChild ( TR ) ;

        TR.domRow = e.getDom() ;
        TR.domRowRealName = thiz.node_name ;
        var TD = document.createElement ( "td" ) ;
        TR.appendChild ( TD ) ;
        TD.style.whiteSpace = "nowrap" ;
        TD.innerHTML = text ;
        if ( TR_display ) TR.style.display = TR_display ;
      }
      return true ;
    }
  }) ;
};
TTree.prototype.findNode = function ( keyName, attrName, TR )
{
  if ( ! attrName ) attrName = 'name' ;
  var ch = this.TBODY.firstChild ;
  if ( TR ) ch = TR ;
  for ( ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    var xRow = new TXml ( ch.domRow   ) ;
    if ( xRow.getAttribute ( attrName ) == keyName )
    {
      return new TTreeNode ( this, ch ) ;
    }
  }
  return null ;
};
TTree.prototype.getNode = function ( keyName, attrName, TR )
{
  if ( ! attrName ) attrName = 'name' ;
  var ch = this.TBODY.firstChild ;
  if ( TR ) ch = TR ;
  var currentDepth = ch.currentDepth ;
  for ( ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.currentDepth != currentDepth ) continue ;
    var xRow = new TXml ( ch.domRow   ) ;
    if ( xRow.getAttribute ( attrName ) == keyName )
    {
      return new TTreeNode ( this, ch ) ;
    }
  }
  return null ;
};
TTree.prototype.openPath = function ( path, attrName, TR )
{
  if ( ! path )
  {
    throw "Missing parameter 'path' in TTree.prototype.openPath" ;
  }
  var pa = path.split ( "/" ) ;
  var first = true ;
  var tn ;
  for ( var i = 0 ; i < pa.length ; i++ )
  {
    if ( first )
    {
      first = false ;
      tn = this.getNode ( pa[i], attrName, TR ) ;
      if ( ! tn ) return ;
      tn.open() ;
    }
    else
    {
      tn = tn.getChild ( pa[i], attrName ) ;
      if ( ! tn ) return ;
      tn.open() ;
    }
  }
  return tn ;
};

/**
 *  @constructor
 */
var TTreeNode = function ( table, TR )
{
  Tango.initSuper ( this, TTableRow, table, TR );
  this.jsClassName = "TTreeNode" ;
};
TTreeNode.inherits ( TTableRow ) ;
TTreeNode.prototype.isOpen = function()
{
  return this.TR.isOpen ;
} ;
TTreeNode.prototype.open = function ( event )
{
  return this.table.openNode ( this.TR, event ) ;
} ;
TTreeNode.prototype.close = function ( event )
{
  return this.table.closeNode ( this.TR, event ) ;
} ;
TTreeNode.prototype.getChild = function ( keyName, attrName )
{
  if ( ! attrName ) attrName = 'name' ;
  var TR ;
  var ch ;
  var childDepth = this.TR.currentDepth + 1 ;
  for ( ch = this.TR.nextSibling ; ch ; ch = ch.nextSibling )
  {
    if ( ch.currentDepth <= this.TR.currentDepth )
    {
      break ;
    }
    else
    if ( ch.currentDepth == childDepth )
    {
      if ( ! keyName )
      {
        return new TTreeNode ( this.table, ch ) ;
      }
      var xRow = new TXml ( ch.domRow   ) ;
      if ( xRow.getAttribute ( attrName ) == keyName )
      {
        return new TTreeNode ( this.table, ch ) ;
      }
    }
    else
    {
      continue ;
    }
  }
} ;
TTreeNode.prototype.openPath = function ( path, attrName )
{
  var ch = this.getChild() ;
  if ( ! ch ) return ;
  return this.table.openPath ( path, attrName, ch.TR ) ;
} ;
