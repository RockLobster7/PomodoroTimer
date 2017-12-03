$(document).ready(function () {

    var state = {
        "stopped": "stopped",
        "running": "running",
        "paused": "paused"
    }

    var cycle = {
        "work": "work",
        "rest": "rest"
    }

    var Timer = function () {
        //private properties
        var timerState = state.stopped;
        var counterID;
        var cycleName;

        //public properties
        this.setTimerState = (val) => timerState = val;
        this.getTimerState = () => timerState;
        this.getCounterID = () => counterID;
        this.setCycleName = (val) => cycleName = val;
        this.getCycleName = () => cycleName;

        //public methods
        this.start = (duration, cycle) => {

            // console.log("GO");
            return new Promise((resolve, reject) => {

                if (timerState !== state.running) {
                    timerState = state.running;
                    cycleName = cycle;

                    $('#countdown').text(duration);

                    console.log('cycleName: ' + cycleName);
                    console.log('duration: ' + duration);
                    console.log('state: ' + timerState);

                    //decrenent the display every second
                    counterID = setInterval(function () {
                        if ($('#countdown').text() > 0) {
                            $('#countdown').text($('#countdown').text() - 1);
                        } else {
                            clearInterval(counterID);

                            timerState = state.stopped;
                            console.log('cycle finished');
                            console.log('cycleName: ' + cycleName);
                            console.log('state: ' + timerState);

                            resolve();
                        }
                    }, 1000);
                } else {
                    console.log("timer is already running");
                }
            });
        }

        this.stop = () => {
            clearInterval(counterID);
            timerState = state.stopped;
            console.log('state: ' + timerState);
        }

        this.pause = () => {
            switch (timerState) {
                case 'paused':
                    //resume timer if timer is paused
                    this.start($('#countdown').text(), cycleName);
                    break;

                case 'running':
                    //pause if timer is currently running
                    clearInterval(counterID);
                    timerState = state.paused;
                    console.log('state: ' + timerState);
                    break;

                case 'stopped':
                    console.log('state: ' + timerState);
                    console.log('Nothing to pause because timer is stopped.');
            }
        }
    }

    var myTimer = new Timer();

    $('#start').click(function () {
        console.log('start clicked');

        myTimer.start($('#workValue').val(), cycle.work).then(() =>
            myTimer.start($('#restValue').val(), cycle.rest)).then(() => {
            myTimer.setTimerState(state.stopped);
            console.log(myTimer.getTimerState());
        });




    });

    $('#pause').click(function () {
        console.log('pause clicked');
        myTimer.pause();
    });

    $('#reset').click(function () {
        console.log('reset clicked - but we are going to just STOP');
        myTimer.stop();
    });
});