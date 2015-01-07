Tango.include ( "TComponents" ) ;
Tango.include ( "TUtil" ) ;
/**
 *  Global singleton <b>TTagDefinitions</b>
 *  @constructor
 */
var TTagDefinitionsClass = function()
{
  this._installed = false ;
  this.install() ;
}
TTagDefinitionsClass.prototype.install = function()
{
  if ( this._installed ) return ;
} ;
var TTagDefinitions = new TTagDefinitionsClass() ;
/**
 *  @constructor
 */
var LLabel = function()
{
  this.i = 0 ;
  this.axl = null ;
  this.style = 'right:-16;attach-right:false;'
  this.str = "<xml><ListLabel /><tab name='T1' /><Label getValue='true' reset='true' /><Label text='*' style='color:red;right:0px;' /></xml>" ;
}
LLabel.prototype =
{
  toString: function()
  {
    return "this.mandatoryStyle: " + this.mandatoryStyle ;
  },
  flush: function()
  {
  },
  getPeer: function()
  {
    return null ;
  },
  getAxl: function ( dom )
  {
    var x = new TXml ( dom ) ;
    var name = x.getAttribute ( "name" ) ;
    var mandatory = x.getAttribute ( "mandatory" ) ;
    var text = x.getAttribute ( "text" ) ;
    var path = x.getAttribute ( "path" ) ;

    this.i++ ;
    if ( this.axl )
    {
      this.listLabelElem.addAttribute ( "text", text ) ;
      this.labelElem.addAttribute ( "name", name ) ;
      this.labelElem.addAttribute ( "id", "ID-" + this.i ) ;
      if ( mandatory )
      {
        this.labelElem.addAttribute ( "class", "ThemeLabelMandatory" ) ;
        this.labelElem.addAttribute ( "mandatory", "true" ) ;
        this.labelElem2.addAttribute ( "text", "*" ) ;
      }
      else
      {
        this.labelElem.addAttribute ( "class", "ThemeLabelNormal" ) ;
        this.labelElem.addAttribute ( "mandatory", "false" ) ;
        this.labelElem2.addAttribute ( "text", "&nbsp;" ) ;
      }
      if ( path ) this.labelElem.addAttribute ( "path", path ) ;
      else        this.labelElem.addAttribute ( "path", "" ) ;
      return this.axl.getDom() ;
    }
    this.axl = new TXml ( TSys.parseDom ( this.str ) ) ;
    this.listLabelElem = this.axl.getXml ( "ListLabel" ) ;
    this.labelElem = this.axl.getXml ( "Label" ) ;
    this.labelElem.addAttribute ( "id", "ID-" + this.i ) ;
    this.labelElem2 = this.axl.getXml ( "Label[2]" ) ;
    this.listLabelElem.addAttribute ( "text", text ) ;
    this.labelElem.addAttribute ( "name", name ) ;
    this.labelElem.addAttribute ( "style", this.style ) ;
    if ( mandatory )
    {
      this.labelElem.addAttribute ( "class", "ThemeLabelMandatory" ) ;
      this.labelElem.addAttribute ( "mandatory", "true" ) ;
    }
    else
    {
      this.labelElem.addAttribute ( "class", "ThemeLabelNormal" ) ;
      this.labelElem.addAttribute ( "mandatory", "false" ) ;
    }
    if ( path ) this.labelElem.addAttribute ( "path", path ) ;
    else        this.labelElem.addAttribute ( "path", "" ) ;
    return this.axl.getDom() ;
  }
}
/**
 *  @constructor
 */
var ImageContainerFactoryClass = function()
{
  this.iconId = TSys.getTempId() ;
  this.width = 400 ;
  this.height = 400 ;
  this.str = "<xml><Container /></xml>" ;
/*
<ImageContainer id='IMAGE.CONTAINER.2' style='padding:0px;width:400px;height:400px;background-color:white;' >
*/
}
ImageContainerFactoryClass.prototype =
{
  getAxl: function ( dom )
  {
    var xml = new TXml ( dom ) ;
    var axl = new TXml ( TSys.parseDom ( this.str ) ) ;
    var c = axl.getXml ( "Container" ) ;

    var id = xml.getAttribute ( "id" ) ;
    var dragsource = xml.getAttribute ( "dragsource" ) ;
    var droptarget = xml.getAttribute ( "droptarget" ) ;
    var name = xml.getAttribute ( "name" ) ;
    var src = xml.getAttribute ( "src" ) ;
    var style = xml.getAttribute ( "style" ) ;
    var fitTo = xml.getAttribute ( "fit-to" ) ;
    var position = xml.getAttribute ( "position" ) ;
    var width = this.width ;
    var height = this.height ;
    var top = -1 ;
    var left = -1 ;
    var bg = null ;
    if ( style )
    {
      var aResult = null ;
      aResult = TGui.parseStyle ( style, "width" ) ;
      if ( aResult )
      {
        style = aResult[0] ;
        width = parseInt ( aResult[1] ) ;
        if ( isNaN ( width ) || width < 100 ) width = this.width ;
      }
      aResult = TGui.parseStyle ( style, "height" ) ;
      if ( aResult )
      {
        style = aResult[0] ;
        height = parseInt ( aResult[1] ) ;
        if ( isNaN ( height ) || height < 100 ) height = this.height ;
      }
/*
      aResult = TGui.parseStyle ( style, "top" ) ;
      if ( aResult )
      {
        style = aResult[0] ;
        top = parseInt ( aResult[1] ) ;
        if ( isNaN ( top ) ) top = -1 ;
      }
      aResult = TGui.parseStyle ( style, "left" ) ;
      if ( aResult )
      {
        style = aResult[0] ;
        left = parseInt ( aResult[1] ) ;
        if ( isNaN ( left ) ) left = -1 ;
      }
*/
      aResult = TGui.parseStyle ( style, "background-color" ) ;
      if ( aResult )
      {
        style = aResult[0] ;
        bg = aResult[1] ;
      }
    }
    style = 'overflow:hidden;padding:0px;width:' + width + 'px;height:' + height + 'px;' + style ;
//    if ( top >= 0 ) style += 'top:' + top + 'px;' ;
//    if ( left >= 0 ) style += 'left:' + left +'px;' ;
    if ( bg ) style += 'background-color:' + bg + ';' ;
    c.addAttribute ( "xstyle", style ) ;
    if ( id ) c.addAttribute ( "id", id ) ;
    if ( name ) c.addAttribute ( "name", name ) ;
    if ( dragsource ) c.addAttribute ( "dragsource", dragsource ) ;
    if ( droptarget ) c.addAttribute ( "droptarget", droptarget ) ;
    this.currentPeer = new ImageContainer() ;
    this.currentPeer.src = src ;
    this.currentPeer._setScale ( fitTo ) ;
    this.currentPeer._setPosition ( position ) ;
    return axl.getDom() ;
  },
  flush: function()
  {
  },
  getPeer: function()
  {
    return this.currentPeer ;
  }
}
var ImageContainerFactory = new ImageContainerFactoryClass() ;
TGui.addTagDefinition ( "ImageContainer", ImageContainerFactory ) ;
/**
 *  @constructor
 */
var ImageContainer = function()
{
  this.jsClassName = "ImageContainer" ;
  this.scaleType = this.SCALE_PROPORTIONAL ;
}
ImageContainer.prototype.SCALE_PROPORTIONAL = 1 ;
ImageContainer.prototype.SCALE_WIDTH = 2 ;
ImageContainer.prototype.SCALE_HEIGHT = 3 ;
ImageContainer.prototype.SCALE_WIDTH_AND_HEIGHT = 4 ;
ImageContainer.prototype.SCALE_NONE = 5 ;

ImageContainer.prototype.POSITION_T = 1 ;
ImageContainer.prototype.POSITION_TL = 2 ;
ImageContainer.prototype.POSITION_TR = 3 ;
ImageContainer.prototype.POSITION_B = 4 ;
ImageContainer.prototype.POSITION_BL = 5 ;
ImageContainer.prototype.POSITION_BR = 6 ;
ImageContainer.prototype.POSITION_CENTER = 7 ;

ImageContainer.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
}
ImageContainer.prototype.getDom = function()
{
  return this.dom ;
}
ImageContainer.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  if ( this.propertyChangeHandler )
  {
    this.propertyChangeHandler.flush() ;
    this.propertyChangeHandler = null ;
  }
  this.dom = null ;
}
ImageContainer.prototype.addPropertyChangeListener = function ( obj, method, propertyName )
{
  if ( ! this.propertyChangeHandler ) this.propertyChangeHandler = new PropertyChangeHandler() ;
  this.propertyChangeHandler.add ( obj, method, propertyName ) ;
}
ImageContainer.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  this.dom.xClassName = "ImageContainer" ;
  this._imageLoaded = false ;
}
ImageContainer.prototype.imageLoaded = function()
{
  return this._imageLoaded ;
}
ImageContainer.prototype.getPosition = function()
{
  if ( ! this.position ) return
}
ImageContainer.prototype.getScale = function()
{
  return this.scaleType ;
}
ImageContainer.prototype.getScaleName = function()
{
  if ( this.scaleType == this.SCALE_PROPORTIONAL     ) return "proportional" ;
  if ( this.scaleType == this.SCALE_WIDTH            ) return "width" ;
  if ( this.scaleType == this.SCALE_HEIGHT           ) return "height" ;
  if ( this.scaleType == this.SCALE_WIDTH_AND_HEIGHT ) return "width-and-height" ;
  if ( this.scaleType == this.SCALE_NONE ) return "none" ;
}
ImageContainer.prototype._setScale = function ( scale )
{
  if ( ! scale ) scale = "proportional" ;
  if ( scale == "proportional" )     this.scaleType = this.SCALE_PROPORTIONAL ;
  else
  if ( scale == "width" )            this.scaleType = this.SCALE_WIDTH ;
  else
  if ( scale == "height" )           this.scaleType = this.SCALE_HEIGHT ;
  else
  if ( scale == "width-and-height" ) this.scaleType = this.SCALE_WIDTH_AND_HEIGHT ;
  else
  if ( scale == "size" )             this.scaleType = this.SCALE_WIDTH_AND_HEIGHT ;
  else
  if ( scale == "none" )             this.scaleType = this.SCALE_NONE ;
  else                               this.scaleType = this.SCALE_PROPORTIONAL ;
}
ImageContainer.prototype.getPositionName = function()
{
  if ( this.position == this.POSITION_TL     ) return "top-left" ;
  if ( this.position == this.POSITION_T      ) return "top" ;
  if ( this.position == this.POSITION_TR     ) return "top-right" ;
  if ( this.position == this.POSITION_BL     ) return "bottom-left" ;
  if ( this.position == this.POSITION_B      ) return "bottom" ;
  if ( this.position == this.POSITION_BR     ) return "bottom-right" ;
  if ( this.position == this.POSITION_CENTER ) return "center" ;
}
ImageContainer.prototype._setPosition = function ( position )
{
  if ( ! position ) position = "top-left" ;
  if ( position == "top-left" )     this.position = this.POSITION_TL ;
  else
  if ( position == "top" )          this.position = this.POSITION_T ;
  else
  if ( position == "top-right" )    this.position = this.POSITION_TR ;
  else
  if ( position == "bottom-left" )  this.position = this.POSITION_BL ;
  else
  if ( position == "bottom" )       this.position = this.POSITION_B ;
  else
  if ( position == "bottom-right" ) this.position = this.POSITION_BR ;
  else
  if ( position == "center" )       this.position = this.POSITION_CENTER ;
  else                              this.position = this.POSITION_TL ;
}
ImageContainer.prototype.getImageElement = function()
{
  return this._eImage ;
}
ImageContainer.prototype.getImageComponent = function()
{
  return new TComponent ( this._eImage ) ;
}
ImageContainer.prototype.resized = function()
{
  if ( this.first )
  {
    this.first = false ;
  }
  if ( this.src )
  {
    this.setImage ( this.src ) ;
    this.src = null ;
    return ;
  }
  if ( ! this._eImage ) return ;
  var containerSize = new TDimension ( this.dom.offsetWidth, this.dom.offsetHeight ) ;
  var imgSize = new TDimension ( this._Image.width, this._Image.height ) ;
  var resultSize = this.scaleX ( containerSize, imgSize ) ;
  this._eImage.style.width = resultSize.width + "px" ;
  this._eImage.style.height = resultSize.height + "px" ;
}
ImageContainer.prototype.imgOnLoad = function ( event )
{
  var ev = new TEvent ( event ) ;
  var containerSize = new TDimension ( this.dom.offsetWidth, this.dom.offsetHeight ) ;
  var imgSize = new TDimension ( this._Image.width, this._Image.height ) ;
  var resultSize = this.scaleX ( containerSize, imgSize ) ;
  this._eImage.style.width = resultSize.width + "px" ;
  this._eImage.style.height = resultSize.height + "px" ;
  this._imageLoaded = true ;
  if ( this.position == this.POSITION_TL )
  {
    this._eImage.style.top = 0 + "px" ;
    this._eImage.style.left = 0 + "px" ;
  }
  else
  if ( this.position == this.POSITION_T )
  {
    this._eImage.style.top = 0 + "px" ;
    this._eImage.style.left = Math.floor ( ( containerSize.width - resultSize.width ) / 2 ) + "px" ;
  }
  else
  if ( this.position == this.POSITION_TR )
  {
    this._eImage.style.top = 0 + "px" ;
    this._eImage.style.left = Math.floor ( containerSize.width - resultSize.width ) + "px" ;
  }
  else
  if ( this.position == this.POSITION_BL )
  {
    this._eImage.style.top = Math.floor ( containerSize.height - resultSize.height ) + "px" ;
    this._eImage.style.left = 0 + "px" ;
  }
  else
  if ( this.position == this.POSITION_B )
  {
    this._eImage.style.top = Math.floor ( containerSize.height - resultSize.height ) + "px" ;
    this._eImage.style.left = Math.floor ( ( containerSize.width - resultSize.width ) / 2 ) + "px" ;
  }
  else
  if ( this.position == this.POSITION_BR )
  {
    this._eImage.style.top = Math.floor ( containerSize.height - resultSize.height ) + "px" ;
    this._eImage.style.left = Math.floor ( containerSize.width - resultSize.width ) + "px" ;
  }
  else
  if ( this.position == this.POSITION_CENTER )
  {
    this._eImage.style.top = Math.floor ( ( containerSize.height - resultSize.height ) / 2 ) + "px" ;
    this._eImage.style.left = Math.floor ( ( containerSize.width - resultSize.width ) / 2 ) + "px" ;
  }
  if ( this.propertyChangeHandler )
  {
    var ev = new TPropertyChangeEvent ( event, "IMAGE_LOADED" ) ;
    ev.setPeer ( this ) ;
    this.propertyChangeHandler.fireEvent ( ev ) ;
  }
}
ImageContainer.prototype.setImage = function ( url, force )
{
  if ( typeof ( force ) == 'undefined' ) force = true ;
  var src = "" ;
  if ( force ) src = url.indexOf ( '?' ) > 0 ? url + "&aaa=" + TSys.getTempId() : url + "?aaa=" + TSys.getTempId() ;
  else         src = url ;
  if ( ! this._Image )
  {
    this._imageLoaded = false ;
    this._Image = new Image() ;
    TGui.addEventListener ( this._Image, "load", this.imgOnLoad.bindAsEventListener ( this ) ) ;
  }
  this._Image.src = src ;
  if ( ! this._eImage )
  {
    var id = TSys.getTempId() ;
    this.dom.innerHTML = "<img id='" + id + "' src='' style='position:absolute;border-style:none;' onmousedown='return false;' />" ;
    this._eImage = document.getElementById ( id ) ;
/*
    this._eImage = document.createElement ( "img" ) ;
    this.dom.appendChild ( this._eImage ) ;
*/
    this._eImage.style.top = "0px" ;
    this._eImage.style.left = "0px" ;
  }
  this._eImage.src= src ;
}
ImageContainer.prototype.scaleX = function ( containerSize, imgSize )
{
  if ( this.scaleType == ImageContainer.prototype.SCALE_PROPORTIONAL )
  {
    return this.scaleProportional ( containerSize, imgSize ) ;
  }
  else
  if ( this.scaleType == ImageContainer.prototype.SCALE_WIDTH_AND_HEIGHT )
  {
    return this.scaleWidthAndHeight ( containerSize, imgSize ) ;
  }
  else
  if ( this.scaleType == ImageContainer.prototype.SCALE_WIDTH )
  {
    return this.scaleWidth ( containerSize, imgSize ) ;
  }
  else
  if ( this.scaleType == ImageContainer.prototype.SCALE_HEIGHT )
  {
    return this.scaleProportional ( containerSize, imgSize ) ;
  }
  else
  if ( this.scaleType == ImageContainer.prototype.SCALE_NONE )
  {
    return imgSize ;
  }
  else
  {
    return this.scaleProportional ( containerSize, imgSize ) ;
  }
}
ImageContainer.prototype.scaleWidthAndHeight = function ( containerSize, imgSize )
{
  var width = containerSize.width ;
  var height = containerSize.height ;
  var w = imgSize.width ;
  var h = imgSize.height ;

  w = width ;
  h = height ;

  return new TDimension ( Math.floor ( w ), Math.floor ( h ) ) ;
}
ImageContainer.prototype.scaleWidth = function ( containerSize, imgSize )
{
  var width = containerSize.width ;
  var height = containerSize.height ;
  var w = imgSize.width ;
  var h = imgSize.height ;

  if ( w != width )
  {
    var newW = w ;
    var newH = h ;

    var orgRatio = w / h ;

    newW = width ;
//    newH = newW / orgRatio ;
    w = newW ;
    h = newH ;
  }
  return new TDimension ( Math.floor ( w ), Math.floor ( h ) ) ;
}
ImageContainer.prototype.scaleHeight = function ( containerSize, imgSize )
{
  var width = containerSize.width ;
  var height = containerSize.height ;
  var w = imgSize.width ;
  var h = imgSize.height ;

  if ( h != height )
  {
    var newW = w ;
    var newH = h ;

    var orgRatio = w / h ;

    newH = height ;
//    newW = newH * orgRatio ;

    w = newW ;
    h = newH ;
  }
  return new TDimension ( Math.floor ( w ), Math.floor ( h ) ) ;
}
ImageContainer.prototype.scaleProportional = function ( containerSize, imgSize )
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

