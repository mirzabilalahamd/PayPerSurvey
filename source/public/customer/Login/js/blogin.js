$(document).ready(function(){
		
	 $.validator.setDefaults({
		 highlight : function(element){
			 $(element).closest('.form-group').addClass('has-error');
		 },
		 unhighlight : function(element){
			 $(element).closest('.form-group').removeClass('has-error');
		 }
	 })
	 
	  /* handling form validation */
 $("#login-form").validate({
	  
 rules: {
 password: {
 required: true,
 },
 username: {
 required: true,

 },
	 
 },
 messages: {
 password:{
   required: "Please enter your password"

 },
 username: "Please enter your Account ID",
 },
errorPlacement: function(error,element){
	if(element.attr('name')=='username')
		{
	 audio.src="audio/empty-input.mp3";
		}
	else if(element.attr('name')=='password')
		{
		audio.src="audio/empty-input.mp3";	
		}
		    audio.play();
},
 submitHandler: submitForm


						   })
	function submitForm() {		
		var data = $("#login-form").serialize();
		$.ajax({				
			type : 'POST',
			url  : 'login-logout.php?action=login',
			data : data,
			beforeSend: function(){	
				$("#error").fadeOut();
				$("#login-submit").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; sending ...');
			},
			success : function(response){			
				if($.trim(response) === "1"){
					console.log('dddd');									
					$("#login-submit").html('Signing In ...');
					setTimeout(' window.location.href = "index.php"; ',500);
				}
				else {	
					   
					$("#error").fadeIn(1000, function(){
						audio.src="audio/login-error.mp3";
		                audio.play();
						$("input[name=username]").focus();
						$("#error").html(response).show();
						$("#error").fadeOut(5000);
						$("#login-submit").html('<span class="glyphicon glyphicon-repeat"></span> &nbsp; Try Again');
					});
				}
			}
		});
		return false;
	}
 
		});
						   


