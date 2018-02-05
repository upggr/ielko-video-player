
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>IELKO MULTI PLAYER</title>
  <meta name="author" content="Ioannis Kokkinis">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="HandheldFriendly" content="true">
  <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no">
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
  <style>
    body {
      background-color: #000000;
    }

  </style>

</head>


<body class="container-fluid">

  <div class="row">
    <div class="span6 " style="float: none; margin: 0 auto;">
      <a class="alink" href="play.html?play=http://www.w3schools.com/html/mov_bbb.mp4" target="iframe1">play mp4 file</a> -
      <a class="alink"  href="play.html?play=http://stream.ioniantv.gr:8081/ionian/live/playlist.m3u8" target="iframe1">play m3u8</a> -
      <a class="alink"  href="play.html?play=<?php echo wmsauth('password666','20','http://stream.ioniantv.gr:8081/ionian_locked/live/playlist.m3u8');?>" target="iframe1">play m3u8 (domain lock)</a> -
      <a class="alink"  href="play.html?play=http://stream.ioniantv.gr:8081/ionian/live/playlist_dvr.m3u8" target="iframe1">play m3u8 dvr</a> -
      <a class="alink"  href="play.html?play=<?php echo wmsauth('password666','20','http://stream.ioniantv.gr:8081/ionian_locked/live/playlist_dvr.m3u8');?>" target="iframe1">play m3u8 dvr (domain lock)</a> -
      <a class="alink"  href="play.html?play=http://stream.ioniantv.gr:8081/ionian/live/manifest.mpd" target="iframe1">play mpd</a> -
      <a class="alink"  href="play.html?play=ws://stream.ioniantv.gr:8081/ionian/live" target="iframe1">play SLDP</a> -
      <a class="alink"  href="play.html?play=https://www.youtube.com/watch?v=fdoACP5FKJA" target="iframe1">play youtube</a> -
      <a class="alink"  href="play.html?play=https://vimeo.com/45480883" target="iframe1">play vimeo</a> -
      <a class="alink"  href="play.html?play=http://www.dailymotion.com/video/x6e3bvm" target="iframe1">play dailymotion</a> -
    </div>
  </div>

  <div class="row">
    <div class="span6 " style="float: none; margin: 0 auto;">
  <iframe name="iframe1" class="theiframe" width="720" height="576" scrolling="no" frameborder="0"></iframe>
    </div>
  </div>

  <div class="row">
    <div class="span6 " style="float: none; margin: 0 auto;">
      <div class="msg">
      </div>
    </div>
  </div>

  <div class="row">
    <div class="span6 " style="float: none; margin: 0 auto;">
      <div class="not">
        <a href="http://domain-player.upg.gr/">demo</a>  -  <a href="https://github.com/upggr/ielko-video-player">github</a>
      </div>
    </div>
  </div>


 <script>
      $(document).ready(function() {
        $('.alink').click(function()
 {
     $(".msg").empty().append(this.href);
 });


      })
      </script>
</body>


<?php
function wmsauth($key,$validminutes,$url) {
$var_array = array();
$today = gmdate("n/j/Y g:i:s A");
$initial_url = $url;
$ip = $_SERVER['REMOTE_ADDR'];
$str2hash = $ip . $key . $today . $validminutes;
$md5raw = md5($str2hash, true);
$base64hash = base64_encode($md5raw);
$urlsignature = "server_time=" . $today ."&hash_value=" . $base64hash. "&validminutes=$validminutes";
$base64urlsignature = base64_encode($urlsignature);

$signedurlwithvalidinterval = "$initial_url?wmsAuthSign=$base64urlsignature";
return $signedurlwithvalidinterval;
}

 ?>

