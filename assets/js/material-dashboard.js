(function() {
  isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

  if (isWindows) {
    // if we are on windows OS we activate the perfectScrollbar function
    $('.sidebar .sidebar-wrapper, .main-panel, .main').perfectScrollbar();

    $('html').addClass('perfect-scrollbar-on');
  } else {
    $('html').addClass('perfect-scrollbar-off');
  }
})();


var breakCards = true;

var searchVisible = 0;
var transparent = true;

var transparentDemo = true;
var fixedTop = false;

var mobile_menu_visible = 0,
  mobile_menu_initialized = false,
  toggle_initialized = false,
  bootstrap_nav_initialized = false;

var seq = 0,
  delays = 80,
  durations = 500;
var seq2 = 0,
  delays2 = 80,
  durations2 = 500;

$(document).ready(function() {

  $('body').bootstrapMaterialDesign();

  $sidebar = $('.sidebar');

  md.initSidebarsCheck();

  window_width = $(window).width();

  //  Activate the tooltips
  $('[rel="tooltip"]').tooltip();

});

$(document).on('click', '.nav-link', function(event) {
  /* console.log(event.target.parentNode.attributes); */
  if (undefined != event.target.parentNode.attributes[1].name) {
    let section = event.target.parentNode.attributes[1].name;
    /* console.log(section); */
    if (section !== 'href' && section !== undefined) {
      showSection(section);    
    }
    
  }  
});

$(document).on('click', '.navbar-toggler', function() {
  $toggle = $(this);

  if (mobile_menu_visible == 1) {
    $('html').removeClass('nav-open');

    $('.close-layer').remove();
    setTimeout(function() {
      $toggle.removeClass('toggled');
    }, 400);

    mobile_menu_visible = 0;
  } else {
    setTimeout(function() {
      $toggle.addClass('toggled');
    }, 430);

    var $layer = $('<div class="close-layer"></div>');

    if ($('body').find('.main-panel').length != 0) {
      $layer.appendTo(".main-panel");

    } else if (($('body').hasClass('off-canvas-sidebar'))) {
      $layer.appendTo(".wrapper-full-page");
    }

    setTimeout(function() {
      $layer.addClass('visible');
    }, 100);

    $layer.click(function() {
      $('html').removeClass('nav-open');
      mobile_menu_visible = 0;

      $layer.removeClass('visible');

      setTimeout(function() {
        $layer.remove();
        $toggle.removeClass('toggled');

      }, 400);
    });

    $('html').addClass('nav-open');
    mobile_menu_visible = 1;

  }

});

// activate collapse right menu when the windows is resized
$(window).resize(function() {
  md.initSidebarsCheck();

  // reset the seq for charts drawing animations
  seq = seq2 = 0;

  setTimeout(function() {
    md.initDashboardPageCharts();
  }, 500);
});

