$(document).ready(function () {
    // https://www.reddit.com/r/learnjavascript/comments/3rf800/chaining_settimeout_with_promises_good_idea/?st=jahzwqem&sh=fe61aeb2

    function sleep(time) {
        return new Promise(resolve => {
            setTimeout(resolve, time);
        });
    }

    var timeA = 500;
    var timeB = 500;
    var timeC = 500;

    sleep(timeA).then(() => {
        console.log('a')
        return sleep(timeB);
    }).then(() => {
        console.log('b')
        return sleep(timeC)
    }).then(() => {
        console.log('c')
    })


    function startTimer(duration) {
        return new Promise(resolve => {
            $('#countdown').text(duration);
            //decrenent the display every second
            var counterID = setTimeout(function () {
                // if ($('#countdown').text() > 0) {
                //     $('#countdown').text($('#countdown').text() - 1);
                // } else {
                //     clearInterval(counterID);
                // }
                resolve (alert('hello' + duration));
            }, 3000);
        });
    }

    // startTimer($('#workValue').val())
    // startTimer($('#restValue').val())

    // function startTimer(duration) {
    //     $('#countdown').text(duration);
    //     //decrenent the display every second
    //     var counterID = setInterval(function () {
    //         if ($('#countdown').text() > 0) {
    //             $('#countdown').text($('#countdown').text() - 1);
    //         } else {
    //             clearInterval(counterID);
    //         }
    //     }, 1000);
    // };



    $('#start').click(function () {


        // startTimer($('#workValue').val()).then(() => {
        //     return startTimer($('#restValue').val());
        // });


        startTimer($('#workValue').val()).then(() => 
            startTimer($('#restValue').val()) );


        // startTimer($('#restValue').val())
        // startTimer($('#workValue').val());

    });
});