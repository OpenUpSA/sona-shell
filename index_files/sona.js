$('html').removeClass('no_js')
$('html').addClass('js')

var AppSettings = {
    DEBUGMODE: true //change to turn on/off console.log statements
};

/**
 * Simple debug setup for logging to the console
 * @type {Object}
 */
var Debug = {
    log: function(string, variable) {
        if (AppSettings.DEBUGMODE) {
            try {
                console.log(string, variable)
            } catch (e) {}
        }
    },
    warn: function(string, variable) {
        if (AppSettings.DEBUGMODE) {
            try {
                console.warn(string, variable)
            } catch (e) {}
        }
    }
};

var VideoModal = {
    init: function(){
        // Gets the video src from the data-src on each button
        var $videoSrc, $videoStart, $videoEnd, $params;
        $('.video-modal').click(function () {
            $videoSrc = $(this).data("src")
            $videoStart = $(this).data("start")
            $videoEnd = $(this).data("end")

            $params = "?autoplay=1&rel=0"
            if ($videoStart) {
                $params += '&start=' + $videoStart
            }
            if ($videoEnd) {
                $params += '&end=' + $videoEnd
            }
        })
        
        // when the modal is opened autoplay it  
        $('#myModal').on('shown.bs.modal', function (e) {
            // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
            $("#video").attr('src', $videoSrc + $params)
            $("#video").attr('allow', "autoplay; accelerometer; encrypted-media; gyroscope;")
        })

        // stop playing the youtube video when I close the modal
        $('#myModal').on('hide.bs.modal', function (e) {
            // a poor man's stop video
            $("#video").attr('src', $videoSrc)
        })
    }
};

var cookies = {
    createCookie: function(name, value, days){
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else {
            var expires = "";
        }
        let cookie = name + "=" + value + expires + "; path=/"
        document.cookie = cookie;
    },
    readCookie: function(name){
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    eraseCookie: function(name){
        cookies.createCookie(name, "", -1);
    }
}

var VenoPopup = {
    init: function(){
        $('.venobox').venobox()

        var boxPopup = $('.boxPopup').venobox()
        // close current item clicking on .closeme
        $(document).on('click', '.closeBoxPopup', function(e){
            boxPopup.VBclose()
        })

        VenoPopup.june2019()
    },
    june2019: function(){
        var june_cookie_name = '2019_june_sona'
        cookies.eraseCookie(june_cookie_name)

        var cookie_read = cookies.readCookie(june_cookie_name)

        if (!cookie_read && $('.june2019Popup').length) {
            console.log('No Cookie')
            $('.june2019Popup').trigger('click')
            cookies.createCookie(june_cookie_name, 'true', 7)
        }
    }
};

var ToggleNavigation = {
    init: function(){
        $('.toggle-nav').click(function (e) {
            e.preventDefault();
            $('body').toggleClass('open-navigation')
        });
    }
}

var Accordion = {
    init: function(){
        $('.June2019__opener').click(function () {
            $('.June2019__wrapper').toggleClass('open')
        });
    }
}

var ScrollNav = {
    init: function(){
        $('#sticker').hcSticky({
            stickTo: '#sticker__frame'
        });
    }
}

var NewsTicker = {
    init: function(){
        $('#newsTicker1').breakingNews({
            height: 50
        });
    }
}

var Main = {
    run: function() {
        Debug.log('Custom Scripts Running')
        VideoModal.init();
        VenoPopup.init();
        ToggleNavigation.init();
        Accordion.init();
        ScrollNav.init();
        NewsTicker.init();

        $('#news-carousel').carousel({
            interval: 5000
        })
        Debug.log('Custom Scripts still Running')

        $('#news-carousel-play').click(function () {
            $('#news-carousel').carousel('cycle');
            $('#news-carousel-play').hide();
            $('#news-carousel-pause').show();
        });
        $('#news-carousel-pause').click(function () {
            $('#news-carousel').carousel('pause');
            $('#news-carousel-pause').hide();
            $('#news-carousel-play').show();
        });


        setInterval(function () {

            $.ajax('/check.json', {
                success: function (data) {
                    if (!window.versionCheck) {
                        window.versionCheck = data;
                    } else {

                        if (data && data.version !== window.versionCheck.version) {
                            window.location.reload();
                        }

                    }
                }
            })
        }, 1000 * 60);


    }
};

$(document).ready(Main.run)
