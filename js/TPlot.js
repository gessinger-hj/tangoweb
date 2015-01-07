Tango.include ( "TUtil" ) ;
/**
 *  @constructor
 *  @extends Canvas
 */
var XYDiagram = function ( domXml )
{
  Tango.initSuper ( this, Canvas, domXml );
  this.jsClassName = "XYDiagram" ;
  if ( ! this.xml ) return ;
/*

  this.top = 0 ;
  this.left = 0 ;
  this.right = 0 ;
*/
  this.xAxisColor = "black" ;
  this.yAxisColor = "black" ;
  this.vGridColor = "gray" ;
  this.hGridColor = "gray" ;
  this.graphColor = "black" ;
  this.fillColor = "black" ;

  this.graphColor = this.xml.getAttribute ( "graph-color", this.graphColor ) ;
  this.fill = this.xml.getBoolAttribute ( "fill", false ) ;

  this.xmin = 0 ;
  this.xmax = 100 ;
  this.xgrid = false ;
  this.ygrid = false ;
  this.ymin = 0 ;
  this.ymax = 100 ;
  this.ylog = false ;
  this._PixelPerTic = 50 ;
  this._ln_10 = Math.log ( 10.0 ) ;
  this._ln_ymax = Math.log ( this.ymax ) / this._ln_10 ;
  this.xaxis = true ;
  this.yaxis = true ;
  this.xLabelSpace = 2 ;
  this.yLabelSpace = 2 ;
  this._TicSize = 4 ;
  this._xLabelElements = [] ;
  this._yLabelElements = [] ;

  this.xmin = this.xml.getIntAttribute ( "xmin", this.xmin ) ;
  this.xmax = this.xml.getIntAttribute ( "xmax", this.xmax ) ;
  this.ymin = this.xml.getIntAttribute ( "ymin", this.ymin ) ;
  this.ymax = this.xml.getIntAttribute ( "ymax", this.ymax ) ;

  this.ylog = this.xml.getBoolAttribute ( "ylog", this.ylog ) ;
  this.xgrid = this.xml.getBoolAttribute ( "xgrid", this.xgrid ) ;
  this.ygrid = this.xml.getBoolAttribute ( "ygrid", this.ygrid ) ;

  this.xaxis = this.xml.getBoolAttribute ( "xaxis", this.xaxis ) ;
  this.yaxis = this.xml.getBoolAttribute ( "yaxis", this.yaxis ) ;

  this.titleText = this.xml.getAttribute ( "title" ) ;
  this.titleStyle = this.xml.getAttribute ( "title-style" ) ;

  this.xAxisText = this.xml.getAttribute ( "xtext" ) ;
  this.xtextStyle = this.xml.getAttribute ( "xtext-style" ) ;
  this.xticStyle = this.xml.getAttribute ( "xtic-style" ) ;

  this.ytext = this.xml.getAttribute ( "ytext" ) ;
  this.ytextStyle = this.xml.getAttribute ( "ytext-style" ) ;
  this.yticStyle = this.xml.getAttribute ( "ytic-style" ) ;

  this.bottom = 0 ;
};
XYDiagram.inherits( Canvas ) ;
XYDiagram.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  Canvas.prototype.layout.apply ( this, arguments ) ;
  if ( this.xml )
  {
    if ( this.ylog )
    {
      this._ln_ymax = Math.log ( this.ymax ) / this._ln_10 ;
    }

    var size = this.getSize() ;
    var span = document.createElement ( "span" ) ;
    document.body.appendChild ( span ) ;
    if ( this.titleText )
    {
      var str = "<span " ;
      if ( this.titleStyle ) str += " style='" + this.titleStyle + "'" ;
      str += ">" ;
      str += this.titleText + "</span>" ;

      span.innerHTML = str ;

      var h = span.offsetHeight ;
      this.title = span.firstChild ;
      this.title.parentNode.removeChild ( this.title ) ;

      this.dom.appendChild ( this.title ) ;
      this.title.style.position = "absolute" ;
      this.title.style.top = "0px" ;
      this.title.style.left = this.left + "px" ;
      this.title.style.width = ( size.width - this.left - this.right ) + "px" ;
      this.title.style.textAlign = "center" ;
      this.top = h ; // this.title.offsetHeight ;
    }
    if ( this.xAxisText )
    {
      var str = "<span " ;
      if ( this.xtextStyle ) str += " style='" + this.xtextStyle + "'" ;
      str += ">" ;
      str += this.xAxisText + "</span>" ;

      span.innerHTML = str ;

      var h = span.offsetHeight ;
      this.xtext = span.firstChild ;
      this.xtext.parentNode.removeChild ( this.xtext ) ;

      this.dom.appendChild ( this.xtext ) ;
      this.xtext.style.position = "absolute" ;
      this.xtext.style.left = this.left + "px" ;
      this.xtext.style.width = ( size.width - this.left - this.right ) + "px" ;
      this.xtext.style.textAlign = "center" ;
      this.xtext.style.top = ( size.height - h ) + "px" ;
      this.bottom += h ;
    }
    if ( this.xaxis )
    {
      var str = "<span " ;
      if ( this.xticStyle ) str += " style='" + this.xticStyle + "'" ;
      str += ">" ;
      str += this.xmax ;
      str += "</span>" ;
      span.innerHTML = str ;
      this.xLabelSize = new TDimension ( span.offsetWidth, span.offsetHeight ) ;
      this.bottom += 2 * this.xLabelSpace + this._TicSize ;
    }
    if ( this.yaxis )
    {
      var str = "<span " ;
      if ( this.yticStyle ) str += " style='" + this.yticStyle + "'" ;
      str += ">" ;
      if ( this.ylog )
      {
        str += this.createMaximumLogYTicText ( this.ymax ) ;
      }
      else
      {
        str += this.ymax ;
      }
      str += "</span>" ;
      span.innerHTML = str ;
      this.yLabelSize = new TDimension ( span.offsetWidth, span.offsetHeight ) ;
      this.left += this.yLabelSize.width + 2 * this.yLabelSpace + this._TicSize ;
    }
    span.parentNode.removeChild ( span ) ;
    var size = this.getSize() ;
    this.plotArea = new TRectangle ( this.left
                                    , this.top
                                    , size.width - this.left - this.right
                                    , size.height - this.top - this.bottom
                                    ) ;
  }
}
XYDiagram.prototype.resized = function ( e )
{
  var size = this.getSize() ;
  this.plotArea = new TRectangle ( this.left
                                  , this.top
                                  , size.width - this.left - this.right
                                  , size.height - this.top - this.bottom
                                  ) ;
  Canvas.prototype.resized.apply ( this, arguments ) ;
  this.clear() ;
  for ( var i = 0 ; i < this._xLabelElements.length ; i++ )
  {
    var e = this._xLabelElements[i] ;
    e.parentNode.removeChild ( e ) ;
  }
  this._xLabelElements.length = 0 ;
  for ( var i = 0 ; i < this._yLabelElements.length ; i++ )
  {
    var e = this._yLabelElements[i] ;
    e.parentNode.removeChild ( e ) ;
  }
  this._yLabelElements.length = 0 ;
  if ( this._yTicsY )
  {
    this._yTicsY.length = 0 ;
    this._yTicsValues.length = 0 ;
    this._yTicsY = null ;
    this._yTicsValues = null ;
  }

  if ( this.xaxis )
  {
    this.calculateTics() ;
    this.drawXAxis() ;
  }
  if ( this.yaxis )
  {
    this.calculateTics() ;
    this.drawYAxis() ;
  }
  this.drawGrid() ;

  if ( this.title )
  {
    this.title.style.left = this.left + "px" ;
    this.title.style.width = ( size.width - this.left - this.right ) + "px" ;
  }
  if ( this.xtext )
  {
    this.xtext.style.left = this.left + "px" ;
    this.xtext.style.width = ( size.width - this.left - this.right ) + "px" ;
    this.xtext.style.textAlign = "center" ;
    this.xtext.style.top = ( size.height - this.xtext.offsetHeight ) + "px" ;
  }
}
XYDiagram.prototype._paint = function()
{
  this.clearPlotArea() ;
/*
  var ctx = this.getContext() ;
  ctx.save()
  var x = this.canvas.width - this.right ;
  var x0 = x ;
  var dx = -1 ;
  var maxIndex = this.yPixels.length - 1 ;
  ctx.strokeStyle = this.graphColor ;
  ctx.fillStyle = this.fillColor ;
  ctx.beginPath();
  var y0 = this.canvas.height - this.yPixels[maxIndex] ;
  ctx.moveTo ( x0, y0 ) ;
  x += dx ;
  for ( var i = maxIndex - 1 ; i >= 0 ; i-- )
  {
    var py = this.canvas.height - this.yPixels[i] ;
    if ( py >= this.top && py <= this.canvas.height - this.bottom )
    {
      ctx.lineTo ( x, py ) ;
    }
    x += dx ;
  }
  if ( this.fill )
  {
    ctx.stroke();
    ctx.lineTo ( x, this.canvas.height - this.bottom ) ;
    ctx.lineTo ( x0, this.canvas.height - this.bottom ) ;
    ctx.fill();
  }
  else
  {
    ctx.stroke();
  }
  ctx.closePath();
  ctx.restore()
*/
};
XYDiagram.prototype.calculateTics = function()
{
  if ( ! this._xTicsX )
  {
    this._xTicsX = [] ;
    this._xTicsValues = [] ;

    this._XAxisValues = new PlotAxisValues ( this.xmin, this.xmax, false ) ;
    var n = this.plotArea.width / this._PixelPerTic ;
    this._XAxisValues.setMinimumNumberOfTics ( n, this.plotArea.width ) ;

    var pav  = this._XAxisValues ;
    var min  = pav.getMin() ;
    var vmax = pav.getMax() ;
    var v    = this.xmin ;
    var dtic  = pav.getDTic() ;
    if ( dtic <= 0 ) return ;

    var scaleSeconds = false ; //getScaleSeconds() ;
    for ( var i = 0 ; v < vmax ; i++ )
    {
      this._xTicsValues.push ( v ) ;
      this._xTicsX.push ( this.calculatePixelFromXValue ( v ) ) ;
      v += dtic ;
    }
  }
  if ( ! this._yTicsY )
  {
    this._yTicsY = [] ;
    this._yTicsValues = [] ;
    /*
    ** Create the int-array for horizontal line's y-position
    */
    if ( this.ylog )
    {
      var mult = 1 ;
      for ( var m = 1 ; m < 9 ; m++ )
      {
        var n = 0 ;
        for ( var k = 1 ; k <= 9 ; k++ )
        {
          n = Math.floor ( k * mult ) ;
          this._yTicsValues.push ( n ) ;
          this._yTicsY.push ( this.calculatePixelFromYValue ( n ) ) ;
          if ( n >= this.ymax ) break ;
        }
        if ( n >= this.ymax ) break ;
        mult = Math.floor ( mult * 10 ) ;
      }
    }
    else
    {
      this._YAxisValues = new PlotAxisValues ( this.ymin, this.ymax, false ) ;
      var n = this.plotArea.height / this._PixelPerTic ;
      this._YAxisValues.setMinimumNumberOfTics ( n, this.plotArea.height ) ;

      var pav = this._YAxisValues ;
      var min  = pav.getMin() ;
      var vmax  = pav.getMax() ;
      var v    = this.ymin ;
      var dtic  = pav.getDTic() ;
      if ( dtic <= 0 ) return ;

      var scaleSeconds = false ; //getScaleSeconds() ;
      for ( var i = 0 ; v < vmax ; i++ )
      {
        this._yTicsValues.push ( v ) ;
        this._yTicsY.push ( this.calculatePixelFromYValue ( v ) ) ;
        v += dtic ;
      }
    }
  }
}
XYDiagram.prototype.drawGrid = function()
{
  if ( this.xgrid )
  {
    this.calculateTics() ;
  }
  if ( this.ygrid )
  {
    this.calculateTics() ;
    var len = this._yTicsY.length ;
    var ctx = this.getContext() ;
    ctx.save()
    ctx.strokeStyle = this.hGridColor ;
    ctx.lineWidth = 0.3 ;
    var x0 = this.left ;
    var x1 = this.canvas.width - this.right ;
    ctx.beginPath();
    for ( var i = 0 ; i < len ; i++ )
    {
      var y = this._yTicsY[i] ;
      ctx.moveTo ( x0, this.canvas.height - y ) ;
      ctx.lineTo ( x1, this.canvas.height - y ) ;
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore()
  }
}
XYDiagram.prototype.setXText = function ( str )
{
  if ( ! this.xtext ) return ;
  this.xtext.innerHTML = str ;
}
XYDiagram.prototype.drawPoint = function ( x, y )
{
  if ( x > this.xmax || x < this.xmin ) return ;
  if ( y > this.ymax || y < this.ymin ) return ;
  var xv = x / ( this.xmax - this.xmin ) ;
  var yv = y / ( this.ymax - this.ymin ) ;
  var xp = Math.floor ( xv * this.plotArea.width ) ;
  var yp = Math.floor ( yv * this.plotArea.height ) ;
  this.drawPixel ( xp + this.left, yp + this.bottom ) ;
}
XYDiagram.prototype.calculatePixelFromXValue = function ( x )
{
  var xv = 0 ;
  if ( x > this.xmax ) x = this.xmax ;
  if ( x < this.xmin ) x = this.xmin ;
  xv = x / ( this.xmax - this.xmin ) ;
  var xp = Math.floor ( xv * this.plotArea.width ) + this.left ;
  return xp ;
}
XYDiagram.prototype.calculatePixelFromYValue = function ( y )
{
  var yv = 0 ;
  if ( y > this.ymax ) y = this.ymax ;
  if ( y < this.ymin ) y = this.ymin ;
  if ( this.ylog )
  {
    if ( y <= 1.001 ) yv = 0 ;
    else
    {
      var ln_value = Math.log ( y ) / this._ln_10 ;
      yv = ln_value / this._ln_ymax ;
    }
  }
  else
  {
    yv = y / ( this.ymax - this.ymin ) ;
  }
  var yp = Math.floor ( yv * this.plotArea.height ) + this.bottom ;
  return yp ;
}
XYDiagram.prototype.clearPlotArea = function()
{
  var ctx = this.getContext() ;
  ctx.save() ;
  ctx.fillStyle = "transparent" ;
  ctx.clearRect ( this.plotArea.x, this.plotArea.y, this.plotArea.width, this.plotArea.height ) ;
  ctx.restore() ;
  this.drawGrid() ;
}
XYDiagram.prototype.drawXAxis = function()
{
  var size = this.getSize() ;
  this.drawLine ( this.left
                , this.bottom
                , size.width - this.right
                , this.bottom
                , this.xAxisColor
                ) ;

  var h = this.xLabelSize.height ;
  var fm_height = h ;
  var tic_text = [] ;

//log ( this._xTicsX ) ;
  for ( var i = 0 ; i < this._xTicsValues.length ; i++ )
  {
    tic_text.push ( this._xTicsValues[i] ) ;
  }
  var span = document.createElement ( "span" ) ;
  document.body.appendChild ( span ) ;

  var ctx = this.getContext() ;
  ctx.save()
  ctx.strokeStyle = this.xAxisColor ;
  ctx.lineWidth = 0.9 ;
  var y0 = size.height - this.bottom ;
  var y1 = size.height - this.bottom + this._TicSize ;
  ctx.beginPath();

  for ( var i = 0 ; i < tic_text.length ; i++ )
  {
    if ( ! tic_text[i] ) continue ;
/*
    var str = "<span " ;
    if ( this.xticStyle ) str += " style='" + this.xticStyle + "'" ;
    str += ">" ;
    str += "" + tic_text[i] + "</span>" ;
    span.innerHTML = str ;
    var w = span.offsetWidth ;
    var h = span.offsetHeight ;
    var eLabel = span.firstChild ;
    eLabel.parentNode.removeChild ( eLabel ) ;
    this._xLabelElements.push ( eLabel ) ;
*/

    var x = this._xTicsX[i] ;
    ctx.moveTo ( x, y0 ) ;
    ctx.lineTo ( x, y1 ) ;

/*
    this.dom.appendChild ( eLabel ) ;
    eLabel.style.position = "absolute" ;
    eLabel.style.top = Math.floor ( this.canvas.height - y - h + h/2 ) + "px" ;
    eLabel.style.left = ( this.left - w - this.yLabelSpace - this._TicSize ) + "px" ;
    eLabel.style.textAlign = "right" ;
*/
  }
  ctx.stroke();
  ctx.closePath();
  ctx.restore()
  span.parentNode.removeChild ( span ) ;
}
XYDiagram.prototype.drawYAxis = function()
{
  var size = this.getSize() ;
  this.drawLine ( this.left
                , size.height - this.top
                , this.left
                , this.bottom - 1
                , this.yAxisColor
                ) ;

  var h = this.yLabelSize.height ;
  var fm_height = h ;
  var _ytic_text = [] ;
  if ( this.ylog )
  {
    var i = 0 ;
    var j = 0 ;
    var previous_y = - 100 ;
    var mult = 1 ;
    for ( var m = 1 ; m < 9 ; m++ )
    {
      var n = 0 ;
      for ( var k = 1 ; k <= 9 ; k++ )
      {
        n = Math.floor ( k * mult ) ;
        if ( k == 1 || ( this._yTicsY[i] - previous_y ) > fm_height )
        {
          if ( k == 1 && ( previous_y - this._yTicsY[i] ) <= fm_height )
          {
            if ( i > 1 )
            {
              for ( var ii = i - 1 ; ii > 0 ; ii-- )
              {
                if ( _ytic_text[ii] )
                {
                  _ytic_text[ii] = null ; break ;
                }
              }
            }
          }

          _ytic_text[i] = this.createLogYTicText ( n, m ) ;
          previous_y = this._yTicsY[i] ;
        }
        else
        {
          _ytic_text[i] = null ;
        }
        i++ ;
        if ( n >= this.ymax ) break ;
      }
      if ( n >= this.ymax ) break ;
      mult = Math.floor ( mult * 10 ) ;
    }
  }
  else
  {
    for ( var i = 0 ; i < this._yTicsValues.length ; i++ )
    {
      _ytic_text.push ( this._yTicsValues[i] ) ;
    }
  }
  var span = document.createElement ( "span" ) ;
  document.body.appendChild ( span ) ;

  var ctx = this.getContext() ;
  ctx.save()
  ctx.strokeStyle = this.yAxisColor ;
  ctx.lineWidth = 0.9 ;
  var x0 = this.left - this._TicSize ;
  var x1 = this.left ;
  ctx.beginPath();

  for ( var i = 0 ; i < _ytic_text.length ; i++ )
  {
    if ( ! _ytic_text[i] ) continue ;
    var str = "<span " ;
    if ( this.yticStyle ) str += " style='" + this.yticStyle + "'" ;
    str += ">" ;
    str += "" + _ytic_text[i] + "</span>" ;
    span.innerHTML = str ;
    var w = span.offsetWidth ;
    var eLabel = span.firstChild ;
    eLabel.parentNode.removeChild ( eLabel ) ;
    this._yLabelElements.push ( eLabel ) ;

    var y = this._yTicsY[i] ;
    ctx.moveTo ( x0, this.canvas.height - y ) ;
    ctx.lineTo ( x1, this.canvas.height - y ) ;

    this.dom.appendChild ( eLabel ) ;
    eLabel.style.position = "absolute" ;
    eLabel.style.top = Math.floor ( this.canvas.height - y - h + h/2 ) + "px" ;
    eLabel.style.left = ( this.left - w - this.yLabelSpace - this._TicSize ) + "px" ;
    eLabel.style.textAlign = "right" ;
  }
  ctx.stroke();
  ctx.closePath();
  ctx.restore()
  span.parentNode.removeChild ( span ) ;
} ;
XYDiagram.prototype.createMaximumLogYTicText = function ( max )
{
  var m = 0 ;
  var n = 1 ;
  while ( n < max )
  {
    n *= 10 ;
    m++ ;
  }
  var t = this.createLogYTicText ( max, m ) ;
  return t ;
} ;
XYDiagram.prototype.createLogYTicText = function ( n, m )
{
  var v = Math.log ( n ) / Math.LN10 ;
  v = v.roundTo ( 2 ) ;
  var vp = v % 1 ;
  vp = vp.roundTo ( 2 ) ;
  var m1 = m - 1 ;
  if ( ! vp )
  {
    if ( m1 < 2 ) return "" + n ;
    else          return "10<sup>" + m1 + "</sup>" ;
  }
  if ( m1 < 2 ) return "" + n ;
  var nn = Math.round(n/Math.pow(10,m1));
  return "" + nn + "*10<sup>" + m1 + "</sup>" ;
} ;
/**
 *  @constructor
 *  @extends XYDiagram
 */
var Timeline = function ( domXml )
{
  Tango.initSuper ( this, XYDiagram, domXml );
  this.jsClassName = "Timeline" ;
  if ( ! this.xml ) return ;
  this.fillColor = this.xml.getAttribute ( "fill-color", "rgba(127,127,127,0.5)" ) ;
  this.fill = this.xml.getBoolAttribute ( "fill", true ) ;
}
Timeline.inherits( XYDiagram ) ;
Timeline.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  XYDiagram.prototype.layout.apply ( this, arguments ) ;
}
Timeline.prototype.reset = function()
{
  this.clearPlotArea() ;
  this.yValues = [] ;
  this.yPixels = [] ;
}
Timeline.prototype.drawXAxis = function()
{
  var size = this.getSize() ;
  this.drawLine ( this.left
                , this.bottom
                , size.width - this.right
                , this.bottom
                , this.xAxisColor
                ) ;
}
Timeline.prototype.resized = function ( e )
{
  XYDiagram.prototype.resized.apply ( this, arguments ) ;
//  this.yValues = [] ;
//  this.yPixels = [] ;
  if ( this.yValuesPending )
  {
    var yValues = this.yValuesPending ;
    this.yValuesPending = null ;
    this.setData ( yValues ) ;
  }
  if ( ! this.yValues ) return ;
  var max = Math.min ( this.plotArea.width, this.yValues.length ) ;

  this.yPixels = [] ;
  for ( var i = 0 ; i < max ; i++ )
  {
    var yp = this.calculatePixelFromYValue ( this.yValues[i] ) ;
    this.yPixels.push ( yp ) ;
  }
  this._paint() ;
}
Timeline.prototype.addValue = function ( v )
{
  var yp = this.calculatePixelFromYValue ( v ) ;
  if ( ! this.yValues )
  {
    this.yValues = [] ;
    this.yPixels = [] ;
  }
  this.yValues.push ( v ) ;
  this.yPixels.push ( yp ) ;

  if ( this.plotArea.width <= this.yPixels.length )
  {
    this.yValues.splice ( 0, 1 ) ;
    this.yPixels.splice ( 0, 1 ) ;
  }
  this._paint() ;
}
Timeline.prototype.setData = function ( yValues )
{
  if ( ! this.plotArea )
  {
    this.yValuesPending = yValues ;
    return ;
  }
  var max = Math.min ( this.plotArea.width, yValues.length ) ;

  this.yValues = [] ;
  this.yPixels = [] ;
  for ( var i = 0 ; i < this.plotArea.width ; i++ )
  {
    this.yValues[i] = 0 ;
    this.yPixels[i] = 0 ;
  }
  var j = yValues.length - 1 ;
  for ( var i = this.yValues.length - 1 ; i >= 0 && j >= 0 ; i--, j-- )
  {
    var yp = this.calculatePixelFromYValue ( yValues[j] ) ;
    this.yValues[i] = yValues[j] ;
    this.yPixels[i] = yp ;
  }
  this._paint() ;
}
Timeline.prototype._paint = function()
{
  this.clearPlotArea() ;
  var ctx = this.getContext() ;
  ctx.save()
  var x = this.canvas.width - this.right ;
  var x0 = x ;
  var dx = -1 ;
  var maxIndex = this.yPixels.length - 1 ;
  ctx.strokeStyle = this.graphColor ;
  ctx.fillStyle = this.fillColor ;
  ctx.beginPath();
  var y0 = this.canvas.height - this.yPixels[maxIndex] ;
  ctx.moveTo ( x0, y0 ) ;
  x += dx ;
  for ( var i = maxIndex - 1 ; i >= 0 ; i-- )
  {
    var py = this.canvas.height - this.yPixels[i] ;
    if ( py >= this.top && py <= this.canvas.height - this.bottom )
    {
      ctx.lineTo ( x, py ) ;
    }
    x += dx ;
  }
  if ( this.fill )
  {
    ctx.stroke();
    ctx.lineTo ( x, this.canvas.height - this.bottom ) ;
    ctx.lineTo ( x0, this.canvas.height - this.bottom ) ;
    ctx.fill();
  }
  else
  {
    ctx.stroke();
  }
  ctx.closePath();
  ctx.restore()
}
var PlotAxisValues = function ( min, max, scaleSeconds )
{
  this._TestTicValues = [ 1.0, 2.0, 2.5, 5.0 ] ;
  this._SecondsTestTicValues = [ 1.0, 2.0, 5.0, 10.0, 20.0, 30.0, 60.0 ] ;
  this._ScaleSeconds = scaleSeconds ;
  this._ND = new NormalizedDifference ( min, max, 3 ) ;
  this._NumberOfTics = 0 ;
  this._Min = min ;
  this._Max = max ;
  this._Width = this._Max - this._Min ;
  this._DTic = 0.0 ;
  //------------------------------------------------------------
  this._Width = this._ND.getDiff() ;
}
PlotAxisValues.prototype =
{
  getMin: function () { return this._Min ; },
  getMax: function() { return this._Max ; },
  getWidth: function() { return this._Width ; },
  getDTic: function() { return this._DTic ; },
  getNumberOfTics: function() { return this._NumberOfTics ; },
  getExponent: function()
  {
    return this._ND.getExponent() ;
  },
  getTicExponent: function()
  {
    var exp = 0 ;
    var d = this._DTic ;

    if ( d == 0 ) return 0 ;

    if ( d >= 1.0 )
    {
      while ( d > 10.0 )
      {
        d = Math.round ( d / 10 ) ;
        exp++ ;
      } 
    }
    else
    if ( d > 0 )
    {
      while ( d < 1.0 )
      {
        d = Math.round ( d * 10 ) ;
        exp-- ;
      }
    }
    return exp ;
  },
  setMinimumNumberOfTics: function ( minimumNumberOfTics, pixels )
  {
    var k = 0 ;
    var f = 1.0 ;
    var v = this._ND.getValue() ;

    minimumNumberOfTics = Math.floor ( minimumNumberOfTics ) ;
    if ( this._ScaleSeconds )
    {
      while ( true )
      {
        if ( v / ( this._SecondsTestTicValues[k] * f ) <= minimumNumberOfTics )
        {
          k-- ;
          if ( k < 0 )
          {
            k = this._SecondsTestTicValues.length - 1 ;
            f /= 60.0 ;
          }
          break ;
        }
        k++ ;
        if ( k >= this._SecondsTestTicValues.length )
        {
          k = 0 ; f *= 60.0 ;
        }
      }
      this._DTic = this._SecondsTestTicValues[k] * f ;
      this._DTic = this._DTic * Math.pow ( 10.0, this._ND.getExponent() ) ;
      this._Min = this._ND._Min ;
      this._Max = this._ND._Max ;

      if ( this._Min != 0.0 )
      {
        var min = Math.rint ( ( this._Min - this._DTic ) / this._DTic ) * this._DTic ;
        if  ( this._Min > 0.0 && min < 0.0 ) this._Min = 0.0 ;
        else                            this._Min = min ;
      }
      if ( this._Max != 0.0 )
      {
        var max = Math.floor ( ( this._Max + this._DTic ) / this._DTic ) * this._DTic ;
        if  ( this._Max < 0.0 && max > 0.0 ) this._Max = 0.0 ;
        else                            this._Max = max ;
      }
    }
    else
    {
      while ( true )
      {
        if ( v / ( this._TestTicValues[k] * f ) <= minimumNumberOfTics )
        {
          k-- ;
          if ( k < 0 )
          {
            k = this._TestTicValues.length - 1 ;
            f = Math.round ( f / 10.0 ) ;
          }
          break ;
        }
        k++ ;
        if ( k >= this._TestTicValues.length )
        {
          k = 0 ;
          f = Math.round ( f * 10.0 ) ;
        }
      }

      this._DTic = this._TestTicValues[k] * f ;
      this._DTic = this._DTic * Math.pow ( 10.0, this._ND.getExponent() ) ;

      this._Min = this._ND._Min ;
      this._Max = this._ND._Max ;

      if ( this._Min != 0.0 )
      {
        var min = Math.floor ( ( this._Min - this._DTic ) / this._DTic ) * this._DTic ;
        if  ( this._Min > 0.0 && min < 0.0 ) this._Min = 0.0 ;
        else                            this._Min = min ;
      }
      if ( this._Max != 0.0 )
      {
        var max = Math.floor ( ( this._Max + this._DTic ) / this._DTic ) * this._DTic ;
        if  ( this._Max < 0.0 && max > 0.0 ) this._Max = 0.0 ;
        else                            this._Max = max ;
      }
    }

    this._Width = this._Max - this._Min ;
    
    this._NumberOfTics = Math.floor ( this._Width / this._DTic ) ;
  },
  toString: function()
  {
    var sb = "" ;
    sb += "(" ;
    sb += "PlotAxisValues" ;
    sb += ")" ;
    sb += "\n  _Min: " ; sb += this._Min ;
    sb += "\n  _Max: " ; sb += this._Max ;
    sb += "\n  _Width: " ; sb += this._Width ;
    sb += "\n  _DTic: " ; sb += this._DTic ;
    sb += "\n  _NumberOfTics: " ; sb += this._NumberOfTics ;
    sb += "\n" ;
    if ( this._ND )
    {
      sb += "Normalized value: " ;
      sb += this._ND.toString() ;
      sb += "\n" ;
    }
    return sb ;
  }
}
NormalizedDifference = function ( min, max, nTrailingDigits )
{
  this._Exponent = 0 ;
  this._Diff = 0 ;
  this._Value = 0 ;
  this._Min = 0 ;
  this._Max = 0 ;
  this.normalize ( min, max, nTrailingDigits ) ;
}
NormalizedDifference.prototype =
{
  getExponent: function() { return this._Exponent ; },
  getDiff: function() { return this._Diff ; },
  getValue: function() { return this._Value ; },
  getMin: function() { return this._Min ; },
  getMax: function() { return this._Max ; },
  toString: function()
  {
    return "" + this._Value + "E" + this._Exponent ;
  },
  normalize: function ( min, max, nTrailingDigits )
  {
    this._Min = min ;
    this._Max = max ;
    if ( nTrailingDigits < 0 ) nTrailingDigits = 3 ;

    this._Diff = max - min ;

    this._Value = this._Diff ;
    var d = this._Value ;

    if ( d == 0 )
    {
    }
    else
    if ( d >= 1.0 )
    {
      this._Exponent = 0 ;
      while ( this._Value > 10.0 )
      {
        this._Value /= 10 ;
        this._Exponent++ ;
      } 
    }
    else
    if ( d > 0 )
    {
      this._Exponent = 0 ;
      while ( this._Value < 1.0 )
      {
        this._Value *= 10 ;
        this._Exponent-- ;
      }
    }
    if ( nTrailingDigits > 0 )
    {
      var m = Math.pow ( 10.0, nTrailingDigits ) ;
      this._Exponent -= nTrailingDigits ;
      this._Value = Math.floor ( this._Value * m ) ;
    }
  }
}
/**
 *  @constructor
 *  @extends Timeline
 */
