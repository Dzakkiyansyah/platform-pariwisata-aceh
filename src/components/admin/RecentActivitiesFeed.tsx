import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star, UserPlus, FileText, Newspaper } from "lucide-react";
import React from "react";

type Activity = {
  type: "review" | "new_user" | "new_manager" | "news";
  description: string;
  user_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

const ICON_MAP: Record<Activity["type"], React.ElementType> = {
  review: Star,
  new_user: UserPlus,
  new_manager: FileText,
  news: Newspaper,
};

export default async function RecentActivitiesFeed() {
  const supabase = createAdminClient();

  const { data: activities, error } = await supabase.rpc("get_recent_activities");

  if (error) {
    console.error("Error fetching recent activities:", error);
    return <p className="text-sm text-red-500">Gagal memuat aktivitas.</p>;
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center">
            Belum ada aktivitas terbaru.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Container scrollable dengan tinggi tetap */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          {activities.map((activity: Activity, index: number) => {
            const Icon = ICON_MAP[activity.type] ?? FileText;

            return (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">
                      {activity.user_name || "Sistem"}
                    </span>{" "}
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}