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
  methods: {
    goToDeliverablesList(projectId) {
      this.$router.push(`/projects/developers/${projectId}/deliverables`);
    },
    translateState(state) {
      const stateMap = {
        LOOKING_FOR_DEVELOPERS: "Pendiente de inicio",
        IN_PROCESS: "En desarrollo",
        ON_HOLD: "En pausa",
        COMPLETED: "Finalizado"
      };
      return stateMap[state] || "Estado desconocido";
    }
  }
};
</script>

<template>
  <pv-card class="projects-panel-card">
    <template #title>
      <h2 class="section-title">Mis Proyectos</h2>
    </template>

    <template #content>
      <div class="project-list">
        <pv-card
            v-for="project in projects"
            :key="project.project_ID"
            class="project-card"
            flat
        >
          <template #title>
            <div class="card-header">
              <span class="project-name">{{ project.nameProject }}</span>
              <span class="project-type">{{ project.type }}</span>
            </div>
          </template>

          <template #content>
            <p class="project-description">{{ project.descriptionProject }}</p>
            <div class="project-info">
              <span><strong>Presupuesto:</strong> ${{ project.budget }}</span>
              <span><strong>Estado:</strong> {{ translateState(project.stateProject) }}</span>
            </div>
            <div class="progress-section">
              <pv-progressbar :value="project.projectProgressBar" showValue />
            </div>
          </template>

          <template #footer>
            <pv-button
                label="Ver Detalles"
                icon="pi pi-arrow-right"
                @click="goToDeliverablesList(project.project_ID)"
                class="w-full"
            />
          </template>
        </pv-card>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.projects-panel-card {
  width: 30rem;
  min-width: 20rem;
  max-width: 30rem;
  height: 625px; /* Reducir la altura total */
  margin: 3.9rem auto; /* Reducir el margen superior e inferior */
  background: #f9fafb;
  box-shadow: 0 20px 40px rgb(57, 57, 57);
  border-radius: 12px;
}

.project-list {
  max-height: 450px; /* Reducir la altura máxima de la lista */
  overflow-y: auto;
  padding-right: 10px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem; /* Reducir el espacio entre las cards */
}

.project-card {
  padding: 0.1rem; /* Reducir el espacio interno */
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  margin-bottom: 1.5rem;
}


.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.project-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #0d47a1;
}

.project-type {
  background: #cbd5e1;
  color: #1f2937;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  font-size: 0.75rem;
}

.project-description {
  font-size: 0.95rem;
  color: #374151;
  margin-bottom: 0.8rem;
}

.project-info {
  font-size: 0.9rem;
  color: #4b5563;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.8rem;
}

.progress-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-section :deep(.p-progressbar) {
  width: 100%;
  max-width: 250px;
  height: 1rem;
}

.progress-section :deep(.p-progressbar .p-progressbar-value) {
  background: linear-gradient(to right, #3554BC, #B864F3);
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

@media (max-width: 640px) {
  .projects-panel-card {
    width: auto;
    margin: 2rem 1rem;
    padding: 1rem;
    height: 100vh;
  }

  .project-list {
    max-height: calc(100vh - 200px);
    gap: 1rem;
    padding-right: 5px;
  }
}
</style>