var CanvasRequestsPerSecond = function ( domXml )
{
  Tango.initSuper ( this, Timeline, domXml );
  this.jsClassName = "CanvasRequestsPerSecond" ;
  this.ygrid = true ;
  this.ylog = true ;
  this.xaxis = true ;
  this.yaxis = true ;
}
CanvasRequestsPerSecond.inherits( Timeline ) ;
CanvasRequestsPerSecond.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  Timeline.prototype.layout.apply ( this, arguments ) ;
}
CanvasRequestsPerSecond.prototype.resized = function ( e )
{
  Timeline.prototype.resized.apply ( this, arguments ) ;
}
CanvasRequestsPerSecond.prototype.nextValue = function ( count )
{
  count = count.roundTo ( 2 ) ;
  this.setXText ( "" + count ) ;
  this.addValue ( count ) ;
}
/**
 *  @constructor
 *  @extends Timeline
 */
var CanvasStepsPerSecond = function ( domXml )
{
  Tango.initSuper ( this, Timeline, domXml );
  this.jsClassName = "CanvasStepsPerSecond" ;
  this.ygrid = true ;
  this.xaxis = true ;
  this.yaxis = true ;
}
CanvasStepsPerSecond.inherits( Timeline ) ;
CanvasStepsPerSecond.prototype.nextValue = function ( count )
{
  count = count.roundTo ( 2 ) ;
  this.setXText ( "" + count ) ;
  this.addValue ( count ) ;
}
/**
 *  @constructor
 *  @extends Timeline
 */
var CanvasAverageTaskTime = function ( domXml )
{
  Tango.initSuper ( this, Timeline, domXml );
  this.jsClassName = "CanvasAverageTaskTime" ;
  this.ygrid = true ;
  this.xaxis = true ;
  this.yaxis = true ;
}
CanvasAverageTaskTime.inherits( Timeline ) ;
CanvasAverageTaskTime.prototype.nextValue = function ( count )
{
  count = count.roundTo ( 3 ) ;
  this.setXText ( "" + count + " ( msec )" ) ;
  this.addValue ( count ) ;
}
/**
 *  @constructor
 *  @extends Timeline
 */
var CanvasAverageMB = function ( domXml )
{
  Tango.initSuper ( this, Timeline, domXml );
  this.jsClassName = "CanvasAverageMB" ;
  this.ygrid = true ;
  this.xaxis = true ;
  this.yaxis = true ;
}
CanvasAverageMB.inherits( Timeline ) ;
CanvasAverageMB.prototype.nextValue = function ( count )
{
//  count = count.roundTo ( 3 ) ;
//  this.setXText ( "" + count + " ( msec )" ) ;
//  this.addValue ( count ) ;
}
