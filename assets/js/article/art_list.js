$(function(){
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth()+1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    function padZero(n){
        return n>9 ? n : '0'+n;
    }
    
    //定义一个查询参数对象，将来提交数据的时候需要将数据提交到服务器
    var q={
        pagenum:1,      //页码值
        pagesize:2,     //每页显示多少条数据
        cate_id:'',   //文章分类的 Id
        state:''     //文章的状态，可选值有：已发布、草稿
    }
    initTable();
    initCate();
    //获取文章列表数据
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status != 0)
                    layer.msg('请求失败')
                // console.log(res);
                var htmlStr = template('tpl-table',res);
                $('tbody').html(htmlStr,res);
                renderPage(res.total);
            }
        })
    }

    //初始化文章分类函数
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status != 0)
                    return layer.msg('获取分类数据失败')
                // console.log(11)
                var Str = template('tpl-cate',res);
                console.log(Str)
                $('[name=cate_id]').html(Str);
                //通知layui重新渲染表单的数据，因为动态添加的数据无法实时渲染，所以需要在添加完成后重新进行渲染
                form.render();

                
            }
        })
    }

    //监听筛选表单提交事件
    $('#form-search').on('submit',function(e){
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        //将获取的分类数据写入到对象q中
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    //定义分页渲染函数
    //first参数可以分辨jump的触发方式，如果是true，则说明是调用laypage.render()时触发，如果为false说明是点击页码触发
    function renderPage(total,first){
        laypage.render({
            elem:'pageBox',         //需要被渲染成分页的容器
            count:total,            //总的数据条数
            limit:q.pagesize,       //每页的数据数量
            curr:q.pagenum,          //默认被选中的分页
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            //触发jump函数有两种方法，一种是点击页码，另一种是调用laypage.render()这个函数就会触发
            jump:function(obj){
                //把最新的页码值赋值到q这个查询参数对象中
                q.pagenum = obj.curr;

                //获取最新的条目数复制到q中
                q.pagesize = obj.limit;
                //只有点击页码时才会调用方法进行渲染
                if(!first)
                    initTable()
            }
        })
    }

    //为删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function(){
        //询问删除选择
        var id = $(this).attr('data-id');
        //获取当前页面的删除按钮数
        var len = $('.btn-delete').length;
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status != 0)
                        return layer.msg('删除失败');
                    layer.msg('删除文章成功');
                    //当数据删除完成后要判断这一页是否还有值，如果没有剩余数据后则需要将页码减一，再调用initTable
                     //说明当前删除的条目是当前页面最后一个
                    if(len == 1)
                    //页码值最小是1
                       q.pagenum = q.pagenum == 1 ? 1:q.pagenum-1;
                    layer.close(index);
                    initTable();
                }
            })
          });
    })
})