/**
 *  @constructor
 */
var CustomButtonFactoryClass = function()
{
  this.currentPeer = null ;
}
CustomButtonFactoryClass.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
}
CustomButtonFactoryClass.prototype =
{
  getAxl: function ( dom )
  {
    var xml = new TXml ( dom ) ;
    var axl = new TXml() ;
    var ignoreCWidth = false ;
    var addPadding = false ;
    var xContainer = null ;
    var b = Tango.ua.useGenericButtons ;
    b = false ;
    if ( b )
    {
      var ignoreCWidth = true ;
      var addPadding = true ;
      xContainer = axl.addXml ( "Button" ) ;
    }
    else
    {
      xContainer = axl.addXml ( "Container" ) ;
    }

    var eStyle = this.getEStyle ( xml ) ;
    var id = xml.getAttribute ( "id" ) ;
    var name = xml.getAttribute ( "name" ) ;
    var text = xml.getAttribute ( "text" ) ;
    var style = xml.getAttribute ( "style" ) ;
    var onclick = xml.getAttribute ( "onclick" ) ;
    var img = xml.getAttribute ( "img" ) ;
    var arrow = xml.getAttribute ( "arrow" ) ;
    var reverse = xml.getAttribute ( "reverse" ) ;
    var tooltip = xml.getAttribute ( "tooltip" ) ;

    var alignLeft = false ;
    if ( style && style.indexOf ( "text-align" ) >= 0 )
    {
      var a = TGui.parseStyle ( style, "text-align" ) ;
      style = a[0] ;
      alignLeft = a[1] == "left" ;
    }
    var styleString = eStyle.getStyleString() ;

    this.currentPeer = this.createPeer ( eStyle, xml ) ;
    this.currentPeer.text = text ;
    this.currentPeer.arrow = arrow ;
    this.currentPeer.imgWidth = xml.getIntAttribute ( "img-width", 0 ) ;
    this.currentPeer.imgHeight = xml.getIntAttribute ( "img-height", 0 ) ;
    if ( ! this.currentPeer.imgHeight ) this.currentPeer.imgHeight = this.currentPeer.imgWidth ;
    if ( ! this.currentPeer.imgWidth ) this.currentPeer.imgWidth = this.currentPeer.imgHeight ;
    if ( ! this.currentPeer.imgWidth ) this.currentPeer.imgWidth = 16 ;
    if ( ! this.currentPeer.imgHeight ) this.currentPeer.imgHeight = 16 ;

    this.currentPeer.ignoreCWidth = ignoreCWidth ;
    this.currentPeer.addPadding = addPadding ;

    var fullStyle = "white-space:nowrap;vertical-align:middle;" ; //border-width:0px;" ;
    if ( style ) fullStyle += style;
    if ( styleString ) fullStyle += styleString ;
    if ( id ) xContainer.addAttribute ( "id", id ) ;
    if ( name ) xContainer.addAttribute ( "name", name ) ;
    this.currentPeer.img = TGui.translateImageName ( img ) ;
    this.currentPeer.reverse = reverse ;
    this.currentPeer.stacked = xml.getAttribute ( "stacked" ) ;
    this.currentPeer.textY = xml.getIntAttribute ( "text-y", 0 ) ;

    this.currentPeer.alignLeft = alignLeft ;
    if ( this.currentPeer.textY <= 0 ) this.currentPeer.textY = -1 ;
    this.currentPeer.imgY = xml.getIntAttribute ( "img-y", 0 ) ;
    if ( this.currentPeer.imgY <= 0 ) this.currentPeer.imgY = -1 ;
    this.currentPeer.onclick = onclick ;
    this.currentPeer.disabled = xml.getAttribute ( "disabled" ) ;
    if ( xml.getAttribute ( "checkable" ) == "true" ) xContainer.addAttribute ( "checkable", "true" ) ;
    if ( xml.getAttribute ( "checked" ) == "true" ) xContainer.addAttribute ( "checked", "true" ) ;
    var clazz = xml.getAttribute ( "class" ) ;
    if ( ! clazz ) clazz = this.currentPeer.getCssClassName ( "normal" ) ;
    if ( clazz ) xContainer.addAttribute ( "class", clazz ) ;
    xContainer.addAttribute ( "xstyle", fullStyle ) ;
    if ( tooltip ) xContainer.addAttribute ( "tooltip", this.getTooltip ( tooltip ) ) ;
    if ( ! xml.isEmpty() )
    {
      xContainer.copyChildrenFrom ( xml ) ;
    }

    return axl.getDom() ;
  },
  getEStyle: function ( xml )
  {
    return new EStyle ( xml.getAttribute ( "estyle" ) ) ;
  },
  getTooltip: function ( text )
  {
    return text ;
  },
  flush: function()
  {
  },
  getPeer: function()
  {
    return this.currentPeer ;
  },
  createPeer: function ( eStyle, xml )
  {
    return new CustomButton ( eStyle, xml ) ;
  }
}
var CustomButtonFactory = new CustomButtonFactoryClass() ;
TGui.addTagDefinition ( "CustomButton", CustomButtonFactory ) ;
/**
 *  @constructor
 *  @extends TComponent
 */
var CustomButton = function ( eStyle, xml )
{
  if ( ! eStyle ) return ;
  Tango.initSuper ( this, TComponent );
  this.jsClassName = "CustomButton" ;
  this.eStyle = eStyle ;
  this.setExtendedStyles() ;
  this.onclick = null ;
  this.alignLeft = false ;
  this.ignoreCWidth = false ;
  this.addPadding = false ;
}
CustomButton.inherits( TComponent ) ;
CustomButton.prototype.toString = function()
{
  return TComponent.prototype.toString.apply ( this, arguments ) ;
}
CustomButton.prototype.getCssClassName = function ( state )
{
  return ;
} ;
CustomButton.prototype.setExtendedStyles = function()
{
  this.eStyleNormal = this.eStyle.getSubStyle ( "normal" ) ;
  this.eStyleInside = this.eStyle.getSubStyle ( "inside" ) ;
  if ( ! this.eStyleInside ) this.eStyleInside = this.eStyleNormal ;
  this.eStylePressed = this.eStyle.getSubStyle ( "pressed" ) ;
  if ( ! this.eStylePressed ) this.eStylePressed = this.eStyleNormal ;
  this.eStyleDisabled = this.eStyle.getSubStyle ( "disabled" ) ;
  if ( ! this.eStyleDisabled ) this.eStyleDisabled = this.eStyleNormal ;
  this.eStyleChecked = this.eStyle.getSubStyle ( "checked" ) ;
  if ( ! this.eStyleChecked ) this.eStyleChecked = this.eStylePressed ;
  this.eStyleCheckedInside = this.eStyle.getSubStyle ( "checkedInside" ) ;
  if ( ! this.eStyleCheckedInside ) this.eStyleChecked = this.eStyleChecked ;

  this.bgNormal = TGui.buildScaledImageUrl ( this.eStyleNormal.getImage() ) ;
  this.bgInside = TGui.buildScaledImageUrl ( this.eStyleInside.getImage() ) ;
  this.bgPressed = TGui.buildScaledImageUrl ( this.eStylePressed.getImage() ) ;
  this.bgDisabled = TGui.buildScaledImageUrl ( this.eStyleDisabled.getImage() ) ;
  this.bgChecked = TGui.buildScaledImageUrl ( this.eStyleChecked.getImage() ) ;
}
CustomButton.prototype.getXClassName = function()
{
  return "CustomButton";
} ;
CustomButton.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  this.dom.xClassName = this.getXClassName() ;
  var s = "" ;
  if ( !this.img && !this.text ) this.text = '&nbsp;' ;

  var p = TGui.renderShortcutText ( this.text ) ;
  var t1 = this.text ;
  this.text = p.text ;

