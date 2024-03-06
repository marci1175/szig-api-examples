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
    const response = await fetch("http://localhost:8000/api/lessontimes", {"method": "GET"});
    // parse API response as JSON
    const lessonTimesAPIResponse = await response.json();

    console.log("The start and end times of all lessons are...");
    lessonTimesAPIResponse["lessontimes"].forEach((lesson) => {
        console.log(`${ordinalNumberEnding(lesson["name"])} lesson (${lesson["start"]} - ${lesson["end"]})`);
    })
}

getAPIData()