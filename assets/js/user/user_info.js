$(function(){
    var form = layui.form;
    form.verify({
        nickname:function(value){
            if(value.length>6)
                return '昵称的长度必须在6~12位之间';
        }
    })

    initUserInfo();

    //初始化用户的基本信息
    function initUserInfo(){
        $.ajax({
            url: '/my/userinfo',
            method: 'GET',
            success: function (res) {
                if(res.status != 0){
                    return layer.msg('获取身份失败');  
                }
                console.log(res); 
                //调用form.val()为表单快速赋值             
                form.val('formUserInfo',res.data)
            }
        })
        
        
    }

    //重置表单的数据
    $('#btnReset').on('click',function(e){
        e.preventDefault();
        initUserInfo();
    })

      // 监听表单的提交事件
  $('.layui-form').on('submit', function(e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起 ajax 数据请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新用户信息成功！')
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()
      }
    })
  })
})