var I1 = new Image() ; I1.src = this.bgInside ;
var I2 = new Image() ; I2.src = this.bgPressed ;
//var I3 = new Image() ; I3.src = this.bgDisabled ;
//var I4 = new Image() ; I4.src = this.bgChecked ;

  if ( this.img && this.text )
  {
    if ( this.imgHeight && this.imgWidth )
    {
      s = "<img style='width:" + this.imgHeight + "px;height:" + this.imgWidth + "px;' src='" + this.img + "' class='ButtonImage' />\n<span class='ButtonText' >" + this.text + "</span>\n" ;
    }
    else
    {
      s = "<img src='" + this.img + "' class='ButtonImage' />\n<span class='ButtonText' >" + this.text + "</span>\n" ;
    }
  }
  else
  if ( this.img )
  {
    s = "<img src='" + this.img + "' class='ButtonImage' />\n" ;
  }
  else
  if ( this.text )
  {
    s = "<span class='ButtonText' >" + this.text + "</span>\n" ;
  }
  if ( this.arrow )
  {
    s += this.getArrowHtml() ;
  }
  this.dom.innerHTML = s ;

  this.dom.isLayedout = true ;
  TGui.layoutButtonLike ( { dom:this.dom, imgWidth:this.imgWidth, imgHeight:this.imgHeight
		         , useButtonMinimum:true, reverse:this.reverse, stacked:this.stacked
		         , textY:this.textY, imgY:this.imgY
             , alignLeft:this.alignLeft
		         , ignoreCWidth:this.ignoreCWidth
		         , addPadding:this.addPadding
		         } ) ;

  if ( this.dom.eCloser ) this.dom.eCloser.xClassName = "Arrow" ;
  if ( Tango.ua.realMobile )
  {
    this.addEventListener ( "touchend", this, this.mouseout ) ;
    this.addEventListener ( "touchstart", this, this.mousedown ) ;
  }
  else
  {
    this.addEventListener ( this ) ;
  }
  if ( this.onclick )
  {
    this.fExecutor = new TFunctionExecutor ( this.onclick, layoutContext ) ;
    this.onclick = null ;
    TGui.addEventListener ( this.dom, "click", this.onMouse.bindAsEventListener ( this, "click" ) ) ;
    if ( p.shortcutCharacter )
    {
      TGlobalEventHandler.addToShortCutList ( p.shortcutCharacter, this.dom, this.fExecutor, t1 ) ;
    }
  }

  if ( this.disabled )
  {
    this.dom.disabled = true ;
    if ( this.bgDisabled )
    {
      this._setBackgroundImage ( this.bgDisabled ) ;
    }
    if ( this.eStyleDisabled )
    {
      var fg = this.eStyleDisabled.getForeground() ;
      if ( fg ) this.dom.style.color = fg ;
    }
    else
    {
      var clazz = this.getCssClassName ( "disabled" ) ;
      if ( clazz ) this.dom.className = clazz ;
    }
  }
  else
  {
    this.setStyleNormal() ;
  }
}
CustomButton.prototype.getArrowHtml = function()
{
  if ( ! this.arrow ) return "" ;
  var txml = Tango.getThemeXml ( "Arrow", this.arrow ) ;
  if ( ! txml ) return "" ;
  var w = txml.getIntAttribute ( "width", 11 ) ;
  var h = txml.getIntAttribute ( "height", 11 ) ;
  this.arrowImageUrlNormal = TGui.buildThemeImageUrl ( "Arrow", this.arrow ) ;
  if ( Tango.getThemeXml ( "Arrow", this.arrow + ".inside" ) )
  {
    this.arrowImageUrlInside = TGui.buildThemeImageUrl ( "Arrow", this.arrow + ".inside" ) ;
  }
  else this.arrowImageUrlInside = this.arrowImageUrlNormal ;
  if ( Tango.getThemeXml ( "Arrow", this.arrow + ".pressed" ) )
  {
    this.arrowImageUrlPressed = TGui.buildThemeImageUrl ( "Arrow", this.arrow + ".pressed" ) ;
  }
  else this.arrowImageUrlPressed = this.arrowImageUrlNormal ;
  if ( Tango.getThemeXml ( "Arrow", this.arrow + ".disabled" ) )
  {
    this.arrowImageUrlDisabled = TGui.buildThemeImageUrl ( "Arrow", this.arrow + ".disabled" ) ;
  }
//  else this.arrowImageUrlDisabled = this.arrowImageUrlNormal ;
  return "<img style='position:absolute;width:" + w + "px;height:" + h + "px;' class='Arrow' src='" + this.arrowImageUrlNormal + "' />" ;
}
CustomButton.prototype._setBackgroundImage = function ( img )
{
  if ( ! img ) return ;

  if ( img.startsWith ( "css:" ) )
  {
    this.dom.style.backgroundImage = "" ;
    this.dom.className = img.substring ( 4 ) ;
  }
  else
  {
    this.dom.style.backgroundImage = "url(" + img + "&width=" + this.dom.offsetWidth
                                                              + "&height=" + this.dom.offsetHeight
                                                              + ")" ;
  }
}
CustomButton.prototype.setEnabled = function ( state )
{
  var st = state ? true : false ;
  st = ! st ;
  this.dom.disabled = st ;
  if ( this.dom.disabled )
  {
    this._setBackgroundImage ( this.bgDisabled ) ;
    if ( this.eStyleDisabled )
    {
      var fg = this.eStyleDisabled.getForeground() ;
      if ( fg ) this.dom.style.color = fg ;
    }
    else
    {
      var clazz = this.getCssClassName ( "disabled" ) ;
      if ( clazz ) this.dom.className = clazz ;
    }
    if ( this.dom.eCloser )
    {
      if ( this.arrowImageUrlDisabled ) this.dom.eCloser.src = this.arrowImageUrlDisabled ;
      else
      {
        this.opacityOnCloser = true ;
        TGui.setOpacity ( this.dom.eCloser, 0.5 )
      }
    }
    return ;
  }
  if ( this.dom.eCloser )
  {
    if ( this.opacityOnCloser )
    {
      TGui.setOpacity ( this.dom.eCloser, 1.0 )
    }
    this.opacityOnCloser = false ;
    this.dom.eCloser.src = this.arrowImageUrlNormal ;
  }
  if ( this.bgNormal )
  {
    this._setBackgroundImage ( this.bgNormal ) ;
  }
  if ( this.eStyleNormal )
  {
    var fg = this.eStyleNormal.getForeground() ;
    if ( fg ) this.dom.style.color = fg ;
  }
  else
  {
    var clazz = this.getCssClassName ( "normal" ) ;
    if ( clazz ) this.dom.className = clazz ;
  }
  if ( this.dom.eCloser ) this.dom.eCloser.src = this.arrowImageUrlNormal ;
}
CustomButton.prototype.setChecked = function ( state )
{
  if ( state ) this.dom.checked = true ;
  else         this.dom.checked = false ;
  this.setStyleNormal() ;
}
CustomButton.prototype.mousedown = function ( event )
{
  this.onMouse ( event, "mousedown" ) ;
}
CustomButton.prototype.mouseup = function ( event )
{
  this.onMouse ( event, "mouseup" ) ;
}
CustomButton.prototype.mouseover = function ( event )
{
  this.onMouse ( event, "mouseover" ) ;
}
CustomButton.prototype.mouseout = function ( event )
{
  var ev = new TEvent ( event ) ;
  if ( this.getBoundsOnPage().inside ( ev.getX(), ev.getY() ) )
  {
    return ;
  }
  this.onMouse ( event, "mouseout" ) ;
}
CustomButton.prototype.onMouse = function ( event, what )
{
  var ev = new TEvent ( event ) ;
  TGui.lastMouseupComponent = undefined ;
  if ( this.dom.disabled )
  {
    if ( this.bgDisabled )
    {
      this.dom.style.backgroundImage = "url(" + this.bgDisabled + "&width=" + this.dom.offsetWidth
                                                                + "&height=" + this.dom.offsetHeight
                                                                + ")" ;
    }
    if ( this.eStyleDisabled )
    {
      var fg = this.eStyleDisabled.getForeground() ;
      if ( fg ) this.dom.style.color = fg ;
      var ts = this.eStyleDisabled.getTextShadow() ;
      if ( ts ) this.dom.style.textShadow = ts ;
    }
    else
    {
      var clazz = this.getCssClassName ( "disabled" ) ;
      if ( clazz ) this.dom.className = clazz ;
    }
    this.dom.style.cursor = "default" ;
    if ( this.dom.eCloser )
    {
      if ( this.arrowImageUrlDisabled ) this.dom.eCloser.src = this.arrowImageUrlDisabled ;
      else
      {
        this.opacityOnCloser = true ;
        TGui.setOpacity ( this.dom.eCloser, 0.5 )
      }
    }
    return ;
  }
  if ( this.dom.eCloser )
  {
    if ( this.opacityOnCloser )
    {
      TGui.setOpacity ( this.dom.eCloser, 1.0 )
    }
    this.opacityOnCloser = false ;
  }
  if ( what == "mousedown" )
  {
    if ( this.bgPressed )
    {
      this.dom.style.backgroundImage = "url(" + this.bgPressed + "&width=" + this.dom.offsetWidth
                                                               + "&height=" + this.dom.offsetHeight
                                                               + ")" ;
    }
    if ( this.eStylePressed )
    {
      var fg = this.eStylePressed.getForeground() ;
      if ( fg ) this.dom.style.color = fg ;
      var ts = this.eStylePressed.getTextShadow() ;
      if ( ts ) this.dom.style.textShadow = ts ;
    }
    else
    {
      var clazz = this.getCssClassName ( "pressed" ) ;
      if ( clazz ) this.dom.className = clazz ;
    }
    if ( this.dom.eCloser ) this.dom.eCloser.src = this.arrowImageUrlPressed
  }
  if ( what == "mouseup" )
  {
    TGui.lastMouseupComponent = this ;
    if ( this.dom.checkable )
    {
      if ( this.dom.checkableGroup )
      {
        if ( ! this.dom.checked )
        {
          this.dom.checked = true ;
          if ( this.dom.checkableGroup ) this.dom.checkableGroup.checkableChecked ( this.dom  ) ;
        }
      }
      else
      {
        if ( this.dom.checked ) this.dom.checked = false ;
        else                    this.dom.checked = true ;
      }
    }
    if ( this.dom.checked )
    {
      this._setBackgroundImage ( this.bgChecked ) ;
    }
    else
    {
      this._setBackgroundImage ( this.bgInside ) ;
    }
    if ( this.eStyleInside )
    {
      var fg = this.eStyleInside.getForeground() ;
      if ( fg ) this.dom.style.color = fg ;
      var ts = this.eStyleInside.getTextShadow() ;
      if ( ts ) this.dom.style.textShadow = ts ;
    }
    else
    {
      var clazz = this.getCssClassName ( "inside" ) ;
      if ( clazz ) this.dom.className = clazz ;
    }
    if ( this.dom.eCloser ) this.dom.eCloser.src = this.arrowImageUrlInside
  }
  if ( what == "mouseover" )
  {
    if ( ! this.xInside )
    {
      if ( this.dom.checked )
      {
        this._setBackgroundImage ( this.bgChecked ) ;
      }
      else
      {
        this._setBackgroundImage ( this.bgInside ) ;
      }
      if ( this.eStyleInside )
      {
        var fg = this.eStyleInside.getForeground() ;
        if ( fg ) this.dom.style.color = fg ;
        this.dom.style.cursor = "pointer" ;
        var ts = this.eStyleInside.getTextShadow() ;
        if ( ts ) this.dom.style.textShadow = ts ;
      }
      else
      {
        var clazz = this.getCssClassName ( "inside" ) ;
        if ( clazz ) this.dom.className = clazz ;
      }
      if ( this.dom.eCloser ) this.dom.eCloser.src = this.arrowImageUrlInside
    }
  }
  if ( what == "mouseout" )
  {
    this.setStyleNormal() ;
  }
  if ( what == "click" )
  {
    if ( this.fExecutor ) this.fExecutor.executeWithEvent ( event ) ;
  }

  if ( TGui.getBoundsOnPageOf ( this.dom ).inside ( ev.getX(), ev.getY() ) )
  {
    this.xInside = true ;
  }
  else
  {
    this.xInside = false ;
  }
}
CustomButton.prototype.setStyleNormal = function()
{
  if ( this.dom.disabled )
  {
    if ( this.bgDisabled )
    {
      this._setBackgroundImage ( this.bgDisabled ) ;
    }
    if ( this.eStyleDisabled )
    {
      var fg = this.eStyleDisabled.getForeground() ;
      if ( fg ) this.dom.style.color = fg ;
      var ts = this.eStyleDisabled.getTextShadow() ;
      if ( ts ) this.dom.style.textShadow = ts ;
      this.dom.style.cursor = "default" ;
    }
    else
    {
      var clazz = this.getCssClassName ( "disabled" ) ;
      if ( clazz ) this.dom.className = clazz ;
    }
    if ( this.dom.eCloser )
    {
      if ( this.arrowImageUrlDisabled ) this.dom.eCloser.src = this.arrowImageUrlDisabled ;
      else
      {
        this.opacityOnCloser = true ;
        TGui.setOpacity ( this.dom.eCloser, 0.5 )
      }
    }
    return ;
  }
  if ( this.dom.eCloser )
  {
    if ( this.opacityOnCloser )
    {
      TGui.setOpacity ( this.dom.eCloser, 1.0 )
    }
    this.opacityOnCloser = false ;
  }
  if ( this.dom.checked )
  {
    this._setBackgroundImage ( this.bgChecked ) ;
  }
  else
  {
    this._setBackgroundImage ( this.bgNormal ) ;
  }
  if ( this.dom.checked && this.eStyleChecked )
  {
    var fg = this.eStyleChecked.getForeground() ;
    if ( fg ) this.dom.style.color = fg ;
    var ts = this.eStyleChecked.getTextShadow() ;
    if ( ts ) this.dom.style.textShadow = ts ;
  }
  else
  if ( this.eStyleNormal )
  {
    var fg = this.eStyleNormal.getForeground() ;
    if ( fg ) this.dom.style.color = fg ;
    var ts = this.eStyleNormal.getTextShadow() ;
    if ( ts ) this.dom.style.textShadow = ts ;
  }
  else
  {
    var clazz = this.getCssClassName ( "normal" ) ;
    if ( clazz ) this.dom.className = clazz ;
  }
  if ( this.dom.eCloser ) this.dom.eCloser.src = this.arrowImageUrlNormal ;
  this.dom.style.cursor = "default" ;
}
CustomButton.prototype.resized = function ( e )
{
  TGui.layoutButtonLike ( { dom:this.dom, imgWidth:this.imgWidth, imgHeight:this.imgHeight
		         , useButtonMinimum:true, reverse:this.reverse, stacked:this.stacked
		         , textY:this.textY, imgY:this.imgY
                         , alignLeft:this.alignLeft
		         , ignoreCWidth:this.ignoreCWidth
		         , addPadding:this.addPadding
		         , contentOnly:true
		         } ) ;
  this.setStyleNormal() ;
}
CustomButton.prototype.setSize = function ( w, h )
{
  TComponent.prototype.setSize.apply ( this, arguments ) ;
  if ( this.dom.eTxt )
  {
    var e = TGui.createElement ( "<span class='ButtonText' >" + this.dom.eTxt.innerHTML + "</span>" ) ;
    this.dom.replaceChild ( e, this.dom.eTxt ) ;
  }
  TGui.layoutButtonLike ( { dom:this.dom, imgWidth:this.imgWidth, imgHeight:this.imgHeight
		         , useButtonMinimum:true, reverse:this.reverse, stacked:this.stacked
		         , textY:this.textY, imgY:this.imgY
                         , alignLeft:this.alignLeft
		         , ignoreCWidth:this.ignoreCWidth
		         , addPadding:this.addPadding
		         , contentOnly:true
		         } ) ;
  this.setStyleNormal() ;
}
CustomButton.prototype.getText = function()
{
  if ( ! this.dom ) return "" ;
  if ( ! this.dom.eTxt ) return "" ;
  return this.dom.eTxt.innerHTML ;
} ;
CustomButton.prototype.setText = function ( text )
{
  if ( ! this.dom ) return ;
  if ( ! this.dom.eTxt ) return ;
  if ( ! text ) text = "" ;
  this.dom.eTxt.innerHTML = text ;
} ;
/**
 *  @constructor
 */
