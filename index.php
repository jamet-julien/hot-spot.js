<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Untitled</title>
        <link rel="author" href="humans.txt">

        <style>
            #result{
                position : relative;
                overflow:hidden;
            }
            #debug, #result{
              display: inline-block;
            }

            .zone{
                position:absolute;
                width:0px;
                height:0px;
                border:150px solid transparent;
                outline:1200px solid rgba(255, 255, 255, 0.85);
            }

            #result img{
            }

            #btn {
              background: #3498db;
              background-image: -webkit-linear-gradient(top, #3498db, #2980b9);
              background-image: -moz-linear-gradient(top, #3498db, #2980b9);
              background-image: -ms-linear-gradient(top, #3498db, #2980b9);
              background-image: -o-linear-gradient(top, #3498db, #2980b9);
              background-image: linear-gradient(to bottom, #3498db, #2980b9);
              -webkit-border-radius: 11;
              -moz-border-radius: 11;
              border-radius: 11px;
              font-family: Arial;
              color: #ffffff;
              font-size: 18px;
              padding: 10px 20px 10px 20px;
              border: solid #5eabdb 1px;
              text-decoration: none;
              cursor:pointer;
              display:inline-block;
            }

            #btn:hover {
              background: #3cb0fd;
              background-image: -webkit-linear-gradient(top, #3cb0fd, #3498db);
              background-image: -moz-linear-gradient(top, #3cb0fd, #3498db);
              background-image: -ms-linear-gradient(top, #3cb0fd, #3498db);
              background-image: -o-linear-gradient(top, #3cb0fd, #3498db);
              background-image: linear-gradient(to bottom, #3cb0fd, #3498db);
              text-decoration: none;
            }

        </style>

    </head>

    <body>
      <h1>SMART CROPPER</h1>
      <input type="range" id="range" value="0" max="14" min="-14" step="1"/><br/>
        <div id="result"></div>
        <div id="debug"></div><br/>
        <input type="text" name="width" id="width" value="300"/>X
        <input type="text" name="height" id="height" value="300"/><br/>
        <input type="file" name="image" id="image"/>


		<script type="text/javascript" src="./js/plugin/hotspot.class.js"></script>

        <script>
        function treatImage(){

          var dataURL = oReader.result,
              oImage  = document.createElement( 'img');
              iWidth  = parseInt( oWidth.value),
              iHeight = parseInt( oHeight.value),
              iX = ( iWidth > 0)? Math.round( iWidth/2)  : 150,
              iY = (iHeight > 0)? Math.round( iHeight/2) : 150;

          oImage.src  = dataURL;

          oSpot = new HotSpot( oImage);
          oSpot.onReady( function(){

            oPreview.innerHTML =
            oDebug.innerHTML   = '';

            oPreview.appendChild( oImage);
            var oZone           = this.getResult(),
                oHotZone        = document.createElement('div');


            var iTop      = Math.round( oZone.y - iX),
                iLeft     = Math.round( oZone.x - iY);



            oHotZone.className         = 'zone';
            oHotZone.style.top         = iTop +'px';
            oHotZone.style.left        = iLeft +'px';
            oHotZone.style.borderWidth = iY+"px "+ iX+"px";

            oPreview.appendChild( oHotZone);
            debugPreview = oSpot.getPreview();
            debugPreview.style.width = "250px";
            oDebug.appendChild( debugPreview);

          }).analyse();

        }


        var oReader   = new FileReader(),
            oSpot     = null,
            oPreview  = document.getElementById( 'result'),
            oDebug    = document.getElementById( 'debug'),
            oInput    = document.getElementById( 'image'),
            oWidth    = document.getElementById( 'width'),
            oRange    = document.getElementById( 'range'),
            oHeight   = document.getElementById( 'height');


        oReader.onload = treatImage;


        oInput.addEventListener( 'change', function(){
              oReader.readAsDataURL( this.files[0]);

            }, false);

        oRange.addEventListener( 'change', function(){
              oSpot.analyse( this.value);
            }, false);

        

        </script>
    </body>

</html>
