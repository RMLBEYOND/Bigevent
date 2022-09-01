$(function () {
    // var layer = layui.layer
    var form = layui.form;
    initArtCateList();
    //获取文章的分类页表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0)
                    return layer.msg('获取信息失败');
                console.log(res.data)
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null;
    //为添加类别按钮绑定事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['450px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //通过代理的形式为form表单绑定事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return console.log(res)
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })
    var indexEdit = null;
    $('body').on('click','.btn-edit',function(e){
        // 弹出一个修改文章框
        indexEdit = layer.open({
            type: 1,
            area: ['450px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-edit');
        //发起请求获取对应分类的信息
        $.ajax({
            method:'GET',
            url:'/my/article/cates/'+id,
            success:function(res){
                form.val('form-edit',res.data);
            }
        })
    })

    //通过代理的方式为修改分类的表单绑定事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status != 0)
                    return console.log(res)
                layer.msg('更新分类成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function() {
    var id = $(this).attr('data-id')
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          layer.close(index)
          initArtCateList()
        }
      })
    })
  })
})