$(function () {
    form = layui.form;
    layer = layui.layer;
    initCate();
    initEditor();
    //加载文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0)
                    return layer.msg('获取数据失败');
                //调用模板引擎渲染数据
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //动态添加元素后需要调用form中的render方法进行再次渲染
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //  为选择封面的按钮绑定事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    //监听coverFile的change事件
    $('#coverFile').on('change', function (e) {
        var files = e.target.files;
        console.log(files)
        if (files.length == 0)
            return layer.msg('请选择封面图片');

        //根据文件创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0]);

        //为裁剪区重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //定义文章的发布状态
    var art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    //为表单绑定提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //基于表单创建一个formdata对象
        var fd = new FormData($(this)[0]);
        //将文章的发布状态存入fd中
        fd.append('state', art_state)

        // 将裁剪后的图片转换为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象

                // 将文件对象存到fd中
                fd.append('cover_img',blob)
            })
        
        // 发起Ajax请求
        publishArticle(fd);

        //定义发布文章函数
        function publishArticle(obj){
            $.ajax({
                method:'POST',
                url:'/my/article/add',
                data:obj,
                //如果使用formData格式的数据作为服务器的提交数据，必须写上以下两行代码
                contentType:false,
                processData:false,
                success:function(res){
                    if(res.status != 0)
                        return layer.msg('发布文章失败');
                    layer.msg('发布成功')
                    //发布成功后跳转到文章页面
                    location.href = '/article/art_list.html'
                }
            })
        }

    })
})