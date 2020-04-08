$(()=>{


     	//html
		$('#can1').radialIndicator({
		radius: 70,
        barColor: '#fa00b4',
        barWidth: 3,
        initValue: 0,
        roundCorner : true,
        percentage: true
    });



	//css
		$('#can2').radialIndicator({
		radius: 70,
        barColor: '#00FF7F',
        barWidth: 3,
        initValue: 0,
        roundCorner : true,
        percentage: true
    });

	//js
		$('#can3').radialIndicator({
		radius: 70,
        barColor: '#912CEE',
        barWidth: 3,
        initValue: 0,
        roundCorner : true,
        percentage: true
    });

	//node
		$('#can4').radialIndicator({
		radius: 70,
        barColor: '#87CEFA',
        barWidth: 3,
        initValue: 0,
        roundCorner : true,
        percentage: true
    });

//当达到指定高度时 出发圆环动画

  $(window).on('scroll',function() {
  	  
  	    if(document.body.scrollHeight >= 1000 ) {
		  	    	
		var radialObj1 = $('#can1').data('radialIndicator');

		radialObj1.animate(90);


		var radialObj2 = $('#can2').data('radialIndicator');

		radialObj2.animate(90);


		var radialObj3 = $('#can3').data('radialIndicator');

		radialObj3.animate(95);


		var radialObj4 = $('#can4').data('radialIndicator');

		radialObj4.animate(85);


  	    }
  });


		
	

});

