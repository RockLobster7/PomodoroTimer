$(document).ready(function () {
    // objects used for consitency when assigning values (helps with typos)
    var state = {
        "stopped": "stopped",
        "running": "running",
        "paused": "paused"
    }

    var cycle = {
        "ready": "ready",
        "work": "work",
        "rest": "rest"
    }

    /**
     * StartPauseButton constructor manages the button states */
    var StartPauseButton = function () {
        let isStartStatus = true;
        this.isStart = () => isStartStatus;

        this.setStart = () => {
            isStartStatus = true;
            $('#startPause').text('Start');
        }

        this.setPause = () => {
            isStartStatus = false;
            $('#startPause').text('Pause');
        }

        this.toggle = () => {
            if (isStartStatus) {
                isStartStatus = false;
                $('#startPause').text('Pause');
            } else {
                isStartStatus = true;
                $('#startPause').text('Start');
            }
        }
    };

    /**
     * Timer constructor manages timing operations */
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

                //start the timer only if its stopped
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

    /**
     * updateDisplay constructor updates the timer display and user messaging */
    function updateDisplay(secs) {
        // console.log('current cycle: ' + pomodoroTimer.getCycleName());
        // console.log('current timer state: ' + pomodoroTimer.getTimerState());

        if (secs != undefined) {
            //format time to mm:ss
            var date = new Date(null);
            date.setSeconds(secs);
            //display formatted time
            $('#countdown').text(date.toISOString().substr(14, 5));
        }

        //update mode text
        $('#timerState').text(pomodoroTimer.getTimerState());
        $('#currentCycle').text(pomodoroTimer.getCycleName());

        //update icon
        // $('#status').removeClass('rest-status');
        // $('#status').addClass('work-status');

        // $('#status').removeClass('work-status');
        // $('#status').addClass('rest-status');
    }

    /**
     * starTimer chains the Work and Rest timers to run indefinitely */
    function starTimer() {
        //work timer
        console.log('work');
        pomodoroTimer.start($('#workValue').val(), cycle.work)
            .then(() => {

                //rest timer
                console.log('rest');
                return (pomodoroTimer.start($('#restValue').val(), cycle.rest));
            }).then(() => {

                //cycle the timer indefinetely until stopped
                console.log('next cycle');
                return (starTimer());

            }).catch((stop) => {
                console.log(stop.message);
            });
    }

    //initialise touchspin controls
    $("input[name='Work']").TouchSpin({});
    $("input[name='Rest']").TouchSpin({});

    //create Objects
    var pomodoroTimer = new Timer();
    var startPauseButton = new StartPauseButton();

    //initialise display
    updateDisplay($('#workValue').val());

    //accept user inputs
    $('#start').click(function () {
        console.log('start clicked');
        starTimer();
    });

    $('#pause').click(function () {
        console.log('pause clicked');
        pomodoroTimer.pause();
    });

    $('#reset').click(function () {
        console.log('reset clicked');
        startPauseButton.setStart();
        pomodoroTimer.stop();
        //re-initialise display
        updateDisplay($('#workValue').val());
    });

    $('#startPause').click(function () {
        console.log('startPause clicked');

        switch (pomodoroTimer.getTimerState()) {
            case state.stopped:
                startPauseButton.toggle();
                starTimer();
                break;
            default:
                startPauseButton.toggle();
                pomodoroTimer.pause();
        }

    });
});