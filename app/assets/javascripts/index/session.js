// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(function() {
	var $phone = $("#phone"),
		$code = $("#code");
	$code.on("click", function() {
		var reg = /^1[3|4|5|7|8][0-9]{9}$/; //手机号验证规则
		if(!reg.test($phone.val())) {
			alert("请填写正确的手机号");
			return false;
		}
		$code.addClass("disabled").text("发送中...");
		$.ajax({
			url: "/send_msg",
			type: "post",
			data: {
				"phone": $phone.val(),
				"handle": "login"
			},
			dataType: "json",
			success: function(res) {
				if (res.code == 'Success') {
					$code.attr("disabled", "true");
					var time = 60;
					$code.text(time + "S");
					var i = setInterval(function() {
						$code.text(--time + 'S');
						if (time == 0) {
							$code.removeClass("disabled");
							$code.text("重新发送");
							clearInterval(i);
						}
					}, 1000)
				} else {
					$code.removeClass("disabled").text("获取验证码");
					alert("发送失败,请稍后尝试");
				}
			},
			error: function() {
				$code.removeClass("disabled").text("获取验证码");
				alert("发送失败,请稍后尝试");
			}
		})
	})
});

$(function(){
	$(".btn-login").on("click", function() {
		var $this = $(this);
		$this.attr("disabled", true).html("<small>登录中...</small>");
		$.ajax({
			url: "/login",
			type: "post",
			data: $this.parents("form").serialize(),
			dataType: "json",
			success: function(res) {
				if (res.code == 'Success') {
					window.location = res.url
				} else if (res.code == 'WrongMsgCode') {
					alert("验证码错误")
				} else {
					alert("帐号或密码错误")
				}
			},
			error: function() {
				alert("登录失败");
			},
			complete: function() {
				$this.removeAttr("disabled", true).html("<i class='fa fa-check'></i>");
			}
		})

		return false;
	})
});

// 登录方式切换
$(function() {
	$("#tab-pwd").click(function(e) {
		$("#login-form-pwd").show(300);
		$("#login-form-phone").hide(300);
	})

	$("#tab-phone").click(function() {
		$("#login-form-phone").show(300);
		$("#login-form-pwd").hide(300);
	})
})
