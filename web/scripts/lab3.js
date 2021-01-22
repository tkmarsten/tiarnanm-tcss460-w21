function performProblemFour() {
    p = document.getElementsByTagName("p");
    for (const ps of p) {
        ps.style.background = "black";
        ps.style.color = "yellow";
    }
}

function performProblemFive() {
    p5 = document.getElementById("p5");
    for (var i = 2; i <= 10; i++) {
        img = document.createElement("img");
        img.setAttribute("src", "./images/cards/" + i + "S.jpg");
        p5.append(img);
        img.style.width = "50px";
    }
}