var IconButtonFactoryClass = function()
{
  this.currentPeer = null ;
  this.str = "<xml><img /></xml>" ;
}
IconButtonFactoryClass.prototype =
{
  getAxl: function ( dom )
  {
    var xml = new TXml ( dom ) ;
    var axl = new TXml ( TSys.parseDom ( this.str ) ) ;

    var id = xml.getAttribute ( "id" ) ;
    var name = xml.getAttribute ( "name" ) ;
    var style = xml.getAttribute ( "style", "" ) ;
    var tooltip = xml.getAttribute ( "tooltip" ) ;
    var onclick = xml.getAttribute ( "onclick" ) ;
    var name = xml.getAttribute ( "name" ) ;

    this.currentPeer = new IconButton ( xml ) ;
    var img = axl.getXml ( "img" ) ;

    var width = 0 ;
    var height = 0 ;
    if ( style.indexOf ( "width" ) >= 0 )
    {
      var a = TGui.parseStyle ( style, "width" ) ;
      style = a[0] ;
      var w = parseInt ( a[1] ) ;
      if ( ! isNaN ( w ) ) width = w ;
    }
    if ( style.indexOf ( "height" ) >= 0 )
    {
      var a = TGui.parseStyle ( style, "height" ) ;
      style = a[0] ;
      var h = parseInt ( a[1] ) ;
      if ( ! isNaN ( h ) ) height = h ;
    }
    if ( width && ! height ) height = width ;
    if ( ! width && height ) width = height  ;
    if ( ! width ) width = xml.getIntAttribute ( "width", 13 ) ;
    if ( ! height ) height = xml.getIntAttribute ( "height", width ) ;

    style += "width:" + width + "px;" ;
    style += "height:" + height + "px;" ;
    this.currentPeer.width = width ;
    this.currentPeer.height = height ;
    this.currentPeer.setReflection ( xml.getAttribute ( "reflection" ) ? true : false ) ;

    if ( id ) img.addAttribute ( "id", id ) ;
    if ( name ) img.addAttribute ( "name", name ) ;
    if ( onclick ) img.addAttribute ( "onclick", onclick ) ;
    if ( style ) img.addAttribute ( "xstyle", style ) ;
    if ( tooltip ) img.addAttribute ( "tooltip", tooltip ) ;
    if ( name ) img.addAttribute ( "name", name ) ;
    img.addAttribute ( "src", this.currentPeer.normal ) ;
    return axl.getDom() ;
  },
  getPeer: function()
  {
    return this.currentPeer ;
  }
}
var IconButtonFactory = new IconButtonFactoryClass() ;
TGui.addTagDefinition ( "IconButton", IconButtonFactory ) ;
/**
 *  @constructor
 *  @extends TComponent
 */
var IconButton = function ( xml )
{
  if ( ! xml ) return ;
  Tango.initSuper ( this, TComponent );
  this.jsClassName = "IconButton" ;

  this.normal = xml.getAttribute ( "normal" ) ;
  this.org_normal = xml.getAttribute ( "normal" ) ;
  this.inside = xml.getAttribute ( "inside", this.normal ) ;
  this.org_inside = xml.getAttribute ( "inside" ) ;
  this.pressed = xml.getAttribute ( "pressed", this.normal ) ;
  this.org_disabled = xml.getAttribute ( "disabled" ) ;
  this.disabled = xml.getAttribute ( "disabled", this.normal ) ;

  this.reflection = false ;
  this.normal = TGui.translateImageName ( this.normal.trim() ) ;
  this.inside = TGui.translateImageName ( this.inside.trim() ) ;
  this.pressed = TGui.translateImageName ( this.pressed.trim() ) ;
  this.disabled = TGui.translateImageName ( this.disabled.trim() ) ;
  /*
  var fe = null ;
  fe = TSys.tryFunctionExecutor ( this.normal ) ;
  if ( fe ) { this.normal = fe.execute() ; fe.flush() ; }
  fe = TSys.tryFunctionExecutor ( this.inside ) ;
  if ( fe ) { this.inside = fe.execute() ; fe.flush() ; }
  fe = TSys.tryFunctionExecutor ( this.pressed ) ;
  if ( fe ) { this.pressed = fe.execute() ; fe.flush() ; }
  fe = TSys.tryFunctionExecutor ( this.disabled ) ;
  if ( fe ) { this.disabled = fe.execute() ; fe.flush() ; }
  */
  this.reflection = false ;
}
IconButton.inherits( TComponent ) ;
IconButton.prototype.setReflection = function ( state )
{
  this.reflection = state ;
  if ( ! this.reflection ) return ;
  this.normal = TGui.buildScaledImageUrl ( { src:this.normal, reflection:true, width:this.width, height:this.height } )
  if ( this.org_inside ) this.inside = TGui.buildScaledImageUrl ( { src:this.inside, reflection:true, width:this.width, height:this.height } )
  else               this.inside = TGui.buildScaledImageUrl ( { src:this.org_normal, reflection:true, width:this.width, height:this.height, highlighted:true } )
  if ( this.pressed ) this.pressed = TGui.buildScaledImageUrl ( { src:this.pressed, reflection:true, width:this.width, height:this.height } )
  if ( this.org_disabled ) this.disabled = TGui.buildScaledImageUrl ( { src:this.disabled, reflection:true, width:this.width, height:this.height } )
  else               this.disabled = TGui.buildScaledImageUrl ( { src:this.org_normal, reflection:true, width:this.width, height:this.height, opacity:0.5 } )
}
IconButton.prototype.setEnabled = function ( state )
{
  this.dom.disabled = ! state ;
  if ( this.dom.disabled )
  {
    this.dom.src = this.disabled ;
    this.dom.style.cursor = "default" ;
  }
  else
  {
    this.dom.src = this.normal ;
    this.dom.style.cursor = "pointer" ;
  }
}
IconButton.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  this.dom.xClassName = "IconButton" ;
  var s = "" ;
  this.addEventListener ( this ) ;
}
IconButton.prototype.mousedown = function ( event )
{
  if ( this.dom.disabled ) return ;
  Dragger.stop() ;
  this.dom.src = this.pressed ;
}
IconButton.prototype.mouseup = function ( event )
{
  if ( this.dom.disabled ) return ;
  this.dom.src = this.inside ;
}
IconButton.prototype.mouseover = function ( event )
{
  if ( this.dom.disabled ) return ;
  this.dom.src = this.inside ;
}
IconButton.prototype.mouseout = function ( event )
{
  if ( this.dom.disabled ) return ;
  this.dom.src = this.normal ;
}

/**
 *  @constructor
 */
var CSSTextFieldFactoryClass = function()
{
  this.jsClassName = "CSSTextFieldFactoryClass" ;
  this.currentPeer = null ;
}
CSSTextFieldFactoryClass.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
};
CSSTextFieldFactoryClass.prototype.getAxl = function ( dom )
{
  var xml = new TXml ( dom ) ;
  var axl = new TXml() ;
  var x = axl.add ( "TextField" ) ;
  x.copyChildrenFrom ( xml ) ;
  x.copyAttributesFrom ( xml ) ;
  x.addAttribute ( "mandatory-style-name", "CSS3TextFieldMandatory" ) ;
  x.addAttribute ( "mandatory-blur-style-name", "CSS3TextFieldMandatoryBlur" ) ;
  x.addAttribute ( "normal-style-name", "CSSTextField" ) ;
  return axl.getDom() ;
} ;
var CSSTextFieldFactory = new CSSTextFieldFactoryClass() ;
TGui.addTagDefinition ( "CSSTextField", CSSTextFieldFactory ) ;
/**
 *  @constructor
 */
var CustomTextFieldFactoryClass = function()
{
  this.jsClassName = "CustomTextFieldFactoryClass" ;
  this.currentPeer = null ;
}
CustomTextFieldFactoryClass.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
}
CustomTextFieldFactoryClass.prototype =
{
  getAxl: function ( dom )
  {
    var xml = new TXml ( dom ) ;
    var axl = new TXml() ;
    var xContainer = axl.addXml ( "Container" ) ;
    var xTextField = xContainer.addXml ( "TextField" ) ;

    var id = xml.getAttribute ( "id" ) ;
    if ( ! id ) id = "CTF." + TSys.getTempId() ;
    var name = xml.getAttribute ( "name" ) ;
    var mandatory = xml.getAttribute ( "mandatory" ) ;
    var value = xml.getAttribute ( "value" ) ;
    var action = xml.getAttribute ( "action" ) ;
    var style = xml.getAttribute ( "style" ) ;
    var icon = xml.getAttribute ( "icon" ) ;
    var type = xml.getAttribute ( "type" ) ;
    var mandatoryStyleName = xml.getAttribute ( "mandatory-style-name" ) ;
    var mandatoryBlurStyleName = xml.getAttribute ( "mandatory-blur-style-name" ) ;
    var normalStyleName = xml.getAttribute ( "normal-style-name" ) ;
    if ( icon )
    {
      icon = icon.trim() ;
      if ( icon.charAt ( 0 ) == "{" && icon.charAt ( icon.length - 1 ) == "}" )
      {
        try
        {
          icon = TSys.eval ( icon ) ;
        }
        catch ( exc )
        {
          icon = null ;
        }
      }
    }

    xTextField.addAttribute ( "id", id ) ;
    if ( name ) xTextField.addAttribute ( "name", name ) ;
    if ( value ) xTextField.addAttribute ( "value", value ) ;
    if ( action ) xTextField.addAttribute ( "action", action ) ;
    if ( type ) xTextField.addAttribute ( "type", type ) ;
    if ( mandatory ) xTextField.addAttribute ( "mandatory", mandatory ) ;
    var tfStyle = "margin:0px;border-width:0px;"

    if ( icon )
    {
      xIconButton = xContainer.addXml ( "IconButton" ) ;
      if ( icon.cosmos )
      {
        var str = null ;
        str = Cosmos.getIconName ( icon.cosmos, "normal" ) ;
        if ( str ) xIconButton.addAttribute ( "normal", str ) ;
        str = Cosmos.getIconName ( icon.cosmos, "inside" ) ;
        if ( str ) xIconButton.addAttribute ( "inside", str ) ;
        str = Cosmos.getIconName ( icon.cosmos, "pressed" ) ;
        if ( str ) xIconButton.addAttribute ( "pressed", str ) ;
        str = Cosmos.getIconName ( icon.cosmos, "disabled" ) ;
        if ( str ) xIconButton.addAttribute ( "disabled", str ) ;
        xIconButton.addAttribute ( "width", "" + Cosmos.getIconWidth ( icon.cosmos ) ) ;
      }
      else
      {
        if ( icon.normal ) xIconButton.addAttribute ( "normal", icon.normal ) ;
        if ( icon.inside ) xIconButton.addAttribute ( "inside", icon.inside ) ;
        if ( icon.pressed ) xIconButton.addAttribute ( "pressed", icon.pressed ) ;
        if ( icon.disabled ) xIconButton.addAttribute ( "disabled", icon.disabled ) ;

        if ( typeof ( icon.width ) == 'number' ) xIconButton.addAttribute ( "width", "" + icon.width ) ;
      }
      if ( icon.style ) xIconButton.addAttribute ( "style", icon.style ) ;
      if ( icon.onclick ) xIconButton.addAttribute ( "onclick", icon.onclick ) ;
      if ( icon.name ) xIconButton.addAttribute ( "name", icon.name ) ;
    }
    if ( mandatoryStyleName ) xTextField.addAttribute ( "mandatory-style-name", mandatoryStyleName ) ;
    if ( normalStyleName ) xTextField.addAttribute ( "normal-style-name", normalStyleName ) ;
    if ( mandatoryBlurStyleName ) xTextField.addAttribute ( "mandatory-blur-style-name", mandatoryBlurStyleName ) ;

    var eStyle = this.getEStyle ( xml ) ;

    this.currentPeer = this.createPeer ( eStyle, xml ) ;
    this.currentPeer.textFieldId = id ;
    if ( normalStyleName ) this.currentPeer.className = normalStyleName ;
    else                   this.currentPeer.className = "ThemeTextField" ;

    var styleString = eStyle.getStyleString() ;
    if ( eStyle.style && eStyle.style.style )
    {
      tfStyle += eStyle.style.style ;
    }
    xTextField.addAttribute ( "style", tfStyle ) ;

    var decoration = this.getDecorationString ( eStyle ) ;
    var fullStyle = "white-space:nowrap;vertical-align:middle;" ;
    if ( style ) fullStyle += style;
    fullStyle += styleString ;
    xContainer.addAttribute ( "style", fullStyle ) ;
    if ( decoration ) xContainer.addAttribute ( "decoration", decoration ) ;
    return axl.getDom() ;
  },
  getEStyle: function ( xml )
  {
    return new EStyle ( xml.getAttribute ( "estyle" ) ) ;
  },
  flush: function()
  {
  },
  getPeer: function()
  {
    return this.currentPeer ;
  },
  createPeer: function ( eStyle, xml )
  {
    return new CustomTextField ( eStyle, xml ) ;
  }
} ;
CustomTextFieldFactoryClass.prototype.getDecorationString = function ( eStyle )
{
  var eSub = eStyle.getSubStyle ( "normal" ) ;
  if ( eSub.style.image ) eSub.style.image.type = "sliced" ;
  return eSub.getImageAsString() ;
}

