/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tab } from "./Tabs";
import { AddTaskDialog } from "./AddTaskDialog";
import api from "@/utils/api";

const Task = () => {
  useEffect(() => {
    let res = api.get("/project/getProject").then((res)=>{
      console.log(res)
    }).catch(err=>{
      console.log(err);
      
    })
  }, []);
  return (
    <div className="taskContainer">
      <div className="taskHeaderContainer grid grid-cols-3">
        <div className="taskTitle col-span-2">
          <p className="text-black font-bold">Tasks</p>
          <p className="text-gray-500">
            Manage and track your tasks efficiently
          </p>
        </div>
        <div className="addTaskButton col-span-1 flex justify-end">
          <AddTaskDialog />
        </div>
      </div>
      <div className="taskListContainer">
        <Tab />
      </div>
    </div>
  );
};

export default Task;
