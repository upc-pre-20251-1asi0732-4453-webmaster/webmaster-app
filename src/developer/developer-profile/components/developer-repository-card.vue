<script>
export default {
  name: "developer-repository-card",
  data(){
    return {

    }
  },
  props: {
    projects:{
      type: Array,
      required: true
    },
  },
  created(){
    console.log(this.projects, 'projects, developer repository');
  }

}
</script>

<template>
  <pv-card aria-label="Projects card">
    <template #title> <p  style="color: #3554BC" aria-label="Projects Title">{{$t('developer-repository-card-part1')}}</p></template>
    <template #content>
      <hr aria-label="Separator Line">
      <div class="project-container" aria-label="Project Container">
        <template v-if="projects" class="project-list" v-for="project in projects" aria-label="Project Item">
          <div class="project bg-blue-100" aria-label="Project Information">
            <h4>{{project.title}}</h4>
          </div>
        </template>
        <template v-else aria-label="No Projects Message">
          <div class="project bg-gray-100" aria-label="Placeholder Project">
            No Projects
          </div>
        </template>
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

:deep(.p-card-content) {
  margin: 0 20px;
  height: 90%;
}

:deep(div.p-card-content){
  display: block;
  justify-content: center;
  overflow: auto;
  height: auto;
  max-height: 680px;
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
  overflow-y: auto;
  height: auto;
  max-height: 650px;
}
.project-container {
  max-height: 600px;
  overflow-y: auto;
}
.project{
  border-radius: 15px;
  box-shadow: 0 2px 4px rgb(197, 197, 197);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap:15px;
  text-align: center;
  margin: 10px;
  height: 120px;
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
