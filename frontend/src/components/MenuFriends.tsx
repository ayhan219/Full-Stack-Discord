import React from "react";

const MenuFriends = () => {
  return (
    <div className="w-full h-14 flex items-center px-8 gap-3 cursor-pointer hover:bg-gray-400 ease-in-out duration-100 text-gray-400 hover:text-gray-800 hover:rounded-lg ">
      <div className="relative">
        <img
          className="w-11 h-11 rounded-full"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0zUQ_eRMwCKHAcmo9FNIK4ncsXxHnaxi7qQ&s"
          alt=""
        />
        <div className="w-3 h-3 rounded-full bg-green-700 absolute right-0 bottom-0"></div>
      </div>
      <div className=" font-semibold">
        <p>Ayhan Taha</p>
      </div>
    </div>
  );
};

export default MenuFriends;
