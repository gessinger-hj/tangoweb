Tango.include ( "TTable" ) ;
Tango.include ( "Calypso" ) ;
Tango.include ( "TFileChooser" ) ;
Tango.include ( "TDisplay" ) ;

function displayFileChooser(event)
{
  var d = new TFileChooser() ;
  d.setFileActionCommand ( displayFile ) ;
  d.setActionListener ( apply ) ;
  d.setModal ( false ) ;
  d.show() ;
}
function downloadFile ( event )
{
  var tab = event.getJsSource() ; 
  var eud = tab.getSelectedUserData() ;
  if ( !eud ) return ;
  var ud = new TXml ( eud ) ;
  var acd = new TDisplay() ;
  acd.downloadDocument ( ud, false ) ;
}
function apply ( ev )
{
  var d = ev.getJsSource() ;
  var ud = d.getSelectedXml() ;
  displayFileFromXml ( ud ) ;
}
function displayFile ( event )
{
  var tab = event.getJsSource() ; 
  var eud = tab.getSelectedUserData() ;
  if ( !eud ) return ;
  var ud = new TXml ( eud ) ;
  displayFileFromXml ( ud ) ;
}

function displayFileFromXml ( ud )
{
  if ( !ud ) return ;

  var NAME = ud.getContent ( "NAME" ).trim() ;
  var FULL_NAME = ud.getContent ( "DIR" ).trim() + "/" + NAME ;
  var isText = String ( ud.getAttribute ( "isText" ) ) == "true" ? true : false ;
  var mimeType = ud.getAttribute ( "mimeType" ) ;
  try
  {
    if ( mimeType.indexOf ( "text" ) == 0 || isText || TSys.isMimetypeText ( mimeType, NAME ) )
    {
      var acd = new TDisplay() ;
      acd.getDocument ( ud, function ( xml )
      {
        var t = xml.getContent ( "ACDISP.RESULT/Html" ) ;
        var form = document.getElementById ( "Form.Files.Display" ) ;
        form.innerHTML = t ;
      } ) ;
    }
    else
    if ( mimeType.indexOf ( "image" ) == 0 )
    {
      var acd = new TDisplay() ;
      var url = acd.getDocumentUrl ( ud ) ;
      var e = document.getElementById ( "Form.Files.Display" ) ;
      e.innerHTML = "<span><img src='" + url + "' /></span>" ;
    }
    else
    {
      var acd = new TDisplay() ;
      acd.downloadDocument ( ud, true ) ;
    }
  }
  catch ( exc )
  {
    var d = new TUserDialog ( String ( exc  ) ) ;
    d.info() ;
    throw exc ;
  }
}
