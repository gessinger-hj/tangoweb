Tango.include ( "TSystem" ) ;
Tango.include ( "TUtil" ) ;

var GameSailboat = function()
{
  this.x0 = 0 ;
  this.y0 = 100 ;
  this.img = null ;
  this.timer = null ;
  this.imgWidth = 20 ;
  this.imgHeight = 22 ;
  this.dx = 1 ;
  this.dy = this.imgHeight ;
};
GameSailboat.prototype =
{
  start: function()
  {
    this.img = document.createElement ( "img" ) ;
    this.img.src = "img/sailboat.gif" ;
    this.img.padding = "0px" ;
    this.img.margin = "0px" ;
    var body = document.getElementsByTagName ( "body" )[0] ;
    body.appendChild ( this.img ) ;
    this.img.style.position = "absolute" ;
    this.img.style.top = this.y0 + "px" ;
    this.img.style.left = this.x0 + "px" ;
    this.img.style.zIndex = "64100" ;

    var self = this ; 
    this.timer = new TTimer ( 50, function()
    {
      var xx = self.img.offsetLeft ;
      var yy = self.img.offsetTop ;
      var browserWindowSize = TGui.getBrowserWindowSize() ;
      if ( xx + self.imgWidth + self.dx >= browserWindowSize.width )
      {
        self.dx = - self.dx ;
        self.img.src = "img/sailboat-left.gif" ;
        yy += self.dy ;
      }
      else
      if ( xx + self.dx <= 0 )
      {
        self.dx = - self.dx ;
        self.img.src = "img/sailboat.gif" ;
        yy += self.dy ;
      }
      if ( yy + self.imgHeight >= browserWindowSize.height )
      {
        self.dy = - self.dy ;
        yy = browserWindowSize.height - self.imgHeight ;
      }
      else
      if ( yy <= this.y0 )
      {
        self.dy = - self.dy ;
        yy = self.y0 ;
      }
      xx += self.dx ;
      self.img.style.left = xx + "px" ;
      self.img.style.top = yy + "px" ;
    } ) ;
    this.timer.start() ;
  },
  stop: function()
  {
    if ( this.timer ) this.timer.stop() ;
    if ( this.img )
    {
      var body = document.getElementsByTagName ( "body" )[0] ;
      body.removeChild ( this.img ) ;
    }
  }
} ;
