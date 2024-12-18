import Menu from "../components/Menu"
import { useUserContext } from "../context/UserContext"

const FriendChat = () => {

    const {activeMenu,setActiveMenu} = useUserContext();
  return (
    <div className="w-full h-screen flex bg-[#313338]">
      <Menu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
    </div>
  )
}

export default FriendChat
