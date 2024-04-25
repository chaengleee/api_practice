const listCon = document.querySelector(".listCon");

const API_KEY = "1e118813-fef8-41bd-9e59-fa60fb9c0995";
let pageNo = 1;
let numOfRows = 10;

let currentPage = 1;
let totalItems = 0;
let totalPages = 0;

const preBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageIndicator = document.getElementById("pageIndicator");

preBtn.addEventListener("click", () => {
  if (currentPage === 1) return;
  currentPage--;
  getLatestDatas(currentPage);
});

nextBtn.addEventListener("click", () => {
  if (currentPage === totalPages) return;
  currentPage++;
  getLatestDatas(currentPage);
});

const updatePagination = () => {
  preBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
};

const calculateTotalPages = (totalItems, numOfRows) => {
  return Math.ceil(totalItems / numOfRows);
};

//3. li 를 생성하는 함수
const redirectToURL = (event) => {
  const item = event.currentTarget.dataset.item;
  if (item.url) {
    window.open(item.url, "_blank");
  }
};

const createElmLi = (item) => {
  let description = item.description
    ? item.description.length > 100
      ? item.description.substring(0, 100) + "..."
      : item.description
    : "내용 없음";

  return `
  <li>
          <p class= "title" > ${item.title}</p>
          <p class = "rights"> ${item.rights}</p>
          <p class="desc">${description}</p>
          <p class="regDate">추천일 : ${item.regDate}</p>
        </li>
  `;
};

const addItems = async (items) => {
  items.map((item) => {
    const li = document.createElement("li");
    li.innerHTML = createElmLi(item);
    listCon.appendChild(li);
  });
};

// 1. API를 호출하여 데이터를 가져오는 함수를 만들어보세요.
const getLatestDatas = async (pageNo) => {
  const url = new URL(
    `http://api.kcisa.kr/openapi/service/rest/meta13/getNLSF0401?serviceKey=${API_KEY}&numOfRows=${numOfRows}&pageNo=${pageNo}`
  );
  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });
  const data = await response.json();
  console.log(data); // {response: {…}} 결과값이 나옴
  const items = data.response.body.items.item;

  totalItems = parseInt(data.response.body.totalCount);
  totalPages = calculateTotalPages(totalItems, numOfRows);

  listCon.innerHTML = "";
  console.log(items); // (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}] 배열로 된 데이터를 찾으세요.

  // 2. 가져온 데이터를 화면에 표시하는 함수를 만들어보세요.
  addItems(items);
  updatePagination();
};

// 하나의 item이 어떤 데이터를 가지고 있는지 확인해보세요.

getLatestDatas(pageNo);
