import React from "react";
import { useQuery } from "react-query";
import { getProjectsApi } from "../api/projects";
import { getTasksByProjectidApi } from "../api/tasks";

export default function Analytics() {
  const { data: projects = [] } = useQuery("projects", getProjectsApi);

  // Function to calculate stats for each project
  const getProjectStats = async (projectId) => {
    const tasks = await getTasksByProjectidApi(projectId);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "done").length;
    const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    return { totalTasks, completedTasks, completionRate };
  };

  return (
    <div className="container">
      <h2>Project Analytics</h2>
      {projects.map((project) => (
        <div key={project._id} className="card">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div>
            {getProjectStats(project._id).then((stats) => (
              <div>
                <p>Total Tasks: {stats.totalTasks}</p>
                <p>Completed Tasks: {stats.completedTasks}</p>
                <p>Completion Rate: {stats.completionRate.toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
