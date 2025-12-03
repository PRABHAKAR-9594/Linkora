import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  Bell,
  Settings,
  // Video,
  // MessageSquare,
  // Image,
  ChevronLeft,
  ChevronRight,
  Search,
  UserRoundCheck,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useLeftSidebar } from "./useLeftSidebar";

const items = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Explore", url: "/explore", icon: Search },
  // { title: "Chat", url: "/chat", icon: MessageSquare },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Friends", url: "/friendList", icon: Users },
  { title: "Groups", url: "/groups", icon: Users },
  // { title: "Photos", url: "/photos", icon: Image },
  // { title: "Video", url: "/videos", icon: Video },
  { title: "Profile", url: "/profile", icon: UserRoundCheck },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface LeftSidebarProps {
  isMobile?: boolean;
  mobileMenuOpen?: boolean;
  onClose?: () => void;
  onCollapse?: (v: boolean) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isMobile,
  mobileMenuOpen,
  onClose,
  onCollapse,
}) => {
  const { isCollapsed, toggleCollapse, location } = useLeftSidebar(onCollapse);

  const SidebarContent = () => (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCollapse}
        className="hidden sm:flex absolute top-4 right-3 rounded-full border bg-background shadow-md hover:bg-accent mr-2"
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </Button>

      {isCollapsed ? (
        /* Collapsed Mode */
        <div className="mt-16 flex flex-col items-center gap-4 px-2">
          {items.map(({ icon: Icon, url }, i) => {
            const isActive = location.pathname === url;
            return (
              <Link
                key={i}
                to={url}
                className={`w-full flex justify-center p-3 rounded-xl transition ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-accent text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </div>
      ) : (
        /* Expanded Mode */
        <div className="mt-16 p-4">
          <ul className="space-y-1">
            {items.map(({ icon: Icon, title, url }, i) => {
              const isActive = location.pathname === url;
              return (
                <li key={i}>
                  <Link
                    to={url}
                    className={`flex items-center gap-3 p-3 rounded-xl transition font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={mobileMenuOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-72 p-0 bg-card">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-card border-r border-border shadow-xl 
      transition-all duration-300 z-50 
      ${isCollapsed ? "w-20" : "w-56"}`}
    >
      <SidebarContent />
    </div>
  );
};

export default LeftSidebar;
