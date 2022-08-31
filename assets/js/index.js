$(function () {
    getUserInfo();
    var layer = layui.layer
    //退出模块
    $('#btnLogout').on('click',function(){
        layer.confirm('是否退出', {icon: 3, title:'提示'}, function(index){
            localStorage.removeItem('token');
            location.href = '/login.html'
            layer.close(index)
          });
    })
})

//获取用户信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        success: function (res) {
            if(res.status != 0){
                return layer.msg('获取身份失败');  
            } 
            // console.log(res.data)             
            renderAvator(res.data);
        }
    })
}

//渲染用户的图像
function renderAvator(user){
    var name = user.nickname||user.username;
    // console.log(name);
    $('#welcome').html(`欢迎你 ${name}`);
    //按需渲染用户的图像
    if(user.user_pic){
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avatar').hide()
    }else{
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();

    }

}