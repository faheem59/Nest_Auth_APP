import Navbar from '../../components/commonComponent/CommonNavbar';
import ProductCard from '../Product/ProductCard';
import './Home.scss';

const categories = [
  { name: "Electronics", subcategories: ["Mobile Phones", "Laptops", "Cameras"] },
  { name: "Appliances", subcategories: ["Refrigerators", "Washing Machines", "Microwaves"] },
  { name: "Toys", subcategories: ["Action Figures", "Board Games", "Dolls"] },
  { name: "Fashion", subcategories: ["Men's Wear", "Women's Wear", "Accessories"] },
  { name: "Furniture", subcategories: ["Sofas", "Beds", "Tables"] },
  { name: "Grocery", subcategories: ["Fruits", "Vegetables", "Snacks"] },
  { name: "SmartPhones", subcategories: ["Android", "iOS", "Feature Phones"] },
];

const categoryImages = [
  "https://rukminim2.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100",
  "https://rukminim2.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100",
  "https://rukminim2.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100",
  "https://rukminim2.flixcart.com/fk-p-flap/128/128/image/0d75b34f7d8fbcb3.png?q=100",
  "https://rukminim2.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100",
  "https://rukminim2.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png?q=100",
  "https://rukminim2.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100",
];

const Home = () => {
  return (
    <>
       <div className="container">
      <Navbar />
      <div className="categories-container">
        {categories.map((category, index) => (
          <div className="category-item" key={index}>
            <img src={categoryImages[index]} alt={category.name} />
            <span>{category.name}</span>
            <div className="subcategory-menu">
              {category.subcategories.map((subcategory, subIndex) => (
                <div className="subcategory-item" key={subIndex}>
                  {subcategory}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>
      <div className='product-list'>
        <ProductCard/>
      </div>
    </>
  );
};

export default Home;
