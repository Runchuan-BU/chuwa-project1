import ProductList from "../components/ProductList";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { fetchUserProfile } from "../store/authSlice";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="p-4">
      <ProductList />
    </div>
  );
};

export default Home;
