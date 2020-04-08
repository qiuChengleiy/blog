$(()=> {
const width = document.body.clientWidth;

console.log(width);

if(width !== 1440 ) {
   $('.arrow').remove();
   $('.gos').remove();
}

    $('.more-me').on('click',function() {
      window.open('about-blog.html');
  });

  

   $('.go').hover(function(){
       $('.go').css({
        'background':'purple',
        'color':'white'
       });

       $('.gos').animate({
          width:400+'px',
          opacity:1
       },'slow');

   },function(){
       $('.go').css({
        'background':'',
        'color':'purple'
       });
        $('.gos').animate({
          width:0,
          opacity:0
       },'slow');
   });

   $('.go').click(function() {

       $('.contens').css({
          display:'block',
          position:'absolute',
          background:'white',
          zIndex:1111
       });
       $('.contens').animate({
          top: -350+'px'
       },'slow');


   })

   $('.back').hover(function() {
      $('.back').css({
        opacity:1
      })
   },function() {
     $('.back').css({
        opacity:.3
   })
   });
   $('.back').click(function() {
      
       $('.contens').animate({
          top: 780+'px'
       },'slow');

  setTimeout(()=>{
     $('.contens').css({
          display:'none',
          position:'absolute',
          background:'white',
          zIndex:''
       });
   },1000);
       
   })

});
   