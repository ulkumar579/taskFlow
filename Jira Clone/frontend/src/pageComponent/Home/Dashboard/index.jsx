import React from "react";
import {
  CheckCircle2,
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  Menu,
  X,
  InboxIcon,
  Dot,
} from "lucide-react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  let listArr = [1, 2, 3, 4, 5, 6];

  const data = [
    {
      name: "Page A",
      uv: 400,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 300,
      pv: 4567,
      amt: 2400,
    },
    {
      name: "Page C",
      uv: 320,
      pv: 1398,
      amt: 2400,
    },
    {
      name: "Page D",
      uv: 200,
      pv: 9800,
      amt: 2400,
    },
    {
      name: "Page E",
      uv: 278,
      pv: 3908,
      amt: 2400,
    },
    {
      name: "Page F",
      uv: 189,
      pv: 4800,
      amt: 2400,
    },
  ];

  return (
    <div className="">
      <p className="text-2xl text-black font-medium">Welcome back, John!</p>
      <p className="text-sm text-gray-500">
        Here's what's happening today
      </p>{" "}
      <main className="">
        {/* {1st section} */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600 mt-1">Active Projects</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600 mt-1">Active Projects</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600 mt-1">Active Projects</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600 mt-1">Active Projects</div>
          </div>
        </div>

        {/* {2nd section} */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 ">
            <div className=" rounded-xl p-6 border border-gray-300">
              <div className="header">
                <p>Recent Activity</p>{" "}
              </div>
              <div className="">
                {listArr.map(() => {
                  return (
                    <>
                      <Item>
                        <ItemMedia>
                          <Dot />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>Default Variant</ItemTitle>
                          <ItemDescription>
                            Transparent background with no border.
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                      <Separator />
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-span-1 ">
            <div className=" rounded-xl p-6 border border-gray-300">
              <div className="header">
                <p>Recent Activity</p>{" "}
              </div>
              <div className="">
                {listArr.map(() => {
                  return (
                    <>
                      <Item>
                        <ItemMedia>
                          <Dot />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>Default Variant</ItemTitle>
                          <ItemDescription>
                            Transparent background with no border.
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                      <Separator />
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="w-full col-span-1">
            <div className="rounded-xl p-6 border border-gray-300">
              <LineChart
                style={{ width: "100%", aspectRatio: 1.618, maxHeight: 400 }}
                responsive
                data={data}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 5,
                  left: 0,
                }}
              >
                <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
                <Line
                  type="monotone"
                  dataKey="uv"
                  stroke="purple"
                  strokeWidth={2}
                  name="My data series name"
                />
                <XAxis dataKey="name" />
                <YAxis
                  width="auto"
                  label={{ value: "UV", position: "insideLeft", angle: -90 }}
                />
                <Legend align="right" />
                <Tooltip />
              </LineChart>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
