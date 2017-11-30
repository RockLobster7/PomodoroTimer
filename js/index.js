$(document).ready(function () {


    var Timer = function () {

        var duration = 0;
        var paused = null;
        var start = false;
        var counterID = undefined;

        this.setDuration = (num) => duration = num;
        this.getDuration = () => duration;
        this.setPause = (val) => true;
        this.isPaused = () => paused;
        this.getCounterID = () => counterID;

        this.start = (xduration) => {
            return new Promise(resolve => {

                $('#countdown').text(xduration);

                //decrenent the display every second
                counterID = setInterval(function () {
                    if ($('#countdown').text() > 0) {
                        $('#countdown').text($('#countdown').text() - 1);
                    } else {
                        clearInterval(counterID);
                        resolve();
                    }
                }, 1000);
                return (this);
            });
        }
    }

    var myTimer = new Timer();

    myTimer.setDuration(9);
    console.log(myTimer.getDuration());
    console.log(myTimer.getCounterID());


    $('#start').click(function () {
        // Timer($('#workValue').val()).then(() =>
        //     Timer($('#restValue').val()));

        myTimer.start($('#workValue').val()).then(() => myTimer.start($('#restValue').val()));
    });

    $('#pause').click(function () {
        console.log(myTimer.getCounterID());
    });
});


