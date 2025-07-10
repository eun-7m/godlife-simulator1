const missions = [
  "아침 6시에 일어나기",
  "핸드폰 없이 2시간 보내기",
  "낯선 사람에게 인사하기",
  "불편한 자리 도전하기",
  "오늘 하루 부정적인 말 금지",
  "운동 30분 하기",
  "자기 전 10분 독서하기"
];

let missionLog = JSON.parse(localStorage.getItem("missionLog") || "{}");
let missionCount = JSON.parse(localStorage.getItem("missionCount") || "{}");
let coin = parseInt(localStorage.getItem("coin") || "0");
let diaryLog = JSON.parse(localStorage.getItem("diaryLog") || "{}");
let emotionLog = JSON.parse(localStorage.getItem("emotionLog") || "{}");
let viewDate = new Date();

function getTodayStr() {
  const now = new Date();
  now.setHours(now.getHours() + 9); // 한국 시간으로 보정
  return now.toISOString().slice(0, 10);
}

function showPage(page) {
  ["mission", "calendar"].forEach(id => {
    document.getElementById(id).classList.remove("active");
    document.getElementById("tab-" + id).classList.remove("active");
  });
  document.getElementById(page).classList.add("active");
  document.getElementById("tab-" + page).classList.add("active");
}

function updateCoinDisplay() {
  document.getElementById("coinDisplay").innerText = `💰 코인: ${coin}`;
}

function addMission(text) {
  const today = getTodayStr();
  const mission = text || missions[Math.floor(Math.random() * missions.length)];
  const div = document.createElement("div");
  div.className = "mission";
  div.innerText = mission;
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "완료";
  completeBtn.onclick = () => {
    completeBtn.disabled = true;
    div.style.background = "#6366f1";
    div.style.color = "white";
    if (!missionCount[today]) missionCount[today] = 0;
    missionCount[today]++;
    if (!missionLog[today]) missionLog[today] = [];
    missionLog[today].push(mission);
    coin += 10;
    localStorage.setItem("missionLog", JSON.stringify(missionLog));
    localStorage.setItem("missionCount", JSON.stringify(missionCount));
    localStorage.setItem("coin", coin);
    updateCoinDisplay();
    renderCalendar();
  };
  div.appendChild(completeBtn);
  document.getElementById("missionList").appendChild(div);
}

function addCustomMission() {
  const input = document.getElementById("customMissionInput");
  if (input.value.trim()) {
    addMission(input.value.trim());
    input.value = "";
  }
}

function renderCalendar() {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  document.getElementById("calendarMonth").innerText = `${year}년 ${month + 1}월`;
  const datesContainer = document.getElementById("calendarDates");
  datesContainer.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    datesContainer.appendChild(empty);
  }

  for (let d = 1; d <= lastDate; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const cell = document.createElement("div");
    cell.className = "calendar-date";
    cell.innerText = d;
    if (missionLog[dateStr]) cell.classList.add("done");
    cell.onclick = () => {
      const count = missionCount[dateStr] || 0;
      const diary = diaryLog[dateStr] || "";
      const emotion = emotionLog[dateStr] || "";
      const todayStr = getTodayStr();
      const detailDiv = document.getElementById("calendarDetail");

      if (dateStr === todayStr) {
        detailDiv.innerHTML = `
          <strong>${dateStr}</strong><br><br>
          📝 <strong>일기 작성</strong><br>
          <textarea id="diaryInput" rows="4" style="width: 100%; padding: 0.5rem; border-radius: 0.5rem;">${diary}</textarea><br><br>
          <strong>오늘의 감정:</strong><br>
          <label><input type="radio" name="emotion" value="😄" ${emotion === "😄" ? "checked" : ""}> 😄</label>
          <label><input type="radio" name="emotion" value="😐" ${emotion === "😐" ? "checked" : ""}> 😐</label>
          <label><input type="radio" name="emotion" value="😢" ${emotion === "😢" ? "checked" : ""}> 😢</label><br><br>
          <button style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 0.5rem; cursor: pointer;" onclick="saveDiary('${dateStr}')">저장</button>
        `;
      } else {
        detailDiv.innerHTML = `
          <strong>${dateStr}</strong><br><br>
          📝 <strong>일기:</strong><br>
          <div style="white-space: pre-wrap; margin-top: 0.5rem;">${diary || "작성된 일기가 없습니다."}</div><br>
          <strong>감정:</strong> ${emotion || "선택 안됨"}
        `;
      }
    };
    datesContainer.appendChild(cell);
  }

  const today = getTodayStr();
  const count = missionCount[today] || 0;
  document.getElementById("todaySummary").innerText = `오늘 ${count}개의 미션을 성공하셨습니다 💪`;
}

function changeMonth(diff) {
  viewDate.setMonth(viewDate.getMonth() + diff);
  renderCalendar();
}

function saveDiary(dateStr) {
  const text = document.getElementById("diaryInput").value;
  const emotionEl = document.querySelector('input[name="emotion"]:checked');
  const emotion = emotionEl ? emotionEl.value : "";

  diaryLog[dateStr] = text;
  emotionLog[dateStr] = emotion;

  localStorage.setItem("diaryLog", JSON.stringify(diaryLog));
  localStorage.setItem("emotionLog", JSON.stringify(emotionLog));

  alert("일기와 감정이 저장되었습니다! 📝");
}

window.onload = () => {
  updateCoinDisplay();
  renderCalendar();
};
