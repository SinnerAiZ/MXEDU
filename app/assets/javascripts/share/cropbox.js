//= require cropper

/**
 * 图片裁剪
 *
 */
var imageFile = $('#imagefile');
var inputFile = $("#inputFile");
var x = $("#posi_x"),
    y = $("#posi_y"),
    width = $("#img_width"),
    height = $("#img_height"),
    rotate = $("#img_rotate");
var options = {
    //在这里改变裁剪框默认大小 删除即不制定裁剪比例
    aspectRatio: 1 / 1,
    minContainerHeight: 100,
    minContainerWidth: 100,
    preview: '.imgpreview',
    //the crop box should be within the canvas 0:后端补白
    viewMode: 1,
    crop: function(e) {
        x.val(e.x);
        y.val(e.y);
        width.val(e.width);
        height.val(e.height);
        rotate.val(e.rotate);
    }
};

//裁剪函数初始化
function croppics() {
    imageFile.cropper(options);
    //逆时针90度
    $('#lrotate').click('built.cropper', function() {
        imageFile.cropper('rotate', -90);
    });
    //顺时针90度
    $('#rrotate').click('built.cropper', function() {
        imageFile.cropper('rotate', 90);
    });
    //初始化还原
    $('#reset').click('built.cropper', function() {
        imageFile.cropper('reset');
    });
}

function showModal() {
    //启用模态框以及初始化裁剪(因为退出modal摧毁了画布所以要重新初始化)
    croppics();

    imageFile.cropper(options);
    $('#cropModal').modal();
    //裁剪图片
    inputFile.change(imageCrop);
}
//图像裁剪
function imageCrop() {
    //判断上传文件是否具有可裁剪属性
    var crop = this.classList.contains("cropable");
    if (window.FileReader && crop) {
        var fileType = /^image\//;
        var files = this.files[0];
        if (fileType.test(files.type)) {
            var maxNameLength = 15;
            var name = files.name;
            //列出文件名 需要修改 比如一个中文字符等价于两个英文字符eg..
            if (name.length > maxNameLength) {
                $('#alertType').text(name.slice(0, maxNameLength) + "...");
            } else {
                $('#alertType').text(name);
            }
            var reader = new FileReader();
            reader.onload = function() {
                var url = reader.result;
                imageFile.attr("src", url);
                //动态替换图片
                imageFile.cropper('replace', url);
            }
            reader.readAsDataURL(this.files.item(0));
        } else $('#alertType').text("！ 请上传正确格式图片");
    }
}

function uploadCrop(name, ajaxUrl, successUrl) {
    var url = imageFile.attr("src");
    // 上传后端进行压缩处理
    var croppedImage = imageFile.cropper("getCroppedCanvas");
    try {
        var fd = new FormData($("#cropForm")[0]);
        $.ajax({
            url: ajaxUrl,
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            success: function() {
                $('#cropModal').modal('hide');
                var accountId = $('#navAvatar').data("id");
                $.ajax({
                    url: successUrl + accountId,
                    type: "get",
                    dataType: "json",
                    success: function(data, status) {
                        var avatarUrl = data.avatar.url;
                        if (avatarUrl) {
                            $('#manAvatar').attr("src", avatarUrl);
                            $('#navAvatar').attr("src", avatarUrl);
                        } else {
                            window.location = location;
                        }
                    },
                    error: function() {
                        window.location = location;
                    }
                });
            },
            error: function() {
                alert("上传失败,请重新上传！ :)");
            },
        });
    } catch (e) {
        alert(e)
    } finally {

    }
}

// 检查浏览器是否支持blob，如果不支持则生成blob函数
function checkBlob() {
    var array = new Int8Array([17, -45.3]);

    try {
        var jpeg = new Blob([array], {
            type: "image/npg"
        });
    } catch (e) {
        // TypeError old chrome and FF
        window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
        if (e.name == 'TypeError' && window.BlobBuilder) {
            var bb = new BlobBuilder();
            bb.append([array.buffer]);
            var jpeg = bb.getBlob("image/jpeg");
        } else if (e.name == "InvalidStateError") {
            // InvalidStateError (tested on FF13 WinXP)
            var jpeg = new Blob([array.buffer], {
                type: "image/jpeg"
            });
        } else {
            // We're screwed, blob constructor unsupported entirely
        }
    }
}
$(document).ready(function() {
    checkBlob();
    // 设置模态框
    $('#cropfile').on("click", showModal);
})
