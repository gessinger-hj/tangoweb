/**
 *  @constructor
 */
ChartFactoryClass = function()
{
  this.jsClassName = "ChartFactoryClass" ;
}
ChartFactoryClass.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
}
ChartFactoryClass.prototype.getPieChart = function()
{
  var p = new PieChart() ;
  p._chartFactory = this ;
  return p ;
}

ChartFactory = new ChartFactoryClass() ;

/**
 *  @constructor
 */
Chart = function()
{
  this.jsClassName = "Chart" ;
  this._chartFactory = null ;
  this._request = new TXml ( "CHARTFACTORY.REQUEST" ) ;
  this._control = this._request.add ( "Control" ) ;
  this._config = null ;
  this._data = this._request.add ( "Data" ) ;
  this._request.add ( "Operation", "Download" ) ;
}
Chart.prototype.TYPE_MIN = 1 ;
Chart.prototype.TYPE_PIE = 1 ;
Chart.prototype.TYPE_MAX = 1 ;
Chart.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
} ;
Chart.prototype.setType = function ( type )
{
  if ( type > this.TYPE_MAX || type < this.TYPE_MIN )
  {
    throw "Invalid type: " + type ;
  }
  var x = this._control.ensureElement ( "type" ) ;
  x.setContent ( "" + type ) ;
} ;
Chart.prototype.getRequest = function()
{
  return this._request ;
} ;
Chart.prototype.setConfig = function ( xConfig )
{
  var en = this._config.elements() ;
  while ( en.hasNext() )
  {
    var e = en.nextXml() ;
    var ee = xConfig.getXml ( e.getName() ) ;
    if ( ! ee ) continue ;
    e.setContent ( ee.getContent() ) ;
  }
} ;
Chart.prototype.setData = function ( xData )
{
  this._data.removeAllChildren() ;
  this._data.add ( xData ) ;
} ;
Chart.prototype._createMessage = function()
{
  var msg = new CoMessage ( "CHARTFACTORY.REQUEST" ) ;
  msg.setXmlData ( this._request ) ;
  return msg ;
} ;
Chart.prototype.createImageUrl = function()
{
  return Calypso.getHttpDocumentUrlForStream ( this._createMessage() ) ;
} ;
Chart.prototype.setImage = function ( elemOrId )
{
  var url = this.createImageUrl() ;
  var e = null ;
  if ( typeof ( elemOrId ) == 'string' )
  {
    e = document.getElementById ( elemOrId ) ;
  }
  if ( e.nodeName.toUpperCase() == 'IMG' ) e.src = url ;
  else                                     e.style.backgroundImage = "url(" + url + ")" ;
} ;
Chart.prototype.download = function()
{
  Calypso.downloadDocument ( this._createMessage() ) ;
} ;

/**
 *  @constructor
 *  @extends Chart
 */
PieChart = function()
{
  Tango.initSuper ( this, Chart, arguments );
  this.jsClassName = "PieChart" ;
  this.setType ( this.TYPE_PIE ) ;
  var str = ""
          + "<Config>"
          + "  <title></title>"
          + "  <legend>true</legend>"
          + "  <labels>false</labels>"
          + "  <label-color>#FFFFFF</label-color>"
          + "  <label-background-color>#888888</label-background-color>"
          + "  <background-color>#FFFFFF00</background-color>"
          + "  <depth>0.2</depth>"
          + "  <start-angle>70</start-angle>"
          + "</Config>"
          ;

  this._request.add ( TSys.parseXml ( str ) ) ;
  this._config = this._request.get ( "Config" ) ;
}
PieChart.inherits( Chart ) ;
