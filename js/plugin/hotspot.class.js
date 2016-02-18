/**
 * [HotSpot description]
 * @param {[type]} oOption [description]
 */
var HotSpot = function( oImg){
	var self        = this;
	this._oCanvas   = null;
	this._oContext  = null;
	this._fOnReady  = null;
	this._oImg      = null;

	this._oPixel      ='';
	this._iTintMiddle =127.5;
	this._iRatio      = 0;
	this._iRatioMinMax=0;
	this._oTintMax    ={
		value : 0,
		num   : 0
	};
	this._oTintMin    ={
		value : 255,
		num   : 0
	};

	this._iDelta_1      = 0;
	this._iDelta_2      = 0;
	this._iNumPixel   = 0;

	this._oTin      = {
				red:0,
				green:0,
				blue:0
	};


	this._oPosWhite = { count : 0, sumX : 0, sumY : 0};

	this._aMap      = [];


	this._oImg        = oImg;

	this.reset();

};

HotSpot.prototype.reset = function(){
	this._oPixel      = '';
	this._iTintMiddle = 127.5;
	this._oTintMax    = {
		value : 0,
		num   : 0
	};
	this._oTintMin    ={
		value : 255,
		num   : 0
	};

	this._oTin      = {
				red:0,
				green:0,
				blue:0
	};


	this._oPosWhite = { count : 0, sumX : 0, sumY : 0};

	this._aMap      = [ 0,  1 , 0,
									    1, -5 , 1,
									    0,  1 , 0];


};

HotSpot.prototype.findDetailValue = function( _aMap, iRange){

	if( iRange){
		_aMap[4]= parseInt( iRange);

	}else {

		this._iNumPixel = this._oImg.width * this._oImg.height;

		this._iDelta_1    = Math.round(( this._iNumPixel / ( 255 - ( this._oTintMax.value + this._oTintMin.value)))/10000) - 1;
		this._iDelta_2    = Math.round(( this._iNumPixel / ( 255 - (( this._oTintMax.value + this._oTintMin.value + this._iTintMiddle)/3)))/1000) - 1;

		this._iRatio     = ((this._oTintMax.num + this._oTintMin.num)*100)/ this._iNumPixel;
		this._iRatioMinMax  = ((this._oTintMax.num )*100)/ this._oTintMin.num;

		if( this._iRatio < 3){

			_aMap[4]  = ( Number.isFinite( 	this._iDelta_2))? this._iDelta_2 : -5;
		}else{
			_aMap[4]  = ( Number.isFinite( this._iDelta_1))? this._iDelta_1 :  -5;

		}

		if(  this._iRatioMinMax <= 100){
			_aMap[4]  = _aMap[4] * -1;
		}

	}

	return _aMap;
};

HotSpot.prototype.analyse = function( iRange){
	var _aMap;

	this.reset();

	this._oPixel      = this._findPixels( this._oImg);
	this._tintMiddle();

	_aMap = this.findDetailValue( this._aMap, iRange);

	oLog = {
		iNumPixel    : this._iNumPixel,
		iTintMiddle  : this._iTintMiddle,
		oTintMax     : this._oTintMax,
		oTintMin     : this._oTintMin,
		iRatio       : this._iRatio,
		iRatioMinMax : this._iRatioMinMax,
		delta_1      : this._iDelta_1,
		delta_2      : this._iDelta_2,
		aMap         : _aMap[4]
	};

	console.log( oLog);

	var oData  = this._computeMap( _aMap);



	this._oContext.putImageData( oData, 0, 0);

	this._fOnReady.apply( this);

};

/**
 * [getResult description]
 * @return {[type]} [description]
 */
HotSpot.prototype.getResult = function(){

	var oZone = {
		x : Math.round( this._oPosWhite.sumX / this._oPosWhite.count),
		y : Math.round( this._oPosWhite.sumY / this._oPosWhite.count)
	};

	return oZone;
};

/**
 * [getPreview description]
 * @return {[type]} [description]
 */
HotSpot.prototype.getPreview = function(){
	return this._oCanvas;
};

/**
 * [getPixel description]
 * @return {[type]} [description]
 */
HotSpot.prototype.getPixel = function(){
	return this._oPixel;
};

/**
 * [_getPixels description]
 * @param  {[type]} oImg [description]
 * @return {[type]}      [description]
 */
HotSpot.prototype._findPixels = function( oImg){
	this._oCanvas  = this._buildCanvas( oImg.width, oImg.height);
	this._oContext = this._oCanvas.getContext('2d');

	this._oContext.drawImage(oImg, 0, 0);

	return this._oContext.getImageData( 0, 0, this._oCanvas.width, this._oCanvas.height);
};

/**
 * [_buildCanvas description]
 * @param  {[type]} iWidth  [description]
 * @param  {[type]} iHeight [description]
 * @return {[type]}         [description]
 */
