<script>
export default {
  name:"footer-webmaster"
}
</script>

<template>
  <!-- Desktop Layout -->
  <pv-toolbar class="mt-5 border-transparent px-7 py-4 support" style="background-color:#1E2B6F;">
    <template #start>
      <div class="flex flex-column text-white ">
        <h2 class=" m-0">{{$t('footer-part2')}}</h2>
        <p class=" m-0">{{$t('footer-final')}}</p>
      </div>

    </template>
    <template #center>

    </template>
    <template #end>
      <div class="flex flex-column align-items-center justify-content-center gap-2" >
        <router-link to="/support">
          <pv-button class=" flex flex-row gap-2 bg-white text-black-alpha-90 px-4 py-2 border-transparent support-button" style="text-decoration:none;">
            <i class="pi pi-comment"></i>
            {{$t('footer-part3')}}
          </pv-button>
        </router-link>
      </div>
    </template>


  </pv-toolbar>
  <pv-toolbar class="w-full hidden md:flex border-transparent px-7 py-4"  style="background-color:#1C2560">
    <template #start>
      <div class="flex align-items-center gap-4 foot" style="max-width: 700px;">
        <img src="https://i.imgur.com/DOPLKzN.png" alt="" class=" border-round" style="height:5rem; width:5rem;">
        <p class="text-white text-nowrap m-0  text-sm">
          {{$t('footer-part1')}}
        </p>
      </div>
    </template>

    <template #end>
      <div class="flex flex-row align-items-center justify-content-center gap-4 px-4">

        <div class="text-white text-xl font-medium">{{$t('footer-part4')}}</div>

        <div class="flex align-items-center justify-content-center gap-2">
          <pv-button label="" text plain class="border-circle w-3rem h-3rem background-icon hover:bg-white-alpha-20 transition-colors transition-duration-200">
            <i class="pi pi-twitter text-black-alpha-80 mr-2" style="font-size: 1rem"></i>
          </pv-button>
          <pv-button label="" text plain class="border-circle w-3rem h-3rem background-icon hover:bg-white-alpha-20 transition-colors transition-duration-200">
            <i class="pi pi-instagram text-black-alpha-80" style="font-size: 1rem"></i>
          </pv-button>
          <pv-button label="" text plain class="border-circle w-3rem h-3rem background-icon hover:bg-white-alpha-20 transition-colors transition-duration-200">
            <i class="pi pi-facebook text-black-alpha-80" style="font-size: 1rem"></i>
          </pv-button>
        </div>
      </div>
    </template>
  </pv-toolbar>

  <!-- Mobile Layout -->
  <div class="w-full p-4 flex md:hidden border-transparent  px-7 py-4" style="background-color:#1C2560;">
    <div class="flex flex-column align-items-center justify-content-center gap-4 w-full">

      <div class="flex align-items-start justify-content-center gap-3">
        <img src="https://i.imgur.com/DOPLKzN.png" alt="" class="w-2rem h-2rem border-round">
        <p class="text-white m-0 pr-2 text-sm">
          {{$t('footer-part1')}}
        </p>
      </div>

      <div class="flex flex-column align-items-center justify-content-center gap-3">
        <div class="text-white text-base font-medium text-center">
          {{$t('footer-part4')}}
        </div>
        <div class="flex align-items-center justify-content-center gap-2">
          <pv-button label="" text plain class="border-circle w-3rem h-3rem background-icon hover:bg-white-alpha-20 transition-colors transition-duration-200">
            <i class="pi pi-twitter text-black-alpha-80 mr-2" style="font-size: 1rem"></i>
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



@media (min-width: 1200px) {
  .foot {
    max-width: 400px;
  }

}

.background-icon {
  background-color: #D9D9D9;
}

@media (max-width: 767px) {

  .support{
    flex:1;
    flex-direction: column;
    align-items: start;
    justify-content: start;
  }

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