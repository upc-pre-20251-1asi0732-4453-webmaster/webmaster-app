<script>

import {DeveloperEntity} from "../../../shared/models/developer.model.js";

export default {
  name: "developer-card",
  components: {},
  props: {
    developer: {
      type: Object,
      required: true
    },
  },
  methods: {
    redirectToProfile() {
      //console.log(this.developer.user.user_id)
      //localStorage.setItem('developer id', this.developer.user.user_id)
      this.$router.push(`/developer-profile/${this.developer.id}`)
    }
  }
}

</script>

<template>
  <pv-card class="w-8 border-round-3xl shadow-4 card mb-4 p-3" aria-label="Developer Card" @click="redirectToProfile">
    <template #header>
      <div class="flex flex-row justify-content-center mt-4 gap-5" aria-label="Header Section">
        <pv-avatar :image="developer.profileImgUrl" class="mr-2 mt-2 " shape="circle" aria-label="Profile picture" />
        <div class="developer-name-container" aria-label="Developer Name">
          <h3 class="developer-name">{{developer.firstName + " " + developer.lastName}}</h3>
          <span class="view-profile-text">
            <i class="pi pi-external-link mr-2"></i>
            See Profile
          </span>
        </div>
      </div>
    </template>
    <template #title aria-label="Card Title">{{$t('developer-card-part1')}}</template>
    <template #content aria-label="Card Content">
      <p class="m-0">{{developer.description}}</p>
    </template>
  </pv-card>
</template>

<style scoped>
.developer-name-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 1rem;
}

.developer-name {
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


.developer-name-container:hover .view-profile-text {
  opacity: 1;
}

.card {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.card:hover{
  transform: translateY(-5px);

  .developer-name {
    color: #b864f3;
    text-decoration: underline;
  }
  .view-profile-text {
    opacity: 1;
  }
}


</style>
