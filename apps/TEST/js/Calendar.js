Tango.include ( "TSystem" ) ;

Calendar = function ( dt )
{
  if ( ! dt ) this.date = new Date() ;
  else
  if ( TSys.isDate  ( td ) )
  {
    this.date = dt ;
  }
  else
  if ( typeof ( dt ) == 'number' )
  {
    this.date = new Date ( dt ) ;
  }
  else
  if ( typeof ( dt ) == 'string' )
  {
    this.date = DateUtils.parseDate ( dt ) ;
  }
  this.jsClassName        = "Calendar" ;
  this.newYearsEveFactor  = 0.5 ;
  this.christmasEveFactor = 0.5 ;
  this.hoursPerDay        = 8.0 ;
};

Calendar.prototype.AREAS                        = {} ;
Calendar.prototype.AREAS.GERMANY                = "GERMANY" ;
Calendar.prototype.AREAS.BADEN_WUERTTEMBERG     = "BADEN_WUERTTEMBERG" ;
Calendar.prototype.AREAS.BAYERN                 = "BAYERN" ;
Calendar.prototype.AREAS.BERLIN                 = "BERLIN" ;
Calendar.prototype.AREAS.BRANDENBURG            = "BRANDENBURG" ;
Calendar.prototype.AREAS.BREMEN                 = "BREMEN" ;
Calendar.prototype.AREAS.HAMBURG                = "HAMBURG" ;
Calendar.prototype.AREAS.HESSEN                 = "HESSEN" ;
Calendar.prototype.AREAS.MECKLENBURG_VORPOMMERN = "MECKLENBURG_VORPOMMERN" ;
Calendar.prototype.AREAS.NIEDERSACHSEN          = "NIEDERSACHSEN" ;
Calendar.prototype.AREAS.NORDRHEIN_WESTFALEN    = "NORDRHEIN_WESTFALEN" ;
Calendar.prototype.AREAS.RHEINLAND_PFALZ        = "RHEINLAND_PFALZ" ;
Calendar.prototype.AREAS.SAARLAND               = "SAARLAND" ;
Calendar.prototype.AREAS.SACHSEN                = "SACHSEN" ;
Calendar.prototype.AREAS.SACHSEN_ANHALT         = "SACHSEN_ANHALT" ;
Calendar.prototype.AREAS.SCHLESWIG_HOLSTEIN     = "SCHLESWIG_HOLSTEIN" ;
Calendar.prototype.AREAS.THUERINGEN             = "THUERINGEN" ;
Calendar.prototype.AREAS.AUSTRIA                = "AUSTRIA" ;
Calendar.prototype.AREAS.SCHWEIZ                = "SCHWEIZ" ;
Calendar.prototype.AREAS.FRANCE                 = "FRANCE" ;
Calendar.prototype.AREAS.UK                     = "UNITED_KINGDOM" ;
Calendar.prototype.AREAS.DEFAULT                = Calendar.prototype.AREAS.GERMANY ;

Calendar.prototype._VariableFreedays = null ;
Calendar.prototype._FixedFreedays = null ;

