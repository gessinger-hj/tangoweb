// ---------------- UserDialog: ask, info, ... ----------------
var _TDialogChangePassword_Initialized = false ;
var TDialogChangePassword = function()
{
  if ( ! _TDialogChangePassword_Initialized )
  {
    _TDialogChangePassword_Initialized = true ;
    TSys.addDefaultLocalizedMessages ( "de", "ChangePassword", "Passwort &auml;ndern" ) ;
    TSys.addDefaultLocalizedMessages ( "de", "OldPassword", "Altes Passwort" ) ;
    TSys.addDefaultLocalizedMessages ( "de", "NewPassword", "Neues Passwort" ) ;
    TSys.addDefaultLocalizedMessages ( "de", "PasswordVerification", "Passwortbest\u00E4tigung" ) ;

    TSys.addDefaultLocalizedMessages ( "en", "ChangePassword", "Change password" ) ;
    TSys.addDefaultLocalizedMessages ( "en", "OldPassword", "Old Password" ) ;
    TSys.addDefaultLocalizedMessages ( "en", "NewPassword", "New Password" ) ;
    TSys.addDefaultLocalizedMessages ( "en", "PasswordVerification", "Password - verification" ) ;
  }
  this.title = TSys.translate ( "ChangePassword", "Change password..." ) ;
  this.userFunction = null ;
}
TDialogChangePassword.prototype.setTitle = function ( title )
{
  this.title = TSys.translate ( title, this.title ) ;
}
TDialogChangePassword.prototype.setValidator = function ( validator )
{
  this.validator = validator ;
}
TDialogChangePassword.prototype.getValidator = function()
{
  if ( this.validator ) return this.validator ;
  this.validator = TSys.getPasswordValidator() ;
  return this.validator ;
}
TDialogChangePassword.prototype.getMinimumLength = function()
{
  this.getValidator().getMinimumLength() ;
}
TDialogChangePassword.prototype.show = function()
{
  var minLen = this.getMinimumLength() ;
  var t1 = TSys.translate ( "OldPassword" ) ;
  var t2 = TSys.translate ( "NewPassword" ) ;
  var t3 = TSys.translate ( "PasswordVerification" ) ;
  if ( minLen > 0 )
  {
    t2 += " ( min: " + minLen + " )" ;
    t3 += " ( min: " + minLen + " )" ;
  }
  var s = ""
  + "<xml>\n"
  + "<Dialog title='" + this.title + "' id='Dialog.Change.Password' >\n"
  + "<Container name='Form.Change.Password' right='-0' bottom='-0' >\n"
  + "  <DisplayContainer right='-4' bottom='-4' attachComponentBottom='true' onchange='handle:PB.Dialog.Change.Password' >\n"
  + "    <TextField odd='true' tabx='16' label='%OldPassword%:' name='PWD' right='-4' style='width:200px;' mandatory='" + t1 + "' type='password' />\n"
  + "    <br/>\n"
  + "    <TextField even='true' label='%NewPassword%:' name='PWD1' right='-4' style='width:200px;' mandatory='" + t2 + "' type='password' extendedType='password' note='javascript:TSys.getPasswordValidatorText()' />\n"
  + "    <br/>\n"
  + "    <TextField odd='true' label='%PasswordVerification%:' name='PWD2' right='-4' style='width:200px;' mandatory='" + t3 + "' type='password' />\n"
  + "  </DisplayContainer>\n"
  + "  <br/>\n"
  + "  <Container right='0' bottom='0' style='margin:0px;padding-right:0px;' >\n"
  + "    <PushButton disabled='true' id='PB.Dialog.Change.Password' img='img/save-16x16.gif' text='%Apply%'/>\n"
  + "    <PushButton img='img/Icon.RedCross.gif' text='%Cancel%' onclick='TGui.closeTopWindow(event)' />\n"
  + "  </Container>\n"
  + "</Container>\n"
  + "</Dialog>\n"
  + "</xml>\n"
  ;

  try
  {
    var dom = TSys.parseDom ( s ) ;
    this.d = new TWindow ( dom ) ;

    this.d.create() ;
    var dBody = new TXml ( this.d.getBody() ) ;
    var button = dBody.getDomById ( "PB.Dialog.Change.Password" ) ;
    TGui.addEventListener ( button, "click", this.apply.bindAsEventListener ( this ) ) ;
    this.d.show() ;
  }
  catch ( exc )
  {
    log ( exc ) ;
  }
}
TDialogChangePassword.prototype.close = function ( event )
{
  this.d.close() ;
  this.d = null ;
}
TDialogChangePassword.prototype.apply = function ( event )
{
  var ev = new TEvent ( event ) ;
  var xCont = ev.getXml() ;
  var mTextList = xCont.getMandatoryText() ;
  if ( mTextList.length > 0 )
  {
    var t = TSys.translate ( "TheFollowingFieldsAreMandatory" ) + ":<br/>" + mTextList.join ( "<br/>" ) ;
    var dUserDialog = new TUserDialog ( t ) ;
    dUserDialog.error() ;
    return ;
  }
  var vals = xCont.getValues() ;
  var pwd = vals.getContent ( "PWD" ) ;
  var pwd1 = vals.getContent ( "PWD1" ) ;
  var pwd2 = vals.getContent ( "PWD2" ) ;
  if ( pwd1 != pwd2 )
  {
    var dUserDialog = new TUserDialog ( "TheGivenPasswordsDoNotMatch" ) ;
    dUserDialog.error() ;
    return ;
  }
  if ( pwd1.length < this.getMinimumLength() )
  {
    var dUserDialog = new TUserDialog ( "NewPasswortTooShort" ) ;
    dUserDialog.error() ;
    return ;
  }
  if ( this.validator )
  {
    if ( ! this.validator.validate ( pwd1 ) )
    {
      var str = this.validator.getConstraints() ;
      if ( ! str ) str = "Invalid Password" ;
      var dUserDialog = new TUserDialog ( str ) ;
      dUserDialog.error() ;
      return ;
    }
  }
  var rc = TSys.changeOwnPassword ( pwd, pwd1 ) ;
  if ( rc == 200 )
  {
    this.close() ;
    var dUserDialog = new TUserDialog ( "PasswordChangedSuccessfully" ) ;
    dUserDialog.info() ;
  }
  else
  {
    this.close() ;
    var dUserDialog = new TUserDialog ( "InvalidOldPassword" ) ;
    dUserDialog.error() ;
  }
}
