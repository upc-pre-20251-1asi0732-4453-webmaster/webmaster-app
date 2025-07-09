<script>
import { useRouter } from 'vue-router';
import {AuthService} from "../../../../public/services/auth.service.js";
import {HomeService} from "../../../../public/services/home.service.js";

export default {
  name: "enterprise-project-card",
  components: {},
  data() {
    return {
      homeService: new HomeService(),
      position: 'center',
      visible: false,
      applicantsList: []
    };
  },
  methods: {

  },
  props:{
    projects:{
      type: Array,
      required: true
    }
  },
  created(){
    if (!Array.isArray(this.projects)) {
      console.warn('Projects prop is not an array:', this.projects);
    }
  }
}
</script>

<template>
  <pv-card>
    <template #title>
      <p style="color: #3554BC">Projects</p>
    </template>
    <template #content>
      <hr>
      <div v-if="projects && projects.length > 0" class="project-list">
        <div
            v-for="(project, index) in projects"
            :key="`project-${index}`"
            class="project"
        >
          <h4>{{ project.name || 'Sin nombre' }}</h4>
          <p class="subtitle tipo-proyecto">{{ project.type || 'Sin tipo' }}</p>
        </div>
      </div>
      <div v-else class="project bg-gray-100" aria-label="No Projects Message">
        No Projects
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
hr{
  opacity:0.3;
}

@media (max-width: 799px) {
  .p-card{
    margin-top:2rem;
  }
}

.p-card{
  width: 30rem ;
  min-width: 20rem;
  box-shadow: 0 20px 40px rgb(57, 57, 57);
  margin-top: 4rem;
  max-height: 800px;
  min-height: 620px;
  display: flex;
  flex-direction: column;
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

:deep(div.p-card-content){
  display: block;
  justify-content: center;
  overflow: auto;
  height: auto;
  max-height: 680px;
}

:deep(.p-card-content) {
  margin: 0 20px;
  height: 90%;
}

.subtitle {
  color: #64748b;
}

span{
  max-width: 90%;
}

.project-list {
  display: block;
  justify-content: center;
  overflow: auto;
  height: auto;
  max-height: 680px;

}
.project{
  background-color:#D9D9D9;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgb(197, 197, 197);
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;

  height: 120px;
  margin-bottom: 20px;
  transition: transform 0.2s ease;
}
.project:hover{
  cursor:pointer;
  transform: scale(1.04, 1.04);
}

.tipo-proyecto{
  font-size: 0.8rem;
}

h4{
  margin: 1px
}

.postulantes{
  margin-top: 10px;
  color: #3554BC
}

:deep(.p-progressbar){
  width: 70%;
  align-self: center;
  height: 30%;
  margin-top: 5px;
}

:deep(.p-progressbar .p-progressbar-value){
  background: linear-gradient(to right, #3554BC, #B864F3);
}

:deep(.p-dialog) {
  border-radius: 12px;
  background-color: #3554BC;
  display:block;
}

:deep(.p-rating .p-rating-item.p-rating-item-active .p-rating-icon) {
  color: gold;
}

:root(.p-dialog.p-component.p-ripple-disabled){
  display: block !important;
}

.project.applicant{
  height: 100%;
}
.applicants-list{
  height:100vh;
}
:root(.p-dialog-content){
  height: 100vh;
}

:deep(.p-button){
  background:#3554BC;
  border:none;
}


.choose-dev:hover{
  background: #B864F3;
}
</style>