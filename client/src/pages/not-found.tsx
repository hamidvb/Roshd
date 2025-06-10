import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { generalMessages } from "../lib/persian-utils";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50" dir="rtl">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">{generalMessages.notFoundTitle}</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            {generalMessages.notFoundHint}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
