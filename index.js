const catagoryContainer = document.getElementById("catagoryContainer");
const categoryContent = document.getElementById("categoryContent");
const cartContainer = document.getElementById("cart-container");
const detailsContainer = document.getElementById("details-container");

const cartCount = document.getElementById("cartCount");
const cartDropdownItems = document.getElementById("cartDropdownItems");
const cartDropdownTotal = document.getElementById("cartDropdownTotal");

let currentTotal = 0;
let cartItems = [];

const manageSpinner = (status) => {
  if (status) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("categoryContent").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("categoryContent").classList.remove("hidden");
  }
};

const updateTotal = (amount) => {
  currentTotal += amount;
  document.getElementById("currentTotal").innerText = currentTotal;
};

const updateDropdown = () => {
  cartCount.innerText = cartItems.length;
  cartDropdownItems.innerHTML = "";
  if (cartItems.length === 0) {
    cartDropdownItems.innerHTML = `<li class="text-sm text-gray-500">No items in cart</li>`;
    cartDropdownTotal.innerText = 0;
    return;
  }
  cartItems.forEach((item, index) => {
    cartDropdownItems.innerHTML += `
    <li class="flex justify-between items-center">
      <div>
        <span>${item.name}</span>
        <span>${item.price}</span>
      </div>
      <div>
        <span class="cursor-pointer remove-btn" data-index="${index}">❌</span>
      </div>
    </li>
  `;
  });
  cartDropdownItems.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      const item = cartItems[idx];
      cartItems.splice(idx, 1);
      updateTotal(-item.price);
      updateDropdown();
      [...cartContainer.children]
        .find((li) => li.textContent.includes(item.name))
        ?.remove();
    });
  });

  let total = cartItems.reduce((sum, item) => sum + item.price, 0);
  cartDropdownTotal.innerText = total;
};

const loadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayCategory(data.categories));
};

const displayCategory = (categories) => {
  catagoryContainer.innerHTML = "";
  catagoryContainer.innerHTML += `
<li id="all" class="font-medium text-[16px] hover:text-white hover:bg-[#15803D] w-full py-2 px-[10px] rounded-lg text-white bg-[#15803D]">
All Categories
</li>
`;
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
      if (e.target.id === "all") {
        loadAllPlants();
      } else {
        loadCategoryContent(e.target.id);
      }
    }
  });
};

const loadCategoryContent = (categoryId) => {
  manageSpinner(true);
  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then((res) => res.json())
    .then((data) => displayCategoryContent(data.plants));
};

const displayCategoryContent = (contents) => {
  categoryContent.innerHTML = "";
  contents.forEach((content) => {
    categoryContent.innerHTML += `
<div onclick="loadImgDetail(${content.id})" class="card bg-base-100 w-[300px] shadow-sm mt-3 cursor-pointer">
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
<button onclick="event.stopPropagation(); addToCart('${content.name}', ${content.price})" class="btn btn-bg w-full rounded-3xl">
Add to Cart
</button>
</div>
</div>
</div>
`;
  });
  manageSpinner(false);
};

const loadImgDetail = (id) => {
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then((res) => res.json())
    .then((data) => displayImgDetails(data.plants));
};

const displayImgDetails = (plant) => {
  document.getElementById("word_modal").showModal();
  detailsContainer.innerHTML = `
<div class="space-y-[24px] p-6 w-full">
<h2 class="font-semibold text-2xl">${plant.name}</h2>
<img src="${plant.image}" class="w-full h-auto rounded-lg" />
<p><strong>Category:</strong> ${plant.category}</p>
<p><strong>Price:</strong> ${plant.price}</p>
<p><strong>Description:</strong> ${plant.description}</p>
<button onclick="addToCart('${plant.name}', ${plant.price})" class="btn btn-bg w-full rounded-3xl">
Add to Cart
</button>
</div>
`;
};

const addToCart = (name, price) => {
  const li = document.createElement("li");
  li.innerHTML = `
<div class="flex justify-between items-center my-2 gap-5">
<div>
<h3 class="font-bold text-md">${name}</h3>
<p>${price}</p>
</div>
<div>
<p class="cursor-pointer remove-btn">❌</p>
</div>
</div>
`;
  li.querySelector(".remove-btn").addEventListener("click", () => {
    removeFromCart(li, price, name);
  });
  cartContainer.appendChild(li);
  updateTotal(price);

  cartItems.push({ name, price });
  updateDropdown();
};

const removeFromCart = (cartItem, price, name) => {
  cartItem.remove();
  updateTotal(-price);
  cartItems = cartItems.filter(
    (item) => !(item.name === name && item.price === price)
  );
  updateDropdown();
};

const loadAllPlants = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => displayCategoryContent(data.plants));
};

loadCategory();
loadAllPlants();
