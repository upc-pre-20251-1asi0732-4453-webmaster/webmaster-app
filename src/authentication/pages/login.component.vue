<script >
import LoginCard from "../components/login-card.component.vue";
import {AuthService} from "../../../public/services/auth.service.js";

export default {
  name: "login",
  components: {LoginCard},
  data(){
    return{
      authService: new AuthService(),
      users:[],
      loggedId:0,
      userType:'',
      errorMessage:''
    }
  },
  methods:{
    navigateToHome() {
      this.saveUserToLocalStorage(this.loggedId,this.userType);
      this.$router.push(`/main/${this.userType}/${this.loggedId}`);
    },
    saveUserToLocalStorage(id, type) {
      const idJSON = id;
      const typJSON =(type);
      const tokenJSON = this.token;

      localStorage.setItem('user id', idJSON);
      localStorage.setItem('user type', typJSON);
      localStorage.setItem('token', tokenJSON);
    },
    async handleLogin(userData) {
      this.user = userData.Mail;
      this.password = userData.Password;

      try {
        const response = await this.authService.authenticate(this.user, this.password);
        console.log(response);

        this.loggedId = response.id;
        const role = response.roles[0];
        this.userType = role === "ROLE_ENTERPRISE" ? "enterprises" :
            role === "ROLE_DEVELOPER" ? "developers" :
                role === "ROLE_ADMIN" ? "admins" : null;
        this.token = response.token;

        this.saveUserToLocalStorage(this.loggedId, this.userType, this.token);
        this.navigateToHome();
      } catch (error) {
        console.log("Usuario no encontrado");
        this.errorMessage = "Usuario o contraseña incorrectos";
      }
    },
  }
}
</script>

<template>

  <login-card @login="handleLogin" :error-message="errorMessage"/>

</template>

<style scoped>
:deep(body){
  background-color: #F5F5F5 !important;
}
</style>