var socket = io();
socket.on('reading', function(data){
	var ref = $("device_id=1");
	$('.device_energy', ref).html(data.real);
	$('.device_cost', ref).html(data.real);
});

$(document).ready(function(){
	$('.view').hide();
	$('#data').show();
	
	var date = new Date();
	var day = date.getDay();
	
	var weekday = new Array(7);
	weekday[0]=  "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
	
	var month = new Array(12);
	month[0]=  "Jan";
	month[1] = "Feb";
	month[2] = "Mar";
	month[3] = "Apr";
	month[4] = "May";
	month[5] = "June";
	month[6] = "Jul";
	month[7] = "Aug";
	month[8] = "Sep";
	month[9] = "Oct";
	month[10] = "Nov";
	month[11] = "Dec";
	
	var month_text = month[date.getMonth()];
	var day_text = weekday[day];
	var date_text = date.getDate();
	var year = date.getFullYear();
	
	$("#header_day").html(day_text);
	$('#header_date').html(date_text+' '+month_text+' '+year);
	
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
	
	$('.time_part').bind("click", function(event){
		if($(this).attr('type') == 'daily'){
			$("#overview_avg").html(overviewdata.daily.avg);
			$("#overview_total_energy").html(overviewdata.daily.total_energy);
			$("#overview_total_cost").html(overviewdata.daily.total_cost);
		}
		
		if($(this).attr('type') == 'weekly'){
			$("#overview_avg").html(overviewdata.weekly.avg);
			$("#overview_total_energy").html(overviewdata.weekly.total_energy);
			$("#overview_total_cost").html(overviewdata.weekly.total_cost);
		}
		
		if($(this).attr('type') == 'monthly'){
			$("#overview_avg").html(overviewdata.monthly.avg);
			$("#overview_total_energy").html(overviewdata.monthly.total_energy);
			$("#overview_total_cost").html(overviewdata.monthly.total_cost);
		}
		
		if($(this).attr('type') == 'yearly'){
			$("#overview_avg").html(overviewdata.yearly.avg);
			$("#overview_total_energy").html(overviewdata.yearly.total_energy);
			$("#overview_total_cost").html(overviewdata.yearly.total_cost);
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