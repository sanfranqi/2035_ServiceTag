!function(a){"use strict";var b=a("#J_Countdown"),c=5,d=setInterval(function(){return 0>=c?(clearInterval(d),void(window.location.href=ctx+"/index.htm")):(c-=1,void b.text(c))},1e3)}(jQuery);