md = {
  misc: {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
  },

  /**
   * Show a popup notification:
   * @param {string} from | 'top', 'bottom'
   * @param {string} align | 'left', 'center', 'right'
   * @param {string} type | '', 'info', 'danger', 'success', 'warning', 'rose', 'primary'
   * @param {string} message | 'the message to to show on the notification'
   */
  showMyNotification: function(from, align, type, massage) {
    $.notify({
      icon: "add_alert",
      message: massage

    }, {
      type: type,
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  },

  /**
   * 
   * @param {*} from 
   * @param {*} align 
   */
  showNotification: function(from, align) {
    type = ['', 'info', 'danger', 'success', 'warning', 'rose', 'primary'];

    color = Math.floor((Math.random() * 6) + 1);

    $.notify({
      icon: "add_alert",
      message: "Welcome to <b>Material Dashboard Pro</b> - a beautiful admin panel for every web developer."

    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  },

  initSliders: function() {
    // Sliders for demo purpose
    var slider = document.getElementById('sliderRegular');

    noUiSlider.create(slider, {
      start: 40,
      connect: [true, false],
      range: {
        min: 0,
        max: 100
      }
    });

    var slider2 = document.getElementById('sliderDouble');

    noUiSlider.create(slider2, {
      start: [20, 60],
      connect: true,
      range: {
        min: 0,
        max: 100
      }
    });
  },

  initSidebarsCheck: function() {
    if ($(window).width() <= 991) {
      if ($sidebar.length != 0) {
        md.initRightMenu();
      }
    }
  },

  initDashboardPageCharts: function() {

    if ($('#priceChart').length != 0 || $('#completedTasksChart').length != 0 || $('#marketCapChart').length != 0) {
     
      /* ----------==========   Current Price  Charts initialization    ==========---------- */
      
      let date = new Date();
      let arr = [];

      var dataPriceChart = {
        labels: [],
        series: []
      };

      let past_day, low = 999, high = 0, _low = 0, _high = 0;
      for (let index = 6; index >= 0; index--) {
        
        if (Number(date.getDate()) - index <= 0) {
            past_day = Number(date.getDate()) - index + 30 + '-' + Number(date.getMonth()) + '-' + Number(date.getFullYear());
        } else {
            past_day = Number(date.getDate()) - index + '-' + Number(date.getMonth() + 1) + '-' + Number(date.getFullYear());
        }
        
        dataPriceChart.labels.push(past_day);
        
        fetch(`https://api.coingecko.com/api/v3/coins/cardano/history?date=${past_day}&localization=false`)
        .then(response => response.json())
        .then(json => {

          if (json.market_data.current_price.brl > high) {
            high = json.market_data.current_price.brl
          } else if (json.market_data.current_price.brl < low) {
            low = json.market_data.current_price.brl;
          }

          arr.push(json.market_data.current_price.brl);

          if (arr.length > 6) {
            /* console.log({low, high, _low, _high}); */

            dataPriceChart.series.push(arr);

            optionsDataPriceChart = {
              lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
              }),
              low: low,
              high: high,
              chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
              },
            }

            var priceChart = new Chartist.Line('#priceChart', dataPriceChart, optionsDataPriceChart);

            md.startAnimationForLineChart(priceChart);
          }
          // console.log(json);
        })
        .catch((error) => {
          md.showMyNotification('top', 'center', 'danger', 'There has been a problem with your fetch operation: ' + error.message);
          console.error('There has been a problem with your fetch operation: ' + error.message);
        });
        
        
      }

      /* ----------==========   Market Cap  Charts initialization    ==========---------- */

      let _arr = [];
      
      var dataMarketCapChart = {
        labels: [],
        series: []
      };

      for (let index = 6; index >= 0; index--) {
        
        if (Number(date.getDate()) - index <= 0) {
            past_day = Number(date.getDate()) - index + 30 + '-' + Number(date.getMonth()) + '-' + Number(date.getFullYear());
        } else {
            past_day = Number(date.getDate()) - index + '-' + Number(date.getMonth() + 1) + '-' + Number(date.getFullYear());
        }
        
        dataMarketCapChart.labels.push(past_day);
        
        fetch(`https://api.coingecko.com/api/v3/coins/cardano/history?date=${past_day}&localization=false`)
        .then(response => response.json())
        .then(json => {
          
          if (Number(json.market_data.market_cap.brl.toString().substring(0,3)) > _high) {
            _high = Number(json.market_data.market_cap.brl.toString().substring(0,3));
            /* console.log(_high); */
          } 
          
          if (_low === 0) {
            _low = Number(json.market_data.market_cap.brl.toString().substring(0,3));
          } else if (Number(json.market_data.market_cap.brl.toString().substring(0,3)) < low) {
            _low = Number(json.market_data.market_cap.brl.toString().substring(0,3));
            /* console.log(_low); */
          }

          _arr.push(Number(json.market_data.market_cap.brl.toString().substring(0,3)));

          if (_arr.length > 6) {

            /* console.log(_arr); */
            dataMarketCapChart.series.push(_arr);

            var optionsMarketCapChart = {
              axisX: {
                showGrid: false
              },
              low: _low,
              high: _high,
              chartPadding: {
                top: 0,
                right: 5,
                bottom: 0,
                left: 0
              }
            };

            var marketCapChart = new Chartist.Bar('#marketCapChart', dataMarketCapChart, optionsMarketCapChart);

            md.startAnimationForBarChart(marketCapChart);
          }
          // console.log(json);
        })
        .catch((error) => {
          md.showMyNotification('top', 'center', 'danger', 'There has been a problem with your fetch operation: ' + error.message);
          console.error('There has been a problem with your fetch operation: ' + error.message);
        });
        
        
      }


      /* ----------==========     Semanal Chart initialization    ==========---------- */

      dataSemanalChart = {
        labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        series: [
          [3.12, 3.17, 3.7, 4.17, 4.23, 4.8, 5.38]
        ]
      };

      optionsSemanalChart = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: 10, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      }

      /* var SemanalChart = new Chartist.Line('#completedTasksChart', dataSemanalChart, optionsSemanalChart); */

      // start animation for the Semanal Chart - Line Chart
      /* md.startAnimationForLineChart(SemanalChart); */


    }
  },

  initMinimizeSidebar: function() {

    $('#minimizeSidebar').click(function() {
      var $btn = $(this);

      if (md.misc.sidebar_mini_active == true) {
        $('body').removeClass('sidebar-mini');
        md.misc.sidebar_mini_active = false;
      } else {
        $('body').addClass('sidebar-mini');
        md.misc.sidebar_mini_active = true;
      }

      // we simulate the window Resize so the charts will get updated in realtime.
      var simulateWindowResize = setInterval(function() {
        window.dispatchEvent(new Event('resize'));
      }, 180);

      // we stop the simulation of Window Resize after the animations are completed
      setTimeout(function() {
        clearInterval(simulateWindowResize);
      }, 1000);
    });
  },

  checkScrollForTransparentNavbar: debounce(function() {
    if ($(document).scrollTop() > 260) {
      if (transparent) {
        transparent = false;
        $('.navbar-color-on-scroll').removeClass('navbar-transparent');
      }
    } else {
      if (!transparent) {
        transparent = true;
        $('.navbar-color-on-scroll').addClass('navbar-transparent');
      }
    }
  }, 17),


  initRightMenu: debounce(function() {
    $sidebar_wrapper = $('.sidebar-wrapper');

    if (!mobile_menu_initialized) {
      $navbar = $('nav').find('.navbar-collapse').children('.navbar-nav');

      mobile_menu_content = '';

      nav_content = $navbar.html();

      nav_content = '<ul class="nav navbar-nav nav-mobile-menu">' + nav_content + '</ul>';

      $sidebar_nav = $sidebar_wrapper.find(' > .nav');

      // insert the navbar form before the sidebar list
      $nav_content = $(nav_content);
      $nav_content.insertBefore($sidebar_nav);

      $(".sidebar-wrapper .dropdown .dropdown-menu > li > a").click(function(event) {
        event.stopPropagation();

      });

      // simulate resize so all the charts/maps will be redrawn
      window.dispatchEvent(new Event('resize'));

      mobile_menu_initialized = true;
    } else {
      if ($(window).width() > 991) {
        // reset all the additions that we made for the sidebar wrapper only if the screen is bigger than 991px
        $sidebar_wrapper.find('.navbar-form').remove();
        $sidebar_wrapper.find('.nav-mobile-menu').remove();

        mobile_menu_initialized = false;
      }
    }
  }, 200),

  startAnimationForLineChart: function(chart) {

    chart.on('draw', function(data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  },

  startAnimationForBarChart: function(chart) {

    chart.on('draw', function(data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  }
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};
