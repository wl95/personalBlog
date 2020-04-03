$(function(){
    // 点击马上注册
    $('.register .logInBtn').click(function(){
        $('.bs-example-modal-login').addClass('in').show();
        $('.bs-example-modal-register').removeClass('in').hide();
        $('.hint').html('');
    })
    //切换登陆
    $('.log_in .registerBtn').click(function(){
        $('.bs-example-modal-login').removeClass('in').hide();
        $('.bs-example-modal-register').addClass('in').show();
        $('.hint').html('');
    })
    
    $('.register').find('[name="repassword"]').on('keydown',function(ev){
        if(ev.keyCode === 13){
            register();
        }
    })


    // 点击注册
    $('.register .submit_btn').click(function(){
        register();
    })

    function register(){
        $.ajax({
            url:'/api/user/register',
            type:"post",
            data:{
                username:$('.register').find('[name="username"]').val(),
                password:$('.register').find('[name="password"]').val(),
                repassword:$('.register').find('[name="repassword"]').val()
            },
            datatype:"json",
            success:function(data){
                $('.hint').html(data.message);
                if(!data.code){
                    setTimeout(function(){
                        $('.bs-example-modal-login').addClass('in').show();
                        $('.bs-example-modal-register').removeClass('in').hide();
                        $('.hint').html('');
                    },1000);
                }
            }
        })
    }

    // 点击登陆
    $('.log_in .submit_btn').click(function(){
        logIn();
    })

    $('.log_in').find('[name="logInPassword"]').on('keydown',function(ev){
        if(ev.keyCode === 13){
            logIn();
        }
    })
    // 登录页按下回车跳转到下一个文本框
    $('.log_in').find('[name="logInUser"]').on('keydown',function(ev){
        if(ev.keyCode === 13){
            $('.log_in').find('[name="logInPassword"]').focus();
        }
    })
    // 密码页按下回车跳转到下一个文本框
    $('.register').find('[name="username"]').on('keydown',function(ev){
        if(ev.keyCode === 13){
            $('.register').find('[name="password"]').focus();
        }
    })

    $('.register').find('[name="password"]').on('keydown',function(ev){
        if(ev.keyCode === 13){
            $('.register').find('[name="repassword"]').focus();
        }
    })

    //登陆函数
    function logIn (){
        $.ajax({
            url: '/api/user/logIn',
            type:"post",
            data:{
                username: $('.log_in').find('[name="logInUser"]').val(),
                password: $('.log_in').find('[name="logInPassword"]').val()
            },
            success:function(data){
                $('.log_in .hint').html(data.message);
                if(!data.code){
                    window.location.reload();
                }
            }
        })
    }


    $('.logined').click(function(){
        console.log(1)
    })

    // 点击退出
    $('.logOut').on('click',function(){
        console.log(1)
        $.ajax({
            url:'/api/user/logOut',
            success:function(result){
                if(!result.code){
                    window.location.reload();
                }
            }
        })
    })

})