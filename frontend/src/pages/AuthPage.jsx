import SignInForm from '../components/SignInForm';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../store/authSlice";
import ChangePasswordForm from '../components/ChangePasswordForm';


const AuthPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignInForm/>
      <ChangePasswordForm/>  //need updated
    </div>
  );
};

export default AuthPage;