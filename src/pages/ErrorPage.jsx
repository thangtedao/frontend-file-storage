import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
      <div className="text-center bg-white shadow-lg rounded-2xl p-8 max-w-sm">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Oops!</h1>
        <p className="text-gray-600 mb-6">
          Something went wrong. Please try again later.
        </p>
        <button
          onClick={() => navigate("/files")}
          className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-200 transition"
        >
          Home Page
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
