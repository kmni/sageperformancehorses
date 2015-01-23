if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}

function simpleObjInspect(oObj, key, tabLvl)
{
    key = key || "";
    tabLvl = tabLvl || 1;
    var tabs = "";
    for(var i = 1; i < tabLvl; i++){
        tabs += "\t";
    }
    var keyTypeStr = " (" + typeof key + ")";
    if (tabLvl == 1) {
        keyTypeStr = "(self)";
    }
    var s = tabs + key + keyTypeStr + " : ";
    if (typeof oObj == "object" && oObj !== null) {
        s += typeof oObj + "\n";
        for (var k in oObj) {
            if (oObj.hasOwnProperty(k)) {
                s += simpleObjInspect(oObj[k], k, tabLvl + 1);
            }
        }
    } else {
        s += "" + oObj + " (" + typeof oObj + ") \n";
    }
    return s;
}

Social = {
  facebook: function(id, access_token) {
    var params, url;
    url = "https://graph.facebook.com/" + id + "/posts/?callback=?&limit=9";
    params = {
      access_token: access_token
    };
    $.getJSON(url, params, function(data) {
		var posts = data.data.filter(function(post) {			
        return (post.type !== "status" || typeof post.message !== "undefined") && (post.type !== "link" || typeof post.message !== "undefined");
      });
	  
		$.each(posts, function(index, item) {
				if(item['object_id'] !== ''){
					
					var postparams, posturl;
					posturl = "https://graph.facebook.com/" + item['object_id'];
					postparams = {
						//access_token: access_token
					};
					$.getJSON(posturl, postparams, function(postdata) {	
						var $item = $("#facebook").find("#fb_post_" + posts[index]['object_id']);
						$item.find(".photo img").attr("src", postdata['images'][0]['source']);
					});
				}		
		});	  
      $("#facebook").html($.tmpl($("#facebook_template"), posts));
      $("#facebook abbr.timeago").timeago();
      $("#facebook").autolink();
    });
    url = "https://graph.facebook.com/" + id + "/albums/?callback=?";
    $.getJSON(url, params, function(data) {
      var albums = data.data.filter(function(album) {
        return (album.type !== "friends_walls");
      });
      return $("#facebook_albums").html($.tmpl($("#facebook_album_template"), albums));
    });
  },

  facebookPictureURL: function(picture) {
    return unescape(picture);
  },

  twitter: function(id) {
    twitterFetcher.fetch(id, "", 10, true, true, true, Social.twitterDateFormatter, true, function(tweets) {
      var data;
      data = tweets.map(function(tweet) {
        var $tweet;
        $tweet = $(tweet);
        return {
          name: $tweet.find("[data-scribe=\"element:name\"]").html(),
          screen_name: $tweet.find("[data-scribe=\"element:screen_name\"]").html(),
          avatar: $tweet.find("[data-scribe=\"element:avatar\"]").attr("src"),
          tweet: $.mobile ? $tweet.next(".tweet").text() : $tweet.next(".tweet").html(),
          created_at: $tweet.next(".timePosted").text(),
          url: $tweet.find("[data-scribe=\"element:user_link\"]").attr("href")
        };
      });
      $("#twitter").html($.tmpl($("#twitter_template"), data));
      $("#twitter abbr.timeago").timeago();
    });
  },

  twitterDateFormatter: function(date) {
    var pad = function(n) {
      if (n < 10) {
        return "0" + n;
      } else {
        return n;
      }
    };
    return date.getUTCFullYear() + "-" + pad(date.getUTCMonth() + 1) + "-" + pad(date.getUTCDate()) + "T" + pad(date.getUTCHours()) + ":" + pad(date.getUTCMinutes()) + ":" + pad(date.getUTCSeconds()) + "Z";
  },

  vimeoPlayerLoad: function(videoId, autoPlay) {
    $("#vimeo_player").html($.tmpl($("#vimeo_player_template"), {
      id: videoId,
      autoPlay: autoPlay
    }));
  },

  vimeo: function(id, source) {
    var source_path, url;
    switch (source) {
    case "user":
      source_path = "/";
      break;
    case "channel":
      source_path = "/channel/";
    }
    if (!source_path) {
      return;
    }
    url = "http://vimeo.com/api/v2" + source_path + id + "/videos.json?callback=?";
    $.getJSON(url, function(data) {
      $("#vimeo").html($.tmpl($("#vimeo_template"), data));
      $("#vimeo abbr.timeago").timeago();
      $("#vimeo").autolink();
      if (data.length > 0) {
        Social.vimeoPlayerLoad(data[0].id);
      }
      $("#vimeo a.vimeo_link").click(function() {
        Social.vimeoPlayerLoad($(this).attr("id"), true);
        return false;
      });
    });
  },

  youtubePlayerLoad: function(videoId, autoPlay) {
    $("#youtube_player").html($.tmpl($("#youtube_player_template"), {
      id: videoId,
      autoPlay: autoPlay
    }));
  },

  youtube: function(id) {
    var params, url;
    url = "http://gdata.youtube.com/feeds/api/users/" + id + "/uploads?callback=?";
    params = {
      v: 2,
      alt: "json-in-script",
      format: 5
    };
    return $.getJSON(url, params, function(data) {
      var videoIdComponents;
      $("#youtube").html($.tmpl($("#youtube_template"), data.feed.entry));
      $("#youtube abbr.timeago").timeago();
      $("#youtube").autolink();
      if (data.feed.entry.length > 0) {
        videoIdComponents = data.feed.entry[0].id.$t.split(":");
        Social.youtubePlayerLoad(videoIdComponents[videoIdComponents.length - 1]);
      }
      $("#youtube a.youtube_link").click(function() {
        Social.youtubePlayerLoad($(this).attr("id"), true);
        return false;
      });
    });
  },

  formatVideoDuration: function(seconds) {
    var hours, minutes, time;
    hours = Math.floor(seconds / 3600);
    minutes = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = seconds - (hours * 3600) - (minutes * 60);
    time = "";
    if (hours > 0) {
      time = hours + ":";
    }
    if (minutes > 0 || time !== "") {
      minutes = minutes < 10 && time !== "" ? "0" + minutes : String(minutes);
      time += minutes + ":";
    }
    if (time === "") {
      time = seconds + "s";
    } else {
      time += seconds < 10 ? "0" + seconds : String(seconds);
    }
    return time;
  },
  
  combined: function(facebookId, facebookAccessToken, twitterId) {
    var stream = [];
    var facebookLoaded = false;
    var twitterLoaded = false;
    loaded = function() {
      var post, _i, _len, _ref;
      if (facebookLoaded && twitterLoaded) {
        stream.sort(function(a, b) {
          return (a.created_at || a.created_time).slice(0, 19).localeCompare((b.created_at || b.created_time).slice(0, 19));
        });
        $("#combined").empty();
        for (var i = 0; i < stream.length; i++) {
          post = stream[i];
          $("#combined").prepend($.tmpl($(post.created_time ? "#facebook_template" : "#twitter_template"), post));
        }
        $("#combined abbr.timeago").timeago();
        $("#combined .facebook-post").autolink();
      }
    };
    var url = "https://graph.facebook.com/" + facebookId + "/posts/?callback=?";
    var params = {
      access_token: facebookAccessToken,
      fields: "from,type,link,created_time,id,message,picture,caption,description,likes.summary(true),comments.summary(true)"
    };

    $.getJSON(url, params, function(data) {
      var posts = data.data.filter(function(post) {
        return (post.type !== "status" || typeof post.message !== "undefined") && (post.type !== "link" || typeof post.message !== "undefined");
      });
      stream = stream.concat(posts);
      facebookLoaded = true;
      loaded();
    });

    twitterFetcher.fetch(twitterId, "", 10, true, true, true, Social.twitterDateFormatter, true, function(tweets) {
      var data = tweets.map(function(tweet) {
        var $tweet;
        $tweet = $(tweet);
        return {
          name: $tweet.find("[data-scribe=\"element:name\"]").html(),
          screen_name: $tweet.find("[data-scribe=\"element:screen_name\"]").html(),
          avatar: $tweet.find("[data-scribe=\"element:avatar\"]").attr("src"),
          tweet: $.mobile ? $tweet.next(".tweet").text() : $tweet.next(".tweet").html(),
          created_at: $tweet.next(".timePosted").text(),
          url: $tweet.find("[data-scribe=\"element:user_link\"]").attr("href")
        };
      });
      stream = stream.concat(data);
      twitterLoaded = true;
      loaded();
    });
  }
}