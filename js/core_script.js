  /*----------------------------------------------------*/
  /* Html bridge
  ------------------------------------------------------ */
$(function(){
    $("#contactSection").load("sub_mod/contact.html");
});

$(function(){
    $("#projectSection").load("sub_mod/Projects.html");
});

$(function(){
    $("#modalTemplate").load("sub_mod/Project_modal_template.html");
});


  /*----------------------------------------------------*/
  /* Load json file, and sort
  ------------------------------------------------------ */
  var G_j_pfo_projs = null;
  function sortResults(j_arr, prop, asc) {
      return j_arr.sort(function(a, b) {
          if (asc) return (a[prop] > b[prop]);
          else return (b[prop] > a[prop]);
      });
  }

  //Load json and sort json and generate pfo cards
  $(function () {
      $.getJSON("sub_mod/pfo_projects.json",
          function (json) {
              G_j_pfo_projs = json;
              // console.log(G_j_pfo_projs);
              if(G_j_pfo_projs != null)
              {
                  G_j_pfo_projs = sortResults(G_j_pfo_projs, "id_name", true);
                  gen_pfo_cards(G_j_pfo_projs);
              }
          });
  });


  /*----------------------------------------------------*/
  /* AUTO portfolio card gen
  ------------------------------------------------------ */
  function gen_pfo_cards(_G_j_pfo_projs){
      var pfo_elem;
      for (var i = 0; i < _G_j_pfo_projs.length; i++) {
          pfo_elem = "";
          pfo_elem += " <li class=\"pfo-item\">\n" +
              "<div class=\"card col-lg-4 col-md-4 col-xs-6 col-sm-6\" id=\"" + _G_j_pfo_projs[i].id_name + "\">" +
              "    <span class=\"card-pic\">\n" +
              "      <div class = \"card-pic-crop\" >\n" +
              "      <img src=\""+ _G_j_pfo_projs[i].img_directory + _G_j_pfo_projs[i].img_cover + "\"/>\n" +
              "      </div> \n" +
              "      <div class=\"card-description\">\n" +
              "      <div class=\"card-des-title\">\n" +
              _G_j_pfo_projs[i].title+
              "      </div>\n" +
              "      <div class=\"card-des-explain\">\n" +
              _G_j_pfo_projs[i].description+
              "      </div>\n" +
              "      </div>\n" +
              "    </span>\n" +
              "</div>\n" +
              "</li>";

          $('#pfo-bundle').append(pfo_elem);
      }
  }
  /*----------------------------------------------------*/
  /* AUTO portfolio modal real-time gen
  ------------------------------------------------------ */
  var G_cur_pfo_id_name = "";
  //find item index in json list
  function indexOfItemInJSON (_item_name, _item_val, _json_list){
      return _json_list.findIndex(function(__item, _i){
          return __item[_item_name]===_item_val;
      });
  }

  function gen_pfo_modal(_id_name, offset)
  {
      // Use preloaded json to construct page dynamically
      if(G_j_pfo_projs != null) {
          var i = indexOfItemInJSON("id_name",_id_name,G_j_pfo_projs);
          if(i != -1) {
              i = i + offset; //offsetting the selection for prev/next
              i = i <= -1 ? (G_j_pfo_projs.length-1) : i; //-ve prev
              i = i >= G_j_pfo_projs.length ? 0 : i; //next is 0

              G_cur_pfo_id_name = G_j_pfo_projs[i].id_name; //save id_name globally
              var modal_html_buffer;

              modal_html_buffer = "<h1>" + G_j_pfo_projs[i].title + "<h1>";
              $('#modal-templ-title').html(modal_html_buffer);

              modal_html_buffer = "<div class=\"carouselCard\">\n" +
                  "                            <div class=\"owl-demo owl-carousel img-comment\" >";
              //load demo images
              var j_items = G_j_pfo_projs[i].more_imgs;
              var j = 0;
              for (j = 0; j < j_items.length; j++) {
                  modal_html_buffer += "<div><img src=\"" + G_j_pfo_projs[i].img_directory
                      + j_items[j] + "\"><p>" + G_j_pfo_projs[i].more_imgs_title[j] + "</p></div>\n";
              }

              modal_html_buffer += " </div>\n" +
                  "                        </div>";
              // console.log(modal_html_buffer);
              $('#modal-templ-imgs').html(modal_html_buffer);

              //load details
              j_terms = G_j_pfo_projs[i].tags;
              modal_html_buffer = "<p><strong>Position: </strong>" + G_j_pfo_projs[i].position + "</p>\n" +
                  "                            <p><strong>Category: </strong>";
              for (j = 0; j < j_terms.length - 1; j++) {
                  modal_html_buffer += j_terms[j] + ", ";
              }
              modal_html_buffer += j_terms[j];
              modal_html_buffer += "</p>\n" +
                  " <p><strong>View Code: </strong> <i class=\"fa fa-github\" style=\"padding-right:2px;\"></i><a href=\"" +
                  G_j_pfo_projs[i].code_link + "\" target=\"_blank\">"
                  + G_j_pfo_projs[i].code_link + "</a></p>\n";
              $('#modal-templ-details').html(modal_html_buffer);

              //load descriptions Paragraphs
              modal_html_buffer = "<h5 class=\"info-font\">Project Description</h5>\n";
              j_terms = G_j_pfo_projs[i].paras_title;
              for (j = 0; j < j_terms.length; j++) {
                  modal_html_buffer += "<div  class=\"project-head4\"><h4>" + j_terms[j] + "</h4></div>\n";
                  modal_html_buffer += "<p class=\"project-para\">\n" + G_j_pfo_projs[i].paras[j] + "</p>\n";
              }
              $('#modal-templ-description').html(modal_html_buffer);

              //Update owl image
              $(".owl-demo").owlCarousel({
                  navigation: true,
                  navigationText: ["<span class='angle'></span>", "<span class='angle'></span>"],
                  singleItem: true,
                  autoHeight: true,
                  transitionStyle: "fade"
              });

              //Display the modal
              $('#portfolioModalTemplate').modal('show');
          }
      }
  }
  $(document).on('click', '.card', function () {
      var id = this.id;
      // console.log("Clicked = "+id);
      gen_pfo_modal(id, 0);
  });
  $(document).on('click', '.prevp', function () {
      gen_pfo_modal(G_cur_pfo_id_name, -1);
  });
  $(document).on('click', '.nextp', function () {
      gen_pfo_modal(G_cur_pfo_id_name, +1);
  });

  /*----------------------------------------------------*/
  /* Navbar Smooth Scroll
  ------------------------------------------------------ */
// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});


  /*----------------------------------------------------*/
  /* Responsive Menu Navbar
  ------------------------------------------------------ */
// jQuery to collapse the navbar on scroll
function collapseNavbar() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
}
$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);
// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
  if ($(this).attr('class') != 'dropdown-toggle active' && $(this).attr('class') != 'dropdown-toggle') {
    $('.navbar-toggle:visible').click();
  }
});

  /*----------------------------------------------------*/
  /* parallax
  ------------------------------------------------------ */
$(window).scroll(function(e){
  parallax();
});

function parallax() {
  var scrollPosition = $(window).scrollTop();
  $("#intro-bgc").css('margin-top', (0 - (scrollPosition * .8)) + 'px');
}

  /*----------------------------------------------------*/
  /* Initializing jQuery Nice Scroll
  ------------------------------------------------------ */

$("body").niceScroll({
  bouncescroll:"",
  cursorcolor:"#11abb0", // Set cursor color
  cursorwidth: "8", // Sety cursor width
  cursorborder: "" // Set cursor border color, default left none
});

  /*----------------------------------------------------*/
  /* TODO Unknowns !!
  ------------------------------------------------------ */

// $('.filter li a').click(function(e) {
//   e.preventDefault();
//   var $this = $(this);
//   $('li').removeClass('activeL');
//   $this.parent().addClass('activeL');
//   // Filter
//   var te= document.getElementsByClassName('activeL');
//   var ac=$( te ).attr("datalist");
//   // console.log(ac);
//
//   var listItems = $("#workList li");
//   listItems.each(function() {
//     var dl=$(this).attr("class");
//     // console.log(dl);
//
//     if(ac!='*'){
//       // console.log(0);
//       if(dl!=ac){
//         // console.log(true);
//         $(this).fadeOut("slow");
//       }else{
//         $(this).fadeIn("slow");
//       }
//     }else{
//       $(this).fadeIn("slow");
//     }
//   });
//   //
//
//   e.preventDefault();
// });
//
// $('.pageclose').click(function () {
//   $('.modal').modal('toggle');
// });
//
// $('#lihuili').hover(function(){
//   $('#edulfs').toggleClass("linebf");
//   $('#edulfs').toggleClass("linebflihuili");
// });
// $('#loyola').hover(function(){
//   $('#edulfs').toggleClass("linebf");
//   $('#edulfs').toggleClass("linebfloyola");
// });
// $('#uw').hover(function(){
//   $('#edulfs').toggleClass("linebf");
//   $('#edulfs').toggleClass("linebfuw");
// });
