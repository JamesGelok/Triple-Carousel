// Automatically calling this function on page load using an IIFE. Google IIFE, same as using document.ready();
/* global $ */
(function() {
    loadJSON(function(response) {
        /* = Note: ====================================
         * mentorData loooks like this:
         * [{name, text, icon}, {name, text, icon}, ...]
         * ============================================ */
        var arrMentorInfoObj = JSON.parse(response);

        /* ================================================
         * Declare Array of targeted elements on the page
         * ================================================*/

        var arrOfDisplayTargets = [];
        for (var i = 0, j = 0; i < $('.tc-mentor').length; i += 2, j++) {
            arrOfDisplayTargets.push({
                overlay: $(`.tc-filter:eq(${j})`),
                sideA: {
                    nameDiv: $(`.tc-mentor:eq(${i}) .tc-name`),
                    textDiv: $(`.tc-mentor:eq(${i}) .tc-text`),
                    iconDiv: $(`.tc-mentor:eq(${i})`),
                    visible: true
                },
                sideB: {
                    nameDiv: $(`.tc-mentor:eq(${i+1}) .tc-name`),
                    textDiv: $(`.tc-mentor:eq(${i+1}) .tc-text`),
                    iconDiv: $(`.tc-mentor:eq(${i+1})`),
                    visible: false
                }
            });

            $(`.tc-mentor:eq(${i+1})`).css({
                'z-index': '-1',
            });
        }

        /* =========================================================
         * Populate all DOM elements
         * ========================================================= */
        var mentorInfoCount = 0;
        var aodtLength = arrOfDisplayTargets.length;
        var side;
        var elementsOnScreen = Array.apply(-1, Array(aodtLength));
        for (mentorInfoCount; mentorInfoCount < aodtLength; mentorInfoCount++) {
            for (var i = 0; i < 2; i++) {
                side = (i > 0) ? "sideB" : "sideA"; // If sideB isn't populated animations don't work
                arrOfDisplayTargets[mentorInfoCount][side].nameDiv.html(arrMentorInfoObj[mentorInfoCount].name);
                arrOfDisplayTargets[mentorInfoCount][side].textDiv.html(arrMentorInfoObj[mentorInfoCount].text);
                arrOfDisplayTargets[mentorInfoCount][side].iconDiv.css({
                    'background-image': `url(${arrMentorInfoObj[mentorInfoCount].imgUrl})`
                });
                if (side == "sideA") {
                    elementsOnScreen[mentorInfoCount] = mentorInfoCount;
                    arrOfDisplayTargets[mentorInfoCount].overlay.attr('href', `${arrMentorInfoObj[mentorInfoCount].linkUrl}`);
                }
            }
        }

        // 3 Constraints
        // 1st Constraint: Must be a random section that wasn't the one previously chosen
        // 2nd Constraint: Must not choose a section that is currently being hovered over
        // 3rd Constraint: No twin images allowed

        var elementChosen = 0;

        function chooseElement(lastChanged) {
            // Will never choose last changed
            var randNum = Math.floor(Math.random() * arrOfDisplayTargets.length);
            if (randNum == lastChanged || arrOfDisplayTargets[randNum].overlay.is(":hover")) return chooseElement(lastChanged);
            else return randNum;
        }



        function getNextMentorIndex(mentorInfoCount) {
            mentorInfoCount %= arrMentorInfoObj.length;

            if (elementsOnScreen.includes(mentorInfoCount)) {
                mentorInfoCount++;
                getNextMentorIndex(mentorInfoCount);
            }

            return mentorInfoCount;
        }

        setInterval(function() {
            mentorInfoCount = getNextMentorIndex(mentorInfoCount);
            elementChosen = chooseElement(elementChosen);

            var backSide = arrOfDisplayTargets[elementChosen]["sideA"].visible ? "sideB" : "sideA";
            var frontSide = (backSide == "sideA") ? "sideB" : "sideA";

            arrOfDisplayTargets[elementChosen][backSide].nameDiv.html(arrMentorInfoObj[mentorInfoCount].name);
            arrOfDisplayTargets[elementChosen][backSide].textDiv.html(arrMentorInfoObj[mentorInfoCount].text);
            arrOfDisplayTargets[elementChosen][backSide].iconDiv.css({
                'background-image': `url(${arrMentorInfoObj[mentorInfoCount].imgUrl})`,
                'z-index': '0',
                'display': 'initial'
            });
            arrOfDisplayTargets[elementChosen].overlay.attr('href', `${arrMentorInfoObj[mentorInfoCount].linkUrl}`);
            elementsOnScreen[elementChosen] = mentorInfoCount;


            // Animate the foreground element (foreground elements are always b)
            arrOfDisplayTargets[elementChosen][frontSide].iconDiv.css({
                'z-index': '-1',
                'filter': 'sepia(0.6) grayscale(0.6) blur(5px)',
            });

            mentorInfoCount++;
        }, 3000);
    });

    // Get the JSON data using AJAX
    function loadJSON(callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'mentors.json', true);
        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }
}());
