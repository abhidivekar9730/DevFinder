import { Link } from "react-router-dom";

interface ButtonChangeProps {
  text: string;
  navigate: string;
  text2: string;
}

const ButtonChange: React.FC<ButtonChangeProps> = ({ text, navigate,text2 }) => {
  return (
    <div className="flex gap-3">
      <p>{text}</p>
      <Link
        to={navigate}
        className="text-blue-500 underline hover:text-blue-700 transition duration-300"
      >
        {text2}
      </Link>
    </div>
  );
};

export default ButtonChange;
