//= require ios-switch/switchery
//= require ios-switch/ios-init

//= require tags-input/tagsinput.min
//= require share/tagsinput-init

$(function() {
	$("#btn-show-table").click(function() {
		$(".show-table").show();
		$(".show-block").hide();
		$(this).addClass("active").siblings().removeClass("active");
	})
	$("#btn-show-block").click(function() {
		$(".show-block").show();
		$(".show-table").hide();
		$(this).addClass("active").siblings().removeClass("active");
	})

	$("#del").click(function() {
		var f = confirm("确定要删除该产品吗?");
        if (f == false) {
            return;
        }

		$("#del-material").trigger("submit")
	})

	// 评星
	$(".recom.editable").on("click", ".fa-star", function() {
		var $this = $(this);
		$this.prevAll().andSelf().addClass("active").end().end().nextAll().removeClass("active");
		$("#material_recommend").val($this.index() + 1);
	})

})

$(function() {
	var type = getQueryString('type');
	if (!type) type = 'all';
	$("#filters").find("li[data-type=" + type + "]").addClass("active");
})


function filesize(size) {
  var string;
  if (size >= 100000000000) {
	size = size / 100000000000;
	string = "TB";
  } else if (size >= 100000000) {
	size = size / 100000000;
	string = "GB";
  } else if (size >= 100000) {
	size = size / 100000;
	string = "MB";
  } else if (size >= 100) {
	size = size / 100;
	string = "KB";
  } else {
	size = size * 10;
	string = "b";
  }
  return ((Math.round(size) / 10) + string);
};

$(function() {
	$(".size").each(function() {
		$(this).text(filesize($(this).text()));
	})

	$(".dload").on("click", function() {
		var $form = buildForm();
		$form.attr("action", $(this).data("src"))
		$form.attr("method", "get");
		$form.trigger("submit");
	})
})

function onAddTag(tag) {
    alert("添加标签" + tag);
}
function onRemoveTag(tag) {
    alert("删除标签 " + tag);
}

function onChangeTag(input,tag) {
    alert("修改标签 " + tag);
}

$(function() {
    $('#tags_input').tagsInput({width:'auto'});
});

$(function() {
    $("#matSearch").on("submit", function(e) {
        e.preventDefault();
        var $this = $(this);
        var value = $this.find("input").val();
        if (value)
            window.location = '/manage/materials?name=' + value + '&tag=' + value;
        else
            window.location = '/manage/materials?school=NONE';
        return false;
    });

    if(getQueryString("name")) {
        $("#matSearch").find("input").attr("placeholder", getQueryString("name"));
    }
})