var CustomTextFieldFactory = new CustomTextFieldFactoryClass() ;
TGui.addTagDefinition ( "CustomTextField", CustomTextFieldFactory ) ;
/**
 *  @constructor
 *  @extends CustomTextFieldFactoryClass
 */
var DecoratedTextFieldFactoryClass = function()
{
  Tango.initSuper ( this, CustomTextFieldFactoryClass );
  this.jsClassName = "DecoratedTextFieldFactoryClass" ;
}
DecoratedTextFieldFactoryClass.inherits( CustomTextFieldFactoryClass ) ;

DecoratedTextFieldFactoryClass.prototype.getAxl = function ( dom )
{
  var xml = new TXml ( dom ) ;
  xml.addAttribute ( "mandatory-style-name", "ThemeDecoratedTextFieldMandatory" ) ;
  xml.addAttribute ( "mandatory-blur-style-name", "ThemeDecoratedTextFieldMandatoryBlur" ) ;
  xml.addAttribute ( "normal-style-name", "ThemeDecoratedTextField" ) ;
  return CustomTextFieldFactoryClass.prototype.getAxl.apply ( this, arguments ) ;
}
DecoratedTextFieldFactoryClass.prototype.getEStyle = function ( xml )
{
  var txml = Tango.getThemeXml ( "ContainerDecoration", "textfield" ) ;
  txml.addAttribute ( "padding-ignore", "true" ) ;
  var padding = txml.getPadding() ;
  var o = {} ;
  o.padding = {} ;
  o.padding.top = padding.top ;
  o.padding.left = padding.left ;
  o.padding.bottom = padding.bottom ;
  o.padding.right = padding.right ;
  var eStyle = new EStyle ( o ) ;
  return eStyle ;
}
DecoratedTextFieldFactoryClass.prototype.getDecorationString = function ( eStyle )
{
  return "textfield" ;
}
var DecoratedTextFieldFactory = new DecoratedTextFieldFactoryClass() ;
TGui.addTagDefinition ( "DecoratedTextField", DecoratedTextFieldFactory ) ;

/**
 *  @constructor
 */
var CustomTextField = function ( eStyle, xml )
{
  this.jsClassName = "CustomTextField" ;
  this.eStyle = eStyle ;
}
CustomTextField.prototype.toString = function()
{
  return "(" + this.jsClassName + ")" ;
}
CustomTextField.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  var p = this.eStyle.getPadding() ;

  if ( isNaN ( p.right ) ) p.right = 10 ;
  var x = new TXml ( this.dom ) ;
  var tf = x.getDomByClassName ( this.className ) ;
  if ( ! tf.xClassName ) tf.xClassName = "TextField" ;
  var ib = null ;
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( ch.nodeName == "IMG" )
    {
      ib = ch ; break ;
    }
  }
  tf.xConstraints = new TConstraints() ;
  tf.xConstraints.setRightAttachComponent() ;
  if ( ib )
  {
    tf.xConstraints.parseRight ( "-4" ) ;
    ib.xConstraints = new TConstraints() ;
    ib.xConstraints.parseRight ( "" + p.right ) ;
  }
  else
  {
    tf.xConstraints.parseRight ( "-" + p.right ) ;
  }
}
CustomTextField.prototype.flush = function()
{
  this.dom = null ;
  if ( ! this.eStyle.isCosmos ) 
  {
//    this.eStyle.flush() ;
  }
  this.eStyle = null ;
}

/**
 *  @constructor
 */
var ProgressbarFactoryClass = function()
{
  this.currentPeer = null ;
}
ProgressbarFactoryClass.prototype =
{
  getAxl: function ( dom )
  {
    var xml = new TXml ( dom ) ;
    var style = xml.getAttribute ( "style" ) ;
    if ( ! style ) style = "padding:0px;" ;
    else
    {
      style = style.trim() ;
      if ( style.charAt ( style.length - 1 ) != ';' ) style += ";" ;
      style += "padding:0px;" ;
    }
    var name = xml.getAttribute ( "name" ) ;
    var id = xml.getAttribute ( "id" ) ;
    var x = new TXml() ;
    var xContainer = x.addXml ( "Container" ) ;
    xContainer.addAttribute ( "style", style ) ;
    if ( name ) xContainer.addAttribute ( "name", name ) ;
    if ( id ) xContainer.addAttribute ( "id", id ) ;
    var peer='ProgressbarFactory.getInstance ( x )'
    xContainer.addAttribute ( "peer", peer ) ;
    return x.getDom() ;
  },
  getInstance: function ( x )
  {
    return new Progressbar ( x ) ;
  }
}
var ProgressbarFactory = new ProgressbarFactoryClass() ;
TGui.addTagDefinition ( "Progressbar", ProgressbarFactory ) ;
/**
 *  @constructor
 *  @extends TContainer
 */
var Progressbar = function ( axl )
{
  Tango.initSuper ( this, TContainer, null );
  this.dom = null ;
  this.bar = null ;
  this.first = true ;
  this.initialWidth = 20 ;
  this.jsClassName = "Progressbar" ;
  this.axl = new TXml ( axl ) ;
  var xBar = this.axl.addXml ( "Container" ) ;
  var style = "left:0px;width:" + this.initialWidth + "px;height:20px;bottom:-0;visibility:hidden;" ;
  xBar = this.axl.addXml ( "Container" ) ;
  xBar.addAttribute ( "decoration", "progressbar" ) ;
  xBar.addAttribute ( "style", style ) ;
  xBar.addAttribute ( "name", "bar" ) ;
  this.timer = null ;
  this.dx = 1 ;
  this.axl.addAttribute ( "decoration", "progressbartrough" ) ;
  this.timerMillis = 20 ;
  this._showPercent = true ;
  this._showSeconds = false ;
}
Progressbar.inherits( TContainer ) ;
Progressbar.prototype.showPercent = function ( state )
{
  this._showPercent = state ;
}
Progressbar.prototype.showSeconds = function ( state )
{
  this._showSeconds = state ;
}
Progressbar.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  this.dom.xClassName = "Progressbar" ;
}
Progressbar.prototype.resized = function()
{
  if ( this.first )
  {
    var bar = this.getComponent ( "bar" ) ;
    var barParent = bar.dom.parentNode ;
 
    this.first = false ;
    this.bgLabel = document.createElement ( "span" ) ;
    this.dom.insertBefore ( this.bgLabel, barParent ) ;
    this.bgLabel.innerHTML = "&nbsp;" ;
    this.bgLabel.style.position = "absolute" ;
    this.bgLabel.style.left = "0px" ;
    this.bgLabel.style.top = Math.floor ( ( this.dom.offsetHeight - this.bgLabel.offsetHeight ) / 2 ) + "px" ;
    this.bgLabel.style.width = "100%" ;
    this.bgLabel.style.textAlign = "center" ;
    this.bgLabel.style.backgroundColor = "transparent" ;

    this.fgLabel = document.createElement ( "span" ) ;
    bar.dom.appendChild ( this.fgLabel ) ;
    bar.dom.style.overflow = "hidden" ;
    this.fgLabel.innerHTML = "&nbsp;" ;
    this.fgLabel.style.position = "absolute" ;
    this.fgLabel.style.left = "0px" ;
    this.fgLabel.style.top = Math.floor ( ( bar.dom.offsetHeight - this.fgLabel.offsetHeight ) / 2 ) + "px" ;
    this.fgLabel.style.width = this.bgLabel.offsetWidth + "px" ;
    this.fgLabel.style.textAlign = "center" ;
    this.fgLabel.style.backgroundColor = "transparent" ;

    this.fgLabel.style.visibility = 'hidden' ;
    this.bgLabel.style.visibility = 'hidden' ;
    this.bar = new TContainer ( barParent ) ;
    this.bar.minimumWidth = barParent.decorator.getMinimumWidth() ;
  }
  else
  {
    this.fgLabel.style.width = this.bgLabel.offsetWidth + "px" ;
  }
}
Progressbar.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  if ( this.timer ) { this.timer.stop() ; this.timer.flush() ; }
  this.timer = null ;
}
Progressbar.prototype.getPercent = function()
{
  return this.cPercent ;
}
Progressbar.prototype.setPercent = function ( percent )
{
  this.cPercent = this._setPercent ( percent ) ;
}
Progressbar.prototype._setPercent = function ( percent )
{
  if ( ! percent ) percent = 0 ;
  if ( percent < 0 ) percent = 0 ;
  if ( percent > 100 ) percent = 100 ;
  percent = Math.round ( percent ) ;
  var pix = this.getWidth() * ( percent / 100 ) ;
  var pix = Math.round ( pix ) ;
  if ( pix < this.bar.minimumWidth ) pix = this.bar.minimumWidth ;
  if ( pix != this.bar.getWidth() )
  {
    this.bar.setSize ( pix, this.bar.getHeight() ) ;
    if ( this._showPercent )
    {
      this.fgLabel.innerHTML = percent + "%" ;
      this.bgLabel.innerHTML = percent + "%" ;
      this.fgLabel.style.visibility = 'inherit' ;
      this.bgLabel.style.visibility = 'inherit' ;
    }
    if ( this._showSeconds )
    {
      var nowMillis = new Date().getTime() ;
      var sec = Math.floor ( ( nowMillis - this._startMillis ) / 1000 ) ;

      if ( sec >= 60 )
      {
        var m = Math.floor ( sec / 60 ) ;
        var sec = sec % 60 ;
        if ( sec < 10 ) sec = "0" + sec ;
        this.fgLabel.innerHTML = "" + m + ":" + sec + " min" ;
        this.bgLabel.innerHTML = "" + m + ":" + sec + " min" ;
      }
      else
      {
        this.fgLabel.innerHTML = "" + sec + " sec" ;
        this.bgLabel.innerHTML = "" + sec + " sec" ;
      }
      this.fgLabel.style.visibility = 'inherit' ;
      this.bgLabel.style.visibility = 'inherit' ;
    }
  }
  this.bar.dom.style.visibility = 'inherit' ;
  return percent ;
}
Progressbar.prototype.startAuto = function ( seconds )
{
  this.reset() ;
  if ( !seconds ) seconds = 20 ;
  var n = Math.floor ( ( seconds * 1000 ) / 20 ) ;
  var dx = this.dom.offsetWidth / n ;
  this.dPercent = ( dx / this.dom.offsetWidth ) * 100 ;
  this.cPercent = 0 ;

  if ( ! this.timer )
  {
    var thiz = this ;
    this.timer = new TTimer ( this.timerMillis, function() { thiz.timedOut() ; } ) ;
    this.timer.setInitialDelay ( 1 ) ;
  }
  this.mode = this.MODE_AUTO ;
  this.timer.start() ;
  this._startMillis = new Date().getTime() ;
}
Progressbar.prototype.MODE_WAIT = 1 ;
Progressbar.prototype.MODE_AUTO = 2 ;
Progressbar.prototype.start = function()
{
  this.reset() ;
  if ( ! this.timer )
  {
    var thiz = this ;
    this.timer = new TTimer ( this.timerMillis, function() { thiz.timedOut() ; } ) ;
    this.timer.setInitialDelay ( 1 ) ;
  }
  this.bar.setSize ( this.initialWidth, this.bar.dom.offsetHeight ) ;
  this.bar.setVisible ( true ) ;
  this.dx = 2 ;
  this.mode = this.MODE_WAIT ;
  this.timer.start() ;
  this._startMillis = new Date().getTime() ;
}
Progressbar.prototype.reset = function()
{
  this.stop() ;
}
Progressbar.prototype.stop = function()
{
  if ( this.timer )
  {
    this.timer.stop() ;
  }
  this._setPercent ( 0 ) ;
  this.bar.dom.style.left = "0px" ;
  this.bar.setVisible ( false ) ;
  this.fgLabel.style.visibility = 'hidden' ;
  this.bgLabel.style.visibility = 'hidden' ;
  this.cPercent = 0 ;
}
Progressbar.prototype.timedOut = function()
{
  if ( this.mode == this.MODE_WAIT )
  {
    var x = this.bar.dom.offsetLeft ;
    if ( x + this.dx + this.bar.dom.offsetWidth > this.dom.offsetWidth )
    {
      this.dx *= -1 ;
    }
    else
    if ( x + this.dx < 0 )
    {
      this.dx *= -1 ;
    }
    x = Math.round ( x + this.dx ) ;
    this.bar.dom.style.left = x + "px" ;
  }
  else
  {
    this._setPercent ( this.cPercent ) ;
    this.cPercent += this.dPercent ;
    if ( this.cPercent > 100 )
    {
      if ( this._showSeconds )
      {
        this.cPercent = 0 ;
        this._setPercent ( this.cPercent ) ;
      }
      else
      {
        this.timer.stop() ;
      }
    }
  }
}
/**
 *  @constructor
 */
