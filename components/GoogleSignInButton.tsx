// components/GoogleSignInButton.js
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const GoogleSignInButton = () => {
  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center justify-center w-full p-4 border border-gray-300 rounded-md hover:bg-gray-50"
    >
      <FcGoogle size={24} className="mr-2" />
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;
