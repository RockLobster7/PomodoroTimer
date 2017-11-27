$(document).ready(function () {

    // startTimer($('#workValue').val())
    // startTimer($('#restValue').val())

    function startTimer(duration) {
        $('#countdown').text(duration);
        //decrenent the display every second
        var counterID = setInterval(function () {
            if ($('#countdown').text() > 0) {
                $('#countdown').text($('#countdown').text() - 1);
            } else {
                clearInterval(counterID);
            }
        }, 1000);
    };

    $('#start').click(function () {

        startTimer($('#workValue').val());


        // startTimer($('#restValue').val());
    });
});