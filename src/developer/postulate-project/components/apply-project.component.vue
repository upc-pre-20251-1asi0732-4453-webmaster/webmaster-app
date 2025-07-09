<script>
import { ProjectService } from "../../../../public/services/project.service.js";
import { ProjectEntity } from "../../../shared/models/project.model.js";
import {CandidatesService} from "../../../../public/services/candidates.service.js";

export default {
  name: "apply-project",
  data() {
    return {
      showButtons: false,
      showBlurEffect: false,
      projectService: new ProjectService(),
      candidatesService: new CandidatesService(),
      developerId: localStorage.getItem("developer id"),
      projectId: localStorage.getItem("project id"),
    };
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasApplied() {
      return Array.isArray(this.project.candidates) &&
          this.project.candidates.some(
              (candidate) => candidate === this.developerId
          );
    }

  },
  methods: {
    async sendApplicant() {

      try{
        const response = await this.candidatesService.applyToAProject(this.projectId, this.developerId);
      }catch(error){
        console.log("error al enviar postulación: ", error);
        console.log("detalle del error:", error?.response?.data);
      }

    },
    showTemplate() {
      this.showBlurEffect = true;
      this.$confirm.require({
        group: "templating",
        header: "Confirmation",
        message: "¿Estás seguro de que quieres postular al proyecto?",
        icon: "pi pi-exclamation-circle",
        acceptIcon: "pi pi-check",
        rejectIcon: "pi pi-times",
        rejectClass: "p-button-outlined p-button-sm",
        acceptClass: "p-button-sm",
        rejectLabel: "Rechazar",
        acceptLabel: "Aceptar",
        accept: () => {
          this.sendApplicant();
          this.$toast.add({
            severity: "info",
            summary: "Confirmed",
            detail: "You have accepted",
            life: 3000,
          });
          this.showBlurEffect = false;
        },
        reject: () => {
          this.$toast.add({
            severity: "error",
            summary: "Rejected",
            detail: "You have rejected",
            life: 3000,
          });
          this.showBlurEffect = false;
        },
        onHide: () => {
          this.showBlurEffect = false;
        },
      });
    },
    checkProjectState() {
      if (this.project.stateProject === "Developing") {
        this.showButtons = true;
      } else {
        this.showButtons = false;
      }
    },
  },
  mounted() {
    this.checkProjectState();
  },
  created() {
    console.log("Project:", this.project);
  },
};
</script>

