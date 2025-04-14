/*
    a = displaying Ids
    b = tag for gradient
    c = speed
*/

export const propertiesToString = (displayingIds, tagIndex, speed) => {
    let baseUrl = "https://www.paurosello.net/dynamovis/#/albatross/";
    let displayingIdsString = displayingIdsToString(displayingIds);
    let tagForLineColorString = `b=${tagIndex}`;
    let speedString = `c=${speed}`;

    return `${baseUrl}${displayingIdsString};${tagForLineColorString};${speedString}`;
}

export const stringToProperties = (str, setDisplayingIds, setTagForLineColorIndex, setSpeed) => {
    let sections = str.split(";");
    let _a = sections[0];

    sections.forEach(section => {
        const idChar = section.charAt(0);
        const argument = section.substring(2, section.length);
        switch (idChar) {
            case "a":
                setDisplayingIds(stringToDisplayingIds(argument));
                break;
            case "b":
                setTagForLineColorIndex(parseInt(argument));
                break;
            case "c":
                setSpeed(parseInt(argument));
                break;

        }
    })

}

function displayingIdsToString(displayingIds) {
    let url = "";
    if (displayingIds.length > 0) {
        url = "a=";
        let binary = "1";
        displayingIds.forEach(id => binary += (id ? "1" : "0"));
        var hexa = parseInt(parseInt(binary), 2).toString(16).toUpperCase();
        url += hexa;
    }
    return url;
}

function stringToDisplayingIds(str) {
    let binary = parseInt(str, 16).toString(2);
    binary = binary.substring(1, binary.length);
    let ids = binary.split("").map(x => x == "1" ? true : false);
    return ids;
}