// Function to handler the onclick update event.
function handleClickUpdate(taskId, taskTitle) {

    if (! confirm(`Do you confirm updating ${taskTitle}?`)) return;

    // URI for the Web Site:
    const uriUpdate = `/site/tasks/${taskId}`;
    //const uriUpdate = form.getAttribute('action'); // get the form action URI

    // Get form
    const form = document.getElementById('formUpdateTask');
    const formDataTask = new FormData(form);

    const urlencodedForm = new URLSearchParams(formDataTask);
    const urlencodedFormObj = Object.fromEntries(urlencodedForm);

    //console.log("uriUpdate:", uriUpdate);
    const options = {
        method: 'PUT',
        body: urlencodedForm
    };
    const messages = {
        ok: `Task '${taskTitle == urlencodedFormObj.title ? taskTitle : urlencodedFormObj.title}' was updated!`,
        error: `Task '${taskTitle}' was NOT updated!`
    }

    // Fetch the web site server
    fetchWebSite(uriUpdate, options, messages);
}

function fetchWebSite(uri, options, messages){
    //console.log(uri);
    //console.log(options);
    fetch(uri, options)
        .then(response => {
            // Message in the alert window
            if (response.ok){
                alert(messages.ok);
            }
            else {
                alert(messages.error);
            }
            // Parser HTML text
            return response.text();
        })
        .then(htmlText => {
            // Replaces HTML document body with response
            document.documentElement.innerHTML = htmlText;
        })
        .catch(err => {
            console.log("Fetch error:", err);
            alert(`Fetch error: ${err.message}`);
        });
}