<template>
  <div class="project-container" :class="{ blur_effect: showBlurEffect }">
    <!-- Header Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="company-info">
          <div class="avatar-container">
            <pv-avatar
                :image="project.enterpriseUrlImage"
                class="company-avatar"
                size="xlarge"
                shape="circle"
            />
            <div class="avatar-ring"></div>
          </div>
          <div class="project-title-section">
            <h1 class="project-title">{{ project.nameProject }}</h1>
            <div class="project-status" v-if="showButtons">
              <span class="status-badge developing">En Desarrollo</span>
            </div>
          </div>
        </div>

        <div class="hero-actions" v-if="showButtons">
          <pv-button class="deliverable-btn" severity="contrast" outlined>
            <i class="pi pi-file-o mr-2"></i>
            {{ $t("apply-project-part1") }}
          </pv-button>
        </div>
      </div>
    </div>

    <!-- Description Section -->
    <div class="section description-section">
      <div class="section-header">
        <h2 class="section-title">
          <i class="pi pi-info-circle mr-2"></i>
          {{ $t("apply-project-part2") }}
        </h2>
      </div>
      <div class="description-content">
        <p class="description-text">{{ project.descriptionProject }}</p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Technologies Section -->
      <div class="section tech-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-code mr-2"></i>
            {{ $t("apply-project-part3") }}
          </h2>
        </div>

        <div class="tech-grid">
          <div class="tech-category">
            <h3 class="tech-subtitle">
              <i class="pi pi-desktop mr-2"></i>
              {{ $t("apply-project-part4") }}
            </h3>
            <div class="tech-tags">
              <span
                  v-for="(language, index) in project.languages"
                  :key="index"
                  class="tech-tag language-tag"
              >
                {{ language }}
              </span>
            </div>
          </div>

          <div class="tech-category">
            <h3 class="tech-subtitle">
              <i class="pi pi-cog mr-2"></i>
              Frameworks
            </h3>
            <div class="tech-tags">
              <span
                  v-for="(framework, index) in project.frameworks"
                  :key="index"
                  class="tech-tag framework-tag"
              >
                {{ framework }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget Section -->
      <div class="section budget-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-dollar mr-2"></i>
            {{ $t("apply-project-part5") }}
          </h2>
        </div>

        <div class="budget-content">
          <div class="budget-amount">
            <span class="currency">S/</span>
            <span class="amount">{{ project.budget }}</span>
          </div>
          <p class="budget-description">{{ project.budgetDescription }}</p>
        </div>
      </div>

      <!-- Methodologies Section -->
      <div class="section methodologies-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-sitemap mr-2"></i>
            {{ $t("apply-project-part7") }}
          </h2>
        </div>

        <div class="methodologies-content">
          <div
              v-for="(methodology, index) in project.methodologies"
              :key="index"
              class="methodology-item"
          >
            <div class="methodology-number">{{ index + 1 }}</div>
            <span class="methodology-text">{{ methodology }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="application-section">
      <div class="application-content">
        <div v-if="!hasApplied" class="apply-container">
          <h3 class="apply-title">Ready to be part of this project?</h3>
          <p class="apply-subtitle">
            Apply now and start working on this amazing project
          </p>
          <pv-button @click="showTemplate()" :label="$t('apply-project-part8')" class="apply-btn" size="large">
            <i class="pi pi-send mr-2"></i>
            <p>Send</p>
          </pv-button>
        </div>

        <div v-else class="already-applied">
          <div class="success-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <h3 class="success-title">You have already applied!</h3>
          <p class="success-message">
            Your application is being reviewed. We will contact you soon.
          </p>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <pv-confirm-dialog group="templating" class="custom-dialog">
      <template #message="slotProps">
        <div class="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
          <i :class="slotProps.message.icon" class="text-5xl text-primary-500"></i>
          <p>{{ slotProps.message.message }}</p>
        </div>
      </template>
    </pv-confirm-dialog>

    <pv-toast></pv-toast>
  </div>
</template>

<style scoped>
.project-container {
  width: 950px;
  max-width: 950px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

@media (max-width: 820px) {
  .project-container {
    width: 100%;
    max-width: 100%;
    margin: 0 1rem;
  }
}

.project-container.blur-effect {
  filter: blur(2px);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 3rem 2rem;
  color: #2d3748;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #e2e8f0;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grain' width='100' height='100' patternUnits='userSpaceOnUse'><circle cx='25' cy='25' r='1' fill='%23718096' opacity='0.05'/><circle cx='75' cy='75' r='1' fill='%23718096' opacity='0.03'/><circle cx='50' cy='10' r='0.5' fill='%23718096' opacity='0.05'/></pattern></defs><rect width='100' height='100' fill='url(%23grain)'/></svg>");
  pointer-events: none;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-container {
  position: relative;
}

.company-avatar {
  border: 4px solid #e2e8f0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.avatar-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid #cbd5e0;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.project-title-section h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: none;
  margin-bottom: 0.5rem;
  color: #1a202c;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 600;
  background: #e2e8f0;
  color: #4a5568;
  border: 1px solid #cbd5e0;
}

.hero-actions .deliverable-btn {
  background: white;
  border: 2px solid #e2e8f0;
  color: #4a5568;
  border-radius: 15px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.hero-actions .deliverable-btn:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Sections */
.section {
  margin: 2rem;
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.section:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-title {
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  margin: 0;
}

.section-title i {
  color: #b864f3;
}

.description-section {
  background: #f7fafc;
}

.description-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a5568;
  margin: 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 0 2rem;
}

.tech-section {
  background: white;
  border: 1px solid #e2e8f0;
}

.tech-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tech-category h3 {
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.language-tag {
  background: #4a5568;
  color: white;
}

.framework-tag {
  background: #718096;
  color: white;
}

.tech-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.budget-section {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
}

.budget-amount {
  display: flex;
  align-items: baseline;
  margin-bottom: 1rem;
}

.currency {
  font-size: 1.5rem;
  color: #4a5568;
  font-weight: 600;
}

.amount {
  font-size: 3rem;
  font-weight: 800;
  color: #2d3748;
  margin-left: 0.25rem;
}

.budget-description {
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.methodologies-section {
  grid-column: 1 / -1;
  background: white;
  border: 1px solid #e2e8f0;
}

.methodologies-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.methodology-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.methodology-item:hover {
  transform: translateX(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.methodology-number {
  width: 40px;
  height: 40px;
  background: #4a5568;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.methodology-text {
  color: #2d3748;
  font-weight: 500;
}

/* Application Section */
.application-section {
  background: #2d3748;
  padding: 3rem 2rem;
  text-align: center;
  color: white;
}

.apply-container h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.apply-container{
  display: flex;
  flex-direction: column;
  align-items: center;

}

.apply-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.apply-btn {
  background: white;
  color: #2d3748;
  border: none;
  width: 150px;
  font-size: 1rem;
  padding: 0;
  font-weight: 600;
  border-radius: 15px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;

}

.apply-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background: #f7fafc;
}

.already-applied {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.success-icon i {
  font-size: 4rem;
  color: #48bb78;
}

.success-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.success-message {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.custom-dialog .text-5xl {
  font-size: 5.5rem !important;
}

.custom-dialog .text-primary-500 {
  color: #4a5568 !important;
}

.custom-dialog .p-dialog-footer .p-button {
  margin: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.25rem;
  border-radius: 10px;
}

.custom-dialog .p-dialog .p-dialog-footer {
  justify-content: center;
}

.custom-dialog .p-button.p-button-outlined {
  border-color: #B864F3;
  background-color: transparent;
  color: #B864F3;
}

.custom-dialog .p-button {
  background: #b864f3;
  color: #ffffff;
  border-color: #b864f3;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .project-title-section h1 {
    font-size: 2rem;
  }

  .tech-grid {
    gap: 1.5rem;
  }

  .amount {
    font-size: 2.5rem;
  }

  .project-container {
    width: 100%;
    max-width: 100%;
    margin: 0 1rem;
  }
}
</style>