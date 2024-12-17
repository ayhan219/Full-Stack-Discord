
const FriendChat = () => {
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">Friends</h2>
        <div className="mt-4 space-y-2">
          <div className="cursor-pointer p-2 hover:bg-gray-700 rounded-lg">John Doe</div>
          <div className="cursor-pointer p-2 hover:bg-gray-700 rounded-lg">Jane Smith</div>
          <div className="cursor-pointer p-2 hover:bg-gray-700 rounded-lg">Michael Lee</div>
          <div className="cursor-pointer p-2 hover:bg-gray-700 rounded-lg">Sarah Connor</div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-900 text-white">
        {/* Chat Header */}
        <div className="p-4 bg-gray-800">
          <h3 className="text-lg font-semibold">Chat with John Doe</h3>
        </div>

        {/* Chat Messages */}
        <div className="h-[calc(100vh-200px)] overflow-y-auto p-4">
          <div className="mb-4">
            <p className="bg-blue-500 text-white inline-block p-2 rounded-lg">
              <strong>You:</strong> Hello, how are you?
            </p>
          </div>
          <div className="mb-4">
            <p className="bg-gray-700 text-gray-300 inline-block p-2 rounded-lg">
              <strong>John Doe:</strong> I'm doing great, thanks for asking!
            </p>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 bg-gray-800">
          <div className="flex">
            <input
              type="text"
              className="flex-1 p-2 bg-gray-700 text-white rounded-lg outline-none"
              placeholder="Type a message..."
            />
            <button className="ml-2 p-2 bg-blue-500 rounded-lg text-white">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendChat;
