$(document).ready(function () {

    //state object just adds some consitency when assigning values (helps with typos)
    var state = {
        "stopped": "stopped",
        "running": "running",
        "paused": "paused"
    }

    //cycle object just adds some consitency when assigning values (helps with typos)
    var cycle = {
        "work": "work",
        "rest": "rest"
    }
    //timer object provides timing and screen updating operations
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
            return new Promise((resolve, reject) => {

                //start the timer if its currently stopped
                if (timerState === state.stopped) {

                    timerState = state.running;
                    cycleName = cycle;

                    $('#countdown').text(duration); //temporary assignment until we figure out the UI ***********

                    console.log('cycleName: ' + cycleName);
                    console.log('duration: ' + duration);
                    console.log('state: ' + timerState);

                    //start the timer. 
                    //Timer 'ticks' every second checking the following logic
                    counterID = setInterval(function () {

                        //timer will run until the display reads zero
                        if ($('#countdown').text() > 0) {

                            switch (timerState) {

                                //countdown the display while we're in 'running' state
                                case state.running:
                                    $('#countdown').text($('#countdown').text() - 1);
                                    break;

                                    //dont update the display if we're in paused state
                                    //dummy case block added to make the logic easier to read.
                                case state.paused:
                                    break;

                                    //if 'stopped'; end the timer and prematurely exit the promise
                                case state.stopped:
                                    clearInterval(counterID);
                                    console.log('cycle STOPPED');
                                    console.log('cycleName: ' + cycleName);
                                    console.log('state: ' + timerState);
                                    reject(new Error('Reset'));
                            }
                        } else {
                            //once the display reaches zero, end the timer and resolve the promise
                            clearInterval(counterID);
                            timerState = state.stopped;
                            console.log('cycle Finished');
                            console.log('cycleName: ' + cycleName);
                            console.log('state: ' + timerState);
                            resolve();
                        }
                    }, 1000);
                }
            });
        }

        this.stop = () => {
            timerState = state.stopped;
            console.log('state: ' + timerState);
        }

        this.pause = () => {
            switch (timerState) {
                case 'paused':
                    //resume if paused
                    timerState = state.running;
                    console.log('state: ' + timerState);
                    break;

                case 'running':
                    //pause if running
                    timerState = state.paused;
                    console.log('state: ' + timerState);
                    break;

                case 'stopped':
                    //do nothing if stopped
                    console.log('state: ' + timerState);
                    console.log('Nothing to pause because timer is stopped.');
            }
        }
    }

    var myTimer = new Timer();

    $('#start').click(function () {
        console.log('start clicked');

        myTimer.start($('#workValue').val(), cycle.work)
            .then(() =>
                myTimer.start($('#restValue').val(), cycle.rest))
            .then(() => {
                myTimer.setTimerState(state.stopped);
                console.log(myTimer.getTimerState());
            })
            .catch((error) => {
                console.log(error.message);
            });

    });

    $('#pause').click(function () {
        console.log('pause clicked');
        myTimer.pause();
    });

    $('#reset').click(function () {
        console.log('reset clicked - but we are going to just STOP for now');
        myTimer.stop();
    });
});