var ItemViewFactoryClass = function()
{
  this.currentPeer = null ;
  this.jsClassName = "ItemViewFactoryClass" ;
}
ItemViewFactoryClass.prototype =
{
  getAxl: function ( dom )
  {
    var xml = new TXml ( dom ) ;
    var style = xml.getAttribute ( "style" ) ;

    var x = new TXml() ;
    var xContainer = x.addXml ( "Container" ) ;

    xContainer.copyAttributesFrom ( xml ) ;

    if ( style )
    {
      style = style.trim() ;
      if ( style.charAt ( style.length-1 ) != ';' ) style += ';' ;
      if ( style.indexOf ( "overflow" ) < 0 ) style += "overflow:auto;" ;
    }
    else style = "overflow:auto;" ;

    xContainer.addAttribute ( "style", style ) ;
    xContainer.addAttribute ( "class", this._getCssClassName() ) ;

    this.currentPeer = this._createPeer ( xml ) ;
    return x.getDom() ;
  },
  getPeer: function ( x )
  {
    return this.currentPeer ;
  },
  _getCssClassName: function()
  {
    return "ThemeItemView" ;
  },
  _createPeer: function ( xml )
  {
    return new ItemView ( xml ) ;
  }
}
var ItemViewFactory = new ItemViewFactoryClass() ;
TGui.addTagDefinition ( "ItemView", ItemViewFactory ) ;

/**
 *  @constructor
 */
var ViewItemSource = function()
{
  this.jsClassName = "ViewItemSource" ;
}
ViewItemSource.prototype.toString = function()
{
  return "(" + this.jsClassName + ")"
}
ViewItemSource.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
}
/**
 *  @constructor
 *  @extends ViewItemSource
 */
var ViewItemSourceXml = function ( xml, imageName, textName, functionName )
{
  Tango.initSuper ( this, ViewItemSource );
  this.jsClassName = "ViewItemSourceXml" ;
  this.xml = xml ;
  this.imageName = imageName ? imageName : "img" ;
  if ( TSys.isArray ( textName ) )
  {
    this.textArray = textName ;
    textName = null ;
  }
  this.textName = textName ? textName : "text" ;

  this.functionName = functionName ? functionName : "function" ;
}
ViewItemSourceXml.inherits( ViewItemSource ) ;
ViewItemSourceXml.prototype.toString = function()
{
  return ViewItemSource.prototype.toString.apply ( this )
       + "\n  imageName=" + this.imageName
       + "\n  textName=" + this.textName
       + "\n  functionName=" + this.functionName
       + "\n" + this.xml
       ;
}
ViewItemSourceXml.prototype.getElements = function()
{
  if ( ! this.xml ) return [] ;
  var a = [] ;
  var en = this.xml.getEnum ( "row" ) ;
  while ( en.hasNext() )
  {
    var r = en.nextXml() ;
    var e = new ViewItemElement() ;
    e.img = r.getContent ( this.imageName ) ;
    if ( this.textArray )
    {
      for ( var i = 0 ; i < this.textArray.length ; i++ )
      {
        e.text = r.getContent ( this.textArray[i] ) ;
        if ( e.text ) break ;
      }
    }
    else
    {
      e.text = r.getContent ( this.textName ) ;
    }
    var fe = r.getContent ( this.functionName ) ;
    if ( fe )
    {
      e.func = fe ;
      try
      {
        fe = new TFunctionExecutor ( fe ) ;
        e.func = fe ;
      }
      catch ( exc )
      {
log ( exc ) ;
        TSys.log ( exc ) ;
      }
    }
    e.xml = r ;
    a.push ( e ) ;
  }
  return a ;
}
/**
 *  @constructor
 */
var ViewItemElement = function()
{
  this.img = null ;
  this.text = null ;
  this.func = null ;
  this.fExecutor = null ;
  this.xml = null ;
}
ViewItemElement.prototype.getImage = function() { return this.img ; }
ViewItemElement.prototype.getText = function() { return this.text ; }
ViewItemElement.prototype.getFunctionExecutor = function() { return this.fExecutor ; }
ViewItemElement.prototype.getXml = function() { return this.xml ; }
ViewItemElement.prototype.toString = function()
{
  return "(ViewItemElement)[img=" + this.img + ",text=" + this.text + ",func=" + this.func + "]"
}

/**
 *  @constructor
 *  @extends TContainer
 */
