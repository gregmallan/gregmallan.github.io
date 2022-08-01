const willTheyWinURL = "https://grega.pythonanywhere.com/will-they-win/";

function clearForm() {
    var teamInput = document.getElementById("will-they-win-team-input-flask");
    teamInput.value = null;
}

function setElementDisplay(elementId, displayValue) {
    var element = document.getElementById(elementId);
    element.style.display = displayValue;
}

function setFormDisplay(displayValue) {
    setElementDisplay("try-will-they-win-form-wrapper-flask", displayValue)
}

function setSpinnerDisplay(displayValue) {
    setElementDisplay("try-will-they-win-spinner-flask", displayValue)
}

function setWillTheyWinResponseDisplay(displayValue) {
    setElementDisplay("will-they-win-response-flask", displayValue)
}

function setResultDisplay(displayValue) {
    setElementDisplay("api-data-display-wrapper-flask", displayValue)
}

function setResponseDataDisplay(displayValue) {
    setElementDisplay("api-data-display-flask", displayValue)
}

function setResponseData(jsonData) {
    var apiDataDispaly = document.getElementById("api-data-display-flask");
    apiDataDispaly.innerText = JSON.stringify(jsonData);
}

function clearResponseData() {
    var apiDataDispaly = document.getElementById("api-data-display-flask");
    apiDataDispaly.innerText = null;
}

function resetWillTheyWinModal() {
    setFormDisplay("block");
    setSpinnerDisplay("none");
    setResultDisplay("none");
    setResponseDataDisplay("none");
    clearResponseData();
}

function handleAPIResponseJSONResults(jsonData) {
    setSpinnerDisplay("none");
    setResponseData(jsonData);
    setResponseDataDisplay("block");
    setResultDisplay("block");
}

const sleep = (milliseconds) => {
    console.log("sleepy time...")
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function getRequest(url) {

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
    let url = willTheyWinURL + "?" + new URLSearchParams({ team: teamName });
    let requestedURLSpan = document.getElementById("try-will-they-win-requested-url-flask");
    requestedURLSpan.innerText = url;

    setFormDisplay("none");
    setResultDisplay("block");
    setSpinnerDisplay("block");
    setWillTheyWinResponseDisplay("block");
    clearForm();

    getRequest(url)
        .then(data => { // JSON data parsed by `data.json()` call

            const slowYourRoll = async () => {
                // Sleep before showing the data as the API response is very fast and the spinner only flashes
                await sleep(250);
                handleAPIResponseJSONResults(data);
            }

            slowYourRoll()

        });
});

UIkit.util.on('#make-new-request-flask', 'click', function (e) {
    e.preventDefault();
    e.target.blur();
    resetWillTheyWinModal();
});

UIkit.util.on('#close-results-flask', 'click', function (e) {
    resetWillTheyWinModal();
});

UIkit.util.on('#try-will-they-win-modal-flask', 'beforeshow', function (e) {
    resetWillTheyWinModal();
});

UIkit.util.on('#try-will-they-win-modal-flask', 'hidden', function (e) {
    resetWillTheyWinModal();
});
