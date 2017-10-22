function playmedia(type, url) {
  switch (type) {
    case 'm3u8':
    console.log(
      '<div id="videoHolder" style="background-image:url();" data-embed="true" class="flowplayer-video videoHolder-322 videoHolder fullscreen-bg playful no-background"> \
      <video id="upgvideoplayer" \
      class="video-js vjs-default-skin vjs-fluid vjs-16-9 vjs-big-play-centered fullscreen-bg__video" \
      controls \
      autoplay \
      data-setup="{ \
      "sources": [{ \
      "type:"application/x-mpegurl", \
      "src:"' + url + '" \
      }]}"  > \
      </video></div> \
      '
    )
      $(".upgvid").empty().append(
        '<div id="videoHolder" style="background-image:url();" data-embed="true" class="flowplayer-video videoHolder-322 videoHolder fullscreen-bg playful no-background"> \
        <video id="upgvideoplayer" \
        class="video-js vjs-default-skin vjs-fluid vjs-16-9 vjs-big-play-centered fullscreen-bg__video" \
        controls \
        autoplay \
        data-setup="{ \
        "sources": [{ \
        "type:"application/x-mpegurl", \
        "src:"' + url + '" \
        }]}"  > \
        </video></div> \
        ');
      break;

    case 'youtube':
      $(".upgvid").empty().append(
        '<div id="videoHolder" style="background-image:url();" data-embed="true" class="flowplayer-video videoHolder-322 videoHolder fullscreen-bg playful no-background">' +
        '<video' +
        'id="upgvideoplayer"' +
        'class="video-js vjs-default-skin vjs-fluid vjs-16-9 vjs-big-play-centered fullscreen-bg__video" controls autoplay ' +
        'data-setup="{' +
        '"techOrder": ["youtube"],' +
        '"sources": [{' +
        '"type": "video/youtube",' +
        '"src": "https://www.youtube.com/watch?v=xjS6SftYQaQ"' +
        '}]}>' +
        '</video></div>');
      break;
  }
}