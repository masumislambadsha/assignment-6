const catagoryContainer = document.getElementById('catagoryContainer')

const loadCategory = () =>{
  fetch('https://openapi.programming-hero.com/api/categories')
  .then(res => res.json())
  .then(data => displayCategory
    (data.categories))
}
const displayCategory = (categories) =>{
  catagoryContainer.innerHTML = ''
  categories.forEach(category => {
    console.log(category.category_name)
    catagoryContainer.innerHTML +=`
    <li onclick="" class="font-medium text-[16px] hover:text-white hover:bg-[#15803D] w-full py-2 px-[10px] rounded-lg"
            >
              ${category.category_name}
            </li>
    `
  });
}
loadCategory()
