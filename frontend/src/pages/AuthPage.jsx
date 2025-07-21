import SignInForm from '../components/SignInForm';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../store";
import ChangePasswordForm from '../components/ChangePasswordForm';


const AuthPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex space-x-8">
        <SignInForm/>
        <ChangePasswordForm/> {/* TODO: Update styling */}
      </div>
    </div>
  );
};

export default AuthPage;