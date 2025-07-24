import { useState } from 'react';
import SignInForm from '../components/SignInForm';
import SignUpForm from '../components/SignUpForm';
import ChangePasswordForm from '../components/ChangePasswordForm';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('signin');

  return (
    <div className="auth-page-container">
      <div className="auth-page-wrapper">
        {/* Tab Navigation */}
        <div className="auth-tab-navigation">
          <div className="auth-tab-container">
            <button
              onClick={() => setActiveTab('signin')}
              className={`auth-tab-button ${
                activeTab === 'signin' ? 'auth-tab-active' : 'auth-tab-inactive'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`auth-tab-button ${
                activeTab === 'signup' ? 'auth-tab-active' : 'auth-tab-inactive'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab('changepassword')}
              className={`auth-tab-button ${
                activeTab === 'changepassword' ? 'auth-tab-active' : 'auth-tab-inactive'
              }`}
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="auth-form-container">
          {activeTab === 'signin' && <SignInForm />}
          {activeTab === 'signup' && <SignUpForm />}
          {activeTab === 'changepassword' && <ChangePasswordForm />}
        </div>
      </div>
    </div>
  );
}