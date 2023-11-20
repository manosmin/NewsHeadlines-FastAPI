const searchInput = document.getElementById("searchInput");
const countrySelect = document.getElementById("countrySelect");
const categorySelect = document.getElementById("categorySelect");
const sourcesSelect = document.getElementById("sourcesSelect");
const pageSizeSelect = document.getElementById("pageSizeSelect");
const searchButton = document.getElementById("searchButton");
const alertContainer = document.getElementById("alertContainer");
let currentAlert;
const validCategories = ["business", "entertainment", "general", "health", "science", "sports", "technology", ""]

const fetchNews = async () => {
  const query = searchInput.value.trim();
  const country = countrySelect.value;
  const category = categorySelect.value;
  const sources = sourcesSelect.value;
  const pageSize = parseInt(pageSizeSelect.value);
  console.log("Fetching News...");

  var url = `/headlines/?query=${query}&country=${country}&category=${category}&sources=${sources}&pageSize=${pageSize}`;
  var req = new Request(url);

  let a = await fetch(req);

  let response = await a.json();

  let str = "";
  resultCount.innerHTML = response.totalResults + " Results";
  for (let item of response.articles) {
    if (item.title != "[Removed]") {
      const publishedDate = new Date(item.publishedAt).toLocaleString("en-GB", {
        timeZone: "Europe/Athens",
      });
      if (item.description == null) {
        item.description = "";
      }
      if (item.source.id == null) {
        item.source.id = "";
      }
      if (item.urlToImage == null) {
        item.urlToImage = "static/placeholder.jpg";
      }
      str =
        str +
        `<div class="col-sm d-flex">
          <div class="card card-body flex-fill my-2" style="width: 20rem">
              <img src="${item.urlToImage}" class="card-img-top" alt="...">
              <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text">${publishedDate}</p>
              <p class="card-text">${item.source.id}</p>
              <p class="card-text">${item.description}</p>
              <a href="${item.url}" class="link-offset-2 link-underline link-underline-opacity-0" target="_blank" >Read More</a>
              </div>
          </div>
        </div>`;
    }
  }
  document.querySelector(".content").innerHTML = str;
};

document.addEventListener("DOMContentLoaded", () => {
  fetchNews();
});

searchButton.addEventListener("click", () => {
  removeAlertIfExists()
  if (pageSizeSelect.value === "") {
    showPageSizeAlert(1);
  } else if (parseInt(pageSizeSelect.value) < 20 || parseInt(pageSizeSelect.value) > 100) {
    showPageSizeAlert(2);
  } else if (
    searchInput.value === "" &&
    countrySelect.value === "" &&
    categorySelect.value === "" &&
    sourcesSelect.value === ""
  ) {
    showPageSizeAlert(3);
  } else if (!validCategories.includes(categorySelect.value)) {
    showPageSizeAlert(4);
  } else {
    fetchNews();
  }
});

function showPageSizeAlert(type) {
  removeAlertIfExists();
  const alertDiv = document.createElement("div");
  alertDiv.className = "alert alert-warning fade show";
  alertDiv.setAttribute("role", "alert");
  if (type == 1) {
    alertDiv.innerHTML = `
    <strong>Error!</strong> You should select a page size.
  `;
  } else if (type == 2) {
    alertDiv.innerHTML = `
    <strong>Error!</strong> You should select a page size between 20 and 100.
  `;
  } else if (type == 3) {
    alertDiv.innerHTML = `
    <strong>Error!</strong> You should select at least one search option.
  `;
  } else {
    alertDiv.innerHTML = `
    <strong>Error!</strong> You should select a category from: business, entertainment, general, health, sports, science, technology.
  `;
  }
  currentAlert = alertDiv;
  alertContainer.appendChild(alertDiv);
}

function removeAlertIfExists() {
  if (currentAlert) {
    currentAlert.parentNode.removeChild(currentAlert);
    currentAlert = null;
  }
}