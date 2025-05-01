
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PerformanceChart = () => {
  const [timeRange, setTimeRange] = useState("month");
  
  // Sample data - in a real app, this would come from an API
  const monthlyData = [
    { date: 'Week 1', score: 75 },
    { date: 'Week 2', score: 68 },
    { date: 'Week 3', score: 80 },
    { date: 'Week 4', score: 85 },
    { date: 'Week 5', score: 72 },
    { date: 'Week 6', score: 88 },
  ];
  
  const weeklyData = [
    { date: 'Mon', score: 70 },
    { date: 'Tue', score: 75 },
    { date: 'Wed', score: 80 },
    { date: 'Thu', score: 65 },
    { date: 'Fri', score: 85 },
    { date: 'Sat', score: 90 },
    { date: 'Sun', score: 78 },
  ];
  
  const yearlyData = [
    { date: 'Jan', score: 65 },
    { date: 'Feb', score: 70 },
    { date: 'Mar', score: 75 },
    { date: 'Apr', score: 80 },
    { date: 'May', score: 85 },
    { date: 'Jun', score: 78 },
    { date: 'Jul', score: 82 },
    { date: 'Aug', score: 88 },
    { date: 'Sep', score: 75 },
    { date: 'Oct', score: 80 },
    { date: 'Nov', score: 85 },
    { date: 'Dec', score: 92 },
  ];
  
  const getData = () => {
    switch (timeRange) {
      case "week":
        return weeklyData;
      case "year":
        return yearlyData;
      default:
        return monthlyData;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Score Trends</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getData()}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              labelStyle={{ fontWeight: 'bold', color: '#333' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#8B5CF6" 
              strokeWidth={3} 
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
