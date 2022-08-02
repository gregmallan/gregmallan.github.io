const willTheyWinURLFlask = "https://grega.pythonanywhere.com/will-they-win/";

function clearFormFlask() {
    var teamInput = document.getElementById("will-they-win-team-input-flask");
    teamInput.value = null;
}

function setElementDisplayFlask(elementId, displayValue) {
    var element = document.getElementById(elementId);
    element.style.display = displayValue;
}

function setFormDisplayFlask(displayValue) {
    setElementDisplayFlask("try-will-they-win-form-wrapper-flask", displayValue)
}

function setSpinnerDisplayFlask(displayValue) {
    setElementDisplayFlask("try-will-they-win-spinner-flask", displayValue)
}

function setWillTheyWinResponseDisplayFlask(displayValue) {
    setElementDisplayFlask("will-they-win-response-flask", displayValue)
}

function setResultDisplayFlask(displayValue) {
    setElementDisplayFlask("api-data-display-wrapper-flask", displayValue)
}

function setResponseDataDisplayFlask(displayValue) {
    setElementDisplayFlask("api-data-display-flask", displayValue)
}

function setResponseDataFlask(jsonData) {
    var apiDataDispaly = document.getElementById("api-data-display-flask");
    apiDataDispaly.innerText = JSON.stringify(jsonData);
}

function clearResponseDataFlask() {
    var apiDataDispaly = document.getElementById("api-data-display-flask");
    apiDataDispaly.innerText = null;
}

function resetWillTheyWinModalFlask() {
    setFormDisplayFlask("block");
    setSpinnerDisplayFlask("none");
    setResultDisplayFlask("none");
    setResponseDataDisplayFlask("none");
    clearResponseDataFlask();
}

function handleAPIResponseJSONResultsFlask(jsonData) {
    setSpinnerDisplayFlask("none");
    setResponseDataFlask(jsonData);
    setResponseDataDisplayFlask("block");
    setResultDisplayFlask("block");
}

const sleepFlask = (milliseconds) => {
    console.log("sleepy time...")
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function getRequestFlask(url) {

    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    });

    // TODO: handle non 200 responses
    return response.json(); // parses JSON response into native JavaScript objects

}

UIkit.util.on('#try-will-they-win-submit-flask', 'click', function (e) {
    e.preventDefault();
    e.target.blur();

    let teamName = document.getElementById("will-they-win-team-input-flask").value;
    let url = willTheyWinURLFlask + "?" + new URLSearchParams({ team: teamName });
    let requestedURLSpan = document.getElementById("try-will-they-win-requested-url-flask");
    requestedURLSpan.innerText = url;

    setFormDisplayFlask("none");
    setResultDisplayFlask("block");
    setSpinnerDisplayFlask("block");
    setWillTheyWinResponseDisplayFlask("block");
    clearFormFlask();

    getRequestFlask(url)
        .then(data => { // JSON data parsed by `data.json()` call

            const slowYourRollFlask = async () => {
                // Sleep before showing the data as the API response is very fast and the spinner only flashes
                await sleepFlask(250);
                handleAPIResponseJSONResultsFlask(data);
            }

            slowYourRollFlask();

        });
});

UIkit.util.on('#make-new-request-flask', 'click', function (e) {
    e.preventDefault();
    e.target.blur();
    resetWillTheyWinModalFlask();
});

UIkit.util.on('#close-results-flask', 'click', function (e) {
    resetWillTheyWinModalFlask();
});

UIkit.util.on('#try-will-they-win-modal-flask', 'beforeshow', function (e) {
    resetWillTheyWinModalFlask();
});

UIkit.util.on('#try-will-they-win-modal-flask', 'hidden', function (e) {
    resetWillTheyWinModalFlask();
});
