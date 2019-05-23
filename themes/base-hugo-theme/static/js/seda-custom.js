

(function($) {
    var jQuery = $.noConflict(false);
    var $ = jQuery;

    

    function checkScroll(y) {
        // console.log(checkScroll);
        // If the scroll is at the top, not sticky.
        // Transition comes farther down the page for
        // the the front page.
        var heroHeight = $('#hero') ? $('#hero').height() : 0;
        // console.log(heroHeight);
        if (y <= (heroHeight - 64)) {
            // $('body').addClass('scroll-top');
            $('nav').removeClass('sticky-top');
            $('.subnav').removeClass('sticky-top');
        } else if (y > (heroHeight - 64)) {
            // $('body').removeClass('scroll-top');
            $('nav').addClass('sticky-top');
            $('.subnav').addClass('sticky-top');
        }
    }

    function toggleAbstract(e) {
        // console.log('toggleAbstract()');
        e.preventDefault();
        $target = $(e.target);
        $target.parents('.research-paper').toggleClass('abstract-visible');
    }

    /* anime.set(['#mainland', '.plotpoints', 'body.home .hero-child h2',
    'body.home .hero-child p', 'body.home .hero-child button'], {
      opacity: [0]
    }); */
    /* anime.set(['g#grades text', 'g#ses-metric text', '#grades path#axis-line-2', '#hp-x-line path#map-x'], {
      opacity: [0]
    }); */
    anime({
      targets: ['g#ses-metric', 'g#grades', 'g#hp-x-line'], 
      opacity: [0, .3],
      duration: 1, 
      delay: 1
    });
    anime({ // Scatterplot points
      targets: ['.plotpoints'],
      opacity: [0, .25],
      easing: 'easeOutCubic',
      delay: anime.stagger(24, {start: 300}) // increase delay for each element.
    });
    anime({ // Map
      targets: ['#mainland'],
      keyframes: [
        {opacity: 0.8, delay: 1400, duration: 1000},
        {opacity: 0.6, delay: 2400, duration: 800},
      ],
      easing: 'easeInSine',
    });
    anime({ // Y Axis
      targets: ['#grades path#axis-line-2'],
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1400,
    });
    anime({ // X Axis
      targets: ['#hp-x-line path#map-x'],
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1400,
     
    });
    anime({ // Grades
      targets: 'g#grades text',
      transform: ['translate(0 400)', 'translate(0 0 )'], // have to do it in this format to get it to work on webkit
      easing: 'easeInOutSine',
      duration: 1400,

    });
    anime({ // Numbers
      targets: 'g#ses-metric text',
      transform: ['translate(-500 0)', 'translate(0 0 )'], // have to do it in this format to get it to work on webkit
      easing: 'easeInOutSine',
      duration: 1400,
    });  
    
    

    // Variables for anime
    var dkbluepath = null;
    var medbluepath = null;
    var greenpath = null;
    var schoolstart = null;
    var initTrend = null;
    var trendStep = null;
    var trendStep1 = null;
    var trendStep2 = null;
    var trendStep3 = null;
    var trendStep4 = null;
    var trendStep5 = null;
    var trendStep6 = null;
    var trendStep7 = null;
    var trendStep8 = null;
    var trendStep9 = null;
    var trendStep10 = null;
    var trendStep11 = null;

    /**
     * Sets up all the animation targets and chars
     */
    function setupAnime() {
      dkbluepath = anime.path('#dkblueline');
      medbluepath = anime.path('#medblueline');
      greenpath = anime.path('#greenline');
      schoolstart = 1200;

      initTrend = anime({
          targets: ['#trendgraphic svg'],
          opacity: 1,
          duration: 250,
          autoplay: false,
          easing: 'easeInOutQuad',
          direction: 'linear',
      });
      trendStep = anime({
        // Opacity of schools    
          targets: ['#grnschool', '#medblueschool', '#dkblueschool'],
          opacity: 1,
          duration: 250,
          delay: schoolstart,
          easing: 'easeInOutQuad',
          direction: 'linear',
          autoplay: false,
      });
      trendStep1 = anime({
        //Dark Blue School Animation
        targets: ['#dkblueschool .schoolshape'],
        translateX: dkbluepath('x'),
        translateY: dkbluepath('y'),
        direction: 'linear',
        easing: 'easeInOutQuad',
        duration: 1500,
        delay: schoolstart,
        autoplay: false,
      });
      trendStep2 = anime({
        //Medium Blue School Animation
        targets: ['#medblueschool .mbschoolshape'],
        translateX: medbluepath('x'),
          translateY: medbluepath('y'),
          direction: 'linear',
          easing: 'easeInOutQuad',
          duration: 1500,
          delay: schoolstart,
          autoplay: false,
      });
      trendStep3 = anime({
      //Green School Animation
        targets: ['#grnschool .grnschoolshape'],
          translateX: greenpath('x'),
          translateY: greenpath('y'),
          direction: 'linear',
          easing: 'easeInOutQuad',
          duration: 1500,
          delay: schoolstart,
          autoplay: false,
      });
      //Y Axis Line
      trendStep4 = anime({
          targets: ['#y-axis-trend #y-axisline'],
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeInOutQuad',
          duration: 1000,
          direction: 'linear',
          autoplay: false,
      });
      //Y Axis Cap
      trendStep5 = anime({
          targets: ['#y-axis-cap path'],
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeInOutQuad',
          duration: 250,
          delay: 1000,
          direction: 'linear',
          autoplay: false,
      });
      //X Axis Line
      trendStep6 = anime({
          targets: ['#x-axis-trend-2 #x-axis-line'],
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeInOutQuad',
          duration: 1000,
          direction: 'linear',
          autoplay: false,
      });
      //X Axis Cap
      trendStep7 = anime({
          targets: ['#x-axis-cap path'],
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeInOutQuad',
          duration: 250,
          delay: 1000,
          direction: 'linear',
          autoplay: false,
      });
      //Trend Lines
      trendStep8 = anime({
          targets: ['#trendlines path'],
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeInOutQuad',
          duration: 1500,
          direction: 'linear',
          delay: schoolstart,
          autoplay: false,
      });
      //Scores Text
      trendStep9 = anime({
          targets: ['text#Scores'],
          opacity: 1,
          easing: 'linear',
          duration: 250,
          direction: 'linear',
          delay: 375,
          autoplay: false,
      });
      //2009 Text
      trendStep10 = anime({
          targets: ['text#t2009'],
          opacity: 1,
          easing: 'linear',
          duration: 250,
          direction: 'linear',
          delay: 250,
          autoplay: false,
      });
      //2016 Text
      trendStep11 = anime({
          targets: ['text#t2016'],
          opacity: 1,
          easing: 'linear',
          duration: 250,
          direction: 'linear',
          delay: 500,
          autoplay: false,
      });
    }

    function animateTrendGraphic() {
      // console.log('animateTrendGraphic()');
      initTrend.play();
      trendStep.play();
      trendStep1.play();
      trendStep2.play();
      trendStep3.play();
      trendStep4.play();
      trendStep5.play();
      trendStep6.play();
      trendStep7.play();
      trendStep8.play();
      trendStep9.play();
      trendStep10.play();
      trendStep11.play();
    }

    var avgGraphic = null;
    var growthGraphic = null;
    var trendGraphic = null;
    var windowHeight = null;
    var avgGraphicAnimated = false;
    var growthGraphicAnimated = false;
    var trendGraphicAnimated = false;

    function setElPositions() {
      // console.log('setElPositions()');
      avgGraphic = $('#avg-graphic').offset().top;
      growthGraphic = $('#growth-graphic').offset().top;
      trendGraphic = $('#trendgraphic').offset().top;
      windowHeight = $( window ).height();
      // console.log('avgGraphic offset = ' + avgGraphic);
      // console.log('growthGraphic offset = ' + growthGraphic);
      // console.log('trendGraphic offset = ' + trendGraphic);
      // console.log('windowHeight = ' + windowHeight);
    }

    function checkHomepageAnimations() {
      var Scroll = $(window).scrollTop() + windowHeight - 300;
      // console.log('scroll = ' + Scroll);

      if (Scroll >= avgGraphic && !avgGraphicAnimated) {
        // console.log('trigger avgGraphic');
        $("#avg-graphic").addClass("move");
        avgGraphicAnimated = true;
      }

      if (Scroll >= growthGraphic && !growthGraphicAnimated) {
        // console.log('trigger growthGraphic');
        $("#growth-graphic").addClass("move");
        growthGraphicAnimated = true;
      }

      if (Scroll >= trendGraphic && !trendGraphicAnimated) {
        // console.log('trigger trendGraphic');
        animateTrendGraphic();
        trendGraphicAnimated = true;
      }
    }

    var updateModal = {
        activeBio: null,
        allBios: null,
        update: function() {
            // console.log('updateModal.update()');
            var $button = $(this.allBios[this.activeBio]).find('button');

            // Get name, title, bio, and image
            var parent = $button.parent();
            // console.log(parent);
            var name = $button.parent().siblings('.name').text();
            // console.log('name = ' + name);
            var title = $button.parent().siblings('.title').text();
            // console.log('title = ' + title);
            var bio = $button.parent().siblings('.bio').html();
            /// console.log('bio = ' + bio);
            var image = $button.closest('.column-people').children('.pic').attr('style');
            var bigimage = $button.parent().siblings('.bigimage').html();

            // Set contents
            $('#modalImg').attr('style', image);
            $('img#bigimage').attr('src', bigimage);
            $('#modalName').text(name);
            $('#modalTitle').html(title);
            $('#modalBio').html(bio);
            $('#peopleBioModal').modal('show');

            // Check first and last position, disable buttons
            if (this.activeBio <= 0) {
                // console.log('first item');
                $('#prevBio').prop( "disabled", true);
                $('#nextBio').prop( "disabled", false);
            } else if (this.activeBio >= ((this.allBios).length - 1)) {
                // console.log('last item');
                $('#prevBio').prop( "disabled", false);
                $('#nextBio').prop( "disabled", true);
            } else {
                $('#prevBio').prop( "disabled", false);
                $('#nextBio').prop( "disabled", false);
            }
        }
    };

  $( document ).ready(function() {
    // Manage navbar appearance by scroll position
    $( window ).scroll(function() {
      var t = $(window).scrollTop();
      checkScroll(t);
    });
    // Check on page load as well.
    var t = $(window).scrollTop();
    checkScroll(t);

    // Smooth scroll down on button click
    $('.scroll-to-section').on('click', function(e) {
        console.log('click');
        e.preventDefault();
        var target_id = $(e.target).attr('data-scroll-target');
        // console.log(target_id);
        $target = $('#' + target_id);
        // console.log($target);
        $('html, body').animate({
            scrollTop: ($target.offset().top) - 63
        }, 500);
        var t = $(window).scrollTop();
        checkScroll(t);
    });

    // Handle bio modals
    if ($('.launch-people-bio').length >= 1) {
      // Store the complete collection of bios
      // so we can switch between them all.
      updateModal.allBios = $('.column-people');
      $('.launch-people-bio').click(function(e) {
        e.preventDefault();
        var $button = $(e.target);
        // Store active bio index so navigation between them works.
        updateModal.activeBio = (updateModal.allBios).index($button.closest('.column-people'));
        // console.log(updateModal.activeBio);
        updateModal.update();

        $('#prevBio').on('click', function() {
            if (updateModal.activeBio >= 1) {
                updateModal.activeBio = updateModal.activeBio - 1;
                updateModal.update();
            }
        });
        $('#nextBio').on('click', function() {
            if (updateModal.activeBio < (updateModal.allBios).length - 1) {
                updateModal.activeBio = updateModal.activeBio + 1;
                updateModal.update();
            }
        });
      });
    }

    // Dropdown for article sorting on mobile
    $('body.research .small-tab-nav ul li a').on('click', function(e) {
        // console.log('Small tab nav selection');
        $(this).tab('show');
        // Store target.
        $target = $(e.target);
        // Clear all active and highlight classes.
        $('body.research .small-tab-nav ul li a').removeClass('active highlight');
        // Add proper classes to selected target.
        $target.addClass('active highlight');
    });

    // Display article abstract and versions for entry on research page.
    $('a.show-versions').on('click', function(e) {
        // console.log('a.show-versions');
        toggleAbstract(e);
    });

    $('body.research a[data-toggle="tab"]').on('click touchstart', function (e) {
        // console.log('hide tab event');
        if ($('.research-paper.abstract-visible').length >= 1) {
            $('.research-paper.abstract-visible').removeClass('abstract-visible');
        }
    });

    $('#toggleDrawer').on('click', function() {
        // console.log('#toggleDrawer selected');
        $('#drawer').addClass('show');
    });

    $('#closeDrawer').on('click', function() {
        console.log('#closeDrawer selected');
        $('#drawer').removeClass('show');
    });

    // Add Subnav active selection highlighting
    $(".subnav a").click(function () {
        $(".subnav a").removeClass("highlight");
        $(this).addClass("highlight");
    });

    if ($('body.home').length >= 1) {
      console.log('setting up home page animations');
      setElPositions();
        $(window).resize(function() {
        setElPositions();
      })
      setElPositions();

      var userScrolled = false;
      var svgScrollEvt = $(window).scroll(function() {
        userScrolled = true;
      });
      var svgScrollInt = setInterval(function() {
        if (avgGraphicAnimated && growthGraphicAnimated && trendGraphicAnimated) {
          // Remove listener and interval
          // console.log('removing listener and interval');
          $(window).off("scroll", svgScrollEvt);
          clearInterval(svgScrollInt);
        } else {
          if (userScrolled) {
            setupAnime();
            checkHomepageAnimations();
            userScrolled = false;
          }
        }
      }, 50);
    }
  });
})(jQuery);
