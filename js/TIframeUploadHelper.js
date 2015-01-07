var TIframeUploadHelperClass = function()
{
  this.themeName = null ;
} ;
TIframeUploadHelperClass.prototype.callback = function ( context )
{
  if ( window.parent.document.TIframeUploadHelper_callback )
  {
    window.parent.document.TIframeUploadHelper_callback ( context ) ;
  }
  return ;
} ;
TIframeUploadHelperClass.prototype.onload = function ( themeName )
{
  var wc = TSys.getWebConfig() ;
  TSys.setTheme ( themeName ) ;
TSys.createLOG = true ;
  var b = document.getElementsByTagName ( 'body' )[0] ;
  b.className = "ThemeBody" ;
  if ( window.parent.document.TIframeUploadHelper_callback )
  {
    window.parent.document.TIframeUploadHelper_callback ( "frame-onload", b ) ;
  }
}
var TIframeUploadHelper = new TIframeUploadHelperClass() ;