HotSpot.prototype._buildCanvas = function( iWidth, iHeight) {
	var oCanvas    = document.createElement('canvas');
	oCanvas.width  = iWidth;
	oCanvas.height = iHeight;
  	return oCanvas;
};

/**
 * [_createImageData description]
 * @param  {[type]} iWidth  [description]
 * @param  {[type]} iHeight [description]
 * @return {[type]}         [description]
 */
HotSpot.prototype._createImageData = function( iWidth, iHeight) {
	return this._oContext.createImageData( iWidth, iHeight);
};

/**
 * [_pushWhite description]
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}   [description]
 */
HotSpot.prototype._pushWhite = function( x, y, aColor){

	var iMoyenne = Math.round(( aColor[0] + aColor[1]+ aColor[2])/30);

	this._oPosWhite.count += (1 * (iMoyenne - this._iTintMiddle));
	this._oPosWhite.sumX += (x * (iMoyenne - this._iTintMiddle));
	this._oPosWhite.sumY += (y * (iMoyenne - this._iTintMiddle));

};

/**
 * [_greyFilter description]
 * @param  {[type]} r [description]
 * @param  {[type]} g [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
HotSpot.prototype._greyFilter = function( r, g, b){

	var iMoyenne = ( r + g+ b)/3;

	if( iMoyenne >  this._iTintMiddle ){
		return { value : 'white'};
	}

	return { value : 'black'};
};

/**
 * [_tintMiddle description]
 * @return {[type]} [description]
 */
HotSpot.prototype._tintMiddle = function(){

	var oPixels    = this.getPixel();
	var aSrc       = oPixels.data;
	var iSrcWidth  = oPixels.width;
	var iSrcHeight = oPixels.height;

	var iCount     = 0;
	var iTotal     = 0;

	for (var y=0; y<iSrcHeight; y++) {

		for (var x=0; x<iSrcWidth; x++) {

			var iGoodP = (( iSrcWidth * y) + x) * 4;

			var r = aSrc[ iGoodP];
      var g = aSrc[ iGoodP + 1];
      var b = aSrc[ iGoodP + 2];

      var iMoyenne = Math.ceil(( r+ g+ b)/3);

      iCount++;
      iTotal += iMoyenne;

			this._oTintMax.value    = Math.max(  iMoyenne, this._oTintMax.value);
			this._oTintMin.value    = Math.min(  iMoyenne, this._oTintMin.value);

			if( iMoyenne == this._oTintMin.value){
				this._oTintMin.num++;
			}

			if( iMoyenne == this._oTintMax.value){
				this._oTintMax.num++;
			}

		}

	}


	this._iTintMiddle = Math.ceil( iTotal/iCount);

};

/**
 * [onReady description]
 * @param  {[type]} fCallBack [description]
 * @return {[type]}           [description]
 */
HotSpot.prototype.onReady = function( fCallBack){
	this._fOnReady = fCallBack;
	return this;
};

/**
 * [_computeMap description]
 * @return {[type]} [description]
 */
HotSpot.prototype._computeMap = function( aMap){


	var oPixels   = this.getPixel();

	var iSide      = Math.round( Math.sqrt( aMap.length));
	var iHalfSide  = Math.floor( iSide/2);

	var aSrc       = oPixels.data;
	var iSrcWidth  = oPixels.width;
	var iSrcHeight = oPixels.height;

	var w         = iSrcWidth;
	var h         = iSrcHeight;
	var oOutput   = this._createImageData( w, h);
	var oDst      = oOutput.data;

	for (var y=0; y<h; y++) {

		for (var x=0; x<w; x++) {

			var sy     = y;
			var sx     = x;
			var iDstOff = ( y * w + x)*4;

			var r = 0, g = 0, b = 0, a=0;

			for (var cy=0; cy < iSide; cy++) {

				for (var cx=0; cx < iSide; cx++) {

					var scy = Math.min( iSrcHeight-1 , Math.max( 0, sy + cy - iHalfSide));
					var scx = Math.min( iSrcWidth -1 , Math.max( 0, sx + cx - iHalfSide));

					var iGoodP = (scy*iSrcWidth+scx)*4;
					var wt     = aMap[cy*iSide+cx];

					r += aSrc[iGoodP] * wt;
					g += aSrc[iGoodP+1] * wt;
					b += aSrc[iGoodP+2] * wt;
				}
			}

			var oColor = this._greyFilter( r, g, b);

			if( oColor.value == 'white'){
				this._pushWhite( x, y, [r, g, b]);
			}

			oDst[iDstOff]   = r;
			oDst[iDstOff+1] = g;
			oDst[iDstOff+2] = b;
			oDst[iDstOff+3] = 255;
		}
	}

	return oOutput;
};
