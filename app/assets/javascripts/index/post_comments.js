//= require ../share/lightbox

$(function() {
	$("#comment_form").on("submit", function(e) {
		e.preventDefault()
		return false;
	});

	$("#comment_submit").on("click", function() {
		$("#comment_submit").attr("disabled", true).val("请稍候...")
		showLoading("发表中...");

		if ($("#img-pane .fileBoxUl").find("li.diyUploadHover").not("[error]").length > 0) {
			return false;
		}
		submitPost();
	})

	if ($("#comment-content").html() && $("#comment-content").html().trim() != "") $("#comment_submit").removeAttr("disabled");
	$("#comment-content").on("input", function() {
		if ($(this).html() && $(this).text().trim().length) $("#comment_submit").removeAttr("disabled");
		if (!$(this).html()) $("#comment_submit").attr("disabled", true);
	})

	$("#img-pane").on("click", ".diyDel", function() {
		var $imgInput = $("#comment_images");
		var val = $imgInput.data("value");
		if (!val || typeof(val) != "object") val = {};
		delete(val[$(this).data("img-id")])
		$imgInput.data("value", val);
		$(this).parents("li").remove();
		console.log(val);
	})

	$("#open-img-btn").on("click", function() {
		$("#img-upload").find("input[type=file]").trigger("click");
	})
})

function submitPost(url) {
	var $form = $("#comment_form");
	var url = $form.attr("action");
	// var fd = new FormData($form[0]);
	if ($("#img-pane .fileBoxUl").find("[error]").length > 0) {
		hideLoading();
		alert("请移除上传失败的图片");
		$("#comment_submit").removeAttr("disabled").val("重新发表");
		 return false;
	}
	$.ajax({
		url: url,
		type: "POST",
		dataType: "JSON",
		data: {
			"comment[content]": $form.find("#comment-content").html().trim(),
			"comment[images]": getImages()
		},
		// contentType: false,
		// processData: false,
		success: function(data) {
			window.location = "/posts/" + data.post_id + "?back=-3"
		},
		error: function(error) {
			hideLoading();
			$("#post_submit").removeAttr("disabled").val("发表评论")
		}
	})
}

function getImages() {
	var $imgs = $("#comment_images");
	var imgsObj = $imgs.data("value");
	if (imgsObj && typeof(imgsObj) == 'object') {
		for (var i in imgsObj) {
			if (!i.trim().length) {
				delete imgsObj[i]
			}
		}
		return imgsObj
	}
}
