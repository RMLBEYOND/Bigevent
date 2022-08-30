$(function () {
    //绑定登录和注册切换的按钮，实现二者的切换效果
    $("#link_reg").on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show()
    })

    $("#link_login").on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide()
    })
    //从layui中获取form对象,其中layui就和jQuery中的$符号一样，导入即可使用
    var form = layui.form
    //从layui中获取layer对象
    var layer = layui.layer
    //自定义校验函数
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 再次确认密码校验规则
        repwd: function (value) {
            // 通过形参得到确认密码框中的值，再和密码框中的值进行比较
            var pwd = $('.reg-box [name=password]').val()
            if (pwd != value)
                return '两次密码不一致';
        }
    })

    //监听注册表单提交事件
    $('#form_reg').on('submit', function(e) {
        // 1. 阻止默认的提交行为
        e.preventDefault()
        // 2. 发起Ajax的POST请求
        var data = {
          username: $('#form_reg [name=username]').val(),
          password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
          if (res.status !== 0) {
            return layer.msg(res.message,{icon: 6});
          }
          layer.msg('注册成功请登录',{icon: 6});
          $('#link_login').click();

        })
      })

    //监听登陆表单的提交事件
    $('#form_login').on('submit',function(e){
        e.preventDefault();
        var data = {
            username: $('#form_login [name=username]').val(),
            password: $('#form_login [name=password]').val()
          }
        $.post('/api/login',data,function(res){
          if(res.status != 0)
            return layer.msg(res.message,{icon:6});
          layer.msg('登录成功',{icon:6});
          //将登陆成功得到的token存到本地存储
          localStorage.setItem('token',res.token);
          location.href = '/index.html';
        })
    })
})