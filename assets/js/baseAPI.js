//这个函数可以拿到给Ajax的配置对象
$.ajaxPrefilter(function(options){
    options.url = 'http://www.liulongbin.top:3007'+options.url;
    console.log(options.url);
})