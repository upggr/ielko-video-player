function playmedia(type, url) {
  switch (type) {
    case 'm3u8':
      thetype = 'application/x-mpegurl';
      techordernode = '';
      break;
    case 'youtube':
      thetype = 'video/youtube';
      techordernode = '"techOrder": ["youtube"],';
      break;
  }

  $(".upgvid").empty().append(
    '<div id="videoHolder" style="background-image:url();" data-embed="true" class="flowplayer-video videoHolder-322 videoHolder fullscreen-bg playful no-background"> \
    <video id="upgvideoplayer" \
    class="video-js vjs-default-skin vjs-fluid vjs-16-9 vjs-big-play-centered fullscreen-bg__video" \
    controls \
    autoplay \
    data-setup=\'{ \
      ' + techordernode + ' \
    "sources": [{ \
    "type":"' + thetype + '", \
    "src":"' + url + '" \
  }]}\' > \
    </video></div> \
    ');

}