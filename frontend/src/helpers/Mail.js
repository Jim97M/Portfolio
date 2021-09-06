export const sendMail = data => {
    return fetch('http://localhost:3001/api/sendmail', {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body:JSON.stringify(data)
    }).then(response => {
        console.log("response", response);
        return 
    }).catch(err => {
        console.log("Error", err);
    });
}