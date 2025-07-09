<script>
import {CompanyEntity} from "../../../shared/models/company.model.js";

export default {
  name: "enterprise-profile-card",
  data() {
    return {
      categories: ['Country', 'RUC', 'Phone', 'Web Page', 'Sector'],
      categoryTexts: [],
    }
  },
  props: {
    enterprise: {
      type: CompanyEntity,
      required: true
    }
  },
  watch: {
    enterprise: {
      handler: 'updateCategoryTexts',
      immediate: true,
    },
  },
  methods: {
    updateCategoryTexts() {
      if(this.enterprise){
        this.categoryTexts = [
          this.enterprise.country,
          this.enterprise.RUC,
          this.enterprise.phone,
          this.enterprise.website,
          this.enterprise.sector
        ];
        console.log(this.categoryTexts);
        console.log(this.enterprise);
      }
    }
  }
}
</script>

<template>

  <pv-card aria-label="Developer Card">
    <template #title>
      <div class="flex align-items-center gap-4" aria-label="Developer Information">
        <pv-avatar :image="enterprise.profile_img_url" class="mr-2" size="xlarge" shape="circle" aria-label="Developer Avatar" />
        <div aria-label="Developer Name and Rating">
          <p>{{enterprise.enterprise_name}}</p>
        </div>

      </div>
    </template>

    <template #content>
      <hr aria-label="Separator Line">
      <div class="subtitle" aria-label="Summary Title">Resumen</div>
      <div class="editable-container" aria-label="Developer Description">
        <p>{{enterprise.description}}</p>
      </div>

      <template v-for="(category, index) in categories" :key="index">

        <div class="editable-container secondary mb-3" aria-label="Category Information">
          <div class="subtitle">{{ category }}</div>
          <span class="editable-text">{{ categoryTexts[index] }}</span>
        </div>
      </template>


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

.p-card {
  width: 30rem;
  min-width: 20rem;
  box-shadow: 0 20px 40px rgb(57, 57, 57);
  margin-top: 4rem;
  max-height: 800px;
}
:deep(.p-card-title) {
  display: flex;
  align-items: center;
  margin: 20px 20px 0 20px;
  justify-content: center;
}
:deep(.p-avatar) {
  display: flex;
  justify-content: center;
}
img {
  min-width: 64px;
}

:deep(.p-card-content) {
  margin: 0 20px;
}
:deep(.p-rating .p-rating-item.p-rating-item-active .p-rating-icon) {
  color: gold;
}
.subtitle {
  color: #64748b;
}

.editable-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.editable-text{
  word-wrap: break-word;
}
.editable-text,
.editable-input {
  flex-grow: 1;
  border: none;
}

.editable-input{
  border: none;
  border-bottom: 1px solid black;
  outline: none;
  font-family: inherit;
  resize: none;
  overflow: hidden;
  word-wrap: break-word;
  min-height: 1.2rem;
}

:deep(.p-inputtext) {
  box-shadow: 0 0 #0000, 0 0 #0000, 0 0 0 0 rgba(18, 18, 23, 0.05) !important;
  padding: 0 !important;
  border-radius: 0px;

}

span{
  max-width: 90%;
}

.edit-button {
  padding: 6px;
  height: 100%;
}
:deep(.p-button.p-button-text) {
  background-color: transparent;
  color: #B864F3;
  border-color: transparent;
}
.secondary{
  display:grid;
  grid-template-columns: 10fr 10fr 1fr;
}

</style>