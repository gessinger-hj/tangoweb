Tango.include ( "TFileChooser" ) ;
Tango.include ( "TDisplay" ) ;

var TFileChooserDownload = function ( path, rootPath, pattern )
{
  this.d = new TFileChooser ( path, pattern ) ;
  this.d.setFileActionCommand ( this, this.download ) ;
  this.d.setActionListener ( this, this.downloadApply ) ;
  this.d.setCloseOnApply ( false ) ;
  this.d.setModal ( false ) ;
  var str = TSys.translate ( "DownloadFiles" ) ;
  this.d.setTitle ( str + "..." ) ;
  this.d.setRootPath ( rootPath ) ;
  this.d.show() ;
}
TFileChooserDownload.prototype.download = function( event )
{
  var tab = event.getJsSource() ; 
  var eud = tab.getSelectedUserData() ;
  if ( !eud ) return ;
  var ud = new TXml ( eud ) ;
  var acd = new TDisplay() ;
  acd.downloadDocument ( ud, false ) ;
}
TFileChooserDownload.prototype.downloadApply = function( ev )
{
  var d = ev.getJsSource() ;
  var ud = d.getSelectedXml() ;
  if ( !ud ) return ;
  var acd = new TDisplay() ;
  acd.downloadDocument ( ud, false ) ;
}