var ItemView = function ( axl )
{
  if ( ! axl ) return ;
  Tango.initSuper ( this, TContainer, null );
  this.jsClassName = "ItemView" ;
  this.dom = null ;
  this.first = true ;
  this.mouseInside = false ;
  var items = axl.getXml ( "Items" ) ;
  this.iconWidth = 48 ;
  this.iconHeight = 48 ;
  this.itemWidth = 3 * this.iconWidth ;
  this.itemListener = [] ;
  this.actionListener = [] ;
  this.selectionListener = [] ;

  var il = axl.getAttribute ( "itemlistener" ) ;
  if ( il ) this.addItemListener ( new TFunctionExecutor ( il ) ) ;
  var al = axl.getAttribute ( "actionlistener" ) ;
  if ( al ) this.addActionListener ( new TFunctionExecutor ( al ) ) ;
  var sl = axl.getAttribute ( "selectionlistener" ) ;
  if ( sl ) this.addSelectionListener ( new TFunctionExecutor ( sl ) ) ;

  this.iconWidth = axl.getIntAttribute ( "img-width", this.iconWidth ) ;
  this.iconHeight = axl.getIntAttribute ( "img-height", this.iconHeight ) ;
  if ( ! this.iconWidth ) this.iconWidth = this.iconHeight ;
  if ( ! this.iconHeight ) this.iconHeight = this.iconWidth ;

  this.inline = axl.getBoolAttribute ( "inline", false ) ;
  this.columns = axl.getIntAttribute ( "columns", 0 ) ;
  var itemsource = axl.getAttribute ( "itemsource" ) ;
  var feItemSource = null ;
  if ( itemsource )
  {
    try
    {
      feItemSource = new TFunctionExecutor ( itemsource ) ;
    }
    catch ( exc )
    {
log ( exc ) ;
      TSys.log ( exc ) ;
    }
  }
  if ( feItemSource )
  {
    this.itemSource = feItemSource.execute ( items ) ;
  }
  else
  if ( items ) this.itemSource = new ViewItemSourceXml ( items ) ;

  this._imgUrl = {} ;
}
ItemView.inherits( TContainer ) ;
ItemView.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  this.dom = dom ;
  this.dom.xClassName = "ItemView" ;
  this.dom.xContentIsHtml = true ;
  if ( Tango.ua.realMobile )
  {
    this.addEventListener ( "touchstart", this, this.mousedown ) ;
    this.addEventListener ( "touchend", this, this.mouseout ) ;
  }
  else
  {
    this.addEventListener ( "mousedown", this, this.mousedown ) ;
    this.addEventListener ( "mouseup", this, this.mouseup ) ;
    this.addEventListener ( "dblclick", this, this.dblclick ) ;
    this.addEventListener ( "mouseover", this, this.mouseover ) ;
    this.addEventListener ( "mouseout", this, this.mouseout ) ;
    this.addEventListener ( "mousemove", this, this.mousemove ) ;
  }
  this.update() ;
  var w = TGui.getComputedStyleInt ( this.dom, "width", -1 ) ;
  var h = TGui.getComputedStyleInt ( this.dom, "height", -1 ) ;
  if ( w <= 0 )
  {
    var d = TGui.getComputedStyleInt ( this.dom, "border-left-width", 0 )
          + TGui.getComputedStyleInt ( this.dom, "border-right-width", 0 )
          + TGui.getComputedStyleInt ( this.dom, "padding-left", 0 )
          + TGui.getComputedStyleInt ( this.dom, "padding-right", 0 )
          ;
    if ( this.columns >= 1 )
    {
      this.dom.style.width = ( this.columns * ( this.maxW + this.itemTaraWidth ) + d ) + "px" ;
    }
  }
}
ItemView.prototype.resized = function()
{
  if ( this.first )
  {
    this.first = false ;
  }
}
ItemView.prototype.addItemListener = function ( self, listener )
{
  if ( self && self.jsClassName == "TFunctionExecutor" )
    this.itemListener.push ( self ) ;
  else
    this.itemListener.push ( new TFunctionExecutor ( self, listener ) ) ;
}
ItemView.prototype.addActionListener = function ( self, listener )
{
  if ( self && self.jsClassName == "TFunctionExecutor" )
    this.actionListener.push ( self ) ;
  else
    this.actionListener.push ( new TFunctionExecutor ( self, listener ) ) ;
}
ItemView.prototype.addSelectionListener = function ( self, listener )
{
  if ( self && self.jsClassName == "TFunctionExecutor" )
    this.selectionListener.push ( self ) ;
  else
    this.selectionListener.push ( new TFunctionExecutor ( self, listener ) ) ;
}
ItemView.prototype.fireItemEvent = function ( ev )
{
  for ( var i = 0 ; i < this.itemListener.length ; i++ )
  {
    this.itemListener[i].executeWithEvent ( ev ) ;
    if ( ! this.itemListener ) break ;
    if ( this._flushed ) break ;
  }
}
ItemView.prototype.fireSelectionEvent = function ( ev )
{
  for ( var i = 0 ; i < this.selectionListener.length ; i++ )
  {
    this.selectionListener[i].executeWithEvent ( ev ) ;
    if ( ! this.selectionListener ) break ;
    if ( this._flushed ) break ;
  }
}
ItemView.prototype.fireActionEvent = function ( ev )
{
  for ( var i = 0 ; i < this.actionListener.length ; i++ )
  {
    this.actionListener[i].executeWithEvent ( ev ) ;
    if ( this._flushed ) break ;
  }
  ev.consume() ;
}
ItemView.prototype.flush = function()
{
  if ( this._flushed ) return ;
  this._flushed = true ;
  for ( var i = 0 ; i < this.actionListener.length ; i++ )
  {
    this.actionListener[i].flush() ;
  }
  this.actionListener.length = 0 ;
  this.actionListener = undefined ;
  for ( var i = 0 ; i < this.itemListener.length ; i++ )
  {
    this.itemListener[i].flush() ;
  }
  this.itemListener.length = 0 ;
  this.itemListener = undefined ;
  for ( var i = 0 ; i < this.selectionListener.length ; i++ )
  {
    this.selectionListener[i].flush() ;
  }
  this.selectionListener.length = 0 ;
  this.selectionListener = undefined ;
}
ItemView.prototype.getItemClass = function()
{
  return "ThemeViewItem" ;
}
ItemView.prototype.update = function()
{
  if ( ! this.itemSource ) return ;

  var itemClass = this.getItemClass() ;
  var br = "<br/>" ;
  var st = "" ;
  if ( this.inline ) { br = "" ; st = " style='text-align:left;'" ; }

  var str = "" ;
  var a = this.itemSource.getElements() ;
  var str = "" ;
  for ( var i = 0 ; i < a.length ; i++ )
  {
    var img = a[i].getImage() ;
    img = TGui.translateImageName ( img ) ;
    str += "<span class='" + itemClass + "'" + st + " ><img src='" + img + "' onmousedown='return false;' "
         + "width='" + this.iconWidth + "' height='" + this.iconHeight + "' ></img>" + br 
         + "<span >" + a[i].getText()
         + "</span></span>\n"
         ;
  }

  this.dom.innerHTML = str ;

  var n = 0 ;
  this.maxW = 0 ;
  this.maxH = 0 ;
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( this.inline )
    {
      var lastCh = ch.lastChild ;
      var firstCh = ch.firstChild ;
      this.maxW = Math.max ( this.maxW, ch.firstChild.offsetWidth + 4 + ch.lastChild.offsetWidth ) ;
      this.maxH = Math.max ( this.maxH, Math.max ( ch.firstChild.offsetHeight, ch.lastChild.offsetHeight ) ) ;
    }
    else
    {
      this.maxW = Math.max ( this.maxW, ch.offsetWidth ) ;
    }
    ch.xViewItemElement = a[n++] ;
    ch.xClassName = "ViewItem" ;
  }
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    if ( this.inline )
    {
      ch.style.width = this.maxW + "px" ;
    }
    else
    {
      ch.style.width = this.itemWidth + "px" ;
      this.maxH = Math.max ( this.maxH, ch.offsetHeight ) ;
    }
  }
  this.maxW = 0 ;
  var first = true ;
  for ( var ch = this.dom.firstChild ; ch ; ch = ch.nextSibling )
  {
    if ( ch.nodeType != DOM_ELEMENT_NODE ) continue ;
    ch.style.height = this.maxH + "px" ;
    if ( this.inline )
    {
      var lastCh = ch.lastChild ;
      var firstCh = ch.firstChild ;
      lastCh.style.position = 'absolute' ;
      lastCh.style.left = ( firstCh.offsetLeft + firstCh.offsetWidth + 4 ) + "px" ;
      lastCh.style.top = Math.floor ( ( ch.offsetHeight - lastCh.offsetHeight ) / 2 ) + "px" ;
    }
    this.maxW = Math.max ( this.maxW, ch.offsetWidth ) ;
    if ( first )
    {
      this.itemTaraWidth = TGui.getComputedStyleInt ( ch, "border-left-width", 0 )
                         + TGui.getComputedStyleInt ( ch, "border-right-width", 0 )
                         + TGui.getComputedStyleInt ( ch, "padding-left", 0 )
                         + TGui.getComputedStyleInt ( ch, "padding-right", 0 )
                         + TGui.getComputedStyleInt ( ch, "margin-left", 0 )
                         + TGui.getComputedStyleInt ( ch, "margin-right", 0 )
                         ;
      this.itemTaraHeight = TGui.getComputedStyleInt ( ch, "border-top-width", 0 )
                          + TGui.getComputedStyleInt ( ch, "border-bottom-width", 0 )
                          + TGui.getComputedStyleInt ( ch, "padding-top", 0 )
                          + TGui.getComputedStyleInt ( ch, "padding-bottom", 0 )
                          + TGui.getComputedStyleInt ( ch, "margin-top", 0 )
                          + TGui.getComputedStyleInt ( ch, "margin-bottom", 0 )
                          ;
      first = false ;
    }
    if ( this._imgUrl.normal )
    {
      ch.style.backgroundImage = "url(" + this._imgUrl.normal + "&width=" + ch.offsetWidth + "&height=" + ch.offsetHeight + ")" ;
    }
  }
}
ItemView.prototype.getSelectedItem = function()
{
  return this.selectedItem.xViewItemElement ;
}
ItemView.prototype.getSelectedObject = function()
{
  return this.selectedItem ;
}
ItemView.prototype.mousedown = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  if ( src.xClassName == "ViewItem" )
  {
  }
  else
  if ( src.parentNode.xClassName == "ViewItem" )
  {
    src = src.parentNode ;
  }
  if ( src.xClassName != "ViewItem" ) return ;

  var isNewSelection = this.selectedItem !== src ;
  this.setItemSelected ( this.selectedItem, false ) ;
  this.selectedItem = src ;
  this.setItemSelected ( this.selectedItem, true ) ;
  if ( this.highlightedItem === src )
  {
    this.highlightedItem = null ;
  }
  if ( isNewSelection && this.selectionListener.length )
  {
    ev = new ACSelectionEvent ( event, src.xViewItemElement, TEvent.prototype.ITEM_SELECTED ) ;
    this.fireSelectionEvent ( ev ) ;
  }
}
ItemView.prototype.mouseup = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  if ( src.xClassName == "ViewItem" )
  {
  }
  else
  if ( src.parentNode.xClassName == "ViewItem" )
  {
    src = src.parentNode ;
  }
  if ( src.xClassName != "ViewItem" ) return ;
  if ( src.xViewItemElement.func )
  {
    src.xViewItemElement.func.executeWithEvent ( event ) ;
    return ;
  }
  if ( this.itemListener.length )
  {
    ev = new TItemEvent ( event, src.xViewItemElement, TEvent.prototype.ITEM_SELECTED ) ;
    this.fireItemEvent ( ev ) ;
  }
}
ItemView.prototype.dblclick = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  if ( src.xClassName == "ViewItem" )
  {
  }
  else
  if ( src.parentNode.xClassName == "ViewItem" )
  {
    src = src.parentNode ;
  }
  if ( src.xClassName != "ViewItem" ) return ;
  if ( src.xViewItemElement.func )
  {
    src.xViewItemElement.func.executeWithEvent ( event ) ;
    return ;
  }
  if ( this.actionListener.length )
  {
    var ae = new TActionEvent ( event, "ACTION" )
    ev.setItem ( src.xViewItemElement ) ;
    this.fireActionEvent ( ev ) ;
  }
}
ItemView.prototype.mouseover = function ( event )
{
  if ( new TEvent ( event ).getSource().xClassName != "ViewItem" ) return ;
  this.mouseInside = true ;
}
ItemView.prototype.mouseout = function ( event )
{
  var ev = new TEvent ( event ) ;
  var mx = ev.getX() ;
  var my = ev.getY() ;
  mx -= this.dom.scrollLeft ;
  my -= this.dom.scrollTop ;
  var src = ev.getSource() ;
  var b = this.getBoundsOnPage() ;
  if ( src.xClassName == "ViewItem" )
  {
    if ( b.inside ( mx, my ) ) return ;
  }
  else
  if ( src.parentNode.xClassName == "ViewItem" )
  {
    src = src.parentNode ;
    if ( b.inside ( mx, my ) ) return ;
  }
  if ( src.xClassName != "ItemView" )
  {
    if ( b.inside ( mx, my ) ) return ;
  }
  this.mouseInside = false ;
  if ( this.highlightedItem )
  {
    this.setItemHighlighted ( this.highlightedItem, false )
    this.highlightedItem = undefined ;
  }
}
ItemView.prototype.mousemove = function ( event )
{
  var ev = new TEvent ( event ) ;
  var src = ev.getSource() ;
  if ( src.xClassName == "ViewItem" )
  {
  }
  else
  if ( src.parentNode.xClassName == "ViewItem" )
  {
    src = src.parentNode ;
  }
  if ( src.xClassName != "ViewItem" )
  {
    if ( this.highlightedItem )
    {
      this.setItemHighlighted ( this.highlightedItem, false )
    }
    return ;
  }
  if ( this.highlightedItem === src ) return ;
  if ( this.selectedItem === src ) return ;

  this.setItemHighlighted ( this.highlightedItem, false )
  this.highlightedItem = src ;
  this.setItemHighlighted ( this.highlightedItem, true )
}
ItemView.prototype.setItemSelected = function ( e, state )
{
  if ( ! e ) return ;
  if ( state ) e.className = "ThemeViewItemSelected" ;
  else         e.className = "ThemeViewItem" ;
  this.setItemSelectedImages ( e, state ) ;
}
ItemView.prototype.setItemSelectedImages = function ( e, state )
{
  if ( ! e ) return ;
  if ( state )
  {
    if ( e == this.highlightedItem && this._imgUrl.selectedInside )
      e.style.backgroundImage = "url(" + this._imgUrl.selectedInside + "&width=" + e.offsetWidth + "&height=" + e.offsetHeight + ")" ;
    else
    if ( this._imgUrl.selected )
      e.style.backgroundImage = "url(" + this._imgUrl.selected + "&width=" + e.offsetWidth + "&height=" + e.offsetHeight + ")" ;
    else
      e.style.backgroundImage = "none" ;
  }
  else
  {
    if ( this._imgUrl.normal )
      e.style.backgroundImage = "url(" + this._imgUrl.normal + "&width=" + e.offsetWidth + "&height=" + e.offsetHeight + ")" ;
    else
      e.style.backgroundImage = "none" ;
  }
}
ItemView.prototype.setItemHighlighted = function ( e, state )
{
  if ( ! e ) return ;
  if ( state ) e.className = "ThemeViewItemHighlighted" ;
  else         e.className = "ThemeViewItem" ;
  this.setItemHighlightedImages ( e, state ) ;
}
ItemView.prototype.setItemHighlightedImages = function ( e, state )
{
  if ( ! e ) return ;
  if ( state )
  {
    if ( e === this.selectedItem && this._imgUrl.selectedInside )
      e.style.backgroundImage = "url(" + this._imgUrl.selectedInside + "&width=" + e.offsetWidth + "&height=" + e.offsetHeight + ")" ;
    else
    if ( this._imgUrl.inside )
      e.style.backgroundImage = "url(" + this._imgUrl.inside + "&width=" + e.offsetWidth + "&height=" + e.offsetHeight + ")" ;
    else
      e.style.backgroundImage = "none" ;
  }
  else
  {
    if ( e === this.selectedItem && this._imgUrl.selected )
      e.style.backgroundImage = "url(" + this._imgUrl.selected + "&width=" + e.offsetWidth + "&height=" + e.offsetHeight + ")" ;
    else
    if ( this._imgUrl.normal )
      e.style.backgroundImage = "url(" + this._imgUrl.normal + "&width=" + e.offsetWidth + "&height=" + e.offsetHeight + ")" ;
    else
      e.style.backgroundImage = "none" ;
  }
}
/**
 *  @constructor
 */
var ChoiceButtonFactoryClass = function()
{
  Tango.initSuper ( this, CustomButtonFactoryClass );
  this.jsClassName = "ChoiceButtonFactoryClass" ;
}
ChoiceButtonFactoryClass.inherits( CustomButtonFactoryClass ) ;

ChoiceButtonFactoryClass.prototype.createPeer = function ( eStyle, xml )
{
  return new ChoiceButton ( eStyle, xml ) ;
}
ChoiceButtonFactoryClass.prototype.getEStyle = function ( xml )
{
  xml.addAttribute ( "arrow", "up.down" ) ;
  return new EStyle() ;
}
var ChoiceButtonFactory = new ChoiceButtonFactoryClass() ;
TGui.addTagDefinition ( "ChoiceButton", ChoiceButtonFactory ) ;

/**
 *  @constructor
 *  @extends CustomButton
 */
