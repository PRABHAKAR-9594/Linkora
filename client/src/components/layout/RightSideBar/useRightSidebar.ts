import { useCurrentUserQuery, useUserFriendsQuery } from "@/hooks/api/useUser";
import { useState } from "react";

export const useRightSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const { data: currentUser } = useCurrentUserQuery();
  const { data } = useUserFriendsQuery(currentUser._id);
  const friends = data?.data || [];

  const groups = ["Frances, Lori, ...", "Lawson, Knight"];

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return {
    isCollapsed,
    toggleCollapse,
    friends,
    groups,
  };
};
