function secondsFromHMS(hours, minutes, seconds) {
    // converts hours, minutes and seconds to seconds from start of day
    return (hours * 60 + minutes) * 60 + seconds;
}


function getTimesFromString(timeString) {
    // converts HH:MM:SS format time to seconds from start of day
    let parts = timeString.split(":").map(Number);  // creates a list containing the hours, the minutes and the seconds
    return secondsFromHMS(parts[0], parts[1], parts[2]);
}


function ordinalNumberEnding(number) {
    // returns the correct suffix for an English ordinal number
    if (number === 1) {
        return "1st";
    } else if (number === 2) {
        return "2nd";
    } else if (number === 3) {
        return "3rd";
    } else {
        return `${number}th`;
    }
}


async function getAPIData() {
    // get response from server
    const response = await fetch("https://ujbudaiszechenyi.hu/api/lessontimes", {"method": "GET"});
    // parse API response as JSON
    const lessonTimesAPIResponse = await response.json();

    // convert lesson start and end times from HH:MM:SS format to seconds from beginning of the day
    let lessonTimes = [];
    lessonTimesAPIResponse["lessontimes"].forEach((lesson) => {
        lessonTimes.push({
            "name": lesson["name"],
            "start": getTimesFromString(lesson["start"]),
            "end": getTimesFromString(lesson["end"])
        })
    })

    // get current time in seconds
    let currTime = new Date();
    let currTimeSeconds = secondsFromHMS(currTime.getHours(), currTime.getMinutes(), currTime.getSeconds());
    // currTimeSeconds = 18 * 60 * 60

    let userNotification;
    if (lessonTimes[0]["start"] > currTimeSeconds) {
        // checks if no lesson has begun yet
        userNotification = "The school day hasn't begun yet";
    } else if (lessonTimes[lessonTimes.length-1]["end"] < currTimeSeconds) {
        // checks whether all lessons ended
        userNotification = "The school day has already ended";
    } else {
        // within the start and the end of the school day
        for (let i = 0; i < lessonTimes.length; i++) {
            let currentLesson = lessonTimes[i];
            if (currentLesson["start"] <= currTimeSeconds && currTimeSeconds <= currentLesson["end"]) {
                // checks whether current time is within the start and end time of the i-th lesson
                let remainingMinutes = Math.round((currentLesson["end"] - currTimeSeconds) / 60);
                userNotification = `${ordinalNumberEnding(currentLesson["name"])} lesson (${remainingMinutes} minutes remaining)`;
                break;
            }
        }
    }

    if (!userNotification) {
        // checks whether userNotification has a value
        // can only be true if the current time is in one of the breaks
        for (let i = 0; i < lessonTimes.length-1; i++) {
            let currentLesson = lessonTimes[i];
            let nextLesson = lessonTimes[i+1];
            if (currentLesson["end"] <= currTimeSeconds && currTimeSeconds <= nextLesson["start"]) {
                userNotification = `${ordinalNumberEnding(currentLesson["name"])} break (${(nextLesson["start"]-currTimeSeconds) / 60} minutes remaining)`
            }
        }
    }
    console.log(userNotification);
}

getAPIData();