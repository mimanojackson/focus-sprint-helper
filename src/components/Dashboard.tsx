
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useTimer } from "@/context/TimerContext";
import { calculateTotalFocusTime, formatTotalTime, getLast7DaysData, formatChartDate } from "@/utils/timerUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Activity, Clock, Calendar, BarChart2, PieChart as PieChartIcon, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { sessions, streak } = useTimer();
  const totalMinutes = calculateTotalFocusTime(sessions);
  const sessionsCount = sessions.filter(s => s.type === "focus" && s.completed).length;
  const last7DaysData = getLast7DaysData(sessions);
  
  // Calculate daily average
  const totalDaysWithSessions = last7DaysData.filter(day => day.focusMinutes > 0).length;
  const dailyAverage = totalDaysWithSessions > 0 
    ? last7DaysData.reduce((sum, day) => sum + day.focusMinutes, 0) / totalDaysWithSessions 
    : 0;
  
  // Format data for the charts
  const formattedDailyData = last7DaysData.map(day => ({
    date: formatChartDate(day.date),
    rawDate: day.date,
    minutes: Math.round(day.focusMinutes),
    sessions: day.sessionsCompleted,
  }));
  
  // Distribution by day of week
  const dayOfWeekData = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
  sessions.forEach(session => {
    if (session.type === "focus" && session.completed) {
      const day = new Date(session.date).getDay();
      dayOfWeekData[day] += session.duration / 60;
    }
  });
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const pieData = dayOfWeekData.map((value, index) => ({
    name: dayNames[index],
    value: Math.round(value),
  })).filter(item => item.value > 0);
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9370DB", "#FF6B6B", "#5E7CE2"];
  
  const chartConfig = {
    minutes: {
      label: "Focus Minutes",
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))",
      },
    },
    sessions: {
      label: "Sessions",
      theme: {
        light: "hsl(var(--primary) / 0.5)",
        dark: "hsl(var(--primary) / 0.5)",
      },
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Statistics Dashboard</h1>
        <p className="text-muted-foreground">Visualize your productivity metrics</p>
      </div>
      
      {/* Stats summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Total Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTotalTime(totalMinutes)}</div>
            <p className="text-xs text-muted-foreground">Across all sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Sessions Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionsCount}</div>
            <p className="text-xs text-muted-foreground">Total focused sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak.currentStreak} {streak.currentStreak === 1 ? 'day' : 'days'}</div>
            <p className="text-xs text-muted-foreground">Longest: {streak.longestStreak} {streak.longestStreak === 1 ? 'day' : 'days'}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Daily Activity
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Day Distribution
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Last 7 Days Focus Activity</CardTitle>
              <CardDescription>
                Average: {Math.round(dailyAverage)} minutes per active day
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-full w-full"
              >
                <BarChart data={formattedDailyData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-xs font-medium">Minutes</span>
                                <span className="font-bold text-xs">{payload[0].value}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium">Sessions</span>
                                <span className="font-bold text-xs">{payload[1].value}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="minutes"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                  <Bar
                    dataKey="sessions"
                    fill="hsl(var(--primary) / 0.5)"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary/50"
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Focus Time by Day of Week</CardTitle>
              <CardDescription>
                Distribution of your focus minutes across days
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value} min`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} minutes`, null]}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No data available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
