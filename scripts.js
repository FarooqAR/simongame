$(document).ready(function() {
    var series = [], //indexes of buttons pressed by computer
        userPress = [], //indexes of buttons pressed by user
        results = [], //wins and loses as true or false
        winCount = 0,
        lostCount = 0,
        vitoryCount = 0,
        isStrictMode = false,
        isGameLaunched = false, //is the simon switched on?
        isStarted = false, //did user clicked start button? help to stop previously running series
        sounds = [
            new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
            new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
            new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
            new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
        ];
    $(".controls .on_off").click(function() {
        isGameLaunched = isGameLaunched ? false : true;
        $(this).toggleClass("enabled");
        $(".controls .start").toggleClass("enabled");
        if(isStrictMode) 
            $(".controls .strict").addClass("enabled");
        if(!isGameLaunched){
            resetGame();
            $(".controls .strict").removeClass("enabled");
        }
    });
    $(".controls .strict").click(function() {
        if (isGameLaunched) {
            $(this).toggleClass("enabled");
            isStrictMode = isStrictMode ? false : true;
        }
    });
    $(".controls .start").click(function() {
        if (isGameLaunched) {
            showMessage("!!", "white");
            isStarted = true;
            startGame(false, true);
        }
    });
    $(".btn").click(function() {
        //get button index from its class
        var className = $(this).attr("class");
        var btnIndex = parseInt(className[className.length - 1]);

        play(btnIndex);
        userPress.push(btnIndex);

        if (isValidUserInput()) {
            if (userPress.length == series.length) { //if its the last right press
                results.push(true);
                if (results.length >= 20 && isVictorious()) {
                    vitoryCount++;
                    showMessage("You are the victor!", "lawngreen");
                    $("#victory").text(vitoryCount);
                    results = [];
                }
                winCount++;
                $("#wins").text("" + winCount);
                showMessage("Right!", "lawngreen");
                $(".btn").addClass("disabled");
                startGame(true, true); //restart same series with an additional step

            }
        } else {
            results.push(false);
            showMessage("Wrong!", "red");
            lostCount++;
            $("#loss").text(lostCount);
            $(".btn").addClass("disabled");
            startGame(!isStrictMode, isStrictMode); //restart same series without an additional step, start a new game if its strict mode
        }
    });
    $(".btn").addClass("disabled");


    function play(index) {
        sounds[index].play();
    }

    function resetGame() {
        series = [];
        results = [];
        winCount = 0;
        lostCount = 0;
        vitoryCount = 0;
        $("#wins").text(winCount);
        $("#loss").text(lostCount);
        $("#victory").text(vitoryCount);
    }

    function isVictorious() { //return true if user wins 20 games in a row
        for (var i = results.length - 20; i < results.length; i++) {
            if (!results[i]) {
                return false;
            }
        }
        return true;
    }
    //press the specified button in the series
    function pressButton(series, i) {

        play(series[i]);
        $(".btn._" + series[i] + " .overlay").addClass("active");
        setTimeout(function() {
            $(".btn._" + series[i] + " .overlay").removeClass("active");
            i++;
            if (!isStarted && isGameLaunched && i < series.length) {
                setTimeout(function() { //set a small break b/w button presses
                    pressButton(series, i);
                }, 100)
            } else if (i == series.length) {
                $(".btn").removeClass("disabled");
            }
        }, 500);

    }
    //show message in the black window
    function showMessage(message, color) {
        $(".alert_message").css({
            "color": color
        });
        $("#alert_message").text(message);
        $("#alert_message").fadeIn(0).delay(300).fadeOut(0).delay(300).fadeIn(0).delay(300).fadeOut(0);
    }


    function startGame(isRestart, withAdditionalStep) {
        $(".btn").addClass("disabled");
        series = isRestart ? series : []; //use the same series if its restart otherwise a new one
        userPress = [];
        if (withAdditionalStep) series.push(getRandomNum());
        setTimeout(function() {
            isStarted = false;
            pressButton(series, 0);
        }, 2000);
    }

    function isValidUserInput() {
        for (var i = 0; i < userPress.length; i++) {
            if (userPress[i] !== series[i]) {
                return false;
            }
        }
        return true;
    }

    function getRandomNum() {
        return Math.floor(Math.random() * 4);
    }
});