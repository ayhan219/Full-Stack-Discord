

const ChannelMember = () => {
  return (
    <div className="flex items-center gap-4 p-2 px-4 rounded-md hover:bg-gray-700 hover:text-white cursor-pointer transition-all">
      {/* Avatar Container */}
      <div className="relative">
        <img
          className="w-10 h-10 rounded-full"
          src="https://i.pinimg.com/1200x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg"
          alt="Avatar"
        />
        <div
          className="w-3 h-3 rounded-full bg-green-500 border-2 border-gray-800 absolute right-0 bottom-0"
          title="Online"
        ></div>
      </div>

      {/* Username */}
      <h3 className="text-base font-medium text-gray-400">Ayhan</h3>
    </div>
  );
};

export default ChannelMember;
