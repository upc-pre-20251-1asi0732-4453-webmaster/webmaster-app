<script>

import {CompanyEntity} from "../../../shared/models/company.model.js";
import {DeveloperEntity} from "../../../shared/models/developer.model.js";
import {ProjectEntity} from "../../../shared/models/project.model.js";
import {CompanyExplorerEntity} from "../../../shared/models/companyExplorer.model.js";

export default {
  name: "project-card",
  components: {},
  props: {
    project: {
      type: ProjectEntity,
      required: true
    },
    company: {
      type: CompanyExplorerEntity,
      required: true
    }
  },
  methods: {
    redirectToProfile() {
      console.log('Company', this.company);

      if (!this.company || !this.company.enterprise_id) {
        console.error('No se encontró ID de empresa válido:', this.company);
        return;
      }

      localStorage.setItem('enterprise id', this.company.enterprise_id);
      this.$router.push({
        name: 'enterprise-profile',
        params: {id: this.company.enterprise_id},
        state: {company: this.company}
      });
    },

    redirectToPostulate() {
      localStorage.setItem('project id', this.project.project_ID)
      this.$router.push({
        name: 'postulate-project',
        params: {project_id: this.project.project_ID},
        state: {project: this.project, company: this.company}
      });
    }
  },
  created() {
    console.log('Company:', this.company);
  }
}

</script>

<template>
  <pv-card class="w-8 border-round-3xl shadow-4 card mb-4" aria-label="Developer Card">
    <template #header>
      <div class="flex flex-row align-items-center mt-4 header-container" aria-label="Header Section">
        <div class="flex align-items-center ml-3 flex-wrap company-section">
          <pv-avatar :image="company.profile_img_url" class="mr-3 mt-2" size="xlarge" shape="circle"
                     aria-label="Developer Avatar"/>
          <div class="company-name-container" @click="redirectToProfile">
            <h3 class="company-name" aria-label="Company Name">{{ company.enterprise_name }}</h3>
            <span class="view-profile-text">
              <i class="pi pi-user mr-2"></i>
              See Profile
            </span>
          </div>
        </div>

        <div class="project-section">
          <div class="project-name-container" @click="redirectToPostulate">
            <h3 class="project-name">{{ project.nameProject }}</h3>
            <span class="view-profile-text">
              <i class="pi pi-external-link mr-2"></i>
              See Details
            </span>
          </div>
        </div>
      </div>
    </template>
    <template #title aria-label="Card Title">Description</template>
    <template #content aria-label="Card Content">
      <p class="m-0">{{ project.descriptionProject }}</p>
      <h2>Budget</h2>
      <p>S/. {{ project.budget }}</p>
    </template>
  </pv-card>
</template>

<style scoped>
.header-container {
  position: relative;
  width: 100%;
}

.company-section {
  width: auto;
  flex-shrink: 0;
}

.project-section {
  position: absolute;
  left: 60%;
  transform: translateX(-60%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  z-index: 1;
}

.company-name-container,
.project-name-container {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 1rem;
}

.company-name,
.project-name {
  margin: 0;
  transition: color 0.3s ease, text-decoration 0.3s ease;
  font-size: 1.4rem;
}

.view-profile-text {
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 0.9rem;
  color: #b864f3;
  display: flex;
  align-items: center;
}

.company-name-container:hover .view-profile-text,
.project-name-container:hover .view-profile-text {
  opacity: 1;
}

.card {
  transition: transform 0.3s ease;
  cursor: pointer;
  padding: 0.5rem;
}

.card:hover {
  transform: translateY(-5px);

  .company-name, .project-name {
    color: #b864f3;
    text-decoration: underline;
  }

  .view-profile-text {
    opacity: 1;
  }
}

@media (max-width: 1200px) {
  .header-container {
    position: static;
    display: flex;
    flex-direction: column;
    gap: 1rem;

  }

  .company-section {

    justify-content: center;
  }

  .project-section {
    position: static;
    left: auto;
    transform: none;
    align-items: center;
    justify-content: center;
    width: 70%;
  }

  .view-profile-text {
    display: none;
  }

  .company-name,
  .project-name {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .company-name,
  .project-name {
    font-size: 1rem;
  }
}

</style>
