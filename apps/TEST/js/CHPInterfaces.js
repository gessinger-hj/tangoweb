/**
 *  @constructor
 * ============================= FOR TEST ONLY ===========================
 * TODO: FLAG: Invoice locked, billing running
 * TODO: bill period type
      <unbilledItems accountId='5001306'>
        <billDate>2011-02-03</billDate>
        <billPeriodStart>2011-01-01</billPeriodStart>
        <unbilledBalance/>
      </unbilledItems>


Value	Description
1	Recurring Service Charge			validFrom
2	Non-recurring Service Charge - One time		validFrom, decription
3	Non-recurring Service Charge - Adjustment	validFrom, decription, value
4	Non-recurring Service Charge - Discount		validFrom, decription, value
5	Recurring Account Charge			validFrom
6	Non-recurring Account Charge - One time		validFrom, decription
7	Non-recurring Account Charge - Adjustment	validFrom, decription, value
8	Non-recurring Account Charge - Discount		validFrom, decription, value
 * 
 */
var CHPInterface = function()
{
  Tango.mixin ( PageletInterface, this ) ;
  this.startIndex = 0 ;
  this.numberPerPage = 3 ;
  this.numberOfFoundResources = 0 ;
} ;
CHPInterface.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
} ;
CHPInterface.prototype.search = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var thiz = this ;
  thiz.v = v ;
log ( v ) ;
log ( this.getParent() ) ;
log ( this ) ;
} ;
CHPInterface.prototype.reset = function()
{
  return true ;
} ;
/**
 *  @constructor
 *  @extends CHPInterface
 */
