

const PrivateChat = () => {
  return (
    <div className="flex items-start gap-3 mb-4">
    <img
      className="w-8 h-8 rounded-full object-cover"
      src="https://sabalawfirm.org/wp-content/uploads/2022/05/default-profile.png"
      alt="Sender"
    />
    <div className="flex flex-col">
      <div className="bg-[#40444B] text-white p-3 rounded-lg max-w-xs">
        <p>Hello! How are you?</p>
      </div>
      <span className="text-xs text-gray-500 mt-1">12:30 PM</span>
    </div>
  </div>
  )
}

export default PrivateChat
