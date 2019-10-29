Tango.include ( "TSystem" ) ;
Tango.include ( "Calendar" ) ;

CalendarApp = function()
{
  this._cal = new Calendar() ;
  this._cal.setChristmasEveFactor ( 1 ) ;
  this._cal.setNewYearsEveFactor ( 1 ) ;
  this._cal.setHoursPerDay ( 8.5 ) ;
};
CalendarApp.prototype.getEasterDate = function ( year )
{
log ( "year=" + year ) ;
  var easter = this._cal.getEasterDate ( year ) ;
log ( "easter=" + easter ) ;
};
CalendarApp.prototype.getBeweglicheFeiertage = function ( year )
{
log ( "year=" + year ) ;
  var x = this._cal.getBeweglicheFeiertage ( year ) ;
log ( x ) ;
};
CalendarApp.prototype.getFreedays = function ( year, month )
{
log ( "year=" + year ) ;
log ( "month=" + month ) ;
  var x = this._cal.getFreedays ( year, month, this._cal.SACHSEN ) ;
log ( "==============================" ) ;
log ( x ) ;
};
CalendarApp.prototype.calculateNumberOfWorkingHours = function ( year, month )
{
  var start = new Date ( 2013, 11, 1 ) ;
  var end = new Date ( 2013, 11, 31 ) ;
log ( "start=" + start ) ;
log ( "end=" + end ) ;
  var n = this._cal.calculateNumberOfWorkingHours ( start, end, null ) ;
log ( "n=" + n ) ;
};
CalendarApp.prototype.calculateFromCalendars = function ( event )
{
  var ev = new TEvent ( event ) ;
  var c = ev.getContainer() ;
  var cSTART = c.getComponent ( "START" ) ;
  var cEND   = c.getComponent ( "END" ) ;
  var start = cSTART.getDate() ;
  var end = cEND.getDate() ;
  if ( start.getTime() > end.getTime() )
  {
    end = start ;
    cEND.setTime ( end ) ;
  }
  var n = this._cal.calculateNumberOfWorkingHours ( start, end, null ) ;
  var cNOWH = c.getComponent ( "NOWH" ) ;
  cNOWH.setText ( n ) ;

  var n1 = this._cal.calculateNumberOfWorkingHours ( start, end, null, 1 ) ;
  var cNOWD = c.getComponent ( "NOWD" ) ;
  cNOWD.setText ( n1 ) ;
};
CalendarApp.prototype.areaChanged = function ( event )
{
  var ev = new TEvent ( event ) ;
  var v = ev.getValues() ;
  var areaName = v.getContent ( "areaName" ) ;
  var c = ev.getContainer() ;
  var cSTART = c.getComponent ( "START" ) ;
  var cEND   = c.getComponent ( "END" ) ;
  var start = cSTART.getVisibleDate() ;
  var end = cEND.getVisibleDate() ;
  Calendar.prototype.AREAS.DEFAULT = areaName ;
  cSTART.setVisibleDate ( start ) ;
  cEND.setVisibleDate ( end ) ;
};
CalendarApp.prototype.onopen = function ( event )
{
  try
  {
    var xml = TSys.getUserXml ( "CalendarApp.xml" ) ;
    this._cal.christmasEveFactor = xml.getFloat ( "christmasEveFactor", 1 ) ;
    this._cal.newYearsEveFactor = xml.getFloat ( "newYearsEveFactor", 1 ) ;
    this._cal.setHoursPerDay ( xml.getFloat ( "hoursPerDay", 8.5 ) ) ;
  }
  catch ( exc )
  {
    // log ( exc ) ;
  }
};
CalendarApp.prototype.onclose = function ( event )
{
  var xml = new TXml() ;
  xml.add ( "christmasEveFactor", this._cal.newYearsEveFactor ) ;
  xml.add ( "newYearsEveFactor", this._cal.newYearsEveFactor ) ;
  xml.add ( "hoursPerDay", this._cal.hoursPerDay ) ;
  TSys.saveUserXml ( "CalendarApp.xml", xml ) ;
};
