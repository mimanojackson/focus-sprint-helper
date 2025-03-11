
import React from "react";
import { useTimer } from "@/context/TimerContext";
import { formatDate, formatTotalTime, calculateTotalFocusTime } from "@/utils/timerUtils";
import { Trash2, Clock, Calendar, Brain, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

const History = () => {
  const { sessions, clearHistory } = useTimer();
  const totalMinutes = calculateTotalFocusTime(sessions);
  const sessionsCount = sessions.filter(s => s.type === "focus" && s.completed).length;

  return (
    <div className="max-w-md mx-auto py-4 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Session History</h1>
        <p className="text-muted-foreground">Track your focus progress over time</p>
      </div>

      {/* Stats summary */}
      <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm mb-1 flex items-center">
              <Clock size={14} className="mr-1" />
              Total Focus Time
            </span>
            <span className="text-2xl font-medium">
              {formatTotalTime(totalMinutes)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm mb-1 flex items-center">
              <Calendar size={14} className="mr-1" />
              Sessions Completed
            </span>
            <span className="text-2xl font-medium">{sessionsCount}</span>
          </div>
        </div>
      </div>

      {/* Clear history button */}
      {sessions.length > 0 && (
        <div className="flex justify-end mb-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-muted-foreground">
                <Trash2 size={14} className="mr-2" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear session history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Your entire session history will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearHistory}>
                  Clear History
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Session list */}
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <Alert>
            <AlertDescription>
              You haven't completed any focus sessions yet. Start a session to track your progress!
            </AlertDescription>
          </Alert>
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id} 
              className="bg-card rounded-lg shadow-sm p-4 transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    {session.type === "focus" ? (
                      <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center">
                        <Brain size={12} className="mr-1" />
                        Focus
                      </span>
                    ) : (
                      <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center">
                        <Coffee size={12} className="mr-1" />
                        Break
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(new Date(session.date))}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-medium">
                    {formatTotalTime(session.duration / 60)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
