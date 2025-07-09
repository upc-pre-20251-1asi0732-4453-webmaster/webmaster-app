<script>
import { useRouter } from "vue-router";

export default {
  name: "projects-panel.component",
  props: {
    projects: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      projectStateMap: {
        'LOOKING_FOR_DEVELOPERS': 'Looking for developers',
        'NOT_STARTED': 'Not started',
        'IN_PROCESS': 'In process',
        'COMPLETED': 'Completed',
      }
    };
  },
  methods: {
    goToDeliverablesList(projectId) {
      this.$router.push(`/projects/developers/${projectId}/deliverables`);
    },
    translateState(state) {
      return this.projectStateMap[state] || "Estado desconocido";
    },
    handleProjectClick(projectID, state) {
      if (state === "IN_PROCESS" || state === "COMPLETED") {
        this.goToDeliverablesList(projectID);
      }
    }
  }
};
</script>

<template>
  <pv-card>
    <template #title>
      <div class="projects-header">
        <h1 class="projects-title">My projects</h1>
      </div>
    </template>

    <template #content>
      <hr class="separator"/>
      <div v-if="projects && projects.length === 0" class="p-m-3">
        No tienes proyectos asignados aún.
      </div>
      <div v-else class="project-list">
        <div
            v-for="project in projects"
            :key="project.project_ID"
            class="project"
            @click="handleProjectClick(project.project_ID, project.stateProject)"
        >
          <h4>{{ project.nameProject }}</h4>
          <p class="subtitle tipo-proyecto">
            {{ projectStateMap[project.stateProject] }}
          </p>

          <pv-progressbar :value="Math.trunc(project.projectProgressBar)"/>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
hr {
  opacity: 0.3;
}

@media (max-width: 799px) {
  .p-card {
    margin-top: 2rem;
  }
}

.p-card {
  width: 30rem;
  min-width: 20rem;
  box-shadow: 0 20px 40px rgb(57, 57, 57);
  margin-top: 4rem;
  max-height: 800px;
  min-height: 620px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.p-card-title) {
  display: flex;
  align-items: center;
  margin: 20px 20px 0 20px;
  justify-content: center;
}

:deep(.p-card-content) {
  margin: 0 20px;
  flex-grow: 1;
  overflow: hidden;
  max-height: 90%;
}

.subtitle {
  color: #64748b;
}

span {
  max-width: 90%;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 450px;
  overflow-y: auto;
  padding: 20px;
}

.project {
  background-color: #F0F0F0;
  box-shadow: 0 2px 4px rgb(197, 197, 197);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 150px;
  transition: transform 0.2s ease;
  cursor: pointer;
  flex-shrink: 0;
  padding: 1rem;
}

.project:hover {
  transform: scale(1.04, 1.04);
}

.tipo-proyecto {
  font-size: 0.8rem;
}

.project-description {
  font-size: 0.9rem;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0.5rem 0;
}

h4 {
  margin: 1px
}

:deep(.p-progressbar) {
  width: 80%;
  align-self: center;
  margin: auto;
  height: 10px;
}

:deep(.p-progressbar .p-progressbar-value) {
  background: linear-gradient(to right, #3554BC, #B864F3);
}

.projects-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.projects-title {
  color: #3554BC;
  font-size: 1.5rem;
  margin: 0;
}

.separator {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0.5rem 0 1rem;
}

.project-list::-webkit-scrollbar {
  width: 6px;
}

.project-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.project-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.project-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>