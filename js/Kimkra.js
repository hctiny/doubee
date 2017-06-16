"use strict";
var Kimkra = {}; +
function($) {
	mui.fn.css = function(key, value) {
		var re = /-(\w)/g;
		key = key.replace(re, function() {
			var args = arguments;
			return args[1].toUpperCase();
		})
		for(var i = 0; i < this.length; i++) {
			this[i].style[key] = value;
		}
		return this;
	}
	$.html = function(html) {
		var div = document.createElement("div");
		div.innerHTML = html;
		return div.childNodes;
	}
	DOMTokenList.prototype.adds = function(tokens) {
		if(!tokens) {
			return;
		}
		tokens.split(" ").forEach(function(token) {
			token && this.add(token);
		}.bind(this));
		return this;
	};
	Date.prototype.pattern = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
			"H+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		var week = {
			"0": "\u65e5",
			"1": "\u4e00",
			"2": "\u4e8c",
			"3": "\u4e09",
			"4": "\u56db",
			"5": "\u4e94",
			"6": "\u516d"
		};
		if(/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		if(/(E+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
		}
		for(var k in o) {
			if(new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	};
	Date.prototype.setDateTime = function(dateTime) {
		var v = dateTime.split(/[- :]/g);
		var d = new Date();
		var yyyy = v[0] ? v[0] : 0,
			MM = v[1] ? v[1] : 0,
			dd = v[2] ? v[2] : 0,
			HH = v[3] ? v[3] : 0,
			mm = v[4] ? v[4] : 0,
			ss = v[5] ? v[5] : 0;
		d.setFullYear(yyyy, MM - 1, dd);
		d.setHours(HH, mm, ss);
		return d;
	};
	Date.prototype.add = function(value, unit) {
		!unit && (unit = 'day');
		unit = unit.toLowerCase();
		if(typeof(value) !== 'number') {
			value = parseInt(value);
		}
		var newDate = new Date(this.getTime());
		switch(unit) {
			case 'day':
				newDate.setDate(this.getDate() + value);
				break;
			case 'month':
				newDate.setMonth(this.getMonth() + value);
				break;
			case 'week':
				newDate.setDate(this.getDate() + value * 7);
				break;
			case 'quarter':
				newDate.setMonth(this.getMonth() + value * 3);
				break;
			case 'year':
				newDate.setFullYear(this.getFullYear() + value);
				break;
			default:
				newDate.setDate(this.getDate() + value);
				break;
		}
		return newDate;
	};
	Date.prototype.getTimeStamp = function() {
		return parseInt(this.getTime() / 1000);
	};
	Date.prototype.setTimeStamp = function(second) {
		if(typeof(second) != 'number') {
			second = parseInt(second);
		}
		this.setTime(second * 1000);
		return this;
	};
	Date.prototype.getAge = function(birthday) {
		if(typeof(birthday) != 'number') {
			if(birthday.indexOf('-')) {
				birthday = new Date().setDateTime(birthday).getTime();
			} else {
				birthday = parseInt(birthday);
			}
		}
		if(birthday.toString().length == 10) {
			birthday = new Date().setTimeStamp(birthday).getTime();
		}
		var birth = new Date(birthday);
		return this.getFullYear() - birth.getFullYear();
	};
	Array.prototype.pushMap = function(pageUrl) {
		if(pageUrl.indexOf("http") < 0) {
			pageUrl = $.Util.root() + pageUrl;
		}
		var i = this.findIndex(function(ele) {
			return ele === pageUrl;
		})
		if(i === -1) {
			i = this.length;
		}
		this.splice(i, this.length);
		this.push(pageUrl);
	}
	Array.prototype.judgeDirect = function(currentUrl, nextUrl) {
		var currentIndex = this.findIndex(function(ele) {
			return ele === currentUrl;
		})
		var nextIndex = this.findIndex(function(ele) {
			return ele === nextUrl;
		})
		var dir = ((currentIndex + 1) === nextIndex);
		if(!dir && currentIndex === 0) {
			return "exit";
		}
		if(currentIndex === -1 || nextIndex === -1) {
			return false;
		}
		return !dir;
	}
	Array.prototype.add = function(a) {
		return this.concat(a);
	}
	Array.prototype.empty = function() {

	}
	if(!Array.prototype.findIndex) {
		Object.defineProperty(Array.prototype, 'findIndex', {
			value: function(predicate) {
				if(this == null) {
					throw new TypeError('"this" is null or not defined');
				}
				var o = Object(this);
				var len = o.length >>> 0;
				if(typeof predicate !== 'function') {
					throw new TypeError('predicate must be a function');
				}
				var thisArg = arguments[1];
				var k = 0;
				while(k < len) {
					var kValue = o[k];
					if(predicate.call(thisArg, kValue, k, o)) {
						return k;
					}
					k++;
				}
				return -1;
			}
		});
	}
	$.showIndicator = function() {
		if(document.querySelector('.kui-indicator')) {
			document.querySelector('.kui-indicator').classList.add("loaded");
			return;
		}
		var indicator = $.html('<div class="kui-indicator"><div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div></div>');
		document.body.appendChild(indicator[0]);
	};
	$.hideIndicator = function() {
		if(document.querySelector('.kui-indicator')) {
			if(document.querySelector('.kui-indicator').classList.contains("loaded")) {
				document.querySelector('.kui-indicator').classList.remove("loaded");
				return
			}
			document.querySelector('.kui-indicator').remove();
		}
	};
	$.Util = {
		getQueryString: function(url) {
			var theRequest = new Object();
			if(url.indexOf("?") != -1) {
				var strs = url.split("?")[1].split("&");
				for(var i = 0; i < strs.length; i++) {
					theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
				}
			}
			return theRequest;
		},
		root: function(url) {
			if(!$.rootPath) {
				var path = location.href.split("/");
				path.pop(path.length);
				$.rootPath = path.join("/") + "/";
			}
			return $.rootPath;
		}
	};
}(Kimkra); +
function($) {
	var EVENTS = {
		pageLoadStart: 'pageLoadStart', // pjax 开始加载新页面前
		pageLoadCancel: 'pageLoadCancel', // 取消前一个 pjax 加载动作后
		pageLoadError: 'pageLoadError', // pjax 加载页面失败后
		pageLoadComplete: 'pageLoadComplete', // pjax 加载页面完成后（不论成功与否）
		pageAnimationEnd: 'pageAnimationEnd', //完成动画
		pageAnimationStart: "pageAnimationStart", //开始动画
		pageInit: 'pageInitInternal' // 目前是定义为一个 page 加载完毕后（实际和 pageAnimationEnd 等同）
	};
	var FROM = {
		new: "new", //新打开页面加载
		open: "open", //正常打开
		popStatus: "popStatus", //前进/后退
		noPush: "noPush", //不记录
	};

	var Router = function() {
		this.cache = {} //页面缓存
		this.xhr = null;
		this.histroys = []; //histroy
		this.currentPage = null;
		this.pageGroup = document.querySelector(".page-group");
		window.addEventListener("popstate", this._onPopState.bind(this));
	};
	Router.prototype.getTarget = function(url) {
		!url && (url = location.href);
		var params = $.Util.getQueryString(url);
		var target = $.Util.root() + params["m"].replace(/_/g, "/") + "/" + params["a"] + ".ka";
		return target;
	};
	Router.prototype.getFullAddress = function(url) {
		var root = $.Util.root();
		if(url.indexOf(root) === -1) {
			url = root + url;
		}
		return url;
	};
	Router.prototype.dispatch = function(event) {
		var e = new CustomEvent(event, {
			bubbles: true,
			cancelable: true
		});
		window.dispatchEvent(e);
	};
	Router.prototype._generateRandomId = function() {
		return "page-" + (+new Date());
	};
	Router.prototype._isSamePage = function(url) {
		return location.href === url;
	}
	Router.prototype.forward = function() {
		window.history.forward();
	};
	Router.prototype.back = function() {
		window.history.back();
	};
	Router.prototype._animateDocument = function($from, $to, direction, param) {
		var pg = this.pageGroup;
		pg.appendChild($from);
		var from = mui($from);
		var to = mui($to);
		var scripts = $from.querySelectorAll("script");
		for(var i = 0; i < scripts.length; i++) {
			eval(scripts[i].innerHTML);
		}
		var dir = direction ? -1 : 1;
		if(direction !== direction) {
			dir = 0;
		}
		var speed = 10;
		var d = speed;
		var doAnimate = function() {
			from.css("-webkit-transform", "translate3d(" + dir * d * (100 / speed) + "%, 0, 0)");
			from.css("opacity", 1 - d / speed / 10);
			to.css("-webkit-transform", "translate3d(" + dir * (d - speed) + "%, 0, 0)");
			to.css("opacity", 0.3 + 0.6 * d / speed);
			d--;
			if(d >= 0) {
				requestAnimationFrame(doAnimate)
			} else {
				$.hideIndicator();
				mui.trigger($from, EVENTS.pageLoadComplete);
				mui.trigger($from, "data", param);
				if($to) {
					pg.removeChild($to);
					$to = null;
				}
				$from = null;
			}
		}
		mui.trigger(window, EVENTS.pageAnimationStart);
		doAnimate();
	};
	Router.prototype._extendHTML = function($doc) {
		var extend = $doc.querySelectorAll("extend");
		if(extend.length === 0) {
			return;
		}
		try {
			for(var i = 0; i < extend.length; i++) {
				var $e = extend[i];
				var ext = {};
				eval($e.innerHTML);
				if(ext && ext.src) {
					var src = $.Util.root() + ext.src;
					mui.ajax({
						type: "get",
						url: src,
						async: false,
						success: function(html) {
							var binds = html.match(/\{\$[\S]*?\}/g);
							binds && (binds.forEach(function(b) {
								var _b = b.replace("{", "").replace("}", "").replace("$", "");
								var content = ext.data;
								_b.split(".").forEach(function(__b) {
									content = content[__b]
								});
								!content && (content = "暂无")
								if(typeof content === "object") {
									content = JSON.stringify(content);
								}
								html = html.replace(b, content);
							}));
							$.html(html).forEach(function(dom) {
								$e.before(dom);
							})
							$e.remove();
						}
					});
				}

			}

			this._extendHTML($doc);
		} catch(_e) {
			console.error(_e);
			document.write(_e)
			return;
		}
	}
	Router.prototype._loadDocument = function(url, callback) {
		if(this.xhr && this.xhr.readyState < 4) {
			this.xhr.onreadystatechange = function() {};
			this.xhr.abort();
			this.dispatch(EVENTS.pageLoadCancel);
		}
		this.dispatch(EVENTS.pageLoadStart);
		callback = callback || {};
		var self = this;
		this.xhr = mui.ajax({
			url: url,
			success: function(data, status, xhr) {
				callback.success && callback.success.call(null, data, status, xhr);
			},
			error: function(xhr, status, err) {
				callback.error && callback.error.call(null, xhr, status, err);
				self.dispatch(EVENTS.pageLoadError);
			},
			complete: function(xhr, status) {
				callback.complete && callback.complete.call(null, xhr, status);
				self.dispatch(EVENTS.pageLoadComplete);
			}
		});
	};

	Router.prototype.load = function(url, param, from, ignoreCache) {
		if(url.indexOf("#") === -1) {
			!from && (from = FROM.open);
			if(this._isSamePage(url) && (from !== FROM.new)) {
				return;
			}
			this._switchToDocument(url, param, from, NaN, ignoreCache);
		} else {
			window.history.pushState('', '', url);
			this.currentPage = url;
		}

	};
	Router.prototype._switchToDocument = function(url, param, from, direct, ignoreCache) {
		url = this.getFullAddress(url);
		var cacheDocument = this.cache[url];

		if(isNaN(direct)) {
			direct = this.histroys.judgeDirect(url, location.href);
		};
		var self = this;
		if(cacheDocument) {
			if(param) {
				cacheDocument.param = param;
			}
			setTimeout(function() {
				self._doSwitchDocument(cacheDocument, from, direct);
			}, 0)
		} else {
			this._loadDocument(this.getTarget(url), {
				success: function(doc) {
					var $dom = $.html(doc)[0]
					self._extendHTML($dom);
					var sectionId = self._generateRandomId();
					$dom.setAttribute("id", sectionId);
					var cache = {
						$doc: $dom,
						id: sectionId,
						url: url,
						param: param
					}
					if(!ignoreCache) {
						self.cache[url] = cache;
					}
					self._doSwitchDocument(cache, from, direct);
				},
				error: function(e) {
					console.error(e);
				}
			});
		}
	};
	Router.prototype._doSwitchDocument = function(obj, from, direct) {
		$.showIndicator();
		var $d = obj.$doc.cloneNode(true);
		if(from == FROM.popStatus) {
			window.history.replaceState('', '', obj.url);
		} else {
			window.history.pushState('', '', obj.url);
		}
		this.histroys.pushMap(location.href);
		var currentDoc = this.pageGroup.querySelector(".page-current");
		this.currentPage = obj.url;
		this._animateDocument($d, currentDoc, direct, obj.param);
	};
	Router.prototype._onPopState = function(e) {
		if(this.currentPage.indexOf("#") === -1) {
			var direction = this.histroys.judgeDirect(this.currentPage, location.href);
			if(direction === "exit") {
				console.log("exit")
				wx.closeWindow();
			} else {
				this._switchToDocument(location.href, null, FROM.popStatus, direction);
			}
		} else {
			this.currentPage = location.href;
			window.dispatchEvent(new CustomEvent("anchorBack", {
				detail: {
					hash: "control"
				}
			}));
		}
	}
	$.router = new Router();
}(Kimkra); +
function($) {
	var settings;
	var tempVideos = {
		list: [],
		temp: {
			topid: null,
			downid: null,
			type: null,
			direction: null,
			pages: null,
			memberId: null
		}
	};
	Kimkra.aaa = tempVideos;
	$.init = function() {
		!settings && (getSettings());
		$.showIndicator();
		$.data = {};
		$.doLogin();
		$.router.load(location.href, {}, "new");
		$.hideIndicator();
		$.dispatchSlider = true;
		$.dispatchTouch = true;
		initVideo();
	}

	function initVideo() {
		var videos = JSON.parse(localStorage.getItem("video"));
		if(videos) {
			$.data.videos = videos
		} else {
			$.data.videos = {
				list: [],
				temp: {
					topid: 0,
					downid: 0,
					type: null,
					direction: null,
					pages: null,
					memberId: null
				}
			}
		}
	}

	$.setVideos = function(type, callback, async) {
		var ajaxParams = {
			type: type
		};
		var argFirst = arguments[3];
		var argSecond = arguments[4];
		switch(type) {
			case "list":
				var direction = argFirst;
				var start = 0;
				if(direction === "up") {
					start = $.data.videos.temp.topid
				} else {
					start = $.data.videos.temp.downid
				}
				ajaxParams["pageSize"] = 10;
				ajaxParams["direction"] = direction;
				ajaxParams["start"] = start;
				break;
			case "goodluck":
				break;
			case "upload":
				var pageNum = argFirst;
				var memberId = argSecond;
				ajaxParams["pageSize"] = 10;
				ajaxParams["pageNum"] = pageNum;
				ajaxParams["memberId"] = memberId;
				break;
			case "favourite":
				var pageNum = argFirst;
				ajaxParams["pageSize"] = 10;
				ajaxParams["pageNum"] = pageNum;
				break;
		}
		$.doAjax("video/videos", ajaxParams, function(d) {
			d.pageList.list = d.pageList.list.sort(function(a,b){
				return b.id - a.id;
			})
			$.tempVideo(type, d, argFirst, argSecond);
			callback && callback(d);
		}, {async: async})
	}
	$.tempVideo = function(type, d) {
		if(!$.data.videos) {
			initVideo();
		}
		if(type !== $.data.videos.temp.type) {
			$.data.videos.list = [];
		}
		$.data.videos.temp.type = type;
		if(type == "list") {
			var direction = arguments[2];
			if(direction === "down") {
				$.data.videos.list = $.data.videos.list.add(d.pageList.list);
			} else {
				$.data.videos.list = d.pageList.list.add($.data.videos.list);
			}
			$.data.videos.temp.direction = direction;
		} else {
			$.data.videos.list = $.data.videos.list.add(d.pageList.list);
		}
		switch(type) {
			case "list":
				$.data.videos.temp.downid = $.data.videos.list[$.data.videos.list.length - 1].id;
				$.data.videos.temp.topid = $.data.videos.list[0].id;
				break;
			case "goodluck":
				break;
			case "upload":
				var pageNum = arguments[2];
				var memberId = arguments[3];
				$.data.videos.temp.pages = pageNum;
				$.data.videos.temp.memberId = memberId;
				break;
			case "favourite":
				var pageNum = arguments[2];
				$.data.videos.temp.pages = pageNum;
				break;
		}
		localStorage.setItem("video", JSON.stringify($.data.videos));
	}

	function isInRouterBlackList($link) {
		var classBlackList = [
			'external',
			'tab-link',
			'open-popup',
			'close-popup',
			'open-panel',
			'close-panel'
		];
		for(var i = classBlackList.length - 1; i >= 0; i--) {
			if($link.classList.contains(classBlackList[i])) {
				return true;
			}
		}
		return false;
	}
	mui(document).on('tap', 'a', function(e) {
		var $target = e.target;
		if(isInRouterBlackList($target)) {
			return;
		}
		e.preventDefault();
		if($target.classList.contains('back')) {
			router.back();
		} else {
			var url = $target.href;
			if(!url || $target.href.indexOf("#") != -1) {
				return;
			}
			$.router.load(url);
		}
	});

	mui(window).on('pageAnimationStart', function() {
		//TODO:: 关闭一些popover
		var $body = $("body");
		if($body.hasClass("mui-poppicker-active-for-page")) {
			$(".mui-poppicker").remove();
			$(".mui-backdrop").remove();
			$body.removeClass("mui-poppicker-active-for-page");
		}
		if($body.hasClass("mui-popup-active-for-page")) {
			$(".mui-popup").remove();
			$(".mui-popup-backdrop").remove();
			$body.removeClass("mui-popup-active-for-page");
		}
		if($body.hasClass("mui-dtpicker-active-for-page")) {
			$(".mui-dtpicker").remove();
			$(".mui-backdrop").remove();
			$body.removeClass("mui-dtpicker-active-for-page");
		}
		if($body.hasClass("mui-popover-active-for-page")) {
			$(".mui-popover").css("display", "none");
			$(".mui-popover").removeClass("mui-active");
			$(".mui-backdrop").remove();
			$body.removeClass("mui-popover-active-for-page");
		}
		if($body.hasClass("mui-guide-active-for-page")) {
			$(".mui-backdrop").remove();
			$body.removeClass("mui-guide-active-for-page");
		}
	});

	function getSettings() {
		mui.ajax({
			type: "get",
			url: "data/settings.json",
			async: false,
			success: function(d) {
				settings = d;
			}
		});
	}

	$.doAjax = function(url, data, callback, opt) {
		var _opt = {
			type: "get",
			async: true
		};
		opt = mui.extend(_opt, opt, false);
		!opt && (opt = {})
		$.showIndicator();
		mui.ajax({
			type: opt.type,
			url: settings.server + url,
			data: data,
			async: opt.async,
			success: function(d) {
				$.hideIndicator();
				callback && callback(d.data);
			},
			error: function(e) {
				console.error(e);
				mui.toast("系统出错，请稍后再试")
				$.hideIndicator();
			}
		});
	};
	$.doLogin = function() {
		$.doAjax("member/memberInfo", {}, function(d) {
			$.data.userInfo = d;
		}, {
			async: false
		})
	}
	$.operation = function(type, id, operation, callback) {
		$.doAjax("video/operation/"+id, {
			type: type,
			operation: operation
		}, function(data) {
			callback && callback(data);
		});
	}
	$.getVideoList = function(direction, videoId, resultCall) {
		localStorage.setItem('playVideoId', videoId);
		if(!$.data.videos) {
			initVideo();
		}
		var videoIndex = $.data.videos.list.findIndex(function(v){
			return v.id == videoId;
		});
		if($.data.videos.temp.type === "list"){
			if(direction === "left" && videoIndex > $.data.videos.list.length - 3){
				$.setVideos($.data.videos.temp.type, null,true, "down");
			}else if(direction == "right" && videoIndex < 2){
				$.setVideos($.data.videos.temp.type, null,true, "up");
			}else if(direction == "all"){
				if(videoIndex < 2){
					$.setVideos($.data.videos.temp.type, function(d){
						resultCall($.data.videos.list);
					},false, "up");
				}else if(videoIndex > $.data.videos.list.length - 3){
					$.setVideos($.data.videos.temp.type, function(d){
						resultCall($.data.videos.list);
					},false, "down");
				}else{
					resultCall($.data.videos.list);
				}
				return;
			}
		}else{
			if(videoIndex > $.data.videos.list.length - 3){
				$.setVideos($.data.videos.temp.type, null,true, $.data.videos.temp.pages, $.data.videos.temp.memberId);
			}
		}
		resultCall($.data.videos.list);
	}
}(Kimkra)