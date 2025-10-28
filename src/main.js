const t = document.getElementById('text');
const c = document.createElement("div");
const b = document.createElement("div");
document.getElementById('game').appendChild(b);
document.getElementById('game').appendChild(c);

let l = 0;
let d = [];
let tm, iv;
let ts = false;
let go = false;

const s = {
    "길거리": {
        "사람에게 다가가기": [
            { n: "김명희 (65)", m: "내가… 어딜 가려 했지?" },
            { n: "한서준 (8)", m: "첫 심부름이니까 열심히 하자!" },
            { n: "이수빈 (32)", m: "이번 달은 식비가 빠듯하네… 아껴쓰자." }
        ],
        "탐색하기": [
            { n: "전봇대", m: "전단지가 붙어 있다." },
            { n: "가로등", m: "불빛이 희미하다." }
        ]
    },
    "부동산": {
        "사람에게 다가가기": [
            { n: "최영일 (54)", m: "우리 애 대학보내려면 아직 빠듯해…" },
            { n: "김영자 (50)", m: "무슨 돈? 생트집 잡지마 학생!" },
            { n: "범유인 (23)", m: "제 돈 돌려낼 생각 없어요?" }
        ],
        "탐색하기": [
            { n: "책상 밑", m: "무언가 작은 장치가 보인다…" }
        ]
    },
    "학원": {
        "사람에게 다가가기": [
            { n: "조은경 (19)", m: "대학가고싶어대학가고싶어..." },
            { n: "정영호 (18)", m: "이게 끝나기는 해?" },
            { n: "최지우 (17)", m: "집에 가고 싶어..." }
        ],
        "탐색하기": [
            { n: "칠판", m: "‘살고싶어’라는 글자가 희미하게 보인다." }
        ]
    }
};

function tj() {
    if (l >= 5) return "살고싶어...";
    if (l >= 3) return "다시 시작인가요...";
    return "이게 끝나기는 해?";
}

function st() {
    if (ts) return;
    ts = true;
    let time = 60;
    b.style.width = "100%";
    b.style.height = "10px";
    b.style.background = "red";

    iv = setInterval(() => {
        time--;
        b.style.width = `${(time / 60) * 100}%`;
        if (time <= 0) clearInterval(iv);
    }, 1000);

    tm = setTimeout(() => {
        d.push("시간 초과");
        eg();
    }, 60000);
}

function sc(opt) {
    c.innerHTML = "";
    opt.forEach(o => {
        const btn = document.createElement("button");
        btn.innerText = o.t;
        btn.onclick = o.f;
        c.appendChild(btn);
    });
}

function mp(p) {
    const msg = p.n === "정영호 (18)" ? tj() : p.m;
    t.innerText = `${p.n}: "${msg}"`;
    sc([{ t: "뒤로", f: mm }]);
}

function cs(x) {
    st();
    const a = Object.keys(s[x]);
    t.innerText = `${x} 안을 둘러봅니다.`;
    sc(a.map(act => ({
        t: act,
        f: () => {
            const lst = s[x][act];
            sc(lst.map(it => ({
                t: it.n,
                f: () => {
                    if (!it.n.includes("(")) return chk(x, it);
                    d.push(it.n);
                    mp(it);
                }
            })));
        }
    })));
}

function chk(x, it) {
    if (x === "부동산" && it.n === "책상 밑") {
        t.innerText = "책상 밑 장치: 두 줄이 보입니다. 어느 줄을 끊겠습니까?";
        sc([
            { t: "빨간 줄", f: () => eg("r") },
            { t: "파란 줄", f: () => eg("b") },
            { t: "손 떼기", f: mm }
        ]);
    } else {
        t.innerText = it.m;
        sc([{ t: "뒤로", f: mm }]);
    }
}

function sh() {
    t.innerText = "무엇을 소리치겠습니까?";
    sc([
        { t: "‘도와줘!’", f: () => { d.push("주변 사람"); t.innerText = "사람들이 놀라 도망갔습니다."; mm(); } },
        { t: "‘폭탄이야!’", f: () => { d.push("혼란에 빠진 사람들"); t.innerText = "주변이 혼란에 빠졌습니다."; mm(); } },
        { t: "직접 입력", f: si }
    ]);
}

function si() {
    c.innerHTML = "";
    const i = document.createElement("input");
    i.placeholder = "무엇을 외치시겠습니까?";
    const btn = document.createElement("button");
    btn.innerText = "외치기";
    btn.onclick = () => {
        const v = i.value;
        if (v === "폭탄") { d.push("주변 사람"); t.innerText = "사람들이 비명을 지르며 흩어졌습니다."; mm(); }
        else if (v === "도망") { d.push("모든 사람"); t.innerText = "당신은 혼자 도망쳤습니다."; eg(); }
        else { t.innerText = "아무도 반응하지 않았습니다."; mm(); }
    };
    c.appendChild(i);
    c.appendChild(btn);
}

function eg(clr) {
    go = true;
    clearTimeout(tm);
    clearInterval(iv);
    ts = false;
    c.innerHTML = "";

    if (clr === "r") {
        t.innerHTML = "빨간 줄이 끊어졌습니다.<br>전원 사망<br>";
    }
    else if (clr === "b") {
        t.innerHTML = `파란 줄이 끊어졌습니다.<br> 당신만 사망.<br><br>죽은 사람 목록:<br>당신`;
    }
    else {
        t.innerHTML = "폭발 발생<br><br>죽은 사람:<br>" + d.join("<br>");
    }

    sc([
        { t: "회귀하기", f: rg },
        { t: "포기하기", f: gu }
    ]);
}

function gu() {
    t.innerHTML = "당신은 긴 싸움에서 패배하였습니다. <br> <br>you lose...";
    c.innerHTML = "";
    setTimeout(() => { window.location.href = "index.html"; }, 3000);
}

function mm() {
    st();
    t.innerText = `you're winning! \n회귀 횟수: ${l}\n무엇을 하시겠습니까? `
    sc([
        { t: "소리치기", f: sh },
        { t: "탐색하기", f: () => sc(Object.keys(s).map(x => ({ t: x, f: () => cs(x) }))) },
        { t: "도망가기", f: () => { t.innerText = "도망쳤지만 아무도 살지 못했습니다."; eg(); } }
    ]);
}

function rg() {
    l++;
    d = [];
    go = false;
    ts = false;
    t.innerText = "다시 눈을 떴습니다.";
    mm();
}

mm();
