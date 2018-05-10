window.addEventListener("resize",init);
function init(){
	if (window.matchMedia('(max-width: 1200px)').matches) {
		/* The viewport is less than, or equal to,  */
	} else {
		/* The viewport is greater than */
		window.location.href = '../index.html';
	}
}
var valid=true;
function send(){
	if(valid){
		valid=false;
		$("#captcha").css("display","none");
		setInterval(function(){
			valid=true;
			$("#captcha").css("display","block");
			$("#resForm").html("");
			$("#resForm").removeClass("alert-danger");
			$("#resForm").removeClass("alert-success");
		},5000);
	}else{
		return;
	}
	if(true){
		//document.getElementById("conForm").submit();
		//var url="../saveData.asp";
		var url="http://www.vinodkumargb.somee.com/saveData.asp";
		var jqxhr = $.ajax({
			method: "POST",
			url: url,
			data: $('#conForm').serialize()
		})
		.done(function(result) {
			$("#resForm").html(result);
			$("#resForm").removeClass("alert-danger");
			$("#resForm").addClass("alert-success");
		})
		.fail(function(result) {
			$("#resForm").html(result.responseText);
			$("#resForm").removeClass("alert-success");
			$("#resForm").addClass("alert-danger");
		})
		//.always(function(result) {
		//	alert( "complete:"+result.responseText );
		//});
	}
}