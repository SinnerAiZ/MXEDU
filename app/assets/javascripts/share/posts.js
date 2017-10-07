$(function() {
	$(".dropload").on("click", "[role=thumb]", function() {
		if ($(this).hasClass("active")) {
			thumbCancel($(this));
		} else {
			thumbUp($(this));
		}
	})

	$("#lists").on("click mouseover", "[role=comment]", function(e) {
		e.stopPropagation();
	})

	// 设置浏览量， 移动端同样支持，点击触发
	$(".dropload").on("mouseover", ".post-pane", function() {
		var $this = $(this);
		if ($this.data("read")) return false;
		$this.data("read", true)
		$.ajax({
			url: "/posts/" + $this.data("id") + "/read",
			type: "POST",
			success: function() {
			}
		})
	});
})

function thumbUp($ele) {
	$.ajax({
		url: $ele.data("action"),
		type: "POST",
		dataType: "JSON",
		success: function() {
		},
		error: function() {
			showTip(null, 1000, "<i class='fa fa-exclamation text-notice'>操作失败</i>")
			subThumb($ele);
		}
	})
	addThumb($ele);
}

function thumbCancel($ele) {
	if (!$ele.hasClass("active")) return false
	$.ajax({
		url: $ele.data("action"),
		type: "delete",
		dataType: "JSON",
		success: function() {
		},
		error: function() {
			showTip("", 1000, "<i class='fa fa-exclamation text-notice'>操作失败</i>")
			addThumb($ele);
		}
	})
	subThumb($ele);
}


function addThumb($ele) {
	var val = $ele.siblings("span").text();
	if (!val || val == '') val = 0;
	$ele.siblings("span").text(parseInt(val) + 1)
	$ele.removeClass("fa-thumbs-o-up").addClass("active fa-thumbs-up");
}

function subThumb($ele) {
	var val = $ele.siblings("span").text();
	val = parseInt(val) - 1;
	if (val < 0) val = 0;
	$ele.siblings("span").text(val)
	$ele.removeClass("fa-thumbs-up active").addClass("fa-thumbs-o-up");
}

function commentPost() {

}

function commentCmt() {

}
