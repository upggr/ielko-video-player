/* The MIT License (MIT)

Copyright (c) 2017-2018 Gino Côté <cotegino@hotmail.com>

https://jsfiddle.net/onigetoc/aw0c0a84/ // TEST ON JSFIDDLE
https://jsfiddle.net/onigetoc/zrxy10ze/ // ADVANCED API
https://jsfiddle.net/onigetoc/j67j939m/ // Dailymotion basic video api
https://jsfiddle.net/onigetoc/ytntz2ux/ // BASED ON MY MULTIPLE DEMO

Dailymotion player api
https://developer.dailymotion.com/player#player-api

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/*global define, Dailymotion*/
(function(root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require('video.js'));
  } else if (typeof define === 'function' && define.amd) {
    define(['videojs'], function(videojs) {
      return (root.Dailymotion = factory(videojs));
    });
  } else {
    root.Dailymotion = factory(root.videojs);
  }
}(this, function(videojs) {
  'use strict';

  var _isOnMobile = videojs.browser.IS_IOS || videojs.browser.IS_ANDROID;
  var Tech = videojs.getTech('Tech');

  var Dailymotion = videojs.extend(Tech, {

    constructor: function(options, ready) {
      Tech.call(this, options, ready);

      this.setPoster(options.poster);
      this.setSrc(this.options_.source, true);

      // Set the vjs-dailymotion class to the player
      // Parent is not set yet so we have to wait a tick
      this.setTimeout(function() {
        if (this.el_) {
          this.el_.parentNode.className += ' vjs-dailymotion';

          if (_isOnMobile) {
            this.el_.parentNode.className += ' vjs-dailymotion-mobile';
          }

          if (Dailymotion.isApiReady) {
            this.initDMPlayer();
          } else {
            Dailymotion.apiReadyQueue.push(this);
          }
        }
      }.bind(this));
    },

    dispose: function() {
      if (this.dmPlayer) {
        //Dispose of the Dailymotion Player
        if (this.dmPlayer.stop) {
          this.dmPlayer.stop();
        }
        if (this.dmPlayer.destroy) {
          this.dmPlayer.destroy();
        }
      } else {
        //Dailymotion API hasn't finished loading or the player is already disposed
        var index = Dailymotion.apiReadyQueue.indexOf(this);
        if (index !== -1) {
          Dailymotion.apiReadyQueue.splice(index, 1);
        }
      }
      this.dmPlayer = null;

      this.el_.parentNode.className = this.el_.parentNode.className
        .replace(' vjs-dailymotion', '')
        .replace(' vjs-dailymotion-mobile', '');
      this.el_.parentNode.removeChild(this.el_);

      //Needs to be called after the Dailymotion player is destroyed, otherwise there will be a null reference exception
      Tech.prototype.dispose.call(this);
    },

    createEl: function() {
      var div = document.createElement('div');
      div.setAttribute('id', this.options_.techId);
      div.setAttribute('style', 'width:100%;height:100%;top:0;left:0;position:absolute');
      div.setAttribute('class', 'vjs-tech');

      var divWrapper = document.createElement('div');
      divWrapper.appendChild(div);

      if (!_isOnMobile && !this.options_.dmControls) {
        var divBlocker = document.createElement('div');
        divBlocker.setAttribute('class', 'vjs-iframe-blocker');
        divBlocker.setAttribute('style', 'position:absolute;top:0;left:0;width:100%;height:100%');

        // In case the blocker is still there and we want to pause
        divBlocker.onclick = function() {
          this.pause();
        }.bind(this);

        divWrapper.appendChild(divBlocker);
      }

      return divWrapper;
    },

    initDMPlayer: function() {
      var playerVars = {
        autoplay: 1,
        //        controls: 0,
        chromeless: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        loop: this.options_.loop ? 1 : 0
      };

      // Let the user set any Dailymotion parameter
      // https://developers.google.com/dailymotion/player_parameters?playerVersion=HTML5#Parameters
      // To use Dailymotion controls, you must use dmControls instead
      // To use the loop or autoplay, use the video.js settings

      if (typeof this.options_.autohide !== 'undefined') {
        playerVars.autohide = this.options_.autohide;
      }

      if (typeof this.options_['cc_load_policy'] !== 'undefined') {
        playerVars['cc_load_policy'] = this.options_['cc_load_policy'];
      }

      if (typeof this.options_.dmControls !== 'undefined') {
        playerVars.controls = this.options_.dmControls;
      }

      if (typeof this.options_.disablekb !== 'undefined') {
        playerVars.disablekb = this.options_.disablekb;
      }

      if (typeof this.options_.end !== 'undefined') {
        playerVars.end = this.options_.end;
      }

      if (typeof this.options_.color !== 'undefined') {
        playerVars.color = this.options_.color;
      }

      if (!playerVars.controls) {
        // Let video.js handle the fullscreen unless it is the Dailymotion native controls
        playerVars.fs = 0;
      } else if (typeof this.options_.fs !== 'undefined') {
        playerVars.fs = this.options_.fs;
      }

      if (typeof this.options_.end !== 'undefined') {
        playerVars.end = this.options_.end;
      }

      if (typeof this.options_.hl !== 'undefined') {
        playerVars.hl = this.options_.hl;
      } else if (typeof this.options_.language !== 'undefined') {
        // Set the Dailymotion player on the same language than video.js
        playerVars.hl = this.options_.language.substr(0, 2);
      }

      if (typeof this.options_['iv_load_policy'] !== 'undefined') {
        playerVars['iv_load_policy'] = this.options_['iv_load_policy'];
      }

      if (typeof this.options_.list !== 'undefined') {
        playerVars.list = this.options_.list;
      } else if (this.url && typeof this.url.listId !== 'undefined') {
        playerVars.list = this.url.listId;
      }

      if (typeof this.options_.listType !== 'undefined') {
        playerVars.listType = this.options_.listType;
      }

      if (typeof this.options_.modestbranding !== 'undefined') {
        playerVars.modestbranding = this.options_.modestbranding;
      }

      if (typeof this.options_.playlist !== 'undefined') {
        playerVars.playlist = this.options_.playlist;
      }

      if (typeof this.options_.playsinline !== 'undefined') {
        playerVars.playsinline = this.options_.playsinline;
      }

      if (typeof this.options_.rel !== 'undefined') {
        playerVars.rel = this.options_.rel;
      }

      if (typeof this.options_.showinfo !== 'undefined') {
        playerVars.showinfo = this.options_.showinfo;
      }

      if (typeof this.options_.start !== 'undefined') {
        playerVars.start = this.options_.start;
      }

      if (typeof this.options_.theme !== 'undefined') {
        playerVars.theme = this.options_.theme;
      }

      // Allow undocumented options to be passed along via customVars
      if (typeof this.options_.customVars !== 'undefined') {
        var customVars = this.options_.customVars;
        Object.keys(customVars).forEach(function(key) {
          playerVars[key] = customVars[key];
          console.log(playerVars[key]);
        });
      }

      this.activeVideoId = this.url ? this.url.videoId : null;
      this.activeList = playerVars.list;

      //      this.dmPlayer = new DM.Player(this.options_.techId, { // GC REMOVE NEW
      this.dmPlayer = new DM.player(this.options_.techId, {
        video: this.activeVideoId,
        params: playerVars,
        events: {
          onReady: this.onPlayerReady.bind(this),
          onPlaybackQualityChange: this.onPlayerPlaybackQualityChange.bind(this),
          onPlaybackRateChange: this.onPlayerPlaybackRateChange.bind(this),
          onStateChange: this.onPlayerStateChange.bind(this),
          onVolumeChange: this.onPlayerVolumeChange.bind(this),
          onError: this.onPlayerError.bind(this)
        }
      });
    },

    onPlayerReady: function() {
      if (this.options_.muted) {
        this.dmPlayer.mute();
      }

      var playbackRates = this.dmPlayer.getAvailablePlaybackRates();
      if (playbackRates.length > 1) {
        this.featuresPlaybackRate = true;
      }

      this.playerReady_ = true;
      this.triggerReady();

      if (this.playOnReady) {
        this.play();
      } else if (this.cueOnReady) {
        //this.cueVideoById_(this.url.videoId);
        this.activeVideoId = this.url.videoId;
      }
    },

    onPlayerPlaybackQualityChange: function() {

    },

    onPlayerPlaybackRateChange: function() {
      this.trigger('ratechange');
    },

    //    DM.onStateChange = function (e) {
    onPlayerStateChange: function(e) {
      var state = e.data;

      if (state === this.lastState || this.errorNumber) {
        return;
      }

      this.lastState = state;

      switch (state) {
        case -1:
          this.trigger('loadstart');
          this.trigger('loadedmetadata');
          this.trigger('durationchange');
          this.trigger('ratechange');
          break;

          //        case 'apiready':
          //          //this.onReady();
          //          this.trigger('apiready');
          //          //this.onReady();
          //          break;

        case DM.PlayerState.ENDED:
          this.trigger('ended');
          break;

        case DM.PlayerState.PLAYING:
          this.trigger('timeupdate');
          this.trigger('durationchange');
          this.trigger('playing');
          this.trigger('play');

          if (this.isSeeking) {
            this.onSeeked();
          }
          break;

        case DM.PlayerState.PAUSED:
          this.trigger('canplay');
          if (this.isSeeking) {
            this.onSeeked();
          } else {
            this.trigger('pause');
          }
          break;

        case DM.PlayerState.BUFFERING:
          this.player_.trigger('timeupdate');
          this.player_.trigger('waiting');
          break;
      }
    },

    onPlayerVolumeChange: function() {
      this.trigger('volumechange');
    },

    onPlayerError: function(e) {
      this.errorNumber = e.data;
      this.trigger('pause');
      this.trigger('error');
    },

    error: function() {
      var code = 1000 + this.errorNumber; // as smaller codes are reserved
      switch (this.errorNumber) {
        case 5:
          return {
            code: code,
            message: 'Error while trying to play the video'
          };

        case 2:
        case 100:
          return {
            code: code,
            message: 'Unable to find the video'
          };

        case 101:
        case 150:
          return {
            code: code,
            message: 'Playback on other Websites has been disabled by the video owner.'
          };
      }

      return {
        code: code,
        message: 'Dailymotion unknown error (' + this.errorNumber + ')'
      };
    },

    loadVideoById_: function(id) {
      var options = {
        video: id
      };
      if (this.options_.start) {
        options.startSeconds = this.options_.start;
      }
      if (this.options_.end) {
        options.endEnd = this.options_.end;
      }


      console.log(options);

      //      this.dmPlayer.load(options); // GC DM LOAD VIDEO
      this.dmPlayer.loadVideoById(options);
    },

    cueVideoById_: function(id) {
      var options = {
        video: id
      };
      if (this.options_.start) {
        options.startSeconds = this.options_.start;
      }
      if (this.options_.end) {
        options.endEnd = this.options_.end;
      }
      this.dmPlayer.cueVideoById(options);
    },

    src: function(src) {
      if (src) {
        this.setSrc({
          src: src
        });
      }

      return this.source;
    },

    poster: function() {
      // You can't start programmaticlly a video with a mobile
      // through the iframe so we hide the poster and the play button (with CSS)
      if (_isOnMobile) {
        return null;
      }

      return this.poster_;
    },

    setPoster: function(poster) {
      this.poster_ = poster;
    },

    setSrc: function(source) {
      if (!source || !source.src) {
        return;
      }

      delete this.errorNumber;
      this.source = source;
      this.url = Dailymotion.parseUrl(source.src);

      //alert(this.url.videoId)
      // GC Dailymotion api json // https://api.dailymotion.com/video/xgz4t1?fields=thumbnail_medium_url

      if (!this.options_.poster) {
        if (this.url.videoId) {
          // Set the low resolution first
          //          this.poster_ = 'https://img.dailymotion.com/vi/' + this.url.videoId + '/0.jpg';
          this.poster_ = 'https://www.dailymotion.com/thumbnail/video/' + this.url.videoId;
          this.trigger('posterchange');

          // Check if their is a high res // GC do not check HD poster Yet
          // this.checkHighResPoster();
        }
      }

      if (this.options_.autoplay && !_isOnMobile) {
        if (this.isReady_) {
          this.play();
        } else {
          this.playOnReady = true;
        }
      } else if (this.activeVideoId !== this.url.videoId) {
        if (this.isReady_) {
          //alert("this.isReady_")
          //this.cueVideoById_(this.url.videoId);
          this.activeVideoId = this.url.videoId;
        } else {
          //alert("cueOnReady")
          this.cueOnReady = true;
        }
      }
    },

    autoplay: function() {
      return this.options_.autoplay;
    },

    setAutoplay: function(val) {
      this.options_.autoplay = val;
    },

    loop: function() {
      return this.options_.loop;
    },

    setLoop: function(val) {
      this.options_.loop = val;
    },

    play: function() {
      if (!this.url || !this.url.videoId) {
        return;
      }

      this.wasPausedBeforeSeek = false;

      if (this.isReady_) {
        if (this.url.listId) {
          if (this.activeList === this.url.listId) {
            this.dmPlayer.play();
          } else {
            this.dmPlayer.loadPlaylist(this.url.listId);
            this.activeList = this.url.listId;
          }
        }

        if (this.activeVideoId === this.url.videoId) {
          this.dmPlayer.play();
        } else {
          this.loadVideoById_(this.url.videoId);
          this.activeVideoId = this.url.videoId;
        }
      } else {
        this.trigger('waiting');
        this.playOnReady = true;
      }
    },

    pause: function() {
      if (this.dmPlayer) {
        alert('pause')
        this.dmPlayer.pause();
      }
    },

    paused: function() {
      return (this.dmPlayer) ?
        (this.lastState !== DM.PlayerState.PLAYING && this.lastState !== DM.PlayerState.BUFFERING) :
        true;
    },

    currentTime: function() {
      return this.dmPlayer ? this.dmPlayer.getCurrentTime() : 0;
    },

    setCurrentTime: function(seconds) {
      if (this.lastState === DM.PlayerState.PAUSED) {
        this.timeBeforeSeek = this.currentTime();
      }

      if (!this.isSeeking) {
        this.wasPausedBeforeSeek = this.paused();
      }

      this.dmPlayer.seekTo(seconds, true);
      this.trigger('timeupdate');
      this.trigger('seeking');
      this.isSeeking = true;

      // A seek event during pause does not return an event to trigger a seeked event,
      // so run an interval timer to look for the currentTime to change
      if (this.lastState === DM.PlayerState.PAUSED && this.timeBeforeSeek !== seconds) {
        clearInterval(this.checkSeekedInPauseInterval);
        this.checkSeekedInPauseInterval = setInterval(function() {
          if (this.lastState !== DM.PlayerState.PAUSED || !this.isSeeking) {
            // If something changed while we were waiting for the currentTime to change,
            //  clear the interval timer
            clearInterval(this.checkSeekedInPauseInterval);
          } else if (this.currentTime() !== this.timeBeforeSeek) {
            this.trigger('timeupdate');
            this.onSeeked();
          }
        }.bind(this), 250);
      }
    },

    seeking: function() {
      return this.isSeeking;
    },

    seekable: function() {
      if (!this.dmPlayer) {
        return videojs.createTimeRange();
      }

      return videojs.createTimeRange(0, this.dmPlayer.getDuration());
    },

    onSeeked: function() {
      clearInterval(this.checkSeekedInPauseInterval);
      this.isSeeking = false;

      if (this.wasPausedBeforeSeek) {
        this.pause();
      }

      this.trigger('seeked');
    },

    playbackRate: function() {
      return this.dmPlayer ? this.dmPlayer.getPlaybackRate() : 1;
    },

    setPlaybackRate: function(suggestedRate) {
      if (!this.dmPlayer) {
        return;
      }

      this.dmPlayer.setPlaybackRate(suggestedRate);
    },

    duration: function() {
      return this.dmPlayer ? this.dmPlayer.getDuration() : 0;
    },

    currentSrc: function() {
      return this.source && this.source.src;
    },

    ended: function() {
      return this.dmPlayer ? (this.lastState === DM.PlayerState.ENDED) : false;
    },

    volume: function() {
      return this.dmPlayer ? this.dmPlayer.getVolume() / 100.0 : 1;
    },

    setVolume: function(percentAsDecimal) {
      if (!this.dmPlayer) {
        return;
      }

      this.dmPlayer.setVolume(percentAsDecimal * 100.0);
    },

    muted: function() {
      return this.dmPlayer ? this.dmPlayer.isMuted() : false;
    },

    setMuted: function(mute) {
      if (!this.dmPlayer) {
        return;
      } else {
        this.muted(true);
      }

      if (mute) {
        this.dmPlayer.mute();
      } else {
        this.dmPlayer.unMute();
      }
      this.setTimeout(function() {
        this.trigger('volumechange');
      }, 50);
    },

    buffered: function() {
      if (!this.dmPlayer || !this.dmPlayer.getVideoLoadedFraction) {
        return videojs.createTimeRange();
      }

      var bufferedEnd = this.dmPlayer.getVideoLoadedFraction() * this.dmPlayer.getDuration();

      return videojs.createTimeRange(0, bufferedEnd);
    },

    // TODO: Can we really do something with this on YouTUbe?
    preload: function() {},
    load: function() {},
    reset: function() {},

    supportsFullScreen: function() {
      return true;
    },

    // Tries to get the highest resolution thumbnail available for the video
    checkHighResPoster: function() {
      var uri = 'https://img.dailymotion.com/vi/' + this.url.videoId + '/maxresdefault.jpg';

      try {
        var image = new Image();
        image.onload = function() {
          // Onload may still be called if Dailymotion returns the 120x90 error thumbnail
          if ('naturalHeight' in image) {
            if (image.naturalHeight <= 90 || image.naturalWidth <= 120) {
              return;
            }
          } else if (image.height <= 90 || image.width <= 120) {
            return;
          }

          this.poster_ = uri;
          this.trigger('posterchange');
        }.bind(this);
        image.onerror = function() {};
        image.src = uri;
      } catch (e) {}
    }
  });

  Dailymotion.isSupported = function() {
    return true;
  };

  Dailymotion.canPlaySource = function(e) {
    return Dailymotion.canPlayType(e.type);
  };

  Dailymotion.canPlayType = function(e) {
    return (e === 'video/dailymotion');
  };

  Dailymotion.parseUrl = function(url) {
    var result = {
      video: null
    };


    var regex = /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
    var match = url.match(regex);
    if (match !== null) {
      if (match[4] !== undefined) {
        //var url.match = match[4];
        result.videoId = match[4];
      }
      //var url.match = match[2];
      result.videoId = match[2];
    }
    //alert(result.videoId);


    // GC YOUTUBE REGEX
    //    var regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    //    var match = url.match(regex);
    //
    //    if (match && match[2].length === 11) {
    //      result.videoId = match[2];
    //    }

    // GC REMOVE PLAYLIST REGEX FOR NOW
    //    var regPlaylist = /[?&]list=([^#\&\?]+)/;
    //    match = url.match(regPlaylist);
    //
    //    if(match && match[1]) {
    //      result.listId = match[1];
    //    }

    return result;
  };

  function apiLoaded() {


    setTimeout(function() {

      //    DM.ready(function() {
      //DM.addEventListener("apiready", function(e) { // GC REMOVE READY FOR NOW

      Dailymotion.isApiReady = true;

      for (var i = 0; i < Dailymotion.apiReadyQueue.length; ++i) {
        Dailymotion.apiReadyQueue[i].initDMPlayer();
      }


      //});

    }, 0);
  }

  function loadScript(src, callback) {
    var loaded = false;
    var tag = document.createElement('script');
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    tag.onload = function() {
      if (!loaded) {
        loaded = true;
        callback();
      }
    };
    tag.onreadystatechange = function() {
      if (!loaded && (this.readyState === 'complete' || this.readyState === 'loaded')) {
        loaded = true;
        callback();
      }
    };
    tag.src = src;
  }

  function injectCss() {
    var css = // iframe blocker to catch mouse events
      '.vjs-dailymotion .vjs-iframe-blocker { display: none; }' +
      '.vjs-dailymotion.vjs-user-inactive .vjs-iframe-blocker { display: block; }' +
      '.vjs-dailymotion .vjs-poster { background-size: cover; }' +
      '.vjs-dailymotion-mobile .vjs-big-play-button { display: none; }';

    var head = document.head || document.getElementsByTagName('head')[0];

    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  }

  Dailymotion.apiReadyQueue = [];

  if (typeof document !== 'undefined') {
    loadScript('https://api.dmcdn.net/all.js', apiLoaded);
    injectCss();
  }

  // Older versions of VJS5 doesn't have the registerTech function
  if (typeof videojs.registerTech !== 'undefined') {
    videojs.registerTech('Dailymotion', Dailymotion);
  } else {
    videojs.registerComponent('Dailymotion', Dailymotion);
  }
}));