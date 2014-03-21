$(document).ready(function(){

	var pages = {
		"bg" : {
			"file" : "bg.txt",
			"label" : "Background"
		},
		"bgc" : {
			"file" : "bgc.txt",
			"label" : "Background-Color"
		},
		"bdr" : {
			"file" : "border.txt",
			"label" : "Border"
		}
	}

	var colorList = Object.create(null);
	var content = "#output";

	$("#sort-by").on("click", "button", function(){
		var $el = $(this);
		$("#sort-by .btn-warning").removeClass("btn-warning");
		$(content).empty();
		if($el.attr("id") == "hex") {
			buildTiles(colorList, sortByHex);
			$el.addClass("btn-warning");
		} else if ($el.attr("id") == "count") {
			buildTiles(colorList, sortByCount);
			$el.addClass("btn-warning");
		}
	});

	$("#chooseFile").on("change", "#file-name", function() {
		var newItem = $(this).val();
		$(content).empty();
		_init(pages[newItem].file);
		$("h1 span").html(pages[newItem].label)
	});



	var checkData = function(data) {
		var regEx = /#([\w]{6}|[\w]{3})|#([\w]{6}|[\w]{3})/
		if(data.match(regEx)) {
			var colors = data.match(regEx);
			var hexColor = colors[0]
			
			var newColor  = Object.create(null);
			newColor.hexColor = hexColor;

			if (colorList[hexColor]) {
				colorList[hexColor].count += 1;
			} else {
				newColor.count = 1;
				colorList[hexColor] = newColor;
			}
		}
	};

	var sortByCount = function(keys, data) {
		return keys.sort(function(a,b){
			return data[b].count - data[a].count;
		});
	};

	var sortByHex = function(keys, data) {
		return keys.sort();
	};

	var buildTiles = function(data,sortType) {

		var keys = Object.keys(data);
		
		$.get('js/template.html', function(tmpl){
			sortType(keys, data).forEach(function(key) {
				var compiled = _.template(tmpl);
				var newTile = $(compiled(data[key]));
				newTile.appendTo(content);
			});
		});	
	}; 

	var buildColors = function(data) {
		var list = data.match(/[^\r\n]+/g);
		for(var i=0;i < list.length; i++) {
			checkData(list[i]);
		}
		console.log(colorList)
		buildTiles(colorList, sortByHex);
	};

	var _init = function(file) {
		$.get(file, function(data) {
			buildColors(data);
		});	
	}

	_init('bg.txt');


});