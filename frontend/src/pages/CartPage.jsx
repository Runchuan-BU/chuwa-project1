import Cart from "../components/Cart";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../store/authSlice";

const CartPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="p-4">
      <Cart />
    </div>
  );
};

export default CartPage;