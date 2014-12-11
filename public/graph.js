

(function(ce) {
    /*
	    s = 0: Yearly
	    s = 1: Monthly
	    s = 2: Weekly
	    s = 3: Daily
    */
	var curr_view = 0;
	var curr_data_type = 1;
	
	var yearly_dollar_domain = ["$25", "$50", "$75", "$100"];
	var yearly_energy_domain = ["25 W", "50 W", "75 W", "100 W"];
	
	var monthly_dollar_domain = ["$25", "$50", "$75", "$100"];
	var monthly_energy_domain = ["25 W", "50 W", "75 W", "100 W"];
	
	var weekly_dollar_domain = ["$25", "$50", "$75", "$100"];
	var weekly_energy_domain = ["25 W", "50 W", "75 W", "100 W"];
	
	var daily_dollar_domain = ["$25", "$50", "$75", "$100"];
	var daily_energy_domain = ["25 W", "50 W", "75 W", "100 W"];
	
	var year_domain = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var year_range = [0, 280];
	var month_domain = ["Week 1", "Week 2", "Week 3", "Week 4"];
	var month_range = [0, 250];
	var week_domain = ["Mon.","Tue.","Wed.","Thur.","Fri.","Sat.","Sun."];
	var week_range = [0, 280];
	var day_domain = [" ","6 AM","Noon","6 PM","12 AM"];
	var day_range = [0, 260];
	
	var domain = yearly_dollar_domain;
	var x_domain = year_domain;
	var range = year_range;
		
	var yScale = d3.scale.ordinal()
		.domain(domain)
	    .range([120,90,60,30]);
	    
	var xScale = d3.scale.ordinal()
	    .domain(year_domain)
	    .rangePoints(range);
	
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");
	
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

    var data = [ ];
    var start = 0;
    var end = 360;
      
    var costhistory = energydata.history.values.map(function(d) { return { d: d.date, x: d.wattage, y: d.wattage }; }).reverse();
    var energyhistory = costdata.history.values.map(function(d) { return { d: d.date, x: d.wattage, y: d.wattage }; }).reverse();
    data = costhistory;
        
    draw(true);

    function draw(flush) {
      
      var fdata = data.filter(function(d, i) { return ((i >= start) && (i < end)); });

      w = $(ce).width();
      h = $(ce).height();
      x = d3.scale.linear().domain([d3.min(fdata, function(d) { return d.d; }), d3.max(fdata, function(d) { return d.d; })]).range([0, w]);
      y = d3.scale.linear().domain([0, d3.max(fdata, function(d) { return Math.max(d.x, d.y); })]).range([130, 0]);

      var vis; 
      var svg;
        
      if(flush) {
        d3.select(ce).selectAll('*').remove();
        vis = d3.select(ce)
          .append('svg:svg')
            .attr('width', 360)
            .attr('height', 200);
            
        svg = d3.select(ce).select('svg');
      
		svg.append('svg:mask')
			.attr('width', 330)
			.attr('height', 130)
			.attr("id", "graph_mask")
			.append('svg:rect')
				.attr("width", 330)
				.attr("height", h)
				.attr("fill", "white");
            
        vis = svg.append('svg:g')
        	.attr("transform", "translate(" + 60 + "," + 0 + ")")
        	.attr("mask", "url(#graph_mask)");
        	
        svg.append("g")
      		.attr("class", "y axis")
	  		.call(yAxis)
	  		.attr("transform", "translate(" + 60 + "," + -15 + ")");
      
	      var y_text = d3.select(ce).selectAll('.axis g text')
		  	.attr("fill", "white");
		  
		  svg.append("g")
		  	.attr("class", "x axis")
		  	.call(xAxis)
		  	.attr("transform", "translate("+80+","+140+")");
		  	
		 if(curr_view == 0){
			var x_text = d3.select(ce).selectAll('.x g text')
		  		.attr("transform", "rotate(45)");
		}
      } else {
	    yScale = d3.scale.ordinal()
			.domain(domain)
			.range([120,90,60,30]);
		
		yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left");
			
		xScale = d3.scale.ordinal()
	    	.domain(x_domain)
			.rangePoints(range);
			
		xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom");
        
        vis = d3.select(ce).select('svg').select('g');
        svg = d3.select(ce).select('svg');
        svg.selectAll('.axis').remove();
        svg.append("g")
      		.attr("class", "y axis")
	  		.call(yAxis)
	  		.attr("transform", "translate(" + 60 + "," + -15 + ")");
	  		
	  	svg.append("g")
		  	.attr("class", "x axis")
		  	.call(xAxis)
		  	.attr("transform", "translate("+80+","+140+")");
		  	
		if(curr_view == 0){
			var x_text = d3.select(ce).selectAll('.x g text')
		  		.attr("transform", "rotate(45)");
		}
		
      }

	  d3.select(ce).selectAll('.axis path').remove();
      // area

      var areaTotalSvg = d3.svg.area()
          .x(function(d) { return x(d.d); })
          .y0(130)
          .y1(function(d) { return y(d.x); });

      var areaTotal = vis.selectAll('.area-total').data([1]);
      areaTotal.enter().append('svg:path')
        .data([data])
          .attr('class', 'area-total')
          .attr('d', areaTotalSvg);

      var lineTotalSvg = d3.svg.line()
          .x(function(d) { return x(d.d); })
          .y(function(d) { return y(d.x); });
      
      var lineTotal = vis.selectAll('.line-total').data([1]);
      lineTotal.enter().append('svg:path')
        .data([data])
          .attr('class', 'line-total')
          .attr('d', lineTotalSvg);    
      

      if (!flush) {       
        areaTotal.data([data]).transition().attr('d', areaTotalSvg); 
        lineTotal.data([data]).transition().attr('d', lineTotalSvg);         
      }

      // line rules
        
      var lineRuleAttributes = function(selection) {
        selection
          .attr('x1', 0)
          .attr('x2', 300)
          .attr('y1', y)
          .attr('y2', y);
      };
      
      var lineRule = vis.selectAll('line.rule')
        .data(y.ticks(5))
        .call(lineRuleAttributes);

      lineRule.enter().append('svg:line')
        .attr('class', 'rule')
        .call(lineRuleAttributes)
        .attr('stroke', 'lightgray');               
      lineRule.exit()
        .remove();

      // text rules
      


      // x axis

      vis.selectAll('line.xaxis')
          .data([1])
        .enter().append('svg:line')
          .attr('x1', 0)
          .attr('x2', w)
          .attr('y1', y(0))
          .attr('y2', y(0))
          .attr('stroke', 'black') 
          .attr('stroke-width', 3);              

    }


    $(ce).resize(function() { draw(true); });  
    
    $(ce).bind('change-scale', function(event, s) {    
      start = s;
      end = s + 30;
      draw(false);
    });
    
    $(ce).bind('change-type', function(event,s){
	    curr_data_type = s;
	    if(s){
		    data = costhistory;
		    if(curr_view==0){
				domain = yearly_dollar_domain;
		    }else if(curr_view==1){
				domain = monthly_dollar_domain;
		    }else if(curr_view==2){
				domain = weekly_dollar_domain;
		    }else if(curr_view==3){
				domain = monthly_dollar_domain;
		    }
	    }else{
		    data = energyhistory;
		    if(curr_view==0){
				domain = yearly_energy_domain;
		    }else if(curr_view==1){
				domain = monthly_energy_domain;
		    }else if(curr_view==2){
				domain = weekly_energy_domain;
		    }else if(curr_view==3){
				domain = monthly_energy_domain;
		    }
	    }
	    draw(false);
    });
    
    
    /*
		    s = 0: Yearly
		    s = 1: Monthly
		    s = 2: Weekly
		    s = 3: Daily
	    */
    $(ce).bind('prev_time', function(event,s){
	    switch(s){
		    case 0:
		    	if(start > 360){
			    	start -= 360;
			    	end -= 360;
		    	}else{
			    	var temp = start;
			    	start = 0;
			    	end -= temp;
		    	}
		    case 1:
		    	if(start > 30){
			    	start -= 30;
			    	end -= 30;
		    	}else{
			    	var temp = start;
			    	start = 0;
			    	end -= temp;
		    	}
		    case 2:
		    	if(start > 7){
			    	start -= 7;
			    	end -= 7;
		    	}else{
			    	var temp = start;
			    	start = 0;
			    	end -= temp;
		    	}
		    case 3:
		    	if(start >2){
			    	start -= 2;
			    	end -= 2;
		    	}else{
			    	var temp = start;
			    	start = 0;
			    	end -= temp;
		    	}
		}
		draw(false);
    });
    
    $(ce).bind('next_time', function(event,s){
	    switch(s){
		    case 0:
		    	if(end < data.length-360){
			    	start += 360;
			    	end += 360;
		    	}else{
			    	end = data.length;
			    	start = end - 360;
		    	}
		    case 1:
		    	if(end < data.length-30){
			    	start += 30;
			    	end += 30;
		    	}else{
			    	end = data.length;
			    	start = end - 30;
		    	}
		    case 2:
		    	if(end < data.length-7){
			    	start += 7;
			    	end += 7;
		    	}else{
			    	end = data.length;
			    	start = end - 7;
		    	}
		    case 3:
		    	if(end < data.length-2){
			    	start += 2;
			    	end += 2;
		    	}else{
			    	end = data.length;
			    	start = end - 2;
		    	}
		}
		draw(false);
    });
    
    $(ce).bind('next_time', function(event,s){
	    
    });
    
    $(ce).bind('change-domain', function(event,s){
	    /*
		    s = 0: Yearly
		    s = 1: Monthly
		    s = 2: Weekly
		    s = 3: Daily
	    */

		$('.graph_nav').hide();
		curr_view = s;
	    if(s==0){
		    if(curr_data_type){
			    domain = yearly_dollar_domain;
		    }else{
			    domain = yearly_energy_domain;
		    }
		    x_domain = year_domain;
		    range = year_range;
		    start = 0;
		    end = 360;
		    $('#year_nav').show();
	    }else if(s==1){
		    if(curr_data_type){
			    domain = monthly_dollar_domain;
		    }else{
			    domain = monthly_energy_domain;
		    }
		    x_domain = month_domain;
		    range = month_range;
		    start = end-30;
		    $('#month_nav').show();
	    }else if(s==2){
		    if(curr_data_type){
			    domain = weekly_dollar_domain;
		    }else{
			    domain = weekly_energy_domain;
		    }
		    x_domain = week_domain;
		    range = week_range;
		    start = end-7;
		    $('#week_nav').show();
	    }else if(s==3){
		    if(curr_data_type){
			    domain = daily_dollar_domain;
		    }else{
			    domain = daily_energy_domain;
		    }
		    x_domain = day_domain;
		    range = day_range;
		    start = end-2;
		    $('#day_nav').show();
	    }else{
		    console.error("Invalid time selection. Resetting to year domain.");
	    }
	    draw(false);
    });

    })('#chart');