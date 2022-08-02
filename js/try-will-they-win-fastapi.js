// const willTheyWinURLFast = "http://127.0.0.1:8000/"
const willTheyWinURLFast = "http://willtheywin.ca/"

let sports;

function clearFormFastAPI() {}

function setElementDisplayFastAPI(elementId, displayValue) {
    var element = document.getElementById(elementId);
    element.style.display = displayValue;
}

function setFormDisplayFastAPI(displayValue) {
    setElementDisplayFastAPI("try-will-they-win-form-wrapper-fastapi", displayValue)
}

function setSpinnerDisplayFastAPI(displayValue) {
    setElementDisplayFastAPI("try-will-they-win-spinner-fastapi", displayValue)
}

function setWillTheyWinResponseDisplayFastAPI(displayValue) {
    setElementDisplayFastAPI("will-they-win-response-fastapi", displayValue)
}

function setResultDisplayFastAPI(displayValue) {
    setElementDisplayFastAPI("api-data-display-wrapper-fastapi", displayValue)
}

function setResponseDataDisplayFastAPI(displayValue) {
    setElementDisplayFastAPI("api-data-display-fastapi", displayValue)
}

function setResponseDataFastAPI(jsonData) {
    const apiDataDispaly = document.getElementById("api-data-display-fastapi");
    apiDataDispaly.innerText = JSON.stringify(jsonData, null, 4);
}

function clearResponseDataFastAPI() {
    var apiDataDispaly = document.getElementById("api-data-display-fastapi");
    apiDataDispaly.innerText = null;
}

function resetWillTheyWinModalFastAPI() {
    setFormDisplayFastAPI("block");
    setSpinnerDisplayFastAPI("none");
    setResultDisplayFastAPI("none");
    setResponseDataDisplayFastAPI("none");
    clearResponseDataFastAPI();
}

function handleAPIResponseJSONResultsFastAPI(jsonData) {
    setSpinnerDisplayFastAPI("none");
    setResponseDataFastAPI(jsonData);
    setResponseDataDisplayFastAPI("block");
    setResultDisplayFastAPI("block");
}

const sleepFastAPI = (milliseconds) => {
    console.log("sleepy time...")
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function getRequestFastAPI(url) {

    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    });

    // TODO: handle non 200 responses
    return response.json(); // parses JSON response into native JavaScript objects
}


async function getSportsTeams() {
    const url = `${willTheyWinURLFast}sports/`;
    console.log(url);
    sports = await getRequestFastAPI(url);
    return sports;
}


UIkit.util.on('#try-will-they-win-submit-fastapi', 'click', function (e) {
    e.preventDefault();
    e.target.blur();

    const selectedTeamID = document.getElementById("will-they-win-team-select-fastapi").value;
    const sentimentRadioInputs = document.getElementsByName("sentiment");
    let selectedSentiment;
    sentimentRadioInputs.forEach((radioEl) => {
        if(radioEl.checked) {
            selectedSentiment = radioEl.value;
        } 
    });
    
    console.log(selectedSentiment);

    // const queryString = "?" + new URLSearchParams({ sentiment: selectedSentiment });
    let url = `${willTheyWinURLFast}teams/${selectedTeamID}/ask`;

    if (selectedSentiment && selectedSentiment != 'any') {
        console.log('sentiment set and condition true'); 
        url = `${url}?${new URLSearchParams({ sentiment: selectedSentiment })}`;
    }

    const requestedURLSpan = document.getElementById("try-will-they-win-requested-url-fastapi");
    requestedURLSpan.innerText = url;

    setFormDisplayFastAPI("none");
    setResultDisplayFastAPI("block");
    setSpinnerDisplayFastAPI("block");
    setWillTheyWinResponseDisplayFastAPI("block");
    clearFormFastAPI();

    getRequestFastAPI(url)
        .then(data => { // JSON data parsed by `data.json()` call

            const slowYourRollFastAPI = async () => {
                // Sleep before showing the data as the API response is very fast and the spinner only flashes
                await sleepFastAPI(250);
                handleAPIResponseJSONResultsFastAPI(data);
            }

            slowYourRollFastAPI();

        });
});

UIkit.util.on('#make-new-request-fastapi', 'click', function (e) {
    e.preventDefault();
    e.target.blur();
    resetWillTheyWinModalFastAPI();
});

UIkit.util.on('#close-results-fastapi', 'click', function (e) {
    resetWillTheyWinModalFastAPI();
});

UIkit.util.on('#try-will-they-win-modal-fastapi', 'beforeshow', function (e) {
    populateSports();
    resetWillTheyWinModalFastAPI();
});

UIkit.util.on('#try-will-they-win-modal-fastapi', 'hidden', function (e) {
    resetWillTheyWinModalFastAPI();
});


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
} 

function compareStrVals(aVal, bVal) {
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
}

function compareSports(a, b) {
    const aVal = `${a.name.toUpperCase()} ${a.league.toUpperCase()}`;
    const bVal = `${b.name.toUpperCase()} ${b.league.toUpperCase()}`;
    return compareStrVals(aVal, bVal);
}

function compareTeams(a, b) {
    const aVal = `${a.city.toUpperCase()} ${a.name.toUpperCase()}`;
    const bVal = `${b.city.toUpperCase()} ${b.name.toUpperCase()}`;
    return compareStrVals(aVal, bVal);
}

function populateSports(sport) {
    if (!sports) {
        getSportsTeams().then(sports => {
            const sportSelect = document.getElementById("will-they-win-sport-select-fastapi");
            
            sports.sort(compareSports).map((sport) => {
                const sportNameDisplay = `${capitalize(sport.name)} (${sport.league})`
                let newOption = new Option(sportNameDisplay, sport.id);
                sportSelect.add(newOption);
            });
    
            const selectedSport = sport ? sport : sports[0]
            populateTeams(selectedSport);
    
        });
    }
}


function populateTeams(sport) {
    const teamSelect = document.getElementById("will-they-win-team-select-fastapi");
    // Remove existing team options if set. 
    teamSelect.querySelectorAll('option').forEach(option => option.remove());
    
    sport.teams.sort(compareTeams).map((team) => {
        const teamNameDisplay = `${capitalize(team.city)} ${capitalize(team.name)}`
        let newOption = new Option(teamNameDisplay, team.id);
        teamSelect.add(newOption);
    });
}

const sportSelectEl = document.getElementById("will-they-win-sport-select-fastapi");

sportSelectEl.addEventListener('change', (event) => {
    const selectedSportId = event.target.value;
    const selectedSport = sports.find((sport) => sport.id == selectedSportId);
    populateTeams(selectedSport);
});

