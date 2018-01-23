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
             $('#startPause').switchClass('fa-pause', 'fa-play');
        }

        this.setPause = () => {
            isStartStatus = false;
            $('#startPause').switchClass('fa-play', 'fa-pause');
        }

        this.toggle = () => {
            if (isStartStatus) {
                isStartStatus = false;
                $('#startPause').removeClass('fa-play');
                $('#startPause').addClass('fa-pause');
            } else {
                isStartStatus = true;
                $('#startPause').removeClass('fa-pause');
                $('#startPause').addClass('fa-play');
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
                        console.log('Starting counterID:' + counterID);
                        //timer will run until we reach zero
                        if (duration > 0) {

                            switch (timerState) {
                                case state.running:
                                    duration--;
                                    updateDisplay(duration);
                                    break;

                                case state.stopped:
                                    // clearInterval(counterID);  //delete this line**
                                    updateDisplay();
                                    console.log('Manually Stopping counterID:' + counterID);
                                    reject(new Error('Stop'));
                            }
                        } else {
                            //once the display reaches zero, end the timer and resolve the promise
                            //clearing the interval timer here seems to make timer unstable
                            //perhaps because we're destroying the object while its still in use
                            // clearInterval(counterID);
                            timerState = state.stopped;
                            // console.log('End of Timer Stopping counterID:' + counterID);
                            console.log("resolving promise");
                            resolve();
                        }
                    }, 1000);
                }
            });
        }

        this.stop = () => {
            clearInterval(counterID);
            timerState = state.stopped;
            cycleName = cycle.ready;
            //            updateDisplay();

            console.log('End of Timer Stopping counterID:' + counterID);
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
     * updateDisplay constructor updates the timer display and end-user messaging */
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

        //update status icon
        switch (pomodoroTimer.getCycleName()) {
            case "work":
            $('#currentCycle').addClass('currentCycle-working', 500, "easeInOutQuad");
                $('#status').switchClass('rest-status', 'work-status');
                updateTheme("neutral", "blue");
                updateTheme("green", "blue");
                break;
            case "rest":
                $('#status').switchClass('work-status', 'rest-status');
                updateTheme("blue", "green");
                break;
            default:
            $('#currentCycle').switchClass('currentCycle-working', 'currentCycle-ready', 500, "easeInOutQuad");
                $('#status').removeClass('rest-status', 500, "easeInOutQuad");
                $('#status').removeClass('work-status', 500, "easeInOutQuad");
                updateTheme("blue", "neutral");
                updateTheme("green", "neutral");
        }
    }

    function updateTheme(oldColour, newColour) {
        $('#status-bar').switchClass(oldColour + "-status-bar", newColour + "-status-bar", 1000, "easeInOutQuad");
        $('body').switchClass(oldColour + "-bg", newColour + "-bg", 1000, "easeInOutQuad")
        $('input').switchClass(oldColour + "-TouchSpin", newColour + "-TouchSpin", 1000, "easeInOutQuad");
        $('button').switchClass( oldColour + "-bg", newColour + "-bg", 1000, "easeInOutQuad");
		
		$('.timer-controls').switchClass( oldColour + "-timer-controls", newColour + "-timer-controls", 1000, "easeInOutQuad");

                //************* */
        // $("input[name='Work']").trigger("touchspin.uponce");
        // $("input").trigger("touchspin.updatesettings", {
        //     min: 5
        // });
        // $("input").trigger("touchspin.updatesettings", {
        //     buttondown_class: 'btn blue-TouchSpin'
        // });
    }

    /**
     * starTimer chains the Work and Rest timers to run indefinitely */
    function startTimer() {
        //work timer
        console.log('work');
        pomodoroTimer.start($('#workValue').val() * 60, cycle.work)
            .then(() => {
                //clearing the interval timer here because the timer becomes unstable if we clear it within the Timer object
                clearInterval(pomodoroTimer.getCounterID());
                console.log('End of Timer Stopping counterID:' + pomodoroTimer.getCounterID());

                //rest timer
                console.log('rest');
                return (pomodoroTimer.start($('#restValue').val() * 60, cycle.rest));
            }).then(() => {

                //clearing the interval timer here because the timer becomes unstable if we clear it within the Timer object
                clearInterval(pomodoroTimer.getCounterID());
                console.log('End of Timer Stopping counterID:' + pomodoroTimer.getCounterID());

                //cycle the timer indefinetely until stopped
                console.log('next cycle');
                return (startTimer());

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
    updateDisplay($('#workValue').val() * 60);

    //accept user inputs
    $('#startPause').click(function () {
        console.log('startPause clicked');

        switch (pomodoroTimer.getTimerState()) {
            case state.stopped:
                startPauseButton.toggle();
                startTimer();
                break;
            default:
                startPauseButton.toggle();
                pomodoroTimer.pause();
        }
    });

    $('#reset').click(function () {
        console.log('reset clicked');
        startPauseButton.setStart();
        pomodoroTimer.stop();
        //re-initialise display
        updateDisplay($('#workValue').val() * 60);
    });
});