import ProductDetail from "../components/ProductDetail";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../store/authSlice";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="p-4">
      <ProductDetail productId={id} />
    </div>
  );
};

export default ProductPage;