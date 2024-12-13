
import { IoMdArrowDropright } from "react-icons/io";
import { Link } from "react-router-dom";

const Server = () => {
  return (
    <div className="w-full h-16 flex items-center justify-center relative">
      <Link to={"/channel"}>
        <img
          className="w-14 h-14 object-cover rounded-full cursor-pointer"
          src="https://preview.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=640&crop=smart&auto=webp&s=22ed6cc79cba3013b84967f32726d087e539b699"
          alt=""
        />
      </Link>

      <div className="text-white text-xl absolute left-[-5px] flex items-center justify-center">
        <IoMdArrowDropright />
      </div>
    </div>
  );
};

export default Server;
