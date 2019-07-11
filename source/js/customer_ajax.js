$(document).ready(function(){
    //login ajax call to server
    $("form#login").on('submit', function(e){
        e.preventDefault();
       let data=$("#login").serialize();
      // console.log(data);
        
        
        $.ajax({
            type: 'post',
            url: '/customer/handlelogin',
            data: data,
            dataType: 'json'    
        })
        .done(function(response){

           console.log("response",response);
           if(!response){
               $('#alert').css("visibility","visible");
               return false;
           }
           else{
            window.location.href="/customer/";
           }
          
        });
    });

    $('form#register').on('submit',(e)=>{
        e.preventDefault();
        alert("ajax");
      
        var password = $("input[name='password']").val();
        var conf_password = $("input[name='conf_password']").val();
        console.log(password,conf_password);
        if(password != conf_password){
            console.log("wrong pass");
            $('#alert').css("visibility","visible").text("password and confrim password should be same");
        }
        else{
           var  data = $('#register').serialize();
            $.ajax({
                type: 'post',
                url: '/customer/handleRegisteration',
                data: data,
                dataType: 'json'
            })
            .done( (response) =>{
                console.log(response);
                if(!response){
                    $('#alert').css("visibility","visible").text("this email is already exists!");
                }
                else {
                    window.location.href = "/customer/login/";
                }
            })
        }
 

    })

});