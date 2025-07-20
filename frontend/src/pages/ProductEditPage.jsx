import ProductForm from "../components/ProductForm";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../store/authSlice";

const ProductEditPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <ProductForm productId={id} />
    </div>
  );
};

export default ProductEditPage;