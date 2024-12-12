import discordPNG from "../assets/pngegg.png";
import Server from "./Server";

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
      <div className="w-full h-auto flex flex-col gap-3">
       <Server />
       <Server />
       <Server />
       <Server />
       <Server />
       <Server />
      </div>
    </div>
  );
};

export default Sidebar;