ChoiceButton = function ( eStyle, xml )
{
  if ( ! eStyle ) return ;
  Tango.initSuper ( this, CustomButton, eStyle, xml );
  this.jsClassName = "ChoiceButton" ;
  this._currentIndex = -1 ;
  this.value = "" ;
  this._valueList = [] ;
  this._textList = [] ;
  this.defaultPosition = "center" ;
  this.position = xml.getAttribute ( "position", this.defaultPosition ) ;
  this.onchange = xml.getAttribute ( "onchange" ) ;
  this.onopen = xml.getAttribute ( "onopen" ) ;
  this.onclose = xml.getAttribute ( "onclose" ) ;
  this.imgWidth = xml.getAttribute ( "img-width" ) ;
  this.imgHeight = xml.getAttribute ( "img-height" ) ;
  var style = xml.getAttribute ( "style" ) ;
  if ( style && style.indexOf ( "text-align" ) >= 0 )
  {
    var aResult = TGui.parseStyle ( style, "text-align" ) ;
    if ( aResult )
    {
      this.textAlign = aResult[1] ;
    }
  }
  if ( xml.get ( "option" ) )
  {
    this.xml = xml ;
  }
}
ChoiceButton.inherits( CustomButton ) ;
ChoiceButton.prototype.getXClassName = function()
{
  return "ChoiceButton";
} ;
ChoiceButton.prototype.getCssClassName = function ( state )
{
  if ( this.pure_css )
  {
    if ( state == "normal" )
      return this.bgNormal && this.bgNormal.startsWith ( "css:" ) ? this.bgNormal.substring ( 4 ) : "" ;
    if ( state == "inside" )
      return this.bgInside && this.bgInside.startsWith ( "css:" ) ? this.bgInside.substring ( 4 ) : "" ;
    if ( state == "pressed" )
      return this.bgPressed && this.bgPressed.startsWith ( "css:" ) ? this.bgPressed.substring ( 4 ) : "" ;
    if ( state == "disabled" )
      return this.bgDisabled && this.bgDisabled.startsWith ( "css:" ) ? this.bgDisabled.substring ( 4 ) : "" ;
    return this.bgNormal.substring ( 4 ) ;
  }
  if ( state == "normal" ) return "ThemePushButton" ;
  if ( state == "inside" ) return "ThemePushButtonInside" ;
  if ( state == "pressed" ) return "ThemePushButtonPressed" ;
  if ( state == "disabled" ) return "ThemePushButtonDisabled" ;
  return "ThemePushButton" ;
} ;
ChoiceButton.prototype.getSelectedItem = function()
{
  return this._valueList[this._currentIndex] ;
}
ChoiceButton.prototype.getSelectedIndex = function()
{
  return this._currentIndex ;
}
ChoiceButton.prototype.select = function ( index )
{
  if ( typeof ( index ) == 'number' )
  {
  }
  else
  if ( typeof ( index ) == 'string' )
  {
    var newIndex = -1 ;
    for ( var i = 0 ; i < this._valueList.length ; i++ )
    {
      if ( index == this._valueList[i] )
      {
        newIndex = i ;
        break ;
      }
    }
    if ( newIndex < 0 )
    {
      for ( var i = 0 ; i < this._valueList.length ; i++ )
      {
        if ( index == this._textList[i] )
        {
          newIndex = i ;
          break ;
        }
      }
    }
    if ( newIndex < 0 )
    {
      newIndex = parseInt ( index ) ;
    }
    index = newIndex ;
  }
  if ( index < 0 || index + 1 > this._valueList.length ) return ;
  this._currentIndex = index ;
  this.value = this._valueList[index] ;
  this.dom.eTxt.innerHTML = this._textList[index] ;
  var p = { dom:this.dom, imgWidth:this.imgWidth, imgHeight:this.imgHeight
	  , useButtonMinimum:true, reverse:this.reverse, stacked:this.stacked
	  , textY:this.textY, imgY:this.imgY
	  , contentOnly:true
	  } ;
  if ( this.textAlign == "left" ) p.alignLeft = true ;
  TGui.layoutButtonLike ( p ) ;
} ;
ChoiceButton.prototype.setClassImages = function ( dom, refresh )
{
  if ( ! refresh ) return ;
  this.setExtendedStyles() ;
  var txml = Tango.getThemeXml ( "Arrow", "up.down" ) ;
  var w = txml.getIntAttribute ( "width", 11 ) ;
  var h = txml.getIntAttribute ( "height", 11 ) ;
  this.dom.eCloser.style.width = w + "px" ;
  this.dom.eCloser.style.height = h + "px" ;
  this.arrowImageUrlNormal = TGui.buildThemeImageUrl ( "Arrow", this.arrow ) ;
  if ( Tango.getThemeXml ( "Arrow", this.arrow + ".inside" ) )
  {
    this.arrowImageUrlInside = TGui.buildThemeImageUrl ( "Arrow", this.arrow + ".inside" ) ;
  }
  else this.arrowImageUrlInside = this.arrowImageUrlNormal ;
  if ( Tango.getThemeXml ( "Arrow", this.arrow + ".pressed" ) )
  {
    this.arrowImageUrlPressed = TGui.buildThemeImageUrl ( "Arrow", this.arrow + ".pressed" ) ;
  }
  else this.arrowImageUrlPressed = this.arrowImageUrlNormal ;
  if ( Tango.getThemeXml ( "Arrow", this.arrow + ".disabled" ) )
  {
    this.arrowImageUrlDisabled = TGui.buildThemeImageUrl ( "Arrow", this.arrow + ".disabled" ) ;
  }
//  else this.arrowImageUrlDisabled = this.arrowImageUrlNormal ;
  var p = { dom:this.dom, imgWidth:this.imgWidth, imgHeight:this.imgHeight
    , useButtonMinimum:true, reverse:this.reverse, stacked:this.stacked
    , textY:this.textY, imgY:this.imgY
    , contentOnly:true
    } ;
  if ( this.textAlign == "left" ) p.alignLeft = true ;
  TGui.layoutButtonLike ( p ) ;
  this.setStyleNormal() ;
  return true ;
}
ChoiceButton.prototype.setExtendedStyles = function()
{
  var txml = Tango.getThemeXml ( "ChoiceButton" ) ;
  if ( txml )
  {
    this.pure_css = false ;
    if ( txml.getBoolAttribute ( "pure-css", false ) )
    {
      this.pure_css = true ;
      var clazz = null ;
      var xstate = null ;
      xstate = txml.get ( "normal" ) ;
      if ( xstate )
      {
        clazz = xstate.getAttribute ( "class" ) ;
        if ( clazz ) this.bgNormal = "css:" + clazz ;
        else         this.bgNormal = "" ;
      }
      xstate = txml.get ( "inside" ) ;
      if ( xstate )
      {
        clazz = xstate.getAttribute ( "class" ) ;
        if ( clazz ) this.bgInside = "css:" + clazz ;
      }
      xstate = txml.get ( "pressed" ) ;
      if ( xstate )
      {
        clazz = xstate.getAttribute ( "class" ) ;
        if ( clazz ) this.bgPressed = "css:" + clazz ;
      }
      xstate = txml.get ( "disabled" ) ;
      if ( xstate )
      {
        clazz = xstate.getAttribute ( "class" ) ;
        if ( clazz ) this.bgDisabled = "css:" + clazz ;
        else         this.bgDisabled = "" ;
      }
    }
    else
    {
      this.bgNormal = TGui.buildThemeImageUrl ( "ChoiceButton", "normal", NaN, NaN ) ;
      this.bgInside = TGui.buildThemeImageUrl ( "ChoiceButton", "inside", NaN, NaN ) ;
      this.bgPressed = TGui.buildThemeImageUrl ( "ChoiceButton", "pressed", NaN, NaN ) ;
      this.bgDisabled = TGui.buildThemeImageUrl ( "ChoiceButton", "disabled", NaN, NaN ) ;
    }
  }
  else
  {
    var txml = Tango.getThemeXml ( "PushButton" ) ;
    this.pure_css = false ;
    if ( txml.getBoolAttribute ( "pure-css", false ) )
    {
      this.pure_css = true ;
      var clazz = null ;
      var xstate = null ;
      xstate = txml.get ( "normal" ) ;
      if ( xstate )
      {
        clazz = xstate.getAttribute ( "class" ) ;
        if ( clazz ) this.bgNormal = "css:" + clazz ;
        else         this.bgNormal = "" ;
      }
      xstate = txml.get ( "inside" ) ;
      if ( xstate )
      {
        clazz = xstate.getAttribute ( "class" ) ;
        if ( clazz ) this.bgInside = "css:" + clazz ;
        else         this.bgInside = "" ;
      }
      xstate = txml.get ( "pressed" ) ;
      if ( xstate )
      {
        clazz = xstate.getAttribute ( "class" ) ;
        if ( clazz ) this.bgPressed = "css:" + clazz ;
        else         this.bgPressed = "" ;
      }
      xstate = txml.get ( "disabled" ) ;
      if ( xstate )
      {
        clazz = xstate.getAttribute ( "class" ) ;
        if ( clazz ) this.bgDisabled = "css:" + clazz ;
        else         this.bgDisabled = "" ;
      }
    }
    else
    {
      this.bgNormal = TGui.buildThemeImageUrl ( "PushButton", "normal", NaN, NaN ) ;
      this.bgInside = TGui.buildThemeImageUrl ( "PushButton", "inside", NaN, NaN ) ;
      this.bgPressed = TGui.buildThemeImageUrl ( "PushButton", "pressed", NaN, NaN ) ;
      this.bgDisabled = TGui.buildThemeImageUrl ( "PushButton", "disabled", NaN, NaN ) ;
    }
  }
} ;
ChoiceButton.prototype.layout = function ( dom, externalAttributes, radioGroups, layoutContext )
{
  var txml = Tango.getThemeXml ( "ChoiceButton" ) ;
  if ( txml && txml.get ( "Style" ) )
  {
    var pad = txml.getPadding ( "Style" ) ;
    pad.apply ( dom ) ;
  }
  else
  {
    var span = document.createElement ( "span" ) ;
    var targetElement = document.body ;
    targetElement.appendChild ( span ) ;
    span.innerHTML = "<span class='ThemePushButton' />" ;
    var e = span.firstChild ;
    var pad = TGui.getPadding ( e ) ;
    pad.apply ( dom ) ;
    span.removeChild ( e ) ;
    targetElement.removeChild ( span ) ;
  }

  if ( this.onchange ) this.onchange = new TFunctionExecutor ( this.onchange, layoutContext ) ;
  if ( this.onopen ) this.onopen = new TFunctionExecutor ( this.onopen, layoutContext ) ;
  if ( this.onclose ) this.onclose = new TFunctionExecutor ( this.onclose, layoutContext ) ;
  if ( this.xml )
  {
    var nmax = 0 ;
    var tmax = "" ;
    var en = this.xml.getEnum ( "option" ) ;
    while ( en.hasNext() )
    {
      var x = en.nextXml() ;
      var str = x.getContent() ;
      var len = str.length ;
      if ( len > nmax )
      {
        nmax = len ;
        tmax = str ;
      }
    }
    this.text = tmax ;
  }
  CustomButton.prototype.layout.apply ( this, arguments ) ;
  if ( this.xml ) this._setRefData ( this.xml ) ;
} ;
ChoiceButton.prototype._menuActionCallback = function ( ev )
{
  var mi = ev.getMenuItem() ;
  var name = mi.getName() ;
  var index = parseInt ( name ) ;
  this.select ( index ) ;
  if ( this.onchange )
  {
    this.onchange.executeWithEvent ( ev ) ; //.getEvent() ) ;
  }
} ;
ChoiceButton.prototype._menuOnOpen = function ( ev )
{
  var pane = ev.getMenu() ;
  var mi = pane.getComponent ( "" + this._currentIndex ) ;
  var locPane = pane.getLocation() ;
  var locMi = mi.getLocation() ;
  var locOnPage = this.getLocationOnPage() ;
  var x = locPane.x ;
  var y = locOnPage.y - locMi.y ;
  pane.setLocation ( x, y ) ;
  this.setStyleNormal() ;
  if ( this.onopen )
  {
    this.onopen.executeWithEvent ( ev ) ;
  }
} ;
ChoiceButton.prototype._menuOnClose = function ( ev )
{
  if ( this.onclose )
  {
    this.onclose.executeWithEvent ( ev ) ;
  }
} ;
ChoiceButton.prototype.getValue = function ( xml )
{
  if ( ! this.getName() ) return ;
  if ( this._currentIndex < 0 ) return ;
  /*
    if ( this.xdefault )
    {
      xml.add ( this.name, this.xdefault ) ;
    }
    return ;
  */
  xml.add ( this.getName(), this._valueList[this._currentIndex] ) ;
}
ChoiceButton.prototype.setValue = function ( xml )
{
  var x = xml.get ( this.getName() ) ;
  if ( ! x )
  {
    if ( xml.getName() == this.getName() ) x = xml ;
  }
  if ( ! x ) return ;
  if ( x.get ( "option" ) )
  {
    this._setRefData ( x ) ;
  }
  if ( x.getContent().trim() ) this.select ( x.getContent().trim() ) ;
}
ChoiceButton.prototype.setRefData = function ( xml )
{
  var x = xml.get ( this.getName() ) ;
  if ( ! x )
  {
    if ( xml.getName() == this.getName() ) x = xml ;
  }
  if ( ! x ) return ;
  this._setRefData ( x ) ;
}
ChoiceButton.prototype.getPopupClassName = function()
{
}
ChoiceButton.prototype._setRefData = function ( x )
{
  var xml = new TXml() ;
  var xPopup = xml.add ( "PopupMenu" ) ;
  xPopup.addAttribute ( "position", this.position ) ;
  xPopup.addAttribute ( "trigger", 'mousedown' ) ;
  xPopup.addAttribute ( "button", 'left' ) ;
  var popupClassName = this.getPopupClassName() ;
  if ( popupClassName ) xPopup.addAttribute ( "class", popupClassName ) ;
  var en = x.elements ( "option" ) ;
  var n = 0 ;
  this._valueList.length = 0 ;
  this._textList.length = 0 ;
  this._currentIndex = -1 ;
  this.value = "" ;
  this._valueList = [] ;
  this._textList = [] ;
  while ( en.hasNext() )
  {
    var xopt = en.nextXml() ;
    var xmi ;
    if ( xopt.getName() == "option" )
    {
      xmi = xPopup.add ( "MenuItem" ) ;
    }
    else
    if ( xopt.getName() == "title" )
    {
      xmi = xPopup.add ( "Title" ) ;
    }
    else
    if ( xopt.getName() == "sep" || xopt.getName() === "separator" )
    {
      xmi = xPopup.add ( "Separator" ) ;
    }
    else
    {
      continue ;
    }
    var txt = xopt.getContent() ;
    var val = xopt.getAttribute ( "value", txt ) ;
    var img = xopt.getAttribute ( "img" ) ;
    xmi.addAttribute ( "text", txt ) ;
    xmi.addAttribute ( "value", val ) ;
    if ( img ) xmi.addAttribute ( "img", img ) ;
    var imgWidth = xopt.getAttribute ( "img-width", this.imgWidth ) ;
    var imgHeight = xopt.getAttribute ( "img-height", this.imgHeight ) ;
    if ( imgWidth ) xmi.addAttribute ( "img-width", imgWidth ) ;
    if ( imgHeight ) xmi.addAttribute ( "img-height", imgHeight ) ;
    xmi.addAttribute ( "name", "" + n ) ;
    this._valueList.push ( val ) ;
    this._textList.push ( txt ) ;
    if ( xopt.getAttribute ( "selected" ) == "selected" || xopt.getAttribute ( "selected" ) == "true" )
    {
      this._currentIndex = n ;
    }
    else
    if ( this._currentIndex < 0 )
    {
      this._currentIndex = 0 ;
    }
    n++ ;
  }
  if ( this.popupMenuWrapper )
  {
    this.popupMenuWrapper._setPopupXml ( xml ) ;
  }
  else
  {
    this.popupMenuWrapper = new PopupMenuWrapper ( xml, this.dom )
    this.popupMenuWrapper._setDefaultAction ( new TFunctionExecutor ( this, this._menuActionCallback ) ) ;
    this.popupMenuWrapper._setOnOpen ( new TFunctionExecutor ( this, this._menuOnOpen ) ) ;
    this.popupMenuWrapper._setOnClose ( new TFunctionExecutor ( this, this._menuOnClose ) ) ;
    this.popupMenuWrapper._setAdjustWidthToAnchor() ;
  }
  this.select ( this._currentIndex ) ;
} ;
