<script>
import { useRouter } from 'vue-router';
import { AuthService } from "../../../../public/services/auth.service.js";
import { HomeService } from "../../../../public/services/home.service.js";
import { ApplicantEntity } from "../../../shared/models/applicant.model.js";
import {CandidatesService} from "../../../../public/services/candidates.service.js";

export default {
  name: "projects-panel.component",
  emits: ["chooseDeveloper"],
  components: {},
  data() {
    return {
      homeService: new HomeService(),
      candidatesService: new CandidatesService(),
      position: 'center',
      visible: false,
      applicantsList: [],
      myProject: null,
      projectStateMap: {
        'LOOKING_FOR_DEVELOPERS': 'Looking for developers',
        'NOT_STARTED': 'Not started',
        'IN_PROCESS': 'In process',
        'COMPLETED': 'Completed',
      }
    };
  },
  methods: {
    //revisar si se queda por rendimiento. Es de O(n)
    async countApplicantsForProjects() {
      /*for (const project of this.projects) {
        if (project.stateProject === 'LOOKING_FOR_DEVELOPERS') {
          try {
            const candidates = await this.candidatesService.getAllCandidatesByProjectId(project.project_ID);
            project.applicantsCount = candidates.length;
          } catch (error) {
            console.error(`Error al contar aplicantes del proyecto ${project.project_ID}`, error);
            project.applicantsCount = 0;
          }
        }
      }*/
    },
    async openPosition(position, state, projectId) {
      if (state === 'LOOKING_FOR_DEVELOPERS') {
        this.myProject = projectId;
        this.position = position;
        this.visible = true;

        try {
          const candidates = await this.candidatesService.getAllCandidatesByProjectId(projectId);
          this.applicantsList = candidates.map(candidate => {
            return new ApplicantEntity(
                candidate.developerId,
                candidate.firstName,
                candidate.lastName,
                candidate.description,
                candidate.profile_img_url || 'https://cdn-icons-png.flaticon.com/512/3237/3237472.png'
            );
          });


        } catch (error) {
          console.error("Error al cargar postulantes:", error);
          this.applicantsList = [];
        }

      } else {
        this.$router.push('/deliverables-list');
      }
      console.log("Aplicants: ", this.applicantsList);
    },

    async chooseApplicant(applicant) {

      console.log("candidato: ", {
        developer_id: applicant.developer_id,
        project_id: this.myProject
      })

      try {
        await this.candidatesService.selectCandidate(this.myProject, applicant.developer_id);

        this.visible = false;


        const project = this.projects.find(p => p.project_ID === this.myProject);
        if (project) {
          project.stateProject = 'IN_PROCESS';
          project.applicantsCount = 0;
        }

        this.$emit("chooseDeveloper", {Applicant: applicant.developer_id, numberProjectId: this.myProject});

        console.log("Postulante elegido:", applicant);

      } catch (error) {
        console.error("Error al elegir postulante:", error);
      }
    },

    goToDeliverablesList(projectId) {
      this.$router.push(`/projects/${projectId}/Deliverables`);
    },

    goToDevProfile(applicant) {
      this.$router.push(`/developer-profile/${applicant}`);
    },

    // Método para verificar si `this.visible` es falso
    isVisibleFalse() {
      return !this.visible;
    },

    // Método para manejar los cambios en `visible`
    handleVisibilityChange(newValue) {
      if (!newValue) {
        this.applicantsList = []; // Vacía el array cuando el diálogo no es visible
      }
    },

    //Metodo para manejar el acceso a la lista de entregables
    handleProjectClick(projectID, state) {
      if (state === "IN_PROCESS"|| "COMPLETED") { // Solo si el estado es "IN_PROCESS" (valor 2)
        this.goToDeliverablesList(projectID);
      }
    },
  },
  watch: {
    visible(newValue) {
      this.handleVisibilityChange(newValue);
    }
  },
  props: {
    projects: {
      type: Array,
      required: true
    }
  },
  created() {
    this.projects.forEach(p => p.applicantsCount = 0);
    this.countApplicantsForProjects();

  }
};
</script>

