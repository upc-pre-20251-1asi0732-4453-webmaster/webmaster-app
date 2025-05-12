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
      this.$router.push(`/developer-profile/${this.developer.userId}`)
    }
  }
}

</script>

<template>

  <pv-card class="w-8 border-round-3xl shadow-4" aria-label="Developer Card">
    <template #header>
      <div class="flex flex-row justify-content-center mt-4 gap-5" aria-label="Header Section">
        <pv-avatar :image="developer.profileImgUrl" class="mr-2 mt-2" size="xlarge" shape="circle" aria-label="Developer Avatar" />
        <h3 @click="redirectToProfile" aria-label="Developer Name">{{developer.firstName + " " + developer.lastName}} </h3>
      </div>
    </template>
    <template #title aria-label="Card Title">{{$t('developer-card-part1')}}</template>
    <template #content aria-label="Card Content">
      <p class="m-0">{{developer.description}}</p>
    </template>
  </pv-card>


</template>

<style scoped>

</style>
