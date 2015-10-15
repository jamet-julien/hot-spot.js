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

            .zone{
                position:absolute;
                width:0px;
                height:0px;
                border:150px solid transparent;
                outline:600px solid white;
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
        <div id="result"><img src="img/test-<?= rand( 1, 11) ?>.jpg" id="img"/></div>

        <div id="btn">Smart crop !!</div>

		<script type="text/javascript" src="./js/plugin/hotspot.class.js"></script>

        <script>

            var oSpot, oImg  = document.getElementById("img");
            var bCrop = false;
            document.getElementById('btn').addEventListener('click', function(){

                if( !bCrop){

                    oSpot = new HotSpot( oImg);
                    var self = this;
                    oSpot.onReady( function(){
                        var oZone           = this.getResult();
                        var oHotZone        = document.createElement('div');
                        oHotZone.className  = 'zone';
                        oHotZone.style.top  = (oZone.y - 150)+'px';
                        oHotZone.style.left = (oZone.x - 150)+'px';
                        document.getElementById("result").appendChild( oHotZone);

                        self.innerHTML = "New Image ?";
                        bCrop = true;

                    }).analyse();
                }else{
                    location.reload();
                }

            });



            /*
            */


        </script>
    </body>

</html>