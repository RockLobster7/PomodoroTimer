$(document).ready(function () {

    var state = {
        "stopped": "stopped",
        "running": "running",
        "paused": "paused"
    }

    var Timer = function () {
        var timerState = state.stopped;
        var counterID;
        var cycleName;

        this.setTimerState = (val) => timerState = val;
        this.getTimerState = () => timerState;
        this.getCounterID = () => counterID;
        this.setCycleName = (val) => cycleName = val;
        this.getCycleName = () => cycleName;

        this.start = (duration, cycle) => {
            return new Promise(resolve => {

                cycleName = cycle;
                timerState = state.running;
                $('#countdown').text(duration);

                console.log('cycleName: ' + cycleName);
                console.log('state: ' + timerState);
                console.log('duration: ' + duration);

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

    $('#start').click(function () {
        console.log('start clicked');
        myTimer.start($('#workValue').val(), 'work').then(() =>
            myTimer.start($('#restValue').val(), 'rest')).then(() => {
                myTimer.setTimerState(state.stopped); 
                console.log(myTimer.getTimerState());
        });
    });

    $('#pause').click(function () {
        console.log('pause clicked');

        switch (myTimer.getTimerState()) {
            case 'paused':
                switch (myTimer.getCycleName()) {
                    case 'work':
                        myTimer.start($('#countdown').text(), 'work').then(() =>
                            myTimer.start($('#restValue').val(), 'rest'));
                        break;

                    case 'rest':
                        myTimer.start($('#countdown').text(), 'work')
                }
                myTimer.setTimerState('running');
                break;

            case 'running':
                clearInterval(myTimer.getCounterID());
                myTimer.setTimerState('paused');
                console.log('state: ' + myTimer.getTimerState());
                break;

            case 'stopped':
                console.log('state: ' + myTimer.getTimerState());
                //nothing to pause. nothing to do
        }
    });
});