<script>
export default {
  name:"footer-webmaster"
}
</script>

<template>
  <!-- Desktop Layout -->
  <pv-toolbar class="bg-black-alpha-90 w-full mt-5 hidden md:flex">
    <template #start>
      <div class="flex align-items-center gap-2" style="max-width: 400px;">
        <img src="https://imgur.com/8o8Veec.jpg" alt="" class="w-3rem h-3rem border-round">
        <h4 class="text-white text-nowrap m-0">
          {{$t('footer-part1')}}
        </h4>
      </div>
    </template>
    <template #center>
      <div class="flex flex-column align-items-center justify-content-center gap-2">
        <h1 class="text-white text-center m-0">{{$t('footer-part2')}}</h1>
        <router-link to="/support">
          <pv-button class="bg-white text-black-alpha-90 font-semibold px-4 py-2">
            {{$t('footer-part3')}}
          </pv-button>
        </router-link>
      </div>
    </template>
    <template #end>
      <div class="flex flex-column align-items-center justify-content-center gap-2">
        <div class="text-white text-xl font-medium">{{$t('footer-part4')}}</div>
        <div class="flex align-items-center gap-1">
          <pv-button label="" text plain class="border-circle w-3rem h-3rem background-icon hover:bg-white-alpha-20 transition-colors transition-duration-200">
            <i class="pi pi-twitter text-black-alpha-80" style="font-size: 1.4rem"></i>
          </pv-button>
          <pv-button label="" text plain class="border-circle w-3rem h-3rem background-icon hover:bg-white-alpha-20 transition-colors transition-duration-200">
            <i class="pi pi-instagram text-black-alpha-80" style="font-size: 1.4rem"></i>
          </pv-button>
          <pv-button label="" text plain class="border-circle w-3rem h-3rem background-icon hover:bg-white-alpha-20 transition-colors transition-duration-200">
            <i class="pi pi-facebook text-black-alpha-80" style="font-size: 1.4rem"></i>
          </pv-button>
        </div>
      </div>
    </template>
  </pv-toolbar>

  <!-- Mobile Layout -->
  <div class="bg-black-alpha-90 w-full mt-5 p-4 flex md:hidden">
    <div class="flex flex-column align-items-center justify-content-center gap-4 w-full">

      <div class="flex align-items-center justify-content-center gap-3">
        <img src="https://imgur.com/8o8Veec.jpg" alt="" class="w-2rem h-2rem border-round">
        <h4 class="text-white text-center m-0 text-sm">
          {{$t('footer-part1')}}
        </h4>
      </div>

      <div class="flex flex-column align-items-center justify-content-center gap-3 text-center">
        <h1 class="text-white text-center m-0 text-xl line-height-3">
          {{$t('footer-part2')}}
        </h1>
        <router-link to="/support">
          <pv-button class="bg-white text-black-alpha-90 font-semibold px-4 py-2 text-base">
            {{$t('footer-part3')}}
          </pv-button>
        </router-link>
      </div>

      <div class="flex flex-column align-items-center justify-content-center gap-3">
        <div class="text-white text-base font-medium text-center">
          {{$t('footer-part4')}}
        </div>
        <div class="flex align-items-center justify-content-center gap-2">
          <pv-button label="" text plain class="border-circle w-3rem h-3rem background-icon hover:bg-white-alpha-20 transition-colors transition-duration-200">
            <i class="pi pi-twitter text-black-alpha-80" style="font-size: 1rem"></i>
          </pv-button>
          <pv-button label="" text plain class="border-circle w-3rem h-3rem background-icon hover:bg-white-alpha-20 transition-colors transition-duration-200">
            <i class="pi pi-instagram text-black-alpha-80" style="font-size: 1rem"></i>
          </pv-button>
          <pv-button label="" text plain class="border-circle w-3rem h-3rem background-icon hover:bg-white-alpha-20 transition-colors transition-duration-200">
            <i class="pi pi-facebook text-black-alpha-80" style="font-size: 1rem"></i>
          </pv-button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.background-icon {
  background-color: #D9D9D9;
}

@media (max-width: 767px) {
  h1 {
    font-size: 1.25rem !important;
    line-height: 1.4;
  }

  h4 {
    font-size: 0.875rem !important;
  }
}

img {
  object-fit: cover;
}
</style>