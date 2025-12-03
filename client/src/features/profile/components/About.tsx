import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

const About: React.FC<{ user: any }> = ({ user }) => {
  return (
    <Card className="border-border shadow-lg">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-3 text-foreground">About</h2>

        <p className="text-muted-foreground text-sm">
          {user?.about || "No bio added yet."}
        </p>

        <div className="text-sm text-foreground space-y-2 mt-4">
          {user?.dob && (
            <p>
              <strong>Born:</strong> {new Date(user.dob).toDateString()}
            </p>
          )}
          
          <p className="flex gap-2 items-center">
            <Mail className="h-4 w-4 text-primary" />
            {user?.email}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default About;
