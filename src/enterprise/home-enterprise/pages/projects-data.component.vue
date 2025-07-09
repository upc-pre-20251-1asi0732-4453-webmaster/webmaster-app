<script>
import { ref, onMounted } from "vue";
import ProjectsPanelComponent from "../components/projects-panel.component.vue";
import { ProjectService } from "../../../../public/services/project.service.js";
import { ProjectEntity } from "../../../shared/models/project.model.js";

export default {
  name: "projects-list",
  components: { ProjectsPanelComponent },
  setup() {
    const myProjects = ref([]);
    const projectService = new ProjectService();

    const loadProjects = async () => {
      const entId = localStorage.getItem("user id");
      console.log('Cargando proyectos para la empresa con ID:', entId);
      if (!entId) return;
      try {
        let list = await projectService.getProjectByEnterprise(entId);
        // filtramos los type === 0

        myProjects.value = list.map(p => new ProjectEntity({
          project_ID:         p.id,
          nameProject:        p.name,
          descriptionProject: p.description,
          stateProject:       p.state,
          projectProgressBar: p.progress,
          enterprise_id:      p.enterprise,
          developer_id:       p.developerId  || null,
          applicantsList:     p.candidates || [],
          type:               p.type,
          budget:             p.budget,
          methodologies:      p.methodologies,
        }))
        console.log("Proyectos cargados:", myProjects.value);
      } catch (err) {
        console.error("No se pudieron cargar los proyectos:", err.response?.data || err);
      }
    };

    onMounted(loadProjects);


    return { myProjects };
  }
};
</script>

<template>
  <div v-if="myProjects">
    <ProjectsPanelComponent
        :projects="myProjects"
    />
  </div>
</template>