Calendar.prototype._initialize = function()
{
  if ( this._VariableFreedays )
  {
    return ;
  }
  this._FixedFreedays  = {} ;
  this._VariableFreedays = {} ;

  var BW = this.setGermanFreedays() ; //      Baden-Wuerttemberg
  var BY = this.setGermanFreedays() ; //      Bayern
  var BE = this.setGermanFreedays() ; //      Berlin
  var BB = this.setGermanFreedays() ; //      Brandenburg
  var HB = this.setGermanFreedays() ; //      Hansestadt Bremen
  var HH = this.setGermanFreedays() ; //      Hansestadt Hamburg
  var HE = this.setGermanFreedays() ; //      Hessen
  var MV = this.setGermanFreedays() ; //      Mecklenburg-Vorpommern
  var NI = this.setGermanFreedays() ; //      Niedersachsen
  var NW = this.setGermanFreedays() ; //      Nordrhein-Westfalen
  var RP = this.setGermanFreedays() ; //      Rheinland-Pfalz
  var SL = this.setGermanFreedays() ; //      Saarland
  var SN = this.setGermanFreedays() ; //      Sachsen
  var ST = this.setGermanFreedays() ; //      Sachsen-Anhalt
  var SH = this.setGermanFreedays() ; //      Schleswig-Holstein
  var TH = this.setGermanFreedays() ; //      Thueringen

  var DEF = this.setGermanFreedays() ;

  BW[0][5] = -1 ; //  6. Januar Heilige Drei Koenige
  BY[0][5] = -1 ; //  6. Januar Heilige Drei Koenige
  ST[0][5] = -1 ; //  6. Januar Heilige Drei Koenige

  SL[7][14] = -1 ; //  15. August Mariae Himmelfahrt

  BB[9][30] = -1 ; //  31. Oktober Reformationstag
  MV[9][30] = -1 ; //  31. Oktober Reformationstag
  SN[9][30] = -1 ; //  31. Oktober Reformationstag
  ST[9][30] = -1 ; //  31. Oktober Reformationstag
  TH[9][30] = -1 ; //  31. Oktober Reformationstag

  BW[10][0] = -1 ; //  1. November Allerheiligen
  BY[10][0] = -1 ; //  1. November Allerheiligen
  NW[10][0] = -1 ; //  1. November Allerheiligen
  RP[10][0] = -1 ; //  1. November Allerheiligen
  SL[10][0] = -1 ; //  1. November Allerheiligen
  SN[10][0] = -1 ; //  1. November Allerheiligen

  this._FixedFreedays [ this.AREAS.BADEN_WUERTTEMBERG ]     = BW ;
  this._FixedFreedays [ this.AREAS.BAYERN ]                 = BY ;
  this._FixedFreedays [ this.AREAS.BERLIN ]                 = BE ;
  this._FixedFreedays [ this.AREAS.BRANDENBURG ]            = BB ;
  this._FixedFreedays [ this.AREAS.BREMEN ]                 = HB ;
  this._FixedFreedays [ this.AREAS.HAMBURG ]                = HH ;
  this._FixedFreedays [ this.AREAS.HESSEN ]                 = HE ;
  this._FixedFreedays [ this.AREAS.MECKLENBURG_VORPOMMERN ] = MV ;
  this._FixedFreedays [ this.AREAS.NIEDERSACHSEN ]          = NI ;
  this._FixedFreedays [ this.AREAS.NORDRHEIN_WESTFALEN ]    = NW ;
  this._FixedFreedays [ this.AREAS.RHEINLAND_PFALZ ]        = RP ;
  this._FixedFreedays [ this.AREAS.SAARLAND ]               = SL ;
  this._FixedFreedays [ this.AREAS.SACHSEN ]                = SN ;
  this._FixedFreedays [ this.AREAS.SACHSEN_ANHALT ]         = ST ;
  this._FixedFreedays [ this.AREAS.SCHLESWIG_HOLSTEIN ]     = SH ;
  this._FixedFreedays [ this.AREAS.THUERINGEN ]             = TH ;
  this._FixedFreedays [ this.AREAS.DEFAULT ]                = DEF ;

  var i = 0 ;

  var AUS = [] ; //      AUSTRIA
  for ( i = 0 ; i < 12 ; i++ ) AUS[i] = [] ;

  AUS[0][0] = -1 ;   // 1. Januar
  AUS[0][5] = -1 ; //  6. Januar Heilige Drei Koenige
  AUS[4][0] = -1 ;   // 1. Mai / Staatsfeiertag
  AUS[7][14] = -1 ; //  15. August Mariae Himmelfahrt
  AUS[9][25] = -1 ; //  26. Oktober Nationalfeiertag
  AUS[10][0] = -1 ; //  1. November Allerheiligen
  AUS[11][7] = -1 ; //    8. Dezember Mariae Empfaengnis
  AUS[11][23] = -0.5 ; //    Heiligabend
  AUS[11][24] = -1 ; //    1. Weihnachtstag
  AUS[11][25] = -1 ; //    Stephanstag / 2. Weihnachtstag
  AUS[11][30] = -0.5 ; //    Silvester
  this._FixedFreedays [ this.AREAS.AUSTRIA ] = AUS ;

  var SCHW = [] ; //      SCHWEIZ
  for ( i = 0 ; i < 12 ; i++ ) SCHW[i] = [] ;
  SCHW[0][0] = -1 ;   // 1. Januar
  SCHW[7][1] = -1 ; //  1. August Nationalfeiertag
  SCHW[11][23] = -0.5 ; //    Heiligabend
  SCHW[11][24] = -1 ; //    1. Weihnachtstag
  SCHW[11][30] = -0.5 ; //    Silvester
  this._FixedFreedays [ this.AREAS.SCHWEIZ ] = SCHW ;

  var FRA = [] ; //      FRANCE
  for ( i = 0 ; i < 12 ; i++ ) FRA[i] = [] ;
  FRA[0][0] = -1 ;   // 1. Januar
  FRA[4][0] = -1 ;   // 1. Mai
  FRA[4][7] = -1 ; //  8. Mai / Tag des Sieges 1945
  FRA[6][14] = -1 ; //  14. Juli / Nationalfeiertag
  FRA[7][14] = -1 ; //  15. August Mariae Himmelfahrt
  FRA[10][0] = -1 ; //  1. November Allerheiligen
  FRA[10][10] = -1 ; //  11. November / Gedenktag 1914
  FRA[11][23] = -0.5 ; //    Heiligabend
  FRA[11][24] = -1 ; //    1. Weihnachtstag
  FRA[11][30] = -0.5 ; //    Silvester
  this._FixedFreedays [ this.AREAS.FRANCE ] = FRA ;

  var U = [] ; //      UK
  for ( i = 0 ; i < 12 ; i++ ) U[i] = [] ;
  U[0][0] = -1 ;   // 1. Januar
  U[4][0] = -1 ;   // 1. Mai

  U[4][29] = -1 ; //  30. Mai Springbank holiday ???
  U[7][29] = -1 ; //  29. August Summer bank holiday ???
  U[11][23] = -0.5 ; //    Heiligabend
  U[11][24] = -1 ; //    1. Weihnachtstag / Christmas day
  U[11][25] = -1 ; //    2. Weihnachtstag / Boxing day
  U[11][30] = -0.5 ; //    Silvester
  this._FixedFreedays [ this.AREAS.UK ] = U ;
};
Calendar.prototype.setChristmasEveFactor = function ( factor )
{
  this._initialize() ;
  this.christmasEveFactor = factor ;
  for ( var k in this._FixedFreedays )
  {
    var aa = this._FixedFreedays[k] ;
    aa[11][23] = - this.christmasEveFactor ;
  }
};
Calendar.prototype.setNewYearsEveFactor = function ( factor )
{
  this._initialize() ;
  this.newYearsEveFactor  = factor ;
  for ( var k in this._FixedFreedays )
  {
    var aa = this._FixedFreedays[k] ;
    aa[11][30] = - this.newYearsEveFactor ;
  }
};
Calendar.prototype.setHoursPerDay = function ( hoursPerDay )
{
  this._initialize() ;
  this.hoursPerDay = hoursPerDay ;
};
Calendar.prototype.getFixedFreedaysFor = function ( areaName )
{
  if ( ! this._FixedFreedays )
  {
    this._initialize() ;
  }
  var a = this._FixedFreedays[areaName] ;
  if ( a ) return a ;
  return this._FixedFreedays[this.AREAS.DEFAULT] ;
};
Calendar.prototype.getVariableFreedays = function ( areaName, year )
{
  if ( ! this._VariableFreedays )
  {
    this._initialize() ;
  }
  var variable = this._VariableFreedays[ areaName + ":" + year ] ;
  if ( ! variable )
  {
    variable = this.fillVariableFreedays ( areaName, year ) ;
    this._VariableFreedays[ areaName + ":" + year ] = variable ;
  }
  return variable ;
};
Calendar.prototype.calculateSpecificFreedays = function ( areaName, year )
{
  var XX = [] ;
  for ( var i = 0 ; i < 12 ; i++ ) XX[i] = [] ;
  if ( areaName === this.AREAS.SACHSEN )
  {
    var d = this.calculateBussUndBettag ( year ) ;
    var month = d.getMonth() ;
    var day   = d.getDate() - 1 ;
    XX[month][day] = -1 ;
  }
  return XX ;
};
Calendar.prototype.calculateBussUndBettag = function ( year )
{
  var start = new Date ( year, 11, 24, 0, 0, 0 ) ;
  var i =0 ;
  for ( i = 0 ; i < 40 ; i++ )
  {
    if ( start.getDay() === 0 )
    {
      break ;
    }
    start = DateUtils.addDay ( start, -1 ) ;
  }
  start = DateUtils.addDay ( start, - ( 7 * 4 ) ) ;
  for ( i = 0 ; i < 40 ; i++ )
  {
    if ( start.getDay() === 3 )
    {
      break ;
    }
    start = DateUtils.addDay ( start, -1 ) ;
  }
  //start = DateUtils.addDay ( start, -1 ) ;
  return start ;
};
Calendar.prototype.setGermanFreedays = function ( XX )
{
  if ( ! XX ) XX = [] ;
  for ( var i = 0 ; i < 12 ; i++ ) XX[i] = [] ;
  XX[0][0] = -1 ;   // 1. Januar
  XX[4][0] = -1 ;   // 1. Mai
  XX[9][2] = -1 ;   // 3. Oktober Deutschen Einheit
  XX[11][23] = -0.5 ; //    Heiligabend
  XX[11][24] = -1 ; //    1. Weihnachtstag
  XX[11][25] = -1 ; //    2. Weihnachtstag
  XX[11][30] = -0.5 ; //    Silvester
  return XX ;
};
Calendar.prototype.fillVariableFreedays = function ( areaName, year )
{
  var variable = [] ;
  for ( var i = 0 ; i < 12 ; i++ ) variable[i] = [] ;
  var ostern = this.getEasterAsMarchDay ( year ) ;

  var d = new Date ( year, 2, 1, 0, 0, 0 ) ;
  ostern -= 1 ;
  var month = 0 ;
  var day   = 0 ;

  if ( areaName === this.AREAS.FRANCE )
  {
    d = DateUtils.addDay ( d, ostern + 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Ostermontag

    d = DateUtils.addDay ( d, 38 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Christi Himmelfahrt

    d = DateUtils.addDay ( d, 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Pfingstmontag
  }
  else
  if ( areaName === this.AREAS.AUSTRIA )
  {
    d = DateUtils.addDay ( d, ostern + 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Ostermontag

    d = DateUtils.addDay ( d, 38 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Christi Himmelfahrt

    d = DateUtils.addDay ( d, 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Pfingstmontag

    d = DateUtils.addDay ( d, 10 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Fronleichnam 
  }
  else
  if ( areaName === this.AREAS.SCHWEIZ )
  {
    d = DateUtils.addDay ( d, ostern + 38 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Christi Himmelfahrt
  }
  else
  if ( areaName === this.AREAS.UK )
  {
    d = DateUtils.addDay ( d, ostern - 2 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Karfreitag

    d = DateUtils.addDay ( d, 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Ostermontag

    d = DateUtils.addDay ( d, 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Pfingstmontag
  }
  else
  {
    d = DateUtils.addDay ( d, ostern - 2 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Karfreitag

    d = DateUtils.addDay ( d, 2 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Ostersonntag

    d = DateUtils.addDay ( d, 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Ostermontag

    d = DateUtils.addDay ( d, 38 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Christi Himmelfahrt

    d = DateUtils.addDay ( d, 10 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Pfingstsonntag

    d = DateUtils.addDay ( d, 1 ) ;
    month = d.getMonth() ;
    day   = d.getDate() ;
    variable[month][day-1] = -1 ; // Pfingstmontag

    if ( ! ( areaName === this.AREAS.HAMBURG ) )
    {
      d = DateUtils.addDay ( d, 10 ) ;
      month = d.getMonth() ;
      day   = d.getDate() ;
      variable[month][day-1] = -1 ; // Fronleichnam 
    }
  }
  return variable ;
};
Calendar.prototype.getFreedays = function ( year, month, areaName )
{
    if ( ! areaName ) areaName = this.AREAS.DEFAULT ;
    var a = [] ;
    var fixed = this.getFixedFreedaysFor ( areaName ) ;
    var specific = this.calculateSpecificFreedays ( areaName, year ) ;
    var variable = this.getVariableFreedays ( areaName, year ) ;
    var j ;
    for ( j = 0 ; j < 31 ; j++ )
    {
      if ( typeof ( fixed[month][j] ) != 'undefined' && fixed[month][j] != 0 )
      {
        a[j] = fixed[month][j] ; //1 ;
      }
      else
      if ( typeof ( specific[month][j] ) != 'undefined' && specific[month][j] != 0 )
      {
        a[j] = specific[month][j] ; //1 ;
      }
      else
      if ( typeof ( variable[month][j] ) != 'undefined' && variable[month][j] != 0 )
      {
        a[j] = variable[month][j] ; //1 ;
      }
    }
    return a ;
};
Calendar.prototype.getEasterDate = function ( year )
{
  var easter = this.getEasterAsMarchDay ( year ) ;
  var ed = new Date ( year, 2, 1, 0, 0, 0 ) ;
  if ( easter > 31 )
  {
    easter -= 31 ;
    ed = DateUtils.addMonth ( ed, 1 ) ;
    ed.setDate ( easter ) ;
  }
  return ed ;
};
Calendar.prototype.getEasterAsMarchDay = function ( year )
{
  var a = year % 19 ;
  var b = year % 4 ;
  var c = year % 7 ;
  var H1 = Math.floor ( year / 100 ) ;
  var H2 = Math.floor ( year / 400 ) ;
  var q = 4 + H1 - H2 ;
  var m = 15 + H1 - H2 - ( ( 8 * H1 + 13 ) / 25 ) ;
  m = 15 + H1 - H2 - Math.floor ( ( 8 * H1 + 13 ) / 25 ) ;
  var d = ( 19 * a + m ) % 30 ;
  var e = ( 2 * b + 4 * c + 6 * d + q ) % 7 ;
  var march_day = 22 + d + e ;
  if ( march_day === 57 ) march_day = 50 ;
  if ( d === 28 && e === 6 && a > 10 ) march_day = 49 ;
  return march_day ;
};
Calendar.prototype.getBeweglicheFeiertage = function ( year )
{
  var h = new TXml() ;
  var item = null ;
  var ostern = this.getEasterAsMarchDay ( year ) ;

  var d = new Date ( year, 2, 1, 0, 0, 0 ) ;
  ostern -= 1 ;

  d  = DateUtils.addDay ( d, ostern - 46 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Aschermittwoch" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 43 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Gr\u00FCndonnerstag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 1 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Karfreitag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 2 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Ostersonntag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 1 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Ostermontag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 38 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Christi Himmelfahrt" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 10 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Pfingstsonntag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 1 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Pfingstmontag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d  = DateUtils.addDay ( d, 10 ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Fronleichnam" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  d = this.calculateBussUndBettag ( year ) ;
  item = h.add ( "item" ) ;
  item.addAttribute ( "name", "Bu&szlig; und Bettag" ) ;
  item.addAttribute ( "date", DateUtils.formatDate ( d, "yyyyMMdd" ) ) ;

  return h ;
};
Calendar.prototype.calculateNumberOfWorkingHours = function ( start, end, areaName, hoursPerDay )
{
  if ( ! start ) return 0 ;
  if ( ! end ) return 0 ;
  hoursPerDay = hoursPerDay ? hoursPerDay : this.hoursPerDay ;

  var start_time = start.getTime() / 1000 ;
  var end_time = end.getTime() / 1000 ;

  if ( end_time < start_time )
  {
    var s = start_time ;
    start_time = end_time ;
    end_time = s ;
  }

  var n = 0 ;
  var start_year  = start.getFullYear() ;
  var start_momth = start.getMonth() ;
  var start_day   = start.getDate() ;

  var end_year  = end.getFullYear() ;
  var end_momth = end.getMonth() ;
  var end_day   = end.getDate() ;

  var current = start ;

  if ( ! areaName ) areaName = this.AREAS.DEFAULT ;
  fixed = this.getFixedFreedaysFor ( areaName ) ;
  specific = this.calculateSpecificFreedays ( areaName, start_year ) ;
  while ( true )
  {
    var year      = current.getFullYear() ;
    var dayOfWeek = current.getDay() ;
    var month     = current.getMonth() ;
    var day       = current.getDate() ;

    if ( dayOfWeek == 0 || dayOfWeek == 6 ) //TODO: max / min ?
    {
      if (  end_year == current.getFullYear()
         && end_momth == current.getMonth()
         && end_day == current.getDate()
         )
      {
        break ;
      }
      current = DateUtils.addDay ( current, 1 ) ;
      continue ;
    }
    n += 1 ; //XXXXXXXXXXXXXXXX

    if ( year != start_year )
    {
      specific = this.calculateSpecificFreedays ( areaName, year ) ;
    }
    var variable = this.getVariableFreedays ( areaName, year ) ;

    var f = fixed[month][day-1] ;
    if ( ! f ) f = 0 ;
    var v = variable[month][day-1] ;
    if ( ! v ) v = 0 ;
    var s = specific[month][day-1] ;
    if ( ! s ) s = 0 ;
    if ( hoursPerDay >= 1 )
    {
      if ( f != 0 ) n += f ;
      else
      if ( v != 0 ) n += v ;
      else
      if ( s != 0 ) n += s ;
    }
    else
    {
      if ( f != 0 ) n += 1 ;
      else
      if ( v != 0 ) n += 1 ;
      else
      if ( s != 0 ) n += 1 ;
    }

    if (  end_year == current.getFullYear()
       && end_momth == current.getMonth()
       && end_day == current.getDate()
       )
    {
      break ;
    }
    current = DateUtils.addDay ( current, 1 ) ;
  }
  return hoursPerDay * n ;
}
