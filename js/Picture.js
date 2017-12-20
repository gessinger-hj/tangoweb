Tango.include ( "TComponents" ) ;
Tango.include ( "Txml" ) ;
/**
 *  @constructor
 */
var PictureFactoryClass = function()
{
  this.currentPeer = null ;
  this.str = "<xml><img /></xml>" ;
}
PictureFactoryClass.prototype =
{
  getAxl: function ( dom )
  {
    var xml = new TXml ( dom ) ;
    var axl = new TXml ( TSys.parseDom ( this.str ) ) ;

    var id      = xml.getAttribute ( "id" ) ;
    var name    = xml.getAttribute ( "name" ) ;
    var style   = xml.getAttribute ( "style", "" ) ;
    var tooltip = xml.getAttribute ( "tooltip" ) ;
    var onclick = xml.getAttribute ( "onclick" ) ;
    var name    = xml.getAttribute ( "name" ) ;
    var src     = xml.getAttribute ( "src" ) ;

    this.currentPeer = new Picture ( xml ) ;
    var img          = axl.getXml ( "img" ) ;

    if ( id ) img.addAttribute ( "id", id ) ;
    if ( name ) img.addAttribute ( "name", name ) ;
    if ( onclick ) img.addAttribute ( "onclick", onclick ) ;
    if ( style ) img.addAttribute ( "xstyle", style ) ;
    if ( tooltip ) img.addAttribute ( "tooltip", tooltip ) ;
    if ( src ) img.addAttribute ( "src", src ) ;
    return axl.getDom() ;
  },
  getPeer: function()
  {
    return this.currentPeer ;
  }
}
var PictureFactory = new PictureFactoryClass() ;
TGui.addTagDefinition ( "Picture", PictureFactory ) ;
/**
 *  @constructor
 *  @extends TComponent
 */
var Picture = function ( idOrElementOrXml )
{
  var xml = null ;
  if ( idOrElementOrXml instanceof TXml )
  { 
    Tango.initSuper( this, TComponent );
    xml = idOrElementOrXml ;
  }
  else
  {
    if ( typeof idOrElementOrXml === 'string ')
    {
      idOrElementOrXml = document.getElementById ( idOrElementOrXml ) ;
    }
    Tango.initSuper( this, TComponent, idOrElementOrXml );
  }
  this.jsClassName = "Picture" ;
  this.originalSize = new TDimension ( 0, 0 ) ;
  if ( typeof idOrElementOrXml === 'object' )
  {
    this.dom = idOrElementOrXml ;
    this.dom.jsPeer = this ;
  }
  this.zoomFactor = 1.0 ;
  this._fitInParent = false ;
  Tango.mixin ( EventMulticasterTrait, this ) ;
};
Picture.inherits( TComponent ) ;
Picture.prototype.toString = function()
{
  return "(" + this.jsClassName + ")[name=" + this.getName() + "]" ;
}
Picture.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  this.dom.xClassName = "Picture" ;
  var s = "" ;
}
Picture.prototype.resized = function()
{
  if ( !this._fitInParent ) return ;
  this.fitInParent();
}
Picture.prototype.setUrl = function ( url )
{
  if ( !this.dom )
  {
    this.dom = document.createElement ( "img" ) ;
  }
  var dom  = document.createElement ( "img" ) ;
  var p    = this.dom.parentNode ;
  p.replaceChild ( dom, this.dom ) ;
  var name = this.getName() ;
  this.dom = dom ;
  this.setName ( name ) ;
  var thiz = this ;
  this.addEventListener ( "load", function(e) {
    thiz.originalSize = thiz.getSize() ;
    thiz.zoomFactor = 1.0 ;
    if ( thiz._fitInParent )
    {
      thiz.fitInParent() ;
    }
    thiz.emit ( "load" ) ;
  });
  this.dom.jsPeer = this ;
  this.dom.src = url ;
  var thiz = this ;
}
Picture.prototype.setValue = function ( v )
{
  var url = v.getContent ( this.getName() + "/src" ) ;
  if ( url )
  {
    this.setUrl ( url ) ;
  }
}
Picture.prototype.fitInParent = function()
{
  if ( !this.dom ) return ;
  var p = this.getParent() ;
  var containerSize         = p.getSize() ;
  var imgSize               = new TDimension ( this.dom.width, this.dom.height ) ;
  var resultSize            = this.scaleProportional ( containerSize, this.originalSize ) ;
  this.setSize ( resultSize ) ;
  this.zoomFactor = resultSize.width / this.originalSize.width ;
  this._fitInParent = true ;
};
Picture.prototype.zoom100 = function()
{
  this.zoomFactor = 1.0 ;
  this.setSize ( this.originalSize ) ;
};
Picture.prototype.getZoomInPercent = function()
{
  return Math.floor ( this.zoomFactor * 100 ) ;
}
Picture.prototype.zoomMinus = function()
{
  this.zoomFactor = this.zoomFactor - 0.1 ;
  if ( this.zoomFactor < 0.1 ) this.zoomFactor = 0.1 ;
  var percent = Math.floor ( this.zoomFactor * 100 ) ;
  this.zoomPercent ( percent ) ;
};
Picture.prototype.zoomPlus = function()
{
  this.zoomFactor = this.zoomFactor + 0.1 ;
  if ( this.zoomFactor < 0.1 ) this.zoomFactor = 0.1 ;
  var percent = Math.floor ( this.zoomFactor * 100 ) ;
  this.zoomPercent ( percent ) ;
};
Picture.prototype.zoomPercent = function ( percent )
{
  if ( percent < 1 ) percent = 1 ;
  if ( percent > 1800 ) percent = 1800 ;
  this.zoomFactor = percent / 100 ;
  var nusize = new TDimension ( Math.floor ( this.originalSize.width * this.zoomFactor ), Math.floor ( this.originalSize.height * this.zoomFactor ) ) ;
  this.setSize ( nusize ) ;
};
Picture.prototype.setSize = function ( width, height )
{
  this._fitInParent = false ;
  if ( width instanceof TDimension )
  {
    this.dom.style.width  = width.width + "px" ;
    this.dom.style.height = width.height + "px" ;
  }
  else
  {
    this.dom.style.width  = width + "px" ;
    this.dom.style.height = height + "px" ;
  }
};
Picture.prototype.scaleProportional = function ( containerSize, imgSize )
{
  var width = containerSize.width ;
  var height = containerSize.height ;
  var w = imgSize.width ;
  var h = imgSize.height ;

  if (  w > width || h > height )
  {
    var newW = w ;
    var newH = h ;

    var orgRatio = w / h ;

    if ( width < w )
    {
      newW = width ;
      newH = newW / orgRatio ;
    }

    if ( height < newH )
    {
      newH = height ;
      newW = newH * orgRatio ;
    }
    w = newW ;
    h = newH ;
  }
  return new TDimension ( Math.floor ( w ), Math.floor ( h ) ) ;
}
