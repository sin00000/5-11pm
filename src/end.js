const w = document.getElementById("credit-wrap");
const d = JSON.parse(localStorage.getItem("deadList")) || [];


if (d.length === 0) {
    w.innerHTML = "<p>사망자 데이터가 없습니다.</p>";
} else {
    d.forEach(p => {
        const div = document.createElement("div");
        div.className = "person";

        const img = document.createElement("img");
        img.className = "face";
        img.src = p.face || "image/player.jpg";
        img.alt = p.n;

        const name = document.createElement("div");
        name.className = "name";
        name.textContent = p.n;

        div.appendChild(img);
        div.appendChild(name);
        w.appendChild(div);
    });
}


document.getElementById("replay").onclick = () => {
    localStorage.removeItem("deadList");
    location.href = "1.html";
};

document.getElementById("giveup").onclick = () => {
    localStorage.removeItem("deadList");
    location.href = "lose.html";
};
