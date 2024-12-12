import discordPNG from "../assets/pngegg.png";

type SidebarInterface = {
  setActiveChannel: (activeChannel: string) => void;
  activeChannel: string;
};

const Sidebar = ({ setActiveChannel, activeChannel }: SidebarInterface) => {
  return (
    <div className="w-20 h-screen bg-[#1E1F22] flex flex-col  pt-4 space-y-4">
      <div
        className={`relative flex items-center justify-center cursor-pointer ${
          activeChannel === "home" ? "group" : ""
        }`}
        onClick={() => setActiveChannel("home")}
      >
        <div
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r-lg bg-white transition-all duration-300 ${
            activeChannel === "home" ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        <img
          className="w-12 h-12 object-cover rounded-full"
          src={discordPNG}
          alt="Discord Icon"
        />

        <div className="absolute bottom-0 right-3 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
          <p className="text-white text-xs font-bold">7</p>
        </div>
      </div>
      <div className="w-full h-auto flex justify-center">
        <div className="w-[60%] h-[0.15rem] bg-[#35363C]"></div>
      </div>

      {/* server area */}
      <div className="w-full h-auto">
        <div className="w-full h-16 flex items-center justify-center relative">
          <img className="w-14 h-14 object-cover rounded-full cursor-pointer" src="https://preview.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=640&crop=smart&auto=webp&s=22ed6cc79cba3013b84967f32726d087e539b699" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
