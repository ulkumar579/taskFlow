import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./appSidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "../Navbar";
import { useState } from "react";
import Dashboard from "./Dashboard";
import ProjectDetailPage from "./Project1/ProjectDetail";
import Task from "./Task";
import Project from "./Project1";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState(null);


  console.log("rendering")

  return (
    <>
      {/* <Navbar activeTab={activeTab} setActiveTab={setActiveTab} /> */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "projects" &&
          (selectedProject ? (
            <ProjectDetailPage
              project={selectedProject}
              onBack={() => setSelectedProject(null)}
            />
          ) : (
            <Project onProjectClick={setSelectedProject} />
          ))}
        {activeTab === "tasks" && <Task />}
      </main>
    </>
  );
}
