<script>
import Paginator from "primevue/paginator";
import {AuthService} from "../../../../public/services/auth.service.js";
import ProjectCard from "../components/project-card.component.vue";
import {ProjectService} from "../../../../public/services/project.service.js";
import {ProjectEntity} from "../../../shared/models/project.model.js";
import {HomeService} from "../../../../public/services/home.service.js";
import {CompanyExplorerEntity} from "../../../shared/models/companyExplorer.model.js";

export default{
  name: "search-project-list",
  components: {
    ProjectCard,
    'project-card': ProjectCard,
    'pv-paginator': Paginator
  },
  data() {
    return {
      projects: [],
      companyIds: [],
      company: [],
      first: 0,
      itemsPerPage: 3,
      authService: new AuthService(),
      projectService: new ProjectService(),
      homeService: new HomeService()
    }
  },
  computed: {
    paginatedDevelopers() {
      return this.projects.slice(this.first, this.first + this.itemsPerPage);
    }
  },
  created(){
    let idProject = localStorage.getItem('user id')
    this.projectService.getAllProjects().then((response) => {
      this.projects = response.map(project => new ProjectEntity({
        project_ID: project.id,
        nameProject: project.name,
        descriptionProject: project.description,
        enterprise_id: project.ownerId,
        budget: project.budget,
      }));

      this.companyIds = response.map(project => project.ownerId);
      this.companyIds.forEach(companyId => {


        this.homeService.getEnterpriseInfoByID(companyId).then( (response) =>{
          console.log(response, 'GET ENTERPRISE INFO BY ID');
          this.company.push(new CompanyExplorerEntity(
              response.data.id,
              response.data.enterpriseName,
              response.data.profileImgUrl,
              response.data.userId,
          ))
        })
      })
      console.log('Array:', this.company);
      console.log('Company:', this.companyIds);
    });
  },
  methods: {
    onPageChange(event) {
      this.first = event.first;
      this.itemsPerPage = event.rows;

    }
  }
}
</script>

<template>
  <div id="searchDev">
  <div v-if="company.length === projects.length" class="grid col-fixed justify-content-center gap-5 mt-8 mb-4">
    <project-card v-for="(project,index) in projects"
                    v-if="company"
                    :key="project.project_ID"
                    :project="project"
                    :company="company[index]"></project-card>
  </div>
  <pv-paginator :first="first" :rows="itemsPerPage" :totalRecords="projects.length"
                :rowsPerPageOptions="[5,10,20]" @page="onPageChange"></pv-paginator>
  </div>
</template>

<style scoped>
:deep(.p-paginator.p-component){
  background: transparent;
}
:deep(.p-paginator.p-component button){
  color: #ffffff;
}
:deep(.p-paginator-page.p-paginator-element.p-link.p-highlight){
  background: #bb0dbb;
}
:deep(.p-paginator-page.p-paginator-element.p-link:hover){
  background: rgba(187, 13, 187, 0.54);
}

#searchDev{
  min-height: 54vh;
}
</style>
