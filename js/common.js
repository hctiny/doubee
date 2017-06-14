(function($) {
	document.addEventListener("touchmove", function(e) { //disable wechat default scroll
		e.preventDefault();
	}, false);
	Kimkra.patternViewNum = function(num, unit) {
		!unit && (unit = "");
		num = parseInt(num);
		if(num < 100) {
			return num + unit;
		}
		if(num < 1000) {
			return this.patternViewNum((num / 100), "百" + unit)
		}
		if(num < 10000) {
			return this.patternViewNum((num / 1000), "千" + unit);
		}
		if(num < 100000000) {
			return this.patternViewNum((num / 10000), "万" + unit);
		} else {
			return this.patternViewNum((num / 100000000), "亿" + unit);
		}
	}

	function formatTime(value) {
		value = value / 1000;
		var second = parseInt(value);
		var minute = 0;
		var hour = 0;
		if(second > 60) {
			minute = parseInt(second / 60);
			second = parseInt(second % 60);
			if(minute > 60) {
				hour = parseInt(minute / 60);
				minute = parseInt(minute % 60);
			}
		}
		if(second < 10) {
			second = "0" + second;
		}
		var result = "" + second;
		if(minute > 0) {
			if(minute < 10) {
				minute = "0" + minute;
			}
			result = minute + ":" + result;
		} else {
			result = "00:" + result;
		}
		if(hour > 0) {
			if(hour < 10) {
				hour = "0" + hour;
			}
			result = "" + hour + ":" + result;
		}
		return result;
	}

	function _createElement(type, opt) {
		var ele = document.createElement(type);
		for(var i in opt) {
			if(i === "innerHTML") {
				ele.innerHTML = opt[i];
			} else if(i === "innerText") {
				ele.innerText = opt[i]
			} else if(i === "tap") {
				ele.addEventListener("tap", opt[i])
			} else {
				ele.setAttribute(i, opt[i]);
			}
		}
		return ele;
	}
	Kimkra.discussView = function(data) {
		function makeDom(data) {
			var discuss = _createElement("div", {
				class: "discuss flex"
			});
			var dis_head = _createElement("img", {
				class: "discussHead",
				src: data.commentMemberHeadPortrait
			});
			var dis_content = _createElement("div", {
				class: "flex-align-self-center flex-grow"
			});
			var dis_control = _createElement("div", {
				class: "flex flex-spacebetween"
			});
			dis_control.appendChild(_createElement("font", {
				class: "font-size11",
				innerText: data.commentMemberName
			}));
			dis_control.appendChild(_createElement("font", {
				class: "flex-grow"
			}));
			var likeClass = "iconfont icon-zan";
			if(data.bLike) {
				likeClass += " font-red";
			}
			dis_control.appendChild(_createElement("font", {
				class: likeClass,
				innerText: data.likeCount,
				tap: function(e) {
					if(data.bLike) {
						mui.toast("您已点过赞!");
					} else {
						var self = this;
						var curCount = parseInt(self.innerHTML);
						Kimkra.operation("comment", data.id, "like", function(data) {
							self.innerHTML = curCount + 1;
							self.classList.add("font-red");
						});
					}
				}
			}));
			dis_control.appendChild(_createElement("font", {
				class: "iconfont icon-ttpodicon"
			}));
			dis_content.appendChild(dis_control);
			dis_content.appendChild(_createElement("font", {
				class: "warp2",
				innerText: data.commentText
			}))
			discuss.appendChild(dis_head);
			discuss.appendChild(dis_content);
			return discuss;
		}
		var t = document.createDocumentFragment();
		for(var i = 0; i < data.length; i++) {
			t.appendChild(makeDom(data[i]));
		}
		return t;
	}

	Kimkra.videoview = function(data) {
		var content_imgView = _createElement("div", {
			class: "content-imgView"
		});
		var poster = _createElement("div", {
			class: "poster"
		});
		poster.appendChild(_createElement("img", {
			class: "play",
			style: "background-image:url(" + data.posterUrl + ")",
			src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZwAAADhCAYAAAD8igOSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjBCNDE5MUQzNTU1MTFFN0FFQzg4N0UwNjgxQkFBRkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjBCNDE5MUUzNTU1MTFFN0FFQzg4N0UwNjgxQkFBRkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMEI0MTkxQjM1NTUxMUU3QUVDODg3RTA2ODFCQUFGRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMEI0MTkxQzM1NTUxMUU3QUVDODg3RTA2ODFCQUFGRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgQ3IMUAAA2ISURBVHja7N0LcJVV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",
			tap: function() {
				Kimkra.router.load("index.html?m=pages&a=videoViewer&vid=" + data.id);
			}
		}));
		poster.appendChild(_createElement("p", {
			class: "during",
			innerText: formatTime(data.length)
		}));
		content_imgView.appendChild(poster);
		content_imgView.appendChild(_createElement("p", {
			class: "title font-size13",
			innerText: data.title
		}));
		var p = _createElement("p", {
			class: "info-bar flex flex-spacebetween"
		});
		p.appendChild(_createElement("label", {
			class: "from font-size10",
			innerText: data.providerName
		}));
		p.appendChild(_createElement("label", {
			class: "view font-red font-size10",
			innerText: data.browseCount
		}));
		p.appendChild(_createElement("label", {
			class: "flex-grow"
		}));
		p.appendChild(_createElement("label", {
			class: "iconfont icon-zan font-size10",
			innerText: data.likeCount
		}));
		p.appendChild(_createElement("label", {
			class: "iconfont icon-chatlist font-size10",
			innerText: data.commentCount
		}));
		content_imgView.appendChild(p);
		return content_imgView;

	}

	Kimkra.posterView = function(data) {
		var self = this;
		var t = document.createDocumentFragment();
		data.forEach(function(d) {
			console.log(d)
			t.appendChild(self.videoview(d))
		})
		return t;
	}
	Kimkra.rssView = function(data) {
		var self = this;
		var t = document.createDocumentFragment();
		data.forEach(function(d) {
			console.log(d)
			t.appendChild(self.videoview(d))
		})
		return t;
	}

	var CLASS_SLIDER = 'mui-slider';
	var CLASS_SLIDER_GROUP = 'mui-slider-group';
	var CLASS_SLIDER_LOOP = 'mui-slider-loop';
	var CLASS_SLIDER_INDICATOR = 'mui-slider-indicator';
	var CLASS_ACTION_PREVIOUS = 'mui-action-previous';
	var CLASS_ACTION_NEXT = 'mui-action-next';
	var CLASS_SLIDER_ITEM = 'mui-slider-item';

	var CLASS_ACTIVE = 'mui-active';

	var SELECTOR_SLIDER_ITEM = '.' + CLASS_SLIDER_ITEM;
	var SELECTOR_SLIDER_INDICATOR = '.' + CLASS_SLIDER_INDICATOR;
	var SELECTOR_SLIDER_PROGRESS_BAR = '.mui-slider-progress-bar';
	var Autoslider = mui.autoslider = mui.Slider.extend({
		nextItem: function() {
			console.log("nextItem:" + this.slideNumber + 1);
			this._gotoItem(this.slideNumber + 1, this.options.scrollTime, "left");
		},
		prevItem: function() {
			this._gotoItem(this.slideNumber - 1, this.options.scrollTime, "right");
		},
		_gotoItem: function(slideNumber, time, direction) {
			direction && (this.direction = direction);
			this.currentPage = this._getPage(slideNumber, true); //此处传true。可保证程序切换时，动画与人手操作一致(第一张，最后一张的切换动画)
			this.scrollTo(this.currentPage.x, 0, time, this.options.scrollEasing);
			if(time === 0) {
				$.trigger(this.wrapper, 'scrollend', this);
			}
		},
		nextNode: function(node) {
			if(this.slideNumber === 2) {
				this.scroller.appendChild(node);
				this.scroller.children[0].remove();
				this.refresh();
				this.slideNumber += 1;
				this.setTranslate(this._getPage(this.slideNumber).x, 0);
			}

		},
		prevNode: function(node) {
			if(this.slideNumber === 0) {
				this.scroller.insertBefore(node, this.pages[0][0].element);
				this.scroller.children[this.scroller.children.length - 1].remove();
				this.refresh();
				this.slideNumber -= 1;
				this.setTranslate(this._getPage(this.slideNumber).x, 0);
			}
		},
		_triggerSlide: function(e) {
			Kimkra.dispatchTouch = true;
			var self = this;
			self.isInTransition = false;
			self.slideNumber = self._fixedSlideNumber();
			if(!self.lastPage || (self.currentPage.element.id != self.lastPage.element.id)) {
				self.lastPage = self.currentPage;
				mui.trigger(self.wrapper, 'slide', {
					slideNumber: self.slideNumber,
					direction: e.detail.direction
				});
			} else {
				self.currentPage.element.querySelector("iframe").contentWindow.dispatchEvent(new CustomEvent("showVideo"));
			}
			self._initTimer();
		},
		_handleSlide: function(e) {
			var self = this;
			if(e.target !== self.wrapper) {
				return;
			}
			var temps = self.scroller.querySelectorAll(SELECTOR_SLIDER_ITEM);
			var items = [];
			for(var i = 0, len = temps.length; i < len; i++) {
				var item = temps[i];
				if(item.parentNode === self.scroller) {
					items.push(item);
				}
			}
			var _slideNumber = this.slideNumber;
			if(!self.wrapper.classList.contains('mui-segmented-control')) {
				for(var i = 0, len = items.length; i < len; i++) {
					var item = items[i];
					if(item.parentNode === self.scroller) {
						if(i === _slideNumber) {
							item.classList.add(CLASS_ACTIVE);
						} else {
							item.classList.remove(CLASS_ACTIVE);
						}
					}
				}
			}
			e.stopPropagation();
		},
		_drag: function(e) {
			if(Kimkra.dispatchSlider) {
				var direction = e.detail.direction;
				if(direction === "up" || direction === "down") {
					Kimkra.dispatchSlider = false;
				}
				this._super(e);

				if(direction === 'left' || direction === 'right') {
					if(Kimkra.dispatchTouch) {
						//拖拽期间取消所有其他事件
						Kimkra.dispatchTouch = false;
						//拖拽期间隐藏视频 防止x5抽风
						e.target.querySelector("iframe").contentWindow.dispatchEvent(new CustomEvent("hideVideo"));
					}
					//拖拽期间取消定时
					var slidershowTimer = this.wrapper.getAttribute('data-slidershowTimer');
					slidershowTimer && window.clearTimeout(slidershowTimer);
					e.stopPropagation();
				}
			}
		},
		_end: function(e) {
			Kimkra.dispatchSlider = true;
			this.needReset = false;
			if((!this.moved && this.needReset) || e.type === $.EVENT_CANCEL) {
				this.resetPosition();
			}
		},
	})
	mui.fn.autoslider = function(options) {
		var autoslider = null;
		this.each(function() {
			var sliderElement = this;
			if(!this.classList.contains(CLASS_SLIDER)) {
				sliderElement = this.querySelector('.' + CLASS_SLIDER);
			}
			if(sliderElement && sliderElement.querySelector(SELECTOR_SLIDER_ITEM)) {
				var id = sliderElement.getAttribute('data-autoslider');
				if(!id) {
					id = ++mui.uuid;
					$.data[id] = autoslider = new Autoslider(sliderElement, options);
					sliderElement.setAttribute('data-autoslider', id);
				} else {
					autoslider = mui.data[id];
					if(autoslider && options) {
						autoslider.refresh(options);
					}
				}
			}
		});
		return autoslider;
	};

	Kimkra.tagView = function(data) {
		var clientWidth = document.body.clientWidth;
		var fontSize = getStyle(document.getElementsByTagName('html')[0], 'font-size');
		fontSize = fontSize.substr(0, fontSize.length - 2);
		var maxCharLength = clientWidth / fontSize;
		maxCharLength = parseInt(maxCharLength);
		var tagList = document.createDocumentFragment();
		var index = 0,
			totalCharLength = 0,
			tempCharLength = maxCharLength;
		var tagRow = _createElement('div', {
			class: "tagRow"
		});
		for(var i = 0; i < data.length; i++) {
			var temp = data[i];
			var charLength = temp.name.length;
			var classList = {
				class: "tagItem",
				innerText: temp.name,
				id: temp.id
			}
			if(temp.bLike) {
				classList['class'] = "tagItem active";
			}
			var tagItem = _createElement('div', classList);
			if(index % 2 == 0) {
				tempCharLength = parseInt(maxCharLength * 0.75)
			} else {
				tempCharLength = maxCharLength;
			}
			if(totalCharLength + charLength + 3.5 > tempCharLength) {
				tagList.appendChild(tagRow);
				tagRow = _createElement('div', {
					class: "tagRow"
				});
				totalCharLength = 0;
				index++;
			}
			tagRow.appendChild(tagItem);
			totalCharLength += charLength + 3.5;
		}
		tagList.appendChild(tagRow);
		return tagList;
	}

	/**
	 * 获取元素css属性
	 */
	function getStyle(obj, attr) {
		var ie = !+"\v1"; //简单判断ie6~8
		if(attr == "backgroundPosition") { //IE6~8不兼容backgroundPosition写法，识别backgroundPositionX/Y
			if(ie) {
				return obj.currentStyle.backgroundPositionX + " " + obj.currentStyle.backgroundPositionY;
			}
		}
		if(obj.currentStyle) {
			return obj.currentStyle[attr];
		} else {
			return document.defaultView.getComputedStyle(obj, null)[attr];
		}
	}

	Kimkra.rssList = function(list) {
		function makeDom(data) {

			var li = _createElement("li", {
				class: "mui-table-view-cell"
			});
			var a = _createElement("a", {
				class: "mui-navigate-right",
				href: "index.html?m=pages&a=rssDetail&publisherId=" + data.publisherId
			})
			li.appendChild(a);
			var flex = _createElement("div", {
				class: "flex"
			});
			flex.appendChild(_createElement("img", {
				class: "rssHead",
				src: data.headPortrait
			}));
			var flexContent = _createElement("div", {
				class: "flex-align-self-center flex-grow"
			});
			flexContent.appendChild(_createElement("font", {
				class: "font-size12",
				innerText: data.name
			}));
			flexContent.appendChild(_createElement("font", {
				class: "font-size10 warp2",
				innerText: data.discription || "作者懒懒的没有填写任何描述"
			}))
			flex.appendChild(flexContent);
			a.appendChild(flex);
			return li;
		}
		var t = document.createDocumentFragment();
		list.forEach(function(l) {
			t.appendChild(makeDom(l))
		})
		return t;
	}

})(Kimkra)