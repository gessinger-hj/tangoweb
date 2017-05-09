// Tango.include ( "TSystem" ) ;
// Tango.include ( "TComponents" ) ;
// Tango.include ( "TTable" ) ;
// Tango.include ( "TWindow" ) ;
// Tango.include ( "TUtil" ) ;
// Tango.include ( "TPlot" ) ;
// Tango.include ( "TTagDefinitions" ) ;
// Tango.include ( "Admin" ) ;

var EOI = [ "http://www.turnofftheinternet.com/"
          , "http://www.fh.net/"
          , "http://www.tribbs.co.uk/end_of_the_internet.php"
          , "http://www.turnofftheinternet.com/shutdown.html"
          , "http://www.simpleliving.net/theend.asp"
          , "http://webnme.com/endoftheinternet.html"
          , "http://www.theendoftheinternet.com/"
          , "http://www.wwwdotcom.com/"
          , "http://www.weirdity.com/internet/eoti.html"
          , "http://n.ethz.ch/~stadleja/"
          , "http://mdesmond.com/end-of-the-internet/"
          , "http://www.shibumi.org/eoti.htm"
          , "http://www.endofthe.net/"
          , "http://www.endofworld.net/"
          , "http://endofthenet.net/"

          , "http://www.1112.net/lastpage.html"
          , "http://hmpg.net/"
          , "http://www.slutet.se/"
          , "http://www.w3schools.com/html/lastpage.htm"
          ] ;
function logout()
{
  TSys.logout() ;
  var r = Math.random() ;
  r *= ( EOI.length - 1 ) ;
  r = Math.round ( r ) ;
  if ( r >= EOI.length ) r = EOI.length - 1 ;
  location.href  = EOI[r] ;
}
function initialize(host,port)
{
  TSys.setApplicationName ( "ADMIN" ) ;
  TSys.createLOG = true ;
  TSys.showNativeErrors = true ;
//  try
//  {
    TGui.renderStartPage() ;
    Admin.setHostPort ( host, port ) ;
    login() ;
//  }
//  catch ( exc )
//  {
//    TSys.log ( "initialize(): " + exc ) ;
//    alert ( "Leider konnte die Anwendung nicht richtig\ninitialisiert werden." ) ;
//    throw exc ;
//  }
}
function login()
{
  var uid = "guest" ;
  var pwd = "guest" ;
  var status = TSys.login ( uid, pwd ) ;
  if ( status != 200 )
  {
    return ;
  }
  var u = TSys.getUser() ;
}
