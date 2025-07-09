<script>
import {AuthService} from "../../../../public/services/auth.service.js";
import {CompanyEntity} from "../models/company.model.js";
import EnterpriseProjectCard from "../components/enterprise-project-card.component.vue";
import EnterpriseProfileCard from "../components/enterprise-profile-card.component.vue";
import {HomeService} from "../../../../public/services/home.service.js";
import {ProjectService} from "../../../../public/services/project.service.js";

export default {
  name: "enterprise-profile-page",
  components: {EnterpriseProfileCard, EnterpriseProjectCard},
  data() {
    return {
      enterpriseProfile: null,
      developerRepository: [],
      homeService: new HomeService(),
      projectService: new ProjectService(),
      projectsLoading: true
    }
  },
  created(){
    let id = this.$route.params.id;

    this.homeService.getEnterpriseInfoByID(id).then((response)=> {
      console.log('Response data:', response.data);
      this.enterpriseProfile = new CompanyEntity(
          response.data.enterpriseName,
          response.data.profileImgUrl,
          response.data.description,
          response.data.country,
          response.data.ruc,
          response.data.phone,
          response.data.website,
          response.data.sector,
          response.data.User
      );
      console.log(this.enterpriseProfile);

      if (this.enterpriseProfile.profileImgUrl) {
        localStorage.setItem('profile img', this.enterpriseProfile.profileImgUrl);
      }


    }).catch((error) => {
      console.error("Error en la solicitud:", error);
      this.loading = false;
    });

    this.projectService.getProjectByEnterprise(id).then((response) => {
      this.developerRepository = Array.isArray(response) ? response : [];
      console.log(response);
      this.projectsLoading = false;
    }).catch((error) => {
      console.error("Error al obtener proyectos:", error);
      this.developerRepository = [];
      this.projectsLoading = false;
    });
  },

  methods: {


  }
}
</script>

<template>
  <div class="main-container">
    <div class="flex justify-content-evenly flex-wrap mb-5">

      <div class="profile-card-container">
        <enterprise-profile-card v-if="enterpriseProfile" :enterprise="enterpriseProfile"/>
        <div v-else class="loading-card">
          <div class="loading-spinner" />
          <p class="loading-text">Loading profile...</p>
        </div>
      </div>


      <div class="projects-card-container">
        <enterprise-project-card v-if="!projectsLoading" :projects="developerRepository"/>
        <div v-else class="loading-card">
          <div class="loading-spinner" />
          <p class="loading-text">Loading projects...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  min-height: 100vh;
  padding: 1rem;
}

.profile-card-container,
.projects-card-container {
  display: flex;
  justify-content: center;
}

.loading-card {
  width: 30rem;
  min-width: 20rem;
  box-shadow: 0 20px 40px rgb(57, 57, 57);
  margin-top: 4rem;
  max-height: 800px;
  min-height: 620px;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.loading-text {
  color: #6b7280;
  font-size: 1rem;
  text-align: center;
  margin: 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 799px) {
  .loading-card {
    margin-top: 2rem;
  }
}
</style>
