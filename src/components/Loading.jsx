import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <AiOutlineLoading3Quarters className="animate-spin text-4xl mb-10" />
    </div>
  );
};

export default Loading;
