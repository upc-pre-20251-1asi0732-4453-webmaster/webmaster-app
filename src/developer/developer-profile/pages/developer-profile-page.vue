<script>
import DeveloperProfileCard from "../components/developer-profile-card.vue";
import {AuthService} from "../../../../public/services/auth.service.js";
import DeveloperRepositoryCard from "../components/developer-repository-card.vue";
import {HomeService} from "../../../../public/services/home.service.js";
import {ProjectService} from "../../../../public/services/project.service.js";

export default {
  name: "developer-profile-page",
  components: {DeveloperRepositoryCard, DeveloperProfileCard},
  data() {
    return {
      developerProfile: null,
      developerRepository: null,
      homeService: new HomeService(),
      projectService: new ProjectService()
    }
  },
  created() {
    let id = this.$route.params.id;
    console.log(id, "ID");
    this.homeService.getDevProfileByUserId(id).then((response) => {
      this.developerProfile = response.data;
    })

    console.log("projects");
    this.projectService.getProjectByDeveloper(id).then((response) => {
      console.log(response, "project response");
      if (response === null) {
        this.developerRepository = [];
        return;
      }
      this.developerRepository = response;
    });
    console.log(this.developerRepository);
  },
  methods() {

  },
}
</script>

<template>
  <div class="flex justify-content-evenly flex-wrap mb-5" v-if="developerProfile ">
    <developer-profile-card :developer="developerProfile"/>
    <developer-repository-card :projects="developerRepository"/>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-bottom: 6rem;
}
</style>
