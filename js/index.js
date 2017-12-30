$(document).ready(function () {

    //initialise touchspin controls
    $("input[name='Work']").TouchSpin({});

    $("#workValue").change(function () {
        // alert($('#workValue').val());
        // alert("work has been changed");
    });

    $("input[name='Rest']").TouchSpin({});



    // object just adds some consitency when assigning values (helps with typos)
    var state = {
        "stopped": "stopped",
        "running": "running",
        "paused": "paused"
    }

    // object just adds some consitency when assigning values (helps with typos)
    var cycle = {
        "ready": "ready",
        "work": "work",
        "rest": "rest"
    }
    //timer object provides timing and screen updating operations
    var Timer = function () {
        //private properties
        var timerState = state.stopped;
        var counterID;
        var cycleName = cycle.ready;
        // var currentDuration;

        //public properties
        this.setTimerState = (val) => timerState = val;
        this.getTimerState = () => timerState;
        this.getCounterID = () => counterID;
        this.setCycleName = (val) => cycleName = val;
        this.getCycleName = () => cycleName;
        // this.getDuration = () => currentDuration;

        //public methods
        this.start = (duration, cycle) => {

            return new Promise((resolve, reject) => {

                //start the timer if its currently stopped
                if (timerState === state.stopped) {

                    timerState = state.running;
                    cycleName = cycle;
                    updateDisplay(duration);

                    //start the timer. //Timer 'ticks' every second
                    counterID = setInterval(function () {

                        //timer will run until we reach zero
                        if (duration > 0) {

                            switch (timerState) {
                                case state.running:
                                    duration--;
                                    updateDisplay(duration);
                                    break;

                                case state.stopped:
                                    clearInterval(counterID);
                                    reject(new Error('Stop'));
                            }
                        } else {
                            //once the display reaches zero, end the timer and resolve the promise
                            clearInterval(counterID);
                            timerState = state.stopped;
                            resolve();
                        }
                    }, 1000);
                }
            });
        }

        this.stop = () => {
            timerState = state.stopped;
            cycleName = cycle.ready;
            updateDisplay();
            console.log('state: ' + timerState);
            console.log('cycle: ' + cycleName);
        }

        this.pause = () => {
            switch (timerState) {

                //resume if paused
                case 'paused':
                    timerState = state.running;
                    updateDisplay();
                    console.log('state: ' + timerState);
                    break;

                    //pause if running
                case 'running':
                    timerState = state.paused;
                    updateDisplay();
                    console.log('state: ' + timerState);
                    break;

                    //do nothing if stopped
                case 'stopped':
                    console.log('state: ' + timerState);
                    console.log('Nothing to pause because timer is stopped.');
            }
        }
    }


    var myTimer = new Timer();


    //initialise display
    updateDisplay($('#workValue').val());

    function updateDisplay(secs) {
        // console.log('current cycle: ' + myTimer.getCycleName());
        // console.log('current timer state: ' + myTimer.getTimerState());

        if (secs != undefined) {
            //format time to mm:ss
            var date = new Date(null);
            date.setSeconds(secs);
            //display formatted time
            $('#countdown').text(date.toISOString().substr(14, 5));
        }

        //update mode text
        $('#timerState').text(myTimer.getTimerState());
        $('#currentCycle').text(myTimer.getCycleName());

        //update icon
        // $('#status').removeClass('rest-status');
        // $('#status').addClass('work-status');

        // $('#status').removeClass('work-status');
        // $('#status').addClass('rest-status');
    }





    $('#start').click(function () {

        console.log('start clicked');
        starTimer();


        function starTimer() {
            //work timer
            console.log('work');
            myTimer.start($('#workValue').val(), cycle.work)
                .then(() => {

                    //rest timer
                    console.log('rest');
                    return (myTimer.start($('#restValue').val(), cycle.rest));
                }).then(() => {

                    //cycle the timer indefinetely until stopped
                    console.log('next cycle');
                    return (starTimer());

                }).catch((stop) => {
                    console.log(stop.message);
                });
        }

    });

    $('#pause').click(function () {
        console.log('pause clicked');
        myTimer.pause();

    });

    $('#reset').click(function () {
        console.log('reset clicked');
        myTimer.stop();
        //re-initialise display
        updateDisplay($('#workValue').val());
    });
});