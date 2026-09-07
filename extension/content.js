console.log("Extension running...");

function processComments() {
    let comments = document.querySelectorAll("#content-text");

    console.log("Total comments found:", comments.length);

    if (comments.length === 0) {
        console.log("Comments not loaded yet...");
        return;
    }

    comments.forEach(comment => {
        let text = comment.innerText;

        console.log("Processing:", text);

        fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ comment: text })
        })
        .then(res => res.json())
        .then(data => {
            console.log("API Response:", data);

            if (data.toxic === true) {
                console.log("Toxic detected!");

                comment.style.backgroundColor = "black";
                comment.style.color = "white";
                comment.innerText = "🚫 Toxic Comment Hidden";
            }
        })
        .catch(err => console.log("Fetch Error:", err));
    });
}

// 🔥 Keep checking until comments load
setInterval(processComments, 2000);