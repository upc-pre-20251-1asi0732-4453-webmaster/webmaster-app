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
      developerRepository: null,
      homeService: new HomeService(),
      projectService: new ProjectService()
    }
  },
  created(){
    let id = this.$route.params.id;

    this.homeService.getEnterpriseInfoByID(id).then((response)=> {
      this.enterpriseProfile = new CompanyEntity(
          response.data.enterprise_name,
          response.data.profile_img_url,
          response.data.description,
          response.data.country,
          response.data.ruc,
          response.data.phone,
          response.data.website,
          response.data.sector,
          response.data.User
      );
      console.log(this.enterpriseProfile);

      localStorage.setItem('profile img', this.enterpriseProfile.profile_img_url);
    }).catch((error) => {
      console.error("Error en la solicitud:", error);
    });
    this.projectService.getProjectByEnterprise(id).then((response) => {
      this.developerRepository = response;
      console.log(response);
    });
  },
  methods(){

  },
}
</script>

<template>
  <div class="flex justify-content-evenly flex-wrap mb-5" v-if="enterpriseProfile">
    <enterprise-profile-card :enterprise="enterpriseProfile"/>
    <enterprise-project-card :projects="developerRepository"/>
  </div>
</template>

<style scoped>
.main-container{
  display:flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-bottom: 6rem;
}
</style>
