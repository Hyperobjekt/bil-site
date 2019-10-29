

(function($) {
    var jQuery = $.noConflict(false);
    var $ = jQuery;

    // Add sticky top class to pages generally
    //function homesticky() {
      if ( $( "body.kind-section" ).length || ( "body.kind-page" ).length ) {
        $('nav').addClass('sticky-top');
        //$('.subnav').addClass('sticky-top');
      }
    //}
    // Make sticky top class dynamic on home page only
    function checkScroll(y) {
        // console.log(checkScroll);
        // If the scroll is at the top, not sticky.
        // Transition comes farther down the page for
        // the the front page.
        var heroHeight = $('body.home #hero') ? $('body.home #hero').height() : 0;
        // console.log(heroHeight);
        if (y <= (heroHeight - 64)) {
            // $('body').addClass('scroll-top');
            $('nav').removeClass('sticky-top');
           // $('.subnav').removeClass('sticky-top');
        } else if (y > (heroHeight - 64)) {
            // $('body').removeClass('scroll-top');
            $('nav').addClass('sticky-top');
           // $('.subnav').addClass('sticky-top');
        }
    }

    /** Dropdown on hover */
    $(".dropdown-toggle").hover( function () {
      // Open up the dropdown
      $(this).removeAttr('data-toggle'); // remove the data-toggle attribute so we can click and follow link
      $(this).parent().addClass('show'); // add the class show to the li parent
      $(this).next().addClass('show'); // add the class show to the dropdown div sibling
    }, function () {
      // on mouseout check to see if hovering over the dropdown or the link still
      var isDropdownHovered = $(this).next().filter(":hover").length; // check the dropdown for hover - returns true of false
      var isThisHovered = $(this).filter(":hover").length;  // check the top level item for hover
      if(isDropdownHovered || isThisHovered) {
          // still hovering over the link or the dropdown
      } else {
          // no longer hovering over either - lets remove the 'show' classes
          $(this).attr('data-toggle', 'dropdown'); // put back the data-toggle attr
          $(this).parent().removeClass('show');
          $(this).next().removeClass('show');
      }
    });
    // Check the dropdown on hover
    $(".dropdown-menu").hover( function () {
    }, function() {
      var isDropdownHovered = $(this).prev().filter(":hover").length; // check the dropdown for hover - returns true of false
      var isThisHovered= $(this).filter(":hover").length;  // check the top level item for hover
      if(isDropdownHovered || isThisHovered) {
          // do nothing - hovering over the dropdown of the top level link
      } else {
          // get rid of the classes showing it
          $(this).parent().removeClass('show');
          $(this).removeClass('show');
      }
    });

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
        $('#peopleBioModal button.close').on('click', function() {
          // console.log('closing, active bio = ');
          // console.log(updateModal.activeBio);
          updateModal.activeBio = 0;
          $('#prevBio').unbind('click');
          $('#nextBio').unbind('click');
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

  
  });
})(jQuery);
