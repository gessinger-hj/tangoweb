var ImageStore = function()
{
  this._SlicedImages = {} ;
};
ImageStore.prototype.add = function ( src, top, left, bottom, right )
{
  // body...
};
SliceableImage = function ( src, top, left, bottom, right )
{
  var desc = null ;
  if ( typeof src === 'string' )
  {
    if ( src.indexOf ( '{' ) === 0 )
    {
      desc = JSON.parse ( src ) ;
    }
    else
    {
      this.src = src ; this.top = top ; this.left = left ; this.bottom = bottom ; this.right = right ;
    }
  }
  if ( typeof src === 'object' )
  {
    desc = src ;
  }
  if ( desc )
  {
    this.src = desc.src ; this.top = desc.top ; this.left = desc.left ; this.bottom = desc.bottom ; this.right = desc.right ;
  }
  this.name   = this.src ;
  this.top    = this.top ? this.top : 0 ;
  this.left   = this.left ? this.left : 0 ;
  this.bottom = this.bottom ? this.bottom : 0 ;
  this.right  = this.right ? this.right : 0 ;
  this.dataURLStore  = {} ;
};
SliceableImage.prototype.slice = function ( callback )
{
  this.img = new Image() ;
  var thiz = this ;
  this.img.onload = function ( event )
  {
    var canvas = document.createElement ( "canvas" ) ;
    document.body.appendChild ( canvas ) ;

    var width     = thiz.img.width ;
    var height    = thiz.img.height ;
    canvas.width  = width ;
    canvas.height = height ;
    var ctx       = canvas.getContext("2d");
    ctx.drawImage ( thiz.img, 0, 0 ) ;
    thiz._imgData_UL  = ctx.getImageData ( 0, 0, thiz.left, thiz.top ) ;
    thiz._imgData_TOP = ctx.getImageData ( thiz.left, 0, width - thiz.left - thiz.right, thiz.top ) ;
    thiz._imgData_UR  = ctx.getImageData ( width - thiz.right, 0, thiz.right, thiz.top ) ;
    thiz._imgData_L   = ctx.getImageData ( 0, thiz.top, thiz.left, height - thiz.top - thiz.bottom ) ;
    thiz._imgData_M   = ctx.getImageData ( thiz.left, thiz.top, width - thiz.left - thiz.right, height - thiz.top - thiz.bottom ) ;
    thiz._imgData_R   = ctx.getImageData ( width - thiz.right, thiz.top, thiz.right, height - thiz.top - thiz.bottom ) ;
    thiz._imgData_BL  = ctx.getImageData ( 0, height - thiz.bottom, thiz.left, thiz.bottom ) ;
    thiz._imgData_B   = ctx.getImageData ( thiz.left, height - thiz.bottom, width - thiz.left - thiz.right, thiz.bottom ) ;
    thiz._imgData_BR  = ctx.getImageData ( width - thiz.right, height - thiz.bottom, thiz.right, thiz.bottom ) ;
    canvas.parentNode.removeChild ( canvas ) ;

    thiz._img_UL  = thiz._createImageFromData ( thiz._imgData_UL, null, thiz.left, thiz.top ) ;
    thiz._img_TOP = thiz._createImageFromData ( thiz._imgData_TOP, null, width - thiz.left - thiz.right, thiz.top ) ;
    thiz._img_UR  = thiz._createImageFromData ( thiz._imgData_UR, null, thiz.right, thiz.top ) ;
    thiz._img_L   = thiz._createImageFromData ( thiz._imgData_L, null, thiz.left, height - thiz.top - thiz.bottom ) ;
    thiz._img_M   = thiz._createImageFromData ( thiz._imgData_M, null, width - thiz.left - thiz.right, height - thiz.top - thiz.bottom ) ;
    thiz._img_R   = thiz._createImageFromData ( thiz._imgData_R, null, thiz.right, height - thiz.top - thiz.bottom ) ;
    thiz._img_BL  = thiz._createImageFromData ( thiz._imgData_BL, null, thiz.left, thiz.bottom ) ;
    thiz._img_B   = thiz._createImageFromData ( thiz._imgData_B, null, width - thiz.left - thiz.right, thiz.bottom ) ;
    thiz._img_BR  = thiz._createImageFromData ( thiz._imgData_BR, callback, thiz.right, thiz.bottom ) ;
    return ;
  };
  this.img.src = this.src ;
};
SliceableImage.prototype._createImageFromData = function ( data, callback, width, height )
{
  // body...
  var c = document.createElement ( "canvas" ) ;
  document.body.appendChild ( c ) ;
  c.width = width ;
  c.height = height ;
  var ctx = c.getContext ( "2d" ) ;
  ctx.putImageData ( data, 0, 0 ) ;
  var dataURL = c.toDataURL() ;
  c.parentNode.removeChild ( c ) ;
  var img = new Image() ;
  var thiz = this ;
  img.onload = function()
  {
    if ( callback )
    {
      callback.call  ( thiz, img ) ;
    }
  };
  img.width = width ;
  img.height = height ;
  img.src = dataURL ;
  return img ;
};
SliceableImage.prototype.getDataURL = function ( target )
{
  var key = target.offsetWidth + "x" + target.offsetHeight ;
  var data = this.dataURLStore[key] ;
  if ( data )
  {
    return data ;
  }
  var canvas    = document.createElement ( "canvas" ) ;
  document.body.appendChild ( canvas ) ;
  canvas.width  = target.offsetWidth ;
  canvas.height = target.offsetHeight ;
  var ctx       = canvas.getContext("2d");
  ctx.drawImage ( this._img_UL, 0, 0 ) ;
  ctx.drawImage ( this._img_TOP, this.left, 0, target.offsetWidth - this.left - this.right, this.top ) ;
  ctx.drawImage ( this._img_UR, target.offsetWidth - this.left, 0 ) ;
  ctx.drawImage ( this._img_L, 0, this.top, this.left, target.offsetHeight - this.top - this.bottom ) ;
  ctx.drawImage ( this._img_M, this.left, this.top, target.offsetWidth - this.left - this.right, target.offsetHeight - this.top - this.bottom ) ;
  ctx.drawImage ( this._img_R, target.offsetWidth - this.right, this.top, this.right, target.offsetHeight - this.top - this.bottom ) ;
  ctx.drawImage ( this._img_BL, 0, target.offsetHeight - this.bottom ) ;
  ctx.drawImage ( this._img_B, this.left, target.offsetHeight - this.bottom, target.offsetWidth - this.left - this.right, this.bottom ) ;
  ctx.drawImage ( this._img_BR, target.offsetWidth - this.right, target.offsetHeight - this.bottom ) ;

  var data = canvas.toDataURL() ;
  canvas.parentNode.removeChild ( canvas ) ;
  this.dataURLStore[key] = data ;
  return data ;
};
SliceableImage.prototype.paint = function ( target )
{
  target.src = this.getDataURL ( target ) ;
};
