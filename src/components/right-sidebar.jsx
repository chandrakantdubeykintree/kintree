import { useLocation } from "react-router";
import ForeroomRight from "./foreroom-right";
import FamilyMemberRight from "./family-member-right";
// import ChatsSidebar from "./chats-sidebar";

export default function RightSidebar() {
  const { pathname } = useLocation();

  function getRightSidebar() {
    switch (pathname.split("/")[1]) {
      case "foreroom":
        return <ForeroomRight />;
      case "family-member":
        return <FamilyMemberRight />;
      // case "/chats":
      //   return <ChatsSidebar />;
      default:
        return null;
    }
  }
  return <div>{getRightSidebar()}</div>;
}
