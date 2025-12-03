import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EditProfileForm from "../components/EditProfileForm";
import DeleteAccount from "../components/DeleteAccount";
import SessionManagement from "../components/SessionManagement";

export default function SettingsPage() {
  return (
    <div className="w-full sm:max-w-5xl mx-auto p-2 sm:p-6">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-y-2 sm:p-2 rounded-lg">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="delete">Delete</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <EditProfileForm />
        </TabsContent>

        <TabsContent value="account">
          <SessionManagement />
        </TabsContent>

        <TabsContent value="notifications">
          {/* <Notifications /> */}
        </TabsContent>

        <TabsContent value="delete">
          <DeleteAccount />
        </TabsContent>
      </Tabs>
    </div>
  );
}
