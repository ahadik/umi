$(document).ready(function(){
	$('.view').hide();
	$('#data').show();
	
	$('.graph_nav').hide();
	$('.graph_nav.time_nav_active').show();
	
	$(".switch").each(function(i, obj){
		var status = $(this).attr("status");
		
		if(status == "on"){
			$(".off",this).hide();
		}else{
			$(".on",this).hide();
		}
	});
	$(".nav_part").bind("click", function(){
		$(".nav_part").removeClass("selected");
		$(this).addClass("selected");
		loadView($(this).attr('type'));
	});
	
	$(".time_part").bind("click", function(){
		$(".time_part").removeClass("selected");
		$(this).addClass("selected");
	});
	
	$(".switch").bind("click", function(){
		if($(this).attr("status") == "on"){
			$(this).attr("status", "off");
			$('.switch_wrap',this).removeClass("on").addClass("off");
		}else{
			$(this).attr("status", "on");
			$('.switch_wrap',this).removeClass("off").addClass("on");
		}
	});
	
	$(".device.data_view").bind("click", function(event){
		if($(this).hasClass("retract")){
			$(this).removeClass("retract").addClass("expand");
			$(".data_indicator", this).removeClass("up").addClass("down");
		}else if(!$(this).hasClass("retract") && !$(this).hasClass("expand")){
			$(this).addClass("expand");
			
			$(".data_indicator", this).addClass("down");
		}
	});
	
	$(".data_indicator").bind("click", function(event){
		
		if($(this).parent().parent().parent().hasClass("retract")){
			$(this).parent().parent().parent().removeClass("retract").addClass("expand");
			$(this).removeClass("up").addClass("down");
		}else if($(this).parent().parent().parent().hasClass("expand")){
			$(this).parent().parent().parent().removeClass("expand").addClass("retract");
			$(this).removeClass("down").addClass("up");
		}else{
			$(this).parent().parent().parent().addClass("expand");
			$(this).addClass("down");
		}
		//keep this even from propagating to the larger device div
		event.stopPropagation();
	});
	
	$('.data_type_button').bind("click", function(event){
		if (!$(this).hasClass("active")){
			$(this).toggleClass("active");
			$(this).siblings(".data_type_button").toggleClass("active");
		}
	});
	
	var height = $(window).height();
	
	$('.view').css("height", height-287);
	
});

function loadView(id){
	$('.view').hide();
	$('#'+id).show();
}