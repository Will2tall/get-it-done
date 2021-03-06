var limitWarningEl = document.querySelector("#limit-warning");
var issueContainerEl = document.querySelector("#issues-container");

var displayWarning = function(repo) {
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    //append to warning container
    limitWarningEl.appendChild(linkEl);
};

var getRepoIssues = function(repo) {
    console.log(repo);
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
               // pass response data to dom function
               displayIssues(data);
               
               //chck if api has paginated issues
               if (response.headers.get("Link")) {
                   displayWarning(repo)
               }
            });
        }
        else {
            alert("There was a problem with your request!");
        }
    });
};

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    for (var i=0; i < issues.length; i++) {
        // create a link element ot take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
        // create a span to hold issue title
        var titleEl = document.createElement('span');
        titleEl.textContent = issues[i].title;

        //append to container
        issueEl.appendChild(titleEl);

        //create type element
        var typeEl = document.createElement("span");

        //check if issues is an actual issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = '(Pull request)';
        } else {
            typeEl.textContent = "(Issue)";
        }
        //append to container
        issueEl.appendChild(typeEl)
        issueContainerEl.appendChild(issueEl);
    }
}
getRepoIssues("facebook/react");