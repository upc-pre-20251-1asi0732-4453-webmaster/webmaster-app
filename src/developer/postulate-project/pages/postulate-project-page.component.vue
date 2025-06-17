<script>
import ApplyProject from "../components/apply-project.component.vue";
import {ProjectService} from "../../../../public/services/project.service.js";
import {ProjectEntity} from "../../../shared/models/project.model.js";
import {HomeService} from "../../../../public/services/home.service.js";

export default {
  name: 'postulate-project-page',
  components: {ApplyProject},
  data() {
    return {
      projectService: new ProjectService(),
      homeService: new HomeService(),
      projectById: null,
      enterpriseData: null,
      myProject: null,
      project: null,
      company: null
    };
  },
  created() {
    let project_id = localStorage.getItem('project id');

    this.projectService.getProjectById(project_id).then((response) => {
      console.log(response, 'response');
      this.projectById = response;

      this.enterpriseId = response.ownerId;
      this.homeService.getEnterpriseInfoByID(this.enterpriseId).then((enterpriseResponse) => {
        this.enterpriseData = enterpriseResponse;
        console.log(this.enterpriseData, 'enterpriseData');
        console.log(this.enterpriseData.data.profileImgUrl, 'profileImgUrl');
        this.createProject();
      });
    });
  },
  methods: {
    createProject() {
      this.myProject = new ProjectEntity({
        project_ID:       this.projectById.id,
        nameProject:      this.projectById.name,
        descriptionProject:this.projectById.description,

        languages:  this.projectById.languages .map(l => l.name),
        frameworks: this.projectById.frameworks.map(f => f.name),

        candidates: this.projectById.candidatesList,

        budget:             this.projectById.budget,
        budgetDescription:  this.projectById.budgetDescription,

        enterpriseUrlImage: this.enterpriseData.data.profileImgUrl,

        methodologies: [ this.projectById.methodologies ],
        stateProject: this.projectById.state
      });
    }
  }
}
</script>

<template>
  <div class="page-wrapper">
    <div class="flex justify-content-center flex-wrap">
      <apply-project v-if="myProject" :project="myProject"/>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 80vh; /* Ajusta según el tamaño de tu footer */
  justify-content: center;
  padding: 2rem 1rem;
}
</style>