var CHPIService = function ( id )
{
  Tango.initSuper( this, CHPInterface );
  this.jsClassName = "CHPIService" ;
} ;
CHPIService.inherits( CHPInterface ) ;
CHPIService.prototype.search = function ( event, scroll )
{
  if ( ! scroll )
  {
    this.startIndex = 0 ;
  }
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var thiz = this ;
  thiz.v = v ;
  var arHandler = this.getParent() ;
  thiz.servideProviderId = arHandler.servideProviderId ;
  thiz.customerId = arHandler.customerId ;
  thiz.accountId = arHandler.accountId ;

  thiz.v.add ( "servideProviderId", thiz.servideProviderId ) ;
  thiz.v.add ( "startIndex", thiz.startIndex ) ;
  thiz.v.add ( "numberPerPage", thiz.numberPerPage ) ;

  thiz.cissPublisher = arHandler.cissPublisher ;
  var x = thiz.cissPublisher.getListOfResourcesForCustomer ( thiz.customerId, thiz.accountId, thiz.v ) ;
  this.setSearchResult ( x ) ;
} ;
CHPIService.prototype.setSearchResult = function ( xResult )
{
  if ( ! xResult )
  {
    this.container.reset() ;
    return ;
  }
  this.B_saveChanges.setEnabled ( false ) ;

  this.numberOfFoundResources = xResult.getInt ( "numberOfFoundResources" ) ;
  this.resourcesList = xResult.get ( "resourcesList" ) ;
  this.list.length = 0 ;
  var en = this.resourcesList.getEnum ( "resource" ) ;
  while ( en.hasNext() )
  {
    this.list.push ( en.nextXml() ) ;
  }
  this.closeAll() ;

  var xml = new TXml() ;
  var txt = "Search results "
          + ( this.startIndex + 1 ) + " - " + ( this.startIndex + this.numberPerPage )
          + " of " + this.numberOfFoundResources
          ;

  xml.add ( "L.Result", txt ) ;
  this.container.setValues ( xml ) ;

  if ( this.startIndex > 0 )
  {
    this.B_previousPage.setEnabled ( true ) ;
    this.B_gotoFirst.setEnabled ( true ) ;
  }
  else
  {
    this.B_previousPage.setEnabled ( false ) ;
    this.B_gotoFirst.setEnabled ( false ) ;
  }

  if ( this.startIndex + this.numberPerPage >= this.numberOfFoundResources )
  {
    this.B_nextPage.setEnabled ( false ) ;
    this.B_gotoLast.setEnabled ( false ) ;
  }
  else
  {
    this.B_nextPage.setEnabled ( true ) ;
    this.B_gotoLast.setEnabled ( true ) ;
  }
  this.B_openAll.setEnabled ( true ) ;
  this.B_closeAll.setEnabled ( true ) ;
} ;
CHPIService.prototype.onload = function ( ev )
{
  this.container = ev.getComponent() ;
  this.tab = this.container.getPeer ( "resourcesList" ) ;
  this.list = [] ;
 
  var param = {} ;
  param.target = this.tab.dom ;
  this.maxiMenu = new MaxiMenu ( param ) ;
  this.maxiMenu.addEventListener ( this, this.maxiMenu_remove, "remove" ) ;

  this.B_previousPage = this.container.getComponent ( "B_previousPage" ) ;
  this.B_nextPage = this.container.getComponent ( "B_nextPage" ) ;
  this.B_previousPage.setEnabled ( false ) ;
  this.B_nextPage.setEnabled ( false ) ;

  this.B_gotoFirst = this.container.getComponent ( "B_gotoFirst" ) ;
  this.B_gotoLast = this.container.getComponent ( "B_gotoLast" ) ;
  this.B_gotoFirst.setEnabled ( false ) ;
  this.B_gotoLast.setEnabled ( false ) ;

  this.B_openAll = this.container.getComponent ( "B_openAll" ) ;
  this.B_closeAll = this.container.getComponent ( "B_closeAll" ) ;
  this.B_saveChanges = this.container.getComponent ( "B_saveChanges" ) ;
};
CHPIService.prototype.gotoFirst = function ( event )
{
  this.startIndex = 0 ;
  this.search ( event, true ) ;
} ;
CHPIService.prototype.gotoLast = function ( event )
{
  this.startIndex = this.numberOfFoundResources - this.numberPerPage ;
  this.search ( event, true ) ;
} ;
CHPIService.prototype.previousPage = function ( event )
{
  this.startIndex -= this.numberPerPage ;
  if ( this.startIndex < 0 )
  {
    this.startIndex = 0 ;
  }
  this.search ( event, true ) ;
} ;
CHPIService.prototype.nextPage = function ( event )
{
  this.startIndex += this.numberPerPage ;
  if ( this.startIndex + this.numberPerPage > this.numberOfFoundResources )
  {
    this.startIndex = this.numberOfFoundResources - this.numberPerPage ;
  }
  this.search ( event, true ) ;
} ;
CHPIService.prototype.maxiMenu_remove = function ( event )
{
};
CHPIService.prototype.closeMaxiMenu = function ( event )
{
  this.maxiMenu.remove() ;
};
CHPIService.prototype.createAxlForTableMenu = function ( xServiceCharge )
{
  var axl = null ;
  var serviceChargeTypeId = xServiceCharge.getInt ( "serviceChargeTypeId", 0 ) ;

  if ( serviceChargeTypeId === 3 || xServiceCharge.getName() == "charge" ) // RESOURCE_SCORE_RECURRING
  {
    axl = new TXml() ;
    var xCont = axl.add ( "Container" ) ;
    xCont.addAttribute ( "name", "X" ) ;
    xCont.addAttribute ( "onchange", "handle:PB_Terminate" ) ;

    var xe ;

    xe = xCont.add ( "Label" ) ;
    xe.addAttribute ( "text", "Service Charge:") ;
    xe.addAttribute ( "class", "SimpleTitle") ;

    xe = xCont.add ( "Label" ) ;
    xe.addAttribute ( "text", xServiceCharge.getContent ( "serviceChargeCode" ) ) ;

    xe = xCont.add ( "IconButton" ) ;
    xe.addAttribute ( "style", 'top:0px;right:0;width:11px;' ) ;
    xe.addAttribute ( "normal", "Tango/NotebookButtonCloser/normal" ) ;
    xe.addAttribute ( "inside", "Tango/NotebookButtonCloser/inside" ) ;
    xe.addAttribute ( "pressed", "Tango/NotebookButtonCloser/pressed" ) ;
    xe.addAttribute ( "onclick", "*.closeMaxiMenu()" ) ;

    xCont.add ( "br" ) ;

    xe = xCont.add ( "Date" ) ;
    xe.addAttribute ( "name", "validFrom" ) ;
    xe.addAttribute ( "mandatory", "true" ) ;
    xe.addAttribute ( "default", "false" ) ;
    xe.addAttribute ( "format-out", "yyyy-MM-ddTHH:mm:ss" ) ;

    xe = xCont.add ( "PushButton" ) ;
    xe.addAttribute ( "name", "PB_Terminate" ) ;
    xe.addAttribute ( "text", "Terminate" ) ;
    xe.addAttribute ( "disabled", "true" ) ;
    xe.addAttribute ( "onclick", "*.terminateServiceCharge()" ) ;

    /*
    xe = xCont.add ( "PushButton" ) ;
    xe.addAttribute ( "text", "Close" ) ;
    xe.addAttribute ( "onclick", "*.closeMaxiMenu()" ) ;
    */
    return axl ;
  }
  else
  if (  xServiceCharge.getName() == "resource" )
  {
    this.maxiMenu_MSISDN_ServiceLevel = new TXml ( TSys.getAxl ( "MaxiMenu.MSISDN.ServiceLevel.axl" ) ) ;
    return this.maxiMenu_MSISDN_ServiceLevel ;
  }
  return axl ;
} ;
CHPIService.prototype.terminateServiceCharge = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
log ( v ) ;
  this.closeMaxiMenu() ;
};
CHPIService.prototype.onclickTable = function ( event )
{
  var r = this.tab.getSelectedRow() ;
  if ( ! r ) return ;
  var xr = r.getXml() ;
  var colIndex = this.tab.getSelectedColumnIndex() ;
  var arrowIndex = this.tab.getColumnIndexByName ( "arrow" ) ;
  if ( colIndex == arrowIndex )
  {
    if ( xr.getName() == "charge" ) return ;
    this.toggleNode ( event ) ;
    return ;
  }
  var ev = new TEvent ( event ) ;
  var loc = TGui.getLocationOnPageOf ( this.tab.TABLE ) ;
  var x = ev.getX() - loc.x ;
  var y = ev.getY() - loc.y ;
  var r = this.tab.getRowFromPosition ( x, y ) ;
  if ( ! r )
  {
    this.maxiMenu.remove() ;
    return ;
  }
  if ( this.tableLastRowIndex == r.getIndex() )
  {
    if ( ! this.maxiMenu.isOpen() )
    {
      this.tableLastRowIndex = -1 ;
    }
    else
    {
      ev.consume() ;
      return ;
    }
  }
  if ( this.tableLastRowIndex != r.getIndex() )
  {
    this.maxiMenu.remove() ;
    this.r = r ;
    this.tableLastRowIndex = r.getIndex() ;
  }

  if ( xr.getName() == "charge" )
  {
    if ( colIndex < 2 ) return ;
    var axl = this.createAxlForTableMenu ( xr ) ;
    if ( ! axl ) return ;
    var bounds_target = TGui.getBoundsOnPageOf ( this.tab.dom ) ;
    var bounds_TR = TGui.getLocationOnPageOf ( this.r.TR ) ;
    var y = bounds_TR.y - bounds_target.y + Math.round ( this.r.TR.offsetHeight ) ;
    this.maxiMenu.setAxl ( axl ) ;
    this.maxiMenu.setLocation ( ev.getX(), y ) ;
    this.maxiMenu.create ( event ) ;
    var validFrom = this.maxiMenu.getContainer().getComponent ( "validFrom" ) ;
//    validFrom.setMinimumDate ( this.getParent().getCurrentBillPeriodStart() ) ;
    this.maxiMenu.show ( event ) ;
    return ;
  }
  else
  {
    var axl = this.createAxlForTableMenu ( xr ) ;
    if ( ! axl ) return ;
    var bounds_target = TGui.getBoundsOnPageOf ( this.tab.dom ) ;
    var bounds_TR = TGui.getLocationOnPageOf ( this.r.TR ) ;
    var y = bounds_TR.y - bounds_target.y + Math.round ( this.r.TR.offsetHeight ) ;
    this.maxiMenu.setAxl ( axl ) ;
    this.maxiMenu.setLocation ( ev.getX(), y ) ;

    var x = this.getListOfServiceChargesForAccount() ;
//log ( x ) ;

    x = new TXml() ;
    var xl = x.add ( "serviceChargesList" ) ;
    var xr = xl.add ( "serviceCharge" ) ;
    xr.add ( 'productBundleCode', 'Code xxxxxxxxxxxxxxxx  xxxxxxxxxxxxxxxxx' ) ;
    xr.add ( 'productBundleName', 'Name aaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaa' ) ;
    xr.add ( 'serviceChargeTypeId', '2' ) ;
    this.maxiMenu.create ( event ) ;
    this.maxiMenu.setValues ( x ) ;
    this.maxiMenu.show ( event ) ;
  }
} ;
CHPIService.prototype.toggleNode = function ( event )
{
  var r = this.tab.getSelectedRow() ;
  var xr = r.getXml() ;
  if ( xr.getAttribute ( "open" ) )
  {
    r.setColumnVisibleText ( "arrow", "<img src=\"img/red_arrow_footer.png\" onmousedown=\"return false;\"/>" ) ;
    xr.removeAttribute ( "open" ) ;
    var xrName = xr.getName() ;
    var TR = r.TR.nextSibling ;
    while ( TR )
    {
      var nextTR = TR.nextSibling ;
      var rr = new TTableRow ( r.table, TR ) ;
      var xrr = rr.getXml() ;
      var xrrName = xrr.getName() ;
      if ( xrName == xrrName )
      {
        break ;
      }
      rr.remove() ;
      TR = nextTR ;
    }
  }
  else
  {
    r.setColumnVisibleText ( "arrow", "<img src=\"img/red_arrow_footer-up.png\" onmousedown=\"return false;\"/>" ) ;
    xr.addAttribute ( "open", true ) ;

    var rIndex = r.getIndex() ;
    var rowName = this.tab.rowName ;
    this.tab.rowName = "charge" ;
    var en2 = xr.getEnum ( "chargesList/charge" ) ;
    while ( en2.hasNext() )
    {
      var r2 = en2.nextXml() ;
      rIndex++ ;
      this.tab.insertRowAt ( r2, rIndex ) ;
    }
    this.tab.rowName = rowName ;
  }
} ;
CHPIService.prototype.openAll = function()
{
  var n = this.list.length ;
  for ( var i = 0 ; i < n ; i++ )
  {
    this.list[i].addAttribute ( "open", true ) ;
  }
  this.display() ;
} ;
CHPIService.prototype.closeAll = function()
{
  var n = this.list.length ;
  for ( var i = 0 ; i < n ; i++ )
  {
    this.list[i].removeAttribute ( "open" ) ;
  }
  this.display() ;
} ;
CHPIService.prototype.display = function()
{
  if ( ! this.resourcesList ) return ;
  this.tab.clear() ;
  var en = this.resourcesList.getEnum ( "resource" ) ;
  while ( en.hasNext() )
  {
    var xr = en.nextXml() ;
    var isOpen = xr.getAttribute ( "open" ) ;
    if ( ! isOpen )
    {
      xr.add ( "arrow", "<img src=\"img/red_arrow_footer.png\" onmousedown=\"return false;\"/>" ) ;
    }
    else
    {
      xr.add ( "arrow", "<img src=\"img/red_arrow_footer-up.png\" onmousedown=\"return false;\"/>" ) ;
    }
    var nuRow = this.tab.addRow ( xr ) ;
    if ( ! isOpen )
    {
      if ( ! xr.getBoolAttribute ( "bookkeeping", false ) )
      {
        xr.addAttribute ( "bookkeeping", true ) ;
        var en3 = xr.getEnum ( "chargesList/charge" ) ;
        while ( en3.hasNext() )
        {
          var xr3 = en3.nextXml() ;
	  var serviceChargeCode = xr3.getContent ( "serviceChargeCode" ) ;
	  xr.addAttribute ( serviceChargeCode, "true" ) ;
        }
      }
      continue ;
    }

    var rowName = this.tab.rowName ;
    this.tab.rowName = "charge" ;
    var en2 = xr.getEnum ( "chargesList/charge" ) ;
    while ( en2.hasNext() )
    {
      var xr2 = en2.nextXml() ;
      if ( ! xr.getBoolAttribute ( "bookkeeping", false ) )
      {
        var serviceChargeCode = xr2.getContent ( "serviceChargeCode" ) ;
        xr.addAttribute ( serviceChargeCode, "true" ) ;
      }
      this.tab.addRow ( xr2 ) ;
    }
    this.tab.rowName = rowName ;
  }
} ;
CHPIService.prototype.onclick_maxiMenu_serviceChargesList = function ( event )
{
  this.maxiMenu.getContainer().getComponent ( "B_Apply" ).setEnabled ( true ) ;
};
CHPIService.prototype.addServiceCharge = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
log ( ev ) ;
} ;
CHPIService.prototype.saveChanges = function ( event )
{
} ;
CHPIService.prototype.getListOfServiceChargesForAccount = function()
{
return ;
} ;
/**
 *  @constructor
 *  @extends CHPInterface
 */
var CHPIAccount = function ( id )
{
  Tango.initSuper( this, CHPInterface );
  this.jsClassName = "CHPIAccount" ;
} ;
CHPIAccount.inherits( CHPInterface ) ;
CHPIAccount.prototype.onload = function ( ev )
{
  this.container = ev.getComponent() ;
} ;