<template>
  <pv-card>

    <template #title>
      <div class="projects-header">
        <h1 class="projects-title">{{ $t('projects-panel-enterprise-part1') }}</h1>
        <router-link to="/create-project">
          <pv-button
              class="new-project-button"
              :label="$t('projects-panel-new')"
          />
        </router-link>
      </div>
    </template>

    <template #content>
      <hr class="separator"/>
      <div v-if="projects && projects.length === 0" class="p-m-3">
        {{ $t('projects-panel-enterprise-empty') }}
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
          <div>

          </div>
          <div
              v-if="project.stateProject === 'LOOKING_FOR_DEVELOPERS'"
              class="candidates-container"
              @click.stop="openPosition('center', project.stateProject, project.project_ID)"
          >
            <p >
              {{ $t('projects-panel-enterprise-part2') }} {{ project.applicantsCount  }}
            </p>
          </div>
          <pv-progressbar v-else :value="Math.trunc(project.projectProgressBar)"/>
        </div>
      </div>
    </template>
  </pv-card>
  <div class="card">
    <pv-dialog v-model:visible="visible" :header="$t('projects-panel-enterprise-part3')"
               :style="{ width: '40rem', height: '100vh', display: 'block', overflow:'auto' }" :position="position"
               :modal="true" :draggable="false">
      <div v-if="applicantsList.length === 0">
        The project has no applicants yet.
      </div>

      <template class="applicants-list" v-for="(applicant) in this.applicantsList">
        <div class="project applicant">
          <div class="applicants-title">
            <pv-avatar :image="applicant.profile_img_url" class="mr-2" size="xlarge" shape="circle"/>

            <div class="developer-name-container" @click.stop="goToDevProfile(applicant.developer_id)">
              <h3 class="developer-name">{{ applicant.firstName + " " + applicant.lastName }}</h3>
              <span class="view-profile-text">
          <i class="pi pi-external-link mr-2"></i>
          Ver perfil
        </span>
            </div>
          </div>

          <div class="applicants-content">
            <p>{{ applicant.description }}</p>
            <pv-button class="choose-dev" @click="chooseApplicant(applicant)">{{
                $t('projects-panel-enterprise-part3')
              }}
            </pv-button>
          </div>
        </div>
      </template>

    </pv-dialog>
  </div>
</template>


<style scoped>
.project.applicant {
  height: 100%;
  margin:1rem;
  padding:1.5rem;
}

.applicants-title {
  height: 100%;
  transition: transform 0.2s ease;
}

.applicants-title:hover {
  transform: translateY(-3px);
}

.developer-name-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 1rem;
}

.developer-name {
  margin: 0;
  transition: color 0.3s ease, text-decoration 0.3s ease;
  font-size: 1.2rem;
  font-weight: bold;
}

.view-profile-text {
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 0.9rem;
  color: #b864f3;
  display: flex;
  align-items: center;
}

.applicants-title:hover .view-profile-text {
  opacity: 1;
}

.applicants-title:hover .developer-name {
  color: #b864f3;
  text-decoration: underline;
}

.choose-dev:hover {
  background: #B864F3;
}

.choose-dev{
  width: 100%;
  border:2px solid #3554BC;
}

.applicants-content{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.applicants-title{
  display:flex;
  flex-direction: row;
  gap:1rem;
  align-items: center;
  justify-content: flex-start;

  p{
    font-size: 1.2rem;
    font-weight: bold;
  }
}

.applicants-list {
  height: 100vh;
  display:flex;
  flex-direction: row;
}

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
  padding:1rem;
}

.project:hover {
  transform: scale(1.04, 1.04);
}

.tipo-proyecto {
  font-size: 0.8rem;
}

h4 {
  margin: 1px
}

.candidates-container {
  display:flex;
  justify-content: center;
  align-items: center;
  border:2px solid #a933ff;
  cursor:pointer;
  border-radius: 5px;
  margin:20px;
  font-weight: bold;
  color: #a933ff;
  background-color: #e5d6f3;
  height: 30px;

  p{
    padding:0 20px;
  }
}

.candidates-container:hover{
  background-color: #dfc2f4;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(53, 84, 188, 0.3);
}

:deep(.p-progressbar) {
  width: 80%;
  align-self: center;
  margin:auto;
  height: 10px;
}

:deep(.p-progressbar .p-progressbar-value) {
  background: linear-gradient(to right, #3554BC, #B864F3);
}

:deep(.p-dialog) {
  border-radius: 12px;
  background-color: #3554BC;
  display: block;
}

:deep(.p-rating .p-rating-item.p-rating-item-active .p-rating-icon) {
  color: gold;
}

:root(.p-dialog.p-component.p-ripple-disabled) {
  display: block !important;
}

:root(.p-dialog-content) {
  height: 100vh;
}

:deep(.p-button) {
  background: #3554BC;
  border: none;
}

.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6.5rem;
}

.projects-title {
  color: #3554BC;
  font-size: 1.5rem;
  margin: 0;
}

.new-project-button {
  background-color: #6B46C1;
  color: white;
  margin-left: 1px;
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