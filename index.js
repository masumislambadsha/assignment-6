const catagoryContainer = document.getElementById("catagoryContainer");
      const categoryContent = document.getElementById("categoryContent");
      const cartContainer = document.getElementById("cart-container");
      let currentTotal = 0;

      const manageSpinner = (status) => {
        if (status) {
          document.getElementById("spinner").classList.remove("hidden");
          document.getElementById("categoryContent").classList.add("hidden");
        } else {
          document.getElementById("spinner").classList.add("hidden");
          document.getElementById("categoryContent").classList.remove("hidden");
        }
      };

      // Update total
      const updateTotal = (amount) => {
        currentTotal += amount;
        document.getElementById("currentTotal").innerText = currentTotal;
      };

      // Add to Cart
      const addToCart = (name, price) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <div class="flex justify-between items-center my-2">
      <div>
        <h3 class="font-bold text-md">${name}</h3>
        <p>${price}</p>
      </div>
      <div>
        <p class="cursor-pointer remove-btn">❌</p>
      </div>
    </div>
  `;

  // Attach delete event only to ❌
  li.querySelector(".remove-btn").addEventListener("click", () => {
    removeFromCart(li, price);
  });

  cartContainer.appendChild(li);
  updateTotal(price);
};

      // Remove from cart
      const removeFromCart = (cartItem, price) => {
        cartItem.remove();
        updateTotal(-price);
      };

      // Load categories
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
          allLi.forEach((li) =>
            li.classList.remove("text-white", "bg-[#15803D]")
          );

          if (e.target.localName === "li") {
            e.target.classList.add("text-white", "bg-[#15803D]");
            loadCategoryContent(e.target.id);
          }
        });
      };

      const loadCategoryContent = (categoryId) => {
        manageSpinner(true);
        fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
          .then((res) => res.json())
          .then((data) => showCategoryContent(data.plants))
          .catch(console.error);
      };

      const showCategoryContent = (contents) => {
        categoryContent.innerHTML = "";
        contents.forEach((content) => {
          categoryContent.innerHTML += `
            <div class="card bg-base-100 w-[300px] shadow-sm mt-3">
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
                  <button onclick="addToCart('${content.name}', ${content.price})" class="btn btn-bg w-full rounded-3xl">Add to Cart</button>
                </div>
              </div>
            </div>
          `;
        });
        manageSpinner(false);
      };

      // Load all plants by default
      const loadAllPlants = () => {
        fetch("https://openapi.programming-hero.com/api/plants")
          .then((res) => res.json())
          .then((data) => showCategoryContent(data.plants))
          .catch(console.error);
      };

      loadCategory();
      loadAllPlants();
