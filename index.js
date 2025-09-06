const catagoryContainer = document.getElementById("catagoryContainer");
const categoryContent = document.getElementById("categoryContent");

const loadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayCategory(data.categories))
    .catch(console.error);
};

const displayCategory = (categories) => {
  catagoryContainer.innerHTML = "";
  categories.forEach((category) => {
    catagoryContainer.innerHTML += `
      <li id="${category.id}" class="font-medium text-[16px] hover:text-white hover:bg-[#15803D] w-full py-2 px-[10px] rounded-lg">
        ${category.category_name}
      </li>
    `;
  });

  catagoryContainer.addEventListener("click", (e) => {
    const allLi = document.querySelectorAll("#catagoryContainer li");
    allLi.forEach((li) => li.classList.remove("text-white", "bg-[#15803D]"));

    if (e.target.localName === "li") {
      e.target.classList.add("text-white", "bg-[#15803D]");
      loadCategoryContent(e.target.id);
    }
  });
};

const loadCategoryContent = (categoryId) => {
  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then((res) => res.json())
    .then((data) => showCategoryContent(data.plants))
    .catch(console.error);
};

const showCategoryContent = (contents) => {
  categoryContent.innerHTML = "";
  contents.forEach((content) => {
    categoryContent.innerHTML += `
      <div onclick='loadImgDetail(${content.id})' class="card bg-base-100 w-[300px] shadow-sm mt-3">
        <figure>
          <img src="${content.image}" alt="${content.name}" />
        </figure>
        <div class="card-body">
          <h2 class="card-title font-semibold text-[17px] dark1">${content.name}</h2>
          <p class="font-normal text-[13px] dark1">${content.description}</p>
          <div class="flex justify-between my-4">
            <p class="green w-[86px]">
              <span class="bg-[#DCFCE7] px-3 py-2 rounded-2xl font-semibold text-[14px]">
                ${content.category}
              </span>
            </p>
            <p class="text-right font-semibold dark1 text-[14px]">${content.price}</p>
          </div>
          <div class="card-actions">
            <button class="btn btn-bg w-full rounded-3xl">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  });
};

const loadAllPlants = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => showCategoryContent(data.plants))
    .catch(console.error);
};
const loadImgDetail = (id) => {
const url =`https://openapi.programming-hero.com/api/plant/${id}`;
  fetch(url)
    .then(res => res.json())
    .then(details => {
      displayWordDetails(details.plants);
    });
};

const displayWordDetails = (plant) =>{
  const detailsBox = document.getElementById('details-container')
  document.getElementById("word_modal").showModal()

  detailsBox.innerHTML = `
   <div class="space-y-[32px] p-6 ">
        <h2 class="font-semibold text-4xl">
          ${plant.name}
        </h2>
        <img src="${plant.image}">
        <div>
        <p class="text-2xl font-semibold>
          <span class="text-2xl font-semibold">Category:</span> ${plant.category}
        </p>
        </div>
        <div class="space-y-3">
          <p class="text-2xl font-medium">
           <span class="text-2xl font-semibold">Price:</span> ${plant.price}
          </p>
        </div>
        <div class="space-y-3">
          <p class="text-2xl font-normal font-bangla text-gray-600">
          <span class="text-2xl font-semibold">Discription:</span> ${plant.description}</p>
        </div>
        </div>
      </div>
  `
}

loadCategory();
loadAllPlants();
