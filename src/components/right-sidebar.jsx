import { useLocation } from "react-router";
import ForeroomRight from "./foreroom-right";
// import ChatsSidebar from "./chats-sidebar";

export default function RightSidebar() {
  const { pathname } = useLocation();
  function getRightSidebar() {
    switch (pathname) {
      case "/foreroom":
        return <ForeroomRight />;
      // case "/chats":
      //   return <ChatsSidebar />;
      default:
        return null;
    }
  }
  return <div>{getRightSidebar()}</div>;
}
